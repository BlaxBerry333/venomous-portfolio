// 全局共享鼠标位置（不依赖 r3f 事件系统，避免被 Canvas 拦截）

export const sharedMouse = { x: 0, y: 0, rawX: 0, rawY: 0, active: false };

let attached = false;

function resetMouse() {
  sharedMouse.x = 0;
  sharedMouse.y = 0;
  sharedMouse.rawX = 0;
  sharedMouse.rawY = 0;
  sharedMouse.active = false;
}

export function ensureMouseListener() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener(
    "mousemove",
    (e) => {
      sharedMouse.rawX = e.clientX;
      sharedMouse.rawY = e.clientY;
      sharedMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sharedMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      sharedMouse.active = true;
    },
    { passive: true },
  );
  document.addEventListener("mouseleave", resetMouse);
  window.addEventListener("blur", resetMouse);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetMouse();
  });
}
