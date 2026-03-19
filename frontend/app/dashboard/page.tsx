'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

const statCards = [
  { key: 'students', label: 'إجمالي الطلاب', icon: '👨‍🎓', color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
  { key: 'present',  label: 'حضور اليوم',    icon: '✅',   color: '#00ff88', glow: 'rgba(0,255,136,0.3)' },
  { key: 'absent',   label: 'غياب اليوم',    icon: '❌',   color: '#ff4757', glow: 'rgba(255,71,87,0.3)'  },
  { key: 'score',    label: 'متوسط الدرجات', icon: '📊',   color: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
];

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

  const values: Record<string, any> = {
    students: analytics?.totalStudents ?? students.length,
    present:  analytics?.todayAttendance?.present ?? '—',
    absent:   analytics?.todayAttendance?.absent  ?? '—',
    score:    analytics?.averageScore ?? '—',
  };

  const attendanceData = (analytics?.attendanceLast7Days ?? []).map((d: any) => ({
    date: d.date?.slice(5), حاضر: d.present, غائب: d.absent,
  }));

  const revenueData = (analytics?.revenueLast6Months ?? []).map((d: any) => ({
    month: d.month?.slice(5), إيرادات: d.total,
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-2)', fontSize: 14 }}>جاري التحميل...</p>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <span style={{
          color: 'var(--text-2)', fontSize: 13,
          background: 'var(--surface-2)',
          padding: '6px 14px', borderRadius: 999,
          border: '1px solid var(--border)',
        }}>
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={s.key} className="card" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '18px 16px',
            borderColor: `${s.color}20`,
            animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
          }}>
            {/* Icon */}
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: `${s.color}15`,
              border: `1px solid ${s.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              boxShadow: `0 0 16px ${s.glow}`,
            }}>
              {s.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 26, fontWeight: 800,
                color: s.color,
                lineHeight: 1,
                textShadow: `0 0 20px ${s.glow}`,
              }}>
                {values[s.key]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-2)' }}>
            📈 الحضور — آخر 7 أيام
          </h2>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,20,36,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f0f4ff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
                <Bar dataKey="حاضر" fill="#00ff88" radius={[4,4,0,0]} />
                <Bar dataKey="غائب" fill="#ff4757" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>
              لا توجد بيانات بعد
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-2)' }}>
            💰 الإيرادات — آخر 6 أشهر
          </h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,20,36,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#f0f4ff' }}
                  cursor={{ stroke: 'rgba(99,102,241,0.3)' }}
                />
                <Line type="monotone" dataKey="إيرادات" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>
              لا توجد بيانات بعد
            </div>
          )}
        </div>
      </div>

      {/* Latest Students */}
      <div className="card">
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-2)' }}>
          👨‍🎓 آخر الطلاب المسجلين
        </h2>
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)', fontSize: 13 }}>
            لا يوجد طلاب بعد
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>المجموعة</th>
                  <th>الكود</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{s.fullName}</td>
                    <td style={{ color: 'var(--text-2)' }}>{s.groupName || '—'}</td>
                    <td><span className="badge badge-blue">{s.code}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
