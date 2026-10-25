import { useEffect, useRef, useState } from "react";
import "./Image.scss";

type ImageState = "idle" | "loading" | "loaded" | "error";

interface ImageProps {
  src: string | ImageMetadata;
  alt: string;
  ratio?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}

export function Image({ src, alt, ratio, fit = "cover", priority = false }: ImageProps) {
  const asset = typeof src === "string" ? { src, width: undefined, height: undefined } : src;
  const aspect =
    ratio ?? (asset.width && asset.height ? `${asset.width} / ${asset.height}` : undefined);
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<ImageState>("idle");

  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    if (!image.complete) {
      setState("loading");
      return;
    }
    setState(image.naturalWidth > 0 ? "loaded" : "error");
  }, [asset.src]);

  return (
    <span
      className={`ui-image ui-image--${fit}${aspect ? "" : " ui-image--fill"}`}
      data-state={state}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        ref={ref}
        className="ui-image__img"
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </span>
  );
}
