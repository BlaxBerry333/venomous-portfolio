import { useSkillCategories } from "@/data/skills.hooks";
import { useWorks } from "@/data/works.hooks";
import { BAGUA, MangaUI } from "@/themes/manga/components";
import { VoidUI } from "@/themes/void/components";
import VoidParticleStream from "@/themes/void/effects/VoidParticleStream";
import VoidShaderImage from "@/themes/void/effects/VoidShaderImage";
import VoidSkillStar from "@/themes/void/sections/VoidSkillStar";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Locale, Theme } from "@/types";
import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import "./ComponentsPage.scss";

// 公共组件清单页 — 三种主题各成一组

export default function ComponentsPage({ theme, locale }: { theme: Theme; locale: Locale }) {
  return (
    <div
      style={{
        background: "var(--theme-bg)",
        minHeight: "100vh",
      }}
    >
      {theme === "void" && <VoidHeader />}
      {theme === "manga" && <MangaHeader theme={theme} />}
      {theme === "zenless" && <ZenlessHeader />}

      {theme === "void" && <VoidSection locale={locale} />}
      {theme === "manga" && <MangaSection />}
      {theme === "zenless" && <ZenlessSection locale={locale} />}
    </div>
  );
}

// ---------------------- Headers ----------------------

function VoidHeader() {
  return (
    <section
      style={{
        padding: "clamp(64px, 10vh, 120px) var(--site-padding-x) clamp(40px, 6vh, 64px)",
        borderBottom: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
      }}
    >
      <VoidUI.Title1 text="Components" accent=".Void" animate="fade-up" />
      <p
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-fg-muted)",
          marginTop: 24,
          maxWidth: 640,
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        Void 主题公共组件清单 — UI 原子、约束系、效果层。设计验收 / 跨页面复用参考。
      </p>
    </section>
  );
}

function MangaHeader({ theme }: { theme: Theme }) {
  return (
    <section
      style={{
        padding: "var(--space-3xl) var(--site-padding-x) var(--space-2xl)",
        borderBottom: "4px solid var(--theme-fg)",
      }}
    >
      <MangaUI.Title1 eyebrow="UI CODEX" animate="spring">
        Components
      </MangaUI.Title1>
      <p
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-fg-muted)",
          marginTop: 18,
          maxWidth: 640,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        公共组件清单 — 跨页面复用、设计验收用。当前主题：
        <strong style={{ color: "var(--theme-fg)", marginLeft: 4 }}>{theme}</strong>
      </p>
    </section>
  );
}

// ---------------------- Zenless Header ----------------------

function ZenlessHeader() {
  return (
    <section
      style={{
        padding: "clamp(64px, 10vh, 120px) var(--site-padding-x) clamp(40px, 6vh, 64px)",
        borderBottom: "2px solid color-mix(in srgb, var(--theme-accent) 32%, transparent)",
      }}
    >
      <ZenlessUI.Title1
        as="h1"
        size="page"
        eyebrow="UI CODEX · ZENLESS BRIEFING"
        title="ALL COMPONENTS"
        accentTail="COMPONENTS"
        marginBottom="0"
        animate="sweep"
      />
    </section>
  );
}

// ---------------------- Void Section ----------------------

function VoidSection({ locale }: { locale: Locale }) {
  const works = useWorks(locale);
  const skillCategories = useSkillCategories(locale);
  const reduced = useReducedMotion();
  const sampleCover = works[0]?.cover ?? "";
  const [streamKey, setStreamKey] = useState(0);

  return (
    <div
      style={{
        padding: "clamp(48px, 8vh, 96px) var(--site-padding-x)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(56px, 9vh, 96px)",
      }}
    >
      {/* Title */}
      <VoidBlock title="Title" subtitle="title 1 × title 2 × title 3">
        <VoidRow label="Title 1">
          <div style={{ flex: 1 }}>
            <VoidUI.Title1 text="About" accent=".Chen" />
          </div>
        </VoidRow>
        <VoidRow label="Title 2">
          <div style={{ flex: 1 }}>
            <VoidUI.Title2 eyebrow="§ 02 — CONTEXT" text="Context" />
          </div>
        </VoidRow>
        <VoidRow label="Title 3">
          <div style={{ flex: 1 }}>
            <VoidUI.Title3 text="Loadout" />
          </div>
        </VoidRow>
      </VoidBlock>

      {/* Button */}
      <VoidBlock title="Button" subtitle="variant × link">
        <VoidRow label="variant">
          <VoidUI.Button>Outlined</VoidUI.Button>
          <VoidUI.Button variant="contained">Contained</VoidUI.Button>
        </VoidRow>
        <VoidRow label="With Icon">
          <VoidUI.Button>GitHub</VoidUI.Button>
          <VoidUI.Button variant="contained">Next</VoidUI.Button>
          <VoidUI.Button>View Works</VoidUI.Button>
        </VoidRow>
        <VoidRow label="As Link">
          <VoidUI.Button href="#" target="_blank" rel="noreferrer">
            External
          </VoidUI.Button>
          <VoidUI.Button href="#" variant="contained">
            Internal
          </VoidUI.Button>
        </VoidRow>
      </VoidBlock>

      {/* Tag */}
      <VoidBlock title="Tag" subtitle="3 variants × 3 sizes × interactive">
        <VoidRow label="variant">
          <VoidUI.Tag variant="primary">Primary</VoidUI.Tag>
          <VoidUI.Tag variant="daily">Daily</VoidUI.Tag>
          <VoidUI.Tag variant="familiar">Familiar</VoidUI.Tag>
        </VoidRow>
        <VoidRow label="size">
          <VoidUI.Tag variant="primary" size="xs">
            XS
          </VoidUI.Tag>
          <VoidUI.Tag variant="primary" size="sm">
            SM
          </VoidUI.Tag>
          <VoidUI.Tag variant="primary" size="md">
            MD
          </VoidUI.Tag>
        </VoidRow>
        <VoidRow label="variant ( Interactived )">
          <VoidUI.Tag variant="primary" interactive>
            React
          </VoidUI.Tag>
          <VoidUI.Tag variant="daily" interactive>
            TypeScript
          </VoidUI.Tag>
          <VoidUI.Tag variant="familiar" interactive>
            Vue 3
          </VoidUI.Tag>
        </VoidRow>
      </VoidBlock>

      {/* Skill Star (home Tech.Stack) */}
      <VoidBlock title="SkillStar" subtitle="home tech.stack · constellation chart">
        <VoidRow label="Single (FRONTEND)">
          <div style={{ width: "min(100%, 380px)" }}>
            <VoidSkillStar
              label={skillCategories[0].label}
              skills={skillCategories[0].skills}
              reduced={!!reduced}
            />
          </div>
          <p
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 11,
              color: "var(--theme-fg-muted)",
              letterSpacing: "0.18em",
              maxWidth: 280,
              alignSelf: "center",
              lineHeight: 1.6,
            }}
          >
            中心标签 + 卫星节点 + SVG 连接线；hover 节点/标签/线 → 路径高亮 + 高速彗星 +
            节点放大；3D tilt 跟随光标。reduced-motion 自动关闭粒子/tilt。
          </p>
        </VoidRow>
        <VoidRow label="Compact (size=240)">
          <div style={{ width: 240 }}>
            <VoidSkillStar
              label={skillCategories[2].label}
              skills={skillCategories[2].skills.slice(0, 6)}
              size={240}
              radius={88}
              reduced={!!reduced}
            />
          </div>
          <p
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 11,
              color: "var(--theme-fg-muted)",
              letterSpacing: "0.18em",
              maxWidth: 280,
              alignSelf: "center",
              lineHeight: 1.6,
            }}
          >
            支持 size / radius 自定义；最多 6~8 个卫星节点效果最佳。
          </p>
        </VoidRow>
      </VoidBlock>

      {/* Effects */}
      <VoidBlock title="Effects" subtitle="shader image · particle stream">
        <VoidRow label="ShaderImage">
          <div
            style={{
              position: "relative",
              width: "min(100%, 360px)",
              aspectRatio: "16/10",
              overflow: "hidden",
              background: "#05060A",
              border: "1px solid color-mix(in srgb, var(--theme-accent) 24%, transparent)",
            }}
          >
            {sampleCover && <VoidShaderImage imageUrl={sampleCover} />}
          </div>
          <p
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 11,
              color: "var(--theme-fg-muted)",
              letterSpacing: "0.18em",
              maxWidth: 280,
              alignSelf: "center",
              lineHeight: 1.6,
            }}
          >
            GLSL 顶点波纹 + 片元 RGB 色散；reduced-motion 降级为静态 img。
          </p>
        </VoidRow>

        <VoidRow label="ParticleStream">
          <div
            style={{
              position: "relative",
              width: 220,
              height: 160,
              border: "1px solid color-mix(in srgb, var(--theme-accent) 24%, transparent)",
              overflow: "hidden",
              background: "color-mix(in srgb, var(--theme-accent) 4%, transparent)",
            }}
          >
            <VoidParticleStream
              count={10}
              radius={[80, 140]}
              spread="upRight"
              loop
              durationMs={1400}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--theme-font-mono)",
                fontSize: 11,
                color: "var(--theme-fg-muted)",
                letterSpacing: "0.2em",
                pointerEvents: "none",
              }}
            >
              loop · upRight
            </span>
          </div>
          <div
            style={{
              position: "relative",
              width: 220,
              height: 160,
              border: "1px solid color-mix(in srgb, var(--theme-accent) 24%, transparent)",
              overflow: "hidden",
              background: "color-mix(in srgb, var(--theme-accent) 4%, transparent)",
            }}
          >
            {streamKey > 0 && (
              <VoidParticleStream
                key={streamKey}
                count={30}
                radius={[140, 260]}
                spread="all"
                loop={false}
                durationMs={900}
              />
            )}
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--theme-font-mono)",
                fontSize: 11,
                color: "var(--theme-fg-muted)",
                letterSpacing: "0.2em",
                pointerEvents: "none",
              }}
            >
              one-shot · all
            </span>
          </div>
          <VoidUI.Button variant="contained" onClick={() => setStreamKey((k) => k + 1)}>
            Replay one-shot
          </VoidUI.Button>
        </VoidRow>
      </VoidBlock>

      {/* ─────────────────────────────────────────────────────────────
          Card —— 仅保留 slab 一种 variant（通用项目卡 / Mobile dialog Void 选项）
          ───────────────────────────────────────────────────────────── */}
      <VoidBlock title="Card">
        {/* —— slab 常规：扫描线底纹 + 大字主标 + desc + footer —— */}
        <VoidRow label="slab">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
              width: "100%",
              maxWidth: 720,
            }}
          >
            <VoidUI.Card
              variant="slab"
              color="accent"
              hoverable
              leading="§ 01"
              label="LIVE"
              title="Fintech Trading Console"
              desc="Sub-100ms render pipeline · realtime WebSocket fan-out."
              footer="OPERATIONAL"
            />
            <VoidUI.Card
              variant="slab"
              color="accent"
              hoverable
              leading="§ 02"
              label="ARCHIVED"
              title="IoT Control Platform"
              desc="WebGL telemetry mesh covering 40k+ device fleet."
              footer="STANDBY"
            />
            <VoidUI.Card
              variant="slab"
              color="accent"
              hoverable
              leading="§ 03"
              label="NDA"
              title="Headless CMS Rebuild"
              desc="Design system spanning 8 product surfaces."
              footer="CLASSIFIED"
            />
          </div>
        </VoidRow>
      </VoidBlock>
    </div>
  );
}

function VoidBlock({
  title,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: "1px solid color-mix(in srgb, var(--theme-accent) 28%, transparent)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: 28,
            color: "var(--theme-fg)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>
    </div>
  );
}

function VoidRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px, 160px) 1fr",
        alignItems: "flex-start",
        gap: 24,
      }}
      className="portfolio__components-page__void-row"
    >
      <span
        style={{
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "var(--theme-fg-muted)",
          textTransform: "uppercase",
          paddingTop: 18,
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          padding: "12px 4px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------- Zenless Section ----------------------

function ZenlessSection({ locale }: { locale: Locale }) {
  const works = useWorks(locale);
  return (
    <div
      style={{
        padding: "clamp(48px, 8vh, 96px) var(--site-padding-x)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(56px, 9vh, 96px)",
      }}
    >
      {/* Title */}
      <ZenlessBlock title="Title">
        <ZenlessRow label="Title 1">
          <div style={{ flex: 1 }}>
            <ZenlessUI.Title1
              as="h1"
              size="page"
              eyebrow="MISSION HALL · BRIEFING ROOM"
              title="ALL MISSIONS"
              accentTail="MISSIONS"
              marginBottom="0"
            />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Title 2">
          <div style={{ flex: 1 }}>
            <ZenlessUI.Title2
              phase="PHASE 03 / 09"
              phaseStyle="chip"
              label="Loadout"
              title="Loadout"
              titleSize="clamp(32px, 5vw, 72px)"
            />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Title 3">
          <div style={{ width: "100%", maxWidth: 480 }}>
            <ZenlessUI.Title3 subtitle="variants × sizes">Zenless Button</ZenlessUI.Title3>
          </div>
        </ZenlessRow>
      </ZenlessBlock>

      {/* Button */}
      <ZenlessBlock title="Button">
        <ZenlessRow label="Variant">
          <ZenlessUI.Button>Contained</ZenlessUI.Button>
          <ZenlessUI.Button variant="outlined">Outlined</ZenlessUI.Button>
        </ZenlessRow>
        <ZenlessRow label="Sizes">
          <ZenlessUI.Button size="sm">Small</ZenlessUI.Button>
          <ZenlessUI.Button size="md">Medium</ZenlessUI.Button>
          <ZenlessUI.Button size="lg">Large</ZenlessUI.Button>
        </ZenlessRow>
        <ZenlessRow label="With Icon">
          <ZenlessUI.Button>GitHub</ZenlessUI.Button>
          <ZenlessUI.Button variant="outlined">Next</ZenlessUI.Button>
          <ZenlessUI.Button>View Works</ZenlessUI.Button>
        </ZenlessRow>
        <ZenlessRow label="Animation">
          <ZenlessUI.Button animation="nudge">nudge</ZenlessUI.Button>
        </ZenlessRow>
        <ZenlessRow label="As Link">
          <ZenlessUI.Button href="#">External</ZenlessUI.Button>
          <ZenlessUI.Button href="#" variant="outlined">
            Docs
          </ZenlessUI.Button>
        </ZenlessRow>
      </ZenlessBlock>

      {/* Tag */}
      <ZenlessBlock title="Tag">
        <ZenlessRow label="Variant">
          <ZenlessUI.Tag variant="contained">Contained</ZenlessUI.Tag>
          <ZenlessUI.Tag variant="outlined">Outlined</ZenlessUI.Tag>
        </ZenlessRow>
        <ZenlessRow label="Color">
          <ZenlessUI.Tag color="orange">Orange</ZenlessUI.Tag>
          <ZenlessUI.Tag variant="contained" color="orange">
            Orange
          </ZenlessUI.Tag>
          <ZenlessUI.Tag color="green">Green</ZenlessUI.Tag>
          <ZenlessUI.Tag variant="contained" color="green">
            Green
          </ZenlessUI.Tag>
          <ZenlessUI.Tag color="purple">Purple</ZenlessUI.Tag>
          <ZenlessUI.Tag variant="contained" color="purple">
            Purple
          </ZenlessUI.Tag>
        </ZenlessRow>
        <ZenlessRow label="Size — sm">
          <ZenlessUI.Tag size="sm" variant="contained" color="orange">
            S
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="sm" color="green">
            React
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="sm" variant="contained" color="purple">
            A
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="sm" color="orange">
            TypeScript
          </ZenlessUI.Tag>
        </ZenlessRow>
        <ZenlessRow label="Size — md">
          <ZenlessUI.Tag size="md" variant="contained" color="orange">
            S
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="contained" color="green">
            A
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="contained" color="purple">
            B
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="contained" color="orange">
            01
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="contained" color="green">
            SS
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="outlined" color="purple">
            RANK
          </ZenlessUI.Tag>
        </ZenlessRow>
        <ZenlessRow label="With Prefix">
          <ZenlessUI.Tag prefix="▸">React</ZenlessUI.Tag>
          <ZenlessUI.Tag prefix="#" color="purple">
            TypeScript
          </ZenlessUI.Tag>
          <ZenlessUI.Tag variant="contained" prefix="ID#">
            0042
          </ZenlessUI.Tag>
          <ZenlessUI.Tag prefix="No." color="green">
            07
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="outlined" color="orange" prefix="ID#">
            0042
          </ZenlessUI.Tag>
          <ZenlessUI.Tag size="md" variant="contained" color="green" prefix="No.">
            07
          </ZenlessUI.Tag>
        </ZenlessRow>
      </ZenlessBlock>

      {/* Bars */}
      <ZenlessBlock title="Bars">
        <ZenlessRow label="Color">
          <ZenlessUI.Bars color="orange" />
          <ZenlessUI.Bars color="green" />
          <ZenlessUI.Bars color="purple" />
        </ZenlessRow>
        <ZenlessRow label="Count">
          <ZenlessUI.Bars color="green" count={3} />
          <ZenlessUI.Bars color="green" count={5} />
          <ZenlessUI.Bars color="green" count={8} />
        </ZenlessRow>
        <ZenlessRow label="Size (height / barWidth / gap)">
          <ZenlessUI.Bars color="orange" height={20} barWidth={3} gap={2} />
          <ZenlessUI.Bars color="orange" height={28} barWidth={4} gap={3} />
          <ZenlessUI.Bars color="orange" height={40} barWidth={6} gap={4} />
        </ZenlessRow>
      </ZenlessBlock>

      {/* Card — 演示按 props 复杂度从简到繁 */}
      <ZenlessBlock title="Card">
        {/* 1. 仅 title — 最简 */}
        <ZenlessRow label="Title Only（最简）">
          <div style={{ width: 360 }}>
            <ZenlessUI.Card color="orange" title="Bare Title — No Slots" />
          </div>
        </ZenlessRow>

        {/* 2. + leading + trailing — 三色齐展示 */}
        <ZenlessRow label="+ leading + trailing（三色档位）">
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="orange"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="orange">
                  S
                </ZenlessUI.Tag>
              }
              title="High Priority"
              trailing={<ZenlessUI.Bars color="orange" />}
            />
          </div>
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="green"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="green">
                  A
                </ZenlessUI.Tag>
              }
              title="Standard Mission"
              trailing={<ZenlessUI.Bars color="green" />}
            />
          </div>
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="purple"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="purple">
                  B
                </ZenlessUI.Tag>
              }
              title="SaaS Analytics"
              trailing={<ZenlessUI.Bars color="purple" />}
            />
          </div>
        </ZenlessRow>

        {/* 3. + description */}
        <ZenlessRow label="+ description（二级描述）">
          <div style={{ width: 420 }}>
            <ZenlessUI.Card
              color="green"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="green">
                  A
                </ZenlessUI.Tag>
              }
              title="Realtime Dashboard"
              description="Industrial IoT telemetry · WebGL render path · 40k device fleet"
            />
          </div>
        </ZenlessRow>

        {/* 4. + metric — 全槽位最复杂 */}
        <ZenlessRow label="+ metric（全槽位 · color 继承到 metric）">
          <div style={{ width: 480 }}>
            <ZenlessUI.Card
              color="orange"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="orange">
                  S
                </ZenlessUI.Tag>
              }
              title="Fintech Trading Console"
              description="Sub-100ms render pipeline · 30+ symbols realtime"
              metric={{ value: "<100ms", label: "RENDER" }}
              trailing={<ZenlessUI.Bars color="orange" />}
            />
          </div>
        </ZenlessRow>

        {/* 5. title 行为修饰：multiline 默认 vs titleEllipsis */}
        <ZenlessRow label="Title 行为：multiline（默认） vs titleEllipsis">
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="green"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="green">
                  A
                </ZenlessUI.Tag>
              }
              title="Realtime Dashboard For Industrial IoT Telemetry"
            />
          </div>
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="orange"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="orange">
                  S
                </ZenlessUI.Tag>
              }
              title="Realtime Dashboard For Industrial IoT Telemetry"
              titleEllipsis
            />
          </div>
        </ZenlessRow>

        {/* 6. 自定义 trailing — 替代 Bars 的更典型场景：mono status chip */}
        <ZenlessRow label="自定义 trailing（mono status chip）">
          <div style={{ width: 420 }}>
            <ZenlessUI.Card
              color="purple"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="purple">
                  A
                </ZenlessUI.Tag>
              }
              title="SaaS Analytics"
              trailing={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8B5CF6",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  CLASSIFIED
                </span>
              }
            />
          </div>
        </ZenlessRow>

        {/* 7. active 状态 */}
        <ZenlessRow label="Active（列表常驻选中态）">
          <div style={{ width: 360 }}>
            <ZenlessUI.Card
              color="green"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="green">
                  A
                </ZenlessUI.Tag>
              }
              title="Selected State"
              description="active=true 模拟列表选中态"
              active
            />
          </div>
        </ZenlessRow>

        {/* 8. Combat Log 场景：序号 leading + 中文描述 + CLEARED 状态（替代旧 TaskItem）*/}
        <ZenlessRow label="Combat Log（序号 + 描述 + 状态）">
          <div
            style={{ width: "min(100%, 720px)", display: "flex", flexDirection: "column", gap: 12 }}
          >
            {[
              "搭建模块化前端架构，按功能域拆分 12 个 feature 包。",
              "主导可视化看板从 SVG 重构到 WebGL，渲染 50k 数据点零掉帧。",
              "推动 Design Token + 主题系统全公司落地，覆盖 6 条产品线。",
            ].map((c, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <ZenlessUI.Card
                  key={i}
                  color="green"
                  staggerIndex={i}
                  leading={
                    <span
                      aria-hidden
                      style={{
                        fontFamily: "var(--theme-font-display)",
                        fontWeight: 900,
                        fontSize: 28,
                        color: "var(--theme-accent)",
                        letterSpacing: "-0.02em",
                        width: 56,
                        textAlign: "center",
                      }}
                    >
                      {num}
                    </span>
                  }
                  title={c}
                  trailing={
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--theme-font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--theme-accent)",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                      }}
                    >
                      CLEARED
                    </span>
                  }
                />
              );
            })}
          </div>
        </ZenlessRow>

        {/* 9. Timeline 场景：自定义 leading 日期块（替代旧 TaskItem custom leading）*/}
        <ZenlessRow label="Timeline（自定义 leading 日期块）">
          <div
            style={{ width: "min(100%, 720px)", display: "flex", flexDirection: "column", gap: 12 }}
          >
            <ZenlessUI.Card
              color="orange"
              leading={
                <span
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "#FF6B00",
                    minWidth: 96,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  2024 / 01 / 01
                </span>
              }
              title="OPERATION ALPHA"
              description="Fintech trading console — sub-100ms render, 30+ symbols realtime"
              trailing={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#FF6B00",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  CLEARED
                </span>
              }
            />
            <ZenlessUI.Card
              color="green"
              leading={
                <span
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "var(--theme-accent)",
                    minWidth: 96,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  2020 / 06 / 15
                </span>
              }
              title="OPERATION SIGMA"
              description="Headless CMS rebuild — 8 product surfaces"
              trailing={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--theme-accent)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  CLEARED
                </span>
              }
            />
          </div>
        </ZenlessRow>
      </ZenlessBlock>

      {/* PreviewCard */}
      <ZenlessBlock title="PreviewCard">
        <ZenlessRow label="Color">
          <div style={{ width: 280 }}>
            <ZenlessUI.PreviewCard
              cover={works[0]?.cover ?? ""}
              title={works[0]?.title ?? "Project"}
              subtitle={works[0]?.subtitle}
              color="orange"
              badge="S"
              status={{ label: "OPERATIONAL" }}
              skills={works[0]?.techStack}
              index={0}
            />
          </div>
          <div style={{ width: 280 }}>
            <ZenlessUI.PreviewCard
              cover={works[1]?.cover ?? ""}
              title={works[1]?.title ?? "Project"}
              subtitle={works[1]?.subtitle}
              color="green"
              badge="A"
              status={{ label: "ARCHIVED" }}
              skills={works[1]?.techStack}
              index={1}
            />
          </div>
          <div style={{ width: 280 }}>
            <ZenlessUI.PreviewCard
              cover={works[2]?.cover ?? ""}
              title={works[2]?.title ?? "Project"}
              subtitle={works[2]?.subtitle}
              color="purple"
              badge="SS"
              status={{ label: "CLASSIFIED" }}
              skills={works[2]?.techStack}
              index={2}
            />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Blurred">
          <div style={{ width: 280 }}>
            <ZenlessUI.PreviewCard
              cover={works[2]?.cover ?? ""}
              title={works[2]?.title ?? "Project"}
              subtitle={works[2]?.subtitle}
              color="purple"
              badge="SS"
              status={{ label: "CLASSIFIED" }}
              blurred
              index={0}
            />
          </div>
        </ZenlessRow>
        <ZenlessRow label="No Status">
          <div style={{ width: 280 }}>
            <ZenlessUI.PreviewCard
              cover={works[0]?.cover ?? ""}
              title={works[0]?.title ?? "Project"}
              subtitle={works[0]?.subtitle}
              color="orange"
              badge="S"
              index={0}
            />
          </div>
        </ZenlessRow>
      </ZenlessBlock>

      {/* Hazard */}
      <ZenlessBlock title="Hazard">
        <ZenlessRow label="Color">
          <div
            style={{ width: "min(100%, 720px)", display: "flex", flexDirection: "column", gap: 14 }}
          >
            <ZenlessUI.Hazard color="green" />
            <ZenlessUI.Hazard color="orange" />
            <ZenlessUI.Hazard color="purple" />
            <ZenlessUI.Hazard color="warn" />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Animated">
          <div
            style={{ width: "min(100%, 720px)", display: "flex", flexDirection: "column", gap: 14 }}
          >
            <ZenlessUI.Hazard color="green" animated />
            <ZenlessUI.Hazard color="green" animated={false} />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Height">
          <div
            style={{ width: "min(100%, 720px)", display: "flex", flexDirection: "column", gap: 14 }}
          >
            <ZenlessUI.Hazard color="warn" height={4} />
            <ZenlessUI.Hazard color="warn" height={8} />
            <ZenlessUI.Hazard color="warn" height={16} />
            <ZenlessUI.Hazard color="warn" height={32} />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Label · center">
          <div style={{ width: "min(100%, 720px)" }}>
            <ZenlessUI.Hazard
              color="warn"
              label="▸▸ ENTERING THREAT ZONE ▸▸"
              labelPosition="center"
            />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Label · left">
          <div style={{ width: "min(100%, 720px)" }}>
            <ZenlessUI.Hazard color="green" label="▸ PHASE 03" labelPosition="left" />
          </div>
        </ZenlessRow>
        <ZenlessRow label="Label · right">
          <div style={{ width: "min(100%, 720px)" }}>
            <ZenlessUI.Hazard color="purple" label={<>CLASSIFIED</>} labelPosition="right" />
          </div>
        </ZenlessRow>
      </ZenlessBlock>
    </div>
  );
}

function ZenlessBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: "1px solid color-mix(in srgb, var(--theme-accent) 32%, transparent)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: 28,
            color: "var(--theme-fg)",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>
    </div>
  );
}

function ZenlessRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px, 180px) 1fr",
        alignItems: "flex-start",
        gap: 24,
      }}
      className="portfolio__components-page__zenless-row"
    >
      <span
        style={{
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "var(--theme-accent)",
          textTransform: "uppercase",
          paddingTop: 18,
        }}
      >
        ◆ {label}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          padding: "12px 4px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------- Manga Section (unchanged) ----------------------

function MangaSection() {
  return (
    <div style={{ padding: "var(--space-3xl) var(--site-padding-x)" }}>
      {/* Titles */}
      <Block title="Manga Title" subtitle="hero × chapter × section">
        <Row label="Hero (一档 · with eyebrow)">
          <div style={{ width: "100%" }}>
            <MangaUI.Title1 eyebrow="全卷揃! BOOK SHELF">Works!!</MangaUI.Title1>
          </div>
        </Row>
        <Row label="Hero (一档 · no eyebrow)">
          <div style={{ width: "100%" }}>
            <MangaUI.Title1>Hard Boss</MangaUI.Title1>
          </div>
        </Row>
        <Row label="Chapter (二档)">
          <MangaUI.Title2 num="01" label="表紙" />
        </Row>
        <Row label="Section (三档)">
          <div style={{ width: "100%", maxWidth: 480 }}>
            <MangaUI.Title3 subtitle="variants × sizes">Manga Button</MangaUI.Title3>
          </div>
        </Row>
      </Block>

      {/* Buttons */}
      <Block title="Manga Button" subtitle="colors × sizes × icon × badge × rotate">
        <Row label="Colors">
          <MangaUI.Button color="red">Red</MangaUI.Button>
          <MangaUI.Button color="yellow">Yellow</MangaUI.Button>
          <MangaUI.Button color="black">Black</MangaUI.Button>
          <MangaUI.Button color="white">White</MangaUI.Button>
        </Row>
        <Row label="Sizes">
          <MangaUI.Button color="black" size="sm">
            Small
          </MangaUI.Button>
          <MangaUI.Button color="black" size="md">
            Medium
          </MangaUI.Button>
          <MangaUI.Button color="black" size="lg">
            Large
          </MangaUI.Button>
        </Row>
        <Row label="With Icon">
          <MangaUI.Button color="black">GitHub</MangaUI.Button>
          <MangaUI.Button color="red">Hire Me</MangaUI.Button>
          <MangaUI.Button color="white">Next</MangaUI.Button>
        </Row>
        <Row label="With Badge">
          <MangaUI.Button color="red" badge="ドン!!">
            Hire Me
          </MangaUI.Button>
          <MangaUI.Button color="black" size="lg" badge="NEW" restRotate={-2}>
            View Works
          </MangaUI.Button>
          <MangaUI.Button color="yellow" badge="!?" restRotate={2}>
            Contact
          </MangaUI.Button>
        </Row>
        <Row label="Rotate · restRotate 错位排版">
          <MangaUI.Button color="black" restRotate={-6}>
            -6°
          </MangaUI.Button>
          <MangaUI.Button color="black" restRotate={-3}>
            -3°
          </MangaUI.Button>
          <MangaUI.Button color="black" restRotate={0}>
            0°
          </MangaUI.Button>
          <MangaUI.Button color="black" restRotate={3}>
            +3°
          </MangaUI.Button>
          <MangaUI.Button color="black" restRotate={6}>
            +6°
          </MangaUI.Button>
        </Row>
      </Block>

      {/* Tags */}
      <Block title="Manga Tag" subtitle="colors × sizes × prefix">
        <Row label="Colors">
          <MangaUI.Tag color="red">Red</MangaUI.Tag>
          <MangaUI.Tag color="yellow">Yellow</MangaUI.Tag>
          <MangaUI.Tag color="black">Black</MangaUI.Tag>
          <MangaUI.Tag color="white">White</MangaUI.Tag>
        </Row>
        <Row label="Sizes">
          <MangaUI.Tag color="black" size="xs">
            XS
          </MangaUI.Tag>
          <MangaUI.Tag color="black" size="sm">
            SM
          </MangaUI.Tag>
          <MangaUI.Tag color="black" size="md">
            MD
          </MangaUI.Tag>
        </Row>
        <Row label="With Prefix">
          <MangaUI.Tag color="white" prefix="#">
            React
          </MangaUI.Tag>
          <MangaUI.Tag color="red" prefix="★">
            Featured
          </MangaUI.Tag>
          <MangaUI.Tag color="black" prefix="No.">
            01
          </MangaUI.Tag>
          <MangaUI.Tag color="yellow" size="md">
            秘伝
          </MangaUI.Tag>
        </Row>
      </Block>

      {/* Cards */}
      <Block
        title="Manga Card"
        subtitle="colors × prefix × subtitle × halftone × badges × 八卦水印"
      >
        <Row label="Colors">
          <div style={{ width: 220 }}>
            <MangaUI.Card color="white" title="React" />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="black" title="TypeScript" />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="red" title="WebGL" />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="yellow" title="Three.js" />
          </div>
        </Row>
        <Row label="With Prefix">
          <div style={{ width: 220 }}>
            <MangaUI.Card color="white" prefix="No.01" title="React" />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="black" prefix="No.02" title="TypeScript" />
          </div>
        </Row>
        <Row label="With Subtitle">
          <div style={{ width: 240 }}>
            <MangaUI.Card
              color="white"
              prefix="2024"
              title="Lead"
              subtitle="Design Engineering Crew"
            />
          </div>
          <div style={{ width: 240 }}>
            <MangaUI.Card color="black" prefix="2022" title="Tech Lead" subtitle="Industrial IoT" />
          </div>
        </Row>
        <Row label="With Halftone · 网点底">
          <div style={{ width: 220 }}>
            <MangaUI.Card color="white" halftone title="Plain" />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="black" halftone title="Dots" />
          </div>
        </Row>
        <Row label="Badges · 双角章贴纸">
          <div style={{ width: 220 }}>
            <MangaUI.Card color="white" title="Top Only" topBadge={{ text: "主人公" }} />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card color="white" title="Bottom Only" bottomBadge={{ text: "CHEN" }} />
          </div>
          <div style={{ width: 220 }}>
            <MangaUI.Card
              color="yellow"
              title="Both Sides"
              topBadge={{ text: "主人公" }}
              bottomBadge={{ text: "CHEN" }}
            />
          </div>
        </Row>
        <Row label="Bagua Watermarks · 八卦水印八选一">
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.QIAN} title="乾 / 天" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.DUI} title="兑 / 泽" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.LI} title="离 / 火" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.ZHEN} title="震 / 雷" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.XUN} title="巽 / 风" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.KAN} title="坎 / 水" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.GEN} title="艮 / 山" />
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card color="white" watermark={BAGUA.KUN} title="坤 / 地" />
          </div>
        </Row>

        {/* Custom Container 形态 — 不传 title/subtitle/prefix，自由放 children/背景；
            验证 Card 能不能撑住 Dossier、封面+标题块、KPI、Quote 等多种容器形态 */}
        <Row label="Custom Container · Dossier">
          <div style={{ width: 280 }}>
            <MangaUI.Card
              color="white"
              padding={0}
              minHeight={360}
              halftone
              halftoneOpacity={0.5}
              restRotate={-2}
              shadowOffset={12}
              shadowColor="var(--theme-accent)"
              borderWidth={5}
              topBadge={{ text: "主人公" }}
              bottomBadge={{ text: "CHEN" }}
              style={{
                width: 280,
                height: 360,
                backgroundImage: "url(https://picsum.photos/seed/avatar/600/800?grayscale)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </Row>

        <Row label="Custom Container · Cover + Titleblock">
          <div style={{ width: 240 }}>
            <MangaUI.Card
              color="white"
              padding={0}
              minHeight={0}
              borderWidth={4}
              shadowOffset={10}
              restRotate={-1.5}
              topBadge={{ text: "VOL.01", color: "black", rotate: -4 }}
              bottomBadge={{ text: "公式", color: "red" }}
            >
              <div
                style={{
                  aspectRatio: "3/4",
                  backgroundImage:
                    "linear-gradient(180deg, transparent 50%, rgba(14,14,16,0.6)), url(https://picsum.photos/seed/container-cover/800/1000)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  borderTop: "4px solid var(--theme-fg)",
                  padding: "12px 14px",
                  background: "var(--theme-bg)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: 22,
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                    letterSpacing: "0.02em",
                  }}
                >
                  Card as Cover
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: 4,
                    fontFamily: "var(--theme-font-body)",
                    fontWeight: 700,
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  与 PreviewCard 等价形态
                </p>
              </div>
            </MangaUI.Card>
          </div>
          <div style={{ width: 240 }}>
            <MangaUI.Card
              color="black"
              padding={0}
              minHeight={0}
              borderWidth={4}
              shadowOffset={10}
              restRotate={2}
              topBadge={{ text: "VOL.02", color: "yellow", rotate: -3 }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  backgroundImage:
                    "linear-gradient(180deg, transparent 50%, rgba(14,14,16,0.7)), url(https://picsum.photos/seed/container-square/800/800)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  borderTop: "4px solid var(--theme-bg)",
                  padding: "12px 14px",
                  background: "var(--theme-fg)",
                  color: "var(--theme-bg)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    opacity: 0.7,
                  }}
                >
                  EP.02 / 2026
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: 4,
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: 20,
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                  }}
                >
                  Square Cover
                </p>
              </div>
            </MangaUI.Card>
          </div>
        </Row>

        <Row label="Custom Container · KPI / Stat">
          <div style={{ width: 200 }}>
            <MangaUI.Card
              color="black"
              minHeight={180}
              padding={20}
              shadowOffset={10}
              shadowColor="var(--theme-accent)"
              restRotate={-2}
              halftone
              halftoneOpacity={0.12}
              topBadge={{ text: "STAT", color: "yellow", rotate: -6 }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  opacity: 0.7,
                }}
              >
                YEARS
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: 6,
                  fontFamily: "var(--theme-font-display)",
                  fontWeight: 900,
                  fontSize: 72,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  color: "var(--theme-accent)",
                }}
              >
                07
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: 4,
                  fontFamily: "var(--theme-font-body)",
                  fontWeight: 700,
                  fontSize: 12,
                  opacity: 0.8,
                }}
              >
                自 2019 起
              </p>
            </MangaUI.Card>
          </div>
          <div style={{ width: 200 }}>
            <MangaUI.Card
              color="red"
              minHeight={180}
              padding={20}
              shadowOffset={10}
              restRotate={1.5}
              bottomBadge={{ text: "ドン!!", color: "yellow", rotate: 6 }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  opacity: 0.8,
                }}
              >
                SHIPPED
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: 6,
                  fontFamily: "var(--theme-font-display)",
                  fontWeight: 900,
                  fontSize: 72,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                }}
              >
                42+
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: 4,
                  fontFamily: "var(--theme-font-body)",
                  fontWeight: 700,
                  fontSize: 12,
                  opacity: 0.85,
                }}
              >
                项目 / 公司 + 个人
              </p>
            </MangaUI.Card>
          </div>
        </Row>
      </Block>

      {/* Quote */}
      <Block
        title="Manga Quote"
        subtitle="名言框 · color × label × rotate × shadow × custom content"
      >
        <Row label="Without Label">
          <MangaUI.Quote>"Less is more — until it isn't."</MangaUI.Quote>
        </Row>
        <Row label="Custom Label">
          <MangaUI.Quote label="名言">
            "Code is the medium. Performance is the discipline.
            <br />
            Aesthetics is the contract."
          </MangaUI.Quote>
        </Row>
        <Row label="Colors">
          <MangaUI.Quote color="white" label="白">
            "White / 默认底"
          </MangaUI.Quote>
          <MangaUI.Quote color="yellow" label="黄">
            "Yellow / accent-2 底"
          </MangaUI.Quote>
          <MangaUI.Quote color="red" label="红">
            "Red / accent 底"
          </MangaUI.Quote>
          <MangaUI.Quote color="black" label="黒">
            "Black / fg 底 + 反白文字"
          </MangaUI.Quote>
        </Row>
        <Row label="Shadow Color">
          <MangaUI.Quote shadowColor="var(--theme-accent)">
            "Ship the smallest thing that proves the idea."
          </MangaUI.Quote>
        </Row>
        <Row label="Rotate">
          <MangaUI.Quote rotate={-1.2}>"Move fast — but never alone."</MangaUI.Quote>
        </Row>
        {/* 自定义内容：children 接受任意 ReactNode — 标题 / Tag / 列表 / 图片都行 */}
        <Row label="Custom Content（ReactNode children）">
          <MangaUI.Quote color="yellow" label="档案" maxWidth={420} padding={20} rotate={-1}>
            <div
              style={{
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: 24,
                letterSpacing: "0.04em",
                lineHeight: 1,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              No.01 · Frontend
            </div>
            <p
              style={{
                fontFamily: "var(--theme-font-body)",
                fontStyle: "italic",
                fontSize: 13,
                margin: 0,
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: "2px dashed var(--theme-fg)",
              }}
            >
              Where I live. UI / UX / motion.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <MangaUI.Tag color="black" size="xs">
                React
              </MangaUI.Tag>
              <MangaUI.Tag color="white" size="xs">
                TypeScript
              </MangaUI.Tag>
              <MangaUI.Tag color="red" size="xs">
                WebGL
              </MangaUI.Tag>
            </div>
          </MangaUI.Quote>
        </Row>
      </Block>

      {/* Timeline */}
      <Block title="Manga Timeline" subtitle="纵向时间线 · date × card">
        <Row label="Default · 末项加 NOW 角章">
          <div style={{ width: "100%", maxWidth: 720 }}>
            <MangaUI.Timeline
              items={[
                {
                  date: "2024 / 04",
                  title: "Lead",
                  caption: "Design Engineering Crew",
                  bottomBadge: { text: "NOW" },
                },
                { date: "2022 / 06", title: "Tech Lead", caption: "Industrial IoT" },
                { date: "2020 / 09", title: "Architect", caption: "Enterprise CMS" },
                { date: "2018 / 03", title: "Senior", caption: "Fintech Dashboard" },
              ]}
            />
          </div>
        </Row>
      </Block>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "var(--space-2xl)" }}>
      <h3
        style={{
          fontFamily: "var(--theme-font-display)",
          fontWeight: 900,
          fontSize: 28,
          color: "var(--theme-fg)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          margin: 0,
          marginBottom: 18,
          paddingBottom: 8,
          borderBottom: "3px solid var(--theme-fg)",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px, 160px) 1fr",
        alignItems: "center",
        gap: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "var(--theme-fg-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 24,
          padding: "16px 4px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
