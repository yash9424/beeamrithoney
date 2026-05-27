export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using the Beeamrit website ("Site") and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site or services. We reserve the right to update these terms at any time, and continued use of the Site constitutes acceptance of any changes.`,
    },
    {
      title: 'Products & Orders',
      content: `All products are subject to availability. Beeamrit reserves the right to limit quantities and to discontinue any product at any time. Prices are subject to change without notice. We make every effort to display accurate product information, including descriptions, pricing, and images. However, we do not guarantee that descriptions are complete, current, or error-free.`,
    },
    {
      title: 'Payment',
      content: `Payment is due at the time of purchase. We accept major credit cards, debit cards, and digital wallets. All transactions are encrypted using industry-standard SSL technology. We do not store complete payment card information on our servers. In the event of a pricing error, we reserve the right to cancel orders placed at the incorrect price.`,
    },
    {
      title: 'Shipping & Delivery',
      content: `We ship worldwide. Estimated delivery times are provided at checkout and are not guaranteed. Beeamrit is not responsible for delays caused by customs, weather, carrier issues, or other events beyond our control. Risk of loss and title for products passes to you upon delivery to the carrier. We ship in consolidated batches to minimise our carbon footprint.`,
    },
    {
      title: 'Returns & Refunds',
      content: `We accept returns of unopened, undamaged products within 14 days of delivery. To initiate a return, contact us at returns@beeamrit.com with your order number. We do not accept returns of opened food products unless they are defective or damaged. Refunds are processed within 5–10 business days of receiving the returned product. Original shipping costs are non-refundable.`,
    },
    {
      title: 'Intellectual Property',
      content: `All content on the Beeamrit Site, including text, images, logos, product descriptions, and design elements, is the property of Beeamrit and protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission.`,
    },
    {
      title: 'User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law, Beeamrit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Site or products. Our total liability for any claim arising from these terms shall not exceed the amount you paid for the product in question.`,
    },
    {
      title: 'Governing Law',
      content: `These Terms of Service are governed by the laws of the United Kingdom. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full force.`,
    },
    {
      title: 'Contact',
      content: `For questions about these Terms of Service, please contact our legal team at legal@beeamrit.com or write to us at: Beeamrit Ltd, 14 Highland Way, London, EC1A 1BB, United Kingdom.`,
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F4', minHeight: '100vh' }}>
      <section style={{ backgroundColor: '#3D1F0D', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A', marginBottom: '0.75rem' }}>LEGAL</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FAF8F4' }}>Terms of Service</h1>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#C4A882', marginTop: '1rem', maxWidth: '480px', margin: '1rem auto 0' }}>
          Last updated: 1 January 2025
        </p>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem' }}>
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
