import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaEdit, FaEye, FaClock, FaQuestion, FaCalendarAlt, FaTrophy, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  quizType: string;
  assignmentGroup: string;
  points: number;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptLimit: number;
  showCorrectAnswers: string;
  shuffleAnswers: boolean;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  accessCode: string;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
  published: boolean;
  questions: any[];
  courseId: string;
}

interface QuizAttempt {
  _id: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
}

export default function QuizDetails() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [error, setError] = useState('');

  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';
  const isStudent = state.user?.role === 'STUDENT';

  useEffect(() => {
    fetchQuizDetails();
    if (isStudent) {
      fetchUserAttempts();
    }
  }, [quizId, courseId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${courseId}/quizzes/${quizId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched quiz details:', data);
        setQuiz(data);
      } else {
        setError('Failed to load quiz details');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Error loading quiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${courseId}/quizzes/${quizId}/attempts/${state.user._id}`);
      if (response.ok) {
        const data = await response.json();
        setUserAttempts(data);
      }
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  // NEW: Toggle publish/unpublish function
  const togglePublish = async () => {
    if (!quiz) return;
    
    try {
      const updatedQuizData = {
        ...quiz,
        published: !quiz.published
      };
      
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${courseId}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuizData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedQuiz = await response.json();
      setQuiz(updatedQuiz);
      
    } catch (err: any) {
      console.error('Error toggling publish:', err);
      alert('Failed to update quiz: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />
          {error || 'Quiz not found'}
          <div className="mt-2">
            <button className="btn btn-outline-danger btn-sm me-2" onClick={fetchQuizDetails}>
              Retry
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes`)}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getAvailabilityStatus = () => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

    if (!quiz.published && isStudent) {
      return { status: 'Not Published', color: 'text-muted', canTake: false };
    }

    if (availableDate && now < availableDate) {
      return { 
        status: `Not available until ${availableDate.toLocaleDateString()} at ${availableDate.toLocaleTimeString()}`, 
        color: 'text-warning', 
        canTake: false 
      };
    }

    if (availableUntil && now > availableUntil) {
      return { status: 'Closed', color: 'text-danger', canTake: false };
    }

    if (dueDate && now > dueDate) {
      return { status: 'Past Due', color: 'text-danger', canTake: false };
    }

    return { status: 'Available', color: 'text-success', canTake: true };
  };

  const availability = getAvailabilityStatus();
  const canTakeQuiz = availability.canTake && isStudent;
  const hasExceededAttempts = quiz.multipleAttempts && userAttempts.length >= quiz.attemptLimit;
  const lastAttempt = userAttempts[0]; // Most recent attempt

  const handleStartQuiz = () => {
    if (quiz.accessCode && !showAccessCode) {
      setShowAccessCode(true);
      return;
    }

    if (quiz.accessCode && accessCodeInput !== quiz.accessCode) {
      setError('Incorrect access code');
      return;
    }

    navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/take`);
  };

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/edit`);
  };

  const handlePreviewQuiz = () => {
    navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/preview`);
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold">{quiz.title}</h3>
          <p className="text-muted mb-0">{quiz.description}</p>
        </div>
        
        <div className="d-flex gap-2">
          {isFaculty && (
            <>
              {/* NEW: Publish/Unpublish Button */}
              <button 
                className={`btn ${quiz.published ? 'btn-warning' : 'btn-success'}`}
                onClick={togglePublish}
              >
                <FaRocket className="me-1" size={12} />
                {quiz.published ? 'Unpublish' : 'Publish'}
              </button>
              
              <button className="btn btn-outline-secondary" onClick={handlePreviewQuiz}>
                <FaEye className="me-1" size={12} />
                Preview
              </button>
              <button className="btn btn-primary" onClick={handleEditQuiz}>
                <FaEdit className="me-1" size={12} />
                Edit
              </button>
            </>
          )}
          
          {isStudent && canTakeQuiz && !hasExceededAttempts && (
            <button className="btn btn-success btn-lg" onClick={handleStartQuiz}>
              <FaPlay className="me-2" />
              {lastAttempt ? 'Retake Quiz' : 'Start Quiz'}
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Quiz Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quiz Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Quiz Type</label>
                    <p className="mb-0">{quiz.quizType}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Points</label>
                    <p className="mb-0">{quiz.points}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Questions</label>
                    <p className="mb-0">{quiz.questions.length}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Time Limit</label>
                    <p className="mb-0">
                      <FaClock className="me-1 text-muted" />
                      {quiz.timeLimit} minutes
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Multiple Attempts</label>
                    <p className="mb-0">
                      {quiz.multipleAttempts ? `Yes (${quiz.attemptLimit} attempts)` : 'No'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Show Correct Answers</label>
                    <p className="mb-0">{quiz.showCorrectAnswers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quiz Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className={quiz.shuffleAnswers ? 'text-success' : 'text-muted'}>
                        {quiz.shuffleAnswers ? '✓' : '✗'} Shuffle Answers
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className={quiz.oneQuestionAtATime ? 'text-success' : 'text-muted'}>
                        {quiz.oneQuestionAtATime ? '✓' : '✗'} One Question at a Time
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className={quiz.webcamRequired ? 'text-warning' : 'text-muted'}>
                        {quiz.webcamRequired ? '⚠️' : '✗'} Webcam Required
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className={quiz.lockQuestionsAfterAnswering ? 'text-warning' : 'text-muted'}>
                        {quiz.lockQuestionsAfterAnswering ? '🔒' : '✗'} Lock Questions After Answering
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className={quiz.accessCode ? 'text-warning' : 'text-muted'}>
                        {quiz.accessCode ? '🔑' : '✗'} Access Code Required
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Access Code Input */}
          {showAccessCode && (
            <div className="card border-warning mb-4">
              <div className="card-body">
                <h6 className="card-title">Access Code Required</h6>
                <p className="text-muted">This quiz requires an access code to start.</p>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter access code"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={handleStartQuiz}>
                    Start Quiz
                  </button>
                </div>
                {error && <div className="text-danger small mt-2">{error}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Availability Status */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h6 className="mb-0">Availability</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <span className={`badge ${
                  availability.color === 'text-success' ? 'bg-success' :
                  availability.color === 'text-warning' ? 'bg-warning' :
                  availability.color === 'text-danger' ? 'bg-danger' : 'bg-secondary'
                }`}>
                  {availability.status}
                </span>
              </div>

              {quiz.dueDate && (
                <div className="mb-2">
                  <FaCalendarAlt className="me-2 text-muted" size={12} />
                  <small className="text-muted">Due: {new Date(quiz.dueDate).toLocaleDateString()}</small>
                </div>
              )}

              {quiz.availableDate && (
                <div className="mb-2">
                  <small className="text-muted">Available: {new Date(quiz.availableDate).toLocaleDateString()}</small>
                </div>
              )}

              {quiz.availableUntil && (
                <div className="mb-2">
                  <small className="text-muted">Until: {new Date(quiz.availableUntil).toLocaleDateString()}</small>
                </div>
              )}
            </div>
          </div>

          {/* Student Attempt History */}
          {isStudent && userAttempts.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white">
                <h6 className="mb-0">Your Attempts</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Attempts Used:</span>
                    <span className="fw-bold">
                      {userAttempts.length} / {quiz.multipleAttempts ? quiz.attemptLimit : 1}
                    </span>
                  </div>
                </div>

                {lastAttempt && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Latest Score:</span>
                      <span className="fw-bold">
                        <FaTrophy className="me-1 text-warning" size={12} />
                        {lastAttempt.score} / {lastAttempt.maxScore} ({lastAttempt.percentage}%)
                      </span>
                    </div>
                    <small className="text-muted">
                      Submitted: {new Date(lastAttempt.submittedAt).toLocaleDateString()}
                    </small>
                  </div>
                )}

                {userAttempts.length > 1 && (
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/results`)}
                    >
                      View All Attempts
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Actions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0">Actions</h6>
            </div>
            <div className="card-body">
              {isStudent && (
                <>
                  {!canTakeQuiz && (
                    <div className="alert alert-warning py-2 px-3 small">
                      <FaExclamationTriangle className="me-1" size={12} />
                      {hasExceededAttempts ? 'No attempts remaining' : availability.status}
                    </div>
                  )}
                  
                  {lastAttempt && (
                    <button 
                      className="btn btn-outline-primary btn-sm w-100 mb-2"
                      onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/results`)}
                    >
                      View Results
                    </button>
                  )}
                </>
              )}

              {isFaculty && (
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handlePreviewQuiz}>
                    <FaEye className="me-1" size={12} />
                    Preview
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleEditQuiz}>
                    <FaEdit className="me-1" size={12} />
                    Edit
                  </button>
                </div>
              )}

              <button 
                className="btn btn-outline-secondary btn-sm w-100 mt-2"
                onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes`)}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
