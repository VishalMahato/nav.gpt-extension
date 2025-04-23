/// <reference types="chrome" />
import { generatePkcePair } from './utils/pkce';

chrome.runtime.onMessage.addListener((msg) => {
  if (msg === 'LOGIN') startOAuth();
});

async function startOAuth() {
  const { verifier, challenge } = await generatePkcePair();
  await chrome.storage.local.set({ pkce_verifier: verifier });

  const clientId = '<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com';
  const redirectUri = chrome.identity.getRedirectURL();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account'
  });

  chrome.identity.launchWebAuthFlow(
    { url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, interactive: true },
    async (callbackUrl) => {
      if (chrome.runtime.lastError || !callbackUrl) return;
      const code = new URL(callbackUrl).searchParams.get('code')!;
      const { pkce_verifier } = await chrome.storage.local.get('pkce_verifier');
      const resp = await fetch('https://your-domain.com/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          code_verifier: pkce_verifier,
          redirect_uri: redirectUri,
          client_id: clientId
        })
      });
      const tokens = await resp.json();
      await chrome.storage.local.set(tokens);
      // Extract email from ID token
      if (tokens.id_token) {
        const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
        await chrome.storage.local.set({ user_email: payload.email });
      }
    }
  );
}
