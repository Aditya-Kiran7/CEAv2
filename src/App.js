import { useEffect, useRef } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AudioProvider, useAudio } from "./audio/AudioContext";
import { EnterGate } from "./components/EnterGate";
import { CursorGlow } from "./components/CursorGlow";
import { PetalCanvas } from "./components/PetalCanvas";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Blogs from "./pages/Blogs";
import Council from "./pages/Council";
import Gallery from "./pages/Gallery";
import Publications from "./pages/Publications";
import Certify from "./pages/Certify";
import MapPage from "./components/CloudCity";

const SmoothScroll = ({ children }) => {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  return children;
};

const SiteVeil = ({ children }) => {
  const { entered } = useAudio();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: entered ? 1 : 0 }}
      transition={{ duration: 1.8, delay: entered ? 1.6 : 0, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const BackToMap = () => (
  <Link
    to="/map"
    data-testid="back-to-map"
    className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-[#050508]/60 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-xl transition-colors duration-300 hover:border-[#FFD1DC]/60 hover:text-white"
  >
    <ArrowLeft size={13} />
    Map
  </Link>
);

const Chrome = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/"; // ingress may add a trailing slash
  const isMap = path === "/map";
  const isHome = path === "/" || path === "/cea"; // /cea is the legacy entry link
  return (
    <>
      {isHome && <Navbar />}
      {!isMap && !isHome && <BackToMap />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cea" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/council" element={<Council />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/publications" element={<Publications />} />
        </Routes>
      </main>
      {!isMap && <Footer />}
    </>
  );
};

// The /verify page is a standalone QR-landing route: no intro gate, no veil.
const Shell = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/verify") {
    return (
      <Routes>
        <Route path="/verify" element={<Certify />} />
      </Routes>
    );
  }
  return (
    <>
      <EnterGate />
      <CursorGlow />
      <PetalCanvas />
      <SiteVeil>
        <Chrome />
      </SiteVeil>
    </>
  );
};

function App() {
  return (
    <AudioProvider>
      <HashRouter>
        <SmoothScroll>
          <div className="min-h-screen bg-[#050508] text-white">
            <Shell />
          </div>
        </SmoothScroll>
      </HashRouter>
    </AudioProvider>
  );
}

export default App;
