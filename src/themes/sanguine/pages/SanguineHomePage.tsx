import {
  EXCLUDED_SKILL_IDS,
  getLocalizedUrl,
  type HomePageContent,
  type Locale,
  type SkillArea,
  type Work,
} from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { ThemeSanguine } from "../base";
import { accentTitle } from "./_utils";

interface Props {
  locale: Locale;
  theme: Theme;
  content: HomePageContent;
  works: Work[];
}

/** 各领域剔除掉展示侧排除的技能；过滤后为空的领域整组丢弃。 */
function pickExpertise(areas: SkillArea[]): SkillArea[] {
  return areas
    .map((a) => ({ ...a, skills: a.skills.filter((s) => !EXCLUDED_SKILL_IDS.has(s.id)) }))
    .filter((a) => a.skills.length > 0);
}

export default function SanguineHomePage({ locale, theme, content, works }: Props) {
  const {
    sectionHero,
    sectionTopDescription,
    sectionFeaturedProjects,
    sectionExpertise,
    sectionBottomDescription,
    skillAreas,
  } = content;

  const expertiseAreas = pickExpertise(skillAreas);

  const aboutUrl = getLocalizedUrl("/about", locale, theme);
  const worksUrl = getLocalizedUrl("/works", locale, theme);
  const designSystemUrl = getLocalizedUrl("/design-system", locale, theme);

  return (
    <>
      {/* 1. Hero */}
      <ThemeSanguine.Hero title={sectionHero.title} />

      {/* 2. Top Description */}
      <ThemeSanguine.Statement lines={sectionTopDescription.paragraphs} align="start">
        <ThemeSanguine.Button href={aboutUrl} variant="filled" size="lg">
          {sectionTopDescription.viewAboutMeText}
        </ThemeSanguine.Button>
      </ThemeSanguine.Statement>

      {/* 3. Featured Projects */}
      <ThemeSanguine.Section
        id="works"
        title={accentTitle(sectionFeaturedProjects.title, locale, "end")}
        description={sectionFeaturedProjects.description}
      >
        <ThemeSanguine.Grid>
          {works.slice(0, 2).map((w) => (
            <ThemeSanguine.WorkCard key={w.id} work={w} locale={locale} theme={theme} />
          ))}
        </ThemeSanguine.Grid>
        <ThemeSanguine.PageActions delay={0}>
          <ThemeSanguine.Button href={worksUrl} variant="filled" size="lg">
            {sectionFeaturedProjects.viewAllText}
          </ThemeSanguine.Button>
        </ThemeSanguine.PageActions>
      </ThemeSanguine.Section>

      {/* 4. Expertise */}
      <ThemeSanguine.Section
        id="skills"
        title={accentTitle(sectionExpertise.title, locale, "start")}
      >
        <ThemeSanguine.Expertise areas={expertiseAreas} />
      </ThemeSanguine.Section>

      {/* 5. Bottom Description */}
      <ThemeSanguine.Statement lines={sectionBottomDescription.descriptions} align="end">
        <ThemeSanguine.Button href={designSystemUrl} size="lg">
          {sectionBottomDescription.viewDesignText}
        </ThemeSanguine.Button>
        <ThemeSanguine.Button
          href={import.meta.env.PUBLIC_GITHUB_URL}
          variant="outline"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </ThemeSanguine.Button>
      </ThemeSanguine.Statement>
    </>
  );
}
