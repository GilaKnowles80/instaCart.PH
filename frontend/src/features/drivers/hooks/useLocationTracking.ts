import { useState, useEffect } from 'react';
import { driverService } from '../services/driver.service';

export const useLocationTracking = (isTrackingActive: boolean) => {
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  useEffect(() => {
    if (!isTrackingActive) return;

    if (!navigator.geolocation) {
      setTrackingError('Geolocation is completely unsupported by your active client architecture.');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, heading, speed } = position.coords;
      setCurrentCoords({ latitude, longitude });
      setTrackingError(null);

      // Async pipe stream to backend engine configurations
      driverService.streamLocation({ latitude, longitude, heading: heading ?? undefined, speed: speed ?? undefined });
    };

    const handleError = (error: GeolocationPositionError) => {
      setTrackingError(error.message || 'Failed to extract real-time tracking points.');
    };

    // Watch position fires continuously whenever the device location changes
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTrackingActive]);

  return { currentCoords, trackingError };
};
