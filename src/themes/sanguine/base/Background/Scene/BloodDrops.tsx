import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const REDUCED =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 血滴几何 / 质量（体积 ∝ r³）---- */
const RA = 0.2; // 大血滴半径（y 归一化单位）
const RB = 0.135; // 小血滴半径
const MA = RA * RA * RA;
const MB = RB * RB * RB;
const FA = MB / (MA + MB); // A 距质心的距离占比
const FB = MA / (MA + MB); // B 距质心的距离占比

/* ---- 二体开普勒轨道参数 ---- */
const GM = 0.0063; // 引力参数 → 决定周期（~14s）
const SOFT = 0.045; // 软化半径，近星点平滑通过
// 初始在远星点：r=(0.58,0)，高偏心椭圆。远星点 0.58 > rA+rB(0.335)
// → 两滴明确分离；近星点 ~0.05 → 深度交叠完全融合。
const R0X = 0.58;
const R0Y = 0;
const RV0X = 0;
const RV0Y = 0.0415;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uDropA;   // xy = 圆心, z = 半径
  uniform vec3 uDropB;
  uniform vec2 uCursor;  // 光标位置（p 空间，平滑跟随）

  float hash(vec2 p){
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * p.x);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + 7.1;
      a *= 0.5;
    }
    return v;
  }

  // 多项式 smooth-min：两滴 SDF 在此处真正"水溶"成一团（含 neck）
  float smin(float a, float b, float k){
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  float field(vec2 p, vec2 ca, float ra, vec2 cb, float rb, float k){
    float da = length(p - ca) - ra;
    float db = length(p - cb) - rb;
    return smin(da, db, k);
  }

  void main(){
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vUv - 0.5;
    p.x *= aspect;
    float t = uTime;

    vec2 ca = uDropA.xy; float ra = uDropA.z;
    vec2 cb = uDropB.xy; float rb = uDropB.z;

    /* ---- 动态融合系数 ----
       只要两滴之间还有缝隙（dist ≥ sumR），k≈0 → smin 退化成 min →
       两滴各自独立、绝不跨缝牵连（否则会把分开的小滴扯成水滴尖）。
       一旦真正交叠（dist < sumR），k 快速拉满 → 圆润融成一团。 */
    float sumR = ra + rb;
    float dist = length(ca - cb);
    float kt = smoothstep(sumR, sumR - 0.06, dist);
    float k = mix(0.01, 0.22, kt);

    /* ---- 两滴血液的 SDF ---- */
    float d = field(p, ca, ra, cb, rb, k);

    // 解析梯度（不依赖 dFdx 扩展）
    float e = 0.0016;
    vec2 grad = vec2(
      field(p + vec2(e, 0.0), ca, ra, cb, rb, k) - field(p - vec2(e, 0.0), ca, ra, cb, rb, k),
      field(p + vec2(0.0, e), ca, ra, cb, rb, k) - field(p - vec2(0.0, e), ca, ra, cb, rb, k)
    );
    // 用真实梯度（不归一化）：融合脊 / 临界点处梯度自然趋 0 →
    // 法线平滑收敛到 +z；归一化方向会在那里翻飞 → 尖锐光影折痕。
    vec2 g = grad / (2.0 * e);

    // 穹顶高度：用「所属血滴的真实半径」做球面剖面 → 顶点导数为 0、
    // 平滑收敛。若用统一 domeR，小滴因 -d 到不了 domeR，中心会退化成
    // 锥尖（法线在尖点突变）—— 那正是小滴上那个尖角。
    float da = length(p - ca) - ra;
    float db = length(p - cb) - rb;
    float rEff = mix(rb, ra, smoothstep(0.08, -0.08, da - db));
    float k01 = clamp(-d / max(rEff, 0.001), 0.0, 1.0);
    float dome = sqrt(k01 * (2.0 - k01));
    float slope = 1.0 - dome;

    // 黏稠表面波纹（时间项 sin/cos 包成有界）—— 缓慢漂移，表面微微流动
    float surf = fbm(p * 8.0 + vec2(sin(t * 0.16) * 1.6, cos(t * 0.14) * 1.6)) - 0.5;

    // 光标交互：光标掠过液面时，把液面按出一个凹坑（平滑跟随光标）。
    // 凹坑斜面法线朝光标内倾 → 边缘自然兜高光、坑底自然变暗，纯液面形变。
    vec2 toCur = p - uCursor;
    float dent = exp(-dot(toCur, toCur) / 0.005);
    vec3 N = normalize(vec3(g * slope * 1.4 + surf * 0.15 - toCur * dent * 13.0, 1.0));

    /* ---- 血液材质：深红 + 内部血流 + 湿润高光 + fresnel 薄边 ---- */
    vec3 L = normalize(vec3(-0.40, 0.50, 0.77));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, H), 0.0), 150.0);  // 收紧成一点湿润锐光，不要泛光
    float fres = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.6);

    // 内部血流：缓慢域扭曲 fbm，让血滴有"在搅动"的体积感
    vec2 fp = p * 3.2;
    vec2 fw = vec2(
      fbm(fp + vec2(sin(t * 0.06), 0.0)),
      fbm(fp + vec2(0.0, cos(t * 0.05)))
    ) - 0.5;
    float flow = fbm(fp + fw * 1.6);

    vec3 cShadow = vec3(0.12, 0.012, 0.028);
    vec3 cMid    = vec3(0.54, 0.055, 0.12);
    vec3 cRim    = vec3(0.82, 0.13, 0.18);
    vec3 cSpec   = vec3(1.0, 0.80, 0.74);
    cMid = mix(cMid * 0.66, cMid * 1.12, flow);   // 内部明暗血流

    float lit = clamp(diff * 0.88 + 0.15, 0.0, 1.0);
    vec3 blood = mix(cShadow, cMid, lit);
    blood *= 0.84 + 0.26 * dome;       // 内部纵深 / 自遮蔽
    blood += cRim * fres * 0.8;        // 半透薄边（次表面）
    blood += cSpec * spec * 0.8;       // 一点湿润锐光
    blood *= 1.0 - dent * 0.5;         // 光标按出的凹坑：坑底自然变暗

    // 形状抗锯齿遮罩
    float aa = 1.6 / uRes.y;
    float cover = smoothstep(aa, -aa, d);

    /* ---- 合成：只画血滴本体，真空处透明 ----
       画布透明 → 背景网格在血滴下方透出，血滴覆盖处遮住网格。
       预乘 alpha（three 默认 premultipliedAlpha）。 */
    gl_FragColor = vec4(blood * cover, cover);
  }
`;

/** 预演 ~5.5s 轨道：让血滴在开场 ~1.5s 内就冲向融合，第一时间抓住注意力。 */
function initPhys() {
  const s = {
    rx: R0X,
    ry: R0Y,
    rvx: RV0X,
    rvy: RV0Y,
    pcx: 0,
    pcy: 0,
    mx: 0, // 鼠标 x，[-0.5,0.5]
    my: 0, // 鼠标 y（上为正）
    cux: 99, // 平滑后的光标 x（p 空间）
    cuy: 99, // 平滑后的光标 y（p 空间）
    mseen: false, // 是否已收到过鼠标移动
  };
  const sdt = 1 / 60;
  for (let i = 0; i < 330; i++) {
    const dd = s.rx * s.rx + s.ry * s.ry + SOFT * SOFT;
    const iv = GM / (dd * Math.sqrt(dd));
    s.rvx -= s.rx * iv * sdt;
    s.rvy -= s.ry * iv * sdt;
    s.rx += s.rvx * sdt;
    s.ry += s.rvy * sdt;
  }
  return s;
}

/**
 * 两滴血液在真空中：
 * - 二体开普勒椭圆轨道（绕共同质心，偏心率高）→ 近星点贴近、远星点分开
 * - shader 的 smooth-min 在近星点把两滴 SDF 真·水溶成一团（neck），远星点又分离
 * - 质心按有界 Lissajous 缓慢自主巡游；光标掠过血滴时按出凹陷 → 交互
 */
export default function BloodDrops() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const phys = useRef(initPhys());

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      phys.current.mx = e.clientX / window.innerWidth - 0.5;
      phys.current.my = 0.5 - e.clientY / window.innerHeight;
      phys.current.mseen = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      // 初始 = t0 远星点构图（reduced-motion 下即为静态帧）
      uDropA: { value: new THREE.Vector3(-FA * R0X, 0, RA) },
      uDropB: { value: new THREE.Vector3(FB * R0X, 0, RB) },
      uCursor: { value: new THREE.Vector2(99, 99) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    u.uRes.value.set(state.size.width, state.size.height);
    if (REDUCED) return;

    const dt = Math.min(delta, 0.05);
    u.uTime.value += dt;
    const t = u.uTime.value;
    const p = phys.current;
    const aspect = state.size.width / Math.max(state.size.height, 1);

    // --- 二体开普勒相对轨道（半隐式欧拉，辛式稳定）---
    const d2 = p.rx * p.rx + p.ry * p.ry + SOFT * SOFT;
    const inv = GM / (d2 * Math.sqrt(d2));
    p.rvx -= p.rx * inv * dt;
    p.rvy -= p.ry * inv * dt;
    p.rx += p.rvx * dt;
    p.ry += p.rvy * dt;

    // --- 质心：有界 Lissajous 自主巡游（不跟随鼠标，避免全局视差感）---
    const baseX = aspect * 0.5 * 0.2 * Math.sin(t * 0.041);
    const baseY = 0.075 * Math.sin(t * 0.053 + 1.3);
    p.pcx += (baseX - p.pcx) * 0.03;
    p.pcy += (baseY - p.pcy) * 0.03;

    // --- 光标平滑跟随（p 空间）；首次出现直接吸附，避免从屏外扫过 ---
    const curPx = p.mx * aspect;
    const curPy = p.my;
    if (p.mseen && p.cux > 90) {
      p.cux = curPx;
      p.cuy = curPy;
    } else {
      p.cux += (curPx - p.cux) * 0.16;
      p.cuy += (curPy - p.cuy) * 0.16;
    }
    u.uCursor.value.set(p.cux, p.cuy);

    // --- 半径轻微呼吸（黏稠脉动）---
    const rA = RA * (1 + 0.03 * Math.sin(t * 0.4));
    const rB = RB * (1 + 0.04 * Math.sin(t * 0.5 + 2));

    u.uDropA.value.set(p.pcx - FA * p.rx, p.pcy - FA * p.ry, rA);
    u.uDropB.value.set(p.pcx + FB * p.rx, p.pcy + FB * p.ry, rB);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
