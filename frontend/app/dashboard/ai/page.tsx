'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function AiPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [smartReport, setSmartReport] = useState<any>(null);
  const [genForm, setGenForm] = useState({ subject: 'رياضيات', level: 'متوسط', count: 5 });
  const [generatedQuestions, setGeneratedQuestions] = useState<any>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getStudents().then(setStudents).catch(() => {});
    api.getSmartReport().then(setSmartReport).catch(() => {});
  }, []);

  async function analyzeStudent() {
    if (!selectedStudent) return;
    setLoading(l => ({ ...l, analyze: true }));
    const res = await api.analyzeStudent(selectedStudent).catch(() => null);
    setAnalysis(res);
    setLoading(l => ({ ...l, analyze: false }));
  }

  async function generateQuestions(e: React.FormEvent) {
    e.preventDefault();
    setLoading(l => ({ ...l, gen: true }));
    const res = await api.generateExamQuestions(genForm).catch(() => null);
    setGeneratedQuestions(res);
    setLoading(l => ({ ...l, gen: false }));
  }

  const riskColors: Record<string, string> = { low: '#059669', medium: '#d97706', high: '#ef4444' };
  const riskLabels: Record<string, string> = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع' };

  return (
    <div>
      <div className="page-header">
        <h1>مساعد الذكاء الاصطناعي</h1>
      </div>

      {smartReport && (
        <div className="card" style={{ marginBottom: 24, borderRight: '4px solid #4f46e5' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>التقرير الذكي الشامل</h2>
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            {[
              { label: 'إجمالي الطلاب', value: smartReport.summary?.totalStudents },
              { label: 'نسبة الحضور', value: `${smartReport.summary?.overallAttendanceRate}%` },
              { label: 'متوسط الدرجات', value: smartReport.summary?.avgScore },
              { label: 'إجمالي الإيرادات', value: `${smartReport.summary?.totalRevenue} ج.م` },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {smartReport.insights?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {smartReport.insights.map((ins: string, i: number) => (
                <div key={i} style={{ fontSize: 14, color: '#374151', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>{ins}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>تحليل أداء الطالب</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <select className="input" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ flex: 1 }}>
              <option value="">اختر طالباً...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
            <button className="btn btn-primary" onClick={analyzeStudent} disabled={!selectedStudent || loading.analyze}>
              {loading.analyze ? '...' : 'تحليل'}
            </button>
          </div>

          {analysis?.analysis && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5' }}>{analysis.analysis.attendanceRate}%</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>نسبة الحضور</div>
                </div>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed' }}>{analysis.analysis.avgScore}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>متوسط الدرجات</div>
                </div>
                <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: riskColors[analysis.analysis.riskLevel] }}>
                    {riskLabels[analysis.analysis.riskLevel]}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>مستوى الخطر</div>
                </div>
              </div>
              {analysis.analysis.insights?.map((ins: string, i: number) => (
                <div key={i} style={{ fontSize: 13, padding: '6px 10px', background: '#fef3c7', borderRadius: 6, marginBottom: 6 }}>{ins}</div>
              ))}
              {analysis.analysis.recommendations?.map((rec: string, i: number) => (
                <div key={i} style={{ fontSize: 13, padding: '6px 10px', background: '#d1fae5', borderRadius: 6, marginBottom: 6 }}>💡 {rec}</div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>توليد أسئلة امتحان</h2>
          <form onSubmit={generateQuestions} style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label>المادة</label>
              <select className="input" value={genForm.subject} onChange={e => setGenForm({ ...genForm, subject: e.target.value })}>
                {['رياضيات', 'علوم', 'عربي', 'إنجليزي', 'تاريخ', 'جغرافيا'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>المستوى</label>
              <select className="input" value={genForm.level} onChange={e => setGenForm({ ...genForm, level: e.target.value })}>
                {['سهل', 'متوسط', 'صعب'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>عدد الأسئلة</label>
              <input className="input" type="number" min={1} max={20} value={genForm.count} onChange={e => setGenForm({ ...genForm, count: +e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading.gen}>{loading.gen ? 'جاري التوليد...' : 'توليد'}</button>
          </form>

          {generatedQuestions && (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{generatedQuestions.note}</p>
              {generatedQuestions.questions?.map((q: any, i: number) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{i + 1}. {q.text}</div>
                  {q.choices && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      {q.choices.map((c: string) => (
                        <div key={c} style={{ fontSize: 12, padding: '4px 8px', background: c === q.correctAnswer ? '#d1fae5' : '#f3f4f6', borderRadius: 4, color: c === q.correctAnswer ? '#065f46' : '#374151' }}>
                          {c === q.correctAnswer ? '✓ ' : ''}{c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
