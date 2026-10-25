import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type IUniform,
} from "three";
import { GLSL_SCREEN_HEADER, GLSL_SCREEN_VERTEX } from "./glsl";
import type { InputRef } from "./useInput";
import { useTier } from "./useTier";

export interface ScreenResolution {
  scale: number;
  sharpen: number;
}

interface ScreenShaderProps {
  fragmentShader: string;
  uniforms?: Record<string, IUniform>;
  input: InputRef;
  reducedMotion: boolean;
  renderOrder?: number;
  resolution?: readonly ScreenResolution[];
}

const SCREEN_SHADER_RESOLUTION: readonly ScreenResolution[] = [
  { scale: 1, sharpen: 0 },
  { scale: 0.8, sharpen: 0.2 },
  { scale: 0.6, sharpen: 0.35 },
];

const SCREEN_BLIT_FRAGMENT = `
uniform sampler2D uMap;
uniform vec2 uTexel;
uniform float uSharpen;
varying vec2 vUv;

void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  vec3 n = texture2D(uMap, vUv + vec2(0.0, uTexel.y)).rgb
    + texture2D(uMap, vUv - vec2(0.0, uTexel.y)).rgb
    + texture2D(uMap, vUv + vec2(uTexel.x, 0.0)).rgb
    + texture2D(uMap, vUv - vec2(uTexel.x, 0.0)).rgb;
  gl_FragColor = vec4(max(c + (c * 4.0 - n) * uSharpen, 0.0), 1.0);
}
`;

function useScreenShaderUniforms(
  material: ShaderMaterial,
  input: InputRef,
  reducedMotion: boolean,
) {
  const tier = useTier();
  const size = useThree((state) => state.size);

  useFrame((state) => {
    const u = material.uniforms;
    if (!reducedMotion) u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = size.width / size.height;
    u.uScroll.value = input.current.scroll;
    u.uPointer.value.set(input.current.pointerX, input.current.pointerY);
    u.uTier.value = tier;
  });
}

function ScreenShaderScaled({
  material,
  input,
  reducedMotion,
  resolutionScale,
  sharpen,
  renderOrder,
}: {
  material: ShaderMaterial;
  input: InputRef;
  reducedMotion: boolean;
  resolutionScale: number;
  sharpen: number;
  renderOrder: number;
}) {
  useScreenShaderUniforms(material, input, reducedMotion);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const width = Math.max(1, Math.round(size.width * dpr * resolutionScale));
  const height = Math.max(1, Math.round(size.height * dpr * resolutionScale));
  const target = useMemo(
    () =>
      new WebGLRenderTarget(width, height, {
        type: HalfFloatType,
        depthBuffer: false,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      }),
    [width, height],
  );
  const offscreen = useMemo(() => {
    const scene = new Scene();
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));
    return { scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [material]);
  const blit = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: GLSL_SCREEN_VERTEX,
        fragmentShader: SCREEN_BLIT_FRAGMENT,
        uniforms: {
          uMap: { value: null },
          uTexel: { value: new Vector2() },
          uSharpen: { value: 0 },
        },
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );

  useEffect(() => () => target.dispose(), [target]);
  useEffect(() => () => blit.dispose(), [blit]);
  useEffect(
    () => () => {
      offscreen.scene.traverse((object) => {
        if (object instanceof Mesh) object.geometry.dispose();
      });
    },
    [offscreen],
  );

  useFrame((state) => {
    const previous = state.gl.getRenderTarget();
    state.gl.setRenderTarget(target);
    state.gl.render(offscreen.scene, offscreen.camera);
    state.gl.setRenderTarget(previous);
    blit.uniforms.uMap.value = target.texture;
    blit.uniforms.uTexel.value.set(1 / target.width, 1 / target.height);
    blit.uniforms.uSharpen.value = sharpen;
  });

  return (
    <mesh material={blit} frustumCulled={false} renderOrder={renderOrder}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

function ScreenShaderDirect({
  material,
  input,
  reducedMotion,
  renderOrder,
}: {
  material: ShaderMaterial;
  input: InputRef;
  reducedMotion: boolean;
  renderOrder: number;
}) {
  useScreenShaderUniforms(material, input, reducedMotion);

  return (
    <mesh material={material} frustumCulled={false} renderOrder={renderOrder}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export function ScreenShader({
  fragmentShader,
  uniforms,
  input,
  reducedMotion,
  renderOrder = -10,
  resolution = SCREEN_SHADER_RESOLUTION,
}: ScreenShaderProps) {
  const tier = useTier();
  const { scale, sharpen } = resolution[tier];
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: GLSL_SCREEN_VERTEX,
        fragmentShader: GLSL_SCREEN_HEADER + fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uScroll: { value: 0 },
          uPointer: { value: new Vector2() },
          uTier: { value: 0 },
          ...uniforms,
        },
        depthWrite: false,
        depthTest: false,
      }),
    [fragmentShader, uniforms],
  );

  useEffect(() => () => material.dispose(), [material]);

  if (scale < 1) {
    return (
      <ScreenShaderScaled
        material={material}
        input={input}
        reducedMotion={reducedMotion}
        resolutionScale={scale}
        sharpen={sharpen}
        renderOrder={renderOrder}
      />
    );
  }
  return (
    <ScreenShaderDirect
      material={material}
      input={input}
      reducedMotion={reducedMotion}
      renderOrder={renderOrder}
    />
  );
}
