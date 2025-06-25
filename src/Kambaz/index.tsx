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
      console.log('Loading courses...');
      const coursesData = await courseClient.findAllCourses();
      console.log('Courses loaded:', coursesData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <div className="text-center mt-5">
            <h4>Loading Kambaz...</h4>
            <p>Connecting to server and loading data...</p>
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
          <Route path="Dashboard" element={
            <Dashboard 
              courses={courses}
              onCoursesChange={loadCourses}
            />
          } />
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
