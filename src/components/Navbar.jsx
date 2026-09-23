import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../audio/AudioContext";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Blogs", to: "/blogs" },
  { label: "Council", to: "/council" },
  { label: "Gallery", to: "/gallery" },
  { label: "Publications", to: "/publications" },
  { label: "Map", to: "/map" },
];

export const Navbar = () => {
  const { muted, toggleMute } = useAudio();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header
        data-testid="navbar"
        className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050508]/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-12">
          <Link
          to="/"
          data-testid="navbar-logo"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/cea/logo.png"
            alt="CEA Logo"
            className="h-8 w-auto lg:h-9"
          />
          <span className="font-serif text-2xl italic tracking-wide text-white transition-colors duration-300 group-hover:text-[#FFD1DC]">
            CEA
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.35em] text-white/40 sm:block">
            IIT Bombay
          </span>
        </Link>
          <nav className="hidden items-center gap-8 md:flex" data-testid="nav-links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative py-1 text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/45 hover:text-white/80"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-[#FFD1DC]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="audio-toggle-button"
              onClick={toggleMute}
              aria-label="Toggle background music"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-white"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              data-testid="mobile-menu-button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:text-white md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#050508]/95 px-8 backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  className={`block border-b border-white/5 py-5 font-serif text-4xl font-light ${
                    location.pathname === l.to ? "italic text-[#FFD1DC]" : "text-white/85"
                  }`}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
