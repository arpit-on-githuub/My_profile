import { useEffect, useState } from 'react';
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

export default function BootScreen() {
  const booted = useGameStore((s) => s.booted);
  const setBooted = useGameStore((s) => s.setBooted);
  const [visible, setVisible] = useState(!booted);
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    if (booted) return;
    if (prefersReducedMotion()) {
      setShown(LINES);
      const t = setTimeout(() => finish(), 500);
      return () => clearTimeout(t);
    }
    let i = 0;
    const interval = setInterval(() => {
      setShown((s) => [...s, LINES[i]]);
      i++;
      if (i >= LINES.length) {
        clearInterval(interval);
        setTimeout(() => finish(), 650);
      }
    }, 280);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setVisible(false);
    setTimeout(() => setBooted(true), 650);
  };

  useEffect(() => {
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <span className="text-gradient">DEV.EXE</span>
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
              press any key to skip →
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
