import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SECTIONS, SECTION_MAP, TOTAL_SECTIONS, type SectionId } from '../data/sections';
import { BADGES } from '../data/badges';
import { uid } from '../lib/utils';

export type LineType =
  | 'input'
  | 'output'
  | 'success'
  | 'error'
  | 'system'
  | 'ai'
  | 'hint'
  | 'art';

export interface TermLine {
  id: string;
  type: LineType;
  text: string;
  /** Optional sub-lines rendered indented under the main text. */
  lines?: string[];
  /** Optional typing animation for AI/system lines. */
  typed?: boolean;
}

export interface Toast {
  id: string;
  kind: 'badge' | 'levelup' | 'unlock' | 'secret' | 'info';
  title: string;
  detail: string;
  icon: string;
}

export type ThemeId = 'aurora' | 'synthwave' | 'matrix' | 'solar';

export const THEME_LABELS: Record<ThemeId, string> = {
  aurora: 'Aurora',
  synthwave: 'Synthwave',
  matrix: 'Matrix',
  solar: 'Solar',
};

const LEVEL_STEP = 120;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / LEVEL_STEP) + 1;
}
export function levelTitle(level: number): string {
  const titles = [
    'Script Kiddie',
    'Junior Explorer',
    'Code Apprentice',
    'Bug Hunter',
    'Systems Tinkerer',
    'Senior Operative',
    'Architect',
    'Portfolio Master',
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

interface GameState {
  booted: boolean;
  unlocked: Record<string, boolean>;
  xp: number;
  level: number;
  badges: string[];
  secrets: Record<string, boolean>;
  theme: ThemeId;
  crtMode: boolean;
  history: TermLine[];
  notifications: Toast[];
  activeSection: SectionId | null;
  focusProject: string | null;
  assistantOpen: boolean;
  aiQuestionCount: number;

  // actions
  setBooted: (v: boolean) => void;
  pushLine: (line: Omit<TermLine, 'id'>) => void;
  pushLines: (lines: Omit<TermLine, 'id'>[]) => void;
  clearTerminal: () => void;
  unlockSection: (id: SectionId, opts?: { silent?: boolean }) => boolean;
  isUnlocked: (id: SectionId) => boolean;
  addXp: (n: number) => void;
  awardBadge: (id: string) => void;
  findSecret: (id: string) => boolean;
  setTheme: (t: ThemeId) => void;
  cycleTheme: () => void;
  toggleCrt: () => void;
  setActiveSection: (id: SectionId | null) => void;
  setFocusProject: (id: string | null) => void;
  setAssistantOpen: (v: boolean) => void;
  bumpAiQuestions: () => void;
  dismissToast: (id: string) => void;
  pushToast: (t: Omit<Toast, 'id'>) => void;
  resetProgress: () => void;
  unlockedCount: () => number;
  progressPct: () => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      booted: false,
      unlocked: {},
      xp: 0,
      level: 1,
      badges: [],
      secrets: {},
      theme: 'aurora',
      crtMode: false,
      history: [],
      notifications: [],
      activeSection: null,
      focusProject: null,
      assistantOpen: false,
      aiQuestionCount: 0,

      setBooted: (v) => set({ booted: v }),

      pushLine: (line) =>
        set((s) => ({ history: [...s.history, { ...line, id: uid('ln') }] })),

      pushLines: (lines) =>
        set((s) => ({
          history: [...s.history, ...lines.map((l) => ({ ...l, id: uid('ln') }))],
        })),

      clearTerminal: () => set({ history: [] }),

      isUnlocked: (id) => !!get().unlocked[id],

      unlockedCount: () =>
        SECTIONS.filter((sec) => get().unlocked[sec.id]).length,

      progressPct: () =>
        Math.round((get().unlockedCount() / TOTAL_SECTIONS) * 100),

      unlockSection: (id, opts) => {
        const def = SECTION_MAP[id];
        if (!def) return false;
        if (get().unlocked[id]) {
          set({ activeSection: id });
          return false; // already unlocked
        }
        set((s) => ({ unlocked: { ...s.unlocked, [id]: true }, activeSection: id }));
        get().addXp(def.xp);

        if (!opts?.silent) {
          get().pushToast({
            kind: 'unlock',
            title: `${def.title} unlocked`,
            detail: `+${def.xp} XP`,
            icon: def.icon,
          });
        }

        // Badge logic
        const count = get().unlockedCount();
        if (count >= 3) get().awardBadge('explorer');
        if (count >= TOTAL_SECTIONS) get().awardBadge('completionist');
        if (id === 'contact') get().awardBadge('recruiter');
        return true;
      },

      addXp: (n) =>
        set((s) => {
          const xp = s.xp + n;
          const newLevel = levelFromXp(xp);
          if (newLevel > s.level) {
            // queue a level-up toast (avoid calling get().pushToast inside set)
            queueMicrotask(() =>
              get().pushToast({
                kind: 'levelup',
                title: `Level ${newLevel} — ${levelTitle(newLevel)}`,
                detail: 'Your portfolio mastery grows.',
                icon: '⬆',
              }),
            );
          }
          return { xp, level: newLevel };
        }),

      awardBadge: (id) => {
        if (get().badges.includes(id)) return;
        const def = BADGES[id];
        if (!def) return;
        set((s) => ({ badges: [...s.badges, id] }));
        get().pushToast({
          kind: 'badge',
          title: `Badge: ${def.name}`,
          detail: def.desc,
          icon: def.icon,
        });
        get().addXp(40);
      },

      findSecret: (id) => {
        if (get().secrets[id]) return false;
        set((s) => ({ secrets: { ...s.secrets, [id]: true } }));
        get().awardBadge('hacker');
        get().pushToast({
          kind: 'secret',
          title: 'Secret discovered',
          detail: 'You found something hidden. Nice.',
          icon: '🕶️',
        });
        return true;
      },

      setTheme: (t) => {
        set({ theme: t });
        get().awardBadge('chameleon');
      },

      cycleTheme: () => {
        const order: ThemeId[] = ['aurora', 'synthwave', 'matrix', 'solar'];
        const idx = order.indexOf(get().theme);
        get().setTheme(order[(idx + 1) % order.length]);
      },

      toggleCrt: () => set((s) => ({ crtMode: !s.crtMode })),

      setActiveSection: (id) => set({ activeSection: id }),
      setFocusProject: (id) => set({ focusProject: id }),
      setAssistantOpen: (v) => set({ assistantOpen: v }),

      bumpAiQuestions: () =>
        set((s) => {
          const c = s.aiQuestionCount + 1;
          if (c >= 3) queueMicrotask(() => get().awardBadge('ai_whisperer'));
          return { aiQuestionCount: c };
        }),

      pushToast: (t) =>
        set((s) => ({ notifications: [...s.notifications, { ...t, id: uid('toast') }] })),

      dismissToast: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      resetProgress: () =>
        set({
          unlocked: {},
          xp: 0,
          level: 1,
          badges: [],
          secrets: {},
          aiQuestionCount: 0,
          activeSection: null,
          focusProject: null,
        }),
    }),
    {
      name: 'devexe-progress',
      partialize: (s) => ({
        unlocked: s.unlocked,
        xp: s.xp,
        level: s.level,
        badges: s.badges,
        secrets: s.secrets,
        theme: s.theme,
        crtMode: s.crtMode,
      }),
    },
  ),
);
