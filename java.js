/* ==================================================
   Krynet.ai Preview JS
   - Loads config.json from GitHub
   - Countdown with hype text
   - Renders all sections, platforms, tech, CEO, repos
   - Adds "Out Now!" button when countdown ends
   - Animations & tab visibility aware
================================================== */
(() => {
  'use strict';

  /* =========================
     UTIL
  ========================= */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const createEl = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => el.setAttribute(k, v));
    children.forEach(c => el.appendChild(c));
    return el;
  };
  const fadeIn = (el, delay = 0) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = `all 0.6s ease ${delay}s`;
    requestAnimationFrame(() => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    });
  };

  /* =========================
     CONFIG LOAD
  ========================= */
  async function loadConfig() {
    const res = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
    const config = await res.json();
    renderSite(config);
  }

  /* =========================
     RENDER SITE
  ========================= */
  function renderSite(config) {
    // Header
    $('.site-logo').src = config.site.siteLogo;
    $('.title').textContent = config.site.title;
    $('.intro').textContent = config.header.intro;
    $('.release span').textContent = config.site.releaseYear;

    // CEO
    const ceo = config.header.ceo;
    const ceoCard = $('.ceo-card');
    ceoCard.querySelector('img').src = ceo.img;
    ceoCard.querySelector('h3').textContent = `${ceo.name} — ${ceo.title}`;
    ceoCard.querySelector('p').textContent = ceo.bio;

    // Platforms
    const platformsContainer = $('.icon-grid.platforms');
    platformsContainer.innerHTML = '';
    config.header.platforms.forEach((p, i) => {
      const div = createEl('div', { class: 'icon-item' });
      div.innerHTML = `<i class="${p.icon}"></i> ${p.name}${p.note ? ' (' + p.note + ')' : ''}`;
      platformsContainer.appendChild(div);
      fadeIn(div, i * 0.05);
    });

    // Technologies
    const techContainer = $('.icon-grid.tech');
    techContainer.innerHTML = '';
    config.header.technologies.forEach((t, i) => {
      const div = createEl('div', { class: 'icon-item' });
      div.innerHTML = `<i class="${t.icon}"></i> ${t.name}`;
      techContainer.appendChild(div);
      fadeIn(div, i * 0.05);
    });

    // Sections
    const sectionsContainer = $('.sections-container');
    sectionsContainer.innerHTML = '';
    config.sections.forEach((section, idx) => {
      const sec = createEl('section');
      sec.appendChild(createEl('h2', {}, [document.createTextNode(section.title)]));

      // Features
      if (section.features) {
        const ul = createEl('ul', { class: 'feature-grid' });
        section.features.forEach((f, i) => {
          const li = createEl('li', { class: 'card' });
          li.innerHTML = `<i class="${f.icon}"></i> ${f.title}${f.badge ? ' <span class="badge ' + f.badge.toLowerCase() + '">' + f.badge + '</span>' : ''}${f.description ? '<br><small>' + f.description + '</small>' : ''}${f.statement ? '<br><small>' + f.statement + '</small>' : ''}`;
          ul.appendChild(li);
          fadeIn(li, i * 0.05);
        });
        sec.appendChild(ul);
      }

      // Note
      if (section.note) {
        const p = createEl('p');
        p.textContent = section.note;
        sec.appendChild(p);
      }

      // Repos
      if (section.repos) {
        const repoDiv = createEl('div', { class: 'repo-list' });
        section.repos.forEach(r => {
          const a = createEl('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' });
          a.textContent = r.name + ' — ' + r.description;
          repoDiv.appendChild(a);
          repoDiv.appendChild(document.createElement('br'));
        });
        sec.appendChild(repoDiv);
      }

      sectionsContainer.appendChild(sec);
      fadeIn(sec, idx * 0.1);
    });

    // Footer
    $('footer.footer').textContent = config.footer.text;
  }

  /* =========================
     COUNTDOWN
  ========================= */
  function initCountdown() {
    const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();
    const releaseEl = $('.release');
    if (!releaseEl) return;

    const update = () => {
      const now = Date.now();
      const diff = releaseDate - now;

      if (diff <= 0) {
        releaseEl.innerHTML = '🚀 Krynet.ai has launched! 🎉';
        clearInterval(interval);

        // Out Now button
        const parent = releaseEl.parentElement;
        const outText = createEl('p', { class: 'out-now-text' });
        outText.textContent = 'Out Now!';
        const outButton = createEl('a', { href: 'https://krynet.ai', class: 'out-now-button' });
        outButton.textContent = 'Visit Krynet.ai';
        parent.appendChild(outText);
        parent.appendChild(outButton);
        fadeIn(outText, 0);
        fadeIn(outButton, 0.1);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      let hype = '';
      if (days < 7) hype = '🔥 Almost there! ';
      else if (days < 30) hype = '🚀 Launch is coming! ';
      else if (days < 365) hype = '⚡ Get ready! ';

      releaseEl.innerHTML = `<i class="fas fa-calendar-alt"></i> ${hype}${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    update();
    const interval = setInterval(update, 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) update();
    });
  }

  /* =========================
     BUTTON INTERACTIONS
  ========================= */
  function initButtons() {
    const buttons = $$('.button');
    if (!buttons.length) return;
    buttons.forEach(btn => {
      btn.addEventListener('pointerdown', () => btn.classList.add('pressed'));
      btn.addEventListener('pointerup', () => btn.classList.remove('pressed'));
      btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
    });
  }

  /* =========================
     EXTERNAL LINK SAFETY
  ========================= */
  function initExternalLinks() {
    const links = $$('a[href^="http"]');
    links.forEach(link => {
      if (link.hostname !== location.hostname) {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
      }
    });
  }

  /* =========================
     INIT
  ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initCountdown();
    initButtons();
    initExternalLinks();
  });

})();
