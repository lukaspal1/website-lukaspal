// ============================================================
// One-time Spotify sign-in: gets the refresh token the Worker needs.
// Run:  node worker/spotify-auth.mjs
// Your Spotify app must have the redirect URI  http://127.0.0.1:8888/callback
// ============================================================

import http from 'node:http';
import { exec } from 'node:child_process';
import readline from 'node:readline/promises';

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const clientId = (await rl.question('Spotify Client ID: ')).trim();
const clientSecret = (await rl.question('Spotify Client Secret: ')).trim();
rl.close();

const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get('code');
  if (!code) {
    res.end('Spotify did not return a code: ' + (url.searchParams.get('error') || 'unknown error'));
    console.error('\nSign-in failed:', url.searchParams.get('error'));
    server.close();
    return;
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    res.end('Token exchange failed, see the terminal.');
    console.error('\nToken exchange failed:', tokens);
  } else {
    res.end('Done! You can close this tab and go back to the terminal.');
    console.log('\nAdd this to the Worker as the secret SPOTIFY_REFRESH_TOKEN:\n');
    console.log(tokens.refresh_token + '\n');
  }
  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('\nOpening Spotify sign-in in your browser...');
  console.log('If it does not open, visit:\n' + authUrl);
  const opener = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(opener + ' "' + authUrl + '"');
});
