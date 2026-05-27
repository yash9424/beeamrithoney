import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// GET — list all users OR single user with orders (?id=xxx)
export async function GET(req: NextRequest) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const user = await User.findById(id).select('-password').lean();
      if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const orders = await Order.find({ user: id }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ user, orders });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 20;
    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await User.countDocuments(query);
    return NextResponse.json({ users, total });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH — edit user (name, email, password, role)
export async function PATCH(req: NextRequest) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id, name, email, password, role, phone } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (password && password.length >= 6) user.password = password;

    await user.save();
    const updated = await User.findById(id).select('-password').lean();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — delete user
export async function DELETE(req: NextRequest) {
  try {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id } = await req.json();
    if (session.user?.id === id) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
