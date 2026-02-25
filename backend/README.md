# Technoverse Backend Server

This is the backend server for Technoverse 1.0 event registration system. It handles registration submissions, stores data in Firebase Firestore, uploads transaction screenshots to Google Drive, and sends automated confirmation emails.

## Features

- ✅ RESTful API for event registration
- ✅ Firebase Firestore for data persistence
- ✅ Google Drive for transaction screenshot uploads
- ✅ Automated email confirmation to registered participants
- ✅ Team registration support with emails to all team members
- ✅ Beautiful HTML email templates
- ✅ CORS enabled for frontend integration
- ✅ Error handling and validation
- ✅ Production ready for Vercel deployment

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Gmail account (or other email provider for sending emails)
- Firebase project with Firestore enabled
- Google Drive API enabled

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Email Setup (Gmail)

1. **Enable 2-Step Verification** on your Google Account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Generate and copy the 16-character password

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your credentials:
     ```
     PORT=5000
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-16-char-app-password
     ```

### Alternative Email Providers

If you're using a different email provider, modify the transporter configuration in `index.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-16T10:30:00.000Z"
}
```

### Register Participant
```
POST /api/register
```

**Request Body:**
```json
{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "candidatePhone": "1234567890",
  "competitionName": "Code Hunt",
  "teamName": "Team Alpha",
  "teamMemberCount": "3",
  "teamMembers": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "0987654321"
    },
    {
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "phone": "5555555555"
    }
  ],
  "transactionId": "TXN123456789"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful! Confirmation email sent.",
  "data": {
    "candidateName": "John Doe",
    "competitionName": "Code Hunt",
    "transactionId": "TXN123456789"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to process registration. Please try again.",
  "error": "Error details..."
}
```

## Email Features

- **Main Participant Email**: Detailed confirmation with all registration information
- **Team Member Emails**: Each team member receives a confirmation email
- **Professional HTML Templates**: Beautiful, responsive email design
- **Event Information**: Includes event name, registration details, and next steps

## Testing

1. Start the server:
```bash
npm run dev
```

2. Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

3. Test registration (using curl or Postman):
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "candidateName": "Test User",
    "candidateEmail": "test@example.com",
    "candidatePhone": "1234567890",
    "competitionName": "Test Event",
    "transactionId": "TEST123"
  }'
```

## Troubleshooting

### Email Not Sending

1. **Check credentials**: Ensure EMAIL_USER and EMAIL_PASS are correct in `.env`
2. **App Password**: Make sure you're using an App Password, not your regular password
3. **2-Step Verification**: Verify it's enabled on your Google Account
4. **Check logs**: Look at server console for error messages
5. **Test connection**: The server logs "Email transporter is ready" on successful setup

### CORS Issues

If the frontend can't connect to the backend:
1. Ensure the backend is running on port 5000
2. Check that CORS is enabled (already configured in the code)
3. Verify the frontend is making requests to `http://localhost:5000`

### Port Already in Use

If port 5000 is already in use:
1. Change the PORT in `.env` to another port (e.g., 5001)
2. Update the frontend API URL in `RegistrationForm.js` to match

## Security Notes

⚠️ **Important Security Reminders:**

- Never commit `.env` file to Git (it's in `.gitignore`)
- Use App Passwords instead of your main email password
- In production, use environment variables from your hosting provider
- Consider rate limiting for production deployments
- Add input sanitization for production use
- Use HTTPS in production

## Future Enhancements

- [x] Add database integration (Firebase Firestore)
- [x] Add file storage (Google Drive)
- [x] Create admin endpoint (GET /api/registrations)
- [ ] Implement rate limiting
- [ ] Add authentication for admin endpoints
- [ ] Create admin dashboard UI
- [ ] Add payment verification
- [ ] Implement email templates with attachments (QR codes, tickets)
- [ ] Add webhook notifications

## License

ISC

## Author

Atharv Tambekar
