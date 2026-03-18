'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const emptyForm = { name: '', role: 'teacher', salaryMode: 'fixed', rate: '' };

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setStaff(await api.getStaff()); } catch {}
  }

  function openCreate() { setEditId(null); setForm(emptyForm); setError(''); setShowModal(true); }
  function openEdit(s: any) {
    setEditId(s.id);
    setForm({ name: s.name, role: s.role || 'teacher', salaryMode: s.salaryMode || 'fixed', rate: s.rate?.toString() || '' });
    setError(''); setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = { ...form, rate: form.rate ? Number(form.rate) : undefined };
      if (editId) await api.updateStaff(editId, data);
      else await api.createStaff(data);
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل تريد حذف هذا الموظف؟')) return;
    try { await api.deleteStaff(id); load(); } catch {}
  }

  const roleLabel: Record<string, string> = { teacher: 'مدرس', admin: 'إداري', staff: 'موظف' };
  const salaryLabel: Record<string, string> = { 'per-session': 'بالحصة', percentage: 'نسبة مئوية', fixed: 'راتب ثابت' };

  return (
    <div>
      <div className="page-header">
        <h1>الموظفون ({staff.length})</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ إضافة موظف</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {staff.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا يوجد موظفون</p>
          ) : (
            <table>
              <thead>
                <tr><th>الاسم</th><th>الدور</th><th>نظام الراتب</th><th>المعدل</th><th>إجراءات</th></tr>
              </thead>
              <tbody>
                {staff.map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-blue">{roleLabel[s.role] || s.role}</span></td>
                    <td>{salaryLabel[s.salaryMode] || s.salaryMode || '-'}</td>
                    <td>{s.rate ? `${s.rate} ج.م` : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(s)}>تعديل</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleDelete(s.id)}>حذف</button>
                      </div>
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
            <h2>{editId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>الاسم *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group">
                <label>الدور</label>
                <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="teacher">مدرس</option>
                  <option value="admin">إداري</option>
                  <option value="staff">موظف</option>
                </select>
              </div>
              <div className="form-group">
                <label>نظام الراتب</label>
                <select className="input" value={form.salaryMode} onChange={e => setForm({ ...form, salaryMode: e.target.value })}>
                  <option value="fixed">راتب ثابت</option>
                  <option value="per-session">بالحصة</option>
                  <option value="percentage">نسبة مئوية</option>
                </select>
              </div>
              <div className="form-group"><label>المعدل / الراتب</label><input className="input" type="number" min="0" step="0.01" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} /></div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'جاري الحفظ...' : editId ? 'تحديث' : 'حفظ'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
