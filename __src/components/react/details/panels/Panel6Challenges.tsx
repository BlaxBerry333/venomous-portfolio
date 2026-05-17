import type { Work } from "@/data/works";
import { BAGUA, MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import PanelFrame from "../PanelFrame";
export default function Panel6Challenges({ work, theme }: { work: Work; theme: Theme }) {
  const probColor = theme === "zenless" ? "#FF6B00" : "#FF003C";
  return (
    <PanelFrame
      theme={theme}
      index={6}
      total={9}
      label="Challenges"
      jpLabel="難敵"
      hideHeader={theme === "zenless"}
    >
      <div style={{ height: "100%", overflow: "visible" }}>
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="06 / 09"
            title="Threats"
            accentColor={probColor}
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 32 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32 }}>Hard Boss</MangaUI.Title1>
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
            Hard Problems
          </h2>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xl)",
            maxWidth: 1400,
          }}
        >
          {work.challenges.map((ch, i) => (
            <div
              key={i}
              className="wd-grid-2col"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}
            >
              {theme === "manga" ? (
                <MangaUI.Card
                  color="white"
                  padding={20}
                  minHeight={160}
                  halftone={false}
                  restRotate={-0.6}
                  prefix={
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: probColor,
                      }}
                    >
                      PROBLEM
                    </span>
                  }
                  watermark={BAGUA.KAN}
                  watermarkColor={probColor}
                >
                  <p
                    style={{
                      fontSize: 18,
                      lineHeight: 1.5,
                      fontWeight: 700,
                      marginTop: 12,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {ch.problem}
                  </p>
                </MangaUI.Card>
              ) : (
                <div
                  style={{
                    padding: "var(--space-lg)",
                    background: `color-mix(in srgb, ${probColor} 10%, var(--theme-elevated))`,
                    border: `1px solid ${probColor}`,
                    clipPath:
                      theme === "zenless" ? "polygon(2% 0, 100% 0, 98% 100%, 0 100%)" : "none",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--theme-font-mono)",
                      color: probColor,
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      fontWeight: 700,
                    }}
                  >
                    {theme === "zenless" ? "▸ THREAT" : "Problem"}
                  </p>
                  <p
                    style={{
                      fontSize: 18,
                      color: "var(--theme-fg)",
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    {ch.problem}
                  </p>
                </div>
              )}
              {theme === "manga" ? (
                <MangaUI.Card
                  color="black"
                  padding={20}
                  minHeight={160}
                  halftone={false}
                  restRotate={0.6}
                  prefix={
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--theme-accent)",
                      }}
                    >
                      SOLUTION
                    </span>
                  }
                  watermark={BAGUA.LI}
                >
                  <p
                    style={{
                      fontSize: 18,
                      lineHeight: 1.5,
                      fontWeight: 700,
                      marginTop: 12,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {ch.solution}
                  </p>
                </MangaUI.Card>
              ) : (
                <div
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      "color-mix(in srgb, var(--theme-accent) 10%, var(--theme-elevated))",
                    color: "var(--theme-fg)",
                    border: "1px solid var(--theme-accent)",
                    clipPath:
                      theme === "zenless" ? "polygon(2% 0, 100% 0, 98% 100%, 0 100%)" : "none",
                  }}
                >
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--theme-font-mono)",
                      color: "var(--theme-accent)",
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      fontWeight: 700,
                    }}
                  >
                    {theme === "zenless" ? "▸ COUNTER" : "Solution"}
                  </p>
                  <p style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 400 }}>{ch.solution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PanelFrame>
  );
}
