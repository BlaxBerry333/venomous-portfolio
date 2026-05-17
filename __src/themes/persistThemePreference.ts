import { THEME_STORAGE_KEY } from "./themePreference";

/**
 * 把当前 URL 命中的 theme 写到 localStorage，供根路径 / 重定向恢复"上次主题"。
 * @example {theme && <script is:inline set:html={persistThemePreferenceScript(theme)} />}
 */
export function persistThemePreferenceScript(theme: string): string {
  return `
(() => {
  try {
    localStorage.setItem("${THEME_STORAGE_KEY}", "${theme}");
  } catch (e) {}
})();
`;
}
