import React, { useState, useCallback } from 'react';
import { useBasket } from '@/features/basket/context/BasketContext';
import { useAuth } from '@/features/auth/auth.context';
import { checkoutApi } from '@/services/checkoutApi';

interface CheckoutProps {
  onPaymentComplete?: (order: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onPaymentComplete }) => {
  const { cart, getCartTotal, clearCart } = useBasket();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'gcash' | 'maya' | 'cash' | 'qr'>('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const serviceCharge = Math.round((subtotal * 0.02) * 100) / 100;
  const grandTotal = subtotal + deliveryFee + serviceCharge;

  const handleCheckout = useCallback(async () => {
    if (!user) {
      setError('Please log in to complete checkout.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await checkoutApi.submitOrder(
        cart,
        user.id,
        user.firstName + ' ' + user.lastName,
        '123 Main St, Metro Manila',
        14.5995,
        120.9842,
        deliveryFee,
        5,
        10,
        paymentMethod
      );

      setLoading(false);

      if (!result.success) {
        setError(result.errors?.join(', ') || 'Checkout failed.');
        return;
      }

      if (onPaymentComplete) {
        onPaymentComplete({
          orderId: result.orderId,
          order: result.order,
          vendorSummaries: result.vendorSummaries,
          escrowSplits: result.escrowSplits,
          items: cart,
          subtotal,
          deliveryFee,
          serviceCharge,
          grandTotal,
          paymentMethod,
        });
      }

      clearCart();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Checkout failed.');
    }
  }, [cart, user, paymentMethod, subtotal, deliveryFee, serviceCharge, grandTotal, onPaymentComplete, clearCart]);

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h3 style={styles.errorTitle}>⚠️ Checkout Error</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={() => setError(null)} style={styles.retryBtn}>Try Again</button>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={styles.logoImg} />
          <div>
            <h1 style={styles.title}>Checkout</h1>
            <p style={styles.subtitle}>Review your order and complete payment.</p>
          </div>
        </div>
        <a href="/" style={styles.backBtn}>
          ← Back to Marketplace
        </a>
      </div>

      <div style={styles.grid}>
        <div style={styles.orderSummaryCard}>
          <h2 style={styles.sectionTitle}>🛒 Order Summary</h2>
          <ul style={styles.cartItems}>
            {cart.map((item) => (
              <li key={item.id} style={styles.cartItem}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemVendor}>🏪 {item.vendorName}</div>
                </div>
                <div style={styles.itemDetails}>
                  <span style={styles.itemQuantity}>Qty: {item.quantity}</span>
                  <span style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div style={styles.orderSummaryDetails}>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery Fee:</span>
              <span>₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Service Charge (2%):</span>
              <span>₱{serviceCharge.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRowTotal}>
              <span>Grand Total:</span>
              <span>₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <h2 style={styles.sectionTitle}>💳 Payment Method</h2>
          <div style={styles.paymentOptions}>
            <label style={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
              <div style={styles.paymentOptionContent}>
                <div style={styles.paymentOptionIcon}>💳</div>
                <div>
                  <div style={styles.paymentOptionTitle}>PayPal</div>
                  <div style={styles.paymentOptionDesc}>Secure online payment</div>
                </div>
              </div>
            </label>
            <label style={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="gcash" checked={paymentMethod === 'gcash'} onChange={() => setPaymentMethod('gcash')} />
              <div style={styles.paymentOptionContent}>
                <div style={styles.paymentOptionIcon}>📱</div>
                <div>
                  <div style={styles.paymentOptionTitle}>GCash</div>
                  <div style={styles.paymentOptionDesc}>Scan QR to pay</div>
                </div>
              </div>
            </label>
            <label style={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="maya" checked={paymentMethod === 'maya'} onChange={() => setPaymentMethod('maya')} />
              <div style={styles.paymentOptionContent}>
                <div style={styles.paymentOptionIcon}>📱</div>
                <div>
                  <div style={styles.paymentOptionTitle}>Maya</div>
                  <div style={styles.paymentOptionDesc}>Quick mobile payment</div>
                </div>
              </div>
            </label>
            <label style={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
              <div style={styles.paymentOptionContent}>
                <div style={styles.paymentOptionIcon}>💵</div>
                <div>
                  <div style={styles.paymentOptionTitle}>Cash on Delivery</div>
                  <div style={styles.paymentOptionDesc}>Pay when you receive</div>
                </div>
              </div>
            </label>
          </div>

          {paymentMethod === 'qr' || paymentMethod === 'gcash' && (
            <div style={styles.qrSection}>
              <div style={styles.qrCard}>
                <div style={styles.qrHeader}>
                  <div style={styles.qrIcon}>📱</div>
                  <div>
                    <div style={styles.qrTitle}>Scan to Pay</div>
                    <div style={styles.qrSubtitle}>Open GCash or banking app</div>
                  </div>
                </div>
                <div style={styles.qrImageWrapper}>
                  <img src="/assets/payments/qr-code.svg" alt="QR Code" style={styles.qrImage} />
                </div>
                <div style={styles.qrAmount}>₱{grandTotal.toFixed(2)}</div>
                <div style={styles.qrInstructions}>Scan this QR code with your GCash or banking app to pay ₱{grandTotal.toFixed(2)}.</div>
              </div>
            </div>
          )}

          <button style={styles.checkoutBtn} onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing Payment...' : `Pay ₱${grandTotal.toFixed(2)} Now`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1000,
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
    gridTemplateColumns: '1fr 350px',
    gap: 24
  },
  checkoutSuccess: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    textAlign: 'center',
    background: '#f0fdf4',
    borderRadius: 12,
    border: '1px solid #bbf7d0'
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#166534',
    marginBottom: 8
  },
  successMessage: {
    fontSize: 16,
    color: '#166534',
    marginBottom: 24
  },
  orderSummary: {
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: 14,
    color: '#475569'
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e',
    borderTop: '2px solid #e2e8f0',
    marginTop: 12
  },
  paymentCard: {
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#fff'
  },
  paymentOptionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%'
  },
  paymentOptionIcon: {
    fontSize: 24
  },
  paymentOptionTitle: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: 15
  },
  paymentOptionDesc: {
    fontSize: 12,
    color: '#64748b'
  },
  qrSection: {
    marginTop: 20
  },
  qrCard: {
    background: '#f8fafc',
    border: '1px dashed #cbd5d1',
    borderRadius: 8,
    padding: 24,
    textAlign: 'center'
  },
  qrHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  qrIcon: {
    fontSize: 32
  },
  qrTitle: {
    fontWeight: 700,
    color: '#1e293b',
    fontSize: 16
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#64748b'
  },
  qrImageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0'
  },
  qrImage: {
    width: 200,
    height: 200
  },
  qrAmount: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f766e',
    marginBottom: 8
  },
  qrInstructions: {
    fontSize: 13,
    color: '#64748b'
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    background: '#0f766e',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer'
  }
};
