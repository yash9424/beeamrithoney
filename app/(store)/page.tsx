import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Product as IProduct } from '@/types';
import HeroCarousel from '@/components/HeroCarousel';

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured: IProduct[] = await getFeaturedProducts();

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features bar */}
      <section style={{ backgroundColor: '#F5F0E8', borderTop: '1px solid #E8DFD0', borderBottom: '1px solid #E8DFD0' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⊕', title: '100% Organic', desc: 'Sourced from pesticide-free meadows and wild blossoms.' },
            { icon: '○', title: 'No Added Sugar', desc: 'Pure nectar, cold pressed to preserve every enzyme and flavor.' },
            { icon: '◎', title: 'Farm Sourced', desc: 'Single-origin harvests traceable back to individual hive clusters.' },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div style={{ fontSize: '1.2rem', color: '#A0622A', marginBottom: '0.5rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>{f.title}</h3>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginTop: '0.35rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Harvests */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>THE COLLECTION</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A', marginTop: '0.25rem' }}>Featured Harvests</h2>
          </div>
          <Link href="/shop" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#5C3317', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            VIEW ALL PRODUCTS
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Wildflower Gold', desc: '350gm / Limited Selection', price: '$42' },
              { name: 'Black Forest Rare', desc: '500gm / Vintage 2024', price: '$68' },
              { name: 'Manuka Gold MGO 500+', desc: '250gm / Premium Grade', price: '$245' },
            ].map((p) => (
              <div key={p.name} className="group">
                <div style={{ backgroundColor: '#F0E8DA', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '1rem' }} className="relative overflow-hidden">
                  🍯
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>{p.name}</h3>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', marginTop: '0.2rem' }}>{p.desc}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.9rem', color: '#5C3317', marginTop: '0.4rem' }}>{p.price}</p>
                <Link href="/shop">
                  <button style={{ border: '1px solid #C4A882', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', padding: '10px', width: '100%', color: '#5C3317', marginTop: '0.75rem' }}
                    className="hover:bg-[#5C3317] hover:text-white hover:border-[#5C3317] transition-colors">
                    ADD TO BASKET
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Origin Story */}
      <section style={{ backgroundColor: '#3D1F0D' }} className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div style={{ backgroundColor: '#2A150A', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
            🌿
          </div>
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A' }}>OUR ORIGIN STORY</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#FAF8F4', lineHeight: '1.2', marginTop: '0.75rem' }}>
              Harvested with<br />Quiet Respect.
            </h2>
            <div style={{ width: '40px', height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0' }}></div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', lineHeight: '1.8' }}>
              Beeamrit was founded on the belief that honey is not just a sweetener, but a vintage expression of a specific time and place.
            </p>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', lineHeight: '1.8', marginTop: '1rem' }}>
              Our beekeepers travel to the most remote corners of the world to set hives where nature remains undisturbed. By following the slow rhythm of the seasons, we produce limited batches of raw honey that retain the complex flavor profiles of their botanical origins.
            </p>
            <Link href="/journal" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#FAF8F4', textDecoration: 'underline', textUnderlineOffset: '4px', display: 'inline-block', marginTop: '1.5rem' }}>
              READ OUR JOURNAL
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: '#FAF8F4' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', textAlign: 'center' }}>FROM THE HIVE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1A0F0A', textAlign: 'center', marginTop: '0.5rem', marginBottom: '3rem' }}>A Taste of Perfection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: '"The Black Forest honey is transformative. I\'ve never tasted something so deep and complex. It\'s like fine wine for your palate."', author: 'ELZE ORDORI, CULINARY CRITIC' },
              { text: '"Pure elegance in a jar. From the sustainable packaging to the not-golden color, every detail screams quality."', author: 'MARCUS DANE, APOTHECARY OWNER' },
              { text: '"The Wildflower Gold has a floral brightness that I can\'t find anywhere else. Truly a rare harvest worth every penny."', author: 'DIANA LEWING, GASTRONOME' },
            ].map((t) => (
              <div key={t.author} className="text-center">
                <div style={{ color: '#A0622A', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', color: '#3D1F0D', fontStyle: 'italic', lineHeight: '1.7' }}>{t.text}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#9B8578', marginTop: '1rem' }}>{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ backgroundColor: '#3D1F0D' }} className="px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#FAF8F4' }}>The Beeamrit Journal</h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#C4A882', marginTop: '0.75rem', lineHeight: '1.6' }}>
            Join our private circle for early access to seasonal harvests and stories from the hive.
          </p>
          <div className="flex gap-3 mt-8">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #7C4A1E', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', padding: '10px 0', outline: 'none' }}
              className="placeholder-[#7C4A1E]"
            />
            <button style={{ backgroundColor: '#FAF8F4', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', padding: '10px 20px' }}
              className="hover:bg-[#F0E8DA] transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
