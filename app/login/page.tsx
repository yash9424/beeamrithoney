'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Suspense } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginForm { email: string; password: string; }
interface RegisterForm { name: string; email: string; phone: string; password: string; confirm: string; }

const inp = {
  width: '100%', backgroundColor: 'transparent', border: 'none',
  borderBottom: '1px solid #C4A882', padding: '10px 0',
  fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem',
  color: '#1A0F0A', outline: 'none',
};
const lbl = {
  fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem',
  letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem',
};

// ── OTP input ──────────────────────────────────────────────────────────────
function OtpStep({
  email, purpose, onVerified, onBack,
}: {
  email: string;
  purpose: 'register' | 'reset';
  onVerified: () => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verify = async () => {
    if (code.length !== 6) return toast.error('Enter the 6-digit code');
    setLoading(true);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error);
    onVerified();
  };

  const resend = async () => {
    setResending(true);
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose }),
    });
    setResending(false);
    toast.success('New code sent!');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', lineHeight: '1.7' }}>
          We sent a 6-digit code to<br />
          <strong style={{ color: '#1A0F0A' }}>{email}</strong>
        </p>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#9B8578', marginTop: '0.25rem' }}>
          Expires in 10 minutes
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>VERIFICATION CODE</label>
        <input
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          style={{ ...inp, fontSize: '1.5rem', letterSpacing: '0.4em', textAlign: 'center' }}
          onKeyDown={e => e.key === 'Enter' && verify()}
        />
      </div>

      <button
        onClick={verify}
        disabled={loading || code.length !== 6}
        style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
        className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60"
      >
        {loading ? 'VERIFYING…' : 'VERIFY CODE'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Back
        </button>
        <button onClick={resend} disabled={resending} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#A0622A', background: 'none', border: 'none', cursor: 'pointer' }}>
          {resending ? 'Sending…' : 'Resend code'}
        </button>
      </div>
    </div>
  );
}

// ── Forgot password flow ───────────────────────────────────────────────────
function ForgotFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'newpass'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch } = useForm<{ password: string; confirm: string }>();

  const sendOtp = async () => {
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'reset' }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || 'Failed to send code');
    toast.success('Code sent!');
    setStep('otp');
  };

  const onNewPass = async ({ password, confirm }: { password: string; confirm: string }) => {
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error);
    toast.success('Password updated! Please log in.');
    onDone();
  };

  if (step === 'email') return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Forgot Password</h1>
      <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={lbl}>EMAIL ADDRESS</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={inp}
          onKeyDown={e => e.key === 'Enter' && sendOtp()}
        />
      </div>
      <button onClick={sendOtp} disabled={loading} style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
        className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
        {loading ? 'SENDING…' : 'SEND CODE'}
      </button>
      <button onClick={onDone} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to login
      </button>
    </div>
  );

  if (step === 'otp') return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Check Your Email</h1>
      <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
      <OtpStep
        email={email}
        purpose="reset"
        onVerified={() => setStep('newpass')}
        onBack={() => setStep('email')}
      />
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Set New Password</h1>
      <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
      <form onSubmit={handleSubmit(onNewPass)} className="space-y-5">
        <div>
          <label style={lbl}>NEW PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input {...register('password', { required: true, minLength: 6 })} type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" style={{ ...inp, paddingRight: '2rem' }} />
            <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B8578' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label style={lbl}>CONFIRM PASSWORD</label>
          <input {...register('confirm', { required: true })} type="password" placeholder="Repeat password" style={inp} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: 'pointer' }}
          className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
          {loading ? 'UPDATING…' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </div>
  );
}

// ── Main login/register page ───────────────────────────────────────────────
function LoginContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Register multi-step
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [pendingReg, setPendingReg] = useState<{ name: string; email: string; phone: string; password: string } | null>(null);

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

  // Step 1: validate form + send OTP
  const handleRegisterStep1 = async (data: RegisterForm) => {
    if (data.password !== data.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, purpose: 'register' }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(json.error);
    setPendingReg({ name: data.name, email: data.email, phone: data.phone, password: data.password });
    setRegStep('otp');
    toast.success('Verification code sent to your email!');
  };

  // Step 2: OTP verified → create account
  const handleRegisterComplete = async () => {
    if (!pendingReg) return;
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: pendingReg.name,
        email: pendingReg.email,
        phone: pendingReg.phone,
        password: pendingReg.password,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(json.error);
    toast.success('Account created! Signing you in… 🍯');
    await signIn('credentials', { email: pendingReg.email, password: pendingReg.password, redirect: false });
    router.push('/');
  };

  if (showForgot) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="max-md:!flex max-md:flex-col">
        <LeftPanel />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 6vw, 4rem)', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', textAlign: 'center', display: 'block', marginBottom: '2.5rem' }}>Beeamrit</Link>
          <ForgotFlow onDone={() => setShowForgot(false)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="max-md:!flex max-md:flex-col">
      <LeftPanel />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 6vw, 4rem)', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', textAlign: 'center', display: 'block', marginBottom: '2.5rem' }}>
          Beeamrit
        </Link>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8DFD0', marginBottom: '2rem' }}>
          {(['login', 'register'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setRegStep('form'); }}
              style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: tab === t ? '#1A0F0A' : '#9B8578', padding: '0 0 0.75rem', marginRight: '1.5rem', borderBottom: tab === t ? '2px solid #5C3317' : '2px solid transparent', background: 'none', cursor: 'pointer' }}>
              {t === 'login' ? 'Login' : 'Create Account'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
              <div>
                <label style={lbl}>EMAIL ADDRESS</label>
                <input {...loginForm.register('email', { required: true })} placeholder="your@email.com" style={inp} />
              </div>
              <div>
                <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
                  <label style={lbl}>PASSWORD</label>
                  <button type="button" onClick={() => setShowForgot(true)}
                    style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#A0622A', background: 'none', border: 'none', cursor: 'pointer' }}>
                    FORGOT?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input {...loginForm.register('password', { required: true })} type={showPw ? 'text' : 'password'} placeholder="Enter your password" style={{ ...inp, paddingRight: '2rem' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B8578' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', marginTop: '0.5rem', cursor: loading ? 'wait' : 'pointer', border: 'none' }}
                className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8DFD0' }} />
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', letterSpacing: '0.08em' }}>OR AUTHENTICATE WITH</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E8DFD0' }} />
              </div>

              <button type="button" onClick={() => signIn('google')}
                style={{ width: '100%', border: '1px solid #E8DFD0', padding: '12px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', cursor: 'pointer' }}
                className="hover:bg-[#F5F0E8] transition-colors">
                <span>⊕</span> CONTINUE WITH GOOGLE
              </button>
            </form>
          </>
        ) : regStep === 'otp' && pendingReg ? (
          <>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Verify Email</h1>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
            <OtpStep
              email={pendingReg.email}
              purpose="register"
              onVerified={handleRegisterComplete}
              onBack={() => setRegStep('form')}
            />
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Join the Hive</h1>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.75rem' }} />
            <form onSubmit={regForm.handleSubmit(handleRegisterStep1)} className="space-y-5">
              <div>
                <label style={lbl}>FULL NAME</label>
                <input {...regForm.register('name', { required: true })} placeholder="Your full name" style={inp} />
              </div>
              <div>
                <label style={lbl}>EMAIL ADDRESS</label>
                <input {...regForm.register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} placeholder="your@email.com" style={inp} />
              </div>
              <div>
                <label style={lbl}>MOBILE NUMBER</label>
                <input {...regForm.register('phone', { required: true })} type="tel" placeholder="+91 00000 00000" style={inp} />
              </div>
              <div>
                <label style={lbl}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input {...regForm.register('password', { required: true, minLength: 6 })} type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" style={{ ...inp, paddingRight: '2rem' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B8578' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={lbl}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input {...regForm.register('confirm', { required: true })} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" style={{ ...inp, paddingRight: '2rem' }} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B8578' }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', cursor: loading ? 'wait' : 'pointer', border: 'none' }}
                className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
                {loading ? 'SENDING CODE…' : 'VERIFY EMAIL →'}
              </button>
            </form>
          </>
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

function LeftPanel() {
  return (
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
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
