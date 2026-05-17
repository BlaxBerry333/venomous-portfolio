import type { Work } from "@/data/works";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import PanelFrame from "../PanelFrame";
export default function Panel1Cover({ work, theme }: { work: Work; theme: Theme }) {
  return (
    <PanelFrame
      theme={theme}
      index={1}
      total={9}
      label="Cover"
      jpLabel="表紙"
      hideHeader={theme === "zenless"}
    >
      <div
        className="wd-cover"
        style={{
          height: "100%",
          backgroundImage: `linear-gradient(to bottom right, color-mix(in srgb, var(--theme-bg) 60%, transparent), var(--theme-bg)), url(${work.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "var(--space-xl)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border:
            theme === "manga"
              ? "5px solid var(--theme-fg)"
              : theme === "zenless"
                ? "2px solid var(--theme-accent)"
                : "1px solid color-mix(in srgb, var(--theme-accent) 28%, transparent)",
          boxShadow:
            theme === "manga"
              ? "var(--theme-shadow-strong)"
              : theme === "zenless"
                ? "0 0 32px rgba(197,255,0,0.25)"
                : "none",
        }}
      >
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="01 / 09"
            title={work.title}
            titleSize="clamp(56px, 10vw, 160px)"
            style={{ maxWidth: 1200 }}
          />
        ) : (
          <>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 12,
                letterSpacing: "0.3em",
                color: "var(--theme-accent)",
                textTransform: "uppercase",
              }}
            >
              {theme === "void" ? `./${work.category}/${work.id}` : `// ${work.category}`}
            </p>
            <h1
              style={{
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: "clamp(56px, 10vw, 160px)",
                letterSpacing: theme === "manga" ? "0.02em" : "-0.03em",
                lineHeight: 0.95,
                color: "var(--theme-fg)",
                marginTop: 16,
                maxWidth: 1200,
                textShadow: theme === "manga" ? "8px 8px 0 var(--theme-accent)" : "none",
              }}
            >
              {work.title}
            </h1>
          </>
        )}
        <p
          style={{
            fontFamily: "var(--theme-font-body)",
            fontSize: 22,
            color: "var(--theme-fg-muted)",
            marginTop: 24,
            maxWidth: 700,
            lineHeight: 1.4,
            fontWeight: theme === "manga" ? 700 : 400,
          }}
        >
          {work.subtitle}
        </p>
      </div>
    </PanelFrame>
  );
}
