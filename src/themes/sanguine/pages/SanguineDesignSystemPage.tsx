import {
  getLocalizedUrl,
  type Locale,
  type ThemeContent,
  type TimelineItem,
  type WorkPreviewCode,
} from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { useState } from "react";
import { ThemeSanguine } from "../base";
import "./SanguineDesignSystemPage.scss";

interface Props {
  content: ThemeContent;
  locale: Locale;
  theme: Theme;
}

export default function SanguineDesignSystemPage({ content, locale, theme }: Props) {
  const homeUrl = getLocalizedUrl("/", locale, theme);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      {/* DESIGN SYSTEM intro + Motivation */}
      <section className="portfolio--sanguine-ds portfolio--sanguine-ds--intro">
        <span className="portfolio--sanguine-ds__top-label">— DESIGN SYSTEM —</span>
        <ThemeSanguine.Heading static text={`{${theme.toUpperCase()}}`} />
        <div className="portfolio--sanguine-ds__desc">
          {content.motivation.map((paragraph, i) => (
            <ThemeSanguine.Text key={i}>{paragraph}</ThemeSanguine.Text>
          ))}
        </div>
      </section>

      {/* Tokens */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <ThemeSanguine.Heading static text="{Tokens}" />
        </div>
        <div className="portfolio--sanguine-ds__tokens">
          <div className="portfolio--sanguine-ds__token">
            <span
              className="portfolio--sanguine-ds__swatch"
              style={{
                background: "var(--sanguine-color-bg)",
                border: "1px solid var(--sanguine-color-line)",
              }}
            />
            <span className="portfolio--sanguine-ds__token-name">--sanguine-color-bg</span>
            <span className="portfolio--sanguine-ds__token-val">#0a0a0a</span>
          </div>
          <div className="portfolio--sanguine-ds__token">
            <span
              className="portfolio--sanguine-ds__swatch"
              style={{ background: "var(--sanguine-color-fg)" }}
            />
            <span className="portfolio--sanguine-ds__token-name">--sanguine-color-fg</span>
            <span className="portfolio--sanguine-ds__token-val">#f5f5f5</span>
          </div>
          <div className="portfolio--sanguine-ds__token">
            <span
              className="portfolio--sanguine-ds__swatch"
              style={{ background: "var(--sanguine-color-accent)" }}
            />
            <span className="portfolio--sanguine-ds__token-name">--sanguine-color-accent</span>
            <span className="portfolio--sanguine-ds__token-val">#c8102e</span>
          </div>
          <div className="portfolio--sanguine-ds__token">
            <span
              className="portfolio--sanguine-ds__swatch"
              style={{ background: "var(--sanguine-color-muted)" }}
            />
            <span className="portfolio--sanguine-ds__token-name">--sanguine-color-muted</span>
            <span className="portfolio--sanguine-ds__token-val">rgba(245,245,245,0.55)</span>
          </div>
          <div className="portfolio--sanguine-ds__token portfolio--sanguine-ds__token--font">
            <span className="portfolio--sanguine-ds__font-sample portfolio--sanguine-ds__font-sample--display">
              CHEN
            </span>
            <span className="portfolio--sanguine-ds__token-name">--sanguine-font-display</span>
            <span className="portfolio--sanguine-ds__token-val">Cinzel Decorative</span>
          </div>
          <div className="portfolio--sanguine-ds__token portfolio--sanguine-ds__token--font">
            <span className="portfolio--sanguine-ds__font-sample portfolio--sanguine-ds__font-sample--body">
              Aa
            </span>
            <span className="portfolio--sanguine-ds__token-name">--sanguine-font-body</span>
            <span className="portfolio--sanguine-ds__token-val">Cinzel</span>
          </div>
        </div>
      </section>

      {/* Heading */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Heading>"}</h2>
        </div>
        <div className="portfolio--sanguine-ds__stack">
          <ThemeSanguine.Heading static as="div" level={1} text="About {Me}" />
          <ThemeSanguine.Heading static as="div" level={2} text="About {Me}" />
          <ThemeSanguine.Heading static as="div" level={3} text="About {Me}" />
          <ThemeSanguine.Heading static as="div" level={4} text="About {Me}" />
        </div>
      </section>

      {/* Text */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Text>"}</h2>
        </div>
        <div className="portfolio--sanguine-ds__stack">
          <ThemeSanguine.Text variant="body">
            Body — the default running-copy register. Cinzel 400 at 19px, line-height 1.65, set at
            85% strength over the dark ground.
          </ThemeSanguine.Text>
          <ThemeSanguine.Text variant="strong">
            Strong. Cinzel 700 over full-strength foreground — for emphasis within running copy.
          </ThemeSanguine.Text>
          <ThemeSanguine.Text variant="label">Label · tracked uppercase eyebrow</ThemeSanguine.Text>
          <ThemeSanguine.Text variant="muted">
            Muted. A dimmer, smaller register for captions and secondary notes.
          </ThemeSanguine.Text>
        </div>
      </section>

      {/* Button */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Button>"}</h2>
        </div>
        <div className="portfolio--sanguine-ds__row">
          <ThemeSanguine.Button variant="filled" size="md">
            Filled MD
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="filled" size="lg">
            Filled LG
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="filled" size="xl">
            Filled XL
          </ThemeSanguine.Button>
        </div>
        <div className="portfolio--sanguine-ds__row">
          <ThemeSanguine.Button variant="outline" size="md">
            Outline MD
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="outline" size="lg">
            Outline LG
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="outline" size="xl">
            Outline XL
          </ThemeSanguine.Button>
        </div>
        <div className="portfolio--sanguine-ds__row">
          <ThemeSanguine.Button variant="filled" size="md" arrow="right">
            Arrow right
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="outline" size="md" arrow="left">
            Arrow left
          </ThemeSanguine.Button>
          <ThemeSanguine.Button variant="outline" size="md" disabled>
            Disabled
          </ThemeSanguine.Button>
        </div>
        <div className="portfolio--sanguine-ds__row">
          <ThemeSanguine.Button variant="filled" size="md" pulse>
            + Pulse
          </ThemeSanguine.Button>
        </div>
      </section>

      {/* Marquee */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Marquee>"}</h2>
        </div>
        <div className="portfolio--sanguine-ds__marquees">
          <ThemeSanguine.Marquee
            items={["React", "TypeScript", "Astro", "Vite", "Cinzel", "Framer Motion"]}
            duration={28}
            size="md"
          />
          <ThemeSanguine.Marquee
            items={["BIG", "BOLD", "TYPE", "SCROLLING"]}
            duration={28}
            reverse
            size="lg"
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Tabs>"}</h2>
        </div>
        <ThemeSanguine.Tabs
          items={SAMPLE_TABS}
          activeId={activeTab}
          onChange={setActiveTab}
          ariaLabel="Tabs demo"
        />
      </section>

      {/* Chips */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Chips>"}</h2>
        </div>
        <ThemeSanguine.Chips
          static
          items={["React", "TypeScript", "Astro", "Three.js", "Framer Motion", "SCSS"]}
        />
      </section>

      {/* Timeline */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<Timeline>"}</h2>
        </div>
        <ThemeSanguine.Timeline static items={SAMPLE_TIMELINE} />
      </section>

      {/* PreviewBox —— 项目印象假截图，按 previewCode 渲染固定 UI */}
      <section className="portfolio--sanguine-ds">
        <div className="portfolio--sanguine-ds__head">
          <h2 className="portfolio--sanguine-ds__cname">{"<PreviewBox>"}</h2>
        </div>
        <div className="portfolio--sanguine-ds__previews">
          {PREVIEW_CODES.map((code) => (
            <div key={code} className="portfolio--sanguine-ds__preview">
              <ThemeSanguine.Heading static as="div" level={4} text={`previewCode "{${code}}"`} />
              <ThemeSanguine.PreviewBox.WorkMedia previewCode={code} />
            </div>
          ))}
        </div>
      </section>

      {/* foot */}
      <section className="portfolio--sanguine-ds portfolio--sanguine-ds--foot">
        <ThemeSanguine.Button href={homeUrl} size="lg" arrow="left">
          Back to Home
        </ThemeSanguine.Button>
      </section>
    </>
  );
}

const SAMPLE_TIMELINE: TimelineItem[] = [
  {
    id: "ds-sample-1",
    period: "2024 — Present",
    company: "Atelier Sanguine",
    department: "Frontend Engineering",
    role: "Senior Frontend Engineer",
    products: [],
  },
  {
    id: "ds-sample-2",
    period: "2022 — 2024",
    company: "House of Cinzel",
    role: "Full-stack Engineer",
    products: [],
  },
];

const SAMPLE_TABS = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "personal", label: "Personal" },
];

// PreviewBox 展示用的全部 previewCode —— 新增 code 时同步加进来
const PREVIEW_CODES: WorkPreviewCode[] = [
  "analytics",
  "editor",
  "terminal",
  "workflow",
  "blocks",
  "widgets",
  "chat",
  "diff",
  "gallery",
  "campus",
];
