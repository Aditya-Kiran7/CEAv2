import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { EVENTS } from "../data/events";

export default function Events() {
  return (
    <div data-testid="events-page">
      <PageHeader
        testid="events-header"
        kicker="What's on"
        title={
          <>
            Events, <span className="italic text-white/60">in concrete & spirit</span>
          </>
        }
        sub="Festivals, competitions, site visits and lectures — everything the association puts into the world."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-32 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
        {EVENTS.map((e, i) => (
          <ContentCard key={e.id} item={e} index={i} prefix="event" />
        ))}
      </div>
    </div>
  );
}
