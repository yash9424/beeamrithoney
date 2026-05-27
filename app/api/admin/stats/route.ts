import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();

    const now = new Date();
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [quarterlyRevenue, totalOrders, newCustomers, totalProducts, lowStock, recentOrders] =
      await Promise.all([
        Order.aggregate([
          { $match: { createdAt: { $gte: quarterStart }, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Order.countDocuments(),
        User.countDocuments({ createdAt: { $gte: monthStart }, role: 'user' }),
        Product.countDocuments(),
        Product.countDocuments({ stock: { $lt: 20 } }),
        Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      ]);

    return NextResponse.json({
      quarterlyRevenue: quarterlyRevenue[0]?.total || 0,
      totalOrders,
      newCustomers,
      totalProducts,
      lowStock,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
