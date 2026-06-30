import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/utils';

/** Ambient gradient orbs + grid + drifting particles behind everything. */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-0)]">
      {/* deep base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 800px at 12% -10%, rgba(var(--acc-rgb),0.16), transparent 60%),' +
            'radial-gradient(1000px 700px at 100% 0%, rgba(var(--acc2-rgb),0.16), transparent 55%),' +
            'radial-gradient(900px 900px at 50% 120%, rgba(var(--acc-rgb),0.10), transparent 60%)',
        }}
      />
      {/* moving grid */}
      <div className="absolute inset-0 grid-bg opacity-60 mask-fade-b" />

      {/* floating orbs */}
      <div className="absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, rgba(var(--acc-rgb),0.22), transparent 65%)' }} />
      <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, rgba(var(--acc2-rgb),0.20), transparent 65%)', animationDelay: '1.5s' }} />
      <div className="absolute bottom-[-12rem] left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, rgba(var(--acc-rgb),0.14), transparent 65%)', animationDelay: '3s' }} />

      <ParticleCanvas />

      {/* vignette + noise */}
      <div className="absolute inset-0 noise opacity-[0.05] mix-blend-soft-light" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(0,0,0,0.55))' }} />
    </div>
  );
}

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const count = Math.min(70, Math.floor((w * h) / 26000));

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--acc-rgb').trim() || '94,234,212';

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.2,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = accent();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`;
        ctx.fill();
      }
      // subtle connective lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 13000) {
            ctx.strokeStyle = `rgba(${rgb},${0.05 * (1 - dist / 13000)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-70" aria-hidden />;
}
