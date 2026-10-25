import { prefetch } from "astro:prefetch";
import "./Link.scss";

export const LINK_EXTERNAL = /^https?:\/\//;

export function linkPrefetch(href: string): (() => void) | undefined {
  return LINK_EXTERNAL.test(href) ? undefined : () => prefetch(href);
}

interface LinkProps {
  href: string;
  text: string;
  active?: boolean;
  back?: boolean;
}

export function Link({ href, text, active = false, back = false }: LinkProps) {
  const external = LINK_EXTERNAL.test(href);
  return (
    <a
      className={active ? "ui-link ui-link--active" : "ui-link"}
      href={href}
      aria-current={active ? "page" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      draggable={false}
      onPointerEnter={linkPrefetch(href)}
    >
      {back && (
        <span className="ui-link__back" aria-hidden="true">
          ←
        </span>
      )}
      {text}
      {external && (
        <span className="ui-link__arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
}
