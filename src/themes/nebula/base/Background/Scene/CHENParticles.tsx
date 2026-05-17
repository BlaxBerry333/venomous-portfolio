import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ensureMouseListener, sharedMouse } from "./sharedMouse";
import { sharedScroll } from "./sharedScroll";
import { useCircleTexture } from "./useCircleTexture";

// CHEN 粒子签名（前景）
// 启动：从字形周围球壳飞入聚拢
// 稳态：抖动 + 鼠标斥力
// 滚动 0.02→0.25：沿径向消散；0.05→0.24 opacity 淡到 0

const CHEN_PARTICLE_COUNT_DESKTOP = 8000;
const CHEN_PARTICLE_COUNT_MOBILE = 3500;
const CHEN_REPULSE_RADIUS = 0.8;
const CHEN_REPULSE_STRENGTH = 0.7;
const CHEN_Z_PLANE = 3.0;
const CHEN_CAM_FOV = 55;
const MOBILE_BREAKPOINT = 768;

function sampleCHENPositions(
  letterSize: number,
  letterGap: number,
  count: number,
): Float32Array | null {
  const rows = [["C", "H", "E", "N"]];
  const rowCount = rows.length;
  const colCount = rows[0].length;
  const cellPx = 256;
  const fontSize = cellPx * 0.85;

  type LetterSample = {
    pts: [number, number][];
    bboxLeft: number;
    bboxRight: number;
    bboxTop: number;
    bboxBottom: number;
  };
  const sampleLetter = (ch: string): LetterSample | null => {
    const c = document.createElement("canvas");
    c.width = cellPx;
    c.height = cellPx;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ch, cellPx / 2, cellPx / 2);
    const data = ctx.getImageData(0, 0, cellPx, cellPx).data;
    const pts: [number, number][] = [];
    let bboxLeft = cellPx,
      bboxRight = 0,
      bboxTop = cellPx,
      bboxBottom = 0;
    for (let y = 0; y < cellPx; y += 2) {
      for (let x = 0; x < cellPx; x += 2) {
        const a = data[(y * cellPx + x) * 4 + 3];
        if (a > 128) {
          pts.push([x, y]);
          if (x < bboxLeft) bboxLeft = x;
          if (x > bboxRight) bboxRight = x;
          if (y < bboxTop) bboxTop = y;
          if (y > bboxBottom) bboxBottom = y;
        }
      }
    }
    return pts.length ? { pts, bboxLeft, bboxRight, bboxTop, bboxBottom } : null;
  };

  const cells: LetterSample[][] = [];
  for (let r = 0; r < rowCount; r++) {
    const row: LetterSample[] = [];
    for (let c = 0; c < colCount; c++) {
      const sampled = sampleLetter(rows[r][c]);
      if (!sampled) return null;
      row.push(sampled);
    }
    cells.push(row);
  }

  const cellStride = 2 * letterSize + letterGap;
  const blockW = (colCount - 1) * cellStride + 2 * letterSize;
  const blockH = (rowCount - 1) * cellStride + 2 * letterSize;
  const startX = -blockW / 2 + letterSize;
  const startY = blockH / 2 - letterSize;

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const slotIdx = i % (rowCount * colCount);
    const r = Math.floor(slotIdx / colCount);
    const c = slotIdx % colCount;
    const cell = cells[r][c];
    const [px, py] = cell.pts[Math.floor(Math.random() * cell.pts.length)];
    const bboxMidX = (cell.bboxLeft + cell.bboxRight) / 2;
    const bboxHalfX = (cell.bboxRight - cell.bboxLeft) / 2 || 1;
    const bboxMidY = (cell.bboxTop + cell.bboxBottom) / 2;
    const bboxHalfY = (cell.bboxBottom - cell.bboxTop) / 2 || 1;
    const localX = ((px - bboxMidX) / bboxHalfX) * letterSize;
    const localY = -((py - bboxMidY) / bboxHalfY) * letterSize;
    out[i * 3] = localX + startX + c * cellStride;
    out[i * 3 + 1] = localY + startY - r * cellStride;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return out;
}

export default function CHENParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const sprite = useCircleTexture();

  useEffect(() => {
    ensureMouseListener();
  }, []);

  const computeLetterSize = () => {
    if (typeof window === "undefined") return 0.6;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspect = vw / vh;
    const planeDist = 6 - CHEN_Z_PLANE;
    const visibleH = 2 * planeDist * Math.tan((Math.PI / 180) * (CHEN_CAM_FOV / 2));
    const visibleW = visibleH * aspect;
    // CHEN 共 4 字母，块宽 = 3*(2*size + gap) + 2*size = 6.54*size（gap = size*0.18）
    // 让块宽 = visibleW * 0.78 → size = visibleW * 0.78 / 6.54
    const target = (visibleW * 0.78) / 6.54;
    return Math.max(0.18, Math.min(0.6, target));
  };

  const [letterSize, setLetterSize] = useState(computeLetterSize);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );

  useEffect(() => {
    const onResize = () => {
      const next = computeLetterSize();
      setLetterSize((prev) => (Math.abs(prev - next) > 0.02 ? next : prev));
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const count = isMobile ? CHEN_PARTICLE_COUNT_MOBILE : CHEN_PARTICLE_COUNT_DESKTOP;

  const buildGeometry = useCallback((size: number, count: number) => {
    const letterGap = size * 0.18;
    const targets = sampleCHENPositions(size, letterGap, count);
    const targetArr = targets ?? new Float32Array(count * 3);

    const target = new Float32Array(count * 3);
    const start = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const disp = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const tx = targetArr[i * 3];
      const ty = targetArr[i * 3 + 1];
      const tz = targetArr[i * 3 + 2] + CHEN_Z_PLANE;
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;

      const offsetR = 4 + Math.random() * 3;
      const offsetTheta = Math.random() * Math.PI * 2;
      const offsetPhi = (Math.random() - 0.5) * (Math.PI / 1.5);
      start[i * 3] = tx + Math.cos(offsetTheta) * Math.cos(offsetPhi) * offsetR;
      start[i * 3 + 1] = ty + Math.sin(offsetPhi) * offsetR;
      start[i * 3 + 2] = tz + Math.sin(offsetTheta) * Math.cos(offsetPhi) * offsetR * 0.4;

      const pick = Math.random();
      let r = 1,
        g = 1,
        b = 1;
      if (pick < 0.18) {
        r = 0.17;
        g = 0.94;
        b = 1.0;
      } else if (pick < 0.3) {
        r = 0.84;
        g = 0.23;
        b = 1.0;
      }
      col[i * 3] = r;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;

      const r2 = Math.sqrt(tx * tx + ty * ty) || 0.001;
      const baseDx = tx / r2;
      const baseDy = ty / r2;
      const jitterAng = (Math.random() - 0.5) * (Math.PI / 3);
      const ca = Math.cos(jitterAng);
      const sa = Math.sin(jitterAng);
      disp[i * 3] = baseDx * ca - baseDy * sa;
      disp[i * 3 + 1] = baseDx * sa + baseDy * ca;
      disp[i * 3 + 2] = (Math.random() - 0.3) * 0.6;
    }

    return {
      startPos: start,
      targetPos: target,
      colors: col,
      dispersionDir: disp,
    };
  }, []);

  const { startPos, targetPos, colors, dispersionDir } = useMemo(
    () => buildGeometry(letterSize, count),
    [buildGeometry, letterSize, count],
  );

  const startTime = useRef<number | null>(null);
  const STARTUP_MS = 900;

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const now = state.clock.getElapsedTime() * 1000;
    if (startTime.current === null) startTime.current = now;
    const elapsed = now - startTime.current;
    const startupT = Math.min(elapsed / STARTUP_MS, 1);

    const scroll = sharedScroll.progress;
    const ss = THREE.MathUtils.smoothstep(scroll, 0.02, 0.25);
    const disperse = ss;

    if (matRef.current) {
      const fade = 1 - THREE.MathUtils.smoothstep(scroll, 0.05, 0.24);
      matRef.current.opacity = fade;
    }

    const arr = points.geometry.attributes.position.array as Float32Array;
    const cam = state.camera;
    const planeDist = cam.position.z - CHEN_Z_PLANE;
    const visibleH = 2 * planeDist * Math.tan((Math.PI / 180) * (CHEN_CAM_FOV / 2));
    const visibleW = (visibleH * state.size.width) / state.size.height;
    const mx = sharedMouse.x * (visibleW / 2);
    const my = sharedMouse.y * (visibleH / 2);

    const MAX_DISPERSE_DIST = 4.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const sx = startPos[i3];
      const sy = startPos[i3 + 1];
      const sz = startPos[i3 + 2];
      const tx = targetPos[i3];
      const ty = targetPos[i3 + 1];
      const tz = targetPos[i3 + 2];

      let baseX = sx + (tx - sx) * startupT;
      let baseY = sy + (ty - sy) * startupT;
      let baseZ = sz + (tz - sz) * startupT;

      if (startupT >= 1 && disperse > 0.001) {
        const dist = disperse * MAX_DISPERSE_DIST;
        baseX = tx + dispersionDir[i3] * dist;
        baseY = ty + dispersionDir[i3 + 1] * dist;
        baseZ = tz + dispersionDir[i3 + 2] * dist;

        const jitter = Math.sin(now * 0.003 + i * 0.7) * 0.012 * disperse;
        baseX += jitter;
        baseY += jitter * 0.7;
      } else if (startupT >= 1) {
        if (sharedMouse.active) {
          const repulseRadius = isMobile ? CHEN_REPULSE_RADIUS * 0.5 : CHEN_REPULSE_RADIUS;
          const repulseStrength = isMobile ? CHEN_REPULSE_STRENGTH * 0.35 : CHEN_REPULSE_STRENGTH;
          const dx = tx - mx;
          const dy = ty - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulseRadius) {
            const f = (1 - dist / repulseRadius) * repulseStrength;
            baseX += (dx / (dist || 1)) * f;
            baseY += (dy / (dist || 1)) * f;
          }
        }
        const jitter = Math.sin(now * 0.005 + i) * 0.006;
        baseX += jitter;
        baseY += jitter;
      }

      arr[i3] += (baseX - arr[i3]) * 0.12;
      arr[i3 + 1] += (baseY - arr[i3 + 1]) * 0.12;
      arr[i3 + 2] += (baseZ - arr[i3 + 2]) * 0.12;
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      key={`${count}-${letterSize.toFixed(2)}`}
      ref={pointsRef}
      frustumCulled={false}
      renderOrder={20}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[startPos, 3]}
          count={count}
          array={startPos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        vertexColors
        map={sprite ?? undefined}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
