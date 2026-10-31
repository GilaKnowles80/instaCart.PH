export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  avatarUrl?: string;
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  vendorName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  paymentMethod: 'gcash' | 'maya' | 'paypal' | 'cash' | 'qr';
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}