'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/dashboard',               label: 'الرئيسية',         icon: '🏠' },
  { href: '/dashboard/students',      label: 'الطلاب',           icon: '👨‍🎓' },
  { href: '/dashboard/groups',        label: 'المجموعات',        icon: '👥' },
  { href: '/dashboard/attendance',    label: 'الحضور',           icon: '✅' },
  { href: '/dashboard/qr',            label: 'QR حضور',          icon: '📷' },
  { href: '/dashboard/schedule',      label: 'جدول الحصص',       icon: '📅' },
  { href: '/dashboard/exams',         label: 'الامتحانات',       icon: '📝' },
  { href: '/dashboard/finance',       label: 'المالية',          icon: '💰' },
  { href: '/dashboard/staff',         label: 'الموظفون',         icon: '🧑‍💼' },
  { href: '/dashboard/messages',      label: 'الرسائل',          icon: '💬' },
  { href: '/dashboard/media',         label: 'الفيديوهات',       icon: '🎬' },
  { href: '/dashboard/certificates',  label: 'الشهادات',         icon: '📄' },
  { href: '/dashboard/reports',       label: 'التقارير',         icon: '📊' },
  { href: '/dashboard/notifications', label: 'الإشعارات',        icon: '🔔' },
  { href: '/dashboard/settings',      label: 'الإعدادات',        icon: '⚙️' },
  { href: '/dashboard/users',         label: 'المستخدمون',       icon: '🔑' },
  { href: '/dashboard/ai',            label: 'الذكاء الاصطناعي', icon: '🤖' },
];

const roleLabel: Record<string, string> = {
  admin: 'مدير', teacher: 'مدرس', staff: 'موظف', student: 'طالب', parent: 'ولي أمر',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => { setRole(localStorage.getItem('role') || ''); }, []);

  // إغلاق الـ sidebar عند تغيير الصفحة
  useEffect(() => { setOpen(false); }, [pathname]);

  // منع scroll الـ body لما الـ sidebar مفتوح
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.href = '/login';
  }

  const sidebarContent = (
    <>
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, marginBottom: 2 }}>🎓</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>EduFlow</div>
          </div>
          {/* زر الإغلاق على الموبايل */}
          <button
            onClick={() => setOpen(false)}
            className="hamburger"
            style={{ display: 'none' }}
            id="sidebar-close"
            aria-label="إغلاق القائمة"
          >✕</button>
        </div>
        {role && (
          <div style={{ fontSize: 11, marginTop: 6, color: '#818cf8', background: 'rgba(129,140,248,0.15)', padding: '2px 8px', borderRadius: 999, display: 'inline-block' }}>
            {roleLabel[role] || role}
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', fontSize: 13.5,
              fontWeight: active ? 600 : 400,
              background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderRight: active ? '3px solid #818cf8' : '3px solid transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.75)',
              transition: 'background 0.15s',
            }}>
              <span style={{ fontSize: 17, minWidth: 22, textAlign: 'center' }}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={logout} style={{
          width: '100%', background: 'rgba(239,68,68,0.2)', color: '#fca5a5',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px', fontSize: 13,
        }}>
          🚪 تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Top bar للموبايل */}
      <div className="mobile-topbar">
        <span className="logo">🎓 EduFlow</span>
        <button className="hamburger" onClick={() => setOpen(true)} aria-label="فتح القائمة">☰</button>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        {/* زر إغلاق داخل الـ sidebar على الموبايل */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '8px 16px 0' }}>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 20, padding: '4px', display: 'none' }}
            id="close-btn"
          >✕</button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
