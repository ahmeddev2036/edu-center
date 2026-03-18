'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ReportsPage() {
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [financeMonth, setFinanceMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [financeReport, setFinanceReport] = useState<any>(null);

  useEffect(() => {
    api.getAttendanceReport(attendanceDate).then(setAttendanceReport).catch(() => {});
  }, [attendanceDate]);

  useEffect(() => {
    api.getFinanceReport(financeMonth).then(setFinanceReport).catch(() => {});
  }, [financeMonth]);

  const totalFinance = financeReport?.totals?.reduce((acc: number, r: any) => acc + Number(r.total), 0) ?? 0;

  return (
    <div>
      <div className="page-header">
        <h1>التقارير</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Attendance Report */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>تقرير الحضور اليومي</h2>
            <input
              type="date"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>
          {attendanceReport ? (
            <div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{
                  flex: 1, textAlign: 'center', padding: 16,
                  background: '#d1fae5', borderRadius: 12,
                }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#059669' }}>{attendanceReport.present}</div>
                  <div style={{ fontSize: 13, color: '#065f46' }}>حاضر</div>
                </div>
                <div style={{
                  flex: 1, textAlign: 'center', padding: 16,
                  background: '#fee2e2', borderRadius: 12,
                }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#ef4444' }}>{attendanceReport.absent}</div>
                  <div style={{ fontSize: 13, color: '#991b1b' }}>غائب</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
                التاريخ: {new Date(attendanceReport.date).toLocaleDateString('ar-EG')}
              </div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>لا توجد بيانات</p>
          )}
        </div>

        {/* Finance Report */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>التقرير المالي الشهري</h2>
            <input
              type="month"
              value={financeMonth}
              onChange={e => setFinanceMonth(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>
          {financeReport ? (
            <div>
              <div style={{
                textAlign: 'center', padding: 16,
                background: '#dbeafe', borderRadius: 12, marginBottom: 16,
              }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#1e40af' }}>{totalFinance.toFixed(2)} ج.م</div>
                <div style={{ fontSize: 13, color: '#1e40af' }}>الإجمالي</div>
              </div>
              {financeReport.totals?.length > 0 && (
                <table>
                  <thead><tr><th>الفئة</th><th>الإجمالي</th></tr></thead>
                  <tbody>
                    {financeReport.totals.map((r: any) => (
                      <tr key={r.category}>
                        <td>{r.category}</td>
                        <td style={{ fontWeight: 600, color: '#059669' }}>{Number(r.total).toFixed(2)} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>لا توجد بيانات</p>
          )}
        </div>
      </div>
    </div>
  );
}
