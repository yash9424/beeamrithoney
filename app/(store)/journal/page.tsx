export default function JournalPage() {
  const posts = [
    { title: 'The Art of Reading Honey Through Terroir', date: 'October 2024', tag: 'EDUCATION', excerpt: 'Just as wine expresses the geology and climate of its vineyard, honey speaks the language of its landscape.' },
    { title: 'Harvest Season at the Scottish Highlands Hives', date: 'September 2024', tag: 'FARM NOTES', excerpt: 'This year\'s Highland Wildflower batch was exceptional — a late summer bloom extended the heather season by three weeks.' },
    { title: 'Why We Never Filter Our Honey', date: 'August 2024', tag: 'PHILOSOPHY', excerpt: 'Filtration removes pollen — the very fingerprint that proves origin and preserves enzymatic vitality.' },
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>STORIES FROM THE HIVE</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1A0F0A', marginTop: '0.5rem', marginBottom: '3rem' }}>The Beeamrit Journal</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <div key={p.title} style={{ borderTop: '2px solid #5C3317', paddingTop: '1.25rem' }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#A0622A' }}>{p.tag}</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#1A0F0A', lineHeight: '1.4', marginTop: '0.5rem' }}>{p.title}</h2>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578', marginTop: '0.35rem' }}>{p.date}</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', lineHeight: '1.7', marginTop: '0.75rem' }}>{p.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
