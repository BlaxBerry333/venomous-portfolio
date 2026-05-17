import SitePageSection from "@/components/react/layout/SitePageSection";
import type { Locale } from "@/types";
import { ui } from "@/utils/data";
import { pickLocale } from "@/utils/i18n";
import { motion, useReducedMotion } from "framer-motion";

// §4.5 Manifesto 进场
// framer-motion useScroll-style 每行 stagger fade + translateY 24→0
// 600ms cubic-bezier(0.16,1,0.3,1) stagger 80ms
// 背景：默认 var(--theme-bg)；void 主题下透明，让 App 层 fixed 星尘场显示

export default function HomeDescriptionSection({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const lines = pickLocale(ui.manifesto, locale);

  return (
    <SitePageSection
      className="theme-bleed-bg"
      style={{
        minHeight: "60vh",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
        overflow: "hidden",
      }}
      containerProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "inherit",
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={`home-manifesto-line${i === 0 ? " home-manifesto-line--first" : ""}${
            i === lines.length - 1 ? " home-manifesto-line--last" : ""
          }`}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: reduced ? 0 : i * 0.08,
          }}
          style={{
            color: i === 0 ? "var(--theme-accent)" : "var(--theme-fg)",
          }}
        >
          {line}
        </motion.p>
      ))}
    </SitePageSection>
  );
}
