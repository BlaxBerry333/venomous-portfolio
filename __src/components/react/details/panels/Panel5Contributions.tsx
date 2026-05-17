import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import PanelFrame from "../PanelFrame";
export default function Panel5Contributions({ work, theme }: { work: Work; theme: Theme }) {
  const reduced = useReducedMotion();
  return (
    <PanelFrame
      theme={theme}
      index={5}
      total={9}
      label="Contributions"
      jpLabel="戦果"
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
            phase="05 / 09"
            title="Achievements"
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 32 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32 }}>What I Built</MangaUI.Title1>
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
            What I Built
          </h2>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: theme === "manga" ? 20 : "var(--space-lg)",
            maxWidth: 1600,
          }}
        >
          {work.contributions.map((c, i) =>
            theme === "manga" ? (
              <MangaUI.Card
                key={i}
                color={i % 2 === 0 ? "white" : "black"}
                padding={20}
                minHeight={160}
                halftone={false}
                prefix={`No. ${String(i + 1).padStart(2, "0")}`}
                restRotate={((i % 3) - 1) * 1}
                initial={
                  reduced ? { opacity: 1 } : { opacity: 0, y: 24, rotate: ((i % 3) - 1) * 1 }
                }
                animate={{ opacity: 1, y: 0, rotate: ((i % 3) - 1) * 1 }}
                transition={{
                  delay: reduced ? 0 : i * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    fontSize: 18,
                    lineHeight: 1.5,
                    fontWeight: 700,
                    marginTop: 12,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {c}
                </p>
              </MangaUI.Card>
            ) : (
              <motion.div
                key={i}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : i * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  padding: "var(--space-lg)",
                  background: "var(--theme-elevated)",
                  color: "var(--theme-fg)",
                  border:
                    theme === "zenless"
                      ? "2px solid var(--theme-accent)"
                      : "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                  borderLeft: theme === "void" ? "3px solid var(--theme-accent)" : undefined,
                  boxShadow:
                    theme === "zenless" ? "0 0 16px rgba(197,255,0,0.2)" : "var(--theme-shadow)",
                  clipPath:
                    theme === "zenless" ? "polygon(2% 0, 100% 0, 98% 100%, 0 100%)" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "var(--theme-accent)",
                    marginBottom: 12,
                    fontWeight: 700,
                  }}
                >
                  {theme === "zenless" ? "▸ TASK " : "# "}
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    fontSize: 18,
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {c}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </PanelFrame>
  );
}
