import * as Common from "@/ui/themes/warhammer/__common__";
import { useMemo } from "react";
import { Color } from "three";
import { GLSL_LIGHTNING, LightningDriver, useLightning } from "./useLightning";

const SCENE_COLORS = {
  background: new Color("#000208"),
  deep: new Color("#030b22"),
  abyss: new Color("#021625"),
  midnight: new Color("#0b2466"),
  azure: new Color("#2563ff"),
  flare: new Color("#7df4ff"),
  core: new Color("#2bf0ff"),
  electric: new Color("#22d3ee"),
  white: new Color("#ffffff"),
  sick: new Color("#06303a"),
  frost: new Color("#b8f6ff"),
} as const;

const SCENE_GLSL = `
uniform vec3 uBg;
uniform vec3 uDeep;
uniform vec3 uAbyss;
uniform vec3 uMidnight;
uniform vec3 uAzure;
uniform vec3 uFlare;
uniform vec3 uCore;
uniform vec3 uElectric;
uniform vec3 uWhite;
uniform vec3 uSick;
uniform vec3 uFrost;
${GLSL_LIGHTNING}

vec2 warhammerRippleBend(vec2 p, float k) {
  return p;
}

float warhammerRipplePart(vec2 p) {
  return 0.0;
}

float warhammerRippleFlash(vec2 p) {
  return 0.0;
}

void warhammerPrepare(vec2 p) {
  tzeentchLightning(p);
}

void warhammerMatter(float layer, inout float dens, inout float lit) {
  tzeentchBoltMatter(layer, dens, lit);
}

vec3 warhammerPaint(WarhammerCloud c) {
  vec3 col = uBg;
  vec3 farCol = mix(mix(uDeep, uAbyss, 0.65), mix(uMidnight, uAbyss, 0.4), c.densF) * (0.25 + c.light * 0.3);
  col = mix(col, farCol, c.densF * 0.9);

  vec3 backCol = mix(mix(uDeep, uAbyss, 0.45), uMidnight, pow(c.densM2, 1.1)) * (0.22 + c.light * 0.4);
  backCol += mix(uElectric, uMidnight, 0.5) * c.light * c.densM2 * 0.3;
  col = mix(col, backCol, c.densM2 * 0.92);

  vec3 chaosCol = mix(mix(uDeep, uSick, 0.2), mix(uMidnight, uAzure, 0.35), pow(c.densM3, 1.1)) * (0.22 + c.light * 0.45);
  chaosCol += uFrost * c.light * c.densM3 * 0.22;
  chaosCol += mix(uElectric, uCore, 0.5) * c.flash * c.densM3 * 0.35;
  col = mix(col, chaosCol, c.densM3 * 0.9);

  vec3 midShade = mix(mix(uDeep * 0.5, uSick * 0.4, 0.15), mix(uMidnight, mix(uSick, uCore, 0.25), 0.5), c.litM);
  vec3 midCol = mix(mix(uDeep, uAbyss, 0.35) * 0.6, midShade, pow(c.densM, 1.1));
  midCol += mix(uElectric, uCore, smoothstep(0.25, 0.8, c.densM)) * c.light * c.densM * c.litM * 1.1;
  midCol += mix(uElectric, uCore, 0.5) * c.flash * c.densM * (0.5 + c.edgeM);
  col = mix(col, midCol, c.densM * 0.96);

  col += mix(uElectric, uCore, c.coreGlow) * c.shaft * 0.18;
  col += mix(uElectric, uCore, c.coreGlow) * c.coreGlow * c.transmit * 0.17;
  col += mix(uCore, uWhite, c.coreHot * 0.35) * c.coreHot * c.transmit * 0.16;
  col += mix(uCore, uWhite, 0.3) * c.edgeM * c.coreGlow * c.shadow * 0.26;
  col += uFlare * c.part * c.transmit * 0.22;

  vec3 nearShade = mix(uAbyss * 0.5, mix(uAbyss, uMidnight, 0.55), c.litN);
  vec3 nearCol = mix(mix(uDeep, uAbyss, 0.3) * 0.55, nearShade, pow(c.densN, 1.2));
  nearCol += mix(uElectric, uCore, smoothstep(0.3, 0.85, c.densN)) * c.light * c.densN * c.litN * 0.9;
  nearCol += mix(uElectric, uCore, 0.5) * c.flash * c.densN * (0.4 + c.edgeN * 0.8);
  col = mix(col, nearCol, c.densN * 0.86);

  col += mix(uCore, uWhite, 0.4) * c.edgeN * c.coreGlow * c.shadow * 0.28;

  col *= 1.0 - c.clr.z * 0.15;
  col += mix(uMidnight, uCore, 0.35) * c.clr.x * (0.6 + 0.4 * smoothstep(-0.4, 0.6, c.dm)) * 0.16;
  float wallLit = c.clr.w * max(c.densN0, c.densM0) * (0.5 + 0.5 * smoothstep(-0.3, 0.5, c.dn));
  col += mix(uCore, uWhite, 0.25) * wallLit * (0.12 + c.light * 0.4);
  col += uFlare * c.clr.y * (0.12 + 0.08 * smoothstep(-0.4, 0.6, c.dm));
  return tzeentchBoltLight(col, c.transmit);
}
`;

export function Scene() {
  const press = Common.usePress(0.5);
  const lightning = useLightning();
  const uniforms = useMemo(
    () => ({
      uBg: { value: SCENE_COLORS.background },
      uDeep: { value: SCENE_COLORS.deep },
      uAbyss: { value: SCENE_COLORS.abyss },
      uMidnight: { value: SCENE_COLORS.midnight },
      uAzure: { value: SCENE_COLORS.azure },
      uFlare: { value: SCENE_COLORS.flare },
      uCore: { value: SCENE_COLORS.core },
      uElectric: { value: SCENE_COLORS.electric },
      uWhite: { value: SCENE_COLORS.white },
      uSick: { value: SCENE_COLORS.sick },
      uFrost: { value: SCENE_COLORS.frost },
      ...lightning,
    }),
    [lightning],
  );

  return (
    <Common.Scene
      background={SCENE_COLORS.background}
      glsl={SCENE_GLSL}
      press={press}
      uniforms={uniforms}
    >
      {({ reducedMotion }) => (
        <LightningDriver
          lightning={lightning}
          press={press}
          origin={Common.CLOUD_CORE}
          reducedMotion={reducedMotion}
        />
      )}
    </Common.Scene>
  );
}
