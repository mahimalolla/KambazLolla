import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const courses = [
    {
      title: "CS5610 Web Development",
      subtitle: "Full Stack Web Development using MERN stack",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/4f46e5/ffffff?text=Web+Dev",
      color: "#4f46e5"
    },
    {
      title: "CS1234 React JS",
      subtitle: "Modern React development with hooks and context",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/0d6efd/ffffff?text=React+JS",
      color: "#0d6efd"
    },
    {
      title: "CS2345 Node.js",
      subtitle: "Server-side JavaScript and API development",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/198754/ffffff?text=Node.js",
      color: "#198754"
    },
    {
      title: "CS3456 MongoDB",
      subtitle: "NoSQL Database design and implementation",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/f39c12/ffffff?text=MongoDB",
      color: "#f39c12"
    },
    {
      title: "CS3200 Database Design",
      subtitle: "Relational database design and SQL",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/6f42c1/ffffff?text=Database",
      color: "#6f42c1"
    },
    {
      title: "CS5800 Algorithms",
      subtitle: "Advanced algorithms and data structures",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/dc3545/ffffff?text=Algorithms",
      color: "#dc3545"
    },
    {
      title: "CS6140 Machine Learning",
      subtitle: "Introduction to machine learning concepts",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/20c997/ffffff?text=ML",
      color: "#20c997"
    },
    {
      title: "CS5500 Software Engineering",
      subtitle: "Software development lifecycle and methodologies",
      route: "/Kambaz/Home",
      image: "https://via.placeholder.com/300x160/fd7e14/ffffff?text=Software+Eng",
      color: "#fd7e14"
    }
  ];

  // Rest of your component stays the same...
  return (
    <div style={{ padding: '30px 40px', backgroundColor: '#ffffff' }}>
      {/* Dashboard Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 
          id="wd-dashboard-title" 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: '600', 
            color: '#2d3748',
            marginBottom: '10px'
          }}
        >
          Dashboard
        </h1>
        <hr style={{ border: '1px solid #e2e8f0', marginBottom: '25px' }} />
        
        <h2 
          id="wd-dashboard-published" 
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: '500', 
            color: '#4a5568',
            marginBottom: '15px'
          }}
        >
          Published Courses ({courses.length})
        </h2>
        <hr style={{ border: '1px solid #e2e8f0', marginBottom: '30px' }} />
      </div>

      {/* Course Cards Grid */}
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '25px',
          marginBottom: '40px'
        }}
      >
        {courses.map((course, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <Card 
              style={{ 
                height: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              className="course-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              {/* Course Image */}
              <div 
                style={{
                  height: '160px',
                  background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {course.title.split(' ')[0]} {/* Show course code */}
              </div>
              
              <Card.Body style={{ padding: '20px' }}>
                <Card.Title 
                  style={{ 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}
                >
                  {course.title}
                </Card.Title>
                
                <Card.Text 
                  style={{ 
                    fontSize: '0.9rem',
                    color: '#718096',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                    height: '45px',
                    overflow: 'hidden'
                  }}
                >
                  {course.subtitle}
                </Card.Text>
                
                <Link 
                  to={course.route} 
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338ca';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4f46e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Go
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}