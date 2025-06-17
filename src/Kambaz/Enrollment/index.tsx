import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import * as coursesClient from "../Courses/client";
import * as userClient from "../Account/client";

export default function Enrollment() {
  const { state } = useAuth();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [all, enrolled] = await Promise.all([
        coursesClient.fetchAllCourses(),
        userClient.findMyCourses()
      ]);
      setAllCourses(all);
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string, courseName: string) => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      await coursesClient.enrollInCourse(courseId);
      setMessage(`Successfully enrolled in ${courseName}!`);
      await fetchCourses(); // Refresh the lists
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error enrolling:", error);
      setMessage("Failed to enroll in course");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId: string, courseName: string) => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      await coursesClient.unenrollFromCourse(courseId);
      setMessage(`Successfully unenrolled from ${courseName}!`);
      await fetchCourses(); // Refresh the lists
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error unenrolling:", error);
      setMessage("Failed to unenroll from course");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((course: any) => course._id === courseId);
  };

  useEffect(() => {
    if (state.user) {
      fetchCourses();
    }
  }, [state.user]);

  if (!state.isAuthenticated) {
    return (
      <div style={{ 
        marginLeft: '240px', 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2>Please Sign In</h2>
        <p>You must be signed in to enroll in courses.</p>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '240px', padding: '20px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#2d3748', marginBottom: '10px' }}>Course Enrollment</h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Browse and enroll in available courses. Currently enrolled in {enrolledCourses.length} course(s).
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div style={{
          backgroundColor: message.includes('Successfully') ? '#f0fff4' : '#fef2f2',
          border: `1px solid ${message.includes('Successfully') ? '#9ae6b4' : '#fca5a5'}`,
          color: message.includes('Successfully') ? '#2f855a' : '#e53e3e',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading courses...</p>
        </div>
      )}

      {/* Course Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {allCourses.map((course: any) => {
          const enrolled = isEnrolled(course._id);
          
          return (
            <div key={course._id} style={{
              border: `2px solid ${enrolled ? '#48bb78' : '#e2e8f0'}`,
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: enrolled ? '#f0fff4' : 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}>
              {/* Enrollment Status Badge */}
              {enrolled && (
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
              )}

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
                  {course.number}
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

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {enrolled ? (
                  <button 
                    onClick={() => handleUnenroll(course._id, course.name)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Processing...' : 'Drop Course'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEnroll(course._id, course.name)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Processing...' : 'Enroll Now'}
                  </button>
                )}

                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#718096',
                  marginLeft: 'auto'
                }}>
                  Credits: {course.credits || 'N/A'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allCourses.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#718096'
        }}>
          <p>No courses available for enrollment.</p>
        </div>
      )}
    </div>
  );
}
