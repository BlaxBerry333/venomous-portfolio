import { Html, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { GravityNode } from "./types";

interface Props {
  pos: [number, number, number];
  /** 连线 + 节点的语义色 */
  color: string;
  /** 连线 idle 透明度 */
  opacity: number;
  node: GravityNode;
  /** 被选中 → 当前节点淡出（详情 Card 由父层渲染） */
  hidden: boolean;
  onSelect: () => void;
}

// 单节点：到中心的连线 + Html label button
export default function GravityNodeView({ pos, color, opacity, node, hidden, onSelect }: Props) {
  // 连线两端内缩：起点距中心 0.6（中心球外），终点距节点 0.12
  const linePoints = useMemo<Array<[number, number, number]>>(() => {
    const len = Math.hypot(pos[0], pos[1], pos[2]);
    if (len < 0.001) return [[0, 0, 0], pos];
    const startT = 0.6 / len;
    const endT = (len - 0.12) / len;
    return [
      [pos[0] * startT, pos[1] * startT, pos[2] * startT],
      [pos[0] * endT, pos[1] * endT, pos[2] * endT],
    ];
  }, [pos]);

  const group = node.group ?? "primary";

  return (
    <>
      <Line
        points={linePoints}
        color={color}
        lineWidth={1.2}
        transparent
        opacity={hidden ? 0 : opacity}
      />
      {/* 不设 occlude：长 label（如 "Protocol Buffers"）会被 wireframe 误判遮挡而半透。
          wrapperClass 强制 portal wrapper overflow:visible + 不约束宽度，防止长文本被截。 */}
      <Html
        position={pos}
        center
        distanceFactor={6}
        zIndexRange={[50, 10]}
        wrapperClass="nebula--GravityGraph__node-html"
      >
        {/* motion.div 外层 hidden 过渡；内层普通 button，CSS :hover 不跟 motion 冲突 */}
        <motion.div
          animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.3 : 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: hidden ? "none" : "auto" }}
        >
          <button
            type="button"
            aria-label={node.ariaLabel ?? node.label}
            className={`nebula--GravityGraph__node nebula--GravityGraph__node--${group}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {node.label}
          </button>
        </motion.div>
      </Html>
    </>
  );
}
