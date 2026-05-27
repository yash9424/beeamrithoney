import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { Product as IProduct } from '@/types';
import HeroCarousel from '@/components/HeroCarousel';
import HomeClient from '@/components/HomeClient';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  return (
    <div>
      <HeroCarousel />
      <HomeClient products={featured} />
    </div>
  );
}
