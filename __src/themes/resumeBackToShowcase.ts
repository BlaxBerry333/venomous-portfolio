import { DEFAULT_THEME, THEME_STORAGE_KEY, VALID_THEMES } from "./themePreference";

/**
 * resume 页 back-to-showcase 链接：客户端读 localStorage 把 href 重写成上次访问主题路径。
 * 依赖 `a[data-mode-switcher="back-to-showcase"]` 选择器命中 SiteHeader 渲染的链接。
 * @example {resume && <script is:inline set:html={resumeBackToShowcaseScript(base, locale)} />}
 */
export function resumeBackToShowcaseScript(baseUrl: string, lang: string): string {
  return `
(() => {
  try {
    const stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    const theme = ${JSON.stringify(VALID_THEMES)}.includes(stored) ? stored : "${DEFAULT_THEME}";
    const el = document.querySelector('a[data-mode-switcher="back-to-showcase"]');
    if (el) el.setAttribute("href", "${baseUrl}/${lang}/" + theme + "/");
  } catch (e) {}
})();
`;
}
