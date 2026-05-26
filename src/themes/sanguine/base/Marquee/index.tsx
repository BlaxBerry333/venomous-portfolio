import "./index.scss";

type MarqueeProps = {
  items: string[];
  duration?: number;
  reverse?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Marquee({
  items,
  duration = 30,
  reverse = false,
  size = "lg",
}: MarqueeProps) {
  return (
    <div
      className={`portfolio--sanguine-marquee portfolio--sanguine-marquee--${size}`}
      aria-hidden="true"
    >
      <div
        className={`portfolio--sanguine-marquee__track ${reverse ? "is-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="portfolio--sanguine-marquee__unit">
            <span className="portfolio--sanguine-marquee__item">{item}</span>
            <span className="portfolio--sanguine-marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}
