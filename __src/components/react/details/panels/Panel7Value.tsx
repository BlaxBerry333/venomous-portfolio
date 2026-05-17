import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import PanelFrame from "../PanelFrame";
function CounterNumber({ to, active }: { to: number; active: boolean }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 60, damping: 20 });
  const display = useTransform(sp, (v) => Math.round(v));

  useEffect(() => {
    if (active) mv.set(reduced ? to : to);
  }, [active, to, mv, reduced]);

  if (reduced) return <span>{to}</span>;
  return <motion.span>{display}</motion.span>;
}

export default function Panel7Value({
  work,
  active,
  theme,
}: {
  work: Work;
  active: boolean;
  theme: Theme;
}) {
  return (
    <PanelFrame
      theme={theme}
      index={7}
      total={9}
      label="Business Value"
      jpLabel="戦果数値"
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
            phase="07 / 09"
            title="Rewards"
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 64 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32 }}>Impact!!</MangaUI.Title1>
        ) : (
          <h2
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 120px)",
              letterSpacing: "-0.03em",
              color: "var(--theme-fg)",
              margin: "0 0 64px",
              lineHeight: 1,
            }}
          >
            Impact
          </h2>
        )}
        <div
          className="wd-grid-metrics"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${work.businessValue.length}, 1fr)`,
            gap: "var(--space-2xl)",
            maxWidth: 1600,
          }}
        >
          {work.businessValue.map((m, i) =>
            theme === "manga" ? (
              <MangaUI.Card
                key={i}
                color={i % 2 === 0 ? "black" : "red"}
                padding={20}
                minHeight={180}
                halftone={false}
                restRotate={((i % 3) - 1) * 1}
                prefix={m.label}
              >
                <p
                  style={{
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(48px, 8vw, 160px)",
                    lineHeight: 0.9,
                    color: i % 2 === 0 ? "var(--theme-accent-2)" : "var(--theme-fg)",
                    letterSpacing: "-0.04em",
                    marginTop: 16,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <CounterNumber to={m.value} active={active} />
                  <span style={{ fontSize: "0.4em", marginLeft: 8 }}>{m.suffix}</span>
                </p>
              </MangaUI.Card>
            ) : (
              <div
                key={i}
                style={
                  theme === "zenless"
                    ? {
                        padding: 20,
                        background: "var(--theme-elevated)",
                        border: "2px solid var(--theme-accent)",
                        clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0 100%)",
                      }
                    : {}
                }
              >
                <p
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    color: theme === "zenless" ? "var(--theme-accent)" : "var(--theme-fg-muted)",
                    textTransform: "uppercase",
                    marginBottom: 16,
                    fontWeight: 400,
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(48px, 8vw, 160px)",
                    lineHeight: 0.9,
                    color: "var(--theme-accent)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  <CounterNumber to={m.value} active={active} />
                  <span style={{ fontSize: "0.4em", color: "var(--theme-fg)", marginLeft: 8 }}>
                    {m.suffix}
                  </span>
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </PanelFrame>
  );
}
