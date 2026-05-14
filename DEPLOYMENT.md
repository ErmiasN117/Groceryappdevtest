# Deployment Guide

This guide covers deploying the Prox Deals app to various hosting platforms.

## Free Hosting Options

### 1. Vercel (Recommended)

**Why Vercel?** Optimized for React/Next.js, free tier includes serverless functions, great DX.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Steps:**
1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click Deploy
5. Site goes live automatically

**Features:**
- Automatic deployments on push to main
- Custom domain support
- Environment variables
- Analytics

### 2. Netlify

**Why Netlify?** User-friendly, generous free tier, great build system.

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Steps:**
1. Sign up at [netlify.com](https://netlify.com)
2. Connect GitHub or drag-and-drop dist folder
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Done!

### 3. GitHub Pages

**Why GitHub Pages?** Built into GitHub, free, great for portfolios.

**Steps:**
1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/prox-deals/', // if deploying as subdirectory
  // ... rest of config
})
```

2. Create deployment script in `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Install gh-pages:
```bash
npm install -D gh-pages
npm run deploy
```

### 4. Firebase Hosting

**Why Firebase?** Integrated with Google Cloud, fast CDN, free tier.

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Initialize
firebase init
# Select: Hosting
# Build folder: dist
# Public directory: dist

# Deploy
firebase deploy
```

## Production Optimization

### Before Deploying

1. **Build Analysis**:
```bash
npm run build
# Check dist folder size
du -sh dist/
```

2. **Performance Testing**:
- Run on Chrome DevTools Lighthouse
- Check Core Web Vitals

3. **Environment Variables**:
```bash
# Create .env.production
VITE_API_URL=https://api.example.com
```

### Build Optimization

```bash
# Create optimized build with analysis
npm run build -- --mode production

# Use Vite build analyzer
npm install -D vite-plugin-visualizer
```

Update `vite.config.ts`:
```typescript
import { visualizer } from 'vite-plugin-visualizer'

export default defineConfig({
  plugins: [react(), visualizer()],
})
```

## Custom Domain Setup

### With Vercel
1. Go to Project Settings → Domains
2. Add domain
3. Follow DNS configuration

### With Netlify
1. Go to Site Settings → Domain
2. Add custom domain
3. Update DNS records

### With GitHub Pages
1. Add domain in repository Settings → Pages
2. Update DNS records
3. Enable HTTPS (automatic after DNS propagates)

## CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file automatically:
1. Runs tests on every push
2. Builds the project
3. Deploys to Vercel on main branch merge

### Manual Deployment

```bash
# Build locally
npm run build

# Preview before deploying
npm run preview

# Deploy using Vercel CLI
vercel --prod
```

## Monitoring & Analytics

### Google Analytics
```typescript
// src/main.tsx
import ReactGA from 'react-ga4'

ReactGA.initialize('GA_MEASUREMENT_ID')
```

### Sentry Error Tracking
```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.MODE,
})
```

## Environment Variables

Create `.env.production`:
```
VITE_API_BASE_URL=https://api.example.com
VITE_GA_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Failed
- Check build logs
- Verify all environment variables are set
- Ensure dist folder is not gitignored

### Performance Issues
- Check bundle size: `npm run build -- --visualize`
- Use Chrome DevTools Lighthouse
- Enable gzip compression (usually automatic on CDN)

## Security Checklist

- [ ] No secrets in code or .env files
- [ ] HTTPS enabled on custom domain
- [ ] CSP headers configured
- [ ] CORS properly configured if using APIs
- [ ] Rate limiting on backend APIs
- [ ] Input validation on all forms

## Scaling Considerations

### When to Consider Premium Options
- Traffic > 100k monthly visitors
- Need backend API integration
- Require database storage
- Need authentication system

### Recommended Stack for Scale
- **Frontend**: Same (React + Vite)
- **Backend**: Node.js with Express or Next.js
- **Database**: PostgreSQL or MongoDB
- **Hosting**: AWS, Google Cloud, or Azure
- **CDN**: Cloudflare

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Docs](https://pages.github.com)
