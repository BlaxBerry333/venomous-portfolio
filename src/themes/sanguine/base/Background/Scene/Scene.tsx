import { Canvas } from "@react-three/fiber";
import { memo, useEffect, useState } from "react";
import BloodDrops from "./BloodDrops";

const REDUCED =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface SceneProps {
  mobile?: boolean;
}

function SceneInner({ mobile = false }: SceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Canvas
      dpr={mobile ? [1, 1] : [1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={REDUCED ? "demand" : "always"}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: mounted ? 1 : 0,
        transition: "opacity 600ms ease-out",
      }}
    >
      <BloodDrops />
    </Canvas>
  );
}

export default memo(SceneInner);
