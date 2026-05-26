import { ThemeNebula } from "@/themes/nebula/base";
import { getLocalizedUrl, type Locale, type Work, type WorkDetailPageContent } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";

interface Props {
  work: Work;
  content: WorkDetailPageContent;
  locale: Locale;
  theme: Theme;
}

export default function NebulaWorkDetailPage({ work, content, locale, theme }: Props) {
  const worksUrl = getLocalizedUrl("/works", locale, theme);

  return (
    <>
      {/* 1. Overview */}
      <ThemeNebula.Section
        title={work.title}
        titleLevel={1}
        titleLabel={work.period}
        description={work.description}
      >
        <ThemeNebula.Grid columns={4}>
          {work.links.map(({ url, label, disabled }) => (
            <ThemeNebula.Button
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              disabled={disabled}
              style={{ justifyContent: "center" }}
            >
              {label}
            </ThemeNebula.Button>
          ))}
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      {/* 2. Background + Skills */}
      <ThemeNebula.Section
        title={content.sectionBackgroundSkills.title}
        titleLevel={2}
        titleLabel="01/02"
        description={work.background}
      >
        <ThemeNebula.SkillHiveCellCards skills={work.skills} align="center" />
      </ThemeNebula.Section>

      {/* 3. My Involvement */}
      <ThemeNebula.Section
        titleLabel="02/02"
        title={content.sectionMyInvolvement.title}
        titleLevel={2}
        actions={[
          <ThemeNebula.Button href={worksUrl}>
            {content.sectionMyInvolvement.viewAllWorksText}
          </ThemeNebula.Button>,
        ]}
      >
        {work.area === "professional" && (
          <>
            <div>
              <ThemeNebula.Heading level={3}>
                {content.sectionMyInvolvement.headingRole}
              </ThemeNebula.Heading>
              <ThemeNebula.Text as="p">{work?.professional?.role}</ThemeNebula.Text>
            </div>

            <div>
              <ThemeNebula.Heading level={3}>
                {content.sectionMyInvolvement.headingAchievements}
              </ThemeNebula.Heading>
              {work.professional.achievements.map((a) => (
                <ThemeNebula.Text key={a} as="p">
                  {a}
                </ThemeNebula.Text>
              ))}
            </div>

            <div>
              <ThemeNebula.Heading level={3}>
                {content.sectionMyInvolvement.headingPerformance}
              </ThemeNebula.Heading>
              <ThemeNebula.Text as="p">{work.professional.performance}</ThemeNebula.Text>
            </div>
          </>
        )}

        {work.area === "personal" && (
          <div>
            <ThemeNebula.Heading level={3}>
              {content.sectionMyInvolvement.headingLearnings}
            </ThemeNebula.Heading>
            {work.personal.learnings.map((l) => (
              <ThemeNebula.Text key={l} as="p">
                {l}
              </ThemeNebula.Text>
            ))}
          </div>
        )}
      </ThemeNebula.Section>
    </>
  );
}
