'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getStudents().then(setStudents).catch(() => {}); }, []);
  useEffect(() => { api.getAttendanceBySession(date).then(setRecords).catch(() => {}); }, [date]);

  const markedIds = new Set(records.map((r: any) => r.student?.id));

  async function mark(studentId: string, present: boolean) {
    setLoading(true);
    try {
      await api.markAttendance({ studentId, sessionDate: date, present });
      setRecords(await api.getAttendanceBySession(date));
      setMsg(present ? '✅ تم تسجيل الحضور' : '❌ تم تسجيل الغياب');
      setTimeout(() => setMsg(''), 2000);
    } catch {}
    setLoading(false);
  }

  const presentCount = records.filter((r: any) => r.present).length;
  const absentCount = records.filter((r: any) => !r.present).length;

  return (
    <div>
      <div className="page-header">
        <h1>تسجيل الحضور</h1>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 'auto', minWidth: 140 }} />
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'حاضر', value: presentCount, color: '#059669', bg: '#d1fae5' },
          { label: 'غائب', value: absentCount, color: '#ef4444', bg: '#fee2e2' },
          { label: 'لم يُسجَّل', value: students.length - markedIds.size, color: '#6b7280', bg: '#f3f4f6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '14px 8px', background: s.bg }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>الطالب</th><th>المجموعة</th><th>الحالة</th><th>إجراء</th></tr>
            </thead>
            <tbody>
              {students.map((s: any) => {
                const rec = records.find((r: any) => r.student?.id === s.id);
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                    <td>{s.groupName || '-'}</td>
                    <td>
                      {rec ? (
                        <span className={`badge ${rec.present ? 'badge-green' : 'badge-red'}`}>
                          {rec.present ? 'حاضر' : 'غائب'}
                        </span>
                      ) : <span className="badge badge-yellow">لم يُسجَّل</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-success" style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => mark(s.id, true)} disabled={loading}>✅</button>
                        <button className="btn-danger" style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => mark(s.id, false)} disabled={loading}>❌</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
