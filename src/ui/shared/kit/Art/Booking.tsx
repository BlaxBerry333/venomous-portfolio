import * as Utils from "@/utils";
import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const BOOKING_HOURS = 10;

const BOOKING_LANES = 6;

const BOOKING_LANE = 110;

const BOOKING_LEFT = 440;

const BOOKING_TOP = 230;

const BOOKING_COLUMN = 104;

const BOOKING_NOW = 5.4;

const BOOKING_SLOTS = [
  { lane: 0, hour: 1, span: 3 },
  { lane: 0, hour: 6, span: 2 },
  { lane: 1, hour: 0, span: 2 },
  { lane: 1, hour: 4, span: 4, active: true },
  { lane: 2, hour: 2, span: 3 },
  { lane: 2, hour: 7, span: 2 },
  { lane: 3, hour: 1, span: 2 },
  { lane: 3, hour: 5, span: 3 },
  { lane: 4, hour: 0, span: 3 },
  { lane: 4, hour: 6, span: 3, active: true },
  { lane: 5, hour: 2, span: 4 },
];

export function Booking() {
  const id = useSvgId();
  const bottom = BOOKING_TOP + BOOKING_LANES * BOOKING_LANE;
  return (
    <Frame id={id}>
      <rect className="ui-art__ink" x="120" y="96" width="220" height="16" rx="8" opacity="0.6" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className={i === 0 ? "ui-art__primary" : "ui-art__ink"}
          x={BOOKING_LEFT + i * 116}
          y="84"
          width="100"
          height="40"
          rx="20"
          opacity={i === 0 ? 0.85 : 0.07}
        />
      ))}
      {Array.from({ length: BOOKING_HOURS + 1 }, (_, hour) => (
        <g key={hour}>
          <path
            className="ui-art__stroke-ink"
            d={`M${BOOKING_LEFT + hour * BOOKING_COLUMN} ${BOOKING_TOP} L${BOOKING_LEFT + hour * BOOKING_COLUMN} ${bottom}`}
            strokeWidth="1"
            opacity="0.05"
          />
          {hour < BOOKING_HOURS && (
            <rect
              className="ui-art__ink"
              x={BOOKING_LEFT + hour * BOOKING_COLUMN + 36}
              y={BOOKING_TOP - 46}
              width="32"
              height="10"
              rx="5"
              opacity="0.25"
            />
          )}
        </g>
      ))}
      {Array.from({ length: BOOKING_LANES }, (_, lane) => {
        const y = BOOKING_TOP + lane * BOOKING_LANE;
        return (
          <g key={lane}>
            <path
              className="ui-art__stroke-ink"
              d={`M120 ${y + BOOKING_LANE} L${BOOKING_LEFT + BOOKING_HOURS * BOOKING_COLUMN} ${y + BOOKING_LANE}`}
              strokeWidth="1"
              opacity="0.06"
            />
            <circle
              className="ui-art__ink"
              cx="144"
              cy={y + BOOKING_LANE / 2}
              r="22"
              opacity="0.1"
            />
            <rect
              className="ui-art__ink"
              x="184"
              y={y + BOOKING_LANE / 2 - 7}
              width={110 + Utils.hash(lane + 30) * 90}
              height="14"
              rx="7"
              opacity="0.5"
            />
          </g>
        );
      })}
      {BOOKING_SLOTS.map((slot, i) => {
        const x = BOOKING_LEFT + slot.hour * BOOKING_COLUMN + 6;
        const y = BOOKING_TOP + slot.lane * BOOKING_LANE + 18;
        const width = slot.span * BOOKING_COLUMN - 12;
        return (
          <g key={i}>
            <rect
              className={slot.active ? "ui-art__primary" : "ui-art__ink"}
              x={x}
              y={y}
              width={width}
              height={BOOKING_LANE - 36}
              rx="12"
              opacity={slot.active ? 0.4 : 0.07}
            />
            <rect
              className={slot.active ? "ui-art__primary" : "ui-art__ink"}
              x={x}
              y={y}
              width="6"
              height={BOOKING_LANE - 36}
              rx="3"
              opacity={slot.active ? 1 : 0.3}
            />
            <rect
              className="ui-art__ink"
              x={x + 26}
              y={y + 20}
              width={Math.min(width - 52, 150)}
              height="12"
              rx="6"
              opacity={slot.active ? 0.85 : 0.4}
            />
            <rect
              className="ui-art__ink"
              x={x + 26}
              y={y + 44}
              width={Math.min(width - 52, 80)}
              height="10"
              rx="5"
              opacity={slot.active ? 0.5 : 0.2}
            />
          </g>
        );
      })}
      <path
        className="ui-art__stroke-primary"
        d={`M${BOOKING_LEFT + BOOKING_NOW * BOOKING_COLUMN} ${BOOKING_TOP - 20} L${BOOKING_LEFT + BOOKING_NOW * BOOKING_COLUMN} ${bottom}`}
        strokeWidth="3"
      />
      <circle
        className="ui-art__primary"
        cx={BOOKING_LEFT + BOOKING_NOW * BOOKING_COLUMN}
        cy={BOOKING_TOP - 20}
        r="9"
      />
    </Frame>
  );
}
