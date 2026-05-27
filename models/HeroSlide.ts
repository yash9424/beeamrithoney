import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  type: 'image' | 'video';
  src: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

const HeroSlideSchema = new Schema<IHeroSlide>({
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  src: { type: String, default: '' },
  headline: { type: String, default: '' },
  subheadline: { type: String, default: '' },
  cta: { type: String, default: 'EXPLORE COLLECTION' },
  ctaLink: { type: String, default: '/shop' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
