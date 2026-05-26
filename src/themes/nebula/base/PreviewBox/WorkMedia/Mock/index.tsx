import { clsx } from "@/utils/styles";
import { useId, type CSSProperties, type ReactNode } from "react";
import { rand, randFloat, randInt } from "./hash";
import "./index.scss";

/**
 * Mock —— nebula 风「假截图」compound 原语集
 *
 * 用 HTML/CSS 拼 UI 剪影，少量需要绘图的（折线 / 柱 / 环 / 火花线）用 SVG。
 * 每个原语都是独立 DOM 节点，靠 flex/grid 自由组合。
 *
 * 设计原则：
 *  - 同 seed 永远渲染相同内容（SSR/CSR 一致；rand 用 sin + 4 位截断防 ULP 漂移）
 *  - 全部走 nebula token；不引入新颜色
 *  - 内置极淡 CRT 扫描线 + 暗角，让叠出来的"假截图"有屏幕感
 *  - 不使用 context：所有需要随机内容的子原语都收 `seed` prop，调用方显式注入
 *
 * 用法（compound）：
 * ```tsx
 * <Mock>
 *   <Mock.Window title="dashboard.app">
 *     <Mock.Sidebar seed={`${id}/sidebar`} items={5} />
 *     <Mock.Body>
 *       <Mock.KpiRow seed={`${id}/kpi`} count={2} />
 *       <Mock.LineChart seed={`${id}/chart`} points={8} />
 *     </Mock.Body>
 *   </Mock.Window>
 * </Mock>
 * ```
 */

// ============================================================
// 根：<Mock>
// ============================================================

interface MockProps {
  /** 宽高比，默认 16/10。也可传 "1/1" / "4/5" 等 */
  aspect?: string;
  /** 是否叠暗角（默认 true） */
  vignette?: boolean;
  /** 边框样式：none/soft/neon（默认 soft） */
  border?: "none" | "soft" | "neon";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function MockRoot({
  aspect = "16 / 10",
  vignette = true,
  border = "soft",
  className,
  style,
  children,
}: MockProps) {
  return (
    <div
      className={clsx("nebula--Mock", `nebula--Mock--border-${border}`, className)}
      style={{ aspectRatio: aspect, ...style } as CSSProperties}
      aria-hidden
    >
      <div className="nebula--Mock__canvas">{children}</div>
      {vignette && <div className="nebula--Mock__vignette" aria-hidden />}
    </div>
  );
}

// ============================================================
// 布局原语（无随机内容，不需要 seed）
// ============================================================

// <Mock.Window>：带 macOS dots + 标题的窗口外壳
function Window({
  dots = true,
  children,
  className,
}: {
  dots?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-Window", className)}>
      <div className="nebula--Mock-Window__chrome">
        {dots && (
          <div className="nebula--Mock-Window__dots">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <div className="nebula--Mock-Window__body">{children}</div>
    </div>
  );
}

// <Mock.Body>：主区域，flex column，承载内容
function Body({
  children,
  padding = "12px",
  gap = "10px",
  className,
}: {
  children?: ReactNode;
  padding?: string;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-Body", className)} style={{ padding, gap } as CSSProperties}>
      {children}
    </div>
  );
}

// <Mock.Row> / <Mock.Col>：flex 容器
function Row({
  children,
  gap = "8px",
  className,
  style,
}: {
  children?: ReactNode;
  gap?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={clsx("nebula--Mock-Row", className)} style={{ gap, ...style } as CSSProperties}>
      {children}
    </div>
  );
}

function Col({
  children,
  gap = "8px",
  flex,
  className,
  style,
}: {
  children?: ReactNode;
  gap?: string;
  flex?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={clsx("nebula--Mock-Col", className)}
      style={{ gap, flex, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}

// ============================================================
// 含随机内容的原语：必填 seed
// ============================================================

// <Mock.Sidebar>：左/右侧栏 + N 条菜单
function Sidebar({
  seed,
  items = 5,
  side = "left",
  width = "22%",
  activeIndex,
  className,
}: {
  seed: string;
  items?: number;
  side?: "left" | "right";
  width?: string;
  activeIndex?: number;
  className?: string;
}) {
  const active = activeIndex ?? randInt(seed, 1, 0, items - 1);
  return (
    <div
      className={clsx("nebula--Mock-Sidebar", `nebula--Mock-Sidebar--${side}`, className)}
      style={{ width }}
    >
      {Array.from({ length: items }, (_, i) => {
        const w = 40 + randInt(seed, 10 + i, 0, 50);
        return (
          <div key={i} className={clsx("nebula--Mock-Sidebar__item", i === active && "is-active")}>
            <span className="nebula--Mock-Sidebar__dot" />
            <span className="nebula--Mock-Sidebar__line" style={{ width: `${w}%` }} />
          </div>
        );
      })}
    </div>
  );
}

// <Mock.Toolbar>：顶部工具条（一行 chip / button）
function Toolbar({
  seed,
  items = 4,
  className,
}: {
  seed: string;
  items?: number;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-Toolbar", className)}>
      {Array.from({ length: items }, (_, i) => {
        const w = 30 + randInt(seed, i, 0, 50);
        return <span key={i} className="nebula--Mock-Toolbar__chip" style={{ width: `${w}px` }} />;
      })}
    </div>
  );
}

// <Mock.Tabs>：标签条
function Tabs({
  seed,
  items = 3,
  activeIndex,
  className,
}: {
  seed: string;
  items?: number;
  activeIndex?: number;
  className?: string;
}) {
  const active = activeIndex ?? randInt(seed, 0, 0, items - 1);
  return (
    <div className={clsx("nebula--Mock-Tabs", className)}>
      {Array.from({ length: items }, (_, i) => {
        const w = 40 + randInt(seed, 10 + i, 0, 30);
        return (
          <span
            key={i}
            className={clsx("nebula--Mock-Tabs__tab", i === active && "is-active")}
            style={{ width: `${w}px` }}
          />
        );
      })}
    </div>
  );
}

// KPI 卡：大数字 + 标签
function Kpi({
  seed,
  label,
  value,
  trend,
  className,
}: {
  seed: string;
  label?: string;
  value?: string;
  trend?: "up" | "down" | "flat";
  className?: string;
}) {
  const resolvedLabel =
    label ?? ["REVENUE", "USERS", "MRR", "CHURN", "VISITS"][randInt(seed, 0, 0, 4)];
  const resolvedValue = value ?? "xx.xxK";
  const resolvedTrend = trend ?? (rand(seed, 3) > 0.5 ? "up" : "down");
  return (
    <div className={clsx("nebula--Mock-Kpi", className)}>
      <span className="nebula--Mock-Kpi__label">{resolvedLabel}</span>
      <span className="nebula--Mock-Kpi__value">{resolvedValue}</span>
      <span className={clsx("nebula--Mock-Kpi__trend", `is-${resolvedTrend}`)}>
        {resolvedTrend === "up" ? "▲" : resolvedTrend === "down" ? "▼" : "—"} xx%
      </span>
    </div>
  );
}

// KPI 一行 N 个；每张 KPI 用 seed/index 作为子 seed，跨 KPI 内容不同但稳定
function KpiRow({ seed, count = 3 }: { seed: string; count?: number }) {
  return (
    <div className="nebula--Mock-KpiRow">
      {Array.from({ length: count }, (_, i) => (
        <Kpi key={i} seed={`${seed}/${i}`} />
      ))}
    </div>
  );
}

// 折线图
function LineChart({
  seed,
  points = 8,
  height = "100%",
  showDots = true,
  className,
}: {
  seed: string;
  points?: number;
  height?: string;
  showDots?: boolean;
  className?: string;
}) {
  const gradId = `mock-line-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const xs = Array.from({ length: points }, (_, i) => (i / (points - 1)) * 100);
  const ys = Array.from({ length: points }, (_, i) => 20 + randFloat(seed, i, 0, 60));
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <div className={clsx("nebula--Mock-LineChart", className)} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--nebula-color-neon-1)" />
            <stop offset="100%" stopColor="var(--nebula-color-neon-2)" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {showDots &&
          xs.map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={ys[i]}
              r="1.2"
              fill="var(--nebula-color-neon-1)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
      </svg>
    </div>
  );
}

// 面积图：折线 + 渐变填充
function AreaChart({
  seed,
  points = 8,
  height = "100%",
  className,
}: {
  seed: string;
  points?: number;
  height?: string;
  className?: string;
}) {
  const gradId = `mock-area-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const xs = Array.from({ length: points }, (_, i) => (i / (points - 1)) * 100);
  const ys = Array.from({ length: points }, (_, i) => 20 + randFloat(seed, i, 0, 50));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;
  return (
    <div className={clsx("nebula--Mock-AreaChart", className)} style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--nebula-color-neon-1)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--nebula-color-neon-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--nebula-color-neon-1)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// 柱图
function BarChart({
  seed,
  bars = 10,
  height = "100%",
  className,
}: {
  seed: string;
  bars?: number;
  height?: string;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-BarChart", className)} style={{ height }}>
      {Array.from({ length: bars }, (_, i) => {
        const h = 20 + randInt(seed, i, 0, 70);
        return <span key={i} className="nebula--Mock-BarChart__bar" style={{ height: `${h}%` }} />;
      })}
    </div>
  );
}

// 火花线（迷你折线，适合 KPI 卡里嵌）
function Sparkline({
  seed,
  points = 12,
  width = "60px",
  height = "16px",
  className,
}: {
  seed: string;
  points?: number;
  width?: string;
  height?: string;
  className?: string;
}) {
  const xs = Array.from({ length: points }, (_, i) => (i / (points - 1)) * 100);
  const ys = Array.from({ length: points }, (_, i) => 20 + randFloat(seed, i, 0, 60));
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <div className={clsx("nebula--Mock-Sparkline", className)} style={{ width, height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke="var(--nebula-color-neon-1)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// 环图
function Donut({
  seed,
  size = "64px",
  className,
}: {
  seed: string;
  size?: string;
  className?: string;
}) {
  const pct = 30 + randInt(seed, 0, 0, 60);
  const gradId = `mock-donut-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <div className={clsx("nebula--Mock-Donut", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--nebula-color-neon-1)" />
            <stop offset="100%" stopColor="var(--nebula-color-neon-2)" />
          </linearGradient>
        </defs>
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="color-mix(in srgb, var(--nebula-color-text) 10%, transparent)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeDasharray={`${pct * 0.88} ${88 - pct * 0.88}`}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="nebula--Mock-Donut__label">{pct}%</span>
    </div>
  );
}

// 热力图：N×M 格子
function Heatmap({
  seed,
  rows = 5,
  cols = 14,
  className,
}: {
  seed: string;
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx("nebula--Mock-Heatmap", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const v = rand(seed, i);
        return (
          <span
            key={i}
            className="nebula--Mock-Heatmap__cell"
            style={{ opacity: 0.15 + v * 0.85 }}
          />
        );
      })}
    </div>
  );
}

// 代码块：行号 + 缩进 + 长度不一的代码 bar
function CodeBlock({
  seed,
  lines = 18,
  showLineNumbers = true,
  className,
}: {
  seed: string;
  lines?: number;
  showLineNumbers?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-CodeBlock", className)}>
      {showLineNumbers && (
        <div className="nebula--Mock-CodeBlock__gutter">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      )}
      <div className="nebula--Mock-CodeBlock__code">
        {Array.from({ length: lines }, (_, i) => {
          const indent = randInt(seed, i * 2, 0, 3) * 12;
          const width = 30 + randInt(seed, i * 2 + 1, 0, 60);
          const isHl = randInt(seed, i * 3, 0, 6) === 0;
          return (
            <div
              key={i}
              className="nebula--Mock-CodeBlock__line"
              style={{ paddingLeft: `${indent}px` }}
            >
              <span
                className={clsx("nebula--Mock-CodeBlock__bar", isHl && "is-hl")}
                style={{ width: `${width}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 终端：prompt + 命令行 + 多行输出 + 空行分块（按 seed 派生 line 角色，节奏更真实）
function Terminal({
  seed,
  lines = 8,
  prompt = "$",
  className,
}: {
  seed: string;
  lines?: number;
  prompt?: string;
  className?: string;
}) {
  // line 角色：cmd（带 prompt 高亮）/ out（普通输出）/ ok（成功行带 ✓）/ err（错误行带 ✗）/ blank（空行分块）
  type Role = "cmd" | "out" | "ok" | "err" | "blank";

  // 用一个状态机派生角色，靠 seed 决定每个命令产几行输出
  const roles: Role[] = [];
  let i = 0;
  while (i < lines) {
    roles.push("cmd");
    i++;
    if (i >= lines) break;
    const outCount = randInt(seed, i, 1, 4);
    for (let k = 0; k < outCount && i < lines; k++, i++) {
      const r = randInt(seed, i * 7, 0, 9);
      roles.push(r === 0 ? "err" : r <= 2 ? "ok" : "out");
    }
    if (i < lines && randInt(seed, i * 11, 0, 3) === 0) {
      roles.push("blank");
      i++;
    }
  }

  return (
    <div className={clsx("nebula--Mock-Terminal", className)}>
      {roles.map((role, idx) => {
        if (role === "blank") {
          return <div key={idx} className="nebula--Mock-Terminal__line is-blank" />;
        }
        const width = 30 + randInt(seed, idx, 0, 55);
        return (
          <div key={idx} className={clsx("nebula--Mock-Terminal__line", `is-${role}`)}>
            {role === "cmd" && <span className="nebula--Mock-Terminal__prompt">{prompt}</span>}
            {role === "ok" && <span className="nebula--Mock-Terminal__glyph is-ok">✓</span>}
            {role === "err" && <span className="nebula--Mock-Terminal__glyph is-err">✗</span>}
            <span className="nebula--Mock-Terminal__bar" style={{ width: `${width}%` }} />
          </div>
        );
      })}
      <span className="nebula--Mock-Terminal__cursor" />
    </div>
  );
}

// 聊天气泡（内嵌 Avatar，派生子 seed 给它）
function ChatBubble({
  seed,
  side = "left",
  lines = 2,
  width = "65%",
  className,
}: {
  seed: string;
  side?: "left" | "right";
  lines?: number;
  width?: string;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-ChatBubble", `nebula--Mock-ChatBubble--${side}`, className)}>
      <Avatar seed={`${seed}/avatar`} size="20px" />
      <div className="nebula--Mock-ChatBubble__bubble" style={{ width }}>
        {Array.from({ length: lines }, (_, i) => {
          const w = 60 + randInt(seed, i, 0, 35);
          return (
            <span key={i} className="nebula--Mock-ChatBubble__line" style={{ width: `${w}%` }} />
          );
        })}
      </div>
    </div>
  );
}

// 头像
function Avatar({
  seed,
  size = "32px",
  className,
}: {
  seed: string;
  size?: string;
  className?: string;
}) {
  const hue = randInt(seed, 0, 0, 360);
  return (
    <span
      className={clsx("nebula--Mock-Avatar", className)}
      style={{
        width: size,
        height: size,
        filter: `hue-rotate(${hue}deg)`,
      }}
    />
  );
}

// 表格
function Table({
  seed,
  rows = 5,
  cols = 4,
  showHeader = true,
  className,
}: {
  seed: string;
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx("nebula--Mock-Table", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {showHeader &&
        Array.from({ length: cols }, (_, i) => (
          <span
            key={`h-${i}`}
            className="nebula--Mock-Table__head"
            style={{ width: `${50 + randInt(seed, i, 0, 30)}%` }}
          />
        ))}
      {Array.from({ length: rows * cols }, (_, i) => {
        const w = 40 + randInt(seed, 100 + i, 0, 50);
        const isPill = i % 7 === 0;
        return (
          <span
            key={i}
            className={clsx("nebula--Mock-Table__cell", isPill && "is-pill")}
            style={{ width: `${w}%` }}
          />
        );
      })}
    </div>
  );
}

// 数据列表：行 = avatar + title + meta + value（每行 Avatar 派生子 seed）
function DataList({
  seed,
  items = 4,
  className,
}: {
  seed: string;
  items?: number;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-DataList", className)}>
      {Array.from({ length: items }, (_, i) => {
        const titleW = 40 + randInt(seed, i * 2, 0, 50);
        const metaW = 20 + randInt(seed, i * 2 + 1, 0, 30);
        return (
          <div key={i} className="nebula--Mock-DataList__row">
            <Avatar seed={`${seed}/avatar/${i}`} size="24px" />
            <div className="nebula--Mock-DataList__text">
              <span className="nebula--Mock-DataList__title" style={{ width: `${titleW}%` }} />
              <span className="nebula--Mock-DataList__meta" style={{ width: `${metaW}%` }} />
            </div>
            <span className="nebula--Mock-DataList__value">{randInt(seed, i * 3, 1, 999)}</span>
          </div>
        );
      })}
    </div>
  );
}

// 日历
function Calendar({
  seed,
  weeks = 5,
  className,
}: {
  seed: string;
  weeks?: number;
  className?: string;
}) {
  const days = weeks * 7;
  const today = randInt(seed, 0, 0, days - 1);
  return (
    <div className={clsx("nebula--Mock-Calendar", className)}>
      <div className="nebula--Mock-Calendar__head">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="nebula--Mock-Calendar__grid">
        {Array.from({ length: days }, (_, i) => {
          const hasDot = randInt(seed, i, 0, 4) === 0;
          return (
            <span
              key={i}
              className={clsx(
                "nebula--Mock-Calendar__day",
                i === today && "is-today",
                hasDot && "has-dot",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

// 块网格：N 个 placeholder card
function BlockGrid({
  seed,
  count = 6,
  cols = 3,
  aspect = "1 / 1",
  className,
}: {
  seed: string;
  count?: number;
  cols?: number;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("nebula--Mock-BlockGrid", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: count }, (_, i) => {
        const accent = randInt(seed, i, 0, 3) === 0;
        return (
          <span
            key={i}
            className={clsx("nebula--Mock-BlockGrid__cell", accent && "is-accent")}
            style={{ aspectRatio: aspect }}
          />
        );
      })}
    </div>
  );
}

// 文本行：连续 N 行不等长 bar，模拟段落
function TextLines({
  seed,
  lines = 3,
  widthRange = [60, 100] as [number, number],
  className,
}: {
  seed: string;
  lines?: number;
  widthRange?: [number, number];
  className?: string;
}) {
  const [min, max] = widthRange;
  return (
    <div className={clsx("nebula--Mock-TextLines", className)}>
      {Array.from({ length: lines }, (_, i) => {
        const w = min + randInt(seed, i, 0, max - min);
        return <span key={i} className="nebula--Mock-TextLines__line" style={{ width: `${w}%` }} />;
      })}
    </div>
  );
}

// 标签（纯静态、不需 seed）
function Tag({
  width = "32px",
  variant = "default",
  className,
}: {
  width?: string;
  variant?: "default" | "accent";
  className?: string;
}) {
  return (
    <span className={clsx("nebula--Mock-Tag", `is-${variant}`, className)} style={{ width }} />
  );
}

// 按钮（纯静态、不需 seed）
function Button({
  width = "60px",
  variant = "primary",
  className,
}: {
  width?: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  return (
    <span className={clsx("nebula--Mock-Button", `is-${variant}`, className)} style={{ width }} />
  );
}

// Node-based flow —— 单源扇出 + 一条延伸（写死布局，零随机）
// 拓扑：A → {B1, B2, B3}，B3 → C
// 节点单色化：每个 role 一种主色，不在同一个节点里堆多色
function Flow({ className }: { className?: string }) {
  // role 决定 head 单色（start / branch / end）；edge 统一弱色不带 glow
  type Role = "start" | "branch" | "end";
  const nodeW = 18;
  const nodeH = 16;

  const nodes: { id: string; x: number; y: number; role: Role }[] = [
    { id: "A", x: 6, y: 42, role: "start" },
    { id: "B1", x: 42, y: 8, role: "branch" },
    { id: "B2", x: 42, y: 42, role: "branch" },
    { id: "B3", x: 42, y: 76, role: "branch" },
    { id: "C", x: 76, y: 76, role: "end" },
  ];
  const edges: [string, string][] = [
    ["A", "B1"],
    ["A", "B2"],
    ["A", "B3"],
    ["B3", "C"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className={clsx("nebula--Mock-Flow", className)}>
      <svg
        className="nebula--Mock-Flow__svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {edges.map(([fromId, toId], k) => {
          const a = byId[fromId];
          const b = byId[toId];
          const ax = a.x + nodeW;
          const ay = a.y + nodeH / 2;
          const bx = b.x;
          const by = b.y + nodeH / 2;
          const cx = (ax + bx) / 2;
          const d = `M ${ax} ${ay} C ${cx} ${ay}, ${cx} ${by}, ${bx} ${by}`;
          return (
            <path
              key={k}
              className="nebula--Mock-Flow__edge"
              d={d}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className={clsx("nebula--Mock-Flow__node", `is-${n.role}`)}
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: `${nodeW}%`,
            height: `${nodeH}%`,
          }}
        >
          <span className="nebula--Mock-Flow__node-head" />
          <span className="nebula--Mock-Flow__node-bar" style={{ width: "78%" }} />
          <span className="nebula--Mock-Flow__node-bar" style={{ width: "52%" }} />
        </div>
      ))}
    </div>
  );
}

// Minimap
function Minimap({
  seed,
  lines = 30,
  width = "32px",
  className,
}: {
  seed: string;
  lines?: number;
  width?: string;
  className?: string;
}) {
  return (
    <div className={clsx("nebula--Mock-Minimap", className)} style={{ width }}>
      {Array.from({ length: lines }, (_, i) => {
        const w = 30 + randInt(seed, i, 0, 60);
        return <span key={i} className="nebula--Mock-Minimap__line" style={{ width: `${w}%` }} />;
      })}
    </div>
  );
}

// 进度条：value 不传时按 seed 派生
function Progress({
  seed,
  value,
  className,
}: {
  seed?: string;
  value?: number;
  className?: string;
}) {
  const v = value ?? (seed ? randInt(seed, 0, 20, 90) : 50);
  return (
    <div className={clsx("nebula--Mock-Progress", className)}>
      <span className="nebula--Mock-Progress__fill" style={{ width: `${v}%` }} />
    </div>
  );
}

// ============================================================
// compound 导出
// ============================================================
const Mock = Object.assign(MockRoot, {
  Window,
  Sidebar,
  Body,
  Row,
  Col,
  Toolbar,
  Tabs,
  Kpi,
  KpiRow,
  LineChart,
  AreaChart,
  BarChart,
  Sparkline,
  Donut,
  Heatmap,
  CodeBlock,
  Terminal,
  ChatBubble,
  Avatar,
  Table,
  DataList,
  Calendar,
  BlockGrid,
  TextLines,
  Tag,
  Button,
  Minimap,
  Progress,
  Flow,
});

export default Mock;
