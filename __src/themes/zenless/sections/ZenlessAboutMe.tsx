import SitePageSection from "@/components/react/layout/SitePageSection";
import type { Locale } from "@/types";
import { getCareerYears, ui } from "@/utils/data";
import { getLocalizedUrl, pickLocale } from "@/utils/i18n";
import { motion } from "framer-motion";
import { ZenlessUI } from "../components";
import "./ZenlessAboutMe.scss";

// Zenless About.Me — Hero：两行错位（左文+右卡）
//
// 样式：BEM via ZenlessAboutMe.scss
//   - block:    portfolio__zenless-about-me
//   - element:  portfolio__zenless-about-me__{row1,content,dossier,hazard-green}

function DossierCard() {
  return (
    <motion.div
      className="portfolio__zenless-about-me__dossier"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      style={{
        position: "relative",
        background: "var(--theme-elevated)",
        border: "2px solid var(--theme-accent)",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(197,255,0,0.25)",
      }}
    >
      <div
        style={{
          aspectRatio: "3/4",
          backgroundImage: "url(https://picsum.photos/seed/avatar/600/800?grayscale)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "var(--theme-font-mono)",
            fontSize: 11,
            color: "var(--theme-accent)",
            letterSpacing: "0.3em",
          }}
        >
          ID#0001
        </span>
      </div>
    </motion.div>
  );
}

export default function ZenlessAboutMe({ locale }: { locale: Locale }) {
  const resumeUrl = getLocalizedUrl("/resume", locale);
  const years = getCareerYears();
  const bio = pickLocale(ui.aboutBio, locale).map((line) => line.replace("{years}", String(years)));

  return (
    <SitePageSection
      className="portfolio__zenless-about-me"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 25% 70%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      {/* 全宽斜带 — 紫（顶部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="purple"
        animated
        rotate={8}
        top="20vh"
        enterFrom="left"
        height={36}
        style={{ opacity: 0.55, zIndex: 1 }}
      />
      {/* 全宽斜带 — 绿（底部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="green"
        animated
        rotate={-12}
        top="40vh"
        enterFrom="right"
        height={36}
        className="portfolio__zenless-about-me__hazard-green"
        style={{ opacity: 0.55, zIndex: 1 }}
      />
      <div className="portfolio__zenless-about-me__row1">
        <div className="portfolio__zenless-about-me__content">
          <ZenlessUI.Title1
            as="h1"
            size="section"
            eyebrow="AGENT PROFILE · DOSSIER"
            title="ABOUT ME"
            accentTail="ME"
            marginBottom="0"
            animate="sweep"
          />
          <div
            style={{
              fontFamily: "var(--theme-font-body)",
              color: "var(--theme-fg-muted)",
              marginTop: 40,
              fontSize: 16,
              lineHeight: 1.9,
            }}
          >
            {bio.map((line, i) => (
              <p key={i} style={{ margin: "0 0 1.2em" }}>
                {line}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
            <ZenlessUI.Button variant="contained" size="sm" href="#">
              GITHUB
            </ZenlessUI.Button>
            <ZenlessUI.Button variant="outlined" size="sm" href={resumeUrl}>
              RESUME
            </ZenlessUI.Button>
          </div>
        </div>
        <DossierCard />
      </div>
    </SitePageSection>
  );
}
