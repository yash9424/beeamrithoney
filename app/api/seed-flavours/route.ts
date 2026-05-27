import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const products = [
  {
    name: 'Ajwain Raw Honey',
    slug: 'ajwain-raw-honey',
    description: 'Harvested from beehives nestled among sprawling ajwain (carom) fields, this raw honey carries a distinctly pungent, herbal, and slightly spicy character. Cold-extracted and unfiltered to preserve every enzyme, pollen grain, and natural compound. A deeply medicinal honey revered in Ayurvedic tradition for its digestive and respiratory benefits.',
    shortDescription: 'Pungent, herbal & spicy — raw honey from ajwain fields. Cold-extracted, unfiltered, Ayurvedic gold.',
    price: 499,
    variants: [
      { volume: '250gm', price: 499 },
      { volume: '500gm', price: 899 },
    ],
    volume: ['250gm', '500gm'],
    pricePerGram: 2.00,
    stock: 80,
    category: 'raw-honey',
    productCollection: 'heritage',
    origin: 'Rajasthan, India',
    flavour: 'Ajwain',
    features: ['Cold-extracted', 'Unfiltered', 'Ayurvedic properties', 'Rich in antioxidants', 'No additives'],
    tags: ['ajwain', 'raw', 'ayurvedic', 'herbal', 'unfiltered', 'medicinal'],
    badge: 'RAW HARVEST',
    isFeatured: true,
    isRareHarvest: false,
    rating: 4.8,
    reviewCount: 34,
    amazonUrl: '',
    flipkartUrl: '',
    images: [],
  },
  {
    name: 'Fennel Raw Honey',
    slug: 'fennel-raw-honey',
    description: 'Born from the golden fennel fields of Gujarat, this rare single-origin honey captures the sweet, anise-forward warmth of the saunf blossom. Slow-spun and left unfiltered, it retains its full aromatic complexity — a honey that lingers on the palate with floral sweetness and a gentle liquorice finish. Prized for its digestive and anti-inflammatory properties.',
    shortDescription: 'Sweet, anise & aromatic — single-origin fennel blossom honey. Slow-spun, unfiltered, utterly pure.',
    price: 549,
    variants: [
      { volume: '250gm', price: 549 },
      { volume: '500gm', price: 999 },
    ],
    volume: ['250gm', '500gm'],
    pricePerGram: 2.20,
    stock: 60,
    category: 'raw-honey',
    productCollection: 'single-origin',
    origin: 'Gujarat, India',
    flavour: 'Fennel',
    features: ['Single-origin', 'Slow-spun', 'Unfiltered', 'Digestive properties', 'Natural aroma'],
    tags: ['fennel', 'saunf', 'raw', 'single-origin', 'aromatic', 'floral'],
    badge: 'NEW ARRIVAL',
    isFeatured: true,
    isRareHarvest: true,
    rating: 4.9,
    reviewCount: 21,
    amazonUrl: '',
    flipkartUrl: '',
    images: [],
  },
];

export async function GET() {
  try {
    await connectDB();
    const results = [];
    for (const p of products) {
      const r = await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
      results.push({ slug: p.slug, upserted: r.upsertedCount > 0, modified: r.modifiedCount > 0 });
    }
    return NextResponse.json({ ok: true, results });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
