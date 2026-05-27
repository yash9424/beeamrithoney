'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2, X } from 'lucide-react';

interface Inquiry {
  _id: string;
  type: 'general' | 'wholesale';
  name: string;
  email: string;
  phone?: string;
  business?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  new:     { bg: '#FEF3C7', text: '#D97706' },
  read:    { bg: '#DBEAFE', text: '#2563EB' },
  replied: { bg: '#D1FAE5', text: '#059669' },
};

const TYPE_STYLE: Record<string, { bg: string; text: string }> = {
  general:   { bg: '#F0E8DA', text: '#5C3317' },
  wholesale: { bg: '#3D1F0D', text: '#FAF8F4' },
};

export default function AdminInquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set('type', filterType);
    if (filterStatus) params.set('status', filterStatus);
    const res = await fetch(`/api/inquiries?${params}`);
    const data = await res.json();
    setInquiries(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') load();
  }, [session, filterType, filterStatus]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    const res = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setUpdating(null);
    if (!res.ok) return toast.error('Failed to update');
    setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: newStatus as Inquiry['status'] } : i));
    if (selected?._id === id) setSelected(s => s ? { ...s, status: newStatus as Inquiry['status'] } : s);
    toast.success('Status updated');
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch('/api/inquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return toast.error('Failed to delete');
    setInquiries(prev => prev.filter(i => i._id !== id));
    if (selected?._id === id) setSelected(null);
    toast.success('Deleted');
  };

  const openDetail = (inq: Inquiry) => {
    setSelected(inq);
    if (inq.status === 'new') updateStatus(inq._id, 'read');
  };

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#9B8578' }}>MANAGEMENT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1A0F0A' }}>Inquiries</h1>
        </div>
        {newCount > 0 && (
          <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#D97706' }}>{newCount} new {newCount === 1 ? 'inquiry' : 'inquiries'}</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[['', 'ALL'], ['general', 'GENERAL'], ['wholesale', 'WHOLESALE']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterType(val)}
              style={{ border: '1px solid', borderColor: filterType === val ? '#5C3317' : '#C4A882', backgroundColor: filterType === val ? '#5C3317' : 'transparent', color: filterType === val ? '#FAF8F4' : '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', padding: '6px 12px', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ width: '1px', backgroundColor: '#E8DFD0', margin: '0 4px' }} />
        {/* Status filter */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[['', 'ALL STATUS'], ['new', 'NEW'], ['read', 'READ'], ['replied', 'REPLIED']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)}
              style={{ border: '1px solid', borderColor: filterStatus === val ? '#5C3317' : '#C4A882', backgroundColor: filterStatus === val ? '#5C3317' : 'transparent', color: filterStatus === val ? '#FAF8F4' : '#5C3317', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.62rem', letterSpacing: '0.08em', padding: '6px 12px', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Table */}
        <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#6B5344' }}>Loading…</div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#9B8578' }}>No inquiries found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E8DFD0' }}>
                    {['TYPE', 'NAME', 'EMAIL', 'DATE', 'STATUS', 'ACTIONS'].map(h => (
                      <th key={h} style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#9B8578', textAlign: 'left', padding: '1rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => {
                    const ts = TYPE_STYLE[inq.type];
                    const ss = STATUS_STYLE[inq.status];
                    const isNew = inq.status === 'new';
                    return (
                      <tr key={inq._id}
                        onClick={() => openDetail(inq)}
                        style={{ borderBottom: '1px solid #F5F0E8', cursor: 'pointer', backgroundColor: selected?._id === inq._id ? '#F5F0E8' : 'transparent' }}
                        className="hover:bg-[#F5F0E8] transition-colors">
                        <td style={{ padding: '1rem' }}>
                          <span style={{ backgroundColor: ts.bg, color: ts.text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '3px 8px', textTransform: 'capitalize' }}>
                            {inq.type}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A', fontWeight: isNew ? '700' : '400' }}>{inq.name}</p>
                          {inq.business && <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.65rem', color: '#9B8578', marginTop: '2px' }}>{inq.business}</p>}
                        </td>
                        <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.75rem', color: '#6B5344' }}>{inq.email}</td>
                        <td style={{ padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.72rem', color: '#9B8578', whiteSpace: 'nowrap' }}>
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ backgroundColor: ss.bg, color: ss.text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '3px 8px', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
                            {isNew && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />}
                            {inq.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <select
                              value={inq.status}
                              onChange={e => updateStatus(inq._id, e.target.value)}
                              disabled={updating === inq._id}
                              style={{ border: '1px solid #C4A882', backgroundColor: 'transparent', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', color: '#3D1F0D', padding: '4px 6px', cursor: 'pointer', outline: 'none' }}>
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                            <button onClick={() => deleteInquiry(inq._id)}
                              style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E8DFD0', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8DFD0' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0F0A' }}>Inquiry Detail</p>
              <button onClick={() => setSelected(null)} style={{ color: '#9B8578', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {/* Type + status */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                <span style={{ backgroundColor: TYPE_STYLE[selected.type].bg, color: TYPE_STYLE[selected.type].text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '4px 10px', textTransform: 'capitalize' }}>
                  {selected.type}
                </span>
                <span style={{ backgroundColor: STATUS_STYLE[selected.status].bg, color: STATUS_STYLE[selected.status].text, fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '4px 10px', textTransform: 'capitalize' }}>
                  {selected.status}
                </span>
              </div>

              {/* Fields */}
              {[
                { label: 'NAME', val: selected.name },
                { label: 'EMAIL', val: selected.email },
                ...(selected.phone ? [{ label: 'PHONE', val: selected.phone }] : []),
                ...(selected.business ? [{ label: 'BUSINESS', val: selected.business }] : []),
                { label: 'DATE', val: new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              ].map(({ label, val }) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#9B8578', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#1A0F0A' }}>{val}</p>
                </div>
              ))}

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#9B8578', marginBottom: '0.5rem' }}>MESSAGE</p>
                <div style={{ backgroundColor: '#F5F0E8', padding: '1rem', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.82rem', color: '#3D1F0D', lineHeight: '1.8' }}>
                  {selected.message}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`mailto:${selected.email}?subject=Re: Your Beeamrit ${selected.type === 'wholesale' ? 'Wholesale' : ''} Enquiry`}
                  onClick={() => updateStatus(selected._id, 'replied')}
                  style={{ display: 'block', textAlign: 'center', backgroundColor: '#5C3317', color: '#FAF8F4', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.1em', padding: '12px', textDecoration: 'none' }}
                  className="hover:bg-[#3D1F0D] transition-colors">
                  REPLY VIA EMAIL →
                </a>
                <button onClick={() => deleteInquiry(selected._id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: 'transparent', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '0.68rem', letterSpacing: '0.08em', padding: '10px', cursor: 'pointer', width: '100%' }}>
                  <Trash2 size={13} /> DELETE INQUIRY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
