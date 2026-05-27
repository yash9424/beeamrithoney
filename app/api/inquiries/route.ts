import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST — submit inquiry from contact form (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, business, message } = body;
    if (!type || !name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await connectDB();
    const inquiry = await Inquiry.create({ type, name, email, phone, business, message });
    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — admin: list all inquiries with optional filter
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const query: Record<string, string> = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH — admin: update status
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { id, status } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — admin: delete inquiry
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { id } = await req.json();
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
