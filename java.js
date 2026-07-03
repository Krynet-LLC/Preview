(() => {
  'use strict';

  // Cached DOM query bindings
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

  /**
   * Safe helper to build structured icon fragments defensively
   */
  function createIconElement(iconClass, fallbackClass = 'fa-solid fa-square') {
    const icon = document.createElement('i');
    if (typeof iconClass === 'string' && iconClass.trim()) {
      const classes = iconClass.split(/\s+/).filter(Boolean);
      icon.classList.add(...classes);
    } else {
      icon.className = fallbackClass;
    }
    return icon;
  }

  /**
   * Pulls exclusively from the root runtime config.json file
   */
  async function loadConfig() {
    try {
      // Relative path avoids CORS and deployment runtime issues on GitHub Pages domains
      const response = await fetch('./config.json', { cache: 'no-cache' });
      
      if (!response.ok) {
        throw new Error(`Could not find or load config.json (HTTP status ${response.status})`);
      }
      
      const config = await response.json();
      render(config);
    } catch (err) {
      console.error("Krynet Configuration Load Error:", err);
    }
  }

  /**
   * Main safe layout build loop
   */
  function render(c) {
    const data = c || {};

    // 1. Branding Core Identification Elements
    if (data.site?.siteLogo && el.logo) {
      el.logo.src = data.site.siteLogo;
      el.logo.style.display = 'block';
    }
    if (el.title) el.title.textContent = data.site?.title || 'Krynet.ai';
    if (el.intro) el.intro.textContent = data.header?.intro || '';

    // 2. Executive Oversight Profile Card
    if (data.header?.ceo && el.ceoSection) {
      const ceo = data.header.ceo;
      if (el.ceoImg) el.ceoImg.src = ceo.img || '';
      if (el.ceoName) el.ceoName.textContent = `${ceo.name || 'Core Operations'} — ${ceo.title || 'CEO'}`;
      if (el.ceoBio) el.ceoBio.textContent = ceo.bio || '';
      el.ceoSection.style.display = 'block';
    }

    // 3. Supported Distributions Grid Framework
    if (el.platformsGrid) {
      el.platformsGrid.textContent = '';
      if (Array.isArray(data.header?.platforms)) {
        data.header.platforms.forEach(p => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'icon-item';

          const icon = createIconElement(p.icon);
          const metaSpan = document.createElement('span');
          metaSpan.textContent = ` ${p.name || ''} `;

          if (p.note) {
            const smallTag = document.createElement('small');
            smallTag.textContent = p.note;
            metaSpan.appendChild(smallTag);
          }

          itemDiv.append(icon, metaSpan);
          el.platformsGrid.appendChild(itemDiv);
        });
      }
    }

    // 4. Integrated Framework Architecture Stack
    if (el.techGrid) {
      el.techGrid.textContent = '';
      if (Array.isArray(data.header?.technologies)) {
        data.header.technologies.forEach(t => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'icon-item';

          const icon = createIconElement(t.icon);
          const titleSpan = document.createElement('span');
          titleSpan.textContent = ` ${t.name || ''}`;

          itemDiv.append(icon, titleSpan);
          el.techGrid.appendChild(itemDiv);
        });
      }
    }

    // 5. Dynamic Procedural Section Matrix
    if (el.sectionsContainer) {
      el.sectionsContainer.textContent = '';
      if (Array.isArray(data.sections)) {
        data.sections.forEach(s => {
          const sectionBlock = document.createElement('section');
          sectionBlock.className = 'info-block';

          const heading = document.createElement('h2');
          heading.textContent = s.title || '';
          sectionBlock.appendChild(heading);

          const gridDiv = document.createElement('div');
          gridDiv.className = 'feature-grid';

          if (Array.isArray(s.features)) {
            s.features.forEach(f => {
              const cardDiv = document.createElement('div');
              cardDiv.className = 'card';

              if (f.icon) {
                cardDiv.appendChild(createIconElement(f.icon));
              }

              const boldTitle = document.createElement('strong');
              boldTitle.textContent = f.title || '';
              cardDiv.appendChild(boldTitle);

              if (f.badge) {
                const badgeSpan = document.createElement('span');
                badgeSpan.className = 'badge';
                badgeSpan.textContent = f.badge;
                cardDiv.appendChild(badgeSpan);
              }

              const descParagraph = document.createElement('p');
              descParagraph.textContent = f.description || f.statement || '';
              cardDiv.appendChild(descParagraph);

              gridDiv.appendChild(cardDiv);
            });
          }

          sectionBlock.appendChild(gridDiv);

          if (s.note) {
            const noteParagraph = document.createElement('p');
            noteParagraph.className = 'section-note';
            const emphasis = document.createElement('em');
            emphasis.textContent = s.note;
            noteParagraph.appendChild(emphasis);
            sectionBlock.appendChild(noteParagraph);
          }

          el.sectionsContainer.appendChild(sectionBlock);
        });
      }
    }

    // 6. Base Legal / Context Attributions
    if (el.footerText) el.footerText.textContent = data.footer?.text || '';
  }

  /**
   * Initializes high-precision release target tracking coordinates
   */
  function initCountdown() {
    const target = Date.parse('2030-12-31T00:00:00Z');
    
    if (isNaN(target)) {
      if (el.countdown) el.countdown.textContent = "SCHEDULING ERROR";
      return;
    }

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        if (el.countdown) el.countdown.textContent = "SYSTEM ONLINE";
        clearInterval(timerId);
        return;
      }
      
      const d = (diff / 86400000) | 0;
      const h = (diff % 86400000 / 3600000) | 0;
      const m = (diff % 3600000 / 60000) | 0;
      const s = (diff % 60000 / 1000) | 0;
      
      if (el.countdown) {
        el.countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
      }
    };

    const timerId = setInterval(tick, 1000);
    tick();
  }

  // Hook entry pipelines smoothly on window status flags
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadConfig();
      initCountdown();
    });
  } else {
    loadConfig();
    initCountdown();
  }
})();
