import { ClickRecord } from '../types';

export interface AnalyticsSummary {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  productClicks: number;
  customOrderClicks: number;
  directContactClicks: number;
  dailyTimeline: { date: string; label: string; count: number; productCount: number; customCount: number }[];
  topProducts: { id: string; name: string; count: number; percentage: number }[];
  topCustomCategories: { id: string; name: string; count: number; percentage: number }[];
  popularSizes: { size: string; count: number }[];
}

export const computeAnalytics = (clicks: ClickRecord[]): AnalyticsSummary => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  let clicksToday = 0;
  let clicksThisWeek = 0;
  let clicksThisMonth = 0;
  let productClicks = 0;
  let customOrderClicks = 0;
  let directContactClicks = 0;

  const productCounts: Record<string, { name: string; count: number }> = {};
  const customCounts: Record<string, { name: string; count: number }> = {};
  const sizeCounts: Record<string, number> = {};

  // Initialize timeline for last 14 days
  const dailyMap: Record<string, { label: string; count: number; productCount: number; customCount: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap[dateKey] = { label, count: 0, productCount: 0, customCount: 0 };
  }

  clicks.forEach((clk) => {
    const time = new Date(clk.timestamp).getTime();
    const dateKey = clk.timestamp.split('T')[0];

    if (time >= startOfToday) {
      clicksToday++;
    }
    if (time >= sevenDaysAgo) {
      clicksThisWeek++;
    }
    if (time >= thirtyDaysAgo) {
      clicksThisMonth++;
    }

    if (clk.type === 'product') {
      productClicks++;
      if (!productCounts[clk.targetId]) {
        productCounts[clk.targetId] = { name: clk.targetName, count: 0 };
      }
      productCounts[clk.targetId].count++;

      if (clk.meta?.size) {
        sizeCounts[clk.meta.size] = (sizeCounts[clk.meta.size] || 0) + 1;
      }
    } else if (clk.type === 'custom_category') {
      customOrderClicks++;
      if (!customCounts[clk.targetId]) {
        customCounts[clk.targetId] = { name: clk.targetName, count: 0 };
      }
      customCounts[clk.targetId].count++;
    } else {
      directContactClicks++;
    }

    if (dailyMap[dateKey]) {
      dailyMap[dateKey].count++;
      if (clk.type === 'product') dailyMap[dateKey].productCount++;
      if (clk.type === 'custom_category') dailyMap[dateKey].customCount++;
    }
  });

  const topProducts = Object.entries(productCounts)
    .map(([id, item]) => ({
      id,
      name: item.name,
      count: item.count,
      percentage: productClicks > 0 ? Math.round((item.count / productClicks) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const topCustomCategories = Object.entries(customCounts)
    .map(([id, item]) => ({
      id,
      name: item.name,
      count: item.count,
      percentage: customOrderClicks > 0 ? Math.round((item.count / customOrderClicks) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const popularSizes = Object.entries(sizeCounts)
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.count - a.count);

  const dailyTimeline = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    label: data.label,
    count: data.count,
    productCount: data.productCount,
    customCount: data.customCount,
  }));

  return {
    totalClicks: clicks.length,
    clicksToday,
    clicksThisWeek,
    clicksThisMonth,
    productClicks,
    customOrderClicks,
    directContactClicks,
    dailyTimeline,
    topProducts,
    topCustomCategories,
    popularSizes,
  };
};
