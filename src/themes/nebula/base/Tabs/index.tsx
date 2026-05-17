import { clsx } from "@/utils/styles";
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import "./index.scss";

export interface TabItem {
  /** 稳定唯一 id：用作 React key + activeId 匹配；调用方保证组内唯一 */
  id: string;
  /** 标签显示内容 */
  label: ReactNode;
}

interface Props {
  /** 标签项列表 */
  items: TabItem[];
  /** 当前选中项 id（受控）。不匹配任何 item 时无选中项。 */
  activeId: string;
  /** 选中项变化回调 */
  onChange: (id: string) => void;
  /** tablist 无障碍描述 */
  ariaLabel?: string;
}

export default function Tabs({ items, activeId, onChange, ariaLabel }: Props) {
  // 各 tab 的 DOM ref —— roving tabindex 下用键盘移动焦点
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = items.findIndex((it) => it.id === activeId);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + items.length) % items.length;
    tabsRef.current[next]?.focus();
    // 标准 tabs：箭头移动焦点的同时切换选中（automatic activation）
    onChange(items[next].id);
  }

  return (
    <div className="portfolio--nebula-tabs" role="tablist" aria-label={ariaLabel}>
      {items.map((item, i) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            className={clsx(
              "portfolio--nebula-tabs__tab",
              isActive && "portfolio--nebula-tabs__tab--active",
            )}
            data-active={isActive}
            aria-selected={isActive}
            // roving tabindex：只有选中项可被 Tab 键聚焦；无选中项时回退到第一项
            tabIndex={isActive || (activeIndex === -1 && i === 0) ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
