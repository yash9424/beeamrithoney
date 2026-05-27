export interface Product {
  _id: string;
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
  createdAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  volume: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  ecoPackaging: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}
