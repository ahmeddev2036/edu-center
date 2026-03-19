'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const OWNER_EMAIL = 'ATEXPLAINERSTUDIO@GMAIL.COM';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Tenant {
  id: string; name: string; slug: string;
  ownerEmail?: string; plan: string; active: boolean;
  trialEndsAt?: string; subscriptionEndsAt?: string; createdAt: string;
}
interface Stats { total: number; active: number; inactive: number; trial: number; expired: number; }
interface NotifLog { id: string; channel: string; recipient: string; template: string; status: string; createdAt: string; }

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized]   = useState(false);
  const [stats, setStats]             = useState<Stats | null>(null);
  const [tenants, setTenants]         = useState<Tenant[]>([]);
  const [notifs, setNotifs]           = useState<NotifLog[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [msg, setMsg]                 = useState('');
  const [tab, setTab]                 = useState<'tenants'|'broadcast'|'logs'>('tenants');

  // Broadcast state
  const [bcMessage, setBcMessage]     = useState('');
  const [bcChannel, setBcChannel]     = useState<'email'|'whatsapp'|'sms'>('email');
  const [bcLoading, setBcLoading]     = useState(false);
  const [bcResult, setBcResult]       = useState<any>(null);

  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    if (email.toUpperCase() !== OWNER_EMAIL) { router.push('/dashboard'); return; }
    setAuthorized(true);
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [s, t, n] = await Promise.all([
        fetch(`${API}/super-admin/stats`,         { headers: authHeaders() }).then(r => r.json()),
        fetch(`${API}/super-admin/tenants`,        { headers: authHeaders() }).then(r => r.json()),
        fetch(`${API}/super-admin/notifications`,  { headers: authHeaders() }).then(r => r.json()),
      ]);
      setStats(s);
      setTenants(Array.isArray(t) ? t : []);
      setNotifs(Array.isArray(n) ? n : []);
    } catch { /* silent */ }
    setLoading(false);
  }

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 4000); }

  async function extendSub(id: string, days: number) {
    const r = await fetch(`${API}/super-admin/tenants/${id}/extend`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ days }),
    });
    const d = await r.json();
    if (d.success) { flash(`✅ تم التمديد ${days} يوم`); loadData(); }
    else flash('❌ حدث خطأ');
  }

  async function toggleTenant(id: string, active: boolean) {
    await fetch(`${API}/super-admin/tenants/${id}/toggle`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ active }),
    });
    flash(active ? '✅ تم التفعيل' : '⛔ تم الإيقاف');
    loadData();
  }

  async function sendBroadcast() {
    if (!bcMessage.trim()) { flash('❌ اكتب الرسالة أولاً'); return; }
    setBcLoading(true); setBcResult(null);
    try {
      const r = await fetch(`${API}/super-admin/broadcast`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ message: bcMessage, channel: bcChannel }),
      });
      const d = await r.json();
      setBcResult(d);
      flash(`✅ تم الإرسال لـ ${d.sent} من ${d.total} عميل`);
      loadData();
    } catch { flash('❌ فشل الإرسال'); }
    setBcLoading(false);
  }

  function planBadge(plan: string) {
    const m: Record<string,string> = { trial:'badge-yellow', basic:'badge-blue', pro:'badge-purple', enterprise:'badge-green' };
    return m[plan] || 'badge-blue';
  }

  function trialStatus(t: Tenant) {
    const now = new Date();
    if (t.plan === 'trial' && t.trialEndsAt) {
      const end = new Date(t.trialEndsAt);
      if (now > end) return { label: 'منتهية', cls: 'badge-red' };
      return { label: `${Math.ceil((end.getTime()-now.getTime())/86400000)} يوم`, cls: 'badge-yellow' };
    }
    if (t.subscriptionEndsAt) {
      const end = new Date(t.subscriptionEndsAt);
      if (now > end) return { label: 'منتهي', cls: 'badge-red' };
      return { label: `${Math.ceil((end.getTime()-now.getTime())/86400000)} يوم`, cls: 'badge-green' };
    }
    return { label: '—', cls: 'badge-blue' };
  }

  function statusBadge(s: string) {
    const m: Record<string,string> = { sent:'badge-green', queued:'badge-yellow', failed:'badge-red' };
    return m[s] || 'badge-blue';
  }

  const filtered = tenants.filter(t =>
    t.name.includes(search) || t.slug.includes(search) || (t.ownerEmail||'').includes(search)
  );

  if (!authorized) return null;

  const tabStyle = (t: string) => ({
    padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: tab === t ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--glass)',
    color: tab === t ? '#fff' : 'var(--text-2)',
    border: `1px solid ${tab === t ? 'transparent' : 'var(--border)'}`,
    transition: 'all 0.2s',
  } as React.CSSProperties);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '28px 24px', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg,#6366f1,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 0 20px rgba(99,102,241,0.5)',
        }}>👑</div>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 800,
            background: 'linear-gradient(135deg,#f0f4ff,#818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>لوحة تحكم المالك</h1>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{OWNER_EMAIL} — EduFlow Super Admin</p>
        </div>
      </div>

      {msg && (
        <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'إجمالي', value: stats.total,    color: '#6366f1', icon: '🏢' },
                { label: 'نشط',    value: stats.active,   color: '#00ff88', icon: '✅' },
                { label: 'موقوف',  value: stats.inactive, color: '#ff4757', icon: '⛔' },
                { label: 'تجريبي', value: stats.trial,    color: '#ffa502', icon: '⏳' },
                { label: 'منتهي',  value: stats.expired,  color: '#a855f7', icon: '🔴' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button style={tabStyle('tenants')}   onClick={() => setTab('tenants')}>🏢 المستأجرون</button>
            <button style={tabStyle('broadcast')} onClick={() => setTab('broadcast')}>📢 إشعار العملاء</button>
            <button style={tabStyle('logs')}      onClick={() => setTab('logs')}>📋 سجل الإشعارات</button>
          </div>

          {/* ── Tab: Tenants ── */}
          {tab === 'tenants' && (
            <>
              <div style={{ marginBottom: 14 }}>
                <input placeholder="🔍 بحث..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 380 }} />
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>🏢 المستأجرون ({filtered.length})</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>الاسم</th><th>البريد</th><th>الخطة</th><th>الحالة</th><th>المتبقي</th><th>الإنشاء</th><th>إجراءات</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(t => {
                        const st = trialStatus(t);
                        return (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 600 }}>
                              {t.name}
                              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.slug}</div>
                            </td>
                            <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.ownerEmail || '—'}</td>
                            <td><span className={`badge ${planBadge(t.plan)}`}>{t.plan}</span></td>
                            <td><span className={`badge ${t.active ? 'badge-green' : 'badge-red'}`}>{t.active ? 'نشط' : 'موقوف'}</span></td>
                            <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                            <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{new Date(t.createdAt).toLocaleDateString('ar-EG')}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                <input type="number" defaultValue={30} min={1} id={`days-${t.id}`}
                                  style={{ width: 56, padding: '4px 7px', fontSize: 12 }} />
                                <button className="btn-primary" style={{ padding: '4px 9px', fontSize: 11 }}
                                  onClick={() => {
                                    const el = document.getElementById(`days-${t.id}`) as HTMLInputElement;
                                    extendSub(t.id, parseInt(el?.value || '30'));
                                  }}>تمديد</button>
                                <button className={t.active ? 'btn-danger' : 'btn-success'}
                                  style={{ padding: '4px 9px', fontSize: 11 }}
                                  onClick={() => toggleTenant(t.id, !t.active)}>
                                  {t.active ? 'إيقاف' : 'تفعيل'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>لا توجد نتائج</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="card" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 26 }}>📱</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>واتساب التجديد</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 12, marginTop: 2 }}>
                    العملاء يتواصلون على:{' '}
                    <a href="https://wa.me/201113955198" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#00ff88', fontWeight: 700 }}>01113955198</a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Broadcast ── */}
          {tab === 'broadcast' && (
            <div className="card" style={{ maxWidth: 600 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: 'var(--text)' }}>
                📢 إرسال إشعار لكل العملاء
              </h2>

              <div className="form-group">
                <label>القناة</label>
                <select value={bcChannel} onChange={e => setBcChannel(e.target.value as any)}>
                  <option value="email">📧 بريد إلكتروني</option>
                  <option value="whatsapp">📱 واتساب</option>
                  <option value="sms">💬 SMS</option>
                </select>
              </div>

              <div className="form-group">
                <label>نص الرسالة</label>
                <textarea
                  rows={5}
                  placeholder="اكتب رسالتك هنا... مثال: تم إطلاق تحديث جديد على EduFlow، يرجى تسجيل الدخول لتجربة المميزات الجديدة."
                  value={bcMessage}
                  onChange={e => setBcMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Quick templates */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>قوالب سريعة:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    'تم إطلاق تحديث جديد على EduFlow! سجّل دخولك لتجربة المميزات الجديدة.',
                    'تذكير: اشتراكك ينتهي قريباً. تواصل معنا على واتساب 01113955198 للتجديد.',
                    'مرحباً! نود إعلامك بأن النظام سيكون في صيانة مؤقتة. نعتذر عن أي إزعاج.',
                  ].map((t, i) => (
                    <button key={i} onClick={() => setBcMessage(t)}
                      style={{ padding: '5px 10px', fontSize: 11, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', textAlign: 'right', maxWidth: 280 }}>
                      {t.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={sendBroadcast} disabled={bcLoading}
                style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                {bcLoading ? '⏳ جاري الإرسال...' : `📢 إرسال لكل العملاء النشطين (${stats?.active ?? 0})`}
              </button>

              {bcResult && (
                <div className="alert alert-success" style={{ marginTop: 16 }}>
                  ✅ تم الإرسال لـ {bcResult.sent} من {bcResult.total} عميل
                  {bcResult.total - bcResult.sent > 0 && ` — ${bcResult.total - bcResult.sent} في قائمة الانتظار`}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Logs ── */}
          {tab === 'logs' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>📋 سجل الإشعارات ({notifs.length})</span>
                <button onClick={loadData} style={{ padding: '5px 12px', fontSize: 12, background: 'var(--glass)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                  🔄 تحديث
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>القناة</th><th>المستلم</th><th>الرسالة</th><th>الحالة</th><th>التاريخ</th></tr>
                  </thead>
                  <tbody>
                    {notifs.map(n => (
                      <tr key={n.id}>
                        <td>
                          <span className="badge badge-blue">
                            {n.channel === 'email' ? '📧' : n.channel === 'whatsapp' ? '📱' : '💬'} {n.channel}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{n.recipient}</td>
                        <td style={{ fontSize: 12, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.template}</td>
                        <td><span className={`badge ${statusBadge(n.status)}`}>{n.status}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{new Date(n.createdAt).toLocaleString('ar-EG')}</td>
                      </tr>
                    ))}
                    {notifs.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>لا توجد إشعارات بعد</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
