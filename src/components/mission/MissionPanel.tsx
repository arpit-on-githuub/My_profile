import { motion } from 'framer-motion';
import { useGameStore, levelTitle } from '../../store/useGameStore';
import { SECTIONS } from '../../data/sections';
import { BADGES } from '../../data/badges';
import { coachHint } from '../../lib/ai';
import { executeCommand } from '../../lib/commands';
import ProgressBar from '../ui/ProgressBar';
import Pill from '../ui/Pill';
import { cn } from '../../lib/utils';

export default function MissionPanel() {
  const level = useGameStore((s) => s.level);
  const xp = useGameStore((s) => s.xp);
  const badges = useGameStore((s) => s.badges);
  const unlocked = useGameStore((s) => s.unlocked);
  const unlockedCount = useGameStore((s) => s.unlockedCount());
  const progressPct = useGameStore((s) => s.progressPct());

  const xpIntoLevel = xp % 120;
  const hint = coachHint(unlockedCount, false);
  const nextQuest = SECTIONS.find((s) => !unlocked[s.id]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* HUD */}
      <div className="glass-strong rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-faint">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--acc-rgb))]" />
            MISSION CONTROL
          </div>
          <Pill tone="accent">{progressPct}% complete</Pill>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="font-display text-2xl font-bold leading-none">
              Level <span className="text-gradient">{level}</span>
            </div>
            <div className="mt-1 font-mono text-xs text-muted">{levelTitle(level)}</div>
          </div>
          <div className="text-right font-mono text-xs text-faint">
            <div className="text-acc">{xp} XP</div>
            <div>{unlockedCount}/{SECTIONS.length} unlocked</div>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar value={(xpIntoLevel / 120) * 100} height={6} />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
            <span>{xpIntoLevel}/120 to next level</span>
            <span>{120 - xpIntoLevel} XP left</span>
          </div>
        </div>
      </div>

      {/* Current challenge */}
      <div className="border-animated rounded-2xl p-[1px]">
        <div className="rounded-2xl bg-[var(--bg-1)]/80 p-4">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-faint">
            Current Challenge
          </div>
          {nextQuest ? (
            <>
              <div className="font-display text-lg font-semibold">{nextQuest.quest}</div>
              <p className="mt-1 text-sm text-muted">
                Type{' '}
                <button
                  onClick={() => executeCommand(nextQuest.command)}
                  className="rounded-md border border-[rgba(var(--acc-rgb),0.35)] bg-[rgba(var(--acc-rgb),0.08)] px-1.5 py-0.5 font-mono text-xs text-acc hover:brightness-125"
                >
                  {nextQuest.command}
                </button>{' '}
                in the terminal to unlock <strong>{nextQuest.title}</strong>.
              </p>
            </>
          ) : (
            <>
              <div className="font-display text-lg font-semibold text-acc">100% Complete 🏁</div>
              <p className="mt-1 text-sm text-muted">
                Every section unlocked. Try a secret command, or <button onClick={() => executeCommand('contact me')} className="text-acc underline-offset-2 hover:underline">contact me</button>.
              </p>
            </>
          )}
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/[0.03] p-2.5 text-xs text-faint">
            <span className="text-acc">⌬</span>
            <span>{hint}</span>
          </div>
        </div>
      </div>

      {/* Quest log */}
      <div className="glass-strong flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-faint">Quest Log</span>
          <span className="font-mono text-[11px] text-acc">{unlockedCount}/{SECTIONS.length}</span>
        </div>
        <div className="no-scrollbar -mr-2 space-y-1 overflow-y-auto pr-2">
          {SECTIONS.map((s, i) => {
            const done = !!unlocked[s.id];
            return (
              <motion.button
                key={s.id}
                onClick={() => executeCommand(s.command)}
                whileHover={{ x: 3 }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors',
                  done
                    ? 'border-[rgba(var(--acc-rgb),0.25)] bg-[rgba(var(--acc-rgb),0.06)]'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-md font-mono text-xs',
                    done ? 'bg-[rgb(var(--acc-rgb))] text-[var(--bg-0)]' : 'bg-white/5 text-faint',
                  )}
                >
                  {done ? '✓' : s.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.title}</span>
                  <span className="block truncate font-mono text-[11px] text-faint group-hover:text-muted">
                    {s.command}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-faint">{String(i + 1).padStart(2, '0')}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="glass-strong rounded-2xl border border-white/10 p-4">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
          Badges · {badges.length}/{Object.keys(BADGES).length}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(BADGES).map((b) => {
            const earned = badges.includes(b.id);
            return (
              <div
                key={b.id}
                title={`${b.name} — ${b.desc}`}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-lg border text-base transition-all',
                  earned
                    ? 'border-[rgba(var(--acc-rgb),0.4)] bg-[rgba(var(--acc-rgb),0.1)] glow-acc'
                    : 'border-white/8 bg-white/[0.02] grayscale opacity-40',
                )}
              >
                {b.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
