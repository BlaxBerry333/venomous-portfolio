import { clsx } from "@/utils/styles";
import type { CSSProperties, ReactNode } from "react";
import { rand, randFloat, randInt } from "./hash";
import "./index.scss";

/**
 * Mock —— sanguine 风「假截图」compound 原语集。
 *
 * 与 nebula 的 Mock 同构（同一批原语、同一套 seed 约定），但视觉语言换成
 * sanguine 的碑铭/拓片审美：直角硬线、1px 发丝边、血红实色记号——
 * 不发光、不圆角、不渐变柔光。active 态 = 灌红实块 / 红发丝线。
 *
 * 设计原则：
 *  - 同 seed 永远渲染相同内容（SSR/CSR 一致；rand 用 sin + 4 位截断防 ULP 漂移）
 *  - 全部走 sanguine token；不引入新颜色
 *  - 不使用 context：需要随机内容的子原语都收 `seed` prop，调用方显式注入
 */

// ============================================================
// 根：<Mock>
// ============================================================

interface MockProps {
  /** 宽高比，默认 16/10。 */
  aspect?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function MockRoot({ aspect = "16 / 10", className, style, children }: MockProps) {
  return (
    <div
      className={clsx("sanguine--Mock", className)}
      style={{ aspectRatio: aspect, ...style } as CSSProperties}
      aria-hidden
    >
      <div className="sanguine--Mock__canvas">{children}</div>
    </div>
  );
}

// ============================================================
// 布局原语（无随机内容，不需要 seed）
// ============================================================

// <Mock.Window>：带角点 + 标题栏的窗口外壳
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
    <div className={clsx("sanguine--Mock-Window", className)}>
      <div className="sanguine--Mock-Window__chrome">
        {dots && (
          <div className="sanguine--Mock-Window__dots">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <div className="sanguine--Mock-Window__body">{children}</div>
    </div>
  );
}

// <Mock.Body>：主区域，flex column
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
    <div
      className={clsx("sanguine--Mock-Body", className)}
      style={{ padding, gap } as CSSProperties}
    >
      {children}
    </div>
  );
}

// ============================================================
// 含随机内容的原语：必填 seed
// ============================================================

// <Mock.Sidebar>：左侧栏 + N 条菜单
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
      className={clsx("sanguine--Mock-Sidebar", `sanguine--Mock-Sidebar--${side}`, className)}
      style={{ width }}
    >
      {Array.from({ length: items }, (_, i) => {
        const w = 40 + randInt(seed, 10 + i, 0, 50);
        return (
          <div
            key={i}
            className={clsx("sanguine--Mock-Sidebar__item", i === active && "is-active")}
          >
            <span className="sanguine--Mock-Sidebar__mark" />
            <span className="sanguine--Mock-Sidebar__line" style={{ width: `${w}%` }} />
          </div>
        );
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
    <div className={clsx("sanguine--Mock-Tabs", className)}>
      {Array.from({ length: items }, (_, i) => {
        const w = 40 + randInt(seed, 10 + i, 0, 30);
        return (
          <span
            key={i}
            className={clsx("sanguine--Mock-Tabs__tab", i === active && "is-active")}
            style={{ width: `${w}px` }}
          />
        );
      })}
    </div>
  );
}

// KPI 卡：标签 + 大数字 + 趋势
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
    <div className={clsx("sanguine--Mock-Kpi", className)}>
      <span className="sanguine--Mock-Kpi__label">{resolvedLabel}</span>
      <span className="sanguine--Mock-Kpi__value">{resolvedValue}</span>
      <span className={clsx("sanguine--Mock-Kpi__trend", `is-${resolvedTrend}`)}>
        {resolvedTrend === "up" ? "▲" : resolvedTrend === "down" ? "▼" : "—"} xx%
      </span>
    </div>
  );
}

// KPI 一行 N 个
function KpiRow({ seed, count = 3 }: { seed: string; count?: number }) {
  return (
    <div className="sanguine--Mock-KpiRow">
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
  showDots = true,
  className,
}: {
  seed: string;
  points?: number;
  showDots?: boolean;
  className?: string;
}) {
  const xs = Array.from({ length: points }, (_, i) => (i / (points - 1)) * 100);
  const ys = Array.from({ length: points }, (_, i) => 20 + randFloat(seed, i, 0, 60));
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <div className={clsx("sanguine--Mock-LineChart", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke="var(--sanguine-color-accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {showDots &&
          xs.map((x, i) => (
            <rect
              key={i}
              x={x - 1.1}
              y={ys[i] - 1.1}
              width={2.2}
              height={2.2}
              fill="var(--sanguine-color-accent)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
      </svg>
    </div>
  );
}

// 面积图：折线 + 实色填充（无渐变柔光，走半透明实色）
function AreaChart({
  seed,
  points = 8,
  className,
}: {
  seed: string;
  points?: number;
  className?: string;
}) {
  const xs = Array.from({ length: points }, (_, i) => (i / (points - 1)) * 100);
  const ys = Array.from({ length: points }, (_, i) => 20 + randFloat(seed, i, 0, 50));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;
  return (
    <div className={clsx("sanguine--Mock-AreaChart", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={areaPath} fill="var(--sanguine-color-accent)" fillOpacity="0.16" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--sanguine-color-accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
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
    <div className={clsx("sanguine--Mock-CodeBlock", className)}>
      {showLineNumbers && (
        <div className="sanguine--Mock-CodeBlock__gutter">
          {Array.from({ length: lines }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      )}
      <div className="sanguine--Mock-CodeBlock__code">
        {Array.from({ length: lines }, (_, i) => {
          const indent = randInt(seed, i * 2, 0, 3) * 12;
          const width = 30 + randInt(seed, i * 2 + 1, 0, 60);
          const isHl = randInt(seed, i * 3, 0, 6) === 0;
          return (
            <div
              key={i}
              className="sanguine--Mock-CodeBlock__line"
              style={{ paddingLeft: `${indent}px` }}
            >
              <span
                className={clsx("sanguine--Mock-CodeBlock__bar", isHl && "is-hl")}
                style={{ width: `${width}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 终端：prompt + 命令行 + 多行输出 + 空行分块
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
  type Role = "cmd" | "out" | "ok" | "err" | "blank";

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
    <div className={clsx("sanguine--Mock-Terminal", className)}>
      {roles.map((role, idx) => {
        if (role === "blank") {
          return <div key={idx} className="sanguine--Mock-Terminal__line is-blank" />;
        }
        const width = 30 + randInt(seed, idx, 0, 55);
        return (
          <div key={idx} className={clsx("sanguine--Mock-Terminal__line", `is-${role}`)}>
            {role === "cmd" && <span className="sanguine--Mock-Terminal__prompt">{prompt}</span>}
            {role === "ok" && <span className="sanguine--Mock-Terminal__glyph is-ok">+</span>}
            {role === "err" && <span className="sanguine--Mock-Terminal__glyph is-err">×</span>}
            <span className="sanguine--Mock-Terminal__bar" style={{ width: `${width}%` }} />
          </div>
        );
      })}
      <span className="sanguine--Mock-Terminal__cursor" />
    </div>
  );
}

// 头像（sanguine 里 = 直角实块，不是圆）
function Avatar({ size = "32px", className }: { size?: string; className?: string }) {
  return (
    <span
      className={clsx("sanguine--Mock-Avatar", className)}
      style={{ width: size, height: size }}
    />
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
    <div className={clsx("sanguine--Mock-TextLines", className)}>
      {Array.from({ length: lines }, (_, i) => {
        const w = min + randInt(seed, i, 0, max - min);
        return (
          <span key={i} className="sanguine--Mock-TextLines__line" style={{ width: `${w}%` }} />
        );
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
    <span className={clsx("sanguine--Mock-Tag", `is-${variant}`, className)} style={{ width }} />
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
    <span className={clsx("sanguine--Mock-Button", `is-${variant}`, className)} style={{ width }} />
  );
}

// Node-based flow —— 单源扇出 + 一条延伸（写死布局，零随机）
// 拓扑：A → {B1, B2, B3}，B3 → C
function Flow({ className }: { className?: string }) {
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
    <div className={clsx("sanguine--Mock-Flow", className)}>
      <svg
        className="sanguine--Mock-Flow__svg"
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
          const midX = (ax + bx) / 2;
          // 直角折线 —— 碑铭审美不用贝塞尔曲线
          const d = `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`;
          return (
            <path
              key={k}
              className="sanguine--Mock-Flow__edge"
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
          className={clsx("sanguine--Mock-Flow__node", `is-${n.role}`)}
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: `${nodeW}%`,
            height: `${nodeH}%`,
          }}
        >
          <span className="sanguine--Mock-Flow__node-head" />
          <span className="sanguine--Mock-Flow__node-bar" style={{ width: "78%" }} />
          <span className="sanguine--Mock-Flow__node-bar" style={{ width: "52%" }} />
        </div>
      ))}
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
  Tabs,
  Kpi,
  KpiRow,
  LineChart,
  AreaChart,
  CodeBlock,
  Terminal,
  Avatar,
  TextLines,
  Tag,
  Button,
  Flow,
});

export default Mock;
