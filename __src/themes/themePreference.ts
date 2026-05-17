// theme 偏好持久化的共享常量 — storage key + 白名单 + 默认值
// 三处脚本（persistThemePreference / resumeBackToShowcase / [lang]/index.astro）共用
export const THEME_STORAGE_KEY = "portfolio.theme";
export const VALID_THEMES = ["void", "manga", "zenless"] as const;
export const DEFAULT_THEME: (typeof VALID_THEMES)[number] = "void";
