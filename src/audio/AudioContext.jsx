import { createContext, useCallback, useContext, useRef, useState } from "react";

const AudioCtx = createContext(null);
export const useAudio = () => useContext(AudioCtx);

const BGM_SOURCES = ["/audio/map.mp3", "/audio/map.wav"]; // falls back if mp3 missing

const ramp = (el, to, ms, done) => {
  const from = el.volume;
  const steps = 24;
  let s = 0;
  const iv = setInterval(() => {
    s += 1;
    try {
      el.volume = Math.max(0, Math.min(1, from + (to - from) * (s / steps)));
    } catch (e) { /* noop */ }
    if (s >= steps) {
      clearInterval(iv);
      if (done) done();
    }
  }, ms / steps);
};

export const AudioProvider = ({ children }) => {
  const bgmRef = useRef(null);
  const introRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);

  const startIntro = useCallback(() => {
    if (introRef.current || bgmRef.current) return;
    const el = new Audio("/audio/intro.mp3");
    el.loop = true;
    el.volume = 0;
    introRef.current = el;
    el.play()
      .then(() => ramp(el, 0.7, 1200))
      .catch(() => {});
  }, []);

  const startBgm = useCallback(() => {
    if (bgmRef.current) return;
    const el = new Audio(BGM_SOURCES[0]);
    el.loop = true;
    el.volume = 0;
    let tried = 0;
    el.addEventListener("error", () => {
      tried += 1;
      if (tried < BGM_SOURCES.length) {
        el.src = BGM_SOURCES[tried];
        el.play().catch(() => {});
      }
    });
    bgmRef.current = el;
    el.play()
      .then(() => ramp(el, 0.7, 1800))
      .catch(() => {
        const resume = () => {
          el.play()
            .then(() => ramp(el, 0.7, 1200))
            .catch(() => {});
          ["pointerdown", "wheel", "keydown", "touchstart"].forEach((ev) =>
            window.removeEventListener(ev, resume)
          );
        };
        ["pointerdown", "wheel", "keydown", "touchstart"].forEach((ev) =>
          window.addEventListener(ev, resume, { passive: true })
        );
      });
  }, []);

  const enter = useCallback(() => {
    if (introRef.current) {
      const intro = introRef.current;
      ramp(intro, 0, 1100, () => intro.pause());
    }
    startBgm();
    setEntered(true);
  }, [startBgm]);

  const toggleMute = useCallback(() => {
    if (!entered) {
      enter();
      return;
    }
    setMuted((m) => {
      const next = !m;
      if (bgmRef.current) bgmRef.current.muted = next;
      if (introRef.current) introRef.current.muted = next;
      return next;
    });
  }, [entered, enter]);

  return (
    <AudioCtx.Provider value={{ entered, enter, startBgm, startIntro, muted, toggleMute }}>
      {children}
    </AudioCtx.Provider>
  );
};