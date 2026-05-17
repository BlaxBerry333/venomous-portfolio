import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  C,
  Divider,
  EntranceOverlay,
  FONT_DISPLAY,
  FONT_MONO,
  SkillCard,
  TextGlow2,
  TextLabel,
  TextMuted,
  Title1,
  WorkRow,
  type Skill,
  type Work,
} from "./components";
import SampleScene from "./SampleScene";

// =====================================================================
// Sample — 星雲領域 / Nebula Zone
// 構図参考：無量空処（黒洞 + 吸積盘 + 飞散碎片）
// 配色参考：ZONE energy logo（纯黑底 + cyan + magenta + white 三色辉光）
// 区块结构由 components/ 下的可复用组件拼装
// =====================================================================

// 段头：序号 label + Title1 主标 + 英文小标，仅在本页使用
function SectionHeader({ index, ja, en }: { index: string; ja: string; en: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
      <TextLabel>/ {index}</TextLabel>
      <Title1 as="h2">{ja}</Title1>
      <TextMuted style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>{en}</TextMuted>
    </div>
  );
}

// =====================================================================
// SECTION 1 — HERO
// =====================================================================
function HeroSection() {
  const reduced = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 8vw",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}
      >
        {/* CHEN 主标题由 Canvas 粒子绘制（见 SampleScene.tsx CHENParticles）；
            DOM 这里只保留无障碍语义占位 */}
        <h1
          aria-label="CHEN"
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: "clamp(72px, 14vw, 220px)",
            color: "transparent",
            margin: 0,
            letterSpacing: "0.02em",
            lineHeight: 0.92,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          CHEN
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: 48,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Divider>SCROLL TO CHECK PORTFOLIO</Divider>
      </motion.div>
    </section>
  );
}

// =====================================================================
// SECTION 2 — ABOUT
// =====================================================================
const ABOUT_FACTS = [
  { label: "ROLE", value: "Full-Stack Engineer" },
  { label: "BASE", value: "Tokyo / Remote" },
  { label: "FOCUS", value: "Web · Motion · 3D" },
  { label: "STATUS", value: "Available 2026 Q3" },
];

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 8vw",
        gap: 60,
      }}
    >
      <SectionHeader index="01" ja="自己紹介" en="ABOUT" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: 60,
          alignItems: "start",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 17,
            lineHeight: 2,
            color: C.fg,
            letterSpacing: "0.03em",
          }}
        >
          <p style={{ marginTop: 0 }}>
            私は{" "}
            <span style={{ color: C.accent, textShadow: `0 0 12px ${C.accent}` }}>
              領域を展開する者
            </span>{" "}
            である。
          </p>
          <p>
            ピクセル、シェーダ、状態 —— それらは
            <br />
            素材ではなく、
            <span style={{ color: C.fg, textShadow: TextGlow2 }}>収束する一点</span> だ。
          </p>
          <p style={{ marginBottom: 0, color: C.muted, fontSize: 14 }}>
            I expand domains. Every interaction collapses into focus.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: C.borderSoft,
            border: `1px solid ${C.border}`,
          }}
        >
          {ABOUT_FACTS.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                background: "rgba(0,0,0,0.62)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 140,
                backdropFilter: "blur(2px)",
              }}
            >
              <TextLabel style={{ letterSpacing: "0.35em" }}>
                / {String(i + 1).padStart(2, "0")} · {f.label}
              </TextLabel>
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  color: C.fg,
                  letterSpacing: "0.02em",
                  fontWeight: 700,
                  textShadow: TextGlow2,
                }}
              >
                {f.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 3 — WORKS
// =====================================================================
const WORKS: Work[] = [
  {
    id: "01",
    title: "Aeon Shrine",
    subtitle: "リアルタイム 3D ポートフォリオ",
    tags: ["React", "R3F", "GLSL"],
    impact: "+220% engagement",
  },
  {
    id: "02",
    title: "Sutra Engine",
    subtitle: "コンテンツ生成 LLM パイプライン",
    tags: ["Node", "Anthropic", "Vector DB"],
    impact: "12k MAU",
  },
  {
    id: "03",
    title: "Cursed Tools",
    subtitle: "開発者向け CLI スイート",
    tags: ["TypeScript", "Bun", "OSS"],
    impact: "★ 3.4k",
  },
  {
    id: "04",
    title: "Domain Expansion",
    subtitle: "ブランドサイト + WebGL",
    tags: ["Astro", "Three.js", "Motion"],
    impact: "Awwwards SOTD",
  },
];

function WorksSection() {
  return (
    <section
      id="works"
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "120px 8vw",
        display: "flex",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <SectionHeader index="02" ja="作品集" en="WORKS" />
        <TextMuted
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.3em",
          }}
        >
          {WORKS.length} ENTRIES
        </TextMuted>
      </div>

      <div style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
        {WORKS.map((w, i) => (
          <WorkRow key={w.id} work={w} index={i} />
        ))}
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 4 — SKILLS
// =====================================================================
const SKILLS: Skill[] = [
  { name: "TypeScript", family: "Language", initial: "TS" },
  { name: "React / Astro", family: "Framework", initial: "RX" },
  { name: "Three.js / R3F", family: "3D Graphics", initial: "3D" },
  { name: "GLSL / Shader", family: "Graphics", initial: "SH" },
  { name: "Node / Bun", family: "Runtime", initial: "N°" },
  { name: "Motion Design", family: "Animation", initial: "MV" },
  { name: "AI / LLM Apps", family: "AI", initial: "AI" },
  { name: "System Design", family: "Architecture", initial: "SY" },
];

function SkillsSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "120px 8vw 160px",
        display: "flex",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <SectionHeader index="03" ja="能力" en="SKILLS" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {SKILLS.map((s, i) => (
          <SkillCard key={s.name} skill={s} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{
          marginTop: 100,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Divider>COLLAPSED</Divider>
        <TextMuted style={{ letterSpacing: "0.3em", fontSize: 14 }}>
          領域 閉幕 · SINGULARITY
        </TextMuted>
      </motion.div>
    </section>
  );
}

// =====================================================================
// 主组件
// =====================================================================
export default function SamplePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [entered, setEntered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, []);

  const vignette = useTransform(scrollYProgress, [0, 1], [0.3, 0.75]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        background: C.bg,
        color: C.fg,
      }}
    >
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <SampleScene scrollRef={scrollRef} />

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
            opacity: vignette,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(180deg,
              rgba(0,0,0,0.5) 0%,
              rgba(0,0,0,0.05) 18%,
              rgba(0,0,0,0.05) 82%,
              rgba(0,0,0,0.7) 100%)`,
          }}
        />
      </div>

      <EntranceOverlay visible={!entered} />

      <main style={{ position: "relative", zIndex: 10 }}>
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <SkillsSection />
      </main>
    </div>
  );
}
