import type { Work } from "@/data/works";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// §4.12 NDA 加密档案视觉
// 关键词 matrix-style decode 800ms linear stagger 200ms；徽章 400ms cubic-bezier(0.16,1,0.3,1)

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";

function DecodeWord({
  target,
  delay,
  reduced,
}: {
  target: string;
  delay: number;
  reduced: boolean;
}) {
  const [text, setText] = useState(reduced ? target : "");

  useEffect(() => {
    if (reduced) {
      setText(target);
      return;
    }
    let raf: number;
    const start = performance.now() + delay;
    const duration = 800;
    const charSet = RANDOM_CHARS.split("");

    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - start) / duration, 1);
      const revealCount = Math.floor(t * target.length);
      const revealed = target.slice(0, revealCount);
      const remain = Array.from({ length: target.length - revealCount })
        .map(() => charSet[Math.floor(Math.random() * charSet.length)])
        .join("");
      setText(revealed + remain);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setText(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay, reduced]);

  return <span style={{ fontFamily: "var(--theme-font-mono)" }}>{text}</span>;
}

export default function NdaVault({ work }: { work: Work }) {
  const reduced = useReducedMotion();
  const keywords = work.ndaKeywords ?? [];

  return (
    <section
      aria-label="Confidential project — content redacted"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: `url(${work.cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        border: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(12px) grayscale(1)",
          WebkitBackdropFilter: "blur(12px) grayscale(1)",
          background: "color-mix(in srgb, var(--theme-bg) 60%, transparent)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, rgba(255,0,60,0.04) 0px, rgba(255,0,60,0.04) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 红色封条 */}
      <motion.div
        initial={
          reduced ? { opacity: 1, scale: 1, rotate: -8 } : { opacity: 0, scale: 0.5, rotate: -20 }
        }
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 32,
          right: 32,
          padding: "16px 32px",
          border: "4px solid #FF003C",
          color: "#FF003C",
          fontFamily: "var(--theme-font-display)",
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: "0.15em",
          background: "rgba(255,0,60,0.08)",
          textShadow: "0 0 4px rgba(255,0,60,0.6)",
        }}
      >
        CONFIDENTIAL
      </motion.div>

      {/* 关键词浮现 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "var(--space-3xl) var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-md)",
        }}
      >
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--theme-font-mono)",
            fontSize: 13,
            letterSpacing: "0.3em",
            color: "var(--theme-fg-muted)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Disclosable keywords
        </p>
        {keywords.map((kw, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: "clamp(20px, 3vw, 40px)",
              fontWeight: 700,
              color: "var(--theme-fg)",
              letterSpacing: "0.05em",
              textShadow: "0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            <DecodeWord target={kw} delay={i * 200} reduced={!!reduced} />
          </p>
        ))}
      </div>
    </section>
  );
}
