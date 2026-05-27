import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const user = await User.findById(session.user.id).populate('wishlist');
  return NextResponse.json(user?.wishlist || []);
}

// POST — toggle product in wishlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const list: string[] = (user as { wishlist?: string[] }).wishlist || [];
  const idx = list.indexOf(productId);
  if (idx > -1) { list.splice(idx, 1); } else { list.push(productId); }
  (user as { wishlist?: string[] }).wishlist = list;
  await user.save();
  return NextResponse.json({ wishlist: list, added: idx === -1 });
}

// DELETE — remove specific product from wishlist
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { product: productId } = await req.json();
  await connectDB();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  return NextResponse.json({ wishlist: user?.wishlist || [] });
}
