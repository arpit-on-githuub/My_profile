import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateReply } from '../../lib/ai';
import { useGameStore } from '../../store/useGameStore';
import { profile } from '../../data/portfolio';
import { cn, uid } from '../../lib/utils';

interface Msg {
  id: string;
  role: 'user' | 'ai';
  text: string[];
  chips?: string[];
}

const STARTERS = [
  'What are they best at?',
  'Best project for backend roles',
  'Show the most impressive work',
  'How do I get in touch?',
];

export default function AIChat({ compact = false }: { compact?: boolean }) {
  const bump = useGameStore((s) => s.bumpAiQuestions);
  const unlockSection = useGameStore((s) => s.unlockSection);
  const setActiveSection = useGameStore((s) => s.setActiveSection);
  const setFocusProject = useGameStore((s) => s.setFocusProject);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'intro',
      role: 'ai',
      text: [
        `Hi — I'm the AI guide for ${profile.name}'s portfolio.`,
        'Tell me the role you care about and I’ll surface the strongest evidence (and open the right panel).',
      ],
      chips: STARTERS,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { id: uid('u'), role: 'user', text: [q] }]);
    setInput('');
    setThinking(true);
    bump();

    // Simulate "thinking" latency for that premium assistant feel.
    setTimeout(() => {
      const res = generateReply(q);
      if (res.openSection) {
        unlockSection(res.openSection, { silent: true });
        setActiveSection(res.openSection);
      }
      if (res.focusProject) setFocusProject(res.focusProject);
      setMessages((m) => [
        ...m,
        { id: uid('a'), role: 'ai', text: res.reply, chips: res.chips },
      ]);
      setThinking(false);
    }, 480 + Math.random() * 360);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        className={cn(
          'no-scrollbar flex-1 space-y-3 overflow-y-auto pr-1',
          compact ? 'max-h-[46vh]' : '',
        )}
      >
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} onChip={send} />
        ))}
        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 pl-1 text-faint"
            >
              <span className="font-mono text-xs text-[var(--acc3,#f472b6)]">◈ guide</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[rgb(var(--acc-rgb))]"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-[rgba(var(--acc-rgb),0.5)]"
      >
        <span className="font-mono text-sm text-[var(--acc3,#f472b6)]">⌬</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask the guide anything…"
          aria-label="Ask the AI guide"
          className="flex-1 bg-transparent text-sm text-fg placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-lg bg-[rgb(var(--acc-rgb))] px-3 py-1 font-mono text-xs font-semibold text-[var(--bg-0)] disabled:opacity-40"
        >
          send
        </button>
      </form>
    </div>
  );
}

function Bubble({ msg, onChip }: { msg: Msg; onChip: (s: string) => void }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm',
          isUser
            ? 'rounded-br-sm bg-[rgba(var(--acc-rgb),0.14)] text-fg'
            : 'rounded-bl-sm border border-white/10 bg-white/[0.03] text-[var(--fg)]/90',
        )}
      >
        {!isUser && (
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[var(--acc3,#f472b6)]">
            ◈ guide
          </div>
        )}
        {msg.text.map((t, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {renderEmphasis(t)}
          </p>
        ))}
        {msg.chips && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {msg.chips.map((c) => (
              <button
                key={c}
                onClick={() => onChip(c)}
                className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[rgba(var(--acc-rgb),0.4)] hover:text-acc"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** Render **bold** segments without dangerouslySetInnerHTML. */
function renderEmphasis(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="font-semibold text-acc">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
