import { motion } from "framer-motion";
import type { ReactNode } from "react";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  /** 操作项（一个或多个 Button）。 */
  children: ReactNode;
  /** 进场延迟（秒）。默认 0.3。 */
  delay?: number;
  /**
   * 横向对齐。
   *   - center（默认）：居中 —— 内容区块底部的常规操作行
   *   - inherit：不设对齐，跟随父级 —— 用于已自带对齐的区块（如偏置宣言区）
   */
  align?: "center" | "inherit";
  /** 与上方内容的间距档位。default 80px / tight 56px。 */
  gap?: "default" | "tight";
}

/**
 * 区块底部的操作行 —— 按钮组 + 统一的 whileInView 进场。
 * 收口各内容页重复的 `<motion.div>` + Button 样板。
 */
export default function PageActions({
  children,
  delay = 0.3,
  align = "center",
  gap = "default",
}: Props) {
  const cls = [
    "portfolio--sanguine-page-actions",
    `portfolio--sanguine-page-actions--${align}`,
    `portfolio--sanguine-page-actions--gap-${gap}`,
  ].join(" ");

  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "15% 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
