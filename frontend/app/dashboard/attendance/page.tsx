'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getStudents().then(setStudents).catch(() => {});
  }, []);

  useEffect(() => {
    api.getAttendanceBySession(date).then(setRecords).catch(() => {});
  }, [date]);

  const markedIds = new Set(records.map((r: any) => r.student?.id));

  async function mark(studentId: string, present: boolean) {
    setLoading(true);
    try {
      await api.markAttendance({ studentId, sessionDate: date, present });
      const updated = await api.getAttendanceBySession(date);
      setRecords(updated);
      setMsg(present ? 'تم تسجيل الحضور' : 'تم تسجيل الغياب');
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
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ width: 'auto' }}
        />
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#059669' }}>{presentCount}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>حاضر</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#ef4444' }}>{absentCount}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>غائب</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#6b7280' }}>{students.length - markedIds.size}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>لم يُسجَّل</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>الطالب</th><th>المجموعة</th><th>الكود</th><th>الحالة</th><th>إجراء</th></tr>
          </thead>
          <tbody>
            {students.map((s: any) => {
              const rec = records.find((r: any) => r.student?.id === s.id);
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                  <td>{s.groupName || '-'}</td>
                  <td><span className="badge badge-blue">{s.code}</span></td>
                  <td>
                    {rec ? (
                      <span className={`badge ${rec.present ? 'badge-green' : 'badge-red'}`}>
                        {rec.present ? 'حاضر' : 'غائب'}
                      </span>
                    ) : (
                      <span className="badge badge-yellow">لم يُسجَّل</span>
                    )}
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn-success"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => mark(s.id, true)}
                      disabled={loading}
                    >
                      حاضر
                    </button>
                    <button
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => mark(s.id, false)}
                      disabled={loading}
                    >
                      غائب
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
