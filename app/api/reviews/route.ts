import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
  await connectDB();
  const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { productId, rating, title, body, userName } = await req.json();
    if (!productId || !rating || !body) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    await connectDB();
    const review = await Review.create({
      product: productId, rating, title, body,
      userName: userName || session?.user?.name || 'Anonymous',
      user: session?.user?.id,
    });
    // Update product rating
    const all = await Review.find({ product: productId });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avg * 10) / 10, reviewCount: all.length });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
