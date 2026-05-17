import { DEFAULT_THEME, THEME_STORAGE_KEY, VALID_THEMES } from "./themePreference";

/**
 * `[lang]/` 重定向脚本：客户端读 localStorage 里的上次主题，跳到 `/<lang>/<theme>/`。
 * 读取失败 / 值非法时跳 fallback。
 * @example <script is:inline set:html={redirectToLastThemeScript(baseUrl, lang, fallbackUrl)} />
 */
export function redirectToLastThemeScript(
  baseUrl: string,
  lang: string,
  fallbackUrl: string,
): string {
  return `
(() => {
  try {
    const stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    const theme = ${JSON.stringify(VALID_THEMES)}.includes(stored) ? stored : "${DEFAULT_THEME}";
    window.location.replace("${baseUrl}/${lang}/" + theme + "/");
  } catch (e) {
    window.location.replace("${fallbackUrl}");
  }
})();
`;
}
