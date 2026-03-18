'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function ParentPortalPage() {
  const [code, setCode] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await api.getParentView(code.trim());
    setLoading(false);
    if (res.ok) {
      setData(res.student);
    } else {
      setError('الكود غير صحيح، تأكد من كود ابنك/ابنتك');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>بوابة ولي الأمر</h1>
          <p style={{ color: '#6b7280', marginTop: 8 }}>أدخل كود الطالب لمتابعة بياناته</p>
        </div>

        {!data ? (
          <div className="card">
            <form onSubmit={lookup}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>كود الطالب</label>
                <input
                  className="input"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="أدخل الكود..."
                  required
                  style={{ fontSize: 18, textAlign: 'center' }}
                />
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 12 }}>{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: 12 }}>
                {loading ? 'جاري البحث...' : 'عرض البيانات'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#4f46e520', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 12px' }}>👨‍🎓</div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{data.fullName}</h2>
              <span className="badge badge-blue">{data.code}</span>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>المجموعة</span>
                <span style={{ fontWeight: 600 }}>{data.groupName || 'غير محدد'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>رقم ولي الأمر</span>
                <span style={{ fontWeight: 600 }}>{data.guardianPhone || 'غير مسجل'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#6b7280' }}>تاريخ التسجيل</span>
                <span style={{ fontWeight: 600 }}>{new Date(data.createdAt).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
            <button className="btn" style={{ width: '100%', marginTop: 16 }} onClick={() => { setData(null); setCode(''); }}>
              بحث عن طالب آخر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
