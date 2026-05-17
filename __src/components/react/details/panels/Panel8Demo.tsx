import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import NdaVault from "../NdaVault";
import PanelFrame from "../PanelFrame";
export default function Panel8Demo({ work, theme }: { work: Work; theme: Theme }) {
  return (
    <PanelFrame
      theme={theme}
      index={8}
      total={9}
      label="Demo / Gallery"
      jpLabel="実演"
      hideHeader={theme === "zenless"}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="08 / 09"
            title="Combat Replay"
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 32 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32 }}>実演!!</MangaUI.Title1>
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
            See It Live
          </h2>
        )}
        <div style={{ flex: 1, display: "flex" }}>
          {work.demoType === "live" && (
            <iframe
              title={work.title}
              src={work.liveUrl ?? "about:blank"}
              style={{
                width: "100%",
                height: "100%",
                border:
                  theme === "manga"
                    ? "4px solid var(--theme-fg)"
                    : "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                background: "var(--theme-elevated)",
                boxShadow: theme === "manga" ? "var(--theme-shadow-strong)" : "none",
              }}
            />
          )}
          {work.demoType === "iframe" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "var(--theme-elevated)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--theme-font-mono)",
                color: "var(--theme-fg-muted)",
                border:
                  theme === "manga"
                    ? "4px solid var(--theme-fg)"
                    : "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
              }}
            >
              ⟶ CodeSandbox / StackBlitz embed (占位：{work.iframeUrl})
            </div>
          )}
          {work.demoType === "screenshot" && (
            <div
              className="wd-demo-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                gap: "var(--space-md)",
                width: "100%",
              }}
            >
              {(work.screenshots ?? []).map((s, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "16/10",
                    backgroundImage: `url(${s})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border:
                      theme === "manga"
                        ? "4px solid var(--theme-fg)"
                        : "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                    boxShadow: theme === "manga" ? "8px 8px 0 var(--theme-accent)" : "none",
                    transform: theme === "manga" ? `rotate(${((i % 3) - 1) * 1}deg)` : "none",
                  }}
                />
              ))}
            </div>
          )}
          {work.demoType === "nda" && <NdaVault work={work} />}
        </div>
      </div>
    </PanelFrame>
  );
}
