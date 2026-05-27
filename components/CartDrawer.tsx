'use client';
import { useCartStore } from '@/lib/store';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          backgroundColor: '#FAF8F4',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          borderLeft: '1px solid #E8DFD0',
        }}
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid #E8DFD0' }}
          className="flex items-center justify-between px-6 py-5"
        >
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#6B5344' }}>YOUR SELECTION</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A' }}>Shopping Cart</h2>
          </div>
          <button onClick={toggleCart} className="text-[#6B5344] hover:text-[#1A0F0A]">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} style={{ color: '#C4A882' }} />
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#6B5344' }}>Your cart is empty</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>Discover our rare vintage collection</p>
              <button
                onClick={toggleCart}
                style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em' }}
                className="px-6 py-3 mt-2"
              >
                <Link href="/shop">EXPLORE COLLECTION</Link>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.volume}`} style={{ borderBottom: '1px solid #E8DFD0' }} className="pb-6">
                  <div className="flex gap-4">
                    <div
                      style={{ backgroundColor: '#F0E8DA', width: 80, height: 80, flexShrink: 0 }}
                      className="relative overflow-hidden"
                    >
                      {item.image && !item.image.startsWith('/placeholder') ? (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🍯</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>{item.name}</p>
                      {item.origin && (
                        <span style={{ backgroundColor: '#F0E8DA', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em' }} className="inline-block px-2 py-0.5 mt-1">
                          Origin: {item.origin}
                        </span>
                      )}
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#5C3317', marginTop: '0.25rem' }}>
                        ₹{item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div style={{ border: '1px solid #C4A882' }} className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.volume, item.quantity - 1)}
                            style={{ padding: '4px 10px', color: '#5C3317' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '4px 12px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', borderLeft: '1px solid #C4A882', borderRight: '1px solid #C4A882' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.volume, item.quantity + 1)}
                            style={{ padding: '4px 10px', color: '#5C3317' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.volume)}
                          style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em', color: '#9B8578' }}
                          className="flex items-center gap-1 hover:text-[#3D1F0D]"
                        >
                          <X size={10} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #E8DFD0' }} className="px-6 py-6">
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', letterSpacing: '0.06em', color: '#6B5344' }}>SUBTOTAL</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>₹{total().toFixed(2)}</span>
            </div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', marginBottom: '1rem' }}>
              Shipping calculated at checkout
            </p>
            <Link href="/cart" onClick={toggleCart}>
              <button
                style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em' }}
                className="w-full py-4 hover:bg-[#3D1F0D] transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
