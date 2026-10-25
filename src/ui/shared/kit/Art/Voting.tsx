import * as Utils from "@/utils";
import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const VOTING_LEFT = 140;

const VOTING_TOP = 150;

const VOTING_CARD = 232;

const VOTING_GAP = 40;

const VOTING_HEIGHT = 440;

const VOTING_SHARES = [0.86, 0.71, 0.58, 0.44, 0.33];

const VOTING_BINS = 66;

const VOTING_STEP = 20;

const VOTING_FLOOR = 880;

const VOTING_PEAK = 44;

const VOTING_TRAFFIC = Array.from({ length: VOTING_BINS }, (_, i) => {
  const distance = (i - VOTING_PEAK) / 5;
  return {
    height: 14 + Utils.hash(i + 70) * 22 + 120 * Math.exp(-distance * distance),
    peak: Math.abs(i - VOTING_PEAK) <= 5,
  };
});

export function Voting() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      {VOTING_SHARES.map((share, i) => {
        const x = VOTING_LEFT + i * (VOTING_CARD + VOTING_GAP);
        const y = VOTING_TOP;
        const center = x + VOTING_CARD / 2;
        const leader = i === 0;
        return (
          <g key={i}>
            <rect
              className="ui-art__ground"
              x={x}
              y={y}
              width={VOTING_CARD}
              height={VOTING_HEIGHT}
              rx="24"
            />
            <rect
              className="ui-art__ink"
              x={x}
              y={y}
              width={VOTING_CARD}
              height={VOTING_HEIGHT}
              rx="24"
              opacity="0.05"
            />
            <rect
              className={leader ? "ui-art__stroke-primary" : "ui-art__stroke-ink"}
              x={x}
              y={y}
              width={VOTING_CARD}
              height={VOTING_HEIGHT}
              rx="24"
              strokeWidth={leader ? 3 : 2}
              opacity={leader ? 0.9 : 0.16}
            />
            <rect
              x={x + 16}
              y={y + 16}
              width={VOTING_CARD - 32}
              height="280"
              rx="16"
              fill={`url(#${id}-${leader ? "primary" : "secondary"})`}
              opacity={leader ? 0.9 : 0.45}
            />
            <circle className="ui-art__ink" cx={center} cy={y + 124} r="42" opacity="0.18" />
            <path
              className="ui-art__ink"
              d={`M${center - 86} ${y + 296} Q${center - 80} ${y + 190} ${center} ${y + 190} Q${center + 80} ${y + 190} ${center + 86} ${y + 296} Z`}
              opacity="0.14"
            />
            <circle
              className={leader ? "ui-art__primary" : "ui-art__ink"}
              cx={x + 44}
              cy={y + 44}
              r="16"
              opacity={leader ? 0.95 : 0.22}
            />
            <rect
              className="ui-art__ink"
              x={x + 24}
              y={y + 326}
              width={110 + Utils.hash(i + 40) * 60}
              height="16"
              rx="8"
              opacity="0.8"
            />
            <rect
              className="ui-art__ink"
              x={x + 24}
              y={y + 356}
              width="72"
              height="10"
              rx="5"
              opacity="0.35"
            />
            <rect
              className="ui-art__ink"
              x={x + 24}
              y={y + 396}
              width={VOTING_CARD - 48}
              height="12"
              rx="6"
              opacity="0.08"
            />
            <rect
              className={leader ? "ui-art__primary" : "ui-art__ink"}
              x={x + 24}
              y={y + 396}
              width={(VOTING_CARD - 48) * share}
              height="12"
              rx="6"
              opacity={leader ? 0.95 : 0.45}
            />
          </g>
        );
      })}
      <circle className="ui-art__primary" cx={VOTING_LEFT + 7} cy="697" r="7" opacity="0.9" />
      <rect
        className="ui-art__ink"
        x={VOTING_LEFT + 26}
        y="690"
        width="150"
        height="14"
        rx="7"
        opacity="0.5"
      />
      {VOTING_TRAFFIC.map((bin, i) => (
        <rect
          key={i}
          className={bin.peak ? "ui-art__primary" : "ui-art__ink"}
          x={VOTING_LEFT + i * VOTING_STEP}
          y={VOTING_FLOOR - bin.height}
          width="10"
          height={bin.height}
          rx="5"
          opacity={bin.peak ? 0.75 : 0.18}
        />
      ))}
    </Frame>
  );
}
