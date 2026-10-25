import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const UI_PACKAGE_COLUMNS = [160, 610, 1060];

const UI_PACKAGE_WIDTH = 380;

const UI_PACKAGE_TOP = 230;

const UI_PACKAGE_BOTTOM = 600;

const UI_PACKAGE_ROW = 720;

const UI_PACKAGE_OPTIONS = [150, 190, 130, 170];

function UIPackageCard({ x, y, height }: { x: number; y: number; height: number }) {
  return (
    <>
      <rect
        className="ui-art__ink"
        x={x}
        y={y}
        width={UI_PACKAGE_WIDTH}
        height={height}
        rx="18"
        opacity="0.05"
      />
      <rect
        className="ui-art__stroke-ink"
        x={x}
        y={y}
        width={UI_PACKAGE_WIDTH}
        height={height}
        rx="18"
        strokeWidth="2"
        opacity="0.14"
      />
    </>
  );
}

export function UIPackage() {
  const id = useSvgId();
  const [select, form, modal] = UI_PACKAGE_COLUMNS;
  return (
    <Frame id={id}>
      <rect
        className="ui-art__stroke-primary"
        x={select}
        y={UI_PACKAGE_TOP}
        width={UI_PACKAGE_WIDTH}
        height="68"
        rx="14"
        strokeWidth="2"
      />
      <rect
        className="ui-art__ink"
        x={select + 30}
        y={UI_PACKAGE_TOP + 28}
        width="170"
        height="12"
        rx="6"
        opacity="0.8"
      />
      <path
        className="ui-art__stroke-ink"
        d={`M${select + 330} ${UI_PACKAGE_TOP + 28} l12 12 l12 -12`}
        strokeWidth="3"
        opacity="0.6"
      />
      <UIPackageCard
        x={select}
        y={UI_PACKAGE_TOP + 86}
        height={UI_PACKAGE_BOTTOM - UI_PACKAGE_TOP - 86}
      />
      {UI_PACKAGE_OPTIONS.map((width, i) => {
        const y = UI_PACKAGE_TOP + 104 + i * 68;
        return (
          <g key={i}>
            {i === 1 && (
              <rect
                className="ui-art__primary"
                x={select + 14}
                y={y}
                width={UI_PACKAGE_WIDTH - 28}
                height="56"
                rx="10"
                opacity="0.35"
              />
            )}
            <rect
              className="ui-art__ink"
              x={select + 36}
              y={y + 22}
              width={width}
              height="12"
              rx="6"
              opacity={i === 1 ? 0.9 : 0.4}
            />
            {i === 1 && (
              <path
                className="ui-art__stroke-ink"
                d={`M${select + 320} ${y + 28} l9 9 l17 -18`}
                strokeWidth="4"
                opacity="0.9"
              />
            )}
          </g>
        );
      })}
      <UIPackageCard x={form} y={UI_PACKAGE_TOP} height={UI_PACKAGE_BOTTOM - UI_PACKAGE_TOP} />
      <rect
        className="ui-art__ink"
        x={form + 40}
        y={UI_PACKAGE_TOP + 44}
        width="90"
        height="10"
        rx="5"
        opacity="0.45"
      />
      <rect
        className="ui-art__stroke-primary"
        x={form + 40}
        y={UI_PACKAGE_TOP + 70}
        width={UI_PACKAGE_WIDTH - 80}
        height="60"
        rx="12"
        strokeWidth="2"
      />
      <rect
        className="ui-art__ink"
        x={form + 64}
        y={UI_PACKAGE_TOP + 94}
        width="140"
        height="12"
        rx="6"
        opacity="0.8"
      />
      <rect
        className="ui-art__primary"
        x={form + 212}
        y={UI_PACKAGE_TOP + 88}
        width="3"
        height="24"
      />
      <rect
        className="ui-art__ink"
        x={form + 40}
        y={UI_PACKAGE_TOP + 170}
        width="70"
        height="10"
        rx="5"
        opacity="0.45"
      />
      <rect
        className="ui-art__ink"
        x={form + 40}
        y={UI_PACKAGE_TOP + 206}
        width={UI_PACKAGE_WIDTH - 80}
        height="8"
        rx="4"
        opacity="0.12"
      />
      <rect
        className="ui-art__primary"
        x={form + 40}
        y={UI_PACKAGE_TOP + 206}
        width="190"
        height="8"
        rx="4"
      />
      <circle className="ui-art__ink" cx={form + 230} cy={UI_PACKAGE_TOP + 210} r="16" />
      <rect
        className="ui-art__primary"
        x={form + 40}
        y={UI_PACKAGE_BOTTOM - 100}
        width={UI_PACKAGE_WIDTH - 80}
        height="56"
        rx="14"
        opacity="0.85"
      />
      <rect
        className="ui-art__ink"
        x={form + UI_PACKAGE_WIDTH / 2 - 40}
        y={UI_PACKAGE_BOTTOM - 78}
        width="80"
        height="12"
        rx="6"
        opacity="0.9"
      />
      <UIPackageCard x={modal} y={UI_PACKAGE_TOP} height={UI_PACKAGE_BOTTOM - UI_PACKAGE_TOP} />
      <rect
        className="ui-art__ink"
        x={modal + 40}
        y={UI_PACKAGE_TOP + 44}
        width="190"
        height="18"
        rx="9"
        opacity="0.85"
      />
      <path
        className="ui-art__stroke-ink"
        d={`M${modal + 322} ${UI_PACKAGE_TOP + 44} l18 18 M${modal + 340} ${UI_PACKAGE_TOP + 44} l-18 18`}
        strokeWidth="3"
        opacity="0.45"
      />
      {[290, 250, 180].map((width, i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x={modal + 40}
          y={UI_PACKAGE_TOP + 100 + i * 30}
          width={width}
          height="12"
          rx="6"
          opacity="0.35"
        />
      ))}
      <rect
        className="ui-art__stroke-ink"
        x={modal + 110}
        y={UI_PACKAGE_BOTTOM - 100}
        width="110"
        height="56"
        rx="14"
        strokeWidth="2"
        opacity="0.35"
      />
      <rect
        className="ui-art__ink"
        x={modal + 140}
        y={UI_PACKAGE_BOTTOM - 78}
        width="50"
        height="12"
        rx="6"
        opacity="0.6"
      />
      <rect
        className="ui-art__primary"
        x={modal + 236}
        y={UI_PACKAGE_BOTTOM - 100}
        width="104"
        height="56"
        rx="14"
        opacity="0.85"
      />
      <rect
        className="ui-art__ink"
        x={modal + 262}
        y={UI_PACKAGE_BOTTOM - 78}
        width="52"
        height="12"
        rx="6"
        opacity="0.9"
      />
      <rect
        className="ui-art__primary"
        x={select}
        y={UI_PACKAGE_ROW}
        width="96"
        height="52"
        rx="26"
        opacity="0.85"
      />
      <circle className="ui-art__ink" cx={select + 70} cy={UI_PACKAGE_ROW + 26} r="19" />
      <rect
        className="ui-art__ink"
        x={select + 128}
        y={UI_PACKAGE_ROW + 20}
        width="170"
        height="12"
        rx="6"
        opacity="0.45"
      />
      <rect
        className="ui-art__ink"
        x={form}
        y={UI_PACKAGE_ROW}
        width={UI_PACKAGE_WIDTH}
        height="52"
        rx="26"
        opacity="0.06"
      />
      <rect
        className="ui-art__primary"
        x={form + UI_PACKAGE_WIDTH / 3}
        y={UI_PACKAGE_ROW + 5}
        width={UI_PACKAGE_WIDTH / 3}
        height="42"
        rx="21"
        opacity="0.85"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x={form + (i + 0.5) * (UI_PACKAGE_WIDTH / 3) - 36}
          y={UI_PACKAGE_ROW + 20}
          width="72"
          height="12"
          rx="6"
          opacity={i === 1 ? 0.9 : 0.4}
        />
      ))}
      <rect
        className="ui-art__primary"
        x={modal}
        y={UI_PACKAGE_ROW + 4}
        width="44"
        height="44"
        rx="10"
        opacity="0.85"
      />
      <path
        className="ui-art__stroke-ink"
        d={`M${modal + 11} ${UI_PACKAGE_ROW + 26} l8 8 l15 -16`}
        strokeWidth="4"
        opacity="0.9"
      />
      <rect
        className="ui-art__ink"
        x={modal + 68}
        y={UI_PACKAGE_ROW + 20}
        width="160"
        height="12"
        rx="6"
        opacity="0.45"
      />
    </Frame>
  );
}
