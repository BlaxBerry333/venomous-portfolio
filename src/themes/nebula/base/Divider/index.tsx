import type { ReactNode } from "react";
import "./index.scss";

interface Props {
  children?: ReactNode;
}

export default function Divider({ children }: Props) {
  if (!children) {
    return <span className="portfolio--nebula-divider" aria-hidden />;
  }
  return (
    <div className="portfolio--nebula-divider portfolio--nebula-divider--labeled">
      <span className="portfolio--nebula-divider__line" aria-hidden />
      <span className="portfolio--nebula-divider__label">{children}</span>
      <span className="portfolio--nebula-divider__line" aria-hidden />
    </div>
  );
}
