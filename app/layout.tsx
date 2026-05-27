import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Beeamrit — Rare Vintage Organic Honey',
  description:
    'Crafted from the wild, delivered with purity. Experience the slow, viscous flow of nature\'s finest liquid gold, harvested from protected floral preserves.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#3D1F0D',
                color: '#FAF8F4',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '13px',
                letterSpacing: '0.02em',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
