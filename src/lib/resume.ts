import { profile, skills, projects, experience } from '../data/portfolio';

/** Build a clean, printable HTML resume from the portfolio data. */
export function buildResumeHTML(): string {
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 12).map((s) => s.name);
  const expHTML = experience
    .map(
      (e) => `
      <div class="item">
        <div class="row"><strong>${e.role} · ${e.company}</strong><span>${e.period}</span></div>
        <div class="muted">${e.location}</div>
        <p>${e.summary}</p>
        <ul>${e.achievements.map((a) => `<li>${a}</li>`).join('')}</ul>
        <div class="tags">${e.stack.join(' · ')}</div>
      </div>`,
    )
    .join('');
  const projHTML = projects
    .slice(0, 4)
    .map(
      (p) => `
      <div class="item">
        <div class="row"><strong>${p.name}</strong><span>${p.year}</span></div>
        <div class="muted">${p.tagline}</div>
        <p>${p.description}</p>
        <div class="tags">${p.tags.join(' · ')}</div>
      </div>`,
    )
    .join('');

  return `<!doctype html><html><head><meta charset="utf-8"/>
  <title>${profile.name} — Resume</title>
  <style>
    *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#14161d;max-width:820px;margin:0 auto;padding:48px 40px;line-height:1.5}
    h1{font-size:30px;margin:0} h2{font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:#5b6479;border-bottom:1px solid #e2e4ea;padding-bottom:6px;margin:28px 0 12px}
    .head{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px}
    .role{color:#3b82f6;font-weight:600} .contact{font-size:13px;color:#5b6479;text-align:right}
    .item{margin-bottom:16px} .row{display:flex;justify-content:space-between;font-size:15px} .row span{color:#5b6479;font-size:13px}
    .muted{color:#5b6479;font-size:13px;margin-top:2px} p{margin:6px 0;font-size:13.5px}
    ul{margin:6px 0;padding-left:18px} li{font-size:13.5px;margin:2px 0}
    .tags{font-size:12px;color:#3b82f6;margin-top:4px} .skills{font-size:13.5px}
    @media print{body{padding:0}}
  </style></head><body>
    <div class="head">
      <div><h1>${profile.name}</h1><div class="role">${profile.role}</div></div>
      <div class="contact">${profile.email}<br/>${profile.location}<br/>${profile.socials
    .map((s) => s.handle)
    .join(' · ')}</div>
    </div>
    <h2>Summary</h2><p>${profile.about[0]} ${profile.about[1]}</p>
    <h2>Skills</h2><p class="skills">${topSkills.join(' · ')}</p>
    <h2>Experience</h2>${expHTML}
    <h2>Selected Projects</h2>${projHTML}
  </body></html>`;
}

export function downloadResume() {
  const blob = new Blob([buildResumeHTML()], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function printResume() {
  const w = window.open('', '_blank', 'width=850,height=1100');
  if (!w) return;
  w.document.write(buildResumeHTML());
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
}

/** Opens the live, AI-built resume in a new tab (view only — no print prompt). */
export function viewResume() {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(buildResumeHTML());
  w.document.close();
  w.focus();
}
