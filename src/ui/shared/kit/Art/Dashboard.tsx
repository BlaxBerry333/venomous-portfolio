import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const DASHBOARD_MENU = [150, 120, 140, 100, 130];

const DASHBOARD_AREA_TOP =
  "M330 760 L420 690 L510 720 L600 610 L690 640 L780 520 L870 560 L960 450 L1060 480";

const DASHBOARD_AREA_LOW =
  "M330 800 L420 780 L510 740 L600 760 L690 700 L780 720 L870 660 L960 680 L1060 610";

export function Dashboard() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <rect className="ui-art__ink" width="1600" height="84" opacity="0.05" />
      <circle className="ui-art__tertiary" cx="64" cy="42" r="16" />
      <rect className="ui-art__ink" x="100" y="34" width="160" height="16" rx="8" opacity="0.8" />
      <rect
        className="ui-art__ink"
        x="1180"
        y="30"
        width="120"
        height="24"
        rx="12"
        opacity="0.12"
      />
      <rect
        className="ui-art__ink"
        x="1320"
        y="30"
        width="120"
        height="24"
        rx="12"
        opacity="0.12"
      />
      <rect className="ui-art__secondary" x="1460" y="26" width="100" height="32" rx="16" />
      <rect className="ui-art__ink" y="84" width="240" height="916" opacity="0.03" />
      {DASHBOARD_MENU.map((width, i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x="40"
          y={140 + i * 50}
          width={width}
          height="14"
          rx="7"
          opacity={i === 0 ? 0.75 : 0.32}
        />
      ))}
      <rect
        className="ui-art__ink"
        x="300"
        y="130"
        width="380"
        height="170"
        rx="18"
        opacity="0.06"
      />
      <rect className="ui-art__ink" x="330" y="165" width="140" height="14" rx="7" opacity="0.5" />
      <rect className="ui-art__tertiary" x="330" y="205" width="220" height="48" rx="10" />
      <rect
        className="ui-art__ink"
        x="710"
        y="130"
        width="380"
        height="170"
        rx="18"
        opacity="0.06"
      />
      <rect className="ui-art__ink" x="740" y="165" width="140" height="14" rx="7" opacity="0.5" />
      <rect className="ui-art__secondary" x="740" y="205" width="180" height="48" rx="10" />
      <rect
        className="ui-art__ink"
        x="1120"
        y="130"
        width="420"
        height="380"
        rx="18"
        opacity="0.06"
      />
      <rect className="ui-art__ink" x="1160" y="170" width="140" height="14" rx="7" opacity="0.5" />
      <rect
        className="ui-art__ink"
        x="1160"
        y="214"
        width="240"
        height="56"
        rx="10"
        opacity="0.85"
      />
      <rect className="ui-art__secondary" x="1160" y="320" width="190" height="28" rx="6" />
      <rect className="ui-art__tertiary" x="1356" y="320" width="100" height="28" rx="6" />
      <rect className="ui-art__primary" x="1462" y="320" width="38" height="28" rx="6" />
      {["ui-art__secondary", "ui-art__tertiary", "ui-art__primary"].map((tone, i) => (
        <g key={tone}>
          <rect className={tone} x={1160 + i * 120} y="390" width="20" height="20" rx="5" />
          <rect
            className="ui-art__ink"
            x={1190 + i * 120}
            y="394"
            width="70"
            height="12"
            rx="6"
            opacity="0.4"
          />
        </g>
      ))}
      <rect
        className="ui-art__ink"
        x="300"
        y="330"
        width="790"
        height="540"
        rx="18"
        opacity="0.05"
      />
      <path d={`${DASHBOARD_AREA_TOP} L1060 840 L330 840 Z`} fill={`url(#${id}-primary)`} />
      <path className="ui-art__stroke-primary" d={DASHBOARD_AREA_TOP} strokeWidth="6" />
      <path d={`${DASHBOARD_AREA_LOW} L1060 840 L330 840 Z`} fill={`url(#${id}-tertiary)`} />
      <path className="ui-art__stroke-tertiary" d={DASHBOARD_AREA_LOW} strokeWidth="6" />
      <rect
        className="ui-art__ink"
        x="1120"
        y="540"
        width="420"
        height="330"
        rx="18"
        opacity="0.06"
      />
      <rect className="ui-art__ink" x="1160" y="590" width="300" height="18" rx="9" opacity="0.5" />
      <rect className="ui-art__ink" x="1160" y="640" width="240" height="18" rx="9" opacity="0.3" />
      <rect className="ui-art__ink" x="1160" y="690" width="280" height="18" rx="9" opacity="0.3" />
      <rect className="ui-art__primary" x="1160" y="770" width="160" height="56" rx="12" />
    </Frame>
  );
}
