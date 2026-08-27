import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Mail, Phone } from "lucide-react";

const RADIUS = 620;
const CARD_W = 210;
const CARD_H = 300;

// Tune these to control total scroll length.
const RING_VH_PER_MEMBER = 90;  // scroll "dwell time" per card in a ring
const RING_VH_MIN = 300;        // floor so small rings aren't rushed
const FINALE_VH = 150;          // finale isn't scroll-animated, just needs to "arrive"

// Sequential orbit rings. Sizes are easy to edit; the last ring takes the rest.
// Ring 1 = HOD + faculty (4), Ring 2 = office bearers (5), Ring 3 = remaining members.
const RING_DEFS = [
  { name: "Faculty", size: 4, color: "#FFD1DC" },
  { name: "Office Bearers", size: 5, color: "#9EC5FF" },
  { name: "Council Members", size: null, color: "#A8F0C6" }, // null => remaining
];

export const CouncilRing = ({ members }) => {
  const ref = useRef(null);

  const rings = useMemo(() => {
    const out = [];
    let idx = 0;
    RING_DEFS.forEach((def) => {
      const size = def.size ?? members.length - idx;
      out.push({ ...def, members: members.slice(idx, idx + size) });
      idx += size;
    });
    return out.filter((r) => r.members.length > 0);
  }, [members]);

  // Per-phase scroll budget: one entry per ring (scaled by member count), plus the finale.
  const phaseHeights = useMemo(
    () => [
      ...rings.map((r) => Math.max(RING_VH_MIN, r.members.length * RING_VH_PER_MEMBER)),
      FINALE_VH,
    ],
    [rings]
  );
  const totalVh = useMemo(
    () => phaseHeights.reduce((a, b) => a + b, 0),
    [phaseHeights]
  );

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState(0);
  const [rot, setRot] = useState(0);
  const [bubble, setBubble] = useState(null);
  const phaseRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const posVh = v * totalVh;

    // Walk cumulative phase boundaries (phases are no longer equal-length).
    let cum = 0;
    let pi = 0;
    let local = 0;
    for (let i = 0; i < phaseHeights.length; i++) {
      const h = phaseHeights[i];
      if (posVh < cum + h || i === phaseHeights.length - 1) {
        pi = i;
        local = h > 0 ? Math.min(1, Math.max(0, (posVh - cum) / h)) : 1;
        break;
      }
      cum += h;
    }

    if (pi !== phaseRef.current) {
      phaseRef.current = pi;
      setPhase(pi);
      setBubble(null);
    }

    if (pi < rings.length) {
      const n = rings[pi].members.length;
      const step = 360 / n;
      const rotVal = local * (360 + 2 * step);
      const idx = ((Math.round(-rotVal / step) % n) + n) % n;
      setRot(rotVal);
      setActive(idx);
    }
  });

  const allMode = phase >= rings.length;
  const group = rings[Math.min(phase, rings.length - 1)];
  const n = group.members.length;
  const step = 360 / n;
  const current = group.members[active] || group.members[0];
  const bubbleMember = bubble !== null ? group.members[bubble] : null;

  return (
    <section
      ref={ref}
      data-testid="council-ring-section"
      className="relative"
      style={{ height: `${totalVh}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${(allMode ? "#FFD1DC" : group.color)
              }14 0%, transparent 68%)`,
          }}
        />

        {/* ---- left info panel (sequential phases) ---- */}
        {!allMode && (
          <div className="pointer-events-none absolute inset-x-6 bottom-10 z-20 sm:bottom-auto sm:left-6 sm:top-1/2 sm:max-w-sm sm:-translate-y-1/2 lg:left-12">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: group.color }}
              />
              <p
                data-testid="council-ring-indicator"
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ color: group.color }}
              >
                Ring {phase + 1} / {rings.length}
              </p>
            </div>
            <p
              data-testid="council-ring-tier"
              className="mt-3 font-serif text-2xl font-light italic text-white/85"
            >
              {group.name}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${phase}-${active}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3
                  data-testid="council-active-member"
                  className="mt-2 font-serif text-3xl font-light text-white sm:text-4xl"
                >
                  {current.name}
                </h3>
                <p
                  className="mt-2 text-xs uppercase tracking-[0.3em]"
                  style={{ color: group.color }}
                >
                  {current.position}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* contact bubble docked in the panel (no longer overlaps the ring) */}
            <AnimatePresence>
              {bubbleMember && (
                <motion.div
                  key={`${phase}-${bubble}`}
                  data-testid="member-bubble"
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto mt-5 w-full max-w-xs rounded-2xl border bg-[#0a0b10]/85 p-5 backdrop-blur-xl"
                  style={{ borderColor: `${group.color}55` }}
                >
                  <p
                    data-testid="member-bubble-bio"
                    className="text-sm font-light leading-relaxed text-white/60"
                  >
                    {bubbleMember.bio}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                    <a
                      data-testid="member-bubble-email"
                      href={`mailto:${bubbleMember.email}`}
                      className="flex items-center gap-2.5 text-xs font-light text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      <Mail size={12} className="shrink-0 text-white/40" />
                      {bubbleMember.email}
                    </a>
                    <a
                      data-testid="member-bubble-phone"
                      href={`tel:${bubbleMember.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2.5 text-xs font-light text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      <Phone size={12} className="shrink-0 text-white/40" />
                      {bubbleMember.phone}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ---- finale header ---- */}
        {allMode && (
          <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex flex-col items-center px-6 text-center">
            <p
              data-testid="council-ring-indicator"
              className="text-[10px] uppercase tracking-[0.5em] text-white/40"
            >
              Everyone · all at once
            </p>
            <h3 className="mt-4 font-serif text-3xl font-light text-white sm:text-4xl">
              The full <span className="italic text-white/60">council</span>
            </h3>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {rings.map((r) => (
                <span key={r.name} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: r.color }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {r.name} · {r.members.length}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---- rings stage ---- */}
        <div className="absolute inset-0" style={{ perspective: "1700px" }}>
          <div className="relative flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {!allMode ? (
                // one ring at a time — the old one lifts up, the next rises in
                <motion.div
                  key={`ring-${phase}`}
                  initial={{ opacity: 0, y: 420 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -420 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute scale-[0.5] sm:scale-[0.62] lg:scale-75"
                >
                  <motion.div
                    style={{
                      rotateY: rot,
                      transformStyle: "preserve-3d",
                      width: CARD_W,
                      height: CARD_H,
                    }}
                  >
                    {group.members.map((m, i) => (
                      <div
                        key={m.id}
                        data-testid={`council-ring-card-${i}`}
                        onClick={() => i === active && setBubble(bubble === i ? null : i)}
                        className={`absolute inset-0 overflow-hidden rounded-lg border bg-white/5 backdrop-blur-md transition-colors duration-300 ${i === active ? "cursor-pointer" : ""
                          }`}
                        style={{
                          transform: `rotateY(${i * step}deg) translateZ(${RADIUS}px)`,
                          backfaceVisibility: "hidden",
                          borderColor: i === active ? group.color : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <img
                          src={m.photo}
                          alt={m.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            if (m.photoFallback) e.currentTarget.src = m.photoFallback;
                          }}
                          className="h-40 w-full object-cover grayscale-[0.35]"
                        />
                        <div className="p-4">
                          <p className="font-serif text-lg leading-tight text-white">{m.name}</p>
                          <p className="mt-1.5 text-[9px] uppercase tracking-[0.25em] text-white/50">
                            {m.position}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                // finale — all three rings stacked as tiers, rotating together
                <motion.div
                  key="ring-all"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                  style={{ perspective: "1900px" }}
                >
                  {rings.map((r, ri) => {
                    const rStep = 360 / r.members.length;
                    const offsetY = (ri - (rings.length - 1) / 2) * 230;
                    return (
                      <div
                        key={r.name}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `translate(-50%, -50%) translateY(${offsetY}px) scale(0.4)`,
                        }}
                      >
                        <motion.div
                          animate={{ rotateY: 360 }}
                          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                          style={{
                            transformStyle: "preserve-3d",
                            width: CARD_W,
                            height: CARD_H,
                          }}
                        >
                          {r.members.map((m, i) => (
                            <div
                              key={m.id}
                              className="absolute inset-0 overflow-hidden rounded-lg border bg-white/5 backdrop-blur-md"
                              style={{
                                transform: `rotateY(${i * rStep}deg) translateZ(${RADIUS}px)`,
                                backfaceVisibility: "hidden",
                                borderColor: `${r.color}66`,
                              }}
                            >
                              <img
                                src={m.photo}
                                alt={m.name}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  if (m.photoFallback) e.currentTarget.src = m.photoFallback;
                                }}
                                className="h-40 w-full object-cover grayscale-[0.35]"
                              />
                              <div className="p-4">
                                <p className="font-serif text-lg leading-tight text-white">
                                  {m.name}
                                </p>
                                <p className="mt-1.5 text-[9px] uppercase tracking-[0.25em] text-white/50">
                                  {m.position}
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-white/30">
          {allMode
            ? "the whole council, in orbit"
            : "scroll — this ring lifts, the next one rises"}
        </p>
      </div>
    </section>
  );
};