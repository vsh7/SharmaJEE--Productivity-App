# Quick Start Guide

## New Folder Structure

The project has been reorganized into a clean monorepo structure:

```
productivity-app/
├── frontend/          # All React Native/Expo code
├── backend/           # All Node.js/Express code
└── package.json       # Root scripts to run both
```

## Installation

From the root directory:

```bash
npm run install-all
```

This will install dependencies for:
- Root (concurrently for running both apps)
- Frontend (React Native + Expo)
- Backend (Node.js + Express)

## Running the Application

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This runs both frontend and backend concurrently.

### Option 2: Run Frontend Only

```bash
# Start Expo dev server
npm run frontend

# Or run on specific platform
npm run frontend:android
npm run frontend:ios
npm run frontend:web
```

### Option 3: Run Backend Only

```bash
npm run backend

# Or in development mode (with nodemon)
npm run backend:dev
```

## Environment Setup

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Configuration

The frontend automatically detects the backend URL. For local development:
- iOS Simulator: `http://localhost:5000`
- Android Emulator: `http://10.0.2.2:5000`
- Physical Device: `http://YOUR_LOCAL_IP:5000`

Update the API base URL in your frontend code if needed.

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend & backend concurrently |
| `npm run frontend` | Start Expo dev server |
| `npm run frontend:android` | Run on Android |
| `npm run frontend:ios` | Run on iOS |
| `npm run frontend:web` | Run on web browser |
| `npm run backend` | Start backend server |
| `npm run backend:dev` | Start backend with auto-reload |
| `npm run install-all` | Install all dependencies |

## Development Workflow

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **In another terminal, start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Or use the convenience script from root:**
   ```bash
   npm run dev
   ```

## What Changed?

### Before:
```
productivity-app/
├── app/
├── components/
├── backend/
├── package.json
└── ...
```

### After:
```
productivity-app/
├── frontend/
│   ├── app/
│   ├── components/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   └── package.json
└── package.json (root)
```

## Benefits

✅ **Clear Separation**: Frontend and backend are now clearly separated
✅ **Independent Dependencies**: Each has its own `package.json` and `node_modules`
✅ **Easy Deployment**: Deploy frontend and backend independently
✅ **Better Organization**: Easier to navigate and understand the codebase
✅ **Scalability**: Easy to add more services (e.g., admin panel, worker services)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 19000 (Expo)
lsof -ti:19000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
npm run install-all
```

### Connection Issues
- Make sure backend is running before starting frontend
- Check that backend `.env` file exists and has correct values
- Verify MongoDB connection string is correct
- Check firewall settings if using physical device

## Next Steps

1. Set up your MongoDB database
2. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Configure `backend/.env`
4. Run `npm run install-all`
5. Run `npm run dev`
6. Open Expo Go on your device and scan the QR code

Happy coding! 🚀
