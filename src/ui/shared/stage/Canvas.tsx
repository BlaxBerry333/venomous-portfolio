import { Canvas as FiberCanvas } from "@react-three/fiber";
import { useEffect, useState, type ReactNode } from "react";
import type { Color } from "three";
import "./Canvas.scss";
import { FrameMonitor } from "./FrameMonitor";
import { useDebug } from "./useDebug";
import { InputDriver, type InputRef } from "./useInput";
import { TierContext, tierDpr, tierRead, tierWrite } from "./useTier";

interface CanvasProps {
  background: Color;
  reducedMotion: boolean;
  input: InputRef;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  children: ReactNode;
}

export function Canvas({
  background,
  reducedMotion,
  input,
  cameraPosition = [0, 0, 10],
  cameraFov = 50,
  children,
}: CanvasProps) {
  const [maxDpr] = useState(() => Math.min(1.25, window.devicePixelRatio || 1));
  const { forcedTier, probe } = useDebug();
  const [storedTier] = useState(tierRead);
  const [tier, setTier] = useState(() => forcedTier ?? storedTier);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (forcedTier !== null) setTier(forcedTier);
  }, [forcedTier]);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={ready ? "stage-canvas stage-canvas--ready" : "stage-canvas"} aria-hidden="true">
      <FiberCanvas
        dpr={tierDpr(tier, maxDpr)}
        camera={{ fov: cameraFov, near: 0.1, far: 400, position: cameraPosition }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
      >
        {forcedTier === null && (
          <FrameMonitor
            tier={tier}
            maxInclines={Math.max(1, storedTier, tier)}
            onTier={(next) => {
              tierWrite(next);
              setTier(next);
            }}
          />
        )}
        <InputDriver input={input} reducedMotion={reducedMotion} />
        <color attach="background" args={[background]} />
        <TierContext.Provider value={tier}>
          {probe}
          {children}
        </TierContext.Provider>
      </FiberCanvas>
    </div>
  );
}
