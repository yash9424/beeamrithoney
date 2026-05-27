'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

/* ── Reveal on scroll ────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, dir = 'up' }: {
  children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' | 'none';
}) {
  const { ref, visible } = useReveal();
  const t: Record<string, string> = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : t[dir],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────── */
const inp = {
  width: '100%', backgroundColor: 'transparent', border: 'none',
  borderBottom: '1px solid #C4A882', padding: '10px 0',
  fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem',
  color: '#1A0F0A', outline: 'none',
};
const lbl = {
  fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem',
  letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem',
};

/* ══════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const [type, setType] = useState<'general' | 'wholesale'>('general');
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...form }),
    });
    setLoading(false);
    if (!res.ok) return toast.error('Failed to send. Please try again.');
    setSent(true);
    toast.success(type === 'wholesale' ? "Wholesale enquiry sent! We'll reply within 48 hours." : "Message sent! We'll be in touch soon.");
  };

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes lineDraw { from { width: 0 } to { width: 60px } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:none } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', position: 'relative', overflow: 'hidden', padding: 'clamp(5rem, 12vw, 8rem) 1.5rem' }}>
        <img src="/uploads/contact-hero.png" alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            transform: mounted ? 'scale(1)' : 'scale(1.06)',
            transition: 'transform 1.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        {/* curtain */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0A0503', opacity: mounted ? 0 : 1, transition: 'opacity 1s ease', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(26,15,10,0.9) 0%, rgba(61,31,13,0.6) 60%, rgba(0,0,0,0.35) 100%)', zIndex: 1 }} />

        <div className="max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 3 }}>
          {/* eyebrow */}
          <p style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem',
            letterSpacing: '0.22em', color: '#A0622A', marginBottom: '1rem',
            opacity: mounted ? 1 : 0, transition: 'opacity 0.7s ease 0.1s',
          }}>GET IN TOUCH</p>

          {/* heading */}
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
            color: '#FAF8F4', lineHeight: 1.08, maxWidth: '600px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(32px)',
            transition: 'opacity 0.85s ease 0.28s, transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94) 0.28s',
          }}>
            Contact<br /><span style={{ fontStyle: 'italic', color: '#C4A882' }}>Beeamrit.</span>
          </h1>

          {/* divider draws */}
          <div style={{
            height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0',
            width: mounted ? '60px' : '0px',
            transition: 'width 0.6s ease 0.7s',
          }} />

          {/* subtext */}
          <p style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)',
            color: '#C4A882', maxWidth: '520px', lineHeight: 1.85,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.85s, transform 0.7s ease 0.85s',
          }}>
            Whether you have a question about our honey, want to place a bulk order, or are
            interested in a wholesale partnership — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO BAR ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#3D1F0D', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✉', label: 'EMAIL US', val: 'hello@beeamrit.com' },
            { icon: '☎', label: 'CALL US', val: '+91 98765 43210' },
            { icon: '⊕', label: 'WORKING HOURS', val: 'Mon–Sat, 10am – 6pm IST' },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 0.1} dir="up">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem', color: '#A0622A', marginTop: '2px' }}>{c.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.25rem' }}>{c.label}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#FAF8F4' }}>{c.val}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">

        {/* Left */}
        <div>
          {/* Type toggle */}
          <Reveal dir="left">
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '1rem' }}>I AM ENQUIRING ABOUT</p>
              <div style={{ display: 'flex', gap: '2px' }}>
                {(['general', 'wholesale'] as const).map(t => (
                  <button type="button" key={t} onClick={() => { setType(t); setSent(false); }}
                    style={{
                      flex: 1, padding: '12px', fontFamily: 'Helvetica Neue, Arial, sans-serif',
                      fontSize: '0.68rem', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
                      backgroundColor: type === t ? '#5C3317' : '#F0E8DA',
                      color: type === t ? '#FAF8F4' : '#6B5344',
                      transition: 'background-color 0.25s, color 0.25s',
                    }}>
                    {t === 'general' ? 'GENERAL ENQUIRY' : 'WHOLESALE / BULK'}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Wholesale details */}
          {type === 'wholesale' && (
            <Reveal dir="left" delay={0.05}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>Why Partner With Us</h2>
                {[
                  ['Minimum Order', 'From 12 jars per SKU'],
                  ['Trade Discount', 'Up to 35% off retail'],
                  ['Custom Labelling', 'White-label options available'],
                  ['Lead Time', '5–10 business days'],
                  ['Exclusivity', 'Regional exclusivity for key accounts'],
                  ['Dedicated Support', 'Personal account manager'],
                ].map(([k, v], i) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '0.75rem 0', borderBottom: '1px solid #F0E8DA',
                    opacity: 1,
                    animation: `fadeUp 0.45s ease ${i * 0.06}s both`,
                  }}>
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578' }}>{k}</span>
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', fontWeight: '500' }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* General help */}
          {type === 'general' && (
            <Reveal dir="left" delay={0.05}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>How Can We Help?</h2>
                {[
                  { icon: '○', title: 'Product Questions', desc: "Ask us anything about our honey — origin, flavour, storage, or pairing suggestions." },
                  { icon: '⊕', title: 'Orders & Delivery', desc: "Questions about your order, shipping timelines, or returns — we're here to help." },
                  { icon: '◎', title: 'Gifting & Custom Orders', desc: "Looking for a curated gift set or a custom batch for a special occasion? Let's talk." },
                ].map((item, i) => (
                  <div key={item.title} style={{
                    display: 'flex', gap: '1rem', marginBottom: '1.5rem',
                    animation: `fadeUp 0.45s ease ${i * 0.1}s both`,
                  }}>
                    <span style={{ fontSize: '1rem', color: '#A0622A', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A', marginBottom: '0.3rem' }}>{item.title}</p>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', lineHeight: '1.7' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Quote block */}
          <Reveal dir="up" delay={0.1}>
            <div style={{ backgroundColor: '#3D1F0D', padding: '2rem', borderLeft: '3px solid #A0622A' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#FAF8F4', fontStyle: 'italic', lineHeight: 1.7 }}>
                &ldquo;Every question about our honey is a question about the land it came from. We love answering both.&rdquo;
              </p>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#A0622A', margin: '1rem 0' }} />
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#A0622A' }}>— BEEAMRIT TEAM</p>
            </div>
          </Reveal>
        </div>

        {/* Right — form */}
        <Reveal dir="right" delay={0.1}>
          <div>
            {sent ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '400px', textAlign: 'center', gap: '1rem',
                animation: 'fadeUp 0.5s ease both',
              }}>
                <div style={{ fontSize: '3.5rem' }}>{type === 'wholesale' ? '🤝' : '🍯'}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A' }}>
                  {type === 'wholesale' ? 'Enquiry Received!' : 'Message Sent!'}
                </h3>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: 1.8, maxWidth: '320px' }}>
                  {type === 'wholesale'
                    ? "Our wholesale team will get back to you within 48 hours with pricing and partnership details."
                    : "We'll get back to you within 24 hours. Thank you for reaching out!"}
                </p>
                <button type="button" onClick={() => setSent(false)} style={{ marginTop: '0.5rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#5C3317', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A', marginBottom: '0.25rem' }}>
                    {type === 'wholesale' ? 'Wholesale Enquiry' : 'Send a Message'}
                  </h2>
                  <div style={{ width: '30px', height: '1px', backgroundColor: '#C4A882', marginTop: '0.75rem' }} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label style={lbl}>YOUR NAME *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} style={inp} placeholder="Full name" />
                  </div>
                  <div>
                    <label style={lbl}>EMAIL *</label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inp} placeholder="your@email.com" />
                  </div>
                </div>

                {type === 'wholesale' && (
                  <div>
                    <label style={lbl}>BUSINESS NAME *</label>
                    <input required value={form.business} onChange={e => set('business', e.target.value)} style={inp} placeholder="Your restaurant / store / brand" />
                  </div>
                )}

                <div>
                  <label style={lbl}>PHONE NUMBER</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} placeholder="+91 00000 00000" />
                </div>

                <div>
                  <label style={lbl}>{type === 'wholesale' ? 'YOUR REQUIREMENTS *' : 'YOUR MESSAGE *'}</label>
                  <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                    style={{ ...inp, borderBottom: 'none', border: '1px solid #C4A882', padding: '10px 12px', resize: 'vertical' }}
                    placeholder={type === 'wholesale'
                      ? "Tell us about your business, expected volume, and products you're interested in…"
                      : 'How can we help you?'} />
                </div>

                {/* Submit — fill-up hover */}
                <div style={{ position: 'relative', overflow: 'hidden' }} className="submit-wrap">
                  <style>{`
                    .submit-wrap::before {
                      content:''; position:absolute; inset:0;
                      background:#3D1F0D;
                      transform:translateY(101%);
                      transition:transform 0.38s cubic-bezier(0.4,0,0.2,1);
                      z-index:0;
                    }
                    .submit-wrap:hover::before { transform:translateY(0); }
                    .submit-wrap button { position:relative; z-index:1; }
                  `}</style>
                  <button type="submit" disabled={loading}
                    style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.14em', padding: '16px', border: 'none', cursor: loading ? 'wait' : 'pointer', transition: 'background-color 0.38s' }}
                    className="disabled:opacity-60">
                    {loading ? 'SENDING…' : type === 'wholesale' ? 'SEND WHOLESALE ENQUIRY →' : 'SEND MESSAGE →'}
                  </button>
                </div>

                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', textAlign: 'center', lineHeight: 1.6 }}>
                  We respond within {type === 'wholesale' ? '48' : '24'} hours.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
