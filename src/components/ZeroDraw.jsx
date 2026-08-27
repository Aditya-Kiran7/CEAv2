import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { HardHat } from "lucide-react";

const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,225,235,0.85)");
  grd.addColorStop(0.6, "rgba(255,190,210,0.22)");
  grd.addColorStop(1, "rgba(255,190,210,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

export const ZeroDraw = () => {
  const wrapRef = useRef(null);
  const mountRef = useRef(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const endOpacity = useTransform(scrollYProgress, [0.84, 0.97], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.84, 1], [36, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let w = mount.clientWidth;
    let h = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.14);
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    // Building under construction — one continuous glowing blueprint stroke
    const P = [
      [-2.8, -1.7], [3.0, -1.7], [-1.1, -1.7],           // ground line
      [-1.1, 1.1], [0.3, 1.1], [0.3, -1.7], [-0.63, -1.7], // outer columns + top beam
      [-0.63, 1.1], [-0.16, 1.1], [-0.16, -1.7], [-1.1, -1.7], // inner columns
      [-1.1, -1.14], [0.3, -1.14], [0.3, -0.58],           // floor beams, serpentine
      [-1.1, -0.58], [-1.1, -0.02], [0.3, -0.02],
      [0.3, 0.54], [-1.1, 0.54], [-1.1, 1.1], [0.3, 1.1],
      [0.3, -1.7], [1.5, -1.7],                            // travel along ground to crane
      [1.5, 1.9], [1.5, 2.15], [1.05, 1.9], [2.9, 1.9],   // crane mast, apex, tie, jib
      [2.25, 1.9], [1.5, 1.9], [1.5, -1.7],               // back down the mast
      [-1.6, -1.7],                                        // travel along ground to annex
      [-1.6, -0.9], [-2.6, -0.9], [-2.6, -1.7], [-1.6, -1.7], // annex walls
      [-1.6, -1.3], [-2.6, -1.3],                          // annex floor line
      [-2.6, -0.9], [-2.1, -0.55], [-1.6, -0.9],           // pitched roof
      [-2.1, -0.9], [-2.1, -1.7], [-2.85, -1.7],           // down + travel to tree 1
      [-2.85, -1.45], [-3.0, -1.45], [-2.85, -1.05], [-2.7, -1.45], [-2.85, -1.45], // tree 1
      [-2.85, -1.7], [2.5, -1.7],                          // ground travel to tree 2
      [2.5, -1.45], [2.35, -1.45], [2.5, -1.05], [2.65, -1.45], [2.5, -1.45], // tree 2
    ];
    const curve = new THREE.CurvePath();
    for (let i = 1; i < P.length; i++) {
      curve.add(
        new THREE.LineCurve3(
          new THREE.Vector3(P[i - 1][0], P[i - 1][1], 0),
          new THREE.Vector3(P[i][0], P[i][1], 0)
        )
      );
    }

    const coreGeo = new THREE.TubeGeometry(curve, 1200, 0.014, 8, false);
    const haloGeo = new THREE.TubeGeometry(curve, 1200, 0.055, 8, false);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffc9d6, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const group = new THREE.Group();
    group.add(new THREE.Mesh(haloGeo, haloMat));
    group.add(new THREE.Mesh(coreGeo, coreMat));
    group.position.set(-0.1, -0.25, 0);
    group.rotation.x = -0.12;
    scene.add(group);

    const glowTex = makeGlowTexture();
    const head = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    head.scale.set(1.15, 1.15, 1);
    group.add(head);

    const pCount = 320;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 3 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(ph);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.05, map: glowTex, color: 0xffd1dc, transparent: true, opacity: 0.5,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    scene.add(particles);

    // Crane hook lowering a beam as the drawing completes
    const hookMat = new THREE.MeshBasicMaterial({
      color: 0xfff0f5, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const cableGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.25, 1.9, 0),
      new THREE.Vector3(2.25, 1.9, 0),
    ]);
    const cable = new THREE.Line(
      cableGeo,
      new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.05), hookMat);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.045, 0.045), hookMat);
    beam.position.y = -0.12;
    const slingGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.035, 0), new THREE.Vector3(-0.3, -0.098, 0),
      new THREE.Vector3(0, -0.035, 0), new THREE.Vector3(0.3, -0.098, 0),
    ]);
    const sling = new THREE.LineSegments(
      slingGeo,
      new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    const hookGroup = new THREE.Group();
    hookGroup.add(block, beam, sling);
    hookGroup.position.set(2.25, 1.9, 0);
    group.add(cable, hookGroup);

    const total = coreGeo.index.count;
    let mouseX = 0;
    let mouseY = 0;
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      w = mount.clientWidth;
      h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = Math.min(1, Math.max(0, progressRef.current));
      const count = Math.floor(total * p);
      coreGeo.setDrawRange(0, count);
      haloGeo.setDrawRange(0, count);
      const hp = curve.getPointAt(Math.min(0.9999, Math.max(0.0001, p)));
      head.position.copy(hp);
      const s = 1.05 + Math.sin(t * 5) * 0.18;
      head.scale.set(s, s, 1);

      // crane lowers the beam in the final stretch
      const drop = THREE.MathUtils.smoothstep(p, 0.8, 1.0);
      const hookY = 1.9 - drop * 1.28;
      const sway = Math.sin(t * 1.1) * 0.045 * drop;
      hookGroup.position.set(2.25 + sway, hookY, 0);
      hookGroup.rotation.z = sway * 0.7;
      const cp = cable.geometry.attributes.position;
      cp.setXYZ(0, 2.25, 1.9, 0);
      cp.setXYZ(1, 2.25 + sway * 0.4, hookY + 0.035, 0);
      cp.needsUpdate = true;
      const hookVisible = p > 0.6;
      cable.visible = hookVisible;
      hookGroup.visible = hookVisible;
      group.rotation.y = t * 0.05 + p * Math.PI * 0.55;
      group.rotation.x = -0.12 + Math.sin(t * 0.3) * 0.04 + mouseY * 0.06;
      particles.rotation.y = -t * 0.02;
      camera.position.x += (mouseX * 0.55 - camera.position.x) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      coreGeo.dispose();
      haloGeo.dispose();
      pGeo.dispose();
      cableGeo.dispose();
      slingGeo.dispose();
      hookMat.dispose();
      coreMat.dispose();
      haloMat.dispose();
      glowTex.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section ref={wrapRef} data-testid="zero-draw-section" className="relative h-[560vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 62%, rgba(255,209,220,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 110%, rgba(224,231,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div ref={mountRef} className="absolute inset-0" />

        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <HardHat size={22} className="mb-4 text-white/70" />
          <p className="text-xs uppercase tracking-[0.5em] text-white/70">Watch it rise</p>
        </motion.div>

        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="font-serif text-4xl font-light italic text-white sm:text-5xl">
            Line by line, it rises.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40">
            every drawing becomes a structure
          </p>
        </motion.div>

      </div>
    </section>
  );
};
