import { PagesNebula, ThemeNebula } from "@/themes/nebula";
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
 * nebula 404 子树 —— 背景 + 切换器 + 内容。
 * 由 NotFound 派发岛按探测主题 lazy 加载；sanguine 命中时此模块及其 WebGL 背景不下载。
 */
export default function NotFoundNebula({
  meta,
  base,
  locale,
  onLocaleChange,
  onThemeChange,
}: Props) {
  return (
    <>
      <ThemeNebula.Background />
      <ThemeNebula.LocaleSwitcher base={base} locale={locale} onChange={onLocaleChange} />
      <ThemeNebula.ThemeSwitcher base={base} theme="nebula" onChange={onThemeChange} />
      <PagesNebula.NotFound
        meta={meta}
        locale={locale}
        homeUrl={getLocalizedUrl("/", locale, "nebula")}
      />
    </>
  );
}
