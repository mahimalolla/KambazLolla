import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; 
import KambazNavigation from "./Navigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Account from "./Account";
import Calendar from "./Calendar";
import Inbox from "./Inbox";
import Enrollment from "./Enrollment"; 
import * as courseClient from "./Courses/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use AuthContext - note the correct structure
  const { state } = useAuth();
  const currentUser = state.user; // Get user from state
  const isAuthenticated = state.isAuthenticated;
  const authLoading = state.isLoading;

  // Load courses when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadCourses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser, isAuthenticated, authLoading]);

// In the loadCourses function, add better error handling:
const loadCourses = async () => {
  try {
    setLoading(true);
    let coursesData = [];
    
    console.log('Loading courses for user:', currentUser?.username, 'Role:', currentUser?.role);
    
    // Load different courses based on user role
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'FACULTY') {
      coursesData = await courseClient.findAllCourses();
      console.log('Loaded all courses for admin/faculty:', coursesData);
    } else if (currentUser?.role === 'STUDENT') {
      coursesData = await courseClient.findMyCourses();
      console.log('Loaded enrolled courses for student:', coursesData);
    } else {
      console.log('Unknown user role:', currentUser?.role);
    }
    
    // Ensure coursesData is an array and filter out null/undefined items
    const validCourses = Array.isArray(coursesData) 
      ? coursesData.filter(course => course && course._id) 
      : [];
      
    console.log('Valid courses after filtering:', validCourses);
    setCourses(validCourses);
    
  } catch (error) {
    console.error('Error loading courses:', error);
    setCourses([]); // Fallback to empty array
  } finally {
    setLoading(false);
  }
};

  const addNewCourse = async (courseData: any) => {
    try {
      const newCourse = await courseClient.createCourse(courseData);
      setCourses([...courses, newCourse]);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (courseId: any) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  const updateCourse = async (updatedCourse: any) => {
    try {
      await courseClient.updateCourse(updatedCourse._id, updatedCourse);
      setCourses(
        courses.map((c) => {
          if (c._id === updatedCourse._id) {
            return updatedCourse;
          } else {
            return c;
          }
        })
      );
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  // Show loading while auth is loading or courses are loading
  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#4f46e5', marginBottom: '16px' }}>Loading Kambaz...</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {authLoading ? 'Checking authentication...' : 'Loading course data...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Account" />} />
          <Route path="Account/*" element={<Account />} />
          <Route 
            path="Dashboard" 
            element={
              <Dashboard 
                courses={courses} 
                currentUser={currentUser}
                onCoursesChange={loadCourses}
                addNewCourse={addNewCourse}
                deleteCourse={deleteCourse}
                updateCourse={updateCourse}
              />
            } 
          />
          <Route
            path="Courses/:cid/*"
            element={<Courses courses={courses} />}
          />
          <Route path="Calendar" element={<Calendar />} />
          <Route path="Inbox" element={<Inbox />} />
          <Route path="Enrollment" element={<Enrollment />} />
        </Routes>
      </div>
    </div>
  );
}
