import { motion } from 'framer-motion';
import { useGameStore, THEME_LABELS, type ThemeId } from '../store/useGameStore';
import { SECTIONS } from '../data/sections';
import { executeCommand } from '../lib/commands';

export default function Nav() {
  const unlocked = useGameStore((s) => s.unlocked);
  const level = useGameStore((s) => s.level);
  const progressPct = useGameStore((s) => s.progressPct());
  const theme = useGameStore((s) => s.theme);
  const cycleTheme = useGameStore((s) => s.cycleTheme);

  const unlockedSections = SECTIONS.filter((s) => unlocked[s.id]);

  const scrollTo = (id: string) =>
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <header className="sticky top-0 z-[90] border-b border-white/8 bg-[var(--bg-0)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(var(--acc-rgb),0.4)] bg-[rgba(var(--acc-rgb),0.08)] font-mono text-sm font-bold text-acc">
            ◉
          </span>
          <span className="font-display text-sm font-bold tracking-tight">
            <span className="text-gradient">arpit.exe</span>
            <span className="ml-2 hidden font-mono text-[11px] font-normal text-faint sm:inline">
              // playable portfolio
            </span>
          </span>
        </button>

        {/* unlocked section nav */}
        <nav className="no-scrollbar mx-auto hidden max-w-[44vw] items-center gap-1 overflow-x-auto md:flex">
          {unlockedSections.length === 0 && (
            <span className="font-mono text-[11px] text-faint">// unlock sections to populate nav</span>
          )}
          {unlockedSections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:bg-white/5 hover:text-acc"
            >
              {s.icon} {s.title}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* progress mini */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, rgb(var(--acc-rgb)), rgb(var(--acc2-rgb)))' }}
                animate={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-faint">{progressPct}%</span>
          </div>

          <span className="rounded-lg border border-[rgba(var(--acc-rgb),0.3)] bg-[rgba(var(--acc-rgb),0.08)] px-2 py-1 font-mono text-[11px] text-acc">
            LVL {level}
          </span>

          <button
            onClick={cycleTheme}
            title={`Theme: ${THEME_LABELS[theme as ThemeId]} (click to cycle)`}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-sm transition-colors hover:border-[rgba(var(--acc-rgb),0.4)] hover:text-acc"
          >
            ◐
          </button>

          <button
            onClick={() => executeCommand('contact me')}
            className="hidden rounded-lg bg-[rgb(var(--acc-rgb))] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--bg-0)] transition-transform hover:-translate-y-0.5 sm:block"
          >
            hire me
          </button>
        </div>
      </div>
    </header>
  );
}
