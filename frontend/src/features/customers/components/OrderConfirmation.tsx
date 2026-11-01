import React, { useState } from 'react';
import { DeliveryTracker } from '@/components/DeliveryTracker';

interface OrderConfirmationProps {
  order: any;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  const [trackingStatus, setTrackingStatus] = useState('preparing');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={styles.logoImg} />
          <div>
            <h1 style={styles.title}>Order Confirmation</h1>
            <p style={styles.subtitle}>Your order has been placed successfully!</p>
          </div>
        </div>
        <a href="/" style={styles.backBtn}>
          ← Back to Marketplace
        </a>
      </div>

      <div style={styles.grid}>
        <div style={styles.orderCard}>
          <h2 style={styles.sectionTitle}>📋 Order Details</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Transaction ID:</span>
              <span style={styles.infoValue}>{order.transactionId}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Customer:</span>
              <span style={styles.infoValue}>{order.customerName}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Delivery Address:</span>
              <span style={styles.infoValue}>{order.deliveryAddress}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Store:</span>
              <span style={styles.infoValue}>{order.vendorName || 'instaCart.PH Vendor'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Payment Method:</span>
              <span style={styles.infoValue}>{order.paymentMethod}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Estimated Delivery:</span>
              <span style={styles.infoValue}>{order.estimatedDelivery}</span>
            </div>
          </div>
          <div style={styles.itemsList}>
            <h3 style={styles.itemsTitle}>Items Ordered:</h3>
            {order.items.map((item: any) => (
              <div key={item.id} style={styles.itemRow}>
                <div style={styles.itemImage}>
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} style={styles.itemImageImg} />
                </div>
                <div style={styles.itemDetails}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemVendor}>{item.vendorName}</div>
                  <div style={styles.itemQty}>Qty: {item.quantity}</div>
                </div>
                <div style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span>Grand Total:</span>
            <span>₱{order.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div style={styles.deliverySection}>
          <h2 style={styles.sectionTitle}>🚚 Delivery Tracking</h2>
          <DeliveryTracker
            orderId={order.transactionId}
            driverLocation={{ lat: 14.5995, lng: 120.9894 }}
            customerLocation={{ lat: 14.5980, lng: 120.9880 }}
            vendorLocation={{ lat: 14.6010, lng: 120.9900 }}
            status={trackingStatus}
          />
          <div style={styles.deliveryStatusContainer}>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Order Confirmed:</span>
              <span style={styles.statusValue}>✅ ${order.createdAt}</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Preparing:</span>
              <span style={styles.statusValue}>⏳ In Progress</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Out for Delivery:</span>
              <span style={styles.statusValue}>⏳ On the Way</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Delivered:</span>
              <span style={styles.statusValue}>⏳ Pending</span>
            </div>
          </div>
          <button style={styles.markReceivedBtn} onClick={() => setTrackingStatus('delivered')}>
            ✅ Mark as Received
          </button>
        </div>
      </div>

      <div style={styles.successMessage}>
        <div style={styles.successIcon}>✅</div>
        <h3 style={styles.successTitle}>Order Placed Successfully!</h3>
        <p style={styles.successMessageText}>Your order is being prepared by the vendor. Track delivery status below.</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: '24px',
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  logoImg: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  backBtn: {
    color: '#0f766e',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24
  },
  orderCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 16
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 16,
    marginBottom: 20
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b'
  },
  itemsList: {
    marginTop: 16
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 12
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    background: '#f1f5f9',
    overflow: 'hidden'
  },
  itemImageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 2
  },
  itemVendor: {
    fontSize: 12,
    color: '#94a3b8'
  },
  itemQty: {
    fontSize: 12,
    color: '#64748b'
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f766e'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTop: '2px solid #e2e8f0'
  },
  deliverySection: {
    marginTop: 24
  },
  deliverySectionContainer: {
    marginTop: 16
  },
  deliveryStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 16
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: 14,
    color: '#334155'
  },
  statusLabel: {
    fontWeight: 600
  },
  statusValue: {
    fontWeight: 700,
    color: '#0f766e'
  },
  markReceivedBtn: {
    marginTop: 20,
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer'
  },
  successMessage: {
    marginTop: 24,
    padding: 20,
    background: '#f0fdf4',
    borderRadius: 8,
    border: '1px solid #bbf7d0',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#166534',
    marginBottom: 8
  },
  successMessageText: {
    fontSize: 14,
    color: '#374151'
  }
};
