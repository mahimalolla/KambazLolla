import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import * as db from "./Database";

export default function EnhancedEnrollments() {
  const { state } = useAuth();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Mock enrollment data structure
  const fetchEnrollmentData = () => {
    try {
      setLoading(true);
      
      // Get all courses from database
      const courses = db.courses || [];
      setAllCourses(courses);
      
      // Get user's enrolled courses
      if (state.user) {
        const userEnrolledCourses = db.getCoursesByUser(state.user._id) || [];
        setEnrolledCourses(userEnrolledCourses);
        
        // Create enrollment records with additional metadata
        const enrollmentRecords = userEnrolledCourses.map((course: any) => ({
          id: `enroll_${course._id}_${state.user._id}`,
          courseId: course._id,
          courseName: course.name,
          courseNumber: course.number,
          userId: state.user._id,
          userName: `${state.user.firstName} ${state.user.lastName}`,
          userRole: state.user.role,
          enrollmentDate: new Date().toISOString().split('T')[0],
          status: "active",
          grade: null,
          completedAssignments: 0,
          totalAssignments: 5,
          lastAccessed: new Date().toISOString().split('T')[0]
        }));
        
        setEnrollments(enrollmentRecords);
      }
    } catch (error) {
      console.error("Error fetching enrollment data:", error);
      setMessage("Error loading enrollment data");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string, courseName: string) => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      
      // Use existing database function
      db.enrollUserInCourse(state.user._id, courseId);
      
      setMessage(`✅ Successfully enrolled in ${courseName}!`);
      fetchEnrollmentData(); // Refresh data
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error enrolling:", error);
      setMessage("❌ Failed to enroll in course");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId: string, courseName: string) => {
    if (!state.user) return;
    
    if (!window.confirm(`Are you sure you want to drop ${courseName}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Remove enrollment (you'll need to implement this in your database)
      // For now, we'll simulate it
      setMessage(`✅ Successfully dropped ${courseName}!`);
      fetchEnrollmentData(); // Refresh data
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error unenrolling:", error);
      setMessage("❌ Failed to drop course");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((course: any) => course._id === courseId);
  };

  const getAvailableCourses = () => {
    return allCourses.filter(course => !isEnrolled(course._id));
  };

  const getFilteredCourses = (courses: any[]) => {
    let filtered = courses;
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterDepartment !== "all") {
      filtered = filtered.filter(course => 
        course.department === filterDepartment
      );
    }
    
    return filtered;
  };

  const getDepartments = () => {
    const departments = new Set(allCourses.map(course => course.department).filter(Boolean));
    return Array.from(departments);
  };

  useEffect(() => {
    if (state.user) {
      fetchEnrollmentData();
    }
  }, [state.user]);

  if (!state.isAuthenticated) {
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
            Please sign in to manage your course enrollments.
          </p>
        </div>
      </div>
    );
  }

  const availableCourses = getFilteredCourses(getAvailableCourses());
  const myEnrolledCourses = getFilteredCourses(enrolledCourses);

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
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            📚 Course Enrollments
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Manage your course enrollments and track your academic progress.
          </p>
          
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af' }}>
                {enrolledCourses.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
                Enrolled Courses
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#dcfce7',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534' }}>
                {availableCourses.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#166534' }}>
                Available Courses
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400e' }}>
                {enrollments.reduce((acc, enr) => acc + enr.completedAssignments, 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#92400e' }}>
                Completed Assignments
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
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

        {/* Search and Filter */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '16px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="🔍 Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                width: '100%'
              }}
            />
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                minWidth: '150px'
              }}
            >
              <option value="all">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDepartment("all");
              }}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tabs */}
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
              onClick={() => setActiveTab("available")}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === "available" ? '#4f46e5' : 'transparent',
                color: activeTab === "available" ? 'white' : '#6b7280',
                borderRadius: activeTab === "available" ? '16px 16px 0 0' : '0',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📋 Available Courses ({availableCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("enrolled")}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === "enrolled" ? '#4f46e5' : 'transparent',
                color: activeTab === "enrolled" ? 'white' : '#6b7280',
                borderRadius: activeTab === "enrolled" ? '16px 16px 0 0' : '0',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✅ My Enrollments ({myEnrolledCourses.length})
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6b7280' }}>Loading courses...</p>
              </div>
            )}

            {/* Available Courses Tab */}
            {activeTab === "available" && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {availableCourses.map((course: any) => (
                  <div key={course._id} style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ marginBottom: '15px' }}>
                      <h3 style={{
                        margin: '0 0 8px 0',
                        color: '#2d3748',
                        fontSize: '1.25rem',
                        fontWeight: '600'
                      }}>
                        {course.name}
                      </h3>
                      <p style={{
                        margin: '0 0 8px 0',
                        color: '#4a5568',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {course.number} • {course.department}
                      </p>
                      <p style={{
                        margin: '0',
                        color: '#718096',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        {course.description || 'No description available'}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => handleEnroll(course._id, course.name)}
                        disabled={loading}
                        style={{
                          backgroundColor: '#4299e1',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {loading ? 'Processing...' : '➕ Enroll Now'}
                      </button>

                      <span style={{
                        fontSize: '0.8rem',
                        color: '#718096'
                      }}>
                        Credits: {course.credits || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}

                {availableCourses.length === 0 && !loading && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    color: '#718096'
                  }}>
                    <p>No available courses found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Enrolled Courses Tab */}
            {activeTab === "enrolled" && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {myEnrolledCourses.map((course: any) => {
                  const enrollment = enrollments.find(e => e.courseId === course._id);
                  
                  return (
                    <div key={course._id} style={{
                      border: '2px solid #48bb78',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#f0fff4',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#48bb78',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        ENROLLED
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <h3 style={{
                          margin: '0 0 8px 0',
                          color: '#2d3748',
                          fontSize: '1.25rem',
                          fontWeight: '600'
                        }}>
                          {course.name}
                        </h3>
                        <p style={{
                          margin: '0 0 8px 0',
                          color: '#4a5568',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {course.number} • {course.department}
                        </p>
                        <p style={{
                          margin: '0 0 12px 0',
                          color: '#718096',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          {course.description || 'No description available'}
                        </p>

                        {enrollment && (
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}>
                            <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>
                              <div>📅 Enrolled: {enrollment.enrollmentDate}</div>
                              <div>📊 Progress: {enrollment.completedAssignments}/{enrollment.totalAssignments} assignments</div>
                              <div>🕒 Last accessed: {enrollment.lastAccessed}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={() => handleUnenroll(course._id, course.name)}
                          disabled={loading}
                          style={{
                            backgroundColor: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            opacity: loading ? 0.6 : 1
                          }}
                        >
                          {loading ? 'Processing...' : '❌ Drop Course'}
                        </button>

                        <span style={{
                          fontSize: '0.8rem',
                          color: '#718096',
                          marginLeft: 'auto'
                        }}>
                          Credits: {course.credits || 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {myEnrolledCourses.length === 0 && !loading && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    color: '#718096'
                  }}>
                    <p>You are not currently enrolled in any courses.</p>
                    <button
                      onClick={() => setActiveTab("available")}
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Browse Available Courses
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
