import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import PanelFrame from "../PanelFrame";
export default function Panel4Role({ work, theme }: { work: Work; theme: Theme }) {
  return (
    <PanelFrame
      theme={theme}
      index={4}
      total={9}
      label="My Role"
      jpLabel="役職"
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
            phase="04 / 09"
            title="Operator"
            titleSize="clamp(40px, 7vw, 120px)"
            style={{ marginBottom: 32 }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1 style={{ marginBottom: 32 }}>My Role</MangaUI.Title1>
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
            My Role
          </h2>
        )}
        <div
          className="wd-grid-role"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "var(--space-3xl)",
            maxWidth: 1400,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--theme-font-body)",
                fontSize: 28,
                color: "var(--theme-fg)",
                lineHeight: 1.4,
                fontWeight: theme === "manga" ? 700 : 400,
              }}
            >
              {work.myRole}
            </p>
          </div>
          <div
            className="wd-role-avatar"
            style={{
              width: 120,
              height: 120,
              border:
                theme === "manga" ? "5px solid var(--theme-fg)" : "2px solid var(--theme-accent)",
              borderRadius: theme === "zenless" ? 0 : "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme === "manga" ? "var(--theme-fg)" : "var(--theme-accent)",
              boxShadow:
                theme === "manga"
                  ? "8px 8px 0 var(--theme-accent)"
                  : theme === "zenless"
                    ? "0 0 24px rgba(197,255,0,0.4)"
                    : "var(--theme-shadow)",
              background: theme === "manga" ? "var(--theme-bg)" : "var(--theme-elevated)",
              clipPath: theme === "zenless" ? "polygon(15% 0, 100% 0, 85% 100%, 0 100%)" : "none",
            }}
          ></div>
          <div
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 14,
              color: "var(--theme-fg-muted)",
              lineHeight: 1.8,
            }}
          >
            <p style={{ color: "var(--theme-accent)", letterSpacing: "0.2em", fontSize: 11 }}>
              POSITION
            </p>
            <p style={{ color: "var(--theme-fg)", fontSize: 18, marginTop: 4 }}>
              {work.myRole.split("/")[0].trim()}
            </p>
            <p
              style={{
                color: "var(--theme-accent)",
                letterSpacing: "0.2em",
                fontSize: 11,
                marginTop: 16,
              }}
            >
              TEAM
            </p>
            <p style={{ color: "var(--theme-fg)", fontSize: 18, marginTop: 4 }}>
              {work.myRole.split("/")[1]?.trim() ?? "Independent"}
            </p>
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}
