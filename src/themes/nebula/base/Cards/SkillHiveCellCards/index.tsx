import HiveCellCard from "@/themes/nebula/base/Cards/HiveCellCard";
import Text from "@/themes/nebula/base/Text";
import type { Skill, SkillAreaId } from "@/utils/i18n";
import { useEffect, useRef, useState } from "react";
import "./index.scss";

/**
 * SkillHiveCellCards —— 按 skill.area 分组渲染密铺蜂巢
 *
 *  几何模型（不可违反）
 *  ────────────────────────────────────────────────
 *  蜂巢密铺只有一个不变量：相邻行水平错开 hex-w / 2。
 *  所以无论 start / center，渲染都遵循同一套规则：
 *    1. 每组按 cols 切多行（cols = min(组的 cell 数, 容器可容纳列数)）
 *    2. 偶数行（rowIdx % 2 === 0）从 X=0 起
 *    3. 奇数行（rowIdx % 2 === 1）整行右移 hex-w/2，由该行第一个 hex 的 offset=true 达成
 *    4. 行间靠 HiveCellCard 自带负 margin-bottom 咬合
 *
 *  align 的语义
 *  ────────────────────────────────────────────────
 *  align 不参与几何计算，只决定密铺块体在容器中的对齐：
 *    - "start"  → 块体贴左
 *    - "center" → 块体作为整体在容器中水平居中（margin auto）
 *  关键点：是「块体居中」而非「每行各自居中」，后者会破坏第 3 条不变量。
 *
 *  cols 的真正含义
 *  ────────────────────────────────────────────────
 *  cols = min(g.skills.length, containerCols)
 *    - 一组 4 个 cell + 容器够宽 → cols=4，单行装完，无奇数行
 *    - 一组 6 个 cell + 容器只够 3 → cols=3，切 3+3，第 2 行 offset 半格
 *  这样每组自适应，不再受其他组的 cell 数干扰。
 */

interface Props {
  skills: Skill[];
  align?: "start" | "center";
  /**
   * 是否在 hex 内显示熟练度（subtitle）。默认 false → 只显示 label。
   * 仅用于"技能展板"这类需要表达熟练度的场景；work 详情页面的技术栈陈列保持默认关。
   */
  showSkillLevel?: boolean;
}

interface SkillGroup {
  area: SkillAreaId;
  areaName: string;
  skills: Skill[];
}

/** 按 area 分组，保持 skill 在原数组中的顺序 */
function groupByArea(skills: Skill[]): SkillGroup[] {
  const byArea = new Map<SkillAreaId, Skill[]>();
  for (const s of skills) {
    const arr = byArea.get(s.area) ?? [];
    arr.push(s);
    byArea.set(s.area, arr);
  }
  return Array.from(byArea.entries()).map(([area, arr]) => ({
    area,
    areaName: arr[0].areaName,
    skills: arr,
  }));
}

function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// sm HiveCellCard 几何（与 HiveCellCard.scss 的 &--sm --hex-w 同源）
const SM_HEX_W = 120;
const SM_HEX_HALF = SM_HEX_W / 2;

/**
 * 容器宽 → 可容纳列数。
 * 用奇数行（offset 半格）的容量作保守值，保证奇数行不会被挤换行。
 */
function calcContainerCols(width: number): number {
  return Math.max(1, Math.floor((width - SM_HEX_HALF) / SM_HEX_W));
}

function useContainerCols() {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(5);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setCols(calcContainerCols(w));
      setMeasured(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, cols, measured] as const;
}

/**
 * 算一组的密铺块体宽度（px）：
 *   - cols 列宽 = cols * hex-w
 *   - 若存在奇数行（行数 >= 2）→ 整体宽度多 hex-w/2（奇数行突出半格）
 * 用于把块体作为整体在容器中居中（外层 margin auto）。
 */
function calcGroupWidth(cellCount: number, cols: number): number {
  const rows = Math.ceil(cellCount / cols);
  return cols * SM_HEX_W + (rows >= 2 ? SM_HEX_HALF : 0);
}

export default function SkillHiveCellCards({
  skills,
  align = "start",
  showSkillLevel = false,
}: Props) {
  const [rootRef, containerCols, measured] = useContainerCols();
  if (skills.length === 0) return null;

  const rootStyle: React.CSSProperties = measured
    ? { opacity: 1 }
    : { opacity: 0, pointerEvents: "none" };

  return (
    <div
      ref={rootRef}
      className={`nebula--SkillHiveCellCards nebula--SkillHiveCellCards--align-${align}`}
      style={rootStyle}
    >
      {groupByArea(skills).map((g) => {
        // 每组的 cols：本组 cell 数与容器容量的较小者（让 4 个 cell 不被切成 3+1）
        const groupCols = Math.min(g.skills.length, containerCols);
        const rows = chunk(g.skills, groupCols);
        const blockWidth = calcGroupWidth(g.skills.length, groupCols);

        return (
          <div key={g.area} className="nebula--SkillHiveCellCards__group">
            {/*
             * __block 是固有宽度的密铺块体，宽度由 calcGroupWidth 算出。
             * align="center" 时外层 align-items: center 让它在 __group 中居中；
             * align="start"  时外层 align-items: flex-start 让它贴左。
             * head 直接放在 block 内部，自动跟着块体走，永不与 grid 错位。
             */}
            <div className="nebula--SkillHiveCellCards__block" style={{ width: `${blockWidth}px` }}>
              <div className="nebula--SkillHiveCellCards__group-head">
                <Text as="span" variant="label">
                  {g.areaName}
                </Text>
              </div>
              <div className="nebula--SkillHiveCellCards__grid">
                {rows.map((row, rowIdx) =>
                  row.map((s, i) => (
                    <HiveCellCard
                      key={s.id}
                      size="sm"
                      offset={i === 0 && rowIdx % 2 === 1}
                      title={s.label}
                      subtitle={showSkillLevel ? s.levelName : undefined}
                      ariaLabel={showSkillLevel ? `${s.label} · ${s.levelName}` : s.label}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
