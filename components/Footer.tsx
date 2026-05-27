import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E8DFD0', backgroundColor: '#FAF8F4' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#1A0F0A', fontStyle: 'italic' }}>
            Beeamrit
          </p>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', color: '#9B8578', marginTop: '0.25rem' }}>
            © 2024 BEEAMRIT. RARE VINTAGE ORGANIC HONEY.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            ['TERMS OF SERVICE', '/terms'],
            ['PRIVACY POLICY', '/privacy'],
            ['SUSTAINABILITY', '/sustainability'],
            ['WHOLESALE', '/wholesale'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#6B5344' }}
              className="hover:text-[#1A0F0A] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
