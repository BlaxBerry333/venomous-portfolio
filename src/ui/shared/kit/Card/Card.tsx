import type { ReactNode } from "react";
import { LINK_EXTERNAL, linkPrefetch } from "../Link/Link";
import "../Panel/Panel.scss";
import { Tags } from "../Tags/Tags";
import { Text } from "../Text/Text";
import "./Card.scss";

interface CardProps {
  href: string;
  media: ReactNode;
  tag?: string;
  title?: string;
  text?: string;
  tags?: readonly string[];
}

export function Card({ href, media, tag, title, text, tags }: CardProps) {
  const external = LINK_EXTERNAL.test(href);
  const body = tag || title || text;
  return (
    <a
      className="ui-panel ui-card"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      draggable={false}
      onPointerEnter={linkPrefetch(href)}
    >
      <span className="ui-card__media">{media}</span>
      {tags && (
        <span className="ui-card__tags">
          <Tags items={tags} />
        </span>
      )}
      {body && (
        <span className="ui-card__body">
          {tag && <Text level="label" text={tag} />}
          {title && <Text level="subheading" text={title} />}
          {text && <Text level="body" text={text} />}
        </span>
      )}
    </a>
  );
}
