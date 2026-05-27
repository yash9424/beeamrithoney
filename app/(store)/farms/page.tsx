import Link from 'next/link';

const farms = [
  {
    name: 'Highland Reserve',
    location: 'Scottish Highlands, UK',
    altitude: '1,200m',
    honey: 'Wildflower & Heather',
    season: 'July – September',
    hives: '240 hives',
    batchCode: 'BATCH 042',
    tag: 'RARE VINTAGE',
    desc: 'Nestled in the crystalline slopes of the Northern Highlands, our hives sit above the modern agricultural belt. The thin air and ancient flora — heather, thyme, wild clover — produce honey of extraordinary complexity. Each jar is a direct expression of the Scottish moor.',
    flavour: 'Deep floral, malt undertones, long finish',
    bg: '#2A150A',
    accent: '#A0622A',
  },
  {
    name: 'Tuscan Sun Apiary',
    location: 'Chianti, Tuscany, Italy',
    altitude: '620m',
    honey: 'Wildflower & Acacia',
    season: 'April – June',
    hives: '180 hives',
    batchCode: 'BATCH 044',
    tag: 'SINGLE ORIGIN',
    desc: 'Surrounded by olive groves and centuries-old vineyards, our Tuscan hives harvest from wildflower meadows untouched by modern farming. The warm Mediterranean climate and mineral-rich soil create honey with bright citrus and delicate floral profiles.',
    flavour: 'Bright citrus, light floral, clean finish',
    bg: '#3D1F0D',
    accent: '#C4A882',
  },
  {
    name: 'Tasmanian Wild',
    location: 'Southwest Tasmania, Australia',
    altitude: '340m',
    honey: 'Leatherwood',
    season: 'January – March',
    hives: '120 hives',
    batchCode: 'BATCH 033',
    tag: 'LIMITED EDITION',
    desc: 'Deep in the UNESCO World Heritage rainforest, our hives produce the legendary Leatherwood honey — a species unique to Tasmania. The remote wilderness ensures zero contamination. Complex, spicy-sweet, and utterly unlike anything else on earth.',
    flavour: 'Spicy-sweet, exotic floral, viscous body',
    bg: '#1A0F0A',
    accent: '#A0622A',
  },
  {
    name: 'Georgia Swamplands',
    location: 'Apalachicola River, Georgia, USA',
    altitude: 'Sea level',
    honey: 'White Tupelo',
    season: 'April – May (2 weeks only)',
    hives: '90 hives',
    batchCode: 'BATCH 036',
    tag: 'ULTRA RARE',
    desc: 'Along the banks of the Apalachicola River, our hives harvest from White Tupelo trees during their brief two-week bloom. The result is the rarest honey in the world — extraordinarily light, with a pear-like finish, and the only honey that never crystallizes.',
    flavour: 'Pear finish, buttery, never crystallises',
    bg: '#2A150A',
    accent: '#C4A882',
  },
  {
    name: 'Black Forest Reserve',
    location: 'Baden-Württemberg, Germany',
    altitude: '800m',
    honey: 'Honeydew & Fir',
    season: 'June – August',
    hives: '160 hives',
    batchCode: 'BATCH 029',
    tag: 'AGED 24 MONTHS',
    desc: 'Our deep forest hives collect honeydew secreted by aphids feeding on ancient fir trees — not nectar, but a dark, resinous forest concentrate. Intensely flavoured with malt and pine, this is honey for those who seek the extraordinary.',
    flavour: 'Dark malt, pine resin, smoky depth',
    bg: '#1A0F0A',
    accent: '#A0622A',
  },
  {
    name: 'Provence Lavender Fields',
    location: 'Luberon Valley, France',
    altitude: '450m',
    honey: 'Lavender',
    season: 'July (3 weeks only)',
    hives: '200 hives',
    batchCode: 'BATCH 045',
    tag: 'BEST SELLER',
    desc: 'In the sun-drenched lavender fields of Provence, our hives produce delicately aromatic honey during the brief July bloom. Harvested at peak flowering, cold-pressed within 48 hours. Light, floral, and calming — the essence of a summer afternoon in the south of France.',
    flavour: 'Soft lavender, light sweetness, aromatic',
    bg: '#3D1F0D',
    accent: '#C4A882',
  },
  {
    name: 'New Zealand Manuka Hills',
    location: 'Waikato, New Zealand',
    altitude: '520m',
    honey: 'Manuka MGO 500+',
    season: 'November – January',
    hives: '80 hives',
    batchCode: 'BATCH 031',
    tag: 'MGO 500+ CERTIFIED',
    desc: 'Our New Zealand partner apiaries sit in remote Waikato hillsides where Manuka trees bloom for just 2–6 weeks per year. Every batch is independently tested and certified for MGO 500+ activity. The gold standard of functional honey.',
    flavour: 'Earthy, herbal, rich medicinal depth',
    bg: '#2A150A',
    accent: '#A0622A',
  },
  {
    name: 'Hawaiian Macadamia Grove',
    location: 'Big Island, Hawaii, USA',
    altitude: '280m',
    honey: 'Macadamia Blossom',
    season: 'February – April',
    hives: '70 hives',
    batchCode: 'BATCH 041',
    tag: 'HONEYCOMB AVAILABLE',
    desc: 'Nestled among volcanic soil macadamia orchards on the Big Island, our hives produce a uniquely buttery, nutty honey. The volcanic mineral content of the soil gives this honey a subtle earthiness that pairs beautifully with the natural sweetness of macadamia blossom.',
    flavour: 'Buttery, nutty, light tropical sweetness',
    bg: '#1A0F0A',
    accent: '#C4A882',
  },
];

const stats = [
  { value: '8', label: 'Apiaries Worldwide' },
  { value: '1,140', label: 'Active Hive Clusters' },
  { value: '12', label: 'Countries Sourced' },
  { value: '100%', label: 'Certified Organic' },
];

const process = [
  {
    step: '01',
    title: 'Site Selection',
    desc: 'Every apiary location is chosen after a minimum 2-year ecological survey. We map flora density, pesticide exposure radius, and seasonal bloom cycles before placing a single hive.',
  },
  {
    step: '02',
    title: 'Hive Placement',
    desc: 'Hives are positioned at precise elevations and orientations to maximise foraging range while minimising stress on the colony. Each cluster is monitored with IoT sensors year-round.',
  },
  {
    step: '03',
    title: 'Seasonal Harvest',
    desc: 'We harvest only once per season, never more than 40% of a hive\'s reserves. This ensures colony health and the concentrated, complex flavour profiles that define Beeamrit honey.',
  },
  {
    step: '04',
    title: 'Cold Pressing',
    desc: 'Within 48 hours of harvest, honey is cold-pressed at below 35°C — the temperature of the hive itself. This preserves every enzyme, antioxidant, and aromatic compound intact.',
  },
  {
    step: '05',
    title: 'Batch Testing',
    desc: 'Every batch undergoes independent laboratory testing for purity, MGO activity (where applicable), moisture content, and absence of antibiotics or pesticide residue.',
  },
  {
    step: '06',
    title: 'Vintage Ageing',
    desc: 'Select batches are aged in temperature-controlled cellars for 12–24 months. Like fine wine, ageing deepens flavour complexity and produces the viscous, slow-pour texture Beeamrit is known for.',
  },
];

export default function FarmsPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', position: 'relative', overflow: 'hidden', padding: 'clamp(4rem, 10vw, 8rem) 1.5rem' }}>
        {/* decorative large text */}
        <div style={{ position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(10rem, 25vw, 22rem)', opacity: 0.06, userSelect: 'none', lineHeight: 1 }}>🍯</div>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(61,31,13,0.6) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>OUR APIARIES</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#FAF8F4', lineHeight: '1.05', maxWidth: '700px' }}>
            Farms &amp; Apiaries
          </h1>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0' }} />
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)', color: '#C4A882', maxWidth: '560px', lineHeight: '1.85' }}>
            Every jar of Beeamrit honey is traceable to a specific hive cluster, farm, and flowering season. We work with eight carefully selected apiaries across four continents — each chosen for its ecological purity and botanical rarity.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <Link href="/shop">
              <button style={{ backgroundColor: '#FAF8F4', color: '#1A0F0A', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em', padding: '14px 32px', border: 'none', cursor: 'pointer' }}
                className="hover:bg-[#F0E8DA] transition-colors">
                SHOP BY ORIGIN →
              </button>
            </Link>
            <Link href="/about">
              <button style={{ backgroundColor: 'transparent', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em', padding: '14px 32px', border: '1px solid rgba(250,248,244,0.3)', cursor: 'pointer' }}
                className="hover:border-[#FAF8F4] transition-colors">
                OUR STORY
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#3D1F0D', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#FAF8F4' }}>{s.value}</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.12em', color: '#A0622A', marginTop: '0.35rem' }}>{s.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Farms ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>THE ESTATES</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A0F0A', marginTop: '0.4rem' }}>Eight Apiaries. One Standard.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {farms.map((f, i) => (
            <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '1fr', backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', overflow: 'hidden' }}
              className="md:grid-cols-[280px_1fr]">
              {/* Left panel */}
              <div style={{ backgroundColor: f.bg, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                <div>
                  <span style={{ backgroundColor: f.accent, color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', padding: '4px 10px', display: 'inline-block', marginBottom: '1.25rem' }}>
                    {f.tag}
                  </span>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: f.accent, marginBottom: '0.4rem' }}>APIARY {String(i + 1).padStart(2, '0')}</p>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FAF8F4', lineHeight: '1.2' }}>{f.name}</h3>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(250,248,244,0.5)', marginBottom: '0.25rem' }}>{f.batchCode}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#C4A882' }}>{f.hives}</p>
                </div>
              </div>

              {/* Right panel */}
              <div style={{ padding: '2.5rem 2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'LOCATION', val: f.location },
                    { label: 'ALTITUDE', val: f.altitude },
                    { label: 'HONEY TYPE', val: f.honey },
                    { label: 'HARVEST SEASON', val: f.season },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', color: '#9B8578', marginBottom: '0.2rem' }}>{label}</p>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A' }}>{val}</p>
                    </div>
                  ))}
                </div>

                <div style={{ width: '30px', height: '1px', backgroundColor: '#C4A882', marginBottom: '1rem' }} />

                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8', marginBottom: '1.25rem', maxWidth: '560px' }}>
                  {f.desc}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F0E8', padding: '8px 14px' }}>
                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#9B8578' }}>FLAVOUR PROFILE</span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.78rem', color: '#5C3317', fontStyle: 'italic' }}>{f.flavour}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Process ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#3D1F0D', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A' }}>FROM HIVE TO JAR</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#FAF8F4', marginTop: '0.4rem' }}>The Beeamrit Process</h2>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', marginTop: '0.75rem', maxWidth: '500px', lineHeight: '1.8' }}>
              Six steps. Zero shortcuts. Every decision made in favour of the honey, the bee, and the land.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            {process.map((p) => (
              <div key={p.step} style={{ backgroundColor: '#3D1F0D', padding: '2rem' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: 'rgba(160,98,42,0.3)', lineHeight: 1, marginBottom: '1rem' }}>{p.step}</p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#FAF8F4', marginBottom: '0.75rem' }}>{p.title}</h3>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#C4A882', lineHeight: '1.8' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F0E8', borderTop: '1px solid #E8DFD0', borderBottom: '1px solid #E8DFD0', padding: '3rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', textAlign: 'center', marginBottom: '2rem' }}>CERTIFICATIONS &amp; STANDARDS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⊕', title: 'USDA Organic', sub: 'All apiaries certified' },
              { icon: '○', title: 'EU Organic', sub: 'European estates' },
              { icon: '◎', title: 'Rainforest Alliance', sub: 'Tasmania & Hawaii' },
              { icon: '⊗', title: 'MGO Certified', sub: 'New Zealand Manuka' },
            ].map(c => (
              <div key={c.title} style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
                <div style={{ fontSize: '1.4rem', color: '#A0622A', marginBottom: '0.75rem' }}>{c.icon}</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A' }}>{c.title}</p>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', marginTop: '0.25rem' }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beekeeper pledge ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#A0622A', marginBottom: '1rem' }}>THE BEEAMRIT PLEDGE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: '#FAF8F4', lineHeight: '1.3', fontStyle: 'italic' }}>
            "We will never harvest more than the colony can spare, never treat with antibiotics, and never compromise the land that makes this honey possible."
          </h2>
          <div style={{ width: '50px', height: '2px', backgroundColor: '#A0622A', margin: '2rem auto' }} />
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', color: '#C4A882' }}>— THE BEEAMRIT BEEKEEPING CHARTER, 2019</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF8F4', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto" style={{ display: 'grid', gap: '2px' }} >
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: '#E8DFD0' }}>
            <div style={{ backgroundColor: '#FAF8F4', padding: '3rem 2.5rem' }}>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>EXPLORE THE COLLECTION</p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#1A0F0A', marginBottom: '1rem', lineHeight: '1.3' }}>Shop Honey by Origin</h3>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#6B5344', lineHeight: '1.8', marginBottom: '1.5rem', maxWidth: '380px' }}>
                Each product page tells you exactly which apiary, which season, and which batch your honey comes from.
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
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#FAF8F4', marginBottom: '1rem', lineHeight: '1.3' }}>Partner With Our Farms</h3>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#C4A882', lineHeight: '1.8', marginBottom: '1.5rem', maxWidth: '380px' }}>
                Restaurants, retailers, and wellness brands — we offer direct farm-to-shelf partnerships with full traceability documentation.
              </p>
              <Link href="/wholesale">
                <button style={{ backgroundColor: 'transparent', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', padding: '14px 28px', border: '1px solid rgba(250,248,244,0.4)', cursor: 'pointer' }}
                  className="hover:border-[#FAF8F4] transition-colors">
                  ENQUIRE NOW →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
