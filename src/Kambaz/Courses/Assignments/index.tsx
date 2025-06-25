import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../AuthContext"; 
import courseClient from "../client"; // Use course client instead of local db

export default function Assignments() {
  const { cid } = useParams();
  const { state } = useAuth(); 
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  
  // Load assignments from MongoDB when component mounts or when course changes
  useEffect(() => {
    loadAssignments();
  }, [cid]);

  const loadAssignments = async () => {
    if (!cid) return;
    
    try {
      setLoading(true);
      
      // Load course details
      const courseData = await courseClient.findCourseById(cid);
      setCourse(courseData);
      
      // Load assignments for this course from MongoDB
      const assignmentsData = await courseClient.findAssignmentsForCourse(cid);
      console.log('Loaded assignments from database:', assignmentsData);
      setAssignments(assignmentsData);
      
    } catch (error) {
      console.error("Error loading assignments:", error);
      setAssignments([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // Delete assignment function using MongoDB API
  const deleteAssignment = async (assignmentId: string, assignmentTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the assignment "${assignmentTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        setLoading(true);
        
        // Call API to delete assignment from database
        await courseClient.deleteAssignment(assignmentId);
        
        console.log('Deleted assignment:', assignmentId);
        
        // Remove from local state
        setAssignments(prevAssignments => 
          prevAssignments.filter(assignment => assignment._id !== assignmentId)
        );
        
        alert(`Assignment "${assignmentTitle}" has been deleted successfully!`);
        
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Get current user from AuthContext
  const currentUser = state.user;
  
  // Role checks
  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  // Show loading if not authenticated
  if (!state.isAuthenticated || !currentUser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h5>🔐 Authentication Required</h5>
          <p className="mb-0">Please sign in to view assignments.</p>
        </div>
      </div>
    );
  }

  if (loading && assignments.length === 0) {
    return (
      <div id="wd-assignments" className="container-fluid">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading assignments...</p>
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
          {loading && (
            <div className="ms-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
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

      {/* MongoDB Info */}
      <div className="mb-3">
        <small className="text-muted">
          Showing assignments for {course?.name || 'this course'} • Data from MongoDB • Total: {assignments.length} assignments
        </small>
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
                        <strong> Not available until</strong> {assignment.availableDate || assignment.availableFrom} | 
                        <strong> Due</strong> {assignment.dueDate}
                      </div>
                      {assignment.description && (
                        <div className="text-muted small mt-1">
                          {assignment.description.length > 100 
                            ? `${assignment.description.substring(0, 100)}...` 
                            : assignment.description}
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
                  {assignment.availableDate || assignment.availableFrom} - {assignment.untilDate || assignment.until || 'No end date'}
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
                      {/* Delete button with actual functionality */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Assignment"
                        onClick={() => deleteAssignment(assignment._id, assignment.title)}
                        disabled={loading}
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
      {assignments.length === 0 && !loading && (
        <div 
          style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}
        >
          <h4 style={{ color: '#6c757d', marginBottom: '10px' }}>No assignments found</h4>
          <p style={{ color: '#6c757d' }}>
            {isFaculty 
              ? "This course doesn't have any assignments yet. Click the '+ Assignment' button to create your first assignment."
              : "No assignments are available for this course yet."
            }
          </p>
          <small style={{ color: '#adb5bd' }}>
            Data loaded from MongoDB • Course ID: {cid}
          </small>
        </div>
      )}

      {/* Assignment Stats Footer */}
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
        <div className="mt-2">
          <div className="row text-center">
            <div className="col">
              <strong>Total Assignments</strong><br />
              <span className="fs-5 text-primary">{assignments.length}</span>
            </div>
            <div className="col">
              <strong>Course</strong><br />
              <span className="fs-6 text-info">{course?.name || 'Loading...'}</span>
            </div>
            <div className="col">
              <strong>Data Source</strong><br />
              <span className="fs-6 text-success">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
