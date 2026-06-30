import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { profile } from '../../data/portfolio';
import { prefersReducedMotion } from '../../lib/utils';

const LINES = [
  '$ ./boot --portfolio',
  'initializing runtime…',
  'mounting modules ▸ react ▸ motion ▸ ai-guide',
  'compiling shaders ▸ ok',
  'loading sections [about, skills, projects, experience…]',
  'warming up neural co-pilot…',
  'establishing secure channel ▸ ok',
  'ready.',
];

const STEP_MS = 260;

export default function BootScreen() {
  const booted = useGameStore((s) => s.booted);
  const setBooted = useGameStore((s) => s.setBooted);
  const [visible, setVisible] = useState(!booted);
  const [shown, setShown] = useState<string[]>([]);
  const doneRef = useRef(false);

  // Idempotent: dismiss the boot screen exactly once, then load the site.
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    window.setTimeout(() => setBooted(true), 600);
  }, [setBooted]);

  // Reveal the lines progressively (purely cosmetic).
  useEffect(() => {
    if (booted) return;
    if (prefersReducedMotion()) {
      setShown(LINES);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(LINES.slice(0, i));
      if (i >= LINES.length) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [booted]);

  // FAILSAFE: always load the site after a fixed duration, even with no input.
  useEffect(() => {
    if (booted) return;
    const total = prefersReducedMotion() ? 500 : LINES.length * STEP_MS + 750;
    const id = window.setTimeout(finish, total);
    return () => window.clearTimeout(id);
  }, [booted, finish]);

  // Let the user skip with any key or click.
  useEffect(() => {
    if (booted) return;
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
  }, [booted, finish]);

  if (booted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] grid place-items-center bg-[var(--bg-0)] px-6"
        >
          <div className="w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <div className="font-display text-4xl font-extrabold tracking-tight">
                <span className="text-gradient">arpit.exe</span>
              </div>
              <div className="mt-1 font-mono text-xs text-faint">
                {profile.name} — playable portfolio
              </div>
            </motion.div>

            <div className="glass-strong scanlines rounded-2xl border border-white/10 p-5 font-mono text-[13px]">
              {shown.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={l === 'ready.' ? 'text-acc' : 'text-muted'}
                >
                  {l.startsWith('$') ? <span className="text-acc">{l}</span> : `▸ ${l}`}
                </motion.div>
              ))}
              <span className="cursor-blink ml-1 inline-block h-3.5 w-2 bg-[rgb(var(--acc-rgb))] align-middle" />
            </div>

            <div className="mt-4 text-center font-mono text-[11px] text-faint">
              loading… or press any key to skip →
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
