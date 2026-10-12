// ============================================================
// Faceit CS2 widget — level + ELO from the Cloudflare Worker in faceit-worker/
// (the Worker holds the API key, so it never appears in the site code)
// ============================================================

(function () {
  const STATS_URL = 'https://faceit-stats.lukaspalubiski1.workers.dev';
  const LEVEL_10_ELO = 2001;

  const card = document.getElementById('faceit-card');
  if (!card || !STATS_URL) return;

  function levelColor(level) {
    if (level >= 10) return '#FE1F00';
    if (level >= 8) return '#FF6309';
    if (level >= 4) return '#FFC800';
    if (level >= 2) return '#1CE400';
    return '#EEEEEE';
  }

  fetch(STATS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Faceit stats ' + res.status);
      return res.json();
    })
    .then(function (stats) {
      if (!stats.level || !stats.elo) return;

      const level = stats.level;
      const elo = stats.elo;

      const levelEl = document.getElementById('faceit-level');
      levelEl.textContent = level;
      levelEl.style.borderColor = levelColor(level);
      levelEl.style.color = levelColor(level);

      document.getElementById('faceit-elo').textContent = elo + ' ELO';
      document.getElementById('faceit-bar-fill').style.width =
        Math.min(100, (elo / LEVEL_10_ELO) * 100) + '%';
      document.getElementById('faceit-goal').textContent = elo >= LEVEL_10_ELO
        ? 'Level 10 reached!'
        : (LEVEL_10_ELO - elo) + ' ELO to level 10';

      card.href = stats.url || 'https://www.faceit.com/en/players/gluckose';
      card.hidden = false;
    })
    .catch(function () {
      // leave the card hidden if the stats can't be fetched
    });
})();
