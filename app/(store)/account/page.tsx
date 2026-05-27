'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Package, User, Heart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  processing: '#D4A017',
  shipped: '#2980B9',
  delivered: '#27AE60',
  cancelled: '#E74C3C',
  pending: '#9B8578',
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist'>('overview');
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/orders').then((r) => r.json()).then(setOrders).catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    if (session && activeTab === 'wishlist') {
      setWishlistLoading(true);
      fetch('/api/wishlist')
        .then(r => r.json())
        .then(d => { setWishlist(Array.isArray(d) ? d : []); setWishlistLoading(false); })
        .catch(() => setWishlistLoading(false));
    }
  }, [session, activeTab]);

  const removeFromWishlist = async (productId: string) => {
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productId }),
    });
    setWishlist(prev => prev.filter(p => p._id !== productId));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1,
      volume: product.volume?.[0] || '',
      origin: product.origin,
    });
    toast.success('Added to cart');
    toggleCart();
  };

  if (status === 'loading') return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading…</div>
  );
  if (!session) return null;

  const tabs = [
    ['overview', 'Overview', User],
    ['orders', 'My Orders', Package],
    ['wishlist', 'Wishlist', Heart],
  ] as const;

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '1.2rem', color: '#FAF8F4', fontWeight: 'bold' }}>
              {session.user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>{session.user?.name}</h1>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>{session.user?.email}</p>
          </div>
          {session.user?.role === 'admin' && (
            <Link href="/admin" style={{ marginLeft: 'auto', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '10px 20px' }}>
              ADMIN PANEL →
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #E8DFD0', display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              style={{
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                color: activeTab === id ? '#1A0F0A' : '#9B8578',
                paddingBottom: '0.75rem',
                borderBottom: activeTab === id ? '2px solid #5C3317' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <Icon size={14} />
              {label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Total Orders', value: orders.length, icon: Package },
              { label: 'Account Type', value: session.user?.role === 'admin' ? 'Admin' : 'Member', icon: User },
              { label: 'Wishlist Items', value: '—', icon: Heart },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ border: '1px solid #E8DFD0', padding: '1.5rem', backgroundColor: '#FAF8F4' }}>
                <Icon size={20} style={{ color: '#A0622A', marginBottom: '0.75rem' }} />
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#9B8578' }}>{label.toUpperCase()}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A', marginTop: '0.25rem' }}>{value}</p>
              </div>
            ))}
            {orders.length > 0 && (
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #E8DFD0', paddingTop: '1.5rem' }}>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '1rem' }}>MOST RECENT ORDER</p>
                <Link href={`/order/${orders[0]._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ border: '1px solid #E8DFD0', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
                    className="hover:bg-[#F5F0E8] transition-colors">
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>#{orders[0].orderNumber}</p>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.2rem' }}>
                        {new Date(orders[0].createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ backgroundColor: `${STATUS_COLORS[orders[0].status] || '#9B8578'}20`, color: STATUS_COLORS[orders[0].status] || '#9B8578', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 12px', textTransform: 'capitalize' }}>
                        {orders[0].status}
                      </span>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>₹{orders[0].total.toFixed(2)}</p>
                      <ArrowRight size={16} style={{ color: '#9B8578' }} />
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#6B5344' }}>No orders yet</p>
                <Link href="/shop">
                  <button type="button" style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '12px 24px', marginTop: '1rem', border: 'none', cursor: 'pointer' }}>
                    SHOP NOW
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link key={order._id} href={`/order/${order._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ border: '1px solid #E8DFD0', padding: '1.5rem' }} className="hover:bg-[#F5F0E8] transition-colors cursor-pointer">
                      <div className="flex justify-between items-start flex-wrap gap-3">
                        <div>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#9B8578' }}>ORDER</p>
                          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A' }}>#{order.orderNumber}</p>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.25rem' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ backgroundColor: `${STATUS_COLORS[order.status] || '#9B8578'}20`, color: STATUS_COLORS[order.status] || '#9B8578', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 12px', textTransform: 'capitalize' }}>
                            {order.status}
                          </span>
                          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A' }}>₹{order.total.toFixed(2)}</p>
                          <ArrowRight size={16} style={{ color: '#9B8578' }} />
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {order.items.map((item, i) => (
                          <span key={i} style={{ backgroundColor: '#F0E8DA', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', padding: '4px 10px' }}>
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading wishlist…</div>
            ) : wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍯</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#6B5344' }}>Your wishlist is empty</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#9B8578', marginTop: '0.5rem' }}>
                  Save your favourite honeys to buy later
                </p>
                <Link href="/shop">
                  <button type="button" style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '12px 24px', marginTop: '1.5rem', border: 'none', cursor: 'pointer' }}>
                    EXPLORE SHOP
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} style={{ border: '1px solid #E8DFD0', backgroundColor: '#FAF8F4', overflow: 'hidden' }}>
                    <Link href={`/product/${product.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '1', backgroundColor: '#F0E8DA' }}>
                      {product.images?.[0] && !product.images[0].startsWith('/placeholder') ? (
                        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🍯</div>
                      )}
                    </Link>
                    <div style={{ padding: '1rem' }}>
                      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>{product.name}</p>
                      </Link>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#5C3317', marginTop: '0.25rem' }}>₹{product.price.toFixed(2)}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => moveToCart(product)}
                          style={{ flex: 1, backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', padding: '10px', border: 'none', cursor: 'pointer' }}
                        >
                          ADD TO CART
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product._id)}
                          aria-label="Remove from wishlist"
                          style={{ border: '1px solid #E8DFD0', background: 'none', padding: '10px 12px', cursor: 'pointer', color: '#9B8578' }}
                        >
                          <Heart size={14} fill="#DC2626" color="#DC2626" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
