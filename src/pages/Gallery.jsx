import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { GALLERY } from "../data/gallery";

export default function Gallery() {
  return (
    <div data-testid="gallery-page">
      <PageHeader
        testid="gallery-header"
        kicker="In frames"
        title={
          <>
            Gallery of <span className="italic text-white/60">dust & daylight</span>
          </>
        }
        sub="Moments from fests, events and special occasions!!"
      />
      {/* Masonry: each photo keeps its own natural shape, nothing is cropped. */}
      <div
        data-testid="gallery-grid"
        className="mx-auto max-w-7xl columns-2 gap-4 px-6 pb-32 md:columns-3 lg:px-12"
      >
        {GALLERY.map((g, i) => (
          <Reveal key={g.id} whoosh={false} className="mb-4 break-inside-avoid">
            <figure
              data-testid={`gallery-item-${i}`}
              className="group relative w-full overflow-hidden border border-white/10 bg-white/5"
            >
              <img
                src={g.image}
                alt={g.caption}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  if (g.imageFallback) e.currentTarget.src = g.imageFallback;
                }}
                className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 bg-black/45 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/80 opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {g.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}