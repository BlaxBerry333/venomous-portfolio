import { swapThemeInPath } from "@/utils/i18n";
import { THEME_IDS, type Theme } from "@/utils/themes";
import Tabs from "../Tabs";
import "./index.scss";

const THEME_LABELS: Record<Theme, string> = {
  nebula: "Nebula",
  sanguine: "Sanguine",
};

interface Props {
  theme?: Theme;
  /** 站点 base，用于剥离 / 重建路径前缀。 */
  base: string;
  /**
   * 当前 `Astro.url.pathname` —— 链接模式下切主题保留页面、只换 theme 段。
   * 受控模式（传了 onChange）下可不传。
   */
  pathname?: string;
  /**
   * 受控回调 —— 传了则切换走受控模式（点击不跳转，只回调），用于 404 这类
   * 单份 HTML、theme 由 React state 驱动的场景。不传则走链接导航。
   */
  onChange?: (theme: Theme) => void;
}

/**
 * 主题切换 —— fixed 浮层，基于 Tabs。
 * 普通页：链接导航，切主题停在当前页面、只替换 URL 里的 theme 段。
 * 受控模式（传 onChange）：点击只回调，不跳转。
 */
export default function ThemeSwitcher({ theme = "sanguine", base, pathname, onChange }: Props) {
  const controlled = onChange !== undefined;

  return (
    <nav className="portfolio--sanguine-theme-switcher" aria-label="Theme">
      <Tabs
        bare
        layoutGroup="theme-switcher"
        ariaLabel="Theme"
        activeId={theme}
        onChange={controlled ? (id) => onChange(id as Theme) : undefined}
        items={THEME_IDS.map((id) => ({
          id,
          label: THEME_LABELS[id],
          // 受控模式不渲染 href —— 走 Tabs 按钮模式，点击不导航
          href: controlled ? undefined : swapThemeInPath(pathname ?? "/", base, id),
        }))}
      />
    </nav>
  );
}
