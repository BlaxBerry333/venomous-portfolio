import type { ReactNode } from "react";
import { Split } from "../Split/Split";
import { Stack } from "../Stack/Stack";
import { Text } from "../Text/Text";
import "./Section.scss";

interface SectionProps {
  id?: string;
  index?: string;
  label?: string;
  title?: string;
  lead?: string;
  aside?: ReactNode;
  full?: boolean;
  centered?: boolean;
  children: ReactNode;
}

export function Section({
  id,
  index,
  label,
  title,
  lead,
  aside,
  full,
  centered,
  children,
}: SectionProps) {
  const eyebrow = index && label ? `${index} / ${label}` : (label ?? index);
  const name = (
    <Stack gap="s" align="start">
      {eyebrow && <Text level="label" text={eyebrow} />}
      {title && <Text level="title" text={title} />}
    </Stack>
  );
  return (
    <section
      id={id}
      className={["ui-section", full && "ui-section--full", centered && "ui-section--centered"]
        .filter(Boolean)
        .join(" ")}
    >
      {(eyebrow || title) && (
        <header>
          {lead || aside ? (
            <Split
              align="end"
              aside={
                <Stack gap="s" align="start">
                  {lead && <Text level="lead" text={lead} />}
                  {aside}
                </Stack>
              }
            >
              {name}
            </Split>
          ) : (
            name
          )}
        </header>
      )}
      {children}
    </section>
  );
}
