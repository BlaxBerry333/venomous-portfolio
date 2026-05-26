import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  /** 网格项（一组 WorkCard 等 <li> 内容）。 */
  children: ReactNode;
  /** PC 列数。默认 3；≤900px 一律单列。 */
  columns?: number;
  /**
   * 切换键 —— 传了则作为 key，值变化时整组淡入重渲染。
   * 用于过滤切换这类场景；不传则为静态网格。
   */
  animateKey?: string;
}

/**
 * sanguine 作品网格 —— 语义 <ul>，响应式列数。
 * 传 animateKey 时随其变化做整组淡入。
 */
export default function Grid({ children, columns = 3, animateKey }: Props) {
  const style = { "--sanguine-grid-cols": columns } as CSSProperties;

  if (animateKey != null) {
    return (
      <motion.ul
        key={animateKey}
        className="portfolio--sanguine-grid"
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {children}
      </motion.ul>
    );
  }

  return (
    <ul className="portfolio--sanguine-grid" style={style}>
      {children}
    </ul>
  );
}
