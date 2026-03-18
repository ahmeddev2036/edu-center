'use client';
import Link from 'next/link';

const plans = [
  { name: 'أساسي', price: 99, period: 'شهرياً', features: ['حتى 100 طالب', 'إدارة الحضور', 'الامتحانات', 'التقارير الأساسية'], color: '#4f46e5' },
  { name: 'احترافي', price: 199, period: 'شهرياً', features: ['حتى 500 طالب', 'كل مميزات الأساسي', 'QR Code', 'بوابة ولي الأمر', 'رسائل', 'تقارير PDF'], color: '#7c3aed', recommended: true },
  { name: 'مؤسسي', price: 499, period: 'شهرياً', features: ['طلاب غير محدودين', 'كل المميزات', 'White Label', 'دعم مخصص', 'AI تحليل'], color: '#0891b2' },
];

const features = [
  { icon: '👨‍🎓', title: 'إدارة الطلاب', desc: 'تسجيل وتتبع كل بيانات الطلاب بسهولة' },
  { icon: '✅', title: 'الحضور الذكي', desc: 'تسجيل الحضور بـ QR Code أو يدوياً' },
  { icon: '📝', title: 'الامتحانات', desc: 'إنشاء وإدارة الامتحانات وتتبع النتائج' },
  { icon: '💰', title: 'المالية', desc: 'تتبع المدفوعات والرسوم والتقارير المالية' },
  { icon: '📊', title: 'Analytics', desc: 'رسوم بيانية وتحليلات شاملة للأداء' },
  { icon: '🔔', title: 'الإشعارات', desc: 'تذكيرات تلقائية عبر WhatsApp والبريد' },
  { icon: '👥', title: 'المجموعات', desc: 'تنظيم الطلاب في مجموعات ومستويات' },
  { icon: '📅', title: 'جدول الحصص', desc: 'جدول أسبوعي منظم لكل المجموعات' },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', direction: 'rtl', background: '#fff' }}>
      {/* Navbar */}
      <nav style={{ background: '#1e1b4b', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>🎓 EduFlow</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14 }}>المميزات</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14 }}>الأسعار</a>
          <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8 }}>تسجيل الدخول</Link>
          <Link href="/onboarding" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, background: '#4f46e5', padding: '8px 16px', borderRadius: 8 }}>ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', padding: '80px 40px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>
          نظام إدارة السنتر التعليمي<br />
          <span style={{ color: '#a5b4fc' }}>الأذكى في المنطقة</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 32px' }}>
          أدر سنترك التعليمي بكفاءة عالية — طلاب، حضور، امتحانات، مالية، وأكثر في مكان واحد
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/onboarding" style={{ background: '#fff', color: '#4f46e5', padding: '14px 32px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
            ابدأ تجربة مجانية 14 يوم
          </Link>
          <Link href="/login" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>
            تسجيل الدخول
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>لا يلزم بطاقة ائتمان • إلغاء في أي وقت</p>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 48, color: '#1e1b4b' }}>كل ما تحتاجه في مكان واحد</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#1e1b4b' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 48, color: '#1e1b4b' }}>أسعار شفافة وبسيطة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {plans.map(p => (
            <div key={p.name} style={{
              borderRadius: 20, padding: 32, border: p.recommended ? `2px solid ${p.color}` : '2px solid #e5e7eb',
              position: 'relative', background: p.recommended ? '#faf5ff' : '#fff',
              boxShadow: p.recommended ? '0 8px 32px rgba(124,58,237,0.15)' : 'none',
            }}>
              {p.recommended && (
                <div style={{ position: 'absolute', top: -12, right: 24, background: p.color, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
                  الأكثر شيوعاً
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: p.color, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#1e1b4b', marginBottom: 4 }}>
                {p.price} <span style={{ fontSize: 16, color: '#6b7280' }}>ج.م</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>{p.period}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#374151', display: 'flex', gap: 8 }}>
                    <span style={{ color: p.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10,
                background: p.recommended ? p.color : 'transparent',
                color: p.recommended ? '#fff' : p.color,
                border: `2px solid ${p.color}`,
                textDecoration: 'none', fontWeight: 700, fontSize: 15,
              }}>
                ابدأ الآن
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e1b4b', color: 'rgba(255,255,255,0.7)', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>🎓 EduFlow</div>
        <p style={{ fontSize: 14, margin: 0 }}>نظام إدارة السنتر التعليمي — جميع الحقوق محفوظة {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
