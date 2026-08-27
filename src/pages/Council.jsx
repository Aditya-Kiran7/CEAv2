import { PageHeader } from "../components/PageHeader";
import { CouncilRing } from "../components/CouncilRing";
import { Reveal } from "../components/Reveal";
import { COUNCIL } from "../data/council";

export default function Council() {
  return (
    <div data-testid="council-page">
      <PageHeader
        testid="council-header"
        kicker="The council tree"
        title={
          <>
            The council, <span className="italic text-white/60">in orbit</span>
          </>
        }
        sub="From the HOD to the editors — twenty people keeping the association standing. Scroll through three rings, tier by tier: each one lifts away as the next rises, then the whole council comes together. Click the one in front for their contacts."
      />
      <CouncilRing members={COUNCIL} />

      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-12">
        <Reveal>
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Everyone, <span className="italic text-white/60">all at once</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {COUNCIL.map((m, i) => (
            <div
              key={m.id}
              data-testid={`council-grid-card-${i}`}
              className="group border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors duration-300 hover:border-[#FFD1DC]/40"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (m.photoFallback) e.currentTarget.src = m.photoFallback;
                  }}
                  className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <p className="mt-4 font-serif text-lg leading-tight text-white">{m.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/50">
                {m.position}
              </p>
              <p className="mt-2 truncate text-[11px] font-light text-white/40">{m.email}</p>
              <p className="mt-0.5 text-[11px] font-light text-white/40">{m.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
