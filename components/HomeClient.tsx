'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { Product } from '@/types';

/* ── Reveal hook ─────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Reveal wrapper ──────────────────────────────────────── */
function Reveal({ children, delay = 0, dir = 'up' }: {
  children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' | 'none';
}) {
  const { ref, visible } = useReveal();
  const t: Record<string, string> = { up: 'translateY(36px)', left: 'translateX(-36px)', right: 'translateX(36px)', none: 'none' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : t[dir],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Counter ─────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let n = 0; const step = Math.ceil(to / 55);
    const id = setInterval(() => { n += step; if (n >= to) { setVal(to); clearInterval(id); } else setVal(n); }, 22);
    return () => clearInterval(id);
  }, [visible, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Marquee ─────────────────────────────────────────────── */
function Marquee({ dark = false }: { dark?: boolean }) {
  const words = ['RAW & UNFILTERED', '◎', 'COLD PRESSED', '◎', 'SINGLE ORIGIN', '◎', 'BATCH TRACED', '◎', 'CERTIFIED ORGANIC', '◎', 'COLONY FIRST', '◎'];
  return (
    <div style={{ backgroundColor: dark ? '#3D1F0D' : '#1A0F0A', padding: '14px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
        {[0, 1].map(r => (
          <div key={r} style={{ display: 'flex', gap: '2.5rem', flexShrink: 0, marginRight: '2.5rem' }}>
            {words.map((w, i) => (
              <span key={i} style={{
                fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.18em',
                color: w === '◎' ? '#A0622A' : '#C4A882', fontWeight: w !== '◎' ? '600' : '400',
              }}>{w}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function HomeClient({ products }: { products: Product[] }) {
  return (
    <div style={{ backgroundColor: '#FAF8F4', overflowX: 'hidden' }}>
      <style>{`
        @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }

        /* ── fill-up card (feature cards) ── */
        .fill-card {
          position: relative; overflow: hidden;
          transition: color 0.38s;
          cursor: default;
        }
        .fill-card::before {
          content: '';
          position: absolute; inset: 0;
          background: #3D1F0D;
          transform: translateY(101%);
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .fill-card:hover::before { transform: translateY(0); }
        .fill-card > * { position: relative; z-index: 1; }
        .fill-card .fc-sym  { transition: color 0.38s; }
        .fill-card .fc-title{ transition: color 0.38s; }
        .fill-card .fc-desc { transition: color 0.38s; }
        .fill-card:hover .fc-sym  { color: #FAF8F4 !important; }
        .fill-card:hover .fc-title{ color: #FAF8F4 !important; }
        .fill-card:hover .fc-desc { color: #C4A882 !important; }

        /* ── fill-up stat card (numbers section) ── */
        .stat-card {
          position: relative; overflow: hidden;
          transition: all 0.38s;
        }
        .stat-card::before {
          content: '';
          position: absolute; inset: 0;
          background: #A0622A;
          transform: translateY(101%);
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .stat-card:hover::before { transform: translateY(0); }
        .stat-card > * { position: relative; z-index: 1; }
        .stat-card .sc-num   { transition: color 0.38s; }
        .stat-card .sc-label { transition: color 0.38s; }
        .stat-card:hover .sc-num   { color: #FAF8F4 !important; }
        .stat-card:hover .sc-label { color: rgba(250,248,244,0.7) !important; }
      `}</style>

      {/* ── 1. TRUST STRIP ──────────────────────────────────── */}
      <Marquee />

      {/* ── 2. FEATURES BAR ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', borderBottom: '1px solid #E8DFD0', padding: '3rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0" style={{ backgroundColor: '#E8DFD0' }}>
          {[
            { sym: '⊕', title: '100% Organic', desc: 'Sourced from pesticide-free meadows and wild highland blossoms.' },
            { sym: '○', title: 'Cold Pressed Only', desc: 'Every batch pressed below 35°C to preserve every enzyme and aroma.' },
            { sym: '◎', title: 'Single Origin', desc: 'Each harvest is traceable back to a specific hive cluster and season.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.12} dir="up">
              <div className="fill-card" style={{ backgroundColor: '#F5F0E8', padding: '2.5rem 2rem', textAlign: 'center', height: '100%' }}>
                <div className="fc-sym" style={{ fontSize: '1.4rem', color: '#A0622A', marginBottom: '0.75rem' }}>{f.sym}</div>
                <h3 className="fc-title" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p className="fc-desc" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURED HARVESTS ────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9B8578', marginBottom: '0.4rem' }}>THE COLLECTION</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1A0F0A' }}>Featured Harvests</h2>
              </div>
              <Link href="/shop" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: '#5C3317', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                VIEW ALL →
              </Link>
            </div>
          </Reveal>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <Reveal key={p._id} delay={i * 0.08} dir="up">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            /* Placeholder cards when no products */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Wildflower Gold', desc: 'Limited Selection', price: '₹3,500' },
                { name: 'Black Forest Rare', desc: 'Vintage 2024', price: '₹5,800' },
                { name: 'Manuka MGO 500+', desc: 'Premium Grade', price: '₹20,500' },
              ].map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1} dir="up">
                  <Link href="/shop" style={{ textDecoration: 'none' }}>
                    <div>
                      <div style={{ backgroundColor: '#F0E8DA', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '1rem', animation: `float ${3 + i * 0.5}s ease-in-out infinite` }}>🍯</div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>{p.name}</h3>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', marginTop: '0.2rem' }}>{p.desc}</p>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#5C3317', marginTop: '0.4rem' }}>{p.price}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. CINEMATIC ORIGIN TEASER ──────────────────────── */}
      <section style={{ position: 'relative', minHeight: '560px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img src="/uploads/origin-story.png" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,5,2,0.93) 0%, rgba(30,15,6,0.7) 55%, rgba(0,0,0,0.3) 100%)' }} />
        <div className="max-w-6xl mx-auto px-6 py-20 w-full" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '560px' }}>
            <Reveal dir="left">
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.22em', color: '#A0622A', marginBottom: '1rem' }}>OUR ORIGIN STORY</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#FAF8F4', lineHeight: 1.15, fontStyle: 'italic' }}>
                Harvested with<br />quiet respect.
              </h2>
              <div style={{ width: '48px', height: '2px', backgroundColor: '#A0622A', margin: '1.75rem 0' }} />
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.86rem', color: '#C4A882', lineHeight: 1.85, marginBottom: '2rem' }}>
                Every jar begins with a decision not to interfere. Our beekeepers travel to where nature is undisturbed — and stay only as long as the bees allow.
              </p>
              <Link href="/origin-story">
                <button style={{ backgroundColor: 'transparent', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.14em', padding: '14px 32px', border: '1px solid rgba(250,248,244,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FAF8F4'; e.currentTarget.style.color = '#1A0F0A'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FAF8F4'; }}>
                  READ THE FULL STORY →
                </button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. NUMBERS ──────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {[
              { to: 8,    suffix: '',   label: 'Apiaries worldwide'     },
              { to: 1140, suffix: '+',  label: 'Active hive clusters'   },
              { to: 12,   suffix: '',   label: 'Countries sourced'      },
              { to: 100,  suffix: '%',  label: 'Raw & unfiltered'       },
            ].map(s => (
              <Reveal key={s.label} dir="up">
                <div className="stat-card" style={{ backgroundColor: '#1A0F0A', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                  <p className="sc-num" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#FAF8F4' }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="sc-label" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', marginTop: '0.5rem' }}>{s.label.toUpperCase()}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MARQUEE 2 ────────────────────────────────────── */}
      <Marquee dark />

      {/* ── 8. TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF8F4', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9B8578', marginBottom: '0.4rem' }}>FROM THE HIVE</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1A0F0A' }}>A taste of perfection.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: '#E8DFD0' }}>
            {[
              { text: '"The Black Forest honey is transformative. Complex, deep, almost wine-like. I\'ve never tasted anything so extraordinary."', author: 'ELZE ORDORI', role: 'Culinary Critic' },
              { text: '"Pure elegance in a jar. From the sustainable packaging to the deep amber colour, every detail speaks of craftsmanship."', author: 'MARCUS DANE', role: 'Apothecary Owner' },
              { text: '"The Wildflower Gold has a floral brightness that\'s impossible to find elsewhere. A rare harvest worth every rupee."', author: 'DIANA LEWING', role: 'Gastronome' },
            ].map((t, i) => (
              <Reveal key={t.author} delay={i * 0.1} dir="up">
                <div style={{ backgroundColor: '#FAF8F4', padding: '2.5rem 2rem', height: '100%' }}>
                  <div style={{ color: '#A0622A', fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>★★★★★</div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.88rem', color: '#3D1F0D', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1.5rem' }}>{t.text}</p>
                  <div style={{ borderTop: '1px solid #E8DFD0', paddingTop: '1rem' }}>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#1A0F0A', fontWeight: '600' }}>{t.author}</p>
                    <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', color: '#9B8578', marginTop: '2px' }}>{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. NEWSLETTER ───────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}

/* ── Newsletter (separate to handle its own state) ──────── */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setDone(true);
  };
  return (
    <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <Reveal dir="left">
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '0.75rem' }}>THE BEEAMRIT JOURNAL</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#FAF8F4', lineHeight: 1.2 }}>
            Join our private circle.
          </h2>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#9B8578', lineHeight: 1.8, marginTop: '1rem', maxWidth: '420px' }}>
            Early access to seasonal harvests, stories from the hive, and rare batch announcements — before anyone else.
          </p>
        </Reveal>
        <Reveal dir="right" delay={0.1}>
          {done ? (
            <div style={{ border: '1px solid rgba(160,98,42,0.4)', padding: '2rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#FAF8F4', fontStyle: 'italic' }}>You&apos;re in the circle.</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', marginTop: '0.5rem' }}>Watch your inbox for the next harvest.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: '1rem', alignItems: 'flex-end', paddingBottom: '1px' }}>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', letterSpacing: '0.08em', padding: '12px 0', outline: 'none' }}
                />
                <button type="submit" style={{ backgroundColor: '#A0622A', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.14em', padding: '12px 22px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8a5224')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#A0622A')}>
                  JOIN →
                </button>
              </div>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', color: '#6B5344', marginTop: '0.75rem' }}>No spam. Unsubscribe at any time.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
