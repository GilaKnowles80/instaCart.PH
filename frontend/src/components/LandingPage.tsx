import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: 0,
    padding: 0
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b'
  },
  navSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14
  },
  searchBtn: {
    padding: '8px 16px',
    background: '#0f766e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  authBtn: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    background: '#fff'
  },
  authBtnPrimary: {
    padding: '8px 16px',
    background: '#0f766e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  basketBtn: {
    position: 'relative',
    padding: '8px 16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#1e293b'
  },
  basketCount: {
    position: 'absolute',
    top: -8,
    right: -8,
    background: '#0f766e',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    background: '#ffffff'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: '#ecfdf5',
    color: '#0f766e',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 16
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 1.1,
    marginBottom: 20
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600
  },
  heroButtons: {
    display: 'flex',
    gap: 12
  },
  heroBtnPrimary: {
    padding: '14px 32px',
    background: '#0f766e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer'
  },
  heroBtnSecondary: {
    padding: '14px 32px',
    background: '#fff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer'
  },
  roleSelectionSection: {
    padding: '40px 20px',
    background: '#f8fafc',
    textAlign: 'center'
  },
  roleSelectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 24
  },
  roleButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    maxWidth: 800,
    margin: '0 auto'
  },
  roleButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  roleButtonIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  roleButtonLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e293b'
  },
  campaignsSection: {
    padding: '40px 20px',
    background: '#f8fafc'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  campaignsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20
  },
  campaignCard: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  },
  campaignImageWrapper: {
    position: 'relative',
    height: 200,
    overflow: 'hidden'
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  campaignBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: '#0f766e',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600
  },
  campaignContent: {
    padding: 16
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  campaignDesc: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  productsSection: {
    padding: '40px 20px',
    background: '#ffffff'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20
  },
  productCard: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  productImageWrapper: {
    height: 200,
    overflow: 'hidden',
    background: '#f8fafc'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productCategoryBadge: {
    padding: '4px 8px',
    background: '#ecfdf5',
    color: '#0f766e',
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 4
  },
  productInfo: {
    padding: 12
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  productVendor: {
    fontSize: 12,
    color: '#64748b',
    margin: 0
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f766e',
    margin: '12px 0 0 0'
  },
  addToCartBtn: {
    padding: '8px 16px',
    background: '#0f766e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: 12
  },
  paymentPartnersSection: {
    padding: '40px 20px',
    background: '#f8fafc'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20
  },
  paymentCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  paymentIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  paymentDesc: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  testimonialsSection: {
    padding: '40px 20px',
    background: '#ffffff'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20
  },
  testimonialCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    border: '1px solid #e2e8f0'
  },
  testimonialHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    background: '#f1f5f9'
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    margin: 0
  },
  testimonialRating: {
    color: '#f59e0b',
    fontSize: 12,
    margin: 0
  },
  testimonialText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0
  },
  footer: {
    background: '#1e293b',
    color: '#fff',
    padding: '40px 20px',
    marginTop: 40
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 40,
    justifyContent: 'space-between',
    marginBottom: 32
  },
  footerSection: {
    flex: 1,
    minWidth: 200
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12
  },
  footerDesc: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: 0
  },
  footerLink: {
    fontSize: 14,
    color: '#cbd5e1',
    textDecoration: 'none',
    marginBottom: 8,
    display: 'block'
  },
  footerBottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
    borderTop: '1px solid #334155'
  },
  footerCopyright: {
    fontSize: 14,
    color: '#94a3b8',
    margin: 0
  },
  footerDisclaimer: {
    fontSize: 12,
    color: '#64748b',
    margin: 0
  }
};
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div style={styles.container}>
      {/* ==========================================
           SECTION 1: HEADER WITH LOGO, SEARCH, 4 BUTTONS, BASKET
          ========================================== */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <img src="/assets/logos/logo-main.png" alt="instaCart.PH Logo" style={styles.logo} />
          <div style={styles.logoText}>instaCart.PH</div>
        </div>
        <div style={styles.navSection}>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="Search products..." style={styles.searchInput} />
            <button style={styles.searchBtn}>Search</button>
          </div>
          <div style={styles.authSection}>
                        <button
              type="button"
              onClick={() => navigate('/auth')}
              style={styles.authBtn}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={styles.authBtnPrimary}
            >
              Sign Up
            </button>
          </div>
          <button style={styles.basketBtn}>
            Basket
            <span style={styles.basketCount}>0</span>
          </button>
        </div>
      </header>

      {/* ==========================================
           SECTION 2: HERO SECTION
          ========================================== */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          &#127808; Fresh from Philippine Vendors
        </div>
        <h1 style={styles.heroTitle}>Everything You Need,<br />Delivered to Your Door</h1>
        <p style={styles.heroSubtitle}>
          From department stores, hardware, furniture, pharmacies, restaurants, food chains, wet markets, groceries, and dry goods — shop everything from local vendors across the Philippines. Same-day delivery available.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.heroBtnPrimary}>Start Shopping</button>
          <button style={styles.heroBtnSecondary}>Browse Vendors</button>
        </div>
      </section>

      {/* ==========================================
           SECTION: ROLE SELECTION - 4 ROLES
          ========================================== */}
      <section style={styles.roleSelectionSection}>
        <h2 style={styles.roleSelectionTitle}>Choose Your Role</h2>
        <div style={styles.roleButtonsGrid}>
          <button
            type="button"
            onClick={() => navigate('/customer')}
            style={styles.roleButton}
          >
            <span style={styles.roleButtonIcon}>🛒</span>
            <span style={styles.roleButtonLabel}>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/driver')}
            style={styles.roleButton}
          >
            <span style={styles.roleButtonIcon}>🚚</span>
            <span style={styles.roleButtonLabel}>Driver</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor')}
            style={styles.roleButton}
          >
            <span style={styles.roleButtonIcon}>🏪</span>
            <span style={styles.roleButtonLabel}>Vendor</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            style={styles.roleButton}
          >
            <span style={styles.roleButtonIcon}>🛡️</span>
            <span style={styles.roleButtonLabel}>Admin</span>
          </button>
        </div>
      </section>

      {/* ==========================================
           SECTION 3: PROMOTIONAL CAMPAIGNS
          ========================================== */}
      <section style={styles.campaignsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>This Week's Deals</h2>
          <p style={styles.sectionSubtitle}>Limited-time offers from our partner vendors</p>
        </div>
        <div style={styles.campaignsGrid}>
          <div style={styles.campaignCard}>
            <div style={styles.campaignImageWrapper}>
              <img src="https://images.unsplash.com/photo-1533042731793-4c9375b34795?w=400" alt="Fresh Produce" style={styles.campaignImage} />
              <div style={styles.campaignBadge}>30% OFF</div>
            </div>
            <div style={styles.campaignContent}>
              <h3 style={styles.campaignTitle}>Fresh Produce Bundle</h3>
              <p style={styles.campaignDesc}>Organic vegetables and fruits from local farms</p>
            </div>
          </div>
          <div style={styles.campaignCard}>
            <div style={styles.campaignImageWrapper}>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" alt="Dairy Products" style={styles.campaignImage} />
              <div style={styles.campaignBadge}>20% OFF</div>
            </div>
            <div style={styles.campaignContent}>
              <h3 style={styles.campaignTitle}>Dairy Essentials</h3>
              <p style={styles.campaignDesc}>Fresh milk, cheese, and yogurt products</p>
            </div>
          </div>
          <div style={styles.campaignCard}>
            <div style={styles.campaignImageWrapper}>
              <img src="https://images.unsplash.com/photo-1550584015-8b9f49323cb3?w=400" alt="Meat & Seafood" style={styles.campaignImage} />
              <div style={styles.campaignBadge}>25% OFF</div>
            </div>
            <div style={styles.campaignContent}>
              <h3 style={styles.campaignTitle}>Meat & Seafood</h3>
              <p style={styles.campaignDesc}>Premium cuts and fresh catch from local markets</p>
            </div>
          </div>
          <div style={styles.campaignCard}>
            <div style={styles.campaignImageWrapper}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" alt="Pantry Staples" style={styles.campaignImage} />
              <div style={styles.campaignBadge}>15% OFF</div>
            </div>
            <div style={styles.campaignContent}>
              <h3 style={styles.campaignTitle}>Pantry Staples</h3>
              <p style={styles.campaignDesc}>Rice, canned goods, and kitchen essentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           SECTION 4: REAL VENDOR PRODUCTS
          ========================================== */}
      <section style={styles.productsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Fresh Products from Local Vendors</h2>
          <p style={styles.sectionSubtitle}>Quality products from trusted Philippine vendors</p>
        </div>
        <div style={styles.productsGrid}>
          <div style={styles.productCard}>
            <div style={styles.productImageWrapper}>
              <img src="https://images.unsplash.com/photo-1533042731793-4c9375b34795?w=300" alt="Organic Vegetables" style={styles.productImage} />
              <div style={styles.productCategoryBadge}>Produce</div>
            </div>
            <div style={styles.productInfo}>
              <div style={styles.productName}>Organic Vegetable Bundle</div>
              <div style={styles.productVendor}>Green Valley Farm &bull; Laguna</div>
            </div>
            <div style={styles.productPrice}>&#8369;350.00</div>
            <button style={styles.addToCartBtn}>Add to Cart</button>
          </div>
          <div style={styles.productCard}>
            <div style={styles.productImageWrapper}>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300" alt="Fresh Milk" style={styles.productImage} />
              <div style={styles.productCategoryBadge}>Dairy</div>
            </div>
            <div style={styles.productInfo}>
              <div style={styles.productName}>Fresh Milk 1L</div>
              <div style={styles.productVendor}>Dairy Fresh Co. &bull; Batangas</div>
            </div>
            <div style={styles.productPrice}>&#8369;95.00</div>
            <button style={styles.addToCartBtn}>Add to Cart</button>
          </div>
          <div style={styles.productCard}>
            <div style={styles.productImageWrapper}>
              <img src="https://images.unsplash.com/photo-1550584015-8b9f49323cb3?w=300" alt="Premium Meat" style={styles.productImage} />
              <div style={styles.productCategoryBadge}>Meat</div>
            </div>
            <div style={styles.productInfo}>
              <div style={styles.productName}>Premium Pork Belly (1kg)</div>
              <div style={styles.productVendor}>Butcher's Choice &bull; Bulacan</div>
            </div>
            <div style={styles.productPrice}>&#8369;320.00</div>
            <button style={styles.addToCartBtn}>Add to Cart</button>
          </div>
          <div style={styles.productCard}>
            <div style={styles.productImageWrapper}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300" alt="Pantry Staples" style={styles.productImage} />
              <div style={styles.productCategoryBadge}>Pantry</div>
            </div>
            <div style={styles.productInfo}>
              <div style={styles.productName}>Premium White Rice (5kg)</div>
              <div style={styles.productVendor}>Rice Granary &bull; Nueva Ecija</div>
            </div>
            <div style={styles.productPrice}>&#8369;280.00</div>
            <button style={styles.addToCartBtn}>Add to Cart</button>
          </div>
        </div>
      </section>

      {/* ==========================================
           SECTION 5: PAYMENT PARTNERS
          ========================================== */}
      <section style={styles.paymentPartnersSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Secure Payment Partners</h2>
          <p style={styles.sectionSubtitle}>Multiple payment options for your convenience</p>
        </div>
        <div style={styles.paymentGrid}>
          <div style={styles.paymentCard}>
            <div style={styles.paymentIcon}>&#128177;</div>
            <h3 style={styles.paymentTitle}>Credit/Debit Card</h3>
            <p style={styles.paymentDesc}>Visa, Mastercard, and more</p>
          </div>
          <div style={styles.paymentCard}>
            <div style={styles.paymentIcon}>&#128187;</div>
            <h3 style={styles.paymentTitle}>GCash</h3>
            <p style={styles.paymentDesc}>Mobile wallet payments</p>
          </div>
          <div style={styles.paymentCard}>
            <div style={styles.paymentIcon}>&#128178;</div>
            <h3 style={styles.paymentTitle}>PayPal</h3>
            <p style={styles.paymentDesc}>Secure online payments</p>
          </div>
          <div style={styles.paymentCard}>
            <div style={styles.paymentIcon}>&#128176;</div>
            <h3 style={styles.paymentTitle}>Cash on Delivery</h3>
            <p style={styles.paymentDesc}>Pay when your order arrives</p>
          </div>
        </div>
      </section>

      {/* ==========================================
           SECTION 6: CUSTOMER TESTIMONIALS
          ========================================== */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
          <p style={styles.sectionSubtitle}>Real reviews from happy customers across the Philippines</p>
        </div>
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard}>
            <div style={styles.testimonialHeader}>
              <div style={styles.testimonialAvatar}>&#128107;</div>
              <div>
                <div style={styles.testimonialName}>Maria Santos</div>
                <div style={styles.testimonialRating}>&#11088;&#11088;&#11088;&#11088;&#11088;</div>
              </div>
            </div>
            <p style={styles.testimonialText}>"Best grocery delivery service in Manila! Fresh produce and great prices."</p>
          </div>
          <div style={styles.testimonialCard}>
            <div style={styles.testimonialHeader}>
              <div style={styles.testimonialAvatar}>&#128107;</div>
              <div>
                <div style={styles.testimonialName}>Juan Dela Cruz</div>
                <div style={styles.testimonialRating}>&#11088;&#11088;&#11088;&#11088;&#11088;</div>
              </div>
            </div>
            <p style={styles.testimonialText}>\"Fast delivery and excellent customer service. Highly recommended!\"</p>
          </div>
          <div style={styles.testimonialCard}>
            <div style={styles.testimonialHeader}>
              <div style={styles.testimonialAvatar}>&#128107;</div>
              <div>
                <div style={styles.testimonialName}>Rosa Fernandez</div>
                <div style={styles.testimonialRating}>&#11088;&#11088;&#11088;&#11088;&#11088;</div>
              </div>
            </div>
            <p style={styles.testimonialText}>\"Convenient and reliable. My groceries always arrive fresh and on time.\"</p>
          </div>
        </div>
      </section>

      {/* ==========================================
           SECTION 7: FOOTER
          ========================================== */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerSectionTitle}>instaCart.PH</h3>
            <p style={styles.footerDesc}>Locally sourcing fresh ingredients across the Philippines.</p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerSectionTitle}>Legal</h3>
            <div style={styles.footerLink}>Business Permit: BIN-2024-001</div>
            <div style={styles.footerLink}>SEC Registration: SEC-2024-002</div>
            <div style={styles.footerLink}>BIR Certificate: BIR-2024-003</div>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerSectionTitle}>Customer Support</h3>
            <div style={styles.footerLink}>
              <span style={{ fontWeight: 600, color: '#0f766e' }}>&#128231;</span> gilaknowles80@gmail.com
            </div>
            <div style={styles.footerLink}>
              <span style={{ fontWeight: 600, color: '#0f766e' }}>&#128222;</span> (02) 8-123-4567
            </div>
            <div style={styles.footerLink}>
              <span style={{ fontWeight: 600, color: '#0f766e' }}>&#127968;</span> www.instacart.ph
            </div>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerSectionTitle}>Payment Partners</h3>
            <div style={styles.paymentLogos}>
              <span style={styles.paymentLogo}>&#128177;</span>
              <span style={styles.paymentLogo}>&#128187;</span>
              <span style={styles.paymentLogo}>&#128178;</span>
              <span style={styles.paymentLogo}>&#128176;</span>
            </div>
            <div style={styles.footerPoweredBy}>
              <span style={styles.poweredByText}>Powered by</span>
              <img src="https://www.paypalobjects.com/en_US/i/btn/btn_bayonneLG.gif" alt="PayPal" style={styles.paypalLogo} />
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>&copy; 2026 instaCart.PH. All rights reserved.</p>
          <p style={styles.footerCopyright}>Locally sourcing fresh ingredients across the Philippines.</p>
        </div>
      </footer>
    </div>
  );
};

