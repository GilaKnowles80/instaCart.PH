import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ThankYouPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f6', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 600, background: '#ffffff', borderRadius: 20, padding: 48, boxShadow: '0 24px 48px rgba(22, 131, 75, 0.12)', border: '1px solid #e2e8ea', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#2c3e50', margin: '0 0 12px 0' }}>Thank You for Ordering!</h1>
        <p style={{ fontSize: '16px', color: '#6b7c72', margin: '0 0 24px 0' }}>Your order #{orderId} has been placed successfully.</p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
            <span>Order ID:</span>
            <span style={{ fontWeight: 700, color: '#2c3e50' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151' }}>
            <span>Status:</span>
            <span style={{ color: '#27ae60', fontWeight: 700 }}>Processing</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151', marginTop: '8px' }}>
            <span>Expected Delivery:</span>
            <span style={{ fontWeight: 700, color: '#2c3e50' }}>Today by 8:00 PM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px', color: '#166534' }}>
            <span>🔔</span>
            <span>You'll receive a notification when your delivery is on the way.</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button onClick={() => navigate(`/booking-report/${orderId}`)} style={{ flex: 1, background: '#2ecc71', border: 'none', color: '#fff', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>View Booking Report</button>
          <button onClick={() => navigate('/')} style={{ flex: 1, background: 'transparent', border: '1px solid #d1d5db', color: '#6b7c72', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Shop Again</button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eef2f0', margin: '24px 0' }} />

        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', margin: '0 0 12px 0' }}>Terms & Conditions</h3>
          <div style={{ fontSize: '13px', color: '#6b7c72', lineHeight: '1.6', marginBottom: '16px' }}>
            By using instaCart.PH, you agree to our Terms and Conditions. All transactions are processed through secure payment gateways. Delivery times are based on vendor availability. Prices may vary by vendor and location.
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', margin: '0 0 12px 0' }}>Rules & Regulations</h3>
          <div style={{ fontSize: '13px', color: '#6b7c72', lineHeight: '1.6', marginBottom: '16px' }}>
            • Orders are final once payment is confirmed.<br />
            • Delivery is available within Metro Manila and nearby areas.<br />
            • Returns and refunds are subject to vendor approval.<br />
            • Platform service fee of 2% applies to all transactions.
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', margin: '0 0 12px 0' }}>Disclaimer</h3>
          <div style={{ fontSize: '13px', color: '#6b7c72', lineHeight: '1.6', marginBottom: '16px' }}>
            instaCart.PH is a marketplace platform connecting customers with local vendors. We are not responsible for product quality, delivery delays, or vendor disputes. All disputes should be resolved directly with the vendor or through our customer support.
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', margin: '0 0 12px 0' }}>Customer Support</h3>
          <div style={{ fontSize: '13px', color: '#6b7c72', lineHeight: '1.6' }}>
            Email: support@instaCart.PH<br />
            Phone: (02) 8-123-4567<br />
            Hours: 7AM - 10PM Daily
          </div>
        </div>

        <div style={{ marginTop: '32px', borderTop: '1px solid #eef2f0', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#2ecc71', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>← Back to Home</button>
          <button onClick={() => navigate('/choose-role')} style={{ background: 'transparent', border: 'none', color: '#6b7c72', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Change Role</button>
        </div>
      </div>
    </div>
  );
};