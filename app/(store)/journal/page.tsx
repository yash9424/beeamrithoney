'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

export default function ContactPage() {
  const [type, setType] = useState<'general' | 'wholesale'>('general');
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success(type === 'wholesale' ? 'Wholesale enquiry sent! We\'ll reply within 48 hours.' : 'Message sent! We\'ll be in touch soon.');
  };

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ backgroundColor: '#1A0F0A', position: 'relative', overflow: 'hidden', padding: 'clamp(4rem, 10vw, 7rem) 1.5rem' }}>
        <div style={{ position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(10rem, 22vw, 20rem)', opacity: 0.05, userSelect: 'none', lineHeight: 1 }}>🍯</div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(61,31,13,0.6) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>GET IN TOUCH</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#FAF8F4', lineHeight: '1.1', maxWidth: '600px' }}>
            Contact Us
          </h1>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0' }} />
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)', color: '#C4A882', maxWidth: '520px', lineHeight: '1.85' }}>
            Whether you have a question about our honey, want to place a bulk order, or are interested in a wholesale partnership — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact info bar */}
      <section style={{ backgroundColor: '#3D1F0D', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✉', label: 'EMAIL US', val: 'hello@beeamrit.com' },
            { icon: '☎', label: 'CALL US', val: '+91 98765 43210' },
            { icon: '⊕', label: 'WORKING HOURS', val: 'Mon–Sat, 10am – 6pm IST' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.2rem', color: '#A0622A', marginTop: '2px' }}>{c.icon}</span>
              <div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.25rem' }}>{c.label}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#FAF8F4' }}>{c.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">

        {/* Left — info */}
        <div>
          {/* Enquiry type toggle */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '1rem' }}>I AM ENQUIRING ABOUT</p>
            <div style={{ display: 'flex', gap: '2px' }}>
              {(['general', 'wholesale'] as const).map(t => (
                <button key={t} onClick={() => { setType(t); setSent(false); }}
                  style={{
                    flex: 1, padding: '12px', fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    fontSize: '0.68rem', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
                    backgroundColor: type === t ? '#5C3317' : '#F0E8DA',
                    color: type === t ? '#FAF8F4' : '#6B5344',
                  }}>
                  {t === 'general' ? 'GENERAL ENQUIRY' : 'WHOLESALE / BULK ORDER'}
                </button>
              ))}
            </div>
          </div>

          {/* Wholesale info */}
          {type === 'wholesale' && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>Why Partner With Us</h2>
              {[
                ['Minimum Order', 'From 12 jars per SKU'],
                ['Trade Discount', 'Up to 35% off retail'],
                ['Custom Labelling', 'White-label options available'],
                ['Lead Time', '5–10 business days'],
                ['Exclusivity', 'Regional exclusivity for key accounts'],
                ['Dedicated Support', 'Personal account manager'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F0E8DA' }}>
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578' }}>{k}</span>
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', fontWeight: '500' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* General info */}
          {type === 'general' && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>How Can We Help?</h2>
              {[
                { icon: '○', title: 'Product Questions', desc: 'Ask us anything about our honey — origin, flavour, storage, or pairing suggestions.' },
                { icon: '⊕', title: 'Orders & Delivery', desc: 'Questions about your order, shipping timelines, or returns — we\'re here to help.' },
                { icon: '◎', title: 'Gifting & Custom Orders', desc: 'Looking for a curated gift set or a custom batch for a special occasion? Let\'s talk.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1rem', color: '#A0622A', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A', marginBottom: '0.3rem' }}>{item.title}</p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', lineHeight: '1.7' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quote */}
          <div style={{ backgroundColor: '#3D1F0D', padding: '2rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#FAF8F4', fontStyle: 'italic', lineHeight: '1.7' }}>
              "Every question about our honey is a question about the land it came from. We love answering both."
            </p>
            <div style={{ width: '30px', height: '1px', backgroundColor: '#A0622A', margin: '1rem 0' }} />
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#A0622A' }}>— BEEAMRIT TEAM</p>
          </div>
        </div>

        {/* Right — form */}
        <div>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '3.5rem' }}>{type === 'wholesale' ? '🤝' : '🍯'}</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A' }}>
                {type === 'wholesale' ? 'Enquiry Received!' : 'Message Sent!'}
              </h3>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', maxWidth: '320px' }}>
                {type === 'wholesale'
                  ? 'Our wholesale team will get back to you within 48 hours with pricing and partnership details.'
                  : 'We\'ll get back to you within 24 hours. Thank you for reaching out!'}
              </p>
              <button onClick={() => setSent(false)}
                style={{ marginTop: '0.5rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#5C3317', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A', marginBottom: '0.25rem' }}>
                {type === 'wholesale' ? 'Wholesale Enquiry' : 'Send a Message'}
              </h2>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.5rem' }} />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label style={lbl}>YOUR NAME *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} style={inp} placeholder="Full name" />
                </div>
                <div>
                  <label style={lbl}>EMAIL ADDRESS *</label>
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
                <label style={lbl}>{type === 'wholesale' ? 'TELL US ABOUT YOUR REQUIREMENTS *' : 'YOUR MESSAGE *'}</label>
                <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                  style={{ ...inp, borderBottom: 'none', border: '1px solid #C4A882', padding: '10px 12px', resize: 'vertical' }}
                  placeholder={type === 'wholesale'
                    ? 'Tell us about your business, expected monthly volume, and any specific products you\'re interested in…'
                    : 'How can we help you?'} />
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', border: 'none', cursor: loading ? 'wait' : 'pointer' }}
                className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
                {loading ? 'SENDING…' : type === 'wholesale' ? 'SEND WHOLESALE ENQUIRY' : 'SEND MESSAGE'}
              </button>

              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', textAlign: 'center', lineHeight: '1.6' }}>
                We respond to all enquiries within {type === 'wholesale' ? '48' : '24'} hours.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
