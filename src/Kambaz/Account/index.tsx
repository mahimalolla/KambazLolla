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
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Simple Header */}
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
          Account
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6c757d'
        }}>
          Manage your Kambaz account
        </p>
      </div>

      {/* Simple Navigation Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '40px'
      }}>
        <Link
          to="/Kambaz/Account/Signin"
          style={{
            textDecoration: 'none',
            color: '#0d6efd',
            fontSize: '1.2rem',
            fontWeight: '500',
            padding: '10px 20px',
            border: '2px solid #0d6efd',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
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
          Signin
        </Link>

        <Link
          to="/Kambaz/Account/Signup"
          style={{
            textDecoration: 'none',
            color: '#28a745',
            fontSize: '1.2rem',
            fontWeight: '500',
            padding: '10px 20px',
            border: '2px solid #28a745',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
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
          Signup
        </Link>

        <Link
          to="/Kambaz/Account/Profile"
          style={{
            textDecoration: 'none',
            color: '#6c757d',
            fontSize: '1.2rem',
            fontWeight: '500',
            padding: '10px 20px',
            border: '2px solid #6c757d',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
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
          Profile
        </Link>
      </div>

      {/* Simple content area */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#212529', marginBottom: '15px' }}>
          Welcome to Kambaz
        </h3>
        <p style={{ color: '#6c757d', fontSize: '1rem' }}>
          Select an option above to sign in, create a new account, or manage your profile.
        </p>
      </div>
    </div>
  );
}
