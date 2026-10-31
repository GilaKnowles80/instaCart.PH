import React from 'react';

interface QrPaymentProps {
  total: number;
}

/**
 * Renders the InstaCart.PH QR payment option.
 *
 * Displays the static QR code ("InstaCart.PH Total Amount for Orders")
 * that the customer scans to pay the order total. The QR image is loaded
 * from /assets/qr-instacart-payment.png — save your QR code PNG there.
 */
export const QrPayment: React.FC<QrPaymentProps> = ({ total }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>📱</div>
        <div>
          <div style={styles.title}>Scan to Pay with QR</div>
          <div style={styles.subtitle}>InstaCart.PH Total Amount for Orders</div>
        </div>
      </div>

      <div style={styles.amount}>
        <span style={styles.amountLabel}>Total to pay:</span>
        <span style={styles.amountValue}>₱{total.toFixed(2)}</span>
      </div>

      <div style={styles.qrWrapper}>
        <img
          src="/assets/qr-instacart-payment.png"
          alt="InstaCart.PH QR payment"
          style={styles.qrImage}
        />
      </div>

      <div style={styles.instructions}>
        Open your GCash app → Scan QR → Pay ₱{total.toFixed(2)} →
        Keep the receipt for your order confirmation.
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px dashed #cbd5d0',
    borderRadius: 10,
    padding: 18,
    background: '#f7faf8',
    margin: '12px 0',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#16834b',
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7c72',
    margin: '2px 0 0',
  },
  amount: {
    margin: '10px 0 16px',
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #dfe7e2',
    borderRadius: 6,
    display: 'inline-block',
  },
  amountLabel: {
    fontSize: 12,
    color: '#6b7c72',
    marginRight: 8,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#16834b',
  },
  qrWrapper: {
    margin: '14px 0',
  },
  qrImage: {
    width: 220,
    height: 220,
    borderRadius: 6,
    border: '1px solid #dfe7e2',
    background: '#fff',
  },
  instructions: {
    fontSize: 11.5,
    color: '#555',
    lineHeight: 1.5,
    margin: 0,
  },
};

