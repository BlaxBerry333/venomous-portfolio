import { createPortal } from "react-dom";
import { ZenlessUI } from "../../components";

export interface ChapterRailItem {
  idx: number;
  label: string;
}

interface Props {
  chapters: ChapterRailItem[];
  active: number;
  onJump: (idx: number) => void;
}

/**
 * 左侧固定竖版章节进度条
 * - Portal 到 document.body：避开 App.tsx 的 motion.div(filter:blur) containing block
 * - 复用 ZenlessUI.Button(variant=tab) 站内按钮风格
 *
 * 旋转策略（重构）：
 * 不再用 writingMode + rotate(180) 双重叠加（会让 clipPath 切角方向反掉、扫光动画要补偿）。
 * 现在做法：每个 button 自然横向渲染，外层 wrapper 用 rotate(-90deg) 整体立起来。
 *   - button 视觉、clipPath、hover 扫光全部按横向原版工作
 *   - wrapper 用 width=按钮目标"竖直高度", height=按钮目标"水平长度"，旋转后正好对位
 *   - 数字 "01" 朝上、底部朝下，从下往上读
 */
export default function ChapterRail({ chapters, active, onJump }: Props) {
  if (typeof document === "undefined") return null;

  // 每个章节按钮立起来后占据的 rail 竖直高度
  const SLOT_HEIGHT = 80;
  // 旋转前 button 的水平长度（= 立起来后的竖直高度）
  const BTN_WIDTH = SLOT_HEIGHT;
  // 旋转前 button 的高度（= 立起来后的水平宽度，即 rail 宽度方向上的厚度）
  const BTN_HEIGHT = 40;

  return createPortal(
    <aside className="zd-a-prog" aria-label="Chapter progress">
      {chapters.map((c) => {
        const isActive = c.idx === active;
        return (
          <div
            key={c.idx}
            className="zd-a-prog__slot"
            style={{
              width: BTN_HEIGHT,
              height: SLOT_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZenlessUI.Button
              variant="tab"
              size="sm"
              active={isActive}
              ariaSelected={isActive}
              onClick={() => onJump(c.idx)}
              className="zd-a-prog__btn"
              minWidth={BTN_WIDTH}
              style={{
                width: BTN_WIDTH,
                height: BTN_HEIGHT,
                padding: 0,
                transform: "rotate(-90deg)",
                transformOrigin: "center center",
                letterSpacing: "0.2em",
              }}
            >
              {String(c.idx).padStart(2, "0")}
            </ZenlessUI.Button>
          </div>
        );
      })}
    </aside>,
    document.body,
  );
}
