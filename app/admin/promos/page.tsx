'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Copy } from 'lucide-react';

interface PromoCode {
  _id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

const blank: { code: string; discountType: 'percent' | 'fixed'; discountValue: number; minOrder: number; maxUses: number; active: boolean; expiresAt: string } = {
  code: '', discountType: 'percent', discountValue: 10, minOrder: 0, maxUses: 100, active: true, expiresAt: '',
};

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch('/api/promo?admin=1').then(r => r.json()).then(d => { setPromos(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, code: form.code.toUpperCase() }),
    });
    setSaving(false);
    if (res.ok) { toast.success('Promo code created'); setShowForm(false); setForm(blank); load(); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch('/api/promo', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !active }) });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this promo code?')) return;
    await fetch('/api/promo', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    toast.success('Deleted'); load();
  };

  const copy = (code: string) => { navigator.clipboard.writeText(code); toast.success(`Copied: ${code}`); };

  const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' };
  const lbl = { fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MARKETING</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Promo Codes</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} /> CREATE CODE
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>New Promo Code</h2>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={lbl}>CODE</label>
                <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={inp} placeholder="SUMMER20" />
              </div>
              <div>
                <label style={lbl}>DISCOUNT TYPE</label>
                <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as 'percent' | 'fixed' }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>DISCOUNT VALUE</label>
                <input required type="number" min={1} value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: +e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>MIN ORDER ($)</label>
                <input type="number" min={0} value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: +e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>MAX USES</label>
                <input type="number" min={1} value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: +e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>EXPIRES AT</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={saving} style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 24px', border: 'none', cursor: 'pointer' }}>
                {saving ? 'SAVING…' : 'CREATE CODE'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ border: '1px solid #C4A882', background: 'none', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#6B5344', padding: '10px 24px', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading…</div>
        ) : promos.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', color: '#6B5344' }}>No promo codes yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8DFD0' }}>
                  {['CODE', 'DISCOUNT', 'MIN ORDER', 'USES', 'EXPIRES', 'STATUS', ''].map(h => (
                    <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#9B8578', textAlign: 'left', padding: '1rem 1rem 0.75rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', fontWeight: '600', color: '#1A0F0A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.code}
                        <button onClick={() => copy(p.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B8578' }}>
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#5C3317' }}>
                      {p.type === 'percent' ? `${p.value}%` : `$${p.value}`}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344' }}>
                      {p.minOrder > 0 ? `$${p.minOrder}` : '—'}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344' }}>
                      {p.usedCount} / {p.maxUses}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>
                      {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => toggle(p._id, p.active)}
                        style={{ backgroundColor: p.active ? '#D1FAE5' : '#F0E8DA', color: p.active ? '#059669' : '#9B8578', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.06em', padding: '4px 10px', border: 'none', cursor: 'pointer' }}
                      >
                        {p.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => remove(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
