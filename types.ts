export type TShirtFit = 'Oversized' | 'Drop-Shoulder' | 'Classic Relaxed' | 'Boxy Streetwear' | 'Pique Polo';

export type StockStatus = 'in_stock' | 'low_stock' | 'made_to_order';

export interface ProductColor {
  name: string;
  hex: string;
}

export type ThemeMode = 'dark' | 'light';

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
  verifiedBuyer?: boolean;
  date: string; // ISO or YYYY-MM-DD
}

export interface Product {
  id: string;
  name: string;
  category: string;
  fit: TShirtFit;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  gsm: number;
  fabric: string;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  description: string;
  features: string[];
  careInstructions: string[];
  stockStatus: StockStatus;
  isFeatured: boolean;
  isHidden?: boolean;
  createdDate: string;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}

export interface CustomOrderCategory {
  id: string;
  title: string;
  badge: string;
  slug: string;
  summary: string;
  minQty: number;
  turnaround: string;
  buttonLabel: string;
  whatsappGreeting: string;
  idealFor: string[];
  features: string[];
  fabricOptions: string[];
  printOptions: string[];
  sampleImage: string;
}

export interface ClickRecord {
  id: string;
  timestamp: string; // ISO string
  type: 'product' | 'custom_category' | 'direct_contact';
  targetId: string;
  targetName: string;
  meta?: {
    size?: string;
    color?: string;
    quantity?: number;
    price?: number;
    occasion?: string;
  };
}

export interface BusinessInfo {
  brandName: string;
  ownerName: string;
  phone: string; // international digits without plus for wa.me e.g. "916379407292"
  displayPhone: string; // "+91 6379407292"
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  businessHours: string;
  businessHoursDetail: {
    weekdays: string;
    sunday: string;
  };
  grievanceOfficer: {
    name: string;
    email: string;
    designation: string;
    responseWindow: string;
  };
  isGstRegistered: boolean;
  gstNumber?: string;
}

export interface SizeMeasurement {
  size: string;
  chestInches: number;
  chestCm: number;
  lengthInches: number;
  lengthCm: number;
  shoulderInches: number;
  shoulderCm: number;
  sleeveInches: number;
  sleeveCm: number;
}
