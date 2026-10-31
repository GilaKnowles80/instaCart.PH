import React from 'react';
import { CustomerProfileCard } from './CustomerProfileCard';
import { OrderHistoryList } from './OrderHistoryList';

export const CustomerDashboard: React.FC = () => {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.icon}>🛒</div>
          <div>
            <div style={styles.title}>Customer Dashboard</div>
            <div style={styles.subtitle}>Your orders, profile & activity</div>
          </div>
        </div>
        <div style={styles.actions}>
          <button type="button" style={styles.btnLogout}>Sign Out</button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.profileCol}>
          <CustomerProfileCard />
        </div>
        <div style={styles.ordersCol}>
          <OrderHistoryList />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'sans-serif',
    background: '#f4f7f6',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: '#20352a',
  },
  subtitle: {
    margin: '2px 0 0',
    fontSize: 12,
    color: '#6b7c72',
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  btnLogout: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  profileCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  ordersCol: {
    display: 'flex',
    flexDirection: 'column',
  },
};
