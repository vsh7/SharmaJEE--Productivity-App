# 🔧 Network Error - FIXED!

## What Was Wrong
Your IP address changed from `10.7.13.217` to `10.118.143.215`, causing the frontend to connect to the wrong address.

## What Was Fixed
✅ Updated [frontend/src/api.js](frontend/src/api.js) with:
- Current IP: `10.118.143.215`
- Smart platform detection (iOS/Android/Physical device)
- 10-second timeout
- Better error logging

## Testing Your App Now

### Step 1: Make Sure Backend is Running
```bash
cd backend
npm start
```
You should see: "Server running on port 3000"

### Step 2: Start Frontend
```bash
cd frontend
npm start
```

### Step 3: Test Signup
1. Open app on your device/simulator
2. Go to Signup page
3. Fill in:
   - Name: Your Name
   - **Email: your@email.com** ← This field exists!
   - Password: password123
   - Confirm: password123
4. Select Student or Mentor
5. Click Sign Up

It should work now! ✨

## If It Still Doesn't Work

### Check Your Device Type:

**Physical Phone/Tablet:**
- Make sure phone and computer are on **same Wi-Fi**
- IP in api.js must match your computer's IP
- Run `./get-ip.sh` to check current IP

**iOS Simulator:**
- Uses `localhost:3000` automatically ✅
- Should work without changes

**Android Emulator:**
- Uses `10.0.2.2:3000` automatically ✅
- Should work without changes

## Quick Debugging

Run this to test the backend:
```bash
curl http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","password":"123456","role":"student"}'
```

If you see a token, backend is working! 🎉

## When IP Changes Again

Your IP changes when you switch Wi-Fi networks. When that happens:

1. Run `./get-ip.sh`
2. Update line 18 in `frontend/src/api.js`
3. Restart Expo (`r` in terminal or shake device)

## Need More Help?
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed guide.
