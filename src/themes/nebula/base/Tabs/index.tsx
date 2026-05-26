import { clsx } from "@/utils/styles";
import { useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import "./index.scss";

export interface TabItem {
  /** 稳定唯一 id：用作 React key + activeId 匹配；调用方保证组内唯一 */
  id: string;
  /** 标签显示内容 */
  label: ReactNode;
  /**
   * 链接地址 —— 传了则该项渲染为 <a>（导航，点击跳转）。
   * 整组要么全是链接、要么全是受控按钮，不混用。
   */
  href?: string;
  /** 链接项的无障碍标签（aria-label） */
  ariaLabel?: string;
  /** 链接项的 hreflang */
  hrefLang?: string;
}

interface Props {
  /** 标签项列表 */
  items: TabItem[];
  /** 当前选中项 id（受控）。不匹配任何 item 时无选中项。 */
  activeId: string;
  /**
   * 选中项变化回调 —— 受控按钮模式下点击 / 键盘触发。
   * 链接模式可不传；链接模式下若传入，会在原生跳转前先回调（如 404 页拦截）：
   * 回调拿到点击事件，可自行 `preventDefault()` 阻止原生导航。
   */
  onChange?: (id: string, event?: MouseEvent) => void;
  /** tablist 无障碍描述 */
  ariaLabel?: string;
  /**
   * 裸模式 —— 去掉自身的胶囊外壳（背景 / 边框 / 内边距）。
   * 用于嵌进已有容器（如 switcher 的玻璃浮层）。
   */
  bare?: boolean;
  /**
   * 等宽方格模式 —— 每个 tab 收成固定尺寸的正方格，
   * 标签字数不一（如 `日` / `EN`）也对齐成同尺寸，切换 / 刷新不跳动。
   */
  equal?: boolean;
  /** 外层附加类 —— 留给使用方调外距 */
  className?: string;
}

/**
 * nebula 霓虹标签组 —— 受控按钮 tablist，或链接导航组。
 * 选中项亮起霓虹胶囊，纯 CSS 过渡。
 */
export default function Tabs({
  items,
  activeId,
  onChange,
  ariaLabel,
  bare = false,
  equal = false,
  className = "",
}: Props) {
  // 各 tab 的 DOM ref —— roving tabindex 下用键盘移动焦点
  const tabsRef = useRef<Array<HTMLElement | null>>([]);
  const activeIndex = items.findIndex((it) => it.id === activeId);
  const isLinkMode = items.some((it) => it.href !== undefined);

  function onKeyDown(e: KeyboardEvent, index: number) {
    if (items.length < 2) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + items.length) % items.length;
    tabsRef.current[next]?.focus();
    // 受控按钮模式：箭头移动焦点的同时切换选中（automatic activation）
    if (!isLinkMode) onChange?.(items[next].id);
  }

  return (
    <div
      className={clsx(
        "portfolio--nebula-tabs",
        bare && "portfolio--nebula-tabs--bare",
        equal && "portfolio--nebula-tabs--equal",
        className,
      )}
      role={isLinkMode ? undefined : "tablist"}
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const isActive = item.id === activeId;
        // 选中项可聚焦；无选中项时回退到第一项
        const focusable = isActive || (activeIndex === -1 && i === 0);

        const cls = clsx(
          "portfolio--nebula-tabs__tab",
          isActive && "portfolio--nebula-tabs__tab--active",
        );

        if (item.href !== undefined) {
          return (
            <a
              key={item.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              href={item.href}
              className={cls}
              data-active={isActive}
              aria-current={isActive ? "true" : undefined}
              aria-label={item.ariaLabel}
              hrefLang={item.hrefLang}
              tabIndex={focusable ? 0 : -1}
              onClick={(e) => onChange?.(item.id, e)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="portfolio--nebula-tabs__text">{item.label}</span>
            </a>
          );
        }

        return (
          <button
            key={item.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            className={cls}
            data-active={isActive}
            aria-selected={isActive}
            tabIndex={focusable ? 0 : -1}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="portfolio--nebula-tabs__text">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
