import { LINK_EXTERNAL, linkPrefetch } from "../Link/Link";
import "./Button.scss";

interface ButtonProps {
  text: string;
  variant?: "solid" | "outline";
  size?: "medium" | "large" | "icon";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  text,
  variant = "solid",
  size = "medium",
  href,
  disabled = false,
  onClick,
}: ButtonProps) {
  const className = `ui-button ui-button--${variant} ui-button--${size}`;
  if (href) {
    const external = LINK_EXTERNAL.test(href);
    return (
      <a
        className={className}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        draggable={false}
        onPointerEnter={linkPrefetch(href)}
      >
        <span className="ui-button__label">{text}</span>
      </a>
    );
  }
  return (
    <button type="button" className={className} disabled={disabled} onClick={onClick}>
      <span className="ui-button__label">{text}</span>
    </button>
  );
}
