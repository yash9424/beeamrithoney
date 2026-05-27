import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all slides (public) or specific slide
export async function GET() {
  await connectDB();
  const slides = await HeroSlide.find().sort({ order: 1 }).lean();
  return NextResponse.json(slides);
}

// POST — create new slide (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const slide = await HeroSlide.create(data);
  return NextResponse.json(slide, { status: 201 });
}

// PUT — update slide by _id (admin only)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const { _id, ...rest } = data;
  if (!_id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  const slide = await HeroSlide.findByIdAndUpdate(_id, rest, { new: true });
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(slide);
}

// DELETE — delete slide by id (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const { id } = await req.json();
  await HeroSlide.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
