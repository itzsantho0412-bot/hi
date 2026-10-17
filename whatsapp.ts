import { CustomOrderCategory, Product } from '../types';
import { recordWhatsAppClick } from './storage';

export const HELIOZ_PHONE_NUMBER = '916379407292';

/**
 * Builds the URL-encoded wa.me link for a specific product order.
 */
export const buildProductWhatsAppUrl = (
  phone: string,
  product: Product,
  size: string,
  color: string,
  quantity: number
): { url: string; rawMessage: string } => {
  const estimatedTotal = product.price * quantity;
  const isFreeDelivery = estimatedTotal >= 999;

  const rawMessage = [
    `Hello HELIOZ CLOTHING,`,
    ``,
    `I would like to order the following t-shirt:`,
    `▪ Product: ${product.name}`,
    `▪ Fit & Fabric: ${product.fit} (${product.gsm} GSM ${product.fabric})`,
    `▪ Size: ${size}`,
    `▪ Color: ${color}`,
    `▪ Quantity: ${quantity}`,
    `▪ Estimated Total: ₹${estimatedTotal.toLocaleString('en-IN')}`,
    `▪ Delivery: ${isFreeDelivery ? 'FREE (Order above ₹999)' : 'Standard (Free delivery on orders above ₹999)'}`,
    ``,
    `Please confirm availability, estimated delivery timeline, and delivery address requirements.`,
    `Thank you!`,
  ].join('\n');

  const encodedMessage = encodeURIComponent(rawMessage);
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, rawMessage };
};

/**
 * Builds the URL-encoded wa.me link for custom group/event orders.
 */
export const buildCustomOrderWhatsAppUrl = (
  phone: string,
  category: CustomOrderCategory,
  customDetails?: {
    estimatedQty?: number;
    preferredFabric?: string;
    targetDate?: string;
    notes?: string;
  }
): { url: string; rawMessage: string } => {
  const lines = [
    `Hello HELIOZ CLOTHING,`,
    ``,
    category.whatsappGreeting,
    ``,
    `▪ Custom Category: ${category.title}`,
  ];

  if (customDetails?.estimatedQty) {
    lines.push(`▪ Estimated Quantity: ${customDetails.estimatedQty} pcs`);
  } else {
    lines.push(`▪ Estimated Quantity: ${category.minQty}+ pcs`);
  }

  if (customDetails?.preferredFabric) {
    lines.push(`▪ Preferred Fabric: ${customDetails.preferredFabric}`);
  }

  if (customDetails?.targetDate) {
    lines.push(`▪ Target Event Date / Deadline: ${customDetails.targetDate}`);
  }

  if (customDetails?.notes && customDetails.notes.trim()) {
    lines.push(`▪ Design / Notes: ${customDetails.notes.trim()}`);
  }

  lines.push(
    ``,
    `Please share pricing tiers, fabric samples, and digital mockup assistance.`,
    `Thank you!`
  );

  const rawMessage = lines.join('\n');
  const encodedMessage = encodeURIComponent(rawMessage);
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, rawMessage };
};

/**
 * General direct chat inquiry link
 */
export const buildGeneralWhatsAppUrl = (phone: string, topic?: string): string => {
  const message = topic
    ? `Hello HELIOZ CLOTHING, I have an inquiry regarding ${topic}.`
    : `Hello HELIOZ CLOTHING, I would like to know more about your premium t-shirts and custom orders.`;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Triggers WhatsApp order, records privacy-safe click statistics, and opens the link.
 */
export const triggerProductWhatsAppOrder = (
  phone: string,
  product: Product,
  size: string,
  color: string,
  quantity: number
): void => {
  recordWhatsAppClick('product', product.id, product.name, {
    size,
    color,
    quantity,
    price: product.price * quantity,
  });

  const { url } = buildProductWhatsAppUrl(phone, product, size, color, quantity);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Triggers Custom category WhatsApp order and records analytics.
 */
export const triggerCustomCategoryWhatsAppOrder = (
  phone: string,
  category: CustomOrderCategory,
  customDetails?: {
    estimatedQty?: number;
    preferredFabric?: string;
    targetDate?: string;
    notes?: string;
  }
): void => {
  recordWhatsAppClick('custom_category', category.id, category.title, {
    occasion: category.title,
    quantity: customDetails?.estimatedQty || category.minQty,
  });

  const { url } = buildCustomOrderWhatsAppUrl(phone, category, customDetails);
  window.open(url, '_blank', 'noopener,noreferrer');
};
