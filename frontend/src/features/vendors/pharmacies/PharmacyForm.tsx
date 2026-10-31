import React, { useState } from 'react';

export const PharmacyForm: React.FC = () => {
  const [fdaLicense, setFdaLicense] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Pharmacy Regulatory Validation</h3>
      <p className="text-sm text-gray-500 mb-6">Manage mandatory medical licenses and Rx prescription controls.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">FDA Pharmacy License Number</label>
          <input type="text" value={fdaLicense} onChange={(e) => setFdaLicense(e.target.value)} className="w-full p-2.5 border rounded-lg" placeholder="e.g. FDA-PH-12345" />
        </div>
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
          <input type="checkbox" checked={requiresPrescription} onChange={(e) => setRequiresPrescription(e.target.checked)} id="rx" className="w-4 h-4" />
          <label htmlFor="rx" className="text-sm font-semibold">Strictly requires customer to upload an Rx medical prescription</label>
        </div>
      </div>
    </div>
  );
};
