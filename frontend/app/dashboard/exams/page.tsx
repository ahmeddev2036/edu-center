'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', subject: '', scheduledAt: '' });
  const [resultForm, setResultForm] = useState({ studentId: '', score: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    api.getStudents().then(setStudents).catch(() => {});
  }, []);

  async function load() {
    try { setExams(await api.getExams()); } catch {}
  }

  async function openResults(exam: any) {
    setSelectedExam(exam);
    try { setResults(await api.getResults(exam.id)); } catch { setResults([]); }
    setShowResultModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createExam(form);
      setShowModal(false);
      setForm({ title: '', subject: '', scheduledAt: '' });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitResult(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedExam) return;
    setLoading(true);
    try {
      await api.submitResult(selectedExam.id, { studentId: resultForm.studentId, score: Number(resultForm.score) });
      setResults(await api.getResults(selectedExam.id));
      setResultForm({ studentId: '', score: '' });
    } catch {}
    setLoading(false);
  }

  const gradeColor = (grade: string) => {
    if (grade === 'ممتاز') return 'badge-green';
    if (grade === 'جيد جداً') return 'badge-blue';
    if (grade === 'جيد') return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <div>
      <div className="page-header">
        <h1>الامتحانات ({exams.length})</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ إضافة امتحان</button>
      </div>

      <div className="card">
        {exams.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا توجد امتحانات</p>
        ) : (
          <table>
            <thead>
              <tr><th>العنوان</th><th>المادة</th><th>الموعد</th><th>تاريخ الإنشاء</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {exams.map((e: any) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.title}</td>
                  <td>{e.subject || '-'}</td>
                  <td>{e.scheduledAt ? new Date(e.scheduledAt).toLocaleDateString('ar-EG') : '-'}</td>
                  <td>{new Date(e.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openResults(e)}>
                      النتائج
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>إضافة امتحان جديد</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>عنوان الامتحان *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>المادة</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>موعد الامتحان</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
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

      {showResultModal && selectedExam && (
        <div className="modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2>نتائج: {selectedExam.title}</h2>
            <form onSubmit={handleSubmitResult} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <select value={resultForm.studentId} onChange={e => setResultForm({ ...resultForm, studentId: e.target.value })} required style={{ flex: 2 }}>
                <option value="">اختر طالب</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
              <input type="number" min="0" max="100" placeholder="الدرجة" value={resultForm.score} onChange={e => setResultForm({ ...resultForm, score: e.target.value })} required style={{ flex: 1 }} />
              <button type="submit" className="btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>إضافة</button>
            </form>
            {results.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>لا توجد نتائج بعد</p>
            ) : (
              <table>
                <thead><tr><th>الطالب</th><th>الدرجة</th><th>التقدير</th></tr></thead>
                <tbody>
                  {results.map((r: any) => (
                    <tr key={r.id}>
                      <td>{r.student?.fullName || '-'}</td>
                      <td style={{ fontWeight: 700 }}>{r.score}</td>
                      <td><span className={`badge ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="btn-ghost" style={{ marginTop: 16, width: '100%' }} onClick={() => setShowResultModal(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
