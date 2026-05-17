// 全局滚动进度（0..1），监听 window scroll
// 替代 framer-motion 的 useScroll，避免 React 必须包住整个滚动容器

export const sharedScroll = { progress: 0 };

let attached = false;

function compute() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  sharedScroll.progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
}

export function ensureScrollListener() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  compute();
  window.addEventListener("scroll", compute, { passive: true });
  window.addEventListener("resize", compute, { passive: true });
}
