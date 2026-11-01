import React, { useState } from 'react';
import type { IUser } from '../../features/auth/auth.context';
import { useAuth } from '../../features/auth/auth.context';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  backTo?: string;
  showNext?: boolean;
  nextTo?: string;
  nextLabel?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, showBack = true, backTo = '/', showNext = false, nextTo = '/', nextLabel = 'Next →' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer': return '🛒';
      case 'vendor': return '🏪';
      case 'delivery_driver': return '🚚';
      case 'admin': return '🛡️';
      default: return '👤';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'delivery' = 'info') => {
    const notif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9fbfd' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4%', borderBottom: '1px solid #e2e8f0', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', onClick: () => navigate('/') }}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={{ width: '150px', maxWidth: '40vw', height: 'auto', display: 'block' }} />
        </div>
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '500px', margin: '0 20px', position: 'relative' }}>
          <input type="text" placeholder="Search products, vendors, pharmacies, groceries, restaurants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 16px', paddingRight: '40px', borderRadius: '24px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', background: '#f8fafc' }} />
          <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: '#2ecc71', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>🔍</button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <div style={{ fontSize: '13px', color: '#6b7c72', whiteSpace: 'nowrap' }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{getRoleIcon(user.role)}</span>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '26px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#e74c3c',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '40px',
                      right: 0,
                      width: '340px',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      padding: '16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#2c3e50' }}>Notifications</div>
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          style={{ background: 'transparent', border: 'none', color: '#2ecc71', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Mark all read
                        </button>
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#6b7c72' }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                          <div>No notifications yet</div>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              background: n.read ? '#fff' : '#f0fdf4',
                              borderRadius: '8px',
                              marginBottom: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2c3e50' }}>{n.title}</div>
                              <div style={{ fontSize: '11px', color: '#6b7c72' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7c72', marginTop: '4px', lineHeight: '1.4' }}>{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#e74c3c', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Sign Out</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={{ background: 'transparent', border: '1px solid #2ecc71', color: '#2ecc71', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Login</button>
              <button onClick={() => navigate('/auth?mode=register')} style={{ background: '#2ecc71', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
              <button onClick={() => navigate('/basket')} style={{ background: 'transparent', border: 'none', color: '#6b7c72', fontSize: '20px', cursor: 'pointer', position: 'relative' }}>🛒<span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#e74c3c', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span></button>
            </>
          )}
        </div>
      </header>
      {showBack && (
        <div style={{ padding: '12px 4%', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate(backTo)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2ecc71',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Back
            </button>
            {showNext && (
              <button
                onClick={() => navigate(nextTo)}
                style={{
                  background: '#2ecc71',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '6px',
                }}
              >
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      )}
      <main style={{ flex: 1, padding: '24px 4%' }}>{children}</main>
      <Footer />
    </div>
  );
};