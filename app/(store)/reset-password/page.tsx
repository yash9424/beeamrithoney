'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';

function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    await fetch('/api/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setLoading(false);
    setSent(true);
  };

  const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '10px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' };

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A' }}>Check your email</h2>
      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', marginTop: '0.75rem', lineHeight: '1.7' }}>If that email is registered, a reset link has been sent.</p>
      <Link href="/login" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#5C3317', textDecoration: 'underline', display: 'inline-block', marginTop: '1.5rem' }}>Back to login</Link>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>EMAIL ADDRESS</label>
        <input {...register('email', { required: true })} type="email" placeholder="your@email.com" style={inp} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: 'pointer' }}>
        {loading ? 'SENDING…' : 'SEND RESET LINK'}
      </button>
    </form>
  );
}

function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm<{ password: string; confirm: string }>();
  const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '10px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' };

  const onSubmit = async ({ password, confirm }: { password: string; confirm: string }) => {
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    const res = await fetch('/api/forgot-password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error);
    toast.success('Password updated! Please log in.');
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>NEW PASSWORD</label>
        <input {...register('password', { required: true, minLength: 6 })} type="password" style={inp} />
      </div>
      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>CONFIRM PASSWORD</label>
        <input {...register('confirm', { required: true })} type="password" style={inp} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: 'pointer' }}>
        {loading ? 'UPDATING…' : 'UPDATE PASSWORD'}
      </button>
    </form>
  );
}

function PageContent() {
  const params = useSearchParams();
  const token = params.get('token');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', display: 'block', textAlign: 'center', marginBottom: '2.5rem' }}>Beeamrit</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>{token ? 'Set New Password' : 'Forgot Password'}</h1>
        <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
        {token ? <ResetForm token={token} /> : <ForgotForm />}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><PageContent /></Suspense>;
}
