import { isTheme, THEME_IDS, type Theme } from "../themes";
import { DEFAULT_LOCALE, isLocale, LOCALE_IDS, LOCALES, type Locale } from "./core";

/**
 * 生成 `[locale]` 动态路由所需的 `getStaticPaths()` 返回值。
 *
 * @returns 形如 `[{ params: { locale: "ja" } }, ...]` 的数组，覆盖全部受支持 locale。
 * @example
 * // src/pages/[locale]/index.astro
 * export const getStaticPaths = () => getLocaleStaticPaths();
 */
export function getLocaleStaticPaths() {
  return LOCALE_IDS.map((locale) => ({ params: { locale } }));
}

/**
 * 生成 `[locale]/[theme]` 嵌套动态路由所需的 `getStaticPaths()` 返回值。
 *
 * @returns 形如 `[{ params: { locale, theme } }, ...]` 的数组，locale × theme 笛卡尔积。
 * @example
 * // src/pages/[locale]/[theme]/about.astro
 * export const getStaticPaths = () => getLocaleThemeStaticPaths();
 */
export function getLocaleThemeStaticPaths() {
  return LOCALE_IDS.flatMap((locale) => THEME_IDS.map((theme) => ({ params: { locale, theme } })));
}

/**
 * 生成 `[locale]/[theme]/works/[id]` 动态路由所需的 `getStaticPaths()` 返回值。
 *
 * @param workIds - 作品 ID 列表，通常来自内容数据源（如 `works.json`）。
 * @returns 形如 `[{ params: { locale, theme, id } }, ...]` 的数组，三者笛卡尔积。
 * @example
 * export const getStaticPaths = () => getLocaleThemeWorkStaticPaths(["w01", "w02"]);
 */
export function getLocaleThemeWorkStaticPaths(workIds: readonly string[]) {
  return LOCALE_IDS.flatMap((locale) =>
    THEME_IDS.flatMap((theme) => workIds.map((id) => ({ params: { locale, theme, id } }))),
  );
}

/**
 * 由 *逻辑路径* 拼出带 `BASE_URL` / locale / theme 前缀的完整站内 URL。
 *
 * 与 {@link swapLocaleInPath} 的区别：这里输入是不带 locale 段的路径片段（如 `/about`），
 * 用于从零构造链接；后者输入是已经带 locale 段的完整 `pathname`，用于替换其中的 locale。
 *
 * @param path - 业务路径，例如 `"/about"` 或 `"works/w01"`，开头有无 `/` 均可。
 * @param locale - 目标 locale。
 * @param theme - 可选主题段；省略则不插入 `/{theme}`。
 * @returns 形如 `"{base}/{localeSeg}[/theme]{path}"` 的 URL。
 * @example
 * getLocalizedUrl("/about", "ja", "nebula"); // → "/ja/nebula/about"（base 为空时）
 */
export function getLocalizedUrl(path: string, locale: Locale, theme?: Theme): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const themeSeg = theme ? `/${theme}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${LOCALES[locale].urlSeg}${themeSeg}${normalizedPath}`;
}

/**
 * 去掉 `pathname` 开头的 `base` 前缀，拆成非空 segments 数组。
 *
 * @param pathname - 完整 `window.location.pathname` 或 `Astro.url.pathname`。
 * @param base - 站点 base，如 `""` 或 `"/portfolio"`；尾部不应带 `/`。
 * @returns 不含空段的 segments，例如 `"/portfolio/ja/about"` + base `"/portfolio"` → `["ja", "about"]`。
 */
function stripBaseSegments(pathname: string, base: string): string[] {
  let rest = pathname;
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  return rest.split("/").filter(Boolean);
}

/**
 * 把 `pathname` 里的 locale 段替换为 `target` 对应的 urlSeg；若首段不是合法 locale 则将其插入到最前。
 *
 * 纯函数 —— 不读 `window`，可在 SSR / 客户端任意环境调用。常用于 LocaleSwitcher 构造切换链接。
 *
 * @param pathname - 当前 path，例如 `"/portfolio/ja/nebula/about"`。
 * @param base - 站点 base，需与 `pathname` 中的 base 前缀一致。
 * @param target - 目标 locale。
 * @returns 已替换 locale 段的同结构 path，例如 `"/portfolio/zh/nebula/about"`。
 */
export function swapLocaleInPath(pathname: string, base: string, target: Locale): string {
  const segs = stripBaseSegments(pathname, base);
  if (isLocale(segs[0])) {
    segs[0] = LOCALES[target].urlSeg;
  } else {
    segs.unshift(LOCALES[target].urlSeg);
  }
  return `${base}/${segs.join("/")}`;
}

/**
 * 把 `pathname` 里的 theme 段替换为 `target`，其余路径（页面、works id 等）原样保留。
 *
 * 纯函数 —— 不读 `window`，SSR / 客户端均可调用。供 ThemeSwitcher 构造切换链接：
 * 切主题应停在当前页面（design-system 仍是 design-system），而非跳回新主题首页。
 *
 * URL 结构为 `{base}/{locale}/{theme}/{...rest}`，theme 固定在 locale 段之后。
 * 若该位置不是合法 theme（如停在 `/{locale}` 这种无 theme 段的页），则插入 theme 段。
 *
 * @param pathname - 当前 path，例如 `"/venomous-portfolio/en/sanguine/design-system"`。
 * @param base - 站点 base，需与 `pathname` 中的 base 前缀一致。
 * @param target - 目标 theme。
 * @returns 已替换 theme 段的同结构 path，例如 `".../en/nebula/design-system"`。
 */
export function swapThemeInPath(pathname: string, base: string, target: Theme): string {
  const segs = stripBaseSegments(pathname, base);
  // 首段为 locale 时，theme 在索引 1；否则视作无 locale 段，theme 在索引 0
  const themeIdx = isLocale(segs[0]) ? 1 : 0;
  if (isTheme(segs[themeIdx])) {
    segs[themeIdx] = target;
  } else {
    segs.splice(themeIdx, 0, target);
  }
  return `${base}/${segs.join("/")}`;
}

/**
 * 客户端探测当前 locale。
 *
 * 优先级：URL 首段 → `navigator.language` 前缀匹配 → `DEFAULT_LOCALE`。
 * 仅适用于浏览器环境（访问了 `window` / `navigator`），不可在 Astro SSR 渲染期调用。
 * 典型场景：404 页（单份 HTML、SSR 不知道用户期望 locale）。
 *
 * @param base - 站点 base，用于剥离前缀后再判断首段。
 * @returns 探测到的 locale。
 */
export function detectClientLocale(base: string): Locale {
  const seg = stripBaseSegments(window.location.pathname, base)[0];
  if (isLocale(seg)) return seg;

  const lang = navigator.language.toLowerCase();
  for (const l of LOCALE_IDS) if (lang.startsWith(l)) return l;
  return DEFAULT_LOCALE;
}
