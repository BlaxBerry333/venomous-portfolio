import SitePageSection from "@/components/react/layout/SitePageSection";
import type { Locale } from "@/types";
import { getCareerYears, ui } from "@/utils/data";
import { getLocalizedUrl, pickLocale } from "@/utils/i18n";
import { VoidUI } from "../components";

// Void About.Me — 单列长读 hero
// 极简长读：超大留白 / 单列 hero / 单冷青色

export default function VoidAboutMe({ locale }: { locale: Locale }) {
  const resumeUrl = getLocalizedUrl("/resume", locale);
  const years = getCareerYears();
  const bio = pickLocale(ui.aboutBio, locale).map((line) => line.replace("{years}", String(years)));

  return (
    <SitePageSection
      style={{
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <VoidUI.Title1 text="About" accent=".Me" animate="fade-up" />
      <div
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-fg-muted)",
          marginTop: 40,
          fontSize: "clamp(17px, 1.6vw, 22px)",
          lineHeight: 1.7,
          maxWidth: 720,
          fontWeight: 300,
        }}
      >
        {bio.map((line, i) => (
          <p key={i} style={{ margin: "0 0 1.2em" }}>
            {line}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 56, flexWrap: "wrap" }}>
        <VoidUI.Button variant="contained" href="#">
          GITHUB
        </VoidUI.Button>
        <VoidUI.Button variant="outlined" href={resumeUrl}>
          RESUME
        </VoidUI.Button>
      </div>
    </SitePageSection>
  );
}
