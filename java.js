(() => {
'use strict';

/* =========================
   UTIL
========================= */
const $ = (s,p=document)=>p.querySelector(s);
const create = (tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e;};

/* =========================
   LOAD CONFIG
========================= */
async function loadConfig(){
  const res = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
  const config = await res.json();
  renderSite(config);
}

/* =========================
   RENDER SITE
========================= */
function renderSite(config){

  /* HEADER */
  $('.site-logo').src = config.site.siteLogo;
  $('.title').textContent = config.site.title;
  $('.intro').textContent = config.header.intro;
  $('.release span').textContent = config.header.release;

  /* CEO */
  const ceo = config.header.ceo;
  const ceoCard = $('.ceo-card');
  ceoCard.querySelector('img').src = ceo.img;
  ceoCard.querySelector('h3').textContent = `${ceo.name} — ${ceo.title}`;
  ceoCard.querySelector('p').textContent = ceo.bio;

  /* PLATFORMS */
  const platforms = $('.platforms');
  platforms.innerHTML = '';
  config.header.platforms.forEach(p=>{
    const div=create('div','icon-item');
    div.innerHTML=`<i class="${p.icon}"></i> ${p.name}${p.note?` (${p.note})`:''}`;
    platforms.appendChild(div);
  });

  /* TECHNOLOGIES */
  const tech = $('.tech');
  tech.innerHTML='';
  config.header.technologies.forEach(t=>{
    const div=create('div','icon-item');
    div.innerHTML=`<i class="${t.icon}"></i> ${t.name}`;
    tech.appendChild(div);
  });

  /* DYNAMIC SECTIONS */
  renderSections(config.sections);

  /* FOOTER */
  $('.footer').textContent = config.footer.text;
}

/* =========================
   SECTIONS (CLEAN STRUCTURE)
========================= */
function renderSections(sections){
  const container = $('.sections-container');
  container.innerHTML='';

  sections.forEach(section=>{
    const sec=create('section');
    
    // Section Title
    const h2=create('h2');
    h2.textContent=section.title;
    sec.appendChild(h2);

    // Features
    if(section.features){
      const grid=create('div','feature-grid');

      section.features.forEach(feature=>{
        const card=create('div','card');

        let html='';
        if(feature.icon) html+=`<i class="${feature.icon}"></i> `;
        if(feature.title) html+=`<strong>${feature.title}</strong>`;
        if(feature.badge) html+=` <span class="badge ${feature.badge.toLowerCase()}">${feature.badge}</span>`;
        if(feature.description) html+=`<p>${feature.description}</p>`;
        if(feature.statement) html+=`<p>${feature.statement}</p>`;

        card.innerHTML=html;
        grid.appendChild(card);
      });

      sec.appendChild(grid);
    }

    // Note
    if(section.note){
      const note=create('p','section-note');
      note.textContent=section.note;
      sec.appendChild(note);
    }

    // Repos
    if(section.repos){
      const repoList=create('div','repo-list');
      section.repos.forEach(r=>{
        const a=create('a');
        a.href=r.url;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.innerHTML=`<strong>${r.name}</strong> — ${r.description}`;
        repoList.appendChild(a);
      });
      sec.appendChild(repoList);
    }

    container.appendChild(sec);
  });
}

/* =========================
   COUNTDOWN
========================= */
function initCountdown(){
  const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();
  const releaseEl = $('.release');
  if(!releaseEl) return;

  const update=()=>{
    const diff=releaseDate-Date.now();
    if(diff<=0){
      releaseEl.innerHTML='🚀 Krynet.ai is LIVE.';
      return;
    }
    const d=Math.floor(diff/86400000);
    const h=Math.floor(diff%86400000/3600000);
    const m=Math.floor(diff%3600000/60000);
    const s=Math.floor(diff%60000/1000);

    releaseEl.innerHTML=`<i class="fas fa-calendar-alt"></i> 🚀 ${d}d ${h}h ${m}m ${s}s`;
  };

  update();
  setInterval(update,1000);
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded',()=>{
  loadConfig();
  initCountdown();
});

})();
