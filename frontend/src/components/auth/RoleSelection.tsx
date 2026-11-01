import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RoleOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'customer',
    label: 'Customer',
    icon: '🛒',
    color: '#2ecc71',
    description: 'Shop from wet markets, groceries, pharmacies, and more.',
  },
  {
    id: 'delivery_driver',
    label: 'Driver / Delivery',
    icon: '🚚',
    color: '#3498db',
    description: 'Deliver orders and earn per kilometer.',
  },
  {
    id: 'vendor',
    label: 'Vendor / Seller',
    icon: '🏪',
    color: '#3498db',
    description: 'Sell your products on instaCart.PH marketplace.',
  },
  {
    id: 'admin',
    label: 'Admin / Platform',
    icon: '🛡️',
    color: '#9b59b6',
    description: 'Manage vendors, customers, and platform operations.',
  },
];

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    navigate(`/auth?role=${role}&mode=login`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f6', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 800, background: '#ffffff', borderRadius: 20, padding: 48, boxShadow: '0 24px 48px rgba(22, 131, 75, 0.12)', border: '1px solid #e2e8ea' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={{ width: '60px', height: 'auto' }} />
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#2ecc71', letterSpacing: '-0.5px' }}>instaCart.PH</span>
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#2c3e50', margin: '0 0 8px 0', textAlign: 'center' }}>Welcome to instaCart.PH</h1>
        <p style={{ fontSize: '16px', color: '#6b7c72', textAlign: 'center', margin: '0 0 40px 0' }}>Choose your account type to Sign In or Register.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleSelect(role.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '28px 16px',
                border: '2px solid #dfe7e2',
                borderRadius: 16,
                background: '#fbfdfb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: 700,
                color: '#34493c',
              }}
            >
              <div style={{ fontSize: '44px', background: '#e9f5ec', width: '72px', height: '72px', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{role.icon}</div>
              <div style={{ fontWeight: 800, color: role.color }}>{role.label}</div>
              <div style={{ fontSize: '12px', color: '#6b7c72', textAlign: 'center', lineHeight: '1.4' }}>{role.description}</div>
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #eef2f0', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7c72' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth?mode=login')}
              style={{ background: 'none', border: 0, color: '#2ecc71', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Sign in directly
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};