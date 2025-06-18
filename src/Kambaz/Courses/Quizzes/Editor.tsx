import { useState } from "react";
import { FaSave, FaTimes, FaQuestionCircle, FaCog, FaCalendarAlt, FaEye, FaClock, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Question {
  _id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  title: string;
  points: number;
  question: string;
  choices?: string[];
  correctAnswer?: string | number;
  possibleAnswers?: string[];
}

export default function QuizEditor() {
  const qid = "Q1"; // Replace with useParams()
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
  
  // Quiz details state (your existing state)
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

  // Questions state (NEW)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Question handling functions (NEW)
  const addNewQuestion = () => {
    const newQuestion: Question = {
      _id: `q_${Date.now()}`,
      type: 'multiple-choice',
      title: `Question ${questions.length + 1}`,
      points: 1,
      question: '',
      choices: ['', '', '', ''],
      correctAnswer: 0
    };
    setEditingQuestion(newQuestion);
    setIsEditingQuestion(true);
  };

  const saveQuestion = () => {
    if (editingQuestion) {
      const existingIndex = questions.findIndex(q => q._id === editingQuestion._id);
      if (existingIndex >= 0) {
        const updated = [...questions];
        updated[existingIndex] = editingQuestion;
        setQuestions(updated);
      } else {
        setQuestions([...questions, editingQuestion]);
      }
      setEditingQuestion(null);
      setIsEditingQuestion(false);
      
      // Update total points
      const totalPoints = [...questions, editingQuestion].reduce((sum, q) => sum + q.points, 0);
      setQuiz(prev => ({ ...prev, points: totalPoints }));
    }
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q._id !== questionId));
    const remainingQuestions = questions.filter(q => q._id !== questionId);
    const totalPoints = remainingQuestions.reduce((sum, q) => sum + q.points, 0);
    setQuiz(prev => ({ ...prev, points: totalPoints }));
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsEditingQuestion(true);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const renderQuestionEditor = () => {
    if (!editingQuestion) return null;

    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            {editingQuestion._id.startsWith('q_') ? 'New Question' : 'Edit Question'}
          </h6>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Question Title</label>
              <input
                type="text"
                className="form-control"
                value={editingQuestion.title}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  title: e.target.value
                })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Points</label>
              <input
                type="number"
                className="form-control"
                value={editingQuestion.points}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  points: parseInt(e.target.value) || 0
                })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Question Type</label>
            <select
              className="form-select"
              value={editingQuestion.type}
              onChange={(e) => setEditingQuestion({
                ...editingQuestion,
                type: e.target.value as Question['type']
              })}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="fill-blank">Fill in the Blank</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Question Text</label>
            <textarea
              className="form-control"
              rows={3}
              value={editingQuestion.question}
              onChange={(e) => setEditingQuestion({
                ...editingQuestion,
                question: e.target.value
              })}
              placeholder="Enter your question..."
            />
          </div>

          {editingQuestion.type === 'multiple-choice' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Answer Choices</label>
              {editingQuestion.choices?.map((choice, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div className="form-check me-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="correctAnswer"
                      checked={editingQuestion.correctAnswer === index}
                      onChange={() => setEditingQuestion({
                        ...editingQuestion,
                        correctAnswer: index
                      })}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...(editingQuestion.choices || [])];
                      newChoices[index] = e.target.value;
                      setEditingQuestion({
                        ...editingQuestion,
                        choices: newChoices
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {editingQuestion.type === 'true-false' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Correct Answer</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tfAnswer"
                  checked={editingQuestion.correctAnswer === 'true'}
                  onChange={() => setEditingQuestion({
                    ...editingQuestion,
                    correctAnswer: 'true'
                  })}
                />
                <label className="form-check-label">True</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tfAnswer"
                  checked={editingQuestion.correctAnswer === 'false'}
                  onChange={() => setEditingQuestion({
                    ...editingQuestion,
                    correctAnswer: 'false'
                  })}
                />
                <label className="form-check-label">False</label>
              </div>
            </div>
          )}

          {editingQuestion.type === 'fill-blank' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Possible Correct Answers</label>
              <small className="text-muted d-block mb-2">
                Enter multiple possible answers (case-insensitive)
              </small>
              {(editingQuestion.possibleAnswers || ['']).map((answer, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Answer ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...(editingQuestion.possibleAnswers || [''])];
                      newAnswers[index] = e.target.value;
                      setEditingQuestion({
                        ...editingQuestion,
                        possibleAnswers: newAnswers
                      });
                    }}
                  />
                  {(editingQuestion.possibleAnswers || ['']).length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => {
                        const newAnswers = editingQuestion.possibleAnswers?.filter((_, i) => i !== index);
                        setEditingQuestion({
                          ...editingQuestion,
                          possibleAnswers: newAnswers
                        });
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditingQuestion({
                  ...editingQuestion,
                  possibleAnswers: [...(editingQuestion.possibleAnswers || ['']), '']
                })}
              >
                <FaPlus className="me-1" size={12} />
                Add Answer
              </button>
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditingQuestion(null);
                setIsEditingQuestion(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={saveQuestion}
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    );
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

      {/* Tabs Navigation (NEW) */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({questions.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Details Tab Content (Your existing content) */}
      {activeTab === 'details' && (
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
                  </div>
                  <div className="col-md-6">
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
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0 fw-semibold">Quiz Summary</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Points</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={totalPoints}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <small className="text-muted">Auto-calculated from questions</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Questions</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={questions.length}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab Content (NEW) */}
      {activeTab === 'questions' && (
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">Quiz Questions</h5>
                <small className="text-muted">Total Points: {totalPoints}</small>
              </div>
              <button
                className="btn btn-primary"
                onClick={addNewQuestion}
                disabled={isEditingQuestion}
              >
                <FaPlus className="me-1" size={12} />
                New Question
              </button>
            </div>

            {isEditingQuestion && renderQuestionEditor()}

            {questions.length === 0 && !isEditingQuestion ? (
              <div className="text-center py-5 text-muted">
                <FaQuestionCircle size={48} className="mb-3 opacity-50" />
                <p className="mb-0">No questions added yet</p>
                <small>Click "New Question" to get started</small>
              </div>
            ) : (
              <div className="row">
                {questions.map((question, index) => (
                  <div key={question._id} className="col-12 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-secondary me-2">
                                {question.type.replace('-', ' ').toUpperCase()}
                              </span>
                              <h6 className="mb-0">{question.title}</h6>
                              <span className="ms-auto text-muted">
                                {question.points} {question.points === 1 ? 'pt' : 'pts'}
                              </span>
                            </div>
                            <p className="text-muted mb-2 small">
                              {question.question || 'No question text provided'}
                            </p>
                          </div>
                          <div className="ms-3">
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() => editQuestion(question)}
                              disabled={isEditingQuestion}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteQuestion(question._id)}
                              disabled={isEditingQuestion}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button className="btn btn-outline-secondary">Cancel</button>
        <button className="btn btn-outline-primary">Save & Publish</button>
        <button className="btn btn-success">Save</button>
      </div>
    </div>
  );
}
