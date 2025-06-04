// src/Kambaz/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as db from "./Database";

export default function Dashboard(props: any) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kambaz_user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      
      // Debug logging - remove after testing
      console.log('=== DASHBOARD DEBUG ===');
      console.log('Stored user from localStorage:', user);
      console.log('User role:', user.role);
      console.log('Is Faculty check:', user.role === "FACULTY");
      console.log('Is Student check:', user.role === "STUDENT");
      console.log('=====================');
    }
  }, []);

  // Role checks
  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  // Filter courses by enrollment
  const enrolledCourses = currentUser ? props.courses.filter((course: any) =>
    db.enrollments.some((enrollment: any) => 
      enrollment.user === currentUser._id && 
      enrollment.course === course._id
    )
  ) : [];

  // Show loading or signin message if no user
  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Authentication Required</h4>
          <p>Please sign in to view your dashboard.</p>
          <Link to="/Kambaz/Account/Signin" className="btn btn-primary">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      
      {/* Debug Panel - REMOVE AFTER TESTING */}
      <div className="alert alert-info mb-4">
        <h5>🔍 Debug Info (Remove this after testing)</h5>
        <strong>User:</strong> {currentUser.firstName} {currentUser.lastName} ({currentUser.username})<br />
        <strong>Role:</strong> {currentUser.role}<br />
        <strong>Is Faculty:</strong> {isFaculty ? '✅ YES' : '❌ NO'}<br />
        <strong>Is Student:</strong> {isStudent ? '✅ YES' : '❌ NO'}<br />
        <strong>User ID:</strong> {currentUser._id}<br />
        <strong>Enrolled Courses:</strong> {enrolledCourses.length}
      </div>

      {/* FACULTY-ONLY: Course Creation Section */}
      {isFaculty && (
        <div className="mb-4 p-3 border rounded bg-light">
          <h5 className="text-success">
            👨‍🏫 Faculty Controls
            <button 
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={props.addNewCourse}
            >
              Add Course
            </button>
            <button 
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={props.updateCourse}
            >
              Update Course
            </button>
          </h5>
          
          <div className="mt-3">
            <input 
              type="text"
              value={props.course?.name || ""} 
              onChange={(e) => props.setCourse({...props.course, name: e.target.value})}
              className="form-control mb-2" 
              placeholder="Course Name"
              id="wd-course-name"
            />
            <textarea 
              value={props.course?.description || ""}
              onChange={(e) => props.setCourse({...props.course, description: e.target.value})}
              className="form-control mb-2" 
              placeholder="Course Description"
              rows={3}
              id="wd-course-description"
            />
          </div>
          <hr />
        </div>
      )}

      {/* STUDENT-ONLY: Welcome Message */}
      {isStudent && (
        <div className="alert alert-primary mb-4">
          <h5>👨‍🎓 Welcome, {currentUser.firstName}!</h5>
          <p>You're viewing your enrolled courses. Contact your instructor to make changes.</p>
        </div>
      )}

      {/* Courses Section */}
      <h2 id="wd-dashboard-published">
        Published Courses ({enrolledCourses.length})
      </h2>
      <hr />

      <div className="row" id="wd-dashboard-courses">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {enrolledCourses.map((course: any) => (
            <div key={course._id} className="col" style={{ width: "300px" }}>
              <div className="card rounded-3 overflow-hidden">
                <Link 
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  to={`/Kambaz/Courses/${course._id}/Home`}
                >
                  <img 
                    src={course.image || "/images/reactjs.jpg"} 
                    className="card-img-top"
                    style={{ height: 160 }}
                    alt={course.name}
                  />
                  <div className="card-body">
                    <h5 className="wd-dashboard-course-title card-title">
                      {course.name}
                    </h5>
                    <p className="wd-dashboard-course-title card-text overflow-y-hidden" 
                       style={{ maxHeight: 100 }}>
                      {course.description}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <button className="btn btn-primary">Go</button>
                      
                      {/* Role indicator */}
                      <small className="text-muted">
                        {isFaculty ? "👨‍🏫 Faculty" : "👨‍🎓 Student"}
                      </small>
                    </div>
                  </div>
                </Link>

                {/* FACULTY-ONLY: Edit Controls */}
                {isFaculty && (
                  <div className="card-footer bg-transparent">
                    <div className="d-flex gap-2">
                      <button 
                        onClick={(event) => {
                          event.preventDefault();
                          props.setCourse(course);
                        }}
                        className="btn btn-warning btn-sm flex-fill"
                        id="wd-edit-course-click"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={(event) => {
                          event.preventDefault();
                          if (window.confirm(`Delete course "${course.name}"?`)) {
                            props.deleteCourse(course._id);
                          }
                        }}
                        className="btn btn-danger btn-sm flex-fill"
                        id="wd-delete-course-click"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* STUDENT-ONLY: View Only Message */}
                {isStudent && (
                  <div className="card-footer bg-transparent">
                    <small className="text-muted d-block text-center">
                      👀 View Only - Student Access
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Courses Message */}
      {enrolledCourses.length === 0 && (
        <div className="alert alert-info">
          <h5>No Courses Found</h5>
          <p>
            {isFaculty 
              ? "You don't have any courses assigned. Use the form above to create a new course."
              : "You're not enrolled in any courses. Contact your administrator for enrollment."
            }
          </p>
        </div>
      )}

      {/* Testing Instructions */}
      <div className="alert alert-secondary mt-4">
        <h6>🧪 Testing Instructions:</h6>
        <ul className="mb-0">
          <li><strong>alice_johnson (Faculty):</strong> Should see course creation form and edit buttons</li>
          <li><strong>bob_smith (Student):</strong> Should see welcome message and "View Only" on courses</li>
          <li><strong>charlie_wilson (Faculty):</strong> Should see course creation form and edit buttons</li>
          <li><strong>diana_prince (Student):</strong> Should see welcome message and "View Only" on courses</li>
        </ul>
      </div>
    </div>
  );
}
