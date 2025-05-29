import { courses } from "../Database";
import { FaAlignJustify } from "react-icons/fa6";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import CourseNavigation from "./Navigation";
import Home from "./Home";
import Modules from "./Modules";
import Assignments from "./Assignments";
import Grades from "./Grades";
import People from "./People";
import PiazzaDiscussions from "./Piazza";
import Zoom from "./Zoom";
import Quizzes from "./Quizzes";

export default function Courses() {
  const { cid } = useParams();
  const course = courses.find((course: { _id: string | undefined; }) => course._id === cid);
  const { pathname } = useLocation();

  return (
    <div id="wd-courses">
      {/* Course Header - Fixed at top */}
      <div style={{ 
        position: 'fixed',
        top: '0',
        left: '240px', // Account for main Kambaz nav width (240px)
        right: '0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #dee2e6',
        padding: '15px 20px',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 className="text-danger m-0" style={{ fontSize: '1.5rem' }}>
          <FaAlignJustify className="me-3 fs-5 mb-1" />
          {course && course.name} &gt; {pathname.split("/")[4] || "Home"}
        </h2>
      </div>
      
      {/* Main Content Area */}
      <div style={{ 
        marginTop: '80px', // Space for fixed header
        marginLeft: '240px', // Space for main nav (240px)
        display: 'flex',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Course Navigation Sidebar - Smaller and cleaner */}
        <div style={{ 
          width: '200px',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
          padding: '0',
          flexShrink: 0
        }}>
          <CourseNavigation />
        </div>
        
        {/* Main Course Content - Clean and spacious */}
        <div style={{ 
          flex: 1, 
          padding: '30px',
          backgroundColor: '#ffffff',
          overflow: 'auto'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<PiazzaDiscussions />} />
            <Route path="Zoom" element={<Zoom />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Grades" element={<Grades />} />
            <Route path="People" element={<People />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}