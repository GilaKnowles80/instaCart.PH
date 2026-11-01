import React, { useState } from 'react';

export const AdminMonitoringDashboard: React.FC<{ token?: string }> = ({ token = "" }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'compliance' | 'complaints' | 'notifications'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

  const loadData = async (endpoint: string, setter: (data: any) => void) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
      const data = await res.json();
      setter(data.users || data.records || data.complaints || data.notifications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      // Set empty arrays as fallback so page doesn't show blank
      setter([]);
    }
  };

  const refresh = () => {
    setLoading(true);
    loadData('/auth/users', setUsers);
    loadData('/auth/compliance-records', setComplianceRecords);
    loadData('/auth/complaints', setComplaints);
    loadData('/auth/admin-notifications', setNotifications).finally(() => setLoading(false));
  };

  React.useEffect(() => { refresh(); }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛡️ instaCart.PH Admin Monitoring</h1>
        <button onClick={refresh} style={styles.refreshBtn}>↻ Refresh</button>
      </div>
      {error && <div style={styles.error}>⚠️ {error}</div>}
      <div style={styles.tabs}>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="👥 Users" />
        <Tab active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} label="📋 Compliance" />
        <Tab active={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')} label="🚨 Complaints" />
        <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} label="📢 Notifications" />
      </div>
      {loading && <div style={styles.loading}>Loading...</div>}
      {!loading && activeTab === 'users' && <UsersTable users={users} />}
      {!loading && activeTab === 'compliance' && <ComplianceTable records={complianceRecords} token={token} />}
      {!loading && activeTab === 'complaints' && <ComplaintsTable complaints={complaints} />}
      {!loading && activeTab === 'notifications' && <NotificationsList notifications={notifications} token={token} />}
    </div>
  );
};

const Tab: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} style={active ? styles.tabActive : styles.tab}>{label}</button>
);

const UsersTable: React.FC<{ users: any[] }> = ({ users }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Registered Users</h3>
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead><tr style={styles.tr}>
          <th style={styles.th}>ID</th><th style={styles.th}>Name</th><th style={styles.th}>Email</th>
          <th style={styles.th}>Role</th><th style={styles.th}>Phone</th><th style={styles.th}>Status</th>
        </tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={styles.tr}>
              <td style={styles.td}>{u.id}</td><td style={styles.td}>{u.fullName || 'N/A'}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: roleColor(u.role) }}>{u.role}</span></td>
              <td style={styles.td}>{u.phone || '-'}</td>
              <td style={styles.td}><span style={{ color: '#2ecc71', fontWeight: 600 }}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const roleColor = (role: string) => {
  const c: Record<string, string> = { admin: '#16834b', customer: '#3498db', vendor: '#2ecc71', retailer: '#9b59b6', wholesaler: '#f1c40f', delivery_driver: '#e67e22', developer: '#8e44ad', builder: '#16a085', homeowner: '#2980b9', buyer: '#c0392b', rem_sales_agent: '#d35400', real_estate_agent: '#7f8c8d' };
  return c[role] || '#95a5a6';
};

const ComplianceTable: React.FC<{ records: any[]; token: string }> = ({ records, token }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  const approve = (id: string) => {
    if (!window.confirm('Approve compliance?')) return;
    fetch(`${API_BASE}/auth/compliance-records/${id}/approve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    }).then(() => { alert('Approved.'); window.location.reload(); });
  };
  const reject = (id: string) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    fetch(`${API_BASE}/auth/compliance-records/${id}/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    }).then(() => { alert('Rejected.'); window.location.reload(); });
  };
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Compliance Records</h3>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.tr}>
            <th style={styles.th}>User ID</th><th style={styles.th}>Role</th><th style={styles.th}>Email</th>
            <th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{r.userId}</td><td style={styles.td}>{r.userRole}</td>
                <td style={styles.td}>{r.email}</td>
                <td style={styles.td}><span style={{ color: statusColor(r.status), fontWeight: 600 }}>{r.status}</span></td>
                <td style={styles.td}>
                  {r.status === 'pending' ? (
                    <div style={styles.btnGroup}>
                      <button onClick={() => approve(r.id)} style={styles.btnApprove}>✅ Approve</button>
                      <button onClick={() => reject(r.id)} style={styles.btnReject}>❌ Reject</button>
                    </div>
                  ) : <span style={{ fontSize: 11, color: '#6b7a85' }}>{r.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const statusColor = (s: string) => ({ pending: '#f1c40f', approved: '#2ecc71', rejected: '#e74c3c', open: '#f1c40f', reviewing: '#3498db', resolved: '#2ecc71' }[s] || '#95a5a6');

const ComplaintsTable: React.FC<{ complaints: any[] }> = ({ complaints }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Complaints & Reports</h3>
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead><tr style={styles.tr}>
          <th style={styles.th}>Type</th><th style={styles.th}>Reported By</th><th style={styles.th}>Email</th>
          <th style={styles.th}>Subject</th><th style={styles.th}>Status</th>
        </tr></thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} style={styles.tr}>
              <td style={styles.td}><span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: complaintColor(c.type) }}>{c.type}</span></td>
              <td style={styles.td}>{c.reportedBy}</td><td style={styles.td}>{c.reportedByEmail}</td>
              <td style={styles.td}>{c.subject}</td>
              <td style={styles.td}><span style={{ color: statusColor(c.status), fontWeight: 600 }}>{c.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NotificationsList: React.FC<{ notifications: any[]; token: string }> = ({ notifications, token }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  return (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Admin Notifications</h3>
    <div style={styles.notifList}>
      {notifications.map((n) => (
        <div key={n.id} style={styles.notifItem}>
          <div>
            <div style={{ fontWeight: 700, color: '#2c3e50' }}>{n.subject}</div>
            <div style={{ fontSize: 13, color: '#6b7a85' }}>{n.message}</div>
            <div style={{ fontSize: 11, color: '#95a5a6', marginTop: 4 }}>{n.type} • {n.read ? 'Read' : 'Unread'}</div>
          </div>
          {!n.read && (
            <button onClick={() => {
              fetch(`${API_BASE}/auth/admin-notifications/${n.id}/read`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              }).then(() => window.location.reload());
            }} style={styles.btnRead}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

const complaintColor = (t: string) => ({ disclaimer: '#f1c40f', complaint: '#e67e22', hacker: '#e74c3c', phishing: '#c0392b', abuse: '#8e44ad' }[t] || '#95a5a6');

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 24, maxWidth: 1400, margin: '0 auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { margin: 0, color: '#16834b', fontSize: 24 },
  refreshBtn: { background: '#16834b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' },
  error: { background: '#fdf2f2', border: '1px solid #e74c3c', color: '#c0392b', padding: 12, borderRadius: 6, marginBottom: 16 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #e4e7eb', paddingBottom: 12 },
  tab: { background: '#f1f2f6', border: 'none', padding: '10px 20px', borderRadius: 6, color: '#6b7a85', cursor: 'pointer' },
  tabActive: { background: '#16834b', color: '#fff' },
  loading: { color: '#6b7a85', margin: '20px 0' },
  section: { marginBottom: 32 },
  sectionTitle: { margin: '0 0 12px 0', color: '#2c3e50', fontSize: 18 },
  tableWrap: { overflowX: 'auto', background: '#fff', borderRadius: 8, border: '1px solid #e4e7eb' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tr: { borderBottom: '1px solid #f1f2f6' },
  th: { padding: 12, textAlign: 'left', fontSize: 12, color: '#6b7a85', textTransform: 'uppercase' },
  td: { padding: 12, fontSize: 13, color: '#2c3e50' },
  badge: { padding: '2px 8px', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' },
  btnGroup: { display: 'flex', gap: 6 },
  btnApprove: { background: '#2ecc71', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
  btnReject: { background: '#e74c3c', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
  notifList: { display: 'flex', flexDirection: 'column', gap: 12 },
  notifItem: { background: '#fff', border: '1px solid #e4e7eb', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  btnRead: { background: '#3498db', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
};