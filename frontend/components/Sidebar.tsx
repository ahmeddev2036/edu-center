'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/dashboard',               label: 'الرئيسية',         icon: '⬡',  emoji: '🏠' },
  { href: '/dashboard/students',      label: 'الطلاب',           icon: '⬡',  emoji: '👨‍🎓' },
  { href: '/dashboard/groups',        label: 'المجموعات',        icon: '⬡',  emoji: '👥' },
  { href: '/dashboard/attendance',    label: 'الحضور',           icon: '⬡',  emoji: '✅' },
  { href: '/dashboard/qr',            label: 'QR حضور',          icon: '⬡',  emoji: '📷' },
  { href: '/dashboard/schedule',      label: 'جدول الحصص',       icon: '⬡',  emoji: '📅' },
  { href: '/dashboard/exams',         label: 'الامتحانات',       icon: '⬡',  emoji: '📝' },
  { href: '/dashboard/finance',       label: 'المالية',          icon: '⬡',  emoji: '💰' },
  { href: '/dashboard/staff',         label: 'الموظفون',         icon: '⬡',  emoji: '🧑‍💼' },
  { href: '/dashboard/messages',      label: 'الرسائل',          icon: '⬡',  emoji: '💬' },
  { href: '/dashboard/media',         label: 'الفيديوهات',       icon: '⬡',  emoji: '🎬' },
  { href: '/dashboard/certificates',  label: 'الشهادات',         icon: '⬡',  emoji: '📄' },
  { href: '/dashboard/reports',       label: 'التقارير',         icon: '⬡',  emoji: '📊' },
  { href: '/dashboard/notifications', label: 'الإشعارات',        icon: '⬡',  emoji: '🔔' },
  { href: '/dashboard/settings',      label: 'الإعدادات',        icon: '⬡',  emoji: '⚙️' },
  { href: '/dashboard/users',         label: 'المستخدمون',       icon: '⬡',  emoji: '🔑' },
  { href: '/dashboard/ai',            label: 'الذكاء الاصطناعي', icon: '⬡',  emoji: '🤖' },
];

const roleLabel: Record<string, string> = {
  admin: 'مدير', teacher: 'مدرس', staff: 'موظف', student: 'طالب', parent: 'ولي أمر',
};

const roleColor: Record<string, string> = {
  admin: '#6366f1', teacher: '#00d4ff', staff: '#00ff88', student: '#a855f7', parent: '#ffa502',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('role') || '');
    setEmail(localStorage.getItem('email') || '');
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

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

  const neonColor = roleColor[role] || '#6366f1';

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <span className="logo">✦ EduFlow</span>
        <button className="hamburger" onClick={() => setOpen(true)} aria-label="فتح القائمة">
          ☰
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar${open ? ' open' : ''}`}>

        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow bg */}
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 100, height: 100,
            background: `radial-gradient(circle, ${neonColor}30 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38,
                background: `linear-gradient(135deg, #6366f1, #a855f7)`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
                boxShadow: `0 0 16px rgba(99,102,241,0.5)`,
                flexShrink: 0,
              }}>🎓</div>
              <div>
                <div style={{
                  fontWeight: 800, fontSize: 15,
                  background: 'linear-gradient(135deg, #f0f4ff, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>EduFlow</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>2036 Edition</div>
              </div>
            </div>
            {/* Close btn mobile */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14, padding: '6px 8px',
                borderRadius: 8, cursor: 'pointer',
                display: 'none',
              }}
              className="sidebar-close-btn"
              aria-label="إغلاق"
            >✕</button>
          </div>

          {/* Role badge */}
          {role && (
            <div style={{
              marginTop: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `${neonColor}20`,
                border: `1px solid ${neonColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12,
              }}>👤</div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
                  {email ? email.split('@')[0] : 'مستخدم'}
                </div>
                <div style={{
                  fontSize: 10, marginTop: 2,
                  color: neonColor,
                  background: `${neonColor}15`,
                  padding: '1px 7px', borderRadius: 999,
                  border: `1px solid ${neonColor}30`,
                  display: 'inline-block',
                }}>
                  {roleLabel[role] || role}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {links.map((link, i) => {
            const active = pathname === link.href ||
              (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  background: active
                    ? 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))'
                    : 'transparent',
                  borderRight: active ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                {/* Active glow dot */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    right: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 2, height: '60%',
                    background: 'linear-gradient(180deg, #6366f1, #a855f7)',
                    borderRadius: 2,
                    boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                  }} />
                )}
                <span style={{
                  fontSize: 16,
                  minWidth: 22,
                  textAlign: 'center',
                  filter: active ? 'none' : 'grayscale(0.3)',
                  transition: 'filter 0.2s',
                }}>{link.emoji}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {active && (
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#6366f1',
                    boxShadow: '0 0 6px #6366f1',
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              background: 'rgba(255,71,87,0.1)',
              color: '#ff6b81',
              border: '1px solid rgba(255,71,87,0.2)',
              borderRadius: 10,
              padding: '10px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,71,87,0.2)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(255,71,87,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,71,87,0.1)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            🚪 تسجيل الخروج
          </button>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            EduFlow v2036 ✦
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
