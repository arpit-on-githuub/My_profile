export interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const BADGES: Record<string, BadgeDef> = {
  first_blood: { id: 'first_blood', name: 'First Contact', desc: 'Ran your first command.', icon: '⌁' },
  explorer: { id: 'explorer', name: 'Explorer', desc: 'Unlocked 3 sections.', icon: '🧭' },
  completionist: { id: 'completionist', name: '100% Clear', desc: 'Unlocked every section.', icon: '🏁' },
  hacker: { id: 'hacker', name: 'Curious Hacker', desc: 'Discovered a secret command.', icon: '🕶️' },
  ai_whisperer: { id: 'ai_whisperer', name: 'AI Whisperer', desc: 'Held a real conversation with the guide.', icon: '⌬' },
  chameleon: { id: 'chameleon', name: 'Chameleon', desc: 'Tried a different theme.', icon: '🎨' },
  konami: { id: 'konami', name: 'The Konami Code', desc: '↑↑↓↓←→←→ B A. Respect.', icon: '🎮' },
  recruiter: { id: 'recruiter', name: 'Talent Scout', desc: 'Made it to the boss level: contact.', icon: '🤝' },
};
