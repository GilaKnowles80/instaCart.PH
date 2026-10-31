import type { Customer, Order } from './customer.types';

export const customerService = {
  async getProfile(): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'CUST-0812',
          name: 'Gila Knowles',
          email: 'gila.knowles@example.com',
          phone: '09171234567',
          address: 'Pasong Buaya II',
          city: 'Cavite',
          postalCode: '4103',
          memberSince: '2026-01-15',
          totalOrders: 2,
          totalSpent: 660.00,
        });
      }, 300);
    });
  },

  async updateProfile(profileData: Partial<Customer>): Promise<Customer> {
    console.log('Pushing updated customer registers to database endpoints:', profileData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'CUST-0812',
          name: profileData.name || 'Gila Knowles',
          email: profileData.email || 'gila.knowles@example.com',
          phone: profileData.phone || '09171234567',
          address: profileData.address || 'Pasong Buaya II',
          city: profileData.city || 'Cavite',
          postalCode: profileData.postalCode || '4103',
          memberSince: '2026-01-15',
          totalOrders: profileData.totalOrders ?? 2,
          totalSpent: profileData.totalSpent ?? 660.00,
        });
      }, 400);
    });
  },

  async getOrderHistory(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'ORD-8812',
            customerId: 'CUST-0812',
            vendorId: 'VEND-001',
            vendorName: 'Al Migz Special Binalot',
            status: 'delivered',
            total: 360.00,
            items: 2,
            createdAt: '2026-10-24T10:00:00Z',
            updatedAt: '2026-10-24T14:30:00Z',
            deliveryAddress: 'Pasong Buaya II, Cavite 4103',
            paymentMethod: 'cash',
          },
          {
            id: 'ORD-8941',
            customerId: 'CUST-0812',
            vendorId: 'VEND-002',
            vendorName: "McDonald's Tanza",
            status: 'processing',
            total: 300.00,
            items: 3,
            createdAt: '2026-10-26T09:15:00Z',
            updatedAt: '2026-10-26T11:45:00Z',
            deliveryAddress: 'Pasong Buaya II, Cavite 4103',
            paymentMethod: 'gcash',
            trackingNumber: 'PH20261026MC001',
          },
        ]);
      }, 500);
    });
  },
};
