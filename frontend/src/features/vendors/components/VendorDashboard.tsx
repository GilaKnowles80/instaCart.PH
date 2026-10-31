import React, { useState } from 'react';

interface CustomerActivity {
  id: string;
  name: string;
  email: string;
  lastOrder: string;
  totalSpent: number;
  orderCount: number;
  status: 'active' | 'inactive';
}

const MOCK_CUSTOMERS: CustomerActivity[] = [
  { id: 'CUST-001', name: 'Gila Knowles', email: 'gila.knowles@example.com', lastOrder: '2026-10-26', totalSpent: 660.00, orderCount: 2, status: 'active' },
  { id: 'CUST-002', name: 'Maria Santos', email: 'maria.santos@example.com', lastOrder: '2026-10-24', totalSpent: 1240.50, orderCount: 5, status: 'active' },
  { id: 'CUST-003', name: 'John Reyes', email: 'john.reyes@example.com', lastOrder: '2026-10-20', totalSpent: 340.00, orderCount: 1, status: 'inactive' },
  { id: 'CUST-004', name: 'Ana Lim', email: 'ana.lim@example.com', lastOrder: '2026-10-28', totalSpent: 2180.00, orderCount: 8, status: 'active' },
  { id: 'CUST-005', name: 'Bob Tan', email: 'bob.tan@example.com', lastOrder: '2026-10-15', totalSpent: 180.00, orderCount: 1, status: 'inactive' },
];

export const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'orders'>('overview');
  const [search, setSearch] = useState('');

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = MOCK_CUSTOMERS.length;
  const activeCustomers = MOCK_CUSTOMERS.filter((c) => c.status === 'active').length;
  const totalRevenue = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.orderCount, 0);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.icon}>🏪</div>
          <div>
            <div style={styles.title}>Vendor Dashboard</div>
            <div style={styles.subtitle}>Monitor customer activity & order history</div>
          </div>
        </div>
        <div style={styles.actions}>
          <button type="button" style={styles.btnLogout}>Sign Out</button>
        </div>
      </div>
      <div style={styles.statRow}>
        <StatCard label="Total Customers" value={totalCustomers} color="#16834b" />
        <StatCard label="Active Customers" value={activeCustomers} color="#1469a8" />
        <StatCard label="Total Orders" value={totalOrders} color="#7a3e9d" />
        <StatCard label="Total Revenue" value={`₱${totalRevenue.toFixed(2)}`} color="#d96d0b" />
      </div>
      <div style={styles.tabs}>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
        <Tab active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} label="Customers" />
        <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Order History" />
      </div>
      {activeTab === 'overview' && <OverviewView customers={MOCK_CUSTOMERS.slice(0, 5)} />}
      {activeTab === 'customers' && <CustomersView customers={filtered} search={search} setSearch={setSearch} />}
      {activeTab === 'orders' && <OrdersView />}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={styles.statLabel}>{label}</div>
    <div style={styles.statValue}>{value}</div>
  </div>
);

const OverviewView: React.FC<{ customers: CustomerActivity[] }> = ({ customers }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Recent Customer Activity</h3>
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tr}>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Last Order</th>
            <th style={styles.th}>Orders</th>
            <th style={styles.th}>Spent</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={styles.tr}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.email}</td>
              <td style={styles.td}>{c.lastOrder}</td>
              <td style={styles.td}>{c.orderCount}</td>
              <td style={styles.td}>₱{c.totalSpent.toFixed(2)}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, background: c.status === 'active' ? '#2ecc71' : '#bdc3c7' }}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CustomersView: React.FC<{ customers: CustomerActivity[]; search: string; setSearch: (v: string) => void }> = ({
  customers,
  search,
  setSearch,
}) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Customer Directory</h3>
    <div style={styles.searchBar}>
      <input
        type="text"
        placeholder="Search customer by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />
    </div>
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tr}>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Last Order</th>
            <th style={styles.th}>Orders</th>
            <th style={styles.th}>Spent</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#95a5a6' }}>
                No customers found.
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.email}</td>
                <td style={styles.td}>{c.lastOrder}</td>
                <td style={styles.td}>{c.orderCount}</td>
                <td style={styles.td}>₱{c.totalSpent.toFixed(2)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: c.status === 'active' ? '#2ecc71' : '#bdc3c7' }}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const OrdersView: React.FC = () => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>All Customer Orders</h3>
    <div style={styles.empty}>
      <span style={{ fontSize: 32 }}>📦</span>
      <h4 style={styles.emptyTitle}>Order history tracking</h4>
      <p style={styles.emptySub}>
        View and monitor every customer order placed through your vendor space.
        Use the Customers tab to see detailed per-customer activity.
      </p>
    </div>
  </div>
);

const Tab: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({
  active,
  onClick,
  label,
}) => (
  <button onClick={onClick} style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}>
    {label}
  </button>
);

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
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e4e7eb',
    borderRadius: 8,
    padding: 16,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7a85',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 800,
    color: '#2c3e50',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    borderBottom: '1px solid #e4e7eb',
    paddingBottom: 12,
  },
  tab: {
    background: '#f1f2f6',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    color: '#6b7a85',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  tabActive: {
    background: '#16834b',
    color: '#fff',
  },
  section: {
    background: '#fff',
    border: '1px solid #e4e7eb',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: 16,
    color: '#2c3e50',
  },
  tableWrap: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: 6,
    border: '1px solid #e4e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tr: {
    borderBottom: '1px solid #f1f2f6',
  },
  th: {
    padding: 10,
    textAlign: 'left',
    fontSize: 11,
    color: '#6b7a85',
    textTransform: 'uppercase',
  },
  td: {
    padding: 10,
    fontSize: 13,
    color: '#2c3e50',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: 4,
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  searchBar: {
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    background: '#fbfdfb',
    fontSize: 13,
    color: '#20352a',
    boxSizing: 'border-box',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#6b7c72',
  },
  emptyTitle: {
    margin: '12px 0 6px 0',
    fontSize: 16,
    fontWeight: 700,
    color: '#20352a',
  },
  emptySub: {
    margin: 0,
    fontSize: 13,
  },
};
