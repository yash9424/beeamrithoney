'use client';
import { useEffect, useState } from 'react';
import { Star, Trash2, Pencil, X, Check } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  body: string;
  title?: string;
  userName: string;
  createdAt: string;
  product?: { name: string; slug: string } | null;
}

function Stars({ value }: { value: number }) {
  return (
    <span style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={13} fill={value >= s ? '#A0622A' : 'none'} color={value >= s ? '#A0622A' : '#C4A882'} />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => { setReviews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (r: Review) => {
    setEditId(r._id);
    setEditRating(r.rating);
    setEditBody(r.body);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    await fetch(`/api/reviews/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: editRating, body: editBody }),
    });
    setSaving(false);
    setEditId(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  const filtered = reviews.filter(r =>
    !filter ||
    r.userName.toLowerCase().includes(filter.toLowerCase()) ||
    (r.product?.name || '').toLowerCase().includes(filter.toLowerCase()) ||
    r.body.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>ADMIN</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#1A0F0A' }}>Reviews</h1>
        </div>
        <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', backgroundColor: '#F0E8DA', padding: '4px 12px' }}>
          {reviews.length} total
        </span>
      </div>

      {/* Search */}
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search by customer, product or content…"
        style={{
          width: '100%', maxWidth: '420px', border: '1px solid #C4A882',
          backgroundColor: 'transparent', padding: '9px 14px', marginBottom: '1.5rem',
          fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem',
          color: '#1A0F0A', outline: 'none',
        }}
      />

      {loading ? (
        <p style={{ fontFamily: 'Georgia, serif', color: '#9B8578' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ border: '1px dashed #C4A882', padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#9B8578' }}>No reviews found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(r => (
            <div
              key={r._id}
              style={{
                backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0',
                padding: '1.25rem 1.5rem',
              }}
            >
              {editId === r._id ? (
                /* ── Edit mode ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1,2,3,4,5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setEditRating(s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star size={20} fill={editRating >= s ? '#A0622A' : 'none'} color={editRating >= s ? '#A0622A' : '#C4A882'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    style={{
                      width: '100%', border: '1px solid #C4A882', backgroundColor: 'transparent',
                      padding: '8px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem',
                      color: '#1A0F0A', outline: 'none', resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={saving}
                      style={{
                        backgroundColor: '#5C3317', color: '#FAF8F4',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem',
                        letterSpacing: '0.08em', padding: '8px 18px', border: 'none',
                        cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <Check size={13} /> {saving ? 'SAVING…' : 'SAVE'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      style={{
                        backgroundColor: 'transparent', color: '#6B5344',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem',
                        letterSpacing: '0.08em', padding: '8px 18px',
                        border: '1px solid #C4A882', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <X size={13} /> CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <Stars value={r.rating} />
                        <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', fontWeight: '600', color: '#1A0F0A' }}>
                          {r.userName}
                        </span>
                        {r.product?.name && (
                          <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', backgroundColor: '#F0E8DA', padding: '2px 8px' }}>
                            {r.product.name}
                          </span>
                        )}
                        <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {r.title && (
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', color: '#3D1F0D', fontStyle: 'italic' }}>"{r.title}"</p>
                      )}
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.7', marginTop: '4px' }}>
                        {r.body}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        title="Edit review"
                        style={{ background: 'none', border: '1px solid #C4A882', padding: '7px', cursor: 'pointer', color: '#5C3317' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => del(r._id)}
                        title="Delete review"
                        style={{ background: 'none', border: '1px solid #E8DFD0', padding: '7px', cursor: 'pointer', color: '#C4755A' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
