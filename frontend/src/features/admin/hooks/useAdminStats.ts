import { useEffect, useState } from 'react';

export const useAdminStats = () => {
  const [stats, setStats] = useState({ totalOrders: 0, platformCommission: 0, loading: true });

  useEffect(() => {
    const timer = window.setTimeout(() => setStats({ totalOrders: 142, platformCommission: 4850.5, loading: false }), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return stats;
};
