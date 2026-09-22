import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAudio } from "../audio/AudioContext";
import { Reveal } from "../components/Reveal";
import { ZeroDraw } from "../components/ZeroDraw";
import { Marquee } from "../components/Marquee";
import { ContentCard } from "../components/ContentCard";
import { MAJOR_EVENTS } from "../data/events";
import { SITE } from "../data/site";

const CHAPTERS = [
  {
    n: "01",
    title: "Who we are",
    text: "The Civil Engineering Association is the student body of the Department of Civil Engineering at IIT Bombay — a council of nineteen, speaking for hundreds of builders, dreamers and structural romantics.",
  },
  {
    n: "02",
    title: "What we do",
    text: "We organize many events, the department's orientation, host trips, host amazing nights, SOCore and design competitions through the year.",
  },
  {
    n: "03",
    title: "Why it matters",
    text: "Civil engineering is the oldest pact between humans and the ground beneath them. We exist so that students learn to honour it — with rigour, curiosity and a little poetry.",
  },
];

export default function Home() {
  const { entered } = useAudio();

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative flex min-h-screen flex-col justify-center px-6 lg:px-12"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 20% 85%, rgba(255,209,220,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto w-full max-w-7xl">
          <Reveal play={entered} whoosh={false}>
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-white/40">
              <span className="h-px w-10 bg-[#FFD1DC]/60" />
              Est. {SITE.established} · {SITE.institute}
            </p>
          </Reveal>
          <h1
            data-testid="hero-title"
            className="mt-8 font-serif text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <Reveal play={entered} delay={0.1} whoosh={false}>
              <span className="italic text-white/85">Civil</span>
            </Reveal>
            <Reveal play={entered} delay={0.24} whoosh={false}>
              Engineering
            </Reveal>
            <Reveal play={entered} delay={0.38} whoosh={false}>
              <span className="text-white/55">Association</span>
            </Reveal>
          </h1>
          <div className="mt-12">
            <Reveal play={entered} delay={0.55} whoosh={false}>
              <p className="max-w-md text-base font-light leading-relaxed text-white/50">
                {SITE.tagline} — the student civil engineering body of IIT Bombay,
                building since {SITE.established}.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Civil Engineering Association",
          "IIT Bombay",
          `Since ${SITE.established}`,
          "Build beyond limits",
        ]}
      />

      {/* DRAW ZERO — 3D scroll scene */}
      <ZeroDraw />

      {/* ABOUT — numbered manifesto chapters */}
      <section
        data-testid="about-section"
        className="mx-auto grid max-w-7xl gap-16 px-6 py-32 lg:grid-cols-12 lg:px-12 lg:py-48"
      >
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal whoosh={false}>
              <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-white/40">
                <span className="h-px w-10 bg-white/25" /> About
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white sm:text-5xl">
                Built on bedrock, <br />
                <span className="italic text-white/60">reaching skyward.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16} whoosh={false}>
              <p className="mt-8 max-w-sm text-base font-light leading-relaxed text-white/50">
                A manifesto in three chapters — who we are, what we do, and why
                any of it matters.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="space-y-24 lg:col-span-7">
          {CHAPTERS.map((c) => (
            <div key={c.n} data-testid={`about-chapter-${c.n}`} className="border-t border-white/5 pt-10">
              <Reveal>
                <span className="font-serif text-6xl font-light italic text-white/15">
                  {c.n}
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h3 className="mt-4 font-serif text-3xl font-light text-white">{c.title}</h3>
              </Reveal>
              <Reveal delay={0.14} whoosh={false}>
                <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-white/55">
                  {c.text}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      

      <Marquee
        items={["Aakaar 2026", "Bridge-It", "Concreto", "Site visits", "Guest lectures"]}
      />
    </div>
  );
}
