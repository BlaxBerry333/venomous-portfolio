import SitePageSection from "@/components/react/layout/SitePageSection";
import type { Locale } from "@/types";
import { getCareerYears, ui } from "@/utils/data";
import { getLocalizedUrl, pickLocale } from "@/utils/i18n";
import { MangaUI } from "../components";
import "./MangaAboutMe.scss";

// Manga About.Me — 角色档案册 hero（头像分镜 + 简介分镜）

export default function MangaAboutMe({ locale }: { locale: Locale }) {
  const resumeUrl = getLocalizedUrl("/resume", locale);
  const years = getCareerYears();
  const bio = pickLocale(ui.aboutBio, locale).map((line) => line.replace("{years}", String(years)));
  return (
    <SitePageSection
      style={{
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
      containerProps={{
        className: "portfolio__manga-about-me",
        style: {
          display: "grid",
          gap: "var(--space-2xl)",
          alignItems: "center",
        },
      }}
    >
      {/* 头像分镜 — 复用 MangaUI.Card 作为容器：bg-image 走 style、双角章走 topBadge/bottomBadge */}
      <div style={{ position: "relative" }}>
        <MangaUI.Card
          color="white"
          padding={0}
          minHeight={360}
          halftone
          halftoneOpacity={0.5}
          restRotate={-2}
          shadowOffset={12}
          shadowColor="var(--theme-accent)"
          borderWidth={5}
          topBadge={{ text: "主人公" }}
          bottomBadge={{ text: "CHEN" }}
          style={{
            width: 280,
            height: 360,
            backgroundImage: "url(https://picsum.photos/seed/avatar/600/800?grayscale)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* 简介分镜 */}
      <div>
        <MangaUI.Title1 eyebrow="キャラクター紹介" animate="spring">
          ABOUT ME
        </MangaUI.Title1>

        <p
          style={{
            fontFamily: "var(--theme-font-body)",
            fontWeight: 700,
            color: "var(--theme-fg-muted)",
            marginTop: 40,
            fontSize: 16,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          ▸ Senior Frontend · Design Engineer · WebGL Master
        </p>

        {/* 自述分镜 */}
        <div
          style={{
            fontFamily: "var(--theme-font-body)",
            color: "var(--theme-fg)",
            marginTop: 24,
            fontSize: 16,
            lineHeight: 1.9,
          }}
        >
          {bio.map((line, i) => (
            <p key={i} style={{ margin: "0 0 1em" }}>
              {line}
            </p>
          ))}
        </div>

        {/* 引言分镜 */}
        <MangaUI.Quote label="名言" rotate={-2} style={{ marginTop: 24 }}>
          "Code is the medium. Performance is the discipline.
          <br />
          Aesthetics is the contract."
        </MangaUI.Quote>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, marginLeft: "50%" }}>
          <MangaUI.Button color="red" size="sm" restRotate={-1}>
            GitHub
          </MangaUI.Button>
          <a href={resumeUrl} style={{ textDecoration: "none" }}>
            <MangaUI.Button color="black" size="sm" restRotate={1}>
              Resume
            </MangaUI.Button>
          </a>
        </div>
      </div>
    </SitePageSection>
  );
}
