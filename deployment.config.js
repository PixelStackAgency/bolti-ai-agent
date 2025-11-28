// Deployment Configuration for Bolti AI
// Supports: Vercel, Railway, Render, AWS, Digital Ocean

module.exports = {
  production: {
    backend: {
      platform: 'railway',
      // Options: 'railway', 'render', 'aws-ec2', 'vercel'
      
      environment: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      
      buildCommand: 'npm ci && npm run build:backend',
      startCommand: 'npm start',
      
      // Health check
      healthCheck: {
        path: '/health',
        interval: 30000,
        timeout: 10000,
      },
      
      // Auto-scaling
      scaling: {
        minInstances: 2,
        maxInstances: 10,
        targetCPU: 70,
        targetMemory: 80,
      },
      
      // Database
      mongodbUri: process.env.MONGODB_URI,
      
      // Redis for queue
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    },
    
    frontend: {
      platform: 'vercel',
      // Options: 'vercel', 'netlify', 'railway'
      
      buildCommand: 'npm ci && npm run build:frontend',
      outputDir: 'frontend/dist',
      
      environment: {
        VITE_API_URL: 'https://api.bolti.ai',
        VITE_ENV: 'production',
      },
      
      // CDN caching
      caching: {
        maxAge: 31536000, // 1 year for hashed assets
        sMaxAge: 86400,   // 1 day for HTML
      },
    },
    
    // Database backups
    database: {
      backupFrequency: 'daily',
      backupRetention: 30, // days
      encryption: true,
    },
    
    // Monitoring & Logging
    monitoring: {
      errorTracking: 'sentry',
      analytics: 'google-analytics',
      logging: 'cloudwatch',
    },
    
    // Security
    security: {
      https: true,
      tlsVersion: '1.2+',
      certificateProvider: 'letsencrypt',
      hsts: 'max-age=31536000; includeSubDomains',
    },
  },
  
  staging: {
    backend: {
      platform: 'railway',
      environment: {
        NODE_ENV: 'staging',
        PORT: 5000,
      },
      buildCommand: 'npm ci && npm run build:backend',
      startCommand: 'npm start',
    },
    
    frontend: {
      platform: 'vercel',
      buildCommand: 'npm ci && npm run build:frontend',
      environment: {
        VITE_API_URL: 'https://staging-api.bolti.ai',
        VITE_ENV: 'staging',
      },
    },
  },
  
  development: {
    backend: {
      platform: 'local',
      port: 5000,
      command: 'npm run dev:backend',
    },
    
    frontend: {
      platform: 'local',
      port: 3000,
      command: 'npm run dev:frontend',
    },
    
    database: {
      mongodbUri: 'mongodb://localhost:27017/bolti-ai',
    },
    
    redis: {
      host: 'localhost',
      port: 6379,
    },
  },
};

// ==== DEPLOYMENT STEPS ====

/*

### For Railway.app (Recommended for India)
1. Push code to GitHub
2. Connect GitHub to Railway
3. Create 2 projects:
   - bolti-ai-backend (Node.js)
   - bolti-ai-frontend (Static)
4. Set environment variables
5. Deploy

### For AWS (ECS + Fargate)
1. Build Docker image: docker build -t bolti-ai .
2. Push to ECR: aws ecr push bolti-ai
3. Create ECS task definition
4. Deploy with ALB
5. Setup RDS for MongoDB
6. Setup ElastiCache for Redis

### For Vercel (Frontend)
1. Import GitHub repo
2. Select 'frontend' directory
3. Set environment variables
4. Deploy on push

### Webhook URLs to Update
After deployment, update these in each service:
- Exotel: https://api.bolti.ai/api/webhooks/inbound
- Razorpay: https://api.bolti.ai/api/billing/webhook/razorpay
- WhatsApp: https://api.bolti.ai/api/webhooks/whatsapp

*/
