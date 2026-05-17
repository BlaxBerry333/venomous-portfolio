import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./VoidHomeHero.scss";

// §4.1 Void Hero Signature
// r3f points + postprocessing。粒子组成 "CHEN" 字样（canvas2D 文字像素采样）
// 启动 800ms easeOutQuint；稳态：抖动 + 鼠标斥力（半径 1.2 world-unit，强度 0.9）

const PARTICLE_COUNT = 12000;
const REPULSE_RADIUS = 0.85;
const REPULSE_STRENGTH = 0.9;

/**
 * 用 canvas2D 渲染文字（一行或多行），按像素采样得到粒子目标位置。
 * 返回世界坐标列表：
 *   - 单行模式 (lines.length === 1)：x ∈ [-aspect*scale, aspect*scale]，y ∈ [-scale, scale]，aspect=4
 *   - 多行模式：每行同样高度，整体 y 范围按行数扩展（y ∈ [-N*scale, N*scale]）
 *
 * 多行场景下每行单独渲染到 canvas，再把行内 y 偏移到世界坐标的对应槽位。
 */
/**
 * 字母统一字距版本：
 * 把每个字母独立渲染采样，再按"字母方块网格"排布（每行字母数 × 行数）。
 * 水平字距 = 垂直行距 = letterGap，视觉上四向距离一致。
 *
 * 参数：
 *   - rows: 二维数组 [["C","H","E","N"]] 单行 / [["C","H"], ["E","N"]] 两行
 *   - count: 总粒子数
 *   - letterSize: 单字母在世界坐标的"方块边长的一半"（最终方块尺寸 = 2*letterSize）
 *   - letterGap: 字母之间的间距（世界坐标），同时用于水平和垂直
 */
function sampleTextPositions(
  rows: string[][],
  count: number,
  letterSize: number,
  letterGap: number,
) {
  const cellPx = 256; // 单字母采样 canvas 边长
  const fontSize = cellPx * 0.85; // 字号略小于 cell 留 glyph 喘息
  const rowCount = rows.length;
  const colCount = rows[0]?.length ?? 0;
  if (rowCount === 0 || colCount === 0) return null;

  // 每个字母独立采样：返回 pts（cell 坐标 0..cellPx）+ glyph bbox（用于裁掉留白）
  const sampleLetter = (
    ch: string,
  ): {
    pts: [number, number][];
    bboxLeft: number;
    bboxRight: number;
    bboxTop: number;
    bboxBottom: number;
  } | null => {
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

  // 采样所有 (row, col) 字母
  const cells: Array<Array<NonNullable<ReturnType<typeof sampleLetter>>>> = [];
  for (let r = 0; r < rowCount; r++) {
    const row: NonNullable<ReturnType<typeof sampleLetter>>[] = [];
    for (let c = 0; c < colCount; c++) {
      const sampled = sampleLetter(rows[r][c]);
      if (!sampled) return null;
      row.push(sampled);
    }
    cells.push(row);
  }

  // 网格几何：每个 cell 中心间距 = 2*letterSize + letterGap（水平 / 垂直一致）
  const cellStride = 2 * letterSize + letterGap;
  // 整块尺寸（不含外侧边距）：(N-1)*stride + 2*letterSize
  const blockW = (colCount - 1) * cellStride + 2 * letterSize;
  const blockH = (rowCount - 1) * cellStride + 2 * letterSize;
  const startX = -blockW / 2 + letterSize; // 第一列字母中心 x
  const startY = blockH / 2 - letterSize; // 第一行字母中心 y（上→下递减）

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const slotIdx = i % (rowCount * colCount);
    const r = Math.floor(slotIdx / colCount);
    const c = slotIdx % colCount;
    const cell = cells[r][c];
    const [px, py] = cell.pts[Math.floor(Math.random() * cell.pts.length)];
    // 字母 cell 内坐标按 glyph bbox 归一化到 [-letterSize, letterSize]，让每个字母占满其方块
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

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  // 目标位置（"CHEN" 字样采样）+ 启动初始位置（屏外）
  const { positions, originals } = useMemo(() => {
    // 字母方块网格：每个字母独立采样，水平字距 = 垂直行距 = letterGap，视觉上四向间距统一
    // 桌面：1 行 4 列（CHEN）；移动端：2 行 2 列（CH / EN）
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const isMobileLayout = vw < 768;
    const rows: string[][] = isMobileLayout
      ? [
          ["C", "H"],
          ["E", "N"],
        ]
      : [["C", "H", "E", "N"]];
    const rowCount = rows.length;
    const colCount = rows[0].length;
    // letterGap 相对 letterSize 的比例：0.18 ≈ 字体内 kerning 视觉量级
    const letterGapRatio = 0.18;
    // 总块尺寸（letterSize 为单位）：宽 = (colCount-1)*(2+gap) + 2，高 = (rowCount-1)*(2+gap) + 2
    const blockWUnits = (colCount - 1) * (2 + letterGapRatio) + 2;
    const blockHUnits = (rowCount - 1) * (2 + letterGapRatio) + 2;

    let letterSize: number;
    if (vw >= 768) {
      // 桌面：保持原来近似的 CHEN 视觉尺寸 — 单行 4 字 + 0.18 gap，整块宽 = 4*2 + 3*0.18 = 8.54 个 letterSize
      // 之前 scale=0.8 单行宽 ≈ 4*0.8 (xExtentFactor*scale ≈ 2.2) → letterSize ≈ 0.5 让 4 字横向占满相近视觉
      letterSize = 0.55;
    } else {
      const camZ = 5.5;
      const visibleH = 2 * camZ * Math.tan((Math.PI / 180) * 30);
      const visibleW = visibleH * (vw / vh);
      // 块宽 ≤ visibleW × 0.92；块高 ≤ visibleH × 0.92
      const maxByW = (visibleW * 0.92) / blockWUnits;
      const maxByH = (visibleH * 0.92) / blockHUnits;
      letterSize = Math.min(maxByW, maxByH);
    }
    const letterGap = letterGapRatio * letterSize;
    const targets = sampleTextPositions(rows, PARTICLE_COUNT, letterSize, letterGap);
    if (!targets) {
      // fallback：横向带状
      const orig = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        orig[i * 3] = (Math.random() - 0.5) * 4;
        orig[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
        orig[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
      const pos = new Float32Array(orig);
      // 启动期下移
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] -= 4;
        pos[i * 3] += (Math.random() - 0.5) * 6;
      }
      return { positions: pos, originals: orig };
    }
    // 启动位置：从原位置随机散到屏外（给个飞入效果）
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = targets[i * 3] + (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = targets[i * 3 + 1] - 4 - Math.random() * 2;
      pos[i * 3 + 2] = targets[i * 3 + 2];
    }
    return { positions: pos, originals: targets };
  }, []);

  // 鼠标默认 (0,0) NDC = 视口中心，正好砸在 CHEN 上 → 首帧就误触发斥力
  // 等指针真的动一次再开启斥力
  const mouseActive = useRef(false);
  useEffect(() => {
    const onMove = () => {
      mouseActive.current = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onMove);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onMove);
    };
  }, []);

  const startTime = useRef<number | null>(null);
  const STARTUP_MS = 800;

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const now = state.clock.getElapsedTime() * 1000;
    if (startTime.current === null) startTime.current = now;
    const elapsed = now - startTime.current;
    const startupT = Math.min(elapsed / STARTUP_MS, 1);

    const arr = points.geometry.attributes.position.array as Float32Array;
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const ox = originals[i3];
      const oy = originals[i3 + 1];
      const oz = originals[i3 + 2];

      if (startupT < 1) {
        // 启动期：lerp 到原位（系数加大，保证 800ms 内基本到位）
        const k = 0.18;
        arr[i3] += (ox - arr[i3]) * k;
        arr[i3 + 1] += (oy - arr[i3 + 1]) * k;
        arr[i3 + 2] = oz;
      } else {
        // 稳态：抖动 + 鼠标斥力（指针真正移动过才启用）
        let pushX = 0;
        let pushY = 0;
        if (mouseActive.current) {
          const dx = ox - mx;
          const dy = oy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSE_RADIUS) {
            const f = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
            pushX = (dx / (dist || 1)) * f;
            pushY = (dy / (dist || 1)) * f;
          }
        }
        const jitter = Math.sin(now * 0.005 + i) * 0.005;
        const targetX = ox + pushX + jitter;
        const targetY = oy + pushY + jitter;
        arr[i3] += (targetX - arr[i3]) * 0.08;
        arr[i3 + 1] += (targetY - arr[i3 + 1]) * 0.08;
        arr[i3 + 2] = oz;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6BD8E6"
        size={0.025}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function VoidHomeHero() {
  const reduced = useReducedMotion();
  // 防止 SSR / 文字采样失败：等 mount 后渲染
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced) {
    return (
      <div
        style={{
          position: "relative",
          height: "100svh",
          minHeight: 480,
          background: "var(--theme-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <h1
          className="void-hero-reduced-title"
          aria-label="CHEN"
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: "clamp(96px, 22vw, 240px)",
            color: "var(--theme-accent)",
            letterSpacing: "0.05em",
            lineHeight: 0.9,
            textAlign: "center",
            textShadow: "0 0 24px rgba(107,216,230,0.4)",
            margin: 0,
          }}
        >
          {/* 桌面：CHEN 单行（两 span 间空格起合并作用）；移动端：换行符显出来变两行 */}
          <span aria-hidden>CH</span>
          <span aria-hidden className="portfolio__void-home-hero__mobile-break">
            {" "}
          </span>
          <span aria-hidden>EN</span>
        </h1>
      </div>
    );
  }

  return (
    <div
      aria-label="Hero signature visualization (decorative)"
      style={{
        position: "relative",
        // svh 兜底 iOS 浏览器底部地址栏遮挡；最低 480px 兜底超矮屏
        height: "100svh",
        minHeight: 480,
        // Hero 自身上 80% 不透明深空黑，底部 20% 渐变到透明，让星尘场穿过来与下方内容融合
        background:
          "linear-gradient(to bottom, #05060A 0%, #05060A 70%, rgba(5,6,10,0.6) 88%, transparent 100%)",
        overflow: "hidden",
        // mask 配合：底部 20% 自身也淡出（让 Canvas 一起溶解），与 background 渐变叠加 = 完全无硬边
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.5) 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.5) 88%, transparent 100%)",
      }}
    >
      {mounted && (
        <Canvas
          aria-hidden
          // 窄屏拉远 camera，避免文本横向溢出（CHEN 采样 aspect=4 在竖屏会爆）
          camera={{
            position: [0, 0, typeof window !== "undefined" && window.innerWidth < 768 ? 5.5 : 3],
            fov: 60,
          }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ParticleField />
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
          </EffectComposer>
        </Canvas>
      )}

      {/* 副标题 (DOM 层) — 标题"CHEN"已用粒子绘制，这里只放副标题 */}
      <div
        className="portfolio__void-home-hero__subtitle"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "12vh",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 14,
            color: "var(--theme-accent)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            textShadow: "0 0 8px rgba(107,216,230,0.5)",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          WELCOME TO MY PORTFOLIO
        </p>
      </div>
    </div>
  );
}
