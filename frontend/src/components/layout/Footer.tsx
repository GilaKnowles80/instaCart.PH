import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        {/* instaCart.PH */}
        <div style={styles.footerSection}>
          <h3 style={styles.footerSectionTitle}>instaCart.PH</h3>
          <p style={styles.footerDesc}>
            Locally sourcing fresh ingredients across the Philippines.
          </p>
        </div>

        {/* Legal */}
        <div style={styles.footerSection}>
          <h3 style={styles.footerSectionTitle}>Legal</h3>
          <div style={styles.footerLink}>Business Permit: BIN-2024-001</div>
          <div style={styles.footerLink}>SEC Registration: SEC-2024-002</div>
          <div style={styles.footerLink}>BIR Certificate: BIR-2024-003</div>
        </div>

        {/* Contact - gilaknowles80@gmail.com FIRST */}
        <div style={styles.footerSection}>
          <h3 style={styles.footerSectionTitle}>Customer Support</h3>
          <div style={styles.footerLink}>
            <span style={{ fontWeight: 600, color: '#0f766e' }}>📧</span>
            gilaknowles80@gmail.com
          </div>
          <div style={styles.footerLink}>
            <span style={{ fontWeight: 600, color: '#0f766e' }}>📞</span>
            (02) 8-123-4567
          </div>
          <div style={styles.footerLink}>
            <span style={{ fontWeight: 600, color: '#0f766e' }}>🌐</span>
            www.instacart.ph
          </div>
        </div>

        {/* Payment Partners */}
        <div style={styles.footerSection}>
          <h3 style={styles.footerSectionTitle}>Payment Partners</h3>
          <div style={styles.paymentLogos}>
            <span style={styles.paymentLogo}>💳</span>
            <span style={styles.paymentLogo}>📱</span>
            <span style={styles.paymentLogo}>📱</span>
            <span style={styles.paymentLogo}>📷</span>
          </div>
          <div style={styles.footerPoweredBy}>
            <span style={styles.poweredByText}>Powered by</span>
            <img
              src="https://www.paypalobjects.com/en_US/i/btn/btn_bayonneLG.gif"
              alt="PayPal"
              style={styles.paypalLogo}
            />
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p style={styles.footerCopyright}>© 2026 instaCart.PH. All rights reserved.</p>
        <p style={styles.footerCopyright}>
          Locally sourcing fresh ingredients across the Philippines.
        </p>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: 40,
    padding: 40,
    background: '#1e293b',
    color: '#fff',
    borderRadius: 8,
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
  },
  footerSection: {
    flex: 1,
    minWidth: 200,
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
  },
  footerDesc: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  footerLink: {
    fontSize: 14,
    color: '#cbd5e1',
    textDecoration: 'none',
    marginBottom: 8,
    display: 'block',
  },
  footerLinkHover: {
    color: '#fff',
  },
  paymentLogos: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  },
  paymentLogo: {
    fontSize: 24,
  },
  footerPoweredBy: {
    marginTop: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  poweredByText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  paypalLogo: {
    height: 32,
  },
  footerBottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingTop: 24,
    borderTop: '1px solid #334155',
  },
  footerCopyright: {
    fontSize: 14,
    color: '#94a3b8',
    margin: 0,
  },
};
