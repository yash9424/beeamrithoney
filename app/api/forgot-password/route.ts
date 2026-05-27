import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordReset } from '@/lib/email';
import crypto from 'crypto';

const tokens = new Map<string, { email: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await connectDB();
    const user = await User.findOne({ email });
    // Always respond OK (don't leak user existence)
    if (!user) return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    tokens.set(token, { email, expires: Date.now() + 3600_000 });
    await sendPasswordReset(email, token);
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const entry = tokens.get(token);
    if (!entry || Date.now() > entry.expires) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    await connectDB();
    const user = await User.findOne({ email: entry.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    user.password = password;
    await user.save();
    tokens.delete(token);
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
