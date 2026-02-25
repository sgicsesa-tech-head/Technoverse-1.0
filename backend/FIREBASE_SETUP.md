# Firebase & Google Drive Setup Guide

## Prerequisites
1. A Google Cloud Platform account
2. A Firebase project
3. A Google Drive folder for storing transaction screenshots

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, go to **Project Settings** > **Service Accounts**
4. Click "Generate new private key"
5. Save the downloaded JSON file as `firebase-service-account.json` in the backend folder

## Step 2: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Drive API" and enable it
5. You can use the same service account JSON for both Firebase and Google Drive

## Step 3: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder for transaction screenshots (e.g., "Technoverse Transactions")
3. Right-click the folder > **Share** > Share with the service account email
   - Find the email in your `firebase-service-account.json` file (looks like `xxx@xxx.iam.gserviceaccount.com`)
   - Give it **Editor** permissions
4. Copy the folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

## Step 4: Configure Environment Variables

### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file:
   ```env
   PORT=5000
   
   # Email
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   
   # Firebase & Google Drive (same file for both)
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
   
   # Google Drive Folder
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-step-3
   
   # Optional: Make files public
   DRIVE_MAKE_PUBLIC=false
   ```

### For Production (Vercel):

1. Convert your service account JSON to a single-line string:
   ```bash
   # On Linux/Mac:
   cat firebase-service-account.json | jq -c
   
   # Or manually: Remove all newlines and extra spaces
   ```

2. In Vercel Dashboard, add these environment variables:
   - `EMAIL_USER` = your-email@gmail.com
   - `EMAIL_PASS` = your-app-specific-password
   - `FIREBASE_SERVICE_ACCOUNT` = (paste the single-line JSON)
   - `GOOGLE_SERVICE_ACCOUNT` = (paste the same single-line JSON)
   - `GOOGLE_DRIVE_FOLDER_ID` = your-folder-id
   - `DRIVE_MAKE_PUBLIC` = false

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

## Step 6: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5000/api/health` to verify the server is running.

## Features

### Automatic Data Storage
- **Firebase Firestore**: Stores all registration details
- **Google Drive**: Stores transaction screenshot files
- **Email**: Sends confirmation emails to participants

### API Endpoints

#### 1. Register Participant
```
POST /api/register
Content-Type: multipart/form-data

Fields:
- candidateName
- candidateEmail
- candidatePhone
- competitionName
- transactionId
- transactionScreenshot (file)
- teamName (optional)
- teamMemberCount (optional)
- teamMembers (optional, JSON string)
```

#### 2. Get All Registrations
```
GET /api/registrations

Returns all registrations from Firestore
```

#### 3. Health Check
```
GET /api/health

Returns server status
```

## Security Notes

⚠️ **Important**: 
- Never commit your `firebase-service-account.json` file to Git
- Never commit your `.env` file to Git
- The `.gitignore` should include:
  ```
  .env
  firebase-service-account.json
  google-service-account.json
  ```

## Viewing Registrations

### Option 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. View the `registrations` collection

### Option 2: API Endpoint
```bash
curl http://localhost:5000/api/registrations
```

### Option 3: Google Drive
1. Open your Google Drive folder
2. All transaction screenshots are stored there with descriptive names

## Troubleshooting

### Error: "Firebase credentials not found"
- Make sure `firebase-service-account.json` exists in the backend folder
- Check that `GOOGLE_APPLICATION_CREDENTIALS` path is correct in `.env`

### Error: "Google Drive not initialized"
- Verify Google Drive API is enabled in Google Cloud Console
- Check service account has access to the Drive folder  

### Error: "Permission denied" on Drive upload
- Make sure you shared the Drive folder with the service account email
- Verify the service account has Editor permissions

### Vercel "EROFS" error
- The code now uses memory storage and uploads directly to Google Drive
- No local file system access needed on Vercel

## Support

For issues, check:
1. Firebase Console logs
2. Vercel deployment logs
3. Backend console output
