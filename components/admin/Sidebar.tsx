'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, ImagePlay, Tag, MessageSquare } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const nav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Hero Slides', href: '/admin/hero', icon: ImagePlay },
  { label: 'Promo Codes', href: '/admin/promos', icon: Tag },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside style={{ width: '200px', backgroundColor: '#FAF8F4', borderRight: '1px solid #E8DFD0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #E8DFD0' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A', fontWeight: 'bold' }}>Beeamrit Admin</p>
        <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', color: '#9B8578', marginTop: '0.2rem' }}>Management Portal</p>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {nav.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 1.25rem',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '0.78rem',
                color: isActive ? '#1A0F0A' : '#6B5344',
                backgroundColor: isActive ? '#F0E8DA' : 'transparent',
                borderLeft: isActive ? '3px solid #5C3317' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E8DFD0' }}>
        {session?.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#FAF8F4', fontWeight: 'bold' }}>
                {session.user.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', color: '#9B8578' }}>ADMINISTRATOR</p>
              <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#1A0F0A' }}>{session.user.name}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', background: 'none', cursor: 'pointer', width: '100%' }}
          className="hover:text-[#3D1F0D]"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
