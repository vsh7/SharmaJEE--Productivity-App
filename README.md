# JEE/NEET Student Productivity App

A full-stack productivity application designed specifically for JEE and NEET students to track their study progress, manage timetables, and receive AI-powered study suggestions.

## Project Structure

```
productivity-app/
├── frontend/           # React Native + Expo mobile app
│   ├── app/           # Expo Router pages
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── assets/        # Images, fonts, etc.
│   ├── constants/     # App constants
│   ├── src/           # Source utilities
│   └── package.json   # Frontend dependencies
│
├── backend/           # Node.js + Express API
│   ├── config/        # Database and config
│   ├── controllers/   # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth, rate limiting, etc.
│   ├── services/      # Business logic
│   ├── utils/         # Utilities (cron jobs, notifications)
│   ├── server.js      # Entry point
│   └── package.json   # Backend dependencies
│
└── package.json       # Root scripts for managing both apps
```

## Features

### For Students:
- **Daily Report Tracking**: Log study hours for Physics, Chemistry, Math, and Biology
- **Timetable Management**: Create and track daily study schedules
- **AI Study Suggestions**: Get personalized study recommendations powered by Google Gemini AI
- **Performance Analytics**: View detailed statistics and patterns
- **Push Notifications**: Reminders for timetable (2 PM) and daily reports (9 PM)
- **Streak Tracking**: Maintain consistency with daily report streaks

### For Mentors:
- **Student Dashboard**: Monitor all assigned students
- **Performance Reports**: View detailed analytics for each student
- **Report Management**: Access historical data and trends

## Tech Stack

### Frontend:
- React Native + Expo
- Expo Router (file-based routing)
- AsyncStorage for local data
- Expo Notifications
- Axios for API calls

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI
- Node-cron for scheduled tasks
- Express-rate-limit for API protection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd productivity-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, frontend, and backend.

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

### Running the Application

#### Run Both (Frontend + Backend) Concurrently:
```bash
npm run dev
```

#### Run Frontend Only:
```bash
npm run frontend
# or for specific platform
npm run frontend:android
npm run frontend:ios
npm run frontend:web
```

#### Run Backend Only:
```bash
npm run backend
# or in development mode with auto-restart
npm run backend:dev
```

## API Features

### Rate Limiting:
- **AI Suggestions**: 5 requests per 15 minutes
- **General API**: 30 requests per minute
- **Authentication**: 10 attempts per 15 minutes

### Scheduled Notifications:
- **2 PM IST**: Timetable reminder
- **9 PM IST**: Daily report submission reminder

### Authentication:
All API routes are protected with JWT authentication. Students and mentors have role-based access control.

## Development

### Frontend Development:
```bash
cd frontend
npm start
```

### Backend Development:
```bash
cd backend
npm run dev
```

### Project Documentation:
- Backend API Guide: `backend/BACKEND_GUIDE.md`
- Project Completion Report: `PROJECT_COMPLETION_REPORT.md`

## API Endpoints

### Authentication:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Daily Reports:
- `POST /api/reports` - Submit daily report
- `GET /api/reports` - Get student's reports
- `GET /api/reports/mentor` - Get all students' reports (mentor only)

### Timetables:
- `POST /api/timetables` - Create/update timetable
- `GET /api/timetables` - Get today's timetable
- `GET /api/timetables/mentor` - Get all students' timetables (mentor only)

### AI Suggestions:
- `GET /api/ai/suggestions` - Get AI-powered study suggestions (rate-limited)
- `GET /api/ai/stats` - Get quick analytics stats

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
