const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #ddd;
          border-top: none;
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
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #e50914;
          margin: 20px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          font-size: 14px;
          color: #666;
        }
        .success-icon {
          font-size: 60px;
          color: #4caf50;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="success-icon">✓</div>
        <h1>Registration Successful!</h1>
      </div>
      
      <div class="content">
        <p>Dear <strong>${formData.candidateName}</strong>,</p>
        
        <p>Thank you for registering for Technoverse 1.0! We're excited to have you participate in:</p>
        
        <div class="event-badge">${formData.competitionName}</div>
        
        <h3 style="color: #e50914; margin-top: 30px;">Registration Details</h3>
        
        <div class="info-box">
          <p><strong>Participant Name:</strong> ${formData.candidateName}</p>
          <p><strong>Email:</strong> ${formData.candidateEmail}</p>
          <p><strong>Phone:</strong> ${formData.candidatePhone}</p>
          <p><strong>Competition:</strong> ${formData.competitionName}</p>
          <p><strong>Transaction ID:</strong> ${formData.transactionId}</p>
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
        <p><strong>Technoverse 1.0</strong></p>
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
    if (!formData.candidateName || !formData.candidateEmail || !formData.candidatePhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.candidateEmail,
      subject: `Registration Confirmed - ${formData.competitionName} | Technoverse 1.0`,
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
          subject: `Team Registration Confirmed - ${formData.competitionName} | Technoverse 1.0`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #ffffff;
                  padding: 30px;
                  border: 1px solid #ddd;
                  border-top: none;
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
                  background: #f8f9fa;
                  padding: 20px;
                  text-align: center;
                  border-radius: 0 0 10px 10px;
                  font-size: 14px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Team Registration Confirmed!</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${member.name}</strong>,</p>
                <p>You have been registered as a team member for:</p>
                <div class="event-badge">${formData.competitionName}</div>
                <p><strong>Team Name:</strong> ${formData.teamName}</p>
                <p><strong>Team Leader:</strong> ${formData.candidateName}</p>
                <p>Further details will be shared soon. Good luck!</p>
              </div>
              <div class="footer">
                <p><strong>Technoverse 1.0</strong></p>
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
      timestamp: new Date().toISOString()
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Registration successful! Confirmation email sent.',
      data: {
        candidateName: formData.candidateName,
        competitionName: formData.competitionName,
        transactionId: formData.transactionId
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
