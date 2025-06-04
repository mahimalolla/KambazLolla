import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AssignmentEditor() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [assignment, setAssignment] = useState({
    name: "A1",
    description: "The assignment is available online\n\nSubmit a link to the landing page of your Web application running on Netlify.\n\nThe landing page should include the following:\n\n• Your full name and section\n• Links to each of the lab assignments\n• Link to the Kambaz application\n• Links to all relevant source code repositories\n\nThe Kambaz application should include a link to navigate back to the landing page.",
    points: 100,
    group: "ASSIGNMENTS",
    gradeAs: "Percentage",
    submissionType: "Online",
    onlineOptions: {
      textEntry: false,
      websiteUrl: true,
      mediaRecordings: false,
      studentAnnotation: false,
      fileUploads: false
    },
    assignTo: "Everyone",
    due: "2024-05-13T23:59",
    availableFrom: "2024-05-06T12:01",
    until: ""
  });

  // Check authentication and role on component mount
  useEffect(() => {
    const stored = localStorage.getItem('kambaz_user');
    if (!stored) {
      // Not signed in - redirect to signin
      navigate("/Kambaz/Account/Signin");
      return;
    }

    const user = JSON.parse(stored);
    setCurrentUser(user);

    // If not faculty, redirect back to assignments
    if (user.role !== "FACULTY") {
      alert("Access Denied: Only faculty members can edit assignments.");
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
      return;
    }
  }, [navigate, cid]);

  const handleInputChange = (field: string, value: string | number) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOnlineOptionChange = (option: string, checked: boolean) => {
    setAssignment(prev => ({
      ...prev,
      onlineOptions: {
        ...prev.onlineOptions,
        [option]: checked
      }
    }));
  };

  const handleSave = () => {
    // Add save functionality here
    alert("Assignment saved successfully!");
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    }
  };

  // Show loading while checking authentication
  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // This shouldn't show if useEffect redirects properly, but just in case
  if (currentUser.role !== "FACULTY") {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>🚫 Access Denied</h4>
          <p>Only faculty members can create or edit assignments.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Faculty Access Confirmation */}
      <div className="alert alert-success mb-4">
        <h5>✅ Faculty Access Confirmed</h5>
        <p className="mb-0">
          <strong>User:</strong> {currentUser.firstName} {currentUser.lastName} 
          <span className="badge bg-success ms-2">{currentUser.role}</span>
        </p>
      </div>

      <h2 className="mb-4">Assignment Editor</h2>
      
      {/* Assignment Name */}
      <div className="mb-3">
        <label className="form-label fw-bold">Assignment Name</label>
        <input 
          type="text"
          className="form-control"
          value={assignment.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="form-label fw-bold">Description</label>
        <textarea 
          className="form-control"
          rows={12}
          value={assignment.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          style={{ 
            border: '1px solid #dee2e6',
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        />
      </div>

      {/* Points */}
      <div className="row mb-3">
        <div className="col-3">
          <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Points</label>
        </div>
        <div className="col-9">
          <input 
            type="number"
            className="form-control"
            value={assignment.points}
            onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
      </div>

      {/* Assignment Group */}
      <div className="row mb-3">
        <div className="col-3">
          <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Assignment Group</label>
        </div>
        <div className="col-9">
          <select 
            className="form-select"
            value={assignment.group}
            onChange={(e) => handleInputChange('group', e.target.value)}
          >
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECTS">PROJECTS</option>
          </select>
        </div>
      </div>

      {/* Display Grade as */}
      <div className="row mb-3">
        <div className="col-3">
          <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Display Grade as</label>
        </div>
        <div className="col-9">
          <select 
            className="form-select"
            value={assignment.gradeAs}
            onChange={(e) => handleInputChange('gradeAs', e.target.value)}
          >
            <option value="Percentage">Percentage</option>
            <option value="Complete/Incomplete">Complete/Incomplete</option>
            <option value="Points">Points</option>
            <option value="Letter Grade">Letter Grade</option>
            <option value="Not Graded">Not Graded</option>
          </select>
        </div>
      </div>

      {/* Submission Type */}
      <div className="row mb-3">
        <div className="col-3">
          <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Submission Type</label>
        </div>
        <div className="col-9">
          <select 
            className="form-select"
            value={assignment.submissionType}
            onChange={(e) => handleInputChange('submissionType', e.target.value)}
          >
            <option value="No Submission">No Submission</option>
            <option value="Online">Online</option>
            <option value="On Paper">On Paper</option>
            <option value="External Tool">External Tool</option>
          </select>
        </div>
      </div>

      {/* Online Entry Options */}
      {assignment.submissionType === "Online" && (
        <div className="row mb-4">
          <div className="col-3">
            <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Online Entry Options</label>
          </div>
          <div className="col-9">
            <div className="border p-3" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input"
                  type="checkbox"
                  checked={assignment.onlineOptions.textEntry}
                  onChange={(e) => handleOnlineOptionChange('textEntry', e.target.checked)}
                  id="textEntry"
                />
                <label className="form-check-label" htmlFor="textEntry">
                  Text Entry
                </label>
              </div>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input"
                  type="checkbox"
                  checked={assignment.onlineOptions.websiteUrl}
                  onChange={(e) => handleOnlineOptionChange('websiteUrl', e.target.checked)}
                  id="websiteUrl"
                />
                <label className="form-check-label" htmlFor="websiteUrl">
                  Website URL
                </label>
              </div>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input"
                  type="checkbox"
                  checked={assignment.onlineOptions.mediaRecordings}
                  onChange={(e) => handleOnlineOptionChange('mediaRecordings', e.target.checked)}
                  id="mediaRecordings"
                />
                <label className="form-check-label" htmlFor="mediaRecordings">
                  Media Recordings
                </label>
              </div>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input"
                  type="checkbox"
                  checked={assignment.onlineOptions.studentAnnotation}
                  onChange={(e) => handleOnlineOptionChange('studentAnnotation', e.target.checked)}
                  id="studentAnnotation"
                />
                <label className="form-check-label" htmlFor="studentAnnotation">
                  Student Annotation
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input"
                  type="checkbox"
                  checked={assignment.onlineOptions.fileUploads}
                  onChange={(e) => handleOnlineOptionChange('fileUploads', e.target.checked)}
                  id="fileUploads"
                />
                <label className="form-check-label" htmlFor="fileUploads">
                  File Uploads
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign */}
      <div className="row mb-3">
        <div className="col-3">
          <label className="form-label fw-bold text-end" style={{ paddingRight: '10px' }}>Assign</label>
        </div>
        <div className="col-9">
          <div className="border p-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Assign to</label>
              <div className="d-flex align-items-center">
                <span className="badge bg-light text-dark me-2">Everyone</span>
                <button className="btn btn-sm btn-outline-secondary">×</button>
              </div>
            </div>
            
            <div className="row">
              <div className="col-4">
                <label className="form-label fw-bold">Due</label>
                <input 
                  type="datetime-local"
                  className="form-control"
                  value={assignment.due}
                  onChange={(e) => handleInputChange('due', e.target.value)}
                />
              </div>
              <div className="col-4">
                <label className="form-label fw-bold">Available from</label>
                <input 
                  type="datetime-local"
                  className="form-control"
                  value={assignment.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                />
              </div>
              <div className="col-4">
                <label className="form-label fw-bold">Until</label>
                <input 
                  type="datetime-local"
                  className="form-control"
                  value={assignment.until}
                  onChange={(e) => handleInputChange('until', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
