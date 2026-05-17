import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import { motion } from "framer-motion";
import PanelFrame from "../PanelFrame";
export default function Panel9Next({ theme }: { theme: Theme }) {
  return (
    <PanelFrame
      theme={theme}
      index={9}
      total={9}
      label="Next"
      jpLabel="次回予告"
      hideHeader={theme === "zenless"}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
        }}
      >
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="09 / 09"
            title="Next Mission"
            titleSize="clamp(48px, 9vw, 200px)"
            style={{ alignItems: "center", textAlign: "center" }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ textAlign: "center" }}>次回予告!!</MangaUI.Title1>
        ) : (
          <h2
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(48px, 9vw, 200px)",
              letterSpacing: "-0.04em",
              color: "var(--theme-fg)",
              textAlign: "center",
              lineHeight: 0.95,
            }}
          >
            Next Project
          </h2>
        )}
        {theme === "zenless" ? (
          <ZenlessUI.Button variant="contained" size="lg" animation="nudge">
            Continue
          </ZenlessUI.Button>
        ) : (
          <motion.button
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: theme === "manga" ? "14px 32px" : "16px 32px",
              background: "var(--theme-accent)",
              color: theme === "manga" ? "var(--theme-fg)" : "var(--theme-bg)",
              border: theme === "manga" ? "3px solid var(--theme-fg)" : "none",
              fontFamily:
                theme === "manga" ? "var(--theme-font-display)" : "var(--theme-font-mono)",
              fontWeight: theme === "manga" ? 900 : 700,
              fontSize: 16,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "var(--theme-radius)",
              boxShadow: theme === "manga" ? "6px 6px 0 var(--theme-fg)" : "none",
            }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </PanelFrame>
  );
}
