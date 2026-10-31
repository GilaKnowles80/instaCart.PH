import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';

export function useAdminMonitoring(token: string) {
  const [users, setUsers] = useState<any[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers(token);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadComplianceRecords = useCallback(async () => {
    try {
      const data = await adminService.getComplianceRecords(token);
      setComplianceRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance records');
    }
  }, [token]);

  const loadComplaints = useCallback(async () => {
    try {
      const data = await adminService.getComplaints(token);
      setComplaints(data.complaints || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load complaints');
    }
  }, [token]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await adminService.getAdminNotifications(token);
      setNotifications(data.notifications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUsers();
      loadComplianceRecords();
      loadComplaints();
      loadNotifications();
    }
  }, [token, loadUsers, loadComplianceRecords, loadComplaints, loadNotifications]);

  const refresh = useCallback(() => {
    loadUsers();
    loadComplianceRecords();
    loadComplaints();
    loadNotifications();
  }, [loadUsers, loadComplianceRecords, loadComplaints, loadNotifications]);

  return {
    users,
    complianceRecords,
    complaints,
    notifications,
    loading,
    error,
    refresh,
    loadUsers,
    loadComplianceRecords,
    loadComplaints,
    loadNotifications,
  };
}