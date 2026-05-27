import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  code: string;
  purpose: 'register' | 'reset';
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'reset'], required: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired docs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
