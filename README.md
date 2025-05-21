# QuickPeek - VIDEO UPLOAD & PREVIEW APP
=======================================

QuickPeek is a mobile app where users can register, upload videos, view auto-generated thumbnails, and like content. It uses:
- React Native (Expo) for the frontend
- Node.js + Express.js for the backend
- MongoDB for the database
- FFmpeg for generating video thumbnails

---------------------------------------
REQUIREMENTS
---------------------------------------

BACKEND:
- Node.js & npm
- MongoDB (local or Atlas)
- FFmpeg installed and added to PATH

FRONTEND:
- Expo CLI (npm install -g expo-cli)
- Android/iOS device or emulator

---------------------------------------
SETUP INSTRUCTIONS
---------------------------------------

1. CLONE THE REPOSITORY
   git clone https://github.com/your-username/quickpeek.git
   cd quickpeek

-------------------------
BACKEND SETUP
-------------------------

2. Go to backend directory:
   cd backend

3. Install dependencies:
   npm install

4. Create a .env file in backend/ with the following:
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=your_jwt_secret
   UPLOADS_DIR=uploads

5. Start the server:
   npm start

   - Server runs at http://localhost:5000
   - API routes:
     POST   /api/auth/register
     POST   /api/auth/login
     POST   /api/videos/upload
     GET    /api/videos
     POST   /api/videos/like/:videoId

-------------------------
FRONTEND SETUP
-------------------------

6. Open a new terminal and go to frontend directory:
   cd frontend

7. Install dependencies:
   npm install

8. Run the app using Expo:
   npx expo start

   - Scan the QR code with Expo Go on your phone or run on an emulator.

-------------------------
IMAGE & ASSET NOTES
-------------------------

Put the following files in frontend/assets:

- icon.jpg            -> App icon
- splash.png          -> Splash screen image
- adaptive-icon.png   -> Android adaptive icon
- favicon.png         -> Favicon for web

Update paths in app.json if needed.

-------------------------
USAGE
-------------------------

1. Register or login in the app.
2. Upload a video (.mp4). Thumbnail will be auto-generated.
3. Browse videos with previews.
4. Tap heart icon to like a video.

-------------------------
TROUBLESHOOTING
-------------------------

- If uploads folder is not created, check server logs and permissions.
- Make sure FFmpeg is installed and accessible via terminal.
- For Expo asset errors, confirm that asset filenames and paths match in `app.json`.

-------------------------
AUTHOR
-------------------------

QuickPeek - Built with ❤️ by [Your Name]
