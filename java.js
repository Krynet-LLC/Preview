
/* =========================
   MINI UTIL
========================= */
const $ = (s, p = document) => p.querySelector(s);

/* =========================
   COUNTDOWN
========================= */
function initCountdown() {
  const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();

  const elDays = $('#days');
  const elHours = $('#hours');
  const elMinutes = $('#minutes');
  const elSeconds = $('#seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  let interval;

  const update = () => {
    const now = Date.now();
    const diff = releaseDate - now;

    if (diff <= 0) {
      clearInterval(interval);
      elDays.textContent = 0;
      elHours.textContent = 0;
      elMinutes.textContent = 0;
      elSeconds.textContent = 0;
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    // Only update if changed (micro-optimization)
    if (elDays.textContent !== String(days)) elDays.textContent = days;
    if (elHours.textContent !== String(hours)) elHours.textContent = hours;
    if (elMinutes.textContent !== String(minutes)) elMinutes.textContent = minutes;
    if (elSeconds.textContent !== String(seconds)) elSeconds.textContent = seconds;
  };

  interval = setInterval(update, 1000);
  update();

  // Pause when tab inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      update();
      interval = setInterval(update, 1000);
    }
  });
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
});
