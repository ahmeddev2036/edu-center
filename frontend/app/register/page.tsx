'use client';
import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('كلمتا المرور غير متطابقتين'); return; }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'admin');
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e1b4b' }}>نظام إدارة السنتر</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>إنشاء حساب جديد</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14, textAlign: 'right',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@gmail.com" required />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل" required />
          </div>
          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="أعد كتابة كلمة المرور" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 16, marginTop: 8 }}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          لديك حساب بالفعل؟{' '}
          <a href="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>تسجيل الدخول</a>
        </p>

        <div style={{
          marginTop: 20, padding: '12px 14px', background: '#f0f9ff',
          borderRadius: 8, border: '1px solid #bae6fd', fontSize: 13, color: '#0369a1', textAlign: 'right',
        }}>
          ملاحظة: التسجيل متاح فقط للمستخدم الأول (مدير النظام). بعد ذلك يضيف المدير المستخدمين الآخرين.
        </div>
      </div>
    </div>
  );
}
