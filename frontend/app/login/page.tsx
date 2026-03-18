'use client';
import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'بيانات الدخول غير صحيحة'); return; }
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'admin');
        localStorage.setItem('email', data.email || email);
        window.location.href = '/dashboard';
      } else {
        setError('حدث خطأ غير متوقع — حاول مرة أخرى');
      }
    } catch {
      setError('تعذر الاتصال بالخادم — تحقق من الاتصال بالإنترنت');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)', direction: 'rtl', padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 40px)',
        width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>EduFlow</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>نظام إدارة السنتر التعليمي</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: '#374151' }}>البريد الإلكتروني</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@edu.com" required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#4f46e5')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: '#374151' }}>كلمة المرور</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#4f46e5')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', fontSize: 16, fontWeight: 700,
            background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
            border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          <p style={{ margin: '0 0 8px' }}>
            مستخدم جديد؟{' '}
            <a href="/onboarding" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>إنشاء حساب مجاني</a>
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
            بوابة ولي الأمر:{' '}
            <a href="/parent" style={{ color: '#4f46e5', textDecoration: 'none' }}>اضغط هنا</a>
          </p>
        </div>
      </div>
    </div>
  );
}
