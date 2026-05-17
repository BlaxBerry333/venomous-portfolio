import { Html, Line, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import GravityNodeView from "./GravityNode";
import { GRAVITY, type GravityNode } from "./types";

interface SceneProps {
  primary: GravityNode[];
  secondary: GravityNode[];
  primaryPositions: Array<[number, number, number]>;
  secondaryPositions: Array<[number, number, number]>;
  selectedId: string | null;
  onSelect: (n: GravityNode) => void;
}

// 必须是 Canvas 子组件才能用 useFrame —— 单独文件而非内联
export default function GravityScene({
  primary,
  secondary,
  primaryPositions,
  secondaryPositions,
  selectedId,
  onSelect,
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!selectedId) groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <>
      {/* N/S 中轴 —— 穿球纵轴 + 延伸到球外，两端 N/S 标签。
          放在 group 外：不跟自转，是固定视觉锚点。 */}
      <Line
        points={[
          [0, -GRAVITY.poleAxisExtent, 0],
          [0, GRAVITY.poleAxisExtent, 0],
        ]}
        color="#94a3b8"
        lineWidth={1}
        transparent
        opacity={0.35}
      />
      <Html
        position={[0, GRAVITY.poleAxisExtent, 0]}
        center
        distanceFactor={6}
        wrapperClass="nebula--GravityGraph__node-html"
      >
        <span className="nebula--GravityGraph__pole">N</span>
      </Html>
      <Html
        position={[0, -GRAVITY.poleAxisExtent, 0]}
        center
        distanceFactor={6}
        wrapperClass="nebula--GravityGraph__node-html"
      >
        <span className="nebula--GravityGraph__pole">S</span>
      </Html>

      <group ref={groupRef}>
        {/* 中心核：透明 wireframe 球 + 内含发光小球 */}
        <Sphere args={[0.55, 24, 24]}>
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
        </Sphere>
        <Sphere args={[0.22, 16, 16]}>
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#f0abfc"
            emissiveIntensity={0.8}
            transparent
            opacity={0.55}
          />
        </Sphere>

        {/* 内/外轨道 wireframe */}
        <Sphere args={[1.4, 18, 18]}>
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
        </Sphere>
        <Sphere args={[2.4, 20, 20]}>
          <meshBasicMaterial color="#f0abfc" wireframe transparent opacity={0.14} />
        </Sphere>

        {/* 节点 —— 选中的不 unmount，而是 fade+scale out */}
        {primary.map((n, i) => (
          <GravityNodeView
            key={n.id}
            pos={primaryPositions[i]}
            color="#22d3ee"
            opacity={0.32}
            node={n}
            hidden={selectedId === n.id}
            onSelect={() => onSelect(n)}
          />
        ))}
        {secondary.map((n, i) => (
          <GravityNodeView
            key={n.id}
            pos={secondaryPositions[i]}
            color="#f0abfc"
            opacity={0.2}
            node={n}
            hidden={selectedId === n.id}
            onSelect={() => onSelect(n)}
          />
        ))}
      </group>
    </>
  );
}
