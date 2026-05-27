import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Otp from '@/models/Otp';

export async function POST(req: NextRequest) {
  try {
    const { email, code, purpose } = await req.json();
    if (!email || !code || !purpose) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectDB();

    const record = await Otp.findOne({ email: email.toLowerCase(), purpose });
    if (!record) return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
    if (new Date() > record.expiresAt) {
      await record.deleteOne();
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }
    if (record.code !== code) return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 });

    // Delete OTP after successful verification
    await record.deleteOne();

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
