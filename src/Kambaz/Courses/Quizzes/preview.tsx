import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFlag, FaExclamationTriangle, FaEye, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';
import * as quizClient from './client'; // 🔧 FIXED: Use client instead of fetch

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

interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  oneQuestionAtATime: boolean;
  shuffleAnswers: boolean;
  multipleAttempts: boolean;
  attemptLimit: number;
  published: boolean;
  accessCode?: string;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
  points: number;
  quizType: string;
  showCorrectAnswers: string;
}

export default function QuizPreview() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewStarted, setPreviewStarted] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';

  // Redirect if not faculty
  useEffect(() => {
    if (!state.isLoading && !isFaculty) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    }
  }, [isFaculty, state.isLoading, navigate, cid, quizId]);

  // Fetch quiz when component loads
  useEffect(() => {
    if (quizId && cid && isFaculty) {
      fetchQuiz();
    }
  }, [quizId, cid, isFaculty]);

  // Timer effect for preview
  useEffect(() => {
    if (previewStarted && timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (previewStarted && timeRemaining === 0 && !showResults) {
      handlePreviewComplete();
    }
  }, [timeRemaining, showResults, previewStarted]);

  // 🔧 FIXED: Use client instead of fetch
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!cid || !quizId) {
        throw new Error('Missing course ID or quiz ID');
      }
      
      const data = await quizClient.findQuizById(cid, quizId);
      console.log('Fetched quiz for preview:', data);
      
      setQuiz(data);
      setTimeRemaining(data.timeLimit * 60); // Convert to seconds
      
    } catch (err: any) {
      console.error('Error fetching quiz for preview:', err);
      setError('Failed to load quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPreview = () => {
    setPreviewStarted(true);
    if (quiz) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!quiz) return { totalScore: 0, maxScore: 0 };
    
    let totalScore = 0;
    let maxScoreCalc = 0;

    quiz.questions.forEach(question => {
      maxScoreCalc += question.points;
      const userAnswer = answers[question._id];
      
      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'fill-blank') {
        const userAnswerLower = userAnswer?.toLowerCase().trim();
        const isCorrect = question.possibleAnswers?.some(
          correct => correct.toLowerCase().trim() === userAnswerLower
        );
        if (isCorrect) {
          totalScore += question.points;
        }
      }
    });

    return { totalScore, maxScore: maxScoreCalc };
  };

  const handlePreviewComplete = () => {
    setShowResults(true);
    setShowCorrectAnswers(true);
  };

  const isQuestionCorrect = (question: Question) => {
    const userAnswer = answers[question._id];
    
    if (question.type === 'multiple-choice') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      const userAnswerLower = userAnswer?.toLowerCase().trim();
      return question.possibleAnswers?.some(
        correct => correct.toLowerCase().trim() === userAnswerLower
      );
    }
    return false;
  };

  const renderQuestion = (question: Question, index: number) => {
    const userAnswer = answers[question._id];
    const isCorrect = isQuestionCorrect(question);

    return (
      <div key={question._id} className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-2">Question {index + 1}</span>
              <h6 className="mb-0">{question.title}</h6>
              {showCorrectAnswers && (
                <span className="ms-2">
                  {isCorrect ? (
                    <FaCheckCircle className="text-success" />
                  ) : (
                    <FaTimesCircle className="text-danger" />
                  )}
                </span>
              )}
            </div>
            <span className="text-muted small">{question.points} pts</span>
          </div>

          <p className="mb-3">{question.question}</p>

          {question.type === 'multiple-choice' && (
            <div>
              {question.choices?.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question_${question._id}`}
                    checked={userAnswer === choiceIndex}
                    onChange={() => handleAnswerChange(question._id, choiceIndex)}
                    disabled={showResults}
                  />
                  <label className={`form-check-label ${
                    showCorrectAnswers && question.correctAnswer === choiceIndex 
                      ? 'text-success fw-bold' 
                      : showCorrectAnswers && userAnswer === choiceIndex && !isCorrect
                      ? 'text-danger'
                      : ''
                  }`}>
                    {choice}
                    {showCorrectAnswers && question.correctAnswer === choiceIndex && (
                      <span className="ms-2 text-success">✓ Correct</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question._id}`}
                  checked={userAnswer === 'true'}
                  onChange={() => handleAnswerChange(question._id, 'true')}
                  disabled={showResults}
                />
                <label className={`form-check-label ${
                  showCorrectAnswers && question.correctAnswer === 'true'
                    ? 'text-success fw-bold'
                    : showCorrectAnswers && userAnswer === 'true' && !isCorrect
                    ? 'text-danger'
                    : ''
                }`}>
                  True
                  {showCorrectAnswers && question.correctAnswer === 'true' && (
                    <span className="ms-2 text-success">✓ Correct</span>
                  )}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question._id}`}
                  checked={userAnswer === 'false'}
                  onChange={() => handleAnswerChange(question._id, 'false')}
                  disabled={showResults}
                />
                <label className={`form-check-label ${
                  showCorrectAnswers && question.correctAnswer === 'false'
                    ? 'text-success fw-bold'
                    : showCorrectAnswers && userAnswer === 'false' && !isCorrect
                    ? 'text-danger'
                    : ''
                }`}>
                  False
                  {showCorrectAnswers && question.correctAnswer === 'false' && (
                    <span className="ms-2 text-success">✓ Correct</span>
                  )}
                </label>
              </div>
            </div>
          )}

          {question.type === 'fill-blank' && (
            <div>
              <input
                type="text"
                className={`form-control ${
                  showCorrectAnswers 
                    ? isCorrect 
                      ? 'border-success' 
                      : 'border-danger'
                    : ''
                }`}
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                disabled={showResults}
                placeholder="Type your answer here..."
              />
              {showCorrectAnswers && (
                <small className="text-muted mt-1 d-block">
                  Possible correct answers: {question.possibleAnswers?.join(', ')}
                </small>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading quiz preview...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />
          <strong>Unable to Load Quiz Preview</strong>
          <p className="mb-2 mt-2">{error || 'Quiz not found'}</p>
          <button 
            className="btn btn-outline-danger me-2" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Quiz start screen (before preview starts)
  if (!previewStarted && !showResults) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold">
                  <FaEye className="me-2 text-info" />
                  Quiz Preview
                </h3>
                <p className="text-muted mb-0">Preview how students will see this quiz</p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}
                >
                  <FaArrowLeft className="me-1" size={12} />
                  Back to Details
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`)}
                >
                  <FaEdit className="me-1" size={12} />
                  Edit Quiz
                </button>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="alert alert-info mb-4">
                  <strong>PREVIEW MODE</strong> - This shows exactly how students will see the quiz
                </div>
                
                <h3 className="fw-bold mb-3">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-muted mb-4">{quiz.description}</p>
                )}

                {/* Quiz Stats */}
                <div className="row text-center mb-4">
                  <div className="col-md-3">
                    <h5 className="text-primary mb-1">{quiz.questions.length}</h5>
                    <small className="text-muted">Questions</small>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-success mb-1">{quiz.timeLimit}</h5>
                    <small className="text-muted">Minutes</small>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-warning mb-1">{quiz.points}</h5>
                    <small className="text-muted">Points</small>
                  </div>
                  <div className="col-md-3">
                    <h5 className={`mb-1 ${quiz.published ? 'text-success' : 'text-danger'}`}>
                      {quiz.published ? 'Published' : 'Draft'}
                    </h5>
                    <small className="text-muted">Status</small>
                  </div>
                </div>

                {/* Quiz Settings Summary */}
                <div className="alert alert-light mb-4">
                  <h6 className="mb-2">Quiz Settings:</h6>
                  <div className="row text-start">
                    <div className="col-md-6">
                      <small className="d-block">
                        <strong>Type:</strong> {quiz.quizType}
                      </small>
                      <small className="d-block">
                        <strong>Multiple Attempts:</strong> {quiz.multipleAttempts ? `Yes (${quiz.attemptLimit})` : 'No'}
                      </small>
                      <small className="d-block">
                        <strong>One Question at a Time:</strong> {quiz.oneQuestionAtATime ? 'Yes' : 'No'}
                      </small>
                    </div>
                    <div className="col-md-6">
                      <small className="d-block">
                        <strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? 'Yes' : 'No'}
                      </small>
                      <small className="d-block">
                        <strong>Show Correct Answers:</strong> {quiz.showCorrectAnswers}
                      </small>
                      <small className="d-block">
                        <strong>Access Code:</strong> {quiz.accessCode ? 'Required' : 'None'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Availability Info */}
                {(quiz.availableDate || quiz.dueDate || quiz.availableUntil) && (
                  <div className="alert alert-info mb-4">
                    <h6 className="mb-2">Availability:</h6>
                    <div className="text-start">
                      {quiz.availableDate && (
                        <small className="d-block">
                          <strong>Available from:</strong> {new Date(quiz.availableDate).toLocaleString()}
                        </small>
                      )}
                      {quiz.dueDate && (
                        <small className="d-block">
                          <strong>Due:</strong> {new Date(quiz.dueDate).toLocaleString()}
                        </small>
                      )}
                      {quiz.availableUntil && (
                        <small className="d-block">
                          <strong>Available until:</strong> {new Date(quiz.availableUntil).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </div>
                )}

                {/* Warning if no questions */}
                {quiz.questions.length === 0 && (
                  <div className="alert alert-warning mb-4">
                    <FaExclamationTriangle className="me-2" />
                    <strong>No Questions Added</strong>
                    <p className="mb-0 mt-2">This quiz doesn't have any questions yet. Add questions before publishing.</p>
                  </div>
                )}

                {/* Start Preview Button */}
                <button 
                  className="btn btn-info btn-lg"
                  onClick={startPreview}
                  disabled={quiz.questions.length === 0}
                >
                  <FaFlag className="me-2" />
                  Start Preview
                </button>

                <div className="mt-3">
                  <small className="text-muted">
                    Preview mode: Your answers will not be saved to the database
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const { totalScore, maxScore } = calculateScore();
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-info mb-4">
          <strong>PREVIEW MODE</strong> - This is how students will see their results
        </div>
        
        <div className="text-center mb-4">
          <h3 className="fw-bold">Quiz Results (Preview)</h3>
          <div className="card border-0 shadow-sm d-inline-block p-4">
            <h2 className={`mb-0 ${percentage >= 70 ? 'text-success' : 'text-danger'}`}>
              {totalScore} / {maxScore}
            </h2>
            <p className="text-muted mb-0">({percentage}%)</p>
          </div>
        </div>

        <div className="mb-4">
          <h5>Review Answers (Faculty Preview):</h5>
        </div>

        {quiz.questions.map((question, index) => renderQuestion(question, index))}

        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => {
              setPreviewStarted(false);
              setShowResults(false);
              setShowCorrectAnswers(false);
              setAnswers({});
              setCurrentQuestionIndex(0);
            }}
          >
            Preview Again
          </button>
          <button 
            className="btn btn-primary me-2"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`)}
          >
            <FaEdit className="me-1" size={12} />
            Edit Quiz
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Active preview mode
  return (
    <div className="container-fluid px-4 py-3">
      <div className="position-fixed top-0 start-0 w-100 bg-info text-white text-center py-2" style={{ zIndex: 1050 }}>
        <strong>PREVIEW MODE</strong> - This is exactly how students will take the quiz
      </div>
      
      <div style={{ paddingTop: '50px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold">{quiz.title}</h3>
            <p className="text-muted mb-0">{quiz.description}</p>
          </div>
          
          {/* Timer */}
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-2">
              <div className="d-flex align-items-center">
                <FaClock className="me-2 text-muted" />
                <span className={`fw-bold ${timeRemaining < 300 ? 'text-danger' : 'text-primary'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <small className="text-muted">Time Remaining</small>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Progress</span>
            <span className="text-muted">
              {Object.keys(answers).length} of {quiz.questions.length} answered
            </span>
          </div>
          <div className="progress">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="row">
          <div className="col-12">
            {quiz.oneQuestionAtATime ? (
              <div>
                {renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}
                
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handlePreviewComplete}
                    >
                      Complete Preview
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {quiz.questions.map((question, index) => renderQuestion(question, index))}
                
                <div className="text-center mt-4">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handlePreviewComplete}
                  >
                    Complete Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Controls */}
        <div className="text-center mt-4 pt-3 border-top">
          <small className="text-muted">Preview Controls:</small>
          <div className="mt-2">
            <button 
              className="btn btn-outline-warning btn-sm me-2"
              onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}
            >
              {showCorrectAnswers ? 'Hide' : 'Show'} Correct Answers
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
