'use client';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { itemCount, toggleCart } = useCartStore();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = itemCount();

  return (
    <>
      <nav
        style={{ backgroundColor: '#FAF8F4', borderBottom: '1px solid #E8DFD0' }}
        className="sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            style={{ color: '#1A0F0A', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.02em' }}
          >
            Beeamrit
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['SHOP ALL', 'ORIGIN STORY', 'OUR FARMS', 'JOURNAL'].map((label) => {
              const href =
                label === 'SHOP ALL' ? '/shop' :
                label === 'ORIGIN STORY' ? '/about' :
                label === 'OUR FARMS' ? '/farms' : '/journal';
              return (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: '#6B5344',
                  }}
                  className="hover:text-[#1A0F0A] transition-colors"
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-[#6B5344] hover:text-[#1A0F0A]">
              <Search size={18} />
            </Link>

            {/* User dropdown */}
            <div className="relative group">
              <button className="text-[#6B5344] hover:text-[#1A0F0A]">
                <User size={18} />
              </button>
              <div
                style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}
                className="absolute right-0 top-8 w-44 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
              >
                {session ? (
                  <>
                    <Link
                      href="/account"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      className="block px-4 py-3 hover:bg-[#F5F0E8]"
                    >
                      MY ACCOUNT
                    </Link>
                    <Link
                      href="/account/orders"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      className="block px-4 py-3 hover:bg-[#F5F0E8]"
                    >
                      MY ORDERS
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                        className="block px-4 py-3 hover:bg-[#F5F0E8]"
                      >
                        ADMIN PANEL
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#6B5344', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      className="block w-full text-left px-4 py-3 hover:bg-[#F5F0E8] border-t border-[#E8DFD0]"
                    >
                      SIGN OUT
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      className="block px-4 py-3 hover:bg-[#F5F0E8]"
                    >
                      LOGIN
                    </Link>
                    <Link
                      href="/login?tab=register"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#3D1F0D', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      className="block px-4 py-3 hover:bg-[#F5F0E8]"
                    >
                      CREATE ACCOUNT
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-[#6B5344] hover:text-[#1A0F0A]"
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span
                  style={{ backgroundColor: '#5C3317', color: '#FAF8F4', fontSize: '0.6rem' }}
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#6B5344]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ backgroundColor: '#FAF8F4', borderTop: '1px solid #E8DFD0' }} className="md:hidden px-6 py-4 flex flex-col gap-4">
            {[['SHOP ALL', '/shop'], ['ORIGIN STORY', '/about'], ['OUR FARMS', '/farms'], ['JOURNAL', '/journal']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#3D1F0D' }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}
