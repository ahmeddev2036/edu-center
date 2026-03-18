const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ ok: boolean; token: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    request<{ ok: boolean; token: string; role: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: any }>('/auth/me'),

  // Students
  getStudents: () => request<any[]>('/students'),
  createStudent: (data: any) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: string, data: any) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) => request(`/students/${id}`, { method: 'DELETE' }),

  // Attendance
  markAttendance: (data: any) => request('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getAttendanceByStudent: (id: string) => request<any[]>(`/attendance/student/${id}`),
  getAttendanceBySession: (date: string) => request<any[]>(`/attendance/session/${date}`),

  // Exams
  getExams: () => request<any[]>('/exams'),
  createExam: (data: any) => request('/exams', { method: 'POST', body: JSON.stringify(data) }),
  getExam: (id: string) => request<any>(`/exams/${id}`),
  addQuestion: (examId: string, data: any) =>
    request(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(data) }),
  submitResult: (examId: string, data: any) =>
    request(`/exams/${examId}/results`, { method: 'POST', body: JSON.stringify(data) }),
  getResults: (examId: string) => request<any[]>(`/exams/${examId}/results`),

  // Finance
  getPayments: () => request<any[]>('/finance/payments'),
  recordPayment: (data: any) => request('/finance/payments', { method: 'POST', body: JSON.stringify(data) }),
  getDailySummary: (date?: string) =>
    request<any>(`/finance/summary/daily${date ? `?date=${date}` : ''}`),

  // Staff
  getStaff: () => request<any[]>('/staff'),
  createStaff: (data: any) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id: string) => request(`/staff/${id}`, { method: 'DELETE' }),

  // Media
  getVideos: () => request<any[]>('/media/videos'),
  createVideo: (data: any) => request('/media/videos', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  getAttendanceReport: (date?: string) =>
    request<any>(`/reports/attendance/daily${date ? `?date=${date}` : ''}`),
  getFinanceReport: (month?: string) =>
    request<any>(`/reports/finance/monthly${month ? `?month=${month}` : ''}`),

  // Notifications
  sendWhatsapp: (data: any) => request('/notifications/whatsapp', { method: 'POST', body: JSON.stringify(data) }),
  sendEmail: (data: any) => request('/notifications/email', { method: 'POST', body: JSON.stringify(data) }),
  sendSms: (data: any) => request('/notifications/sms', { method: 'POST', body: JSON.stringify(data) }),
  sendNotification: (data: any) => {
    const channel = data.channel || 'whatsapp';
    return request(`/notifications/${channel}`, { method: 'POST', body: JSON.stringify(data) });
  },
  getNotificationLogs: () => request<any[]>('/notifications/logs'),

  // Certificates
  generateCertificate: (data: { studentName: string; examTitle: string; score: number; grade: string }) =>
    request<{ ok: boolean; pdfBase64: string }>('/certificates/generate/base64', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Health
  health: () => request<any>('/health'),
};
