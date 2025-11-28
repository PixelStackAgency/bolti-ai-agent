# Bolti AI - AI Voice Sales & Support Call Center SaaS

**Parallel Voice Sales & Support Agent for Indian Businesses**

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-16+-success)

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+
- MongoDB local or Atlas
- Redis (optional, for production)
- Exotel account (for voice)
- Razorpay account (for payments)

### Local Development

```bash
# 1. Clone and setup
git clone <repo-url>
cd bolti-ai-saas

# 2. Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 4. Start all services (3 terminals)

# Terminal 1: Backend API
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Call Queue Worker (Production only)
cd backend && npm run worker

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Health: http://localhost:5000/health
```

---

## 📋 Complete Setup Guide

### Step 1: Environment Setup

```bash
# Copy example to .env
cp .env.example .env

# Update with your values:
# - MONGODB_URI: Your MongoDB connection string
# - EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID
# - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
# - JWT_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Linux: Follow official docs
# Windows: Download installer

# Start MongoDB
mongod

# Verify: mongo --version
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Add IP whitelist: 0.0.0.0/0 (dev) or specific IP (prod)
4. Get connection string
5. Update MONGODB_URI in .env
```

### Step 3: Exotel Setup (Telephony Provider)

1. **Create Exotel Account**
   - Go to https://www.exotel.com/
   - Sign up as Indian business
   - Complete KYC verification

2. **Get API Credentials**
   - Login to dashboard
   - Settings > API > API Credentials
   - Copy: API Key, API Token, Account SID
   - Update .env

3. **Verify Caller ID**
   - Dashboard > Virtual Numbers
   - Add your business phone number
   - Complete verification (24-48 hours)
   - Get verified number for outbound calls

4. **Setup Webhook**
   - After deployment, update webhook URL:
   - Exotel > Integrations > Webhooks
   - Inbound: `https://your-domain.com/api/webhooks/inbound`
   - Test: Make a call to your number

### Step 4: Razorpay Setup (Billing)

1. **Create Razorpay Account**
   - Go to https://razorpay.com/
   - Sign up and verify business
   - Complete merchant activation

2. **Get API Keys**
   - Settings > API Keys > Generate Key
   - Copy Key ID (public) and Key Secret (private)
   - Update .env

3. **Setup Webhook**
   - Webhooks > Add Webhook
   - URL: `https://your-domain.com/api/billing/webhook/razorpay`
   - Events: subscription.activated, subscription.cancelled
   - Secret: Copy and add to .env

4. **Create Plans**
   - Payments > Subscriptions > Plans
   - Create monthly plans:
     - ₹8,000 (Starter)
     - ₹20,000 (Growth)
     - ₹50,000 (Enterprise)

### Step 5: Frontend Configuration

```javascript
// frontend/src/config.js
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';
export const APP_NAME = 'Bolti AI';
export const COMPANY_CONTACT = '+91-XXXXX XXXXX';
```

### Step 6: Start Services

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm run dev

# Terminal 3: Workers (for production call queue)
cd backend
npm run worker
```

---

## 🏢 For Tenant Onboarding

### As a Business Owner (Your Customer)

1. **Sign Up**
   - Go to https://bolti.ai
   - Enter mobile number
   - Receive OTP via SMS
   - Verify and create account

2. **Complete Onboarding**
   - Add company name & industry
   - Verify caller ID (Exotel verified number)
   - Add human escalation support number
   - Select AI language (English/Hindi)

3. **Choose Plan**
   - Billing page > Select plan (Starter/Growth/Enterprise)
   - Monthly or Yearly subscription
   - Pay via Razorpay (UPI/Card/Netbanking/Wallet)
   - Subscription activated on payment success

4. **Upload Knowledge Base**
   - Dashboard > Knowledge Base
   - Upload PDFs (policies, FAQs, pricing)
   - Add website URLs (auto-scrape)
   - Paste text directly
   - AI learns from your content

5. **Start Taking Calls**
   - Inbound: Customers call your verified number → AI answers
   - Outbound: Upload CSV leads → AI calls automatically
   - Dashboard: Track calls, leads, escalations
   - Analytics: View AI resolution rate, call duration

---

## 📞 How Calls Work

### Inbound Call Flow
```
Customer calls Exotel number
        ↓
Exotel receives call
        ↓
Webhook → Bolti Backend
        ↓
Play consent message
        ↓
AI agent connected (powered by Knowledge Base)
        ↓
If unresolved → Transfer to escalation number (human)
        ↓
Call recorded, data saved
        ↓
Lead captured automatically
```

### Outbound Campaign Flow
```
Business uploads CSV (phone numbers)
        ↓
CSV parsed → Calls queued in Redis
        ↓
Workers process calls (parallel, 1000+/minute)
        ↓
Exotel API called → Phone rings
        ↓
AI agent speaks (personalized greeting)
        ↓
AI collects info (name, query, pain point)
        ↓
Lead saved to database
        ↓
Business sees lead in dashboard
        ↓
If interested → Schedule follow-up
```

---

## 🗄️ Database Schema

### Collections

**Tenants**
```json
{
  "tenantId": "tenant_abc123",
  "companyName": "Acme Corp",
  "plan": "growth",
  "verifiedNumbers": ["+918897654321"],
  "escalationNumbers": ["+919876543210"],
  "monthlyCallMinutes": 20000,
  "subscriptionStatus": "active"
}
```

**Users**
```json
{
  "tenantId": "tenant_abc123",
  "phone": "+919998887776",
  "name": "Rajesh Kumar",
  "role": "admin",
  "isVerified": true
}
```

**Calls**
```json
{
  "tenantId": "tenant_abc123",
  "callId": "call_xyz789",
  "type": "inbound",
  "fromNumber": "+918765432109",
  "status": "completed",
  "duration": 245,
  "resolvedByAI": true,
  "recordingUrl": "https://s3.../recording.mp3"
}
```

**Leads**
```json
{
  "tenantId": "tenant_abc123",
  "callId": "call_xyz789",
  "phone": "+918765432109",
  "name": "Priya Sharma",
  "query": "Pricing for bulk SMS",
  "status": "converted"
}
```

---

## 💳 Pricing Plans

| Feature | Starter ₹8,000 | Growth ₹20,000 | Enterprise ₹50,000 |
|---------|------|-------|----------|
| Monthly call minutes | 5,000 | 20,000 | 100,000+ |
| Campaigns per month | 2 | Unlimited | Unlimited |
| Verified caller IDs | 1 | 3 | Unlimited |
| Knowledge base sources | 5 PDFs + 1 URL | 20 PDFs + 5 URLs | Unlimited |
| Escalation numbers | 1 | 2 | 5+ |
| Data retention | 7 days | 30 days | 90 days |
| WhatsApp & SMS | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Support | Email | Email + Chat | 24/7 Priority |

**Yearly Discounts:**
- Starter: ₹88,000 (was ₹96,000) → Save ₹8,000
- Growth: ₹2,15,000 (was ₹2,40,000) → Save ₹25,000
- Enterprise: ₹5,40,000 (was ₹6,00,000) → Save ₹60,000

---

## 🔒 Security & Compliance

- ✅ **Multi-tenant isolation**: RBAC + data encryption
- ✅ **TRAI compliant**: DND handling, consent scripts
- ✅ **ITA compliant**: Call recording disclosure
- ✅ **Secure auth**: JWT + OTP (no passwords)
- ✅ **SSL/TLS**: All traffic encrypted
- ✅ **GDPR ready**: Data export & deletion
- ✅ **PCI-DSS**: Via Razorpay (certified)

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
GET    /api/auth/profile
POST   /api/auth/logout
```

### Billing
```
GET    /api/billing/plans
POST   /api/billing/subscribe
GET    /api/billing/subscription
POST   /api/billing/webhook/razorpay
POST   /api/billing/cancel
```

### Calls
```
GET    /api/calls/history
GET    /api/calls/:callId
GET    /api/calls/analytics/:period
POST   /api/calls/log
```

### Leads
```
GET    /api/leads
POST   /api/leads
PATCH  /api/leads/:leadId
POST   /api/leads/bulk
```

### Webhooks
```
POST   /api/webhooks/inbound (Exotel)
POST   /api/webhooks/outbound-callback (Exotel)
POST   /api/webhooks/escalation
```

---

## 🚀 Deployment

### Railway.app (Recommended for India)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Railway
# Go to railway.app > New Project > GitHub

# 3. Set environment variables in Railway dashboard

# 4. Deploy (auto on push)
```

### AWS (EC2 + RDS + ElastiCache)
```bash
# 1. Build Docker image
docker build -t bolti-ai .
aws ecr push bolti-ai

# 2. Create ECS task
# Backend: Node.js on Fargate
# Database: RDS MongoDB
# Cache: ElastiCache Redis

# 3. Setup ALB + Route 53 DNS

# 4. Update Exotel/Razorpay webhooks
```

### Render.com
```bash
# Similar to Railway
# 1. Connect GitHub
# 2. Create 2 services (backend + frontend)
# 3. Set env vars
# 4. Deploy
```

---

## 📖 Key Features

- ✅ **1000+ concurrent calls** via Redis queue
- ✅ **Multi-language support** (Hindi, English, regional)
- ✅ **Knowledge Base RAG** (PDF, URL, text)
- ✅ **Sentiment analysis** (Enterprise plan)
- ✅ **Human escalation** (transfer to support team)
- ✅ **WhatsApp + SMS** automation
- ✅ **Lead capture** + CRM integration ready
- ✅ **Call recording** with compliance
- ✅ **Analytics dashboard** with real-time metrics
- ✅ **DND compliance** (opt-out handling)

---

## 📖 Documentation

- 📄 [Terms & Conditions](./docs/TERMS_AND_CONDITIONS.md)
- 🔒 [Privacy Policy](./docs/PRIVACY_POLICY.md)
- 💰 [Refund Policy](./docs/REFUND_POLICY.md)
- 🚫 [DND Policy](./docs/DND_POLICY.md)
- 🎤 [Call Consent Scripts](./docs/CALL_CONSENT_SCRIPTS.md)

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + React Router
- Vite (bundler)
- Tailwind CSS
- Recharts (analytics)
- Axios (HTTP)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Redis + Bull (queue)
- JWT authentication
- Helmet (security)

**Infrastructure**
- Exotel (voice provider)
- Razorpay (payments)
- AWS S3 (file storage)
- MongoDB Atlas (database)
- Railway/Render (deployment)

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
```bash
# Ensure MongoDB is running
mongod  # or check MongoDB Atlas connection string
```

### "Calls not received"
```bash
# 1. Check Exotel webhook URL is accessible
# 2. Verify firewall allows inbound traffic
# 3. Check .env EXOTEL_WEBHOOK_URL matches Exotel settings
```

### "Payment failing"
```bash
# 1. Verify Razorpay test/live key mode
# 2. Check webhook secret is correct
# 3. Ensure TLS 1.2+ on webhook endpoint
```

---

## 📞 Support

- **Email**: support@bolti.ai
- **Phone**: +91-XXXXX XXXXX (India)
- **Docs**: https://docs.bolti.ai
- **Status**: https://status.bolti.ai

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Contributing

Pull requests welcome! Please follow:
1. Code style: Prettier
2. Commit messages: Conventional commits
3. Tests: 80%+ coverage

---

**Built with ❤️ for Indian Businesses**

Happy calling! 🚀
