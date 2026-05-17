// 全局共享鼠标位置（不依赖 r3f 事件系统，避免被 Canvas 拦截）
// 参考 src/themes/void/effects/VoidStardust.tsx 的模式

export const sharedMouse = { x: 0, y: 0, rawX: 0, rawY: 0, active: false };

let attached = false;

// 用户离开窗口 / 切到别的 tab 时把鼠标位置和 active 状态重置，
// 否则 hover 在 CHEN 上切屏后，斥力会一直按"最后一次坐标"卡在那里
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
      sharedMouse.x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      sharedMouse.y = -((e.clientY / window.innerHeight) * 2 - 1); // -1..1
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
