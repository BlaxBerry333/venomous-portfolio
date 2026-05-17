import type { HTMLAttributes, ReactNode } from "react";

interface SitePageSectionProps extends HTMLAttributes<HTMLElement> {
  /** 透传给内层 <div> 限宽容器的属性（style / className / id 等） */
  containerProps?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
}

// 双层结构：外层 <section> 全宽（吃背景 / minHeight / overflow），内层 <div> 限宽居中。
// 调用方：
//   <SitePageSection style={{ background: ..., minHeight: "100vh" }}
//                    containerProps={{ style: { display: "grid", ... } }}>
export default function SitePageSection({
  className,
  containerProps,
  children,
  ...rest
}: SitePageSectionProps) {
  const outerClass = ["portfolio--site-page-section", className].filter(Boolean).join(" ");
  const { className: innerClassName, ...innerRest } = containerProps ?? {};
  const innerClass = ["portfolio--site-page-section-container", innerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={outerClass} {...rest}>
      <div className={innerClass} {...innerRest}>
        {children}
      </div>
    </section>
  );
}
