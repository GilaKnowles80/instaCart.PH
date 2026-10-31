import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../features/auth/auth.context';

export type LoginRole = 'customer' | 'vendor' | 'retailer' | 'wholesaler' | 'delivery_driver' | 'admin';

interface LoginFormProps {
  role: LoginRole;
  onSuccess?: (user: { id: string; email: string; role: string }) => void;
}

const ROLE_LABELS: Record<LoginRole, string> = {
  customer: 'Customer',
  vendor: 'Vendor / Seller',
  retailer: 'Retailer Store',
  wholesaler: 'Wholesaler Store',
  delivery_driver: 'Delivery Driver',
  admin: 'Admin / Platform',
};

const ROLE_DESCRIPTIONS: Record<LoginRole, string> = {
  customer: 'Shop from wet markets, supermarkets, pharmacies, and more.',
  vendor: 'Sell your products on instaCart.PH marketplace.',
  retailer: 'Manage your retail store inventory and orders.',
  wholesaler: 'Supply products in bulk amd manage wholesale inventories and orders.',
  delivery_driver: 'Deliver orders and earn per kilometer based.',
  admin: 'Manage vendors, customers, and platform operations.',
};

const ROLE_ICONS: Record<LoginRole, string> = {
  customer: '🛒',
  vendor: '🏪',
  retailer: '🏬',
  wholesaler: ' bx-box',
  delivery_driver: '🏍️',
  admin: '🛡️',
};

export const LoginForm: React.FC<LoginFormProps> = ({ role, onSuccess }) => {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      const user = { id: email, email, role };
      onSuccess?.(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (typeof window === 'undefined' || !(window as any).google) {
        setError('Google Sign-In is not available. Please use email login instead.');
        setLoading(false);
        return;
      }
      const credential = await new Promise<string>((resolve, reject) => {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google Sign-In prompt was not shown.'));
            return;
          }
          (window as any).google.accounts.id.getCredential((response: any) => {
            if (response?.credential) {
              resolve(response.credential);
            } else {
              reject(new Error('No Google credential received.'));
            }
          });
        });
      });
      await googleLogin(credential as string, role);
      const user = { id: credential, email: '', role };
      onSuccess?.(user);
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>{ROLE_ICONS[role]}</span>
          <div>
            <h1 style={styles.title}>{ROLE_LABELS[role]} Login</h1>
            <p style={styles.subtitle}>{ROLE_DESCRIPTIONS[role]}</p>
          </div>
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Signing in...' : `Sign in as ${ROLE_LABELS[role]}`}
          </button>
        </form>

        <div style={styles.divider}>
          <span>Or</span>
        </div>

        <button
          type="button"
          style={styles.googleButton}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <button type="button" style={styles.registerButton} onClick={() => {}}>
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    background: '#f4f7f6',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#ffffff',
    borderRadius: 12,
    padding: 40,
    boxShadow: '0 24px 48px rgba(22, 131, 75, 0.12)',
    border: '1px solid #e2e8ea',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
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
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#20352a',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#6b7c72',
  },
  error: {
    marginBottom: 20,
    padding: 12,
    background: '#fdecea',
    border: '1px solid #f5c2c2',
    borderRadius: 6,
    color: '#b42318',
    fontSize: 13,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: '#34493c',
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 48,
    padding: '12px 14px',
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    background: '#fbfdfb',
    color: '#20352a',
    fontSize: 14,
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    padding: 14,
    border: 0,
    borderRadius: 6,
    background: '#16834b',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    opacity: 1,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '24px 0',
    color: '#9aab9f',
    fontSize: 12,
    fontWeight: 700,
  },
  registerButton: {
    width: '100%',
    padding: 12,
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    background: 'transparent',
    color: '#16834b',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  googleButton: {
    width: '100%',
    padding: 12,
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    background: '#ffffff',
    color: '#34493c',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
};

// Fix invalid CSS in divider margin
styles.divider.margin = '24px 0';