/**
 * instaCart.PH OAuth 2.0 / OpenID Connect (OIDC) Client
 *
 * Enables external apps to use instaCart.PH as their Identity Provider (SSO).
 *
 * Flow:
 *   1. redirectToLogin() — sends user to instaCart.PH /oauth/authorize
 *   2. User authenticates on instaCart.PH
 *   3. instaCart.PH redirects back with ?code=<authorization_code>
 *   4. exchangeCodeForTokens() — POST /oauth/token to get ID token + access token
 *   5. getUserInfo() — GET /oauth/userinfo using the access token
 *   6. logout() — POST /oauth/logout for single sign-out across all apps
 */

export interface OIDCClientConfig {
  /** instaCart.PH backend URL (e.g., https://api.instaCart.PH) */
  issuer: string;
  /** Your app's client ID (registered in oauth_clients table) */
  clientId: string;
  /** Your app's client secret */
  clientSecret: string;
  /** Where instaCart.PH redirects back after login */
  redirectUri: string;
  /** Scopes to request */
  scope?: string;
  /** Optional nonce for ID token binding */
  nonce?: string;
}

export interface OIDCTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface OIDCUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  phone_number: string;
  role: string;
}

/**
 * Generates the authorization URL for the user to log in via instaCart.PH.
 * Call this from your app's "Login with instaCart.PH" button.
 */
export function getAuthorizationUrl(config: OIDCClientConfig, state?: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope || 'openid profile email phone roles',
    response_type: 'code',
    state: state || crypto.randomUUID(),
  });

  if (config.nonce) {
    params.set('nonce', config.nonce);
  }

  return `${config.issuer}/oauth/authorize?${params.toString()}`;
}

/**
 * Extracts the authorization code from the redirect URL after login.
 * Call this on your app's redirect callback page.
 */
export function extractCodeFromUrl(redirectUrl: string): string | null {
  try {
    const url = new URL(redirectUrl);
    return url.searchParams.get('code') || null;
  } catch {
    return null;
  }
}

/**
 * Exchanges the authorization code for ID token + access token.
 * Call this on your backend or frontend after receiving the code.
 */
export async function exchangeCodeForTokens(
  config: OIDCClientConfig,
  code: string
): Promise<OIDCTokenResponse> {
  const response = await fetch(`${config.issuer}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Token exchange failed.');
  }

  return response.json();
}

/**
 * Fetches user information from instaCart.PH using the access token.
 */
export async function getUserInfo(
  config: OIDCClientConfig,
  accessToken: string
): Promise<OIDCUserInfo> {
  const response = await fetch(`${config.issuer}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch user info.');
  }

  return response.json();
}

/**
 * Performs single sign-out: revokes the current session and all sessions
 * for the user across all connected apps.
 */
export async function logout(
  config: OIDCClientConfig,
  accessToken?: string,
  userId?: string | null
): Promise<void> {
  const body: Record<string, any> = {};
  if (userId) body.user_id = userId;

  await fetch(`${config.issuer}/oauth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  }).catch(() => {
    // Logout is best-effort; don't throw if the network fails
  });
}

/**
 * Fetches the OIDC discovery document from instaCart.PH.
 * Useful for dynamic client configuration.
 */
export async function getDiscoveryDocument(
  issuer: string
): Promise<Record<string, any>> {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!response.ok) {
    throw new Error('Failed to fetch OIDC discovery document.');
  }
  return response.json();
}

/**
 * Fetches the JWKS (public keys) from instaCart.PH.
 * Useful for verifying ID token signatures.
 */
export async function getJwks(issuer: string): Promise<Record<string, any>> {
  const response = await fetch(`${issuer}/.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch JWKS.');
  }
  return response.json();
}
