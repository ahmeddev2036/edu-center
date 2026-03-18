'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/dashboard',                label: 'الرئيسية',    icon: '🏠' },
  { href: '/dashboard/students',       label: 'الطلاب',      icon: '👨‍🎓' },
  { href: '/dashboard/attendance',     label: 'الحضور',      icon: '✅' },
  { href: '/dashboard/exams',          label: 'الامتحانات',  icon: '📝' },
  { href: '/dashboard/finance',        label: 'المالية',     icon: '💰' },
  { href: '/dashboard/staff',          label: 'الموظفون',    icon: '👥' },
  { href: '/dashboard/media',          label: 'الفيديوهات',  icon: '🎬' },
  { href: '/dashboard/certificates',   label: 'الشهادات',    icon: '📄' },
  { href: '/dashboard/reports',        label: 'التقارير',    icon: '📊' },
  { href: '/dashboard/notifications',  label: 'الإشعارات',   icon: '🔔' },
];

const roleLabel: Record<string, string> = {
  admin: 'مدير',
  teacher: 'مدرس',
  staff: 'موظف',
  student: 'طالب',
  parent: 'ولي أمر',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState('');

  useEffect(() => {
    setRole(localStorage.getItem('role') || '');
  }, []);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#1e1b4b',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🎓</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>نظام إدارة السنتر</div>
        {role && (
          <div style={{ fontSize: 12, marginTop: 4, color: '#818cf8', background: 'rgba(129,140,248,0.15)', padding: '2px 8px', borderRadius: 999, display: 'inline-block' }}>
            {roleLabel[role] || role}
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderRight: active ? '3px solid #818cf8' : '3px solid transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: 'rgba(239,68,68,0.2)',
            color: '#fca5a5',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8,
            padding: '10px',
            fontSize: 14,
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
