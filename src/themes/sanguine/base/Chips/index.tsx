import { motion } from "framer-motion";
import Chip from "../Chip";
import "./index.scss";

interface Props {
  /** 标签文本列表。 */
  items: string[];
  /** 纯展示模式：跳过进场动画（design system 等场景用）。 */
  static?: boolean;
}

/**
 * sanguine 胶囊标签组 —— 一排 Chip，进入视口时逐个 stagger 浮现。
 */
export default function Chips({ items, static: isStatic = false }: Props) {
  return (
    <motion.ul
      className="portfolio--sanguine-chips"
      initial={isStatic ? false : "hidden"}
      whileInView={isStatic ? undefined : "show"}
      viewport={{ once: true, margin: "-15%" }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
      }}
    >
      {items.map((label) => (
        <Chip key={label} static={isStatic}>
          {label}
        </Chip>
      ))}
    </motion.ul>
  );
}
