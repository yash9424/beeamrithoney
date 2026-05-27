import Link from 'next/link';

const values = [
  {
    icon: '⊕',
    title: 'Radical Traceability',
    desc: 'Every jar carries a batch number linking it to a specific hive cluster, flowering season, and landscape. You know exactly where your honey came from — down to the week it was harvested.',
  },
  {
    icon: '○',
    title: 'Colony First',
    desc: 'We never harvest more than 40% of a hive\'s reserves. The colony\'s health and survival always comes before yield. Healthy bees make extraordinary honey — there is no shortcut.',
  },
  {
    icon: '◎',
    title: 'Cold Pressed Only',
    desc: 'Every batch is pressed below 35°C — the natural temperature of the hive. Heat destroys enzymes, antioxidants, and aroma. We refuse to compromise what nature spent months building.',
  },
  {
    icon: '⊗',
    title: 'Zero Additives',
    desc: 'No sugar, no water, no flavourings, no preservatives. What goes into the jar is exactly what came out of the hive — nothing added, nothing removed, nothing hidden.',
  },
];

const team = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & Head Beekeeper',
    bio: 'Spent 8 years studying apiculture across Scotland, New Zealand, and Tuscany before founding Beeamrit in 2019. Believes every honey is a vintage — a record of a place and a season.',
    initial: 'A',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Sourcing',
    bio: 'Former botanist turned honey hunter. Priya leads our apiary selection process, conducting ecological surveys and building relationships with beekeeping families across 12 countries.',
    initial: 'P',
  },
  {
    name: 'Rohan Das',
    role: 'Quality & Certification',
    bio: 'Oversees every batch from harvest to jar. Rohan manages our independent lab testing partnerships and ensures every product meets our MGO, organic, and purity standards.',
    initial: 'R',
  },
];

const milestones = [
  { year: '2017', event: 'First apiary partnership established in the Scottish Highlands.' },
  { year: '2018', event: 'Two-year ecological survey completed across 6 candidate sites.' },
  { year: '2019', event: 'Beeamrit founded. First 200 jars sold out in 4 days.' },
  { year: '2020', event: 'Expanded to Tuscany and Tasmania. Launched batch traceability system.' },
  { year: '2021', event: 'Certified organic across all apiaries. Launched MGO 500+ Manuka line.' },
  { year: '2022', event: 'Reached 8 apiaries across 4 continents. 1,140 active hive clusters.' },
  { year: '2023', event: 'Introduced vintage ageing programme — select batches aged 12–24 months.' },
  { year: '2024', event: 'New harvest season. Rarest batch yet — White Tupelo from Georgia.' },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', position: 'relative', overflow: 'hidden', padding: 'clamp(5rem, 12vw, 9rem) 1.5rem' }}>
        {/* Hero background image — place at public/uploads/about-hero.jpg, ideal 1440×700px */}
        <img
          src="/uploads/about-hero.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(26,15,10,0.88) 0%, rgba(61,31,13,0.65) 60%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '3rem' }} >
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>OUR STORY</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: '#FAF8F4', lineHeight: '1.05', maxWidth: '720px' }}>
              Crafted by nature,<br />bottled in silence.
            </h1>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#A0622A', margin: '2rem 0' }} />
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 'clamp(0.85rem, 1.6vw, 1rem)', color: '#C4A882', maxWidth: '580px', lineHeight: '1.9' }}>
              Beeamrit was founded on the belief that honey is not just a sweetener — it is a vintage expression of a specific time, place, and season. We exist to bring that expression to you, uncompromised.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <Link href="/shop">
                <button style={{ backgroundColor: '#FAF8F4', color: '#1A0F0A', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em', padding: '14px 32px', border: 'none', cursor: 'pointer' }}
                  className="hover:bg-[#F0E8DA] transition-colors">
                  EXPLORE COLLECTION →
                </button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ── Origin story ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>HOW IT BEGAN</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A0F0A', lineHeight: '1.2', marginBottom: '1.5rem' }}>
              A jar of honey that changed everything.
            </h2>
            <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.88rem', color: '#6B5344', lineHeight: '1.95' }} className="space-y-4">
              <p>
                In 2017, our founder Arjun Mehta was hiking in the Scottish Highlands when a local beekeeper offered him a spoonful of raw heather honey straight from the comb. It tasted like nothing he had ever experienced — complex, floral, almost wine-like. He asked where it came from. The beekeeper pointed to the hillside.
              </p>
              <p>
                That moment became an obsession. Arjun spent the next two years travelling to remote apiaries across Europe, Australasia, and the Americas — studying what made certain honeys extraordinary and others forgettable. The answer was always the same: <em style={{ color: '#3D1F0D' }}>place, purity, and patience.</em>
              </p>
              <p>
                Beeamrit was founded in 2019 with a single principle — to source honey only from locations where the land is undisturbed, the bees are healthy, and the harvest is never rushed. Every batch is limited. Every jar is numbered. Every drop is traceable.
              </p>
            </div>
          </div>
          {/* Visual block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ backgroundColor: '#3D1F0D', padding: '3rem 2.5rem' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#FAF8F4', fontStyle: 'italic', lineHeight: '1.5' }}>
                "Honey is not made. It is allowed to happen — by the land, the flower, and the bee. Our only job is to not get in the way."
              </p>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#A0622A', margin: '1.5rem 0' }} />
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#A0622A' }}>— ARJUN MEHTA, FOUNDER</p>
            </div>
            <div className="grid grid-cols-2 gap-px">
              {[
                { val: '2019', label: 'Founded' },
                { val: '8', label: 'Apiaries' },
                { val: '1,140', label: 'Hive Clusters' },
                { val: '12', label: 'Countries' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: '#F5F0E8', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#3D1F0D' }}>{s.val}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#9B8578', marginTop: '0.25rem' }}>{s.label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#3D1F0D', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A' }}>WHAT WE STAND FOR</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#FAF8F4', marginTop: '0.4rem' }}>Our Four Principles</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            {values.map((v) => (
              <div key={v.title} style={{ backgroundColor: '#3D1F0D', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '1.3rem', color: '#A0622A', marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#FAF8F4', marginBottom: '0.75rem' }}>{v.title}</h3>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', lineHeight: '1.85' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem', backgroundColor: '#FAF8F4' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>THE JOURNEY</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A0F0A', marginTop: '0.4rem' }}>From Hillside to Here</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {milestones.map((m, i) => (
              <div key={m.year} style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: '0 1.5rem', paddingBottom: i < milestones.length - 1 ? '2rem' : 0 }}>
                <div style={{ textAlign: 'right', paddingTop: '2px' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#5C3317', fontWeight: 'bold' }}>{m.year}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#A0622A', flexShrink: 0 }} />
                  {i < milestones.length - 1 && <div style={{ flex: 1, width: '1px', backgroundColor: '#E8DFD0', marginTop: '4px' }} />}
                </div>
                <div style={{ paddingBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#3D1F0D', lineHeight: '1.7' }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', borderTop: '1px solid #E8DFD0', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>THE PEOPLE</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A0F0A', marginTop: '0.4rem' }}>Who We Are</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: '#E8DFD0' }}>
            {team.map((t) => (
              <div key={t.name} style={{ backgroundColor: '#FAF8F4', padding: '2.5rem 2rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#FAF8F4' }}>{t.initial}</span>
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0F0A' }}>{t.name}</h3>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#A0622A', marginTop: '0.2rem', marginBottom: '0.75rem' }}>{t.role.toUpperCase()}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', lineHeight: '1.8' }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pledge ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>OUR COMMITMENT</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: '#FAF8F4', lineHeight: '1.4', fontStyle: 'italic' }}>
            "We will never harvest more than the colony can spare, never treat with antibiotics, and never compromise the land that makes this honey possible."
          </h2>
          <div style={{ width: '50px', height: '2px', backgroundColor: '#A0622A', margin: '2rem auto' }} />
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', color: '#C4A882' }}>— THE BEEAMRIT BEEKEEPING CHARTER, 2019</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF8F4', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px" style={{ backgroundColor: '#E8DFD0' }}>
          <div style={{ backgroundColor: '#FAF8F4', padding: '3rem 2.5rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>THE COLLECTION</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#1A0F0A', marginBottom: '1rem', lineHeight: '1.3' }}>Taste the difference yourself.</h3>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', lineHeight: '1.8', marginBottom: '1.5rem', maxWidth: '380px' }}>
              Every product in our collection is traceable to a specific apiary, season, and batch. Discover what real honey tastes like.
            </p>
            <Link href="/shop">
              <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                className="hover:bg-[#3D1F0D] transition-colors">
                SHOP ALL HONEY →
              </button>
            </Link>
          </div>
          <div style={{ backgroundColor: '#3D1F0D', padding: '3rem 2.5rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>WHOLESALE ENQUIRIES</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#FAF8F4', marginBottom: '1rem', lineHeight: '1.3' }}>Interested in bulk orders?</h3>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#C4A882', lineHeight: '1.8', marginBottom: '1.5rem', maxWidth: '380px' }}>
              Restaurants, retailers, and wellness brands — we offer direct farm-to-shelf wholesale partnerships with full traceability documentation.
            </p>
            <Link href="/wholesale">
              <button style={{ backgroundColor: 'transparent', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', padding: '14px 28px', border: '1px solid rgba(250,248,244,0.4)', cursor: 'pointer' }}
                className="hover:border-[#FAF8F4] transition-colors">
                ENQUIRE NOW →
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
