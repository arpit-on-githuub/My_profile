import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, type Project } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import { useGameStore } from '../../store/useGameStore';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import Pill from '../ui/Pill';
import TiltCard from '../ui/TiltCard';
import ProjectShowcase from './ProjectShowcase';
import { cn } from '../../lib/utils';

const ROLES = ['all', 'fullstack', 'frontend', 'backend', 'ai'] as const;

export default function Projects() {
  const def = SECTION_MAP.projects;
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<(typeof ROLES)[number]>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const focusProject = useGameStore((s) => s.focusProject);
  const setFocusProject = useGameStore((s) => s.setFocusProject);

  useEffect(() => {
    if (focusProject) {
      const p = projects.find((x) => x.id === focusProject);
      if (p) setSelected(p);
      setFocusProject(null);
    }
  }, [focusProject, setFocusProject]);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects.filter((p) => {
      const roleOk = role === 'all' || p.roles.includes(role as never);
      const text = `${p.name} ${p.tagline} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
      return roleOk && (!q || text.includes(q));
    });
  }, [query, role]);

  return (
    <SectionShell id="projects">
      <SectionHeading
        index="05"
        icon={def.icon}
        title="Build Log"
        command={def.command}
        blurb="Hover a featured build to preview it, search by tech, or click any card to inspect."
      />

      {/* Featured list with cursor-following preview */}
      <ProjectShowcase items={featured} onSelect={setSelected} />

      {/* controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-faint">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep projects… (e.g. 'realtime', 'react', 'c++', 'ml')"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 font-mono text-sm text-fg placeholder:text-faint focus:border-[rgba(var(--acc-rgb),0.5)] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors',
                role === r
                  ? 'border-[rgba(var(--acc-rgb),0.5)] bg-[rgba(var(--acc-rgb),0.12)] text-acc'
                  : 'border-white/10 text-muted hover:text-fg',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center font-mono text-sm text-faint">
          // no matches. even the best grep returns empty sometimes.
        </div>
      )}

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </SectionShell>
  );
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.05 }}
    >
      <TiltCard className="group h-full" max={8}>
        <button
          onClick={onClick}
          aria-label={`Inspect ${project.name}`}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur transition-colors hover:border-white/20"
        >
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: project.accent }}
          />
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="grid h-9 w-9 place-items-center rounded-lg font-mono text-sm font-bold"
                style={{ background: `${project.accent}22`, color: project.accent }}
              >
                {project.name[0]}
              </span>
              <div>
                <h3 className="font-display text-base font-bold leading-tight">{project.name}</h3>
                <span className="font-mono text-[11px] text-faint">{project.year}</span>
              </div>
            </div>
            {project.featured && <Pill tone="accent">★ featured</Pill>}
          </div>

          <p className="mb-4 text-sm text-muted">{project.tagline}</p>

          <div className="mt-auto">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/8 pt-3">
              <div className="flex gap-3 font-mono text-[11px] text-faint">
                {project.metrics.slice(0, 2).map((m) => (
                  <span key={m.label}>
                    <span style={{ color: project.accent }}>{m.value}</span> {m.label}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-acc opacity-0 transition-opacity group-hover:opacity-100">
                inspect →
              </span>
            </div>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} details`}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/12 bg-[var(--bg-1)]/95 p-6 sm:p-8"
            style={{ boxShadow: `0 0 60px ${project.accent}33` }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-faint hover:text-fg"
            >
              ✕
            </button>

            <div className="mb-1 font-mono text-xs" style={{ color: project.accent }}>
              {project.year} · {project.roles.join(' / ')}
            </div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">{project.name}</h3>
            <p className="mt-1 text-muted">{project.tagline}</p>

            <p className="mt-4 text-sm leading-relaxed text-[var(--fg)]/90">{project.description}</p>

            <div className="mt-5 rounded-xl border p-4"
              style={{ borderColor: `${project.accent}44`, background: `${project.accent}10` }}>
              <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest"
                style={{ color: project.accent }}>
                <span>⌬</span> AI summary
              </div>
              <p className="text-sm text-[var(--fg)]/85">{project.aiSummary}</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                  <div className="font-display text-base font-bold" style={{ color: project.accent }}>
                    {m.value}
                  </div>
                  <div className="font-mono text-[10px] text-faint">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-faint">Highlights</div>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span style={{ color: project.accent }}>▸</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.links
                .filter((l) => l.url && l.url !== '#')
                .map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl px-4 py-2 font-mono text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{ background: project.accent, color: '#05060a' }}
                  >
                    {l.label} ↗
                  </a>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
