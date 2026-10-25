import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const DESIGN_SYSTEM_RAMPS = [
  "ui-art__primary",
  "ui-art__secondary",
  "ui-art__tertiary",
  "ui-art__ink",
];

const DESIGN_SYSTEM_STEPS = [1, 0.84, 0.68, 0.52, 0.38, 0.24, 0.12];

const DESIGN_SYSTEM_TYPE = [
  { size: 96, y: 250 },
  { size: 64, y: 360 },
  { size: 44, y: 440 },
  { size: 30, y: 500 },
];

const DESIGN_SYSTEM_SPACING = [8, 16, 24, 32, 48, 64, 96];

const DESIGN_SYSTEM_RADII = [0, 10, 20, 34, 48];

export function DesignSystem() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      {DESIGN_SYSTEM_RAMPS.map((ramp, row) =>
        DESIGN_SYSTEM_STEPS.map((step, i) => (
          <rect
            key={`${row}-${i}`}
            className={ramp}
            x={120 + i * 86}
            y={130 + row * 96}
            width="74"
            height="74"
            rx="14"
            opacity={step}
          />
        )),
      )}
      {DESIGN_SYSTEM_TYPE.map((type) => (
        <g key={type.size}>
          <text className="ui-art__type" x="900" y={type.y} fontSize={type.size} fontWeight="200">
            Aa
          </text>
          <rect
            className="ui-art__ink"
            x={900 + type.size * 1.45}
            y={type.y - type.size * 0.32}
            width={360 - type.size}
            height={Math.max(type.size * 0.16, 8)}
            rx="5"
            opacity={type.size > 60 ? 0.55 : 0.3}
          />
        </g>
      ))}
      {DESIGN_SYSTEM_SPACING.map((space, i) => (
        <g key={space}>
          <rect
            className="ui-art__ink"
            x="120"
            y={630 + i * 42}
            width="40"
            height="10"
            rx="5"
            opacity="0.35"
          />
          <rect
            className="ui-art__tertiary"
            x="180"
            y={626 + i * 42}
            width={space * 4}
            height="18"
            rx="4"
            opacity="0.75"
          />
        </g>
      ))}
      {DESIGN_SYSTEM_RADII.map((radius, i) => (
        <rect
          key={radius}
          className="ui-art__stroke-secondary"
          x={680 + i * 120}
          y="660"
          width="96"
          height="96"
          rx={radius}
          strokeWidth="3"
          opacity={0.45 + i * 0.12}
        />
      ))}
      {[0, 1, 2].map((level) => (
        <g key={level}>
          <rect
            className="ui-art__ground"
            x={1300 + level * 18}
            y={640 + level * 70 + 10 + level * 6}
            width="200"
            height="110"
            rx="16"
            opacity={0.5 + level * 0.15}
          />
          <rect
            className="ui-art__ink"
            x={1290 + level * 18}
            y={630 + level * 70}
            width="200"
            height="110"
            rx="16"
            opacity={0.06 + level * 0.04}
          />
          <rect
            className="ui-art__stroke-ink"
            x={1290 + level * 18}
            y={630 + level * 70}
            width="200"
            height="110"
            rx="16"
            strokeWidth="2"
            opacity="0.18"
          />
        </g>
      ))}
    </Frame>
  );
}
