import Link from 'next/link';

const farms = [
  { name: 'Highland Reserve', location: 'Scottish Highlands, UK', altitude: '1,200m', honey: 'Wildflower, Heather', emoji: '🏔️', desc: 'Nestled in the crystalline slopes of the Northern Highlands, our hives sit above the modern agricultural belt. The thin air and ancient flora produce honey of extraordinary complexity.' },
  { name: 'Tuscan Sun Apiary', location: 'Chianti, Tuscany, Italy', altitude: '620m', honey: 'Wildflower, Acacia', emoji: '🌿', desc: 'Surrounded by olive groves and vineyards, our Tuscan hives harvest from centuries-old wildflower meadows. The warm Mediterranean climate creates honey with bright citrus and floral profiles.' },
  { name: 'Tasmanian Wild', location: 'Southwest Tasmania, Australia', altitude: '340m', honey: 'Leatherwood', emoji: '🌲', desc: 'Deep in the UNESCO World Heritage rainforest, our hives produce the legendary Leatherwood honey — a species unique to Tasmania, with a complex spicy-sweet character found nowhere else.' },
  { name: 'Georgia Swamplands', location: 'Apalachicola River, Georgia, USA', altitude: 'Sea level', honey: 'Tupelo', emoji: '🌊', desc: 'Along the banks of the Apalachicola River, our hives harvest from White Tupelo trees during their brief two-week bloom. The result is the rarest honey in the world — one that never crystallizes.' },
  { name: 'Black Forest Reserve', location: 'Baden-Württemberg, Germany', altitude: '800m', honey: 'Honeydew, Fir', emoji: '🌲', desc: 'Our deep forest hives collect honeydew from the ancient fir trees of the Black Forest. Dark, resinous, and intensely flavored — this is honey for those who seek the extraordinary.' },
  { name: 'Provence Fields', location: 'Luberon Valley, France', altitude: '450m', honey: 'Lavender', emoji: '💜', desc: 'In the sun-drenched lavender fields of Provence, our hives produce delicately aromatic honey during the July bloom. Light, floral, and calming — the essence of a summer afternoon.' },
];

export default function FarmsPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#3D1F0D', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>WHERE OUR HONEY COMES FROM</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FAF8F4', lineHeight: '1.2' }}>Our Farms &amp; Apiaries</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#C4A882', marginTop: '1rem', maxWidth: '520px', margin: '1rem auto 0', lineHeight: '1.8' }}>
          Each Beeamrit honey is traced to a specific hive cluster, farm, and flowering season. Here are the estates that make it all possible.
        </p>
      </section>

      {/* Farms grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {farms.map(f => (
            <div key={f.name} style={{ border: '1px solid #E8DFD0', backgroundColor: '#FAF8F4' }}>
              <div style={{ backgroundColor: '#3D1F0D', padding: '2rem', textAlign: 'center', fontSize: '3.5rem' }}>{f.emoji}</div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#A0622A' }}>APIARY</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A', marginTop: '0.25rem' }}>{f.name}</h2>
                <div style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344' }}>📍 {f.location}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344' }}>⛰ {f.altitude}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344' }}>🍯 {f.honey}</p>
                </div>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#9B8578', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/shop">
            <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px 32px', border: 'none', cursor: 'pointer' }}>
              SHOP BY ORIGIN →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
