'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ReportsPage() {
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [financeMonth, setFinanceMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [financeReport, setFinanceReport] = useState<any>(null);
  const [fullReport, setFullReport] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    api.getAttendanceReport(attendanceDate).then(setAttendanceReport).catch(() => {});
  }, [attendanceDate]);

  useEffect(() => {
    api.getFinanceReport(financeMonth).then(setFinanceReport).catch(() => {});
    api.getFullReport(financeMonth).then(setFullReport).catch(() => {});
  }, [financeMonth]);

  const totalFinance = financeReport?.totals?.reduce((acc: number, r: any) => acc + Number(r.total), 0) ?? 0;

  function printReport() {
    if (!fullReport) return;
    setPdfLoading(true);
    const content = `
      <html dir="rtl">
      <head><meta charset="utf-8"><title>تقرير شهر ${fullReport.month}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;direction:rtl}h1{color:#1e1b4b}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:right}.total{font-size:24px;font-weight:bold;color:#059669}</style>
      </head>
      <body>
        <h1>تقرير شهر ${fullReport.month}</h1>
        <p>تاريخ الإصدار: ${new Date(fullReport.generatedAt).toLocaleString('ar-EG')}</p>
        <hr/>
        <h2>ملخص</h2>
        <p>إجمالي الطلاب: <strong>${fullReport.totalStudents}</strong></p>
        <p>إجمالي الإيرادات: <span class="total">${Number(fullReport.totalRevenue).toFixed(2)} ج.م</span></p>
        <h2>تفاصيل الإيرادات</h2>
        <table><thead><tr><th>الفئة</th><th>الإجمالي</th></tr></thead><tbody>
        ${(fullReport.financeBreakdown || []).map((r: any) => `<tr><td>${r.category}</td><td>${Number(r.total).toFixed(2)} ج.م</td></tr>`).join('')}
        </tbody></table>
        <h2>حضور اليوم</h2>
        <p>حاضر: ${fullReport.todayAttendance?.present ?? 0} | غائب: ${fullReport.todayAttendance?.absent ?? 0}</p>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(content); w.document.close(); w.print(); }
    setPdfLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>التقارير</h1>
        <button className="btn btn-primary" onClick={printReport} disabled={pdfLoading || !fullReport}>
          🖨️ طباعة / PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>تقرير الحضور اليومي</h2>
            <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={{ width: 'auto' }} />
          </div>
          {attendanceReport ? (
            <div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: 16, background: '#d1fae5', borderRadius: 12 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#059669' }}>{attendanceReport.present}</div>
                  <div style={{ fontSize: 13, color: '#065f46' }}>حاضر</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: 16, background: '#fee2e2', borderRadius: 12 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#ef4444' }}>{attendanceReport.absent}</div>
                  <div style={{ fontSize: 13, color: '#991b1b' }}>غائب</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
                التاريخ: {new Date(attendanceReport.date).toLocaleDateString('ar-EG')}
              </div>
            </div>
          ) : <p style={{ color: '#9ca3af', textAlign: 'center' }}>لا توجد بيانات</p>}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>التقرير المالي الشهري</h2>
            <input type="month" value={financeMonth} onChange={e => setFinanceMonth(e.target.value)} style={{ width: 'auto' }} />
          </div>
          {financeReport ? (
            <div>
              <div style={{ textAlign: 'center', padding: 16, background: '#dbeafe', borderRadius: 12, marginBottom: 16 }}>
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
          ) : <p style={{ color: '#9ca3af', textAlign: 'center' }}>لا توجد بيانات</p>}
        </div>
      </div>

      {/* Full Report Summary */}
      {fullReport && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>ملخص شهر {fullReport.month}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }}>{fullReport.totalStudents}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>إجمالي الطلاب</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{Number(fullReport.totalRevenue).toFixed(0)} ج.م</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>إجمالي الإيرادات</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#0891b2' }}>{fullReport.todayAttendance?.present ?? 0}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>حضور اليوم</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
