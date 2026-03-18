'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function MediaPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', provider: 'youtube', sourceUrl: '', allowedGroup: '', downloadable: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setVideos(await api.getVideos()); } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.createVideo(form);
      setShowModal(false);
      setForm({ title: '', provider: 'youtube', sourceUrl: '', allowedGroup: '', downloadable: false });
      load();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  const providerIcon: Record<string, string> = { youtube: '▶️', vimeo: '🎬', local: '💾' };

  return (
    <div>
      <div className="page-header">
        <h1>الفيديوهات التعليمية</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ إضافة فيديو</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {videos.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا توجد فيديوهات</p>
          ) : (
            <table>
              <thead>
                <tr><th>العنوان</th><th>المصدر</th><th>المجموعة</th><th>قابل للتحميل</th></tr>
              </thead>
              <tbody>
                {videos.map((v: any) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.title}</td>
                    <td>{providerIcon[v.provider]} {v.provider}</td>
                    <td>{v.allowedGroup || 'الكل'}</td>
                    <td>
                      <span className={`badge ${v.downloadable ? 'badge-green' : 'badge-red'}`}>
                        {v.downloadable ? 'نعم' : 'لا'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>إضافة فيديو جديد</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>العنوان *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group">
                <label>المصدر</label>
                <select className="input" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="local">محلي</option>
                </select>
              </div>
              <div className="form-group"><label>رابط الفيديو *</label><input className="input" value={form.sourceUrl} onChange={e => setForm({ ...form, sourceUrl: e.target.value })} required /></div>
              <div className="form-group"><label>المجموعة المسموح لها</label><input className="input" value={form.allowedGroup} onChange={e => setForm({ ...form, allowedGroup: e.target.value })} placeholder="اتركه فارغاً للكل" /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="dl" checked={form.downloadable} onChange={e => setForm({ ...form, downloadable: e.target.checked })} style={{ width: 'auto' }} />
                <label htmlFor="dl" style={{ marginBottom: 0 }}>قابل للتحميل</label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
