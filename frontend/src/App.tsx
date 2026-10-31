import React, { useState, useCallback } from 'react';
import { useAuth, type IUser } from './features/auth/auth.context';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { MarketplaceCategory } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { BasketProvider } from './features/basket/context/BasketContext';
import { MarketplaceGrid } from './features/feed/components/MarketplaceGrid';
import { BasketDrawer } from './features/basket/components/BasketDrawer';
import { EnrollmentForm } from './features/vendors/components/EnrollmentForm';
import { PlatformDashboard } from './features/admin/components/PlatformDashboard';
import { AdminMonitoringDashboard } from './features/admin/components/AdminMonitoringDashboard';
import { CustomerDashboard } from './features/customers/components/CustomerDashboard';
import { VendorDashboard } from './features/vendors/components/VendorDashboard';

type AppTab = 'marketplace' | 'merchant_hub' | 'admin_dashboard' | 'customer_dashboard' | 'vendor_dashboard';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AppTab>('marketplace');
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>('All Markets');

  const handleLogout = useCallback(() => {
    logout();
    setActiveTab('marketplace');
  }, [logout]);

  // While auth state is still loading, show a neutral shell
  if (isLoading) {
    return (
      <div style={styles.loadingShell}>
        <div style={styles.spinner}>Loading session…</div>
      </div>
    );
  }

  // Not authenticated → show the unified auth entry page
  if (!isAuthenticated || !user) {
    return (
      <BasketProvider>
        <div style={styles.appShell}>
          <AuthPage onAuthenticated={handleAuthenticated} />
        </div>
      </BasketProvider>
    );
  }

  // Authenticated → render the role-based dashboard shell
  const role = user.role;
  const isAdmin = role === 'admin';
  const isVendor = role === 'vendor' || role === 'retailer' || role === 'wholesaler';
  const isCustomer = role === 'customer';

  return (
    <BasketProvider>
      <div style={styles.appShell}>
        <Header user={user} onLogout={handleLogout} />
        <Navigation
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isVendor={isVendor}
          isAdmin={isAdmin}
          isCustomer={isCustomer}
          activeTab={activeTab}
          setActiveTab={(tab: string) => setActiveTab(tab as AppTab)}
        />
        <main style={styles.main}>
          {isCustomer && activeTab === 'customer_dashboard' && <CustomerDashboard />}
          {isVendor && activeTab === 'vendor_dashboard' && <VendorDashboard />}
          {isAdmin && activeTab === 'admin_dashboard' && (
            <AdminMonitoringDashboard token={user.id} />
          )}
          {!isCustomer && !isVendor && !isAdmin && (
            <div style={styles.emptyRole}>
              <p>No dashboard available for your role.</p>
              <button type="button" onClick={handleLogout} style={styles.btnLogout}>
                Sign Out
              </button>
            </div>
          )}
          {/* Legacy marketplace tabs kept for backward compatibility when not on a role dashboard */}
          {!isCustomer && !isVendor && !isAdmin && activeTab === 'marketplace' && (
            <div style={styles.marketplaceLayout}>
              <MarketplaceGrid selectedCategory={activeCategory} />
              <div style={styles.stickyBasket}><BasketDrawer /></div>
            </div>
          )}
          {!isCustomer && !isVendor && !isAdmin && activeTab === 'merchant_hub' && <EnrollmentForm />}
          {!isCustomer && !isVendor && !isAdmin && activeTab === 'admin_dashboard' && <PlatformDashboard />}
        </main>
        <Footer />
      </div>
    </BasketProvider>
  );

  function handleAuthenticated(userData: { id: string; email: string; role: string }) {
    setActiveTab(
      userData.role === 'admin'
        ? 'admin_dashboard'
        : userData.role === 'vendor' || userData.role === 'retailer' || userData.role === 'wholesaler'
          ? 'vendor_dashboard'
          : 'customer_dashboard'
    );
  }
};

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#fcfcfc',
  },
  loadingShell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f4f7f6',
    fontFamily: 'sans-serif',
    color: '#6b7c72',
  },
  spinner: {
    fontSize: 16,
    fontWeight: 600,
  },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: 1400,
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '24px 4%',
  },
  marketplaceLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 350px',
    gap: 30,
    alignItems: 'start',
  },
  stickyBasket: { position: 'sticky', top: 20 },
  emptyRole: {
    padding: 40,
    textAlign: 'center',
    color: '#6b7c72',
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
    marginTop: 12,
  },
};

export default App;
