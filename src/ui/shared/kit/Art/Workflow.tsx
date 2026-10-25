import { Frame } from "./Frame";
import { useSvgId } from "./useSvgId";

const WORKFLOW_MENU = Array.from({ length: 9 }, (_, i) => 60 + i * 100);

const WORKFLOW_MENU_ACTIVE = 2;

const WORKFLOW_GRID = Array.from({ length: 17 * 12 }, (_, i) => ({
  x: 300 + (i % 17) * 80,
  y: 60 + Math.floor(i / 17) * 80,
}));

const WORKFLOW_EDGES = [
  "M500 480 L580 480",
  "M780 480 L842 480",
  "M940 382 C940 330 1040 330 1120 330",
  "M940 578 C940 630 1040 630 1120 630",
  "M1320 330 C1370 330 1370 480 1400 480",
  "M1320 630 C1370 630 1370 480 1400 480",
];

function WorkflowNode({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  return (
    <g>
      <rect className="ui-art__ink" x={x} y={y} width="200" height="100" rx="16" opacity="0.08" />
      <rect
        className={active ? "ui-art__stroke-primary" : "ui-art__stroke-ink"}
        x={x}
        y={y}
        width="200"
        height="100"
        rx="16"
        strokeWidth="2"
        opacity={active ? 0.9 : 0.25}
      />
      <rect
        className={active ? "ui-art__primary" : "ui-art__ink"}
        x={x + 22}
        y={y + 22}
        width="22"
        height="22"
        rx="6"
        opacity={active ? 0.9 : 0.4}
      />
      <rect
        className="ui-art__ink"
        x={x + 56}
        y={y + 28}
        width="110"
        height="10"
        rx="5"
        opacity="0.7"
      />
      <rect
        className="ui-art__ink"
        x={x + 22}
        y={y + 62}
        width="150"
        height="10"
        rx="5"
        opacity="0.3"
      />
    </g>
  );
}

function WorkflowPill({ x, filled }: { x: number; filled: boolean }) {
  return (
    <g>
      <rect
        className={filled ? "ui-art__primary" : "ui-art__ink"}
        x={x}
        y="450"
        width="180"
        height="60"
        rx="30"
        opacity={filled ? 0.9 : 0.1}
      />
      {!filled && (
        <rect
          className="ui-art__stroke-ink"
          x={x}
          y="450"
          width="180"
          height="60"
          rx="30"
          strokeWidth="2"
          opacity="0.3"
        />
      )}
      <rect
        className={filled ? "ui-art__ground" : "ui-art__ink"}
        x={x + 44}
        y="474"
        width="92"
        height="12"
        rx="6"
        opacity={filled ? 0.7 : 0.5}
      />
    </g>
  );
}

export function Workflow() {
  const id = useSvgId();
  return (
    <Frame id={id}>
      <rect className="ui-art__ink" width="240" height="1000" opacity="0.03" />
      {WORKFLOW_MENU.map((y, i) => (
        <g key={y}>
          <rect
            className="ui-art__ink"
            x="30"
            y={y}
            width="180"
            height="66"
            rx="12"
            opacity={i === WORKFLOW_MENU_ACTIVE ? 0.1 : 0.05}
          />
          <rect
            className={i === WORKFLOW_MENU_ACTIVE ? "ui-art__primary" : "ui-art__ink"}
            x="48"
            y={y + 20}
            width="26"
            height="26"
            rx="7"
            opacity={i === WORKFLOW_MENU_ACTIVE ? 0.9 : 0.3}
          />
          <rect
            className="ui-art__ink"
            x="88"
            y={y + 28}
            width={i % 3 === 0 ? 96 : 72}
            height="10"
            rx="5"
            opacity={i === WORKFLOW_MENU_ACTIVE ? 0.7 : 0.4}
          />
        </g>
      ))}
      {WORKFLOW_GRID.map((dot, i) => (
        <circle key={i} className="ui-art__ink" cx={dot.x} cy={dot.y} r="2" opacity="0.14" />
      ))}
      {WORKFLOW_EDGES.map((edge) => (
        <path
          key={edge}
          className="ui-art__stroke-primary"
          d={edge}
          strokeWidth="3"
          opacity="0.6"
        />
      ))}
      <WorkflowPill x={320} filled />
      <WorkflowNode x={580} y={430} active />
      <rect
        className="ui-art__primary"
        x="870"
        y="410"
        width="140"
        height="140"
        rx="14"
        opacity="0.3"
        transform="rotate(45 940 480)"
      />
      <rect
        className="ui-art__stroke-primary"
        x="870"
        y="410"
        width="140"
        height="140"
        rx="14"
        strokeWidth="3"
        transform="rotate(45 940 480)"
      />
      <rect className="ui-art__ink" x="896" y="474" width="88" height="12" rx="6" opacity="0.8" />
      <WorkflowNode x={1120} y={280} />
      <WorkflowNode x={1120} y={580} />
      <WorkflowPill x={1400} filled={false} />
    </Frame>
  );
}
