// src/Kambaz/Courses/Navigation.tsx
import { Link, useLocation, useParams } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams();
  const { pathname } = useLocation();
  
  const links = [
    { name: "Home", icon: "🏠" },
    { name: "Modules", icon: "📚" },
    { name: "Piazza", icon: "💬" },
    { name: "Zoom", icon: "📹" },
    { name: "Assignments", icon: "📝" },
    { name: "Quizzes", icon: "❓" },
    { name: "Grades", icon: "📊" },
    { name: "People", icon: "👥" }
  ];
  
  return (
    <nav style={{ padding: '0' }}>
      {links.map((link) => {
        const isActive = pathname.includes(link.name);
        return (
          <Link
            key={link.name}
            to={`/Kambaz/Courses/${cid}/${link.name}`}
            style={{
              display: 'block',
              padding: '12px 20px',
              textDecoration: 'none',
              color: isActive ? '#dc3545' : '#495057',
              backgroundColor: isActive ? '#fff5f5' : 'transparent',
              borderLeft: isActive ? '3px solid #dc3545' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '8px' }}>{link.icon}</span>
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}