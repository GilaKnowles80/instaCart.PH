import React from 'react';

interface MarketplaceGridProps {
  userRole?: string;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ userRole }) => {
  const products = [
    { id: 'p1', name: 'Fresh Bangus (Milkfish)', price: 180, vendorName: 'Quinta Wet Market', category: 'Wet Market', image: 'https://images.unsplash.com/photo-1569674770128-6e872123d562?w=300', distanceKm: 1.5 },
    { id: 'p2', name: 'Amoxicillin 500mg', price: 12, vendorName: 'Mercury Express Pharmacy', category: 'Pharmacy', image: 'https://images.unsplash.com/photo-1587498792178-f9229301c551?w=300', distanceKm: 0.5 },
    { id: 'p3', name: 'Pork Liempo 1kg', price: 340, vendorName: 'Quinta Wet Market', category: 'Fresh Meat', image: 'https://images.unsplash.com/photo-1558941393-4b5221e81f96?w=300', distanceKm: 1.5 },
    { id: 'p4', name: 'Kitchen Storage Set', price: 499, vendorName: 'Metro Department Store', category: 'Department Stores', image: 'https://images.unsplash.com/photo-1550745166-96c7237e7d3a?w=300', distanceKm: 3.0 },
    { id: 'p5', name: 'Cordless Drill 12V', price: 1890, vendorName: 'BuildRight Hardware', category: 'Hardware', image: 'https://images.unsplash.com/photo-1581579168431-76d690009d49?w=300', distanceKm: 5.0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, padding: 20 }}>
      {products.map((product) => (
        <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#fff' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} />
          <h3 style={{ margin: '12px 0 4px 0', fontSize: 16, fontWeight: 600 }}>{product.name}</h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{product.vendorName}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#0f766e', margin: '8px 0 0 0' }}>₱{product.price.toFixed(2)}</p>
          <button style={{ width: '100%', padding: '10px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};