import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const MOBILE_PHONES = [
  { x: 220, y: 200 },
  { x: 640, y: 140 },
  { x: 1060, y: 200 },
];

const MOBILE_TILES = [
  "ui-art__primary",
  "ui-art__secondary",
  "ui-art__tertiary",
  "ui-art__secondary",
  "ui-art__tertiary",
  "ui-art__primary",
];

export function Mobile() {
  const id = useSvgId();
  const [left, middle, right] = MOBILE_PHONES;
  return (
    <Frame id={id}>
      {MOBILE_PHONES.map((phone) => (
        <g key={phone.x}>
          <rect
            className="ui-art__ground"
            x={phone.x}
            y={phone.y}
            width="320"
            height="680"
            rx="48"
          />
          <rect
            className="ui-art__ink"
            x={phone.x}
            y={phone.y}
            width="320"
            height="680"
            rx="48"
            opacity="0.06"
          />
          <rect
            className="ui-art__stroke-ink"
            x={phone.x}
            y={phone.y}
            width="320"
            height="680"
            rx="48"
            strokeWidth="3"
            opacity="0.22"
          />
          <rect
            className="ui-art__ink"
            x={phone.x + 120}
            y={phone.y + 20}
            width="80"
            height="10"
            rx="5"
            opacity="0.3"
          />
        </g>
      ))}
      <rect
        x={left.x + 30}
        y={left.y + 70}
        width="260"
        height="160"
        rx="22"
        fill={`url(#${id}-secondary)`}
      />
      <rect
        className="ui-art__ink"
        x={left.x + 54}
        y={left.y + 100}
        width="120"
        height="14"
        rx="7"
        opacity="0.85"
      />
      <rect
        className="ui-art__ink"
        x={left.x + 54}
        y={left.y + 128}
        width="80"
        height="12"
        rx="6"
        opacity="0.5"
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle
            className={i % 2 === 0 ? "ui-art__tertiary" : "ui-art__primary"}
            cx={left.x + 58}
            cy={left.y + 290 + i * 88}
            r="24"
          />
          <rect
            className="ui-art__ink"
            x={left.x + 98}
            y={left.y + 276 + i * 88}
            width="150"
            height="12"
            rx="6"
            opacity="0.7"
          />
          <rect
            className="ui-art__ink"
            x={left.x + 98}
            y={left.y + 298 + i * 88}
            width="100"
            height="10"
            rx="5"
            opacity="0.3"
          />
        </g>
      ))}
      <circle
        className="ui-art__stroke-ink"
        cx={middle.x + 160}
        cy={middle.y + 230}
        r="100"
        strokeWidth="18"
        opacity="0.1"
      />
      <circle
        className="ui-art__stroke-tertiary"
        cx={middle.x + 160}
        cy={middle.y + 230}
        r="100"
        strokeWidth="18"
        strokeDasharray="440 628"
        transform={`rotate(-90 ${middle.x + 160} ${middle.y + 230})`}
      />
      <circle
        className="ui-art__stroke-secondary"
        cx={middle.x + 160}
        cy={middle.y + 230}
        r="72"
        strokeWidth="14"
        strokeDasharray="250 452"
        transform={`rotate(-90 ${middle.x + 160} ${middle.y + 230})`}
      />
      <rect
        className="ui-art__ink"
        x={middle.x + 110}
        y={middle.y + 220}
        width="100"
        height="20"
        rx="10"
        opacity="0.85"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x={middle.x + 40}
          y={middle.y + 380 + i * 60}
          width="240"
          height="40"
          rx="12"
          opacity="0.08"
        />
      ))}
      <rect
        className="ui-art__ink"
        x={middle.x}
        y={middle.y + 600}
        width="320"
        height="80"
        rx="0"
        opacity="0.05"
      />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          className={i === 0 ? "ui-art__secondary" : "ui-art__ink"}
          cx={middle.x + 70 + i * 60}
          cy={middle.y + 640}
          r="10"
          opacity={i === 0 ? 1 : 0.3}
        />
      ))}
      {MOBILE_TILES.map((tile, i) => (
        <rect
          key={i}
          className={tile}
          x={right.x + 30 + (i % 2) * 135}
          y={right.y + 70 + Math.floor(i / 2) * 190}
          width="125"
          height="170"
          rx="20"
          opacity={0.35 + (i % 3) * 0.2}
        />
      ))}
    </Frame>
  );
}
