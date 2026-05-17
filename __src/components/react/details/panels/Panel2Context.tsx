import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import PanelFrame from "../PanelFrame";
export default function Panel2Context({ work, theme }: { work: Work; theme: Theme }) {
  return (
    <PanelFrame
      theme={theme}
      index={2}
      total={9}
      label="Context"
      jpLabel="背景"
      hideHeader={theme === "zenless"}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: theme === "manga" ? "flex-start" : "center",
        }}
      >
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="02 / 09"
            title="Briefing"
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 32 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32, marginTop: 0 }}>Background</MangaUI.Title1>
        ) : (
          <h2
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 120px)",
              letterSpacing: "-0.03em",
              color: "var(--theme-fg)",
              margin: "0 0 32px",
              lineHeight: 1,
            }}
          >
            Background
          </h2>
        )}
        <p
          className="wd-context-lead"
          style={{
            fontFamily: "var(--theme-font-body)",
            fontSize: 22,
            color: "var(--theme-fg)",
            maxWidth: 1000,
            lineHeight: 1.5,
            fontWeight: theme === "manga" ? 700 : 400,
          }}
        >
          {work.title} 是 {work.category === "company" ? "公司主营业务" : "我个人发起的开源项目"}，
          面向 {work.category === "company" ? "B 端专业用户" : "前端开发社区"}。 服务于{" "}
          <strong style={{ color: "var(--theme-accent)" }}>{work.subtitle}</strong> 这一核心场景。
        </p>
        <div
          className="wd-context-meta"
          style={{
            marginTop: 64,
            display: "flex",
            gap: "var(--space-2xl)",
            fontFamily: "var(--theme-font-mono)",
            fontSize: 13,
            color: "var(--theme-fg-muted)",
          }}
        >
          {[
            { label: theme === "zenless" ? "TIMELINE" : "Timeline", v: "2023 — 2024" },
            {
              label: theme === "zenless" ? "STAGE" : "Stage",
              v: work.category === "company" ? "Production" : "Open Source",
            },
            { label: theme === "zenless" ? "STACK" : "Stack", v: `${work.techStack.length} libs` },
          ].map((it) => (
            <div key={it.label} className="wd-context-meta-item">
              <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                {it.label}
              </p>
              <p style={{ color: "var(--theme-fg)", fontSize: 18 }}>{it.v}</p>
            </div>
          ))}
        </div>
      </div>
    </PanelFrame>
  );
}
