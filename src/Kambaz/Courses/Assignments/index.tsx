import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]); // Add state for assignments
  
  useEffect(() => {
    const stored = localStorage.getItem('kambaz_user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
    }
  }, []);

  // Load assignments when component mounts or when course changes
  useEffect(() => {
    loadAssignments();
  }, [cid]);

  const loadAssignments = () => {
    // Filter assignments for this course
    const courseAssignments = db.assignments.filter(
      (assignment: any) => assignment.course === cid
    );
    setAssignments(courseAssignments);
  };

  // Delete assignment function
  const deleteAssignment = (assignmentId: string, assignmentTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the assignment "${assignmentTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        // Find the index of the assignment to delete
        const assignmentIndex = db.assignments.findIndex(
          (assignment: any) => assignment._id === assignmentId
        );
        
        if (assignmentIndex !== -1) {
          // Remove the assignment from the database
          db.assignments.splice(assignmentIndex, 1);
          
          // Update local state to reflect the change
          setAssignments(prevAssignments => 
            prevAssignments.filter(assignment => assignment._id !== assignmentId)
          );
          
          // Show success message
          alert(`Assignment "${assignmentTitle}" has been deleted successfully!`);
        } else {
          alert('Error: Assignment not found!');
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment. Please try again.');
      }
    }
  };

  // Role checks
  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

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
              to="editor" 
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
            {assignments.map((assignment: any) => (
              <tr key={assignment._id}>
                <td>
                  <div className="d-flex align-items-start">
                    <div className="me-3">📝</div>
                    <div>
                      {/* For faculty: Link to assignment details (not editor) */}
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
                      {/* Edit button */}
                      <Link
                        to={`${assignment._id}/editor`}
                        className="btn btn-outline-primary btn-sm"
                        title="Edit Assignment"
                      >
                        ✏️
                      </Link>
                      {/* UPDATED: Delete button with actual functionality */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Assignment"
                        onClick={() => deleteAssignment(assignment._id, assignment.title)}
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
      {assignments.length === 0 && (
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
