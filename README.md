# Technoverse 1.0 - Event Registration System

A modern event registration and management system for Technoverse 1.0, featuring automated email confirmations and a Netflix-inspired UI.

## 🚀 Features

- **Event Registration** - Dynamic registration forms for solo and team events
- **Automated Emails** - Beautiful HTML email confirmations sent automatically
- **Team Support** - Handle team registrations with multiple members
- **Payment Integration** - UPI transaction tracking
- **Responsive Design** - Works seamlessly on all devices
- **Netflix-Style UI** - Modern, engaging user interface

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for sending emails)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Technoverse-1.0

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. The default `.env` is already set up for local development:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. For production, update with your deployed backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

#### Backend Configuration

1. Navigate to backend and copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update `backend/.env` with your email credentials:
   ```
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Gmail App Password Setup:**
   - Enable 2-Step Verification in your Google Account
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Generate a new app password for "Mail"
   - Use that password in `EMAIL_PASS`

📚 See [ENV_SETUP.md](ENV_SETUP.md) for detailed environment configuration guide.

📧 See [backend/README.md](backend/README.md) for backend API documentation.

### 3. Running the Application

#### Start Backend Server

```bash
cd backend
npm start
# Or for development with auto-restart:
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Start Frontend (in a new terminal)

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

## 🎯 Usage

1. Navigate to `http://localhost:3000`
2. Browse available competitions/events
3. Click "Register" on any event
4. Fill in the registration form
5. Complete payment and enter transaction ID
6. Submit and receive confirmation email

## 📁 Project Structure

```
Technoverse-1.0/
├── backend/
│   ├── index.js              # Express server with email automation
│   ├── package.json
│   ├── .env                  # Backend environment variables
│   └── README.md             # Backend documentation
├── src/
│   ├── components/
│   │   ├── RegistrationForm.js  # Main registration form
│   │   ├── Banner.js
│   │   ├── CompetitionRow.js
│   │   └── ...
│   ├── data/
│   │   └── event_data.json   # Event information
│   └── App.js
├── .env                      # Frontend environment variables
├── .env.example             # Environment template
├── ENV_SETUP.md             # Environment setup guide
└── README.md                # This file
```

## 🔧 Environment Variables

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

### Backend (backend/.env)
- `PORT` - Server port (default: 5000)
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail app password

⚠️ **Important:** After changing `.env` files, restart the development server.

## 📦 Available Scripts (Frontend)

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
