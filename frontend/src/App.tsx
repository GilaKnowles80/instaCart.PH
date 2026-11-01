import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { AuthPage } from '@/components/auth/AuthPage';
import { VendorCampaigns } from '@/features/vendors/components/VendorCampaigns';
import { DeliveryTracker } from '@/components/DeliveryTracker';
import { BookingReport } from '@/features/orders/components/BookingReport';
import { ThankYouPage } from '@/features/orders/components/ThankYouPage';
import { BasketPage } from '@/features/basket/components/BasketPage';
import { SearchPage } from '@/features/search/components/SearchPage';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/features/auth/auth.context';

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout showBack={false} backTo="/">{children}</Layout>
);

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route 1: Landing Page - Next goes to Role Selection */}
        <Route
          path="/"
          element={
            <Layout showBack={false} showNext nextTo="/choose-role" nextLabel="Choose Role →">
              <LandingPage />
            </Layout>
          }
        />

        {/* Route 2: Role Selection - Next goes to Auth */}
        <Route
          path="/choose-role"
          element={
            <Layout showBack backTo="/" showNext nextTo="/auth?mode=login" nextLabel="Sign In →">
              <RoleSelection />
            </Layout>
          }
        />

        {/* Route 3: Auth (Sign In / Register) - Next goes to Vendors */}
        <Route
          path="/auth"
          element={
            <AuthProvider>
              <Layout showBack backTo="/choose-role" showNext nextTo="/vendors" nextLabel="Browse Vendors →">
                <AuthPage onAuthenticated={() => {}} />
              </Layout>
            </AuthProvider>
          }
        />

        {/* Route 4: Vendor Campaigns / Marketplace - Next goes to Customer Dashboard */}
        <Route
          path="/vendors"
          element={
            <Layout showBack backTo="/choose-role" showNext nextTo="/customer" nextLabel="Customer Dashboard →">
              <VendorCampaigns />
            </Layout>
          }
        />
        <Route
          path="/vendors/category/:category"
          element={
            <Layout showBack backTo="/vendors" showNext nextTo="/customer" nextLabel="Customer Dashboard →">
              <VendorCampaigns />
            </Layout>
          }
        />

        {/* Route 5: Delivery Tracker - Next goes to Booking Report */}
        <Route
          path="/delivery/:orderId"
          element={
            <Layout showBack backTo="/customer">
              <DeliveryTracker />
            </Layout>
          }
        />

        {/* Route 6: Booking Report - Next goes to Thank You */}
        <Route
          path="/booking-report/:orderId"
          element={
            <Layout showBack backTo="/customer">
              <BookingReport />
            </Layout>
          }
        />

        {/* Route 7: Thank You - Next goes back to Landing Page (unending cycle) */}
        <Route
          path="/thank-you/:orderId"
          element={
            <Layout showBack backTo="/" showNext nextTo="/" nextLabel="Start New Order →">
              <ThankYouPage />
            </Layout>
          }
        />
        
        {/* Basket */}
        <Route path="/basket" element={<Layout showBack backTo="/"><BasketPage /></Layout>} />
        
        {/* Search */}
        <Route path="/search" element={<Layout showBack backTo="/"><SearchPage /></Layout>} />
        
        {/* Customer Dashboard */}
        <Route path="/customer" element={<AuthenticatedLayout><CustomerDashboard /></AuthenticatedLayout>} />
        
        {/* Vendor Dashboard */}
        <Route path="/vendor" element={<AuthenticatedLayout><VendorDashboard /></AuthenticatedLayout>} />
        
        {/* Driver Dashboard */}
        <Route path="/driver" element={<AuthenticatedLayout><DriverDashboard /></AuthenticatedLayout>} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AuthenticatedLayout><AdminMonitoringDashboard /></AuthenticatedLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
