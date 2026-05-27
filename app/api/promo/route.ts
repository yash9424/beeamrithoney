import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET — admin: list all promo codes
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const codes = await PromoCode.find({}).sort({ createdAt: -1 });
  return NextResponse.json(codes);
}

// POST — dual use:
//   customer (has 'subtotal'): validate promo code
//   admin (has 'discountValue'): create new promo code
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    // Admin: create promo code
    if ('discountValue' in body) {
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const { code, discountType, discountValue, minOrder, maxUses, active, expiresAt } = body;
      const existing = await PromoCode.findOne({ code: code.toUpperCase() });
      if (existing) return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
      const promo = await PromoCode.create({
        code: code.toUpperCase(),
        type: discountType,
        value: discountValue,
        minOrder: minOrder || 0,
        maxUses: maxUses || 100,
        active: active !== false,
        expiresAt: expiresAt || undefined,
        usedCount: 0,
      });
      return NextResponse.json(promo, { status: 201 });
    }

    // Customer: validate promo code
    const { code, subtotal } = body;
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), active: true });
    if (!promo) return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 });
    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 });
    }
    if (promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: 'Promo code limit reached' }, { status: 400 });
    }
    if (subtotal < promo.minOrder) {
      return NextResponse.json({ error: `Minimum order ₹${promo.minOrder} required` }, { status: 400 });
    }
    const discount = promo.type === 'percent'
      ? Math.round((subtotal * promo.value) / 100 * 100) / 100
      : Math.min(promo.value, subtotal);
    return NextResponse.json({
      discount,
      type: promo.type,
      value: promo.value,
      code: promo.code,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — admin: update promo code (toggle active, etc.)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id, ...rest } = await req.json();
    const promo = await PromoCode.findByIdAndUpdate(id, rest, { new: true });
    if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(promo);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — admin: delete promo code
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const { id } = await req.json();
  await PromoCode.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
