import React, { useState } from 'react';
import type { Customer } from '../services/customer.types';
import { usecustomerOrders } from '../hooks/usecustomerOrders';

export const CustomerProfileCard: React.FC = () => {
  const { profile, loading, error, updateCustomerProfile } = usecustomerOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state to capture form edits cleanly
  const [editForm, setEditForm] = useState<Customer | null>(null);

  // Initialize the edit form with active profile data
  const handleStartEdit = () => {
    if (profile) {
      setEditForm({ ...profile });
      setIsEditing(true);
    }
  };

  // Submit updated profile details down to services layer
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setIsSaving(true);
    const success = await updateCustomerProfile(editForm);
    setIsSaving(false);
    
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="h-20 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
        <p className="font-medium">⚠️ Failed to load profile: {error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      {/* Banner / Header accent layout */}
      <div className="h-16 bg-gradient-to-r from-emerald-500 to-teal-600" />
      
      <div className="p-6 pt-0 relative">
        {/* User initials avatar badge */}
        <div className="w-16 h-16 bg-gray-800 text-white rounded-xl flex items-center justify-center font-black text-xl border-4 border-white shadow-sm absolute -top-8 left-6 select-none">
          {profile.name.split(' ')[0]?.[0]}{profile.name.split(' ')[1]?.[0]}
        </div>

        <div className="flex justify-end pt-3">
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="text-xs font-bold text-gray-600 hover:text-emerald-600 border rounded-lg px-3 py-1.5 transition-all bg-white hover:bg-gray-50"
            >
              📝 Edit Profile
            </button>
          )}
        </div>

        {/* PROFILE READ VIEW */}
        {!isEditing ? (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-xl font-black text-gray-800">
                {profile.name}
              </h3>
              <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                Account ID: {profile.id}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t pt-4 border-gray-50">
              <div className="space-y-1">
                <p className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">Contact Info</p>
                <p className="text-gray-700 font-medium">📧 {profile.email}</p>
                <p className="text-gray-700 font-medium">📱 {profile.phone}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">Primary Delivery Address</p>
                <p className="text-gray-700 font-semibold leading-relaxed">
                  📍 {profile.address}, {profile.city}, {profile.postalCode}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* PROFILE EDIT FORM VIEW */
          <form onSubmit={handleSave} className="mt-6 space-y-4 border-t pt-4 border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-2">Modify Shipping & Account Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  value={editForm?.name || ''}
                  onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  value={editForm?.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm!, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  value={editForm?.address || ''}
                  onChange={(e) => setEditForm({ ...editForm!, address: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  value={editForm?.city || ''}
                  onChange={(e) => setEditForm({ ...editForm!, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  value={editForm?.postalCode || ''}
                  onChange={(e) => setEditForm({ ...editForm!, postalCode: e.target.value })}
                />
              </div>
            </div>

            {/* Action control button layout cluster */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 rounded-lg shadow-sm transition-all"
              >
                {isSaving ? 'Saving...' : 'Save Adjustments'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
