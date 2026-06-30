/* ============================================================================
   ai.ts — Client-side "AI" guide.
   ----------------------------------------------------------------------------
   No external API required: this is a deterministic intent-detection + retrieval
   engine that *feels* like an assistant. It detects intent from natural language,
   recommends projects by role/interest, answers questions about strengths, and
   degrades gracefully with witty fallbacks + suggested follow-ups.

   It's intentionally structured so a real LLM call could be dropped into
   `generateReply()` later without touching the UI.
============================================================================ */

import { profile, projects, skills, experience, aiKnowledge } from '../data/portfolio';
import type { SectionId } from '../data/sections';

export interface AIResponse {
  reply: string[];
  chips?: string[];
  openSection?: SectionId;
  focusProject?: string;
}

function project(id: string) {
  return projects.find((p) => p.id === id)!;
}

function recommendByRole(role: string): AIResponse {
  const r = role.toLowerCase();
  let id = aiKnowledge.impressivePick;
  let label = 'most impressive';
  if (/back\s?end|platform|infra|distributed|reliab|systems|server/.test(r)) {
    id = aiKnowledge.backendPick;
    label = 'backend';
  } else if (/front\s?end|ui|ux|design|interface|react|web/.test(r)) {
    id = aiKnowledge.frontendPick;
    label = 'frontend';
  } else if (/\bai\b|ml|machine|llm|model|data\s?science|nlp/.test(r)) {
    id = aiKnowledge.aiPick;
    label = 'AI/ML';
  } else if (/full\s?stack/.test(r)) {
    id = aiKnowledge.frontendPick;
    label = 'full-stack';
  } else if (/devops|cloud|kubernetes|sre|edge/.test(r)) {
    id = aiKnowledge.backendPick;
    label = 'systems';
  }
  const p = project(id);
  return {
    reply: [
      `For a ${label} lens, start with **${p.name}** — ${p.tagline.toLowerCase()}.`,
      p.aiSummary,
      `Signal metrics: ${p.metrics.map((m) => `${m.value} ${m.label}`).join(' · ')}.`,
    ],
    focusProject: id,
    openSection: 'projects',
    chips: ['Show me the most impressive work', 'What are their strengths?', 'How do I contact them?'],
  };
}

type Matcher = {
  id: string;
  test: (q: string) => boolean;
  run: (q: string) => AIResponse;
};

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

const matchers: Matcher[] = [
  {
    id: 'greeting',
    test: (q) => /^(hi|hey|hello|yo|sup|greetings|howdy)\b/.test(q),
    run: () => ({
      reply: [
        `Hey — I'm the portfolio guide for ${profile.name}. Think of me as a co-pilot.`,
        'Tell me what you care about (backend, frontend, AI, hiring) and I’ll point you to the strongest evidence.',
      ],
      chips: ['What are they best at?', 'Best project for backend roles', 'Show the most impressive work'],
    }),
  },
  {
    id: 'best-at',
    test: (q) =>
      has(q, 'best at', 'strength', 'good at', 'specialt', 'superpower', 'great at', 'expert'),
    run: () => ({
      reply: [
        `In one line: ${aiKnowledge.bestAt}`,
        `Operating values: ${aiKnowledge.values.join(' ')}`,
      ],
      openSection: 'skills',
      chips: ['Best project for backend roles', 'Best project for AI roles', 'Show the skill tree'],
    }),
  },
  {
    id: 'impressive',
    test: (q) => has(q, 'impressive', 'best work', 'flagship', 'proudest', 'showcase', 'wow', 'cool'),
    run: () => {
      const p = project(aiKnowledge.impressivePick);
      return {
        reply: [
          `The headline act is **${p.name}** — ${p.tagline.toLowerCase()}.`,
          p.aiSummary,
          `Why it lands: ${p.highlights[0]}`,
        ],
        focusProject: p.id,
        openSection: 'projects',
        chips: ['What are their strengths?', 'Best project for backend', 'How do I reach out?'],
      };
    },
  },
  {
    id: 'role-recommend',
    test: (q) =>
      has(q, 'backend', 'frontend', 'front end', 'back end', 'full stack', 'fullstack', 'devops', 'infra', 'machine learning', 'data science', 'sre', 'platform') ||
      (/role|position|job|hiring for|looking for/.test(q) && has(q, 'ai', 'ml', 'ui', 'ux')),
    run: (q) => recommendByRole(q),
  },
  {
    id: 'recommend-generic',
    test: (q) => has(q, 'recommend', 'which project', 'what should i', 'where do i start', 'suggest', 'what to explore'),
    run: () => {
      const featured = projects.filter((p) => p.featured);
      return {
        reply: [
          'Depends on your angle. Quick map:',
          `• Realtime + full-stack → **Vamos**`,
          `• Frontend craft & UX → **Orbit**`,
          `• Applied ML / recommenders → **Movie Recommendation System**`,
          `Tell me the role you’re hiring for and I’ll narrow it to one.`,
        ],
        openSection: 'projects',
        focusProject: featured[0]?.id,
        chips: ['I’m hiring for backend', 'I’m hiring for AI', 'I’m hiring for frontend'],
      };
    },
  },
  {
    id: 'projects',
    test: (q) => has(q, 'project', 'portfolio', 'built', 'work', 'shipped') && !has(q, 'experience', 'job history'),
    run: () => ({
      reply: [
        `There are ${projects.length} projects. The three flagships:`,
        ...projects.filter((p) => p.featured).map((p) => `• **${p.name}** — ${p.tagline}`),
        'Type `visit projects` to open the build log, or ask me which fits a role.',
      ],
      openSection: 'projects',
      chips: ['Best for backend roles', 'Best for AI roles', 'Most impressive work'],
    }),
  },
  {
    id: 'skills',
    test: (q) => has(q, 'skill', 'tech stack', 'technolog', 'stack', 'language', 'framework', 'tools'),
    run: () => {
      const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 6).map((s) => s.name);
      return {
        reply: [
          `Core stack: ${top.join(', ')}.`,
          `Strongest across Languages, Frontend, Backend, with applied AI/ML and DevOps depth.`,
          'Open the skill tree with `show skills` for the full breakdown.',
        ],
        openSection: 'skills',
        chips: ['What are they best at?', 'Best project for this stack', 'Show experience'],
      };
    },
  },
  {
    id: 'research',
    test: (q) => has(q, 'research', 'paper', 'lab', 'campus porter', 'professor', 'thesis'),
    run: () => ({
      reply: [
        "There's active research too — **Campus Porter**, a campus intra-logistics platform at IIT Jodhpur.",
        "Real-time tracking with QR-based handoff validation on a MERN core. Some of it's still under wraps.",
        'Type `decrypt research` for the glimpse.',
      ],
      openSection: 'research',
      chips: ['Show me projects', 'What are they best at?', 'How do I contact them?'],
    }),
  },
  {
    id: 'experience',
    test: (q) => has(q, 'experience', 'work history', 'career', 'job', 'company', 'companies', 'years', 'background'),
    run: () => {
      const latest = experience[0];
      return {
        reply: [
          `Currently: ${latest.role} at ${latest.company}.`,
          `Recent impact: ${latest.achievements[0]}`,
          'Walk the full timeline with `trace experience`.',
        ],
        openSection: 'experience',
        chips: ['What are their strengths?', 'Show me projects', 'How do I contact them?'],
      };
    },
  },
  {
    id: 'contact',
    test: (q) => has(q, 'contact', 'reach', 'hire', 'email', 'get in touch', 'message', 'connect', 'available', 'availab'),
    run: () => ({
      reply: [
        `${profile.availability}.`,
        `Fastest path: \`contact me\` opens the boss-level contact panel.`,
        `Direct line: ${profile.email}`,
      ],
      openSection: 'contact',
      chips: ['Open resume', 'What are they best at?', 'Show the most impressive work'],
    }),
  },
  {
    id: 'resume',
    test: (q) => has(q, 'resume', 'cv', 'download'),
    run: () => ({
      reply: ['Resume is one command away: type `open resume` to view and download it.'],
      openSection: 'resume',
      chips: ['How do I contact them?', 'What are their strengths?'],
    }),
  },
  {
    id: 'about',
    test: (q) => has(q, 'who is', 'who are', 'about', 'tell me about', 'introduce', 'whoami'),
    run: () => ({
      reply: [profile.about[0], profile.about[1]],
      openSection: 'about',
      chips: ['What are they best at?', 'Show me projects', 'How do I contact them?'],
    }),
  },
  {
    id: 'help',
    test: (q) => has(q, 'help', 'what can you', 'how does this', 'how do i', 'commands', 'navigate', 'stuck', 'confused'),
    run: () => ({
      reply: [
        'This portfolio is a little coding game. You unlock sections by typing commands.',
        'Try `visit projects`, `show skills`, `trace experience`, or `contact me`.',
        'Or just tell me what you’re looking for and I’ll guide you — and quietly open the right panel.',
      ],
      chips: ['What are they best at?', 'Best project for backend', 'Show the most impressive work'],
    }),
  },
];

/** This is the single hook where a real LLM could be swapped in. */
export function generateReply(question: string): AIResponse {
  const q = question.toLowerCase().trim();
  if (!q) {
    return {
      reply: ['Ask me anything — strengths, projects for a role, how to get in touch.'],
      chips: ['What are they best at?', 'Best project for backend', 'How do I contact them?'],
    };
  }
  for (const m of matchers) {
    try {
      if (m.test(q)) return m.run(q);
    } catch {
      /* keep scanning */
    }
  }
  // Witty, useful fallback
  return {
    reply: [
      `I don’t have a canned answer for that, but here’s the gist: ${aiKnowledge.bestAt}`,
      'Try asking about a role ("best project for backend"), strengths, or how to reach out.',
    ],
    chips: ['What are they best at?', 'Best for AI roles', 'How do I contact them?'],
  };
}

/** Subtle "code coach" hints used by the terminal when a user looks stuck. */
export function coachHint(unlockedCount: number, lastWasError: boolean): string {
  if (lastWasError) {
    return "Tip: commands are simple verbs — try `help`, or `visit projects`.";
  }
  if (unlockedCount === 0) return 'Hint: type `help` to see every command, then `decode about`.';
  if (unlockedCount < 3) return 'Hint: keep going — `show skills` and `visit projects` are great next moves.';
  if (unlockedCount < 6) return 'Hint: try `trace experience` and `enter ai` to talk to the guide.';
  return 'Hint: almost there — `contact me` is the boss level. Then try a secret command 😉';
}
