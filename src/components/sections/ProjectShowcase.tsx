import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import type { Project } from '../../data/portfolio';
import { prefersReducedMotion } from '../../lib/utils';

/** Big-typography featured list. On hover, a mock app-window preview follows the cursor. */
export default function ProjectShowcase({
  items,
  onSelect,
}: {
  items: Project[];
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.5 });
  const y = useSpring(my, { stiffness: 350, damping: 30, mass: 0.5 });

  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const enabled = fine && !prefersReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <div
      onMouseMove={onMove}
      className="relative mb-10 border-t border-white/10"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((p, i) => (
        <button
          key={p.id}
          onMouseEnter={() => setHovered(p)}
          onClick={() => onSelect(p)}
          className="group/item relative flex w-full items-center gap-4 border-b border-white/10 py-5 text-left transition-colors sm:py-7"
        >
          {/* sweep fill on hover */}
          <span
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 opacity-0 transition-all duration-500 group-hover/item:scale-x-100 group-hover/item:opacity-100"
            style={{ background: `linear-gradient(90deg, ${p.accent}14, transparent 70%)` }}
          />
          <span className="relative z-10 font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
          <span className="relative z-10 min-w-0 flex-1">
            <span
              className="block truncate font-display text-2xl font-extrabold tracking-tight transition-transform duration-300 group-hover/item:translate-x-2 sm:text-4xl"
              style={{ color: 'var(--fg)' }}
            >
              <span className="transition-colors duration-300 group-hover/item:[color:var(--hl)]" style={{ ['--hl' as string]: p.accent }}>
                {p.name}
              </span>
            </span>
            <span className="mt-1 block truncate font-mono text-xs text-faint sm:text-sm">{p.tagline}</span>
          </span>
          <span className="relative z-10 hidden gap-1.5 md:flex">
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </span>
          <span
            className="relative z-10 font-mono text-lg opacity-0 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:opacity-100"
            style={{ color: p.accent }}
          >
            ↗
          </span>
        </button>
      ))}

      {enabled &&
        createPortal(
          <motion.div className="pointer-events-none fixed left-0 top-0 z-[70]" style={{ x, y }}>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.id}
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="ml-7 -translate-y-1/2"
                >
                  <ProjectMock project={hovered} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>,
          document.body,
        )}
    </div>
  );
}

/** A stylized "app window" mock, tinted by the project accent. */
function ProjectMock({ project }: { project: Project }) {
  return (
    <div
      className="w-72 overflow-hidden rounded-xl border border-white/15 bg-[var(--bg-1)] shadow-2xl"
      style={{ boxShadow: `0 24px 60px ${project.accent}40` }}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[10px] text-faint">{project.id}.app</span>
      </div>
      <div className="relative h-40 p-4" style={{ background: `radial-gradient(120% 90% at 0% 0%, ${project.accent}22, transparent 60%)` }}>
        <div className="font-display text-xl font-extrabold" style={{ color: project.accent }}>
          {project.name}
        </div>
        <div className="mt-1 font-mono text-[10px] text-muted">{project.tagline}</div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-white/10" />
          <div className="h-2 w-1/2 rounded-full bg-white/10" />
          <div className="h-2 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="absolute bottom-3 left-4 flex gap-1.5">
          {project.metrics.slice(0, 2).map((m) => (
            <span
              key={m.label}
              className="rounded-md px-1.5 py-0.5 font-mono text-[9px]"
              style={{ background: `${project.accent}22`, color: project.accent }}
            >
              {m.value} {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
