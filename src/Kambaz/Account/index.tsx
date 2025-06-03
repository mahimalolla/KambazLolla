// src/Kambaz/Account/index.tsx
import { Link, Routes, Route, Navigate } from "react-router-dom";
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
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: '50px',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#212529',
            marginBottom: '15px'
          }}>
            Account Center
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#6c757d',
            margin: 0
          }}>
            Choose an option to manage your Kambaz account
          </p>
        </div>

        {/* Account Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px'
        }}>
          {/* Sign In Card */}
          <Link
            to="/Kambaz/Account/Signin"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #e9ecef',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 12px 40px rgba(13, 110, 253, 0.15)';
              target.style.borderColor = '#0d6efd';
              target.style.backgroundColor = '#e7f1ff';
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
              target.style.borderColor = '#e9ecef';
              target.style.backgroundColor = '#f8f9fa';
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>
                🔐
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '10px'
              }}>
                Sign In
              </h3>
              <p style={{
                color: '#6c757d',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Access your existing Kambaz account
              </p>
            </div>
          </Link>

          {/* Sign Up Card */}
          <Link
            to="/Kambaz/Account/Signup"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #e9ecef',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 12px 40px rgba(40, 167, 69, 0.15)';
              target.style.borderColor = '#28a745';
              target.style.backgroundColor = '#e8f5e8';
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
              target.style.borderColor = '#e9ecef';
              target.style.backgroundColor = '#f8f9fa';
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>
                ✨
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '10px'
              }}>
                Sign Up
              </h3>
              <p style={{
                color: '#6c757d',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Create a new Kambaz account
              </p>
            </div>
          </Link>

          {/* Profile Card */}
          <Link
            to="/Kambaz/Account/Profile"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #e9ecef',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 12px 40px rgba(255, 193, 7, 0.15)';
              target.style.borderColor = '#ffc107';
              target.style.backgroundColor = '#fff8e1';
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
              target.style.borderColor = '#e9ecef';
              target.style.backgroundColor = '#f8f9fa';
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>
                👤
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '10px'
              }}>
                Profile
              </h3>
              <p style={{
                color: '#6c757d',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Manage your account settings
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          paddingTop: '30px',
          borderTop: '1px solid #e9ecef'
        }}>
          <p style={{
            color: '#6c757d',
            fontSize: '0.9rem',
            margin: 0
          }}>
            Need help? Contact <strong>support@kambaz.edu</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
