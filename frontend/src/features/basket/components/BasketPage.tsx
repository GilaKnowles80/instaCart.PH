import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BasketPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2c3e50', margin: 0 }}>Shopping Basket</h1>
        <p style={{ color: '#6b7c72' }}>Review your items before checkout.</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2c3e50', margin: 0 }}>Your Items</h3>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2ecc71' }}>0 Items</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#6b7c72' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2c3e50' }}>Your basket is empty</div>
            <div style={{ fontSize: '14px', color: '#6b7c72' }}>Add some products from our vendors to get started.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate('/vendors')} style={{ flex: 1, background: '#2ecc71', border: 'none', color: '#fff', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Browse Vendors</button>
        <button onClick={() => navigate('/')} style={{ flex: 1, background: 'transparent', border: '1px solid #d1d5db', color: '#6b7c72', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Continue Shopping</button>
      </div>
    </div>
  );
};