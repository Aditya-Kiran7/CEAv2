import { useEffect, useRef } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const COUNT = 7;
const GLOW_RADIUS = 220;

export const PetalCanvas = () => {
  const canvasRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return; // skip entirely on mobile — no canvas, no animation loop

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseout", onLeave);

    const spawn = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -40 - Math.random() * 60,
      size: 6 + Math.random() * 8,
      vy: 0.35 + Math.random() * 0.75,
      sway: 0.4 + Math.random() * 0.8,
      freq: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      alpha: 0.3 + Math.random() * 0.45,
      glow: 0,
    });

    const petals = Array.from({ length: COUNT }, () => spawn(true));

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.glow > 0.02) {
        const r = p.size * (3 + p.glow * 3);
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        halo.addColorStop(0, `rgba(255, 205, 70, ${0.5 * p.glow})`);
        halo.addColorStop(0.5, `rgba(255, 230, 170, ${0.18 * p.glow})`);
        halo.addColorStop(1, "rgba(255, 230, 170, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.rotate(p.rot);
      const s = p.size;
      const boost = 1 + p.glow * 0.9;
      const g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, `rgba(255, 205, 70, ${Math.min(1, p.alpha * boost)})`);
      g.addColorStop(1, `rgba(255, 248, 230, ${Math.min(1, p.alpha * 0.8 * boost)})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.9, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.9, s * 0.5, -s * 0.9, -s * 0.7, 0, s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.x += Math.sin(t * p.freq + p.phase) * p.sway;
        p.rot += p.spin;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const target = dist < GLOW_RADIUS ? 1 - dist / GLOW_RADIUS : 0;
        p.glow += (target - p.glow) * 0.12;

        if (p.y > h + 50 || p.x < -60 || p.x > w + 60) petals[i] = spawn(false);
        drawPetal(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="petal-canvas"
      className="pointer-events-none fixed inset-0 z-[45]"
    />
  );
};