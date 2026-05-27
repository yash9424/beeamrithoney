'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Download, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

interface Stats {
  quarterlyRevenue: number;
  totalOrders: number;
  newCustomers: number;
  totalProducts: number;
  lowStock: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user?: { name: string; email: string };
    items: Array<{ name: string }>;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

// Generate mock chart data from real stats
function buildChartData(stats: Stats) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const base = stats.quarterlyRevenue / 3;
  return months.map((month, i) => ({
    month,
    revenue: Math.round(base * (0.65 + Math.random() * 0.7)),
    orders: Math.max(1, Math.round((stats.totalOrders / 6) * (0.6 + Math.random() * 0.8))),
  }));
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  processing: { bg: '#FEF3C7', text: '#D97706' },
  shipped: { bg: '#DBEAFE', text: '#2563EB' },
  delivered: { bg: '#D1FAE5', text: '#059669' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  pending: { bg: '#F0E8DA', text: '#9B8578' },
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Array<{ month: string; revenue: number; orders: number }>>([]);

  useEffect(() => {
    if (status === 'unauthenticated') return router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') return router.push('/');
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetch('/api/admin/stats')
        .then((r) => r.json())
        .then((d) => { setStats(d); setChartData(buildChartData(d)); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (loading || !stats) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>OVERVIEW</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Operational Insights</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#6B5344', fontFamily: 'Georgia, serif' }}>
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>OVERVIEW</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Operational Insights</h1>
        </div>
        <button style={{ border: '1px solid #C4A882', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', color: '#5C3317', background: 'none', cursor: 'pointer' }}
          className="hover:bg-[#F0E8DA] transition-colors">
          <Download size={14} /> EXPORT REPORT
        </button>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quarterly Revenue */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '2rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>QUARTERLY REVENUE</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#1A0F0A', marginTop: '0.5rem' }}>
            ₹{stats.quarterlyRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1.5rem' }}>
            <TrendingUp size={14} style={{ color: '#27AE60' }} />
            <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#27AE60' }}>+14.2% VS LAST Q</span>
            <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', marginLeft: '0.75rem', fontStyle: 'italic' }}>Reflecting growth in rare vintage batches.</span>
          </div>
        </div>

        {/* New Customers */}
        <div style={{ backgroundColor: '#3D1F0D', padding: '2rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#A0622A' }}>NEW CUSTOMERS</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#FAF8F4', marginTop: '0.5rem' }}>{stats.newCustomers.toLocaleString()}</p>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#C4A882', marginTop: '0.5rem' }}>Loyalty enrollment up 8% this month.</p>
          <Link href="/admin/customers">
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#FAF8F4', background: 'none', marginTop: '1.5rem', cursor: 'pointer' }}>
              VIEW DIRECTORY <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Inventory */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.5rem' }}>ACTIVE INVENTORY</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#1A0F0A' }}>{stats.totalProducts}</span>
            <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>SKUs</span>
          </div>
          {stats.lowStock > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344' }}>Low Stock Items</span>
                <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#D97706' }}>{stats.lowStock} Left</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#E8DFD0', borderRadius: '2px' }}>
                <div style={{ width: `${Math.min((stats.lowStock / stats.totalProducts) * 100, 100)}%`, height: '100%', backgroundColor: '#D97706', borderRadius: '2px' }} />
              </div>
            </div>
          )}
        </div>

        {/* New Arrival Alert */}
        <div style={{ backgroundColor: '#FFF8F0', border: '1px solid #E8DFD0', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
            🍯
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#D97706' }}>NEW ARRIVAL ALERT</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A', marginTop: '0.3rem' }}>Tasmanian Leatherwood Batch #704 is ready for fulfillment processing.</p>
            <Link href="/admin/inventory">
              <button style={{ border: '1px solid #C4A882', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', color: '#5C3317', padding: '6px 14px', marginTop: '0.75rem', background: 'none', cursor: 'pointer' }}
                className="hover:bg-[#F0E8DA] transition-colors">
                MANAGE BATCH
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.25rem' }}>REVENUE TREND</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>6-Month Overview</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5C3317" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5C3317" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 10, fill: '#9B8578' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 10, fill: '#9B8578' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip
                contentStyle={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', border: '1px solid #E8DFD0', borderRadius: 0 }}
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#5C3317" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders chart */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.25rem' }}>ORDER VOLUME</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A', marginBottom: '1.25rem' }}>Orders Per Month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 10, fill: '#9B8578' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: 10, fill: '#9B8578' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', border: '1px solid #E8DFD0', borderRadius: 0 }}
                formatter={(v) => [Number(v), 'Orders']}
              />
              <Bar dataKey="orders" fill="#A0622A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0F0A' }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em', color: '#5C3317', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            VIEW ALL ORDERS
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8DFD0' }}>
                {['ID', 'CUSTOMER', 'PRODUCT', 'DATE', 'TOTAL', 'STATUS'].map((h) => (
                  <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#9B8578', textAlign: 'left', padding: '0 0 0.75rem', paddingRight: '1rem' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '1rem 1rem 1rem 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#FAF8F4', fontWeight: 'bold', flexShrink: 0 }}>
                          {(order.user?.name || 'G').charAt(0).toUpperCase()}
                        </div>
                        {order.user?.name || 'Guest'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#6B5344', fontStyle: 'italic' }}>
                      {order.items?.[0]?.name || '—'}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.85rem', color: '#1A0F0A', fontWeight: '600' }}>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', letterSpacing: '0.06em', padding: '4px 10px', textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem 0', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
