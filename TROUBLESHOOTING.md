# Troubleshooting Guide

## Network Error on Signup/Login

### Problem
Getting "Network Error" when trying to signup or login from mobile app.

### Common Causes & Solutions

#### 1. IP Address Changed
Your computer's local IP address changes when you connect to different Wi-Fi networks.

**Solution:**
```bash
# Run this script to get your current IP
./get-ip.sh

# Then update frontend/src/api.js with the new IP
# Update line 18: return 'http://YOUR_NEW_IP:3000';
```

#### 2. Backend Not Running
The Node.js backend server must be running.

**Check if running:**
```bash
lsof -i :3000
```

**Start backend:**
```bash
cd backend
npm start
```

#### 3. MongoDB Not Running
The database must be running for signup/login to work.

**Check if running:**
```bash
pgrep -fl mongod
```

**Start MongoDB:**
```bash
# macOS (Homebrew)
brew services start mongodb-community@7.0

# or manually
mongod --config /opt/homebrew/etc/mongod.conf
```

#### 4. Firewall Blocking Connection
Your firewall might be blocking the connection.

**Solution (macOS):**
- Go to System Preferences → Security & Privacy → Firewall
- Click "Firewall Options"
- Make sure Node is allowed

#### 5. Wrong Network
Make sure your phone and computer are on the **same Wi-Fi network**.

**Check:**
- Phone: Settings → Wi-Fi
- Computer: System Preferences → Network

#### 6. Testing Device Type Issues

**iOS Simulator:**
- Use `http://localhost:3000`
- Already configured in `api.js`

**Android Emulator:**
- Use `http://10.0.2.2:3000`
- Already configured in `api.js`

**Physical Device (Phone/Tablet):**
- Use your computer's local IP: `http://10.118.143.215:3000`
- Must be on same Wi-Fi network
- Update IP in `api.js` when network changes

### Quick Test

Test if backend is accessible:

```bash
# From your computer (should work)
curl http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","role":"student"}'

# From network IP (should work if firewall allows)
curl http://10.118.143.215:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","role":"student"}'
```

### Debug Checklist

- [ ] Backend running on port 3000
- [ ] MongoDB running
- [ ] Phone and computer on same Wi-Fi
- [ ] Correct IP in `frontend/src/api.js`
- [ ] Firewall allows connections
- [ ] No typos in API URL
- [ ] Backend console shows no errors

### Still Not Working?

1. **Check backend console** for errors
2. **Check frontend console** (Metro bundler) for errors
3. **Restart both** backend and Expo
4. **Try from iOS simulator first** (easier to debug)

### Get Help

Check the backend logs:
```bash
cd backend
npm start
# Watch for errors when you try to signup
```

Check frontend logs:
```bash
cd frontend
npm start
# Press 'j' to open debugger
# Check console for network errors
```
