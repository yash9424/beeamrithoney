import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Accept both ?product= and ?productId=
  const productId = searchParams.get('product') || searchParams.get('productId');
  await connectDB();
  const query = productId ? { product: productId } : {};
  const reviews = await Review.find(query).sort({ createdAt: -1 }).populate('product', 'name slug');
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    // Accept both field name conventions
    const productId = body.product || body.productId;
    const rating = body.rating;
    const comment = body.comment || body.body;
    const title = body.title || '';

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await connectDB();
    const review = await Review.create({
      product: productId,
      rating,
      title,
      body: comment,
      userName: session?.user?.name || 'Anonymous',
      user: session?.user?.id,
    });
    // Update product avg rating + count
    const all = await Review.find({ product: productId });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: all.length,
    });
    // Return with user populated for immediate display
    return NextResponse.json({
      _id: review._id,
      rating: review.rating,
      comment: review.body,
      user: { name: review.userName },
      createdAt: review.createdAt,
    }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
