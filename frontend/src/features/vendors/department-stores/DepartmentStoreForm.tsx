import React, { useState } from 'react';

export const DepartmentStoreForm: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Clothing'); // Clothing, Shoes, Electronics
  const [variants, setVariants] = useState<string[]>([]); // S, M, L, XL

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Department Store Settings</h3>
      <p className="text-sm text-gray-500 mb-6">Configure retail inventory variants, brands, and product sizes.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2.5 border rounded-lg" placeholder="e.g. Bench, Levi's" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border rounded-lg">
            <option value="Clothing">Apparel & Clothing</option>
            <option value="Shoes">Footwear & Shoes</option>
            <option value="Electronics">Home Electronics</option>
          </select>
        </div>
      </div>
    </div>
  );
};
