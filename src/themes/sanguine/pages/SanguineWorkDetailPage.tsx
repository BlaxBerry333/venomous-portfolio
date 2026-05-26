import { getLocalizedUrl, type Locale, type Work, type WorkDetailPageContent } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { motion } from "framer-motion";
import { ThemeSanguine } from "../base";
import { accentTitle, riseIn } from "./_utils";
import "./SanguineWorkDetailPage.scss";

interface Props {
  work: Work;
  content: WorkDetailPageContent;
  locale: Locale;
  theme: Theme;
}

/** work.title 通常是 "Name — Description"，拆 EM dash：名字红、描述白；无 dash 整段红。 */
function workTitleAccent(title: string): string {
  const dash = title.indexOf("—");
  if (dash > 0) {
    const name = title.slice(0, dash).trim();
    const desc = title.slice(dash + 1).trim();
    return `{${name}} — ${desc}`;
  }
  return `{${title}}`;
}

export default function SanguineWorkDetailPage({ work, content, locale, theme }: Props) {
  const worksUrl = getLocalizedUrl("/works", locale, theme);

  return (
    <>
      {/* 1. Overview */}
      <ThemeSanguine.Section
        size="compact"
        titleLabel={`— ${work.period} · ${work.areaName} —`}
        title={workTitleAccent(work.title)}
        description={work.description}
        className="portfolio--sanguine-wd"
      >
        {work.links.length > 0 && (
          <motion.div className="portfolio--sanguine-wd__links" {...riseIn(1)}>
            {work.links.map(({ url, label, disabled }) => (
              <ThemeSanguine.Button
                key={url}
                href={url}
                disabled={disabled}
                variant="outline"
                size="md"
                arrow="none"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label} ↗
              </ThemeSanguine.Button>
            ))}
          </motion.div>
        )}
      </ThemeSanguine.Section>

      {/* 2. Background + Skills */}
      <ThemeSanguine.Section
        size="compact"
        titleLabel="— 01 / 02 —"
        title={accentTitle(content.sectionBackgroundSkills.title, locale, "end")}
        description={work.background}
        className="portfolio--sanguine-wd"
      >
        <ThemeSanguine.Chips items={work.skills.map((s) => s.label)} />
      </ThemeSanguine.Section>

      {/* 3. My Involvement */}
      <ThemeSanguine.Section
        size="compact"
        titleLabel="— 02 / 02 —"
        title={accentTitle(content.sectionMyInvolvement.title, locale, "end")}
        className="portfolio--sanguine-wd"
      >
        {work.area === "professional" && (
          <div className="portfolio--sanguine-wd__blocks">
            <div className="portfolio--sanguine-wd__block">
              <ThemeSanguine.Heading
                level={4}
                text={`{${content.sectionMyInvolvement.headingRole}}`}
              />
              <ThemeSanguine.Text {...riseIn(0)}>{work.professional.role}</ThemeSanguine.Text>
            </div>

            <div className="portfolio--sanguine-wd__block">
              <ThemeSanguine.Heading
                level={4}
                text={`{${content.sectionMyInvolvement.headingAchievements}}`}
              />
              {work.professional.achievements.map((a, i) => (
                <ThemeSanguine.Text key={i} {...riseIn(i)}>
                  {a}
                </ThemeSanguine.Text>
              ))}
            </div>

            <div className="portfolio--sanguine-wd__block">
              <ThemeSanguine.Heading
                level={4}
                text={`{${content.sectionMyInvolvement.headingPerformance}}`}
              />
              <ThemeSanguine.Text {...riseIn(0)}>
                {work.professional.performance}
              </ThemeSanguine.Text>
            </div>
          </div>
        )}

        {work.area === "personal" && (
          <div className="portfolio--sanguine-wd__blocks">
            <div className="portfolio--sanguine-wd__block">
              <ThemeSanguine.Heading
                level={4}
                text={`{${content.sectionMyInvolvement.headingLearnings}}`}
              />
              {work.personal.learnings.map((l, i) => (
                <ThemeSanguine.Text key={i} {...riseIn(i)}>
                  {l}
                </ThemeSanguine.Text>
              ))}
            </div>
          </div>
        )}

        <ThemeSanguine.PageActions delay={0.4}>
          <ThemeSanguine.Button href={worksUrl} variant="outline" size="lg" arrow="left">
            {content.sectionMyInvolvement.viewAllWorksText}
          </ThemeSanguine.Button>
        </ThemeSanguine.PageActions>
      </ThemeSanguine.Section>
    </>
  );
}
