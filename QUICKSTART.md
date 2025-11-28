# Bolti AI - Quick Start Guide for Deployment

**Last Updated: November 28, 2025**

---

## 🚀 START HERE - 30 Minute Quick Start

### Prerequisites Checklist
- [ ] Node.js 16+ installed (`node --version`)
- [ ] Git installed
- [ ] 3 Terminal windows open
- [ ] MongoDB account (Atlas or local)
- [ ] GitHub account (for deployment later)

### Step 1: Clone & Install (5 mins)

```bash
# Navigate to your workspace
cd "c:\All In 1\Wajid Bhaw Project\ai-agent"

# Clone repo (if not already there)
cd bolti-ai-saas

# Install dependencies
npm install

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps  
cd frontend && npm install && cd ..
```

### Step 2: Setup Environment (2 mins)

```bash
# Copy example env
cp .env.example .env

# Edit .env with minimum values:
# - MONGODB_URI=mongodb://localhost:27017/bolti-ai
# - JWT_SECRET=dev-secret-key-123456
# - NODE_ENV=development
```

### Step 3: Start Services (3 separate terminals)

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# Output: "Bolti AI Backend running on port 5000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Output: "VITE v5.0.0 ready in XXX ms"
# Open: http://localhost:3000
```

**Terminal 3 - Keep ready (optional):**
```bash
# Later: For call queue worker
cd backend
npm run worker
```

### Step 4: Test Login (5 mins)

1. Open browser: **http://localhost:3000**
2. Click "Send OTP"
3. Enter phone: **+919876543210**
4. Check Terminal 1 console for OTP (mock SMS)
5. Copy OTP code and verify
6. You're in! 🎉

---

## 📱 Testing Features

### Test Inbound Call (Mock)

```bash
curl -X POST http://localhost:5000/api/webhooks/inbound \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: tenant_demo01" \
  -d '{
    "CallSid": "test_call_123",
    "From": "+919998887776",
    "To": "+918897654321",
    "CallStatus": "initiated"
  }'
```

### Test Outbound Call Queue

```bash
# In Terminal 3 (worker process)
npm run worker

# Then trigger campaign call
curl -X POST http://localhost:5000/api/webhooks/escalation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "callId": "call_xyz",
    "escalationNumber": "+919876543210",
    "reason": "Unresolved issue"
  }'
```

---

## 🔧 Common Issues & Fixes

### MongoDB Not Running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud)
```

### Port Already in Use
```bash
# Port 5000 in use
lsof -i :5000
kill -9 <PID>

# Port 3000 in use
lsof -i :3000
kill -9 <PID>
```

### Env Variables Not Loading
```bash
# Clear node cache
rm -rf node_modules/.cache

# Restart services
# Kill all processes and restart
```

---

## 💳 Add Razorpay (For Billing)

### Get Test Keys

1. Go to **https://razorpay.com** (Create account)
2. Dashboard > Settings > API Keys
3. Copy **Key ID** (public) and **Key Secret** (private)
4. Add to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Test Payment

```bash
# In dashboard, go to Billing
# Click any plan > Choose cycle > Proceed to payment
# Use test card: 4111 1111 1111 1111
# Expiry: 12/25, CVV: 123
```

---

## 📞 Add Exotel (For Voice Calls)

### Get Exotel Account

1. **Create Account**: https://www.exotel.com/
2. **Get Credentials**:
   - Login > Settings > API Credentials
   - Copy: API Key, API Token, Account SID
3. **Add to .env**:
```
EXOTEL_API_KEY=xxxxx
EXOTEL_API_TOKEN=xxxxx
EXOTEL_SID=xxxxx
```

### Verify Caller ID

1. **Dashboard > Virtual Numbers**
2. **Add Phone Number**: +91XXXXXXXXXX (your business number)
3. **Verification**: Wait 24-48 hours
4. Once verified, you can make calls

---

## 🚀 Deploy to Production

### Option 1: Railway.app (Easiest for India)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Connect to Railway
# Go to railway.app > New Project > GitHub
# Select repo > Deploy

# 3. Set environment variables in Railway dashboard:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bolti-ai
RAZORPAY_KEY_ID=rzp_live_xxxxx
EXOTEL_API_KEY=xxxxx
# ... all other vars from .env

# 4. Deploy (automatic on push)
```

### Option 2: Vercel (Frontend) + Railway (Backend)

```bash
# Frontend to Vercel
# 1. Go to vercel.com > Import Project
# 2. Select GitHub repo
# 3. Select `frontend` directory
# 4. Deploy

# Backend to Railway
# 1. Go to railway.app > New Project
# 2. Select GitHub repo
# 3. Select backend directory
# 4. Deploy
```

### Post-Deployment Setup

After deployment, update webhook URLs:

**Exotel Dashboard:**
```
Settings > Webhooks > Inbound
URL: https://your-api-domain.com/api/webhooks/inbound
```

**Razorpay Dashboard:**
```
Settings > Webhooks > Add Webhook
URL: https://your-api-domain.com/api/billing/webhook/razorpay
Events: subscription.activated, subscription.cancelled
```

---

## 📊 Production Checklist

- [ ] SSL/TLS enabled (HTTPS only)
- [ ] Database backups configured
- [ ] Redis setup (for queue)
- [ ] Sentry or logging service
- [ ] Email service configured (SMTP)
- [ ] AWS S3 bucket for recordings
- [ ] DND list management
- [ ] Monitoring & alerts
- [ ] Rate limiting enabled
- [ ] CORS properly configured

---

## 🧪 Load Testing

### Test 1000+ Concurrent Calls

```bash
# Using Artillery (install: npm install -g artillery)
artillery quick -d 300 -r 50 \
  http://localhost:5000/api/webhooks/inbound

# This simulates 50 calls/sec for 5 minutes
```

---

## 📚 Learning Resources

- **API Docs**: See README.md
- **Legal**: docs/TERMS_AND_CONDITIONS.md
- **FAQ**: README.md#troubleshooting

---

## ✅ Success Indicators

✓ Both frontend & backend services running
✓ Can login with test phone number
✓ Dashboard loads with sample data
✓ Can view analytics
✓ Billing page shows plans correctly
✓ Can upload knowledge base
✓ Health check returns 200: `curl http://localhost:5000/health`

---

## 🆘 Need Help?

- **Docs**: README.md
- **Email**: support@bolti.ai
- **Issues**: Check GitHub issues

---

**Happy Coding! 🚀**
