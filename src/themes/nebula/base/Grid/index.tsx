import type { CSSProperties, ReactNode } from "react";
import "./index.scss";

interface Props {
  children: ReactNode;
  /**
   * PC 列数（也定义"卡宽参考系"）。响应式断点内部固定：
   *   - <=1024px → max(columns, 2)，最多 2 列
   *   - <=640px  → 1 列
   */
  columns?: number;
  /**
   * 子元素未填满当前行时的排布：
   *   - "stretch"（默认）→ 每列 1fr 撑满
   *   - "center"        → 列宽锁成「(100% - gap·(columns-1)) / columns」，未填满的行整体居中
   * 让"少于 columns 张时"的卡宽与铺满时一致，而不是被 1fr 撑大。
   */
  align?: "stretch" | "center";
}

export default function Grid({ children, columns = 3, align = "stretch" }: Props) {
  return (
    <div
      className={`nebula--Grid nebula--Grid--align-${align}`}
      style={{ "--cols": columns } as CSSProperties}
    >
      {children}
    </div>
  );
}
