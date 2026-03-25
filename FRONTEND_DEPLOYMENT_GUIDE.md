# Frontend Deployment Guide - Productivity App

## Current Setup
- **Backend**: Deployed on Render at https://productivity-app-a100.onrender.com ✅
- **Frontend**: Ready for deployment (Web, iOS, Android)

## Deployment Options

## 1. Web Deployment (Vercel) - RECOMMENDED FOR NOW

### Why Vercel?
- Free hosting for personal projects
- Automatic HTTPS
- Global CDN for fast loading
- Easy deployment process
- Automatic deployments from GitHub

### Method A: Deploy via GitHub (Easiest)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for frontend deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Select the `productivity-app` repository

3. **Configure Import Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Other
   - **Build Command**: `npx expo export --platform web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Click Deploy**:
   - Wait 2-3 minutes
   - You'll get a URL like: `https://your-app.vercel.app`

### Method B: Deploy via CLI

1. **Install Vercel CLI and deploy**:
   ```bash
   cd frontend
   npx vercel
   ```

2. **Follow prompts**:
   - Setup and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N**
   - Project name? **productivity-app**
   - Directory? **./frontend**
   - Override settings? **N**

3. **For production**:
   ```bash
   npx vercel --prod
   ```

Your app will be live at the provided URL!

---

## 2. Mobile App Deployment (APK/IPA)

### Android APK Build

1. **Login to Expo**:
   ```bash
   cd frontend
   npx eas login
   ```

2. **Configure EAS Build** (first time only):
   ```bash
   npx eas build:configure
   ```

3. **Build APK**:
   ```bash
   npx eas build --platform android --profile preview
   ```

4. **Download and Install**:
   - Wait 10-15 minutes for build
   - Download APK from the link provided
   - Install on Android device

### iOS Build (Requires Apple Developer Account - $99/year)

```bash
npx eas build --platform ios
```

---

## 3. Quick Testing with Expo Go

For immediate testing on your phone:

```bash
cd frontend
npx expo start
```

Then:
1. Install **Expo Go** app on your phone
2. Scan the QR code
3. Test the app instantly

---

## Post-Deployment Checklist

### For Web (Vercel):
- [ ] Visit your deployment URL
- [ ] Test signup/login
- [ ] Check all features work
- [ ] Test on mobile browser
- [ ] Share the URL with users!

### For Mobile (APK):
- [ ] Install APK on test device
- [ ] Test offline capabilities
- [ ] Check push notifications
- [ ] Test all features

---

## Current Configuration Files

### vercel.json (Already Created)
```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "devCommand": "npm run web",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### app.json (Already Updated)
- Web bundler configured for Metro
- Static output enabled
- Babel configured for reanimated

---

## Troubleshooting

### Web Deployment Issues

**404 on routes?**
- The vercel.json rewrites handle this

**CORS errors?**
- Backend already allows all origins
- Check browser console for details

**Build fails?**
- Ensure Node 18+ is used
- Check all dependencies are installed

### Mobile Build Issues

**EAS build fails?**
- Run `npm install` in frontend
- Check `eas.json` configuration

**APK won't install?**
- Enable "Unknown sources" in Android settings
- Check minimum Android version

---

## Quick Commands Reference

```bash
# Web Deployment
cd frontend
npx vercel --prod

# Android APK
npx eas build --platform android --profile preview

# Development Server
npx expo start

# Web Browser Testing
npm run web
```

---

## URLs and Access

- **Backend API**: https://productivity-app-a100.onrender.com ✅
- **Web Frontend**: https://productivity-app-olive-eta.vercel.app ✅
- **Mobile App**: Download APK after EAS build

---

## Next Steps

1. **For fastest deployment**: Use Vercel (5 minutes)
2. **For mobile users**: Build APK with EAS (15 minutes)
3. **For testing**: Use Expo Go app (immediate)

Choose based on your immediate needs!