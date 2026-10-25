import * as Utils from "@/utils";
import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const DIALOGUE_STREET = 760;

const DIALOGUE_ROOFS = ["spire", "gable", "flat", "chimney"] as const;

interface DialogueBuilding {
  x: number;
  width: number;
  top: number;
  roof: (typeof DIALOGUE_ROOFS)[number];
}

function dialogueBuildings(seed: number, low: number, high: number): DialogueBuilding[] {
  const buildings: DialogueBuilding[] = [];
  let x = -20;
  let n = 0;
  while (x < 1620) {
    const width = 90 + Utils.hash(seed + n) * 120;
    buildings.push({
      x,
      width,
      top: DIALOGUE_STREET - (low + Utils.hash(seed + n + 50) * (high - low)),
      roof: DIALOGUE_ROOFS[Math.floor(Utils.hash(seed + n + 100) * DIALOGUE_ROOFS.length)],
    });
    x += width;
    n += 1;
  }
  return buildings;
}

function dialogueSkyline(buildings: DialogueBuilding[]): string {
  const parts = [`M-20 ${DIALOGUE_STREET}`];
  for (const b of buildings) {
    const right = b.x + b.width;
    parts.push(`L${b.x} ${b.top}`);
    if (b.roof === "spire") parts.push(`L${b.x + b.width / 2} ${b.top - b.width * 1.3}`);
    if (b.roof === "gable") parts.push(`L${b.x + b.width / 2} ${b.top - b.width * 0.45}`);
    if (b.roof === "chimney") {
      parts.push(
        `L${right - 34} ${b.top} L${right - 34} ${b.top - 46} L${right - 14} ${b.top - 46} L${right - 14} ${b.top}`,
      );
    }
    parts.push(`L${right} ${b.top}`);
  }
  parts.push(`L1620 ${DIALOGUE_STREET} Z`);
  return parts.join(" ");
}

const DIALOGUE_FAR = dialogueBuildings(10, 300, 520);

const DIALOGUE_NEAR = dialogueBuildings(400, 150, 330);

const DIALOGUE_WINDOWS = DIALOGUE_NEAR.flatMap((b, i) =>
  Array.from({ length: 6 }, (_, k) => ({
    x: b.x + 18 + (k % 3) * ((b.width - 36) / 3),
    y: b.top + 30 + Math.floor(k / 3) * 56,
    lit: Utils.hash(i * 6 + k + 700) > 0.62,
    glow: 0.45 + Utils.hash(i * 6 + k + 900) * 0.5,
  })).filter((w) => w.lit && w.y < DIALOGUE_STREET - 30),
);

const DIALOGUE_RAIN = Array.from({ length: 120 }, (_, i) => ({
  x: Utils.hash(i) * 1700 - 50,
  y: Utils.hash(i + 300) * 1000 - 80,
  length: 40 + Utils.hash(i + 600) * 70,
}));

const DIALOGUE_FRONT_RAIN = Array.from({ length: 70 }, (_, i) => ({
  x: Utils.hash(i + 1200) * 1700 - 50,
  y: Utils.hash(i + 1500) * 1000 - 120,
  length: 90 + Utils.hash(i + 1800) * 110,
}));

function dialogueSilhouette(x: number, y: number, scale: number): string {
  const s = scale;
  const at = (dx: number, dy: number) => `${x + dx * s} ${y + dy * s}`;
  const r = 70 * s;
  return [
    `M${at(-140, 330)}`,
    `Q${at(-130, 116)} ${at(0, 116)}`,
    `Q${at(130, 116)} ${at(140, 330)}`,
    "Z",
    `M${at(-70, 54)}`,
    `A${r} ${r} 0 1 1 ${at(70, 54)}`,
    `A${r} ${r} 0 1 1 ${at(-70, 54)}`,
    "Z",
  ].join(" ");
}

const DIALOGUE_FIGURE = dialogueSilhouette(1250, 430, 2);

export function Dialogue() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <defs>
        <radialGradient id={`${id}-haze`}>
          <stop className="ui-art__stop-primary" offset="0" stopOpacity="0.4" />
          <stop className="ui-art__stop-primary" offset="0.5" stopOpacity="0.14" />
          <stop className="ui-art__stop-primary" offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className="ui-art__primary" d={dialogueSkyline(DIALOGUE_FAR)} opacity="0.18" />
      <path className="ui-art__ground" d={dialogueSkyline(DIALOGUE_NEAR)} />
      <path className="ui-art__ink" d={dialogueSkyline(DIALOGUE_NEAR)} opacity="0.03" />
      <ellipse cx="1250" cy="500" rx="440" ry="400" fill={`url(#${id}-haze)`} />
      {DIALOGUE_WINDOWS.map((w, i) => (
        <rect
          key={i}
          className="ui-art__secondary"
          x={w.x}
          y={w.y}
          width="12"
          height="20"
          rx="2"
          opacity={w.glow}
        />
      ))}
      {DIALOGUE_RAIN.map((drop, i) => (
        <path
          key={i}
          className="ui-art__stroke-ink"
          d={`M${drop.x} ${drop.y} l-12 ${drop.length}`}
          strokeWidth="2"
          opacity={0.07 + (i % 4) * 0.035}
        />
      ))}
      <path
        className="ui-art__primary"
        d={DIALOGUE_FIGURE}
        transform="translate(-9 -10)"
        opacity="0.3"
      />
      <path className="ui-art__primary" d={DIALOGUE_FIGURE} transform="translate(-4 -5)" />
      <path className="ui-art__ground" d={DIALOGUE_FIGURE} />
      <path d={DIALOGUE_FIGURE} fill={`url(#${id}-secondary)`} opacity="0.1" />
      {DIALOGUE_FRONT_RAIN.map((drop, i) => (
        <path
          key={i}
          className="ui-art__stroke-ink"
          d={`M${drop.x} ${drop.y} l-18 ${drop.length}`}
          strokeWidth="2.5"
          opacity={0.06 + (i % 3) * 0.04}
        />
      ))}
      <rect
        className="ui-art__ground"
        x="310"
        y="740"
        width="980"
        height="220"
        rx="10"
        opacity="0.92"
      />
      <rect
        className="ui-art__stroke-ink"
        x="310"
        y="740"
        width="980"
        height="220"
        rx="10"
        strokeWidth="2"
        opacity="0.2"
      />
      <rect
        className="ui-art__primary"
        x="346"
        y="768"
        width="176"
        height="40"
        rx="6"
        opacity="0.55"
      />
      {[820, 760, 800, 460].map((width, i) => (
        <rect
          key={i}
          className="ui-art__ink"
          x="350"
          y={830 + i * 30}
          width={width}
          height="12"
          rx="6"
          opacity="0.6"
        />
      ))}
    </Frame>
  );
}
