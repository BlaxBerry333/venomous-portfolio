import { ThemeNebula } from "@/themes/nebula/base";
import { getLocalizedUrl, type Locale, type WorkFilter, type WorksPageContent } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { useMemo, useState } from "react";

interface Props {
  content: WorksPageContent;
  locale: Locale;
  theme: Theme;
}

export default function NebulaWorksPage({ content, locale, theme }: Props) {
  const { sectionIntroduction, filters, works } = content;
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("professional");

  const currentWorks = useMemo(
    () => (activeFilter === "all" ? works : works.filter((w) => w.area === activeFilter)),
    [activeFilter, works],
  );

  const homeUrl = getLocalizedUrl("/", locale, theme);

  return (
    <ThemeNebula.Section
      title={sectionIntroduction.title}
      titleLevel={1}
      description={sectionIntroduction.description}
      actions={[
        <ThemeNebula.Button href={homeUrl}>{sectionIntroduction.viewHomeText}</ThemeNebula.Button>,
      ]}
    >
      <ThemeNebula.Tabs
        items={filters.map((f) => {
          const count = f.id === "all" ? works.length : works.filter((w) => w.area === f.id).length;
          return { id: f.id, label: `${f.name} (${count})` };
        })}
        activeId={activeFilter}
        onChange={(id) => setActiveFilter(id as WorkFilter)}
        ariaLabel="Works filters"
      />

      <ThemeNebula.Grid key={activeFilter} columns={3}>
        {currentWorks?.map((w, i) => (
          <ThemeNebula.WorkCard
            key={w.id}
            work={w}
            index={i}
            locale={locale}
            theme={theme}
            blurPreview
          />
        ))}
      </ThemeNebula.Grid>
    </ThemeNebula.Section>
  );
}
