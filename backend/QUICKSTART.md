# Quick Start Guide - Firebase & Google Drive Integration

## ✅ What's Been Set Up

Your backend now includes:
1. **Firebase Firestore** - Stores all participant registration data
2. **Google Drive** - Stores transaction screenshot uploads
3. **Automatic email notifications** - Confirmation emails to participants
4. **Admin endpoint** - View all registrations

## 📦 Files Created

```
backend/
├── services/
│   ├── firebaseService.js    # Firebase Firestore operations
│   └── driveService.js        # Google Drive file uploads
├── .env.example               # Environment variables template
└── FIREBASE_SETUP.md          # Detailed setup instructions
```

## 🚀 Quick Setup (5 Minutes)

### 1. Create Firebase Project
- Visit: https://console.firebase.google.com/
- Create a new project
- Download service account JSON

### 2. Enable Google Drive API
- Visit: https://console.cloud.google.com/
- Select your Firebase project
- Enable "Google Drive API"

### 3. Create Drive Folder
- Create a folder in Google Drive for screenshots
- Share with your service account email (from JSON file)
- Copy the folder ID from URL

### 4. Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add:
```env
# Add your email credentials (already configured)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Add Firebase credentials (NEW)
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

# Add Drive folder ID (NEW)
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

### 5. Place Service Account File
- Save your downloaded `firebase-service-account.json` in the `backend` folder

### 6. Install & Run
```bash
npm install
npm run dev
```

## 🔍 Testing

Test the setup:
```bash
# Health check
curl http://localhost:5000/api/health

# View registrations
curl http://localhost:5000/api/registrations
```

## 📊 Viewing Data

### Firebase Console
View all registrations in real-time:
https://console.firebase.google.com/ → Firestore Database

### Google Drive
View all uploaded transaction screenshots:
https://drive.google.com/ → Your folder

## 🌐 For Vercel Deployment

1. Convert JSON to single line:
   ```bash
   cat firebase-service-account.json | tr -d '\n'
   ```

2. Add to Vercel environment variables:
   - `FIREBASE_SERVICE_ACCOUNT` = (single-line JSON)
   - `GOOGLE_SERVICE_ACCOUNT` = (same single-line JSON)
   - `GOOGLE_DRIVE_FOLDER_ID` = your-folder-id
   - `EMAIL_USER` = your-email
   - `EMAIL_PASS` = your-password

## ⚡ What Changed

### Before:
- Files stored locally (doesn't work on Vercel)
- No database (data lost on restart)

### After:
- Files stored in Google Drive (permanent & accessible)
- Data stored in Firebase Firestore (permanent & queryable)
- Works perfectly on Vercel's serverless platform

## 🎯 New Features

1. **Persistent Storage**: All registrations saved to Firebase
2. **File Management**: Screenshots uploaded to Google Drive
3. **Admin Dashboard Ready**: GET `/api/registrations` endpoint
4. **Production Ready**: Works on Vercel without file system issues

## 📚 Need Help?

Read the detailed guide: `FIREBASE_SETUP.md`

## ⚠️ Security Checklist

✅ `.gitignore` updated (credentials won't be committed)
✅ Environment variables template created
✅ Service account file excluded from Git
✅ Ready for secure deployment

---

**Next Step**: Follow the setup guide above to configure your Firebase project and Google Drive folder!
