'use client';
import { useState, useRef, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function QRPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const res = await api.qrScan(code.trim(), today);
    setResult(res);
    if (res.ok) {
      setHistory(prev => [{ ...res, time: new Date().toLocaleTimeString('ar-EG'), code }, ...prev.slice(0, 19)]);
    }
    setCode('');
    inputRef.current?.focus();
    // مسح النتيجة بعد 3 ثواني
    setTimeout(() => setResult(null), 3000);
  }

  return (
    <div>
      <div className="page-header">
        <h1>تسجيل الحضور بـ QR Code</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>امسح QR Code الطالب أو أدخل الكود يدوياً</p>
          <form onSubmit={scan}>
            <input
              ref={inputRef}
              className="input"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="كود الطالب..."
              style={{ fontSize: 18, textAlign: 'center', marginBottom: 12 }}
              autoComplete="off"
            />
            <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
              ✅ تسجيل الحضور
            </button>
          </form>

          {result && (
            <div style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              background: result.ok ? '#d1fae5' : '#fee2e2',
              color: result.ok ? '#065f46' : '#991b1b',
              fontSize: 16,
              fontWeight: 600,
            }}>
              {result.ok
                ? result.alreadyMarked
                  ? `✅ ${result.student?.fullName} — تم التسجيل مسبقاً`
                  : `🎉 ${result.student?.fullName} — تم تسجيل الحضور`
                : `❌ ${result.message}`}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>سجل اليوم ({history.length})</h2>
          {history.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>لم يتم تسجيل أي حضور بعد</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {history.map((h, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{h.student?.fullName}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{h.code}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{h.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
