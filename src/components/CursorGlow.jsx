import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CursorGlow = () => {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 18, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      <motion.div
        data-testid="cursor-glow"
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[3] -ml-[210px] -mt-[210px] hidden h-[420px] w-[420px] mix-blend-screen md:block"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,209,220,0.22) 0%, rgba(224,231,255,0.08) 40%, transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[3] -ml-[3px] -mt-[3px] hidden h-1.5 w-1.5 rounded-full bg-white/80 mix-blend-screen md:block"
      />
    </>
  );
};
