import React, { useState } from 'react';
import { MarketplaceGrid } from '@/components/MarketplaceGrid';
import { DeliveryTracker } from '@/components/DeliveryTracker';

export const CustomerDashboard: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const deliveryFee = 50;

  const products = [
    { id: 'p1', name: 'Fresh Bangus (Milkfish)', price: 180, vendorName: 'Quinta Wet Market', category: 'Wet Market', image: 'https://images.unsplash.com/photo-1569674770128-6e872123d562?w=300', distanceKm: 1.5 },
    { id: 'p2', name: 'Amoxicillin 500mg', price: 12, vendorName: 'Mercury Express Pharmacy', category: 'Pharmacy', image: 'https://images.unsplash.com/photo-1587498792178-f9229301c551?w=300', distanceKm: 0.5 },
    { id: 'p3', name: 'Pork Liempo 1kg', price: 340, vendorName: 'Quinta Wet Market', category: 'Fresh Meat', image: 'https://images.unsplash.com/photo-1558941393-4b5221e81f96?w=300', distanceKm: 1.5 },
    { id: 'p4', name: 'Kitchen Storage Set', price: 499, vendorName: 'Metro Department Store', category: 'Department Stores', image: 'https://images.unsplash.com/photo-1550745166-96c7237e7d3a?w=300', distanceKm: 3.0 },
    { id: 'p5', name: 'Cordless Drill 12V', price: 1890, vendorName: 'BuildRight Hardware', category: 'Hardware', image: 'https://images.unsplash.com/photo-1581579168431-76d690009d49?w=300', distanceKm: 5.0 },
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

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={styles.logoImg} />
          <div>
            <h1 style={styles.title}>instaCart.PH</h1>
            <p style={styles.subtitle}>Fresh groceries delivered to your door</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.cartBadge}>
            <span>🛒</span>
            <span style={styles.cartCount}>{cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0)}</span>
          </div>
          <button style={styles.profileBtn}>
            <span style={styles.profileIcon}>👤</span>
          </button>
        </div>
      </div>

      {/* Marketing Campaigns Banner */}
      <div style={styles.campaignBanner}>
        <div style={styles.campaignContent}>
          <div style={styles.campaignIcon}>🎉</div>
          <div style={styles.campaignText}>
            <div style={styles.campaignTitle}>Grand Opening Sale!</div>
            <div style={styles.campaignDesc}>20% OFF on all wet market items this weekend!</div>
          </div>
          <button style={styles.campaignBtn}>Shop Now</button>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <input type="text" placeholder="Search products, vendors..." style={styles.searchInput} />
      </div>

      <div style={styles.categorySection}>
        <h2 style={styles.sectionTitle}>🏪 Shop by Category</h2>
        <div style={styles.categoryGrid}>
          {['All Markets', 'Wet Market', 'Pharmacy', 'Department Stores', 'Hardware', 'Restaurants'].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={styles.categoryBtn}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.productsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📦 Products</h2>
          <span style={styles.productCount}>{products.length} products found</span>
        </div>
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <div style={styles.productImageWrapper}>
                <img src={product.image} alt={product.name} style={styles.productImage} />
                <div style={styles.productCategoryBadge}>{product.category}</div>
              </div>
              <div style={styles.productInfo}>
                <div style={styles.productHeader}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productVendor}>{product.vendorName}</div>
                </div>
                <div style={styles.productPriceContainer}>
                  <span style={styles.productPrice}>₱{product.price.toFixed(2)}</span>
                </div>
                <div style={styles.productDistance}>
                  📍 {product.distanceKm} km
                </div>
                <button style={styles.addToCartBtn} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
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
                    <button style={styles.qtyBtn} disabled={item.quantity === 1} onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))}>−</button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button>
                  </div>
                  <button style={styles.removeBtn} onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))}>Remove</button>
                </div>
                <div style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div style={styles.cartFooter}>
            <div style={styles.totalsRow}>
              <span>Subtotal:</span><span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRow}>
              <span>Delivery Fee:</span><span>₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRowTotal}>
              <span>Grand Total:</span><span>₱{subtotal.toFixed(2)}</span>
            </div>
            <button style={styles.checkoutBtn} onClick={() => setShowCheckout(true)} disabled={cartItems.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: '24px',
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoImg: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#64748b',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  cartBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: '#f8fafc',
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid #e2e8f0',
  },
  cartCount: {
    fontWeight: 700,
    color: '#0f766e',
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
    cursor: 'pointer',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  productCount: {
    fontSize: 14,
    color: '#64748b',
  },
  categoryGrid: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
  },
  categoryBtn: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  productCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  productImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: '#f8fafc',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    borderRadius: 4,
  },
  productInfo: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  productVendor: {
    fontSize: 12,
    color: '#64748b',
  },
  productPriceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e',
  },
  productDistance: {
    fontSize: 11,
    color: '#0f766e',
    fontWeight: 600,
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
    cursor: 'pointer',
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
    zIndex: 100,
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottom: '1px solid #e2e8f0',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  clearCartBtn: {
    fontSize: 13,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  cartItemsList: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
  },
  cartItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: 14,
  },
  itemVendor: {
    fontSize: 12,
    color: '#64748b',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: 600,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    fontSize: 12,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f766e',
  },
  cartFooter: {
    padding: 20,
    borderTop: '1px solid #e2e8f0',
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 14,
    color: '#475569',
  },
  totalsRowTotal: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f766e',
    borderTop: '2px solid #e2e8f0',
    paddingTop: 12,
    marginTop: 8,
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
  },
};

