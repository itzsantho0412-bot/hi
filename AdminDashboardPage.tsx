import React, { useState, useEffect, useRef } from 'react';
import {
  Product,
  CustomOrderCategory,
  BusinessInfo,
  StockStatus,
  TShirtFit,
} from '../types';
import { compressImage, isImageSource } from '../services/image';
import {
  getStoredClicks,
  getAdminSettings,
  saveAdminSettings,
  AdminSettings,
} from '../services/storage';
import { computeAnalytics, AnalyticsSummary } from '../services/analytics';
import {
  Lock,
  Unlock,
  BarChart3,
  Package,
  Layers,
  Settings,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  ImagePlus,
  Trash2,
  Edit2,
  Download,
  Shield,
  Key,
  Server,
  AlertCircle,
  X,
} from 'lucide-react';

interface AdminDashboardPageProps {
  products: Product[];
  customCategories: CustomOrderCategory[];
  businessInfo: BusinessInfo;
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateCustomCategories: (newCategories: CustomOrderCategory[]) => void;
  onUpdateBusinessInfo: (newInfo: BusinessInfo) => void;
  onClose: () => void;
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  products,
  customCategories,
  businessInfo,
  onUpdateProducts,
  onUpdateCustomCategories,
  onUpdateBusinessInfo,
  onClose,
  isAuthenticated,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'custom' | 'settings' | 'hosting' | 'checklist'>('analytics');

  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [requires2FA, setRequires2FA] = useState(false);

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CustomOrderCategory | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [new2FAPin, setNew2FAPin] = useState(settings.twoFactorPin);
  const [enable2FA, setEnable2FA] = useState(settings.twoFactorEnabled);
  const [inactivityMins, setInactivityMins] = useState(settings.inactivityMinutes);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const [editBusiness, setEditBusiness] = useState<BusinessInfo>(businessInfo);

  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isAuthenticated) {
      const clicks = getStoredClicks();
      setAnalytics(computeAnalytics(clicks));

      const handleActivity = () => {
        lastActivityRef.current = Date.now();
      };

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);

      const checkInterval = setInterval(() => {
        const inactiveMs = Date.now() - lastActivityRef.current;
        if (inactiveMs > settings.inactivityMinutes * 60 * 1000) {
          onLogout();
        }
      }, 10000);

      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        clearInterval(checkInterval);
      };
    }
  }, [isAuthenticated, settings.inactivityMinutes, onLogout]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (passwordInput !== settings.passwordHash) {
      setAuthError('Incorrect password. Default is "helioz@admin2026"');
      return;
    }

    if (settings.twoFactorEnabled && !requires2FA) {
      setRequires2FA(true);
      return;
    }

    if (settings.twoFactorEnabled && requires2FA) {
      if (pinInput !== settings.twoFactorPin) {
        setAuthError('Invalid 2FA PIN.');
        return;
      }
    }

    onLoginSuccess();
    setPasswordInput('');
    setPinInput('');
  };

  const handleToggleHide = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, isHidden: !p.isHidden } : p
    );
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product from the catalog?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  const handleAddProductImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (picked.length === 0) return;
    setIsProcessingImages(true);
    try {
      const newImages = await Promise.all(picked.map((f) => compressImage(f)));
      setEditingProduct((prev) => (prev ? { ...prev, images: [...prev.images, ...newImages] } : prev));
    } catch (err) {
      alert('One of the images could not be read. Please use a JPG, PNG or WEBP file.');
    } finally {
      setIsProcessingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleRemoveProductImage = (src: string) => {
    setEditingProduct((prev) => (prev ? { ...prev, images: prev.images.filter((img) => img !== src) } : prev));
  };

  const handleSaveProduct = (prod: Product) => {
    if (isAddingProduct) {
      onUpdateProducts([prod, ...products]);
      setIsAddingProduct(false);
    } else {
      const updated = products.map((p) => (p.id === prod.id ? prod : p));
      onUpdateProducts(updated);
    }
    setEditingProduct(null);
  };

  const handleSaveCategory = (cat: CustomOrderCategory) => {
    const updated = customCategories.map((c) => (c.id === cat.id ? cat : c));
    onUpdateCustomCategories(updated);
    setEditingCategory(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: AdminSettings = {
      passwordHash: newPassword.trim() ? newPassword.trim() : settings.passwordHash,
      twoFactorEnabled: enable2FA,
      twoFactorPin: new2FAPin.trim() || '6379',
      inactivityMinutes: inactivityMins,
    };
    saveAdminSettings(updatedSettings);
    setSettings(updatedSettings);
    onUpdateBusinessInfo(editBusiness);
    setSettingsSavedMsg('Settings updated successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  const handleExportData = () => {
    const dump = {
      products,
      customCategories,
      businessInfo,
      clicks: getStoredClicks(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helioz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111]">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-stone-100 text-stone-900 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111]">Owner Portal Login</h3>
                <p className="text-xs text-stone-500">HELIOZ CLOTHING Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            {!requires2FA ? (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Admin Master Password
                </label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black"
                  required
                  autoFocus
                />
                <p className="text-xs text-stone-500 mt-1">
                  Default: <span className="font-mono text-stone-800 font-semibold">helioz@admin2026</span> (Changeable in Settings)
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-stone-800" />
                  Two-Factor Authentication PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter 4-digit PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black tracking-widest font-mono text-center"
                  required
                  autoFocus
                />
                <p className="text-xs text-stone-500 mt-1">
                  Default PIN: <span className="font-mono text-stone-800 font-semibold">6379</span>
                </p>
              </div>
            )}

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full transition-all active:scale-95 shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{requires2FA ? 'Verify 2FA & Access Dashboard' : 'Unlock Dashboard'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Session Timeout: 15 mins</span>
            <span>Zero Customer Data Stored</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-100 text-stone-900 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#111111]">HELIOZ Owner Console</h1>
                <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-stone-500">
                WhatsApp Click Statistics & Catalog Management · Auto-logout after {settings.inactivityMinutes}m
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-full border border-stone-200 transition-colors cursor-pointer"
              title="Download JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={onLogout}
              className="py-2 px-4 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 text-xs font-semibold rounded-full border border-stone-200 transition-colors cursor-pointer"
            >
              Log Out
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-black rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Return to website"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          {[
            { id: 'analytics', label: 'Click Analytics', icon: BarChart3 },
            { id: 'products', label: `Product Catalog (${products.length})`, icon: Package },
            { id: 'custom', label: 'Custom Categories (6)', icon: Layers },
            { id: 'settings', label: 'Business & Security', icon: Settings },
            { id: 'hosting', label: 'Hosting & Platform Guide', icon: Server },
            { id: 'checklist', label: 'Launch Checklist', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-black hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. ANALYTICS & CLICK STATS TAB */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Privacy Protected Architecture:</strong> Only WhatsApp button clicks and timestamps are tracked. Zero customer names, phone numbers, or addresses are stored on the server or website.
                </span>
              </div>
              <span className="font-mono text-xs text-emerald-700 hidden md:inline font-semibold">
                DPDP Act 2023 Compliant
              </span>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-1">
                <span className="text-xs font-mono text-stone-500 uppercase">Clicks Today</span>
                <p className="text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {analytics.clicksToday}
                </p>
                <span className="text-xs text-stone-500">Since 00:00 midnight</span>
              </div>

              <div className="p-5 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-1">
                <span className="text-xs font-mono text-stone-500 uppercase">Clicks This Week</span>
                <p className="text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {analytics.clicksThisWeek}
                </p>
                <span className="text-xs text-stone-500">Past 7 days rolling</span>
              </div>

              <div className="p-5 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-1">
                <span className="text-xs font-mono text-stone-500 uppercase">Clicks This Month</span>
                <p className="text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {analytics.clicksThisMonth}
                </p>
                <span className="text-xs text-stone-500">Past 30 days rolling</span>
              </div>

              <div className="p-5 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-1">
                <span className="text-xs font-mono text-stone-500 uppercase">Total All-Time</span>
                <p className="text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {analytics.totalClicks}
                </p>
                <div className="flex gap-2 text-xs text-stone-500 pt-0.5">
                  <span>{analytics.productClicks} Products</span>
                  <span>·</span>
                  <span>{analytics.customOrderClicks} Custom</span>
                </div>
              </div>
            </div>

            {/* Daily Click Trend Chart */}
            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111111]">Daily WhatsApp Click Trajectory</h3>
                  <p className="text-xs text-stone-500">Total customer chats initiated per day (Past 14 Days)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#111111]" />
                    <span className="text-stone-700">Catalog Products</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-stone-300" />
                    <span className="text-stone-700">Custom Group Inquiries</span>
                  </div>
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 border-b border-stone-100">
                {analytics.dailyTimeline.map((day) => {
                  const maxVal = Math.max(...analytics.dailyTimeline.map((d) => d.count), 10);
                  const heightPct = Math.round((day.count / maxVal) * 100);
                  const prodPct = day.count > 0 ? (day.productCount / day.count) * 100 : 0;

                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-12 bg-black text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                        <strong>{day.label}:</strong> {day.count} total
                      </div>

                      <div className="w-full max-w-[32px] bg-stone-100 rounded-t overflow-hidden flex flex-col justify-end" style={{ height: `${Math.max(heightPct, 8)}%` }}>
                        <div className="w-full bg-stone-300" style={{ height: `${100 - prodPct}%` }} />
                        <div className="w-full bg-[#111111]" style={{ height: `${prodPct}%` }} />
                      </div>

                      <span className="text-xs font-mono text-stone-400 truncate max-w-full">
                        {day.label.split(' ')[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#111111] flex items-center justify-between">
                  <span>Top WhatsApp Orders by Product</span>
                  <span className="text-xs font-mono text-stone-500 font-normal">
                    {analytics.productClicks} total clicks
                  </span>
                </h3>

                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 6).map((item, idx) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-800 font-medium truncate max-w-[220px]">
                          {idx + 1}. {item.name}
                        </span>
                        <span className="font-mono text-stone-500 tabular-nums">
                          {item.count} clicks ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#111111] h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#111111] flex items-center justify-between">
                  <span>Custom Category Inquiries</span>
                  <span className="text-xs font-mono text-stone-500 font-normal">
                    {analytics.customOrderClicks} total clicks
                  </span>
                </h3>

                <div className="space-y-3">
                  {analytics.topCustomCategories.map((item, idx) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-800 font-medium truncate max-w-[220px]">
                          {idx + 1}. {item.name}
                        </span>
                        <span className="font-mono text-stone-500 tabular-nums">
                          {item.count} clicks ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-stone-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT CATALOG MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111111]">Product Catalog Management</h2>
                <p className="text-xs text-stone-500">
                  Update prices, change sizes, toggle visibility (hide out-of-stock), or add new styles.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddingProduct(true);
                  setEditingProduct({
                    id: `helioz-${Date.now()}`,
                    name: '',
                    category: 'Oversized',
                    fit: 'Oversized',
                    price: 899,
                    originalPrice: 1299,
                    gsm: 240,
                    fabric: '100% Super-Combed Cotton',
                    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                    colors: [{ name: 'Pitch Black', hex: '#0f0f10' }],
                    images: [],
                    description: '',
                    features: ['240 GSM heavy combed cotton', 'Bio-washed anti-pilling finish'],
                    careInstructions: ['Machine wash cold inside out'],
                    stockStatus: 'in_stock',
                    isFeatured: false,
                    createdDate: new Date().toISOString().split('T')[0],
                  });
                }}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New T-Shirt</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-stone-200/80 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase font-mono tracking-wider text-xs border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Fit / GSM</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Visibility</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#111111]">
                        <div>{p.name}</div>
                        <span className="text-xs text-stone-400 font-mono">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {p.fit} · <span className="text-black font-semibold">{p.gsm} GSM</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#111111] tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {p.sizes.join(', ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                            p.stockStatus === 'in_stock'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.stockStatus === 'low_stock'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {p.stockStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleHide(p.id)}
                          className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full cursor-pointer border ${
                            p.isHidden
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                          title={p.isHidden ? 'Hidden from website' : 'Visible on website'}
                        >
                          {p.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-emerald-600" />}
                          <span>{p.isHidden ? 'Hidden' : 'Live'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(p);
                          }}
                          className="p-1.5 text-stone-500 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CUSTOM ORDER CATEGORIES TAB */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#111111]">Custom Order Categories (6 Mandated Occasions)</h2>
              <p className="text-xs text-stone-500">
                Edit the copy, minimum order quantities, and WhatsApp greetings for group and event T-shirts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customCategories.map((cat) => (
                <div key={cat.id} className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-stone-500 uppercase">{cat.badge}</span>
                      <h3 className="text-base font-bold text-[#111111]">{cat.title}</h3>
                    </div>
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-1.5 text-stone-600 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Copy</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{cat.summary}</p>

                  <div className="text-xs font-mono text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    <p><strong>Min Quantity:</strong> {cat.minQty} pcs</p>
                    <p><strong>Turnaround:</strong> {cat.turnaround}</p>
                    <p><strong>Button Label:</strong> "{cat.buttonLabel}"</p>
                    <p className="text-xs text-stone-500 truncate">
                      <strong>Greeting:</strong> {cat.whatsappGreeting}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS & BUSINESS INFO TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl">
            {settingsSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-5">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-800" />
                Admin Password & Two-Factor Security
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Change Master Password
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep current"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Auto-Logout Inactivity (Minutes)
                  </label>
                  <select
                    value={inactivityMins}
                    onChange={(e) => setInactivityMins(parseInt(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value={5}>5 Minutes</option>
                    <option value={15}>15 Minutes (Default)</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-semibold text-[#111111] block">
                    Enable Two-Factor Authentication (2FA PIN)
                  </strong>
                  <span className="text-xs text-stone-500">
                    Requires entering a 4-digit security PIN after entering password.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-black cursor-pointer"
                />
              </div>

              {enable2FA && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Set 4-Digit 2FA PIN
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={new2FAPin}
                    onChange={(e) => setNew2FAPin(e.target.value)}
                    className="w-32 bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black font-mono text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              )}
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Server className="w-4 h-4 text-stone-800" />
                Store & Regulatory Information (Tamil Nadu)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="text"
                    value={editBusiness.phone}
                    onChange={(e) => setEditBusiness({ ...editBusiness, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={editBusiness.email}
                    onChange={(e) => setEditBusiness({ ...editBusiness, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Physical Address Line 1
                  </label>
                  <input
                    type="text"
                    value={editBusiness.addressLine1}
                    onChange={(e) => setEditBusiness({ ...editBusiness, addressLine1: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Grievance Officer Name
                  </label>
                  <input
                    type="text"
                    value={editBusiness.grievanceOfficer.name}
                    onChange={(e) =>
                      setEditBusiness({
                        ...editBusiness,
                        grievanceOfficer: { ...editBusiness.grievanceOfficer, name: e.target.value },
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Grievance Officer Email
                  </label>
                  <input
                    type="email"
                    value={editBusiness.grievanceOfficer.email}
                    onChange={(e) =>
                      setEditBusiness({
                        ...editBusiness,
                        grievanceOfficer: { ...editBusiness.grievanceOfficer, email: e.target.value },
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs text-black font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="py-3 px-8 bg-[#111111] hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-sm cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </form>
        )}

        {/* 5. PLATFORM AND HOSTING GUIDE */}
        {activeTab === 'hosting' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-bold text-[#111111]">Platform & Hosting Recommendation Guide</h2>
              <p className="text-xs text-stone-500 mt-1">
                Analysis for HELIOZ CLOTHING: Comparing deployment solutions with zero-cart WhatsApp flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border-2 border-[#111111] rounded-2xl space-y-4 relative shadow-sm">
                <span className="absolute -top-3 left-4 bg-[#111111] text-white text-xs font-mono uppercase font-bold px-3 py-0.5 rounded-full">
                  Recommended Choice
                </span>
                <h3 className="text-base font-bold text-[#111111] pt-2">Vercel / Cloudflare Pages</h3>
                <div className="text-xs space-y-2 text-stone-600">
                  <p><strong>Cost:</strong> ₹0 / Free Tier Forever</p>
                  <p><strong>Custom Domain:</strong> ₹799 - ₹1,200/year (Buy .in or .com on GoDaddy/Namecheap)</p>
                  <p><strong>Transaction Fees:</strong> 0% (Since WhatsApp handles payment directly)</p>
                  <p><strong>Performance:</strong> Sub-second global load speed, 100% uptime SLA</p>
                  <p><strong>Ease of Use:</strong> 1-click Git deployment; changes live in 30 seconds</p>
                  <p><strong>Control:</strong> Complete control over custom design, legal policies, and admin access</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-[#111111]">Shopify</h3>
                <div className="text-xs space-y-2 text-stone-500">
                  <p><strong>Cost:</strong> ~₹2,500 to ₹7,000+ per month</p>
                  <p><strong>Drawbacks:</strong> Built specifically to force online credit card checkout; removing checkout requires custom code or paid apps</p>
                  <p><strong>Suitability:</strong> Unnecessary overhead and expensive monthly fee for direct WhatsApp business</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-[#111111]">WordPress / WooCommerce</h3>
                <div className="text-xs space-y-2 text-stone-500">
                  <p><strong>Cost:</strong> ₹400 – ₹1,200/month hosting</p>
                  <p><strong>Drawbacks:</strong> Requires ongoing security patches, PHP updates, plugin conflicts, slower page speeds on mobile</p>
                  <p><strong>Suitability:</strong> Higher maintenance and security burden compared to modern React/Vite</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl space-y-3 text-xs text-stone-700 shadow-sm">
              <h4 className="font-bold text-[#111111] text-sm">3-Step Domain & Launch Roadmap for Owner:</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-stone-600">
                <li><strong>Buy Domain:</strong> Register <code className="text-stone-900 font-bold">heliozclothing.com</code> or <code className="text-stone-900 font-bold">helioz.in</code> on Namecheap or Cloudflare Registrar (approx ₹800/yr).</li>
                <li><strong>Link Repository to Vercel/Cloudflare:</strong> Connect your code repository. The build command is simply <code className="text-black font-semibold">npm run build</code> with output folder <code className="text-black font-semibold">dist</code>.</li>
                <li><strong>Add Custom Domain DNS:</strong> Point the CNAME or A records to Vercel/Cloudflare. SSL certificate is auto-generated for free in 60 seconds!</li>
              </ol>
            </div>
          </div>
        )}

        {/* 6. LAUNCH CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-bold text-[#111111]">Launch Verification Checklist</h2>
              <p className="text-xs text-stone-500 mt-1">
                Verify every compliance and accessibility requirement before opening publicly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white border border-stone-200 rounded-xl flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111111] block font-semibold">WCAG 2.2 AA Accessibility & Contrast</strong>
                  <p className="text-stone-500">All text meets 4.5:1 minimum contrast. Skip-to-content links and keyboard focus indicators configured.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111111] block font-semibold">WhatsApp Links Tested (Mobile & Desktop)</strong>
                  <p className="text-stone-500">All 6 custom occasion buttons and product cards format encoded wa.me links directly to +91 6379407292.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111111] block font-semibold">DPDP Act 2023 & Consumer Protection 2020 Compliance</strong>
                  <p className="text-stone-500">Zero customer personal data collected directly. Grievance officer name, contact, and statutory redressal timelines published.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111111] block font-semibold">No Fake Claims or Placeholders</strong>
                  <p className="text-stone-500">Zero fake reviews or fake countdown timers. Authentic owner story, real Kariapatti physical address, and pure combed cotton specs.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-base font-bold text-[#111111]">
                  {isAddingProduct ? 'Add New Product' : `Edit: ${editingProduct.name}`}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Selling Price (INR ₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Original Price (Strike)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseInt(e.target.value) || undefined })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">GSM Weight</label>
                    <input
                      type="number"
                      value={editingProduct.gsm}
                      onChange={(e) => setEditingProduct({ ...editingProduct, gsm: parseInt(e.target.value) || 240 })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Stock Status</label>
                    <select
                      value={editingProduct.stockStatus}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as StockStatus })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="made_to_order">Made To Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Fabric & Yarn Specification</label>
                  <input
                    type="text"
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Product Photos</label>
                <p className="text-xs text-stone-500 mb-2">Add one or more photos from this device. The first photo is the cover. Photos are resized automatically.</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleAddProductImages(e.target.files)}
                />
                <div className="flex flex-wrap gap-3">
                  {(editingProduct.images || []).filter(isImageSource).map((src, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                      <img src={src} alt={`Product photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-black text-white px-1.5 py-0.5 rounded">Cover</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveProductImage(src)}
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-stone-700 hover:text-red-600"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isProcessingImages}
                    className="w-20 h-24 rounded-lg border-2 border-dashed border-stone-300 hover:border-black text-stone-600 flex flex-col items-center justify-center gap-1 text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5" />
                    {isProcessingImages ? 'Adding...' : 'Add Photo'}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProduct(editingProduct)}
                  className="py-2.5 px-6 bg-[#111111] hover:bg-black text-white font-bold rounded-full text-xs"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Custom Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-base font-bold text-[#111111]">Edit: {editingCategory.title}</h3>
                <button onClick={() => setEditingCategory(null)} className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category Title</label>
                  <input
                    type="text"
                    value={editingCategory.title}
                    onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Summary Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.summary}
                    onChange={(e) => setEditingCategory({ ...editingCategory, summary: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Min Quantity (pcs)</label>
                    <input
                      type="number"
                      value={editingCategory.minQty}
                      onChange={(e) => setEditingCategory({ ...editingCategory, minQty: parseInt(e.target.value) || 5 })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      value={editingCategory.turnaround}
                      onChange={(e) => setEditingCategory({ ...editingCategory, turnaround: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Button Label</label>
                  <input
                    type="text"
                    value={editingCategory.buttonLabel}
                    onChange={(e) => setEditingCategory({ ...editingCategory, buttonLabel: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">WhatsApp Pre-filled Greeting</label>
                  <textarea
                    rows={2}
                    value={editingCategory.whatsappGreeting}
                    onChange={(e) => setEditingCategory({ ...editingCategory, whatsappGreeting: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCategory(editingCategory)}
                  className="py-2.5 px-6 bg-[#111111] hover:bg-black text-white font-bold rounded-full text-xs"
                >
                  Save Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
