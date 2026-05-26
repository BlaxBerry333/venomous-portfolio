import { ThemeNebula } from "@/themes/nebula/base";
import {
  getLocalizedUrl,
  type Locale,
  type ThemeContent,
  type WorkPreviewCode,
} from "@/utils/i18n";
import { clsx } from "@/utils/styles";
import type { Theme } from "@/utils/themes";
import type { CSSProperties, ReactNode } from "react";
import "./NebulaDesignSystemPage.scss";

interface Props {
  content: ThemeContent;
  locale: Locale;
  theme: Theme;
}

export default function NebulaDesignSystemPage({ content, locale, theme }: Props) {
  const homeUrl = getLocalizedUrl("/", locale, theme);

  return (
    <>
      <ThemeNebula.Section
        titleLabel="DESIGN SYSTEM"
        title={theme.toUpperCase()}
        titleLevel={1}
        description={content.motivation}
        style={{ minHeight: "auto" }}
      />

      <ThemeNebula.Section title={`<Tokens>`} titleLevel={2} style={{ minHeight: "auto" }}>
        <div className="portfolio--nebula-tokens">
          {COLOR_TOKENS.map(({ name, value, swatch }) => (
            <div key={name} className="portfolio--nebula-token">
              <span
                className="portfolio--nebula-token__sample"
                style={{ background: swatch }}
                aria-hidden="true"
              />
              <span className="portfolio--nebula-token__name">{name}</span>
              <span className="portfolio--nebula-token__value">{value}</span>
            </div>
          ))}
          {FONT_TOKENS.map(({ name, value, sample, mono }) => (
            <div key={name} className="portfolio--nebula-token">
              <span
                className={clsx(
                  "portfolio--nebula-token__sample",
                  "portfolio--nebula-token__font",
                  mono && "portfolio--nebula-token__font--mono",
                )}
                aria-hidden="true"
              >
                {sample}
              </span>
              <span className="portfolio--nebula-token__name">{name}</span>
              <span className="portfolio--nebula-token__value">{value}</span>
            </div>
          ))}
        </div>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Button>`} titleLevel={2} style={{ minHeight: "auto" }}>
        <ThemeNebula.Grid columns={4}>
          <ThemeNebula.Button>Solid</ThemeNebula.Button>
          <ThemeNebula.Button variant="outline">Outline</ThemeNebula.Button>
          <ThemeNebula.Button disabled>Disabled</ThemeNebula.Button>
          <ThemeNebula.Button href="#">As Link</ThemeNebula.Button>
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Chip>`} titleLevel={2} style={{ minHeight: "auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <ThemeNebula.Chip>Solid</ThemeNebula.Chip>
          <ThemeNebula.Chip variant="outline">Outline</ThemeNebula.Chip>
          <ThemeNebula.Chip href="#">As Link</ThemeNebula.Chip>
        </div>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Heading>`} titleLevel={2} style={{ minHeight: "auto" }}>
        {HEADING_ROWS.map(({ level, sizes }) => (
          <TypoRow
            key={level}
            spec={`H${level} / ${sizes}`}
            style={level === 1 ? { maxWidth: "100%" } : undefined}
            sample={
              <ThemeNebula.Heading level={level} as="div">
                {SAMPLE_SHORT}
              </ThemeNebula.Heading>
            }
          />
        ))}
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Text>`} titleLevel={2} style={{ minHeight: "auto" }}>
        {TEXT_ROWS.map(({ variant, size }) => (
          <TypoRow
            key={variant}
            spec={`${variant} / ${size}`}
            sample={
              <ThemeNebula.Text as="p" variant={variant}>
                {SAMPLE_LONG}
              </ThemeNebula.Text>
            }
          />
        ))}
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<BaseCard>`} titleLevel={2} style={{ minHeight: "auto" }}>
        <ThemeNebula.Grid columns={3}>
          {Array.from({ length: 2 }).map((_, i) => (
            <ThemeNebula.BaseCard key={i}>
              <div style={{ height: 100 }} />
            </ThemeNebula.BaseCard>
          ))}
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Divider>`} titleLevel={2} style={{ minHeight: "auto" }}>
        <ThemeNebula.Divider />
        <ThemeNebula.Divider>WITH LABEL</ThemeNebula.Divider>
      </ThemeNebula.Section>

      <ThemeNebula.Section
        title={`<PreviewBox>`}
        titleLevel={2}
        actions={[<ThemeNebula.Button href={homeUrl}>{content.viewHomeText}</ThemeNebula.Button>]}
      >
        <ThemeNebula.Grid columns={2}>
          {(
            [
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
            ] as WorkPreviewCode[]
          ).map((code) => (
            <div key={code}>
              <ThemeNebula.Heading level={3}>{`previewCode="${code}"`}</ThemeNebula.Heading>
              <ThemeNebula.PreviewBox.WorkMedia previewCode={code} />
            </div>
          ))}
        </ThemeNebula.Grid>
      </ThemeNebula.Section>
    </>
  );
}

// 颜色 token —— name 是 CSS 变量名，value 是字面取值，swatch 是色块渲染用的 CSS 值
const COLOR_TOKENS = [
  { name: "--nebula-color-neon-1", value: "#2bf0ff", swatch: "var(--nebula-color-neon-1)" },
  { name: "--nebula-color-neon-2", value: "#ff3df0", swatch: "var(--nebula-color-neon-2)" },
  { name: "--nebula-color-bg", value: "#000000", swatch: "var(--nebula-color-bg)" },
  { name: "--nebula-color-text", value: "#ffffff", swatch: "var(--nebula-color-text)" },
  {
    name: "--nebula-color-muted",
    value: "rgba(255,255,255,0.55)",
    swatch: "var(--nebula-color-muted)",
  },
] as const satisfies ReadonlyArray<{ name: string; value: string; swatch: string }>;

// 字体 token —— sample 是字样预览文字，mono 标记走等宽字预览样式
const FONT_TOKENS = [
  {
    name: "--nebula-font-family-display",
    value: "Zen Kaku Gothic New",
    sample: "あA",
    mono: false,
  },
  { name: "--nebula-font-family-mono", value: "JetBrains Mono", sample: "{ }", mono: true },
] as const satisfies ReadonlyArray<{
  name: string;
  value: string;
  sample: string;
  mono: boolean;
}>;

// Heading 各档 —— level 是 <Heading> 真实入参，sizes 是该档的 clamp 字号区间（仅文档展示）
const HEADING_ROWS = [
  { level: 1, sizes: "48–88" },
  { level: 2, sizes: "28–44" },
  { level: 3, sizes: "20–24" },
  { level: 4, sizes: "16–18" },
] as const satisfies ReadonlyArray<{ level: 1 | 2 | 3 | 4; sizes: string }>;

// Text 各 variant —— variant 是 <Text> 真实入参，size 是该 variant 的字号（仅文档展示）
const TEXT_ROWS = [
  { variant: "body", size: "18" },
  { variant: "strong", size: "18" },
  { variant: "label", size: "12" },
  { variant: "muted", size: "14" },
] as const satisfies ReadonlyArray<{
  variant: "body" | "strong" | "label" | "muted";
  size: string;
}>;

const SAMPLE_SHORT = "Helloこんにちは你好";
const SAMPLE_LONG =
  "Hello こんにちは 你好世界。This is a paragraph sample used to verify line-height across the baseline grid. " +
  "三言語の混植で各 variant の行盒（line-box）が 4px グリッドに揃うかどうかを確認する段落です。" +
  "拉丁字符与日文 / 中文交替出现时，行盒高度应保持一致，段落 baseline 不应起伏。" +
  "Same paragraph in three languages, repeated so you can feel the vertical rhythm settle in.";

function TypoRow({
  sample,
  spec,
  style,
}: {
  sample: ReactNode;
  spec: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        paddingBlock: "var(--space-6)",
      }}
    >
      <ThemeNebula.Text variant="label">{spec}</ThemeNebula.Text>
      <div style={{ maxWidth: "60ch", ...style }}>{sample}</div>
    </div>
  );
}
