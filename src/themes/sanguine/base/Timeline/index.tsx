import type { TimelineItem } from "@/utils/i18n";
import { motion } from "framer-motion";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  /** 时间轴条目，按顺序渲染；首条自动高亮（当前 / 最新）。 */
  items: TimelineItem[];
  /** 纯展示模式：跳过进场动画（design system 等场景用）。 */
  static?: boolean;
}

/**
 * sanguine 单轴台账时间轴。
 * 一根硬轴贯穿，方形刻痕节点逐条排列；首条作为「当前」自动高亮。
 */
export default function Timeline({ items, static: isStatic = false }: Props) {
  return (
    <ol className="portfolio--sanguine-timeline" aria-label="Career timeline">
      {items.map((item, index) => (
        <Row key={item.id} item={item} index={index} isActive={index === 0} isStatic={isStatic} />
      ))}
    </ol>
  );
}

/** 单条台账行 —— 时间轴的内部实现细节，不对外暴露。 */
function Row({
  item,
  index,
  isActive,
  isStatic,
}: {
  item: TimelineItem;
  index: number;
  isActive: boolean;
  isStatic: boolean;
}) {
  return (
    <motion.li
      className={`portfolio--sanguine-timeline__row ${isActive ? "is-active" : ""}`}
      initial={isStatic ? false : { opacity: 0, y: 30 }}
      whileInView={isStatic ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      <span className="portfolio--sanguine-timeline__node" />
      <div className="portfolio--sanguine-timeline__card">
        <span className="portfolio--sanguine-timeline__period">{item.period}</span>
        <h3 className="portfolio--sanguine-timeline__company">{item.company}</h3>
        <p className="portfolio--sanguine-timeline__role">{item.role}</p>
        {item.department && (
          <span className="portfolio--sanguine-timeline__dept">{item.department}</span>
        )}
      </div>
    </motion.li>
  );
}
