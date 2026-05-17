import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import Scene from "./Scene/Scene";
import "./index.scss";

function readShowSignature(): boolean {
  if (typeof document === "undefined") return false;
  const main = document.querySelector<HTMLElement>("main[data-active-page]");
  return main?.dataset.activePage === "home";
}

export default function Background() {
  const vignette = useMotionValue(0.3);
  // 节点用 transition:persist 跨页保活，因此不通过 props 而是从 DOM 实时读取，
  // 并监听 astro:page-load 在 ClientRouter swap 后同步。
  const [showSignature, setShowSignature] = useState(readShowSignature);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      vignette.set(0.3 + p * 0.45);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [vignette]);

  useEffect(() => {
    const sync = () => setShowSignature(readShowSignature());
    sync();
    document.addEventListener("astro:page-load", sync);
    return () => document.removeEventListener("astro:page-load", sync);
  }, []);

  return (
    <div className="portfolio--nebula-background" aria-hidden>
      <Scene showSignature={showSignature} />
      <motion.div
        className="portfolio--nebula-background__vignette"
        style={{ opacity: vignette }}
      />
      <div className="portfolio--nebula-background__edges" />
    </div>
  );
}
