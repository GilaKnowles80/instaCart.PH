import React, { useState } from 'react';

export const DryGoodsForm: React.FC = () => {
  const [storageType, setStorageType] = useState('Shelf'); // Shelf, Box, Pallet
  const [isStackable, setIsStackable] = useState(true);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Dry Goods & Non-Perishables</h3>
      <p className="text-sm text-gray-500 mb-6">Manage shelf configurations and bulk stock storage metrics.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Storage Assignment</label>
          <select value={storageType} onChange={(e) => setStorageType(e.target.value)} className="w-full p-2.5 border rounded-lg">
            <option value="Shelf">Standard Display Shelf</option>
            <option value="Warehouse">Backroom Warehouse</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isStackable} onChange={(e) => setIsStackable(e.target.checked)} id="stackable" className="w-4 h-4" />
          <label htmlFor="stackable" className="text-sm font-medium text-gray-700">Item is safely stackable in bulk</label>
        </div>
      </div>
    </div>
  );
};
