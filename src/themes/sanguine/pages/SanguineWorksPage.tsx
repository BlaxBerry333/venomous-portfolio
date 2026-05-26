import { getLocalizedUrl, type Locale, type WorkFilter, type WorksPageContent } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { useMemo, useState } from "react";
import { ThemeSanguine } from "../base";
import { accentTitle } from "./_utils";
import "./SanguineWorksPage.scss";

interface Props {
  content: WorksPageContent;
  locale: Locale;
  theme: Theme;
}

export default function SanguineWorksPage({ content, locale, theme }: Props) {
  const { sectionIntroduction, filters, works } = content;
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("professional");

  const currentWorks = useMemo(
    () => (activeFilter === "all" ? works : works.filter((w) => w.area === activeFilter)),
    [activeFilter, works],
  );

  const homeUrl = getLocalizedUrl("/", locale, theme);
  const titleText = accentTitle(sectionIntroduction.title, locale, "end");

  return (
    <>
      <ThemeSanguine.Section title={titleText} description={sectionIntroduction.description}>
        <ThemeSanguine.Tabs
          items={filters.map((f) => {
            const count =
              f.id === "all" ? works.length : works.filter((w) => w.area === f.id).length;
            return { id: f.id, label: `${f.name} (${count})` };
          })}
          activeId={activeFilter}
          onChange={(id) => setActiveFilter(id as WorkFilter)}
          ariaLabel="Works filters"
          className="portfolio--sanguine-works-filters"
        />

        <ThemeSanguine.Grid animateKey={activeFilter}>
          {currentWorks.map((w) => (
            <ThemeSanguine.WorkCard key={w.id} work={w} locale={locale} theme={theme} />
          ))}
        </ThemeSanguine.Grid>

        <ThemeSanguine.PageActions>
          <ThemeSanguine.Button href={homeUrl} variant="outline" size="lg" arrow="left">
            {sectionIntroduction.viewHomeText}
          </ThemeSanguine.Button>
        </ThemeSanguine.PageActions>
      </ThemeSanguine.Section>
    </>
  );
}
