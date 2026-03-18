'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ senderName: 'الإدارة', senderRole: 'admin', recipientGroup: '', content: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.getMessages().then(setMessages).catch(() => {});
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await api.sendMessage(form).catch(() => {});
    setLoading(false);
    setShowForm(false);
    setForm({ senderName: 'الإدارة', senderRole: 'admin', recipientGroup: '', content: '' });
    load();
  }

  async function del(id: string) {
    await api.deleteMessage(id);
    load();
  }

  async function markRead(id: string) {
    await api.markMessageRead(id);
    load();
  }

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="page-header">
        <h1>الرسائل {unread > 0 && <span style={{ fontSize: 14, background: '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 8px', marginRight: 8 }}>{unread}</span>}</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ رسالة جديدة</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>إرسال رسالة</h2>
          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label>المرسل</label><input className="input" value={form.senderName} onChange={e => setForm({ ...form, senderName: e.target.value })} required /></div>
              <div><label>المجموعة (اتركه فارغاً للكل)</label><input className="input" value={form.recipientGroup} onChange={e => setForm({ ...form, recipientGroup: e.target.value })} placeholder="اسم المجموعة..." /></div>
            </div>
            <div>
              <label>نص الرسالة *</label>
              <textarea className="input" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? '...' : 'إرسال'}</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>لا توجد رسائل بعد</div>
        ) : messages.map(m => (
          <div key={m.id} className="card" style={{ borderRight: m.isRead ? '3px solid #e5e7eb' : '3px solid #4f46e5', opacity: m.isRead ? 0.8 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{m.senderName}</span>
                  <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>{m.senderRole}</span>
                  {m.recipientGroup && <span style={{ fontSize: 11, color: '#4f46e5', background: '#ede9fe', padding: '1px 6px', borderRadius: 4 }}>→ {m.recipientGroup}</span>}
                  {!m.isRead && <span style={{ fontSize: 11, color: '#fff', background: '#4f46e5', padding: '1px 6px', borderRadius: 4 }}>جديد</span>}
                </div>
                <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{m.content}</p>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>{new Date(m.createdAt).toLocaleString('ar-EG')}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginRight: 12 }}>
                {!m.isRead && <button onClick={() => markRead(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} title="تحديد كمقروء">✅</button>}
                <button onClick={() => del(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#ef4444' }} title="حذف">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
