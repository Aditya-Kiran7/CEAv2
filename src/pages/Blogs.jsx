import { PageHeader } from "../components/PageHeader";
import { ContentCard } from "../components/ContentCard";
import { BLOGS } from "../data/blogs";

export default function Blogs() {
  return (
    <div data-testid="blogs-page">
      <PageHeader
        testid="blogs-header"
        kicker="Field notes"
        title={
          <>
            Blogs from <span className="italic text-white/60">the site office</span>
          </>
        }
        sub="Essays, site diaries and explainers written by students who would rather be outdoors."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-32 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
        {BLOGS.map((b, i) => (
          <ContentCard key={b.id} item={b} index={i} prefix="blog" label={b.readTime} />
        ))}
      </div>
    </div>
  );
}
