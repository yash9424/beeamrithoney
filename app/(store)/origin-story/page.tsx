'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─── Intersection-observer hook ──────────────────────────────────── */
function useReveal(threshold = 0.15) {
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

/* ─── Animated counter ─────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(start);
    }, 20);
    return () => clearInterval(id);
  }, [visible, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Reveal wrapper ───────────────────────────────────────────────── */
function Reveal({ children, delay = 0, dir = 'up' }: {
  children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' | 'none';
}) {
  const { ref, visible } = useReveal();
  const transforms: Record<string, string> = {
    up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', none: 'none',
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transforms[dir],
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Timeline item ────────────────────────────────────────────────── */
function TimelineItem({ year, event, i }: { year: string; event: string; i: number }) {
  const { ref, visible } = useReveal(0.2);
  const isLeft = i % 2 === 0;
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 60px 1fr',
        gap: '0 1rem',
        marginBottom: '3rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : (isLeft ? 'translateX(-30px)' : 'translateX(30px)'),
        transition: `opacity 0.65s ease ${i * 0.08}s, transform 0.65s ease ${i * 0.08}s`,
      }}
    >
      {/* Left */}
      <div style={{ textAlign: 'right', paddingTop: '4px', paddingRight: '0.5rem' }}>
        {isLeft ? (
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.7', maxWidth: '340px', marginLeft: 'auto' }}>{event}</p>
        ) : (
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#A0622A', fontWeight: 'bold' }}>{year}</p>
        )}
      </div>
      {/* Centre line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#A0622A', border: '3px solid #FAF8F4', boxShadow: '0 0 0 2px #A0622A', flexShrink: 0 }} />
        <div style={{ flex: 1, width: '1px', backgroundColor: '#E8DFD0', marginTop: '4px' }} />
      </div>
      {/* Right */}
      <div style={{ paddingTop: '4px', paddingLeft: '0.5rem' }}>
        {isLeft ? (
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#A0622A', fontWeight: 'bold' }}>{year}</p>
        ) : (
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.7', maxWidth: '340px' }}>{event}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const milestones = [
  { year: '2017', event: 'Arjun Mehta tastes raw heather honey in the Scottish Highlands. An obsession begins.' },
  { year: '2018', event: 'Two-year ecological survey across 6 candidate apiary sites on 3 continents.' },
  { year: '2019', event: 'Beeamrit is founded. First 200 numbered jars sell out in 4 days.' },
  { year: '2020', event: 'Expanded to Tuscany and Tasmania. Batch traceability system launched.' },
  { year: '2021', event: 'Certified organic across all apiaries. MGO 500+ Manuka line introduced.' },
  { year: '2022', event: '8 apiaries, 4 continents, 1,140 active hive clusters.' },
  { year: '2023', event: 'Vintage ageing programme — select batches aged 12–24 months in amber glass.' },
  { year: '2024', event: 'Rarest harvest yet. White Tupelo from Georgia. 60 jars only.' },
];

const principles = [
  { n: '01', title: 'Place Over Yield', body: 'We go to where the honey is exceptional, not where production is easy. Every apiary is chosen for the uniqueness of its flora, not the size of its harvest.' },
  { n: '02', title: 'Colony First', body: 'We never harvest more than 40% of a hive\'s reserves. The colony\'s survival always outweighs our yield. A stressed colony makes ordinary honey.' },
  { n: '03', title: 'Cold Only', body: 'Every batch is pressed below 35°C — the natural temperature inside the hive. Heat kills enzymes, destroys antioxidants, and flattens complexity.' },
  { n: '04', title: 'Nothing Added', body: 'No sugar, no water, no flavourings, no blending. What enters the jar is exactly what left the hive — one place, one season, one truth.' },
];

/* ══════════════════════════════════════════════════════════════════ */
export default function OriginStoryPage() {

  /* Hero text entrance */
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 120); return () => clearTimeout(t); }, []);

  /* Horizontal scroll strip ref */
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ backgroundColor: '#FAF8F4', overflowX: 'hidden' }}>

      <style>{`
        @keyframes lineDraw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowPan {
          0%   { transform: scale(1.08) translateX(0); }
          100% { transform: scale(1.08) translateX(-2%); }
        }
        .hero-img { animation: slowPan 14s ease-in-out infinite alternate; }
      `}</style>

      {/* ══ 1. CINEMATIC HERO ════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        {/* Background */}
        <div className="hero-img" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/uploads/about-hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundColor: '#2A1509',
        }} />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,5,2,0.95) 0%, rgba(20,10,4,0.55) 50%, rgba(0,0,0,0.25) 100%)' }} />

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 pb-20 w-full" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem',
            letterSpacing: '0.3em', color: '#A0622A',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 1s ease 0.2s',
            marginBottom: '1.2rem',
          }}>
            BEEAMRIT — THE ORIGIN
          </p>

          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.6rem, 7vw, 6rem)',
            color: '#FAF8F4', lineHeight: 1.0,
            fontStyle: 'italic',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'none' : 'translateY(32px)',
            transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
          }}>
            A spoonful on a<br />
            <span style={{ color: '#C4A882' }}>Scottish hillside</span><br />
            changed everything.
          </h1>

          {/* Animated underline */}
          <div style={{
            width: '80px', height: '2px', backgroundColor: '#A0622A',
            marginTop: '2rem',
            transformOrigin: 'left',
            animation: heroVisible ? 'lineDraw 1.2s ease 1.2s both' : 'none',
          }} />

          <p style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)',
            color: '#C4A882', maxWidth: '520px', lineHeight: '1.85',
            marginTop: '1.5rem',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 1s ease 1s',
          }}>
            In 2017, Arjun Mehta tasted raw heather honey from a comb in the Scottish Highlands. What followed was an obsession that would become Beeamrit.
          </p>

          {/* Scroll cue */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginTop: '3rem',
            opacity: heroVisible ? 0.6 : 0,
            transition: 'opacity 1s ease 1.4s',
          }}>
            <div style={{ width: '1px', height: '48px', backgroundColor: '#FAF8F4', opacity: 0.5 }} />
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#FAF8F4', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>SCROLL</p>
          </div>
        </div>
      </section>

      {/* ══ 2. OPENING QUOTE ═════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(5rem, 10vw, 8rem) 1.5rem' }}>
        <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
          <Reveal dir="up">
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)', color: '#FAF8F4', fontStyle: 'italic', lineHeight: 1.6 }}>
              &ldquo;Honey is not made. It is allowed to happen — by the land, the flower, and the bee. Our only job is to not get in the way.&rdquo;
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#A0622A', margin: '2rem auto' }} />
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.18em', color: '#A0622A' }}>
              — ARJUN MEHTA, FOUNDER
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ 3. THE FOUNDING MOMENT ═══════════════════════════════════ */}
      <section style={{ padding: 'clamp(5rem, 10vw, 8rem) 1.5rem', backgroundColor: '#FAF8F4' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Left — story */}
            <div>
              <Reveal dir="left">
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9B8578', marginBottom: '0.75rem' }}>HOW IT BEGAN</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: '#1A0F0A', lineHeight: 1.15, marginBottom: '2rem' }}>
                  A jar that tasted like<br />a place, not a product.
                </h2>
              </Reveal>

              {[
                'In 2017, Arjun Mehta was hiking the Cairngorms when a local beekeeper offered him a spoonful of raw heather honey straight from the comb. It tasted floral, complex, almost wine-like. He asked where it came from. The beekeeper pointed to the hillside.',
                'That moment became an obsession. Arjun spent two years travelling to remote apiaries across Europe, Australasia, and the Americas — learning what made certain honeys extraordinary. The answer was always the same: place, purity, and patience.',
                'Beeamrit was founded in 2019 with one rule — source only from land that is undisturbed, bees that are healthy, and harvests that are never rushed. Every batch is limited. Every jar is numbered. Every drop is traceable.',
              ].map((p, i) => (
                <Reveal key={i} delay={0.1 * i} dir="none">
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.9rem', color: i === 1 ? '#3D1F0D' : '#6B5344', lineHeight: 1.9, marginBottom: '1.25rem', fontStyle: i === 1 ? 'italic' : 'normal' }}>
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Right — visual stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <Reveal dir="right" delay={0.1}>
                <div style={{ backgroundColor: '#3D1F0D', padding: '2.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                    {[
                      { val: '2019', label: 'Founded' },
                      { val: '8', label: 'Apiaries' },
                      { val: '1,140', label: 'Hive Clusters' },
                      { val: '12', label: 'Countries' },
                    ].map(s => (
                      <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem 1rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#FAF8F4' }}>{s.val}</p>
                        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#A0622A', marginTop: '0.25rem' }}>{s.label.toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal dir="right" delay={0.2}>
                <div style={{ backgroundColor: '#F0E8DA', padding: '2rem 2.5rem', borderLeft: '3px solid #A0622A' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#3D1F0D', fontStyle: 'italic', lineHeight: 1.7 }}>
                    &ldquo;The first 200 jars were sold from a market stall in Edinburgh. We had no website, no branding — just honey and a story. They were gone in four days.&rdquo;
                  </p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#9B8578', marginTop: '1rem' }}>— ARJUN, ON THE BEGINNING</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. ANIMATED TIMELINE ═════════════════════════════════════ */}
      <section style={{ padding: 'clamp(5rem, 10vw, 8rem) 1.5rem', backgroundColor: '#FAF8F4' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal dir="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9B8578', marginBottom: '0.5rem' }}>THE JOURNEY</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A0F0A' }}>From hillside to here.</h2>
            </div>
          </Reveal>

          {milestones.map((m, i) => (
            <TimelineItem key={m.year} {...m} i={i} />
          ))}
        </div>
      </section>

      {/* ══ 5. PRINCIPLES GRID ═══════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(5rem, 10vw, 8rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up">
            <div style={{ marginBottom: '3.5rem' }}>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '0.5rem' }}>WHAT WE STAND FOR</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAF8F4' }}>Four principles.<br />No exceptions.</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1} dir={i % 2 === 0 ? 'left' : 'right'}>
                <div style={{ backgroundColor: '#1A0F0A', padding: '3rem 2.5rem', height: '100%' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: 'rgba(160,98,42,0.25)', lineHeight: 1, marginBottom: '1rem' }}>{p.n}</p>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#FAF8F4', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#9B8578', lineHeight: 1.85 }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. LIVE COUNTERS ═════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#F5F0E8', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: '#E8DFD0' }}>
            {[
              { to: 8, suffix: '', label: 'Apiaries worldwide' },
              { to: 1140, suffix: '+', label: 'Active hive clusters' },
              { to: 12, suffix: '', label: 'Countries sourced' },
              { to: 5, suffix: ' yrs', label: 'Of harvesting excellence' },
            ].map((s) => (
              <Reveal key={s.label} dir="up">
                <div style={{ backgroundColor: '#FAF8F4', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#3D1F0D' }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#9B8578', marginTop: '0.5rem' }}>{s.label.toUpperCase()}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. HORIZONTAL SCROLL STRIP ═══════════════════════════════ */}
      <section style={{ backgroundColor: '#3D1F0D', padding: '3rem 0', overflow: 'hidden' }}>
        <div
          ref={stripRef}
          style={{
            display: 'flex', gap: '3rem',
            animation: 'marquee 25s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '3rem', flexShrink: 0 }}>
              {['RAW & UNFILTERED', '◎', 'COLD PRESSED', '◎', 'SINGLE ORIGIN', '◎', 'BATCH TRACED', '◎', 'COLONY FIRST', '◎', 'CERTIFIED ORGANIC', '◎'].map((t, i) => (
                <span key={i} style={{
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontSize: '0.7rem', letterSpacing: '0.18em',
                  color: t === '◎' ? '#A0622A' : '#C4A882',
                  fontWeight: t !== '◎' ? '600' : '400',
                }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══ 8. PLEDGE ════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FAF8F4', padding: 'clamp(5rem, 10vw, 8rem) 1.5rem' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal dir="left">
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9B8578', marginBottom: '0.75rem' }}>THE BEEAMRIT CHARTER · 2019</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1A0F0A', lineHeight: 1.4, fontStyle: 'italic' }}>
              &ldquo;We will never harvest more than the colony can spare, never treat with antibiotics, and never compromise the land that makes this honey possible.&rdquo;
            </h2>
          </Reveal>
          <Reveal dir="right" delay={0.15}>
            <div style={{ borderLeft: '1px solid #E8DFD0', paddingLeft: '2.5rem' }}>
              {[
                ['40%', 'Maximum harvest per hive, ever.'],
                ['0°', 'Chemicals used. None.'],
                ['35°C', 'Maximum press temperature — nature\'s own.'],
                ['100%', 'Batches independently lab-tested.'],
              ].map(([val, label]) => (
                <div key={val} style={{ marginBottom: '1.75rem' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#A0622A' }}>{val}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', marginTop: '0.2rem' }}>{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 9. FINAL CTA ═════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(5rem, 10vw, 8rem) 1.5rem', textAlign: 'center' }}>
        <Reveal dir="up">
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>TASTE THE STORY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FAF8F4', lineHeight: 1.2, marginBottom: '2rem' }}>
            Every jar holds<br />
            <span style={{ color: '#C4A882', fontStyle: 'italic' }}>a place in time.</span>
          </h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop">
              <button style={{ backgroundColor: '#FAF8F4', color: '#1A0F0A', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em', padding: '16px 40px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0E8DA')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FAF8F4')}>
                EXPLORE COLLECTION →
              </button>
            </Link>
            <Link href="/about">
              <button style={{ backgroundColor: 'transparent', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em', padding: '16px 40px', border: '1px solid rgba(250,248,244,0.3)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(250,248,244,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(250,248,244,0.3)')}>
                MEET THE TEAM →
              </button>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
