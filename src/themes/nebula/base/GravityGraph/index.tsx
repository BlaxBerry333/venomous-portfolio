import HiveCellCard from "@/themes/nebula/base/Cards/HiveCellCard";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import GravityScene from "./Scene";
import { fibonacciSphere, GRAVITY, type GravityGraphProps, type GravityNode } from "./types";

// 3D 引力球 —— 节点分布在 fibonacci 球面上；点击节点 → 该节点淡出 + 详情 Card 居中显示。
// 详情 Card 不放进 3D 场景（避免随相机/group 变换跳动），用 Canvas 外层 DOM 居中。
// 关闭 Card：点 overlay 空白 / 拖动相机 / 再点同节点。
export default function GravityGraph({
  nodes,
  ariaLabel,
  maxNodes = GRAVITY.defaultMaxNodes,
}: GravityGraphProps) {
  const visible = useMemo(() => nodes.slice(0, maxNodes), [nodes, maxNodes]);
  const primary = useMemo(
    () => visible.filter((n) => (n.group ?? "primary") === "primary"),
    [visible],
  );
  const secondary = useMemo(() => visible.filter((n) => n.group === "secondary"), [visible]);
  const primaryPositions = useMemo(
    () => fibonacciSphere(primary.length, GRAVITY.radiusPrimary),
    [primary.length],
  );
  const secondaryPositions = useMemo(
    () => fibonacciSphere(secondary.length, GRAVITY.radiusSecondary),
    [secondary.length],
  );

  const [selected, setSelected] = useState<GravityNode | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 视口内才渲染 —— 不可见时 frameloop="never" 完全停摆 Three.js（不烧 GPU/CPU）。
  // 比单纯停 useFrame 更彻底：连静态 mesh 的重绘都省掉。
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // grab/grabbing：按下不切，等真拖动（move 距离超阈值）才切。
  // 关键：data-nebula-grabbing 一立，body 全局 CSS 会把节点 pointer-events:none，
  // 如果按下瞬间就立 → 松手时 button click 落空，点不出 Card。
  useEffect(() => {
    let pressed = false;
    let startX = 0;
    let startY = 0;
    let grabbing = false;
    const DRAG_THRESHOLD = 4; // px，超过才算拖动

    const setGrabbing = (on: boolean) => {
      if (grabbing === on) return;
      grabbing = on;
      const stage = stageRef.current;
      if (on) {
        stage?.classList.add("is-grabbing");
        document.body.dataset.nebulaGrabbing = "true";
      } else {
        stage?.classList.remove("is-grabbing");
        delete document.body.dataset.nebulaGrabbing;
      }
    };
    const onDown = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage || !stage.contains(e.target as Node)) return;
      pressed = true;
      startX = e.clientX;
      startY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!pressed || grabbing) return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > DRAG_THRESHOLD) {
        setGrabbing(true);
      }
    };
    const onUp = () => {
      pressed = false;
      setGrabbing(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // 节点 click 跟 Canvas onPointerMissed 是同一次指针事件（Html 不算 3D mesh 触发 miss）。
  // ref 记"刚 select 过" → onPointerMissed / 全局 mousedown 跳过本次清除再复位。
  const justSelectedRef = useRef(false);

  const selectNode = (n: GravityNode) => {
    justSelectedRef.current = true;
    setSelected(n);
  };
  const closeDetail = () => setSelected(null);
  const handlePointerMissed = () => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    setSelected(null);
  };

  // 详情打开时，点 stage 外任意位置 → 关闭。
  // stage 内的点击（节点切换 / 空白 onPointerMissed）由各自路径处理。
  useEffect(() => {
    if (!selected) return;
    const onDocDown = (e: MouseEvent) => {
      const stage = stageRef.current;
      const target = e.target as Node | null;
      if (stage && target && !stage.contains(target)) {
        setSelected(null);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [selected]);

  return (
    <div
      ref={stageRef}
      className="nebula--GravityGraph__stage"
      role="img"
      aria-label={ariaLabel ?? "Gravity sphere"}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        onPointerMissed={handlePointerMissed}
        frameloop={inView ? "always" : "never"}
        // fiber 默认给 wrapper overflow:hidden 会裁掉球面边缘的长 label —— 覆盖为 visible
        style={{ overflow: "visible" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#22d3ee" intensity={1.4} />

        <GravityScene
          primary={primary}
          secondary={secondary}
          primaryPositions={primaryPositions}
          secondaryPositions={secondaryPositions}
          selectedId={selected?.id ?? null}
          onSelect={selectNode}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={selected ? 0 : 0.6}
          onStart={closeDetail}
        />
      </Canvas>

      {/* 详情 Card overlay —— Canvas 外 DOM 居中，不随 3D 变换走。
          overlay 自身 pointer-events:none，让点击穿透到 Canvas（节点切换可用）；
          只有 detail-frame 自身 auto，避免吃掉非详情区域的点击。
          z-index 100 强制盖住 drei <Html> 节点（zIndexRange max=50） */}
      <div className="nebula--GravityGraph__overlay" style={{ pointerEvents: "none" }}>
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              className="nebula--GravityGraph__detail-frame"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                translateX: "-50%",
                translateY: "-50%",
                transformOrigin: "center center",
                pointerEvents: "auto",
              }}
            >
              <HiveCellCard
                size="md"
                variant="solid"
                tilt
                title={selected.label}
                subtitle={selected.subLabel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export type { GravityGraphProps, GravityNode } from "./types";
