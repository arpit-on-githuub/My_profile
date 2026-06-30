import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/utils';

/** A soft glow that trails the cursor + a tighter dot. Desktop / fine-pointer only. */
export default function CursorAura() {
  const auraRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    setEnabled(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, input, [role="button"], textarea');
      if (auraRef.current) {
        auraRef.current.style.opacity = interactive ? '0.9' : '0.55';
        auraRef.current.style.width = interactive ? '420px' : '300px';
        auraRef.current.style.height = interactive ? '420px' : '300px';
      }
    };

    const loop = () => {
      auraX += (mouseX - auraX) * 0.12;
      auraY += (mouseY - auraY) * 0.12;
      if (auraRef.current) {
        auraRef.current.style.transform = `translate(${auraX}px, ${auraY}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      <div
        ref={auraRef}
        className="absolute -ml-[150px] -mt-[150px] rounded-full blur-2xl transition-[width,height,opacity] duration-300"
        style={{
          width: 300,
          height: 300,
          background:
            'radial-gradient(circle, rgba(var(--acc-rgb),0.18), rgba(var(--acc2-rgb),0.08) 45%, transparent 70%)',
        }}
      />
      <div
        ref={dotRef}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full"
        style={{ background: 'rgb(var(--acc-rgb))', boxShadow: '0 0 12px rgba(var(--acc-rgb),0.9)' }}
      />
    </div>
  );
}
