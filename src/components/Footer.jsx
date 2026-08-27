import { Instagram, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { SITE } from "../data/site";
import { Reveal } from "./Reveal";

export const Footer = () => (
  <footer
    data-testid="site-footer"
    className="relative border-t border-white/5"
  >
    <div className="mx-auto max-w-7xl px-6 pb-10 pt-24 lg:px-12 lg:pt-32">
      <Reveal>
        <h2 className="font-serif text-4xl font-light leading-tight text-white sm:text-5xl">
          Let's build <span className="italic text-white/60">what lasts.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-14 md:grid-cols-2">
        <div data-testid="footer-contact" className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Contact</p>
          <a
            data-testid="contact-email"
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-3 break-all text-lg font-light text-white/80 transition-colors duration-300 hover:text-[#FFD1DC]"
          >
            <Mail size={16} className="text-white/40" /> {SITE.email}
          </a>
          <p className="flex items-center gap-3 text-lg font-light text-white/80">
            <Phone size={16} className="text-white/40" /> {SITE.phone}
          </p>
          <p className="flex max-w-sm items-start gap-3 text-sm font-light leading-relaxed text-white/50">
            <MapPin size={16} className="mt-1 shrink-0 text-white/40" /> {SITE.office}
          </p>
        </div>

        <div className="space-y-5 md:justify-self-end">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Elsewhere</p>
          <div className="flex flex-col items-start gap-4">
            <a
              data-testid="instagram-link"
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 hover:border-[#FFD1DC]/60 hover:text-white"
            >
              <Instagram size={14} />
              Instagram
              <ExternalLink size={12} className="opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
            <a
              data-testid="iitb-link"
              href={SITE.iitbCivil}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 hover:border-[#FFD1DC]/60 hover:text-white"
            >
              <ExternalLink size={14} />
              Official — Civil, IIT Bombay
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-3 border-t border-white/5 pt-6 text-[10px] uppercase tracking-[0.3em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {SITE.shortName} · {SITE.name}, {SITE.institute}</p>
        <p>Built by the council · Est. {SITE.established}</p>
      </div>
    </div>
  </footer>
);
