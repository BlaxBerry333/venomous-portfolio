import { detectClientLocale, LOCALES, type Locale, type NotFoundMeta } from "@/utils/i18n";
import { detectClientTheme, type Theme } from "@/utils/themes";
import { lazy, Suspense, useEffect, useState } from "react";

// 按主题切分的两套 404 子树 —— lazy 加载，命中哪套才下载哪套（含各自的 WebGL 背景）
const NotFoundNebula = lazy(() => import("./NotFoundNebula"));
const NotFoundSanguine = lazy(() => import("./NotFoundSanguine"));

interface Props {
  meta: NotFoundMeta;
  /** 站点 base —— 用于探测路径段、构造首页 URL。 */
  base: string;
}

/**
 * 404 派发岛（client:only）—— 单份 HTML，挂载后探测「上次主题」+ locale，
 * 只 lazy 加载并渲染命中的那套主题子树，另一套的代码与背景完全不下载。
 *
 * 为什么是 client:only：404 是单份静态 HTML，SSR 阶段不知道用户期望哪套主题 / locale；
 * 两套主题背景都是 WebGL，绝不能同时挂载。挂载前的极短空窗由 ThemeCriticalCSS 的底色兜住。
 */
export default function NotFound({ meta, base }: Props) {
  // 挂载前 SSR 不知道主题 / locale —— null 占位，挂载后探测
  const [theme, setTheme] = useState<Theme | null>(null);
  const [locale, setLocale] = useState<Locale | null>(null);

  useEffect(() => {
    setTheme(detectClientTheme(base));
    setLocale(detectClientLocale(base));
  }, [base]);

  // 主题 / locale 定下后同步 <html> 属性与文档标题
  useEffect(() => {
    if (theme === null || locale === null) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = LOCALES[locale].htmlLang;
    document.title = `${meta.title[locale]} | Portfolio — Chen`;
  }, [theme, locale, meta]);

  if (theme === null || locale === null) return null;

  const subtreeProps = {
    meta,
    base,
    locale,
    onLocaleChange: setLocale,
    onThemeChange: setTheme,
  };

  return (
    <Suspense fallback={null}>
      {theme === "nebula" ? (
        <NotFoundNebula {...subtreeProps} />
      ) : (
        <NotFoundSanguine {...subtreeProps} />
      )}
    </Suspense>
  );
}
