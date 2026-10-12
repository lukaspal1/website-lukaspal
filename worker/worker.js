// ============================================================
// Cloudflare Worker — serves the website's side widgets.
//   /          Faceit CS2 stats   (secret: FACEIT_API_KEY)
//   /spotify   now playing / last played on Spotify
//              (secrets: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN)
// Keys live in the Worker's secrets, never in the site.
// Deploy: paste this into the Cloudflare Worker (see worker/README.md).
// ============================================================

const NICKNAME = 'gluckose';
const FACEIT_CACHE_SECONDS = 600; // fetch from Faceit at most once every 10 minutes
const SPOTIFY_CACHE_SECONDS = 30;

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (path === '/spotify') return cached(request, ctx, '/spotify', () => spotify(env));
    return cached(request, ctx, '/stats', () => faceit(env));
  },
};

// Serve from Cloudflare's cache when possible; only successful responses are cached
async function cached(request, ctx, key, produce) {
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).origin + key);

  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const response = await produce();
  if (response.ok) ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ----- Faceit -----
async function faceit(env) {
  const apiKey = (env.FACEIT_API_KEY || '').trim();
  if (!apiKey) {
    return json({ error: 'The FACEIT_API_KEY secret is not set on this Worker' }, 500, 0);
  }

  const res = await fetch(
    'https://open.faceit.com/data/v4/players?nickname=' + NICKNAME,
    { headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' } }
  );

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    return json({ error: 'Faceit API responded with ' + res.status, detail }, 502, 0);
  }

  const player = await res.json();
  const cs2 = (player.games && player.games.cs2) || {};
  return json({
    level: cs2.skill_level,
    elo: cs2.faceit_elo,
    url: (player.faceit_url || '').split('{lang}').join('en'),
  }, 200, FACEIT_CACHE_SECONDS);
}

// ----- Spotify -----
async function spotify(env) {
  const clientId = (env.SPOTIFY_CLIENT_ID || '').trim();
  const clientSecret = (env.SPOTIFY_CLIENT_SECRET || '').trim();
  const refreshToken = (env.SPOTIFY_REFRESH_TOKEN || '').trim();
  if (!clientId || !clientSecret || !refreshToken) {
    return json({ error: 'Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN on this Worker' }, 500, 0);
  }

  // Swap the long-lived refresh token for a short-lived access token
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  if (!tokenRes.ok) {
    const detail = (await tokenRes.text()).slice(0, 300);
    return json({ error: 'Spotify token request failed with ' + tokenRes.status, detail }, 502, 0);
  }
  const { access_token } = await tokenRes.json();
  const auth = { headers: { Authorization: 'Bearer ' + access_token } };

  // 204 means nothing is playing right now
  const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', auth);
  if (nowRes.status === 200) {
    const now = await nowRes.json();
    if (now.is_playing && now.item && now.currently_playing_type === 'track') {
      return json({ playing: true, ...track(now.item) }, 200, SPOTIFY_CACHE_SECONDS);
    }
  }

  const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', auth);
  if (!recentRes.ok) {
    const detail = (await recentRes.text()).slice(0, 300);
    return json({ error: 'Spotify API responded with ' + recentRes.status, detail }, 502, 0);
  }
  const recent = await recentRes.json();
  const last = recent.items && recent.items[0];
  if (!last) return json({ playing: false }, 200, SPOTIFY_CACHE_SECONDS);

  return json({ playing: false, playedAt: last.played_at, ...track(last.track) }, 200, SPOTIFY_CACHE_SECONDS);
}

function track(item) {
  const images = (item.album && item.album.images) || [];
  return {
    title: item.name,
    artist: (item.artists || []).map((a) => a.name).join(', '),
    // smallest cover is plenty: the widget pixelates it anyway
    image: images.length ? images[images.length - 1].url : '',
    url: (item.external_urls && item.external_urls.spotify) || '',
  };
}

function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=' + maxAge,
    },
  });
}
