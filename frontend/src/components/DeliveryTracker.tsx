import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface DeliveryTrackerProps {
  orderId?: string;
  driverLocation?: { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number };
  vendorLocation?: { lat: number; lng: number };
  status: string;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  orderId: orderIdProp,
  driverLocation,
  customerLocation,
  vendorLocation,
  status,
}) => {
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams<{ orderId: string }>();
  const orderId = orderIdProp || urlOrderId;
  const [mapCenter, setMapCenter] = useState({ lat: 14.5995, lng: 120.9894 });

  useEffect(() => {
    if (driverLocation) {
      setMapCenter(driverLocation);
    }
  }, [driverLocation]);

  return (
    <div style={styles.trackerContainer}>
      <div style={styles.trackerHeader}>
        <div style={styles.orderInfo}>
          <div style={styles.orderId}>Order #{orderId.slice(-6)}</div>
          <div style={styles.statusBadge}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status === 'delivered' ? '#16a34a' : status === 'out_for_delivery' ? '#f59e0b' : '#e2e8f0' }}></span>
            {status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
        <div style={styles.mapControls}>
          <button style={styles.refreshBtn} onClick={() => window.location.reload()}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={styles.mapContainer}>
        {/* Map Placeholder - Replace with actual Google Maps/Mapbox integration */}
        <div style={styles.mapPlaceholder}>
          <div style={styles.mapIcon}>🗺️</div>
          <div style={styles.mapText}>
            <div style={styles.mapTitle}>Live Delivery Tracking</div>
            <div style={styles.mapSubtitle}>
              Driver is en route to your location
            </div>
          </div>
          <div style={styles.driverMarker}>
            <div style={styles.driverIcon}>🚗</div>
            <div style={styles.driverLabel}>Driver</div>
          </div>
          <div style={styles.customerMarker}>
            <div style={styles.customerIcon}>🏠</div>
            <div style={styles.customerLabel}>You</div>
          </div>
          <div style={styles.vendorMarker}>
            <div style={styles.vendorIcon}>🏪</div>
            <div style={styles.vendorLabel}>Vendor</div>
          </div>
        </div>
        
        <div style={styles.trackingInfo}>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Driver</div>
            <div style={styles.infoValue}>Pedro Reyes</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Vehicle</div>
            <div style={styles.infoValue}>Motorcycle - LIC123456</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Distance</div>
            <div style={styles.infoValue}>2.3 km away</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>ETA</div>
            <div style={styles.infoValue}>15 minutes</div>
          </div>
          <div style={styles.contactButtons}>
            <button
              onClick={() => window.location.href = 'tel:09123456786'}
              style={styles.contactBtn}
            >
              📞 Call
            </button>
            <button
              onClick={() => window.location.href = 'sms:09123456786'}
              style={styles.contactBtn}
            >
              💬 Text
            </button>
          </div>
        </div>
      </div>
      <div style={styles.nextButtonContainer}>
        <button
          onClick={() => navigate(`/booking-report/${orderId}`)}
          style={styles.nextButton}
        >
          View Booking Report →
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  trackerContainer: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  trackerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  orderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  orderId: {
    fontWeight: 700,
    color: '#1e293b',
    fontSize: 14,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: '#fef3c7',
    color: '#92400e',
  },
  mapControls: {
    display: 'flex',
    gap: 8,
  },
  refreshBtn: {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  mapContainer: {
    position: 'relative',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  driverMarker: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    zIndex: 10,
  },
  driverIcon: {
    fontSize: 32,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  driverLabel: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
    background: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },
  customerMarker: {
    position: 'absolute',
    bottom: '30%',
    right: '30%',
    zIndex: 10,
  },
  customerIcon: {
    fontSize: 32,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  customerLabel: {
    position: 'absolute',
    bottom: -25,
    right: '50%',
    transform: 'translateX(50%)',
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
    background: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },
  vendorMarker: {
    position: 'absolute',
    top: '30%',
    right: '30%',
    zIndex: 10,
  },
  vendorIcon: {
    fontSize: 32,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  vendorLabel: {
    position: 'absolute',
    top: -20,
    right: '50%',
    transform: 'translateX(50%)',
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
    background: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },
  trackingInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    padding: 16,
    background: '#f8fafc',
  },
  contactButtons: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: 10,
    marginTop: 8,
  },
  contactBtn: {
    flex: 1,
    background: '#fff',
    border: '2px solid #2ecc71',
    color: '#2ecc71',
    padding: '10px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
  },
  nextButtonContainer: {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'center',
  },
  nextButton: {
    background: '#2ecc71',
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
