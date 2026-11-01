import React, { useState, useEffect } from 'react';
import { MarketplaceGrid } from '@/components/MarketplaceGrid';
import { DeliveryTracker } from '@/components/DeliveryTracker';

export const CustomerDashboard: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'shop' | 'checkout' | 'confirmation' | 'tracking' | 'complete'>('shop');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const products = [
    {
      id: 'p1',
      name: 'Fresh Bangus (Milkfish)',
      price: 180,
      vendorName: 'Quinta Wet Market',
      category: 'Wet Market',
      image: 'https://images.unsplash.com/photo-1569674770128-6e872123d562?w=300',
      distanceKm: 1.5,
      categoryType: 'wet_market'
    },
    {
      id: 'p2',
      name: 'Amoxicillin 500mg',
      price: 12,
      vendorName: 'Mercury Express Pharmacy',
      category: 'Pharmacy',
      image: 'https://images.unsplash.com/photo-1587498792178-f9229301c551?w=300',
      distanceKm: 0.5,
      categoryType: 'pharmacy'
    },
    {
      id: 'p3',
      name: 'Pork Liempo 1kg',
      price: 340,
      vendorName: 'Quinta Wet Market',
      category: 'Fresh Meat',
      image: 'https://images.unsplash.com/photo-1558941393-4b5221e81f96?w=300',
      distanceKm: 1.5,
      categoryType: 'wet_market'
    },
    {
      id: 'p4',
      name: 'Kitchen Storage Set',
      price: 499,
      vendorName: 'Metro Department Store',
      category: 'Department Stores',
      image: 'https://images.unsplash.com/photo-1550745166-96c7237e7d3a?w=300',
      distanceKm: 3.0,
      categoryType: 'department_store'
    },
    {
      id: 'p5',
      name: 'Cordless Drill 12V',
      price: 1890,
      vendorName: 'BuildRight Hardware',
      category: 'Hardware',
      image: 'https://images.unsplash.com/photo-1581579168431-76d690009d49?w=300',
      distanceKm: 5.0,
      categoryType: 'hardware'
    }
  ];

  const addToCart = (item: any) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const maxDistance = cartItems.reduce((max, item) => Math.max(max, item.distanceKm || 0), 0);
  const deliveryFee = maxDistance <= 1 ? 50 : 50 + Math.ceil(maxDistance - 1) * 20;
  const serviceCharge = Math.round((subtotal * 0.02) * 100) / 100;
  const grandTotal = subtotal + deliveryFee + serviceCharge;

  // Auto-calculate delivery fee based on category
  const calculateDeliveryFee = (amount: number, categoryType?: string) => {
    if (categoryType === 'wet_market') return 50; // Wet market has its own delivery
    if (categoryType === 'pharmacy') return 30;
    if (categoryType === 'department_store') return 40;
    if (categoryType === 'hardware') return 60;
    return 50;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('checkout');
  };

  const handlePaymentComplete = (transactionId: string) => {
    setCheckoutStep('confirmation');
    setSelectedOrder({
      transactionId,
      customerName: 'Juan Dela Cruz',
      items: [...cartItems],
      subtotal,
      deliveryFee,
      serviceCharge,
      grandTotal,
      status: 'processing',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '2026-10-31 14:00:00'
    });
    setCartItems([]);
    localStorage.removeItem('instaCart_basket');
  };

  const handleDeliveryComplete = () => {
    setCheckoutStep('complete');
  };

  if (checkoutStep === 'shop') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>instaCart.PH</h1>
              <p style={styles.subtitle}>Fresh groceries, market goods, and essentials delivered to your door.</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.cartBadge}>
              <span style={styles.cartIcon}>🛒</span>
              <span style={styles.cartCount}>{cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}</span>
            </div>
            <button style={styles.profileBtn}>
              <span style={styles.profileIcon}>👤</span>
            </button>
          </div>
        </div>

        <div style={styles.marketplaceSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📦 Marketplace Products</h2>
            <span style={styles.productCount}>{products.length} products available</span>
          </div>
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImageWrapper}>
                  <img src={product.image} alt={product.name} style={styles.productImage} />
                  <div style={styles.productCategoryBadge}>{product.category}</div>
                </div>
                <div style={styles.productInfo}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productVendor}>{product.vendorName}</div>
                </div>
                <div style={styles.productPrice}>
                  ₱{product.price.toFixed(2)}
                </div>
                <button
                  style={styles.addToCartBtn}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div style={styles.cartSidebar}>
          <div style={styles.cartHeader}>
            <h2 style={styles.cartTitle}>🛒 Your Basket</h2>
            <button style={styles.clearCartBtn} onClick={() => setCartItems([])}>Clear All</button>
          </div>
          <div style={styles.cartItemsList}>
            {cartItems.map((item) => (
              <div key={item.id} style={styles.cartItemRow}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemVendor}>{item.vendorName}</div>
                </div>
                <div style={styles.itemControls}>
                  <div style={styles.qtyControls}>
                    <button
                      style={styles.qtyBtn}
                      disabled={item.quantity === 1}
                      onClick={() =>
                        setCartItems(prev =>
                          prev.map(i =>
                            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                          )
                        )
                      }>
                      −
                    </button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        setCartItems(prev =>
                          prev.map(i =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                          )
                        )
                      }>
                      +
                    </button>
                  </div>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
                <div style={styles.itemPrice}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div style={styles.cartFooter}>
            <div style={styles.totalsRow}>
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRow}>
              <span>Delivery Fee:</span>
              <span>₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRow}>
              <span>Service Charge (2%):</span>
              <span>₱{serviceCharge.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRowTotal}>
              <span>Grand Total:</span>
              <span>₱{grandTotal.toFixed(2)}</span>
            </div>
            <button
              style={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
  }

  return null;
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
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
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  cartBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: '#f8fafc',
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid #e2e8f0'
  },
  cartCount: {
    fontWeight: 700,
    color: '#0f766e'
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  profileIcon: {
    fontSize: 20
  },
  marketplaceSection: {
    marginBottom: 24
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  productCount: {
    fontSize: 14,
    color: '#64748b'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20
  },
  productCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  productImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: '#f8fafc',
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productCategoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '4px 8px',
    background: '#0f766e',
    color: 'white',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 4
  },
  productInfo: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  productName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  productVendor: {
    fontSize: 12,
    color: '#64748b'
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e'
  },
  addToCartBtn: {
    width: '100%',
    padding: '10px',
    background: '#0f766e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  cartSidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 400,
    height: '100vh',
    background: '#fff',
    borderLeft: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottom: '1px solid #e2e8f0'
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  clearCartBtn: {
    fontSize: 13,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  cartItemsList: {
    flex: 1,
    overflowY: 'auto',
    padding: 16
  },
  cartItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemName: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: 14
  },
  itemVendor: {
    fontSize: 12,
    color: '#64748b'
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  qtyBtn: {
    width: 24,
    height: 24,
    border: '1px solid #d1d5db',
    borderRadius: 4,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: 600,
    minWidth: 20,
    textAlign: 'center'
  },
  removeBtn: {
    fontSize: 12,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f766e'
  },
  cartFooter: {
    padding: 20,
    borderTop: '1px solid #e2e8f0'
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 14,
    color: '#475569'
  },
  totalsRowTotal: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e',
    borderTop: '2px solid #e2e8f0',
    paddingTop: 12,
    marginTop: 8
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
    cursor: 'pointer',
    marginTop: 16
  }
};
