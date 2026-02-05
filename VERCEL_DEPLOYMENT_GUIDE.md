# SKILLWRAP Vercel Deployment Guide

This guide will walk you through deploying your SKILLWRAP website to production using Vercel.

## Pre-Deployment Checklist

### 1. Ensure All Services Are Ready
- ✅ **Supabase Database**: Tables created and populated with session data
- ✅ **Clerk Authentication**: Production app configured
- ✅ **Stripe**: Live keys ready (keep test keys for now if testing)
- ✅ **SendGrid**: Domain authentication or single sender verified

### 2. Environment Variables Ready
Make sure you have all these values ready for production:

```env
# Clerk Authentication (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (Production - when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.your-live-key
SENDGRID_FROM_EMAIL=ben@skillwrap.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Step 1: Prepare Your Repository

### Option A: GitHub (Recommended)
1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial SKILLWRAP website"
   git branch -M main
   git remote add origin https://github.com/yourusername/skillwrap.git
   git push -u origin main
   ```

### Option B: Direct Upload
- You can also deploy directly by dragging your project folder to Vercel

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)
1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**
5. **Configure project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: skillwrap
# - Directory: ./
```

## Step 3: Configure Environment Variables

### In Vercel Dashboard:
1. **Go to your project** → Settings → Environment Variables
2. **Add each variable**:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_live_...`
   - Environment: **Production** (and Preview if needed)

### Critical Variables to Add:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
SENDGRID_API_KEY
SENDGRID_FROM_EMAIL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_BASE_URL
```

## Step 4: Configure Custom Domain

### Add Your Domain:
1. **Vercel Dashboard** → Your Project → Settings → Domains
2. **Add Domain**: `skillwrap.com`
3. **Configure DNS** at your domain registrar:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`

### SSL Certificate:
- Vercel automatically provisions SSL certificates
- Your site will be available at `https://skillwrap.com`

## Step 5: Update Service Configurations

### 1. Clerk Production Setup
1. **Clerk Dashboard** → Your App → Settings
2. **Update Authorized Domains**:
   - Add: `https://skillwrap.com`
   - Add: `https://www.skillwrap.com`
3. **Update Redirect URLs**:
   - Sign-in: `https://skillwrap.com/sign-in`
   - Sign-up: `https://skillwrap.com/sign-up`
   - After sign-in: `https://skillwrap.com/dashboard`

### 2. Stripe Webhook Configuration
1. **Stripe Dashboard** → Developers → Webhooks
2. **Add Endpoint**: `https://skillwrap.com/api/stripe/webhook`
3. **Select Events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. **Copy Webhook Secret** → Add to Vercel environment variables

### 3. Clerk Webhook Configuration
1. **Clerk Dashboard** → Webhooks
2. **Add Endpoint**: `https://skillwrap.com/api/clerk/webhook`
3. **Select Events**:
   - `user.created`
   - `user.updated`
   - `user.deleted`

### 4. SendGrid Domain Configuration
1. **Update NEXT_PUBLIC_BASE_URL** in environment variables
2. **Verify domain authentication** if using custom domain

## Step 6: Test Production Deployment

### 1. Basic Functionality
- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ Camp pages display properly
- ✅ Contact form submits successfully

### 2. Authentication Flow
- ✅ Sign up process works
- ✅ Sign in process works
- ✅ Dashboard displays correctly
- ✅ User sync to Supabase works

### 3. Booking System
- ✅ Camp detail pages load
- ✅ Session selection works
- ✅ Payment processing works
- ✅ Booking confirmation emails sent
- ✅ Dashboard shows bookings

### 4. Contact System
- ✅ Contact form sends emails to ben@skillwrap.com
- ✅ User receives confirmation emails
- ✅ After School subject auto-selects

## Step 7: Go Live Checklist

### Before Switching to Live Stripe:
1. **Test thoroughly** with Stripe test keys
2. **Verify all webhooks** are working
3. **Test booking cancellations**
4. **Confirm email delivery**

### Switch to Live Stripe:
1. **Update environment variables**:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
2. **Update webhook endpoint** in Stripe Dashboard
3. **Test with small live transaction**

## Step 8: Monitoring & Maintenance

### Vercel Analytics
- **Enable Analytics** in Vercel Dashboard
- Monitor page views, performance, and errors

### Error Monitoring
- Check **Vercel Functions** tab for API errors
- Monitor **Stripe Dashboard** for payment issues
- Check **SendGrid Activity** for email delivery

### Regular Maintenance
- **Monitor webhook deliveries** in Stripe/Clerk dashboards
- **Check Supabase usage** and performance
- **Review error logs** in Vercel dashboard

## Troubleshooting Common Issues

### Build Errors
```bash
# Check build locally first
npm run build

# Common fixes:
npm install
npm run lint --fix
```

### Environment Variable Issues
- Ensure all required variables are set in Vercel
- Check variable names match exactly (case-sensitive)
- Restart deployment after adding variables

### Webhook Issues
- Verify webhook URLs are correct
- Check webhook secrets match environment variables
- Test webhook delivery in service dashboards

### Database Connection Issues
- Verify Supabase URLs and keys
- Check RLS policies are configured correctly
- Test database connection in Vercel function logs

## Production URLs

Once deployed, your site will be available at:
- **Primary**: `https://skillwrap.com`
- **Vercel**: `https://skillwrap.vercel.app`

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: Available in dashboard

Your SKILLWRAP website is now ready for production! 🚀