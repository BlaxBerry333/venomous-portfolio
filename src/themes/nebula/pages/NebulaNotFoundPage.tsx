import { ThemeNebula } from "@/themes/nebula/base";
import { LOCALES, type Locale, type NotFoundMeta } from "@/utils/i18n";
import "./NebulaNotFoundPage.scss";

interface Props {
  meta: NotFoundMeta;
  locale: Locale;
  /** 「返回首页」目标 —— 当前 locale 的 nebula 首页。 */
  homeUrl: string;
}

/**
 * nebula 404 —— 星云氛围下的「迷航」页。
 * 文案随 locale 直接渲染（无 DOM 显隐切换）；locale / theme 切换由外层 NotFound 派发岛处理。
 */
export default function NebulaNotFoundPage({ meta, locale, homeUrl }: Props) {
  return (
    <ThemeNebula.Section className="portfolio--404">
      <ThemeNebula.Heading level={1}>
        <span lang="en" className="portfolio--404__code">
          404
        </span>
      </ThemeNebula.Heading>

      <ThemeNebula.Heading level={2}>{meta.heading.nebula[locale]}</ThemeNebula.Heading>
      <ThemeNebula.Text as="p">{meta.description.nebula[locale]}</ThemeNebula.Text>

      <ThemeNebula.Button href={homeUrl} hrefLang={LOCALES[locale].htmlLang}>
        {meta.returnHomeText[locale]}
      </ThemeNebula.Button>
    </ThemeNebula.Section>
  );
}
