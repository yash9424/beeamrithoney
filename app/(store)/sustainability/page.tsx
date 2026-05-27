export default function SustainabilityPage() {
  const pillars = [
    { icon: '🌱', title: 'Zero Plastic Packaging', desc: 'Every Beeamrit order ships in 100% biodegradable materials. Our jars are glass. Our seals are beeswax. Our padding is recycled paper pulp.' },
    { icon: '🚚', title: 'Carbon Neutral Delivery', desc: 'We offset the carbon footprint of every delivery through verified reforestation projects in partnership with the Global Canopy Programme.' },
    { icon: '🐝', title: 'Bee Population Protection', desc: 'We never over-harvest. Our beekeepers extract only surplus honey — after the colony has secured its full winter stores. Hive health comes first, always.' },
    { icon: '🌿', title: 'No Pesticide Zones', desc: 'All our apiaries sit in protected natural reserves, far from conventional agriculture. We work with local governments to maintain pesticide-free buffer zones.' },
    { icon: '💧', title: 'Water-Positive Operations', desc: 'Our processing facility collects and recycles 100% of its water usage. We return more clean water to local ecosystems than we consume.' },
    { icon: '📦', title: 'Slow Logistics', desc: "We ship in consolidated batches to minimize delivery journeys. We don't rush — good honey and sustainable shipping both take time." },
  ];
  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <section style={{ backgroundColor: '#3D1F0D', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>OUR PROMISE</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FAF8F4' }}>Sustainability at Beeamrit</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#C4A882', marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0', lineHeight: '1.8' }}>
          Every jar we sell is a vote for a wilder, cleaner world. Here is how we back that up.
        </p>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pillars.map(p => (
          <div key={p.title} style={{ borderTop: '3px solid #5C3317', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{p.icon}</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A', marginBottom: '0.5rem' }}>{p.title}</h3>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', lineHeight: '1.7' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
