import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaBook, 
  FaComments, 
  FaVideo, 
  FaClipboardList, 
  FaQuestionCircle, 
  FaGraduationCap, 
  FaFlask
} from "react-icons/fa";

export default function KambazNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.includes(path.split('/').pop() || '');
  };

  const links = [
    { name: "Home", path: "/Kambaz/Account", icon: FaHome },
    { name: "Modules", path: "/Kambaz/Dashboard", icon: FaBook },
    { name: "Piazza", path: "/Kambaz/Piazza", icon: FaComments },
    { name: "Zoom", path: "/Kambaz/Zoom", icon: FaVideo },
    { name: "Assignments", path: "/Kambaz/Assignments", icon: FaClipboardList },
    { name: "Quizzes", path: "/Kambaz/Quizzes", icon: FaQuestionCircle },
    { name: "Grades", path: "/Kambaz/Grades", icon: FaGraduationCap },
    { name: "Labs", path: "/Labs", icon: FaFlask },
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
      {/* NEU Logo Section */}
      <div style={{
        backgroundColor: '#000000',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #333'
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

      {/* Navigation Links */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {links.map((link) => {
          const IconComponent = link.icon;
          const active = isActive(link.path);
          
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 15px',
                color: 'white',
                textDecoration: 'none',
                borderBottom: '1px solid #333',
                backgroundColor: active ? '#2a2a2a' : 'transparent',
                borderLeft: active ? '4px solid #dc3545' : '4px solid transparent',
                minHeight: '80px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#1a1a1a';
                }
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.style.color = '#ff4757';
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.style.color = '#dc3545';
              }}
            >
              <IconComponent 
                style={{
                  color: '#dc3545',
                  fontSize: '28px',
                  marginBottom: '8px',
                  width: '28px',
                  height: '28px'
                }}
              />
              <span style={{
                color: 'white',
                fontSize: '13px',
                fontWeight: '400',
                textAlign: 'center',
                marginTop: '5px'
              }}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}