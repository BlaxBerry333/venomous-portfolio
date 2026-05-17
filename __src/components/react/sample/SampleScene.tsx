import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ensureMouseListener, sharedMouse } from "./sharedMouse";

// =====================================================================
// Sample — 星云主场景 + CHEN 粒子签名
// 星云占主导，CHEN 粒子在前景叠加；滚动时粒子沿径向向外消散
// 所有时间项必须用 sin/cos 包成有界振荡，禁止 t * K 单调累积
// =====================================================================

function useMouse() {
  useEffect(() => {
    ensureMouseListener();
  }, []);
}

// ---------------------------------------------------------------------
// 大星云球（主角）—— 高饱和度、慢翻涌、跟鼠标转
// ---------------------------------------------------------------------
function BigNebula({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uScroll.value = scrollRef.current;
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
              // 关键：相位加常数 offset 拉开（值跨整圆 2π 不重复）+ 加大幅度
              // 让 t=0 时 sA/sB/sC 落到差异极大的位置
              float sA = sin(t * 0.05 + 0.6) * 2.8;
              float sB = cos(t * 0.04 + 2.4) * 2.8;
              float sC = sin(t * 0.045 + 4.9) * 2.4;
              // 基础采样坐标乘子从 1.5 提到 2.2，采样频率更高、相邻像素差异更大
              vec3 sampleP = dir * 2.2 + vec3(sA, sB, sC);

              // 域扭曲 —— 偏移相位跨整圆 + 幅度加大
              float wA = sin(t * 0.08 + 1.1) * 2.0;
              float wB = cos(t * 0.07 + 3.5) * 2.0;
              float wC = sin(t * 0.06 + 5.8) * 2.0;
              vec3 warp = vec3(
                fbm(sampleP * 0.8 + vec3(wA, 0.0, 0.0)),
                fbm(sampleP * 0.8 + vec3(0.0, wB, 0.0)),
                fbm(sampleP * 0.8 + vec3(0.0, 0.0, wC))
              ) - 0.5;

              float n = fbm(sampleP + warp * 1.2);

              // 收紧 density 阈值：noise 中段才显示，避免大片覆盖
              float density = smoothstep(0.38, 0.62, n) - smoothstep(0.82, 1.05, n);
              density = max(density, 0.0);

              vec3 col = mix(uMagenta, uCyan, smoothstep(0.4, 0.7, n));
              col = mix(col, uWhite, smoothstep(0.78, 0.95, n));

              float facing = abs(dot(normalize(vNormal), normalize(vViewDir)));
              float edge = smoothstep(0.05, 0.55, facing) * smoothstep(0.0, 0.3, facing);

              // 入场淡入：前 1.5s 整体 alpha 从 0 渐入，避免 t=0 闪屏
              float intro = smoothstep(0.0, 1.5, t);

              // 滚动线性微调：星云稍微变淡但仍主导
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

// ---------------------------------------------------------------------
// 3) 视差粒子（保持轻量、跟鼠标）
// ---------------------------------------------------------------------
// 生成径向渐变的圆形 sprite 纹理（让粒子永远是软边圆点，不再是方块）
function useCircleTexture(): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const half = size / 2;
    // 径向渐变：中心白不透 → 边缘透明
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// ---------------------------------------------------------------------
// CHEN 粒子签名 —— 参考 void hero
// 启动：从屏外飞入聚成 CHEN
// 稳态：抖动 + 鼠标斥力
// 滚动 0→1：每颗粒子沿径向向外消散，opacity 衰减
// ---------------------------------------------------------------------
const CHEN_PARTICLE_COUNT = 8000;
const CHEN_REPULSE_RADIUS = 0.8;
const CHEN_REPULSE_STRENGTH = 0.7;
// CHEN 平面 z 坐标 —— 相机 z=6，放在 z=3.0 给前景距离；不和 ParticleField 最近粒子 r=3 严重冲突
const CHEN_Z_PLANE = 3.0;
const CHEN_CAM_FOV = 55;

function sampleCHENPositions(letterSize: number, letterGap: number): Float32Array | null {
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

  const out = new Float32Array(CHEN_PARTICLE_COUNT * 3);
  for (let i = 0; i < CHEN_PARTICLE_COUNT; i++) {
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

function CHENParticles({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const sprite = useCircleTexture();

  useEffect(() => {
    ensureMouseListener();
  }, []);

  // 字形目标位置 + 启动初始位置（屏外飞入）+ 颜色 + 每粒消散方向（径向单位向量 + 随机扰动）
  const { startPos, targetPos, colors, dispersionDir } = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const isMobile = vw < 768;
    const letterSize = isMobile ? 0.4 : 0.6;
    const letterGap = letterSize * 0.18;
    const targets = sampleCHENPositions(letterSize, letterGap);
    const targetArr = targets ?? new Float32Array(CHEN_PARTICLE_COUNT * 3);

    const target = new Float32Array(CHEN_PARTICLE_COUNT * 3);
    const start = new Float32Array(CHEN_PARTICLE_COUNT * 3);
    const col = new Float32Array(CHEN_PARTICLE_COUNT * 3);
    // 每粒在消散时的运动方向单位向量（径向 + 随机扰动，更像爆散）
    const disp = new Float32Array(CHEN_PARTICLE_COUNT * 3);

    for (let i = 0; i < CHEN_PARTICLE_COUNT; i++) {
      const tx = targetArr[i * 3];
      const ty = targetArr[i * 3 + 1];
      const tz = targetArr[i * 3 + 2] + CHEN_Z_PLANE;
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;

      // 启动位置：从字形位置沿径向往外推，形成"四周→中央聚拢"效果
      // 每粒在以字形为中心的球面上散布，距离 4~7 个单位
      const offsetR = 4 + Math.random() * 3;
      const offsetTheta = Math.random() * Math.PI * 2;
      // ±60° 上下扩展（不是完全平面）
      const offsetPhi = (Math.random() - 0.5) * (Math.PI / 1.5);
      start[i * 3] = tx + Math.cos(offsetTheta) * Math.cos(offsetPhi) * offsetR;
      start[i * 3 + 1] = ty + Math.sin(offsetPhi) * offsetR;
      start[i * 3 + 2] = tz + Math.sin(offsetTheta) * Math.cos(offsetPhi) * offsetR * 0.4;

      // 颜色
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

      // 消散方向：从中心 (0,0,CHEN_Z_PLANE) 出发，沿径向单位向量 + 随机角度扰动
      // x/y 主要是径向，z 给一点点朝向相机的偏移（让粒子向镜头飘）
      const r2 = Math.sqrt(tx * tx + ty * ty) || 0.001;
      const baseDx = tx / r2;
      const baseDy = ty / r2;
      // ±30° 随机偏角
      const jitterAng = (Math.random() - 0.5) * (Math.PI / 3);
      const ca = Math.cos(jitterAng);
      const sa = Math.sin(jitterAng);
      disp[i * 3] = baseDx * ca - baseDy * sa;
      disp[i * 3 + 1] = baseDx * sa + baseDy * ca;
      // z 方向小偏置：靠近 ±0.3 的随机
      disp[i * 3 + 2] = (Math.random() - 0.3) * 0.6;
    }

    return {
      startPos: start,
      targetPos: target,
      colors: col,
      dispersionDir: disp,
    };
  }, []);

  // 是否启用斥力：直接读 sharedMouse.active；离开窗口/切 tab 时它会被重置为 false
  const startTime = useRef<number | null>(null);
  const STARTUP_MS = 900;

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const now = state.clock.getElapsedTime() * 1000;
    if (startTime.current === null) startTime.current = now;
    const elapsed = now - startTime.current;
    const startupT = Math.min(elapsed / STARTUP_MS, 1);

    const scroll = scrollRef.current;
    // 消散进度：scroll 0.02→0.25 整段缓慢推进
    // Hero 占 0→0.25；一开始滚就开始散，进 About 前 (0.25) 才完全散净
    const ss = THREE.MathUtils.smoothstep(scroll, 0.02, 0.25);
    // 线性，不再用二次曲线加速，给"缓慢消散"感
    const disperse = ss;

    // opacity：横跨 0.05→0.24，几乎整个 Hero 窗口，让淡出更柔
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

    // 消散距离上限（沿径向最远推到 letterSize 的 ~6 倍，约 3.6 单位）
    const MAX_DISPERSE_DIST = 4.5;

    for (let i = 0; i < CHEN_PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const sx = startPos[i3];
      const sy = startPos[i3 + 1];
      const sz = startPos[i3 + 2];
      const tx = targetPos[i3];
      const ty = targetPos[i3 + 1];
      const tz = targetPos[i3 + 2];

      // 1) 启动 lerp（从屏外飞入到字形）
      let baseX = sx + (tx - sx) * startupT;
      let baseY = sy + (ty - sy) * startupT;
      let baseZ = sz + (tz - sz) * startupT;

      // 2) 启动完成后：消散 / 稳态
      if (startupT >= 1 && disperse > 0.001) {
        // 沿 dispersionDir 推进，距离 = disperse * MAX_DISPERSE_DIST
        const dist = disperse * MAX_DISPERSE_DIST;
        baseX = tx + dispersionDir[i3] * dist;
        baseY = ty + dispersionDir[i3 + 1] * dist;
        baseZ = tz + dispersionDir[i3 + 2] * dist;

        // 抖动随消散加大（爆散感）
        const jitter = Math.sin(now * 0.003 + i * 0.7) * 0.012 * disperse;
        baseX += jitter;
        baseY += jitter * 0.7;
      } else if (startupT >= 1) {
        // 稳态：字形 + 鼠标斥力（sharedMouse.active 在切 tab/离开窗口时被重置）
        if (sharedMouse.active) {
          const dx = tx - mx;
          const dy = ty - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CHEN_REPULSE_RADIUS) {
            const f = (1 - dist / CHEN_REPULSE_RADIUS) * CHEN_REPULSE_STRENGTH;
            baseX += (dx / (dist || 1)) * f;
            baseY += (dy / (dist || 1)) * f;
          }
        }
        const jitter = Math.sin(now * 0.005 + i) * 0.006;
        baseX += jitter;
        baseY += jitter;
      }

      // 平滑过渡
      arr[i3] += (baseX - arr[i3]) * 0.12;
      arr[i3 + 1] += (baseY - arr[i3 + 1]) * 0.12;
      arr[i3 + 2] += (baseZ - arr[i3 + 2]) * 0.12;
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={20}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[startPos, 3]}
          count={CHEN_PARTICLE_COUNT}
          array={startPos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={CHEN_PARTICLE_COUNT}
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

function ParticleField({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  // 适度尺寸、允许贴脸；vertexColors 三色混杂 + 圆形 sprite 纹理避免方块
  const COUNT = 1500;
  const ref = useRef<THREE.Points>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const circleTex = useCircleTexture();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // 允许贴脸（相机 z=6，最近 3 单位），最远 12
      const r = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  // 每颗粒子分配颜色：70% 白、18% cyan、12% magenta
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
    const p = scrollRef.current;

    targetRot.current.y = sharedMouse.x * 0.35 + Math.sin(t * 0.05) * 0.04;
    targetRot.current.x = -sharedMouse.y * 0.22 + Math.cos(t * 0.06) * 0.03;
    ref.current.rotation.y += (targetRot.current.y - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (targetRot.current.x - ref.current.rotation.x) * 0.05;

    // 线性轻微收缩
    const factor = 1.0 - p * 0.2;
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
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
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

// ---------------------------------------------------------------------
function SampleSceneInner({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  useMouse();
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      frameloop="always"
      events={undefined}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#000000"]} />
      <BigNebula scrollRef={scrollRef} />
      <ParticleField scrollRef={scrollRef} />
      <CHENParticles scrollRef={scrollRef} />
    </Canvas>
  );
}

export default memo(SampleSceneInner);
