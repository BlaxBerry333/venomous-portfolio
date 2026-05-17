import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Void preview shader：always-on GLSL 顶点波纹 + 片元 RGB 色散
// 切换图时（imageUrl 变化）r3f Suspense 自动处理纹理加载
// reduced-motion 直接降级成静态 <img>

interface Props {
  imageUrl: string;
  /** 顶点波纹强度，默认 0.22（基础轻动），切换瞬间可临时拉高让动效更明显 */
  strength?: number;
}

function ShaderPlane({ imageUrl, strength = 0.22 }: { imageUrl: string; strength?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture(imageUrl);

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += 0.016;
    // 平滑跟随 strength 变化
    const cur = matRef.current.uniforms.uStrength.value;
    matRef.current.uniforms.uStrength.value = cur + (strength - cur) * 0.08;
  });

  return (
    <mesh>
      <planeGeometry args={[2.6, 1.65, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTexture: { value: texture },
          uStrength: { value: strength },
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          uniform float uStrength;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 p = position;
            float wave = sin(p.x * 4.0 + uTime * 1.5) * cos(p.y * 4.0 + uTime * 1.0);
            p.z += wave * uStrength * 0.4;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uTexture;
          uniform float uStrength;
          void main() {
            vec2 uv = vUv;
            float r = texture2D(uTexture, uv + vec2(uStrength * 0.02, 0.0)).r;
            float g = texture2D(uTexture, uv).g;
            float b = texture2D(uTexture, uv - vec2(uStrength * 0.02, 0.0)).b;
            gl_FragColor = vec4(r, g, b, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function VoidShaderImage({ imageUrl, strength = 0.22 }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          position: "absolute",
          inset: 0,
        }}
      />
    );
  }

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 1.2], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        events={undefined}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ShaderPlane imageUrl={imageUrl} strength={strength} />
        </Suspense>
      </Canvas>
    </div>
  );
}
