import React, { useState } from 'react';

export const RestaurantForm: React.FC = () => {
  const [prepTime, setPrepTime] = useState(20); // minutes
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Kitchen Management Console</h3>
      <p className="text-sm text-gray-500 mb-6">Configure average order food preparation intervals and kitchen active status.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Average Food Preparation Time (Minutes)</label>
          <input type="number" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} className="w-full p-2.5 border rounded-lg" min="5" max="120" />
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-800">Kitchen Operations Status</p>
            <p className="text-xs text-gray-500">Temporarily pause incoming food delivery orders</p>
          </div>
          <button type="button" onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${isKitchenOpen ? 'bg-green-600' : 'bg-red-600'}`}>
            {isKitchenOpen ? 'KITCHEN OPEN' : 'KITCHEN PAUSED'}
          </button>
        </div>
      </div>
    </div>
  );
};
