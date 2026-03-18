'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const emptyForm = { fullName: '', code: '', groupName: '', guardianPhone: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setStudents(await api.getStudents()); } catch {}
  }

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(s: any) {
    setEditId(s.id);
    setForm({ fullName: s.fullName, code: s.code, groupName: s.groupName || '', guardianPhone: s.guardianPhone || '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editId) {
        await api.updateStudent(editId, form);
      } else {
        await api.createStudent(form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل تريد حذف هذا الطالب؟')) return;
    try { await api.deleteStudent(id); load(); } catch {}
  }

  const filtered = students.filter(s =>
    s.fullName.includes(search) || s.code.includes(search) || (s.groupName || '').includes(search)
  );

  return (
    <div>
      <div className="page-header">
        <h1>الطلاب ({students.length})</h1>
        <button className="btn-primary" onClick={openCreate}>+ إضافة طالب</button>
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <input placeholder="بحث بالاسم أو الكود أو المجموعة..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>لا يوجد طلاب</p>
        ) : (
          <table>
            <thead>
              <tr><th>الاسم</th><th>الكود</th><th>المجموعة</th><th>هاتف ولي الأمر</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                  <td><span className="badge badge-blue">{s.code}</span></td>
                  <td>{s.groupName || '-'}</td>
                  <td>{s.guardianPhone || '-'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(s)}>تعديل</button>
                    <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleDelete(s.id)}>حذف</button>
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
            <h2>{editId ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>الاسم الكامل *</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الكود / الباركود *</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>المجموعة</label>
                <input value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>هاتف ولي الأمر</label>
                <input value={form.guardianPhone} onChange={e => setForm({ ...form, guardianPhone: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'جاري الحفظ...' : editId ? 'تحديث' : 'حفظ'}
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
