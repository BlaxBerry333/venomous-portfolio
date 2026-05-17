import { AnimatePresence, motion } from "framer-motion";
import Divider from "./Divider";
import { Title2 } from "./Title";
import { C } from "./tokens";

// 入场遮罩：纯黑底 + Title2 主标 + Divider 副线
// visible: 是否显示（true 时挂载满屏遮罩，false 时退出）
export default function EntranceOverlay({
  visible,
  title = "領域展開",
  subtitle = "無量空処",
}: {
  visible: boolean;
  title?: string;
  subtitle?: string;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: C.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            pointerEvents: "none",
          }}
        >
          <Title2 as="span">{title}</Title2>
          <Divider>{subtitle}</Divider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
