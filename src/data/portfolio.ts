/* ============================================================================
   portfolio.ts  —  SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   👉 Everything the site shows lives here: text AND links. To make it yours,
   edit the values below (name, links, projects, education, etc.).
============================================================================ */

export interface SkillNode {
  name: string;
  level: number; // 0-100
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI/ML' | 'CS Core' | 'Tools';
  blurb: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Short "AI generated" style summary surfaced by the assistant. */
  aiSummary: string;
  tags: string[];
  roles: ('frontend' | 'backend' | 'ai' | 'fullstack' | 'devops' | 'mobile')[];
  metrics: { label: string; value: string }[];
  highlights: string[];
  links: { label: string; url: string }[];
  accent: string; // css color
  year: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  stack: string[];
  link?: { label: string; url: string };
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface EducationItem {
  id: string;
  school: string;
  qualification: string;
  score: string;
  period: string;
  location: string;
  note?: string;
}

export interface Course {
  name: string;
  skills: string[];
}

export interface ToolItem {
  name: string;
  note: string;
}

export interface ToolGroup {
  category: string;
  icon: string;
  items: ToolItem[];
}

export interface LeadershipItem {
  id: string;
  role: string;
  org: string;
  icon: string;
}

export const profile = {
  name: 'Arpit',
  handle: 'arpit.exe',
  role: 'Software Engineer · CSE @ IIT Jodhpur',
  titles: [
    'Full-Stack Developer',
    'CSE @ IIT Jodhpur',
    'Real-Time Systems Tinkerer',
    'ML Explorer',
    'Problem Solver',
  ],
  tagline: 'I build real-time, full-stack web apps — and over-engineer side projects for fun.',
  about: [
    "I'm Arpit, a Computer Science undergrad at IIT Jodhpur who likes turning rough ideas into real-time, full-stack products that actually ship.",
    "I'm happiest in the messy middle — wiring up live data, designing clean state machines, and sweating the micro-interactions until an app feels inevitable.",
    "When I'm not building (Vamos, Orbit, …), I'm grinding DSA, poking at machine learning, or running point on fests and societies at IITJ.",
  ],
  location: 'IIT Jodhpur · India',
  availability: 'Open to SDE / full-stack internships',
  email: 'b24cs1015@iitj.ac.in',
  phone: '+91-7404229171',
  resumeUrl: 'https://drive.google.com/file/d/1o-lXg7oSM1uMqaTPiP0Cyk24YWaEHk7S/view?usp=sharing',
  socials: [
    { label: 'GitHub', handle: '@arpit-on-githuub', url: 'https://github.com/arpit-on-githuub' },
    { label: 'LinkedIn', handle: 'in/arpit-a72959264', url: 'https://www.linkedin.com/in/arpit-a72959264/' },
    { label: 'LeetCode', handle: 'u/b24cs1015', url: 'https://leetcode.com/u/b24cs1015' },
    { label: 'GeeksforGeeks', handle: 'b24csl4dm', url: 'https://www.geeksforgeeks.org/profile/b24csl4dm' },
    { label: 'Instagram', handle: '@knoww_arpitt', url: 'https://www.instagram.com/knoww_arpitt/' },
    { label: 'Email', handle: 'b24cs1015@iitj.ac.in', url: 'mailto:b24cs1015@iitj.ac.in' },
  ],
  // Punchy stats for the animated counters.
  stats: [
    { label: 'JEE Advanced Rank (AIR)', value: 3061, suffix: '', decimals: 0 },
    { label: 'JEE Mains Rank (AIR)', value: 2160, suffix: '', decimals: 0 },
    { label: 'Physics Score · JEE Mains', value: 100, suffix: '%', decimals: 0 },
    { label: 'Class X Aggregate', value: 97.8, suffix: '%', decimals: 1 },
  ],
};

export const skills: SkillNode[] = [
  { name: 'C++', level: 75, category: 'Languages', blurb: 'My DSA & systems weapon of choice.' },
  { name: 'Python', level: 40, category: 'Languages', blurb: 'ML, scripting, quick prototypes.' },
  { name: 'JavaScript', level: 25, category: 'Languages', blurb: 'The language of the web.' },
  { name: 'TypeScript', level: 22, category: 'Languages', blurb: 'Types catch bugs before users do.' },
  { name: 'C', level: 69, category: 'Languages', blurb: 'Where it all clicked into place.' },

  { name: 'React.js', level: 35, category: 'Frontend', blurb: 'Composable UIs, custom hooks.' },
  { name: 'Next.js', level: 28, category: 'Frontend', blurb: 'App router, server + client.' },
  { name: 'Vite', level: 30, category: 'Frontend', blurb: 'Instant dev, lean builds.' },
  { name: 'Tailwind CSS', level: 34, category: 'Frontend', blurb: 'Utility-first design systems.' },
  { name: 'Framer Motion', level: 24, category: 'Frontend', blurb: 'Gestures & motion that feel premium.' },
  { name: 'Zustand', level: 28, category: 'Frontend', blurb: 'Tiny, ergonomic state management.' },
  { name: 'HTML / CSS', level: 33, category: 'Frontend', blurb: 'Vanilla CSS, design systems.' },

  { name: 'Node.js', level: 40, category: 'Backend', blurb: 'APIs and realtime servers.' },
  { name: 'Express.js', level: 35, category: 'Backend', blurb: 'Routes, middleware, REST.' },
  { name: 'MongoDB', level: 33, category: 'Backend', blurb: 'Document modeling for MERN.' },
  { name: 'Supabase', level: 30, category: 'Backend', blurb: 'Realtime + auth on Postgres.' },
  { name: 'PostgreSQL', level: 27, category: 'Backend', blurb: 'RLS, WAL, relational rigor.' },
  { name: 'REST APIs', level: 34, category: 'Backend', blurb: 'Design, fetch, integrate.' },
  { name: 'Email (SMTP / Web3Forms)', level: 30, category: 'Backend', blurb: 'Form-to-inbox delivery.' },

  { name: 'Machine Learning', level: 67, category: 'AI/ML', blurb: 'PRML foundations, applied.' },
  { name: 'Recommender Systems', level: 36, category: 'AI/ML', blurb: 'Collaborative + content + SVD.' },
  { name: 'NumPy / Pandas', level: 38, category: 'AI/ML', blurb: 'Data wrangling at speed.' },
  { name: 'scikit-learn', level: 30, category: 'AI/ML', blurb: 'Models, metrics, pipelines.' },

  { name: 'Data Structures & Algorithms', level: 80, category: 'CS Core', blurb: 'Daily on LeetCode.' },
  { name: 'OOP', level: 58, category: 'CS Core', blurb: 'Clean, extensible designs.' },
  { name: 'Graph Algorithms', level: 54, category: 'CS Core', blurb: 'Dijkstra and friends.' },

  { name: 'Git / GitHub', level: 80, category: 'Tools', blurb: 'Branches, PRs, sane history.' },
  { name: 'Vercel', level: 58, category: 'Tools', blurb: 'Ship to the edge in seconds.' },
  { name: 'Railway', level: 54, category: 'Tools', blurb: 'Deploy backends & DBs fast.' },
];

export const projects: Project[] = [
  {
    id: 'vamos',
    name: 'Vamos',
    tagline: 'Real-time ride-pooling for campuses & tech parks',
    description:
      'Vamos ("Let\'s go!") helps commuters heading the same way find each other, split fares, and travel together — with live discovery feeds, host-approved lobbies, slide-to-join requests, and real-time chat.',
    aiSummary:
      'Flagship full-stack realtime project. Next.js + Supabase (PostgreSQL) with WebSocket sync over the write-ahead log, Row-Level Security, and a transactional ride state machine. Strongest signal for full-stack, backend, and realtime roles.',
    tags: ['Next.js', 'Supabase', 'PostgreSQL', 'WebSockets', 'TypeScript', 'Framer Motion'],
    roles: ['fullstack', 'backend', 'frontend'],
    metrics: [
      { label: 'data sync', value: 'Realtime' },
      { label: 'polling / refreshes', value: '0' },
      { label: 'Postgres row security', value: 'RLS' },
    ],
    highlights: [
      'Live feeds, member lists, fare splits & chat via Supabase Realtime (Postgres WAL over WebSockets) — no polling.',
      'Serverless & secure: Next.js talks directly to Supabase with PostgreSQL Row-Level Security policies.',
      'Transactional ride state machine (CREATED → REQUEST_PENDING → ONGOING → COMPLETED/CANCELLED) to kill race conditions.',
      'Dynamic fare splitter recalculates per-head cost as seats fill; slide-to-join gestures built with Framer Motion.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/arpit-on-githuub/Vamos' }],
    accent: '#5eead4',
    year: '2026',
    featured: true,
  },
  {
    id: 'orbit',
    name: 'Orbit',
    tagline: 'Mission control for your day — tasks, habits, time-blocks',
    description:
      'Orbit unifies time-blocking, task management, and habit tracking into one fluid timetable, with a built-in Strategist chatbot, deep-focus reminders, and daily reflection summaries.',
    aiSummary:
      'Frontend-craft flagship. React 18 + Vite with zero backend dependency, reusable components, custom hooks, and local-state workflows — wrapped in a premium dark UI with micro-interactions. Best for frontend / design-engineering roles.',
    tags: ['React 18', 'Vite', 'Vanilla CSS', 'Lucide', 'date-fns'],
    roles: ['frontend', 'fullstack'],
    metrics: [
      { label: 'tasks · habits · blocks', value: '3-in-1' },
      { label: 'backend dependency', value: '0' },
      { label: 'feedback iterations', value: '5+' },
    ],
    highlights: [
      'Dynamic timetable weaving habits, one-off tasks, and long-term goals into a single focus flow.',
      "Strategist chatbot breaks down complex goals; deep-focus sliding-toast reminders that don't break flow.",
      'Zero-backend architecture: reusable components, local-state workflows, and custom React hooks for performant reminders.',
      'Premium dark-mode UI with subtle micro-animations and a mobile-native bottom navigation bar.',
    ],
    links: [
      { label: 'Live App', url: 'https://orbit-two-murex.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/arpit-on-githuub/Orbit' },
    ],
    accent: '#7c83ff',
    year: '2026',
    featured: true,
  },
  {
    id: 'movie',
    name: 'Movie Recommendation System',
    tagline: 'Hybrid recommender — collaborative + content + SVD',
    description:
      'A PRML course project that recommends movies via user-based collaborative filtering, content-based filtering, and Truncated SVD — served through a cached Streamlit app with TMDB posters.',
    aiSummary:
      'Applied-ML flagship. Demonstrates recommender systems, sparse-matrix handling, evaluation (precision@10), and a deployed UI. Top pick for AI/ML and data-science roles.',
    tags: ['Python', 'scikit-learn', 'Truncated SVD', 'Streamlit', 'TMDB API'],
    roles: ['ai', 'backend'],
    metrics: [
      { label: 'precision@10', value: '~72%' },
      { label: 'ratings handled', value: '100k+' },
      { label: 'repeat-query latency', value: '−40%' },
    ],
    highlights: [
      'User-based collaborative filtering (cosine similarity) + content-based filtering (CountVectorizer / TF-IDF).',
      'Truncated SVD over a sparse user–movie matrix to improve cold-start coverage and ranking relevance.',
      'Cached Streamlit UI with searchable, poster-rich recommendations via the TMDB API.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/BloodRaven5551/movie-recomendation-system' }],
    accent: '#f472b6',
    year: '2026',
    featured: true,
  },
  {
    id: 'route',
    name: 'Smart Route Planner',
    tagline: 'Dijkstra shortest-path over a city graph (C++)',
    description:
      "A C++ shortest-path engine computing optimal routes across a city graph using Dijkstra's algorithm, with CSV-driven data, automated city-to-index mapping, and a clean modular architecture.",
    aiSummary:
      'Core-CS / systems project. Showcases graph algorithms, data structures, and clean modular C++. Good evidence for backend and algorithm-heavy roles.',
    tags: ['C++', 'Graphs', "Dijkstra's Algorithm", 'Data Structures'],
    roles: ['backend'],
    metrics: [
      { label: 'city nodes', value: '50+' },
      { label: 'query time', value: '<1ms' },
      { label: 'module architecture', value: '4' },
    ],
    highlights: [
      "Dijkstra's algorithm over adjacency-list graphs for sub-millisecond path queries.",
      'CSV-driven routes with automated city-to-index mapping — update data without recompiling.',
      '4-module design (graph, route manager, algorithm, utilities) for maintainability and clear path tracing.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/BloodRaven5551/Smart-route-planner' }],
    accent: '#fbbf24',
    year: '2025',
  },
  {
    id: 'devexe',
    name: 'arpit.exe',
    tagline: 'This very portfolio — a playable terminal game',
    description:
      'The site you\'re on: a game-like developer portfolio where visitors unlock sections by typing terminal commands. Features a command parser with fuzzy matching, an in-browser AI guide, an XP/level system, easter eggs, and a working contact form wired to an email service.',
    aiSummary:
      'Frontend-craft + product project. Demonstrates state management, motion design, a custom command engine, an intent-based AI guide, and email integration — all shipped as a fast static site. Strong signal for frontend and design-engineering roles.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Web3Forms'],
    roles: ['frontend', 'fullstack'],
    metrics: [
      { label: 'unlockable sections', value: '11' },
      { label: 'runtime deps', value: 'lean' },
      { label: 'API keys leaked', value: '0' },
    ],
    highlights: [
      'Custom command parser with fuzzy matching, autocomplete, and witty error handling.',
      'In-browser AI guide (intent detection + project recommender) — no backend, no API key.',
      'Zustand state with localStorage persistence for XP, levels, badges, and unlocked sections.',
      'Contact form integrated with an email service (Web3Forms) + SMTP-style mailto fallback.',
    ],
    links: [
      { label: 'Live Site', url: 'https://my-profile-phi-vert.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/arpit-on-githuub/My_profile' },
    ],
    accent: '#a855f7',
    year: '2026',
    featured: true,
  },
];

export const experience: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Research Assistant — Campus Porter App',
    company: 'IIT Jodhpur · Prof. Venkat Raman Reddy',
    period: 'Feb 2026 — Present',
    location: 'Jodhpur, Rajasthan',
    summary: 'Building core MERN-stack workflows for a campus intra-logistics platform.',
    achievements: [
      'Authored a feature-requirements document covering 3 core user flows from workflow design, usability, and stakeholder analysis.',
      'Developed real-time order tracking and QR-based handoff validation, targeting 200+ campus users and cutting manual handoff effort.',
    ],
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    link: { label: 'GitHub', url: 'https://github.com/arpit-on-githuub/campus-porter' },
  },
  {
    id: 'exp-2',
    role: 'Research Assistant — Optimization of Blackjack Strategy',
    company: 'IIT Jodhpur · Prof. Puneet Sharma',
    period: 'Aug 2025 — Nov 2025',
    location: 'Jodhpur, Rajasthan',
    summary: 'Game-theoretic strategy analysis over large-scale Monte Carlo simulation.',
    achievements: [
      'Improved expected return by ~8% over baseline across 50,000+ Monte Carlo simulated blackjack hands.',
      'Validated 10+ minimax decision heuristics against basic-strategy benchmarks; presented results in a final analysis deck.',
    ],
    stack: ['Python', 'Monte Carlo', 'Game Theory'],
    link: { label: 'Slides', url: 'https://drive.google.com/file/d/1cmvFYNGQP8kwqqLfvRLfc5FNRgucWnYv/view?usp=drive_link' },
  },
];

/** A glimpse of ongoing research — Campus Porter. */
export interface ResearchGlimpse {
  project: string;
  subtitle: string;
  lab: string;
  status: string;
  link: { label: string; url: string };
  revealed: string[];
  upcoming: string[];
  note: string;
}

export const research: ResearchGlimpse = {
  project: 'Campus Porter',
  subtitle: 'A campus intra-logistics platform',
  lab: 'IIT Jodhpur · under Prof. Venkat Raman Reddy',
  status: 'Active research · since Feb 2026',
  link: { label: 'peek at the repo', url: 'https://github.com/arpit-on-githuub/campus-porter' },
  revealed: [
    'Real-time order tracking with QR-based handoff validation.',
    'Authored the feature-requirements spec across 3 core user flows.',
    'MERN-stack core, designed to scale to 200+ campus users.',
  ],
  upcoming: [
    'Trust & safety: handoff verification and host-controlled approvals.',
    'Smarter porter assignment with proximity-based routing.',
    'Campus pilot rollout with a rider feedback loop.',
  ],
  note: 'Still cooking. Happy to walk you through the full thing on request.',
};

export const education: EducationItem[] = [
  {
    id: 'edu-iitj',
    school: 'Indian Institute of Technology, Jodhpur',
    qualification: 'B.Tech in Computer Science & Engineering',
    score: 'CGPA 7.57',
    period: 'Aug 2024 — Present',
    location: 'Jodhpur, Rajasthan',
    note: 'JEE Advanced AIR 3061 · JEE Mains AIR 2160 (99.87 & 99.53 %ile, 100% in Physics).',
  },
  {
    id: 'edu-xii',
    school: 'CH. Baldev Singh Model School',
    qualification: 'Senior Secondary (Class XII), CBSE',
    score: '91% Aggregate',
    period: 'Jun 2022 — May 2024',
    location: 'Delhi',
  },
  {
    id: 'edu-x',
    school: 'Scholars Rosary School',
    qualification: 'Secondary (Class X)',
    score: '97.8% Aggregate',
    period: 'Completed 2022',
    location: 'India',
  },
];

/** Courses + the concrete skills each one built (for the "Foundations" view). */
export const courses: Course[] = [
  { name: 'Data Structures & Algorithms', skills: ['Algorithmic thinking', 'Complexity analysis', 'Problem solving'] },
  { name: 'Pattern Recognition & Machine Learning', skills: ['Supervised & unsupervised ML', 'Feature engineering', 'Model evaluation'] },
  { name: 'DBMS', skills: ['Relational modeling', 'SQL', 'Normalization'] },
  { name: 'Maths for Computing', skills: ['Discrete math', 'Mathematical logic'] },
  { name: 'Probability & Statistics', skills: ['Statistical inference', 'Probabilistic modeling'] },
  { name: 'Linear Algebra', skills: ['Matrix methods', 'Vector spaces', 'SVD foundations'] },
  { name: 'Digital Design', skills: ['Logic design', 'Computer architecture basics'] },
  { name: 'Signals & Systems', skills: ['Signal processing', 'Transforms'] },
  { name: 'Software Engineering', skills: ['SDLC', 'Design patterns'] },
  { name: 'Introduction to Computer Science', skills: ['Programming foundations'] },
];

/** "Things I've worked with" — tools & platforms, kept separate from skills. */
export const toolbox: ToolGroup[] = [
  {
    category: 'Frameworks & Libraries',
    icon: '⚛',
    items: [
      { name: 'React', note: 'UI library' },
      { name: 'Next.js', note: 'Full-stack React' },
      { name: 'Vite', note: 'Build tool' },
      { name: 'Node.js', note: 'JS runtime' },
      { name: 'Express.js', note: 'API framework' },
      { name: 'Tailwind CSS', note: 'Styling' },
      { name: 'Framer Motion', note: 'Animation' },
      { name: 'Zustand', note: 'State management' },
    ],
  },
  {
    category: 'APIs & Services',
    icon: '📡',
    items: [
      { name: 'Web3Forms', note: 'Form-to-email' },
      { name: 'SMTP / mailto', note: 'Email delivery' },
      { name: 'REST APIs', note: 'Fetch & integrate' },
      { name: 'TMDB API', note: 'Movie data' },
    ],
  },
  {
    category: 'Data & Platforms',
    icon: '🗄',
    items: [
      { name: 'MongoDB', note: 'NoSQL DB' },
      { name: 'Supabase', note: 'Realtime + auth' },
      { name: 'PostgreSQL', note: 'Relational DB' },
      { name: 'Streamlit', note: 'ML apps' },
      { name: 'Vercel', note: 'Deployment' },
      { name: 'Railway', note: 'Deployment' },
    ],
  },
  {
    category: 'Dev Tools',
    icon: '🛠',
    items: [
      { name: 'Git', note: 'Version control' },
      { name: 'GitHub', note: 'Collaboration' },
      { name: 'VS Code', note: 'Editor' },
      { name: 'Antigravity', note: 'Agentic IDE' },
      { name: 'Anaconda', note: 'Python / data env' },
      { name: 'Google Colab', note: 'Notebooks' },
    ],
  },
  {
    category: 'AI Copilots',
    icon: '⌬',
    items: [
      { name: 'Claude AI', note: 'Pair programmer' },
      { name: 'ChatGPT', note: 'Reasoning & drafts' },
      { name: 'GitHub Copilot', note: 'Inline completion' },
      { name: 'Cursor', note: 'AI code editor' },
      { name: 'Codex', note: 'Coding agent' },
      { name: 'Gemini', note: 'Content grasping' },
      { name: 'Perplexity', note: 'Research & assignments' },
      { name: 'Antigravity AI', note: 'Agentic builds' },
    ],
  },
];

export const achievements: Achievement[] = [
  { id: 'a1', title: 'JEE Advanced 2024', detail: 'All-India Rank 3061 among ~180k qualified candidates.', icon: '🎯' },
  { id: 'a2', title: 'JEE Mains 2024', detail: '99.87 & 99.53 percentile · perfect 100% in Physics.', icon: '💯' },
  { id: 'a3', title: 'Class X — 97.8%', detail: 'Scholars Rosary School. Strong all-round foundation.', icon: '📘' },
  { id: 'a4', title: 'Class XII — 91%', detail: 'CH. Baldev Singh Model School, Delhi (CBSE).', icon: '🎓' },
  { id: 'a5', title: 'Shipped 4+ Projects', detail: 'From realtime full-stack (Vamos) to ML & C++ systems.', icon: '🚀' },
  { id: 'a6', title: 'Research Assistant ×2', detail: 'Campus logistics platform & game-theory optimization.', icon: '🔬' },
];

export const leadership: LeadershipItem[] = [
  { id: 'l1', role: 'Core Member — Cultural Societies', org: 'Drama · Literature · Quiz Society, IIT Jodhpur', icon: '🎭' },
  { id: 'l2', role: 'Finance Assistant Head', org: 'Prometeo & Varchas — IITJ tech & sports fests', icon: '💼' },
  { id: 'l3', role: 'Marketing Assistant Head', org: 'Sandstone Summit — IITJ business summit', icon: '📣' },
  { id: 'l4', role: 'Institute Representative', org: 'Inter IIT Cultural Meet 7.0 & 8.0', icon: '🏛' },
];

/** Knowledge the "AI guide" uses when asked about strengths / role fit. */
export const aiKnowledge = {
  bestAt:
    'building real-time, full-stack web apps (Next.js + Supabase/Postgres and the MERN stack) with a sharp eye for UI polish — backed by solid DSA and applied machine learning.',
  backendPick: 'vamos',
  aiPick: 'movie',
  frontendPick: 'orbit',
  impressivePick: 'vamos',
  values: [
    'Ship real things, not demos.',
    'Correctness first — state machines over vibes.',
    'Motion and polish are features, not decoration.',
  ],
};
