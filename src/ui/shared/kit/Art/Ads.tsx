import * as Utils from "@/utils";
import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const ADS_KPIS = [
  { fill: "ui-art__secondary", stroke: "ui-art__stroke-secondary" },
  { fill: "ui-art__tertiary", stroke: "ui-art__stroke-tertiary" },
  { fill: "ui-art__primary", stroke: "ui-art__stroke-primary" },
  { fill: "ui-art__secondary", stroke: "ui-art__stroke-secondary" },
];

const ADS_REVENUE =
  "M110 520 L210 470 L310 490 L410 420 L510 440 L610 360 L710 380 L810 300 L870 320";

const ADS_SPEND =
  "M110 560 L210 545 L310 530 L410 535 L510 505 L610 500 L710 470 L810 465 L870 450";

const ADS_RANKING = [0.92, 0.78, 0.66, 0.5, 0.38];

const ADS_ROWS = Array.from({ length: 5 }, (_, row) => ({
  y: 720 + row * 52,
  spark: Array.from(
    { length: 8 },
    (_, i) =>
      `${i === 0 ? "M" : "L"}${1300 + i * 26} ${740 + row * 52 - Utils.hash(row * 8 + i) * 24}`,
  ).join(" "),
}));

export function Ads() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <g transform="translate(0 -40)">
        {ADS_KPIS.map((kpi, i) => (
          <g key={i}>
            <rect
              className="ui-art__ink"
              x={60 + i * 375}
              y="110"
              width="345"
              height="150"
              rx="18"
              opacity="0.06"
            />
            <rect
              className="ui-art__ink"
              x={88 + i * 375}
              y="138"
              width="110"
              height="10"
              rx="5"
              opacity="0.45"
            />
            <rect
              className={kpi.fill}
              x={88 + i * 375}
              y="168"
              width={140 + (i % 2) * 40}
              height="40"
              rx="8"
            />
            <path
              className={kpi.stroke}
              d={`M${250 + i * 375} 228 l20 -16 l20 8 l20 -22 l20 6 l20 -18`}
              strokeWidth="4"
            />
          </g>
        ))}
        <rect
          className="ui-art__ink"
          x="60"
          y="290"
          width="860"
          height="380"
          rx="18"
          opacity="0.05"
        />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            className="ui-art__stroke-ink"
            d={`M110 ${350 + i * 70} L870 ${350 + i * 70}`}
            strokeWidth="1"
            opacity="0.08"
          />
        ))}
        <path d={`${ADS_REVENUE} L870 620 L110 620 Z`} fill={`url(#${id}-primary)`} />
        <path className="ui-art__stroke-primary" d={ADS_REVENUE} strokeWidth="5" />
        <path
          className="ui-art__stroke-tertiary"
          d={ADS_SPEND}
          strokeWidth="4"
          strokeDasharray="12 10"
        />
        <rect
          className="ui-art__ink"
          x="950"
          y="290"
          width="590"
          height="380"
          rx="18"
          opacity="0.05"
        />
        {ADS_RANKING.map((share, i) => (
          <g key={i}>
            <rect
              className="ui-art__ink"
              x="980"
              y={330 + i * 64}
              width="120"
              height="12"
              rx="6"
              opacity="0.5"
            />
            <rect
              className="ui-art__ink"
              x="1120"
              y={326 + i * 64}
              width="380"
              height="20"
              rx="10"
              opacity="0.06"
            />
            <rect
              className={i === 0 ? "ui-art__secondary" : "ui-art__primary"}
              x="1120"
              y={326 + i * 64}
              width={380 * share}
              height="20"
              rx="10"
              opacity={i === 0 ? 1 : 0.7}
            />
          </g>
        ))}
        <rect
          className="ui-art__ink"
          x="60"
          y="700"
          width="1480"
          height="270"
          rx="18"
          opacity="0.05"
        />
        {ADS_ROWS.map((row, i) => (
          <g key={i}>
            <circle
              className={i === 2 ? "ui-art__secondary" : "ui-art__tertiary"}
              cx="100"
              cy={row.y + 18}
              r="7"
            />
            <rect
              className="ui-art__ink"
              x="124"
              y={row.y + 12}
              width={180 + Utils.hash(i + 70) * 120}
              height="12"
              rx="6"
              opacity="0.7"
            />
            <rect
              className="ui-art__ink"
              x="560"
              y={row.y + 12}
              width="90"
              height="12"
              rx="6"
              opacity="0.35"
            />
            <rect
              className="ui-art__ink"
              x="760"
              y={row.y + 12}
              width="110"
              height="12"
              rx="6"
              opacity="0.35"
            />
            <rect
              className="ui-art__ink"
              x="980"
              y={row.y + 12}
              width="80"
              height="12"
              rx="6"
              opacity="0.35"
            />
            <path
              className="ui-art__stroke-secondary"
              d={row.spark}
              strokeWidth="3"
              opacity="0.8"
            />
          </g>
        ))}
      </g>
    </Frame>
  );
}
