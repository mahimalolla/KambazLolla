import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FaUser, FaUsers, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function AccountNavigation() {
  const { state } = useAuth();
  const { pathname } = useLocation();
  
  const active = (path: string) => (pathname.includes(path) ? "active" : "");

  return (
    <div style={{
      position: 'fixed',
      left: '240px', // Adjust based on your main sidebar width
      top: '0',
      bottom: '0',
      width: '200px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          Account
        </h3>
        {state.user && (
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            {state.user.firstName} {state.user.lastName}
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '20px 0' }}>
        {!state.isAuthenticated ? (
          // Not signed in - show signin/signup
          <>
            <Link 
              to="/Kambaz/Account/Signin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                textDecoration: 'none',
                color: active("Signin") ? '#4f46e5' : '#374151',
                backgroundColor: active("Signin") ? '#eef2ff' : 'transparent',
                borderRight: active("Signin") ? '3px solid #4f46e5' : '3px solid transparent',
                fontWeight: active("Signin") ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!active("Signin")) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!active("Signin")) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <FaSignInAlt />
              Sign In
            </Link>

            <Link 
              to="/Kambaz/Account/Signup"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                textDecoration: 'none',
                color: active("Signup") ? '#4f46e5' : '#374151',
                backgroundColor: active("Signup") ? '#eef2ff' : 'transparent',
                borderRight: active("Signup") ? '3px solid #4f46e5' : '3px solid transparent',
                fontWeight: active("Signup") ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!active("Signup")) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!active("Signup")) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <FaUserPlus />
              Sign Up
            </Link>
          </>
        ) : (
          // Signed in - show profile and admin features
          <>
            <Link 
              to="/Kambaz/Account/Profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                textDecoration: 'none',
                color: active("Profile") ? '#4f46e5' : '#374151',
                backgroundColor: active("Profile") ? '#eef2ff' : 'transparent',
                borderRight: active("Profile") ? '3px solid #4f46e5' : '3px solid transparent',
                fontWeight: active("Profile") ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!active("Profile")) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!active("Profile")) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <FaUser />
              Profile
            </Link>

            {/* ADMIN ONLY: Users Management Link */}
            {state.user && state.user.role === "ADMIN" && (
              <Link 
                to="/Kambaz/Account/Users"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: active("Users") ? '#dc2626' : '#374151',
                  backgroundColor: active("Users") ? '#fef2f2' : 'transparent',
                  borderRight: active("Users") ? '3px solid #dc2626' : '3px solid transparent',
                  fontWeight: active("Users") ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active("Users")) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active("Users")) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <FaUsers />
                Users
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.7rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  ADMIN
                </span>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Role Badge */}
      {state.user && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }}>
          <div style={{
            padding: '8px 12px',
            backgroundColor: state.user.role === 'ADMIN' ? '#dc2626' : state.user.role === 'FACULTY' ? '#059669' : '#4f46e5',
            color: 'white',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {state.user.role}
          </div>
        </div>
      )}
    </div>
  );
}
