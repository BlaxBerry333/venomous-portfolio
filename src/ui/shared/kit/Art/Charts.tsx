import * as Utils from "@/utils";
import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const CHARTS_DOT_TONES = ["ui-art__primary", "ui-art__secondary", "ui-art__tertiary"];

const CHARTS_DOTS = Array.from({ length: 64 }, (_, i) => {
  const u = Utils.hash(i);
  const v = Utils.hash(i + 97);
  return {
    x: 150 + u * 700,
    y: 820 - (u * 0.6 + v * 0.4) * 620,
    r: 6 + Utils.hash(i + 211) * 18,
    tone: CHARTS_DOT_TONES[i % 3],
  };
});

const CHARTS_BARS = Array.from({ length: 10 }, (_, i) => 0.3 + 0.7 * Utils.hash(i + 300));

const CHARTS_HEAT = Array.from({ length: 6 * 13 }, (_, i) => {
  const column = i % 13;
  const row = Math.floor(i / 13);
  return 0.08 + 0.85 * (0.5 + 0.5 * Math.sin(column * 0.55 + row * 0.9)) * Utils.hash(i + 500);
});

export function Charts() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <rect
        className="ui-art__ink"
        x="100"
        y="120"
        width="800"
        height="760"
        rx="20"
        opacity="0.05"
      />
      <path
        className="ui-art__stroke-ink"
        d="M150 160 L150 830 L860 830"
        strokeWidth="2"
        opacity="0.2"
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          className="ui-art__stroke-ink"
          d={`M150 ${300 + i * 130} L860 ${300 + i * 130}`}
          strokeWidth="1"
          opacity="0.07"
        />
      ))}
      <path
        className="ui-art__stroke-secondary"
        d="M160 800 C360 700 520 520 850 230"
        strokeWidth="4"
        opacity="0.55"
        strokeDasharray="14 12"
      />
      {CHARTS_DOTS.map((dot, i) => (
        <circle key={i} className={dot.tone} cx={dot.x} cy={dot.y} r={dot.r} opacity="0.7" />
      ))}
      <rect
        className="ui-art__ink"
        x="960"
        y="120"
        width="540"
        height="390"
        rx="20"
        opacity="0.05"
      />
      {CHARTS_BARS.map((bar, i) => (
        <rect
          key={i}
          x={1000 + i * 48}
          y={470 - bar * 300}
          width="30"
          height={bar * 300}
          rx="8"
          fill={`url(#${id}-${i % 3 === 0 ? "tertiary" : "secondary"})`}
        />
      ))}
      <rect
        className="ui-art__ink"
        x="960"
        y="550"
        width="540"
        height="330"
        rx="20"
        opacity="0.05"
      />
      {CHARTS_HEAT.map((level, i) => (
        <rect
          key={i}
          className="ui-art__tertiary"
          x={996 + (i % 13) * 37}
          y={590 + Math.floor(i / 13) * 44}
          width="31"
          height="38"
          rx="6"
          opacity={level}
        />
      ))}
    </Frame>
  );
}
