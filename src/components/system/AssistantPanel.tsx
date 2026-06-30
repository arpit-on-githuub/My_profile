import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import AIChat from './AIChat';

export default function AssistantPanel() {
  const open = useGameStore((s) => s.assistantOpen);
  const setOpen = useGameStore((s) => s.setAssistantOpen);

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close AI guide' : 'Open AI guide'}
        className="fixed bottom-5 left-5 z-[120] grid h-14 w-14 place-items-center rounded-2xl border border-[rgba(var(--acc-rgb),0.4)] bg-[var(--bg-1)]/90 text-2xl backdrop-blur"
        style={{ boxShadow: '0 0 30px rgba(var(--acc-rgb),0.4)' }}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }}>{open ? '✕' : '⌬'}</motion.span>
        {!open && (
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-[rgb(var(--acc-rgb))]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed bottom-24 left-5 z-[120] flex h-[60vh] max-h-[560px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col rounded-2xl border border-white/12 bg-[var(--bg-1)]/95 p-4 backdrop-blur-xl"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(var(--acc-rgb),0.12)]">⌬</span>
                <div>
                  <div className="font-display text-sm font-semibold leading-tight">AI Guide</div>
                  <div className="font-mono text-[10px] text-faint">always here to help you explore</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="ml-auto text-faint hover:text-fg"
                >
                  ✕
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <AIChat compact />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
