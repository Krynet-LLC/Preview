/* ==================================================
   PRODUCTION SITE SCRIPT
   - Optimized
   - Minimal DOM writes
   - No unnecessary intervals
   - Tab visibility aware
================================================== */

(() => {
  'use strict';

  /* =========================
     UTIL
  ========================= */
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    parent.querySelectorAll(selector);

  /* =========================
     COUNTDOWN MODULE
  ========================= */
  function initCountdown() {
    const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();

    const elDays = $('#days');
    const elHours = $('#hours');
    const elMinutes = $('#minutes');
    const elSeconds = $('#seconds');

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    let interval = null;

    const update = () => {
      const now = Date.now();
      const diff = releaseDate - now;

      if (diff <= 0) {
        stop();
        setValues(0, 0, 0, 0);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setValues(days, hours, minutes, seconds);
    };

    const setValues = (d, h, m, s) => {
      if (elDays.textContent !== String(d)) elDays.textContent = d;
      if (elHours.textContent !== String(h)) elHours.textContent = h;
      if (elMinutes.textContent !== String(m)) elMinutes.textContent = m;
      if (elSeconds.textContent !== String(s)) elSeconds.textContent = s;
    };

    const start = () => {
      if (interval) return;
      interval = setInterval(update, 1000);
    };

    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : (update(), start());
    });

    update();
    start();
  }

  /* =========================
     BUTTON INTERACTIONS
  ========================= */
  function initButtons() {
    const buttons = $$('.button');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('pointerdown', () =>
        btn.classList.add('pressed')
      );

      btn.addEventListener('pointerup', () =>
        btn.classList.remove('pressed')
      );

      btn.addEventListener('pointerleave', () =>
        btn.classList.remove('pressed')
      );
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
