import React, { useState } from 'react';

export const WetMarketForm: React.FC = () => {
  const [scaleUnit, setScaleUnit] = useState('kg'); // kg, grams, piece
  const [requiresChilling, setRequiresChilling] = useState(true);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Food & Wet Market Matrix</h3>
      <p className="text-sm text-gray-500 mb-6">Manage weight scaling parameters, meat cuts, and temperature control packaging.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Configuration Metric</label>
          <select value={scaleUnit} onChange={(e) => setScaleUnit(e.target.value)} className="w-full p-2.5 border rounded-lg">
            <option value="kg">Per Kilogram (kg)</option>
            <option value="grams">Per 100 Grams</option>
            <option value="piece">Per Individual Piece / Piece-wise</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={requiresChilling} onChange={(e) => setRequiresChilling(e.target.checked)} id="chilled" className="w-4 h-4" />
          <label htmlFor="chilled" className="text-sm font-medium text-gray-700">Requires dedicated thermal insulation ice bags during delivery transit</label>
        </div>
      </div>
    </div>
  );
};
