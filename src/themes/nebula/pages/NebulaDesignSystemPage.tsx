import { ThemeNebula } from "@/themes/nebula/base";
import { type Locale, type ThemeContent, type WorkPreviewCode } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";

interface Props {
  content: ThemeContent;
  locale: Locale;
  theme: Theme;
}

export default function NebulaDesignSystemPage({ content }: Props) {
  return (
    <>
      <ThemeNebula.Section title={content.motivationTitle} titleLevel={1}>
        <ThemeNebula.Text as="p">{content.motivation}</ThemeNebula.Text>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Button>`} titleLevel={2}>
        <ThemeNebula.Grid columns={4}>
          <ThemeNebula.Button>Solid</ThemeNebula.Button>
          <ThemeNebula.Button variant="outline">Outline</ThemeNebula.Button>
          <ThemeNebula.Button disabled>Disabled</ThemeNebula.Button>
          <ThemeNebula.Button href="#">As Link</ThemeNebula.Button>
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Chip>`} titleLevel={2}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <ThemeNebula.Chip>Solid</ThemeNebula.Chip>
          <ThemeNebula.Chip variant="outline">Outline</ThemeNebula.Chip>
          <ThemeNebula.Chip href="#">As Link</ThemeNebula.Chip>
        </div>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Heading>`} titleLevel={2}>
        <ThemeNebula.Heading level={1} as="div">
          Hello World
        </ThemeNebula.Heading>
        <ThemeNebula.Heading level={2} as="div">
          Hello World
        </ThemeNebula.Heading>
        <ThemeNebula.Heading level={3} as="div">
          Hello World
        </ThemeNebula.Heading>
        <ThemeNebula.Heading level={4} as="div">
          Hello World
        </ThemeNebula.Heading>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Text>`} titleLevel={2}>
        <ThemeNebula.Text variant="body">Hello World Hello</ThemeNebula.Text>
        <ThemeNebula.Text variant="strong">Hello World Hello</ThemeNebula.Text>
        <ThemeNebula.Text variant="label">Hello World Hello</ThemeNebula.Text>
        <ThemeNebula.Text variant="muted">Hello World Hello</ThemeNebula.Text>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<BaseCard>`} titleLevel={2}>
        <ThemeNebula.Grid columns={2}>
          {[0, 1].map((i) => (
            <ThemeNebula.BaseCard key={i}>
              <div style={{ height: 100 }} />
            </ThemeNebula.BaseCard>
          ))}
        </ThemeNebula.Grid>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<Divider>`} titleLevel={2}>
        <ThemeNebula.Divider />
        <ThemeNebula.Divider>WITH LABEL</ThemeNebula.Divider>
      </ThemeNebula.Section>

      <ThemeNebula.Section title={`<PreviewBox>`} titleLevel={2}>
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
