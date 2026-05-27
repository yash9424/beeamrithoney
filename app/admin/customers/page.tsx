'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, X, Search, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  addresses?: Array<{
    firstName: string; lastName: string; street: string;
    city: string; state: string; postalCode: string; country: string; isDefault: boolean;
  }>;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{ name: string; quantity: number; price: number; volume: string }>;
  shippingAddress: { firstName: string; lastName: string; street: string; city: string; state: string; postalCode: string; country: string; email: string; phone: string };
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  processing: { bg: '#FEF3C7', text: '#D97706' },
  shipped:    { bg: '#DBEAFE', text: '#2563EB' },
  delivered:  { bg: '#D1FAE5', text: '#059669' },
  cancelled:  { bg: '#FEE2E2', text: '#DC2626' },
  pending:    { bg: '#F0E8DA', text: '#9B8578' },
};

const inp = { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #C4A882', padding: '8px 0', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', outline: 'none' };
const lbl = { fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#9B8578', display: 'block', marginBottom: '0.3rem' };

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // View panel
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewOrders, setViewOrders] = useState<Order[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewTab, setViewTab] = useState<'info' | 'orders'>('info');

  // Edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const loadUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') loadUsers();
  }, [session, search]);

  const openView = async (user: User) => {
    setViewUser(user);
    setViewTab('info');
    setViewLoading(true);
    const res = await fetch(`/api/admin/users?id=${user._id}`);
    const data = await res.json();
    setViewOrders(data.orders || []);
    setViewLoading(false);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role });
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editUser._id, ...editForm }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return toast.error(data.error || 'Failed to save');
    toast.success('Customer updated');
    setUsers(prev => prev.map(u => u._id === editUser._id ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role } : u));
    if (viewUser?._id === editUser._id) setViewUser(v => v ? { ...v, name: editForm.name, email: editForm.email, role: editForm.role } : v);
    setEditUser(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer? This cannot be undone.')) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || 'Failed to delete');
    toast.success('Customer deleted');
    setUsers(prev => prev.filter(u => u._id !== id));
    setTotal(t => t - 1);
    if (viewUser?._id === id) setViewUser(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MANAGEMENT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Customers</h1>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344', marginTop: '0.25rem' }}>{total} registered members</p>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #C4A882', padding: '8px 14px', backgroundColor: '#FAF8F4' }}>
          <Search size={14} style={{ color: '#9B8578', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email…"
            style={{ border: 'none', outline: 'none', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', backgroundColor: 'transparent', width: '200px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: viewUser ? '1fr 400px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Table ── */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading customers…</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E8DFD0' }}>
                    {['CUSTOMER', 'EMAIL', 'PHONE', 'ROLE', 'JOINED', 'ACTIONS'].map(h => (
                      <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', textAlign: 'left', padding: '1rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #F5F0E8', backgroundColor: viewUser?._id === u._id ? '#F5F0E8' : 'transparent' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#FAF8F4', fontWeight: 'bold', flexShrink: 0 }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>{u.email}</td>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#9B8578' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: u.role === 'admin' ? '#FEF3C7' : '#D1FAE5', color: u.role === 'admin' ? '#D97706' : '#059669', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '3px 10px', textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openView(u)} title="View" style={{ color: '#5C3317', background: 'none', border: '1px solid #C4A882', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center' }}>
                            <Eye size={13} />
                          </button>
                          <button onClick={() => openEdit(u)} title="Edit" style={{ color: '#2563EB', background: 'none', border: '1px solid #BFDBFE', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center' }}>
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleDelete(u._id)} title="Delete" style={{ color: '#DC2626', background: 'none', border: '1px solid #FCA5A5', cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No customers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── View Panel ── */}
        {viewUser && (
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', position: 'sticky', top: '80px', maxHeight: '85vh', overflowY: 'auto' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8DFD0', position: 'sticky', top: 0, backgroundColor: '#FAF8F4', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3D1F0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.8rem', color: '#FAF8F4', fontWeight: 'bold', flexShrink: 0 }}>
                  {viewUser.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>{viewUser.name}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578' }}>{viewUser.email}</p>
                </div>
              </div>
              <button onClick={() => setViewUser(null)} style={{ color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E8DFD0' }}>
              {(['info', 'orders'] as const).map(t => (
                <button key={t} onClick={() => setViewTab(t)}
                  style={{ flex: 1, padding: '0.75rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.08em', color: viewTab === t ? '#1A0F0A' : '#9B8578', background: 'none', border: 'none', borderBottom: viewTab === t ? '2px solid #5C3317' : '2px solid transparent', cursor: 'pointer', textTransform: 'uppercase' as const }}>
                  {t === 'info' ? 'Customer Info' : `Orders (${viewOrders.length})`}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem' }}>
              {viewTab === 'info' && (
                <div>
                  {/* Basic info */}
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '1rem' }}>ACCOUNT DETAILS</p>
                  {[
                    { label: 'FULL NAME', val: viewUser.name },
                    { label: 'EMAIL', val: viewUser.email },
                    { label: 'PHONE', val: viewUser.phone || '—' },
                    { label: 'ROLE', val: viewUser.role.toUpperCase() },
                    { label: 'MEMBER SINCE', val: new Date(viewUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'TOTAL ORDERS', val: String(viewOrders.length) },
                    { label: 'TOTAL SPENT', val: `₹${viewOrders.reduce((s, o) => s + o.total, 0).toFixed(2)}` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #F5F0E8' }}>
                      <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', color: '#9B8578' }}>{label}</span>
                      <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.78rem', color: '#1A0F0A', fontWeight: '500', textAlign: 'right', maxWidth: '200px' }}>{val}</span>
                    </div>
                  ))}

                  {/* Saved addresses */}
                  {viewUser.addresses && viewUser.addresses.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.75rem' }}>SAVED ADDRESSES</p>
                      {viewUser.addresses.map((a, i) => (
                        <div key={i} style={{ backgroundColor: '#F5F0E8', padding: '0.75rem 1rem', marginBottom: '6px', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#3D1F0D', lineHeight: '1.7' }}>
                          {a.isDefault && <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: '#A0622A', display: 'block', marginBottom: '2px' }}>DEFAULT</span>}
                          <p>{a.firstName} {a.lastName}</p>
                          <p>{a.street}, {a.city}, {a.state} {a.postalCode}</p>
                          <p>{a.country}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
                    <button onClick={() => openEdit(viewUser)}
                      style={{ flex: 1, backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', padding: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      className="hover:bg-[#3D1F0D] transition-colors">
                      <Edit size={13} /> EDIT CUSTOMER
                    </button>
                    <button onClick={() => handleDelete(viewUser._id)}
                      style={{ border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: 'transparent', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}

              {viewTab === 'orders' && (
                <div>
                  {viewLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading orders…</div>
                  ) : viewOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No orders yet</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {viewOrders.map(order => {
                        const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                        return (
                          <div key={order._id} style={{ border: '1px solid #E8DFD0', padding: '1rem', backgroundColor: '#FAF8F4' }}>
                            {/* Order header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                              <div>
                                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: '#1A0F0A' }}>#{order.orderNumber}</p>
                                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', marginTop: '2px' }}>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>₹{order.total.toFixed(2)}</p>
                                <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.06em', padding: '2px 8px', textTransform: 'capitalize', display: 'inline-block', marginTop: '3px' }}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            {/* Items */}
                            <div style={{ borderTop: '1px solid #F0E8DA', paddingTop: '0.6rem', marginBottom: '0.6rem' }}>
                              {order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#6B5344', padding: '2px 0' }}>
                                  <span>{item.name} ({item.volume}) × {item.quantity}</span>
                                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            {/* Shipping + Payment */}
                            <div style={{ borderTop: '1px solid #F0E8DA', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {[
                                { label: 'Payment', val: `${order.paymentMethod?.replace('_', ' ')} — ${order.paymentStatus}` },
                                { label: 'Ship to', val: `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}` },
                                { label: 'Email', val: order.shippingAddress?.email },
                                { label: 'Phone', val: order.shippingAddress?.phone || '—' },
                              ].map(({ label, val }) => (
                                <div key={label} style={{ display: 'flex', gap: '8px' }}>
                                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', color: '#9B8578', minWidth: '52px' }}>{label}</span>
                                  <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.7rem', color: '#3D1F0D', textTransform: 'capitalize' }}>{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FAF8F4', width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setEditUser(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578', marginBottom: '0.25rem' }}>EDITING</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A0F0A', marginBottom: '1.75rem' }}>{editUser.name}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={lbl}>FULL NAME</label>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>EMAIL ADDRESS</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>MOBILE NUMBER</label>
                <input type="tel" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={inp} placeholder="+91 00000 00000" />
              </div>
              <div>
                <label style={lbl}>NEW PASSWORD <span style={{ color: '#C4A882' }}>(leave blank to keep current)</span></label>
                <input type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} style={inp} placeholder="Min 6 characters" />
              </div>
              <div>
                <label style={lbl}>ROLE</label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  style={{ ...inp, cursor: 'pointer' }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
              <button onClick={() => setEditUser(null)}
                style={{ flex: 1, border: '1px solid #C4A882', color: '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.08em', padding: '12px', background: 'none', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.08em', padding: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                className="hover:bg-[#3D1F0D] transition-colors disabled:opacity-60">
                <Save size={13} /> {saving ? 'SAVING…' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
