import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import * as coursesClient from "./client";
import * as userClient from "../Account/client";

export default function Enrollment() {
  const { state } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const [all, enrolled] = await Promise.all([
        coursesClient.findAllCourses(),
        userClient.findMyCourses()
      ]);
      setAllCourses(all);
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!state.user) return;
    setLoading(true);
    try {
      await coursesClient.enrollInCourse(state.user._id, courseId);
      await fetchCourses(); // Refresh the lists
    } catch (error) {
      console.error("Error enrolling:", error);
    }
    setLoading(false);
  };

  const handleUnenroll = async (courseId: string) => {
    if (!state.user) return;
    setLoading(true);
    try {
      await coursesClient.unenrollFromCourse(state.user._id, courseId);
      await fetchCourses(); // Refresh the lists
    } catch (error) {
      console.error("Error unenrolling:", error);
    }
    setLoading(false);
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((course: any) => course._id === courseId);
  };

  useEffect(() => {
    if (state.user) {
      fetchCourses();
    }
  }, [state.user]);

  return (
    <div style={{ marginLeft: '240px', padding: '20px' }}>
      <h2>Course Enrollment</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Available Courses */}
        <div>
          <h3>Available Courses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allCourses.map((course: any) => (
              <div key={course._id} style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: isEnrolled(course._id) ? '#f0f8ff' : 'white'
              }}>
                <h4>{course.name}</h4>
                <p>{course.description}</p>
                <p><strong>Number:</strong> {course.number}</p>
                
                {isEnrolled(course._id) ? (
                  <button 
                    onClick={() => handleUnenroll(course._id)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Processing...' : 'Unenroll'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEnroll(course._id)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Processing...' : 'Enroll'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div>
          <h3>My Enrolled Courses ({enrolledCourses.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {enrolledCourses.map((course: any) => (
              <div key={course._id} style={{
                border: '1px solid #28a745',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f8fff8'
              }}>
                <h4>{course.name}</h4>
                <p>{course.description}</p>
                <button 
                  onClick={() => handleUnenroll(course._id)}
                  disabled={loading}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Processing...' : 'Drop Course'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
