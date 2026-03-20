# Free Deployment Guide - Productivity App

**Zero-Cost Deployment Stack for Students**

---

## 🎯 Overview

**What we'll deploy:**
- ✅ Backend (Node.js/Express) → **Render** (Free)
- ✅ Database (MongoDB) → **MongoDB Atlas** (Free)
- ✅ Frontend (React Native) → **Expo EAS** (Free builds)

**Total Cost: $0/month** 🎉

---

## 📦 Step 1: Deploy MongoDB Database

### MongoDB Atlas (Free 512MB)

1. **Create Account**
   ```
   → Go to: https://www.mongodb.com/cloud/atlas/register
   → Sign up with email (free)
   ```

2. **Create Cluster**
   ```
   → Click "Build a Database"
   → Choose "FREE" M0 Cluster
   → Provider: AWS or Google Cloud
   → Region: Choose closest to your users (e.g., Mumbai for India)
   → Cluster Name: productivity-app
   → Click "Create"
   ```

3. **Create Database User**
   ```
   → Security → Database Access
   → Add New Database User
   → Username: productivityUser
   → Password: Generate secure password (SAVE THIS!)
   → Built-in Role: Read and write to any database
   → Add User
   ```

4. **Allow Network Access**
   ```
   → Security → Network Access
   → Add IP Address
   → Allow Access from Anywhere: 0.0.0.0/0
   → (For production, restrict to specific IPs)
   → Confirm
   ```

5. **Get Connection String**
   ```
   → Database → Connect
   → Connect your application
   → Driver: Node.js
   → Copy connection string:

   mongodb+srv://productivityUser:<password>@cluster0.xxxxx.mongodb.net/productivityApp?retryWrites=true&w=majority

   → Replace <password> with your actual password
   → Save this for backend deployment!
   ```

**✅ Database Done!** Your MongoDB is live at: `mongodb+srv://...`

---

## 🚀 Step 2: Deploy Backend (Node.js + Express)

### Option A: Render (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   cd /Users/yash/Desktop/productivity-app

   # If not already a git repo
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"

   # Create GitHub repo and push
   git remote add origin https://github.com/YOUR_USERNAME/productivity-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Render**
   ```
   → Go to: https://render.com
   → Sign up with GitHub
   → New → Web Service
   → Connect your repository: productivity-app
   → Configure:
     - Name: productivity-app-backend
     - Region: Singapore (or closest)
     - Branch: main
     - Root Directory: backend
     - Runtime: Node
     - Build Command: npm install
     - Start Command: node server.js
     - Instance Type: Free
   ```

3. **Add Environment Variables**
   ```
   → Environment tab → Add Environment Variable

   Add these:
   MONGO_URI = mongodb+srv://productivityUser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/productivityApp
   JWT_SECRET = 9fA8dQ3P!xM7zK2L@R4hWcE6N0YB
   GEMINI_API_KEY = AIzaSyAlT9jUp1koOqyUZWYFg0hHvwKS2Q5fXuM
   NODE_ENV = production
   PORT = 3000
   ```

4. **Deploy**
   ```
   → Click "Create Web Service"
   → Wait 2-3 minutes for deployment
   → Your backend URL: https://productivity-app-backend.onrender.com
   ```

5. **Test Backend**
   ```bash
   # Test in browser or curl
   curl https://productivity-app-backend.onrender.com/auth/login

   # Should return: Cannot GET /auth/login (means server is running)
   ```

**⚠️ Render Free Tier Note:**
- Sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Perfect for development/portfolio projects!

---

### Option B: Railway (Alternative)

```
→ Go to: https://railway.app
→ Sign up with GitHub
→ New Project → Deploy from GitHub repo
→ Select: productivity-app/backend
→ Add environment variables (same as above)
→ Deploy!

Your URL: https://productivity-app-backend.up.railway.app
```

**Free Credit:** $5/month (enough for small apps)

---

## 📱 Step 3: Update Frontend to Use Deployed Backend

### Update API Base URL

1. **Edit Frontend API Config**
   ```bash
   # Edit: frontend/src/api.js
   ```

   **Replace:**
   ```javascript
   const getBaseURL = () => {
       if (Platform.OS === 'android') {
           return 'http://10.0.2.2:3000';
       } else {
           return 'http://10.118.143.215:3000';
       }
   };
   ```

   **With:**
   ```javascript
   const getBaseURL = () => {
       // Production backend URL
       const PRODUCTION_URL = 'https://productivity-app-backend.onrender.com';

       // For development, use local server
       const DEV_URL = Platform.OS === 'android'
           ? 'http://10.0.2.2:3000'
           : 'http://10.118.143.215:3000';

       // Use production URL (or add env variable check)
       return PRODUCTION_URL;
   };
   ```

2. **Test the Connection**
   ```bash
   cd frontend
   npm start

   # Test on your phone with Expo Go
   # Try logging in - should connect to deployed backend!
   ```

---

## 📲 Step 4: Build Mobile App (Android/iOS)

### For Testing: Expo Go (Easiest)

```bash
cd frontend
npm start

# Scan QR code with Expo Go app
# Your app runs with production backend!
```

**Pros:** Instant testing, zero cost
**Cons:** Not a standalone app, requires Expo Go

---

### For Production: Build Standalone App (EAS)

#### A. Setup EAS

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
cd frontend
eas login

# Configure EAS
eas build:configure
```

#### B. Build Android APK (Free)

```bash
# Create development build (free, unlimited)
eas build --platform android --profile development

# Or create production build (limited free builds)
eas build --platform android --profile production

# Wait 5-10 minutes
# Download APK link will appear
# Install APK on Android phone!
```

**Free Tier:**
- ✅ Unlimited development builds
- ⚠️ Limited production builds per month
- ✅ No credit card required

#### C. Build iOS (Requires Apple Developer Account)

```bash
# Requires $99/year Apple Developer membership
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

---

## 🌐 Alternative: Web Version (Bonus)

Your app can also run as a web app for free!

```bash
cd frontend
npx expo export:web

# Deploy web build to:
# - Vercel (free): vercel.com
# - Netlify (free): netlify.com
# - GitHub Pages (free): pages.github.com
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **MongoDB Atlas** | 512MB storage | Shared cluster, 1 database |
| **Render** | 750 hrs/month | Sleeps after 15 min inactivity |
| **Railway** | $5 credit/month | ~100 hours runtime |
| **Expo EAS Build** | Limited builds | Unlimited dev builds |
| **GitHub** | Free | Public repos |

**Total Monthly Cost: $0** ✅

---

## 🚦 Quick Start Commands

### Backend Deployment (Render)
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to render.com and connect repo
# 3. Add environment variables
# 4. Deploy!
```

### Frontend Testing
```bash
# Update API URL in frontend/src/api.js
# Then:
cd frontend
npm start
# Scan QR with Expo Go
```

### Build Standalone App
```bash
cd frontend
eas build --platform android --profile development
# Install APK on phone
```

---

## 🔧 Environment Variables Checklist

**Backend (.env on Render):**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/productivityApp
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=3000
```

**Frontend (hardcoded for now):**
```javascript
// In frontend/src/api.js
const PRODUCTION_URL = 'https://your-app.onrender.com';
```

---

## 📚 Useful Resources

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Expo EAS:** https://docs.expo.dev/build/introduction/
- **Railway:** https://docs.railway.app/

---

## ⚡ Pro Tips

1. **Keep Backend Awake (Render):**
   ```
   Use cron-job.org or uptimerobot.com to ping your backend every 14 minutes
   Prevents sleep = faster response times
   ```

2. **Monitor Deployments:**
   ```
   - Render Dashboard: Check logs for errors
   - MongoDB Atlas: Monitor database usage
   ```

3. **Version Control:**
   ```bash
   # Always commit before deploying
   git add .
   git commit -m "Feature: XYZ"
   git push
   # Render auto-deploys from main branch!
   ```

4. **Environment-based URLs:**
   ```javascript
   // Better approach in frontend/src/api.js
   const IS_DEV = __DEV__; // Expo provides this
   const BASE_URL = IS_DEV ? DEV_URL : PRODUCTION_URL;
   ```

---

## 🐛 Common Issues & Solutions

### Backend doesn't start
```bash
# Check Render logs
→ Dashboard → Your service → Logs tab
→ Look for PORT errors
→ Ensure: PORT=3000 in environment variables
```

### MongoDB connection fails
```bash
# Check connection string
→ No spaces in string
→ Password is URL-encoded (special chars like @ become %40)
→ Database name is correct
→ IP whitelist includes 0.0.0.0/0
```

### App can't connect to backend
```bash
# Check CORS
→ Backend should have: app.use(cors());
→ Test backend URL in browser
→ Check frontend API URL is correct (HTTPS, no trailing slash)
```

### Expo build fails
```bash
# Check eas.json exists
eas build:configure

# Check app.json has correct bundle identifier
"ios": {
  "bundleIdentifier": "com.yourname.productivityapp"
}
```

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend deployed on Render with green status
- [ ] Environment variables added to Render
- [ ] Frontend API URL updated to production backend
- [ ] Test login works from Expo Go
- [ ] Optional: Android APK built and installed

---

**🚀 Your app is now live and accessible from anywhere!**

**Next Steps:**
1. Share APK with friends/testers
2. Submit to Google Play Store ($25 one-time)
3. Monitor usage and logs
4. Add more features!

**Questions? Check logs on:**
- Backend: Render Dashboard → Logs
- Database: MongoDB Atlas → Monitoring
- Frontend: Expo console during `npm start`
