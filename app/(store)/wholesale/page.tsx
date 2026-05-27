'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WholesalePage() {
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Inquiry received! We\'ll be in touch within 48 hours.');
    setSent(true);
  };

  const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '10px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' };
  const lbl = { fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' };

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <section style={{ backgroundColor: '#3D1F0D', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>TRADE & B2B</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FAF8F4' }}>Wholesale Enquiries</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#C4A882', marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0', lineHeight: '1.8' }}>
          Partner with Beeamrit for your restaurant, hotel, specialty food store, or gift program.
        </p>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A', marginBottom: '1rem' }}>Why Stock Beeamrit</h2>
          {[
            ['Minimum Order', 'From 12 jars per SKU'],
            ['Trade Discount', 'Up to 35% off retail'],
            ['Custom Labelling', 'White-label options available'],
            ['Lead Time', '5–10 business days'],
            ['Exclusivity', 'Regional exclusivity for key accounts'],
            ['Support', 'Dedicated account manager'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F0E8' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578' }}>{k}</span>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', fontWeight: '500' }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          {sent ? (
            <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#1A0F0A' }}>Inquiry Received</h3>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', marginTop: '0.75rem', lineHeight: '1.7' }}>Our wholesale team will contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#1A0F0A', marginBottom: '1.5rem' }}>Get in Touch</h2>
              {[['name', 'YOUR NAME'], ['business', 'BUSINESS NAME'], ['email', 'EMAIL ADDRESS'], ['phone', 'PHONE NUMBER']].map(([field, label]) => (
                <div key={field}>
                  <label style={lbl}>{label}</label>
                  <input required={field !== 'phone'} value={form[field as keyof typeof form]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inp} />
                </div>
              ))}
              <div>
                <label style={lbl}>MESSAGE</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inp, borderBottom: 'none', border: '1px solid #C4A882', padding: '10px', resize: 'vertical' }} placeholder="Tell us about your business and requirements…" />
              </div>
              <button type="submit" style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px 32px', border: 'none', cursor: 'pointer', width: '100%' }}>
                SEND INQUIRY
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
