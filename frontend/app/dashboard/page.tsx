'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAnalytics().catch(() => null),
      api.getStudents().catch(() => []),
    ]).then(([a, s]) => { setAnalytics(a); setStudents(s); setLoading(false); });
  }, []);

  const stats = [
    { label: 'إجمالي الطلاب', value: analytics?.totalStudents ?? students.length, icon: '👨‍🎓', color: '#4f46e5' },
    { label: 'حضور اليوم',    value: analytics?.todayAttendance?.present ?? '-',  icon: '✅',   color: '#059669' },
    { label: 'غياب اليوم',    value: analytics?.todayAttendance?.absent ?? '-',   icon: '❌',   color: '#ef4444' },
    { label: 'متوسط الدرجات', value: analytics?.averageScore ?? '-',              icon: '📊',   color: '#7c3aed' },
  ];

  const attendanceData = (analytics?.attendanceLast7Days ?? []).map((d: any) => ({
    date: d.date?.slice(5), حاضر: d.present, غائب: d.absent,
  }));

  const revenueData = (analytics?.revenueLast6Months ?? []).map((d: any) => ({
    month: d.month?.slice(5), إيرادات: d.total,
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 40 }}>⏳</div>
      <p style={{ color: '#6b7280' }}>جاري التحميل...</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <span style={{ color: '#6b7280', fontSize: 13 }}>
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>الحضور — آخر 7 أيام</h2>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="حاضر" fill="#059669" radius={[4,4,0,0]} />
                <Bar dataKey="غائب" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>لا توجد بيانات بعد</p>}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>الإيرادات — آخر 6 أشهر</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="إيرادات" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>لا توجد بيانات بعد</p>}
        </div>
      </div>

      {/* آخر الطلاب */}
      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>آخر الطلاب المسجلين</h2>
        {students.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا يوجد طلاب بعد</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>الاسم</th><th>المجموعة</th><th>الكود</th></tr></thead>
              <tbody>
                {students.slice(0, 5).map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                    <td>{s.groupName || '-'}</td>
                    <td><span className="badge badge-blue">{s.code}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
