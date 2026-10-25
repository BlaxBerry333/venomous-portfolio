import * as Stage from "@/ui/shared/stage";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { lazy, Suspense, useMemo } from "react";
import { Color } from "three";
import { StyleMeter } from "./StyleMeter";
import { CHARACTERS, type CharacterId } from "./characters";
import type { Heat } from "./heat";
import { CAMERA_Z, type StrokeColors } from "./strokes";
import { useImpact, type ImpactSignal } from "./useImpact";
import type { StyleSignal } from "./useStyle";

const SceneRebellion = lazy(() =>
  import("@/ui/themes/dmc/dante/Rebellion").then((m) => ({ default: m.Rebellion })),
);
const SceneYamato = lazy(() =>
  import("@/ui/themes/dmc/vergil/Yamato").then((m) => ({ default: m.Yamato })),
);

const SCENE_BACKDROP_FRAGMENT = `
uniform vec3 uBg;
uniform vec3 uSmoke;
uniform vec3 uAccent;
uniform float uHeat;
uniform float uSurge;
uniform float uCold;
${Stage.GLSL_NOISE}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float t = uTime;
  vec3 col = uBg;

  vec3 q = vec3(p * 1.8 + vec2(sin(t * 0.04) * 0.4, cos(t * 0.03) * 0.3 - uScroll * 0.5), sin(t * 0.02) * 0.9);
  float s = clamp(stageFbm(q) * 0.5 + 0.5, 0.0, 1.0);
  float mask = smoothstep(0.3, -0.6, p.y) + smoothstep(0.5, 1.0, length(p)) * 0.6;
  col = mix(col, uSmoke, pow(s, 1.6) * mask * 0.9);
  col += uAccent * pow(s, 4.0) * mask * 0.35;

  float pulse = 0.5 + 0.5 * sin(t * 1.9);
  col += uAccent * (0.03 + 0.03 * pulse) * smoothstep(0.4, 1.1, length(p));

  float heat = smoothstep(0.25, 1.0, uHeat);
  if (heat > 0.0 || uSurge > 0.0) {
    float phase = fract(t * 0.3);
    vec2 fq = p * vec2(2.6, 1.4);
    fq.x += sin(p.y * 4.0 + t * 1.3) * 0.12;
    float morph = sin(t * 0.4) * 0.6;
    float fa = stageFbm3(vec3(fq - vec2(0.0, phase * 1.8), morph));
    float fb = stageFbm3(vec3(fq - vec2(0.0, fract(phase + 0.5) * 1.8) + vec2(5.2, 1.7), morph));
    float flame = clamp(mix(fa, fb, abs(phase * 2.0 - 1.0)) * 0.5 + 0.5, 0.0, 1.0);
    float rise = smoothstep(0.35, -0.8, p.y);
    vec3 ember = mix(
      mix(uAccent, vec3(1.0, 0.18, 0.22), 0.45),
      mix(uAccent, vec3(0.75, 0.95, 1.0), 0.35),
      uCold
    );
    col += ember * pow(flame, 2.6) * rise * heat * 0.6;
    float devil = smoothstep(0.92, 1.0, uHeat);
    float beat = 0.5 + 0.5 * sin(t * 6.0);
    col += uAccent * devil * (0.05 + 0.07 * beat) * smoothstep(0.2, 1.0, length(p));
    col += uAccent * uSurge * 0.4;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function ScenePost({ mobile, impact }: { mobile: boolean; impact: ImpactSignal }) {
  const tier = Stage.useTier();
  const composer = Stage.useComposerSize();
  const { aberration, effect } = useImpact(impact);
  const effects = [
    <primitive key="impact" object={effect} />,
    <Bloom
      key="bloom"
      mipmapBlur
      levels={mobile || tier > 1 ? 4 : tier === 1 ? 5 : 6}
      intensity={mobile ? 0.8 : 1.05}
      luminanceThreshold={0.3}
      luminanceSmoothing={0.2}
      radius={0.75}
    />,
    <ChromaticAberration
      key="aberration"
      offset={aberration}
      radialModulation
      modulationOffset={0.4}
    />,
    <ToneMapping key="tone" mode={ToneMappingMode.ACES_FILMIC} />,
    <Vignette key="vignette" offset={0.2} darkness={0.9} />,
  ];
  if (tier === 0) effects.push(<SMAA key="smaa" />);
  return (
    <EffectComposer ref={composer} multisampling={0}>
      {effects}
    </EffectComposer>
  );
}

export function Scene({ character }: { character: CharacterId }) {
  const hero = CHARACTERS[character];
  const { mobile, reducedMotion } = Stage.useQuality();
  const input = Stage.useInput();
  const styleSignal = useMemo<StyleSignal>(() => ({ frozen: false, points: 0, heat: 0 }), []);
  const impact = useMemo<ImpactSignal>(() => ({ shake: 0, aberration: 0, glitch: 0 }), []);
  const heat = useMemo<Heat>(() => ({ uHeat: { value: 0 }, uSurge: { value: 0 } }), []);
  const background = useMemo(() => new Color(hero.colors.background), [hero]);
  const trailColors = useMemo<StrokeColors>(
    () => ({ accent: new Color(hero.colors.accent), hot: new Color(hero.colors.hot) }),
    [hero],
  );
  const phantomColors = useMemo<StrokeColors>(
    () => ({ accent: new Color(hero.colors.spark), hot: trailColors.hot }),
    [hero, trailColors],
  );
  const backdropUniforms = useMemo(
    () => ({
      uBg: { value: background },
      uSmoke: { value: new Color(hero.colors.smoke) },
      uAccent: { value: trailColors.accent },
      uCold: { value: character === "vergil" ? 1 : 0 },
      ...heat,
    }),
    [background, hero, character, trailColors, heat],
  );
  return (
    <>
      <Stage.Canvas
        background={background}
        reducedMotion={reducedMotion}
        input={input}
        cameraPosition={[0, 0, CAMERA_Z]}
      >
        <Stage.ScreenShader
          fragmentShader={SCENE_BACKDROP_FRAGMENT}
          uniforms={backdropUniforms}
          input={input}
          reducedMotion={reducedMotion}
        />
        <Suspense fallback={null}>
          {character === "vergil" ? (
            <SceneYamato
              input={input}
              reducedMotion={reducedMotion}
              colors={trailColors}
              styleSignal={styleSignal}
              impact={impact}
              heat={heat}
              phantomColors={phantomColors}
            />
          ) : (
            <SceneRebellion
              input={input}
              reducedMotion={reducedMotion}
              colors={trailColors}
              styleSignal={styleSignal}
              impact={impact}
              heat={heat}
            />
          )}
        </Suspense>
        <ScenePost mobile={mobile} impact={impact} />
      </Stage.Canvas>
      <StyleMeter reducedMotion={reducedMotion} signal={reducedMotion ? undefined : styleSignal} />
    </>
  );
}
