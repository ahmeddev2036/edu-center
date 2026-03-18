'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', subject: '', teacherName: '', schedule: '', maxStudents: 30, monthlyFee: 0, active: true });
  const [loading, setLoading] = useState(false);

  const load = () => api.getGroups().then(setGroups).catch(() => {});
  useEffect(() => { load(); }, []);

  function openEdit(g: any) {
    setEditing(g);
    setForm({ name: g.name, subject: g.subject || '', teacherName: g.teacherName || '', schedule: g.schedule || '', maxStudents: g.maxStudents, monthlyFee: g.monthlyFee || 0, active: g.active });
    setShowForm(true);
  }

  function openNew() { setEditing(null); setForm({ name: '', subject: '', teacherName: '', schedule: '', maxStudents: 30, monthlyFee: 0, active: true }); setShowForm(true); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    editing ? await api.updateGroup(editing.id, form).catch(() => {}) : await api.createGroup(form).catch(() => {});
    setLoading(false); setShowForm(false); load();
  }

  async function del(id: string) {
    if (!confirm('حذف هذه المجموعة؟')) return;
    await api.deleteGroup(id); load();
  }

  return (
    <div>
      <div className="page-header">
        <h1>إدارة المجموعات</h1>
        <button className="btn-primary" onClick={openNew}>+ مجموعة جديدة</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{editing ? 'تعديل المجموعة' : 'مجموعة جديدة'}</h2>
          <form onSubmit={submit}>
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label>اسم المجموعة *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>المادة</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="form-group"><label>المدرس</label><input value={form.teacherName} onChange={e => setForm({ ...form, teacherName: e.target.value })} /></div>
              <div className="form-group"><label>مواعيد الحصص</label><input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="مثال: السبت 5م" /></div>
              <div className="form-group"><label>الحد الأقصى</label><input type="number" value={form.maxStudents} onChange={e => setForm({ ...form, maxStudents: +e.target.value })} /></div>
              <div className="form-group"><label>الرسوم الشهرية</label><input type="number" value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: +e.target.value })} /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} id="active" style={{ width: 'auto' }} />
              <label htmlFor="active" style={{ marginBottom: 0 }}>نشطة</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" type="submit" disabled={loading}>{loading ? '...' : 'حفظ'}</button>
              <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {groups.map(g => (
          <div key={g.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{g.name}</h3>
                {g.subject && <span style={{ fontSize: 12, color: '#6b7280' }}>{g.subject}</span>}
              </div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: g.active ? '#d1fae5' : '#fee2e2', color: g.active ? '#065f46' : '#991b1b' }}>
                {g.active ? 'نشطة' : 'متوقفة'}
              </span>
            </div>
            {g.teacherName && <div style={{ fontSize: 13, color: '#374151', marginBottom: 3 }}>👨‍🏫 {g.teacherName}</div>}
            {g.schedule && <div style={{ fontSize: 13, color: '#374151', marginBottom: 3 }}>🕐 {g.schedule}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: '#6b7280' }}>
              <span>👥 {g.maxStudents}</span>
              {g.monthlyFee > 0 && <span>💰 {g.monthlyFee} ج.م</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: '7px' }} onClick={() => openEdit(g)}>✏️ تعديل</button>
              <button className="btn-danger" style={{ flex: 1, fontSize: 12, padding: '7px' }} onClick={() => del(g.id)}>🗑 حذف</button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>
            لا توجد مجموعات بعد
          </div>
        )}
      </div>
    </div>
  );
}
