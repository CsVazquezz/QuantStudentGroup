"use client";
import { useEffect, useRef } from "react";

const CHARS = ["Σ", "∫", "α", "∂", "π", "∞", "Δ", "σ", "μ", "∇", "λ", "θ", "β", "√", "φ", "ε", "ρ", "ω"];

export default function FloatingMath() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    type Sym = {
      el: HTMLSpanElement;
      x: number; y: number;
      dx: number; dy: number;
      rot: number; drot: number;
    };

    const syms: Sym[] = CHARS.map(char => {
      const el = document.createElement("span");
      el.textContent = char;
      const size = rand(1.3, 2.2);
      Object.assign(el.style, {
        position: "absolute",
        top: "0", left: "0",
        fontFamily: "Georgia, serif",
        fontSize: `${size}rem`,
        color: "rgba(15,23,42,0.13)",
        lineHeight: "1",
        willChange: "transform",
      });
      container.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const speed = rand(22, 45);
      return {
        el,
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        rot: rand(0, 360),
        drot: rand(10, 22) * (Math.random() < 0.5 ? 1 : -1),
      };
    });

    let last = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const vW = window.innerWidth;
      const vH = window.innerHeight;

      for (const s of syms) {
        s.x += s.dx * dt;
        s.y += s.dy * dt;
        s.rot += s.drot * dt;

        if (s.x < 0)  { s.x = 0;  s.dx =  Math.abs(s.dx); }
        if (s.x > vW) { s.x = vW; s.dx = -Math.abs(s.dx); }
        if (s.y < 0)  { s.y = 0;  s.dy =  Math.abs(s.dy); }
        if (s.y > vH) { s.y = vH; s.dy = -Math.abs(s.dy); }

        s.el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot.toFixed(1)}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      syms.forEach(s => s.el.remove());
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    />
  );
}
