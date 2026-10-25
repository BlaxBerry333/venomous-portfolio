import { useId } from "react";

export function useSvgId(): string {
  return `art${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}
