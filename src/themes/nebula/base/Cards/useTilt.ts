import { useRef } from "react";

/**
 * 指针驱动的 3D 倾斜 hook。返回挂到「外层 perspective 容器」上的事件处理器，
 * 并通过 CSS 变量把倾斜角 / 高光位置写到该容器上，由调用方的 scss 消费：
 *   --tilt-x / --tilt-y  整卡 rotateX / rotateY 的角度
 *   --glow-x / --glow-y  跟指针走的高光中心百分比位置
 *
 * 性能：mousemove 用 rAF 节流合并到下一帧；仅鼠标驱动（pointerType==="mouse"），
 * 触屏 / 触控笔不触发，避免点按时卡片乱转。
 * reduced 为 true 时所有处理器变成 no-op（调用方仍应在 scss 里关掉 transform）。
 *
 * 泛型 T 为挂载的容器元素类型，默认 HTMLDivElement；
 * 若挂在 <a> 上，调用处写 useTilt<HTMLAnchorElement>(...)。
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxTilt: number, reduced: boolean) {
  const rootRef = useRef<T>(null);
  // rAF 节流：把高频指针事件合并到下一帧统一写 CSS 变量
  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);

  const apply = () => {
    frame.current = null;
    const el = rootRef.current;
    const p = pending.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    // nx / ny ∈ [-1, 1]，指针相对卡片中心的归一化偏移
    const nx = ((p.x - rect.left) / rect.width) * 2 - 1;
    const ny = ((p.y - rect.top) / rect.height) * 2 - 1;
    el.style.setProperty("--tilt-x", `${(-ny * maxTilt).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(nx * maxTilt).toFixed(2)}deg`);
    el.style.setProperty("--glow-x", `${(((p.x - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-y", `${(((p.y - rect.top) / rect.height) * 100).toFixed(1)}%`);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    pending.current = { x: e.clientX, y: e.clientY };
    if (frame.current == null) frame.current = requestAnimationFrame(apply);
  };

  const reset = () => {
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    const el = rootRef.current;
    if (!el) return;
    // 归零：CSS transition 把卡片平滑摆回正面
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glow-x", "50%");
    el.style.setProperty("--glow-y", "50%");
  };

  return {
    rootRef,
    /** 摊到外层 perspective 容器上：<div ref={rootRef} {...tiltHandlers}> */
    tiltHandlers: {
      onPointerMove,
      onPointerLeave: reset,
      onBlur: reset,
    },
  };
}
