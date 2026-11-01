import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2c3e50', margin: 0 }}>Search Results</h1>
        <p style={{ color: '#6b7c72' }}>{query ? `Results for "${query}"` : 'Search for products and vendors'}</p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search products, vendors, pharmacies, groceries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '14px',
              background: '#fff',
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#2ecc71',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            🔍
          </button>
        </div>
      </form>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#6b7c72' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2c3e50' }}>No results found</div>
            <div style={{ fontSize: '14px', color: '#6b7c72' }}>Try browsing our vendor categories instead.</div>
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/vendors')} style={{ background: '#2ecc71', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Browse All Vendors</button>
    </div>
  );
};