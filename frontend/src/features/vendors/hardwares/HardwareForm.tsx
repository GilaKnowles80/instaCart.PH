import React, { useState } from 'react';

export const HardwareForm: React.FC = () => {
  const [skuNumber, setSkuNumber] = useState('');
  const [isHeavyItem, setIsHeavyItem] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Hardware & Tooling Specs</h3>
      <p className="text-sm text-gray-500 mb-6">Assign engineering SKUs, logistics weight codes, and safety labels.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer SKU / Model Number</label>
          <input type="text" value={skuNumber} onChange={(e) => setSkuNumber(e.target.value)} className="w-full p-2.5 border rounded-lg" placeholder="e.g. HDW-9912-X" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isHeavyItem} onChange={(e) => setIsHeavyItem(e.target.checked)} id="heavy" className="w-4 h-4" />
          <label htmlFor="heavy" className="text-sm font-medium text-gray-700">Requires special helper delivery vehicle (Heavy/Bulky Item)</label>
        </div>
      </div>
    </div>
  );
};
