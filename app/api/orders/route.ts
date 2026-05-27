import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import PromoCode from '@/models/PromoCode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmation } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const query = session.user?.role === 'admin'
      ? {}
      : { $or: [{ user: session.user?.id }, { guestEmail: session.user?.email }] };
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.product', 'name slug');
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const session = await getServerSession(authOptions);

    const orderNumber = generateOrderNumber();

    // Calculate totals
    const subtotal: number = data.items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0
    );

    // Apply promo discount
    let discount = 0;
    if (data.promoCode) {
      const promo = await PromoCode.findOne({ code: data.promoCode.toUpperCase(), active: true });
      if (promo && promo.usedCount < promo.maxUses) {
        discount = promo.type === 'percent' ? (subtotal * promo.value) / 100 : promo.value;
        promo.usedCount += 1;
        await promo.save();
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = discountedSubtotal > 100 ? 0 : 12;
    const total = discountedSubtotal + shipping;

    // Create order
    const order = await Order.create({
      ...data,
      orderNumber,
      user: session?.user?.id || undefined,
      subtotal,
      discount,
      shipping,
      total,
      paymentStatus: 'pending',
      status: 'processing',
    });

    // Deduct stock
    for (const item of data.items as { product: string; quantity: number }[]) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Send confirmation email (non-blocking)
    const toEmail = data.shippingAddress?.email || data.guestEmail || session?.user?.email;
    if (toEmail) {
      sendOrderConfirmation(toEmail, order).catch(() => {});
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
