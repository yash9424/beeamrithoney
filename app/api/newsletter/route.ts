import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    await connectDB();
    await Newsletter.findOneAndUpdate({ email }, { email }, { upsert: true });
    return NextResponse.json({ message: 'Subscribed! 🍯' });
  } catch {
    return NextResponse.json({ error: 'Already subscribed or invalid email' }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
