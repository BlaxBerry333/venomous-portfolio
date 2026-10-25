import * as Stage from "@/ui/shared/stage";
import { Bloom, EffectComposer, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useMemo, type ReactNode } from "react";
import { Vector2, Vector3, type Color, type IUniform } from "three";
import { FlashDriver, type FlashCycle } from "./FlashDriver";
import { TiltDriver } from "./TiltDriver";
import { ClearingDriver, GLSL_CLEARING, useClearing } from "./useClearing";
import { GLSL_PRESS, PressDriver, type PressRef } from "./usePress";

export const CLOUD_CORE = new Vector2(0.36, 0.06);

const SCENE_RESOLUTION: readonly Stage.ScreenResolution[] = [
  { scale: 0.75, sharpen: 0.15 },
  { scale: 0.8, sharpen: 0.2 },
  { scale: 0.6, sharpen: 0.35 },
];

const SCENE_FLASHES: readonly FlashCycle[] = [
  { rate: 0.21, phase: 0.3, sharpness: 30, jitter: 41, seed: 1 },
  { rate: 0.16, phase: 2.1, sharpness: 30, jitter: 33, seed: 3 },
  { rate: 0.27, phase: 4.4, sharpness: 36, jitter: 57, seed: 5 },
];

const GLSL_CLOUD = `
struct WarhammerCloud {
  vec2 d;
  float r;
  float part;
  float flash;
  float light;
  float shadow;
  float transmit;
  float shaft;
  float coreGlow;
  float coreHot;
  float densF;
  float densM2;
  float densM3;
  float densM0;
  float densM;
  float litM;
  float edgeM;
  float densN0;
  float densN;
  float litN;
  float edgeN;
  float dm;
  float dn;
  vec4 clr;
};

vec2 warhammerRotate(vec2 d, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * d.x - s * d.y, s * d.x + c * d.y);
}

vec2 warhammerSwirl(vec2 d, float t) {
  float r = length(d);
  float a = atan(d.y, d.x);
  float ring = 0.45 + 0.07 * sin(a * 2.0 + t * 0.06) + 0.04 * cos(a * 3.0 - t * 0.04);
  float edge = (r - ring) / 0.24;
  float band = (0.6 + 0.15 * sin(t * 0.05)) * exp(-edge * edge);
  float ang = (0.36 + sin(t * 0.07) * 0.15 + cos(t * 0.043) * 0.1) * exp(-r * 1.1) + band;
  return warhammerRotate(d, ang);
}

vec2 warhammerView(vec2 p, float z, mat3 cam, vec3 eye) {
  vec3 ray = cam * vec3(p, 1.0);
  return (eye.xy + ray.xy * ((z - eye.z) / ray.z)) / (z + 1.0);
}

float warhammerCloud(vec2 q, float scale, float z, float seed, float roll) {
  vec3 p = vec3(q * scale, z + seed);
  vec2 w = warhammerRotate(vec2(stageFbm3(p + vec3(0.0, 0.0, 1.7)), stageFbm3(p + vec3(5.2, 1.3, 0.0))), roll);
  return stageFbm(p + vec3(w * 1.35, 0.0));
}

float warhammerCloudCheap(vec2 q, float scale, float z, float seed) {
  return stageFbm3(vec3(q * scale, z + seed));
}

float warhammerDensity(float n, float lo, float hi) {
  return pow(smoothstep(lo, hi, n), 0.8);
}

float warhammerLit(vec2 q, vec2 toLight, float scale, float z, float seed) {
  float here = warhammerCloudCheap(q, scale, z, seed);
  float toward = warhammerCloudCheap(q + toLight * 0.09, scale, z, seed);
  return clamp(0.5 + (here - toward) * 3.5, 0.0, 1.0);
}
`;

function sceneFragment(mobile: boolean, glsl: string): string {
  const marchSteps = mobile ? 3 : 6;
  return `
uniform vec3 uFlash1;
uniform vec3 uFlash2;
uniform vec3 uFlash3;
${Stage.GLSL_NOISE}
${GLSL_CLEARING}
${GLSL_CLOUD}
${glsl}
${GLSL_PRESS}

vec2 warhammerLayer(vec2 p, vec2 push, float z, mat3 cam, vec3 eye) {
  float k = exp(-max(z, 0.0) * 2.5);
  return warhammerView(warhammerPressDisturb(p - push * k, k), z, cam, eye);
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float t = uTime;
  vec2 ang = uPointer * vec2(0.14, -0.1);
  float ca = cos(ang.x);
  float sa = sin(ang.x);
  float cb = cos(ang.y);
  float sb = sin(ang.y);
  mat3 cam = mat3(ca, 0.0, -sa, 0.0, 1.0, 0.0, sa, 0.0, ca) * mat3(1.0, 0.0, 0.0, 0.0, cb, sb, 0.0, -sb, cb);
  vec3 eye = cam * vec3(0.0, 0.0, -1.0);
  warhammerPrepare(p);
  vec2 core = vec2(${CLOUD_CORE.x.toFixed(2)}, ${CLOUD_CORE.y.toFixed(2)});
  WarhammerCloud c;
  c.d = warhammerView(p, 0.1, cam, eye) - core;
  vec2 dF = warhammerLayer(p, vec2(0.0), 0.8, cam, eye) - core;
  c.r = length(c.d);
  c.part = warhammerPressPart(p);
  vec2 drift = vec2(sin(t * 0.12) * 0.55 + cos(t * 0.06) * 0.35, cos(t * 0.09) * 0.45);
  float dz = sin(t * 0.05) * 1.0 + cos(t * 0.03) * 0.5 + uScroll * 1.8;
  float litFade = smoothstep(0.02, 0.2, c.r);
  float roll = sin(t * 0.3) * 0.45 + cos(t * 0.17) * 0.25;

  float df = warhammerCloudCheap(warhammerSwirl(dF, t) * 0.55 + drift * 0.5, 1.0, dz * 0.4, 0.0);
  c.densF = warhammerDensity(df, -0.4, 0.7);
  float swell = df * sin(t * 0.33) * 0.12;

  vec2 push;
  c.clr = warhammerClearing(p, df, t, push);
  vec2 dM2 = warhammerLayer(p, push, 0.45, cam, eye) - core;
  vec2 dM3 = warhammerLayer(p, push, 0.25, cam, eye) - core;
  vec2 dM = warhammerLayer(p, push, -0.1, cam, eye) - core;
  vec2 dN = warhammerLayer(p, push, -0.35, cam, eye) - core;
  vec2 sM = warhammerSwirl(dM, t);
  vec2 sN = warhammerSwirl(dN, t);

  vec2 qM = sM * 0.85 + drift * 0.8;
  c.dm = warhammerCloud(qM, 1.25, dz * 0.7, 7.0, roll);
  c.densM0 = warhammerDensity(c.dm, -0.28 + swell + c.part * 0.45, 0.5 + swell + c.part * 0.45);
  float clearM = c.clr.x * 0.65;
  c.densM = warhammerDensity(c.dm, -0.28 + swell + c.part * 0.45 + clearM, 0.5 + swell + c.part * 0.45 + clearM);
  c.litM = uTier > 1.5 ? 0.5 : mix(0.5, warhammerLit(qM, -sM / max(length(sM), 0.001), 1.25, dz * 0.7, 7.0), litFade);
  warhammerMatter(0.0, c.densM, c.litM);

  vec2 qN = sN * 1.3 + drift;
  c.dn = warhammerCloud(qN, 1.6, dz, 13.0, roll);
  c.densN0 = warhammerDensity(c.dn, 0.08 + swell + c.part * 0.45, 0.62 + swell + c.part * 0.45);
  float clearN = c.clr.x * 0.8;
  c.densN = warhammerDensity(c.dn, 0.08 + swell + c.part * 0.45 + clearN, 0.62 + swell + c.part * 0.45 + clearN);
  c.litN = uTier > 1.5 ? 0.5 : mix(0.5, warhammerLit(qN, -sN / max(length(sN), 0.001), 1.6, dz, 13.0), litFade);
  warhammerMatter(1.0, c.densN, c.litN);

  float dm2 = warhammerCloudCheap(warhammerSwirl(dM2, t) * 0.7 + drift * 0.65, 1.1, dz * 0.55, 23.0);
  c.densM2 = warhammerDensity(dm2, -0.3, 0.6);
  vec2 q3 = warhammerSwirl(dM3 * vec2(1.0, -1.0), t * 1.3) * vec2(1.0, -1.0);
  float dm3 = warhammerCloud(q3 * 0.95 + vec2(drift.y, -drift.x) * 0.9, 1.15, dz * 0.62 + cos(t * 0.08) * 0.5, 37.0, roll);
  float clearM3 = c.clr.x * 0.45;
  c.densM3 = warhammerDensity(dm3, -0.22 + c.part * 0.35 + clearM3, 0.5 + c.part * 0.35 + clearM3);

  vec2 ed = warhammerRotate(c.d, 0.25) * vec2(1.5, 1.0);
  float wobble = stageFbm3(vec3(c.d * 3.0, 50.0)) * 0.05;
  float re = max(length(ed) + wobble, 0.0);
  c.coreHot = exp(-re * re * 110.0) * 0.55;
  c.coreGlow = exp(-re * 4.6) * 0.8;
  float coreHalo = exp(-re * 1.7);
  float rift = c.coreGlow * 0.36 + c.coreHot * 0.22;
  float coreLight = exp(-c.r * 1.5) * 0.5 + rift;

  float rM = length(dM);
  vec2 dir = -dM / max(rM, 0.001);
  float occl = 0.0;
  int steps = uTier > 1.5 ? 3 : ${marchSteps};
  for (int i = 1; i <= ${marchSteps}; i++) {
    if (i > steps) break;
    vec2 sp = dM + dir * float(i) * (rM / float(steps + 1));
    vec2 sq = warhammerSwirl(sp, t);
    float partS = warhammerPressPart(sp + core) * 0.45;
    occl += warhammerDensity(warhammerCloudCheap(sq * 0.85 + drift * 0.8, 1.25, dz * 0.7, 7.0), -0.28 + partS, 0.5 + partS);
  }
  c.shadow = exp(-occl * ${(mobile ? 1.0 : 0.7).toFixed(2)});
  c.light = coreLight * c.shadow;
  c.transmit = (1.0 - c.densN * 0.97) * (1.0 - c.densM * 0.75) * (1.0 - c.densM3 * 0.45);
  c.shaft = coreHalo * pow(c.shadow, 1.6) * c.transmit;

  c.flash = uFlash1.z * exp(-dot(p - uFlash1.xy, p - uFlash1.xy) * 7.0) + uFlash2.z * exp(-dot(p - uFlash2.xy, p - uFlash2.xy) * 9.0) + uFlash3.z * exp(-dot(p - uFlash3.xy, p - uFlash3.xy) * 6.0);
  c.flash += warhammerPressFlash(p) * 0.8;
  c.edgeM = c.densM * (1.0 - c.densM) * 4.0 * c.litM;
  c.edgeN = c.densN * (1.0 - c.densN) * 4.0 * c.litN;

  gl_FragColor = vec4(warhammerPaint(c), 1.0);
}
`;
}

function ScenePost({ mobile }: { mobile: boolean }) {
  const tier = Stage.useTier();
  const composer = Stage.useComposerSize();
  const effects = [
    <Bloom
      key="bloom"
      mipmapBlur
      levels={mobile || tier > 1 ? 4 : tier === 1 ? 5 : 6}
      intensity={mobile ? 0.75 : 0.95}
      luminanceThreshold={0.45}
      luminanceSmoothing={0.3}
      radius={0.85}
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

export function Scene<U extends { [K in keyof U]: IUniform }>({
  background,
  glsl,
  press,
  uniforms,
  children,
}: {
  background: Color;
  glsl: string;
  press: PressRef;
  uniforms: U;
  children: (stage: { input: Stage.InputRef; reducedMotion: boolean }) => ReactNode;
}) {
  const { mobile, reducedMotion } = Stage.useQuality();
  const input = Stage.useInput();
  const clearing = useClearing();
  const flashes = useMemo(
    () => [{ value: new Vector3() }, { value: new Vector3() }, { value: new Vector3() }],
    [],
  );
  const fragment = useMemo(() => sceneFragment(mobile, glsl), [mobile, glsl]);
  const all = useMemo(
    () => ({
      uFlash1: flashes[0],
      uFlash2: flashes[1],
      uFlash3: flashes[2],
      ...clearing,
      ...press.uniforms,
      ...uniforms,
    }),
    [flashes, clearing, press, uniforms],
  );

  return (
    <Stage.Canvas background={background} reducedMotion={reducedMotion} input={input}>
      <FlashDriver
        cycles={SCENE_FLASHES}
        uniforms={flashes}
        spread={[1.4, 0.9]}
        reducedMotion={reducedMotion}
      />
      <PressDriver press={press} reducedMotion={reducedMotion} />
      <ClearingDriver clearing={clearing} reducedMotion={reducedMotion} />
      <TiltDriver input={input} />
      {children({ input, reducedMotion })}
      <Stage.ScreenShader
        fragmentShader={fragment}
        uniforms={all}
        input={input}
        reducedMotion={reducedMotion}
        resolution={SCENE_RESOLUTION}
      />
      <ScenePost mobile={mobile} />
    </Stage.Canvas>
  );
}
