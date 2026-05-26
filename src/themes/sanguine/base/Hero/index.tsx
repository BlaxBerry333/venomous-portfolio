import Heading from "../Heading";
import "./index.scss";

interface Props {
  /** hero 主名（如 "CHEN"）—— 渲染为标题的 accent 部分。 */
  title: string;
}

/**
 * sanguine 首页 hero —— 占屏居中，双行大字标题。
 * "PORTFOLIO" 是主题固定文案，仅 title 由调用方传入。
 */
export default function Hero({ title }: Props) {
  return (
    <section className="portfolio--sanguine-hero">
      <h1 className="portfolio--sanguine-hero__headline">
        <Heading level={1} as="span" text="PORTFOLIO" />
        <Heading level={1} as="span" text={`{${title}}.`} />
      </h1>
    </section>
  );
}
