import type { ReactNode } from "react";
import Heading from "../Heading";
import PageActions from "../PageActions";
import "./index.scss";

interface Props {
  /** 碑文短句，逐行渲染为大字堆叠。 */
  lines: string[];
  /**
   * 横向偏置 —— 占屏宣言避开屏幕中央的血滴。
   *   - start（默认）：偏左、左对齐
   *   - end：偏右、右对齐
   */
  align?: "start" | "end";
  /** 操作项（一个或多个 Button），渲染在碑文下方。 */
  children?: ReactNode;
}

/**
 * sanguine 碑文宣言区 —— 占屏、偏置、大字短句堆叠。
 * Home 首尾的 intro / outro 描述区；align 决定左右偏置以错开背景血滴。
 */
export default function Statement({ lines, align = "start", children }: Props) {
  const cls = ["portfolio--sanguine-statement", `portfolio--sanguine-statement--${align}`].join(
    " ",
  );

  return (
    <section className={cls}>
      <div className="portfolio--sanguine-statement__lines">
        {lines.map((line, i) => (
          <Heading key={i} as="div" level={3} text={line} />
        ))}
      </div>
      {children && (
        <PageActions align="inherit" gap="tight" delay={0.2}>
          {children}
        </PageActions>
      )}
    </section>
  );
}
