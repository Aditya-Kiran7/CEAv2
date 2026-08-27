export const Marquee = ({ items, className = "" }) => {
  const row = items.join("   ·   ") + "   ·   ";
  return (
    <div
      data-testid="marquee"
      className={`overflow-hidden border-y border-white/5 py-6 ${className}`}
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <span
            key={k}
            aria-hidden={k === 1}
            className="pr-2 font-serif text-2xl font-light italic tracking-wide text-white/30 md:text-3xl"
          >
            {row.repeat(4)}
          </span>
        ))}
      </div>
    </div>
  );
};
