import { LOCALE_IDS, LOCALES, swapLocaleInPath, type Locale } from "@/utils/i18n";
import Tabs from "../Tabs";
import "./index.scss";

interface Props {
  base: string;
  locale: Locale;
  /**
   * 当前 pathname —— 链接模式（普通页）下用于构造各 locale 的同路径 URL。
   * 受控模式（传了 onChange，如 404）下可不传。
   */
  pathname?: string;
  /**
   * 受控回调 —— 传了则切换走受控模式（点击不跳转，只回调），用于 404 这类
   * 单份 HTML、locale 由 React state 驱动的场景。不传则走链接导航。
   */
  onChange?: (locale: Locale) => void;
}

/**
 * 语言切换 —— fixed 浮层，基于 Tabs。
 * 普通页：链接导航。受控模式（传 onChange）：点击只回调，不跳转。
 */
export default function LocaleSwitcher({ base, locale, pathname, onChange }: Props) {
  const controlled = onChange !== undefined;

  return (
    <nav className="portfolio--sanguine-locale-switcher" aria-label="Language">
      <Tabs
        bare
        layoutGroup="locale-switcher"
        ariaLabel="Language"
        activeId={locale}
        onChange={controlled ? (id) => onChange(id as Locale) : undefined}
        items={LOCALE_IDS.map((loc) => ({
          id: loc,
          label: LOCALES[loc].shortLabel,
          // 受控模式不渲染 href —— 走 Tabs 按钮模式，点击不导航
          href: controlled ? undefined : swapLocaleInPath(pathname ?? "/", base, loc),
          ariaLabel: LOCALES[loc].label,
          hrefLang: controlled ? undefined : LOCALES[loc].htmlLang,
        }))}
      />
    </nav>
  );
}
