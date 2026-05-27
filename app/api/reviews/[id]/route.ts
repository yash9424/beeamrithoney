import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

async function recalcProduct(productId: string) {
  const all = await Review.find({ product: productId });
  if (all.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
  } else {
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: all.length,
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { rating, body, title } = await req.json();
  await connectDB();
  const review = await Review.findByIdAndUpdate(
    params.id,
    { ...(rating && { rating }), ...(body && { body }), ...(title !== undefined && { title }) },
    { new: true }
  );
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await recalcProduct(String(review.product));
  return NextResponse.json(review);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  await connectDB();
  const review = await Review.findByIdAndDelete(params.id);
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await recalcProduct(String(review.product));
  return NextResponse.json({ ok: true });
}
