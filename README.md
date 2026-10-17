# HELIOZ CLOTHING ⚡

Premium heavyweight t-shirts and custom group apparel e-commerce web application with direct WhatsApp ordering. Built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## 🚀 Deploy to Vercel

This repository is pre-configured for seamless, zero-config deployment on **[Vercel](https://vercel.com/)**.

### Method 1: Deploy with Git (Recommended)

1. **Push your code** to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and log in.
3. Import your repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your site will be live on a `*.vercel.app` domain in seconds!

### Method 2: Deploy with Vercel CLI

Install the Vercel CLI globally and deploy directly from your terminal:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy preview
vercel

# 4. Deploy directly to production
vercel --prod
```

---

## 🛠️ Included Vercel Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The `rewrites` rule handles Single-Page Application (SPA) routing, ensuring pages load cleanly without 404 errors on browser refresh or direct navigation.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript checks
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 WhatsApp Business & Order Setup

All product and custom inquiries route directly to WhatsApp with pre-filled order breakdowns (item, size, color, quantity, total price, and shipping details).

To update your business WhatsApp number or location:
* Open `src/data/defaultData.ts`
* Update `defaultBusinessInfo.phone` (e.g. `919876543210`)
* Update `defaultBusinessInfo.address` or policy links.
