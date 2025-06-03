import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import KambazNavigation from "./Navigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Account from "./Account";
import Calendar from "./Calendar";
import Inbox from "./Inbox";
import * as db from "./Database";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>(db.courses);
  const [course, setCourse] = useState<any>({
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
    image: "/images/reactjs.jpg",
  });

  const addNewCourse = () => {
    const newCourse = { 
      ...course, 
      _id: new Date().getTime().toString() 
    };
    setCourses([...courses, newCourse]);
  };

  const deleteCourse = (courseId: any) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  };

  const updateCourse = () => {
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Dashboard" />} />
          <Route path="Account/*" element={<Account />} />
          <Route
            path="Dashboard"
            element={
              <Dashboard
                courses={courses}
                course={course}
                setCourse={setCourse}
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
        </Routes>
      </div>
    </div>
  );
}
