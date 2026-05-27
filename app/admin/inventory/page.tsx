'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Product } from '@/types';


interface ProductForm {
  name: string;
  price: string;
  pricePerGram: string;
  description: string;
  shortDescription: string;
  stock: string;
  isFeatured: boolean;
  isRareHarvest: boolean;
  badge: string;
  flavour: string;
  features: string;
  variants: Array<{ volume: string; price: string }>;
  images: string[];
  amazonUrl: string;
  flipkartUrl: string;
}

const empty: ProductForm = {
  name: '', price: '', pricePerGram: '', description: '', shortDescription: '', stock: '100',
  isFeatured: false, isRareHarvest: false, badge: '', flavour: '', features: '',
  variants: [{ volume: '250gm', price: '' }, { volume: '500gm', price: '' }], images: [],
  amazonUrl: '', flipkartUrl: '',
};

export default function AdminInventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(empty);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const loadProducts = async () => {
    const res = await fetch('/api/products?limit=100');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => { if (session?.user?.role === 'admin') loadProducts(); }, [session]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
    toast.success(`${urls.length} image(s) uploaded`);
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p._id);
    setForm({
      name: p.name, price: String(p.price), description: p.description,
      shortDescription: p.shortDescription || '', stock: String(p.stock),
      isFeatured: p.isFeatured, isRareHarvest: p.isRareHarvest, badge: p.badge || '',
      pricePerGram: p.pricePerGram ? String(p.pricePerGram) : '',
      flavour: p.flavour || '', features: p.features?.join('\n') || '',
      variants: p.variants?.length
        ? p.variants.map(v => ({ volume: v.volume, price: String(v.price) }))
        : (p.volume || ['250gm', '500gm']).map(v => ({ volume: v, price: String(p.price) })),
      images: p.images || [],
      amazonUrl: p.amazonUrl || '', flipkartUrl: p.flipkartUrl || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const filledVariants = form.variants.filter(v => v.volume && v.price);
    if (!form.name || !filledVariants.length) return toast.error('Name and at least one variant with price are required');
    const minPrice = Math.min(...filledVariants.map(v => parseFloat(v.price)));
    const payload = {
      name: form.name, slug: autoSlug(form.name), price: minPrice,
      description: form.description, shortDescription: form.shortDescription,
      category: 'honey', stock: parseInt(form.stock),
      isFeatured: form.isFeatured, isRareHarvest: form.isRareHarvest,
      badge: form.badge, flavour: form.flavour,
      pricePerGram: form.pricePerGram ? parseFloat(form.pricePerGram) : undefined,
      features: form.features.split('\n').filter(Boolean),
      volume: filledVariants.map(v => v.volume),
      variants: filledVariants.map(v => ({ volume: v.volume, price: parseFloat(v.price) })),
      images: form.images,
      amazonUrl: form.amazonUrl, flipkartUrl: form.flipkartUrl,
    };
    const url = editing ? `/api/products/${editing}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) return toast.error('Save failed');
    toast.success(editing ? 'Product updated' : 'Product created');
    setShowModal(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) return toast.error('Delete failed');
    toast.success('Product deleted');
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  const inputStyle = {
    width: '100%', backgroundColor: 'transparent', border: 'none',
    borderBottom: '1px solid #C4A882', padding: '8px 0',
    fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem',
    color: '#1A0F0A', outline: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MANAGEMENT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Inventory</h1>
        </div>
        <button
          onClick={openNew}
          style={{ backgroundColor: '#5C3317', color: '#FAF8F4', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', cursor: 'pointer', border: 'none' }}
          className="hover:bg-[#3D1F0D] transition-colors"
        >
          <Plus size={14} /> ADD PRODUCT
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B5344', fontFamily: 'Georgia, serif' }}>Loading…</div>
      ) : (
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8DFD0' }}>
                  {['PRODUCT', 'COLLECTION', 'PRICE', 'STOCK', 'FEATURED', 'ACTIONS'].map((h) => (
                    <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', textAlign: 'left', padding: '1rem', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#F0E8DA', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                          {p.images?.[0] && !p.images[0].startsWith('/placeholder') ? (
                            <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.2rem' }}>🍯</div>
                          )}
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{p.name}</p>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578' }}>{p.batchNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>{p.productCollection}</td>
                    <td style={{ padding: '1rem', fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>₹{p.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: p.stock < 20 ? '#DC2626' : p.stock < 50 ? '#D97706' : '#059669', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', fontWeight: '600' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.isFeatured ? '#059669' : '#E8DFD0', display: 'inline-block' }} />
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => openEdit(p)} style={{ color: '#5C3317', background: 'none', cursor: 'pointer', border: 'none', padding: '4px' }}>
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} style={{ color: '#DC2626', background: 'none', cursor: 'pointer', border: 'none', padding: '4px' }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No products. Add your first product!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FAF8F4', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#9B8578', background: 'none', cursor: 'pointer', border: 'none' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.5rem' }}>
              {editing ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="grid grid-cols-2 gap-5">
              {/* Name */}
              <div className="col-span-2">
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>PRODUCT NAME *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Highland Wildflower Honey" />
              </div>
              {/* Price per gram */}
              <div>
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>
                  PRICE PER GRAM (₹/gm)
                  {form.variants.some(v => v.volume && v.price) && (
                    <button
                      type="button"
                      onClick={() => {
                        const first = form.variants.find(v => v.volume && v.price);
                        if (first) {
                          const grams = parseFloat(first.volume);
                          const price = parseFloat(first.price);
                          if (grams > 0 && price > 0) setForm(f => ({ ...f, pricePerGram: (price / grams).toFixed(2) }));
                        }
                      }}
                      style={{ marginLeft: '8px', color: '#A0622A', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      auto-calc
                    </button>
                  )}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #C4A882' }}>
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.9rem', color: '#5C3317', paddingRight: '6px' }}>₹</span>
                  <input type="number" step="0.01" value={form.pricePerGram} onChange={(e) => setForm({ ...form, pricePerGram: e.target.value })} style={{ ...inputStyle, borderBottom: 'none', flex: 1 }} placeholder="2.85" />
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', paddingLeft: '4px' }}>/gm</span>
                </div>
              </div>
              {/* Stock */}
              <div>
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>STOCK</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
              </div>
              {/* Flavour */}
              <div>
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>FLAVOUR *</label>
                <input value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })} style={inputStyle} placeholder="Floral, Woody, Sweet, Earthy…" />
              </div>
              {/* Badge */}
              <div>
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>BADGE</label>
                <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} style={inputStyle} placeholder="RARE VINTAGE" />
              </div>
              {/* Short desc */}
              <div className="col-span-2">
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>SHORT DESCRIPTION</label>
                <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} style={inputStyle} />
              </div>
              {/* Description */}
              <div className="col-span-2">
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>DESCRIPTION</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                  style={{ ...inputStyle, resize: 'vertical', borderBottom: 'none', border: '1px solid #C4A882', padding: '8px' }} />
              </div>
              {/* Features */}
              <div className="col-span-2">
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.35rem' }}>FEATURES (one per line)</label>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3}
                  style={{ ...inputStyle, resize: 'vertical', borderBottom: 'none', border: '1px solid #C4A882', padding: '8px' }}
                  placeholder="Certified Organic & Raw&#10;Single Estate Origin&#10;Sustainably Wild-Foraged" />
              </div>
              {/* Variants */}
              <div className="col-span-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578' }}>VARIANTS — VOLUME &amp; PRICE *</label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { volume: '', price: '' }] }))}
                    style={{ color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >+ Add variant</button>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      value={v.volume}
                      onChange={e => setForm(f => ({ ...f, variants: f.variants.map((x, j) => j === i ? { ...x, volume: e.target.value } : x) }))}
                      style={{ ...inputStyle, flex: '0 0 110px' }}
                      placeholder="250gm"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #C4A882', flex: 1 }}>
                      <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.9rem', color: '#5C3317', paddingRight: '4px' }}>₹</span>
                      <input
                        type="number"
                        value={v.price}
                        onChange={e => setForm(f => ({ ...f, variants: f.variants.map((x, j) => j === i ? { ...x, price: e.target.value } : x) }))}
                        style={{ ...inputStyle, borderBottom: 'none', flex: 1 }}
                        placeholder="999"
                      />
                    </div>
                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remove variant"
                        onClick={() => setForm(f => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }))}
                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#9B8578', marginTop: '4px' }}>
                  e.g. 250gm → ₹499, 500gm → ₹899. The lowest price becomes the product base price.
                </p>
              </div>
              {/* Marketplace URLs */}
              <div className="col-span-2">
                <div style={{ borderTop: '1px solid #E8DFD0', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', marginBottom: '1rem' }}>MARKETPLACE LINKS (optional)</p>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF9900"/>
                          <path d="M16.5 14.5c-1.2.8-2.6 1.3-4 1.5l-.5.1c-.5 0-.9-.1-1.3-.3-.8-.4-1.3-1.2-1.3-2.1 0-.6.2-1.1.5-1.5.5-.6 1.3-.9 2.1-.9h1.5v-.5c0-.4-.1-.7-.4-.9-.3-.2-.7-.3-1.2-.3-.8 0-1.5.2-2.1.5l-.3-1c.8-.4 1.7-.6 2.6-.6.9 0 1.7.2 2.2.6.6.5.9 1.1.9 2v2.4c0 .4.2.7.5.7v1c-.5 0-.9-.1-1.1-.3-.1-.1-.2-.3-.2-.4zm-2.3-.5c.5 0 .9-.1 1.3-.3v-1h-1.4c-.8 0-1.2.3-1.2.9 0 .6.4.9 1.1.9l.2-.5z" fill="white"/>
                        </svg>
                        AMAZON URL
                      </label>
                      <input
                        type="url"
                        value={form.amazonUrl}
                        onChange={(e) => setForm({ ...form, amazonUrl: e.target.value })}
                        style={inputStyle}
                        placeholder="https://amazon.com/dp/..."
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#2874F0"/>
                          <path d="M6 7h4.5l2 5 2-5H19l-4.5 10H10L6 7z" fill="white"/>
                        </svg>
                        FLIPKART URL
                      </label>
                      <input
                        type="url"
                        value={form.flipkartUrl}
                        onChange={(e) => setForm({ ...form, flipkartUrl: e.target.value })}
                        style={inputStyle}
                        placeholder="https://flipkart.com/p/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                {[['isFeatured', 'Featured'], ['isRareHarvest', 'Rare Harvest']] .map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form[key as 'isFeatured']} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} style={{ accentColor: '#5C3317' }} />
                    {label}
                  </label>
                ))}
              </div>
              {/* Image upload */}
              <div className="col-span-2">
                <label style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.5rem' }}>IMAGES</label>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files)} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{ border: '2px dashed #C4A882', padding: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                >
                  <Upload size={20} style={{ color: '#A0622A' }} />
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>
                    {uploading ? 'Uploading…' : 'Click to upload images'}
                  </span>
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578' }}>PNG, JPG, WEBP</span>
                </button>
                {form.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#F0E8DA', overflow: 'hidden', position: 'relative' }}>
                          <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#DC2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button onClick={() => setShowModal(false)} style={{ border: '1px solid #C4A882', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', background: 'none', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button onClick={handleSave} style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                className="hover:bg-[#3D1F0D] transition-colors">
                {editing ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
