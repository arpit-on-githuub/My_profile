import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { executeCommand, autocomplete } from '../../lib/commands';
import { SECTIONS } from '../../data/sections';
import OutputLine from './OutputLine';
import { cn } from '../../lib/utils';

const QUICK = ['help', 'decode about', 'show skills', 'visit projects', 'enter ai'];

export default function Terminal() {
  const history = useGameStore((s) => s.history);
  const level = useGameStore((s) => s.level);
  const pushLine = useGameStore((s) => s.pushLine);

  const [value, setValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const [selSuggest, setSelSuggest] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  const suggestions = useMemo(() => (value.trim() ? autocomplete(value) : []), [value]);

  // Seed a welcome banner once.
  useEffect(() => {
    if (seeded.current || history.length > 0) {
      seeded.current = true;
      return;
    }
    seeded.current = true;
    pushLine({ type: 'system', text: 'DEV.EXE terminal v1.0 — interactive portfolio shell' });
    pushLine({ type: 'output', text: 'Type a command to unlock a section. New here? type `help`.' });
    pushLine({ type: 'hint', text: 'Quickstart: `decode about` → `show skills` → `visit projects`' });
  }, [history.length, pushLine]);

  // Auto-scroll to bottom on new output.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history.length]);

  // Reset suggestion selection when list changes.
  useEffect(() => setSelSuggest(0), [value]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    executeCommand(cmd);
    setCmdHistory((h) => [...h, cmd]);
    setHistIndex(-1);
    setValue('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length && value.trim() && suggestions[selSuggest] && value !== suggestions[selSuggest]) {
        // If there's an exact-ish suggestion highlighted but user pressed enter, run typed value anyway.
      }
      run(value);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length) {
        setValue(suggestions[selSuggest] ?? suggestions[0]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length) {
        setSelSuggest((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (cmdHistory.length) {
        const ni = histIndex < 0 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
        setHistIndex(ni);
        setValue(cmdHistory[ni]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length) {
        setSelSuggest((i) => (i + 1) % suggestions.length);
      } else if (cmdHistory.length && histIndex >= 0) {
        const ni = histIndex + 1;
        if (ni >= cmdHistory.length) {
          setHistIndex(-1);
          setValue('');
        } else {
          setHistIndex(ni);
          setValue(cmdHistory[ni]);
        }
      }
    } else if (e.key === 'Escape') {
      setValue('');
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* window chrome */}
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-faint">~/portfolio — challenge.sh</span>
        </div>
        <span className="rounded-md border border-[rgba(var(--acc-rgb),0.3)] bg-[rgba(var(--acc-rgb),0.08)] px-2 py-0.5 font-mono text-[11px] text-acc">
          LVL {level}
        </span>
      </div>

      {/* body */}
      <div
        className="glass-strong scanlines relative flex min-h-0 flex-1 flex-col rounded-b-2xl border border-white/10"
        onClick={() => inputRef.current?.focus()}
      >
        {/* output */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-4"
          aria-live="polite"
        >
          {history.map((line) => (
            <OutputLine key={line.id} line={line} />
          ))}
        </div>

        {/* input */}
        <div className="relative border-t border-white/10 px-4 py-3">
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-1)]/95 backdrop-blur"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s}
                    onMouseEnter={() => setSelSuggest(i)}
                    onClick={() => {
                      setValue(s);
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono text-xs',
                      i === selSuggest ? 'bg-[rgba(var(--acc-rgb),0.12)] text-acc' : 'text-muted',
                    )}
                  >
                    <span className="text-faint">↹</span>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="select-none text-[rgb(var(--acc-rgb))] glow-text">❯</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal command input"
              placeholder="type a command… (try: help)"
              className="flex-1 bg-transparent text-[var(--fg)] placeholder:text-faint focus:outline-none"
            />
            <span className="cursor-blink h-4 w-[8px] bg-[rgb(var(--acc-rgb))]" />
          </div>
        </div>

        {/* quick chips */}
        <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-2.5">
          {QUICK.map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[rgba(var(--acc-rgb),0.4)] hover:text-acc"
            >
              {c}
            </button>
          ))}
          <span className="ml-auto self-center font-mono text-[10px] text-faint">
            {SECTIONS.length} sections · Tab to autocomplete
          </span>
        </div>
      </div>
    </div>
  );
}
