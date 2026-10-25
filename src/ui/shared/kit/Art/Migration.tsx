import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const MIGRATION_SERVICES = [250, 560];

const MIGRATION_BFF = { x: 640, y: 350, width: 320, height: 300 };

const MIGRATION_APP = { x: 1180, y: 220, width: 300, height: 560 };

function MigrationLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      className="ui-art__type"
      x={x}
      y={y}
      fontSize="22"
      fontWeight="500"
      letterSpacing="6"
      opacity="0.55"
    >
      {text}
    </text>
  );
}

function MigrationService({ y }: { y: number }) {
  return (
    <g>
      <rect className="ui-art__ink" x="120" y={y} width="300" height="190" rx="20" opacity="0.06" />
      <rect
        className="ui-art__stroke-ink"
        x="120"
        y={y}
        width="300"
        height="190"
        rx="20"
        strokeWidth="2"
        opacity="0.18"
      />
      <MigrationLabel x={152} y={y + 46} text="API" />
      {[180, 120, 150].map((width, i) => (
        <rect
          key={width}
          className="ui-art__ink"
          x="152"
          y={y + 78 + i * 30}
          width={width}
          height="12"
          rx="6"
          opacity="0.3"
        />
      ))}
    </g>
  );
}

export function Migration() {
  const id = useSvgId();
  const bffMiddle = MIGRATION_BFF.y + MIGRATION_BFF.height / 2;
  const appMiddle = MIGRATION_APP.y + MIGRATION_APP.height / 2;
  return (
    <Frame id={id}>
      {MIGRATION_SERVICES.map((y) => (
        <g key={y}>
          <MigrationService y={y} />
          <path
            className="ui-art__stroke-ink"
            d={`M420 ${y + 95} C530 ${y + 95} 530 ${bffMiddle} ${MIGRATION_BFF.x} ${bffMiddle}`}
            strokeWidth="3"
            opacity="0.35"
          />
        </g>
      ))}
      <rect
        className="ui-art__primary"
        x={MIGRATION_BFF.x}
        y={MIGRATION_BFF.y}
        width={MIGRATION_BFF.width}
        height={MIGRATION_BFF.height}
        rx="24"
        opacity="0.12"
      />
      <rect
        className="ui-art__stroke-primary"
        x={MIGRATION_BFF.x}
        y={MIGRATION_BFF.y}
        width={MIGRATION_BFF.width}
        height={MIGRATION_BFF.height}
        rx="24"
        strokeWidth="2"
        opacity="0.8"
      />
      <MigrationLabel x={MIGRATION_BFF.x + 36} y={MIGRATION_BFF.y + 50} text="BFF" />
      {[200, 240, 160].map((width, i) => (
        <rect
          key={width}
          className="ui-art__primary"
          x={MIGRATION_BFF.x + 36}
          y={MIGRATION_BFF.y + 100 + i * 44}
          width={width}
          height="14"
          rx="7"
          opacity={i === 1 ? 0.9 : 0.4}
        />
      ))}
      <path
        className="ui-art__stroke-primary"
        d={`M${MIGRATION_BFF.x + MIGRATION_BFF.width} ${bffMiddle} C1070 ${bffMiddle} 1070 ${appMiddle} ${MIGRATION_APP.x} ${appMiddle}`}
        strokeWidth="5"
      />
      <circle className="ui-art__primary" cx={MIGRATION_APP.x} cy={appMiddle} r="9" />
      <rect
        className="ui-art__ink"
        x={MIGRATION_APP.x}
        y={MIGRATION_APP.y}
        width={MIGRATION_APP.width}
        height={MIGRATION_APP.height}
        rx="24"
        opacity="0.06"
      />
      <rect
        className="ui-art__stroke-ink"
        x={MIGRATION_APP.x}
        y={MIGRATION_APP.y}
        width={MIGRATION_APP.width}
        height={MIGRATION_APP.height}
        rx="24"
        strokeWidth="2"
        opacity="0.18"
      />
      <MigrationLabel x={MIGRATION_APP.x + 36} y={MIGRATION_APP.y + 50} text="APP" />
      <rect
        className="ui-art__ink"
        x={MIGRATION_APP.x + 36}
        y={MIGRATION_APP.y + 84}
        width="228"
        height="120"
        rx="14"
        opacity="0.1"
      />
      {[200, 150, 180, 120, 170].map((width, i) => (
        <rect
          key={width}
          className="ui-art__ink"
          x={MIGRATION_APP.x + 36}
          y={MIGRATION_APP.y + 236 + i * 44}
          width={width}
          height="14"
          rx="7"
          opacity={i === 0 ? 0.5 : 0.25}
        />
      ))}
      <rect
        className="ui-art__primary"
        x={MIGRATION_APP.x + 36}
        y={MIGRATION_APP.y + 480}
        width="120"
        height="40"
        rx="10"
        opacity="0.85"
      />
    </Frame>
  );
}
