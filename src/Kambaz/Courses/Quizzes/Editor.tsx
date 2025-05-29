import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaSave, FaTimes, FaQuestionCircle, FaCog, FaCalendarAlt, FaEye, FaClock } from "react-icons/fa";

export default function QuizEditor() {
  const { qid } = useParams();
  const [quiz, setQuiz] = useState({
    title: `Quiz ${qid}`,
    description: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptLimit: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    due: "2025-06-02",
    dueTime: "23:59",
    availableFrom: "2025-05-20",
    availableFromTime: "00:00",
    availableUntil: "2025-06-02",
    availableUntilTime: "23:59"
  });

  const handleInputChange = (field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Edit Quiz</h4>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
            Quiz ID: {qid}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">
            <FaEye className="me-1" size={12} />
            Preview
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <FaTimes className="me-1" size={12} />
            Cancel
          </button>
          <button className="btn btn-success btn-sm">
            <FaSave className="me-1" size={12} />
            Save
          </button>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Details */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">Details</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input 
                  type="text"
                  className="form-control"
                  value={quiz.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Instructions</label>
                <div className="border rounded" style={{ minHeight: '150px' }}>
                  <div className="bg-light border-bottom p-2">
                    <small className="text-muted">Rich Content Editor</small>
                  </div>
                  <textarea 
                    className="form-control border-0"
                    rows={5}
                    value={quiz.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter quiz instructions..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Quiz Type</label>
                  <select 
                    className="form-select"
                    value={quiz.quizType}
                    onChange={(e) => handleInputChange('quizType', e.target.value)}
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Assignment Group</label>
                  <select 
                    className="form-select"
                    value={quiz.assignmentGroup}
                    onChange={(e) => handleInputChange('assignmentGroup', e.target.value)}
                  >
                    <option value="Quizzes">Quizzes</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Exams">Exams</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex align-items-center">
                <FaCog className="me-2 text-muted" size={14} />
                <h6 className="mb-0 fw-semibold">Options</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaClock className="me-1 text-muted" size={12} />
                    Time Limit
                  </label>
                  <div className="input-group">
                    <input 
                      type="number"
                      className="form-control"
                      value={quiz.timeLimit}
                      onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                    />
                    <span className="input-group-text">Minutes</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Multiple Attempts</label>
                  <select 
                    className="form-select"
                    onChange={(e) => handleInputChange('multipleAttempts', e.target.value === 'true')}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Show Correct Answers</label>
                <select 
                  className="form-select"
                  value={quiz.showCorrectAnswers}
                  onChange={(e) => handleInputChange('showCorrectAnswers', e.target.value)}
                >
                  <option value="Immediately">Immediately</option>
                  <option value="After Last Attempt">After Last Attempt</option>
                  <option value="After Due Date">After Due Date</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Access Code</label>
                <input 
                  type="text"
                  className="form-control"
                  value={quiz.accessCode}
                  onChange={(e) => handleInputChange('accessCode', e.target.value)}
                  placeholder="Optional access code"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      checked={quiz.shuffleAnswers}
                      onChange={(e) => handleInputChange('shuffleAnswers', e.target.checked)}
                      id="shuffleAnswers"
                    />
                    <label className="form-check-label" htmlFor="shuffleAnswers">
                      Shuffle Answers
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      checked={quiz.oneQuestionAtATime}
                      onChange={(e) => handleInputChange('oneQuestionAtATime', e.target.checked)}
                      id="oneQuestionAtATime"
                    />
                    <label className="form-check-label" htmlFor="oneQuestionAtATime">
                      One Question at a Time
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      checked={quiz.webcamRequired}
                      onChange={(e) => handleInputChange('webcamRequired', e.target.checked)}
                      id="webcamRequired"
                    />
                    <label className="form-check-label" htmlFor="webcamRequired">
                      Require Respondus LockDown Browser
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      checked={quiz.lockQuestionsAfterAnswering}
                      onChange={(e) => handleInputChange('lockQuestionsAfterAnswering', e.target.checked)}
                      id="lockQuestionsAfterAnswering"
                    />
                    <label className="form-check-label" htmlFor="lockQuestionsAfterAnswering">
                      Lock Questions After Answering
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assign */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-muted" size={14} />
                <h6 className="mb-0 fw-semibold">Assign</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>Assign to</strong>
                  <button className="btn btn-link btn-sm p-0 text-decoration-none">
                    <FaTimes size={12} />
                  </button>
                </div>
                
                <div className="mb-3">
                  <input 
                    className="form-control bg-light"
                    value="Everyone"
                    readOnly
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Due</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={quiz.due}
                      onChange={(e) => handleInputChange('due', e.target.value)}
                    />
                    <input 
                      type="time"
                      className="form-control mt-1"
                      value={quiz.dueTime}
                      onChange={(e) => handleInputChange('dueTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Available from</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={quiz.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                    />
                    <input 
                      type="time"
                      className="form-control mt-1"
                      value={quiz.availableFromTime}
                      onChange={(e) => handleInputChange('availableFromTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Until</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={quiz.availableUntil}
                      onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                    />
                    <input 
                      type="time"
                      className="form-control mt-1"
                      value={quiz.availableUntilTime}
                      onChange={(e) => handleInputChange('availableUntilTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex align-items-center">
                <FaQuestionCircle className="me-2 text-muted" size={14} />
                <h6 className="mb-0 fw-semibold">Quiz Settings</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Points</label>
                <input 
                  type="number"
                  className="form-control"
                  value={quiz.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  placeholder="Auto-calculated from questions"
                />
                <small className="text-muted">Leave blank to auto-calculate</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Allowed Attempts</label>
                <input 
                  type="number"
                  className="form-control"
                  value={quiz.attemptLimit}
                  onChange={(e) => handleInputChange('attemptLimit', parseInt(e.target.value))}
                  disabled={!quiz.multipleAttempts}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">Questions</h6>
                <button className="btn btn-primary btn-sm">
                  <FaQuestionCircle className="me-1" size={12} />
                  New Question
                </button>
              </div>
            </div>
            <div className="card-body text-center text-muted py-4">
              <FaQuestionCircle size={32} className="mb-2 opacity-50" />
              <p className="mb-0">No questions added yet</p>
              <small>Click "New Question" to get started</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button className="btn btn-outline-secondary">Cancel</button>
        <button className="btn btn-outline-primary">Save & Publish</button>
        <button className="btn btn-success">Save</button>
      </div>
    </div>
  );
}
