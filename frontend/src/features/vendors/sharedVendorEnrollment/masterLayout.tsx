import React, { useState, FormEvent } from 'react';
import { VendorCategory, PayoutChannel, VendorEnrollment } from './index';

// Import all localized vendors 
import { DepartmentStoreForm } from '../department-stores/DepartmentStoreForm';
import { DryGoodsForm } from '../dry-goods/DryGoodsForm';
import { HardwareForm } from '../hardwares/HardwareForm';
import { PharmacyForm } from '../pharmacies/PharmacyForm';
import { RestaurantForm } from '../restaurants/RestaurantForm';
import { WetMarketForm } from '../wet-market/WetMarketForm';

type EnrollmentFormData = Pick<
  VendorEnrollment,
  'businessName' | 'category' | 'payoutMethod' | 'payoutAccountDetails'
>;

export const MasterLayout: React.FC = () => {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    businessName: '',
    category: 'RESTAURANT', // Matching uppercase from index.ts
    payoutMethod: 'GCASH',   // Matching PayoutChannel uppercase from index.ts
    payoutAccountDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Dynamic Switch Form Handler based on chosen VendorCategory
  const renderDepartmentSpecificForm = () => {
    switch (formData.category) {
      case 'DEPARTMENT_STORE':
        return <DepartmentStoreForm />;
      case 'DRY_GOODS':
        return <DryGoodsForm />;
      case 'HARDWARE':
        return <HardwareForm />;
      case 'PHARMACY':
        return <PharmacyForm />;
      case 'RESTAURANT':
        return <RestaurantForm />;
      case 'WET_MARKET':
        return <WetMarketForm />;
      default:
        return null;
    }
  };

  // 2. Lifecycle FormEvent Trigger Handler
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting enrollment data to Neon DB:', formData);
      // Your asynchronous API backend routing logic will go here
    } catch (err: any) {
      setError(err.message || 'Failed to submit enrollment application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      {/* SECTION 1: Core Business Identity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vendor Partner Enrollment</h2>
        <p className="text-sm text-gray-500 mb-6">Onboard your store branch into the instaCart.PH ecosystem.</p>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Registered Name</label>
            <input 
              type="text" 
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Juan's Bakery Corp"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Operations Category</label>
            <select 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as VendorCategory })}
            >
              <option value="RESTAURANT">Restaurant / Food Service</option>
              <option value="PHARMACY">Pharmacy / Drugstore</option>
              <option value="WET_MARKET">Wet Market / Fresh Goods</option>
              <option value="HARDWARE">Hardware & Tools</option>
              <option value="DRY_GOODS">Dry Goods Wholesalers</option>
              <option value="DEPARTMENT_STORE">Department Store / Retail</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Department Variant Fields */}
      {renderDepartmentSpecificForm()}

      {/* SECTION 3: Payout Channels Config (Mapping lowercase variables) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Financial Remittance Channels</h3>
        <p className="text-sm text-gray-500 mb-6">Select your primary channel for processing platform commissions and earnings.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Operations Category</label>
            <select 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as VendorCategory })}
            >
              <option value="RESTAURANT">Restaurant / Food Service</option>
              <option value="PHARMACY">Pharmacy / Drugstore</option>
              <option value="WET_MARKET">Wet Market / Fresh Goods</option>
              <option value="HARDWARE">Hardware & Tools</option>
              <option value="DRY_GOODS">Dry Goods Wholesalers</option>
              <option value="DEPARTMENT_STORE">Department Store / Retail</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Department Variant Fields */}
      {renderDepartmentSpecificForm()}

      {/* SECTION 3: Payout Channels Config (Mapping lowercase variables) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Financial Remittance Channels</h3>
        <p className="text-sm text-gray-500 mb-6">Select your primary channel for processing platform commissions and earnings.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payout Provider</label>
            <select 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
              value={formData.payoutMethod}
              onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value as PayoutChannel })}
            >
              <option value="GCASH">GCash Wallet (Instapay)</option>
              <option value="MAYA">Maya Business</option>
              <option value="BPI_BANK">BPI Bank Transfer</option>
              <option value="PAYPAL">PayPal Merchant</option>
              <option value="PAYMONGO">PayMongo Gateway</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number / Link Details</label>
            <input 
              type="text" 
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. 0917XXXXXXX or Bank Account ID"
              value={formData.payoutAccountDetails}
              onChange={(e) => setFormData({ ...formData, payoutAccountDetails: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Submission Control Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow transition-all"
      >
        {loading ? 'Processing Application...' : 'Submit Onboarding Application'}
      </button>
    </form>
  )
}