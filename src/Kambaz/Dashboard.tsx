import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import courseClient from "./Courses/client";

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
    department: "CS",
    credits: 4
  });
  const [activeSection, setActiveSection] = useState("my-courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Debug logging
  console.log('Dashboard - Auth State:', authState);
  console.log('Dashboard - User:', authState?.user);
  console.log('Dashboard - Is Authenticated:', authState?.isAuthenticated);

  // Helper function to filter out null/invalid courses
  const filterValidCourses = (courseArray: any[]) => {
    if (!Array.isArray(courseArray)) {
      console.warn('Invalid course array:', courseArray);
      return [];
    }
    
    const validCourses = courseArray.filter(course => {
      if (!course) {
        console.warn('Found null/undefined course in array');
        return false;
      }
      if (!course._id) {
        console.warn('Found course without _id:', course);
        return false;
      }
      return true;
    });
    
    console.log(`Filtered ${courseArray.length} courses down to ${validCourses.length} valid courses`);
    return validCourses;
  };

  // Load courses and enrollment data
  useEffect(() => {
    if (authState.user) {
      loadUserData();
    }
  }, [authState.user]);

  // Load user data using MongoDB API
 const loadUserData = async () => {
  if (!authState.user) return;
  
  try {
    setLoading(true);
    console.log('Loading user data from MongoDB...', authState.user._id);
    
    // Get all courses from MongoDB
    const allCoursesData = await courseClient.findAllCourses();
    console.log('All courses loaded:', allCoursesData);
    
    // Filter out any invalid courses from all courses
    const validAllCourses = filterValidCourses(allCoursesData);
    setAllCourses(validAllCourses);
    
    // Get user's enrolled courses from MongoDB
    console.log('Loading courses for user:', authState.user._id, 'Role:', authState.user.role);
    const userCourses = await courseClient.findMyCourses();
    console.log('Raw user enrolled courses:', userCourses); // ✅ FIXED: was userCoursesRaw
    
    // Filter out any null/invalid courses from user's enrolled courses
    const validUserCourses = filterValidCourses(userCourses); // ✅ FIXED: was userCoursesRaw
    console.log('Valid user enrolled courses:', validUserCourses);
    setCourses(validUserCourses);
    
    // Filter available courses (not enrolled) - only from valid courses
    const available = validAllCourses.filter(course => {
      if (!course || !course._id) return false;
      return !validUserCourses.some(enrolled => {
        if (!enrolled || !enrolled._id) return false;
        return enrolled._id === course._id;
      });
    });
    console.log('Available courses:', available);
    setAvailableCourses(available);
    
    setMessage("");
    
  } catch (error: any) {
    console.error("Error loading user data:", error);
    setMessage(`❌ Error loading course data: ${error.message}`);
    setTimeout(() => setMessage(""), 5000);
    
    // Reset to empty arrays on error
    setCourses([]);
    setAllCourses([]);
    setAvailableCourses([]);
  } finally {
    setLoading(false);
  }
};
      console.log('Available courses:', available);
      setAvailableCourses(available);
      
      setMessage("");
      
    } catch (error: any) {
      console.error("Error loading user data:", error);
      setMessage(`❌ Error loading course data: ${error.message}`);
      setTimeout(() => setMessage(""), 5000);
      
      // Reset to empty arrays on error
      setCourses([]);
      setAllCourses([]);
      setAvailableCourses([]);
    } finally {
      setLoading(false);
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
  const isFaculty = currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
  const isStudent = currentUser.role === "STUDENT";

  // Course creation using MongoDB API
  const addNewCourse = async () => {
    if (!course.name.trim()) {
      setMessage("❌ Please enter a course name");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      
      const newCourseData = {
        name: course.name,
        description: course.description,
        number: course.number || `CS${Math.floor(Math.random() * 9000) + 1000}`,
        credits: course.credits,
        department: course.department,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
      };
      
      // Create course using MongoDB API
      const newCourse = await courseClient.createCourse(newCourseData);
      console.log('Course created:', newCourse);
      
      // Refresh data from server
      await loadUserData();
      
      // Reset form
      setCourse({
        name: "",
        description: "",
        number: "",
        startDate: "",
        endDate: "",
        department: "CS",
        credits: 4
      });
      
      setMessage("✅ Course created successfully!");
      setTimeout(() => setMessage(""), 3000);
      
    } catch (error: any) {
      console.error('Error creating course:', error);
      setMessage(`❌ Failed to create course: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Course update using MongoDB API
  const updateCourse = async () => {
    if (!course._id) {
      setMessage("❌ Please select a course to update");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      await courseClient.updateCourse(course._id, course);
      await loadUserData();
      setMessage("✅ Course updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error('Error updating course:', error);
      setMessage(`❌ Failed to update course: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Course deletion using MongoDB API
  const deleteCourse = async (courseId: string) => {
    if (!courseId) {
      setMessage("❌ Invalid course ID");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      await courseClient.deleteCourse(courseId);
      await loadUserData();
      setMessage("✅ Course deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error('Error deleting course:', error);
      setMessage(`❌ Failed to delete course: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Enrollment using MongoDB API
  const handleEnroll = async (courseId: string, courseName: string) => {
    if (!currentUser || !courseId) {
      setMessage("❌ Invalid user or course");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (!window.confirm(`Are you sure you want to enroll in "${courseName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await courseClient.enrollInCourse(currentUser._id, courseId);
      await loadUserData(); // Reload data from MongoDB
      setMessage(`✅ Successfully enrolled in ${courseName}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Error enrolling:", error);
      setMessage(`❌ Failed to enroll in ${courseName}: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Unenrollment using MongoDB API
  const handleUnenroll = async (courseId: string, courseName: string) => {
    if (!currentUser || !courseId) {
      setMessage("❌ Invalid user or course");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    
    if (!window.confirm(`Are you sure you want to drop "${courseName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await courseClient.unenrollFromCourse(currentUser._id, courseId);
      await loadUserData(); // Reload data from MongoDB
      setMessage(`✅ Successfully dropped ${courseName}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Error unenrolling:", error);
      setMessage(`❌ Failed to drop ${courseName}: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search
  const getFilteredCourses = (courseList: any[]) => {
    if (!Array.isArray(courseList)) return [];
    if (!searchTerm) return courseList;
    
    return courseList.filter(course => {
      if (!course) return false;
      return (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (course.number && course.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    });
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
              Welcome back, {currentUser.firstName || currentUser.username}!
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

        {/* Debug Info */}
        <div style={{
          backgroundColor: '#f0f8ff',
          border: '1px solid #b3d7ff',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          <strong>MongoDB Integration Status:</strong> User: {currentUser.username} ({currentUser._id}) | 
          Role: {currentUser.role} | Enrolled: {courses.length} courses | Available: {availableCourses.length} courses |
          Total System: {allCourses.length} courses
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
              {isFaculty ? 'Other Courses' : 'Available to Enroll'}
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

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #f59e0b',
            color: '#92400e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            🔄 Loading...
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
                  disabled={loading || !course._id}
                  style={{
                    background: course._id ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: (loading || !course._id) ? 'not-allowed' : 'pointer',
                    opacity: (loading || !course._id) ? 0.6 : 1
                  }}
                >
                  {loading ? 'Updating...' : 'Update Course'}
                </button>
                <button 
                  onClick={addNewCourse}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Creating...' : 'Add Course'}
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
                disabled={loading}
                style={{
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <input 
                type="text"
                value={course.number} 
                onChange={(e) => setCourse({...course, number: e.target.value})}
                placeholder="Course Number (e.g., CS5610)"
                disabled={loading}
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
                disabled={loading}
                style={{
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                  gridColumn: '1 / -1'
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
              {isFaculty ? '📊 All Courses' : '➕ Available to Enroll'} ({availableCourses.length})
            </button>
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
                {isFaculty ? 'My Courses' : 'My Enrolled Courses'} ({filteredMyCourses.length})
              </h2>
            </div>

            {/* My Courses Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {filteredMyCourses.map((courseItem: any) => {
                // Additional safety check
                if (!courseItem || !courseItem._id) {
                  console.warn('Skipping invalid course item:', courseItem);
                  return null;
                }
                
                return (
                  <div key={courseItem._id} style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer',
                    border: isStudent ? '2px solid #48bb78' : '2px solid transparent',
                    position: 'relative'
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
                          {courseItem.name || 'Unnamed Course'}
                        </h5>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          {courseItem.number || 'No Number'} • {courseItem.credits || 4} credits
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
                            Enter Course
                          </span>
                          
                          <small style={{ color: '#9ca3af' }}>
                            {isFaculty ? "👨‍🏫" : "👨‍🎓"}
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
                            disabled={loading}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={(event) => {
                              event.preventDefault();
                              if (window.confirm(`Delete course "${courseItem.name}"?`)) {
                                deleteCourse(courseItem._id);
                              }
                            }}
                            disabled={loading}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
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
                );
              })}
            </div>

            {/* No Courses Message */}
            {filteredMyCourses.length === 0 && !loading && (
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

        {/* Available Courses Section */}
        {activeSection === "available" && (
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
                {isFaculty ? 'All System Courses' : 'Available Courses'} ({filteredAvailableCourses.length})
              </h2>
            </div>

            {/* Available Courses Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {filteredAvailableCourses.map((courseItem: any) => {
                // Additional safety check
                if (!courseItem || !courseItem._id) {
                  console.warn('Skipping invalid course item:', courseItem);
                  return null;
                }
                
                return (
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
                        {courseItem.name || 'Unnamed Course'}
                      </h5>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        {courseItem.number || 'No Number'} • {courseItem.credits || 4} credits
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
                          Department: {courseItem.department || 'N/A'}
                        </span>
                        
                        <span style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {isFaculty ? 'View Only' : 'Available'}
                        </span>
                      </div>

                      {!isFaculty && (
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
                      )}

                      {isFaculty && (
                        <button
                          onClick={() => setCourse(courseItem)}
                          disabled={loading}
                          style={{
                            width: '100%',
                            backgroundColor: '#f59e0b',
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
                          ✏️ Edit Course
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Available Courses Message */}
            {filteredAvailableCourses.length === 0 && !loading && (
              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #9ae6b4',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '40px'
              }}>
                <h5 style={{ color: '#166534', marginBottom: '12px' }}>
                  {searchTerm ? 'No Matching Available Courses' : (isFaculty ? 'No Other Courses' : 'All Caught Up!')}
                </h5>
                <p style={{ color: '#166534', margin: 0 }}>
                  {searchTerm ? (
                    <>No available courses match your search criteria.</>
                  ) : (
                    isFaculty ? 
                      <>You've created or are assigned to all available courses.</> :
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
