'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { Minus, Plus, Shield, Truck, Star, Send } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: { name: string };
  createdAt: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div style={{ display: 'flex', gap: '4px' }} aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          aria-label={`Rate ${s} star${s !== 1 ? 's' : ''}`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => { if (onChange) setHover(s); }}
          onMouseLeave={() => { if (onChange) setHover(0); }}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 0 }}
        >
          <Star
            size={18}
            fill={active >= s ? '#A0622A' : 'none'}
            color={active >= s ? '#A0622A' : '#C4A882'}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d);
        setSelectedVolume(d.variants?.[0]?.volume || d.volume?.[0] || '250gm');
        setLoading(false);
        // Fetch related products by same productCollection
        if (d._id) {
          fetch(`/api/products?limit=5${d.productCollection ? `&collection=${encodeURIComponent(d.productCollection)}` : ''}`)
            .then(r => r.json())
            .then(rel => {
              const list: Product[] = rel.products || rel;
              setRelated(Array.isArray(list) ? list.filter((p: Product) => p._id !== d._id).slice(0, 4) : []);
            })
            .catch(() => {});
          fetch(`/api/reviews?product=${d._id}`)
            .then(r => r.json())
            .then(rev => setReviews(Array.isArray(rev) ? rev : []))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return toast.error('Please log in to leave a review');
    if (!product) return;
    setSubmittingReview(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: product._id, rating: reviewRating, comment: reviewComment }),
    });
    const data = await res.json();
    setSubmittingReview(false);
    if (res.ok) {
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      setReviews(prev => [data, ...prev]);
    } else {
      toast.error(data.error || 'Failed to submit review');
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleAdd = () => {
    if (!product) return;
    const variantPrice = product.variants?.find(v => v.volume === selectedVolume)?.price ?? product.price;
    addItem({
      id: product._id,
      name: product.name,
      price: variantPrice,
      image: product.images?.[0] || '',
      quantity: qty,
      volume: selectedVolume,
      origin: product.origin,
    });
    toast.success('Added to cart');
    toggleCart();
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading...</div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A' }}>Product not found</p>
      <Link href="/shop" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', color: '#5C3317', textDecoration: 'underline' }}>
        Back to Shop
      </Link>
    </div>
  );

  const hasRealImages = product.images?.length > 0 && !product.images[0].startsWith('/placeholder');

  return (
    <div style={{ backgroundColor: '#FAF8F4' }}>
      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div style={{ backgroundColor: '#F0E8DA', aspectRatio: '1', position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
              {hasRealImages ? (
                <Image src={product.images[activeImage]} alt={product.name} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '8rem' }}>🍯</div>
              )}
            </div>
            {hasRealImages && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: '80px',
                      height: '80px',
                      position: 'relative',
                      overflow: 'hidden',
                      border: activeImage === i ? '2px solid #5C3317' : '2px solid transparent',
                    }}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
            {!hasRealImages && (
              <div className="flex gap-3">
                {['🍯', '🐝', '🌸', '🍃'].map((emoji, i) => (
                  <div
                    key={i}
                    style={{ width: '80px', height: '80px', backgroundColor: '#F0E8DA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: i === activeImage ? '2px solid #5C3317' : '2px solid transparent', cursor: 'pointer' }}
                    onClick={() => setActiveImage(i)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-4">
              {product.badge && (
                <span style={{ border: '1px solid #C4A882', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#5C3317', padding: '4px 10px' }}>
                  {product.badge}
                </span>
              )}
              {product.batchNumber && (
                <span style={{ border: '1px solid #C4A882', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#5C3317', padding: '4px 10px' }}>
                  {product.batchNumber}
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#1A0F0A', lineHeight: '1.15' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.75rem' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#5C3317' }}>
                ₹{(product.variants?.find(v => v.volume === selectedVolume)?.price ?? product.price).toFixed(2)}
              </p>
              {product.pricePerGram ? (
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', backgroundColor: '#F0E8DA', padding: '2px 8px' }}>
                  ₹{product.pricePerGram.toFixed(2)}/gm
                </span>
              ) : null}
            </div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', marginTop: '1rem' }}>
              {product.description}
            </p>

            {/* Features */}
            {product.features?.length > 0 && (
              <ul style={{ marginTop: '1.25rem' }} className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#3D1F0D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#A0622A' }}>◎</span> {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity + Volume */}
            <div className="flex gap-6 mt-6 items-end">
              <div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#9B8578', marginBottom: '0.5rem' }}>QUANTITY</p>
                <div style={{ border: '1px solid #C4A882', display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '10px 14px', color: '#5C3317' }}><Minus size={14} /></button>
                  <span style={{ padding: '10px 18px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', borderLeft: '1px solid #C4A882', borderRight: '1px solid #C4A882' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ padding: '10px 14px', color: '#5C3317' }}><Plus size={14} /></button>
                </div>
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#9B8578', marginBottom: '0.5rem' }}>VOLUME</p>
                <select
                  value={selectedVolume}
                  onChange={(e) => setSelectedVolume(e.target.value)}
                  style={{ width: '100%', border: '1px solid #C4A882', backgroundColor: 'transparent', padding: '10px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#1A0F0A', outline: 'none', cursor: 'pointer' }}
                >
                  {product.variants?.length
                    ? product.variants.map(v => (
                        <option key={v.volume} value={v.volume}>{v.volume} — ₹{v.price.toFixed(2)}</option>
                      ))
                    : product.volume?.map(v => <option key={v}>{v}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Add to Cart */}
            <div style={{ marginTop: '1.5rem', border: '1px solid #5C3317', display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#5C3317', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: '#F0E8DA', width: '24px', height: '24px', borderRadius: '50%' }}></div>
              </div>
              <div style={{ flex: 1, padding: '0 16px' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.72rem', color: '#3D1F0D', fontStyle: 'italic' }}>
                  {product.name.toUpperCase()}
                </p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#5C3317' }}>₹{(product.variants?.find(v => v.volume === selectedVolume)?.price ?? product.price).toFixed(2)}</p>
              </div>
              <button
                onClick={handleAdd}
                style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '14px 20px' }}
                className="hover:bg-[#3D1F0D] transition-colors"
              >
                ADD TO CART
              </button>
            </div>

            {/* Marketplace buttons */}
            {(product.amazonUrl || product.flipkartUrl) && (
              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#9B8578', marginBottom: '0.6rem' }}>ALSO AVAILABLE ON</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.amazonUrl && (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
                        backgroundColor: '#FF9900', color: '#111',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', fontWeight: '800',
                        letterSpacing: '0.07em', padding: '13px 18px', textDecoration: 'none',
                        transition: 'filter 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      {/* Amazon: the signature curved smile/arrow */}
                      <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* "a" letterform */}
                        <ellipse cx="9" cy="7" rx="5.5" ry="6" stroke="#111" strokeWidth="2" fill="none"/>
                        <line x1="14.5" y1="2" x2="14.5" y2="14" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
                        {/* smile arrow */}
                        <path d="M3 14.5C8 18.5 19 18.5 24 14.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                        <path d="M21.5 12.5L24 14.5L21.5 16.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      amazon
                    </a>
                  )}
                  {product.flipkartUrl && (
                    <a
                      href={product.flipkartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
                        backgroundColor: '#2874F0', color: '#fff',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', fontWeight: '800',
                        letterSpacing: '0.07em', padding: '13px 18px', textDecoration: 'none',
                        transition: 'filter 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.88)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                      {/* Flipkart: yellow shopping bag with F */}
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="8" width="18" height="13" rx="2" fill="#FFE11A" stroke="#FFE11A" strokeWidth="0"/>
                        <path d="M7 8V6a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M7 12h8M7 12v5" stroke="#2874F0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 15h5" stroke="#2874F0" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                      flipkart
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-6 mt-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#6B5344' }}>
                <Truck size={14} style={{ color: '#A0622A' }} /> COMPLIMENTARY SHIPPING
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#6B5344' }}>
                <Shield size={14} style={{ color: '#A0622A' }} /> SECURE CHECKOUT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story section */}
      <section style={{ backgroundColor: '#F5F0E8' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>THE ALCHEMY OF NATURE</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#1A0F0A', lineHeight: '1.2', marginTop: '0.5rem' }}>
              Crafted by Wind,<br />Sun, and Bee
            </h2>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', marginTop: '1rem' }}>
              At Beeamrit, we believe in the &quot;Slow Honey&quot; movement. Our bees forage in protected sanctuaries where the air is thin and the flora is untouched by modern agriculture.
            </p>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', marginTop: '0.75rem' }}>
              The harvest process is an exercise in patience. We only extract surplus honey after the colony has secured its winter stores. Each jar is hand-filled and sealed with a custom-stamped metallic cap.
            </p>
            <Link href="/about" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#3D1F0D', textDecoration: 'underline', textUnderlineOffset: '4px', display: 'inline-block', marginTop: '1.25rem' }}>
              Learn about our sustainability →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div style={{ backgroundColor: '#3D1F0D', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🌄</div>
            <div className="space-y-4">
              {[
                { title: 'Highland Terroir', desc: 'Floral notes unique to our hives.' },
                { title: 'Purity First', desc: 'Zero filtration, zero additives.' },
              ].map((item) => (
                <div key={item.title} style={{ backgroundColor: '#FAF8F4', padding: '1rem' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>{item.title}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.25rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section style={{ backgroundColor: '#FAF8F4' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[1fr_400px] gap-12">
            {/* Reviews list */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>CUSTOMER REVIEWS</p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginTop: '0.25rem' }}>
                    {reviews.length > 0 ? `${avgRating.toFixed(1)} / 5` : 'No reviews yet'}
                  </h2>
                </div>
                {reviews.length > 0 && (
                  <div>
                    <StarRating value={Math.round(avgRating)} />
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', marginTop: '0.25rem' }}>
                      {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div style={{ border: '1px dashed #C4A882', padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', color: '#9B8578' }}>Be the first to review this honey.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.map(r => (
                    <div key={r._id} style={{ borderBottom: '1px solid #F5F0E8', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', fontWeight: '600' }}>
                            {r.user?.name || 'Anonymous'}
                          </p>
                          <div style={{ marginTop: '4px' }}><StarRating value={r.rating} /></div>
                        </div>
                        <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#9B8578' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.7', marginTop: '0.5rem' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write review form */}
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>Write a Review</h3>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1.5rem' }} />
              {!session ? (
                <div style={{ border: '1px solid #E8DFD0', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', marginBottom: '1rem' }}>
                    You must be logged in to leave a review.
                  </p>
                  <Link href="/login">
                    <button type="button" style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '12px 24px', border: 'none', cursor: 'pointer' }}>
                      LOG IN TO REVIEW
                    </button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>YOUR RATING</label>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>YOUR REVIEW</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this honey…"
                      style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #C4A882', padding: '10px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px', border: 'none', cursor: submittingReview ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Send size={14} /> {submittingReview ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ backgroundColor: '#F5F0E8' }} className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>YOU MAY ALSO LIKE</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A', marginTop: '0.25rem', marginBottom: '2rem' }}>
              From the Same Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <Link key={p._id} href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div>
                    <div style={{ backgroundColor: '#F0E8DA', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '0.75rem', position: 'relative', overflow: 'hidden' }}>
                      {p.images?.[0] && !p.images[0].startsWith('/placeholder') ? (
                        <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
                      ) : '🍯'}
                    </div>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>{p.name}</p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#5C3317', marginTop: '0.25rem' }}>
                      {p.variants?.length ? `From ₹${Math.min(...p.variants.map(v => v.price)).toFixed(2)}` : `₹${p.price.toFixed(2)}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
