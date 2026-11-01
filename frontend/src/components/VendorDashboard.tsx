import React, { useState } from 'react';
import { MarketplaceGrid } from '@/components/MarketplaceGrid';

export const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Manage Products' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'earnings', label: '💰 Earnings' },
    { id: 'withdrawals', label: '💸 Withdrawals' },
    { id: 'marketplace', label: '🛒 Marketplace', icon: '🛒' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.logo}>🏪</div>
          <div>
            <h1 style={styles.title}>Vendor Dashboard</h1>
            <p style={styles.subtitle}>Manage your store, products, and orders.</p>
          </div>
        </div>
        <div style={styles.welcome}>
          Welcome, <span style={styles.highlight}>Vendor</span> 👋
        </div>
      </div>

      <div style={styles.grid}>
        {/* Stats */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>12</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>₱15,000</div>
            <div style={styles.statLabel}>Total Earnings</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>5</div>
            <div style={styles.statLabel}>Pending Orders</div>
          </div>
        </div>

        {/* Marketplace Tab */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🛒 Marketplace</h2>
            <button style={styles.viewAllBtn}>Browse All Products</button>
          </div>
          <MarketplaceGrid userRole="vendor" />
        </div>

        {/* My Products */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📦 My Products</h2>
            <button style={styles.addProductBtn}>+ Add Product</button>
          </div>
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p>No products yet. Add your first product to start selling.</p>
          </div>
        </div>

        {/* My Orders */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📦 My Orders</h2>
            <button style={styles.viewAllBtn}>View All Orders</button>
          </div>
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p>No orders yet.</p>
          </div>
        </div>

        {/* Earnings */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>💰 My Earnings</h2>
          </div>
          <div style={styles.earningsCard}>
            <div style={styles.earningsItem}>
              <div style={styles.earningsLabel}>Total Earnings</div>
              <div style={styles.earningsValue}>₱15,000</div>
            </div>
            <div style={styles.earningsItem}>
              <div style={styles.earningsLabel}>Pending Payout</div>
              <div style={styles.earningsValue}>₱5,000</div>
            </div>
            <div style={styles.earningsItem}>
              <div style={styles.earningsLabel}>Completed Payouts</div>
              <div style={styles.earningsValue}>₱10,000</div>
            </div>
          </div>
        </div>

        {/* Withdrawals */}
        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>💸 Withdrawals</h2>
          </div>
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>💸</span>
            <p>No withdrawal requests yet.</p>
          </div>
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
  addProductBtn: {
    background: '#0ea5e9',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
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
  earningsCard: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  earningsItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    minWidth: 150,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e',
  },
};
