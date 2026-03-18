'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ centerName: '', slug: '', ownerEmail: '', password: '', phone: '', plan: 'pro' });

  function slugify(v: string) {
    return v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const tRes = await fetch(`${BASE}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.centerName, slug: form.slug, ownerEmail: form.ownerEmail, phone: form.phone, plan: form.plan }),
      });
      if (!tRes.ok) { const d = await tRes.json(); throw new Error(d.message || 'فشل إنشاء الحساب'); }
      const uRes = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.ownerEmail, password: form.password }),
      });
      const uData = await uRes.json();
      if (uData.token) {
        localStorage.setItem('token', uData.token);
        localStorage.setItem('role', uData.role || 'admin');
      }
      setDone(true);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>مرحباً بك في EduFlow!</h1>
          <p style={{ color: '#6b7280', marginBottom: 32 }}>تم إنشاء حسابك بنجاح. لديك 14 يوم تجريبي مجاني.</p>
          <button onClick={() => router.push('/dashboard')} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            ابدأ الاستخدام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)', width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: '#1e1b4b' }}>إنشاء حساب جديد</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>14 يوم تجريبي مجاني — لا يلزم بطاقة ائتمان</p>
        </div>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
          <div className="form-group">
            <label>اسم السنتر *</label>
            <input className="input" value={form.centerName} onChange={e => setForm({ ...form, centerName: e.target.value, slug: slugify(e.target.value) })} placeholder="مثال: سنتر النجاح" required />
          </div>
          <div className="form-group">
            <label>رابط السنتر (slug) *</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', background: '#f3f4f6', color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>eduflow.app/</span>
              <input style={{ flex: 1, padding: '10px 12px', border: 'none', outline: 'none', fontSize: 14, minWidth: 0 }} value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="my-center" required />
            </div>
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني *</label>
            <input className="input" type="email" value={form.ownerEmail} onChange={e => setForm({ ...form, ownerEmail: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>كلمة المرور *</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={8} required />
          </div>
          <div className="form-group">
            <label>رقم الهاتف</label>
            <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" />
          </div>
          <div className="form-group">
            <label>الخطة</label>
            <select className="input" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
              <option value="trial">تجريبي (مجاني 14 يوم)</option>
              <option value="basic">أساسي — 99 ج.م/شهر</option>
              <option value="pro">احترافي — 199 ج.م/شهر</option>
              <option value="enterprise">مؤسسي — 499 ج.م/شهر</option>
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 14, margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب مجاناً'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
          لديك حساب؟ <a href="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>تسجيل الدخول</a>
        </p>
      </div>
    </div>
  );
}
