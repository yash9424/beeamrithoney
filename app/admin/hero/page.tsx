'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, Trash2, Plus, Save } from 'lucide-react';

interface HeroSlide {
  _id?: string;
  type: 'image' | 'video';
  src: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

const blank: Omit<HeroSlide, '_id'> = {
  type: 'image', src: '', headline: '', subheadline: '', cta: 'EXPLORE COLLECTION', ctaLink: '/shop', active: true, order: 0,
};

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch_ = () =>
    fetch('/api/hero').then(r => r.json()).then(d => { setSlides(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetch_(); }, []);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const method = selected._id ? 'PUT' : 'POST';
    const res = await fetch('/api/hero', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(selected) });
    setSaving(false);
    if (res.ok) { toast.success('Saved'); fetch_(); setSelected(null); }
    else toast.error('Save failed');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    const res = await fetch('/api/hero', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Deleted'); fetch_(); }
    else toast.error('Delete failed');
  };

  const uploadMedia = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setSelected(s => s ? { ...s, src: data.url, type: file.type.startsWith('video') ? 'video' : 'image' } : s);
    else toast.error('Upload failed');
  };

  const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' };
  const lbl = { fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>CONTENT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Hero Slides</h1>
        </div>
        <button
          onClick={() => setSelected({ ...blank })}
          style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} /> ADD SLIDE
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
        {/* Slides list */}
        <div>
          {loading && <div style={{ fontFamily: 'Georgia, serif', color: '#6B5344', padding: '2rem' }}>Loading…</div>}
          {!loading && slides.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #C4A882' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
              <p style={{ fontFamily: 'Georgia, serif', color: '#6B5344' }}>No hero slides yet</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578', marginTop: '0.5rem' }}>Click "Add Slide" to create your first hero banner</p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {slides.map((slide, i) => (
              <div
                key={slide._id || i}
                style={{ border: `1px solid ${selected?._id === slide._id ? '#5C3317' : '#E8DFD0'}`, backgroundColor: '#FAF8F4', display: 'flex', gap: '1rem', overflow: 'hidden' }}
              >
                {/* Preview */}
                <div style={{ width: '160px', height: '90px', flexShrink: 0, backgroundColor: '#3D1F0D', position: 'relative', overflow: 'hidden' }}>
                  {slide.src && slide.type === 'image' ? (
                    <Image src={slide.src} alt="" fill style={{ objectFit: 'cover' }} />
                  ) : slide.src && slide.type === 'video' ? (
                    <video src={slide.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🍯</div>
                  )}
                </div>

                <div style={{ flex: 1, padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                    <span style={{ backgroundColor: slide.active ? '#D1FAE5' : '#F0E8DA', color: slide.active ? '#059669' : '#9B8578', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.06em', padding: '2px 8px' }}>
                      {slide.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#9B8578' }}>#{slide.order + 1}</span>
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#A0622A', textTransform: 'uppercase' }}>{slide.type}</span>
                  </div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>{slide.headline || 'No headline'}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginTop: '0.2rem' }}>{slide.subheadline || '—'}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setSelected({ ...slide })}
                    style={{ border: '1px solid #C4A882', background: 'none', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.06em', color: '#5C3317', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => slide._id && remove(slide._id)}
                    style={{ border: '1px solid #E8DFD0', background: 'none', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#DC2626', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor panel */}
        {selected && (
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A' }}>
                {selected._id ? 'Edit Slide' : 'New Slide'}
              </h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#9B8578', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Media upload */}
              <div>
                <label style={lbl}>MEDIA (IMAGE OR VIDEO)</label>
                {selected.src ? (
                  <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                    {selected.type === 'image'
                      ? <div style={{ width: '100%', height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: '#F0E8DA' }}><Image src={selected.src} alt="" fill style={{ objectFit: 'cover' }} /></div>
                      : <video src={selected.src} style={{ width: '100%', height: '140px', objectFit: 'cover' }} controls />
                    }
                    <button
                      onClick={() => setSelected(s => s ? { ...s, src: '' } : s)}
                      style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.65rem' }}
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ border: '2px dashed #C4A882', padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#F5F0E8' }}
                  >
                    <Upload size={24} style={{ color: '#A0622A', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344' }}>
                      {uploading ? 'Uploading…' : 'Click to upload image or video'}
                    </p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', color: '#9B8578', marginTop: '0.25rem' }}>
                      JPG, PNG, WebP, MP4 supported
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) uploadMedia(e.target.files[0]); }}
                />
              </div>

              <div>
                <label style={lbl}>HEADLINE</label>
                <input value={selected.headline} onChange={e => setSelected(s => s ? { ...s, headline: e.target.value } : s)} style={inp} placeholder="Pure Himalayan Wildflower" />
              </div>
              <div>
                <label style={lbl}>SUBHEADLINE</label>
                <input value={selected.subheadline} onChange={e => setSelected(s => s ? { ...s, subheadline: e.target.value } : s)} style={inp} placeholder="Hand-harvested at 3,000m" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={lbl}>CTA TEXT</label>
                  <input value={selected.cta} onChange={e => setSelected(s => s ? { ...s, cta: e.target.value } : s)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>CTA LINK</label>
                  <input value={selected.ctaLink} onChange={e => setSelected(s => s ? { ...s, ctaLink: e.target.value } : s)} style={inp} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={lbl}>ORDER</label>
                  <input type="number" value={selected.order} onChange={e => setSelected(s => s ? { ...s, order: +e.target.value } : s)} style={inp} min={0} />
                </div>
                <div>
                  <label style={lbl}>STATUS</label>
                  <select
                    value={selected.active ? 'active' : 'inactive'}
                    onChange={e => setSelected(s => s ? { ...s, active: e.target.value === 'active' } : s)}
                    style={{ ...inp, cursor: 'pointer' }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                onClick={save}
                disabled={saving}
                style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '14px', border: 'none', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Save size={14} /> {saving ? 'SAVING…' : 'SAVE SLIDE'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
