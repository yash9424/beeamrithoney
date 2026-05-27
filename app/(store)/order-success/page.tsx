'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const total = params.get('total');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '540px', width: '100%', textAlign: 'center' }}>
        <CheckCircle size={56} style={{ color: '#27AE60', margin: '0 auto 1.5rem' }} />
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.5rem' }}>ORDER CONFIRMED</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#1A0F0A', lineHeight: '1.2' }}>Thank you for your order! 🍯</h1>
        {orderNumber && (
          <div style={{ backgroundColor: '#3D1F0D', padding: '1.25rem 2rem', margin: '2rem auto', display: 'inline-block' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#A0622A' }}>ORDER NUMBER</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#FAF8F4', marginTop: '0.25rem' }}>#{orderNumber}</p>
            {total && <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#C4A882', marginTop: '0.25rem' }}>Total: ${parseFloat(total).toFixed(2)}</p>}
          </div>
        )}
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', marginBottom: '2.5rem' }}>
          A confirmation email has been sent to you. Your honey is being packed in 100% biodegradable materials and will ship within 2–3 business days.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { icon: CheckCircle, label: 'Order Placed', done: true },
            { icon: Package, label: 'Packing', done: false },
            { icon: Truck, label: 'Shipped', done: false },
            { icon: Home, label: 'Delivered', done: false },
          ].map(({ icon: Icon, label, done }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <Icon size={22} style={{ color: done ? '#27AE60' : '#C4A882', margin: '0 auto 0.35rem' }} />
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', color: done ? '#27AE60' : '#9B8578' }}>{label.toUpperCase()}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account">
            <button style={{ border: '1px solid #5C3317', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '12px 24px', background: 'none', cursor: 'pointer' }}>
              VIEW MY ORDERS
            </button>
          </Link>
          <Link href="/shop">
            <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '12px 24px', border: 'none', cursor: 'pointer' }}>
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><OrderSuccessContent /></Suspense>;
}
