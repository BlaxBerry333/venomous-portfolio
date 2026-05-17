import { motion, useReducedMotion } from "framer-motion";
import { ZenlessUI } from "../components";
import "./ZenlessHomeHero.scss";

// Zenless Hero — 绝区零风（街头涂鸦 + 故障 UI + 高饱和荧光）
// 配色：荧光绿 #C5FF00 + 紫 #8B5CF6 + 警示橙 #FF6B00 + 纯黑
// - 双斜带文案：顶 PORTFOLIO + SYS-04 // SIGNAL OK（任务终端 mono 元数据）
//   / 底 WELCOME + READY ▸▸▸（街头标语箭头组）—— 终端冷感 × 街头热感
//
// 样式：BEM via ZenlessHomeHero.scss
//   - block:    portfolio__zenless-home-hero
//   - element:  portfolio__zenless-home-hero__{stripe,stripe-text,hazard,title}
//   - element modifier: __stripe--{top|bottom}, __stripe-text--{top|bottom|top-left|bottom-right}, __hazard--{top|bottom}

export default function ZenlessHomeHero() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-label="Hero signature visualization (decorative)"
      style={{
        position: "relative",
        height: "100vh",
        background: "var(--theme-bg)",
        // 不剪 — 斜带需要纵向溢出 hero 显示在下个 section 之上；
        // 横向溢出（width:200% 旋转后）由 body { overflow-x: hidden } 在更外层兜住
        // 注意：单独设 overflow-x 会让 overflow-y 隐式变成 auto，触发垂直滚动条，所以这里必须 visible
        overflow: "visible",
        color: "var(--theme-fg)",
      }}
    >
      {/* 背景：故障紫色径向 + 荧光绿径向
          底部用 mask 渐隐，避免 hero 底缘和下一个 section 出现可见接缝 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 25% 75%, rgba(139,92,246,0.32) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 80% 25%, rgba(197,255,0,0.18) 0%, transparent 65%)",
          zIndex: 0,
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 75%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 75%, transparent 100%)",
        }}
      />
      {/* 背景网格 — Zenless 档案室肌理 */}
      <ZenlessUI.Background />

      {/* 顶部紧挨绿斜带上沿的窄警戒线（同角度同方向，与主斜带同步入场） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="green"
        animated
        rotate={8}
        top="calc(12vh - 8px)"
        enterFrom="left"
        enterTrigger="load"
        height={8}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="portfolio__zenless-home-hero__hazard portfolio__zenless-home-hero__hazard--top"
        style={{ zIndex: 39, opacity: 0.9 }}
      />

      {/* 顶部荧光绿斜带 + 文字 — 文字回到斜带容器内
          斜带宽 200% / left -50%，确保旋转后两端覆盖屏幕 100% 外
          注意：rotate 必须写在 framer-motion style.rotate 上，否则会被 animate.x 的 translate 覆盖 */}
      <motion.div
        aria-hidden
        initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="portfolio__zenless-home-hero__stripe portfolio__zenless-home-hero__stripe--top"
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          height: 64,
          background: "var(--theme-accent)",
          rotate: 8,
          transformOrigin: "center",
          opacity: 0.92,
          // 斜带永远显示在 hero 下面 section 之上（但低于 header z-index 50）
          zIndex: 40,
          boxShadow: "0 0 24px rgba(197,255,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="portfolio__zenless-home-hero__stripe-text portfolio__zenless-home-hero__stripe-text--top-left"
          style={{
            fontFamily: "var(--theme-font-mono, ui-monospace, monospace)",
            fontWeight: 700,
            fontSize: "clamp(13px, 1.6vw, 18px)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--theme-bg)",
            userSelect: "none",
            whiteSpace: "nowrap",
            opacity: 0.78,
          }}
        >
          HELLO AND WELCOME
        </span>
        <span
          className="portfolio__zenless-home-hero__stripe-text portfolio__zenless-home-hero__stripe-text--top"
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: "clamp(20px, 2.6vw, 30px)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--theme-bg)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          ▸ MY PORTFOLIO
        </span>
      </motion.div>

      {/* 底部紧挨紫斜带下沿的窄警戒线（同角度同方向，与主斜带同步入场） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="purple"
        animated
        rotate={-12}
        top="calc(82vh + 56px)"
        enterFrom="right"
        enterTrigger="load"
        height={8}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="portfolio__zenless-home-hero__hazard portfolio__zenless-home-hero__hazard--bottom"
        style={{ zIndex: 39, opacity: 0.9 }}
      />

      <motion.div
        aria-hidden
        initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="portfolio__zenless-home-hero__stripe portfolio__zenless-home-hero__stripe--bottom"
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          height: 56,
          background: "var(--theme-accent-2)",
          rotate: -12,
          transformOrigin: "center",
          opacity: 0.9,
          // 同上 — 显示在下个 section 之上但低于 header
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="portfolio__zenless-home-hero__stripe-text portfolio__zenless-home-hero__stripe-text--bottom"
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: "clamp(18px, 2.4vw, 28px)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--theme-fg)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          ▸ SCROLL PAGE
        </span>
        <span
          className="portfolio__zenless-home-hero__stripe-text portfolio__zenless-home-hero__stripe-text--bottom-right"
          style={{
            fontFamily: "var(--theme-font-mono, ui-monospace, monospace)",
            fontWeight: 700,
            fontSize: "clamp(13px, 1.6vw, 18px)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--theme-fg)",
            userSelect: "none",
            whiteSpace: "nowrap",
            opacity: 0.85,
          }}
        >
          STYLE IS READY ▸▸▸
        </span>
      </motion.div>

      {/* 中央：HUGE 名字 */}
      <motion.h1
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="portfolio__zenless-home-hero__title"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          zIndex: 5,
          fontFamily: "var(--theme-font-display)",
          fontWeight: 900,
          fontSize: "clamp(180px, 26vw, 320px)",
          letterSpacing: "-0.02em",
          color: "var(--theme-fg)",
          margin: 0,
          userSelect: "none",
          textShadow: "0 0 18px rgba(197, 255, 0, 0.6)",
          lineHeight: 0.9,
        }}
      >
        CHEN
      </motion.h1>
    </div>
  );
}
