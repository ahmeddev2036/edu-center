'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function CertificatesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [form, setForm] = useState({ studentName: '', examTitle: '', score: '', grade: 'ممتاز' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStudents().then(setStudents).catch(() => {});
    api.getExams().then(setExams).catch(() => {});
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.generateCertificate({
        studentName: form.studentName,
        examTitle: form.examTitle,
        score: Number(form.score),
        grade: form.grade,
      });
      if (res.ok && res.pdfBase64) {
        // تحميل الـ PDF
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${res.pdfBase64}`;
        link.download = `certificate-${Date.now()}.pdf`;
        link.click();
        setSuccess('تم توليد الشهادة بنجاح');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const grades = ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'];

  return (
    <div>
      <div className="page-header">
        <h1>الشهادات</h1>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>توليد شهادة تقدير</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>اسم الطالب *</label>
              <input
                value={form.studentName}
                onChange={e => setForm({ ...form, studentName: e.target.value })}
                placeholder="أو اختر من القائمة أدناه"
                required
              />
              {students.length > 0 && (
                <select
                  style={{ marginTop: 8 }}
                  onChange={e => setForm({ ...form, studentName: e.target.value })}
                  value=""
                >
                  <option value="">اختر طالب...</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.fullName}>{s.fullName}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>عنوان الامتحان *</label>
              <input
                value={form.examTitle}
                onChange={e => setForm({ ...form, examTitle: e.target.value })}
                placeholder="أو اختر من القائمة أدناه"
                required
              />
              {exams.length > 0 && (
                <select
                  style={{ marginTop: 8 }}
                  onChange={e => setForm({ ...form, examTitle: e.target.value })}
                  value=""
                >
                  <option value="">اختر امتحان...</option>
                  {exams.map((ex: any) => (
                    <option key={ex.id} value={ex.title}>{ex.title}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>الدرجة *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={e => setForm({ ...form, score: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>التقدير</label>
              <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'جاري التوليد...' : '📄 توليد وتحميل الشهادة'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>معلومات</h2>
          <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 2 }}>
            <p>• يتم توليد الشهادة بصيغة PDF</p>
            <p>• تحتوي على اسم الطالب والامتحان والدرجة والتقدير</p>
            <p>• يتم تحميلها تلقائياً بعد التوليد</p>
            <p>• يمكن اختيار الطالب والامتحان من القوائم المنسدلة</p>
          </div>
          <div style={{ marginTop: 24, padding: 16, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 13, color: '#0369a1', fontWeight: 600 }}>نظام التقديرات:</div>
            <div style={{ fontSize: 13, color: '#0369a1', marginTop: 8, lineHeight: 2 }}>
              <div>90 - 100 → ممتاز</div>
              <div>80 - 89 → جيد جداً</div>
              <div>70 - 79 → جيد</div>
              <div>60 - 69 → مقبول</div>
              <div>أقل من 60 → ضعيف</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
