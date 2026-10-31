import { useState, useEffect, useCallback } from 'react';
import { driverService, DriverPayoutRecord } from '../services/driver.service';

export const useDriverPayouts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payouts, setPayouts] = useState<DriverPayoutRecord[]>([]);
  const [metrics, setMetrics] = useState({ totalEarnings: 0, balance: 0, activeDeliveriesCount: 0 });

  const fetchPayoutData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, historyData] = await Promise.all([
        driverService.getEarningsSummary(),
        driverService.getPayoutHistory(),
      ]);
      setMetrics(summaryData);
      setPayouts(historyData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync monetary data records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayoutData();
  }, [fetchPayoutData]);

  return { loading, error, payouts, metrics, refresh: fetchPayoutData };
};
