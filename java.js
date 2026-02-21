/* ==================================================
   PRODUCTION SITE SCRIPT
   - Countdown with hype text & emojis
   - Optimized DOM writes
   - Tab visibility aware
================================================== */

(() => {
  'use strict';

  /* =========================
     UTIL
  ========================= */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

  /* =========================
     COUNTDOWN MODULE
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

      releaseEl.innerHTML = `
        <i class="fas fa-calendar-alt"></i> ${hype}${days}d ${hours}h ${minutes}m ${seconds}s
      `;
    };

    update(); // initial call
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
    if (!links.length) return;

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
    initCountdown();
    initButtons();
    initExternalLinks();
  });

})();
