const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let db = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase already initialized');
      return admin.firestore();
    }

    // For production: use service account JSON
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } 
    // For development: use service account file
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } 
    else {
      console.error('Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS');
      return null;
    }

    db = admin.firestore();
    console.log('Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
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
