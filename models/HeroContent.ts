import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroContent extends Document {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl: string;
  badge: string;
  active: boolean;
}

const HeroSchema = new Schema<IHeroContent>({
  heading: { type: String, default: 'Raw Honey.\nReal Nature.' },
  subheading: { type: String, default: "Crafted from the wild, delivered with purity. Experience the slow, viscous flow of nature's finest liquid gold." },
  ctaText: { type: String, default: 'EXPLORE COLLECTION →' },
  ctaLink: { type: String, default: '/shop' },
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  mediaUrl: { type: String, default: '' },
  badge: { type: String, default: 'NEW HARVEST 2024' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.HeroContent || mongoose.model<IHeroContent>('HeroContent', HeroSchema);
