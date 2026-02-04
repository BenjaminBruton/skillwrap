# Stripe Webhook Setup for Local Development

## The Problem
Your payment succeeded with perfect metadata:
- ✅ Payment Intent: `pi_3SxEBzKBQQYh9yvj0HBLsZpr`
- ✅ Session ID: `5b9af04c-030b-42c3-af73-23dbfeeeb01e` (valid UUID)
- ✅ User ID: `user_39DtBsjrvaRwhxbQo8StV3vDVda`
- ✅ All required metadata present

But Stripe can't deliver the webhook to `http://localhost:3000` due to TLS requirements.

## Solution: Stripe CLI Webhook Forwarding

### Step 1: Install Stripe CLI
```bash
# macOS (using Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

### Step 2: Login to Stripe CLI
```bash
stripe login
```

### Step 3: Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This command will:
- Create a secure tunnel from Stripe to your local server
- Show you a webhook signing secret (starts with `whsec_`)
- Forward all webhook events to your local endpoint

### Step 4: Update Environment Variable
Copy the webhook signing secret from the CLI output and update your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_NEW_SECRET_FROM_CLI_OUTPUT
```

### Step 5: Restart Your Dev Server
```bash
npm run dev
```

### Step 6: Test the Booking Flow
1. Keep the `stripe listen` command running in one terminal
2. Keep `npm run dev` running in another terminal
3. Try the booking flow again
4. You should see webhook events in both terminals

## Expected Output

**Stripe CLI Terminal:**
```
2026-02-04 22:20:00   --> payment_intent.succeeded [evt_xxx]
2026-02-04 22:20:00   <-- [200] POST http://localhost:3000/api/stripe/webhook
```

**Dev Server Terminal:**
```
🔔 Webhook received: payment_intent.succeeded
💰 Processing payment success...
🔍 Payment Intent Metadata: { sessionId: "5b9af04c-030b-42c3-af73-23dbfeeeb01e", ... }
✅ Booking created in database for payment pi_3SxEBzKBQQYh9yvj0HBLsZpr
```

## Alternative: Test with Webhook Test Endpoint

If you want to test immediately, temporarily change your Stripe webhook endpoint to:
`https://webhook.site/your-unique-url`

This will show you the webhook payload without processing it.

## Production Deployment

For production, you'll need:
1. HTTPS endpoint (Vercel provides this automatically)
2. Proper webhook endpoint in Stripe dashboard
3. Production webhook signing secret

The current webhook handler is fully functional - it just needs proper HTTPS delivery!