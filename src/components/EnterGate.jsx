import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Hand, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAudio } from "../audio/AudioContext";


const DURATION = 2400; // load countdown
const HOLD_SECONDS = 5; // fallback hold time if the video has no duration yet
const RING_C = 213.6; // hold ring circumference

// Drop your custom intro clip here to swap it in — no code change needed:
//   /app/frontend/public/intro/hold-intro.mp4
const VIDEO_SRC = "/intro/hold-intro.mp4";

export const EnterGate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⚠️ assumed shape — confirm this matches your AudioContext
  const { entered, startIntro, enter } = useAudio();
  

  const [count, setCount] = useState(99);
  const [phase, setPhase] = useState("load");
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const videoRef = useRef(null);

  // custom cursor position during the hold phase
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);

  // parallax drift for the video itself, smoothed with a spring
  const videoX = useMotionValue(0);
  const videoY = useMotionValue(0);
  const videoSmoothX = useSpring(videoX, { stiffness: 40, damping: 18 });
  const videoSmoothY = useSpring(videoY, { stiffness: 40, damping: 18 });
  const videoOpacityRaw = useMotionValue(1);
  const videoOpacity = useSpring(videoOpacityRaw, { stiffness: 60, damping: 20 });
  const fadeRaf = useRef(null);

  // ramps a video's volume smoothly between two values, cancels any prior fade
  const fadeVolume = (video, from, to, duration, onDone) => {
    if (!video) return;
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    const start = performance.now();
    video.volume = from;
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration);
      video.volume = from + (to - from) * k;
      if (k < 1) {
        fadeRaf.current = requestAnimationFrame(step);
      } else {
        fadeRaf.current = null;
        onDone?.();
      }
    };
    fadeRaf.current = requestAnimationFrame(step);
  };

  // land on the map after the intro (only when starting from home)
    const finishRef = useRef(() => {});
  finishRef.current = () => {
    const vid = videoRef.current;
    fadeVolume(vid, vid?.volume ?? 0, 0, 500);
        videoOpacityRaw.set(0); // videoOpacity is a spring-free motion value; animate it below instead

    const path = location.pathname.replace(/\/+$/, "") || "/";
    setTimeout(() => {
      if (path === "/" || path === "/cea") navigate("/map");
      enter();
    }, 500);
  };

  // cursor tracking + video parallax during the hold phase
  useEffect(() => {
    if (phase !== "hold") return;
    const STRENGTH = 18; // px of max video drift — tune to taste

    const m = (e) => {
      cx.set(e.clientX);
      cy.set(e.clientY);

      const relX = e.clientX / window.innerWidth - 0.5; // -0.5 to 0.5
      const relY = e.clientY / window.innerHeight - 0.5;
      videoX.set(relX * STRENGTH * 2);
      videoY.set(relY * STRENGTH * 2);
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, [phase, cx, cy, videoX, videoY]);

  // load countdown
  useEffect(() => {
    if (entered || phase !== "load") return;
    const start = performance.now();
    let raf;
    let timer;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / DURATION);
      setCount(Math.round(99 * Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
      else timer = setTimeout(() => setPhase("hold"), 400);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [entered, phase]);

  // hold loop — the video plays only while the pointer is held down
  useEffect(() => {
    if (phase !== "hold" || entered) return;
    const holdState = { v: false };
    const prog = { v: 0 };
    let done = false;
    let last = performance.now();
    let raf;

    const onDown = () => {
      holdState.v = true;
      setHolding(true);
      startIntro();
      const vid = videoRef.current;
      if (vid) {
        vid.play?.().catch(() => {});
        fadeVolume(vid, vid.volume, 1, 260);
      }
    };
    const onUp = () => {
      holdState.v = false;
      setHolding(false);
      const vid = videoRef.current;
      if (vid) {
        fadeVolume(vid, vid.volume, 0, 350, () => vid.pause?.());
      }
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const vid = videoRef.current;
      if (holdState.v && prog.v < 1) {
        if (vid && vid.duration && !Number.isNaN(vid.duration)) {
          prog.v = Math.min(1, vid.currentTime / vid.duration);
        } else {
          prog.v = Math.min(1, prog.v + dt / HOLD_SECONDS);
        }
      }
      setProgress(Math.round(prog.v * 100));

      if (prog.v >= 1 && !done) {
        done = true;
        setTimeout(() => finishRef.current(), 700);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [phase, entered, startIntro]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          data-testid="enter-gate"
          className="fixed inset-0 z-[100] bg-[#050508]"
          exit={{ opacity: 0, transition: { duration: 1.3, ease: "easeInOut" } }}
        >
          {phase === "load" ? (
            <div
              data-testid="loader-phase"
              onClick={() => setPhase("hold")}
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20"
              >
                <span className="font-serif text-2xl italic tracking-wide text-white/90">CEA</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 text-center font-serif text-4xl font-light text-white sm:text-5xl"
              >
                Civil Engineering <span className="italic text-white/70">Association</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.45 }}
                className="mt-4 text-xs uppercase tracking-[0.4em] text-white/40"
              >
                IIT Bombay
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-16 flex w-64 flex-col items-center sm:w-80"
              >
                <span
                  data-testid="loader-count"
                  className="font-serif text-6xl font-light italic text-white/90"
                >
                  {count}
                </span>
                <div className="mt-6 h-px w-full bg-white/10">
                  <div
                    data-testid="loader-bar"
                    className="h-px bg-[#FFD1DC] transition-[width] duration-100 ease-linear"
                    style={{ width: `${count}%` }}
                  />
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-white/35">
                  Laying the foundation
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 touch-none overflow-hidden"
              style={{ cursor: "none" }}
            >
              {/* Custom intro video — plays while held, drifts slightly with the cursor */}
              <motion.video
                ref={videoRef}
                data-testid="hold-video"
                src={VIDEO_SRC}
                muted={false}
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                animate={{
                  filter: holding ? "brightness(1) saturate(1)" : "brightness(0.55) saturate(0.9)",
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  x: videoSmoothX,
                  y: videoSmoothY,
                  scale: 1.08,
                  opacity: videoOpacity,
                }}
              />

              {/* custom cursor */}
              <motion.div
                data-testid="hold-cursor-ring"
                style={{ x: cx, y: cy }}
                className="pointer-events-none fixed left-0 top-0 z-10 -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-[#FFD1DC]/90"
              />
              <motion.div
                style={{ x: cx, y: cy }}
                className="pointer-events-none fixed left-0 top-0 z-10 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-white"
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 68% 58% at 50% 46%, transparent 38%, rgba(5,5,8,0.62) 100%)",
                }}
              />

              <div className="pointer-events-none absolute inset-x-0 top-16 flex flex-col items-center">
                <Play size={18} className="mb-3 text-white/50" />
                <p className="font-serif text-2xl font-light italic text-white/80">
                  the story
                </p>
                <p className="mt-2 px-6 text-center text-[10px] uppercase tracking-[0.22em] text-white/40 sm:tracking-[0.35em]">
                  hold — and let it play
                </p>
              </div>

              <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <circle
                      data-testid="hold-progress-ring"
                      cx="40" cy="40" r="34" fill="none" stroke="#FFD1DC" strokeWidth="1.5"
                      strokeLinecap="round" strokeDasharray={RING_C}
                      strokeDashoffset={RING_C * (1 - progress / 100)}
                      style={{ transition: "stroke-dashoffset 0.15s linear" }}
                    />
                  </svg>
                  <Hand size={18} className={progress === 0 ? "animate-pulse text-white/70" : "text-white/70"} />
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/45">
                  Hold to enter · {progress}%
                </p>
              </div>

              <button
                data-testid="skip-intro-button"
                onClick={() => finishRef.current()}
                className="absolute bottom-6 right-4 rounded-full border border-white/15 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:border-white/40 hover:text-white sm:bottom-10 sm:right-8 sm:px-6 sm:tracking-[0.35em]"
              >
                Skip
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};