import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/create-admin
 *
 * Creates the admin account using the credentials in .env.local:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * - If the admin already exists, it just confirms (no duplicate created).
 * - If the email exists as a regular user, it upgrades that account to admin.
 * - Safe to call multiple times.
 */
export async function GET() {
  try {
    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role === 'admin') {
        return NextResponse.json({
          message: '✅ Admin already exists. You can log in now.',
          email,
          password,
          loginUrl: '/login',
          adminUrl: '/admin',
        });
      }
      // Upgrade existing user to admin
      existing.role = 'admin';
      await existing.save();
      return NextResponse.json({
        message: '✅ Existing account upgraded to admin.',
        email,
        password: '(your existing password)',
        loginUrl: '/login',
        adminUrl: '/admin',
      });
    }

    // Create brand-new admin user
    await User.create({ name, email, password, role: 'admin' });

    return NextResponse.json({
      message: '✅ Admin account created successfully!',
      credentials: {
        email,
        password,
      },
      next_steps: [
        '1. Go to http://localhost:3000/login',
        '2. Enter the email and password above',
        '3. Click "ENTER THE HIVE"',
        '4. Go to http://localhost:3000/admin',
      ],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
