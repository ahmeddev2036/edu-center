'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const ROLES = [
  { value: 'admin', label: 'مدير' },
  { value: 'teacher', label: 'مدرس' },
  { value: 'staff', label: 'موظف' },
  { value: 'student', label: 'طالب' },
  { value: 'parent', label: 'ولي أمر' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'teacher' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = () =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()).then(setUsers).catch(() => {});

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.createUser(form.email, form.password, form.role);
      setMsg('تم إنشاء المستخدم بنجاح');
      setShowForm(false);
      setForm({ email: '', password: '', role: 'teacher' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err: any) { setError(err.message || 'فشل إنشاء المستخدم'); }
    setLoading(false);
  }

  const roleLabel = (r: string) => ROLES.find(x => x.value === r)?.label || r;
  const roleColor: Record<string, string> = {
    admin: '#4f46e5', teacher: '#059669', staff: '#0891b2', student: '#7c3aed', parent: '#d97706',
  };

  return (
    <div>
      <div className="page-header">
        <h1>إدارة المستخدمين</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ مستخدم جديد'}
        </button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>إضافة مستخدم جديد</h2>
          <form onSubmit={submit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>البريد الإلكتروني *</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>كلمة المرور *</label>
                <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={8} required />
              </div>
              <div className="form-group">
                <label>الدور</label>
                <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>{loading ? '...' : 'حفظ'}</button>
              </div>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>البريد الإلكتروني</th><th>الدور</th><th>تاريخ الإنشاء</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>لا يوجد مستخدمون</td></tr>
              ) : users.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{u.email}</td>
                  <td>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: (roleColor[u.role] || '#6b7280') + '20', color: roleColor[u.role] || '#6b7280', fontWeight: 600 }}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
