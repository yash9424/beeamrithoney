'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Suspense } from 'react';

interface LoginForm { email: string; password: string; }
interface RegisterForm { name: string; email: string; password: string; confirm: string; }

function LoginContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginForm>();
  const regForm = useForm<RegisterForm>();

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    const res = await signIn('credentials', { ...data, redirect: false });
    setLoading(false);
    if (res?.error) return toast.error('Invalid email or password');
    toast.success('Welcome back! 🍯');
    router.push('/');
  };

  const handleRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(json.error);
    toast.success('Account created! Signing you in…');
    await signIn('credentials', { email: data.email, password: data.password, redirect: false });
    router.push('/');
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #C4A882',
    padding: '10px 0',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: '0.85rem',
    color: '#1A0F0A',
    outline: 'none',
  };

  const labelStyle = {
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    color: '#9B8578',
    display: 'block',
    marginBottom: '0.35rem',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="max-md:!flex max-md:flex-col">
      {/* Left — visual */}
      <div style={{ backgroundColor: '#3D1F0D', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '3rem' }} className="max-md:hidden">
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12rem', opacity: 0.3 }}>🍯</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>THE ORIGIN STORY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#FAF8F4', fontStyle: 'italic', lineHeight: '1.3' }}>Crafted by nature,<br />bottled in silence.</h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#C4A882', marginTop: '1rem', lineHeight: '1.7', maxWidth: '360px' }}>
            Join our collective to access rare seasonal vintages from protected wild floral reserves.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 6vw, 4rem)', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', textAlign: 'center', display: 'block', marginBottom: '2.5rem' }}>
          Beeamrit
        </Link>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8DFD0', marginBottom: '2rem' }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '0.82rem',
                color: tab === t ? '#1A0F0A' : '#9B8578',
                padding: '0 0 0.75rem',
                marginRight: '1.5rem',
                borderBottom: tab === t ? '2px solid #5C3317' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {t === 'login' ? 'Login' : 'Create Account'}
            </button>
          ))}
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>
          {tab === 'login' ? 'Welcome Back' : 'Join the Hive'}
        </h1>
        <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }}></div>

        {tab === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input {...loginForm.register('email', { required: true })} placeholder="your@email.com" style={inputStyle} />
            </div>
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
                <label style={labelStyle}>PASSWORD</label>
                <button type="button" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#A0622A' }}>FORGOT?</button>
              </div>
              <input {...loginForm.register('password', { required: true })} type="password" placeholder="••••••••" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ accentColor: '#5C3317', width: '14px', height: '14px' }} />
              <label htmlFor="remember" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344' }}>Remember my journey</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', marginTop: '0.5rem', cursor: loading ? 'wait' : 'pointer' }}
              className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60"
            >
              {loading ? 'ENTERING...' : 'ENTER THE HIVE'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E8DFD0' }}></div>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', letterSpacing: '0.08em' }}>OR AUTHENTICATE WITH</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E8DFD0' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{ id: 'google', label: 'GOOGLE', icon: '⊕' }, { id: 'apple', label: 'APPLE', icon: '⍺' }].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => signIn(p.id)}
                  style={{ border: '1px solid #E8DFD0', padding: '12px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  className="hover:bg-[#F5F0E8] transition-colors"
                >
                  <span>{p.icon}</span> {p.label}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <form onSubmit={regForm.handleSubmit(handleRegister)} className="space-y-5">
            <div>
              <label style={labelStyle}>FULL NAME</label>
              <input {...regForm.register('name', { required: true })} placeholder="Your full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input {...regForm.register('email', { required: true })} placeholder="your@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input {...regForm.register('password', { required: true, minLength: 6 })} type="password" placeholder="Min 6 characters" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <input {...regForm.register('confirm', { required: true })} type="password" placeholder="Repeat password" style={inputStyle} />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', cursor: loading ? 'wait' : 'pointer' }}
              className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60"
            >
              {loading ? 'CREATING...' : 'JOIN THE HIVE'}
            </button>
          </form>
        )}

        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', marginTop: '2rem', lineHeight: '1.6', textAlign: 'center' }}>
          By continuing, you embrace our commitment to{' '}
          <Link href="/sustainability" style={{ color: '#5C3317', textDecoration: 'underline' }}>Sustainability</Link>{' '}
          and the{' '}
          <Link href="/about" style={{ color: '#5C3317', textDecoration: 'underline' }}>Rare Harvest Protocols</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
