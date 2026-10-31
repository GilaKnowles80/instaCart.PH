import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../features/auth/auth.context';

export type RegisterRole = 'customer' | 'vendor' | 'retailer' | 'wholesaler' | 'delivery_driver' | 'admin';

interface RegisterFormProps {
  role: RegisterRole;
  onSuccess?: (user: { id: string; email: string; role: string }) => void;
}

const ROLE_LABELS: Record<RegisterRole, string> = {
  customer: 'Customer',
  vendor: 'Vendor / Seller',
  retailer: 'Retailer Store',
  wholesaler: 'Wholesaler',
  delivery_driver: 'Delivery Driver',
  admin: 'Admin / Platform',
};

const ROLE_ICONS: Record<RegisterRole, string> = {
  customer: '🛒',
  vendor: '🏪',
  retailer: '🏬',
  wholesaler: 'bx-box',
  delivery_driver: '🏍️',
  admin: '🛡️',
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ role, onSuccess }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setaddress] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await register({ email, password, role, firstName, lastName, phone, address, state, country, zipCode });
      const user = { id: email, email, role };
      onSuccess?.(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button
            type="button"
            onClick={() => {}}
            style={styles.backButton}
          >
            ← Back
          </button>
          <span style={styles.icon}>{ROLE_ICONS[role]}</span>
          <div>
            <h1 style={styles.title}>{ROLE_LABELS[role]} Registration</h1>
            <p style={styles.subtitle}>Create your instaCart.PH account</p>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.input}
                placeholder="Juan"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
                placeholder="Dela Cruz"
              />
            </div>
          </div>

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
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              placeholder="09123456789"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              required
              autoComplete="address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              style={styles.input}
              placeholder="#1234 Lincoln Street, Barrymore Avenue,"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              required
              autoComplete="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={styles.input}
              placeholder="Washington State"
            />
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>country</label>
            <input
              type="text"
              required
              autoComplete="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={styles.input}
              placeholder="United States of America"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>zipCode</label>
            <input
              type="numbers"
              required
              autoComplete="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              style={styles.input}
              placeholder="87511"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          {role === 'delivery_driver' && (
            <div style={styles.infoBox}>
              <strong>🏍️ Delivery Driver Info:</strong><br />
              You will earn delivery fees per kilometer based on your vehicle type.<br />
              Add your bank/e-wallet payout details in your driver dashboard after approval.
            </div>
          )}

          {role === 'vendor' && (
            <div style={styles.infoBox}>
              <strong>🏪 Vendor Info:</strong><br />
              A 2% platform service charge applies to each total sale.<br />
              Complete your store enrollment in the vendor dashboard after approval.
            </div>
          )}

          {role === 'retailer' && (
            <div style={styles.infoBox}>
              <strong>🏬 Retailer Info:</strong><br />
              Your store payouts go to your PayPal account.<br />
              A 2% platform service charge applies to each total sale.
            </div>
          )}

          {role === 'wholesaler' && (
            <div style={styles.infoBox}>
              <strong>bx bx-box Wholesaler Info:</strong><br />
              Your store payouts go to your PayPal account.<br />
              A 2% platform service charge applies to each total sale.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Creating account...' : `Create ${ROLE_LABELS[role]} Account`}
          </button>
        </form>

        <div style={styles.divider}>
          <span>Already have an account?</span>
        </div>

        <button type="button" style={styles.loginButton} onClick={() => {}}>
          Sign in
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
    minHeight: '70vh',
    background: '#f4f7f6',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: 480,
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
  title: {
    margin: 0,
    fontSize: 22,
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
  infoBox: {
    marginTop: 12,
    padding: 14,
    background: '#f2faf5',
    border: '1px solid #bfe5cc',
    borderRadius: 6,
    fontSize: 12,
    color: '#24613d',
    lineHeight: 1.5,
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
  loginButton: {
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
};