import { useState } from "react";
import * as Art from "../Art";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Grid } from "../Grid/Grid";
import { Image } from "../Image/Image";
import { Stack } from "../Stack/Stack";

interface WorksProps {
  items: readonly {
    id: string;
    href: string;
    title: string;
    subtitle: string;
    art?: keyof typeof Art;
    image?: ImageMetadata;
    period?: string;
    tags?: readonly string[];
  }[];
  limit?: number;
  more?: string;
  centered?: boolean;
  stagger?: boolean;
}

export function Works({ items, limit, more, centered = false, stagger = false }: WorksProps) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded || limit === undefined ? items : items.slice(0, limit);
  return (
    <Stack gap="l" align={centered ? "center" : "start"}>
      <Grid columns={4} stagger={stagger}>
        {shown.map((item) => {
          const Media = item.art && Art[item.art];
          return (
            <Card
              key={item.id}
              href={item.href}
              media={item.image ? <Image src={item.image} alt={item.title} /> : Media && <Media />}
              tag={item.period}
              title={item.title}
              text={item.subtitle}
              tags={item.tags}
            />
          );
        })}
      </Grid>
      {more && shown.length < items.length && (
        <Button variant="outline" text={more} onClick={() => setExpanded(true)} />
      )}
    </Stack>
  );
}
