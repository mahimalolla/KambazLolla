import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      // Find user in database
      const user = db.users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Success - store user in Redux and navigate
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
      
    } catch (err) {
      setError("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      marginLeft: '240px', // Account for navigation sidebar
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      {/* Sign In Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#4f46e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
          }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/bb/NU_RGB_seal_R.png"
              alt="Northeastern University"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '1rem'
          }}>
            Sign in to your Kambaz account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Test Accounts Info */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0369a1' }}>
            Test Accounts:
          </p>
          <p style={{ margin: '4px 0', color: '#0c4a6e' }}>
            <strong>Faculty:</strong> alice_johnson / password123
          </p>
          <p style={{ margin: '4px 0', color: '#0c4a6e' }}>
            <strong>Student:</strong> bob_smith / password123
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={signin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="wd-username"
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: isLoading ? '#f9fafb' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4f46e5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="wd-password"
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: isLoading ? '#f9fafb' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4f46e5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#374151'
            }}>
              <input type="checkbox" style={{ margin: 0 }} />
              Remember me
            </label>
            <Link
              to="/Kambaz/Account/Profile"
              style={{
                color: '#4f46e5',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            id="wd-signin-btn"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#718096', margin: 0 }}>
            Don't have an account?{' '}
            <Link
              to="/Kambaz/Account/Signup"
              style={{
                color: '#4f46e5',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* Add CSS animation for loading spinner */}
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
