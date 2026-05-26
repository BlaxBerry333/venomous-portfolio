import { motion } from "framer-motion";
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import "./index.scss";

export interface TabItem {
  /** 稳定唯一 id —— React key + activeId 匹配；调用方保证组内唯一。 */
  id: string;
  /** 标签显示内容。 */
  label: ReactNode;
  /**
   * 链接地址 —— 传了则该项渲染为 <a>（导航，点击跳转）。
   * 整组要么全是链接、要么全是受控按钮，不混用。
   */
  href?: string;
  /** 链接项的无障碍标签（aria-label）。 */
  ariaLabel?: string;
  /** 链接项的 hreflang。 */
  hrefLang?: string;
}

interface Props {
  /** 标签项列表。 */
  items: TabItem[];
  /** 当前选中项 id（受控）。不匹配任何 item 时无选中项。 */
  activeId: string;
  /** 选中项变化回调 —— 受控按钮模式下点击 / 键盘触发。 */
  onChange?: (id: string) => void;
  /** tablist 无障碍描述。 */
  ariaLabel?: string;
  /** 共享 layout 滑块的唯一组名 —— 同页多个 Tabs 时须各异。默认 "tabs"。 */
  layoutGroup?: string;
  /**
   * 裸模式 —— 去掉自身的胶囊外壳（背景 / 边框 / 内边距）。
   * 用于嵌进已有容器（如 switcher 的玻璃浮层）。
   */
  bare?: boolean;
  /** 外层附加类 —— 留给使用方调外距。 */
  className?: string;
}

/**
 * sanguine 胶囊式标签组 —— 受控按钮 tablist，或链接导航组。
 * active 背景是 framer layout 滑块，切换时在标签间「流动」。
 */
export default function Tabs({
  items,
  activeId,
  onChange,
  ariaLabel,
  layoutGroup = "tabs",
  bare = false,
  className = "",
}: Props) {
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
      className={["portfolio--sanguine-tabs", bare && "portfolio--sanguine-tabs--bare", className]
        .filter(Boolean)
        .join(" ")}
      role={isLinkMode ? undefined : "tablist"}
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const isActive = item.id === activeId;
        // 选中项可聚焦；无选中项时回退到第一项
        const focusable = isActive || (activeIndex === -1 && i === 0);

        const inner = (
          <>
            {isActive && (
              <motion.span
                className="portfolio--sanguine-tabs__slider"
                layoutId={`${layoutGroup}-slider`}
                transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}
                aria-hidden="true"
              />
            )}
            <span className="portfolio--sanguine-tabs__text">{item.label}</span>
          </>
        );

        const cls = `portfolio--sanguine-tabs__tab ${isActive ? "is-active" : ""}`;

        if (item.href !== undefined) {
          return (
            <a
              key={item.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              href={item.href}
              className={cls}
              aria-current={isActive ? "true" : undefined}
              aria-label={item.ariaLabel}
              hrefLang={item.hrefLang}
              tabIndex={focusable ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {inner}
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
            aria-selected={isActive}
            tabIndex={focusable ? 0 : -1}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
