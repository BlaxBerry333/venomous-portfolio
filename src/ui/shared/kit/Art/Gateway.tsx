import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

type GatewayPoint = [number, number];

const GATEWAY_HUB = { x: 800, y: 500, size: 200 };

const GATEWAY_SOURCES = [220, 360, 500, 640, 780];

const GATEWAY_TARGETS = [290, 430, 570, 710];

function gatewayPoint(from: GatewayPoint, to: GatewayPoint, t: number): GatewayPoint {
  const middle = (from[0] + to[0]) / 2;
  const u = 1 - t;
  return [
    u * u * u * from[0] + 3 * u * u * t * middle + 3 * u * t * t * middle + t * t * t * to[0],
    u * u * u * from[1] + 3 * u * u * t * from[1] + 3 * u * t * t * to[1] + t * t * t * to[1],
  ];
}

function gatewayCurve(from: GatewayPoint, to: GatewayPoint): string {
  const middle = (from[0] + to[0]) / 2;
  return `M${from[0]} ${from[1]} C${middle} ${from[1]} ${middle} ${to[1]} ${to[0]} ${to[1]}`;
}

function GatewayDatabase({ x, y, tone }: { x: number; y: number; tone: "tertiary" | "secondary" }) {
  const top = y - 36;
  const bottom = y + 36;
  const outline = `M${x - 44} ${top} L${x - 44} ${bottom} A44 13 0 0 0 ${x + 44} ${bottom} L${x + 44} ${top}`;
  return (
    <g>
      <path className="ui-art__ground" d={`${outline} A44 13 0 0 0 ${x - 44} ${top} Z`} />
      <path
        className={`ui-art__${tone}`}
        d={`${outline} A44 13 0 0 0 ${x - 44} ${top} Z`}
        opacity="0.14"
      />
      <path className={`ui-art__stroke-${tone}`} d={outline} strokeWidth="3" />
      <ellipse
        className={`ui-art__stroke-${tone}`}
        cx={x}
        cy={top}
        rx="44"
        ry="13"
        strokeWidth="3"
      />
      <path
        className={`ui-art__stroke-${tone}`}
        d={`M${x - 44} ${y} A44 13 0 0 0 ${x + 44} ${y}`}
        strokeWidth="2"
        opacity="0.55"
      />
    </g>
  );
}

export function Gateway() {
  const id = useSvgId();
  const half = GATEWAY_HUB.size / 2;
  const hubLeft: GatewayPoint = [GATEWAY_HUB.x - half, GATEWAY_HUB.y];
  const hubRight: GatewayPoint = [GATEWAY_HUB.x + half, GATEWAY_HUB.y];
  return (
    <Frame id={id}>
      {GATEWAY_SOURCES.map((y) => {
        const from: GatewayPoint = [264, y];
        return (
          <g key={y}>
            <path
              className="ui-art__stroke-tertiary"
              d={gatewayCurve(from, hubLeft)}
              strokeWidth="3"
              opacity="0.4"
            />
            {[0.3, 0.55, 0.8].map((t) => {
              const [cx, cy] = gatewayPoint(from, hubLeft, t);
              return (
                <circle
                  key={t}
                  className="ui-art__tertiary"
                  cx={cx}
                  cy={cy}
                  r={4 + t * 3}
                  opacity={0.4 + t * 0.5}
                />
              );
            })}
            <GatewayDatabase x={220} y={y} tone="tertiary" />
          </g>
        );
      })}
      {GATEWAY_TARGETS.map((y) => {
        const to: GatewayPoint = [1336, y];
        return (
          <g key={y}>
            <path
              className="ui-art__stroke-secondary"
              d={gatewayCurve(hubRight, to)}
              strokeWidth="3"
              opacity="0.45"
            />
            {[0.25, 0.5, 0.75].map((t) => {
              const [cx, cy] = gatewayPoint(hubRight, to, t);
              return (
                <circle
                  key={t}
                  className="ui-art__secondary"
                  cx={cx}
                  cy={cy}
                  r={7 - t * 3}
                  opacity={0.9 - t * 0.5}
                />
              );
            })}
            <GatewayDatabase x={1380} y={y} tone="secondary" />
          </g>
        );
      })}
      <rect
        className="ui-art__primary"
        x={GATEWAY_HUB.x - half}
        y={GATEWAY_HUB.y - half}
        width={GATEWAY_HUB.size}
        height={GATEWAY_HUB.size}
        rx="40"
        opacity="0.3"
      />
      <rect
        className="ui-art__stroke-secondary"
        x={GATEWAY_HUB.x - half}
        y={GATEWAY_HUB.y - half}
        width={GATEWAY_HUB.size}
        height={GATEWAY_HUB.size}
        rx="40"
        strokeWidth="3"
      />
      <rect
        className="ui-art__secondary"
        x={GATEWAY_HUB.x - 38}
        y={GATEWAY_HUB.y - 38}
        width="76"
        height="76"
        rx="18"
      />
      <rect
        className="ui-art__ground"
        x={GATEWAY_HUB.x - 18}
        y={GATEWAY_HUB.y - 18}
        width="36"
        height="36"
        rx="8"
        opacity="0.85"
      />
    </Frame>
  );
}
