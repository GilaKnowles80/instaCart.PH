import React from 'react';
import { ActiveDeliveryMap } from './ActiveDeliveryMap';
import { EarningsTracker } from './EarningsTracker';

export const DriverDashboard: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
        🚚 Driver Dashboard
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <ActiveDeliveryMap />
        <EarningsTracker />
      </div>
    </div>
  );
};