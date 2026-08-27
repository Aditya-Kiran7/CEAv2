import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { PUBLICATIONS } from "../data/publications";

export default function Publications() {
  return (
    <div data-testid="publications-page">
      <PageHeader
        testid="publications-header"
        kicker="On record"
        title={
          <>
            Publications, <span className="italic text-white/60">bound in ink</span>
          </>
        }
        sub="Journals, lab reports and reading-circle notes produced by the department's students."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-32 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
        {PUBLICATIONS.map((p, i) => (
          <ContentCard key={p.id} item={p} index={i} prefix="publication" />
        ))}
      </div>
    </div>
  );
}
