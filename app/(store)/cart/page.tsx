'use client';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, Shield, Leaf, Truck, Tag, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface CheckoutForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'card' | 'digital_wallet';
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [payMethod, setPayMethod] = useState<'card' | 'digital_wallet'>('card');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; type: string; value: number } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  const subtotal = total();
  const shipping = subtotal > 1000 ? 0 : 99;
  const discount = promoApplied?.discount || 0;
  const orderTotal = subtotal + shipping - discount;

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    const res = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoInput.trim(), subtotal }),
    });
    const data = await res.json();
    setPromoLoading(false);
    if (res.ok) {
      setPromoApplied(data);
      toast.success(`Promo applied! You save ₹${data.discount.toFixed(2)}`);
    } else {
      toast.error(data.error);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return toast.error('Your cart is empty');
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.id,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            volume: i.volume,
          })),
          shippingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            street: data.street,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: 'US',
          },
          paymentMethod: payMethod,
          guestEmail: !session ? data.email : undefined,
          promoCode: promoApplied?.code,
          discount: promoApplied?.discount,
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error);
      clearCart();
      toast.success(`Order ${order.orderNumber} placed successfully! 🍯`);
      router.push(`/account/orders`);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', backgroundColor: '#FAF8F4' }}>
        <div style={{ fontSize: '4rem' }}>🍯</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A' }}>Your cart is empty</h2>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344' }}>Discover our rare vintage collection</p>
        <Link href="/shop">
          <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px 32px' }}>
            EXPLORE COLLECTION
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>YOUR SELECTION</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#1A0F0A', marginTop: '0.25rem' }}>Shopping Cart</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginTop: '0.25rem' }}>{items.length} Items</p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 mt-10">
          {/* Left */}
          <div>
            {/* Cart items */}
            <div style={{ borderTop: '1px solid #E8DFD0' }}>
              {items.map((item) => (
                <div key={`${item.id}-${item.volume}`} style={{ borderBottom: '1px solid #E8DFD0', padding: '1.5rem 0' }} className="flex gap-5">
                  <div style={{ backgroundColor: '#F0E8DA', width: 88, height: 88, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    {item.image && !item.image.startsWith('/placeholder') ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍯</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>{item.name}</p>
                        {item.origin && (
                          <span style={{ backgroundColor: '#F0E8DA', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.06em', padding: '2px 8px', display: 'inline-block', marginTop: '0.25rem' }}>
                            Origin: {item.origin}
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div style={{ border: '1px solid #C4A882', display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => updateQuantity(item.id, item.volume, item.quantity - 1)} style={{ padding: '6px 12px', color: '#5C3317' }}><Minus size={12} /></button>
                        <span style={{ padding: '6px 16px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', borderLeft: '1px solid #C4A882', borderRight: '1px solid #C4A882' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.volume, item.quantity + 1)} style={{ padding: '6px 12px', color: '#5C3317' }}><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.volume)} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.06em', color: '#9B8578', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={10} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details */}
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-10">
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>SECURE TRANSFER</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginTop: '0.25rem', marginBottom: '1.5rem' }}>Delivery Details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                    <input
                      {...register('email', { required: true })}
                      defaultValue={session?.user?.email || ''}
                      placeholder="elara.vance@example.com"
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${errors.email ? '#c0392b' : '#C4A882'}`, padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>PHONE NUMBER</label>
                    <input
                      {...register('phone')}
                      placeholder="+1 (555) 000-0000"
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>FIRST NAME</label>
                    <input
                      {...register('firstName', { required: true })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${errors.firstName ? '#c0392b' : '#C4A882'}`, padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>LAST NAME</label>
                    <input
                      {...register('lastName', { required: true })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${errors.lastName ? '#c0392b' : '#C4A882'}`, padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>ADDRESS</label>
                  <input
                    {...register('street', { required: true })}
                    placeholder="Street Address"
                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${errors.street ? '#c0392b' : '#C4A882'}`, padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'CITY', name: 'city' as const },
                    { label: 'STATE', name: 'state' as const },
                    { label: 'POSTAL CODE', name: 'postalCode' as const },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
                      <input
                        {...register(name, { required: true })}
                        style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${errors[name] ? '#c0392b' : '#C4A882'}`, padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="mt-10">
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578' }}>FINISHING TOUCHES</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginTop: '0.25rem', marginBottom: '1.5rem' }}>Payment Method</h2>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'card', icon: '💳', title: 'Credit or Debit Card', sub: 'VISA, MASTERCARD, AMEX' },
                    { id: 'digital_wallet', icon: '🏛', title: 'Digital Wallet', sub: 'APPLE PAY / GPAY' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as 'card' | 'digital_wallet')}
                      style={{
                        border: `1px solid ${payMethod === m.id ? '#5C3317' : '#C4A882'}`,
                        backgroundColor: payMethod === m.id ? 'rgba(92,51,23,0.05)' : 'transparent',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A' }}>{m.title}</p>
                        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#9B8578', letterSpacing: '0.06em' }}>{m.sub}</p>
                      </div>
                      <div style={{ marginLeft: 'auto', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #5C3317', backgroundColor: payMethod === m.id ? '#5C3317' : 'transparent' }} />
                    </button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <div style={{ border: '1px solid #E8DFD0', padding: '1.5rem', backgroundColor: '#FAF8F4' }} className="space-y-5">
                    <div>
                      <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>CARD NUMBER</label>
                      <input
                        {...register('cardNumber')}
                        placeholder="0000 0000 0000 0000"
                        style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>EXPIRY DATE</label>
                        <input
                          {...register('expiry')}
                          placeholder="MM / YY"
                          style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>CVC</label>
                        <input
                          {...register('cvc')}
                          placeholder="•••"
                          style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div style={{ backgroundColor: '#3D1F0D', padding: '2rem', position: 'sticky', top: '80px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FAF8F4', marginBottom: '1.5rem' }}>Order Summary</h2>

              {/* Promo code field */}
              <div style={{ marginBottom: '1.25rem' }}>
                {promoApplied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={14} style={{ color: '#34D399' }} />
                      <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#FAF8F4', letterSpacing: '0.06em' }}>
                        {promoApplied.code}
                      </span>
                    </div>
                    <button
                      onClick={() => { setPromoApplied(null); setPromoInput(''); }}
                      style={{ background: 'none', border: 'none', color: '#C4A882', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '10px 12px' }}>
                      <Tag size={13} style={{ color: '#A0622A', flexShrink: 0 }} />
                      <input
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder="PROMO CODE"
                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#FAF8F4' }}
                      />
                    </div>
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading || !promoInput}
                      style={{ backgroundColor: '#A0622A', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', padding: '10px 14px', border: 'none', cursor: promoInput ? 'pointer' : 'default', opacity: promoInput ? 1 : 0.5 }}
                    >
                      {promoLoading ? '…' : 'APPLY'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}` },
                  { label: 'Boutique Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}` },
                  ...(promoApplied ? [{ label: `Promo (${promoApplied.code})`, value: `-₹${discount.toFixed(2)}`, green: true }] : []),
                ].map(({ label, value, green }: { label: string; value: string; green?: boolean }) => (
                  <div key={label} className="flex justify-between">
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: green ? '#34D399' : '#C4A882' }}>{label}</span>
                    <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: green ? '#34D399' : '#FAF8F4' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '1.25rem', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: '#C4A882' }}>TOTAL AMOUNT</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#FAF8F4' }}>₹{orderTotal.toFixed(2)}</span>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={placing}
                style={{ width: '100%', backgroundColor: '#FAF8F4', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '16px', marginTop: '1.5rem', cursor: placing ? 'wait' : 'pointer' }}
                className="hover:bg-[#F0E8DA] transition-colors disabled:opacity-60"
              >
                {placing ? 'PLACING ORDER...' : 'FINALIZE ORDER'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.75rem' }}>
                <Shield size={12} style={{ color: '#A0622A' }} />
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#A0622A' }}>ENCRYPTED TRANSACTION</span>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Leaf size={16} style={{ color: '#A0622A', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#FAF8F4', fontWeight: '600' }}>Eco-Conscious Promise</p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#C4A882', marginTop: '0.2rem', lineHeight: '1.5' }}>Each order is packed in 100% biodegradable materials with zero plastic waste.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Truck size={16} style={{ color: '#A0622A', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#FAF8F4', fontWeight: '600' }}>Carbon Neutral Delivery</p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#C4A882', marginTop: '0.2rem', lineHeight: '1.5' }}>We offset the carbon footprint of every delivery through reforestation projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
