import { BusinessInfo, ClickRecord, CustomOrderCategory, Product, ProductReview, ThemeMode } from '../types';
import { DEFAULT_BUSINESS_INFO, DEFAULT_CUSTOM_CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaultData';

const STORAGE_KEYS = {
  PRODUCTS: 'helioz_products_v1',
  CUSTOM_CATEGORIES: 'helioz_custom_categories_v1',
  BUSINESS_INFO: 'helioz_business_info_v1',
  CLICKS: 'helioz_clicks_v1',
  ADMIN_AUTH: 'helioz_admin_auth_v1',
  ADMIN_SETTINGS: 'helioz_admin_settings_v1',
  COOKIE_CONSENT: 'helioz_cookie_consent_v1',
  THEME: 'helioz_theme_v1',
};

export interface AdminSettings {
  passwordHash: string; // Stored hash or simple secure token
  twoFactorEnabled: boolean;
  twoFactorPin: string;
  inactivityMinutes: number;
  defaultTheme?: 'dark' | 'light';
}

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  passwordHash: 'helioz@admin2026', // Owner default password
  twoFactorEnabled: false,
  twoFactorPin: '6379',
  inactivityMinutes: 15,
  defaultTheme: 'dark',
};

// Seed initial clicks so statistics display realistic insights out of the box
const getInitialClicks = (): ClickRecord[] => {
  const records: ClickRecord[] = [];
  const now = new Date();
  const products = DEFAULT_PRODUCTS;
  const categories = DEFAULT_CUSTOM_CATEGORIES;

  // Generate clicks spread across last 14 days
  for (let d = 14; d >= 0; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const dayCount = Math.floor(Math.random() * 8) + 4; // 4 to 12 clicks per day

    for (let i = 0; i < dayCount; i++) {
      const isProduct = Math.random() > 0.4;
      const hour = Math.floor(Math.random() * 12) + 10;
      const min = Math.floor(Math.random() * 60);
      const clickTime = new Date(dayDate);
      clickTime.setHours(hour, min, 0, 0);

      if (isProduct) {
        const prod = products[Math.floor(Math.random() * products.length)];
        records.push({
          id: `seed_prod_${d}_${i}`,
          timestamp: clickTime.toISOString(),
          type: 'product',
          targetId: prod.id,
          targetName: prod.name,
          meta: {
            size: prod.sizes[Math.floor(Math.random() * prod.sizes.length)],
            color: prod.colors[0]?.name,
            quantity: Math.random() > 0.7 ? 2 : 1,
            price: prod.price,
          },
        });
      } else {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        records.push({
          id: `seed_cat_${d}_${i}`,
          timestamp: clickTime.toISOString(),
          type: 'custom_category',
          targetId: cat.id,
          targetName: cat.title,
          meta: {
            occasion: cat.title,
            quantity: Math.floor(Math.random() * 40) + 10,
          },
        });
      }
    }
  }

  return records;
};

// --- Products ---
export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
};

// --- Custom Categories ---
export const getStoredCustomCategories = (): CustomOrderCategory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(DEFAULT_CUSTOM_CATEGORIES));
      return DEFAULT_CUSTOM_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CUSTOM_CATEGORIES;
  }
};

export const saveStoredCustomCategories = (categories: CustomOrderCategory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save custom categories', err);
  }
};

// --- Business Info ---
export const getStoredBusinessInfo = (): BusinessInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_INFO, JSON.stringify(DEFAULT_BUSINESS_INFO));
      return DEFAULT_BUSINESS_INFO;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BUSINESS_INFO;
  }
};

export const saveStoredBusinessInfo = (info: BusinessInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUSINESS_INFO, JSON.stringify(info));
  } catch (err) {
    console.error('Failed to save business info', err);
  }
};

// --- Click Analytics (Strict privacy: zero customer names or phone numbers) ---
export const getStoredClicks = (): ClickRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLICKS);
    if (!raw) {
      const initial = getInitialClicks();
      localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const recordWhatsAppClick = (
  type: 'product' | 'custom_category' | 'direct_contact',
  targetId: string,
  targetName: string,
  meta?: ClickRecord['meta']
): void => {
  try {
    const existing = getStoredClicks();
    const newRecord: ClickRecord = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      targetId,
      targetName,
      meta,
    };
    existing.push(newRecord);
    // Keep last 1,000 click events for snappy performance
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not record click metric', err);
  }
};

// --- Admin Settings & Authentication ---
export const getAdminSettings = (): AdminSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
      return DEFAULT_ADMIN_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const saveAdminSettings = (settings: AdminSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
};

export const getCookieConsent = (): 'accepted' | 'declined' | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT) as 'accepted' | 'declined' | null;
  } catch {
    return null;
  }
};

export const setCookieConsent = (val: 'accepted' | 'declined'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, val);
  } catch (err) {
    console.error('Failed to set cookie consent', err);
  }
};

// --- Theme Preference ---
export const getStoredTheme = (): ThemeMode => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark') {
      return raw;
    }
    const adminSettings = getAdminSettings();
    return adminSettings.defaultTheme || 'dark';
  } catch {
    return 'dark';
  }
};

export const saveStoredTheme = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Failed to save theme preference', err);
  }
};

// --- Buyer Reviews Handling ---
export const addProductReview = (
  productId: string,
  newReviewData: Omit<ProductReview, 'id' | 'date'>
): Product[] => {
  const products = getStoredProducts();
  const updated = products.map((prod) => {
    if (prod.id !== productId) return prod;

    const existingReviews = prod.reviews || [];
    const review: ProductReview = {
      ...newReviewData,
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [review, ...existingReviews];
    const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgScore = Number((totalScore / updatedReviews.length).toFixed(1));

    return {
      ...prod,
      reviews: updatedReviews,
      rating: avgScore,
      reviewCount: updatedReviews.length,
    };
  });

  saveStoredProducts(updated);
  return updated;
};

export const deleteProductReview = (productId: string, reviewId: string): Product[] => {
  const products = getStoredProducts();
  const updated = products.map((prod) => {
    if (prod.id !== productId) return prod;

    const existingReviews = prod.reviews || [];
    const updatedReviews = existingReviews.filter((r) => r.id !== reviewId);
    const avgScore =
      updatedReviews.length > 0
        ? Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
        : undefined;

    return {
      ...prod,
      reviews: updatedReviews,
      rating: avgScore,
      reviewCount: updatedReviews.length,
    };
  });

  saveStoredProducts(updated);
  return updated;
};

