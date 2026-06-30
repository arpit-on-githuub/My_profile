/* ============================================================================
   commands.ts — Command parser + executor.
   Drives the whole experience: unlock sections, run utilities, trigger easter
   eggs, route natural-language questions to the AI guide, and reply with witty,
   helpful errors (with fuzzy "did you mean" suggestions).
============================================================================ */

import { SECTIONS, SECTION_MAP, type SectionId } from '../data/sections';
import { profile, skills, projects } from '../data/portfolio';
import { useGameStore } from '../store/useGameStore';
import { generateReply } from './ai';
import { normalize } from './utils';
import { bestMatch, rankMatches } from './fuzzy';

/* Build alias → sectionId lookup. */
const ALIAS_TO_SECTION = new Map<string, SectionId>();
for (const s of SECTIONS) {
  ALIAS_TO_SECTION.set(normalize(s.command), s.id);
  for (const a of s.aliases) ALIAS_TO_SECTION.set(normalize(a), s.id);
}

/* All strings we can suggest for "did you mean". */
export const SUGGESTIBLE = [
  'help',
  'ls',
  'clear',
  'whoami',
  'theme',
  'progress',
  'run portfolio()',
  'inspect stack',
  'ask <question>',
  ...SECTIONS.map((s) => s.command),
];

const WITTY_ERRORS = [
  (c: string) => `command not found: ${c} — and trust me, I looked.`,
  (c: string) => `\`${c}\` threw a NotARealCommandError. No stack trace, just vibes.`,
  (c: string) => `segfault (core dumped)… kidding. \`${c}\` just isn't a thing here.`,
  (c: string) => `404: \`${c}\` not in the command registry. Try \`help\`.`,
  (c: string) => `nice try, but \`${c}\` compiles to disappointment. Type \`help\`.`,
];

const SECRET_RESPONSES: Record<string, () => { lines: { type: any; text: string; lines?: string[] }[]; secret?: string }> = {
  sudo: () => ({
    lines: [{ type: 'error', text: 'Permission denied: you are not (yet) root. Nice ambition though.' }],
    secret: 'sudo',
  }),
  'sudo make me a sandwich': () => ({
    lines: [{ type: 'success', text: 'Okay. You are now a sandwich. 🥪' }],
    secret: 'sandwich',
  }),
  matrix: () => ({
    lines: [
      { type: 'system', text: 'Wake up, Neo… the portfolio has you.' },
      { type: 'art', text: '01001000 01101001 00100000 01110100 01101000 01100101 01110010 01100101' },
    ],
    secret: 'matrix',
  }),
  coffee: () => ({
    lines: [{ type: 'system', text: '☕ brewing… HTTP 418: I’m a teapot. Coffee denied. Bug count rising.' }],
    secret: 'coffee',
  }),
  hack: () => ({
    lines: [
      { type: 'system', text: 'Initiating elite hack sequence…' },
      { type: 'success', text: 'Access granted to: absolutely nothing. It was a portfolio all along.' },
    ],
    secret: 'hack',
  }),
  '42': () => ({
    lines: [{ type: 'system', text: 'The Answer to Life, the Universe, and Everything. The Question remains TBD.' }],
    secret: '42',
  }),
  vim: () => ({
    lines: [{ type: 'system', text: "You're trapped in vim now. Just kidding. Press anything. :wq won't save you here." }],
    secret: 'vim',
  }),
  'rm -rf /': () => ({
    lines: [{ type: 'error', text: 'Whoa. I admire the chaos, but this portfolio is read-only. Crisis averted.' }],
    secret: 'rmrf',
  }),
  exit: () => ({
    lines: [{ type: 'system', text: "There is no exit. Only more portfolio. (Try `contact me`.)" }],
    secret: 'exit',
  }),
  ping: () => ({
    lines: [{ type: 'success', text: 'pong. latency: 1 witty remark.' }],
  }),
};

interface ExecResult {
  /** non-fatal: did we recognize the command at all? */
  recognized: boolean;
}

function push(type: any, text: string, lines?: string[]) {
  useGameStore.getState().pushLine({ type, text, lines });
}

function helpLines() {
  const store = useGameStore.getState();
  push('system', 'AVAILABLE COMMANDS — type any of these:');
  for (const s of SECTIONS) {
    const lock = store.isUnlocked(s.id) ? '✓' : '·';
    push('output', `  ${lock} ${s.command.padEnd(20)} → ${s.title}`);
  }
  push('output', '  · run portfolio()      → unlock everything (speedrun)');
  push('output', '  · inspect stack        → quick tech rundown');
  push('output', '  · ask <question>       → talk to the AI guide');
  push('output', '  · theme / progress / ls / clear / whoami');
  push('hint', 'Psst… there are a few secret commands too. Curiosity is rewarded.');
}

function lsLines() {
  const store = useGameStore.getState();
  push('system', `sections/  (${store.unlockedCount()}/${SECTIONS.length} unlocked)`);
  for (const s of SECTIONS) {
    const unlocked = store.isUnlocked(s.id);
    push(unlocked ? 'success' : 'output', `  ${unlocked ? '✓' : '🔒'} ${s.id.padEnd(14)} ${unlocked ? '' : `→ ${s.command}`}`);
  }
}

function progressLines() {
  const s = useGameStore.getState();
  push('system', `LEVEL ${s.level} · ${s.xp} XP · ${s.progressPct()}% complete`);
  push('output', `  Sections: ${s.unlockedCount()}/${SECTIONS.length}   Badges: ${s.badges.length}`);
}

function inspectStack() {
  const store = useGameStore.getState();
  const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 8);
  push('system', 'inspecting runtime stack…');
  top.forEach((s) => push('output', `  ${s.name.padEnd(16)} ${'█'.repeat(Math.round(s.level / 10)).padEnd(10)} ${s.level}`));
  store.unlockSection('skills');
}

async function runPortfolio() {
  const store = useGameStore.getState();
  push('system', 'executing run portfolio() …');
  push('output', '  compiling sections ▸ resolving dependencies ▸ mounting UI');
  // Unlock all sequentially with a tiny delay for drama.
  for (const s of SECTIONS) {
    await new Promise((r) => setTimeout(r, 130));
    if (!store.isUnlocked(s.id)) {
      store.unlockSection(s.id, { silent: true });
      push('success', `  ✓ ${s.title} mounted`);
    }
  }
  push('success', 'portfolio() resolved → 100% complete. Show-off mode engaged.');
}

function handleAsk(question: string) {
  const store = useGameStore.getState();
  store.bumpAiQuestions();
  const res = generateReply(question);
  push('ai', '◈ guide:');
  res.reply.forEach((r) => push('ai', `  ${r.replace(/\*\*/g, '')}`));
  if (res.openSection) {
    store.unlockSection(res.openSection, { silent: true });
    push('hint', `  ↳ opened ${SECTION_MAP[res.openSection].title} for you.`);
  }
  if (res.focusProject) {
    store.setActiveSection('projects');
    store.setFocusProject(res.focusProject);
  }
  if (res.chips?.length) push('hint', `  try asking: ${res.chips.map((c) => `“${c}”`).join('  ·  ')}`);
}

/** Main entry point. Pushes the input echo, then handles the command. */
export function executeCommand(raw: string): ExecResult {
  const store = useGameStore.getState();
  const trimmed = raw.trim();
  if (!trimmed) return { recognized: true };

  // Echo the input.
  push('input', trimmed);

  const norm = normalize(trimmed).replace(/\(\s*\)/g, '');
  const firstWord = norm.split(' ')[0];

  // ---- Natural-language AI questions -------------------------------------
  if (firstWord === 'ask' || firstWord === 'ai' || firstWord === 'guide') {
    const q = trimmed.replace(/^(ask|ai|guide)\s*/i, '');
    if (!q) {
      store.unlockSection('ai', { silent: true });
      push('ai', '◈ guide: AI co-pilot online. Ask me anything, e.g. `ask best project for backend`.');
      return { recognized: true };
    }
    handleAsk(q);
    return { recognized: true };
  }

  // ---- Utility commands ---------------------------------------------------
  switch (norm) {
    case 'help':
    case '?':
    case 'man':
      helpLines();
      return { recognized: true };
    case 'ls':
    case 'ls sections':
    case 'dir':
      lsLines();
      return { recognized: true };
    case 'clear':
    case 'cls':
      store.clearTerminal();
      return { recognized: true };
    case 'whoami':
      push('success', `${profile.name} — ${profile.role}. ${profile.tagline}`);
      store.unlockSection('about', { silent: true });
      return { recognized: true };
    case 'progress':
    case 'status':
    case 'stats':
      progressLines();
      return { recognized: true };
    case 'inspect stack':
    case 'stack':
      inspectStack();
      return { recognized: true };
    case 'theme':
      store.cycleTheme();
      push('success', `theme → ${useGameStore.getState().theme}`);
      return { recognized: true };
    case 'crt':
      store.toggleCrt();
      push('output', `CRT scanlines ${useGameStore.getState().crtMode ? 'on' : 'off'}.`);
      return { recognized: true };
    case 'reset':
      store.resetProgress();
      store.clearTerminal();
      push('system', 'progress wiped. fresh save file created.');
      return { recognized: true };
    case 'run portfolio':
    case 'portfolio':
    case 'npm start':
    case 'npm run dev':
      void runPortfolio();
      return { recognized: true };
  }

  // ---- Secret / easter-egg commands --------------------------------------
  const secret = SECRET_RESPONSES[norm];
  if (secret) {
    const { lines, secret: secretId } = secret();
    lines.forEach((l) => push(l.type, l.text, l.lines));
    if (secretId) store.findSecret(secretId);
    return { recognized: true };
  }

  // ---- Section unlock commands -------------------------------------------
  const sectionId = ALIAS_TO_SECTION.get(norm);
  if (sectionId) {
    const def = SECTION_MAP[sectionId];
    const already = store.isUnlocked(sectionId);
    store.unlockSection(sectionId);
    if (already) {
      push('output', `${def.title} already unlocked — scrolling you there.`);
    } else {
      push('success', def.unlockLine);
      push('success', `▸ ${def.title} unlocked (+${def.xp} XP)`);
    }
    return { recognized: true };
  }

  // ---- Fuzzy "did you mean" + AI fallback ---------------------------------
  const sectionMatch = bestMatch(norm, [...ALIAS_TO_SECTION.keys()], 0.7);
  if (sectionMatch) {
    const id = ALIAS_TO_SECTION.get(sectionMatch)!;
    push('error', WITTY_ERRORS[Math.floor(Math.random() * WITTY_ERRORS.length)](trimmed));
    push('hint', `did you mean \`${SECTION_MAP[id].command}\`? (I'll run it for you)`);
    store.unlockSection(id);
    push('success', `▸ ${SECTION_MAP[id].title} unlocked`);
    return { recognized: true };
  }

  // Maybe it's a natural-language question without the `ask` prefix.
  if (norm.split(' ').length >= 3 || /\?$/.test(trimmed) || /^(what|which|who|how|where|can|do|is|are|show me)\b/.test(norm)) {
    handleAsk(trimmed);
    return { recognized: true };
  }

  // Otherwise: witty error + best suggestions.
  push('error', WITTY_ERRORS[Math.floor(Math.random() * WITTY_ERRORS.length)](trimmed));
  const ranked = rankMatches(norm, SUGGESTIBLE).slice(0, 3);
  if (ranked.length) {
    push('hint', `did you mean: ${ranked.map((r) => `\`${r.value}\``).join('  ·  ')} ?`);
  } else {
    push('hint', 'type `help` for the full command list.');
  }
  return { recognized: false };
}

/** Autocomplete suggestions for the input box. */
export function autocomplete(input: string): string[] {
  const norm = normalize(input);
  if (!norm) return [];
  const pool = [...SUGGESTIBLE, ...SECTIONS.flatMap((s) => s.aliases)];
  const unique = Array.from(new Set(pool));
  return rankMatches(norm, unique)
    .map((r) => r.value)
    .filter((v) => v !== norm)
    .slice(0, 5);
}

export function getProjectById(id: string) {
  return projects.find((p) => p.id === id);
}
