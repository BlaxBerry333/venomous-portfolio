import SitePageSection from "@/components/react/layout/SitePageSection";
import type { DemoType, WorkCategory } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { useState } from "react";
import {
  ZenlessUI,
  type ZenlessPreviewCardColor,
  type ZenlessPreviewCardStatus,
} from "../components";

type Filter = "all" | WorkCategory;

interface DemoSpec {
  color: ZenlessPreviewCardColor;
  badge: string;
  status: ZenlessPreviewCardStatus;
  blurred: boolean;
}

const DEMO_SPEC: Record<DemoType, DemoSpec> = {
  live: {
    color: "orange",
    badge: "S",
    status: { label: "OPERATIONAL" },
    blurred: false,
  },
  iframe: {
    color: "green",
    badge: "A",
    status: { label: "STANDBY" },
    blurred: false,
  },
  screenshot: {
    color: "green",
    badge: "A",
    status: { label: "ARCHIVED" },
    blurred: false,
  },
  nda: { color: "purple", badge: "SS", status: { label: "CLASSIFIED" }, blurred: true },
};

interface ZenlessWorksListProps {
  locale: Locale;
  theme: Theme;
}

export default function ZenlessWorksList({ locale, theme }: ZenlessWorksListProps) {
  const works = useWorks(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = works.filter((w) => filter === "all" || w.category === filter);

  return (
    <SitePageSection
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 25% 70%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
        minHeight: "100vh",
        overflowX: "clip",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <ZenlessUI.Title1
        as="h1"
        size="section"
        eyebrow="AGENT OPERATION · MISSIONS"
        title="ALL WORKS"
        accentTail="WORKS"
        marginBottom="0"
        animate="sweep"
      />

      {/* filter — 任务类别 chip */}
      <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
        {(["all", "company", "personal"] as Filter[]).map((f) => {
          const isActive = filter === f;
          return (
            <ZenlessUI.Button
              key={f}
              variant="tab"
              active={isActive}
              role="tab"
              ariaSelected={isActive}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "ALL" : f}
            </ZenlessUI.Button>
          );
        })}
      </div>

      {/* 任务卡 grid */}
      <div
        style={{
          marginTop: "var(--space-xl)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          gap: "var(--space-lg)",
        }}
      >
        {filtered.map((w, i) => {
          const spec = DEMO_SPEC[w.demoType];
          return (
            <a
              key={w.id}
              href={getLocalizedUrl(`/works/${w.id}`, locale, theme)}
              aria-label={`${w.title} — ${w.subtitle}`}
              style={{ color: "inherit", textDecoration: "none", display: "block" }}
            >
              <ZenlessUI.PreviewCard
                cover={w.cover}
                title={w.title}
                subtitle={w.subtitle}
                color={spec.color}
                badge={spec.badge}
                status={spec.status}
                skills={w.techStack}
                blurred={spec.blurred}
                index={i}
              />
            </a>
          );
        })}
      </div>
    </SitePageSection>
  );
}
