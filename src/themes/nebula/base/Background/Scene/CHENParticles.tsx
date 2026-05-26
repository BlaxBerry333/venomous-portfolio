import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ensureMouseListener, sharedMouse } from "./sharedMouse";
import { sharedScroll } from "./sharedScroll";
import { useCircleTexture } from "./useCircleTexture";

const CHEN_PARTICLE_COUNT_DESKTOP = 14000;
const CHEN_PARTICLE_COUNT_MOBILE = 5000;
const CHEN_POINT_SIZE_DESKTOP = 0.04;
const CHEN_POINT_SIZE_MOBILE = 0.026;
const CHEN_REPULSE_RADIUS = 0.8;
const CHEN_REPULSE_STRENGTH = 0.7;
const CHEN_Z_PLANE = 3.0;
const CHEN_CAM_FOV = 55;
const MOBILE_BREAKPOINT = 768;

// Hero 文本配置：两行 PORTFOLIO + CHEN
//   desktop: 两行等大（sizeScale 都 1.0）
//   mobile:  PORTFOLIO 缩到 50%（9 字母放不下），CHEN 保持 1.0 作主字
type RowSpec = { chars: string[]; sizeScale: number };
const PORTFOLIO_CHARS = ["P", "O", "R", "T", "F", "O", "L", "I", "O"];
const CHEN_CHARS = ["C", "H", "E", "N"];
const ROWS_DESKTOP: RowSpec[] = [
  { chars: PORTFOLIO_CHARS, sizeScale: 1.0 },
  { chars: CHEN_CHARS, sizeScale: 1.0 },
];
const ROWS_MOBILE: RowSpec[] = [
  { chars: PORTFOLIO_CHARS, sizeScale: 0.5 },
  { chars: CHEN_CHARS, sizeScale: 1.0 },
];
// 行间距 / 字间距 desktop = mobile 共用；TARGET_VW_RATIO 仅区分 desktop/mobile 占视宽
const INTER_ROW_GAP_SCALE = 0.4;
const LETTER_GAP_SCALE = 0.22; // 改按字母真实宽度排版后，0.18 偏挤；放到 0.22 视觉更稳
const TARGET_VW_RATIO_DESKTOP = 0.78; // PC 撑到 78% 视宽，留两侧呼吸
const TARGET_VW_RATIO_MOBILE = 0.85;
const LETTER_SIZE_MIN = 0.13;
const LETTER_SIZE_MAX = 0.65; // 上限放宽：宽屏 PC 不再被 0.5 卡死

type LetterSample = {
  pts: [number, number][];
  bboxLeft: number;
  bboxRight: number;
  bboxTop: number;
  bboxBottom: number;
};

function sampleLetter(ch: string, cellPx: number): LetterSample | null {
  const c = document.createElement("canvas");
  c.width = cellPx;
  c.height = cellPx;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.font = `900 ${cellPx * 0.85}px system-ui, sans-serif`;
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
}

// char → bbox 宽高比缓存（halfX / halfY）。
//   sampleLetter 已能拿到 bbox，但 computeLetterSize 需要在采样前预估行宽；
//   把宽高比缓存一次，computeLetterSize 与 sampleHeroPositions 共享同一份数据。
const aspectCache = new Map<string, number>();
function getCharAspect(ch: string): number {
  const cached = aspectCache.get(ch);
  if (cached !== undefined) return cached;
  if (typeof document === "undefined") return 0.7;
  const s = sampleLetter(ch, 128);
  if (!s) {
    aspectCache.set(ch, 0.7);
    return 0.7;
  }
  const ar = (s.bboxRight - s.bboxLeft) / (s.bboxBottom - s.bboxTop || 1);
  // 注意：bbox 宽 / bbox 高 = (2*halfX) / (2*halfY) = halfX/halfY，跟 2*halfW = 2*size*aspect 对齐
  aspectCache.set(ch, ar);
  return ar;
}

// 多行 sample：base letter size 控制 PORTFOLIO 行；CHEN 行按 sizeScale 缩放
//   排版按字母真实宽度（aspect-based halfW），保证字间空白一致——
//   旧实现用等宽 cell（2*size），窄字 "I/L/T" 在 cell 中留白多，看上去"间距忽宽忽窄"。
function sampleHeroPositions(
  rows: RowSpec[],
  baseLetterSize: number,
  count: number,
): Float32Array | null {
  const letterGapScale = LETTER_GAP_SCALE;
  const interRowGapScale = INTER_ROW_GAP_SCALE;
  type Cell = {
    sample: LetterSample;
    size: number; // 字母"半高"（世界单位）
    halfW: number; // 字母"半宽"（aspect × size）
    scale: number; // bbox → 世界单位的等比缩放
    area: number; // 真实字形 bbox 面积，用于粒子加权
    centerX: number;
    centerY: number;
  };
  const cellPx = 256;

  // 1. 每行 letterSize + 总块高
  const rowSizes = rows.map((r) => baseLetterSize * r.sizeScale);
  const interRowGap = baseLetterSize * interRowGapScale;
  let totalHeight = 0;
  for (let r = 0; r < rows.length; r++) {
    totalHeight += 2 * rowSizes[r];
    if (r < rows.length - 1) totalHeight += interRowGap;
  }

  // 2. 扁平化 cells，按真实字宽排版
  const flatCells: Cell[] = [];
  let yTop = totalHeight / 2;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const size = rowSizes[r];
    const letterGap = size * letterGapScale;

    // 先 sample 整行 + 计算各字 halfW
    const sampled = row.chars.map((ch) => sampleLetter(ch, cellPx));
    if (sampled.some((s) => s === null)) return null;
    const perChar = sampled.map((s) => {
      const sNonNull = s as LetterSample;
      const halfX = (sNonNull.bboxRight - sNonNull.bboxLeft) / 2;
      const halfY = (sNonNull.bboxBottom - sNonNull.bboxTop) / 2 || 1;
      const scale = size / halfY; // 按高度归一化
      return { sample: sNonNull, halfW: halfX * scale, scale };
    });

    // 行总宽 = Σ(2*halfW) + (n-1)*letterGap
    const rowWidth =
      perChar.reduce((acc, p) => acc + 2 * p.halfW, 0) + (row.chars.length - 1) * letterGap;
    const rowCenterY = yTop - size;

    // 摆放：xCursor 从左边推进
    let xCursor = -rowWidth / 2;
    for (let c = 0; c < perChar.length; c++) {
      const p = perChar[c];
      const centerX = xCursor + p.halfW;
      flatCells.push({
        sample: p.sample,
        size,
        halfW: p.halfW,
        scale: p.scale,
        area: 2 * p.halfW * 2 * size, // 真实字形 bbox 面积
        centerX,
        centerY: rowCenterY,
      });
      xCursor += 2 * p.halfW + letterGap;
    }

    yTop -= 2 * size + interRowGap;
  }

  // 3. 按 area 加权分配粒子
  //    用真实字形面积权重，窄字（I/L/T）少粒子，宽字（O/R/H）多粒子——
  //    粒子密度（颗/面积）在所有字母上一致，视觉重量平衡。
  const totalArea = flatCells.reduce((s, c) => s + c.area, 0);
  const out = new Float32Array(count * 3);
  let i = 0;
  for (let ci = 0; ci < flatCells.length; ci++) {
    const cell = flatCells[ci];
    const cellCount =
      ci === flatCells.length - 1 ? count - i : Math.round((count * cell.area) / totalArea);
    const bboxMidX = (cell.sample.bboxLeft + cell.sample.bboxRight) / 2;
    const bboxMidY = (cell.sample.bboxTop + cell.sample.bboxBottom) / 2;
    for (let n = 0; n < cellCount && i < count; n++) {
      const [px, py] = cell.sample.pts[Math.floor(Math.random() * cell.sample.pts.length)];
      const localX = (px - bboxMidX) * cell.scale;
      const localY = -(py - bboxMidY) * cell.scale;
      out[i * 3] = localX + cell.centerX;
      out[i * 3 + 1] = localY + cell.centerY;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      i++;
    }
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

  // 按"最长有效行"推 base letterSize：每行 blockW = sizeScale × (2 × Σaspect + (n-1) × LETTER_GAP_SCALE) × base
  //   旧公式假设每字宽 = 2*size（按 O 等宽估算），实际 PORTFOLIO 因含 I/L/T 整行更窄 → letterSize 算偏小 / PC 不撑满。
  //   改用真实 aspect 求和（getCharAspect 缓存），letterSize 推到字形真正"撑满 92% 视宽"的值。
  const computeLetterSize = (rows: RowSpec[], mobile: boolean) => {
    if (typeof window === "undefined") return 0.22;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspect = vw / vh;
    const planeDist = 6 - CHEN_Z_PLANE;
    const visibleH = 2 * planeDist * Math.tan((Math.PI / 180) * (CHEN_CAM_FOV / 2));
    const visibleW = visibleH * aspect;
    const maxBlockWFactor = Math.max(
      ...rows.map((r) => {
        const aspectSum = r.chars.reduce((s, ch) => s + getCharAspect(ch), 0);
        return r.sizeScale * (2 * aspectSum + (r.chars.length - 1) * LETTER_GAP_SCALE);
      }),
    );
    const targetVwRatio = mobile ? TARGET_VW_RATIO_MOBILE : TARGET_VW_RATIO_DESKTOP;
    const target = (visibleW * targetVwRatio) / maxBlockWFactor;
    return Math.max(LETTER_SIZE_MIN, Math.min(LETTER_SIZE_MAX, target));
  };

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );
  const rows = isMobile ? ROWS_MOBILE : ROWS_DESKTOP;
  const [letterSize, setLetterSize] = useState(() => computeLetterSize(rows, isMobile));

  useEffect(() => {
    setLetterSize((prev) => {
      const fresh = computeLetterSize(rows, isMobile);
      return Math.abs(prev - fresh) > 0.005 ? fresh : prev;
    });
    const onResize = () => {
      const nextMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const nextRows = nextMobile ? ROWS_MOBILE : ROWS_DESKTOP;
      const next = computeLetterSize(nextRows, nextMobile);
      setLetterSize((prev) => (Math.abs(prev - next) > 0.015 ? next : prev));
      setIsMobile(nextMobile);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [rows, isMobile]);

  const count = isMobile ? CHEN_PARTICLE_COUNT_MOBILE : CHEN_PARTICLE_COUNT_DESKTOP;

  const buildGeometry = useCallback((rows: RowSpec[], size: number, count: number) => {
    const targets = sampleHeroPositions(rows, size, count);
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
    () => buildGeometry(rows, letterSize, count),
    [buildGeometry, rows, letterSize, count],
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
        size={isMobile ? CHEN_POINT_SIZE_MOBILE : CHEN_POINT_SIZE_DESKTOP}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
