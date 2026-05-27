import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  images: string[];
  category: string;
  productCollection: string;
  origin: string;
  volume: string[];
  variants?: Array<{ volume: string; price: number }>;
  stock: number;
  batchNumber: string;
  tags: string[];
  features: string[];
  isFeatured: boolean;
  isRareHarvest: boolean;
  badge?: string;
  rating: number;
  reviewCount: number;
  flavour?: string;
  pricePerGram?: number;
  amazonUrl?: string;
  flipkartUrl?: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    productCollection: { type: String, default: 'Wildflower Reserve' },
    origin: { type: String },
    volume: [{ type: String }],
    variants: [{ volume: { type: String }, price: { type: Number } }],
    stock: { type: Number, default: 100 },
    batchNumber: { type: String },
    tags: [{ type: String }],
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isRareHarvest: { type: Boolean, default: false },
    badge: { type: String },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    flavour: { type: String, default: '' },
    pricePerGram: { type: Number, default: 0 },
    amazonUrl: { type: String, default: '' },
    flipkartUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
