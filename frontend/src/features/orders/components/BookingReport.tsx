import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const BookingReport: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2c3e50', margin: 0 }}>Booking Report</h1>
        <p style={{ color: '#6b7c72' }}>Order #{orderId} - Transaction Summary</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c3e50', margin: 0 }}>Order #{orderId}</h2>
            <div style={{ fontSize: '13px', color: '#6b7c72' }}>Status: <span style={{ color: '#27ae60', fontWeight: 700 }}>✅ Completed</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#6b7c72' }}>Order Date:</div>
            <div style={{ fontWeight: 700, color: '#2c3e50' }}>{new Date().toLocaleString('en-PH')}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#6b7c72', textTransform: 'uppercase', marginBottom: '12px' }}>Customer</h3>
            <div style={{ fontSize: '15px', color: '#2c3e50' }}>Maria Santos</div>
            <div style={{ fontSize: '14px', color: '#6b7c72' }}>123 Main St, Makati City</div>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#6b7c72', textTransform: 'uppercase', marginBottom: '12px' }}>Vendor</h3>
            <div style={{ fontSize: '15px', color: '#2c3e50' }}>Quinta Wet Market</div>
            <div style={{ fontSize: '14px', color: '#6b7c72' }}>PayPal Payment</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#6b7c72', textTransform: 'uppercase', marginBottom: '12px' }}>Items Ordered</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#2c3e50' }}>Fresh Bangus (Milkfish)</div>
              <div style={{ fontSize: '13px', color: '#6b7c72' }}>Qty: 2</div>
            </div>
            <div style={{ fontWeight: 700, color: '#2ecc71' }}>₱360.00</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#2c3e50' }}>Pork Liempo 1kg</div>
              <div style={{ fontSize: '13px', color: '#6b7c72' }}>Qty: 1</div>
            </div>
            <div style={{ fontWeight: 700, color: '#2ecc71' }}>₱340.00</div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#2ecc71', borderTop: '2px solid #e2e8f0', paddingTop: '12px' }}>
            <span>Grand Total</span>
            <span>₱764.00</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate(`/delivery/${orderId}`)} style={{ flex: 1, background: '#3498db', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Track Delivery</button>
        <button onClick={() => navigate('/customer')} style={{ flex: 1, background: 'transparent', border: '1px solid #d1d5db', color: '#6b7c72', padding: '12px 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Back to Dashboard</button>
      </div>
    </div>
  );
};