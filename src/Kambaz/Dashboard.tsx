import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import * as db from "./Database";

export default function Dashboard() {
  const { state: authState, logout } = useAuth(); 
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
    number: "",
    startDate: "",
    endDate: "",
    department: "CCIS",
    credits: 4
  });
  const [activeSection, setActiveSection] = useState("my-courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load courses and enrollment data
  useEffect(() => {
    if (authState.user) {
      loadUserData();
    }
  }, [authState.user]);

  const loadUserData = () => {
    if (!authState.user) return;
    
    try {
      // Get user's enrolled courses
      const userCourses = db.getCoursesByUser(authState.user._id);
      setCourses(userCourses);
      
      // Get all courses for enrollment
      const allCoursesData = db.courses || [];
      setAllCourses(allCoursesData);
      
      // Filter available courses (not enrolled)
      const available = allCoursesData.filter(course => 
        !userCourses.some(enrolled => enrolled._id === course._id)
      );
      setAvailableCourses(available);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Show signin message if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div style={{ 
        marginLeft: '240px',
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

  // Course management functions (existing)
  const addNewCourse = () => {
    if (!course.name.trim()) {
      setMessage("❌ Please enter a course name");
      setTimeout(() => setMessage(""), 3000);
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
    
    // Refresh data
    loadUserData();
    
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
    
    setMessage("✅ Course created successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateCourse = () => {
    if (!course._id) {
      setMessage("❌ Please select a course to update");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    db.updateCourse(course._id, course);
    loadUserData();
    setMessage("✅ Course updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteCourse = (courseId: string) => {
    db.deleteCourse(courseId);
    loadUserData();
    setMessage("✅ Course deleted successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

const handleEnroll = (courseId: string, courseName: string) => {
  if (!currentUser) return;
  
  if (!window.confirm(`Are you sure you want to enroll in "${courseName}"?`)) {
    return;
  }
  
  try {
    setLoading(true);
    db.enrollUserInCourse(currentUser._id, courseId);
    loadUserData();
    setMessage(`✅ Successfully enrolled in ${courseName}!`);
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Error enrolling:", error);
    setMessage(`❌ Failed to enroll in ${courseName}`);
    setTimeout(() => setMessage(""), 3000);
  } finally {
    setLoading(false);
  }
};

// COMPLETE FIX: Replace your entire handleUnenroll function with this:

const handleUnenroll = (courseId: string, courseName: string) => {
  if (!currentUser) {
    setMessage("❌ User not authenticated");
    setTimeout(() => setMessage(""), 3000);
    return;
  }
  
  if (!window.confirm(`Are you sure you want to drop "${courseName}"?`)) {
    return;
  }
  
  try {
    setLoading(true);
    
    // Check if unenrollUserFromCourse function exists in db
    if (typeof db.unenrollUserFromCourse === 'function') {
      // Use the proper unenroll function
      db.unenrollUserFromCourse(currentUser._id, courseId);
    } else {
      // Fallback: manually filter enrollments if function doesn't exist
      console.warn("unenrollUserFromCourse function not found, attempting manual removal");
      
      // You'll need to access your enrollments array - adjust this based on your Database.ts structure
      // This is a temporary workaround
      const enrollmentIndex = db.enrollments?.findIndex(enrollment => 
        enrollment.user === currentUser._id && enrollment.course === courseId
      );
      
      if (enrollmentIndex !== -1 && enrollmentIndex !== undefined) {
        db.enrollments.splice(enrollmentIndex, 1);
      } else {
        throw new Error("Enrollment not found");
      }
    }
    
    // Reload user data to reflect the changes
    loadUserData();
    
    setMessage(`✅ Successfully dropped ${courseName}!`);
    setTimeout(() => setMessage(""), 3000);
    
  } catch (error) {
    console.error("Error unenrolling:", error);
    setMessage(`❌ Failed to drop ${courseName}: ${error.message || 'Unknown error'}`);
    setTimeout(() => setMessage(""), 3000);
  } finally {
    setLoading(false);
  }
};

  // Filter courses based on search
  const getFilteredCourses = (courseList: any[]) => {
    if (!searchTerm) return courseList;
    
    return courseList.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredMyCourses = getFilteredCourses(courses);
  const filteredAvailableCourses = getFilteredCourses(availableCourses);

  return (
    <div style={{ 
      marginLeft: '240px',
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

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4f46e5' }}>
              {courses.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {isFaculty ? 'Courses Teaching' : 'Enrolled Courses'}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#10b981' }}>
              {availableCourses.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {isFaculty ? 'Total Courses' : 'Available to Enroll'}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#f59e0b' }}>
              {allCourses.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Total System Courses
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            backgroundColor: message.includes('✅') ? '#f0fff4' : '#fef2f2',
            border: `1px solid ${message.includes('✅') ? '#9ae6b4' : '#fca5a5'}`,
            color: message.includes('✅') ? '#2f855a' : '#e53e3e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

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

        {/* Navigation Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setActiveSection("my-courses")}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeSection === "my-courses" ? '#4f46e5' : 'transparent',
                color: activeSection === "my-courses" ? 'white' : '#6b7280',
                borderRadius: activeSection === "my-courses" ? '16px 16px 0 0' : '0',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {isFaculty ? '👨‍🏫 My Courses' : '📚 My Enrollments'} ({courses.length})
            </button>
            
            {isStudent && (
              <button
                onClick={() => setActiveSection("available")}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  backgroundColor: activeSection === "available" ? '#4f46e5' : 'transparent',
                  color: activeSection === "available" ? 'white' : '#6b7280',
                  borderRadius: activeSection === "available" ? '16px 16px 0 0' : '0',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ➕ Available to Enroll ({availableCourses.length})
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <input
              type="text"
              placeholder="🔍 Search courses by name, number, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Course Content Sections */}
        {activeSection === "my-courses" && (
          <div>
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
                {isFaculty ? 'Published Courses' : 'My Enrolled Courses'} ({filteredMyCourses.length})
              </h2>
            </div>

            {/* My Courses Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {filteredMyCourses.map((courseItem: any) => (
                <div key={courseItem._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                  border: isStudent ? '2px solid #48bb78' : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  {isStudent && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#48bb78',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      zIndex: 1
                    }}>
                      ENROLLED
                    </div>
                  )}

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

                  {/* Controls */}
                  <div style={{
                    borderTop: '1px solid #e5e7eb',
                    padding: '16px 20px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    {isFaculty ? (
                      <>
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
                      </>
                    ) : (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          handleUnenroll(courseItem._id, courseItem.name);
                        }}
                        disabled={loading}
                        style={{
                          flex: 1,
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {loading ? 'Processing...' : '❌ Drop Course'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Courses Message */}
            {filteredMyCourses.length === 0 && (
              <div style={{
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '40px'
              }}>
                <h5 style={{ color: '#1e40af', marginBottom: '12px' }}>
                  {searchTerm ? 'No Matching Courses Found' : 'No Courses Found'}
                </h5>
                <p style={{ color: '#1e40af', margin: 0 }}>
                  {searchTerm ? (
                    <>Clear your search or try different keywords.</>
                  ) : (
                    isFaculty 
                      ? "You don't have any courses assigned. Use the form above to create a new course."
                      : "You're not enrolled in any courses yet. Check out the available courses to enroll!"
                  )}
                </p>
                {!searchTerm && isStudent && (
                  <button
                    onClick={() => setActiveSection("available")}
                    style={{
                      marginTop: '16px',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    📚 Browse Available Courses
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Available Courses Section (Students Only) */}
        {activeSection === "available" && isStudent && (
          <div>
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
                Available Courses ({filteredAvailableCourses.length})
              </h2>
            </div>

            {/* Available Courses Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {filteredAvailableCourses.map((courseItem: any) => (
                <div key={courseItem._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease',
                  border: '2px solid #e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      {courseItem.number} • {courseItem.department}
                    </p>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {courseItem.description || 'No description available'}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#718096'
                      }}>
                        Credits: {courseItem.credits || 'N/A'}
                      </span>
                      
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Available
                      </span>
                    </div>

                    <button
                      onClick={() => handleEnroll(courseItem._id, courseItem.name)}
                      disabled={loading}
                      style={{
                        width: '100%',
                        backgroundColor: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      {loading ? 'Processing...' : '➕ Enroll Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Available Courses Message */}
            {filteredAvailableCourses.length === 0 && (
              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #9ae6b4',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '40px'
              }}>
                <h5 style={{ color: '#166534', marginBottom: '12px' }}>
                  {searchTerm ? 'No Matching Available Courses' : 'All Caught Up!'}
                </h5>
                <p style={{ color: '#166534', margin: 0 }}>
                  {searchTerm ? (
                    <>No available courses match your search criteria.</>
                  ) : (
                    <>You're enrolled in all available courses, or there are no new courses to enroll in.</>
                  )}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      marginTop: '16px',
                      backgroundColor: '#166534',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
