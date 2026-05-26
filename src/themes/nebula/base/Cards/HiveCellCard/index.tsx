import { useTilt } from "@/themes/nebula/base/Cards/useTilt";
import { clsx } from "@/utils/styles";
import { useReducedMotion } from "framer-motion";
import { useId, type CSSProperties, type ReactNode } from "react";
import "./index.scss";

/**
 * HiveCellCard —— 正六边形 cell，沿用 Card 的 useTilt 3D 交互
 *
 * 与 Card 的对应（让交互行为完全一致）：
 *   - 外层（本身）          ↔ Card.__tilt-root：perspective 1200 + ref + tiltHandlers + CSS 变量
 *   - __tilt                ↔ Card.__tilt：preserve-3d + rotateX/Y + 420ms ease-out-expo（hover 80ms linear）
 *   - __body                ↔ Card 本体：preserve-3d（让内部 translateZ 生效）+ SVG 六边形（fill + 渐变 stroke）
 *   - __content translateZ  ↔ Card.__body translateZ(24px)
 *   - __glow                ↔ Card.__glow：translateZ(40px) + 跟指针 radial-gradient
 *
 * 蜂巢排版（cell 自带）：
 *   - 行间咬合用 cell 的负 margin-bottom（hex 高的 1/4）
 *   - 行首错位由 offset prop 决定（cell 整体 margin-left 右移半格）
 *   调用方只需 flex-wrap 容器 + padding-bottom 抵消最后一行负 margin（与所用 size 同档）。
 *
 * 调用方负责"哪个 cell 是行首" —— 因为每行多少格只有调用方知道（取决于容器宽 / 用户选择）。
 */

export type HiveCellCardVariant = "solid" | "outline";
/**
 * 尺寸档（命名对齐 Tailwind / shadcn 主流约定）：
 *   sm —— 100 × 115（密集列表 / 紧凑场景）
 *   md —— 160 × 185（默认，蜂巢列表常用）
 *   lg —— 240 × 277（详情卡 / 单独突出展示，文字字号更大）
 */
export type HiveCellCardSize = "sm" | "md" | "lg";

interface Props {
  /** 蜂巢错位：行首 cell 整体右移半格。由调用方根据"几个/行"判断。 */
  offset?: boolean;
  /** 3D 倾斜开关，默认 true。reduced-motion 自动失效。 */
  tilt?: boolean;
  /** 视觉强弱，默认 outline */
  variant?: HiveCellCardVariant;
  /** 尺寸档，默认 md */
  size?: HiveCellCardSize;
  /** 主标签（默认布局下渲染在中间，大字 + neon shadow） */
  title?: ReactNode;
  /** 副标签（默认布局下渲染在 title 下方，小字、letter-spaced） */
  subtitle?: ReactNode;
  /**
   * 完全自定义内容。传了就忽略 title/subtitle，整个 content 区由调用方填充
   *（仍享有内置的居中布局 + translateZ 浮起）。
   */
  children?: ReactNode;
  /** 无障碍描述 */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const HEX_PATH = "M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z";
const HEX_VIEWBOX = "0 0 100 115.47";

export default function HiveCellCard({
  offset = false,
  tilt = true,
  variant = "outline",
  size = "md",
  title,
  subtitle,
  children,
  ariaLabel,
  className,
  style,
}: Props) {
  const reduced = !!useReducedMotion();
  // 8° 倾角，与 Card 一致；tilt 关时 hook 内部空转
  const { rootRef, tiltHandlers } = useTilt<HTMLDivElement>(8, reduced || !tilt);

  // 每个 cell 的渐变描边唯一 id，避免多 cell 共用同一 <linearGradient> 引发渲染冲突
  const gradId = `hive-stroke-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  // 内容区：children 传了就完全自定义；否则按 title + subtitle 默认布局
  const contentNode = children ?? (
    <>
      {title && <span className="nebula--HiveCellCard__title">{title}</span>}
      {subtitle && <span className="nebula--HiveCellCard__subtitle">{subtitle}</span>}
    </>
  );

  // 本体：SVG 六边形（fill + 渐变 stroke 内描边）+ 居中内容层
  // - preserveAspectRatio="xMidYMid meet"：保持 viewBox 等比；容器跟 viewBox 比例严格一致（√3/2）时完美贴合，
  //   即使因 px 取整出现亚像素差也不会非等比拉伸 → 六条边描边视觉宽度严格一致
  // - stroke-width=2 + vectorEffect=non-scaling-stroke：描边一半在 viewBox 外被裁、内侧 1px 被 fill 覆盖
  //   → 干净的 1px 内描边，hover 加粗也不会"溢出"
  // - stroke-linejoin=round：顶点接合圆滑，避免 miter 在 120° 顶点产生小尖刺
  const body = (
    <div className="nebula--HiveCellCard__body">
      <svg
        className="nebula--HiveCellCard__shape"
        viewBox={HEX_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--nebula-color-neon-1)" />
            <stop offset="100%" stopColor="var(--nebula-color-neon-2)" />
          </linearGradient>
        </defs>
        <path
          className="nebula--HiveCellCard__stroke"
          d={HEX_PATH}
          stroke={`url(#${gradId})`}
          fill="none"
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path className="nebula--HiveCellCard__fill" d={HEX_PATH} />
      </svg>
      <div className="nebula--HiveCellCard__content">{contentNode}</div>
    </div>
  );

  const rootClassName = clsx(
    "nebula--HiveCellCard",
    `nebula--HiveCellCard--${variant}`,
    `nebula--HiveCellCard--${size}`,
    offset && "nebula--HiveCellCard--offset",
    !tilt && "nebula--HiveCellCard--no-tilt",
    className,
  );

  // 不倾斜：直接渲染本体（与 Card.tilt=false 同形）
  if (!tilt) {
    return (
      <div className={rootClassName} style={style} aria-label={ariaLabel}>
        {body}
      </div>
    );
  }

  // 倾斜：外层 perspective + 指针事件 + ref；内层 __tilt 做 rotateX/Y；__glow 跟指针
  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={style}
      aria-label={ariaLabel}
      {...tiltHandlers}
    >
      <div className="nebula--HiveCellCard__tilt">
        {body}
        <span className="nebula--HiveCellCard__glow" aria-hidden />
      </div>
    </div>
  );
}
