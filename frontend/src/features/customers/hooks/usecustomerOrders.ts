import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customer.service';
import type { Customer, Order } from '../services/customer.types';

export const usecustomerOrders = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Customer | null>(null);

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, historyData] = await Promise.all([
        customerService.getProfile(),
        customerService.getOrderHistory(),
      ]);
      setProfile(profileData);
      setOrders(historyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomerProfile = async (updatedData: Partial<Customer>) => {
    setError('');
    try {
      const savedProfile = await customerService.updateProfile(updatedData);
      setProfile(savedProfile);
      return true;
    } catch (err: any) {
      setError(err.message || 'Profile update failed.');
      return false;
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  return {
    loading,
    error,
    orders,
    profile,
    refreshData: fetchCustomerData,
    updateCustomerProfile,
  };
};
