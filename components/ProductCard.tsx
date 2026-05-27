'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1,
      volume: product.volume?.[0] || '350gm',
      origin: product.origin,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        style={{ backgroundColor: '#F0E8DA' }}
        className="relative overflow-hidden aspect-square mb-4"
      >
        {/* Badge */}
        {product.badge && (
          <span
            style={{
              backgroundColor: '#5C3317',
              color: '#FAF8F4',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
            }}
            className="absolute top-3 left-3 z-10 px-2 py-1"
          >
            {product.badge}
          </span>
        )}

        {product.images?.[0] && !product.images[0].startsWith('/placeholder') ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍯</div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(to top, rgba(61,31,13,0.6), transparent)' }}
        >
          <button
            onClick={handleAddToCart}
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              color: '#FAF8F4',
            }}
            className="w-full py-3 text-center hover:bg-[#5C3317] transition-colors"
          >
            ADD TO BASKET
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start">
          <h3
            style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}
            className="flex-1"
          >
            {product.name}
          </h3>
          <span
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: '0.85rem',
              color: '#5C3317',
              fontWeight: '500',
            }}
          >
            {product.variants?.length
              ? `From ₹${Math.min(...product.variants.map(v => v.price)).toFixed(2)}`
              : `₹${product.price.toFixed(2)}`}
          </span>
        </div>
        {product.shortDescription && (
          <p
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: '0.72rem',
              color: '#9B8578',
              lineHeight: '1.5',
              marginTop: '0.25rem',
            }}
            className="line-clamp-2"
          >
            {product.shortDescription}
          </p>
        )}
        {product.volume?.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.35rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', color: '#6B5344' }}>
              {product.volume[0]}
            </p>
            {product.pricePerGram ? (
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#A0622A', backgroundColor: '#F0E8DA', padding: '1px 6px' }}>
                ₹{product.pricePerGram.toFixed(2)}/gm
              </span>
            ) : null}
          </div>
        )}

        {/* Marketplace buttons */}
        {(product.amazonUrl || product.flipkartUrl) && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '0.65rem' }} onClick={e => e.preventDefault()}>
            {product.amazonUrl && (
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buy on Amazon"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: '#FF9900', color: '#111', padding: '7px 10px', fontSize: '0.6rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: '800', letterSpacing: '0.04em', textDecoration: 'none' }}
              >
                {/* Amazon: "a" + smile arrow */}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <ellipse cx="5.5" cy="4.5" rx="3.5" ry="4" stroke="#111" strokeWidth="1.5" fill="none"/>
                  <line x1="9" y1="1" x2="9" y2="9" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 9.5C5 12 13 12 16 9.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <path d="M14.5 8L16 9.5L14.5 11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                amazon
              </a>
            )}
            {product.flipkartUrl && (
              <a
                href={product.flipkartUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buy on Flipkart"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: '#2874F0', color: '#fff', padding: '7px 10px', fontSize: '0.6rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: '800', letterSpacing: '0.04em', textDecoration: 'none' }}
              >
                {/* Flipkart: yellow bag with F */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="5" width="12" height="8" rx="1.5" fill="#FFE11A"/>
                  <path d="M4.5 5V4a2.5 2.5 0 0 1 5 0v1" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                  <path d="M4.5 7.5h5M4.5 7.5v3" stroke="#2874F0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 9.5h3" stroke="#2874F0" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                flipkart
              </a>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
