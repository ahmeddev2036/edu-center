import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5',
      gap: 16,
    }}>
      <div style={{ fontSize: 64 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e1b4b' }}>الصفحة غير موجودة</h1>
      <p style={{ color: '#6b7280' }}>الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link href="/dashboard" style={{
        background: '#4f46e5',
        color: '#fff',
        padding: '10px 24px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
      }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}
