import * as UI from "@/ui/shared/kit";
import { useState, type CSSProperties } from "react";
import "./Media.scss";

interface MediaProps {
  arts: readonly (keyof typeof UI.Art)[];
  images?: readonly { src: ImageMetadata; alt: string }[];
}

export function workIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

export function Media({ arts, images = [] }: MediaProps) {
  const count = arts.length + images.length;
  const [active, setActive] = useState(0);
  const slide = (i: number) =>
    i === active ? "page-work__slide page-work__slide--active" : "page-work__slide";
  const depth = (i: number) => ({ "--slide-depth": (i - active + count) % count }) as CSSProperties;
  const step = (delta: number) => setActive((active + delta + count) % count);
  return (
    <div
      className={count > 1 ? "page-work__media page-work__media--stacked" : "page-work__media"}
      style={{ "--slide-layers": count - 1 } as CSSProperties}
    >
      {arts.map((art, i) => {
        const Art = UI.Art[art];
        return (
          <figure key={art} className={slide(i)} style={depth(i)} onClick={() => setActive(i)}>
            <Art />
          </figure>
        );
      })}
      {images.map((image, i) => (
        <figure
          key={image.src.src}
          className={slide(arts.length + i)}
          style={depth(arts.length + i)}
          onClick={() => setActive(arts.length + i)}
        >
          <UI.Image src={image.src} alt={image.alt} ratio="16 / 10" priority />
        </figure>
      ))}
      {count > 1 && (
        <>
          <span className="page-work__arrow page-work__arrow--prev">
            <UI.Button variant="outline" size="icon" text="←" onClick={() => step(-1)} />
          </span>
          <span className="page-work__arrow page-work__arrow--next">
            <UI.Button variant="outline" size="icon" text="→" onClick={() => step(1)} />
          </span>
          <span className="page-work__count">
            <UI.Text level="label" text={`${workIndex(active)} / ${workIndex(count - 1)}`} />
          </span>
        </>
      )}
    </div>
  );
}
