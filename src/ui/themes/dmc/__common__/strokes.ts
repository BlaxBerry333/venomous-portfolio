import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  ShaderMaterial,
} from "three";

export const CAMERA_Z = 10;
const STROKE_MIN_HALF_PX = 1.5;
const STROKE_FADE_POWER = 1.6;

export interface StrokeColors {
  accent: Color;
  hot: Color;
}

const TRAIL_VERTEX = `
attribute float aAge;
attribute float aSide;
varying float vAge;
varying float vSide;

void main() {
  vAge = aAge;
  vSide = aSide;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const TRAIL_FRAGMENT = `
uniform vec3 uAccent;
uniform vec3 uHot;
varying float vAge;
varying float vSide;

void main() {
  float edge = clamp(1.0 - abs(vSide), 0.0, 1.0);
  float life = clamp(1.0 - vAge, 0.0, 1.0);
  float core = pow(edge, 3.0);
  float fade = pow(life, ${STROKE_FADE_POWER.toFixed(2)});
  vec3 col = mix(uAccent, uHot, core * life) * (0.6 + core * 2.4) * fade * pow(edge, 0.7);
  gl_FragColor = vec4(col, 1.0);
}
`;

const SPARK_VERTEX = `
uniform float uPixelRatio;
attribute float aLife;
varying float vLife;

void main() {
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (1.5 + aLife * 4.0) * uPixelRatio * (12.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const SPARK_FRAGMENT = `
uniform vec3 uAccent;
uniform vec3 uHot;
varying float vLife;

void main() {
  if (vLife <= 0.0) discard;
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d);
  vec3 col = mix(uAccent, uHot, vLife * vLife) * a * (0.5 + vLife * 2.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function strokeMinHalf(pxPerUnit: number, dpr: number): number {
  return STROKE_MIN_HALF_PX / (pxPerUnit * dpr);
}

export function strokeAge(intensity: number, half: number, drawn: number): number {
  return 1 - intensity * Math.pow(half / drawn, 1 / STROKE_FADE_POWER);
}

export function createRibbonGeometry(points: number, strips: number) {
  const geometry = new BufferGeometry();
  const positions = new BufferAttribute(new Float32Array(strips * points * 2 * 3), 3);
  const ages = new BufferAttribute(new Float32Array(strips * points * 2), 1);
  const sides = new BufferAttribute(new Float32Array(strips * points * 2), 1);
  positions.setUsage(DynamicDrawUsage);
  ages.setUsage(DynamicDrawUsage);
  const index: number[] = [];
  for (let strip = 0; strip < strips; strip++) {
    for (let i = 0; i < points - 1; i++) {
      const a = (strip * points + i) * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  for (let i = 0; i < strips * points; i++) {
    sides.setX(i * 2, -1);
    sides.setX(i * 2 + 1, 1);
  }
  geometry.setAttribute("position", positions);
  geometry.setAttribute("aAge", ages);
  geometry.setAttribute("aSide", sides);
  geometry.setIndex(index);
  return { geometry, positions, ages };
}

export function createStrokeMaterial(colors: StrokeColors): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: TRAIL_VERTEX,
    fragmentShader: TRAIL_FRAGMENT,
    uniforms: { uAccent: { value: colors.accent }, uHot: { value: colors.hot } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });
}

export function createSparkMaterial(colors: StrokeColors): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: SPARK_VERTEX,
    fragmentShader: SPARK_FRAGMENT,
    uniforms: {
      uPixelRatio: { value: 1 },
      uAccent: { value: colors.accent },
      uHot: { value: colors.hot },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });
}
