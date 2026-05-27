'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  user?: { name: string; email: string };
  guestEmail?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: { firstName: string; lastName: string; city: string; country: string };
  createdAt: string;
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  processing: { bg: '#FEF3C7', text: '#D97706' },
  shipped: { bg: '#DBEAFE', text: '#2563EB' },
  delivered: { bg: '#D1FAE5', text: '#059669' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  pending: { bg: '#F0E8DA', text: '#9B8578' },
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const loadOrders = async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    const res = await fetch(`/api/orders?${params}&limit=100`);
    const data = await res.json();

    // Fetch from admin endpoint if needed
    const adminRes = await fetch('/api/admin/stats');
    const adminData = await adminRes.json();
    setOrders(adminData.recentOrders || []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') loadOrders();
  }, [session, filterStatus]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MANAGEMENT</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Orders</h1>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterStatus('')}
          style={{ border: '1px solid', borderColor: filterStatus === '' ? '#5C3317' : '#C4A882', backgroundColor: filterStatus === '' ? '#5C3317' : 'transparent', color: filterStatus === '' ? '#FAF8F4' : '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em', padding: '6px 14px' }}
        >
          ALL
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{ border: '1px solid', borderColor: filterStatus === s ? '#5C3317' : '#C4A882', backgroundColor: filterStatus === s ? '#5C3317' : 'transparent', color: filterStatus === s ? '#FAF8F4' : '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em', padding: '6px 14px', textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B5344', fontFamily: 'Georgia, serif' }}>Loading orders…</div>
      ) : (
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8DFD0' }}>
                  {['ORDER #', 'CUSTOMER', 'ITEMS', 'DATE', 'TOTAL', 'STATUS', 'ACTIONS'].map((h) => (
                    <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', textAlign: 'left', padding: '1rem', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No orders found</td></tr>
                )}
                {orders.map((order) => {
                  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid #F5F0E8' }}>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#5C3317', fontWeight: '600' }}>
                        #{order.orderNumber}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>
                          {order.user?.name || 'Guest'}
                        </p>
                        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578' }}>
                          {order.user?.email || order.guestEmail}
                        </p>
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>
                        {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ') || '—'}
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A', fontWeight: '600' }}>
                        ₹{order.total?.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.06em', padding: '4px 10px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updating === order._id}
                          style={{ border: '1px solid #C4A882', backgroundColor: 'transparent', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#3D1F0D', padding: '4px 8px', cursor: 'pointer', outline: 'none' }}
                        >
                          {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
