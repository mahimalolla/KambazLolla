import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFlag, FaExclamationTriangle, FaPlay, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';
import * as quizClient from './client';

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

interface QuizAttempt {
  _id: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
}

export default function StudentQuizTaking() {
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
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);

  const isStudent = state.user?.role === 'STUDENT';
  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';

  // Check if quiz is available based on dates and publish status
  const checkQuizAvailability = (quiz: Quiz) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

    if (!quiz.published && isStudent) {
      return { canTake: false, reason: 'This quiz is not published yet.' };
    }

    if (availableDate && now < availableDate) {
      return { 
        canTake: false, 
        reason: `This quiz is not available until ${availableDate.toLocaleDateString()} at ${availableDate.toLocaleTimeString()}.` 
      };
    }

    if (availableUntil && now > availableUntil) {
      return { canTake: false, reason: 'This quiz is closed and no longer available.' };
    }

    if (dueDate && now > dueDate) {
      return { canTake: false, reason: 'This quiz is past due and can no longer be taken.' };
    }

    return { canTake: true, reason: '' };
  };

  // Fetch quiz and user attempts when component loads
  useEffect(() => {
    if (quizId && cid && state.user) {
      loadQuizData();
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

  const loadQuizData = async () => {
    await fetchQuiz();
    if (isStudent) {
      setTimeout(() => fetchUserAttempts(), 100);
    }
  };

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!cid || !quizId) {
        throw new Error('Missing course ID or quiz ID');
      }
      
      const data = await quizClient.findQuizById(cid, quizId);
      console.log('Fetched quiz for taking:', data);
      
      // Check quiz availability
      const availability = checkQuizAvailability(data);
      if (!availability.canTake) {
        setError(availability.reason);
        setCanTakeQuiz(false);
        setQuiz(data); // Still set quiz for display purposes
        return;
      }
      
      setQuiz(data);
      setTimeRemaining(data.timeLimit * 60); // Convert to seconds
      
    } catch (err: any) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      if (!cid || !quizId || !state.user?._id) return;

      const attempts = await quizClient.getUserAttempts(cid, quizId, state.user._id);
      console.log('User attempts:', attempts);
      setUserAttempts(attempts);
      
      // Check if user can still take the quiz
      if (quiz && !quiz.multipleAttempts && attempts.length > 0) {
        setCanTakeQuiz(false);
        setError('You have already taken this quiz. Multiple attempts are not allowed.');
        return;
      } 
      
      if (quiz && quiz.multipleAttempts && attempts.length >= quiz.attemptLimit) {
        setCanTakeQuiz(false);
        setError(`You have exhausted all ${quiz.attemptLimit} attempts for this quiz.`);
        return;
      }

      // If we get here, user can still take the quiz
      setCanTakeQuiz(true);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user attempts:', err);
    }
  };

  const startQuiz = () => {
    // Check access code if required
    if (quiz?.accessCode && !showAccessCode) {
      setShowAccessCode(true);
      return;
    }

    if (quiz?.accessCode && accessCodeInput !== quiz.accessCode) {
      setError('Incorrect access code. Please try again.');
      return;
    }

    // Double-check availability before starting
    if (quiz && !checkQuizAvailability(quiz).canTake) {
      setError('Quiz is no longer available.');
      return;
    }
    
    // Check attempt limits
    if (isStudent && quiz) {
      const hasExceededAttempts = quiz.multipleAttempts 
        ? userAttempts.length >= quiz.attemptLimit
        : userAttempts.length > 0;
      
      if (hasExceededAttempts) {
        setError(`You have already used all ${quiz.attemptLimit || 1} allowed attempts.`);
        setCanTakeQuiz(false);
        return;
      }
    }
    
    setQuizStarted(true);
    setError(null);
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
    if (!quiz || !state.user || !cid || !quizId) return;
    
    try {
      setSubmitting(true);
      
      const { totalScore, maxScore: maxScoreCalc } = calculateScore();
      
      // Submit the quiz attempt to the database
      const attemptData = {
        userId: state.user._id,
        answers,
        timeSpent: quiz.timeLimit - Math.floor(timeRemaining / 60)
      };
      
      const result = await quizClient.submitQuizAttempt(cid, quizId, attemptData);
      console.log('Quiz attempt submitted:', result);
      
      setScore(result.score);
      setMaxScore(result.maxScore);
      setPercentage(result.percentage);
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

  const shouldShowCorrectAnswers = () => {
    if (!quiz || !showResults) return false;
    
    switch (quiz.showCorrectAnswers) {
      case 'Immediately':
        return true;
      case 'After Last Attempt':
        return !quiz.multipleAttempts || userAttempts.length >= quiz.attemptLimit;
      case 'After Due Date':
        return quiz.dueDate ? new Date() > new Date(quiz.dueDate) : true;
      case 'Never':
        return false;
      default:
        return true;
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const userAnswer = answers[question._id];
    const isCorrect = isQuestionCorrect(question);
    const showCorrectAnswer = shouldShowCorrectAnswers();

    return (
      <div key={question._id} className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-2">Question {index + 1}</span>
              <h6 className="mb-0">{question.title}</h6>
              {showResults && showCorrectAnswer && (
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
        
        {/* Debug Info for Faculty */}
        {isFaculty && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6>Debug Information (Faculty Only):</h6>
            <p><strong>Course ID:</strong> {cid || 'MISSING'}</p>
            <p><strong>Quiz ID:</strong> {quizId || 'MISSING'}</p>
            <p><strong>User Role:</strong> {state.user?.role || 'UNKNOWN'}</p>
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
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
    const hasExceededAttempts = quiz?.multipleAttempts 
      ? userAttempts.length >= (quiz.attemptLimit || 1)
      : userAttempts.length > 0;
    
    const attemptStatus = checkQuizAvailability(quiz || {} as Quiz);
    const finalCanTake = canTakeQuiz && attemptStatus.canTake && !hasExceededAttempts;

    return (
      <div className="container-fluid px-4 py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Back Button */}
            <div className="mb-3">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}
              >
                <FaArrowLeft className="me-1" size={12} />
                Back to Quiz Details
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
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
                    <h5 className="text-warning mb-1">{quiz.points}</h5>
                    <small className="text-muted">Points</small>
                  </div>
                </div>

                {/* Show attempt information */}
                {isStudent && (
                  <div className="alert alert-info mb-4">
                    <h6>Attempt Information:</h6>
                    <p className="mb-0">
                      You have taken this quiz <strong>{userAttempts.length}</strong> time(s).
                      {quiz.multipleAttempts ? (
                        <>
                          <br />
                          Maximum attempts allowed: <strong>{quiz.attemptLimit}</strong>
                          <br />
                          {hasExceededAttempts ? (
                            <span className="text-danger">
                              <strong>You have used all your attempts.</strong>
                            </span>
                          ) : (
                            <span className="text-success">
                              You have <strong>{quiz.attemptLimit - userAttempts.length}</strong> attempt(s) remaining.
                            </span>
                          )}
                        </>
                      ) : (
                        userAttempts.length > 0 && (
                          <><br /><span className="text-danger">Single attempt quiz - already completed.</span></>
                        )
                      )}
                    </p>
                  </div>
                )}

                {/* Show availability issues */}
                {isStudent && !finalCanTake && (
                  <div className="alert alert-warning mb-4">
                    <FaExclamationTriangle className="me-2" />
                    <strong>Quiz Not Available</strong>
                    <p className="mb-0 mt-2">
                      {hasExceededAttempts 
                        ? `You have used all ${quiz?.attemptLimit || 1} allowed attempts.`
                        : !attemptStatus.canTake 
                        ? attemptStatus.reason
                        : 'Quiz cannot be taken at this time.'
                      }
                    </p>
                  </div>
                )}

                {/* Access Code Input */}
                {showAccessCode && (
                  <div className="card border-warning mb-4">
                    <div className="card-body">
                      <h6 className="card-title">Access Code Required</h6>
                      <p className="text-muted">This quiz requires an access code to start.</p>
                      <div className="input-group mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter access code"
                          value={accessCodeInput}
                          onChange={(e) => setAccessCodeInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
                        />
                        <button className="btn btn-success" onClick={startQuiz}>
                          Start Quiz
                        </button>
                      </div>
                      {error && <div className="text-danger small">{error}</div>}
                    </div>
                  </div>
                )}

                {/* Start button - only show if student can actually take it */}
                {finalCanTake && !showAccessCode && (
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={startQuiz}
                  >
                    <FaPlay className="me-2" />
                    {userAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                  </button>
                )}

                {/* Access code button */}
                {finalCanTake && quiz.accessCode && !showAccessCode && (
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={() => setShowAccessCode(true)}
                  >
                    <FaFlag className="me-2" />
                    {userAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                  </button>
                )}

                {/* Go back button for students who can't take quiz */}
                {isStudent && !finalCanTake && (
                  <div className="mt-3">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                    >
                      Back to Quizzes
                    </button>
                    {userAttempts.length > 0 && (
                      <button 
                        className="btn btn-outline-primary ms-2"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/results`)}
                      >
                        View Results
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  <small className="text-muted">
                    Make sure you have a stable internet connection before starting.
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
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Quiz Completed!</h3>
          <div className="card border-0 shadow-sm d-inline-block p-4">
            <h2 className={`mb-0 ${percentage >= 70 ? 'text-success' : 'text-danger'}`}>
              {score} / {maxScore}
            </h2>
            <p className="text-muted mb-0">({percentage}%)</p>
          </div>
          <p className="mt-2 text-muted">
            Submitted on {new Date().toLocaleString()}
          </p>
        </div>

        {shouldShowCorrectAnswers() && (
          <>
            <div className="mb-4">
              <h5>Review Your Answers:</h5>
            </div>
            {quiz.questions.map((question, index) => renderQuestion(question, index))}
          </>
        )}

        {!shouldShowCorrectAnswers() && (
          <div className="alert alert-info text-center">
            <h6>Quiz Submitted Successfully</h6>
            <p className="mb-0">
              Correct answers will be shown {quiz.showCorrectAnswers.toLowerCase()}.
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <button 
            className="btn btn-primary me-2"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
          
          {canTakeQuiz && quiz.multipleAttempts && userAttempts.length < quiz.attemptLimit - 1 && (
            <button 
              className="btn btn-success"
              onClick={() => window.location.reload()}
            >
              Take Again ({quiz.attemptLimit - userAttempts.length - 1} attempts remaining)
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active quiz taking view
  return (
    <div className="container-fluid px-4 py-3">
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
                <div className="mt-2">
                  <small className="text-muted">
                    Make sure to answer all questions before submitting.
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
