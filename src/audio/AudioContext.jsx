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
  // Intro audio is handled by the video itself.
  // No separate intro.mp3 is played.
}, []);

  const startBgm = useCallback(() => {
  // Map BGM disabled.
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