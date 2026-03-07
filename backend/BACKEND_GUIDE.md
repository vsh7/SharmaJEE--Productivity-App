# SharmaJEE Productivity App - Backend Guide

This document explains the architecture and components of the backend, how they interact, and what each remaining piece will do once built.

---

## 1. How the Backend Works (Overview)

The backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database (using **Mongoose** to interact with it).
The flow of any request is:
`Route -> Middleware (Authentication) -> Controller -> Model (Database) -> Response`

1. **Routes**: The entry points (URLs) that the frontend calls (e.g., `/api/auth/login`).
2. **Middleware**: Functions that run *before* the controller. We use it to verify the JWT token to ensure the user is logged in.
3. **Controllers**: The actual brain/logic. This is where we calculate things, format data, and call the database.
4. **Models**: The schemas that define what our database tables (collections) look like.

---

## 2. Existing Components

*   **Models/User.js**: Stores user information (`name`, `email`, `password`, `role`). The `role` determines if a user is a `"student"` or `"mentor"`.
*   **Models/Timetable.js**: Stores a student's timetable for a specific date, containing an array of `tasks`.
*   **Controllers/authController.js**: Handles `signup` and `login`. It hashes passwords securely and spits out a JWT (JSON Web Token) when a user logs in.
*   **Controllers/timetableController.js**: Allows a student to fetch their timetable for "today" and submit/update it.
*   **Middleware/authMiddleware.js** (Assumed existing based on structure): Checks requests to ensure they have a valid JWT token before allowing access to protected routes like timetables.

---

## 3. What We Are Building Next

To complete the backend requirements, we need to build the following:

### A. The Daily Report System (For Students)
Students need to report how many hours they studied and what they completed.

1.  **Model (`DailyReport.js`)**:
    *   Links to the `Student` (User).
    *   Stores `date`.
    *   Stores `hours_dedicated` (broken down by subject like Physics, Chemistry, etc.).
    *   Stores `tasks_completed` (text description).
    *   Stores `notes` (optional).
2.  **Controller (`reportController.js`)**:
    *   Logic to save a new daily report.
    *   Logic to fetch today's report (so the frontend can show it if already submitted).
    *   Logic to fetch past reports (for the "View Past TimeTables/Reports" feature).
3.  **Routes (`reportRoutes.js`)**: Endpoints for the frontend to hit.

### B. The Mentor System
Mentors need to be able to see student data and leave feedback.

1.  **Model (`Feedback.js`)**:
    *   Links to the `Mentor` giving the feedback.
    *   Links to the `Student` receiving it.
    *   Links to a specific `DailyReport` or `Timetable`.
    *   Stores the `comments` and `date`.
2.  **Controller (`mentorController.js`)**:
    *   `getAllStudentsWork`: Fetches all `DailyReports` submitted by all students for a given date.
    *   `getAllStudentsTimetables`: Fetches all `Timetables` for a given date.
    *   `giveFeedback`: Saves a new feedback record.
    *   `getStudentStats`: Aggregates data for a specific student to see their consistency.
3.  **Routes (`mentorRoutes.js`)**: Secure endpoints that **only** users with the `mentor` role can access.

### C. Integrating Everything (`server.js`)
Finally, we will open `server.js` and connect the new `reportRoutes` and `mentorRoutes` so the Express server knows they exist.

---

## 4. How the Frontend Will Use This

Once built, your React Native app will simply make HTTP requests to these endpoints using `fetch` or `axios`. 

For example, when a student hits "Submit Daily Report" on the app:
1. The app gathers the hours and text.
2. It sends a `POST` request to `/api/reports/submit` along with the student's JWT token.
3. The backend receives it, verifies the token, saves it to the `DailyReport` database collection, and sends back a success message!
