import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaBook, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaFlask
} from "react-icons/fa";
import { LiaBookSolid } from "react-icons/lia";

export default function KambazNavigation() {
  const { pathname } = useLocation();
  

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
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/bb/NU_RGB_seal_R.png"
          alt="Northeastern University"
          style={{ width: '60px', height: '60px', objectFit: 'contain' }}
        />
      </div>

      {/* Account Link */}
      <Link to="/Kambaz/Account" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 15px', color: 'white', textDecoration: 'none',
        borderBottom: '1px solid #333',
        backgroundColor: pathname.includes("Account") ? '#2a2a2a' : 'transparent',
        borderLeft: pathname.includes("Account") ? '4px solid #dc3545' : '4px solid transparent',
        minHeight: '80px', transition: 'all 0.3s ease'
      }}>
        <FaHome style={{ color: '#dc3545', fontSize: '28px', marginBottom: '8px' }} />
        <span style={{ color: 'white', fontSize: '13px', fontWeight: '400' }}>Account</span>
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
        } else {
          active = pathname.includes(link.label);
        }
        
        return (
          <Link key={link.path} to={link.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 15px', color: 'white', textDecoration: 'none',
            borderBottom: '1px solid #333',
            backgroundColor: active ? '#2a2a2a' : 'transparent',
            borderLeft: active ? '4px solid #dc3545' : '4px solid transparent',
            minHeight: '80px', transition: 'all 0.3s ease'
          }}>
            <IconComponent style={{ color: '#dc3545', fontSize: '28px', marginBottom: '8px' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '400' }}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}