import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RegistrationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    candidateEmail: '',
    competitionName: event?.title || '',
    teamName: '',
    teamMemberCount: '2',
    teamMembers: [],
    transactionId: ''
  });

  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Google Form URL for screenshot upload
  const googleFormUrl = process.env.REACT_APP_GOOGLE_FORM_URL || '';

  useEffect(() => {
    if (!event) {
      navigate('/');
      return;
    }

    // Determine if it's a team event
    const playersPerTeam = event.structure?.players_per_team;
    if (playersPerTeam && typeof playersPerTeam === 'number' && playersPerTeam > 1) {
      setIsTeamEvent(true);
      setMaxTeamSize(playersPerTeam);
      // Initialize team members array
      const members = [];
      for (let i = 0; i < playersPerTeam - 1; i++) {
        members.push({ name: '', phone: '', email: '' });
      }
      setFormData(prev => ({ ...prev, teamMembers: members, teamMemberCount: String(playersPerTeam) }));
    } else if (playersPerTeam && typeof playersPerTeam === 'string') {
      // Handle cases like "1 or 2" or "5-8 Contestants"
      const match = playersPerTeam.match(/\d+/g);
      if (match && match.length > 1) {
        setIsTeamEvent(true);
        setMaxTeamSize(parseInt(match[match.length - 1]));
      }
    }
  }, [event, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeamMemberCountChange = (e) => {
    const count = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, teamMemberCount: e.target.value }));
    
    // Adjust team members array (excluding the main candidate)
    const members = [];
    for (let i = 0; i < count - 1; i++) {
      members.push(formData.teamMembers[i] || { name: '', phone: '', email: '' });
    }
    setFormData(prev => ({ ...prev, teamMembers: members }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newMembers = [...formData.teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, teamMembers: newMembers }));
    
    // Clear error for this field
    const errorKey = `member${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate main candidate
    if (!formData.candidateName.trim()) newErrors.candidateName = 'Name is required';
    if (!formData.candidatePhone.trim()) {
      newErrors.candidatePhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.candidatePhone.trim())) {
      newErrors.candidatePhone = 'Invalid phone number (10 digits required)';
    }
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail.trim())) {
      newErrors.candidateEmail = 'Invalid email format';
    }

    // Validate team details
    if (isTeamEvent && formData.teamMembers.length > 0) {
      if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
      
      formData.teamMembers.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`member${index}_name`] = `Member ${index + 2} name is required`;
        }
        if (!member.phone.trim()) {
          newErrors[`member${index}_phone`] = `Member ${index + 2} phone is required`;
        } else if (!/^\d{10}$/.test(member.phone.trim())) {
          newErrors[`member${index}_phone`] = `Invalid phone number`;
        }
        if (!member.email.trim()) {
          newErrors[`member${index}_email`] = `Member ${index + 2} email is required`;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email.trim())) {
          newErrors[`member${index}_email`] = `Invalid email format`;
        }
      });
    }

    // Validate transaction ID
    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Send registration data as JSON
        const registrationPayload = {
          candidateName: formData.candidateName,
          candidatePhone: formData.candidatePhone,
          candidateEmail: formData.candidateEmail,
          competitionName: formData.competitionName,
          transactionId: formData.transactionId,
        };

        // Add team data if it's a team event
        if (isTeamEvent && formData.teamMembers.length > 0) {
          registrationPayload.teamName = formData.teamName;
          registrationPayload.teamMemberCount = formData.teamMemberCount;
          registrationPayload.teamMembers = formData.teamMembers;
        }
        
        // Send registration data to backend
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationPayload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Show success message
          setSubmitted(true);
          console.log('Registration successful:', data);
        } else {
          // Show error message
          alert(data.message || 'Registration failed. Please try again.');
          console.error('Registration error:', data);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit registration. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
      
    //   Redirect after 3 seconds
    //   setTimeout(() => {
    //     navigate('/');
    //   }, 3000);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!event) return null;

  if (submitted) {
    return (
      <div className="registration-container">
        <div className="success-message">
          <CheckCircleIcon style={{ fontSize: 80, color: '#4caf50' }} />
          <h2>Registration Successful!</h2>
          <p>Thank you for registering for <strong>{event.title}</strong></p>
          <p>You will receive a confirmation email shortly, check in spam folder if not found.</p>
          {googleFormUrl && (
            <div className="screenshot-upload-section">
              <p className="upload-reminder-text">
                ⚠️ Don't forget to upload your payment screenshot!
              </p>
              <button
                className="btn-upload-screenshot"
                onClick={() => window.location.href = googleFormUrl}
              >
                📤 Upload Screenshot Now
              </button>
              <p className="upload-hint">You'll be taken to the upload form. Use your browser's back button to return here.</p>
            </div>
          )}
          {/* <p className="redirect-text">Redirecting to home...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-top">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon /> Back
        </button>

        <div className="registration-header">
          <h1>Event Registration</h1>
          <div className="event-badge">{event.title}</div>
        </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Main Candidate Information */}
          <div className="form-section">
            <h2 className="section-title">
              <PersonIcon /> Candidate Information
            </h2>
            
            <div className="form-group">
              <label htmlFor="candidateName">Full Name *</label>
              <input
                type="text"
                id="candidateName"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.candidateName ? 'error' : ''}
              />
              {errors.candidateName && <span className="form-error">{errors.candidateName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="candidatePhone">Phone Number *</label>
                <input
                  type="tel"
                  id="candidatePhone"
                  name="candidatePhone"
                  value={formData.candidatePhone}
                  onChange={handleInputChange}
                  placeholder="10 digit number"
                  maxLength="10"
                  className={errors.candidatePhone ? 'error' : ''}
                />
                {errors.candidatePhone && <span className="form-error">{errors.candidatePhone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="candidateEmail">Email Address *</label>
                <input
                  type="email"
                  id="candidateEmail"
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={errors.candidateEmail ? 'error' : ''}
                />
                {errors.candidateEmail && <span className="form-error">{errors.candidateEmail}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="competitionName">Competition Name</label>
              <input
                type="text"
                id="competitionName"
                name="competitionName"
                value={formData.competitionName}
                disabled
                className="locked-field"
              />
            </div>
          </div>

          {/* Team Information */}
          {isTeamEvent && (
            <div className="form-section">
              <h2 className="section-title">
                <GroupIcon /> Team Information
              </h2>

              <div className="form-group">
                <label htmlFor="teamName">Team Name *</label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="Enter your team name"
                  className={errors.teamName ? 'error' : ''}
                />
                {errors.teamName && <span className="form-error">{errors.teamName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="teamMemberCount">Total Team Members (Including You) *</label>
                <select
                  id="teamMemberCount"
                  name="teamMemberCount"
                  value={formData.teamMemberCount}
                  onChange={handleTeamMemberCountChange}
                >
                  {[...Array(maxTeamSize)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Member{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Team Members */}
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="team-member-section">
                  <h3 className="member-title">Team Member {index + 2}</h3>
                  
                  <div className="form-group">
                    <label htmlFor={`member${index}Name`}>Full Name *</label>
                    <input
                      type="text"
                      id={`member${index}Name`}
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      placeholder="Enter member's full name"
                      className={errors[`member${index}_name`] ? 'error' : ''}
                    />
                    {errors[`member${index}_name`] && <span className="form-error">{errors[`member${index}_name`]}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`member${index}Phone`}>Phone Number *</label>
                      <input
                        type="tel"
                        id={`member${index}Phone`}
                        value={member.phone}
                        onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                        placeholder="10 digit number"
                        maxLength="10"
                        className={errors[`member${index}_phone`] ? 'error' : ''}
                      />
                      {errors[`member${index}_phone`] && <span className="form-error">{errors[`member${index}_phone`]}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor={`member${index}Email`}>Email Address *</label>
                      <input
                        type="email"
                        id={`member${index}Email`}
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                        placeholder="member.email@example.com"
                        className={errors[`member${index}_email`] ? 'error' : ''}
                      />
                      {errors[`member${index}_email`] && <span className="form-error">{errors[`member${index}_email`]}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Information */}
          <div className="form-section payment-section">
            <h2 className="section-title">
              <PaymentIcon /> Payment Information
            </h2>

            <div className="payment-info">
              <p className="payment-instruction">
                Entry Fee: <strong>₹100 per person</strong>
              </p>
              {isTeamEvent && formData.teamMemberCount && (
                <p className="payment-instruction">
                  Total Amount: <strong>₹{100 * parseInt(formData.teamMemberCount)}</strong> ({formData.teamMemberCount} members × ₹100)
                </p>
              )}
              <p className="payment-instruction">
                Scan the QR code below to make the payment and enter the transaction details:
              </p>
            </div>

            <div className="qr-code-container">
              <div className="qr-code-placeholder">
                <PaymentIcon style={{ fontSize: 80, color: '#666' }} />
                <p>UPI QR Code</p>
                <p className="qr-note">(Add your UPI QR code image here)</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="transactionId">Transaction ID / UPI Reference Number *</label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter your transaction ID"
                className={errors.transactionId ? 'error' : ''}
              />
              {errors.transactionId && <span className="form-error">{errors.transactionId}</span>}
              <small className="field-hint">Enter the 12-digit UPI transaction ID from your payment app</small>
            </div>

            <div className="form-group">
              <label>Transaction Screenshot *</label>
              {googleFormUrl ? (
                <div className="google-form-upload">
                  <p className="upload-instruction">
                    After filling this form, upload your payment screenshot. Make sure to mention your <strong>Transaction ID</strong> and <strong>Name</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn-upload-screenshot"
                    onClick={() => window.location.href = googleFormUrl}
                  >
                    📤 Upload Screenshot
                  </button>
                  <p className="upload-hint">Opens in the same tab. Use your browser's back button to return.</p>
                </div>
              ) : (
                <p className="upload-instruction">
                  Screenshot upload will be available soon. Please keep your payment screenshot safe.
                </p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
