'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Order } from '@/types';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_ICONS = { pending: Package, processing: Package, shipped: Truck, delivered: CheckCircle, cancelled: XCircle };
const STATUS_COLOR: Record<string, string> = { processing: '#D97706', shipped: '#2563EB', delivered: '#059669', cancelled: '#DC2626', pending: '#9B8578' };

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch(`/api/orders/${id}`).then(r => r.json()).then(d => { setOrder(d); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [session, id]);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading…</div>;
  if (!order || (order as { error?: string }).error) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <p style={{ fontFamily: 'Georgia, serif', color: '#6B5344' }}>Order not found</p>
      <Link href="/account" style={{ color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', textDecoration: 'underline' }}>Back to account</Link>
    </div>
  );

  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const StatusIcon = STATUS_ICONS[order.status as keyof typeof STATUS_ICONS] || Package;

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={14} /> BACK TO ORDERS
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>ORDER</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>#{order.orderNumber}</h1>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.25rem' }}>
              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span style={{ backgroundColor: `${STATUS_COLOR[order.status] || '#9B8578'}20`, color: STATUS_COLOR[order.status] || '#9B8578', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '6px 16px', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StatusIcon size={14} /> {order.status}
          </span>
        </div>

        {/* Progress bar */}
        {order.status !== 'cancelled' && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: i <= stepIdx ? '#5C3317' : '#E8DFD0', margin: '0 auto 0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: i <= stepIdx ? '#FAF8F4' : '#9B8578', fontSize: '0.6rem', fontWeight: 'bold' }}>{i + 1}</span>
                  </div>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.06em', color: i <= stepIdx ? '#3D1F0D' : '#9B8578', textTransform: 'capitalize' }}>{s}</p>
                </div>
              ))}
            </div>
            <div style={{ height: '4px', backgroundColor: '#E8DFD0', borderRadius: '2px' }}>
              <div style={{ width: `${Math.min(((stepIdx) / (STATUS_STEPS.length - 1)) * 100, 100)}%`, height: '100%', backgroundColor: '#5C3317', borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Items */}
          <div style={{ border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Items Ordered</h2>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F0E8' }}>
                <div>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{item.name}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578', marginTop: '2px' }}>{item.volume} × {item.quantity}</p>
                </div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>Subtotal</span>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>Shipping</span>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E8DFD0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D' }}>TOTAL</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A' }}>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{ border: '1px solid #E8DFD0', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A', marginBottom: '1rem' }}>Shipping Address</h2>
            <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8' }}>
              <p><strong style={{ color: '#1A0F0A' }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p style={{ marginTop: '0.5rem' }}>{order.shippingAddress.email}</p>
              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
