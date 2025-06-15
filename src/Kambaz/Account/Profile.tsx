import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSave, FaSignOutAlt, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../AuthContext";

export default function Profile() {
  const { state, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "", 
    lastName: "",
    email: ""
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!state.isAuthenticated || !state.user) {
      navigate("/Kambaz/Account/Signin");
      return;
    }
    
    // Initialize form data with user data
    setFormData({
      username: state.user.username,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      email: state.user.email
    });
  }, [state.isAuthenticated, state.user, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setUpdateMessage(""); // Clear message when user starts typing
  };

  const handleSave = async () => {
    if (!state.user) return;
    
    setIsUpdating(true);
    const success = await updateProfile(formData);
    
    if (success) {
      setUpdateMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setUpdateMessage(""), 3000);
    } else {
      setUpdateMessage("Failed to update profile. Please try again.");
    }
    setIsUpdating(false);
  };

  const handleCancel = () => {
    if (!state.user) return;
    
    // Reset form data to original values
    setFormData({
      username: state.user.username,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      email: state.user.email
    });
    setIsEditing(false);
    setUpdateMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/Kambaz/Account/Signin");
  };

  if (!state.user) {
    return (
      <div style={{
        marginLeft: '240px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginLeft: '240px',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#4f46e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2.5rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            {formData.firstName} {formData.lastName}
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '1.1rem',
            marginBottom: '8px'
          }}>
            {formData.email}
          </p>
          <div style={{
            display: 'inline-block',
            backgroundColor: state.user.role === 'FACULTY' ? '#10b981' : state.user.role === 'ADMIN' ? '#f59e0b' : '#6366f1',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}>
            {state.user.role}
          </div>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div style={{
            backgroundColor: updateMessage.includes('success') ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${updateMessage.includes('success') ? '#bbf7d0' : '#fecaca'}`,
            color: updateMessage.includes('success') ? '#166534' : '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {updateMessage}
          </div>
        )}

        {/* Profile Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              Profile Settings
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  id="wd-firstname" 
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: !isEditing ? '#f9fafb' : 'white',
                    cursor: !isEditing ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#4f46e5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  id="wd-lastname"
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: !isEditing ? '#f9fafb' : 'white',
                    cursor: !isEditing ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#4f46e5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: !isEditing ? '#f9fafb' : 'white',
                    cursor: !isEditing ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#4f46e5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <FaUser />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="wd-username"
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: !isEditing ? '#f9fafb' : 'white',
                    cursor: !isEditing ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = '#4f46e5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Display (Read-only for security) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                value="••••••••"
                disabled={true}
                className="wd-password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9fafb',
                  cursor: 'not-allowed',
                  color: '#9ca3af'
                }}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '4px',
                margin: '4px 0 0 0'
              }}>
                Password cannot be changed through this interface for security reasons
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    style={{
                      background: isUpdating 
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isUpdating) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isUpdating ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    style={{
                      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isUpdating) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          marginTop: '30px'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '20px'
          }}>
            Account Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ color: '#6b7280', fontWeight: '500' }}>Account Type:</span>
              <span style={{ marginLeft: '8px', color: '#374151' }}>{state.user.role}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontWeight: '500' }}>User ID:</span>
              <span style={{ marginLeft: '8px', color: '#374151' }}>{state.user._id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
