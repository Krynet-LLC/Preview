(() => {
  'use strict';

  // Specific selectors matching the new IDs
  const el = {
    logo: document.getElementById('main-logo'),
    title: document.getElementById('main-title'),
    intro: document.getElementById('main-intro'),
    countdown: document.getElementById('countdown'),
    ceoSection: document.getElementById('ceo-display'),
    ceoImg: document.getElementById('ceo-img'),
    ceoName: document.getElementById('ceo-name'),
    ceoBio: document.getElementById('ceo-bio'),
    platformsGrid: document.getElementById('platforms-grid'),
    techGrid: document.getElementById('tech-grid'),
    sectionsContainer: document.getElementById('dynamic-sections'),
    footerText: document.getElementById('footer-text')
  };

  async function loadConfig() {
    try {
      const r = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
      if (!r.ok) throw new Error("Failed to load config");
      const c = await r.json();
      render(c);
    } catch (err) {
      console.error("Krynet Load Error:", err);
    }
  }

  function render(c) {
    // 1. Logo & Branding
    if (c.site?.siteLogo && el.logo) {
      el.logo.src = c.site.siteLogo;
      el.logo.style.display = 'block'; // Reveal after source is set
    }
    if (el.title) el.title.textContent = c.site?.title || 'Krynet.ai';
    if (el.intro) el.intro.textContent = c.header?.intro || '';

    // 2. CEO Section
    if (c.header?.ceo && el.ceoSection) {
      if (el.ceoImg) el.ceoImg.src = c.header.ceo.img || '';
      if (el.ceoName) el.ceoName.textContent = `${c.header.ceo.name} — ${c.header.ceo.title}`;
      if (el.ceoBio) el.ceoBio.textContent = c.header.ceo.bio || '';
      el.ceoSection.style.display = 'block'; // Reveal CEO card
    }

    // 3. Platforms (Fixed Grid Logic)
    if (Array.isArray(c.header?.platforms) && el.platformsGrid) {
      el.platformsGrid.innerHTML = ''; // Clear loading state
      c.header.platforms.forEach(p => {
        const div = document.createElement('div');
        div.className = 'icon-item';
        // Ensure FA classes are correct: fa-brands or fa-solid
        div.innerHTML = `<i class="${p.icon}"></i> <span>${p.name} ${p.note ? `<small>${p.note}</small>` : ''}</span>`;
        el.platformsGrid.appendChild(div);
      });
    }

    // 4. Technologies
    if (Array.isArray(c.header?.technologies) && el.techGrid) {
      el.techGrid.innerHTML = '';
      c.header.technologies.forEach(t => {
        const div = document.createElement('div');
        div.className = 'icon-item';
        div.innerHTML = `<i class="${t.icon}"></i> <span>${t.name}</span>`;
        el.techGrid.appendChild(div);
      });
    }

    // 5. Dynamic Sections (The rest of the content)
    if (Array.isArray(c.sections) && el.sectionsContainer) {
      el.sectionsContainer.innerHTML = '';
      c.sections.forEach(s => {
        const section = document.createElement('section');
        section.className = 'info-block';
        
        let html = `<h2>${s.title}</h2><div class="feature-grid">`;
        
        if (s.features) {
          s.features.forEach(f => {
            html += `
              <div class="card">
                ${f.icon ? `<i class="${f.icon}"></i>` : ''}
                <strong>${f.title || ''}</strong>
                ${f.badge ? `<span class="badge">${f.badge}</span>` : ''}
                <p>${f.description || f.statement || ''}</p>
              </div>`;
          });
        }
        
        html += `</div>`;
        if (s.note) html += `<p class="section-note"><em>${s.note}</em></p>`;
        
        section.innerHTML = html;
        el.sectionsContainer.appendChild(section);
      });
    }

    if (el.footerText) el.footerText.textContent = c.footer?.text || '';
  }

  // Countdown logic remains the same but targets id="countdown"
  function initCountdown() {
    const target = Date.parse('2030-12-31T00:00:00Z');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        if (el.countdown) el.countdown.textContent = "SYSTEM ONLINE";
        return;
      }
      const d = (diff / 86400000) | 0;
      const h = (diff % 86400000 / 3600000) | 0;
      const m = (diff % 3600000 / 60000) | 0;
      const s = (diff % 60000 / 1000) | 0;
      if (el.countdown) el.countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
    };
    setInterval(tick, 1000);
    tick();
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initCountdown();
  });
})();
