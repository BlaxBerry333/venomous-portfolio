import type { ReactNode } from "react";
import "./Main.scss";

export function Main({ children }: { children: ReactNode }) {
  return <main className="ui-main">{children}</main>;
}
