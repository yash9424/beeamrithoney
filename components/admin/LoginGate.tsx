'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return toast.error('Invalid credentials');
    toast.success('Welcome to Beeamrit Admin 🍯');
    router.refresh();
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#1A0F0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍯</div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FAF8F4' }}>Beeamrit Admin</p>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#7C4A1E', marginTop: '0.3rem' }}>MANAGEMENT PORTAL</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@beeamrit.com"
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #3D1F0D', borderRadius: 0, padding: '12px 14px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#FAF8F4', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '1.75rem', position: 'relative' }}>
            <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>PASSWORD</label>
            <input
              type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #3D1F0D', borderRadius: 0, padding: '12px 40px 12px 14px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#FAF8F4', outline: 'none' }}
            />
            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '34px', color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.15em', padding: '14px', border: 'none', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
            <Lock size={13} /> {loading ? 'ENTERING…' : 'ENTER ADMIN PANEL'}
          </button>
        </form>

        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#3D1F0D', textAlign: 'center', marginTop: '2rem' }}>
          Default: admin@beeamrit.com / admin123
        </p>
      </div>
    </div>
  );
}
