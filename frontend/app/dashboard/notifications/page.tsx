'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function NotificationsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ channel: 'whatsapp', recipient: '', template: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setLogs(await api.getNotificationLogs()); } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      await api.sendNotification(form);
      setSuccess('تم إرسال الإشعار بنجاح');
      setShowModal(false);
      setForm({ channel: 'whatsapp', recipient: '', template: '' });
      load();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  const channelIcon: Record<string, string> = { whatsapp: '💬', email: '📧', sms: '📱' };
  const statusBadge: Record<string, string> = { queued: 'badge-yellow', sent: 'badge-green', failed: 'badge-red' };
  const statusLabel: Record<string, string> = { queued: 'في الانتظار', sent: 'مُرسَل', failed: 'فشل' };

  return (
    <div>
      <div className="page-header">
        <h1>الإشعارات</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ إرسال إشعار</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>سجل الإشعارات</h2>
        <div className="table-wrap">
          {logs.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا توجد إشعارات</p>
          ) : (
            <table>
              <thead>
                <tr><th>القناة</th><th>المستلم</th><th>الرسالة</th><th>الحالة</th><th>التاريخ</th></tr>
              </thead>
              <tbody>
                {logs.map((l: any) => (
                  <tr key={l.id}>
                    <td>{channelIcon[l.channel]} {l.channel}</td>
                    <td>{l.recipient}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.template}</td>
                    <td><span className={`badge ${statusBadge[l.status] || 'badge-yellow'}`}>{statusLabel[l.status] || l.status}</span></td>
                    <td>{new Date(l.createdAt).toLocaleDateString('ar-EG')}</td>
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
            <h2>إرسال إشعار جديد</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>القناة</label>
                <select className="input" value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}>
                  <option value="whatsapp">واتساب</option>
                  <option value="email">بريد إلكتروني</option>
                  <option value="sms">رسالة نصية</option>
                </select>
              </div>
              <div className="form-group">
                <label>المستلم *</label>
                <input className="input" value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} placeholder="رقم الهاتف أو البريد" required />
              </div>
              <div className="form-group">
                <label>نص الرسالة *</label>
                <textarea className="input" rows={4} value={form.template} onChange={e => setForm({ ...form, template: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'جاري الإرسال...' : 'إرسال'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
