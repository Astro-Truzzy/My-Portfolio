"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createParticles(count: number): Particle[] {
  const rand = mulberry32(0x51a7);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    let u = rand();
    if (rand() < 0.48) u *= u;
    const r = Math.cbrt(u);
    const sinPhi = Math.sin(phi);

    particles.push({
      x: r * sinPhi * Math.cos(theta),
      y: r * sinPhi * Math.sin(theta) * 0.84,
      z: r * Math.cos(phi),
      size: 0.32 + rand() * 1.25,
      phase: rand() * Math.PI * 2,
    });
  }

  return particles;
}

function makeSprite(rgb: string) {
  const sprite = document.createElement("canvas");
  sprite.width = 16;
  sprite.height = 16;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;

  const glow = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  glow.addColorStop(0, `rgba(${rgb}, 1)`);
  glow.addColorStop(0.38, `rgba(${rgb}, 1)`);
  glow.addColorStop(0.62, `rgba(${rgb}, 0.28)`);
  glow.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 16, 16);
  return sprite;
}

function countForWidth(width: number) {
  if (width < 640) return 480;
  if (width < 1024) return 980;
  return 1680;
}

export function ParticleField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const bright = makeSprite("243, 239, 230");
    const dark = makeSprite("26, 18, 20");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let count = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let inView = true;
    let light = document.documentElement.getAttribute("data-theme") === "light";
    let rotX = 0.16;
    let rotY = 0.55;
    let mouseX = 0;
    let mouseY = 0;
    let targetMX = 0;
    let targetMY = 0;
    let last = performance.now();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const next = countForWidth(width);
      if (next !== count) {
        count = next;
        particles = createParticles(count);
      }
    };

    const draw = (time: number) => {
      const dt = Math.min(40, time - last);
      last = time;
      const still = reduceMq.matches;

      if (!still) {
        rotY += dt * 0.00011;
        rotX += dt * 0.000026;
        mouseX += (targetMX - mouseX) * 0.04;
        mouseY += (targetMY - mouseY) * 0.04;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = light ? "multiply" : "lighter";

      const rx = width * 0.48;
      const ry = height * 0.44;
      const rz = Math.min(width, height) * 0.5;
      const fov = 780;
      const cx = width * 0.54;
      const cy = height * 0.46;
      const ax = rotX + mouseY * 0.42;
      const ay = rotY + mouseX * 0.55;
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const sprite = light ? dark : bright;
      const twinkle = still ? 0 : 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = fov / (fov + z2 * rz * 1.15 + rz);
        if (depth <= 0) continue;

        const size = p.size * depth * (width < 640 ? 1.05 : 1.18);
        if (size < 0.35) continue;

        const pulse = twinkle
          ? 0.86 + Math.sin(time * 0.0014 + p.phase) * 0.14
          : 0.92;
        const falloff = 0.22 + (z2 + 1) * 0.4;
        ctx.globalAlpha = Math.max(0.08, Math.min(0.95, falloff * pulse * depth));
        ctx.drawImage(
          sprite,
          cx + x1 * rx * depth - size,
          cy + y1 * ry * depth - size,
          size * 2,
          size * 2,
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (time: number) => {
      if (!running) return;
      if (inView && !document.hidden) draw(time);
      if (!reduceMq.matches) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (reduceMq.matches) {
        draw(last);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (event: PointerEvent) => {
      if (!pointerMq.matches) return;
      targetMX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onPointerLeave = () => {
      targetMX = 0;
      targetMY = 0;
    };

    const onTheme = () => {
      light = document.documentElement.getAttribute("data-theme") === "light";
      if (reduceMq.matches) draw(performance.now());
    };

    const onVisibility = () => {
      if (!document.hidden) start();
    };

    const onMotion = () => start();

    resize();

    let idleId = 0;
    let idleTimer = 0;
    const kickoff = () => {
      if (running) start();
    };
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(kickoff, { timeout: 400 });
    } else {
      idleTimer = window.setTimeout(kickoff, 1);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) start();
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("tw-theme", onTheme);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMq.addEventListener("change", onMotion);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(idleTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("tw-theme", onTheme);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hero-particle-field"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
