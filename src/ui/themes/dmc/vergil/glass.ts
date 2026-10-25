import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  HalfFloatType,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";

export const GLASS_PIECE_MAX = 64;
const GLASS_POLY_MAX = 14;
const GLASS_PIECE_VERTS = (GLASS_POLY_MAX - 2) * 3;
const GLASS_VERT_MAX = GLASS_PIECE_MAX * GLASS_PIECE_VERTS;

const GLASS_VERTEX = `
attribute float aAlpha;
attribute float aShade;
varying vec2 vUv;
varying float vAlpha;
varying float vShade;

void main() {
  vUv = uv;
  vAlpha = aAlpha;
  vShade = aShade;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLASS_FRAGMENT = `
uniform sampler2D uMap;
uniform float uFreeze;
varying vec2 vUv;
varying float vAlpha;
varying float vShade;

void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float l = sqrt(max(dot(c, vec3(0.299, 0.587, 0.114)), 0.0));
  vec3 still = vec3(0.1, 0.125, 0.165) + vec3(0.4, 0.45, 0.54) * l;
  gl_FragColor = vec4(mix(c, still, uFreeze) * vShade, vAlpha);
}
`;

export function createGlass() {
  const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false });
  const geometry = new BufferGeometry();
  const positions = new BufferAttribute(new Float32Array(GLASS_VERT_MAX * 3), 3);
  const uvs = new BufferAttribute(new Float32Array(GLASS_VERT_MAX * 2), 2);
  const alphas = new BufferAttribute(new Float32Array(GLASS_VERT_MAX), 1);
  const shades = new BufferAttribute(new Float32Array(GLASS_VERT_MAX), 1);
  positions.setUsage(DynamicDrawUsage);
  alphas.setUsage(DynamicDrawUsage);
  geometry.setAttribute("position", positions);
  geometry.setAttribute("uv", uvs);
  geometry.setAttribute("aAlpha", alphas);
  geometry.setAttribute("aShade", shades);
  geometry.setDrawRange(0, 0);
  const material = new ShaderMaterial({
    vertexShader: GLASS_VERTEX,
    fragmentShader: GLASS_FRAGMENT,
    uniforms: {
      uMap: { value: target.texture },
      uFreeze: { value: 0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  return {
    target,
    geometry,
    material,
    positions,
    uvs,
    alphas,
    shades,
    base: new Float32Array(GLASS_VERT_MAX * 2),
  };
}

function glassCut(poly: number[], px: number, py: number, dx: number, dy: number): number[][] {
  const front: number[] = [];
  const back: number[] = [];
  const n = poly.length / 2;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = poly[i * 2];
    const yi = poly[i * 2 + 1];
    const xj = poly[j * 2];
    const yj = poly[j * 2 + 1];
    const si = (xi - px) * -dy + (yi - py) * dx;
    const sj = (xj - px) * -dy + (yj - py) * dx;
    if (si >= 0) front.push(xi, yi);
    if (si <= 0) back.push(xi, yi);
    if (si * sj < 0) {
      const t = si / (si - sj);
      const x = xi + (xj - xi) * t;
      const y = yi + (yj - yi) * t;
      front.push(x, y);
      back.push(x, y);
    }
  }
  if (front.length < 6 || back.length < 6) return [poly];
  return [front, back];
}

export function glassSplit(
  lines: Float32Array,
  count: number,
  halfW: number,
  halfH: number,
): number[][] {
  let polys: number[][] = [[-halfW, -halfH, halfW, -halfH, halfW, halfH, -halfW, halfH]];
  for (let l = 0; l < count; l++) {
    const next: number[][] = [];
    polys.forEach((poly, i) => {
      const room = GLASS_PIECE_MAX - next.length - (polys.length - i);
      if (room < 1 || poly.length / 2 >= GLASS_POLY_MAX) {
        next.push(poly);
        return;
      }
      next.push(
        ...glassCut(poly, lines[l * 4], lines[l * 4 + 1], lines[l * 4 + 2], lines[l * 4 + 3]),
      );
    });
    polys = next;
  }
  return polys;
}
