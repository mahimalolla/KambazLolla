import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';

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
  accessCode: string;
  published: boolean;
}

export default function QuizPreview() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [previewStarted, setPreviewStarted] = useState(false);
  const [error, setError] = useState('');

  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';

  useEffect(() => {
    if (!isFaculty) {
      navigate(`/Kambaz/Courses/${courseId}/Quizzes`);
      return;
    }
    fetchQuizDetails();
  }, [quizId, courseId, isFaculty]);

  // Timer effect - only runs during preview
  useEffect(() => {
    if (previewStarted && timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (previewStarted && timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted, previewStarted]);

  const fetchQuizDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/quizzes/${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
        setTimeRemaining(data.timeLimit * 60); // Convert to seconds
      } else {
        setError('Failed to load quiz details');
      }
    } catch (error) {
      setError('Error loading quiz');
    } finally {
      setLoading(false);
    }
  };

  const startPreview = () => {
    setPreviewStarted(true);
    setAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
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
    if (!quiz) return { totalScore: 0, maxScore: 0, percentage: 0 };
    
    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach(question => {
      maxScore += question.points;
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

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    return { totalScore, maxScore, percentage };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
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
    const showCorrectAnswer = showResults;

    return (
      <div key={question._id} className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-2">Question {index + 1}</span>
              <h6 className="mb-0">{question.title}</h6>
              {showResults && (
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
                    disabled={isSubmitted}
                  />
                  <label className={`form-check-label ${
                    showCorrectAnswer && question.correctAnswer === choiceIndex 
                      ? 'text-success fw-bold' 
                      : showCorrectAnswer && userAnswer === choiceIndex && !isCorrect
                      ? 'text-danger'
                      : ''
                  }`}>
                    {choice}
                    {showCorrectAnswer && question.correctAnswer === choiceIndex && (
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
                  disabled={isSubmitted}
                />
                <label className={`form-check-label ${
                  showCorrectAnswer && question.correctAnswer === 'true'
                    ? 'text-success fw-bold'
                    : showCorrectAnswer && userAnswer === 'true' && !isCorrect
                    ? 'text-danger'
                    : ''
                }`}>
                  True
                  {showCorrectAnswer && question.correctAnswer === 'true' && (
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
                  disabled={isSubmitted}
                />
                <label className={`form-check-label ${
                  showCorrectAnswer && question.correctAnswer === 'false'
                    ? 'text-success fw-bold'
                    : showCorrectAnswer && userAnswer === 'false' && !isCorrect
                    ? 'text-danger'
                    : ''
                }`}>
                  False
                  {showCorrectAnswer && question.correctAnswer === 'false' && (
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
                  showCorrectAnswer 
                    ? isCorrect 
                      ? 'border-success' 
                      : 'border-danger'
                    : ''
                }`}
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                disabled={isSubmitted}
                placeholder="Type your answer here..."
              />
              {showCorrectAnswer && (
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
          {error || 'Quiz not found'}
        </div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const { totalScore, maxScore, percentage } = calculateScore();

    return (
      <div className="container-fluid px-4 py-3">
        {/* Preview Mode Banner */}
        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-center">
            <FaEye className="me-2" />
            <strong>PREVIEW MODE</strong>
            <span className="ms-2">- This is how students will see the quiz results. Your answers are not saved.</span>
          </div>
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
          <h5>Question Review:</h5>
        </div>

        {quiz.questions.map((question, index) => renderQuestion(question, index))}

        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => {
              setShowResults(false);
              setIsSubmitted(false);
              setPreviewStarted(false);
              setAnswers({});
            }}
          >
            Preview Again
          </button>
          <button 
            className="btn btn-primary me-2"
            onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}/edit`)}
          >
            <FaEdit className="me-1" />
            Edit Quiz
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}`)}
          >
            Back to Details
          </button>
        </div>
      </div>
    );
  }

  // Pre-preview state
  if (!previewStarted) {
    return (
      <div className="container-fluid px-4 py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold">
              <FaEye className="me-2 text-primary" />
              Preview: {quiz.title}
            </h3>
            <p className="text-muted mb-0">This is how students will see this quiz</p>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}`)}
          >
            <FaArrowLeft className="me-1" />
            Back to Details
          </button>
        </div>

        {/* Quiz Information */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <h4 className="fw-bold mb-3">{quiz.title}</h4>
                {quiz.description && (
                  <p className="text-muted mb-4">{quiz.description}</p>
                )}

                <div className="row text-center mb-4">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-primary mb-1">{quiz.questions.length}</h5>
                      <small className="text-muted">Questions</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-success mb-1">{quiz.timeLimit}</h5>
                      <small className="text-muted">Minutes</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-warning mb-1">{quiz.questions.reduce((sum, q) => sum + q.points, 0)}</h5>
                      <small className="text-muted">Points</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-info mb-1">{quiz.oneQuestionAtATime ? 'One' : 'All'}</h5>
                    <small className="text-muted">at a Time</small>
                  </div>
                </div>

                {/* Quiz Status Indicators */}
                <div className="alert alert-warning mb-4">
                  <h6 className="mb-2">Quiz Status:</h6>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <span className={`badge ${quiz.published ? 'bg-success' : 'bg-danger'}`}>
                      {quiz.published ? 'Published' : 'Unpublished'}
                    </span>
                    {quiz.shuffleAnswers && (
                      <span className="badge bg-info">Answers Shuffled</span>
                    )}
                    {quiz.accessCode && (
                      <span className="badge bg-warning">Access Code Required</span>
                    )}
                    {quiz.oneQuestionAtATime && (
                      <span className="badge bg-secondary">One Question at a Time</span>
                    )}
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-lg"
                  onClick={startPreview}
                >
                  <FaEye className="me-2" />
                  Start Preview
                </button>

                <div className="mt-3">
                  <small className="text-muted">
                    Note: This is a preview mode. Your answers will not be saved.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active preview state
  return (
    <div className="container-fluid px-4 py-3">
      {/* Preview Mode Banner */}
      <div className="position-fixed top-0 start-0 w-100 bg-info text-white text-center py-2" style={{ zIndex: 1050 }}>
        <strong>PREVIEW MODE</strong> - This is how students will see the quiz
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
                      onClick={handleSubmit}
                      disabled={isSubmitted}
                    >
                      Submit Quiz
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
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
