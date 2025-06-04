import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
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

  // Filter assignments for this course
  const courseAssignments = db.assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  // Show loading if no user
  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please sign in to view assignments.
        </div>
      </div>
    );
  }

  return (
    <div id="wd-assignments" className="container-fluid">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h3 className="mb-0">📊 ASSIGNMENTS</h3>
          <span className="ms-3 text-muted">40% of Total</span>
        </div>
        
        {/* FACULTY-ONLY: Add Assignment Button */}
        {isFaculty && (
          <div>
            <button className="btn btn-secondary me-2">
              📁 + Group
            </button>
            <Link 
              to="new" 
              className="btn btn-danger"
              id="wd-add-assignment-btn"
            >
              ➕ Assignment
            </Link>
          </div>
        )}

        {/* STUDENT-ONLY: View Info */}
        {isStudent && (
          <div className="alert alert-info mb-0 py-2 px-3">
            <small>
              👀 <strong>Student View:</strong> You can view assignments but cannot edit them
            </small>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-outline-secondary">
          📊 40% of Total
        </button>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text">🔍</span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search for Assignment"
          />
        </div>
        <button className="btn btn-outline-secondary">
          👥 + Group
        </button>
      </div>

      {/* Assignments Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Assignment Name</th>
              <th>Due Date</th>
              <th>Points</th>
              <th>Available</th>
              {isFaculty && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courseAssignments.map((assignment: any) => (
              <tr key={assignment._id}>
                <td>
                  <div className="d-flex align-items-start">
                    <div className="me-3">📝</div>
                    <div>
                      {isFaculty ? (
                        <Link 
                          to={`${assignment._id}`}
                          className="text-decoration-none fw-bold text-dark"
                        >
                          {assignment.title}
                        </Link>
                      ) : (
                        <span className="fw-bold text-dark">
                          {assignment.title}
                        </span>
                      )}
                      <div className="text-muted small mt-1">
                        <span className="text-danger">Multiple Modules</span> | 
                        <strong> Not available until</strong> {assignment.availableFrom} | 
                        <strong> Due</strong> {assignment.dueDate}
                      </div>
                      {assignment.description && (
                        <div className="text-muted small mt-1">
                          {assignment.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-nowrap">
                  {assignment.dueDate}
                </td>
                <td>
                  {assignment.points} pts
                </td>
                <td className="text-nowrap">
                  {assignment.availableFrom} - {assignment.availableUntil}
                </td>
                
                {/* FACULTY-ONLY: Action Buttons */}
                {isFaculty && (
                  <td>
                    <div className="d-flex gap-1">
                      <Link
                        to={`${assignment._id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Edit Assignment"
                      >
                        ✏️
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Assignment"
                        onClick={() => {
                          if (window.confirm(`Delete assignment "${assignment.title}"?`)) {
                            // Add delete functionality here
                            alert('Delete functionality would be implemented here');
                          }
                        }}
                      >
                        🗑️
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Assignment Settings"
                      >
                        ⚙️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Assignments Message */}
      {courseAssignments.length === 0 && (
        <div className="alert alert-info">
          <h5>No Assignments Found</h5>
          <p className="mb-0">
            {isFaculty 
              ? "No assignments have been created for this course yet. Click '+ Assignment' to create one."
              : "No assignments are available for this course yet."
            }
          </p>
        </div>
      )}

      {/* Role Info Footer */}
      <div className="mt-4 p-3 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Current User:</strong> {currentUser.firstName} {currentUser.lastName}
            <span className="ms-2 badge bg-secondary">{currentUser.role}</span>
          </div>
          <div className="text-muted small">
            {isFaculty ? (
              "✅ Faculty: Can create, edit, and delete assignments"
            ) : (
              "👀 Student: View-only access to assignments"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Also update your AssignmentEditor component
// src/Kambaz/Courses/Assignments/Editor.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentEditor() {
  const navigate = useNavigate();
  const { cid, aid } = useParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem('kambaz_user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      
      // If not faculty, redirect back to assignments
      if (user.role !== "FACULTY") {
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
        return;
      }
      
      // If editing existing assignment, load its data
      if (aid && aid !== "new") {
        const existingAssignment = db.assignments.find((a: any) => a._id === aid);
        if (existingAssignment) {
          setAssignment(existingAssignment);
        }
      }
    } else {
      // Not signed in, redirect to signin
      navigate("/Kambaz/Account/Signin");
    }
  }, [navigate, cid, aid]);

  const handleSave = () => {
    // Add save functionality here
    alert("Save functionality would be implemented here");
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  // Show loading while checking authentication
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // This shouldn't show if useEffect redirects properly, but just in case
  if (currentUser.role !== "FACULTY") {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>Only faculty members can edit assignments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h2>{aid === "new" ? "Create New Assignment" : "Edit Assignment"}</h2>
      
      <div className="alert alert-success mb-4">
        <strong>Faculty Access:</strong> You can create and edit assignments.
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Assignment Name</label>
            <input
              type="text"
              className="form-control"
              value={assignment.title}
              onChange={(e) => setAssignment({...assignment, title: e.target.value})}
              placeholder="Enter assignment name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={5}
              value={assignment.description}
              onChange={(e) => setAssignment({...assignment, description: e.target.value})}
              placeholder="Enter assignment description"
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Points</label>
                <input
                  type="number"
                  className="form-control"
                  value={assignment.points}
                  onChange={(e) => setAssignment({...assignment, points: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Available From</label>
                <input
                  type="date"
                  className="form-control"
                  value={assignment.availableFrom}
                  onChange={(e) => setAssignment({...assignment, availableFrom: e.target.value})}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Available Until</label>
                <input
                  type="date"
                  className="form-control"
                  value={assignment.availableUntil}
                  onChange={(e) => setAssignment({...assignment, availableUntil: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-success"
              onClick={handleSave}
            >
              💾 Save
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
