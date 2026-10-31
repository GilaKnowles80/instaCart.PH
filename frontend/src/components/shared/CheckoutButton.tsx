import React, { useState } from 'react';
import { checkoutApi, ICartItem } from '../../services/checkoutApi';
import { QrPayment } from './QrPayment';

interface CheckoutButtonProps {
  cartItems: ICartItem[];
  userId: string;
  onSuccess: (txnId: string, paymentMethod: string) => void;
}

type PaymentMethod = 'gcash' | 'maya' | 'paypal' | 'cash' | 'qr';

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ cartItems, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');

  const PAYMENT_OPTIONS: { id: PaymentMethod; name: string; color: string }[] = [
    { id: 'paypal', name: 'PayPal', color: '#0070ba' },
    { id: 'gcash', name: 'GCash (QR)', color: '#0052cc' },
    { id: 'maya', name: 'Maya', color: '#16834b' },
    { id: 'qr', name: 'QR Code', color: '#16834b' },
    { id: 'cash', name: 'Cash on Delivery', color: '#6b7c72' },
  ];

  const handleCheckoutProcess = async () => {
    if (cartItems.length === 0) {
      alert('Your shopping basket is completely empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await checkoutApi.submitOrder(cartItems, userId, paymentMethod);
      if (response.success) {
        onSuccess(response.transactionId, paymentMethod);
      }
    } catch (err: any) {
      alert('Checkout failed safely: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ).toFixed(2);

  return (
    <>
      <div style={styles.paymentSelector}>
        <div style={styles.paymentLabel}>Payment Method</div>
        <div style={styles.paymentRow}>
          {PAYMENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPaymentMethod(option.id)}
              style={{
                ...styles.paymentChip,
                ...(paymentMethod === option.id
                  ? { ...styles.paymentChipActive, borderColor: option.color }
                  : {}),
              }}
            >
              <div style={styles.chipDot} />
              <div style={styles.chipLabel}>{option.name}</div>
            </button>
          ))}
        </div>
      </div>

      {(paymentMethod === 'qr' || paymentMethod === 'gcash') && <QrPayment total={Number(total)} />}

      <button
        onClick={handleCheckoutProcess}
        disabled={loading || cartItems.length === 0}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#bdc3c7' : 'var(--brand-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Verifying Secure Order Window...' : 'Proceed to Checkout (₱' + total + ')'}
      </button>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  paymentSelector: {
    marginBottom: 14,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    marginBottom: 8,
  },
  paymentRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  paymentChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    border: '1px solid #dfe7e2',
    borderRadius: 6,
    background: '#fff',
    color: '#333',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  paymentChipActive: {
    background: '#e6f6ed',
    borderColor: '#16834b',
    color: '#16834b',
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#16834b',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: 600,
  },
};