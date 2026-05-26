import { clsx } from "@/utils/styles";
import "./index.scss";

interface Props {
  /** 真实图片地址；不传则走 placeholder 形态（虚线 + 渐变背景） */
  src?: string;
  /** 无障碍描述 */
  alt?: string;
}

export default function Image({ src, alt }: Props) {
  const className = clsx(
    "portfolio--nebula-preview-image",
    !src && "portfolio--nebula-preview-image--placeholder",
  );

  return (
    <div className={className} aria-label={!src ? alt : undefined}>
      {src && <img src={src} alt={alt ?? ""} loading="lazy" />}
    </div>
  );
}
