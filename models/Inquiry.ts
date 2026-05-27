import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  type: 'general' | 'wholesale';
  name: string;
  email: string;
  phone?: string;
  business?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  type: { type: String, enum: ['general', 'wholesale'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  business: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
