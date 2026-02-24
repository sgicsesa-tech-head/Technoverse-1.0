const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'transaction-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF) and PDF files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'smtp' with custom settings
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Helper function to generate email HTML
const generateEmailHTML = (formData) => {
  const isTeamEvent = formData.teamMembers && formData.teamMembers.length > 0;
  
  // Calculate total fee (₹100 per person)
  const totalMembers = isTeamEvent ? parseInt(formData.teamMemberCount || 1) : 1;
  const feePerPerson = 100;
  const totalFee = totalMembers * feePerPerson;
  
  let teamMembersHTML = '';
  if (isTeamEvent) {
    teamMembersHTML = `
      <h3 style="color: #e50914; margin-top: 20px;">Team Details</h3>
      <p><strong>Team Name:</strong> ${formData.teamName}</p>
      <p><strong>Total Members:</strong> ${formData.teamMemberCount}</p>
      <h4 style="color: #333; margin-top: 15px;">Team Members:</h4>
      <ol style="line-height: 1.8;">
        <li><strong>${formData.candidateName}</strong> (Team Leader)<br>
            Email: ${formData.candidateEmail}<br>
            Phone: ${formData.candidatePhone}
        </li>
        ${formData.teamMembers.map((member, index) => `
          <li><strong>${member.name}</strong><br>
              Email: ${member.email}<br>
              Phone: ${member.phone}
          </li>
        `).join('')}
      </ol>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #ffffff;
          background-color: #000000;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
          border-bottom: 3px solid #e50914;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          color: #e50914;
          font-weight: bold;
          letter-spacing: 3px;
        }
        .header p {
          color: #ffffff;
        }
        .content {
          background: #0f0f0f;
          padding: 30px;
          border: 1px solid #333;
          border-top: none;
          color: #ffffff;
        }
        .content h2 {
          color: #ffffff;
        }
        .content h3 {
          color: #e50914;
        }
        .content h4 {
          color: #ffffff;
        }
        .content p {
          color: #ffffff;
        }
        .event-badge {
          background: #e50914;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          display: inline-block;
          margin: 15px 0;
          font-weight: bold;
        }
        .info-box {
          background: #1a1a1a;
          padding: 15px;
          border-left: 4px solid #e50914;
          margin: 20px 0;
          color: #ffffff;
        }
        .info-box p {
          color: #ffffff;
        }
        .footer {
          background: #0a0a0a;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          font-size: 14px;
          color: #cccccc;
          border-top: 1px solid #333;
        }
        .footer p {
          color: #cccccc;
        }
        .success-icon {
          font-size: 60px;
          color: #4caf50;
          text-align: center;
          margin: 20px 0;
        }
        ul {
          color: #ffffff;
        }
        ol {
          color: #ffffff;
        }
        li {
          color: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TECHNOVERSE </h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; letter-spacing: 2px;">CSESA-SGI</p>
      </div>
      
      <div class="content">
        <div class="success-icon" style="color: #4caf50;">✓</div>
        <h2 style="color: #ffffff; text-align: center; margin-top: 0;">Registration Successful!</h2>
        
        <p>Dear <strong>${formData.candidateName}</strong>,</p>
        
        <p>Thank you for registering! We're excited to have you participate in:</p>
        
        <div class="event-badge">${formData.competitionName}</div>
        
        <h3 style="color: #e50914; margin-top: 30px;">Registration Details</h3>
        
        <div class="info-box">
          <p><strong>Participant Name:</strong> ${formData.candidateName}</p>
          <p><strong>Email:</strong> ${formData.candidateEmail}</p>
          <p><strong>Phone:</strong> ${formData.candidatePhone}</p>
          <p><strong>Competition:</strong> ${formData.competitionName}</p>
          <p><strong>Transaction ID:</strong> ${formData.transactionId}</p>
          <p style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e50914;">
            <strong>Fee Per Person:</strong> ₹${feePerPerson}<br>
            <strong>Total Members:</strong> ${totalMembers}<br>
            <strong>Total Amount Paid:</strong> ₹${totalFee}
          </p>
        </div>
        
        ${teamMembersHTML}
        
        <h3 style="color: #e50914; margin-top: 30px;">What's Next?</h3>
        <ul style="line-height: 1.8;">
          <li>Your registration is now confirmed</li>
          <li>Please save this email for your records</li>
          <li>Checkout the rule book of your participate event : </li>
          <li>Make sure to arrive 15 minutes before the event starts</li>
          <li>Join our official WhatsApp group for updates and communication (link will be shared soon)</li> 
        </ul>
        
        <div class="info-box">
          <p><strong>Important:</strong> If you have any questions or need to make changes to your registration, please contact us immediately.</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Technoverse </strong></p>
        <p>CSESA-SGI</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;
};

// Registration endpoint
app.post('/api/register', upload.single('transactionScreenshot'), async (req, res) => {
  try {
    const formData = req.body;
    
    // Parse teamMembers if it's a string (from multipart/form-data)
    if (typeof formData.teamMembers === 'string') {
      try {
        formData.teamMembers = JSON.parse(formData.teamMembers);
      } catch (e) {
        formData.teamMembers = [];
      }
    }
    
    // Validate required fields
    if (!formData.candidateName || !formData.candidateEmail || !formData.candidatePhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Add screenshot file info to formData if uploaded
    if (req.file) {
      formData.transactionScreenshot = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      };
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.candidateEmail,
      subject: `Registration Confirmed - ${formData.competitionName} | Technoverse `,
      html: generateEmailHTML(formData)
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // If it's a team event, optionally send emails to all team members
    if (formData.teamMembers && formData.teamMembers.length > 0) {
      for (const member of formData.teamMembers) {
        const memberMailOptions = {
          from: process.env.EMAIL_USER,
          to: member.email,
          subject: `Team Registration Confirmed - ${formData.competitionName} | Technoverse `,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #ffffff;
                  background-color: #000000;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                  border-bottom: 3px solid #e50914;
                }
                .header h1 {
                  margin: 0;
                  font-size: 32px;
                  color: #e50914;
                  font-weight: bold;
                  letter-spacing: 3px;
                }
                .header p {
                  color: #ffffff;
                }
                .content {
                  background: #0f0f0f;
                  padding: 30px;
                  border: 1px solid #333;
                  border-top: none;
                  color: #ffffff;
                }
                .content h2 {
                  color: #ffffff;
                }
                .content p {
                  color: #ffffff;
                }
                .event-badge {
                  background: #e50914;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 20px;
                  display: inline-block;
                  margin: 15px 0;
                  font-weight: bold;
                }
                .footer {
                  background: #0a0a0a;
                  padding: 20px;
                  text-align: center;
                  border-radius: 0 0 10px 10px;
                  font-size: 14px;
                  color: #cccccc;
                  border-top: 1px solid #333;
                }
                .footer p {
                  color: #cccccc;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>TECHNOVERSE </h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; letter-spacing: 2px;">CSESA-SGI</p>
              </div>
              <div class="content">
                <h2 style="color: #ffffff; text-align: center;">Team Registration Confirmed!</h2>
                <p>Dear <strong>${member.name}</strong>,</p>
                <p>You have been registered as a team member for:</p>
                <div class="event-badge">${formData.competitionName}</div>
                <p><strong>Team Name:</strong> ${formData.teamName}</p>
                <p><strong>Team Leader:</strong> ${formData.candidateName}</p>
                <p>Further details will be shared soon. Good luck!</p>
              </div>
              <div class="footer">
                <p><strong>Technoverse </strong></p>
                <p>CSESA-SGI</p>
              </div>
            </body>
            </html>
          `
        };
        
        await transporter.sendMail(memberMailOptions);
      }
    }

    // Log registration data (in production, you'd save this to a database)
    console.log('New registration:', {
      name: formData.candidateName,
      email: formData.candidateEmail,
      competition: formData.competitionName,
      isTeam: formData.teamMembers && formData.teamMembers.length > 0,
      screenshot: req.file ? req.file.filename : 'No screenshot uploaded',
      timestamp: new Date().toISOString()
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Registration successful! Confirmation email sent.',
      data: {
        candidateName: formData.candidateName,
        competitionName: formData.competitionName,
        transactionId: formData.transactionId,
        screenshotUploaded: !!req.file
      }
    });

  } catch (error) {
    console.error('Error processing registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process registration. Please try again.',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
