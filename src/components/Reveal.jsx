import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Masked line reveal. If `play` is given, animates on that boolean (hero on-load).
// Otherwise animates via IntersectionObserver when scrolled into view.
export const Reveal = ({ children, className = "", delay = 0, play }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const transition = { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] };

  useEffect(() => {
    if (play !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  const shown = play !== undefined ? play : inView;

  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={false}
        animate={{ y: shown ? "0%" : "115%" }}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  );
};
