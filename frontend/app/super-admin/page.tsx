'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function SuperAdminPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    api.getSuperAdminDashboard().then(setDashboard).catch(() => {});
    api.getAllTenants().then(setTenants).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 32, direction: 'rtl' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 24 }}>🛡️ Super Admin Dashboard</h1>

      {dashboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'إجمالي السنترات', value: dashboard.totalTenants, color: '#4f46e5' },
            { label: 'السنترات النشطة', value: dashboard.activeTenants, color: '#059669' },
            { label: 'إجمالي المستخدمين', value: dashboard.totalUsers, color: '#0891b2' },
            { label: 'الإيرادات الشهرية', value: `${dashboard.totalRevenue} ج.م`, color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>السنترات المسجلة</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
              <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, color: '#6b7280' }}>الاسم</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, color: '#6b7280' }}>Slug</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, color: '#6b7280' }}>الخطة</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, color: '#6b7280' }}>الحالة</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, color: '#6b7280' }}>تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 8px', fontSize: 14, fontWeight: 600 }}>{t.name}</td>
                <td style={{ padding: '10px 8px', fontSize: 13, color: '#6b7280' }}>{t.slug}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: '#ede9fe', color: '#7c3aed' }}>{t.plan}</span>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: t.active ? '#d1fae5' : '#fee2e2', color: t.active ? '#065f46' : '#991b1b' }}>
                    {t.active ? 'نشط' : 'متوقف'}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', fontSize: 13, color: '#6b7280' }}>{new Date(t.createdAt).toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>لا توجد سنترات بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
