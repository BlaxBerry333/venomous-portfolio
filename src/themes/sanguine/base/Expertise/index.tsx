import type { SkillArea } from "@/utils/i18n";
import { motion } from "framer-motion";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  /** 领域 + 技能数据。 */
  areas: SkillArea[];
}

/**
 * sanguine 专业领域 —— 领域台账。
 * 每行：左侧镂空编号 + 领域名，右侧技能胶囊横排；逐行硬线分隔。
 */
export default function Expertise({ areas }: Props) {
  return (
    <div className="portfolio--sanguine-expertise">
      {areas.map((area, i) => (
        <motion.div
          key={area.id}
          className="portfolio--sanguine-expertise__row"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
        >
          <div className="portfolio--sanguine-expertise__head">
            <span className="portfolio--sanguine-expertise__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="portfolio--sanguine-expertise__name">{area.name}</span>
          </div>
          <ul className="portfolio--sanguine-expertise__chips">
            {area.skills.map((s) => (
              <li key={s.id} className="portfolio--sanguine-expertise__chip">
                {s.label}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
