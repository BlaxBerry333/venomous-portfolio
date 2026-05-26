import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import Scene from "./Scene/Scene";
import "./index.scss";

/**
 * sanguine 主题背景：真空中的两滴血液。
 * - r3f fragment shader：SDF smooth-min 把两滴真·水溶 + 血液材质（暗红近黑 /
 *   湿润高光 / fresnel 边缘）+ 域扭曲 fbm 血雾撑满屏幕；二体开普勒轨道驱动
 * - 滚动联动 vignette + noise grain + 弱化网格
 */
export default function Background() {
  const vignette = useMotionValue(0.5);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      vignette.set(0.5 + p * 0.3);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [vignette]);

  return (
    <div className="portfolio--sanguine-bg" aria-hidden="true">
      {/* 网格 —— 垫在血滴下方 */}
      <div className="portfolio--sanguine-bg__grid" />

      {/* 真空两滴血液：r3f fragment shader（真空处透明，网格透出于其下）*/}
      <Scene mobile={isSmall} />

      <div className="portfolio--sanguine-bg__grain" />
      <motion.div className="portfolio--sanguine-bg__vignette" style={{ opacity: vignette }} />
    </div>
  );
}
