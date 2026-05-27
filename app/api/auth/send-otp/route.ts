import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { sendOtp } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();
    if (!email || !purpose) return NextResponse.json({ error: 'Email and purpose required' }, { status: 400 });

    await connectDB();

    if (purpose === 'register') {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    if (purpose === 'reset') {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (!existing) {
        // Don't leak whether email exists
        return NextResponse.json({ message: 'If that email is registered, a code has been sent.' });
      }
    }

    // Delete any existing OTP for this email+purpose
    await Otp.deleteMany({ email: email.toLowerCase(), purpose });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.create({ email: email.toLowerCase(), code, purpose, expiresAt });
    await sendOtp(email, code, purpose);

    return NextResponse.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
