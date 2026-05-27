'use client';
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COLLECTIONS = [
  { label: 'Wildflower Reserve', count: 12 },
  { label: 'Highland Monofloral', count: 8 },
  { label: 'Forest Infusions', count: 5 },
];
const VOLUMES = ['250GM', '350GM', '500GM'];
const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [collection, setCollection] = useState('');
  const [volume, setVolume] = useState('');
  const [sort, setSort] = useState('Newest Arrivals');
  const [search, setSearch] = useState('');
  const limit = 9;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (collection) params.set('collection', collection);
    if (volume) params.set('volume', volume.toLowerCase());
    if (search) params.set('search', search);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    let prods: Product[] = data.products || [];
    if (sort === 'Price: Low to High') prods = [...prods].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') prods = [...prods].sort((a, b) => b.price - a.price);
    setProducts(prods);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, collection, volume, sort, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const pages = Math.ceil(total / limit);

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1A0F0A', lineHeight: '1.1' }}>
          Rare Vintage<br />Harvest
        </h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', marginTop: '1rem', maxWidth: '480px', lineHeight: '1.6' }}>
          Discover our curated collection of organic, single-origin honeys. Each jar is a seasonal expression of the local flora, meticulously aged to achieve a viscous, complex flavor profile.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16 flex gap-10">
        {/* Sidebar filters */}
        <aside style={{ width: '200px', flexShrink: 0 }} className="hidden lg:block">
          {/* Search */}
          <div style={{ borderBottom: '1px solid #E8DFD0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search honeys..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '6px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#1A0F0A', outline: 'none' }}
            />
          </div>

          {/* Collections */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>COLLECTIONS</p>
            {COLLECTIONS.map((c) => (
              <button
                key={c.label}
                onClick={() => { setCollection(collection === c.label ? '' : c.label); setPage(1); }}
                className="flex justify-between w-full py-1.5 text-left"
                style={{
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontSize: '0.78rem',
                  color: collection === c.label ? '#1A0F0A' : '#6B5344',
                  fontWeight: collection === c.label ? 'bold' : 'normal',
                }}
              >
                <span>{c.label}</span>
                <span style={{ color: '#9B8578', fontSize: '0.7rem' }}>({c.count})</span>
              </button>
            ))}
          </div>

          {/* Volume */}
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>VOLUME</p>
            <div className="flex flex-wrap gap-2">
              {VOLUMES.map((v) => (
                <button
                  key={v}
                  onClick={() => { setVolume(volume === v ? '' : v); setPage(1); }}
                  style={{
                    border: '1px solid',
                    borderColor: volume === v ? '#5C3317' : '#C4A882',
                    backgroundColor: volume === v ? '#5C3317' : 'transparent',
                    color: volume === v ? '#FAF8F4' : '#5C3317',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    padding: '6px 12px',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>
              Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} Results
            </p>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#1A0F0A', backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div style={{ backgroundColor: '#F0E8DA', aspectRatio: '1', marginBottom: '1rem' }} className="animate-pulse" />
                  <div style={{ backgroundColor: '#E8DFD0', height: '14px', width: '70%', marginBottom: '8px' }} className="animate-pulse" />
                  <div style={{ backgroundColor: '#E8DFD0', height: '12px', width: '40%' }} className="animate-pulse" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#6B5344' }}>No products found</p>
              <button onClick={() => { setCollection(''); setVolume(''); setSearch(''); }} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#5C3317', textDecoration: 'underline', marginTop: '0.75rem' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ color: '#6B5344' }}
                className="disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    fontSize: '0.8rem',
                    width: '32px',
                    height: '32px',
                    backgroundColor: page === i + 1 ? '#5C3317' : 'transparent',
                    color: page === i + 1 ? '#FAF8F4' : '#6B5344',
                    borderRadius: '50%',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                style={{ color: '#6B5344' }}
                className="disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <section style={{ backgroundColor: '#F5F0E8', borderTop: '1px solid #E8DFD0' }} className="px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#1A0F0A' }}>The Beeamrit Journal</h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', marginTop: '0.5rem' }}>
            Join our private circle for early access to seasonal harvests and stories from the hive.
          </p>
          <div className="flex gap-3 mt-6">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', outline: 'none', color: '#1A0F0A' }}
            />
            <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', padding: '8px 20px' }}>
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
