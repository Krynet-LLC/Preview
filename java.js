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
  async function loadConfig() {
    try {
      // In a production 2030 environment, ensure this URL uses Subresource Integrity if possible
      const response = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const config = await response.json();
      render(config);
    } catch (err) {
      console.error('Krynet: Failed to load security configuration.', err);
      if (el.intro) el.intro.textContent = "Krynet is currently performing a secure handshake. Please refresh.";
    }
  }

  /* ========= Helper: Create Element Safely ========= */
  // Prevents XSS by avoiding innerHTML
  function createIconItem(iconClass, text) {
    const div = document.createElement('div');
    div.className = 'icon-item';
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    
    div.append(icon, ` ${text}`);
    return div;
  }

  /* ========= Render ========= */
  function render(c) {
    /* Header & Branding */
    if (el.logo) el.logo.src = c.site?.siteLogo || '';
    if (el.title) el.title.textContent = c.site?.title || '';
    if (el.intro) el.intro.textContent = c.header?.intro || '';

    /* CEO Section - Using IDs for precision */
    const ceoImg = document.getElementById('ceo-img');
    const ceoName = document.getElementById('ceo-name');
    const ceoBio = document.getElementById('ceo-bio');

    if (c.header?.ceo) {
      if (ceoImg) ceoImg.src = c.header.ceo.img || '';
      if (ceoName) ceoName.textContent = `${c.header.ceo.name} — ${c.header.ceo.title}`;
      if (ceoBio) ceoBio.textContent = c.header.ceo.bio || '';
    }

    /* Platforms */
    if (Array.isArray(c.header?.platforms) && el.platforms) {
      el.platforms.textContent = '';
      c.header.platforms.forEach(p => {
        const note = p.note ? ` (${p.note})` : '';
        el.platforms.appendChild(createIconItem(p.icon, `${p.name}${note}`));
      });
    }

    /* Tech Stack */
    if (Array.isArray(c.header?.technologies) && el.tech) {
      el.tech.textContent = '';
      c.header.technologies.forEach(t => {
        el.tech.appendChild(createIconItem(t.icon, t.name));
      });
    }

    /* Dynamic Sections */
    if (Array.isArray(c.sections) && el.sections) {
      el.sections.textContent = '';

      c.sections.forEach(s => {
        const sec = document.createElement('section');
        const h2 = document.createElement('h2');
        h2.textContent = s.title;
        sec.appendChild(h2);

        if (Array.isArray(s.features)) {
          const grid = document.createElement('div');
          grid.className = 'feature-grid';

          s.features.forEach(f => {
            const card = document.createElement('div');
            card.className = 'card';
            
            if (f.icon) {
              const icon = document.createElement('i');
              icon.className = f.icon;
              card.appendChild(icon);
            }

            if (f.title) {
              const strong = document.createElement('strong');
              strong.textContent = ` ${f.title}`;
              card.appendChild(strong);
            }

            if (f.badge) {
              const span = document.createElement('span');
              span.className = `badge ${f.badge.toLowerCase()}`;
              span.textContent = f.badge;
              card.appendChild(span);
            }

            const p = document.createElement('p');
            p.textContent = f.description || f.statement || '';
            card.appendChild(p);
            
            grid.appendChild(card);
          });
          sec.appendChild(grid);
        }

        if (s.note) {
          const note = document.createElement('p');
          note.className = 'section-note';
          note.textContent = s.note;
          sec.appendChild(note);
        }

        if (Array.isArray(s.repos)) {
          const repoContainer = document.createElement('div');
          repoContainer.className = 'repo-list';
          s.repos.forEach(r => {
            const a = document.createElement('a');
            a.href = r.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer'; // Privacy: No leak
            
            const str = document.createElement('strong');
            str.textContent = r.name;
            
            a.append(str, ` — ${r.description}`);
            repoContainer.appendChild(a);
          });
          sec.appendChild(repoContainer);
        }

        el.sections.appendChild(sec);
      });
    }

    if (el.footer) el.footer.textContent = c.footer?.text || '';
  }

  /* ========= Optimized Countdown ========= */
  function initCountdown() {
    if (!el.releaseSpan) return;

    const target = Date.parse('2030-12-31T00:00:00Z');
    const DAY = 86400000;
    const HOUR = 3600000;
    const MIN = 60000;

    function tick() {
      const diff = target - Date.now();
      
      if (diff <= 0) {
        el.releaseSpan.textContent = '🚀 Krynet.ai is LIVE.';
        return;
      }

      const d = (diff / DAY) | 0;
      const h = (diff % DAY / HOUR) | 0;
      const m = (diff % HOUR / MIN) | 0;
      const s = (diff % MIN / 1000) | 0;

      el.releaseSpan.textContent = `🚀 ${d}d ${h}h ${m}m ${s}s`;
      
      // Update every second using a timer, but requestAnimationFrame is better for UI
      setTimeout(() => requestAnimationFrame(tick), 1000);
    }

    tick();
  }

  /* ========= Init ========= */
  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initCountdown();
  });

})();
