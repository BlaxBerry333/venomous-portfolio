import SitePageSection from "@/components/react/layout/SitePageSection";
import type { CSSProperties } from "react";
import { ZenlessUI } from "../components";
import "./ZenlessAboutExperience.scss";

// Zenless About.Experience — 历史任务清单（Operation Log）
//
// 样式：BEM via ZenlessAboutExperience.scss
//   - block:    portfolio__zenless-about-experience
//   - element:  portfolio__zenless-about-experience__{year,year-num,year-span,card}

type HistoryColor = "green" | "orange" | "purple";

const HISTORY: {
  year: string;
  span: string;
  op: string;
  brief: string;
  metric: { value: string; label: string };
  color: HistoryColor;
  hex: string;
}[] = [
  {
    year: "2024",
    span: "2024 — NOW",
    op: "FINTECH TRADING CONSOLE",
    brief: "Sub-100ms render pipeline · 30+ symbols realtime · WebSocket fan-out",
    metric: { value: "<100ms", label: "RENDER" },
    color: "orange",
    hex: "#FF6B00",
  },
  {
    year: "2022",
    span: "2022 — 2024",
    op: "IOT CONTROL PLATFORM",
    brief: "WebGL telemetry mesh · 40k+ device fleet · live command bus",
    metric: { value: "40K+", label: "FLEET" },
    color: "orange",
    hex: "#FF6B00",
  },
  {
    year: "2020",
    span: "2020 — 2022",
    op: "HEADLESS CMS REBUILD",
    brief: "Design system · 8 product surfaces · zero-runtime tokens",
    metric: { value: "×8", label: "SURFACES" },
    color: "green",
    hex: "#C5FF00",
  },
  {
    year: "2018",
    span: "2018 — 2020",
    op: "E-COMMERCE CHECKOUT",
    brief: "Performance overhaul · cart funnel rewrite · A/B at scale",
    metric: { value: "+18%", label: "CONVERSION" },
    color: "green",
    hex: "#C5FF00",
  },
  {
    year: "2016",
    span: "2016 — 2018",
    op: "FIELD DEPLOYMENT",
    brief: "Interactive marketing sites · first commit · onboarding phase",
    metric: { value: "T+0", label: "ENLIST" },
    color: "purple",
    hex: "#8B5CF6",
  },
];

export default function ZenlessAboutExperience() {
  return (
    <SitePageSection
      className="portfolio__zenless-about-experience"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 25% 70%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-2xl)",
      }}
      containerProps={{ style: { position: "relative", zIndex: 1 } }}
    >
      {/* 全宽斜带 — 紫（顶部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="purple"
        animated
        rotate={-12}
        top="20vh"
        enterFrom="right"
        height={36}
        style={{ opacity: 0.55, zIndex: 0 }}
      />
      {/* 全宽斜带 — 绿（底部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="green"
        animated
        rotate={8}
        top="40vh"
        enterFrom="left"
        height={36}
        style={{ opacity: 0.55, zIndex: 0 }}
      />

      {/* 背景网格 — Zenless 档案室肌理 */}
      <ZenlessUI.Background />

      <ZenlessUI.Title2 label="OPERATION LOG" title="MY EXPERIENCE" style={{ marginBottom: 56 }} />

      {/* Archive: 档案卡 — 复用 ZenlessUI.Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {HISTORY.map((h, i) => {
          const yearStyle: CSSProperties = {};
          (yearStyle as Record<string, string>)["--portfolio__zenless-about-experience__year--ac"] =
            h.hex;

          return (
            <ZenlessUI.Card
              key={h.year}
              color={h.color}
              staggerIndex={i}
              className="portfolio__zenless-about-experience__card"
              leading={
                <div className="portfolio__zenless-about-experience__year" style={yearStyle}>
                  <span aria-hidden className="portfolio__zenless-about-experience__year-num">
                    {h.year}
                  </span>
                  <span className="portfolio__zenless-about-experience__year-span">{h.span}</span>
                </div>
              }
              title={h.op}
              description={h.brief}
              metric={h.metric}
            />
          );
        })}
      </div>
    </SitePageSection>
  );
}
