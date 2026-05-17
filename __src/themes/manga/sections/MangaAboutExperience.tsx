import SitePageSection from "@/components/react/layout/SitePageSection";
import type { MangaTimelineItem } from "../components";
import { MangaUI } from "../components";

// Manga About.Experience — 经历年表分镜（漫画风纵向时间线）

const TIMELINE: MangaTimelineItem[] = [
  {
    date: "2024 / 04",
    title: "Lead",
    caption: "Design Engineering Crew",
    bottomBadge: { text: "NOW" },
  },
  { date: "2022 / 06", title: "Tech Lead", caption: "Industrial IoT" },
  { date: "2020 / 09", title: "Architect", caption: "Enterprise CMS" },
  { date: "2018 / 03", title: "Senior", caption: "Fintech Dashboard" },
];

export default function MangaAboutExperience() {
  return (
    <SitePageSection
      style={{
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-3xl)",
      }}
      containerProps={{ className: "manga-about-timeline-wrap" }}
    >
      <MangaUI.Title2
        num={null}
        stampText="経歴"
        label="MY EXPERIENCE"
        rotate={-2}
        style={{ marginBottom: 72 }}
      />

      <MangaUI.Timeline items={TIMELINE} />
    </SitePageSection>
  );
}
