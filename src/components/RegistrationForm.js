import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Ideaverse PPT template
import ideaverseTemplate from '../assets/Ideaverse_Template_ppt.pptx';

// UPI QR code images for different amounts
import qr100 from '../assets/UPI/100.jpeg';
import qr200 from '../assets/UPI/200.jpeg';
import qr300 from '../assets/UPI/300.jpeg';
import qr400 from '../assets/UPI/400.jpeg';
import qr500 from '../assets/UPI/500.jpeg';

const qrCodeMap = {
  100: qr100,
  200: qr200,
  300: qr300,
  400: qr400,
  500: qr500,
};

// WhatsApp group links for each event
const whatsappGroupLinks = {
  'The Squid Hunt (Treasure Hunt)': 'https://chat.whatsapp.com/HcinjdJrOnOHxjK1dvABio',
  'The Hiring Room': 'https://chat.whatsapp.com/JzAhAIUmS7uJ8IdhXnYYpD',
  'Ideaverse': 'https://chat.whatsapp.com/FHQPYr7Tb3aKZ6JWXd0qHy',
  'E-sports (Free Fire)': 'https://chat.whatsapp.com/BlOktIulfg2EZJTEZyxmAv',
  'E - Sports BGMI': 'https://chat.whatsapp.com/HkOMtXNJVaxJO78bAI8mTH',
  'Pixel Fix': 'https://chat.whatsapp.com/HrIjNeVxgB1HrSq58ZURYY',
  'Daredevil - The Blind Coding Arena': 'https://chat.whatsapp.com/G02ARVtpJE5ELG3om2maNg',
  'The Grand Prix of Code': 'https://chat.whatsapp.com/FnBZuXzfzWHDgZUXwFQuJm',
};

function RegistrationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    candidateEmail: '',
    candidateCollege: '',
    competitionName: event?.title || '',
    teamName: '',
    teamMemberCount: '1',
    teamMembers: [],
    transactionId: ''
  });

  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);

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
      setMinTeamSize(playersPerTeam);
      setMaxTeamSize(playersPerTeam);
      // Default to the fixed team size
      const members = [];
      for (let i = 0; i < playersPerTeam - 1; i++) {
        members.push({ name: '', phone: '', email: '', college: '' });
      }
      setFormData(prev => ({ ...prev, teamMembers: members, teamMemberCount: String(playersPerTeam) }));
    } else if (playersPerTeam && typeof playersPerTeam === 'string') {
      // Handle cases like "2-4" or "3-5"
      const match = playersPerTeam.match(/\d+/g);
      if (match && match.length > 1) {
        const min = parseInt(match[0]);
        const max = parseInt(match[match.length - 1]);
        setIsTeamEvent(true);
        setMinTeamSize(min);
        setMaxTeamSize(max);
        // Default to minimum team size
        const members = [];
        for (let i = 0; i < min - 1; i++) {
          members.push({ name: '', phone: '', email: '', college: '' });
        }
        setFormData(prev => ({ ...prev, teamMembers: members, teamMemberCount: String(min) }));
      } else if (match && match.length === 1) {
        const size = parseInt(match[0]);
        if (size > 1) {
          setIsTeamEvent(true);
          setMinTeamSize(size);
          setMaxTeamSize(size);
          const members = [];
          for (let i = 0; i < size - 1; i++) {
          members.push({ name: '', phone: '', email: '', college: '' });
          }
          setFormData(prev => ({ ...prev, teamMembers: members, teamMemberCount: String(size) }));
        }
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
    if (!formData.candidateCollege || !formData.candidateCollege.trim()) newErrors.candidateCollege = 'College name is required';
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
        if (!member.college || !member.college.trim()) {
          newErrors[`member${index}_college`] = `Member ${index + 2} college is required`;
        }
      });
    }

    // Validate transaction ID (12-character alphanumeric UPI reference)
    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    } else if (!/^[a-zA-Z0-9]{12}$/.test(formData.transactionId.trim())) {
      newErrors.transactionId = 'Transaction ID must be exactly 12 characters (letters and digits only)';
    }

    // Validate screenshot uploaded checkbox
    if (!screenshotUploaded) {
      newErrors.screenshotUploaded = 'Please upload your payment screenshot before submitting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Open confirmation modal with rules before final submit
      setShowConfirmModal(true);
    } else {
      const firstError = document.querySelector('.form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const submitRegistration = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const registrationPayload = {
        candidateName: formData.candidateName,
        candidatePhone: formData.candidatePhone,
        candidateEmail: formData.candidateEmail,
        candidateCollege: formData.candidateCollege,
        competitionName: formData.competitionName,
        transactionId: formData.transactionId,
      };

      if (isTeamEvent && formData.teamMembers.length > 0) {
        registrationPayload.teamName = formData.teamName;
        registrationPayload.teamMemberCount = formData.teamMemberCount;
        registrationPayload.teamMembers = formData.teamMembers;
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationPayload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.message || 'Registration failed. Please try again.');
        console.error('Registration error:', data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit registration. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setAgreeChecked(false);
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
          {whatsappGroupLinks[event.title] && (
            <div className="whatsapp-group-section">
              <p className="whatsapp-text">📱 Join the official WhatsApp group for updates:</p>
              <a
                href={whatsappGroupLinks[event.title]}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-join"
              >
                Join WhatsApp Group
              </a>
            </div>
          )}
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
              <label htmlFor="candidateCollege">College Name *</label>
              <input
                type="text"
                id="candidateCollege"
                name="candidateCollege"
                value={formData.candidateCollege}
                onChange={handleInputChange}
                placeholder="Enter your college name"
                className={errors.candidateCollege ? 'error' : ''}
              />
              {errors.candidateCollege && <span className="form-error">{errors.candidateCollege}</span>}
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
              {event.title === 'Ideaverse' && (
                <div className="ideaverse-download">
                  <label>Presentation Template</label>
                  <a href={ideaverseTemplate} download className="btn-download-ppt">Download Ideaverse PPT</a>
                </div>
              )}
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
                  {[...Array(maxTeamSize - minTeamSize + 1)].map((_, i) => {
                    const count = minTeamSize + i;
                    return (
                      <option key={count} value={count}>{count} Member{count > 1 ? 's' : ''}</option>
                    );
                  })}
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
                  <div className="form-group">
                    <label htmlFor={`member${index}College`}>College Name *</label>
                    <input
                      type="text"
                      id={`member${index}College`}
                      value={member.college}
                      onChange={(e) => handleTeamMemberChange(index, 'college', e.target.value)}
                      placeholder="Enter member's college name"
                      className={errors[`member${index}_college`] ? 'error' : ''}
                    />
                    {errors[`member${index}_college`] && <span className="form-error">{errors[`member${index}_college`]}</span>}
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

            {(() => {
              const totalAmount = 100 * (parseInt(formData.teamMemberCount) || 1);
              const qrImage = qrCodeMap[totalAmount];
              return (
                <div className="qr-code-container">
                  {qrImage ? (
                    <div className="qr-code-box">
                      <img src={qrImage} alt={`UPI QR Code for ₹${totalAmount}`} className="qr-code-image" />
                      <p className="qr-amount">Pay ₹{totalAmount}</p>
                    </div>
                  ) : (
                    <div className="qr-code-box">
                      <div className="qr-code-placeholder">
                        <PaymentIcon style={{ fontSize: 80, color: '#666' }} />
                        <p>No QR code available for ₹{totalAmount}</p>
                        <p className="qr-note">Please contact the organizers for payment</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="form-group">
              <label htmlFor="transactionId">Transaction ID / UPI Reference Number *</label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter your transaction ID"
                maxLength="12"
                className={errors.transactionId ? 'error' : ''}
              />
              {errors.transactionId && <span className="form-error">{errors.transactionId}</span>}
              <small className="field-hint">Enter the 12-character UPI transaction ID from your payment app</small>
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

            <div className={`screenshot-checkbox-group ${errors.screenshotUploaded ? 'has-error' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={screenshotUploaded}
                  onChange={(e) => {
                    setScreenshotUploaded(e.target.checked);
                    if (errors.screenshotUploaded) {
                      setErrors(prev => ({ ...prev, screenshotUploaded: '' }));
                    }
                  }}
                />
                <span className="checkbox-text">I have uploaded my payment screenshot</span>
              </label>
              {errors.screenshotUploaded && <span className="form-error">{errors.screenshotUploaded}</span>}
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

        {showConfirmModal && (
          <div className="rf-confirm-overlay">
            <div className="rf-confirm-box" role="dialog" aria-modal="true" aria-labelledby="rfModalTitle">
              <h3 id="rfModalTitle">Please read and agree to the following rules</h3>
              <div className="rf-confirm-content">
                <ul>
                  <li>Arrive 15 minutes before the event start time.</li>
                  <li>Carry a valid college ID during the event.</li>
                  <li>Maintain discipline and respect for all participants.</li>
                  <li>Your belongings are at your own risk.</li>
                  <li>Follow all instructions given by event organizers.</li>
                  <li>Decision of judges is final and binding.</li>
                  <li>Food & Mobile is not allowed in computer labs.</li>
                  <li>Any form of cheating or malpractice will lead to disqualification.</li>
                  <li>Organizers reserve the right to change rules and schedules.</li>
                </ul>
              </div>

              <label className="rf-confirm-checkbox">
                <input type="checkbox" checked={agreeChecked} onChange={(e) => setAgreeChecked(e.target.checked)} />
                <span>I agree to the rules and want to continue</span>
              </label>

              <div className="rf-confirm-actions">
                <button type="button" className="rf-btn-secondary" onClick={() => { setShowConfirmModal(false); setAgreeChecked(false); }} disabled={loading}>Cancel</button>
                <button type="button" className="rf-btn-primary" onClick={submitRegistration} disabled={!agreeChecked || loading}>
                  {loading ? 'Submitting...' : 'Confirm Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;
