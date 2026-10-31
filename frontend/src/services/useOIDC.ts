import { useState, useCallback, useEffect } from 'react';
import {
  getAuthorizationUrl,
  extractCodeFromUrl,
  exchangeCodeForTokens,
  getUserInfo,
  logout,
  getDiscoveryDocument,
  getJwks,
  type OIDCClientConfig,
  type OIDCTokenResponse,
  type OIDCUserInfo,
} from './oidc-client';

export type { OIDCClientConfig, OIDCTokenResponse, OIDCUserInfo };

export interface UseOIDCReturn {
  /** Whether a login flow is in progress */
  isLoading: boolean;
  /** Any error from the OIDC flow */
  error: string | null;
  /** The authenticated user info (if logged in via OIDC) */
  user: OIDCUserInfo | null;
  /** The access token (if logged in via OIDC) */
  accessToken: string | null;
  /** Start the login flow — redirects user to instaCart.PH */
  login: (state?: string) => void;
  /** Complete the login flow using a code from the redirect URL */
  handleCallback: (redirectUrl: string) => Promise<void>;
  /** Log out and revoke all sessions (single sign-out) */
  signOut: () => Promise<void>;
  /** Fetch the OIDC discovery document */
  fetchDiscovery: () => Promise<Record<string, any> | null>;
  /** Fetch the JWKS (public keys) */
  fetchJwks: () => Promise<Record<string, any> | null>;
}

/**
 * React hook for integrating instaCart.PH OAuth 2.0 / OIDC SSO into any app.
 *
 * Example usage in your app:
 *
 *   const config: OIDCClientConfig = {
 *     issuer: 'https://api.instaCart.PH',
 *     clientId: 'my_external_app',
 *     clientSecret: 'my_secret',
 *     redirectUri: 'https://myapp.com/callback',
 *     scope: 'openid profile email phone roles',
 *   };
 *
 *   const { login, handleCallback, user, accessToken, signOut, isLoading, error } = useOIDC(config);
 *
 *   // On your login page:
 *   <button onClick={() => login()}>Login with instaCart.PH</button>
 *
 *   // On your /callback route:
 *   useEffect(() => {
 *     if (window.location.pathname === '/callback') {
 *       handleCallback(window.location.href);
 *     }
 *   }, []);
 */
export function useOIDC(config: OIDCClientConfig): UseOIDCReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<OIDCUserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load saved session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('instacart_oidc_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        setUser(session.user);
        setAccessToken(session.accessToken);
      } catch {
        localStorage.removeItem('instacart_oidc_session');
      }
    }
  }, []);

  const saveSession = useCallback((tokenResponse: OIDCTokenResponse, userInfo: OIDCUserInfo) => {
    setAccessToken(tokenResponse.access_token);
    setUser(userInfo);
    localStorage.setItem(
      'instacart_oidc_session',
      JSON.stringify({ accessToken: tokenResponse.access_token, user: userInfo })
    );
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('instacart_oidc_session');
  }, []);

  const login = useCallback(
    (state?: string) => {
      const url = getAuthorizationUrl(config, state);
      window.location.href = url;
    },
    [config]
  );

  const handleCallback = useCallback(
    async (redirectUrl: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const code = extractCodeFromUrl(redirectUrl);
        if (!code) {
          throw new Error('No authorization code found in redirect URL.');
        }

        const tokens = await exchangeCodeForTokens(config, code);
        const userInfo = await getUserInfo(config, tokens.access_token);

        saveSession(tokens, userInfo);
      } catch (err: any) {
        setError(err.message || 'OIDC login failed.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [config, saveSession]
  );

  const signOut = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);
      try {
        await logout(config, accessToken ?? undefined);
      } catch (err: any) {
        setError(err.message || 'Logout failed.');
      } finally {
        clearSession();
        setIsLoading(false);
      }
    },
    [config, accessToken, user?.sub, clearSession]
  );

  const fetchDiscovery = useCallback(async () => {
    try {
      return await getDiscoveryDocument(config.issuer);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch discovery document.');
      return null;
    }
  }, [config.issuer]);

  const fetchJwks = useCallback(async () => {
    try {
      return await getJwks(config.issuer);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch JWKS.');
      return null;
    }
  }, [config.issuer]);

  return {
    isLoading,
    error,
    user,
    accessToken,
    login,
    handleCallback,
    signOut,
    fetchDiscovery,
    fetchJwks,
  };
}
