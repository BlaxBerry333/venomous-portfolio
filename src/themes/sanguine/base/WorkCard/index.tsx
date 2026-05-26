import { getLocalizedUrl, type Locale, type Work } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import { motion } from "framer-motion";
import PreviewBox from "../PreviewBox";
import "./index.scss";

type WorkCardProps = {
  work: Work;
  locale: Locale;
  theme: Theme;
};

export default function WorkCard({ work, locale, theme }: WorkCardProps) {
  const href = getLocalizedUrl(`/works/${work.id}`, locale, theme);
  return (
    <li className="portfolio--sanguine-work-card-wrap">
      <motion.a
        href={href}
        className="portfolio--sanguine-work-card"
        aria-label={work.title}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        {work.previewCode && (
          <div className="portfolio--sanguine-work-card__media">
            <PreviewBox.WorkMedia previewCode={work.previewCode} />
          </div>
        )}
        <div className="portfolio--sanguine-work-card__text">
          <h3 className="portfolio--sanguine-work-card__title">{work.title}</h3>
          <span className="portfolio--sanguine-work-card__meta">
            {work.period} · {work.areaName}
          </span>
        </div>
      </motion.a>
    </li>
  );
}
