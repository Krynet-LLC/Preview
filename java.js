/* ==================================================
   PRODUCTION SITE SCRIPT - Countdown + Hype
================================================== */
(() => {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

  /* =========================
     DYNAMIC COUNTDOWN WITH HYPE
  ========================= */
  function initCountdown() {
    const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();
    const header = $('header.hero');
    if (!header) return;

    // Countdown container
    const countdownEl = document.createElement('div');
    countdownEl.className = 'countdown';
    const countdownText = document.createElement('div');
    countdownText.className = 'countdown-text';
    countdownEl.appendChild(countdownText);

    ['days','hours','minutes','seconds'].forEach(id => {
      const span = document.createElement('span');
      span.id = id;
      span.textContent = '0';
      countdownEl.appendChild(span);
      countdownEl.appendChild(document.createTextNode(id[0])); // d,h,m,s
    });
    header.appendChild(countdownEl);

    const update = () => {
      const now = Date.now();
      const diff = releaseDate - now;

      if (diff <= 0) {
        countdownText.textContent = "🎉 It’s here! Krynet.ai is live!";
        ['days','hours','minutes','seconds'].forEach(id => $(id).textContent = '0');
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      $('#days').textContent = days;
      $('#hours').textContent = hours;
      $('#minutes').textContent = minutes;
      $('#seconds').textContent = seconds;

      // Dynamic hype text
      if (days > 365) countdownText.textContent = "🚀 Krynet.ai is launching soon!";
      else if (days <= 365 && days > 30) countdownText.textContent = `⏳ ${days} days until lift-off!`;
      else if (days <= 30 && days > 7) countdownText.textContent = `🔥 Almost there! Only ${days} days!`;
      else if (days <= 7) countdownText.textContent = `⚡ Final countdown! ${days} days, ${hours}h ${minutes}m ${seconds}s!`;
    };

    let interval = setInterval(update, 1000);
    document.addEventListener('visibilitychange', () => {
      clearInterval(interval);
      if (!document.hidden) interval = setInterval(update, 1000);
    });

    update();
  }

  /* =========================
     BUTTON INTERACTIONS
  ========================= */
  function initButtons() {
    $$('.button').forEach(btn => {
      btn.addEventListener('pointerdown', () => btn.classList.add('pressed'));
      btn.addEventListener('pointerup', () => btn.classList.remove('pressed'));
      btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
    });
  }

  /* =========================
     EXTERNAL LINK SAFETY
  ========================= */
  function initExternalLinks() {
    $$('a[href^="http"]').forEach(link => {
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
