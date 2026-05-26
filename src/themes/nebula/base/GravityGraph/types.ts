// —— 通用节点：组件不规定业务语义 ——
export interface GravityNode {
  /** 稳定唯一 id：React key + 选中标识；调用方保证唯一 */
  id: string;
  /** 节点显示文本（球面 Html 渲染） */
  label: string;
  /** 选中时详情 Card 的副标题（如熟练度 / 类别）。不传 → 只显 label */
  subLabel?: string;
  /** 无障碍补充：覆盖节点 button 的默认 aria-label */
  ariaLabel?: string;
  /** 视觉分组：primary 内圈大字 + 强色，secondary 外圈小字 + 弱色。默认 primary */
  group?: "primary" | "secondary";
}

export interface GravityGraphProps {
  /** 节点列表；超过 MAX_NODES 截断（调用方控制数量） */
  nodes: GravityNode[];
  /** 容器无障碍描述。不传 → 通用兜底 */
  ariaLabel?: string;
  /** 最多渲染多少个节点（截断在 mount 前），默认 28 */
  maxNodes?: number;
}

/**
 * 引力球几何 / 容量常量。
 *   - poleGap          fibonacci 球面分布时 y 的截断范围 [-poleGap, poleGap]，避开两极不让节点叠在中轴上
 *   - poleAxisExtent   N/S 中轴两端 y（球外延伸长度）。最外圈 radius 2.4 × poleGap = 1.97，再外推 0.83 留 N/S 标签
 *   - radiusPrimary    primary 节点球半径（内圈）
 *   - radiusSecondary  secondary 节点球半径（外圈）
 *   - defaultMaxNodes  默认 maxNodes —— 超过这个数节点会挤、文字重叠；调用方可显式覆盖
 */
export const GRAVITY = {
  poleGap: 0.82,
  poleAxisExtent: 2.8,
  radiusPrimary: 1.4,
  radiusSecondary: 2.4,
  defaultMaxNodes: 28,
} as const;

// 黄金角 fibonacci 球面分布
export function fibonacciSphere(count: number, radius: number): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < count; i++) {
    const y = GRAVITY.poleGap - (i / Math.max(count - 1, 1)) * 2 * GRAVITY.poleGap;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return pts;
}
