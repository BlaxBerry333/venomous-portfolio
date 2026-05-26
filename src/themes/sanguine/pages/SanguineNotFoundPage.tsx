import { ThemeSanguine } from "@/themes/sanguine/base";
import type { Locale, NotFoundMeta } from "@/utils/i18n";
import "./SanguineNotFoundPage.scss";

interface Props {
  meta: NotFoundMeta;
  locale: Locale;
  /** 「返回首页」目标 —— 当前 locale 的 sanguine 首页。 */
  homeUrl: string;
}

/**
 * sanguine 404 —— 血色氛围下的「已凝固」页。
 * 文案随 locale 直接渲染；locale / theme 切换由外层 NotFound 派发岛处理。
 */
export default function SanguineNotFoundPage({ meta, locale, homeUrl }: Props) {
  return (
    <ThemeSanguine.Section className="portfolio--sanguine-404">
      <div className="portfolio--sanguine-404__inner">
        <span lang="en" className="portfolio--sanguine-404__code">
          404
        </span>

        <ThemeSanguine.Heading as="div" level={2} text={meta.heading.sanguine[locale]} />

        <div className="portfolio--sanguine-404__desc">
          <ThemeSanguine.Text>{meta.description.sanguine[locale]}</ThemeSanguine.Text>
        </div>

        <ThemeSanguine.Button href={homeUrl} size="lg" arrow="left">
          {meta.returnHomeText[locale]}
        </ThemeSanguine.Button>
      </div>
    </ThemeSanguine.Section>
  );
}
