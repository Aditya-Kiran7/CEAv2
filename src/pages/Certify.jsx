import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, XCircle, ArrowLeft, Search } from "lucide-react";
import certificates from "../data/certificate";

export default function Certify() {
  const location = useLocation();
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [searched, setSearched] = useState(false);

  const verify = (id) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) {
      setCertificate(null);
      setSearched(false);
      return;
    }
    const found = certificates.find((c) => c.id.toUpperCase() === cleanId);
    setCertificate(found || null);
    setSearched(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get("id");
    if (idFromUrl) {
      setCertificateId(idFromUrl);
      verify(idFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verify(certificateId);
  };

  return (
    <div
      data-testid="verify-page"
      className="relative min-h-screen bg-[#050508] px-6 pb-24 pt-28 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,209,220,0.08) 0%, transparent 60%)",
        }}
      />
      <Link
        to="/"
        data-testid="verify-home-link"
        className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-[#050508]/60 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-xl transition-colors duration-300 hover:border-[#FFD1DC]/60 hover:text-white"
      >
        <ArrowLeft size={13} />
        Home
      </Link>

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-white/40">
            <span className="h-px w-10 bg-[#FFD1DC]/60" />
            CEA · IIT Bombay
          </p>
          <h1 className="mt-6 font-serif text-4xl font-light leading-none tracking-tight text-white sm:text-5xl">
            Certificate <span className="italic text-white/60">Verification</span>
          </h1>
          <p className="mt-5 max-w-md text-base font-light leading-relaxed text-white/50">
            Scan takes you here automatically. Or enter a certificate ID to verify
            its authenticity against the official CEA records.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col gap-3 sm:flex-row"
        >
          <input
            data-testid="verify-input"
            type="text"
            value={certificateId}
            onChange={(e) => {
              setCertificateId(e.target.value);
              setSearched(false);
            }}
            placeholder="e.g. CEA26-AC0001"
            className="w-full rounded-full border border-white/15 bg-white/5 px-6 py-4 text-base font-light tracking-wide text-white placeholder-white/30 outline-none backdrop-blur-md transition-colors duration-300 focus:border-[#FFD1DC]/60"
          />
          <button
            data-testid="verify-submit"
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full border border-[#FFD1DC]/40 bg-[#FFD1DC]/10 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-[#FFD1DC]/20"
          >
            <Search size={14} />
            Verify
          </button>
        </motion.form>

        {searched && certificate && (
          <motion.div
            data-testid="verify-success"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-emerald-400/20 px-7 py-5">
              <BadgeCheck className="text-emerald-400" size={22} />
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/90">
                Certificate Verified
              </p>
            </div>
            <dl className="divide-y divide-white/5 px-7 py-2">
              {[
                ["Name", certificate.name],
                ["Event", certificate.event],
                ["ID", certificate.id],
                ["Date", certificate.date],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {k}
                  </dt>
                  <dd
                    data-testid={`verify-field-${k.toLowerCase()}`}
                    className="text-right font-serif text-lg font-light text-white"
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}

        {searched && !certificate && (
          <motion.div
            data-testid="verify-failure"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 rounded-2xl border border-red-400/30 bg-red-400/[0.06] px-7 py-8 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <XCircle className="text-red-400" size={22} />
              <p className="text-xs uppercase tracking-[0.3em] text-red-300/90">
                Certificate Not Found
              </p>
            </div>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/55">
              No certificate with this ID exists in the official CEA records. Please
              check the ID and try again.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
