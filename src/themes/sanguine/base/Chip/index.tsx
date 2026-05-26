import { motion } from "framer-motion";
import type { ReactNode } from "react";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  children: ReactNode;
  /** 纯展示模式：跳过进场动画。 */
  static?: boolean;
}

/**
 * sanguine 胶囊标签 —— 纯展示的小标签（技能 / 标签等），渲染为 <li>。
 * 自带进场 variants（`hidden` / `show`），可作为带 stagger 的 <ul> 的子项。
 */
export default function Chip({ children, static: isStatic = false }: Props) {
  return (
    <motion.li
      className="portfolio--sanguine-chip"
      variants={
        isStatic
          ? undefined
          : {
              hidden: { opacity: 0, y: 10, scale: 0.92 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
            }
      }
    >
      {children}
    </motion.li>
  );
}
