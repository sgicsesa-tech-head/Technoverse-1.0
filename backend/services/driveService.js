const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

let driveClient = null;

// Initialize Google Drive API
const initializeDrive = () => {
  try {
    if (driveClient) {
      return driveClient;
    }

    let auth;

    // For production: use service account JSON from environment variable
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
      auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file']
      });
    } 
    // For development: use service account file
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/drive.file']
      });
    } 
    else {
      console.error('Google Drive credentials not found');
      return null;
    }

    driveClient = google.drive({ version: 'v3', auth });
    console.log('Google Drive initialized successfully');
    return driveClient;
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    return null;
  }
};

// Upload file to Google Drive
const uploadToDrive = async (filePath, fileName, mimeType) => {
  try {
    const drive = initializeDrive();
    if (!drive) {
      throw new Error('Google Drive not initialized');
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : []
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink',
      supportsAllDrives: true
    });

    // Make file accessible (optional, based on your requirements)
    if (process.env.DRIVE_MAKE_PUBLIC === 'true') {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    }

    console.log('File uploaded to Google Drive:', response.data.id);
    return {
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload file from buffer (for multer memory storage)
const uploadBufferToDrive = async (buffer, fileName, mimeType) => {
  try {
    const drive = initializeDrive();
    if (!drive) {
      throw new Error('Google Drive not initialized');
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : []
    };

    const media = {
      mimeType: mimeType,
      body: require('stream').Readable.from(buffer)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink',
      supportsAllDrives: true
    });

    // Make file accessible (optional)
    if (process.env.DRIVE_MAKE_PUBLIC === 'true') {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    }

    console.log('File uploaded to Google Drive from buffer:', response.data.id);
    return {
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink
    };
  } catch (error) {
    console.error('Error uploading buffer to Google Drive:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete file from Google Drive
const deleteFromDrive = async (fileId) => {
  try {
    const drive = initializeDrive();
    if (!drive) {
      throw new Error('Google Drive not initialized');
    }

    await drive.files.delete({
      fileId: fileId
    });

    console.log('File deleted from Google Drive:', fileId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    return { success: false, error: error.message };
  }
};

// Get file info from Google Drive
const getFileInfo = async (fileId) => {
  try {
    const drive = initializeDrive();
    if (!drive) {
      throw new Error('Google Drive not initialized');
    }

    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, createdTime, webViewLink, webContentLink'
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting file info from Google Drive:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeDrive,
  uploadToDrive,
  uploadBufferToDrive,
  deleteFromDrive,
  getFileInfo
};
