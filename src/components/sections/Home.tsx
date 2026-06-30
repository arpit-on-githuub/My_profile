import { motion } from 'framer-motion';
import { profile } from '../../data/portfolio';
import { executeCommand } from '../../lib/commands';
import { useGameStore } from '../../store/useGameStore';
import TypeWriter from '../ui/TypeWriter';
import GlowButton from '../ui/GlowButton';
import Magnetic from '../ui/Magnetic';
import Pill from '../ui/Pill';

export default function Home() {
  const setAssistantOpen = useGameStore((s) => s.setAssistantOpen);

  return (
    <section id="section-home" className="relative pt-10 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl"
      >
        <Pill tone="accent" className="mb-5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[rgb(var(--acc-rgb))]" />
          {profile.availability} · press play
        </Pill>

        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Hi, I'm <span className="text-gradient glow-text">{profile.name}</span>.
          <br />
          <span className="text-[var(--fg)]/90">I'm a </span>
          <TypeWriter words={profile.titles} className="text-acc" />
        </h1>

        <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">{profile.tagline}</p>
        <p className="mt-2 max-w-xl font-mono text-sm text-faint">
          // this portfolio is a game. type commands to unlock it — or let the AI guide you.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Magnetic>
            <GlowButton size="lg" onClick={() => executeCommand('run portfolio()')}>
              ▸ run portfolio()
            </GlowButton>
          </Magnetic>
          <Magnetic>
            <GlowButton size="lg" variant="outline" onClick={() => setAssistantOpen(true)}>
              ⌬ ask the AI guide
            </GlowButton>
          </Magnetic>
          <Magnetic>
            <GlowButton size="lg" variant="ghost" onClick={() => executeCommand('open resume')}>
              ⬇ resume
            </GlowButton>
          </Magnetic>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {['decode about', 'show skills', 'visit projects', 'load education', 'enter ai', 'contact me'].map(
            (c) => (
              <button
                key={c}
                onClick={() => executeCommand(c)}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[rgba(var(--acc-rgb),0.4)] hover:text-acc"
              >
                {c}
              </button>
            ),
          )}
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 flex items-center gap-2 font-mono text-[11px] text-faint"
      >
        <span className="inline-block h-8 w-5 rounded-full border border-white/15 p-1">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="block h-1.5 w-1.5 rounded-full bg-[rgb(var(--acc-rgb))]"
          />
        </span>
        the console is right below — start typing
      </motion.div>
    </section>
  );
}
