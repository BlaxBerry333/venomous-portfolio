import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  missionId: string;
  rank: string;
  rankColor: string;
  status: string;
  /** 0 - 1 进度；外部传入。null = 不显示进度数字 */
  progress?: number | null;
  /** 当前章节 1-based */
  chapter?: number;
  totalChapters?: number;
}

/**
 * HUD 顶部状态条 — 三段：左 mission id / 中 实时坐标 mock / 右 章节进度
 * 视觉灵感：绝区零任务终端 + 战斗 HUD
 */
export default function HudBar({
  missionId,
  rank,
  rankColor,
  status,
  progress,
  chapter,
  totalChapters,
}: Props) {
  const [tick, setTick] = useState(0);

  // 实时 mock 坐标（每 1.5s 抽一次随机偏移，营造"在线"感）
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  // 用 tick 派生伪坐标，避免每帧重渲整页
  const seed = (tick * 13) % 360;
  const lat = (37.4 + Math.sin(seed) * 0.02).toFixed(4);
  const lon = (139.7 + Math.cos(seed) * 0.02).toFixed(4);

  const pct = progress != null ? Math.round(progress * 100) : null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="zd-hud-bar" role="status" aria-live="polite">
      {/* 左：mission id + rank */}
      <div className="zd-hud-bar__group">
        <span className="zd-hud-bar__dot" />
        <span>MISSION · {missionId}</span>
        <span style={{ color: rankColor, fontWeight: 700 }}>· RANK {rank}</span>
        <span style={{ color: "var(--theme-fg-muted)" }}>· {status}</span>
      </div>

      {/* 中：实时坐标 + 时间 — 移动端隐藏 */}
      <div className="zd-hud-bar__group zd-hud-bar__group--center">
        <span style={{ color: "var(--theme-fg-muted)" }}>
          ◇ LAT {lat} / LON {lon}
        </span>
        <span style={{ color: "var(--theme-fg-muted)" }}>
          ◇ T+
          {String(tick * 1.5)
            .padStart(5, "0")
            .slice(0, 5)}
          s
        </span>
      </div>

      {/* 右：章节 + 进度 */}
      <div className="zd-hud-bar__group">
        {chapter != null && totalChapters != null && (
          <span>
            CH {String(chapter).padStart(2, "0")} / {String(totalChapters).padStart(2, "0")}
          </span>
        )}
        {pct != null && (
          <span style={{ color: "var(--theme-accent)", fontWeight: 700 }}>
            {String(pct).padStart(3, "0")}%
          </span>
        )}
      </div>
    </div>,
    document.body,
  );
}
