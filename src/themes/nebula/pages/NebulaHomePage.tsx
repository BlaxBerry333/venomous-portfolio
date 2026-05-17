import { ThemeNebula, type GravityNode } from "@/themes/nebula/base";
import {
  EXCLUDED_SKILL_IDS,
  getLocalizedUrl,
  type HomePageContent,
  type Locale,
  type Work,
} from "@/utils/i18n";
import type { Theme } from "@/utils/themes";

interface Props {
  content: HomePageContent;
  works: Work[];
  locale: Locale;
  theme: Theme;
}

export default function NebulaHomePage({ content, works, locale, theme }: Props) {
  const {
    sectionHero,
    sectionTopDescription,
    sectionBottomDescription,
    sectionFeaturedProjects,
    sectionExpertise,
    skillAreas,
  } = content;

  // Skill
  // GravityNode 星体映射：primary 内圈大字, secondary 外圈小字
  const skillNodes: GravityNode[] = skillAreas.flatMap((a) =>
    a.skills
      .filter((s) => !EXCLUDED_SKILL_IDS.has(s.id))
      .map((s) => ({
        id: s.id,
        label: s.label,
        subLabel: `<${s.levelName}>`,
        group: s.level === "proficient" ? "primary" : "secondary",
      })),
  );

  const aboutUrl = getLocalizedUrl("/about", locale, theme);
  const worksUrl = getLocalizedUrl("/works", locale, theme);
  const designSystemUrl = getLocalizedUrl("/design-system", locale, theme);

  return (
    <>
      {/* 1. Hero */}
      <ThemeNebula.Section id="hero">
        <h1 className="portfolio--sr-only">{sectionHero.title}</h1>
      </ThemeNebula.Section>

      {/* 2. Top Description */}
      <ThemeNebula.Section
        description={sectionTopDescription.paragraphs.flat()}
        actions={[
          <ThemeNebula.Button href={aboutUrl}>
            {sectionTopDescription.viewAboutMeText}
          </ThemeNebula.Button>,
        ]}
      />

      {/* 3. Featured Projects */}
      <ThemeNebula.Section
        id="featured-projects"
        titleLabel="01 / 02"
        title={sectionFeaturedProjects.title}
        titleLevel={2}
        description={sectionFeaturedProjects.description}
        actions={[
          <ThemeNebula.Button href={worksUrl}>
            {sectionFeaturedProjects.viewAllText}
          </ThemeNebula.Button>,
        ]}
      >
        <ThemeNebula.Grid columns={2} align="center">
          {works.map((w, index) => (
            <ThemeNebula.WorkCard key={w.id} {...{ index, locale, theme }} work={w} />
          ))}
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      {/* 4. Expertise */}
      <ThemeNebula.Section
        id="expertise"
        titleLabel="02 / 02"
        title={sectionExpertise.title}
        titleLevel={2}
        description={sectionExpertise.description}
      >
        <ThemeNebula.GravityGraph
          nodes={skillNodes}
          maxNodes={skillNodes.length}
          ariaLabel={sectionExpertise.title}
        />
      </ThemeNebula.Section>

      {/* 5. Bottom Description */}
      <ThemeNebula.Section
        description={sectionBottomDescription.descriptions}
        actions={[
          <ThemeNebula.Button href={designSystemUrl} variant="outline">
            {sectionBottomDescription.viewDesignText}
          </ThemeNebula.Button>,
          <ThemeNebula.Button
            href={import.meta.env.PUBLIC_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </ThemeNebula.Button>,
        ]}
      />
    </>
  );
}
