import SitePageSection from "@/components/react/layout/SitePageSection";
import { motion, useReducedMotion } from "framer-motion";
import { VoidUI } from "../components";

// Void About.Experience — 垂直 trajectory 时间轴

const TRAJECTORY = [
  { year: "2024", title: "Design Engineer · Lead", caption: "Fortune-100 client (confidential)" },
  { year: "2022", title: "Tech Lead", caption: "Industrial IoT · 3D twin · edge compute" },
  { year: "2020", title: "Frontend Architect", caption: "Enterprise CMS · 12-person team" },
  { year: "2018", title: "Senior Frontend", caption: "Fintech dashboard · real-time charts" },
  { year: "2016", title: "Initiation", caption: "First production deploy" },
];

export default function VoidAboutExperience() {
  const reduced = useReducedMotion();

  return (
    <SitePageSection
      style={{
        paddingTop: "clamp(48px, 10vh, 120px)",
        paddingBottom: "clamp(48px, 10vh, 120px)",
      }}
    >
      <VoidUI.Title2 text="My Experience" style={{ marginBottom: 64 }} />

      <div style={{ position: "relative", paddingLeft: 32, maxWidth: 900 }}>
        {/* 垂直线 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 6,
            top: 8,
            bottom: 8,
            width: 1,
            background:
              "linear-gradient(to bottom, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 30%, transparent) 70%, transparent)",
          }}
        />
        {TRAJECTORY.map((t, i) => (
          <motion.div
            key={t.year}
            initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              paddingBottom: 56,
              paddingLeft: 32,
            }}
          >
            {/* 节点光点 + 进入视口爆开 ripple */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: -32,
                top: 4,
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: "var(--theme-bg)",
                border: "1px solid var(--theme-accent)",
                boxShadow:
                  i === 0
                    ? "0 0 16px var(--theme-accent), inset 0 0 6px var(--theme-accent)"
                    : "0 0 6px var(--theme-accent)",
              }}
            >
              {!reduced && (
                <>
                  <motion.span
                    initial={{ scale: 1, opacity: 0.6 }}
                    whileInView={{ scale: 4, opacity: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      border: "1px solid var(--theme-accent)",
                    }}
                  />
                  <motion.span
                    initial={{ scale: 1, opacity: 0.4 }}
                    whileInView={{ scale: 6, opacity: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      border: "1px solid var(--theme-accent)",
                    }}
                  />
                </>
              )}
            </span>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 12,
                color: "var(--theme-accent)",
                letterSpacing: "0.3em",
                marginBottom: 8,
              }}
            >
              {t.year}
            </p>
            <h3
              style={{
                fontFamily: "var(--theme-font-display)",
                fontWeight: 700,
                fontSize: "clamp(22px, 2.4vw, 32px)",
                color: i === 0 ? "var(--theme-accent)" : "var(--theme-fg)",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: 0,
                textShadow:
                  i === 0
                    ? "0 0 16px color-mix(in srgb, var(--theme-accent) 35%, transparent)"
                    : "none",
              }}
            >
              {t.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--theme-font-body)",
                fontSize: 16,
                color: i === 0 ? "var(--theme-accent)" : "var(--theme-fg-muted)",
                marginTop: 8,
                fontWeight: 300,
                lineHeight: 1.55,
              }}
            >
              {t.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </SitePageSection>
  );
}
