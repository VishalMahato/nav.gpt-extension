export function base64UrlEncode(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  
  export async function generatePkcePair(): Promise<{
    verifier: string;
    challenge: string;
  }> {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const verifier = Array.from(randomBytes, (b) =>
      b.toString(16).padStart(2, '0')
    ).join('');
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(verifier)
    );
    const challenge = base64UrlEncode(digest);
    return { verifier, challenge };
  }
  