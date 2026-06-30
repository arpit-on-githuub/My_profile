import { useGameStore } from '../store/useGameStore';
import { SECTIONS } from '../data/sections';
import { BADGES } from '../data/badges';
import { profile } from '../data/portfolio';

export default function Footer() {
  const unlockedCount = useGameStore((s) => s.unlockedCount());
  const badges = useGameStore((s) => s.badges);
  const level = useGameStore((s) => s.level);
  const progressPct = useGameStore((s) => s.progressPct());
  const setHelpOpen = useGameStore((s) => s.setHelpOpen);

  return (
    <footer className="mt-16 border-t border-white/8 py-10">
      {/* quest summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Sections cleared', value: `${unlockedCount}/${SECTIONS.length}` },
          { label: 'Badges earned', value: `${badges.length}/${Object.keys(BADGES).length}` },
          { label: 'Level reached', value: `${level}` },
          { label: 'Completion', value: `${progressPct}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="font-display text-2xl font-bold text-gradient">{s.value}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {profile.name} · built as a playable portfolio
        </div>
        <div className="flex items-center gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-muted transition-colors hover:text-acc"
            >
              {s.label}
            </a>
          ))}
          <button
            onClick={() => setHelpOpen(true)}
            className="font-mono text-xs text-acc transition-colors hover:brightness-125"
          >
            help
          </button>
        </div>
      </div>

      <div className="mt-6 text-center font-mono text-[10px] text-faint/60">
        psst — open devtools, try the Konami code, or type a secret command. curiosity is rewarded.
      </div>
    </footer>
  );
}
