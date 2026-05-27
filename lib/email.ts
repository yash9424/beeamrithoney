import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    // Dev: log to console if email not configured
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user, pass },
  });
}

export async function sendOrderConfirmation(to: string, order: { orderNumber: string; total: number; items: Array<{ name: string; quantity: number; price: number }> }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`📧 [DEV] Order confirmation email would be sent to: ${to}`);
    console.log(`   Order #${order.orderNumber} — $${order.total.toFixed(2)}`);
    return;
  }

  const itemRows = order.items.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #f0e8da">${i.name}</td><td style="padding:8px 0;border-bottom:1px solid #f0e8da;text-align:right">×${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #f0e8da;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td></tr>`
  ).join('');

  await transporter.sendMail({
    from: `"Beeamrit" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed — #${order.orderNumber} 🍯`,
    html: `
      <div style="max-width:560px;margin:0 auto;font-family:Georgia,serif;background:#faf8f4;padding:40px 32px">
        <h1 style="font-size:1.8rem;color:#1a0f0a;margin-bottom:8px">Beeamrit</h1>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.75rem;letter-spacing:0.1em;color:#9b8578;margin-bottom:32px">RARE VINTAGE ORGANIC HONEY</p>
        <h2 style="font-size:1.3rem;color:#1a0f0a;margin-bottom:8px">Order Confirmed 🍯</h2>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.85rem;color:#6b5344">Your order <strong>#${order.orderNumber}</strong> has been received and is being prepared.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">${itemRows}</table>
        <div style="background:#3d1f0d;padding:16px 20px;display:flex;justify-content:space-between">
          <span style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.72rem;letter-spacing:0.1em;color:#c4a882">TOTAL</span>
          <span style="font-family:Georgia,serif;font-size:1.2rem;color:#faf8f4">$${order.total.toFixed(2)}</span>
        </div>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.75rem;color:#9b8578;margin-top:24px;line-height:1.7">Thank you for choosing Beeamrit. Your honey is being packed in 100% biodegradable materials and will ship soon.</p>
      </div>
    `,
  });
}

export async function sendOtp(to: string, code: string, purpose: 'register' | 'reset') {
  const transporter = getTransporter();
  const subject = purpose === 'register' ? 'Verify your Beeamrit account' : 'Reset your Beeamrit password';
  const heading = purpose === 'register' ? 'Confirm Your Email' : 'Password Reset Code';
  const body = purpose === 'register'
    ? 'Use the code below to verify your email and complete registration.'
    : 'Use the code below to reset your password.';

  if (!transporter) {
    console.log(`📧 [DEV] OTP for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: `"Beeamrit" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="max-width:480px;margin:0 auto;font-family:Georgia,serif;background:#faf8f4;padding:40px 32px">
        <h1 style="font-size:1.5rem;color:#1a0f0a;margin-bottom:4px">Beeamrit</h1>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.7rem;letter-spacing:0.1em;color:#9b8578;margin-bottom:28px">RARE VINTAGE ORGANIC HONEY</p>
        <h2 style="font-size:1.2rem;color:#1a0f0a;margin-bottom:8px">${heading}</h2>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.85rem;color:#6b5344;line-height:1.7">${body}</p>
        <div style="background:#3d1f0d;padding:24px;text-align:center;margin:24px 0">
          <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.65rem;letter-spacing:0.15em;color:#c4a882;margin-bottom:8px">YOUR CODE</p>
          <p style="font-family:Georgia,serif;font-size:2.5rem;color:#faf8f4;letter-spacing:0.3em;margin:0">${code}</p>
        </div>
        <p style="font-family:Helvetica Neue,Arial,sans-serif;font-size:0.72rem;color:#9b8578;line-height:1.7">This code expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordReset(to: string, token: string) {
  const transporter = getTransporter();
  const link = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  if (!transporter) {
    console.log(`📧 [DEV] Password reset link: ${link}`);
    return;
  }
  await transporter.sendMail({
    from: `"Beeamrit" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your Beeamrit password',
    html: `<div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px">
      <h2 style="font-family:Georgia,serif;color:#1a0f0a">Reset Password</h2>
      <p style="color:#6b5344;line-height:1.7">Click below to reset your password. This link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;background:#5c3317;color:#faf8f4;padding:14px 28px;text-decoration:none;font-size:0.75rem;letter-spacing:0.1em;margin:20px 0">RESET PASSWORD</a>
      <p style="color:#9b8578;font-size:0.75rem">If you didn't request this, ignore this email.</p>
    </div>`,
  });
}
