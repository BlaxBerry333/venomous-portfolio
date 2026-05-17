import BaseCard from "@/themes/nebula/base/Cards/BaseCard";
import Chip from "@/themes/nebula/base/Chip";
import Heading from "@/themes/nebula/base/Heading";
import Text from "@/themes/nebula/base/Text";
import { getLocalizedUrl, type Locale, type TimelineItem } from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import "./index.scss";

interface Props {
  locale: Locale;
  theme: Theme;
  items: TimelineItem[];
}

export default function Timeline({ locale, theme, items }: Props) {
  return (
    <ol className="portfolio--nebula-timeline" aria-label="Career timeline">
      {items.map(({ id, period, company, department, role, products }) => (
        <li key={id} className="portfolio--nebula-timeline__item">
          <span className="portfolio--nebula-timeline__node" aria-hidden="true" />

          <BaseCard tilt>
            <div className="portfolio--nebula-timeline__card-header">
              <div className="portfolio--nebula-timeline__card-meta">
                <Text as="span" variant="muted">
                  {company}
                </Text>
                {department && (
                  <Text as="span" variant="muted">
                    {department}
                  </Text>
                )}
              </div>
              <Text as="span" variant="label">
                {period}
              </Text>
            </div>

            <Heading level={4}>{role}</Heading>

            {products.length > 0 && (
              <div className="portfolio--nebula-timeline__card-footer">
                {products.map((p) => (
                  <Chip key={p.workId} href={getLocalizedUrl(`/works/${p.workId}`, locale, theme)}>
                    {p.title}
                  </Chip>
                ))}
              </div>
            )}
          </BaseCard>
        </li>
      ))}
    </ol>
  );
}
