import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sharedMouse } from "./sharedMouse";
import { sharedScroll } from "./sharedScroll";
import { useCircleTexture } from "./useCircleTexture";

// 视差粒子层：1500 粒子球壳 [3,12] 内随机；跟鼠标转 + 滚动线性收缩
// 70% 白 / 18% cyan / 12% magenta，圆形 sprite 贴图避免方块

const COUNT = 1500;

export default function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const circleTex = useCircleTexture();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const pick = Math.random();
      let r = 1,
        g = 1,
        b = 1;
      if (pick < 0.18) {
        r = 0.17;
        g = 0.94;
        b = 1.0; // cyan #2bf0ff
      } else if (pick < 0.3) {
        r = 0.84;
        g = 0.23;
        b = 1.0; // magenta #d63aff
      }
      arr[i * 3 + 0] = r;
      arr[i * 3 + 1] = g;
      arr[i * 3 + 2] = b;
    }
    return arr;
  }, []);

  const origPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = sharedScroll.progress;

    targetRot.current.y = sharedMouse.x * 0.35 + Math.sin(t * 0.05) * 0.04;
    targetRot.current.x = -sharedMouse.y * 0.22 + Math.cos(t * 0.06) * 0.03;
    ref.current.rotation.y += (targetRot.current.y - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (targetRot.current.x - ref.current.rotation.x) * 0.05;

    const factor = 1.0 + p * 0.2;
    const geom = ref.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = origPositions[i * 3 + 0] * factor;
      arr[i * 3 + 1] = origPositions[i * 3 + 1] * factor;
      arr[i * 3 + 2] = origPositions[i * 3 + 2] * factor;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false} renderOrder={10}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        map={circleTex ?? undefined}
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
