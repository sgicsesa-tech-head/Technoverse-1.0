const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Firebase service
const { initializeFirebase, saveRegistration, getAllRegistrations } = require('./services/firebaseService');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase on startup
initializeFirebase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure nodemailer transporter with explicit secure SMTP and logging
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true, // use pooled connections to avoid rate limits
  maxConnections: 5,
  maxMessages: 100,
  logger: true,
  debug: process.env.EMAIL_DEBUG === 'true'
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// WhatsApp group links for each event
const whatsappGroupLinks = {
  'The Squid Hunt (Treasure Hunt)': 'https://chat.whatsapp.com/HcinjdJrOnOHxjK1dvABio?mode=gi_t',
  'Ideaverse': 'https://chat.whatsapp.com/K2inGIoPhpnBAUiOhqH5Nk?mode=hqctswa',
  'E - Sports BGMI': 'https://chat.whatsapp.com/BhAb8BY8skz1PDqLmYq6Pg?mode=hqctswa',
  'E-sports (Free Fire)': 'https://chat.whatsapp.com/F5B9Xf1pDTEKRiLZ4qYVIn?mode=gi_t',
  'Daredevil - The Blind Coding Arena': 'https://chat.whatsapp.com/L0j49wIXHVfBhxFmsIroAj?mode=gi_t',
  'The Grand Prix of Code': 'https://chat.whatsapp.com/GsUKFzRIOV1ATz3ecZDigk?mode=gi_t',
  'The Hiring Room': 'https://chat.whatsapp.com/Jxcfx8bgLTx6LZPRx5XCAL?mode=gi_t',
  'Pixelfix': 'https://chat.whatsapp.com/Gp6qTk0HIahI6e7Oie6KTq?mode=gi_t',
};

// Helper function to generate email HTML
const generateEmailHTML = (formData) => {
  const isTeamEvent = formData.teamMembers && formData.teamMembers.length > 0;
  const whatsappLink = whatsappGroupLinks[formData.competitionName] || null;
  
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
            Phone: ${formData.candidatePhone}<br>
            College: ${formData.candidateCollege || ''}
        </li>
        ${formData.teamMembers.map((member, index) => `
          <li><strong>${member.name}</strong><br>
              Email: ${member.email}<br>
              Phone: ${member.phone}<br>
              College: ${member.college || ''}
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
          <p><strong>College:</strong> ${formData.candidateCollege || ''}</p>
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
          <li>Make sure to bring your ID proof and college ID</li>
          <li>Checkout the rule book of your participated event</li>
          <li>Make sure to arrive 15 minutes before the event starts</li>
          ${whatsappLink ? `<li>Join the official WhatsApp group for <strong>${formData.competitionName}</strong>: <a href="${whatsappLink}" style="color: #25D366; font-weight: bold; text-decoration: none;">📱 Join WhatsApp Group</a></li>` : ''}
        </ul>
        
        ${whatsappLink ? `
        <div style="text-align: center; margin: 25px 0;">
          <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">📱 Join WhatsApp Group</a>
        </div>
        ` : ''}
        
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
app.post('/api/register', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.candidateName || !formData.candidateEmail || !formData.candidatePhone || !formData.candidateCollege) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Prepare data for Firestore
    const registrationData = {
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      candidatePhone: formData.candidatePhone,
      candidateCollege: formData.candidateCollege || '',
      competitionName: formData.competitionName,
      transactionId: formData.transactionId,
      isTeamEvent: !!(formData.teamMembers && formData.teamMembers.length > 0),
      teamName: formData.teamName || '',
      teamMemberCount: parseInt(formData.teamMemberCount) || 1,
      teamMembers: formData.teamMembers || [],
      registrationDate: new Date().toISOString(),
      status: 'pending' // Can be: pending, approved, rejected
    };

    // Save to Firestore
    const firestoreResult = await saveRegistration(registrationData);
    
    if (!firestoreResult.success) {
      console.error('Failed to save to Firestore:', firestoreResult.error);
      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }

    console.log('Registration saved to Firestore with ID:', firestoreResult.id);
    registrationData.firestoreId = firestoreResult.id;

    // Log registration data
    console.log('New registration:', {
      name: formData.candidateName,
      email: formData.candidateEmail,
      competition: formData.competitionName,
      isTeam: !!(formData.teamMembers && formData.teamMembers.length > 0),
      firestoreId: firestoreResult.id,
      timestamp: new Date().toISOString()
    });

    // Registration is successful — respond immediately
    res.status(200).json({
      success: true,
      message: 'Registration successful!',
      data: {
        candidateName: formData.candidateName,
        competitionName: formData.competitionName,
        transactionId: formData.transactionId,
        firestoreId: firestoreResult.id
      }
    });

    // ---- Fire-and-forget: send emails AFTER response ----

    // Send confirmation email to main candidate
    const mailOptions = {
      from: `"Technoverse - CSESA SGI" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: formData.candidateEmail,
      subject: `Registration Confirmed - ${formData.competitionName} | Technoverse`,
      text: `Dear ${formData.candidateName},\n\nYour registration for ${formData.competitionName} at Technoverse has been confirmed.\nTransaction ID: ${formData.transactionId}\n\nPlease bring your ID proof and college ID. Arrive 15 minutes before the event starts.\n\nRegards,\nTeam Technoverse - CSESA SGI`,
      html: generateEmailHTML(formData)
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent:', info.messageId, info.response);
    } catch (err) {
      console.error('Failed to send confirmation email (registration still saved):', err.message || err);
      if (err.response) console.error('SMTP response:', err.response);
      // Email failure does NOT affect registration
    }

    // If it's a team event, send emails to all team members
    if (formData.teamMembers && formData.teamMembers.length > 0) {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      for (const member of formData.teamMembers) {
        await delay(1000); // 1-second delay between emails to avoid Gmail rate limits
        const memberMailOptions = {
          from: `"Technoverse - CSESA SGI" <${process.env.EMAIL_USER}>`,
          replyTo: process.env.EMAIL_USER,
          to: member.email,
          subject: `Team Registration Confirmed - ${formData.competitionName} | Technoverse`,
          text: `Dear ${member.name},\n\nYou have been registered as a team member for ${formData.competitionName} at Technoverse.\nTeam Name: ${formData.teamName}\nTeam Leader: ${formData.candidateName}\n\nFurther details will be shared soon. Good luck!\n\nRegards,\nTeam Technoverse - CSESA SGI`,
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
                <p><strong>College:</strong> ${member.college || ''}</p>
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
        
        try {
          const mInfo = await transporter.sendMail(memberMailOptions);
          console.log('Team member email sent to', member.email, mInfo.messageId);
        } catch (err) {
          console.error('Failed to send team member email to', member.email, err.message || err);
          if (err.response) console.error('SMTP response:', err.response);
          // continue sending to remaining members
        }
      }
    }

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

// Get all registrations endpoint (admin only - add authentication in production)
app.get('/api/registrations', async (req, res) => {
  try {
    const result = await getAllRegistrations();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        count: result.data.length,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registrations',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
});

// Test email endpoint - use this to reproduce and capture SMTP response details
app.post('/api/test-email', async (req, res) => {
  const to = req.body.to;
  if (!to) return res.status(400).json({ success: false, message: 'Missing `to` in request body' });

  const testMail = {
    from: `"Technoverse - CSESA SGI" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Technoverse - Test Email',
    text: 'This is a test email from Technoverse backend. If you receive this, SMTP is working.',
    html: '<p>This is a <strong>test</strong> email from Technoverse backend.</p>'
  };

  try {
    const info = await transporter.sendMail(testMail);
    console.log('Test email sent:', info);
    res.status(200).json({ success: true, info });
  } catch (err) {
    console.error('Test email failed:', err);
    res.status(500).json({ success: false, message: err.message, response: err.response || null });
  }
});

// Templated test endpoint: send the same automated registration email HTML
app.post('/api/test-email-template', async (req, res) => {
  const to = req.body.to;
  const formData = req.body.formData;
  const useTemplate = req.body.useTemplate === true || req.body.useTemplate === 'true';

  if (!to) return res.status(400).json({ success: false, message: 'Missing `to` in request body' });

  if (useTemplate && !formData) {
    return res.status(400).json({ success: false, message: 'Missing `formData` for template email' });
  }

  const mail = useTemplate ? {
    from: `"Technoverse - CSESA SGI" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to,
    subject: `Registration Confirmed - ${formData.competitionName || 'Event'} | Technoverse`,
    text: `Dear ${formData.candidateName || 'Participant'},\n\nYour registration for ${formData.competitionName || 'the event'} at Technoverse has been confirmed.\nTransaction ID: ${formData.transactionId || ''}\n\nRegards,\nTeam Technoverse - CSESA SGI`,
    html: generateEmailHTML(formData)
  } : {
    from: `"Technoverse - CSESA SGI" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Technoverse - Test Email',
    text: 'This is a test email from Technoverse backend. If you receive this, SMTP is working.',
    html: '<p>This is a <strong>test</strong> email from Technoverse backend.</p>'
  };

  try {
    const info = await transporter.sendMail(mail);
    console.log('Template test email sent:', info);
    res.status(200).json({ success: true, info });
  } catch (err) {
    console.error('Template test email failed:', err);
    res.status(500).json({ success: false, message: err.message, response: err.response || null });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
