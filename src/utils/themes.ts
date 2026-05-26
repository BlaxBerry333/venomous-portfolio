export const THEME_IDS = ["nebula", "sanguine"] as const;

export type Theme = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: Theme = "nebula";

export function isTheme(v: unknown): v is Theme {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}

/** localStorage 键 —— 记录用户最近访问的主题，供无 theme 段的页面（如 404）回忆。 */
export const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * 记住当前主题 —— 普通页渲染时调用，把 theme 落到 localStorage。
 * 仅浏览器环境可用；localStorage 不可用（隐私模式 / 禁用）时静默跳过。
 */
export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage 不可用 —— 放弃持久化，detectClientTheme 会回退到 URL / 默认
  }
}

/**
 * 客户端探测当前主题。
 *
 * 优先级：URL theme 段 → localStorage 上次访问 → `DEFAULT_THEME`。
 * 仅适用于浏览器环境（访问了 `window` / `localStorage`），不可在 Astro SSR 渲染期调用。
 * 典型场景：404 页（单份 HTML、无 theme 段，SSR 不知道该用哪套主题）。
 *
 * @param base - 站点 base，用于剥离前缀后再判断路径段。
 */
export function detectClientTheme(base: string): Theme {
  // URL 里若已带 theme 段（如误访 /en/sanguine/xxx），直接采信
  const normalizedBase = base.replace(/\/$/, "");
  const path = window.location.pathname.startsWith(normalizedBase)
    ? window.location.pathname.slice(normalizedBase.length)
    : window.location.pathname;
  const segs = path.split("/").filter(Boolean);
  for (const seg of segs) if (isTheme(seg)) return seg;

  // 否则回忆上次访问的主题
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // localStorage 不可用 —— 落到默认
  }
  return DEFAULT_THEME;
}
