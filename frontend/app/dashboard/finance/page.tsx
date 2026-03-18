'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function FinancePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [form, setForm] = useState({ studentId: '', amount: '', category: 'tuition', reference: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    api.getStudents().then(setStudents).catch(() => {});
  }, []);

  async function load() {
    try {
      const [p, s] = await Promise.all([api.getPayments(), api.getDailySummary()]);
      setPayments(p);
      setSummary(s);
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.recordPayment({ ...form, amount: Number(form.amount) });
      setShowModal(false);
      setForm({ studentId: '', amount: '', category: 'tuition', reference: '' });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const studentMap = Object.fromEntries(students.map(s => [s.id, s.fullName]));
  const totalToday = summary?.totals?.reduce((acc: number, r: any) => acc + Number(r.total), 0) ?? 0;
  const totalAll = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>المالية</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ تسجيل دفعة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{totalToday.toFixed(2)} ج.م</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>إجمالي اليوم</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }}>{totalAll.toFixed(2)} ج.م</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>الإجمالي الكلي</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0891b2' }}>{payments.length}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>عدد المعاملات</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>سجل المدفوعات</h2>
        {payments.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا توجد مدفوعات</p>
        ) : (
          <table>
            <thead>
              <tr><th>الطالب</th><th>المبلغ</th><th>الفئة</th><th>التاريخ</th><th>المرجع</th></tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{studentMap[p.studentId] || p.studentId}</td>
                  <td style={{ fontWeight: 600, color: '#059669' }}>{Number(p.amount).toFixed(2)} ج.م</td>
                  <td><span className="badge badge-blue">{p.category === 'tuition' ? 'رسوم دراسية' : p.category === 'exam' ? 'رسوم امتحان' : p.category}</span></td>
                  <td>{new Date(p.paidAt).toLocaleDateString('ar-EG')}</td>
                  <td>{p.reference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>تسجيل دفعة جديدة</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>الطالب *</label>
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">اختر طالب</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.fullName} - {s.code}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>المبلغ *</label>
                <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الفئة</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="tuition">رسوم دراسية</option>
                  <option value="exam">رسوم امتحان</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div className="form-group">
                <label>المرجع</label>
                <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
