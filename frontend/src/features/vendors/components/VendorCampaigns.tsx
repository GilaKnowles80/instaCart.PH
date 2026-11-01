import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'pharmacy', label: 'Pharmacies', icon: '💊' },
  { id: 'furniture', label: 'Furnitures', icon: '🪑' },
  { id: 'department_store', label: 'Department Stores', icon: '🏬' },
  { id: 'hardware', label: 'HardWares', icon: '🔧' },
  { id: 'grocery', label: 'Grocery Stores', icon: '🛒' },
  { id: 'wet_market', label: 'Wet-Market Vendors', icon: '🐟' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { id: 'food_chain', label: 'Food Chains', icon: '🍔' },
  { id: 'pizza', label: 'Pizza Parlors', icon: '🍕' },
  { id: 'appliance', label: 'Appliances', icon: '❄️' },
  { id: 'gadgets', label: 'Gadgets and Electronics', icon: '📱' },
  { id: 'home_decor', label: 'Home Decors', icon: '🏠' },
];

export const VendorCampaigns: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fbfd', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/logos/logo-main.png" alt="instaCart.PH" style={{ width: '40px', height: 'auto' }} />
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#2ecc71' }}>instaCart.PH</span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7c72' }}>Vendor Campaigns & Marketplace</div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#2c3e50', margin: '0 0 20px 0' }}>Choose a Category</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                navigate(`/vendors/category/${cat.id}`);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '24px 16px',
                border: '2px solid #dfe7e2',
                borderRadius: 16,
                background: '#fbfdfb',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                color: '#34493c',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '44px', background: '#e9f5ec', width: '72px', height: '72px', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</div>
              <div>{cat.label}</div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#2c3e50', marginBottom: '16px' }}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.label} Products
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px' }}>
                  <div style={{ aspectRatio: 1, background: '#f1f5f9', borderRadius: 8, marginBottom: '12px' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bdc3c7', fontSize: '32px' }}>📦</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2c3e50' }}>Sample Product {i}</div>
                  <div style={{ fontSize: '12px', color: '#6b7c72' }}>Vendor Store Name</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#2ecc71', marginTop: '8px' }}>₱{i * 100}.00</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};