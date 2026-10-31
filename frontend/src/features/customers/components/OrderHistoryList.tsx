import React, { useState } from 'react';
import type { Order } from '../services/customer.types';
import { usecustomerOrders } from '../hooks/usecustomerOrders';

export const OrderHistoryList: React.FC = () => {
  const { orders, loading, error, refreshData } = usecustomerOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Toggle order accordion to show list item details
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Helper method to assign badge styling matching the operational state status
  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'shipped':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-gray-100 rounded-xl animate-pulse w-full border border-gray-200/60" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-center justify-between">
        <p className="font-medium">⚠️ {error}</p>
        <button onClick={refreshData} className="text-xs font-bold underline hover:text-red-900">Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl p-6 bg-gray-50/50">
        <span className="block text-3xl mb-2">🛒</span>
        <h4 className="text-sm font-bold text-gray-700">No active orders placed</h4>
        <p className="text-xs text-gray-400 mt-0.5">Your incoming order transactions ledger will appear right here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-800">Order Logs & Receipts</h3>
        <button 
          onClick={refreshData} 
          className="text-xs text-gray-500 hover:text-gray-800 font-semibold p-1 transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          
          return (
            <div 
              key={order.id} 
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Collapsed Header Layout row */}
              <div 
                onClick={() => toggleOrderExpand(order.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 transition-all select-none"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800">{order.vendorName}</h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {order.id} • {order.createdAt} • {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800">₱{order.total.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 mt-0.5 text-[9px] font-bold border rounded-md uppercase tracking-wider ${getStatusBadgeStyle(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`text-gray-400 font-bold transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Accordion Expand Container for Itemized Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-50 bg-gray-50/30 space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Itemized Breakdown</p>
                    <div className="p-3 flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-lg">
                      <span className="text-gray-600">Items</span>
                      <span className="font-semibold text-gray-800">{order.items} item(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 pt-1 px-1">
                    <span>Transaction ID Token</span>
                    <span className="font-mono text-gray-400">{crypto.randomUUID().substring(0, 18).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
