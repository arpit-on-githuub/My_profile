import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { SECTIONS } from '../../data/sections';
import { executeCommand } from '../../lib/commands';

const UTILITIES: { cmd: string; desc: string }[] = [
  { cmd: 'help', desc: 'Show this guide' },
  { cmd: 'run portfolio()', desc: 'Unlock every section at once' },
  { cmd: 'ask <question>', desc: 'Talk to the AI guide' },
  { cmd: 'inspect stack', desc: 'Quick tech rundown' },
  { cmd: 'theme', desc: 'Cycle the colour theme' },
  { cmd: 'progress', desc: 'Show your level & completion' },
  { cmd: 'clear', desc: 'Clear the terminal' },
];

export default function HelpModal() {
  const open = useGameStore((s) => s.helpOpen);
  const setOpen = useGameStore((s) => s.setHelpOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const tryCommand = (cmd: string) => {
    const clean = cmd.replace(/\s*<.*?>/, '').trim();
    setOpen(false);
    // Scroll to the terminal so the user sees the result, then run it.
    document.getElementById('section-home')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => executeCommand(clean === 'ask' ? 'help' : clean), 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[160] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="How to play"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/12 bg-[var(--bg-1)]/95 p-6 sm:p-8"
            style={{ boxShadow: '0 0 60px rgba(var(--acc-rgb),0.25)' }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-faint hover:text-fg"
            >
              ✕
            </button>

            <div className="mb-1 font-mono text-xs text-acc">// how to play</div>
            <h3 className="font-display text-2xl font-bold">This portfolio is a game 🎮</h3>
            <p className="mt-2 text-sm text-muted">
              There's a terminal near the top of the page. Type a command to unlock a section —
              or click any command below and I'll run it for you. Stuck? Type{' '}
              <span className="font-mono text-acc">ask &lt;question&gt;</span> to chat with the AI guide.
            </p>

            <div className="mt-6">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-faint">
                Unlock sections
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => tryCommand(s.command)}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:border-[rgba(var(--acc-rgb),0.4)]"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-white/5 text-xs text-acc">
                      {s.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs text-acc">{s.command}</span>
                      <span className="block truncate text-[11px] text-faint">{s.title}</span>
                    </span>
                    <span className="font-mono text-[11px] text-faint opacity-0 transition-opacity group-hover:opacity-100">
                      run →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-faint">
                Handy commands
              </div>
              <div className="space-y-1.5">
                {UTILITIES.map((u) => (
                  <button
                    key={u.cmd}
                    onClick={() => tryCommand(u.cmd)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <code className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-acc">
                      {u.cmd}
                    </code>
                    <span className="text-xs text-muted">{u.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-3 font-mono text-[11px] text-faint">
              <span className="text-acc">pro tips:</span> use <kbd>Tab</kbd> to autocomplete,{' '}
              <kbd>↑</kbd>/<kbd>↓</kbd> for history. Typos are forgiven. And yes — there are
              secret commands. 😉
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
