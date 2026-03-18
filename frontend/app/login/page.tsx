'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.ok && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', (res as any).role || 'admin');
        window.location.href = '/dashboard';
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } catch {
      setError('حدث خطأ، تحقق من الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e1b4b' }}>نظام إدارة السنتر</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>تسجيل الدخول</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@edu.com"
              required
            />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 16, marginTop: 8 }}
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          مستخدم جديد؟{' '}
          <a href="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>إنشاء حساب</a>
        </p>
      </div>
    </div>
  );
}
