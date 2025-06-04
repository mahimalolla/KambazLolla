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
      <div style={{ 
        marginLeft: '320px',
        padding: '20px',
        minHeight: '100vh'
      }}>
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
    <div style={{ 
      marginLeft: '320px',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container-fluid">
        <h1 id="wd-dashboard-title">Dashboard</h1>

        {/* FACULTY-ONLY: Course Creation Section */}
        {isFaculty && (
          <div className="mb-4 p-4 border rounded bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-success mb-0">
                👨‍🏫 Faculty Controls
              </h5>
              <div>
                <button 
                  className="btn btn-warning me-2"
                  id="wd-update-course-click"
                  onClick={props.updateCourse}
                >
                  Update Course
                </button>
                <button 
                  className="btn btn-primary"
                  id="wd-add-new-course-click"
                  onClick={props.addNewCourse}
                >
                  Add Course
                </button>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <input 
                  type="text"
                  value={props.course?.name || ""} 
                  onChange={(e) => props.setCourse({...props.course, name: e.target.value})}
                  className="form-control mb-3" 
                  placeholder="Course Name"
                  id="wd-course-name"
                />
              </div>
              <div className="col-md-6">
                <textarea 
                  value={props.course?.description || ""}
                  onChange={(e) => props.setCourse({...props.course, description: e.target.value})}
                  className="form-control mb-3" 
                  placeholder="Course Description"
                  rows={3}
                  id="wd-course-description"
                />
              </div>
            </div>
          </div>
        )}

        {/* STUDENT-ONLY: Welcome Message */}
        {isStudent && (
          <div className="alert alert-primary mb-4">
            <h5>👨‍🎓 Welcome, {currentUser.firstName}!</h5>
            <p className="mb-0">You're viewing your enrolled courses. Contact your instructor to make changes.</p>
          </div>
        )}

        {/* Courses Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 id="wd-dashboard-published" className="mb-0">
            Published Courses ({enrolledCourses.length})
          </h2>
        </div>
        <hr />

        {/* Courses Grid */}
        <div className="row g-4" id="wd-dashboard-courses">
          {enrolledCourses.map((course: any) => (
            <div key={course._id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm">
                <Link 
                  className="text-decoration-none"
                  to={`/Kambaz/Courses/${course._id}/Home`}
                >
                  <img 
                    src={course.image || "/images/reactjs.jpg"} 
                    className="card-img-top"
                    style={{ height: 160, objectFit: 'cover' }}
                    alt={course.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-dark">
                      {course.name}
                    </h5>
                    <p className="card-text text-muted" 
                       style={{ 
                         maxHeight: 60, 
                         overflow: 'hidden',
                         fontSize: '0.9rem'
                       }}>
                      {course.description}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <span className="btn btn-primary btn-sm">Go</span>
                      
                      {/* Role indicator */}
                      <small className="text-muted">
                        {isFaculty ? "👨‍🏫 Faculty" : "👨‍🎓 Student"}
                      </small>
                    </div>
                  </div>
                </Link>

                {/* FACULTY-ONLY: Edit Controls */}
                {isFaculty && (
                  <div className="card-footer bg-transparent border-top">
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
                  <div className="card-footer bg-transparent border-top">
                    <small className="text-muted d-block text-center">
                      👀 View Only - Student Access
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Message */}
        {enrolledCourses.length === 0 && (
          <div className="alert alert-info mt-4">
            <h5>No Courses Found</h5>
            <p className="mb-0">
              {isFaculty 
                ? "You don't have any courses assigned. Use the form above to create a new course."
                : "You're not enrolled in any courses. Contact your administrator for enrollment."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
