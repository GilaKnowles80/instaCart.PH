const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(method: string, path: string, body?: any, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const adminService = {
  getAllUsers: (token: string) => request('GET', '/auth/users', undefined, token),
  getComplianceRecords: (token: string) => request('GET', '/auth/compliance-records', undefined, token),
  approveCompliance: (id: string, token: string) => request('POST', `/auth/compliance-records/${id}/approve`, undefined, token),
  rejectCompliance: (id: string, reason: string, token: string) => request('POST', `/auth/compliance-records/${id}/reject`, { reason }, token),
  submitComplaint: (data: any, token: string) => request('POST', '/auth/complaints', data, token),
  getComplaints: (token: string) => request('GET', '/auth/complaints', undefined, token),
  resolveComplaint: (id: string, data: any, token: string) => request('POST', `/auth/complaints/${id}/resolve`, data, token),
  getAdminNotifications: (token: string) => request('GET', '/auth/admin-notifications', undefined, token),
  createAdminNotification: (data: any, token: string) => request('POST', '/auth/admin-notifications', data, token),
  markNotificationRead: (id: string, token: string) => request('POST', `/auth/admin-notifications/${id}/read`, undefined, token),
  requestChangeEmail: (newEmail: string, token: string) => request('POST', '/auth/request-change-email', { newEmail }, token),
  requestChangePassword: (token: string) => request('POST', '/auth/request-change-password', undefined, token),
};