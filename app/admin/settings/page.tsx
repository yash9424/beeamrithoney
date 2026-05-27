'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const handleSeed = async () => {
    if (!confirm('This will replace all existing products with demo data. Continue?')) return;
    setSeeding(true);
    const res = await fetch('/api/seed');
    const data = await res.json();
    setSeeding(false);
    if (res.ok) toast.success(data.message);
    else toast.error('Seed failed');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>CONFIGURATION</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Settings</h1>
      </div>

      <div className="space-y-6 max-w-lg">
        {/* Store info */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Store Information</h2>
          {[
            { label: 'STORE NAME', value: 'Beeamrit' },
            { label: 'CURRENCY', value: 'INR (₹)' },
            { label: 'SHIPPING THRESHOLD', value: '₹1,000 (free above)' },
            { label: 'ECO-PACKAGING', value: 'Included (no charge)' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F5F0E8' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#9B8578' }}>{label}</span>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Logged in user */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Admin Account</h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344' }}>
            Logged in as: <strong style={{ color: '#1A0F0A' }}>{session?.user?.name}</strong>
          </p>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578', marginTop: '0.25rem' }}>
            {session?.user?.email}
          </p>
        </div>

        {/* Demo data */}
        <div style={{ backgroundColor: '#FFF8F0', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Demo Data</h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginBottom: '1rem', lineHeight: '1.6' }}>
            Seed the database with 10 sample honey products to get started quickly.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', border: 'none', cursor: seeding ? 'wait' : 'pointer' }}
            className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60"
          >
            {seeding ? 'SEEDING…' : 'SEED DEMO PRODUCTS'}
          </button>
        </div>
      </div>
    </div>
  );
}
