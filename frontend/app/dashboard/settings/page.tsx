'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await api.updateSettings(settings).catch(() => {});
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="page-header">
        <h1>إعدادات السنتر</h1>
      </div>

      <div style={{ maxWidth: 640 }}>
        <form onSubmit={save}>
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>المعلومات الأساسية</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>اسم السنتر</label>
                <input className="input" value={settings.centerName || ''} onChange={e => setSettings({ ...settings, centerName: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>رقم الهاتف</label>
                <input className="input" value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} placeholder="01xxxxxxxxx" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>العنوان</label>
                <input className="input" value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>رابط الشعار (URL)</label>
                <input className="input" value={settings.logoUrl || ''} onChange={e => setSettings({ ...settings, logoUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>الإعدادات الإقليمية</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>العملة</label>
                <select className="input" value={settings.currency || 'EGP'} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>اللغة</label>
                <select className="input" value={settings.language || 'ar'} onChange={e => setSettings({ ...settings, language: e.target.value })}>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '10px 32px' }}>
              {loading ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
            </button>
            {saved && <span style={{ color: '#059669', fontWeight: 600 }}>✅ تم الحفظ بنجاح</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
