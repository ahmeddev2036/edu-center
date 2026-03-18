'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', groupName: '', teacherName: '', dayOfWeek: 'السبت', startTime: '09:00', endTime: '10:00', room: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.getSchedules().then(setSchedules).catch(() => {});
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await api.createSchedule(form).catch(() => {});
    setLoading(false);
    setShowForm(false);
    setForm({ title: '', groupName: '', teacherName: '', dayOfWeek: 'السبت', startTime: '09:00', endTime: '10:00', room: '' });
    load();
  }

  async function del(id: string) {
    if (!confirm('حذف هذه الحصة؟')) return;
    await api.deleteSchedule(id);
    load();
  }

  const byDay = DAYS.map(day => ({ day, items: schedules.filter(s => s.dayOfWeek === day) }));

  return (
    <div>
      <div className="page-header">
        <h1>جدول الحصص</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ إضافة حصة'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>حصة جديدة</h2>
          <form onSubmit={submit}>
            <div className="form-grid-2">
              <div className="form-group"><label>العنوان</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>المجموعة</label><input className="input" value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })} required /></div>
              <div className="form-group"><label>المدرس</label><input className="input" value={form.teacherName} onChange={e => setForm({ ...form, teacherName: e.target.value })} required /></div>
              <div className="form-group">
                <label>اليوم</label>
                <select className="input" value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}>
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group"><label>من</label><input className="input" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
              <div className="form-group"><label>إلى</label><input className="input" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
              <div className="form-group"><label>القاعة</label><input className="input" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} /></div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {byDay.filter(d => d.items.length > 0).map(({ day, items }) => (
          <div key={day} className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#4f46e5' }}>{day}</h3>
            {items.map(s => (
              <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{s.groupName} — {s.teacherName}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.startTime} - {s.endTime}{s.room ? ` | ${s.room}` : ''}</div>
                </div>
                <button onClick={() => del(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 4 }}>🗑</button>
              </div>
            ))}
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', padding: 32 }}>
            لا توجد حصص بعد — أضف أول حصة
          </div>
        )}
      </div>
    </div>
  );
}
