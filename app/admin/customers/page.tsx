'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
}

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetch('/api/admin/users')
        .then((r) => r.json())
        .then((d) => { setUsers(d.users || []); setTotal(d.total || 0); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MANAGEMENT</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Customers</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginTop: '0.25rem' }}>{total} registered members</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B5344', fontFamily: 'Georgia, serif' }}>Loading customers…</div>
      ) : (
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8DFD0' }}>
                  {['CUSTOMER', 'EMAIL', 'ROLE', 'JOINED', 'STATUS'].map((h) => (
                    <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', textAlign: 'left', padding: '1rem', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#FAF8F4', fontWeight: 'bold', flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: u.role === 'admin' ? '#FEF3C7' : '#D1FAE5',
                        color: u.role === 'admin' ? '#D97706' : '#059669',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif',
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        padding: '3px 10px',
                        textTransform: 'capitalize',
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block', marginRight: '6px' }} />
                      <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#059669' }}>Active</span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No customers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
