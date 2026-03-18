'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.getStudents().then(setStudents).catch(() => {});
    api.getStaff().then(setStaff).catch(() => {});
    api.getExams().then(setExams).catch(() => {});
    api.getAttendanceReport().then(setReport).catch(() => {});
  }, []);

  const stats = [
    { label: 'إجمالي الطلاب',   value: students.length,       icon: '👨‍🎓', color: '#4f46e5' },
    { label: 'الموظفون',         value: staff.length,          icon: '👥',   color: '#0891b2' },
    { label: 'الامتحانات',       value: exams.length,          icon: '📝',   color: '#7c3aed' },
    { label: 'حضور اليوم',       value: report?.present ?? '-', icon: '✅',   color: '#059669' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <span style={{ color: '#6b7280', fontSize: 14 }}>
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: s.color + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>آخر الطلاب المسجلين</h2>
          {students.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>لا يوجد طلاب بعد</p>
          ) : (
            <table>
              <thead><tr><th>الاسم</th><th>المجموعة</th><th>الكود</th></tr></thead>
              <tbody>
                {students.slice(0, 5).map((s: any) => (
                  <tr key={s.id}>
                    <td>{s.fullName}</td>
                    <td>{s.groupName || '-'}</td>
                    <td><span className="badge badge-blue">{s.code}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>تقرير الحضور اليوم</h2>
          {report ? (
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#059669' }}>{report.present}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>حاضر</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#ef4444' }}>{report.absent}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>غائب</div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>لا توجد بيانات حضور اليوم</p>
          )}
        </div>
      </div>
    </div>
  );
}
