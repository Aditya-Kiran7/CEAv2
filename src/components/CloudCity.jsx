import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAudio } from "../audio/AudioContext";

// hotspot positions are % of the map image (picked on the generated campus)
const SPOTS = [
  { label: "Home", path: "/", x: 50.0, y: 41.0, color: "#7DF9FF" },        // domed main building, center
  { label: "Council", path: "/council", x: 17.4, y: 74.5, color: "#B9FF66" }, // curved hostel arc, south-west
  { label: "Events", path: "/events", x: 73.4, y: 46.0, color: "#FF9F1C" },
  { label: "Blogs", path: "/blogs", x: 25.8, y: 37.5, color: "#C77DFF" },
  { label: "Gallery", path: "/gallery", x: 77.0, y: 61.5, color: "#FF5DA2" },
  { label: "Publications", path: "/publications", x: 50.9, y: 70.0, color: "#6E9BFF" },
];

// warm night lamps: main roads + building clusters (% coords)
const LAMPS = [
  [49.5, 12], [49.5, 30], [49.5, 70], [49.5, 88],
  [66, 56], [84, 56],
  [80, 20], [83, 78],
  [60, 34], [42, 62], [63, 66], [30, 78], [72, 30],
];

export default function MapPage() {
  const [hovered, setHovered] = useState(null);
  const [entered, setEntered] = useState(false);
  const [cloudStage, setCloudStage] = useState("hidden"); // hidden → in → out
  const [rain, setRain] = useState(false);
  const rainRef = useRef(null);
  const rainAudioRef = useRef(null); // rain sound element
  const navigate = useNavigate();
  const { entered: gateDone } = useAudio();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 16 });
  const sy = useSpring(my, { stiffness: 40, damping: 16 });


  // clouds part only after the intro gate lifts and the site fades in
  useEffect(() => {
    if (!gateDone) return;
    const t = setTimeout(() => setEntered(true), 2200);
    return () => clearTimeout(t);
  }, [gateDone]);

  // clouds billow IN (as the veil lifts), hold, then part
  useEffect(() => {
    if (!gateDone) return;
    const t0 = setTimeout(() => setCloudStage("in"), 700);
    const t1 = setTimeout(() => setCloudStage("out"), 3600);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [gateDone]);

  // monsoon scheduler: first drizzle at ~15s, then random episodes
  useEffect(() => {
    let alive = true;
    let t1;
    let t2;
    const schedule = (delay) => {
      t1 = setTimeout(() => {
        if (!alive) return;
        setRain(true);
        t2 = setTimeout(() => {
          if (!alive) return;
          setRain(false);
          schedule(10000 + Math.random() * 12000);
        }, 6000 + Math.random() * 10000);
      }, delay);
    };
    schedule(1500);
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // rain streak canvas
  useEffect(() => {
    const cv = rainRef.current;
    const ctx = cv.getContext("2d");
    let w;
    let h;
    let raf;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w;
      cv.height = h;
    };
    resize();
    window.addEventListener("resize", resize);
    const drops = Array.from({ length: 170 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: 10 + Math.random() * 16,
      v: 9 + Math.random() * 7,
    }));
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(200,220,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        d.y += d.v;
        d.x += 1.4;
        if (d.y > h) {
          d.y = -20;
          d.x = Math.random() * w;
        }
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.4, d.y - d.l);
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // fade rain sound in/out with rain state
  useEffect(() => {
    const audio = rainAudioRef.current;
    if (!audio) return;

    let raf;
    const targetVol = rain ? 0.5 : 0; // tweak target volume to taste

    if (rain) {
      audio.volume = 0;
      audio.play().catch(() => {}); // ignore autoplay-block errors
    }

    const step = () => {
      const diff = targetVol - audio.volume;
      if (Math.abs(diff) < 0.01) {
        audio.volume = targetVol;
        if (!rain) audio.pause();
        return;
      }
      audio.volume += diff * 0.05; // smoothing factor, higher = faster fade
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [rain]);

  const onMouse = (e) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * -18);
    my.set((e.clientY / window.innerHeight - 0.5) * -12);
  };

  return (
    <div
      data-testid="map-page"
      className="fixed inset-0 overflow-hidden bg-[#0a0f14]"
      onMouseMove={onMouse}
    >
      {/* rain ambience */}
      <audio ref={rainAudioRef} src="/audio/rain.mp3" loop preload="auto" />

      {/* the campus map image */}
      <motion.div style={{ x: sx, y: sy }} className="absolute -inset-8">
        <img
          src="/map/campus.jpg"
          alt="Aerial map of the campus"
          data-testid="map-image"
          className="animate-map-drift h-full w-full object-cover"
          style={{
            filter: rain ? "saturate(0.82) brightness(0.9)" : "none",
            transition: "filter 2.5s ease",
          }}
        />
      </motion.div>

      {/* dusk wash (70s cycle) */}
      <div
        className="animate-map-dusk pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,140,60,0.6), rgba(200,80,40,0.28) 55%, transparent 80%)",
          mixBlendMode: "overlay",
          opacity: 0,
        }}
      />
      {/* night tint (70s cycle, synced) */}
      <div
        className="animate-map-night pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,10,26,0.92), rgba(10,16,38,0.82))",
          mixBlendMode: "multiply",
          opacity: 0,
        }}
      />
      {/* warm lamps + lit windows at night (70s cycle, synced) */}
      <div className="animate-map-lamps pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
        {LAMPS.map(([x, y], i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: "3.2vw",
              height: "3.2vw",
              transform: "translate(-50%,-50%)",
              background:
                "radial-gradient(circle, rgba(255,194,116,0.85) 0%, rgba(255,170,80,0.3) 45%, transparent 70%)",
              mixBlendMode: "screen",
              animation: `lamp-flicker ${2.5 + (i % 5) * 0.7}s ease-in-out ${(i % 7) * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* rain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: rain ? 1 : 0, transition: "opacity 2.2s ease-in-out" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(160,190,220,0.14)", mixBlendMode: "screen" }}
        />
        <canvas ref={rainRef} data-testid="rain-canvas" className="absolute inset-0" />
      </div>

      {/* entry clouds */}
      <div
        data-testid="cloud-cover"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: cloudStage === "in" ? 1 : 0,
          transform: cloudStage === "in" ? "scale(1.05)" : "scale(1)",
          transition:
            cloudStage === "out"
              ? "opacity 3.4s ease-in-out, transform 3.4s ease-in-out"
              : "opacity 2s ease-in-out, transform 2.4s ease-in-out",
          background:
            "radial-gradient(ellipse 60% 45% at 30% 30%, rgba(255,255,255,0.98), transparent 70%), radial-gradient(ellipse 55% 45% at 72% 62%, rgba(245,248,252,0.98), transparent 70%), radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.95), rgba(238,242,245,0.9))",
        }}
      />

      {/* building hotspots — always-on neon name tags, appear as clouds part */}
      {cloudStage === "out" &&
        SPOTS.map((L) => (
          <button
            key={L.path}
            data-testid={`city-label-${L.label.toLowerCase()}`}
            onClick={() => navigate(L.path)}
            onMouseEnter={() => setHovered(L.label)}
            onMouseLeave={() => setHovered(null)}
            className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center p-4 sm:p-6"
            style={{ left: `${L.x}%`, top: `${L.y}%` }}
            aria-label={L.label}
          >
            <span
              className="absolute -inset-4 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-100 sm:-inset-6"
              style={{
                background: `radial-gradient(circle, ${L.color}8c 0%, ${L.color}47 45%, transparent 70%)`,
                mixBlendMode: "screen",
              }}
            />
            <span
              className={`relative max-w-[52vw] truncate whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-300 sm:max-w-none sm:px-5 sm:py-2 sm:text-sm sm:tracking-[0.25em] ${hovered === L.label ? "scale-110 bg-black/80" : "bg-black/55"
                }`}
              style={{
                color: "#fff",
                borderColor: hovered === L.label ? L.color : `${L.color}66`,
                boxShadow:
                  hovered === L.label
                    ? `0 0 20px ${L.color}59, inset 0 0 14px ${L.color}26`
                    : "none",
                textShadow:
                  hovered === L.label
                    ? `0 0 7px ${L.color}, 0 0 18px ${L.color}, 0 0 36px ${L.color}88`
                    : `0 0 6px ${L.color}cc, 0 0 14px ${L.color}77`,
              }}
            >
              {L.label}
            </span>
          </button>
        ))}

      <motion.div
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center"
        style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
      >
        <p className="rounded-full bg-black/45 px-4 py-2 text-center text-[9px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-md sm:px-5 sm:text-[10px] sm:tracking-[0.45em]">
          click a building to enter
        </p>
      </motion.div>
    </div>
  );
}