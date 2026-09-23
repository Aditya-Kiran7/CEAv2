import { Reveal } from "./Reveal";

export const PageHeader = ({ kicker, title, sub, testid }) => (
  <div data-testid={testid} className="mx-auto max-w-7xl px-6 pb-14 pt-36 lg:px-12 lg:pt-44">
    <Reveal whoosh={false}>
      <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-white/40">
        <span className="h-px w-10 bg-white/25" />
        {kicker}
      </p>
    </Reveal>
    <Reveal delay={0.08}>
      <h1
        className="mt-6 font-serif text-5xl font-light leading-none tracking-tight text-white sm:text-6xl lg:text-7xl"
        style={{ textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 0 50px rgba(255,209,220,0.12)" }}
      >
        {title}
      </h1>
    </Reveal>
    {sub && (
      <Reveal delay={0.16} whoosh={false}>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/50">
          {sub}
        </p>
      </Reveal>
    )}
  </div>
);