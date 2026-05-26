import { PagesSanguine, ThemeSanguine } from "@/themes/sanguine";
import { getLocalizedUrl, type Locale, type NotFoundMeta } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";

interface Props {
  meta: NotFoundMeta;
  base: string;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onThemeChange: (theme: Theme) => void;
}

/**
 * sanguine 404 子树 —— 背景 + 滚动进度 + 切换器 + 内容。
 * 由 NotFound 派发岛按探测主题 lazy 加载；nebula 命中时此模块及其 WebGL 背景不下载。
 */
export default function NotFoundSanguine({
  meta,
  base,
  locale,
  onLocaleChange,
  onThemeChange,
}: Props) {
  return (
    <>
      <ThemeSanguine.Background />
      <ThemeSanguine.ScrollProgress />
      <ThemeSanguine.LocaleSwitcher base={base} locale={locale} onChange={onLocaleChange} />
      <ThemeSanguine.ThemeSwitcher base={base} theme="sanguine" onChange={onThemeChange} />
      <PagesSanguine.NotFound
        meta={meta}
        locale={locale}
        homeUrl={getLocalizedUrl("/", locale, "sanguine")}
      />
    </>
  );
}
