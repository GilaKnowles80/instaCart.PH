import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export type AuthRole = 'customer' | 'vendor' | 'admin';

const ROLE_CONFIG: Record<AuthRole, { label: string; icon: string; color: string }> = {
  customer: { label: 'Customer', icon: '🛒', color: '#16834b' },
  vendor: { label: 'Vendor / Seller', icon: '🏪', color: '#1469a8' },
  admin: { label: 'Admin / Platform', icon: '🛡️', color: '#7a3e9d' },
};

interface AuthPageProps {
  onAuthenticated: (user: { id: string; email: string; role: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<AuthRole>('customer');
  const [view, setView] = useState<'role-picker' | 'form'>('role-picker');

  const handleRoleSelect = (r: AuthRole) => {
    setRole(r);
    setView('form');
  };

  const handleBack = () => {
    setView('role-picker');
  };

  const handleAuthSuccess = (user: { id: string; email: string; role: string }) => {
    onAuthenticated(user);
  };

  if (view === 'role-picker') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>instaCart.PH</div>
            <h1 style={styles.title}>Welcome to instaCart.PH</h1>
            <p style={styles.subtitle}>
              Choose your account type to Sign In or Register.
            </p>
          </div>

          <div style={styles.roleGrid}>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
              const r = key as AuthRole;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  style={{
                    ...styles.roleCard,
                    borderColor: cfg.color,
                    background: '#ffffff',
                  }}
                >
                  <div style={styles.roleIcon}>{cfg.icon}</div>
                  <div style={styles.roleLabel}>{cfg.label}</div>
                </button>
              );
            })}
          </div>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <button type="button" style={styles.link} onClick={() => setMode('login')}>
                Sign in directly
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const cfg = ROLE_CONFIG[role];
  const isLogin = mode === 'login';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button
            type="button"
            onClick={handleBack}
            style={styles.backButton}
          >
            ← Back
          </button>
          <div style={styles.icon}>{cfg.icon}</div>
          <div>
            <h1 style={styles.title}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p style={styles.subtitle}>{cfg.label} • instaCart.PH</p>
          </div>
        </div>

        {isLogin ? (
          <LoginForm role={role} onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm role={role} onSuccess={handleAuthSuccess} />
        )}

        <div style={styles.toggle}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" style={styles.link} onClick={() => setMode('register')}>
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" style={styles.link} onClick={() => setMode('login')}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f4f7f6',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: '#ffffff',
    borderRadius: 16,
    padding: 40,
    boxShadow: '0 24px 48px rgba(22, 131, 75, 0.12)',
    border: '1px solid #e2e8ea',
  },
  header: {
    marginBottom: 32,
  },
  logo: {
    display: 'inline-block',
    fontSize: 20,
    fontWeight: 800,
    color: '#16834b',
    marginBottom: 12,
    letterSpacing: '-0.5px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: 26,
    fontWeight: 800,
    color: '#20352a',
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#6b7c72',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '20px 12px',
    border: '2px solid #dfe7e2',
    borderRadius: 12,
    background: '#fbfdfb',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
    color: '#34493c',
    transition: 'all 0.2s',
  },
  roleIcon: {
    fontSize: 30,
  },
  roleLabel: {
    textAlign: 'center',
  },
  footer: {
    borderTop: '1px solid #eef2f0',
    paddingTop: 16,
    marginTop: 20,
  },
  footerText: {
    margin: 0,
    fontSize: 13,
    color: '#6b7c72',
    textAlign: 'center',
  },
  link: {
    background: 'none',
    border: 0,
    color: '#16834b',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    fontSize: 'inherit',
  },
  backButton: {
    background: 'transparent',
    border: 0,
    color: '#16834b',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 4,
    marginRight: 8,
  },
  icon: {
    fontSize: 36,
    width: 56,
    height: 56,
    borderRadius: 14,
    background: '#e9f5ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#16834b',
  },
  toggle: {
    marginTop: 16,
    textAlign: 'center',
  },
};
