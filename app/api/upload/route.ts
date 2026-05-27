import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Always use Cloudinary if configured
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      const { uploadImage } = await import('@/lib/cloudinary');
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      const cloudUrl = await uploadImage(base64);
      return NextResponse.json({ url: cloudUrl });
    }

    // Local fallback (only works in dev)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
