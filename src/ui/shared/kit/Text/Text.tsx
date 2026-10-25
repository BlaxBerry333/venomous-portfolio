import "./Text.scss";

const TEXT_TAGS = {
  hero: "h1",
  numeral: "span",
  title: "h2",
  heading: "h3",
  subheading: "h4",
  lead: "p",
  body: "p",
  caption: "p",
  label: "span",
} as const;

type TextLevel = keyof typeof TEXT_TAGS;

interface TextProps {
  level: TextLevel;
  text: string;
  accent?: boolean;
  lang?: string;
}

export function Text({ level, text, accent = false, lang }: TextProps) {
  const Tag = TEXT_TAGS[level];
  const className = accent
    ? `ui-text ui-text--${level} ui-text--accent`
    : `ui-text ui-text--${level}`;
  return (
    <Tag className={className} lang={lang}>
      {text}
    </Tag>
  );
}
