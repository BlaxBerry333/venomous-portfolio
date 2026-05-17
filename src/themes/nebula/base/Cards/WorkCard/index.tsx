import BaseCard from "@/themes/nebula/base/Cards/BaseCard";
import Heading from "@/themes/nebula/base/Heading";
import PreviewBox from "@/themes/nebula/base/PreviewBox";
import Text from "@/themes/nebula/base/Text";
import { getLocalizedUrl, type Locale, type Work } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { motion, useReducedMotion } from "framer-motion";
import "./index.scss";

interface Props {
  work: Work;
  locale: Locale;
  theme: Theme;
  /** 在 grid 中的序号，用于错峰入场（i * 0.08s） */
  index?: number;
  /** 默认虚化 PreviewBox，hover/focus 时恢复清晰 */
  blurPreview?: boolean;
}

export default function WorkCard({ work, locale, theme, index = 0, blurPreview = false }: Props) {
  // useReducedMotion() 首帧返回 null，归一为 boolean
  const reduced = !!useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <BaseCard
        tilt
        href={getLocalizedUrl(`/works/${work.id}`, locale, theme)}
        ariaLabel={work.title}
        className={
          "portfolio--nebula-work-card" +
          (blurPreview ? " portfolio--nebula-work-card--blur-preview" : "")
        }
      >
        {work.previewCode ? (
          <PreviewBox.WorkMedia previewCode={work.previewCode} />
        ) : (
          <PreviewBox.Image src="" />
        )}

        <div className="portfolio--nebula-work-card__header">
          <Text as="span" variant="muted">
            {work.areaName}
          </Text>
          <Text as="span" variant="label">
            {work.period}
          </Text>
        </div>

        <div className="portfolio--nebula-work-card__body">
          <Heading level={4} clamp={2}>
            {work.title}
          </Heading>
        </div>
      </BaseCard>
    </motion.div>
  );
}
