import type { ReactNode } from "react";
import "./Screen.scss";

export function Screen({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="ui-screen">
      <div className="ui-screen__content">{children}</div>
    </section>
  );
}
