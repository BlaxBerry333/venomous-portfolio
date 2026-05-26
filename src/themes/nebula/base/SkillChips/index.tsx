import Chip, { type ChipVariant } from "@/themes/nebula/base/Chip";
import type { Skill, SkillLevel } from "@/utils/i18n";
import { clsx } from "@/utils/styles";
import "./index.scss";

interface Props {
  skills: Skill[];
  /** 最多展示几个 skill，超出折叠为 +N。不传则全部展示。 */
  max?: number;
  /**
   * 非交互模式：Chip 渲染为 <span> 而非 <button>。
   * 用于嵌进已经是 <a> 的容器（如带 href 的 Card）。
   */
  static?: boolean;
  className?: string;
}

const LEVEL_TO_VARIANT: Record<SkillLevel, ChipVariant> = {
  proficient: "solid",
  familiar: "outline",
};

export default function SkillChips({ skills, max, static: isStatic, className }: Props) {
  const limit = max ?? skills.length;
  const shown = skills.slice(0, limit);
  const hiddenCount = skills.length - shown.length;

  return (
    <ul className={clsx("portfolio--nebula-skill-chips", className)} role="list">
      {shown.map((s) => (
        <li key={s.id}>
          <Chip variant={LEVEL_TO_VARIANT[s.level]} static={isStatic}>
            {s.label}
          </Chip>
        </li>
      ))}
      {hiddenCount > 0 && (
        <li className="portfolio--nebula-skill-chips__more" aria-label={`+${hiddenCount} more`}>
          +{hiddenCount}
        </li>
      )}
    </ul>
  );
}
