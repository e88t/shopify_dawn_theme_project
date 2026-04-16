(() => {
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function parseEndDate(raw) {
    if (!raw) return null;
    const value = String(raw).trim();
    if (!value) return null;

    // Accept:
    // - "YYYY-MM-DD HH:MM"
    // - "YYYY-MM-DD HH:MM:SS"
    // - ISO strings ("YYYY-MM-DDTHH:MM:SSZ", "+02:00", etc.)
    // Normalize " " -> "T" for best browser support.
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const ts = Date.parse(normalized);
    if (!Number.isFinite(ts)) return null;
    return new Date(ts);
  }

  function updateTimer(el, endDate) {
    const now = new Date();
    let diffMs = endDate.getTime() - now.getTime();
    if (!Number.isFinite(diffMs) || diffMs <= 0) diffMs = 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const daysEl = el.querySelector('.days');
    const hoursEl = el.querySelector('.hours');
    const minutesEl = el.querySelector('.minutes');
    const secondsEl = el.querySelector('.seconds');

    if (daysEl) daysEl.textContent = pad2(days);
    if (hoursEl) hoursEl.textContent = pad2(hours);
    if (minutesEl) minutesEl.textContent = pad2(minutes);
    if (secondsEl) secondsEl.textContent = pad2(seconds);

    return diffMs > 0;
  }

  function initCountdown(root = document) {
    const timers = root.querySelectorAll('.countdown-timer[data-end-date]');
    timers.forEach((el) => {
      const endDate = parseEndDate(el.dataset.endDate);
      if (!endDate) {
        // If date can't be parsed, keep zeros but avoid spamming console in production.
        return;
      }

      // Avoid duplicating intervals if section is re-rendered in theme editor.
      if (el.__countdownInterval) clearInterval(el.__countdownInterval);

      const tick = () => {
        const keepRunning = updateTimer(el, endDate);
        if (!keepRunning && el.__countdownInterval) {
          clearInterval(el.__countdownInterval);
          el.__countdownInterval = null;
        }
      };

      tick();
      el.__countdownInterval = setInterval(tick, 1000);
    });
  }

  document.addEventListener('DOMContentLoaded', () => initCountdown());

  // Shopify theme editor: section can be dynamically loaded/updated.
  document.addEventListener('shopify:section:load', (event) => {
    if (!event?.target) return;
    initCountdown(event.target);
  });
})();