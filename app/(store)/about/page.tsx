import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>OUR STORY</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1A0F0A', lineHeight: '1.1', marginTop: '0.5rem' }}>
          Crafted by nature,<br />bottled in silence.
        </h1>
        <div style={{ width: '40px', height: '2px', backgroundColor: '#A0622A', margin: '1.5rem 0' }}></div>
        <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.88rem', color: '#6B5344', lineHeight: '1.9' }} className="space-y-4">
          <p>Beeamrit was founded on the belief that honey is not just a sweetener, but a vintage expression of a specific time and place.</p>
          <p>Our beekeepers travel to the most remote corners of the world to set hives where nature remains undisturbed. By following the slow rhythm of the seasons, we produce limited batches of raw honey that retain the complex flavor profiles of their botanical origins.</p>
          <p>Every jar carries a batch number — a traceability code that connects the consumer directly to the hive cluster, the flowering season, and the landscape that shaped the honey within.</p>
        </div>
        <Link href="/shop">
          <button style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '14px 32px', marginTop: '2.5rem' }}
            className="hover:bg-[#3D1F0D] transition-colors">
            EXPLORE THE COLLECTION →
          </button>
        </Link>
      </div>
    </div>
  );
}
