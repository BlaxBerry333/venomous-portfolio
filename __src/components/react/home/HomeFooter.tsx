import SitePageSection from "@/components/react/layout/SitePageSection";
import { MangaUI } from "@/themes/manga/components";
import { VoidUI } from "@/themes/void/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Locale, Theme } from "@/types";
import { ui } from "@/utils/data";
import { getLocalizedUrl, pickLocale } from "@/utils/i18n";
import { motion, useReducedMotion } from "framer-motion";

interface HomeFooterSectionProps {
  theme?: Theme;
  locale: Locale;
}

export default function HomeFooterSection({ theme, locale }: HomeFooterSectionProps) {
  const reduced = useReducedMotion();
  const HEADING_LINES = pickLocale(ui.cta.headingLines, locale);
  const themeHint = pickLocale(ui.cta.themeHint, locale);
  const resumeUrl = getLocalizedUrl("/resume", locale);

  return (
    <SitePageSection
      style={{
        minHeight: "60vh",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
        background: "var(--theme-bg)",
      }}
      containerProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--space-xl)",
          minHeight: "inherit",
        },
      }}
    >
      <div style={{ width: "100%", position: "relative", textAlign: "center" }}>
        {HEADING_LINES.map((line, i) => (
          <motion.p
            key={i}
            className="home-cta-heading"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: reduced ? 0 : i * 0.08,
            }}
            style={{
              color: i === HEADING_LINES.length - 1 ? "var(--theme-accent)" : "var(--theme-fg)",
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        className="home-cta-theme-hint"
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.2 }}
      >
        {themeHint}
      </motion.p>

      <div
        style={{
          display: "flex",
          gap: "var(--space-md)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {theme === "zenless" ? (
          <>
            <ZenlessUI.Button variant="outlined" size="md" href="#">
              GitHub
            </ZenlessUI.Button>
            <ZenlessUI.Button variant="outlined" size="md" href={resumeUrl}>
              RESUME
            </ZenlessUI.Button>
          </>
        ) : theme === "void" ? (
          <>
            <VoidUI.Button href="#">GitHub</VoidUI.Button>
            <VoidUI.Button href={resumeUrl}>RESUME</VoidUI.Button>
          </>
        ) : (
          <>
            <MangaUI.Button color="black" size="md" restRotate={1}>
              GitHub
            </MangaUI.Button>
            <a href={resumeUrl} style={{ textDecoration: "none" }}>
              <MangaUI.Button color="white" size="md" restRotate={-0.5}>
                RESUME
              </MangaUI.Button>
            </a>
          </>
        )}
      </div>
    </SitePageSection>
  );
}
