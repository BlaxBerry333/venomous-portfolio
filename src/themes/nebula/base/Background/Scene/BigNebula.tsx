import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { sharedMouse } from "./sharedMouse";
import { sharedScroll } from "./sharedScroll";

// 大星云球（主角）：sphere BackSide + fbm shader 域扭曲 + cyan/magenta/white 三色
// 所有时间项必须用 sin/cos 包成有界振荡，禁止 t * K 单调累积

export default function BigNebula() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uScroll.value = sharedScroll.progress;
    }
    if (groupRef.current) {
      const targetY = sharedMouse.x * 0.2;
      const targetX = -sharedMouse.y * 0.12;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[5.5, 128, 128]} />
        <shaderMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uCyan: { value: new THREE.Color("#2bf0ff") },
            uMagenta: { value: new THREE.Color("#d63aff") },
            uWhite: { value: new THREE.Color("#ffffff") },
          }}
          vertexShader={`
            varying vec3 vPos;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              vPos = position;
              vNormal = normalize(normalMatrix * normal);
              vViewDir = normalize(-mvPos.xyz);
              gl_Position = projectionMatrix * mvPos;
            }
          `}
          fragmentShader={`
            varying vec3 vPos;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            uniform float uTime;
            uniform float uScroll;
            uniform vec3 uCyan;
            uniform vec3 uMagenta;
            uniform vec3 uWhite;

            float hash(vec3 p){p=fract(p*vec3(443.897,441.423,437.195));p+=dot(p,p.yzx+19.19);return fract((p.x+p.y)*p.z);}
            float vnoise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
            float fbm(vec3 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*vnoise(p);p*=2.03;a*=0.5;}return v;}

            void main() {
              vec3 dir = normalize(vPos);
              float t = uTime;
              float sA = sin(t * 0.05 + 0.6) * 2.8;
              float sB = cos(t * 0.04 + 2.4) * 2.8;
              float sC = sin(t * 0.045 + 4.9) * 2.4;
              vec3 sampleP = dir * 2.2 + vec3(sA, sB, sC);

              float wA = sin(t * 0.08 + 1.1) * 2.0;
              float wB = cos(t * 0.07 + 3.5) * 2.0;
              float wC = sin(t * 0.06 + 5.8) * 2.0;
              vec3 warp = vec3(
                fbm(sampleP * 0.8 + vec3(wA, 0.0, 0.0)),
                fbm(sampleP * 0.8 + vec3(0.0, wB, 0.0)),
                fbm(sampleP * 0.8 + vec3(0.0, 0.0, wC))
              ) - 0.5;

              float n = fbm(sampleP + warp * 1.2);

              float density = smoothstep(0.38, 0.62, n) - smoothstep(0.82, 1.05, n);
              density = max(density, 0.0);

              vec3 col = mix(uMagenta, uCyan, smoothstep(0.4, 0.7, n));
              col = mix(col, uWhite, smoothstep(0.78, 0.95, n));

              float facing = abs(dot(normalize(vNormal), normalize(vViewDir)));
              float edge = smoothstep(0.05, 0.55, facing) * smoothstep(0.0, 0.3, facing);

              float intro = smoothstep(0.0, 1.5, t);
              float scrollFade = 1.0 - uScroll * 0.35;
              float alpha = density * 0.85 * edge * scrollFade * intro;

              gl_FragColor = vec4(col * (0.85 + n * 0.5), alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
