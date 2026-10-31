import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';

export const PlatformDashboard: React.FC = () => {
  const { totalOrders, platformCommission, loading } = useAdminStats();
  return <section style={{ padding: 24, background: '#2c3e50', color: '#fff', borderRadius: 8 }}>
    <h1 style={{ marginTop: 0 }}>instaCart.PH master operations board</h1>
    {loading ? <p>Loading ledger metrics...</p> : <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <div><small>Total settled deliveries</small><strong style={{ display: 'block', fontSize: 24 }}>{totalOrders}</strong></div>
      <div><small>Platform escrow revenue</small><strong style={{ display: 'block', fontSize: 24 }}>PHP {platformCommission.toFixed(2)}</strong></div>
    </div>}
  </section>;
};
