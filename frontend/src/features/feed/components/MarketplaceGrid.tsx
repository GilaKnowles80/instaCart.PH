import React from 'react';
import { ProductCard } from '../../../components/shared/ProductCard';
import { PayPalHostedButton } from '../../../components/shared/PayPalHostedButton';
import type { MarketplaceCategory } from '../../../components/layout/Navigation';
import { useBasket } from '../../basket/context/BasketContext';

type VendorProduct = {
  id: string;
  name: string;
  price: number;
  vendorName: string;
  categories: MarketplaceCategory[];
};

type VendorSpace = {
  id: string;
  name: string;
  area: string;
  advertisement: string;
  accent: string;
  categories: MarketplaceCategory[];
  products: VendorProduct[];
};

interface MarketplaceGridProps {
  selectedCategory?: MarketplaceCategory;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ selectedCategory = 'All Markets' }) => {
  const { addToCart } = useBasket();
  const visibleSpaces = vendorSpaces
    .map((vendor) => ({
      ...vendor,
      products: selectedCategory === 'All Markets'
        ? vendor.products
        : vendor.products.filter((product) => product.categories.includes(selectedCategory))
    }))
    .filter((vendor) => vendor.products.length > 0);

  return <section style={{ padding: 20 }}>
    <div style={styles.heading}>
      <div>
        <p style={styles.eyebrow}>Vendor marketplace</p>
        <h1 style={styles.title}>Shop trusted local vendors</h1>
        <p style={styles.subtitle}>Browse each vendor space, discover their offers, and check out in one basket.</p>
      </div>
      <span style={styles.marketCount}>{visibleSpaces.length} vendor spaces</span>
    </div>

    <div style={styles.vendorList}>
      {visibleSpaces.length > 0 ? visibleSpaces.map((vendor) => (
        <article key={vendor.id} style={styles.vendorSpace}>
          <div style={{ ...styles.advertisement, borderLeftColor: vendor.accent }}>
            <div>
              <p style={{ ...styles.vendorArea, color: vendor.accent }}>{vendor.area}</p>
              <h2 style={styles.vendorName}>{vendor.name}</h2>
              <p style={styles.adCopy}>{vendor.advertisement}</p>
            </div>
            <span style={{ ...styles.adBadge, color: vendor.accent }}>Vendor offer</span>
          </div>
          <div style={styles.productRow}>
            {vendor.products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                vendorName={product.vendorName}
                onAddToBasket={() => addToCart(product)}
              />
            ))}
          </div>
        </article>
      )) : <p style={styles.emptyState}>No vendor products are listed in this market yet.</p>}
    </div>
    {visibleSpaces.length > 0 && (
      <div style={styles.paypalCheckout}>
        <p style={styles.paypalLabel}>Quick PayPal Checkout</p>
        <PayPalHostedButton />
      </div>
    )}
  </section>;
};

const vendorSpaces: VendorSpace[] = [
  {
    id: 'quinta-wet-market',
    name: 'Quinta Wet Market',
    area: 'Fresh catch and produce',
    advertisement: 'Morning market picks, prepared for today\'s table.',
    accent: '#16834b',
    categories: ['Wet Market', 'Fresh Produce'],
    products: [
      { id: 'p1', name: 'Fresh Bangus (Milkfish)', price: 180, vendorName: 'Quinta Wet Market', categories: ['Wet Market', 'Fresh Produce'] },
      { id: 'p3', name: 'Pork Liempo 1kg', price: 340, vendorName: 'Quinta Wet Market', categories: ['Wet Market', 'Halal Meat', 'Wholesale'] }
    ]
  },
  {
    id: 'mercury-express-pharmacy',
    name: 'Mercury Express Pharmacy',
    area: 'Health and everyday care',
    advertisement: 'Reliable essentials with convenient doorstep checkout.',
    accent: '#1469a8',
    categories: ['Pharmacy Vendors'],
    products: [
      { id: 'p2', name: 'Amoxicillin 500mg', price: 12, vendorName: 'Mercury Express Pharmacy', categories: ['Pharmacy Vendors'] }
    ]
  },
  {
    id: 'metro-department-store',
    name: 'Metro Department Store',
    area: 'Home and household',
    advertisement: 'Organize your home with practical weekly offers.',
    accent: '#7a3e9d',
    categories: ['Department Stores', 'Supermarkets'],
    products: [
      { id: 'p4', name: 'Kitchen Storage Set', price: 499, vendorName: 'Metro Department Store', categories: ['Department Stores', 'Supermarkets'] }
    ]
  },
  {
    id: 'buildright-hardware',
    name: 'BuildRight Hardware',
    area: 'Tools and materials',
    advertisement: 'Build, repair, and restock with trade-ready tools.',
    accent: '#d96d0b',
    categories: ['Hardwares', 'Wholesale'],
    products: [
      { id: 'p5', name: 'Cordless Drill 12V', price: 1890, vendorName: 'BuildRight Hardware', categories: ['Hardwares', 'Wholesale'] }
    ]
  }
];

const styles: Record<string, React.CSSProperties> = {
  wrapper: { padding: 20 },
  heading: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  eyebrow: { margin: '0 0 7px', color: '#16834b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' },
  title: { margin: 0, color: '#20352a', fontSize: 28 },
  subtitle: { margin: '8px 0 0', color: '#6b7c72' },
  marketCount: { flexShrink: 0, padding: '8px 10px', borderRadius: 6, background: '#e6f6ed', color: '#16834b', fontSize: 12, fontWeight: 700 },
  vendorList: { display: 'grid', gap: 24 },
  vendorSpace: { padding: 18, border: '1px solid #dfe7e2', borderRadius: 8, background: '#fff' },
  advertisement: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', padding: '4px 0 16px 14px', borderLeft: '4px solid' },
  vendorArea: { margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' },
  vendorName: { margin: '5px 0 4px', color: '#20352a', fontSize: 20 },
  adCopy: { margin: 0, color: '#6b7c72', fontSize: 13 },
  adBadge: { padding: '6px 8px', border: '1px solid currentColor', borderRadius: 5, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },
  productRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  paypalCheckout: { marginTop: 30, padding: 16, border: '1px dashed #cbd5d0', borderRadius: 8, background: '#f7faf8' },
  paypalLabel: { margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#16834b' },
  emptyState: { color: '#6b7c72' }
};
