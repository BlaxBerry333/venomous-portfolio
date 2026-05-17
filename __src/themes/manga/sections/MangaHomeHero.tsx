import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MangaUI } from "../components";

// Manga Hero — 升级少年漫（JoJo / 鬼灭 / 咒术 风：密度狂飙）
// - 巨幅网点 + 密集斜向速度线
// - 拟声词当主视觉（超大字号）
// - 错位漫画分镜框

const SPEED_LINES = 14;
const ONOMATOPOEIA_FLOAT = ["ドン!!", "ZZZ", "ガッ", "シュッ", "バン!", "!?"];

export default function MangaHomeHero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [floats, setFloats] = useState<{ id: number; word: string; x: number; y: number }[]>([]);
  const lastFloatTs = useRef(0);

  // mousemove 节流漂浮拟声词
  useEffect(() => {
    if (reduced) return;
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastFloatTs.current < 600) return;
      lastFloatTs.current = now;
      const rect = el.getBoundingClientRect();
      const word = ONOMATOPOEIA_FLOAT[Math.floor(Math.random() * ONOMATOPOEIA_FLOAT.length)];
      const id = Math.random();
      setFloats((f) => [...f, { id, word, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <div
      ref={heroRef}
      aria-label="Hero signature visualization (decorative)"
      style={{
        position: "relative",
        height: "100vh",
        background: "var(--theme-bg)",
        overflow: "hidden",
      }}
    >
      {/* 背景巨幅网点（青色与粉色交错） */}
      <div
        aria-hidden
        className="manga-ui--halftone"
        style={{
          position: "absolute",
          inset: 0,
          color: "rgba(14, 14, 16, 0.18)",
          zIndex: 0,
        }}
      />

      {/* 斜向密集速度线 */}
      {!reduced && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {Array.from({ length: SPEED_LINES }).map((_, i) => {
            const top = (i / SPEED_LINES) * 110 - 5;
            // 时长分散到 1400-2400ms，delay 用伪随机分布，避免集体同步导致的"断档"
            const duration = 1400 + ((i * 137) % 1000);
            const delay = -((i * 263) % duration);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${top}%`,
                  left: 0,
                  width: "70%",
                  height: 3,
                  background: i % 4 === 0 ? "var(--theme-accent)" : "var(--theme-fg)",
                  animation: `manga-ui--speed ${duration}ms linear ${delay}ms infinite`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 错位分镜框 1 - 左上：BOOM 红底（MangaUI.Card） */}
      <MangaUI.Card
        color="red"
        borderWidth={4}
        padding={16}
        minHeight={0}
        disableHover
        initial={
          reduced ? { opacity: 1, scale: 1, rotate: -3 } : { scale: 0, rotate: -25, opacity: 0 }
        }
        animate={{ scale: 1, rotate: -3, opacity: 1 }}
        transition={{
          delay: reduced ? 0 : 0.7,
          type: "spring",
          stiffness: 220,
          damping: 9,
        }}
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: "clamp(160px, 38vw, 280px)",
          height: "clamp(96px, 24vw, 180px)",
          color: "var(--theme-bg)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--theme-font-display)",
            fontSize: "clamp(36px, 9vw, 64px)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          BOOM!!
        </div>
      </MangaUI.Card>

      {/* 错位分镜框 2 - 右下：BOOM 黄底（MangaUI.Card） */}
      <MangaUI.Card
        color="yellow"
        borderWidth={4}
        padding={16}
        minHeight={0}
        disableHover
        initial={
          reduced ? { opacity: 1, scale: 1, rotate: 4 } : { scale: 0, rotate: 30, opacity: 0 }
        }
        animate={{ scale: 1, rotate: 4, opacity: 1 }}
        transition={{
          delay: reduced ? 0 : 0.9,
          type: "spring",
          stiffness: 220,
          damping: 9,
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "clamp(160px, 38vw, 280px)",
          height: "clamp(96px, 24vw, 180px)",
          color: "var(--theme-fg)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--theme-font-display)",
            fontSize: "clamp(36px, 9vw, 64px)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          BOOM!!
        </div>
      </MangaUI.Card>

      {/* 中央内容：CHEN + 拟声词 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          gap: 12,
          // 移动端两侧留出余量，CHEN 不顶到屏幕边
          padding: "0 clamp(20px, 6vw, 64px)",
          boxSizing: "border-box",
        }}
      >
        <motion.h1
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: reduced ? 0 : 0.2,
            type: "spring",
            stiffness: 220,
            damping: 9,
          }}
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            // 移动端下限固定 180px；PC 走 vw 上扬到 320 上限
            fontSize: "clamp(180px, 30vw, 320px)",
            letterSpacing: "0.02em",
            color: "var(--theme-fg)",
            textShadow: "10px 10px 0 var(--theme-accent), 20px 20px 0 var(--theme-fg)",
            margin: 0,
            userSelect: "none",
          }}
        >
          CHEN
        </motion.h1>

        <MangaUI.Card
          color="black"
          borderWidth={4}
          padding={16}
          minHeight={0}
          disableHover
          initial={
            reduced ? { opacity: 1, scale: 1, rotate: -4 } : { scale: 0, rotate: -14, opacity: 0 }
          }
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          transition={{
            delay: reduced ? 0 : 0.45,
            type: "spring",
            stiffness: 220,
            damping: 9,
          }}
          style={{
            // 保留双层硬阴影：accent 红 + fg 黑（覆盖 Card 默认单层）
            boxShadow: "10px 10px 0 var(--theme-accent), 18px 18px 0 var(--theme-fg)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(56px, 9vw, 80px)",
              color: "var(--theme-bg)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 0.9,
              display: "inline-block",
            }}
          >
            PORTFOLIO
          </span>
        </MangaUI.Card>
      </div>

      {/* 漂浮拟声词 (mousemove) */}
      {floats.map((f) => (
        <motion.span
          key={f.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0], y: -50 }}
          transition={{ duration: 1.4, type: "spring", stiffness: 280, damping: 12 }}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: 38,
            color: "var(--theme-accent)",
            WebkitTextStroke: "1.5px var(--theme-fg)",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {f.word}
        </motion.span>
      ))}
    </div>
  );
}
