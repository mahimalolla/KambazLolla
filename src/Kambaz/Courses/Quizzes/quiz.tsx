import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFlag, FaExclamationTriangle } from 'react-icons/fa';
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
  multipleAttempts: boolean;
  attemptLimit: number;
  published: boolean;
  accessCode?: string;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
}

export default function QuizTaking() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<any[]>([]);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  const isStudent = state.user?.role === 'STUDENT';
  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';
  const isPreview = isFaculty; // Faculty can preview, students take for real

  // Fetch quiz and user attempts when component loads
  useEffect(() => {
    if (quizId && cid && state.user) {
      fetchQuiz();
      if (isStudent) {
        fetchUserAttempts();
      }
    }
  }, [quizId, cid, state.user]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted, quizStarted]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes/${quizId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched quiz for taking:', data);
      
      // Check if student can access this quiz
      if (isStudent && !data.published) {
        setError('This quiz is not published yet.');
        setCanTakeQuiz(false);
        return;
      }
      
      setQuiz(data);
      setTimeRemaining(data.timeLimit * 60); // Convert to seconds
      
    } catch (err: any) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes/${quizId}/attempts/${state.user._id}`);
      
      if (response.ok) {
        const attempts = await response.json();
        console.log('User attempts:', attempts);
        setUserAttempts(attempts);
        
        // Check if user can still take the quiz
        if (quiz && !quiz.multipleAttempts && attempts.length > 0) {
          setCanTakeQuiz(false);
          setError('You have already taken this quiz. Multiple attempts are not allowed.');
        } else if (quiz && quiz.multipleAttempts && attempts.length >= quiz.attemptLimit) {
          setCanTakeQuiz(false);
          setError(`You have exhausted all ${quiz.attemptLimit} attempts for this quiz.`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching user attempts:', err);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
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

  const handleSubmit = async () => {
    if (!quiz || !state.user) return;
    
    try {
      setSubmitting(true);
      
      const { totalScore, maxScore: maxScoreCalc } = calculateScore();
      
      // Only submit if this is a real student attempt (not faculty preview)
      if (isStudent) {
        const attemptData = {
          userId: state.user._id,
          answers,
          timeSpent: quiz.timeLimit - Math.floor(timeRemaining / 60)
        };
        
        const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes/${quizId}/attempts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attemptData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Quiz attempt submitted:', result);
        
        setScore(result.score);
        setMaxScore(result.maxScore);
      } else {
        // Faculty preview - just calculate score locally
        setScore(totalScore);
        setMaxScore(maxScoreCalc);
      }
      
      setIsSubmitted(true);
      setShowResults(true);
      
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      alert('Failed to submit quiz: ' + err.message);
    } finally {
      setSubmitting(false);
    }
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
          <p className="mt-2 text-muted">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />
          <strong>Unable to Load Quiz</strong>
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

  if (!canTakeQuiz && isStudent) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-warning">
          <FaExclamationTriangle className="me-2" />
          <strong>Cannot Take Quiz</strong>
          <p className="mb-2 mt-2">{error}</p>
          {userAttempts.length > 0 && (
            <button 
              className="btn btn-outline-primary me-2"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/results`)}
            >
              View Results
            </button>
          )}
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

  // Quiz start screen (before timer starts)
  if (!quizStarted && !showResults) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                {isPreview && (
                  <div className="alert alert-info mb-4">
                    <strong>PREVIEW MODE</strong> - This is how students will see the quiz
                  </div>
                )}
                
                <h3 className="fw-bold mb-3">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-muted mb-4">{quiz.description}</p>
                )}

                <div className="row text-center mb-4">
                  <div className="col-md-4">
                    <h5 className="text-primary mb-1">{quiz.questions.length}</h5>
                    <small className="text-muted">Questions</small>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-success mb-1">{quiz.timeLimit}</h5>
                    <small className="text-muted">Minutes</small>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-warning mb-1">{quiz.questions.reduce((sum, q) => sum + q.points, 0)}</h5>
                    <small className="text-muted">Points</small>
                  </div>
                </div>

                {userAttempts.length > 0 && (
                  <div className="alert alert-info mb-4">
                    <h6>Previous Attempts:</h6>
                    <p className="mb-0">
                      You have taken this quiz {userAttempts.length} time(s). 
                      {quiz.multipleAttempts && (
                        <span> You have {quiz.attemptLimit - userAttempts.length} attempt(s) remaining.</span>
                      )}
                    </p>
                  </div>
                )}

                <button 
                  className="btn btn-primary btn-lg"
                  onClick={startQuiz}
                >
                  <FaFlag className="me-2" />
                  {userAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </button>

                <div className="mt-3">
                  <small className="text-muted">
                    {isPreview 
                      ? 'Preview mode: Your answers will not be saved' 
                      : 'Make sure you have a stable internet connection'
                    }
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
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return (
      <div className="container-fluid px-4 py-3">
        {isPreview && (
          <div className="alert alert-info">
            <strong>PREVIEW MODE</strong> - This is how students will see their results
          </div>
        )}
        
        <div className="text-center mb-4">
          <h3 className="fw-bold">Quiz Results</h3>
          <div className="card border-0 shadow-sm d-inline-block p-4">
            <h2 className={`mb-0 ${percentage >= 70 ? 'text-success' : 'text-danger'}`}>
              {score} / {maxScore}
            </h2>
            <p className="text-muted mb-0">({percentage}%)</p>
          </div>
        </div>

        <div className="mb-4">
          <h5>Review Your Answers:</h5>
        </div>

        {quiz.questions.map((question, index) => renderQuestion(question, index))}

        <div className="text-center mt-4">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
          {isStudent && canTakeQuiz && quiz.multipleAttempts && userAttempts.length < quiz.attemptLimit && (
            <button 
              className="btn btn-success ms-2"
              onClick={() => window.location.reload()}
            >
              Take Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active quiz taking view
  return (
    <div className="container-fluid px-4 py-3">
      {isPreview && (
        <div className="position-fixed top-0 start-0 w-100 bg-info text-white text-center py-2" style={{ zIndex: 1050 }}>
          <strong>PREVIEW MODE</strong> - This is how students will take the quiz
        </div>
      )}
      
      <div style={{ paddingTop: isPreview ? '50px' : '0' }}>
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
                      disabled={isSubmitted || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
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
                    disabled={isSubmitted || submitting || Object.keys(answers).length === 0}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
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
