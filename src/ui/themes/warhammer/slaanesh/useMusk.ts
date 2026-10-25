import * as Stage from "@/ui/shared/stage";
import type * as Common from "@/ui/themes/warhammer/__common__";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  ClampToEdgeWrapping,
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type IUniform,
  type Texture,
  type WebGLRenderer,
} from "three";

const MUSK_TIERS = [
  { sim: 128, dye: 512, iterations: 10 },
  { sim: 96, dye: 384, iterations: 8 },
  { sim: 64, dye: 256, iterations: 6 },
];
const MUSK_RATE = 0.03;
const MUSK_CURL = 14;
const MUSK_PRESSURE = 0.8;
const MUSK_VELOCITY_DISSIPATION = 1.2;
const MUSK_DYE_DISSIPATION = 0.7;
const MUSK_FORCE = 1400;
const MUSK_RADIUS = 0.0007;
const MUSK_SLEEP = 8;

interface MuskUniforms {
  uMusk: { value: Texture | null };
  uMuskTexel: { value: Vector2 };
  uMuskOn: { value: number };
}

interface MuskSplat {
  x: number;
  y: number;
  dx: number;
  dy: number;
  amount: number;
}

export const GLSL_MUSK = `
uniform sampler2D uMusk;
uniform vec2 uMuskTexel;
uniform float uMuskOn;

float slaaneshMuskSample(vec2 uv) {
  vec2 o = uMuskTexel * 2.5;
  return 0.25 * (texture2D(uMusk, uv + vec2(o.x, o.y)).r + texture2D(uMusk, uv + vec2(-o.x, o.y)).r + texture2D(uMusk, uv + vec2(o.x, -o.y)).r + texture2D(uMusk, uv - o).r);
}

vec2 slaaneshMusk(vec2 uv, vec2 toLight) {
  if (uMuskOn < 0.5) return vec2(0.0, 0.5);
  float here = slaaneshMuskSample(uv);
  float toward = slaaneshMuskSample(uv + vec2(toLight.x / uAspect, toLight.y) * uMuskTexel.y * 12.0);
  float silk = smoothstep(0.03, 0.9, clamp(here, 0.0, 1.5));
  float sheen = clamp(0.5 + (here - toward) * 1.6, 0.0, 1.0);
  return vec2(silk, sheen);
}
`;

interface MuskPair {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
}

const MUSK_ADVECT = `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uStep;
uniform float uDissipation;

void main() {
  vec2 coord = vUv - uStep * texture2D(uVelocity, vUv).xy * uTexel;
  gl_FragColor = texture2D(uSource, coord) / (1.0 + uDissipation * uStep);
}
`;

const MUSK_VORTICITY = `
uniform sampler2D uVelocity;
uniform vec2 uTexel;
uniform float uStep;
uniform float uStrength;

float muskCurl(vec2 uv) {
  float l = texture2D(uVelocity, uv - vec2(uTexel.x, 0.0)).y;
  float r = texture2D(uVelocity, uv + vec2(uTexel.x, 0.0)).y;
  float t = texture2D(uVelocity, uv + vec2(0.0, uTexel.y)).x;
  float b = texture2D(uVelocity, uv - vec2(0.0, uTexel.y)).x;
  return 0.5 * (r - l - t + b);
}

void main() {
  float l = muskCurl(vUv - vec2(uTexel.x, 0.0));
  float r = muskCurl(vUv + vec2(uTexel.x, 0.0));
  float t = muskCurl(vUv + vec2(0.0, uTexel.y));
  float b = muskCurl(vUv - vec2(0.0, uTexel.y));
  float c = muskCurl(vUv);
  vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
  force /= length(force) + 0.0001;
  force *= uStrength * c;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy + force * uStep;
  gl_FragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}
`;

const MUSK_DIVERGENCE = `
uniform sampler2D uVelocity;
uniform vec2 uTexel;

void main() {
  vec2 c = texture2D(uVelocity, vUv).xy;
  float l = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float t = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  float b = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  if (vUv.x - uTexel.x < 0.0) l = -c.x;
  if (vUv.x + uTexel.x > 1.0) r = -c.x;
  if (vUv.y + uTexel.y > 1.0) t = -c.y;
  if (vUv.y - uTexel.y < 0.0) b = -c.y;
  gl_FragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}
`;

const MUSK_PRESSURE_PASS = `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
uniform float uCarry;

void main() {
  float l = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float t = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float b = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float div = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4(((l + r + b + t) * uCarry - div) * 0.25, 0.0, 0.0, 1.0);
}
`;

const MUSK_GRADIENT = `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;

void main() {
  float l = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float t = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float b = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  vec2 vel = texture2D(uVelocity, vUv).xy - vec2(r - l, t - b);
  gl_FragColor = vec4(vel, 0.0, 1.0);
}
`;

const MUSK_SPLAT = `
uniform sampler2D uSource;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspect;

void main() {
  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  vec3 splat = exp(-dot(d, d) / uRadius) * uColor;
  gl_FragColor = vec4(texture2D(uSource, vUv).xyz + splat, 1.0);
}
`;

function muskTarget(width: number, height: number): WebGLRenderTarget {
  return new WebGLRenderTarget(width, height, {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    wrapS: ClampToEdgeWrapping,
    wrapT: ClampToEdgeWrapping,
    depthBuffer: false,
  });
}

function muskPair(width: number, height: number): MuskPair {
  return { read: muskTarget(width, height), write: muskTarget(width, height) };
}

function muskSwap(pair: MuskPair): void {
  const read = pair.read;
  pair.read = pair.write;
  pair.write = read;
}

function muskMaterial(fragmentShader: string, uniforms: Record<string, IUniform>): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: Stage.GLSL_SCREEN_VERTEX,
    fragmentShader: `varying vec2 vUv;\n${fragmentShader}`,
    uniforms,
    depthWrite: false,
    depthTest: false,
  });
}

function muskSize(width: number, height: number, short: number): [number, number] {
  const aspect = width / Math.max(height, 1);
  return aspect >= 1
    ? [Math.round(short * aspect), short]
    : [short, Math.round(short / Math.max(aspect, 0.01))];
}

export function useMusk(): MuskUniforms {
  return useMemo(
    () => ({ uMusk: { value: null }, uMuskTexel: { value: new Vector2() }, uMuskOn: { value: 0 } }),
    [],
  );
}

function useMuskSim(uniforms: MuskUniforms): (dt: number, splat: MuskSplat | null) => void {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const tier = Stage.useTier();
  const setting = MUSK_TIERS[tier] ?? MUSK_TIERS[MUSK_TIERS.length - 1];
  const [simW, simH] = muskSize(size.width, size.height, setting.sim);
  const [dyeW, dyeH] = muskSize(size.width, size.height, setting.dye);

  const pass = useMemo(() => {
    const mesh = new Mesh(new PlaneGeometry(2, 2));
    mesh.frustumCulled = false;
    const scene = new Scene();
    scene.add(mesh);
    const texel = () => ({ value: new Vector2() });
    return {
      mesh,
      scene,
      camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1),
      advect: muskMaterial(MUSK_ADVECT, {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexel: texel(),
        uStep: { value: 0 },
        uDissipation: { value: 0 },
      }),
      vorticity: muskMaterial(MUSK_VORTICITY, {
        uVelocity: { value: null },
        uTexel: texel(),
        uStep: { value: 0 },
        uStrength: { value: MUSK_CURL },
      }),
      divergence: muskMaterial(MUSK_DIVERGENCE, { uVelocity: { value: null }, uTexel: texel() }),
      pressure: muskMaterial(MUSK_PRESSURE_PASS, {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexel: texel(),
        uCarry: { value: 1 },
      }),
      gradient: muskMaterial(MUSK_GRADIENT, {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexel: texel(),
      }),
      splat: muskMaterial(MUSK_SPLAT, {
        uSource: { value: null },
        uPoint: { value: new Vector2() },
        uColor: { value: new Vector3() },
        uRadius: { value: 0 },
        uAspect: { value: 1 },
      }),
    };
  }, []);

  const targets = useMemo(
    () => ({
      velocity: muskPair(simW, simH),
      pressure: muskPair(simW, simH),
      dye: muskPair(dyeW, dyeH),
      divergence: muskTarget(simW, simH),
    }),
    [simW, simH, dyeW, dyeH],
  );

  useEffect(
    () => () => {
      for (const target of [targets.velocity, targets.pressure, targets.dye]) {
        target.read.dispose();
        target.write.dispose();
      }
      targets.divergence.dispose();
    },
    [targets],
  );

  useEffect(
    () => () => {
      pass.mesh.geometry.dispose();
      for (const material of [
        pass.advect,
        pass.vorticity,
        pass.divergence,
        pass.pressure,
        pass.gradient,
        pass.splat,
      ]) {
        material.dispose();
      }
    },
    [pass],
  );

  return useMemo(() => {
    const simTexel = new Vector2(1 / simW, 1 / simH);
    const aspect = size.width / Math.max(size.height, 1);
    const draw = (renderer: WebGLRenderer, material: ShaderMaterial, target: WebGLRenderTarget) => {
      pass.mesh.material = material;
      renderer.setRenderTarget(target);
      renderer.render(pass.scene, pass.camera);
    };
    const splatInto = (pair: MuskPair, s: MuskSplat, color: Vector3) => {
      const u = pass.splat.uniforms;
      u.uSource.value = pair.read.texture;
      u.uPoint.value.set(s.x, s.y);
      u.uColor.value.copy(color);
      u.uRadius.value = MUSK_RADIUS * (aspect > 1 ? aspect : 1);
      u.uAspect.value = aspect;
      draw(gl, pass.splat, pair.write);
      muskSwap(pair);
    };
    const color = new Vector3();

    return (dt: number, splat: MuskSplat | null) => {
      const previous = gl.getRenderTarget();
      const { velocity, pressure, dye, divergence } = targets;

      if (splat) {
        splatInto(velocity, splat, color.set(splat.dx, splat.dy, 0));
        splatInto(dye, splat, color.set(splat.amount, 0, 0));
      }

      const vorticity = pass.vorticity.uniforms;
      vorticity.uVelocity.value = velocity.read.texture;
      vorticity.uTexel.value.copy(simTexel);
      vorticity.uStep.value = dt;
      draw(gl, pass.vorticity, velocity.write);
      muskSwap(velocity);

      pass.divergence.uniforms.uVelocity.value = velocity.read.texture;
      pass.divergence.uniforms.uTexel.value.copy(simTexel);
      draw(gl, pass.divergence, divergence);

      const pr = pass.pressure.uniforms;
      pr.uDivergence.value = divergence.texture;
      pr.uTexel.value.copy(simTexel);
      for (let i = 0; i < setting.iterations; i++) {
        pr.uCarry.value = i === 0 ? MUSK_PRESSURE : 1;
        pr.uPressure.value = pressure.read.texture;
        draw(gl, pass.pressure, pressure.write);
        muskSwap(pressure);
      }

      const gr = pass.gradient.uniforms;
      gr.uPressure.value = pressure.read.texture;
      gr.uVelocity.value = velocity.read.texture;
      gr.uTexel.value.copy(simTexel);
      draw(gl, pass.gradient, velocity.write);
      muskSwap(velocity);

      const ad = pass.advect.uniforms;
      ad.uTexel.value.copy(simTexel);
      ad.uStep.value = dt;
      ad.uVelocity.value = velocity.read.texture;
      ad.uSource.value = velocity.read.texture;
      ad.uDissipation.value = MUSK_VELOCITY_DISSIPATION;
      draw(gl, pass.advect, velocity.write);
      muskSwap(velocity);

      ad.uVelocity.value = velocity.read.texture;
      ad.uSource.value = dye.read.texture;
      ad.uDissipation.value = MUSK_DYE_DISSIPATION;
      draw(gl, pass.advect, dye.write);
      muskSwap(dye);

      gl.setRenderTarget(previous);
      uniforms.uMusk.value = dye.read.texture;
      uniforms.uMuskTexel.value.set(1 / dyeW, 1 / dyeH);
    };
  }, [gl, size, pass, targets, setting, simW, simH, dyeW, dyeH, uniforms]);
}

export function MuskDriver({
  musk,
  press,
  input,
  reducedMotion,
}: {
  musk: MuskUniforms;
  press: Common.PressRef;
  input: Stage.InputRef;
  reducedMotion: boolean;
}) {
  const step = useMuskSim(musk);
  const run = useMemo(
    () => ({
      u: 0,
      v: 0,
      primed: false,
      idle: MUSK_SLEEP,
      wait: 0,
      splat: null as MuskSplat | null,
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const aspect = state.size.width / state.size.height;
    const target = input.target;
    const u = (target.pointerX + 1) / 2;
    const v = (target.pointerY + 1) / 2;
    if (!run.primed) {
      run.primed = true;
      run.u = u;
      run.v = v;
    }
    const du = u - run.u;
    const dv = v - run.v;
    run.u = u;
    run.v = v;
    const moved = Math.hypot(du * aspect, dv);
    const held = press.uniforms.uPress.value.z > 0.3 && target.pointerActive && !reducedMotion;
    const splat =
      held && moved > 0.0004
        ? {
            x: u,
            y: v,
            dx: du * MUSK_FORCE,
            dy: dv * MUSK_FORCE,
            amount: Math.min(0.05 + moved * 3, 0.16),
          }
        : null;
    if (splat) {
      const prev = run.splat;
      run.splat = prev
        ? {
            ...splat,
            dx: prev.dx + splat.dx,
            dy: prev.dy + splat.dy,
            amount: Math.max(prev.amount, splat.amount),
          }
        : splat;
    }
    run.idle = splat ? 0 : run.idle + dt;
    const awake = run.idle < MUSK_SLEEP;
    musk.uMuskOn.value = awake ? 1 : 0;
    if (!awake) return;
    run.wait += dt;
    if (run.wait < MUSK_RATE) return;
    step(Math.min(run.wait, 1 / 15), run.splat);
    run.wait = 0;
    run.splat = null;
  });

  return null;
}
