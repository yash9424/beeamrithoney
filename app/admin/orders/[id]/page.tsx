'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Save } from 'lucide-react';
import { Order } from '@/types';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  processing: '#D97706', shipped: '#2563EB', delivered: '#059669', cancelled: '#DC2626', pending: '#9B8578',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => { setOrder(d); setNewStatus(d.status); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async () => {
    if (!order || newStatus === order.status) return;
    setSaving(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setOrder({ ...order, status: newStatus as Order['status'] });
      toast.success('Order status updated');
    } else {
      toast.error(data.error || 'Failed to update');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', fontFamily: 'Georgia, serif', color: '#6B5344' }}>
      Loading order…
    </div>
  );

  if (!order || (order as { error?: string }).error) return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <p style={{ fontFamily: 'Georgia, serif', color: '#6B5344' }}>Order not found</p>
      <Link href="/admin/orders" style={{ color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', textDecoration: 'underline' }}>Back to orders</Link>
    </div>
  );

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div>
      <Link href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> BACK TO ORDERS
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>ORDER</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>#{order.orderNumber}</h1>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.25rem' }}>
            Placed {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Status updater */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            style={{ border: '1px solid #C4A882', backgroundColor: '#FAF8F4', padding: '10px 16px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A', outline: 'none', cursor: 'pointer' }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={updateStatus}
            disabled={saving || newStatus === order.status}
            style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', border: 'none', cursor: saving || newStatus === order.status ? 'default' : 'pointer', opacity: newStatus === order.status ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={14} /> {saving ? 'SAVING…' : 'SAVE STATUS'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {order.status !== 'cancelled' && (
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            {STATUS_STEPS.map((s, i) => (
              <div key={s} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: i <= stepIdx ? '#5C3317' : '#E8DFD0', margin: '0 auto 0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i <= stepIdx
                    ? <CheckCircle size={14} color="#FAF8F4" />
                    : <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578' }}>{i + 1}</span>
                  }
                </div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.06em', color: i <= stepIdx ? '#3D1F0D' : '#9B8578', textTransform: 'capitalize' }}>{s}</p>
              </div>
            ))}
          </div>
          <div style={{ height: '4px', backgroundColor: '#E8DFD0', borderRadius: '2px' }}>
            <div style={{ width: `${Math.min((stepIdx / (STATUS_STEPS.length - 1)) * 100, 100)}%`, height: '100%', backgroundColor: '#5C3317', borderRadius: '2px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Items */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Items Ordered</h2>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F0E8' }}>
              <div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{item.name}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', marginTop: '2px' }}>
                  {item.volume} × {item.quantity}
                </p>
              </div>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>Subtotal</span>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>Shipping</span>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            {(order as { discount?: number }).discount ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#059669' }}>Discount</span>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#059669' }}>-${(order as { discount?: number }).discount?.toFixed(2)}</span>
              </div>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E8DFD0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D' }}>TOTAL</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Customer</h2>
            <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8' }}>
              <p><strong style={{ color: '#1A0F0A' }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
              <p>{order.shippingAddress.email}</p>
              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            </div>
          </div>
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Shipping Address</h2>
            <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8' }}>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Payment</h2>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', textTransform: 'capitalize' }}>
              {((order as { paymentMethod?: string }).paymentMethod || 'card').replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
