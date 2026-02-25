const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let db = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase already initialized');
      db = admin.firestore();
      return db;
    }

    let serviceAccount = null;

    // Option 1: Full service account JSON as env var (for Vercel/production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('Using FIREBASE_SERVICE_ACCOUNT env var');
      } catch (parseError) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseError.message);
      }
    }

    // Option 2: Individual env vars (alternative for Vercel if JSON parsing fails)
    if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID || '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      };
      console.log('Using individual FIREBASE_ env vars');
    }

    // Option 3: Service account file (for local development)
    if (!serviceAccount && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        console.log('Using GOOGLE_APPLICATION_CREDENTIALS file');
      } catch (fileError) {
        console.error('Failed to load service account file:', fileError.message);
      }
    }

    if (!serviceAccount) {
      console.error('Firebase credentials not found. Set one of: FIREBASE_SERVICE_ACCOUNT (JSON string), FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL, or GOOGLE_APPLICATION_CREDENTIALS (file path)');
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    db = admin.firestore();
    console.log('Firebase initialized successfully with project:', serviceAccount.project_id);
    return db;
  } catch (error) {
    console.error('Error initializing Firebase:', error.message);
    return null;
  }
};

// Get Firestore instance
const getFirestore = () => {
  if (!db) {
    db = initializeFirebase();
  }
  return db;
};

// Save registration to Firestore
const saveRegistration = async (registrationData) => {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const docRef = await db.collection('registrations').add({
      ...registrationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Registration saved to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving registration to Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Get all registrations
const getAllRegistrations = async () => {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const snapshot = await db.collection('registrations').get();
    const registrations = [];
    
    snapshot.forEach(doc => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: registrations };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return { success: false, error: error.message };
  }
};

// Get registration by ID
const getRegistrationById = async (id) => {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const doc = await db.collection('registrations').doc(id).get();
    
    if (!doc.exists) {
      return { success: false, error: 'Registration not found' };
    }

    return { success: true, data: { id: doc.id, ...doc.data() } };
  } catch (error) {
    console.error('Error fetching registration:', error);
    return { success: false, error: error.message };
  }
};

// Update registration
const updateRegistration = async (id, updateData) => {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    await db.collection('registrations').doc(id).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, id };
  } catch (error) {
    console.error('Error updating registration:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  saveRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration
};
