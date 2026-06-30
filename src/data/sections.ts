/* Section registry — maps each unlockable portfolio section to its primary
   command, aliases, reward XP, hint text, and quest description. */

export type SectionId =
  | 'about'
  | 'skills'
  | 'education'
  | 'toolbox'
  | 'projects'
  | 'experience'
  | 'achievements'
  | 'contact'
  | 'resume'
  | 'ai';

export interface SectionDef {
  id: SectionId;
  title: string;
  /** Canonical command shown in the tutorial. */
  command: string;
  /** Accepted variations (lowercased, normalized). */
  aliases: string[];
  xp: number;
  icon: string;
  hint: string;
  quest: string;
  /** Witty line printed when the section unlocks. */
  unlockLine: string;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'about',
    title: 'About',
    command: 'decode about',
    aliases: ['about', 'whoami', 'open about', 'show about', 'decode about', 'about me'],
    xp: 50,
    icon: '◇',
    hint: "Try: decode about  — every story starts with a 'whoami'.",
    quest: 'Decode the origin story.',
    unlockLine: '// identity decrypted. mostly harmless.',
  },
  {
    id: 'skills',
    title: 'Skills',
    command: 'show skills',
    aliases: ['skills', 'show skills', 'open skills', 'visit skills', 'skill tree', 'ls skills'],
    xp: 60,
    icon: '◆',
    hint: 'Try: show skills  — open the skill tree.',
    quest: 'Map the skill tree.',
    unlockLine: '// skill tree loaded. respec available at runtime.',
  },
  {
    id: 'education',
    title: 'Education',
    command: 'load education',
    aliases: ['education', 'load education', 'open education', 'academics', 'school', 'degrees', 'grades'],
    xp: 60,
    icon: '✺',
    hint: 'Try: load education  — degrees, ranks & coursework.',
    quest: 'Boot the academic record.',
    unlockLine: '// transcripts loaded. JEE flashbacks incoming.',
  },
  {
    id: 'toolbox',
    title: 'Toolbox',
    command: 'open toolbox',
    aliases: ['toolbox', 'open toolbox', 'tools', 'worked with', 'arsenal', 'kit'],
    xp: 60,
    icon: '⬡',
    hint: "Try: open toolbox  — everything I've actually worked with.",
    quest: 'Inventory the toolbox.',
    unlockLine: '// toolbox mounted. tools sharpened, batteries included.',
  },
  {
    id: 'projects',
    title: 'Projects',
    command: 'visit projects',
    aliases: ['projects', 'visit projects', 'open projects', 'show projects', 'ls projects', 'cd projects'],
    xp: 80,
    icon: '▲',
    hint: 'Try: visit projects  — the good stuff lives here.',
    quest: 'Browse the build log.',
    unlockLine: '// build artifacts mounted. handle with curiosity.',
  },
  {
    id: 'experience',
    title: 'Experience',
    command: 'trace experience',
    aliases: ['experience', 'trace experience', 'open experience', 'show experience', 'history', 'git log'],
    xp: 70,
    icon: '◈',
    hint: 'Try: trace experience  — walk the timeline.',
    quest: 'Trace the work stack.',
    unlockLine: '// stack trace resolved. no panics found.',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    command: 'unlock achievements',
    aliases: ['achievements', 'unlock achievements', 'show achievements', 'open achievements', 'stats', 'trophies'],
    xp: 70,
    icon: '★',
    hint: 'Try: unlock achievements  — ranks, receipts & leadership.',
    quest: 'Collect the trophies.',
    unlockLine: '// trophy cabinet unlocked. *achievement get*',
  },
  {
    id: 'contact',
    title: 'Contact',
    command: 'contact me',
    aliases: ['contact', 'contact me', 'open contact', 'ping', 'hire', 'hire me', 'email'],
    xp: 90,
    icon: '✦',
    hint: 'Try: contact me  — the boss level. say hi.',
    quest: 'Defeat the boss: make contact.',
    unlockLine: '// secure channel open. transmit when ready.',
  },
  {
    id: 'resume',
    title: 'Resume',
    command: 'open resume',
    aliases: ['resume', 'open resume', 'cv', 'download resume', 'show resume'],
    xp: 60,
    icon: '▣',
    hint: 'Try: open resume  — the recruiter-friendly artifact.',
    quest: 'Retrieve the resume artifact.',
    unlockLine: '// resume staged for download.',
  },
  {
    id: 'ai',
    title: 'AI Playground',
    command: 'enter ai',
    aliases: ['ai', 'enter ai', 'run ai', 'run ai()', 'open ai', 'playground', 'assistant'],
    xp: 100,
    icon: '⌬',
    hint: 'Try: enter ai  — talk to the portfolio guide.',
    quest: 'Boot the AI co-pilot.',
    unlockLine: '// neural co-pilot online. ask me anything.',
  },
];

export const SECTION_MAP: Record<SectionId, SectionDef> = SECTIONS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SectionId, SectionDef>,
);

export const TOTAL_SECTIONS = SECTIONS.length;
