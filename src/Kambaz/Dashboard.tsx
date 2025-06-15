import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext"; 
import * as db from "../Database";

export default function Dashboard() {
  const { state: authState, logout } = useAuth(); // Get auth state
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
    number: "",
    startDate: "",
    endDate: "",
    department: "CCIS",
    credits: 4
  });

  // Load courses on component mount
  useEffect(() => {
    if (authState.user) {
      const userCourses = db.getCoursesByUser(authState.user._id);
      setCourses(userCourses);
    }
  }, [authState.user]);

  // Show signin message if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div style={{ 
        marginLeft: '240px', // Fixed margin
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#dc2626', marginBottom: '16px' }}>Authentication Required</h4>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Please sign in to view your dashboard.
          </p>
          <Link 
            to="/Kambaz/Account/Signin"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = authState.user;
  const isFaculty = currentUser.role === "FACULTY";
  const isStudent = currentUser.role === "STUDENT";

  // Add new course function
  const addNewCourse = () => {
    if (!course.name.trim()) {
      alert("Please enter a course name");
      return;
    }
    
    const newCourse = db.createCourse({
      name: course.name,
      description: course.description,
      number: course.number || `CS${Math.floor(Math.random() * 9000) + 1000}`,
      startDate: course.startDate || new Date().toISOString().split('T')[0],
      endDate: course.endDate || new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      department: course.department,
      credits: course.credits,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
    });
    
    // Add enrollment for faculty who creates the course
    db.enrollUserInCourse(currentUser._id, newCourse._id);
    
    // Refresh courses list
    const userCourses = db.getCoursesByUser(currentUser._id);
    setCourses(userCourses);
    
    // Reset form
    setCourse({
      name: "",
      description: "",
      number: "",
      startDate: "",
      endDate: "",
      department: "CCIS",
      credits: 4
    });
  };

  // Update course function
  const updateCourse = () => {
    if (!course._id) {
      alert("Please select a course to update");
      return;
    }
    
    db.updateCourse(course._id, course);
    
    // Refresh courses list
    const userCourses = db.getCoursesByUser(currentUser._id);
    setCourses(userCourses);
    
    alert("Course updated successfully!");
  };

  // Delete course function
  const deleteCourse = (courseId: string) => {
    db.deleteCourse(courseId);
    
    // Refresh courses list
    const userCourses = db.getCoursesByUser(currentUser._id);
    setCourses(userCourses);
  };

  return (
    <div style={{ 
      marginLeft: '240px', // Fixed margin to match navigation
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              Dashboard
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '1.1rem',
              margin: 0
            }}>
              Welcome back, {currentUser.firstName}!
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              backgroundColor: isFaculty ? '#10b981' : '#6366f1',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {isFaculty ? '👨‍🏫 Faculty' : '👨‍🎓 Student'}
            </div>
            
            <Link
              to="/Kambaz/Account/Profile"
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Profile
            </Link>
            
            <button
              onClick={logout}
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* FACULTY-ONLY: Course Creation Section */}
        {isFaculty && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h5 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#10b981',
                margin: 0
              }}>
                👨‍🏫 Faculty Controls
              </h5>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={updateCourse}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Update Course
                </button>
                <button 
                  onClick={addNewCourse}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Course
                </button>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <input 
                type="text"
                value={course.name} 
                onChange={(e) => setCourse({...course, name: e.target.value})}
                placeholder="Course Name"
                style={{
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <textarea 
                value={course.description}
                onChange={(e) => setCourse({...course, description: e.target.value})}
                placeholder="Course Description"
                rows={3}
                style={{
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        )}

        {/* STUDENT-ONLY: Welcome Message */}
        {isStudent && (
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '30px'
          }}>
            <h5 style={{ color: '#1e40af', margin: '0 0 8px 0' }}>
              👨‍🎓 Welcome, {currentUser.firstName}!
            </h5>
            <p style={{ color: '#1e40af', margin: 0 }}>
              You're viewing your enrolled courses. Contact your instructor to make changes.
            </p>
          </div>
        )}

        {/* Courses Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a202c',
            margin: 0
          }}>
            Published Courses ({courses.length})
          </h2>
        </div>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {courses.map((courseItem: any) => (
            <div key={courseItem._id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <Link 
                to={`/Kambaz/Courses/${courseItem._id}/Home`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img 
                  src={courseItem.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"} 
                  style={{ 
                    width: '100%',
                    height: '160px', 
                    objectFit: 'cover' 
                  }}
                  alt={courseItem.name}
                />
                <div style={{ padding: '20px' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '8px'
                  }}>
                    {courseItem.name}
                  </h5>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {courseItem.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      Go
                    </span>
                    
                    <small style={{ color: '#9ca3af' }}>
                      {isFaculty ? "👨‍🏫 Faculty" : "👨‍🎓 Student"}
                    </small>
                  </div>
                </div>
              </Link>

              {/* FACULTY-ONLY: Edit Controls */}
              {isFaculty && (
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button 
                    onClick={(event) => {
                      event.preventDefault();
                      setCourse(courseItem);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={(event) => {
                      event.preventDefault();
                      if (window.confirm(`Delete course "${courseItem.name}"?`)) {
                        deleteCourse(courseItem._id);
                      }
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Courses Message */}
        {courses.length === 0 && (
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <h5 style={{ color: '#1e40af', marginBottom: '12px' }}>
              No Courses Found
            </h5>
            <p style={{ color: '#1e40af', margin: 0 }}>
              {isFaculty 
                ? "You don't have any courses assigned. Use the form above to create a new course."
                : "You're not enrolled in any courses. Contact your administrator for enrollment."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
