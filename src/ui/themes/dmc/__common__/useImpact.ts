import { useFrame, useThree } from "@react-three/fiber";
import { Effect } from "postprocessing";
import { useEffect, useMemo } from "react";
import { Uniform, Vector2 } from "three";
import { pixelsPerUnit } from "./pointer";

export interface ImpactSignal {
  shake: number;
  aberration: number;
  glitch: number;
}

const IMPACT_ABERRATION_BASE = 0.0012;
const IMPACT_SHAKE_DECAY = 18;
const IMPACT_ABERRATION_DECAY = 16;
const IMPACT_GLITCH_DECAY = 12;
const IMPACT_GLITCH_STEP = 0.035;

const IMPACT_FRAGMENT = `
uniform float uGlitch;
uniform float uSeed;

float dmcImpactHash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float dmcImpactBand(float y) {
  float zone = floor(y * 6.0 + dmcImpactHash(vec2(uSeed, 0.7)) * 3.0);
  if (dmcImpactHash(vec2(zone, uSeed + 1.3)) < 0.5) return -1.0;
  float rows = mix(28.0, 64.0, dmcImpactHash(vec2(zone, uSeed + 2.9)));
  float band = floor(y * rows);
  if (dmcImpactHash(vec2(band, uSeed)) < 1.0 - 0.55 * uGlitch) return -1.0;
  return band;
}

void mainUv(inout vec2 uv) {
  if (uGlitch <= 0.0) return;
  float band = dmcImpactBand(uv.y);
  if (band < 0.0) return;
  uv.x += (dmcImpactHash(vec2(band, uSeed + 3.1)) - 0.5) * 0.3 * uGlitch;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
  if (uGlitch <= 0.0) return;
  float band = dmcImpactBand(uv.y);
  if (band < 0.0) return;
  float lift = dmcImpactHash(vec2(band, uSeed + 5.3));
  outputColor.rgb *= 1.0 + 0.5 * lift * uGlitch;
}
`;

function createImpactEffect() {
  const amount = new Uniform(0);
  const seed = new Uniform(0);
  const effect = new Effect("DmcImpact", IMPACT_FRAGMENT, {
    uniforms: new Map([
      ["uGlitch", amount],
      ["uSeed", seed],
    ]),
  });
  return { effect, amount, seed };
}

export function useImpact(impact: ImpactSignal) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const aberration = useMemo(() => new Vector2(IMPACT_ABERRATION_BASE, IMPACT_ABERRATION_BASE), []);
  const fx = useMemo(() => createImpactEffect(), []);
  const state = useMemo(() => ({ shaking: false, glitchClock: 0 }), []);

  useEffect(
    () => () => {
      fx.effect.dispose();
      gl.domElement.style.transform = "";
    },
    [fx, gl],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    impact.shake *= Math.exp(-IMPACT_SHAKE_DECAY * dt);
    if (impact.shake < 0.001) impact.shake = 0;
    if (impact.shake > 0) {
      const pxPerUnit = pixelsPerUnit(size.height);
      const ox = (Math.random() - 0.5) * 2 * impact.shake * pxPerUnit;
      const oy = (Math.random() - 0.5) * 2 * impact.shake * pxPerUnit;
      gl.domElement.style.transform = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px)`;
      state.shaking = true;
    } else if (state.shaking) {
      gl.domElement.style.transform = "";
      state.shaking = false;
    }

    impact.aberration *= Math.exp(-IMPACT_ABERRATION_DECAY * dt);
    if (impact.aberration < 0.0001) impact.aberration = 0;
    aberration.setScalar(IMPACT_ABERRATION_BASE + impact.aberration);

    impact.glitch *= Math.exp(-IMPACT_GLITCH_DECAY * dt);
    if (impact.glitch < 0.02) impact.glitch = 0;
    fx.amount.value = impact.glitch;

    if (impact.glitch > 0) {
      state.glitchClock += dt;
      if (state.glitchClock >= IMPACT_GLITCH_STEP) {
        state.glitchClock = 0;
        fx.seed.value = Math.random() * 100;
      }
    }
  });

  return { aberration, effect: fx.effect };
}
