import React, { useState } from 'react';
import { useLocationTracking } from '../hooks/useLocationTracking';

export const ActiveDeliveryMap: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const { currentCoords, trackingError } = useLocationTracking(isOnline);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Transit & Logistics Mapper</h3>
          <p className="text-xs text-gray-500">Manage route tracking milestones and telemetry connections.</p>
        </div>
        
        {/* Active Toggle Control Switch */}
        <button 
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`px-5 py-2 font-bold text-xs text-white rounded-xl shadow-sm transition-all ${isOnline ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isOnline ? 'COURIER: ONLINE STATUS' : 'COURIER: OFFLINE STATUS'}
        </button>
      </div>

      {trackingError && (
        <div className="p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-100 rounded-lg">
          ⚠️ Tracking Error: {trackingError}
        </div>
      )}

      {/* Mock Map Canvas Layout Box */}
      <div className="w-full min-h-[260px] bg-slate-100 rounded-xl relative overflow-hidden border flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {isOnline && currentCoords ? (
          <div className="z-10 text-center space-y-2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow border">
            <span className="inline-block text-3xl animate-bounce">📍</span>
            <p className="text-xs font-bold text-gray-800">Live Coordinate Stream Active</p>
            <div className="text-[10px] text-mono text-gray-500 font-semibold space-y-0.5">
              <p>Lat: {currentCoords.latitude.toFixed(6)}</p>
              <p>Lng: {currentCoords.longitude.toFixed(6)}</p>
            </div>
          </div>
        ) : (
          <div className="z-10 text-center text-gray-400 max-w-xs space-y-1">
            <span className="block text-3xl">📡</span>
            <p className="text-xs font-bold text-gray-600">Telemetry Stream Inactive</p>
            <p className="text-[10px] text-gray-400">Flip your status toggle switch to online to capture pending orders and start broadcasting your delivery route.</p>
          </div>
        )}
      </div>
    </div>
  );
};