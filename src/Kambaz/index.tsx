import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  // Load courses from MongoDB on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseClient.findAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // These functions are now handled by the Dashboard component
  // but kept here for compatibility with the Courses component
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

  if (loading) {
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
                Connecting to MongoDB and loading course data...
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
          <Route path="Dashboard" element={<Dashboard />} />
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
