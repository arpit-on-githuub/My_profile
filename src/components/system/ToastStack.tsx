import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore, type Toast } from '../../store/useGameStore';
import { cn } from '../../lib/utils';

const ACCENT: Record<Toast['kind'], string> = {
  badge: 'var(--acc3, #f472b6)',
  levelup: 'rgb(var(--acc2-rgb))',
  unlock: 'rgb(var(--acc-rgb))',
  secret: '#a855f7',
  info: 'rgb(var(--acc-rgb))',
};

export default function ToastStack() {
  const notifications = useGameStore((s) => s.notifications);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[150] flex w-[320px] max-w-[88vw] flex-col gap-2.5">
      <AnimatePresence>
        {notifications.slice(-3).map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useGameStore((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), 4200);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  const accent = ACCENT[toast.kind];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onClick={() => dismiss(toast.id)}
      className="pointer-events-auto cursor-pointer overflow-hidden rounded-xl border border-white/12 bg-[var(--bg-1)]/95 p-3 backdrop-blur"
      style={{ boxShadow: `0 0 28px ${accent}33`, borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg text-lg"
          style={{ background: `${accent}1f` }}
        >
          {toast.icon}
        </div>
        <div className="min-w-0">
          <div className={cn('font-display text-sm font-semibold')} style={{ color: accent }}>
            {toast.title}
          </div>
          <div className="truncate font-mono text-[11px] text-muted">{toast.detail}</div>
        </div>
      </div>
      <motion.div
        className="mt-2 h-0.5 rounded-full"
        style={{ background: accent }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4.2, ease: 'linear' }}
      />
    </motion.div>
  );
}
