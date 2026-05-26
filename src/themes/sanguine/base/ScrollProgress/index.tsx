import { motion, useScroll } from "framer-motion";
import "./index.scss";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="portfolio--sanguine-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
