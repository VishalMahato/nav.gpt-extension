// background.js
/// <reference types="chrome" />
import { generatePkcePair } from './utils/pkce'

chrome.runtime.onMessage.addListener((msg) => {
  if (msg === 'LOGIN') startOAuthFlow()
})

async function startOAuthFlow() {
  const clientId    = '16023198665-7m68ug4os70t0gba5i4cs7obkmrnm9qr.apps.googleusercontent.com'
  const redirectUri = 'http://localhost:8787/auth/callback'

  // 1) Make PKCE pair
  const { verifier, challenge } = await generatePkcePair()

  // 2) Pack verifier into `state`
  const state = encodeURIComponent(btoa(JSON.stringify({ verifier })))

  // 3) Build Google auth URL
  const params = new URLSearchParams({
    client_id:             clientId,
    response_type:         'code',
    redirect_uri:          redirectUri,
    scope:                 'openid email profile',
    code_challenge:        challenge,
    code_challenge_method: 'S256',
    prompt:                'select_account',
    state,
  })
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  // 4) Launch the OAuth popup
  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    redirectedTo => {
      if (chrome.runtime.lastError || !redirectedTo) {
        console.error('OAuth error', chrome.runtime.lastError)
        return
      }
      // You will see the full callback URL here, but we let the backend handle code+state.
      console.log('Redirected to:', redirectedTo)
      // Optionally fetch your backend here to get tokens:
      // fetch('http://localhost:8787/auth/callback?'+new URL(redirectedTo).search)
      //   .then(r=>r.json()).then(console.log)
    }
  )
}
