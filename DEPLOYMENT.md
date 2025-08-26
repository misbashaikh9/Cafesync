# 🚀 Deployment Guide for Brew Haven Cafeteria

This guide will help you deploy your cafeteria application to showcase it on LinkedIn and other platforms.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Render account (for backend hosting)
- Vercel account (for frontend hosting)

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new organization and project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider and region (preferably closest to your users)
4. Create cluster (takes 1-3 minutes)

### 1.3 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set "Database User Privileges" to "Read and write to any database"
6. Add user

### 1.4 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Confirm

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace \`<password>\` with your database user password

## 🖥️ Step 2: Backend Deployment (Render)

### 2.1 Push Code to GitHub
\`\`\`bash
git add .
git commit -m "Prepare for deployment"
git push origin main
\`\`\`

### 2.2 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up using GitHub account

### 2.3 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure service:
   - **Name:** \`cafeteria-backend\`
   - **Environment:** \`Node\`
   - **Build Command:** \`cd server && npm install\`
   - **Start Command:** \`cd server && npm start\`
   - **Instance Type:** Free

### 2.4 Set Environment Variables
Add these environment variables in Render:
\`\`\`
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
EMAIL_USER=bh.cafe712@gmail.com
EMAIL_PASS=lzhs ahan zbjg yzso
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend-url.vercel.app
\`\`\`

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note the deployed URL (e.g., \`https://cafeteria-backend.onrender.com\`)

### 2.6 Seed Database
1. In Render dashboard, go to "Shell"
2. Run: \`cd server && node seedProducts.js\`

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up using GitHub account

### 3.2 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** \`Frontend\`
   - **Build Command:** \`npm run build\`
   - **Output Directory:** \`dist\`

### 3.3 Set Environment Variables
Add these environment variables:
\`\`\`
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Brew Haven Cafeteria
\`\`\`

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build completion (2-5 minutes)
3. Note the deployed URL (e.g., \`https://cafeteria-frontend.vercel.app\`)

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend CORS
Update your backend's CORS configuration with the actual frontend URL:
\`\`\`javascript
app.use(cors({
  origin: 'https://your-actual-frontend-url.vercel.app',
  credentials: true
}));
\`\`\`

### 4.2 Redeploy Backend
Commit and push changes to trigger redeployment.

## ✅ Step 5: Testing

### 5.1 Test Core Functionality
1. Visit your frontend URL
2. Test user registration/login
3. Browse menu and add items to cart
4. Test checkout process
5. Verify admin login and dashboard

### 5.2 Test API Endpoints
Use the health check endpoint:
\`\`\`
GET https://your-backend-url.onrender.com/health
\`\`\`

## 📱 Step 6: LinkedIn Showcase

### 6.1 Create Demo Content
1. Take screenshots of key features
2. Create a short demo video
3. Write project description

### 6.2 LinkedIn Post Template
\`\`\`
🚀 Excited to share my latest project: Brew Haven Cafeteria! ☕

A full-stack cafe management system built with:
• Frontend: React 19, Vite, React Router
• Backend: Node.js, Express, MongoDB
• Features: User auth, cart, payments, admin dashboard

🌐 Live Demo: [Your Vercel URL]
💻 GitHub: [Your GitHub URL]

Key Features:
✅ Responsive design
✅ Real-time cart updates  
✅ Stripe payment integration
✅ Admin analytics dashboard
✅ Email notifications

Built this to showcase modern web development skills including authentication, database design, payment processing, and deployment.

#WebDevelopment #React #NodeJS #MongoDB #FullStack #Portfolio
\`\`\`

## 🔧 Troubleshooting

### Common Issues:

#### Backend not starting:
- Check environment variables
- Verify MongoDB connection string
- Check server logs in Render

#### Frontend API calls failing:
- Verify VITE_API_URL is correct
- Check CORS configuration
- Ensure backend is running

#### Database connection issues:
- Check MongoDB Atlas network access
- Verify connection string format
- Ensure database user has correct permissions

## 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user and network access configured
- [ ] Backend deployed to Render
- [ ] Environment variables set
- [ ] Database seeded with products
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with frontend URL
- [ ] All functionality tested
- [ ] Screenshots taken
- [ ] LinkedIn post ready

## 🎯 Pro Tips

1. **Domain Name:** Consider buying a custom domain for a more professional look
2. **SSL Certificate:** Both Vercel and Render provide free SSL
3. **Performance:** Use MongoDB indexes for better performance
4. **Monitoring:** Set up error tracking with services like Sentry
5. **Analytics:** Add Google Analytics to track usage

---

🎉 **Congratulations!** Your cafeteria application is now live and ready to showcase!
