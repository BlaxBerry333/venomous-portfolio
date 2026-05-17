import meta from "@/i18n/meta.json";
import {
  detectClientLocale,
  LOCALE_IDS,
  LOCALES,
  swapLocaleInPath,
  type Locale,
} from "@/utils/i18n";
import { clsx } from "@/utils/styles";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import "./index.scss";

interface Props {
  base: string;
  /** 普通页：SSR 已知 locale，从 props 传入；走原生 <a> 跳转（配合 Astro ClientRouter 无刷新） */
  locale?: Locale;
  /** 普通页：当前 pathname，用于构造目标 locale 的同路径 URL */
  pathname?: string;
  /** 404 页：所有 locale 文案共存于同一份 HTML，纯客户端 replaceState 切换 */
  notFound?: boolean;
}

export default function LocaleSwitcher({ base, locale, pathname, notFound = false }: Props) {
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  // 404 模式下 SSR 不知道用户想要的 locale，挂载后探测；普通模式直接用 props
  const [detected, setDetected] = useState<Locale | null>(notFound ? null : (locale ?? null));

  useEffect(() => {
    if (notFound) setDetected(detectClientLocale(base));
  }, [notFound, base]);

  // 404 模式：客户端切换后同步 [data-i18n-locale] 显隐 / title / html lang / Return Home href
  useEffect(() => {
    if (!notFound || detected === null) return;

    document.querySelectorAll<HTMLElement>("[data-i18n-locale]").forEach((el) => {
      el.hidden = el.dataset.i18nLocale !== detected;
    });
    document.title = `${meta.notFound.title[detected]} | Portfolio — Chen`;
    document.documentElement.lang = LOCALES[detected].htmlLang;

    const homeBtn = document.querySelector<HTMLAnchorElement>("a[data-return-home]");
    if (homeBtn) homeBtn.href = `${base}/${LOCALES[detected].urlSeg}/nebula`;
  }, [notFound, detected, base]);

  const active = detected;
  if (active === null) return null;

  const activeIndex = LOCALE_IDS.indexOf(active);
  const currentPath = notFound ? window.location.pathname : (pathname ?? "/");

  function onKeyDown(e: KeyboardEvent<HTMLElement>, index: number) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + LOCALE_IDS.length) % LOCALE_IDS.length;
    itemsRef.current[next]?.focus();
  }

  function onClick(e: MouseEvent<HTMLAnchorElement>, target: Locale) {
    if (!notFound) return; // 普通模式走原生 <a>
    // 带修饰键的点击走原生行为（新标签页等）
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (target === active) return;
    history.replaceState(null, "", swapLocaleInPath(window.location.pathname, base, target));
    setDetected(target);
  }

  return (
    <nav
      className="portfolio--nebula-locale-switcher"
      aria-label="Language"
      style={{ "--active-index": activeIndex } as CSSProperties}
    >
      <div className="portfolio--nebula-locale-switcher__track">
        <span className="portfolio--nebula-locale-switcher__indicator" aria-hidden="true" />
        {LOCALE_IDS.map((loc, i) => {
          const isActive = loc === active;
          return (
            <a
              key={loc}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              href={swapLocaleInPath(currentPath, base, loc)}
              className={clsx(
                "portfolio--nebula-locale-switcher__item",
                isActive && "portfolio--nebula-locale-switcher__item--active",
              )}
              hrefLang={LOCALES[loc].htmlLang}
              aria-label={LOCALES[loc].label}
              aria-current={isActive ? "true" : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => onClick(e, loc)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {LOCALES[loc].shortLabel}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
