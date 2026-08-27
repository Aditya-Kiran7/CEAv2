import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export const ContentCard = ({ item, index, prefix, aspect = "aspect-[4/3]", label }) => (
  <Reveal whoosh={false}>
    <a
      href={item.link || "#"}
      data-testid={`${prefix}-card-${index}`}
      className="group block"
    >
      <div className={`relative overflow-hidden border border-white/10 bg-white/5 ${aspect}`}>
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (item.imageFallback) e.currentTarget.src = item.imageFallback;
          }}
          className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
          {label || `${String(index + 1).padStart(2, "0")}`}
        </span>
        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="mt-5">
        <h3 className="font-serif text-2xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#FFD1DC]">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.25em] text-white/40">
          {item.date || item.tag || item.venue}
        </p>
        {item.blurb && (
          <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-white/50">
            {item.blurb}
          </p>
        )}
      </div>
    </a>
  </Reveal>
);
