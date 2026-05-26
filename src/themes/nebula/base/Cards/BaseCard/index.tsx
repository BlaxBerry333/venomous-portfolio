import { useTilt } from "@/themes/nebula/base/Cards/useTilt";
import { clsx } from "@/utils/styles";
import { useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./index.scss";

interface Props {
  /**
   * 3D 倾斜：开启后卡片随指针做 perspective 倾斜 + 跟指针的霓虹高光。
   * reduced-motion 时自动关闭。
   */
  tilt?: boolean;
  /** 传了则整张卡片是可点击链接（渲染为 <a>），否则是 <div>。 */
  href?: string;
  /** 链接无障碍标签，href 存在时建议传 */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** 卡片内容：完全自由排布，BaseCard 不再划分 header/body/footer/media 段位 */
  children?: ReactNode;
}

/**
 * BaseCard —— 玻璃态外壳 + 可选 3D 倾斜交互。
 * 只负责"长得像 nebula 卡片"，内部布局完全交给调用方。
 */
export default function BaseCard({
  tilt = true,
  href,
  ariaLabel,
  className,
  style,
  children,
}: Props) {
  // useReducedMotion() 首帧返回 null，归一为 boolean
  const reduced = !!useReducedMotion();
  // tilt 关闭时 useTilt 内部处理器空转，ref 不挂也无副作用
  const { rootRef, tiltHandlers } = useTilt<HTMLElement>(8, reduced || !tilt);

  // 卡片本体（玻璃态盒子）
  const cardBox = (
    <div
      className={clsx("portfolio--nebula-card", !tilt && className)}
      style={tilt ? undefined : style}
    >
      {children}
    </div>
  );

  // 不倾斜：卡片本体即根。href 存在时整盒子是 <a>
  if (!tilt) {
    if (href) {
      return (
        <a
          href={href}
          aria-label={ariaLabel}
          className={clsx("portfolio--nebula-card__link", className)}
          style={style}
        >
          {cardBox}
        </a>
      );
    }
    return cardBox;
  }

  // 倾斜：外层负责 perspective + 指针事件，内层 __tilt 做 rotateX/Y，叠 __glow 高光
  const tiltInner = (
    <div className="portfolio--nebula-card__tilt">
      {cardBox}
      <span className="portfolio--nebula-card__glow" aria-hidden="true" />
    </div>
  );

  const rootClassName = clsx("portfolio--nebula-card__tilt-root", className);

  if (href) {
    return (
      <a
        ref={rootRef as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={rootClassName}
        style={style}
        {...tiltHandlers}
      >
        {tiltInner}
      </a>
    );
  }

  return (
    <div
      ref={rootRef as React.Ref<HTMLDivElement>}
      className={rootClassName}
      style={style}
      {...tiltHandlers}
    >
      {tiltInner}
    </div>
  );
}
