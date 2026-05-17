import type { HTMLMotionProps, Transition } from "framer-motion";

// 漫画风通用 hover 摇晃：scale 1.05 + 在静止角度上叠加 ±wobbleDeg 抖动
// 用法：<motion.div {...mangaHoverWobble(-3)} ... />
//   - restRotate: 元素静止时的旋转角（deg），preset 会基于它计算 hover 终态
//   - direction: "auto" 时按 restRotate 正负反向叠加（更自然），也可强制 "+" / "-"
//   - wobbleDeg: 叠加幅度，默认 1.5
export function mangaHoverWobble(
  restRotate = 0,
  options: { wobbleDeg?: number; direction?: "auto" | "+" | "-"; scale?: number } = {},
): Pick<HTMLMotionProps<"div">, "whileHover"> {
  const { wobbleDeg = 1.5, direction = "auto", scale = 1.05 } = options;
  const sign = direction === "+" ? 1 : direction === "-" ? -1 : restRotate >= 0 ? -1 : 1;
  const transition: Transition = { type: "spring", stiffness: 300, damping: 14 };
  return {
    whileHover: {
      scale,
      rotate: restRotate + sign * wobbleDeg,
      transition,
    },
  };
}
