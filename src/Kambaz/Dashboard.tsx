import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as db from "./Database"; // Import the database

export default function Dashboard() {
  const courses = db.courses; // Use database courses instead of hardcoded

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
        {courses.map((course) => (
          <div key={course._id} style={{ position: 'relative' }}>
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
            >
              {/* Course Image */}
              <div 
                style={{
                  height: '160px',
                  background: `linear-gradient(135deg, #4f46e5, #4f46e5dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {course.number}
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
                  {course.name}
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
                  {course.description}
                </Card.Text>
                
                <Link 
                  to={`/Kambaz/Courses/${course._id}/Home`} // Dynamic route with course ID
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