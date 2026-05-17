import { useState, type ReactNode } from "react";
import {
  Button,
  C,
  Divider,
  EntranceOverlay,
  FONT_DISPLAY,
  FONT_MONO,
  SkillCard,
  Tag,
  Text,
  TextLabel,
  TextMuted,
  TextStrong,
  Title1,
  Title2,
  Title3,
  WorkRow,
} from "./components";

// =====================================================================
// Sample Components 展示页 —— 设计系统画廊
// 所有组件来自 src/components/react/sample/components/
// 不复用 SamplePage 的 3D 场景，纯静态 DOM 展示
// =====================================================================

function Demo({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "32px 0",
        borderTop: `1px solid ${C.borderSoft}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <Title3 as="h3">{title}</Title3>
        {hint ? <TextLabel>{hint}</TextLabel> : null}
      </div>
      <div
        style={{
          padding: 28,
          border: `1px solid ${C.border}`,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          width: "100%",
          height: 80,
          background: value,
          border: `1px solid ${C.borderSoft}`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: FONT_MONO,
          fontSize: 10,
          letterSpacing: "0.15em",
          color: C.muted,
        }}
      >
        <span style={{ color: C.fg }}>{name}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

const SAMPLE_WORK = {
  id: "01",
  title: "Aeon Shrine",
  subtitle: "リアルタイム 3D ポートフォリオ",
  tags: ["React", "R3F", "GLSL"],
  impact: "+220% engagement",
};

const SAMPLE_SKILL = {
  name: "TypeScript",
  family: "Language",
  initial: "TS",
};

export default function SampleComponentsPage() {
  return (
    <div
      style={{
        position: "relative",
        background: C.bg,
        color: C.fg,
        minHeight: "100dvh",
        fontFamily: FONT_DISPLAY,
      }}
    >
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 8vw 160px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <header style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
            <TextLabel>/ 00</TextLabel>
            <Title1 as="h1">構成要素</Title1>
            <TextMuted style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
              COMPONENTS
            </TextMuted>
          </div>
          <Text style={{ maxWidth: 720, color: C.muted }}>
            sample/ 下可复用的设计组件画廊。所有组件统一从 tokens.ts 取色 / 字体 / 辉光，三档 Title
            与三档 TextGlow 一一对应。
          </Text>
        </header>

        {/* === Tokens === */}
        <Demo title="Color Tokens" hint="C.* from tokens.ts">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            <Swatch name="bg" value={C.bg} />
            <Swatch name="fg" value={C.fg} />
            <Swatch name="accent" value={C.accent} />
            <Swatch name="muted" value={C.muted} />
            <Swatch name="border" value={C.border} />
            <Swatch name="borderSoft" value={C.borderSoft} />
          </div>
        </Demo>

        <Demo title="Typography" hint="FONT_DISPLAY · FONT_MONO">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <TextLabel>/ DISPLAY · Zen Kaku Gothic New</TextLabel>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  color: C.fg,
                  marginTop: 8,
                }}
              >
                領域展開 Domain Expansion
              </div>
            </div>
            <div>
              <TextLabel>/ MONO · JetBrains Mono</TextLabel>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 18,
                  letterSpacing: "0.1em",
                  color: C.fg,
                  marginTop: 8,
                }}
              >
                console.log("MURYOUKUUSHO");
              </div>
            </div>
          </div>
        </Demo>

        {/* === Title 三档 === */}
        <Demo title="Title / TextGlow" hint="Title1·2·3 = h1·h2·h3, 辉光 1 最厚 → 3 最弱">
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <TextLabel>/ TITLE1 · TEXTGLOW1</TextLabel>
              <Title1 as="h2">自己紹介</Title1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <TextLabel>/ TITLE2 · TEXTGLOW2</TextLabel>
              <Title2 as="h3">無量空処</Title2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <TextLabel>/ TITLE3 · TEXTGLOW3</TextLabel>
              <Title3 as="h4">Color Tokens</Title3>
            </div>
          </div>
        </Demo>

        {/* === Text 四档 === */}
        <Demo title="Text" hint="Text · TextStrong · TextLabel · TextMuted">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <TextLabel>/ TEXT (NORMAL)</TextLabel>
              <Text style={{ marginTop: 8 }}>
                すべての存在を吸い込む、無限の領域。A singularity expanded — where all attention
                collapses to one point.
              </Text>
            </div>
            <div>
              <TextLabel>/ TEXT STRONG</TextLabel>
              <div style={{ marginTop: 8 }}>
                <TextStrong>MURYOUKUUSHO · BLACK HOLE</TextStrong>
              </div>
            </div>
            <div>
              <TextLabel>/ TEXT LABEL (你现在看到的这个)</TextLabel>
              <div style={{ marginTop: 8 }}>
                <TextLabel>/ NORMAL</TextLabel>
              </div>
            </div>
            <div>
              <TextLabel>/ TEXT MUTED</TextLabel>
              <div style={{ marginTop: 8 }}>
                <TextMuted>リアルタイム 3D ポートフォリオ</TextMuted>
              </div>
            </div>
          </div>
        </Demo>

        {/* === 交互 === */}
        <Demo title="Button" hint="solid · outline 两种">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Button href="#" variant="solid">
              ENTER
            </Button>
            <Button href="#" variant="outline">
              WORKS →
            </Button>
            <Button variant="solid" onClick={() => console.log("clicked")}>
              ACTION
            </Button>
          </div>
        </Demo>

        <Demo title="Tag" hint="cyan 细边 uppercase">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag>React</Tag>
            <Tag>R3F</Tag>
            <Tag>GLSL</Tag>
            <Tag>TypeScript</Tag>
            <Tag>Astro</Tag>
            <Tag>Motion</Tag>
          </div>
        </Demo>

        <Demo title="Divider" hint="带文字 / 纯横线两种">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Divider>MURYOUKUUSHO · BLACK HOLE</Divider>
            <Divider />
            <Divider>COLLAPSED</Divider>
          </div>
        </Demo>

        {/* === 展示 === */}
        <Demo title="WorkRow" hint="标题使用 Title2 · hover 升级到 TextGlow1">
          <div style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
            <WorkRow work={SAMPLE_WORK} index={0} animate={false} />
            <WorkRow
              work={{ ...SAMPLE_WORK, id: "02", title: "Sutra Engine", impact: "12k MAU" }}
              index={1}
              animate={false}
            />
          </div>
        </Demo>

        <Demo
          title="SkillCard"
          hint="initial=Title2 · name=Title3 · family=TextMuted · /NN=TextLabel"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <SkillCard skill={SAMPLE_SKILL} index={0} animate={false} />
            <SkillCard
              skill={{ ...SAMPLE_SKILL, name: "GLSL", initial: "SH", family: "Graphics" }}
              index={1}
              animate={false}
            />
            <SkillCard
              skill={{ ...SAMPLE_SKILL, name: "Three.js", initial: "3D", family: "3D Graphics" }}
              index={2}
              animate={false}
            />
          </div>
        </Demo>

        <Demo
          title="SkillCard · clickable"
          hint="clickable=true 启用 hover / active / disabled 三态"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <SkillCard
              skill={{ ...SAMPLE_SKILL, name: "Hover me", initial: "HV" }}
              index={0}
              animate={false}
              clickable
              onClick={() => console.log("hover card")}
            />
            <SkillCard
              skill={{ ...SAMPLE_SKILL, name: "Active", initial: "AC", family: "Selected" }}
              index={1}
              animate={false}
              clickable
              active
            />
            <SkillCard
              skill={{ ...SAMPLE_SKILL, name: "Disabled", initial: "DS", family: "Locked" }}
              index={2}
              animate={false}
              clickable
              disabled
            />
          </div>
        </Demo>

        <Demo title="EntranceOverlay" hint="入场遮罩 · 内部专用厚辉光">
          <Text style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>
            通过 visible 控制；只在挂载第一刻展示后退出。下方按钮临时触发：
          </Text>
          <EntranceOverlayDemo />
        </Demo>
      </main>
    </div>
  );
}

function EntranceOverlayDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setVisible(true);
          window.setTimeout(() => setVisible(false), 1500);
        }}
      >
        TRIGGER OVERLAY (1.5s)
      </Button>
      <EntranceOverlay visible={visible} title="領域展開" subtitle="DEMO TRIGGER" />
    </>
  );
}
