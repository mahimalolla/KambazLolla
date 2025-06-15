import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";

export default function Account() {
  return (
    <div style={{
      marginLeft: '240px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Routes>
        <Route path="/" element={<AccountLanding />} />
        <Route path="Signin" element={<Signin />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function AccountLanding() {
  const { state } = useAuth();

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        paddingTop: '60px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#212529',
          marginBottom: '15px'
        }}>
          Account Management
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6c757d'
        }}>
          {state.isAuthenticated 
            ? `Welcome back, ${state.user?.firstName}!` 
            : 'Manage your Kambaz account'
          }
        </p>
      </div>

      {/* Authentication Status */}
      {state.isAuthenticated && (
        <div style={{
          backgroundColor: '#d1edff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#0369a1',
            fontWeight: '500' 
          }}>
            ✅ You are currently signed in as {state.user?.username} ({state.user?.role})
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {!state.isAuthenticated ? (
          <>
            <Link
              to="/Kambaz/Account/Signin"
              style={{
                textDecoration: 'none',
                color: '#0d6efd',
                fontSize: '1.2rem',
                fontWeight: '500',
                padding: '12px 24px',
                border: '2px solid #0d6efd',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#0d6efd';
                target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
                target.style.color = '#0d6efd';
              }}
            >
              Sign In
            </Link>

            <Link
              to="/Kambaz/Account/Signup"
              style={{
                textDecoration: 'none',
                color: '#28a745',
                fontSize: '1.2rem',
                fontWeight: '500',
                padding: '12px 24px',
                border: '2px solid #28a745',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#28a745';
                target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
                target.style.color = '#28a745';
              }}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/Kambaz/Account/Profile"
              style={{
                textDecoration: 'none',
                color: '#6c757d',
                fontSize: '1.2rem',
                fontWeight: '500',
                padding: '12px 24px',
                border: '2px solid #6c757d',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#6c757d';
                target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
                target.style.color = '#6c757d';
              }}
            >
              Manage Profile
            </Link>

            <Link
              to="/Kambaz/Dashboard"
              style={{
                textDecoration: 'none',
                color: '#0d6efd',
                fontSize: '1.2rem',
                fontWeight: '500',
                padding: '12px 24px',
                border: '2px solid #0d6efd',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#0d6efd';
                target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
                target.style.color = '#0d6efd';
              }}
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>

      {/* Content area */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#212529', marginBottom: '15px' }}>
          {state.isAuthenticated ? 'Account Features' : 'Welcome to Kambaz'}
        </h3>
        <p style={{ color: '#6c757d', fontSize: '1rem' }}>
          {state.isAuthenticated 
            ? 'Your account is active. You can manage your profile, view courses, and access all features.'
            : 'Select an option above to sign in, create a new account, or manage your profile.'
          }
        </p>
        
        {state.isAuthenticated && (
          <div style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            textAlign: 'left'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#495057', marginBottom: '10px' }}>Profile</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
                Update your personal information and settings
              </p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#495057', marginBottom: '10px' }}>Security</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
                Session management and account security
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
