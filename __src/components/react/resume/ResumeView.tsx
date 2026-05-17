import { useSkillCategories } from "@/data/skills.hooks";
import { useWorks } from "@/data/works.hooks";
import type { Locale } from "@/types";

// §1.E Resume 模式 — 纯文档式，无 3D / 无 shader / 无主题切换
// framer 仅 fade-in ≤ 200ms，prefers-reduced-motion 关闭

export default function ResumeView({ locale }: { locale: Locale }) {
  const works = useWorks(locale);
  const skillCategories = useSkillCategories(locale);
  return (
    <article
      style={{
        background: "var(--theme-bg)",
        color: "var(--theme-fg)",
        minHeight: "100vh",
        fontFamily: "var(--theme-font-body)",
        fontSize: 16,
        lineHeight: 1.6,
      }}
    >
      {/* <div style={{ maxWidth: 880, margin: "0 auto"}}> */}
      {/* Hero — 30vh */}
      <header
        style={{
          minHeight: "30vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--theme-font-display)",
            fontSize: 48,
            fontWeight: 700,
            color: "var(--theme-fg)",
          }}
        >
          Chen
        </h1>
        <p style={{ fontSize: 18, color: "var(--theme-fg-muted)", marginTop: 6 }}>
          Senior Frontend / Design Engineer · WebGL · Performance · Motion Systems
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              color: "var(--theme-accent)",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
          <a
            href="#"
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              color: "var(--theme-accent)",
              textDecoration: "none",
            }}
          >
            Resume.pdf
          </a>
          <a
            href="#"
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              color: "var(--theme-accent)",
              textDecoration: "none",
            }}
          >
            Contact
          </a>
        </div>
      </header>

      {/* summary */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: "var(--theme-font-display)", fontSize: 24, fontWeight: 700 }}>
          Summary
        </h2>
        <p style={{ marginTop: 12, color: "var(--theme-fg)" }}>
          Senior Frontend Engineer focused on Web Graphics, design engineering, and high-performance
          UI. 6+ years building production web apps in fintech, IoT, CMS and ad-platform domains.
          Specialized in WebGL / r3f, motion design, and design systems at scale.
        </p>
      </section>

      {/* experience-list */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: "var(--theme-font-display)", fontSize: 24, fontWeight: 700 }}>
          Experience
        </h2>
        {[
          {
            y: "2024 — Now",
            c: "Senior Frontend / Design Engineer",
            co: "(Confidential)",
            bullets: [
              "WebGL data viz at 200 msg/s",
              "Motion design system for 5 product lines",
              "LCP from 4.2s to 1.6s",
            ],
          },
          {
            y: "2022 — 2024",
            c: "Tech Lead",
            co: "Industrial IoT",
            bullets: ["Three.js factory twin", "Tauri desktop bundling", "MQTT bridge"],
          },
          {
            y: "2020 — 2022",
            c: "Frontend Architect",
            co: "Enterprise CMS",
            bullets: ["Micro-frontend architecture", "Form DSL engine", "12-person team lead"],
          },
          {
            y: "2018 — 2020",
            c: "Frontend Engineer",
            co: "Fintech Dashboard",
            bullets: [
              "Real-time chart engine",
              "WebSocket reconnect strategy",
              "Performance audits",
            ],
          },
        ].map((e, i) => (
          <div
            key={i}
            style={{
              marginTop: 24,
              paddingLeft: 16,
              borderLeft: "2px solid var(--theme-accent)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 12,
                color: "var(--theme-fg-muted)",
              }}
            >
              {e.y}
            </p>
            <p style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
              {e.c}{" "}
              <span style={{ color: "var(--theme-fg-muted)", fontWeight: 400 }}>· {e.co}</span>
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: "var(--theme-fg)" }}>
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* selected-works */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: "var(--theme-font-display)", fontSize: 24, fontWeight: 700 }}>
          Selected Works
        </h2>
        <ul style={{ marginTop: 16, listStyle: "none" }}>
          {works.map((w) => (
            <li
              key={w.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid color-mix(in srgb, var(--theme-fg) 8%, transparent)",
              }}
            >
              <span>
                <strong>{w.title}</strong>{" "}
                <span style={{ color: "var(--theme-fg-muted)" }}>— {w.subtitle}</span>
              </span>
              <a
                href="#"
                style={{
                  color: "var(--theme-accent)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                view
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* skills-tags */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: "var(--theme-font-display)", fontSize: 24, fontWeight: 700 }}>
          Skills
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {skillCategories
            .flatMap((c) => c.skills)
            .map((s) => (
              <span
                key={s}
                style={{
                  padding: "4px 10px",
                  background: "var(--theme-elevated)",
                  border: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 12,
                  borderRadius: 2,
                }}
              >
                {s}
              </span>
            ))}
        </div>
      </section>

      {/* contact-footer */}
      <footer
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
          color: "var(--theme-fg-muted)",
          fontSize: 14,
        }}
      >
        chen@example.com · github.com/chen · linkedin/chen
      </footer>
      {/* </div> */}
    </article>
  );
}
