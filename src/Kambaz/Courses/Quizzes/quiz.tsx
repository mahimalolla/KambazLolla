import { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFlag } from 'react-icons/fa';

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
}

// Mock data
const mockQuiz: Quiz = {
  _id: "Q1",
  title: "Introduction to React",
  description: "Test your knowledge of React fundamentals",
  timeLimit: 20,
  oneQuestionAtATime: false,
  shuffleAnswers: true,
  questions: [
    {
      _id: "q1",
      type: "multiple-choice",
      title: "Question 1",
      points: 2,
      question: "What is JSX?",
      choices: ["A JavaScript extension", "A CSS framework", "A database", "A server"],
      correctAnswer: 0
    },
    {
      _id: "q2", 
      type: "true-false",
      title: "Question 2",
      points: 1,
      question: "React components must start with a capital letter.",
      correctAnswer: "true"
    },
    {
      _id: "q3",
      type: "fill-blank",
      title: "Question 3", 
      points: 2,
      question: "The _____ hook is used to manage state in functional components.",
      possibleAnswers: ["useState", "use state", "usestate"]
    }
  ]
};

export default function QuizTaking() {
  const [quiz] = useState<Quiz>(mockQuiz);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isPreview, setIsPreview] = useState(false); // Toggle for faculty preview mode

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

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

    return { totalScore, maxScore };
  };

  const handleSubmit = () => {
    const { totalScore, maxScore } = calculateScore();
    setScore(totalScore);
    setIsSubmitted(true);
    setShowResults(true);

    // Here you would typically save the attempt to the backend
    console.log('Quiz submitted:', { answers, score: totalScore, maxScore });
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

  if (showResults) {
    const { maxScore } = calculateScore();
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="container-fluid px-4 py-3">
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
            onClick={() => window.history.back()}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

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
                  disabled={isSubmitted || Object.keys(answers).length === 0}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Mode Toggle (Faculty Only) */}
      {isPreview && (
        <div className="position-fixed top-0 start-0 w-100 bg-warning text-dark text-center py-2" style={{ zIndex: 1050 }}>
          <strong>PREVIEW MODE</strong> - This is how students will see the quiz
        </div>
      )}
    </div>
  );
}
