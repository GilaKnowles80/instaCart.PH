import React from 'react';
import { useDriverPayouts } from '../hooks/useDriverPayouts';

export const EarningsTracker: React.FC = () => {
  const { payouts, metrics, loading, error, refresh } = useDriverPayouts();

  if (loading) return <div className="p-6 text-sm text-gray-500 font-medium">Syncing earnings data registers...</div>;
  if (error) return <div className="p-6 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Earnings Tracker</h3>
          <p className="text-xs text-gray-500">Track delivery driver payout allocations, tips, and remittances.</p>
        </div>
        <button onClick={refresh} className="p-2 text-xs font-bold border rounded-lg hover:bg-gray-50 transition-all">🔄 Sync</button>
      </div>

      {/* Metrics Cards Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-75">Total Accumulated Earnings</p>
          <p className="text-2xl font-black mt-1">₱{metrics.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-blue-50 text-blue-900 border border-blue-100 rounded-xl">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-75">Withdrawable Balance</p>
          <p className="text-2xl font-black mt-1">₱{metrics.balance.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-50 text-gray-900 border border-gray-100 rounded-xl">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-75">Active Deliveries Route</p>
          <p className="text-2xl font-black mt-1">{metrics.activeDeliveriesCount} Job</p>
        </div>
      </div>

      {/* Ledger History Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-800">Recent Remittance Logs</h4>
        <div className="border rounded-xl divide-y overflow-hidden shadow-sm bg-gray-50/20">
          {payouts.map((payout) => (
            <div key={payout.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-800">{payout.orderId}</p>
                <p className="text-[10px] text-gray-400 font-medium">Completed: {payout.date} • Base Fee: ₱{payout.deliveryFee} • Tip: ₱{payout.tip}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-black text-emerald-600">+₱{payout.amount.toFixed(2)}</p>
                <span className={`inline-block px-2 py-0.5 font-bold text-[9px] rounded-md ${payout.status === 'REMITTED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
