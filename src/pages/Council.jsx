import { Linkedin } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { CouncilRing } from "../components/CouncilRing";
import { Reveal } from "../components/Reveal";
import { COUNCIL } from "../data/council";

// Hierarchy rows for "all at once", picked by member id (not array position).
// HOD / 3 faculty / PG / DGSec / 3 thirdies / everyone else
const ROW_IDS = [
  [1],           // HOD
  [2, 3, 4],     // faculty
  [5],           // PG
  [6],           // DGSec
  [9, 7, 8],     // thirdies
];

export default function Council() {
  const byId = new Map(COUNCIL.map((m) => [m.id, m]));
  const used = new Set(ROW_IDS.flat());

  const ROWS = [
    ...ROW_IDS.map((ids) => ids.map((id) => byId.get(id)).filter(Boolean)),
    COUNCIL.filter((m) => !used.has(m.id)), // sophies: everyone left, in data order
  ].filter((row) => row.length > 0);

  return (
    <div data-testid="council-page">
      <PageHeader
        testid="council-header"
        kicker="The best council"
        title={
          <>
            The council, <span className="italic text-white/60"> Together</span>
          </>
        }
        sub="From the HOD to the editors, we twenty people keep the association intact."
      />
      <CouncilRing members={COUNCIL} />

      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-12">
        <Reveal>
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Everyone, <span className="italic text-white/60">all at once</span>
          </h2>
        </Reveal>
        <div className="mt-16 flex flex-col items-center gap-16 lg:gap-20">
          {ROWS.map((row, r) => (
            <div key={r} className="flex flex-wrap justify-center gap-x-8 gap-y-10">
              {row.map((m) => (
                <div
                  key={m.id}
                  data-testid={`council-grid-card-${COUNCIL.indexOf(m)}`}
                  className="group w-[calc(50%-1rem)] border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors duration-300 hover:border-[#FFD1DC]/40 md:w-64"
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
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 font-serif text-lg leading-tight text-white">{m.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {m.position}
                  </p>
                  <p className="mt-2 truncate text-[11px] font-light text-white/40">{m.email}</p>
                  <p className="mt-0.5 text-[11px] font-light text-white/40">{m.phone}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      data-testid={`council-linkedin-${m.id}`}
                      className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors duration-300 hover:border-[#FFD1DC]/60 hover:text-white"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}