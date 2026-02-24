(() => {
'use strict';

/* ========= Cached Selectors ========= */
const el = {
  logo: document.querySelector('.site-logo'),
  title: document.querySelector('.title'),
  intro: document.querySelector('.intro'),
  releaseSpan: document.querySelector('.release span'),
  ceoCard: document.querySelector('.ceo-card'),
  platforms: document.querySelector('.platforms'),
  tech: document.querySelector('.tech'),
  sections: document.querySelector('.sections-container'),
  footer: document.querySelector('.footer')
};

/* ========= Config Loader ========= */
async function loadConfig(){
  try{
    const r = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
    if(!r.ok) return;
    const c = await r.json();
    render(c);
  }catch{}
}

/* ========= Render ========= */
function render(c){

  /* Header */
  if(el.logo) el.logo.src = c.site?.siteLogo || '';
  if(el.title) el.title.textContent = c.site?.title || '';
  if(el.intro) el.intro.textContent = c.header?.intro || '';

  if(el.releaseSpan)
    el.releaseSpan.textContent = c.header?.release || '';

  /* CEO */
  if(c.header?.ceo && el.ceoCard){
    const img = el.ceoCard.children[0];
    const h3  = el.ceoCard.children[1];
    const p   = el.ceoCard.children[2];

    if(img) img.src = c.header.ceo.img || '';
    if(h3) h3.textContent = `${c.header.ceo.name || ''} — ${c.header.ceo.title || ''}`;
    if(p) p.textContent = c.header.ceo.bio || '';
  }

  /* Platforms */
  if(Array.isArray(c.header?.platforms) && el.platforms){
    el.platforms.textContent = '';
    for(const p of c.header.platforms){
      const d = document.createElement('div');
      d.className = 'icon-item';
      d.innerHTML = `<i class="${p.icon}"></i> ${p.name}${p.note?` (${p.note})`:''}`;
      el.platforms.appendChild(d);
    }
  }

  /* Tech */
  if(Array.isArray(c.header?.technologies) && el.tech){
    el.tech.textContent = '';
    for(const t of c.header.technologies){
      const d = document.createElement('div');
      d.className = 'icon-item';
      d.innerHTML = `<i class="${t.icon}"></i> ${t.name}`;
      el.tech.appendChild(d);
    }
  }

  /* Sections */
  if(Array.isArray(c.sections) && el.sections){
    el.sections.textContent = '';

    for(const s of c.sections){
      const sec = document.createElement('section');
      sec.innerHTML = `<h2>${s.title}</h2>`;
      
      if(Array.isArray(s.features)){
        const grid = document.createElement('div');
        grid.className = 'feature-grid';

        for(const f of s.features){
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML =
            `${f.icon?`<i class="${f.icon}"></i>`:''}
             ${f.title?`<strong>${f.title}</strong>`:''}
             ${f.badge?` <span class="badge ${f.badge.toLowerCase()}">${f.badge}</span>`:''}
             ${f.description?`<p>${f.description}</p>`:''}
             ${f.statement?`<p>${f.statement}</p>`:''}`;
          grid.appendChild(card);
        }

        sec.appendChild(grid);
      }

      if(s.note){
        const note = document.createElement('p');
        note.className = 'section-note';
        note.textContent = s.note;
        sec.appendChild(note);
      }

      if(Array.isArray(s.repos)){
        const repo = document.createElement('div');
        repo.className = 'repo-list';
        for(const r of s.repos){
          const a = document.createElement('a');
          a.href = r.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.innerHTML = `<strong>${r.name}</strong> — ${r.description}`;
          repo.appendChild(a);
        }
        sec.appendChild(repo);
      }

      el.sections.appendChild(sec);
    }
  }

  if(el.footer) el.footer.textContent = c.footer?.text || '';
}

/* ========= Optimized Countdown ========= */

/*
Ultra-light math:
- No modulus chains
- No repeated Date allocations
- Pre-calculated constants
- Updates only text node
*/

function initCountdown(){

  if(!el.releaseSpan) return;

  const target = Date.parse('2030-12-31T00:00:00Z');

  const DAY  = 86400000;
  const HOUR = 3600000;
  const MIN  = 60000;

  function tick(){
    const diff = target - Date.now();
    if(diff <= 0){
      el.releaseSpan.textContent = '🚀 Krynet.ai is LIVE.';
      return;
    }

    const d = (diff / DAY)  | 0;
    const h = (diff % DAY   / HOUR) | 0;
    const m = (diff % HOUR  / MIN)  | 0;
    const s = (diff % MIN   / 1000) | 0;

    el.releaseSpan.textContent =
      `🚀 ${d}d ${h}h ${m}m ${s}s`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ========= Init ========= */
document.addEventListener('DOMContentLoaded',()=>{
  loadConfig();
  initCountdown();
});

})();
