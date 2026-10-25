import * as UI from "@/ui/shared/kit";
import type { ReactNode } from "react";

export function Chapter({
  id,
  label,
  title,
  text,
  aside,
  children,
}: {
  id: string;
  label: string;
  title: string;
  text?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <UI.Section id={id}>
      <UI.Split
        side="start"
        aside={
          <UI.Stack gap="m" align="start">
            <UI.Stack gap="s" align="start">
              <UI.Text level="label" text={label} />
              <UI.Text level="heading" text={title} />
              {text && <UI.Text level="body" text={text} />}
            </UI.Stack>
            {aside}
          </UI.Stack>
        }
      >
        {children}
      </UI.Split>
    </UI.Section>
  );
}
