# DEV.EXE — A Playable Developer Portfolio

A high-end, interactive portfolio for **Arpit** (CSE @ IIT Jodhpur) that feels like a
**coding game / terminal challenge**. Visitors unlock sections (projects, skills, education,
experience, contact…) by typing commands like `visit projects`, `load education`, or
`run portfolio()`. It ships with an in-browser **AI guide**, an XP/level system, badges,
quests, easter eggs, and Awwwards-style motion — while still working as a serious,
recruiter-friendly portfolio.

> Built with React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion + Zustand.

---

## ✨ Highlights

- **Command-driven navigation** — type commands in the on-page terminal to unlock sections.
  Fuzzy matching tolerates typos and suggests "did you mean …?".
- **Two-zone layout** — left = terminal challenge, right = Mission Control (quest log, hints, HUD).
- **10 unlockable sections** — About, Skills, Education (with JEE ranks + coursework-derived
  skills), Toolbox ("things I've worked with"), Projects, Experience, Achievements (+ leadership),
  Contact, Resume, and an AI Playground.
- **Cursor-following project preview** — hover a featured build and a floating app-window mock
  tracks your cursor. Plus 3D tilt cards and magnetic buttons.
- **In-browser AI guide** — intent detection + project recommender + Q&A. No API key required.
  Ask "best project for backend roles" or "what are they best at?" and it answers *and* opens the
  right panel. (Structured so a real LLM can be dropped into `src/lib/ai.ts → generateReply()`.)
- **Gamification** — XP, levels, badges, a quest log, achievement toasts, and a portfolio-completion
  progress bar. Progress persists via `localStorage`.
- **Easter eggs** — secret commands (`matrix`, `sudo`, `coffee`, `hack`, …), the Konami code, and an
  "inspect source" console message.
- **Premium visuals** — glassmorphism, animated gradient borders, particle field, cursor aura,
  4 switchable themes (Aurora / Synthwave / Matrix / Solar), CRT scanline mode.
- **Accessible & responsive** — keyboard navigation, `prefers-reduced-motion` fallback, skip link,
  semantic structure, SEO meta, and a `<noscript>` fallback.

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-check (tsc) + production build to /dist
npm run preview  # preview the production build
npm run lint     # oxlint
```

---

## 🎮 How to play

Type into the terminal (or click a quest in Mission Control):

| Command               | Unlocks / does                          |
| --------------------- | --------------------------------------- |
| `help`                | List every command                      |
| `decode about`        | About section                           |
| `show skills`         | Skill tree                              |
| `load education`      | Education, JEE ranks & coursework       |
| `open toolbox`        | Tools & platforms I've worked with      |
| `visit projects`      | Project build log (hover to preview!)   |
| `trace experience`    | Career timeline                         |
| `unlock achievements` | Achievements, stats & leadership        |
| `contact me`          | Boss-level contact form                 |
| `open resume`         | Resume (view / download / print)        |
| `enter ai`            | AI playground                           |
| `run portfolio()`     | Speed-run: unlock everything            |
| `ask <question>`      | Talk to the AI guide                    |
| `theme` / `crt`       | Cycle theme / toggle scanlines          |
| `progress` / `reset`  | Show progress / wipe save               |

Secret commands and the Konami code exist. Curiosity is rewarded. 😉

---

## 🧩 Make it yours

**Everything lives in one file:** [`src/data/portfolio.ts`](src/data/portfolio.ts).
Edit `profile` (name, email, phone, socials, resume link), `skills`, `projects` (with their
links), `experience`, `education`, `courses`, `toolbox`, `achievements`, `leadership`, and
`aiKnowledge` — the whole site (including the AI guide and the generated resume) updates
automatically.

Other customization points:

- **Sections / commands** — `src/data/sections.ts` (titles, commands, aliases, XP, hints, quests).
- **Badges** — `src/data/badges.ts`.
- **AI behavior** — `src/lib/ai.ts` (`generateReply()` is the single hook to swap in a real LLM).
- **Themes & design tokens** — `src/index.css` (`@theme` + `html[data-theme='…']` blocks).
- **SEO / social** — `index.html` (title, meta, Open Graph) and `public/og-cover.svg`.
- **Resume** — `src/lib/resume.ts`. `profile.resumeUrl` links your hosted PDF; the client
  can also generate one live from the data.

---

## 🏗️ Architecture

```
src/
├─ data/            # content + config (portfolio, sections, badges) — edit these
├─ store/           # Zustand game store (unlocks, XP, badges, toasts, theme) + persistence
├─ lib/             # commands parser, AI engine, fuzzy match, resume gen, utils, Konami hook
├─ components/
│  ├─ effects/      # animated background, particles, cursor aura
│  ├─ ui/           # GlassCard, GlowButton, TiltCard, Magnetic, TypeWriter, counters, etc.
│  ├─ terminal/     # the command terminal + autocomplete
│  ├─ mission/      # Mission Control (HUD, quest log, hints, badges)
│  ├─ sections/     # Home, About, Skills, Education, Toolbox, Projects, Experience,
│  │                #   Achievements, Contact, Resume, AI  (+ ProjectShowcase hover preview)
│  └─ system/       # BootScreen, ToastStack, AssistantPanel, AIChat
└─ App.tsx          # layout + theming + deep-linking + scroll orchestration
```

---

## ♿ Accessibility & performance notes

- Respects `prefers-reduced-motion` (ambient animation and counters degrade gracefully).
- Full keyboard support in the terminal (history, `Tab` autocomplete, `Esc`), a skip link, focus-visible
  styles, and ARIA labels on interactive controls.
- Particle/cursor effects are pointer- and motion-aware and won't run on touch / reduced-motion.
- Progress is stored locally; no tracking, no backend, no API keys.

Enjoy — and `run portfolio()`.
