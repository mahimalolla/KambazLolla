import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { 
  FaHome, 
  FaBook, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaFlask,
  FaUser,
  FaSignInAlt
} from "react-icons/fa";
import { LiaBookSolid } from "react-icons/lia";

export default function KambazNavigation() {
  const { pathname } = useLocation();
  const { state } = useAuth(); 
  
  const links = [
    { label: "Dashboard", path: "/Kambaz/Dashboard", icon: FaBook },
    { label: "Courses", path: "/Kambaz/Dashboard", icon: LiaBookSolid }, 
    { label: "Calendar", path: "/Kambaz/Calendar", icon: FaCalendarAlt },
    { label: "Inbox", path: "/Kambaz/Inbox", icon: FaClipboardList },
    { label: "Labs", path: "/Labs", icon: FaFlask },
  ];

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '240px',
      height: '100vh',
      backgroundColor: '#000000',
      color: 'white',
      zIndex: 1000,
      padding: 0,
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
      overflowY: 'auto'
    }}>
      {/* NEU Logo */}
      <div style={{
        backgroundColor: '#000000',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #333'
      }}>
        <a 
          href="https://www.northeastern.edu/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-block' }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/NU_RGB_seal_R.png"
            alt="Northeastern University"
            style={{ 
              width: '60px', 
              height: '60px', 
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          />
        </a>
      </div>

      {/* Account Section - Shows different content based on auth state */}
      <Link to="/Kambaz/Account" style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '20px 15px', 
        color: 'white', 
        textDecoration: 'none',
        borderBottom: '1px solid #333',
        backgroundColor: pathname.includes("Account") ? '#2a2a2a' : 'transparent',
        borderLeft: pathname.includes("Account") ? '4px solid #dc3545' : '4px solid transparent',
        minHeight: '80px', 
        transition: 'all 0.3s ease'
      }}>
        {state.isAuthenticated ? (
          <>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#dc3545',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {state.user?.firstName?.charAt(0)}{state.user?.lastName?.charAt(0)}
            </div>
            <span style={{ 
              color: 'white', 
              fontSize: '11px', 
              fontWeight: '400',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {state.user?.firstName}
            </span>
            <span style={{ 
              color: '#999', 
              fontSize: '10px',
              textTransform: 'uppercase'
            }}>
              {state.user?.role}
            </span>
          </>
        ) : (
          <>
            <FaSignInAlt style={{ color: '#dc3545', fontSize: '28px', marginBottom: '8px' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '400' }}>Account</span>
          </>
        )}
      </Link>

      {/* Navigation Links */}
      {links.map((link) => {
        const IconComponent = link.icon;
        
        // Fixed active state logic
        let active = false;
        if (link.label === "Dashboard") {
          active = pathname === "/Kambaz/Dashboard";
        } else if (link.label === "Courses") {
          active = pathname.includes("/Kambaz/Courses");
        } else if (link.label === "Calendar") {
          active = pathname.includes("/Kambaz/Calendar");
        } else if (link.label === "Inbox") {
          active = pathname.includes("/Kambaz/Inbox");
        } else if (link.label === "Labs") {
          active = pathname.includes("/Labs");
        }
        
        return (
          <Link key={link.path} to={link.path} style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '20px 15px', 
            color: 'white', 
            textDecoration: 'none',
            borderBottom: '1px solid #333',
            backgroundColor: active ? '#2a2a2a' : 'transparent',
            borderLeft: active ? '4px solid #dc3545' : '4px solid transparent',
            minHeight: '80px', 
            transition: 'all 0.3s ease'
          }}>
            <IconComponent style={{ 
              color: '#dc3545', 
              fontSize: '28px', 
              marginBottom: '8px' 
            }} />
            <span style={{ 
              color: 'white', 
              fontSize: '13px', 
              fontWeight: '400' 
            }}>
              {link.label}
            </span>
          </Link>
        );
      })}

      {/* Authentication Status Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        padding: '12px',
        backgroundColor: state.isAuthenticated ? '#059669' : '#dc2626',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '10px',
          color: 'white',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {state.isAuthenticated ? '🟢 Signed In' : '🔴 Not Signed In'}
        </div>
      </div>
    </nav>
  );
}
