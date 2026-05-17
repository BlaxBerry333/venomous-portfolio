import Heading from "@/themes/nebula/base/Heading";
import Text from "@/themes/nebula/base/Text";
import { clsx } from "@/utils/styles";
import { Fragment, type ReactNode } from "react";
import "./index.scss";

interface Props {
  /** 锚点 id，挂在 <section> 上（如 "expertise"） */
  id?: string;
  /** 标题块上方的编号 / 分类小字，如 "01 / 02"；配合 title 渲染 */
  titleLabel?: string;
  /** 区块主标题；传了就内联渲染标题块 */
  title?: string;
  /**
   * 标题语义级别（h1–h4）。默认 h2 —— 一个页面通常应只有一个 h1
   * （走 PageLayout / Hero），各内容区块用 h2。仅作语义切换，视觉档位由 Heading 内部决定。
   */
  titleLevel?: 1 | 2 | 3 | 4;
  /** 标题块内部的副标题，紧贴主标题下方，仅在 title 存在时生效 */
  subtitle?: string;
  /**
   * 区块说明文字，单段或多段。渲染样式由是否有 title 决定：
   *   - 有 title：渲染在标题块下方、children 上方的普通段落（多段则段落堆叠）
   *   - 无 title：渲染成居中、加大的标题堆叠（整段「文本段」语义）
   */
  description?: string | string[];
  /**
   * 区块底部的操作行（按钮组等），居中排布。
   * 传数组时各项由 Section 自动补 key，调用方无需手写 key。
   */
  actions?: ReactNode | ReactNode[];
  className?: string;
  children?: ReactNode;
}

/**
 * 页面区块容器。
 *   - 传 titleLabel/title/subtitle  → 内联渲染标题块
 *   - 传 description               → 有 title 时是标题下的副段落；无 title 时是居中大标题堆叠
 *   - 传 children                  → 区块主体内容
 *   - 传 actions                   → 区块末尾的居中操作行
 * 都不传则是纯布局壳。
 */
export default function Section({
  id,
  titleLabel,
  title,
  titleLevel = 2,
  subtitle,
  description,
  actions,
  className,
  children,
}: Props) {
  // description 归一为数组，方便统一处理单段 / 多段
  const descriptionLines =
    description == null ? [] : Array.isArray(description) ? description : [description];
  // 无 title 且有 description → 「文本段」模式：居中大标题堆叠
  const isTextBlock = !title && descriptionLines.length > 0;

  return (
    <section
      id={id}
      className={clsx(
        "portfolio--page-section",
        isTextBlock && "portfolio--page-section--text-block",
        className,
      )}
    >
      {/* 标题块：title 存在时内联渲染（含 label / 主标题 / subtitle） */}
      {title && (
        <div className="portfolio--page-section__title">
          <div className="portfolio--page-section__title-main">
            {titleLabel && <Text variant="label">{titleLabel}</Text>}
            <Heading level={titleLevel}>{title}</Heading>
          </div>
          {subtitle && (
            <Text variant="muted" as="p">
              {subtitle}
            </Text>
          )}
        </div>
      )}

      {/* description：有 title 时是标题块下方的普通副段落（多段则段内紧凑堆叠） */}
      {title && descriptionLines.length > 0 && (
        <div className="portfolio--page-section__description">
          {descriptionLines.map((line) => (
            <Text key={line} as="p">
              {line}
            </Text>
          ))}
        </div>
      )}

      {/* description：无 title 时是居中、加大的标题堆叠（文本段模式） */}
      {isTextBlock &&
        descriptionLines.map((line) => (
          <Heading key={line} level={1}>
            {line}
          </Heading>
        ))}

      {children}

      {/* 操作行：居中排布的按钮组等。数组形式自动补 key，免去调用方手写 */}
      {actions && (
        <div className="portfolio--page-section__actions">
          {Array.isArray(actions)
            ? actions.map((action, i) => <Fragment key={i}>{action}</Fragment>)
            : actions}
        </div>
      )}
    </section>
  );
}
