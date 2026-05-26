import { getLocalizedUrl, type AboutPageContent, type Locale } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { ThemeSanguine } from "../base";
import { accentTitle, jaLeadingAccent } from "./_utils";

interface Props {
  content: AboutPageContent;
  locale: Locale;
  theme: Theme;
}

export default function SanguineAboutPage({ content, locale, theme }: Props) {
  const { sectionIntroduction, sectionTimeline, timeline } = content;
  const { title, description, viewWorksText } = sectionIntroduction;

  const worksUrl = getLocalizedUrl("/works", locale, theme);
  const homeUrl = getLocalizedUrl("/", locale, theme);

  const introTitleText = jaLeadingAccent(title, locale);
  const timelineTitleText = accentTitle(timeline.title, locale, "end");

  return (
    <>
      {/* 1. Introduction */}
      <ThemeSanguine.Section title={introTitleText} description={description}>
        <ThemeSanguine.PageActions>
          <ThemeSanguine.Button href={worksUrl} variant="filled" size="lg">
            {viewWorksText}
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
        </ThemeSanguine.PageActions>
      </ThemeSanguine.Section>

      {/* 2. Timeline */}
      <ThemeSanguine.Section id="timeline" title={timelineTitleText}>
        <ThemeSanguine.Timeline items={timeline.items} />
        <ThemeSanguine.PageActions delay={0.4}>
          <ThemeSanguine.Button href={homeUrl} variant="outline" size="lg" arrow="left">
            {sectionTimeline.viewHomeText}
          </ThemeSanguine.Button>
        </ThemeSanguine.PageActions>
      </ThemeSanguine.Section>
    </>
  );
}
