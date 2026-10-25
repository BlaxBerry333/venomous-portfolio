import * as Common from "@/ui/themes/warhammer/__common__";
import { useMemo } from "react";
import { Color } from "three";
import { GLSL_MUSK, MuskDriver, useMusk } from "./useMusk";
import { GLSL_RIPPLE, RippleDriver, useRipple } from "./useRipple";

const SCENE_COLORS = {
  background: new Color("#050108"),
  deep: new Color("#1a0428"),
  abyss: new Color("#1e0624"),
  violet: new Color("#42168c"),
  magenta: new Color("#9a2fca"),
  pink: new Color("#b7449a"),
  core: new Color("#ff9ae6"),
  electric: new Color("#f3b8ff"),
  white: new Color("#fff3fa"),
  wine: new Color("#3d0a2c"),
  rose: new Color("#ff4f8f"),
} as const;

const SCENE_GLSL = `
uniform vec3 uBg;
uniform vec3 uDeep;
uniform vec3 uAbyss;
uniform vec3 uViolet;
uniform vec3 uMagenta;
uniform vec3 uPink;
uniform vec3 uCore;
uniform vec3 uElectric;
uniform vec3 uWhite;
uniform vec3 uWine;
uniform vec3 uRose;
${GLSL_RIPPLE}
${GLSL_MUSK}

void warhammerPrepare(vec2 p) {
}

void warhammerMatter(float layer, inout float dens, inout float lit) {
}

vec3 warhammerPaint(WarhammerCloud c) {
  vec3 col = uBg;
  vec3 farCol = mix(mix(uDeep, uAbyss, 0.65), mix(uViolet, uAbyss, 0.4), c.densF) * (0.25 + c.light * 0.3);
  col = mix(col, farCol, c.densF * 0.9);

  vec3 backCol = mix(mix(uDeep, uAbyss, 0.45), uViolet, pow(c.densM2, 1.1)) * (0.22 + c.light * 0.4);
  backCol += mix(uMagenta, uViolet, 0.5) * c.light * c.densM2 * 0.3;
  col = mix(col, backCol, c.densM2 * 0.92);

  vec3 chaosCol = mix(mix(uDeep, uWine, 0.2), mix(uViolet, uMagenta, 0.35), pow(c.densM3, 1.1)) * (0.22 + c.light * 0.45);
  chaosCol += mix(uMagenta, uRose, 0.55) * c.light * c.densM3 * 0.4;
  chaosCol += mix(uElectric, uCore, 0.5) * c.flash * c.densM3 * 0.35;
  col = mix(col, chaosCol, c.densM3 * 0.9);

  vec3 midShade = mix(mix(uDeep * 0.5, uWine * 0.4, 0.15), mix(uViolet, uMagenta, 0.3), c.litM);
  vec3 midCol = mix(mix(uDeep, uAbyss, 0.35) * 0.6, midShade, pow(c.densM, 1.1));
  midCol += mix(uMagenta, mix(uPink, uRose, 0.4), clamp(c.light * 0.5, 0.0, 1.0)) * c.light * c.densM * c.litM * 1.1;
  midCol += mix(uElectric, uCore, 0.5) * c.flash * c.densM * (0.5 + c.edgeM);
  col = mix(col, midCol, c.densM * 0.96);

  col += mix(uMagenta, uPink, c.coreGlow) * c.shaft * 0.18;
  col += mix(uPink, uCore, c.coreGlow) * c.coreGlow * c.transmit * 0.17;
  col += mix(uCore, uWhite, c.coreHot * 0.35) * c.coreHot * c.transmit * 0.16;
  col += mix(uPink, uCore, 0.5) * c.edgeM * c.coreGlow * c.shadow * 0.26;
  col += mix(uMagenta, uPink, 0.5) * c.part * c.transmit * 0.3;

  vec3 nearShade = mix(uAbyss * 0.5, mix(uAbyss, uViolet, 0.55), c.litN);
  vec3 nearCol = mix(mix(uDeep, uAbyss, 0.3) * 0.55, nearShade, pow(c.densN, 1.2));
  nearCol += mix(uMagenta, uPink, clamp(c.light * 0.4, 0.0, 1.0)) * c.light * c.densN * c.litN * 0.9;
  nearCol += mix(uElectric, uCore, 0.5) * c.flash * c.densN * (0.4 + c.edgeN * 0.8);
  col = mix(col, nearCol, c.densN * 0.86);

  col += mix(uPink, uWhite, 0.4) * c.edgeN * c.coreGlow * c.shadow * 0.28;

  col *= 1.0 - c.clr.z * 0.15;
  col += mix(uViolet, uPink, 0.35) * c.clr.x * (0.6 + 0.4 * smoothstep(-0.4, 0.6, c.dm)) * 0.16;
  float wallLit = c.clr.w * max(c.densN0, c.densM0) * (0.5 + 0.5 * smoothstep(-0.3, 0.5, c.dn));
  col += mix(uPink, uWhite, 0.25) * wallLit * (0.12 + c.light * 0.4);
  col += mix(uMagenta, uPink, 0.55) * c.clr.y * (0.16 + 0.1 * smoothstep(-0.4, 0.6, c.dm));

  vec2 musk = slaaneshMusk(vUv, -c.d / max(c.r, 0.001));
  col = mix(col, mix(uMagenta, uCore, musk.y * 0.7) * (0.5 + musk.y * 0.5), musk.x * 0.8);
  col += uCore * musk.x * musk.y * c.light * 0.25;
  return col;
}
`;

export function Scene() {
  const press = Common.usePress(0);
  const ripple = useRipple();
  const musk = useMusk();
  const uniforms = useMemo(
    () => ({
      uBg: { value: SCENE_COLORS.background },
      uDeep: { value: SCENE_COLORS.deep },
      uAbyss: { value: SCENE_COLORS.abyss },
      uViolet: { value: SCENE_COLORS.violet },
      uMagenta: { value: SCENE_COLORS.magenta },
      uPink: { value: SCENE_COLORS.pink },
      uCore: { value: SCENE_COLORS.core },
      uElectric: { value: SCENE_COLORS.electric },
      uWhite: { value: SCENE_COLORS.white },
      uWine: { value: SCENE_COLORS.wine },
      uRose: { value: SCENE_COLORS.rose },
      ...ripple,
      ...musk,
    }),
    [ripple, musk],
  );

  return (
    <Common.Scene
      background={SCENE_COLORS.background}
      glsl={SCENE_GLSL}
      press={press}
      uniforms={uniforms}
    >
      {({ input, reducedMotion }) => (
        <>
          <RippleDriver ripple={ripple} press={press} reducedMotion={reducedMotion} />
          <MuskDriver musk={musk} press={press} input={input} reducedMotion={reducedMotion} />
        </>
      )}
    </Common.Scene>
  );
}
