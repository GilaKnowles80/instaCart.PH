import React, { useEffect } from 'react';
import { useOIDC, type OIDCClientConfig } from '../../services/useOIDC';

const EXAMPLE_CONFIG: OIDCClientConfig = {
  issuer: import.meta.env.VITE_OIDC_ISSUER || 'https://api.instaCart.PH',
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'my_external_app',
  clientSecret: import.meta.env.VITE_OIDC_CLIENT_SECRET || 'my_secret',
  redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI || 'https://myapp.com/callback',
  scope: 'openid profile email phone roles',
};

const styles: Record<string, React.CSSProperties> = {
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#6b7c72' },
  spinner: { fontSize: 48, marginBottom: 12 },
  error: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#fdecea', border: '1px solid #f5c2c2', color: '#b42318', padding: 24, borderRadius: 8 },
  btnRetry: { background: '#b42318', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', marginTop: 12 },
  card: { maxWidth: 560, margin: '40px auto', padding: 32, background: '#fff', border: '1px solid #e2e8ea', borderRadius: 12, boxShadow: '0 24px 48px rgba(22, 131, 75, 0.12)', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  icon: { fontSize: 32 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: '#20352a' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#6b7c72' },
  config: { marginBottom: 20, padding: 16, background: '#fbfdfb', border: '1px solid #eef2f0', borderRadius: 8 },
  h3: { margin: '0 0 10px 0', fontSize: 14, fontWeight: 700, color: '#34493c', textTransform: 'uppercase', letterSpacing: '0.05em' },
  list: { margin: 0, paddingLeft: 18, color: '#555', fontSize: 13 },
  btnLogin: { width: '100%', padding: '12px 24px', background: '#16834b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 },
  note: { margin: 0, fontSize: 12, color: '#6b7c72', textAlign: 'center' },
  userInfo: { marginBottom: 20, padding: 16, background: '#f7faf8', border: '1px solid #e2e8ea', borderRadius: 8 },
  tokenInfo: { marginBottom: 20, padding: 16, background: '#e9f5ec', border: '1px solid #bfe5cc', borderRadius: 8 },
  token: { margin: '6px 0 0', fontSize: 11, fontFamily: 'monospace', color: '#16834b', wordBreak: 'break-all' },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  btnSecondary: { flex: 1, minWidth: 140, padding: '10px 16px', background: '#fff', border: '1px solid #cbd8d0', borderRadius: 6, color: '#34493c', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnLogout: { flex: 1, minWidth: 140, padding: '10px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
};
export const OIDCExample: React.FC = () => {
  const {
    isLoading,
    error,
    user,
    accessToken,
    login,
    handleCallback,
    signOut,
    fetchDiscovery,
    fetchJwks,
  } = useOIDC(EXAMPLE_CONFIG);

  useEffect(() => {
    if (window.location.pathname === '/callback' || window.location.search.includes('code=')) {
      handleCallback(window.location.href);
    }
  }, [handleCallback]);

  if (isLoading && !user) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>🔄</div>
        <p>Logging in with instaCart.PH...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h3>OIDC Error</h3>
        <p>{error}</p>
        <button onClick={() => (window as any).location.reload()} style={styles.btnRetry}>
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔐</div>
          <div>
            <h1 style={styles.title}>External App</h1>
            <p style={styles.subtitle}>Login with instaCart.PH SSO</p>
          </div>
        </div>

        <div style={styles.config}>
          <h3 style={styles.h3}>SSO Configuration</h3>
          <ul style={styles.list}>
            <li><strong>Issuer:</strong> {EXAMPLE_CONFIG.issuer}</li>
            <li><strong>Client ID:</strong> {EXAMPLE_CONFIG.clientId}</li>
            <li><strong>Redirect URI:</strong> {EXAMPLE_CONFIG.redirectUri}</li>
            <li><strong>Scope:</strong> {EXAMPLE_CONFIG.scope}</li>
          </ul>
        </div>

        <button onClick={() => login()} style={styles.btnLogin}>
          Login with instaCart.PH
        </button>

        <p style={styles.note}>
          Clicking the button redirects you to instaCart.PH to authenticate.
          After login, you'll be redirected back here with your ID token.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>✅</div>
        <div>
          <h1 style={styles.title}>Signed in via instaCart.PH</h1>
          <p style={styles.subtitle}>Single Sign-On is active</p>
        </div>
      </div>

      <div style={styles.userInfo}>
        <h3 style={styles.h3}>Your Profile</h3>
        <ul style={styles.list}>
          <li><strong>Subject ID:</strong> {user.sub}</li>
          <li><strong>Name:</strong> {user.name}</li>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Role:</strong> {user.role}</li>
          <li><strong>Phone:</strong> {user.phone_number || 'Not provided'}</li>
          <li><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      <div style={styles.tokenInfo}>
        <h3 style={styles.h3}>Access Token</h3>
        <p style={styles.token}>{accessToken}</p>
      </div>

      <div style={styles.actions}>
        <button
          onClick={async () => {
            const discovery = await fetchDiscovery();
            alert('Discovery:\n' + JSON.stringify(discovery, null, 2));
          }}
          style={styles.btnSecondary}
        >
          Fetch Discovery Document
        </button>
        <button
          onClick={async () => {
            const jwks = await fetchJwks();
            alert('JWKS:\n' + JSON.stringify(jwks, null, 2));
          }}
          style={styles.btnSecondary}
        >
          Fetch JWKS (Public Keys)
        </button>
        <button onClick={signOut} style={styles.btnLogout}>
          Sign Out (All Apps)
        </button>
      </div>
    </div>
  );
};