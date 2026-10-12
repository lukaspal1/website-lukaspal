// ============================================================
// Spotify widget — now playing / last played, from the Cloudflare Worker in worker/
// ============================================================

(function () {
  const SPOTIFY_URL = 'https://faceit-stats.lukaspalubiski1.workers.dev/spotify';
  const REFRESH_MS = 60000;

  const card = document.getElementById('spotify-card');
  if (!card) return;

  const statusEl = document.getElementById('spotify-status');
  const eqEl = document.getElementById('spotify-eq');
  const titleEl = document.getElementById('spotify-title');
  const artistEl = document.getElementById('spotify-artist');
  const cover = document.getElementById('spotify-cover');
  let currentImage = '';

  function timeAgo(iso) {
    const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    return Math.round(hours / 24) + 'd ago';
  }

  // Scroll the title if it doesn't fit (measured while the card is visible)
  function fitTitle() {
    const inner = titleEl.firstChild;
    if (!inner) return;
    titleEl.classList.remove('marquee');
    const distance = inner.offsetWidth - titleEl.clientWidth;
    if (distance > 0) {
      titleEl.style.setProperty('--marquee-distance', distance + 'px');
      titleEl.style.setProperty('--marquee-time', (2 + distance / 20) + 's');
      titleEl.classList.add('marquee');
    }
  }

  // Draw the album art into the tiny canvas; CSS scales it up pixelated
  function drawCover(url) {
    if (url === currentImage) return;
    currentImage = url;
    const ctx = cover.getContext('2d');
    ctx.clearRect(0, 0, cover.width, cover.height);
    if (!url) return;
    const img = new Image();
    img.onload = function () {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, cover.width, cover.height);
    };
    img.src = url;
  }

  function update() {
    fetch(SPOTIFY_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Spotify ' + res.status);
        return res.json();
      })
      .then(function (song) {
        if (!song.title) return;

        statusEl.textContent = song.playing
          ? 'Now playing'
          : 'Last played' + (song.playedAt ? ' · ' + timeAgo(song.playedAt) : '');
        eqEl.hidden = !song.playing;
        const titleChanged = !titleEl.firstChild || titleEl.firstChild.textContent !== song.title;
        if (titleChanged) {
          const inner = document.createElement('span');
          inner.textContent = song.title;
          titleEl.replaceChildren(inner);
        }
        artistEl.textContent = song.artist;
        card.href = song.url || 'https://open.spotify.com';
        drawCover(song.image);
        card.hidden = false;
        if (titleChanged) fitTitle();
      })
      .catch(function () {
        // keep showing the last song if a refresh fails; stay hidden if none loaded yet
      });
  }

  update();
  setInterval(update, REFRESH_MS);
  // the card changes width when it moves between the sidebar and under the photo
  window.addEventListener('resize', fitTitle);
})();
