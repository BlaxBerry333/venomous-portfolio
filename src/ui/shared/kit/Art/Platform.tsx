import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const PLATFORM_COLUMNS = [160, 600, 1040];

const PLATFORM_ROWS = [180, 520];

const PLATFORM_TILE = { width: 400, height: 300 };

const PLATFORM_ACTIVE = 2;

const PLATFORM_BARS = [70, 105, 80, 140, 115, 165, 130];

function PlatformProfile() {
  return (
    <g>
      <rect className="ui-art__ink" x="32" y="80" width="84" height="84" rx="20" opacity="0.14" />
      <rect className="ui-art__ink" x="140" y="92" width="180" height="16" rx="8" opacity="0.6" />
      <rect className="ui-art__ink" x="140" y="124" width="130" height="12" rx="6" opacity="0.3" />
      <rect className="ui-art__ink" x="140" y="148" width="100" height="12" rx="6" opacity="0.2" />
      {[
        [32, 84],
        [128, 104],
        [244, 72],
      ].map(([left, width]) => (
        <rect
          key={left}
          className="ui-art__ink"
          x={left}
          y="210"
          width={width}
          height="28"
          rx="14"
          opacity="0.1"
        />
      ))}
    </g>
  );
}

function PlatformSteps() {
  return (
    <g>
      <path className="ui-art__stroke-ink" d="M46 104 L46 228" strokeWidth="2" opacity="0.2" />
      {[190, 150, 210].map((width, i) => (
        <g key={width}>
          <rect
            className="ui-art__ink"
            x="32"
            y={80 + i * 62}
            width="28"
            height="28"
            rx="7"
            opacity="0.18"
          />
          <rect
            className="ui-art__ink"
            x="80"
            y={88 + i * 62}
            width={width}
            height="14"
            rx="7"
            opacity="0.35"
          />
          <rect
            className="ui-art__ink"
            x="318"
            y={82 + i * 62}
            width="50"
            height="24"
            rx="12"
            opacity="0.12"
          />
        </g>
      ))}
    </g>
  );
}

function PlatformChat() {
  return (
    <g>
      <rect className="ui-art__ink" x="32" y="80" width="220" height="48" rx="22" opacity="0.1" />
      <rect
        className="ui-art__primary"
        x="148"
        y="146"
        width="220"
        height="48"
        rx="22"
        opacity="0.85"
      />
      <rect className="ui-art__ink" x="32" y="212" width="170" height="44" rx="22" opacity="0.1" />
    </g>
  );
}

function PlatformSearch() {
  return (
    <g>
      <rect className="ui-art__ink" x="32" y="80" width="336" height="52" rx="26" opacity="0.08" />
      <rect
        className="ui-art__stroke-ink"
        x="32"
        y="80"
        width="336"
        height="52"
        rx="26"
        strokeWidth="2"
        opacity="0.25"
      />
      <rect className="ui-art__ink" x="60" y="99" width="110" height="14" rx="7" opacity="0.35" />
      {[280, 230, 250].map((width, i) => (
        <rect
          key={width}
          className="ui-art__ink"
          x="32"
          y={160 + i * 30}
          width={width}
          height="12"
          rx="6"
          opacity={i === 0 ? 0.3 : 0.2}
        />
      ))}
    </g>
  );
}

function PlatformRecommend() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            className="ui-art__ink"
            x={32 + i * 118}
            y="80"
            width="104"
            height="104"
            rx="14"
            opacity="0.1"
          />
          <rect
            className="ui-art__ink"
            x={32 + i * 118}
            y="200"
            width="80"
            height="12"
            rx="6"
            opacity="0.3"
          />
          <rect
            className="ui-art__ink"
            x={32 + i * 118}
            y="222"
            width="52"
            height="12"
            rx="6"
            opacity="0.2"
          />
        </g>
      ))}
    </g>
  );
}

function PlatformReport() {
  return (
    <g>
      <path className="ui-art__stroke-ink" d="M32 252 L368 252" strokeWidth="2" opacity="0.2" />
      {PLATFORM_BARS.map((height, i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x={38 + i * 48}
          y={244 - height}
          width="30"
          height={height}
          rx="7"
          opacity="0.22"
        />
      ))}
    </g>
  );
}

const PLATFORM_MODULES = [
  PlatformProfile,
  PlatformSteps,
  PlatformChat,
  PlatformSearch,
  PlatformRecommend,
  PlatformReport,
];

export function Platform() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <rect
        className="ui-art__ink"
        x="120"
        y="140"
        width="1360"
        height="720"
        rx="28"
        opacity="0.04"
      />
      {PLATFORM_MODULES.map((Module, i) => {
        const x = PLATFORM_COLUMNS[i % 3];
        const y = PLATFORM_ROWS[Math.floor(i / 3)];
        const active = i === PLATFORM_ACTIVE;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect
              className="ui-art__ink"
              width={PLATFORM_TILE.width}
              height={PLATFORM_TILE.height}
              rx="22"
              opacity={active ? 0.08 : 0.05}
            />
            <rect
              className={active ? "ui-art__stroke-primary" : "ui-art__stroke-ink"}
              width={PLATFORM_TILE.width}
              height={PLATFORM_TILE.height}
              rx="22"
              strokeWidth="2"
              opacity={active ? 0.7 : 0.08}
            />
            <rect
              className="ui-art__ink"
              x="32"
              y="32"
              width="110"
              height="14"
              rx="7"
              opacity="0.45"
            />
            <Module />
          </g>
        );
      })}
    </Frame>
  );
}
