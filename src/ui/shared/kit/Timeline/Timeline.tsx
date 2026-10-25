import { Stack } from "../Stack/Stack";
import { Stage } from "../Stage/Stage";
import { Text } from "../Text/Text";
import "./Timeline.scss";

interface TimelineProps {
  items: readonly {
    company: string;
    lang?: string;
    roles: readonly { year: string; text: string }[];
  }[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="ui-timeline">
      <Stack gap="l">
        {items.map((item) => (
          <Stack key={item.company} gap="s" align="start">
            <div className="ui-timeline__company">
              <Text level="lead" lang={item.lang} text={item.company} />
            </div>
            {item.roles.map((role) => (
              <Stage
                key={role.year}
                year={role.year}
                title={role.text}
                company={item.company}
                companyLang={item.lang}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
