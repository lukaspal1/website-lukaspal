# Side widgets Worker

Cloudflare Worker (`faceit-stats.lukaspalubiski1.workers.dev`) that serves the sidebar widgets while keeping API keys secret.

| Path       | Widget                     | Secrets                                                           |
|------------|----------------------------|-------------------------------------------------------------------|
| `/`        | Faceit CS2 level + ELO     | `FACEIT_API_KEY`                                                  |
| `/spotify` | Spotify now / last played  | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |

## Updating the Worker
Cloudflare dashboard → **Workers & Pages** → `faceit-stats` → **Edit code**, replace everything with `worker.js`, **Deploy**.

## Secrets
Worker **Settings** → **Variables and Secrets** → **Add** → type **Secret**.

## Spotify refresh token (one-time)
1. The Spotify app needs the redirect URI `http://127.0.0.1:8888/callback`.
2. Run `node worker/spotify-auth.mjs`, enter the Client ID and Client Secret, and approve in the browser.
3. Save the printed token as the `SPOTIFY_REFRESH_TOKEN` secret.
