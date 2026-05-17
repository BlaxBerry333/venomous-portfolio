import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  /** 目标值 */
  to: number;
  /** 是否启动 */
  active: boolean;
  duration?: number;
  /** 用于 reel 风格：固定字宽 */
  pad?: number;
  className?: string;
}

/**
 * 滚动 / active 时启动的数字计数器（自实现，不依赖 motion 复杂值映射，避免 Panel7 那类 useMotionValue + useTransform 套用问题）
 * reduced motion 直接显示终值。
 */
export default function ScrollCounter({ to, active, duration = 1.4, pad, className }: Props) {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? to : 0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setVal(to);
      return;
    }
    fromRef.current = val;
    startRef.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;
      const k = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(fromRef.current + (to - fromRef.current) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, to, reduced]);

  const text = pad ? String(val).padStart(pad, "0") : String(val);
  return <span className={`zd-counter-reel ${className ?? ""}`}>{text}</span>;
}
