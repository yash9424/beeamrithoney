export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us when you create an account, place an order, subscribe to our newsletter, or contact us. This includes: name, email address, phone number, shipping address, payment information (processed securely by our payment provider), and any communications you send us. We also automatically collect certain information when you visit our Site, including IP address, browser type, pages viewed, and referring URLs.`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to: process and fulfil your orders; communicate with you about your orders, account, and promotions; send newsletters and marketing communications (with your consent); improve our Site and product offerings; detect and prevent fraud; comply with legal obligations; and personalise your shopping experience. We do not sell your personal data to third parties.`,
    },
    {
      title: 'Information Sharing',
      content: `We share your information only with: shipping carriers to fulfil your orders; payment processors to complete transactions (they receive only what is necessary); service providers who assist our operations under strict confidentiality agreements; and where required by law or to protect our legal rights. All third parties we work with are required to maintain appropriate security measures and may not use your data for their own marketing purposes.`,
    },
    {
      title: 'Cookies & Tracking',
      content: `We use cookies and similar technologies to: remember your preferences; keep items in your cart; analyse Site traffic; and improve user experience. You can control cookies through your browser settings. Disabling cookies may affect some Site functionality, including your shopping cart. We do not use third-party advertising cookies. Our analytics are privacy-first, with IP addresses anonymised.`,
    },
    {
      title: 'Data Retention',
      content: `We retain your personal data for as long as your account is active or as needed to provide services and comply with legal obligations. Order records are retained for 7 years for tax and legal purposes. Marketing preferences are kept until you unsubscribe or request deletion. You may request deletion of your account and personal data at any time by contacting us.`,
    },
    {
      title: 'Your Rights',
      content: `Depending on your location, you may have the following rights regarding your personal data: the right to access a copy of the data we hold about you; the right to correct inaccurate data; the right to request deletion of your data; the right to restrict or object to processing; the right to data portability; and the right to withdraw consent. To exercise these rights, contact us at privacy@beeamrit.com. We will respond within 30 days.`,
    },
    {
      title: 'Security',
      content: `We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal data. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account and to notify us immediately if you suspect any unauthorised access.`,
    },
    {
      title: 'Children\'s Privacy',
      content: `Our Site is not directed to children under the age of 16. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected such information, please contact us and we will promptly delete it.`,
    },
    {
      title: 'International Transfers',
      content: `If you are located outside the United Kingdom, your information may be transferred to and processed in the UK and other countries where our service providers operate. By using our Site, you consent to these transfers. We ensure appropriate safeguards are in place for any international transfers of your personal data.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our Site. Your continued use of our Site after changes take effect constitutes acceptance of the updated policy.`,
    },
    {
      title: 'Contact Us',
      content: `For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@beeamrit.com. Postal address: Beeamrit Ltd, 14 Highland Way, London, EC1A 1BB, United Kingdom. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) in the UK.`,
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <section style={{ backgroundColor: '#3D1F0D', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>LEGAL</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FAF8F4' }}>Privacy Policy</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', marginTop: '1rem', maxWidth: '480px', margin: '1rem auto 0' }}>
          Last updated: 1 January 2025
        </p>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ backgroundColor: '#F5F0E8', padding: '1.5rem', marginBottom: '2.5rem', borderLeft: '3px solid #A0622A' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#5C3317', lineHeight: '1.7' }}>
            <strong>Your privacy matters.</strong> Beeamrit collects only what is necessary to provide you with a premium honey experience. We do not sell your data, ever.
          </p>
        </div>

        {sections.map((s, i) => (
          <div key={s.title} style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: i < sections.length - 1 ? '1px solid #E8DFD0' : 'none' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A', marginBottom: '0.75rem' }}>{s.title}</h2>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#6B5344', lineHeight: '1.8' }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
