import { motion } from "framer-motion";
import type React from "react";
import "./index.scss";

type TextVariant = "body" | "strong" | "label" | "muted";

type TextProps = Omit<React.ComponentProps<typeof motion.p>, "className"> & {
  /** 文本分档：body 正文 / strong 强调 / label 小型大写标签 / muted 弱化 */
  variant?: TextVariant;
  className?: string;
};

export default function Text({ variant = "body", className = "", ...rest }: TextProps) {
  const cls = ["portfolio--sanguine-text", `portfolio--sanguine-text--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return <motion.p {...rest} className={cls} />;
}
