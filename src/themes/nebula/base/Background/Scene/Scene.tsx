import { Canvas } from "@react-three/fiber";
import { memo, useEffect, useState } from "react";
import BigNebula from "./BigNebula";
import CHENParticles from "./CHENParticles";
import ParticleField from "./ParticleField";
import { ensureMouseListener } from "./sharedMouse";
import { ensureScrollListener } from "./sharedScroll";

interface SceneProps {
  showSignature?: boolean;
}

function SceneInner({ showSignature = false }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ensureMouseListener();
    ensureScrollListener();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="always"
      events={undefined}
      style={{
        position: "absolute",
        inset: 0,
        opacity: mounted ? 1 : 0,
        transition: "opacity 600ms ease-out",
      }}
    >
      {/* 黑底 Canvas */}
      <color attach="background" args={["#000000"]} />
      {/* 星云球 */}
      <BigNebula />
      {/* 视差粒子 */}
      <ParticleField />
      {/* 粒子签名（ home 页面的 Hero section ） */}
      {showSignature && <CHENParticles />}
    </Canvas>
  );
}

export default memo(SceneInner);
