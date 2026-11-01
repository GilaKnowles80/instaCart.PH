import React, { useState } from 'react';
import { MarketplaceGrid } from '@/components/MarketplaceGrid';
import { DeliveryTracker } from '@/components/DeliveryTracker';

export const DriverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'deliveries', label: '🚚 My Deliveries' },
    { id: 'earnings', label: '💰 Earnings' },
    { id: 'marketplace', label: '🛒 Marketplace', icon: '🛒' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.logo}>🚚</div>
          <div>
            <h1 style={styles.title}>Driver Dashboard</h1>
            <p style={styles.subtitle}>Manage deliveries and earnings.</p>
          </div>
        </div>
        <div style={styles.welcome}>
          Welcome, <span style={styles.highlight}>Driver</span> 👋
        </div>
      </div>

      <div style={styles.grid}>
        {/* Stats */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>24</div>
            <div style={styles.statLabel}>Total Deliveries</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>₱7,500</div>
            <div style={styles.statLabel}>Total Earnings</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏰</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>3</div>
            <div style={styles.statLabel}>Pending Deliveries</div>
          </div>
        </div>

        {/* Marketplace */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🛒 Marketplace</h2>
            <button style={styles.viewAllBtn}>Browse Products</button>
          </div>
          <MarketplaceGrid userRole="delivery_driver" />
        </div>

        {/* My Deliveries */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🚚 My Deliveries</h2>
            <button style={styles.viewAllBtn}>View All Deliveries</button>
          </div>
          <div style={styles.deliveryList}>
            <div style={styles.deliveryCard}>
              <div style={styles.deliveryHeader}>
                <div style={styles.deliveryId}>Order #ORD-001</div>
                <div style={styles.deliveryStatus}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                  Out for Delivery
                </div>
              </div>
              <div style={styles.deliveryDetails}>
                <div style={styles.deliveryItem}>
                  <span style={styles.infoLabel}>Customer:</span>
                  <span style={styles.infoValue}>Juan Dela Cruz</span>
                </div>
                <div style={styles.deliveryItem}>
                  <span style={styles.infoLabel}>Vendor:</span>
                  <span style={styles.infoValue}>Quinta Wet Market</span>
                </div>
                <div style={styles.deliveryItem}>
                  <span style={styles.infoLabel}>Amount:</span>
                  <span style={styles.infoValue}>₱259.10</span>
                </div>
                <div style={styles.deliveryItem}>
                  <span style={styles.infoLabel}>Distance:</span>
                  <span style={styles.infoValue}>5.2 km</span>
                </div>
                <div style={styles.deliveryItem}>
                  <span style={styles.infoLabel}>Earnings:</span>
                  <span style={styles.infoValue}>₱150.00</span>
                </div>
              </div>
              <div style={styles.deliveryActions}>
                <button style={styles.btnStart}>Start Delivery</button>
                <button style={styles.btnComplete}>Complete</button>
              </div>
            </div>
          </div>
        </div>

        {/* GPS Tracker */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🗺️ Live GPS Tracker</h2>
          </div>
          <DeliveryTracker
            orderId="order_001"
            driverLocation={{ lat: 14.5995, lng: 120.9894 }}
            customerLocation={{ lat: 14.5980, lng: 120.9880 }}
            vendorLocation={{ lat: 14.6010, lng: 120.9900 }}
            status="out_for_delivery"
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: '24px',
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 32,
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#64748b',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 600,
    color: '#1e293b',
  },
  highlight: {
    color: '#0f766e',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
  },
  statIcon: {
    fontSize: 32,
    background: '#f0fdf4',
    borderRadius: 8,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f766e',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  marketplaceSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  viewAllBtn: {
    background: '#0f766e',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deliveryCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  deliveryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  deliveryStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 4,
    background: '#fef3c7',
    color: '#92400e',
  },
  deliveryDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
    marginBottom: 16,
  },
  deliveryItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
  },
  deliveryActions: {
    display: 'flex',
    gap: 12,
  },
  btnStart: {
    flex: 1,
    padding: '10px',
    background: '#0f766e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnComplete: {
    flex: 1,
    padding: '10px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    background: '#f8fafc',
    borderRadius: 8,
    color: '#64748b',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
};
