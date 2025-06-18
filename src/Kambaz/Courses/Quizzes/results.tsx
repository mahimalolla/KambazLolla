import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaClock, FaCalendarAlt, FaRedo } from 'react-icons/fa';

interface QuizAttempt {
  attemptId: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  timeSpent: number; // in minutes
  answers: Record<string, any>;
}

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
  maxAttempts: number;
  multipleAttempts: boolean;
  questions: Question[];
}

// Mock data
const mockQuiz: Quiz = {
  _id: "Q1",
  title: "Introduction to React",
  maxAttempts: 3,
  multipleAttempts: true,
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

const mockAttempts: QuizAttempt[] = [
  {
    attemptId: "a1",
    score: 4,
    maxScore: 5,
    percentage: 80,
    submittedAt: "2025-06-15T10:30:00Z",
    timeSpent: 15,
    answers: {
      q1: 0, // correct
      q2: "true", // correct
      q3: "state" // incorrect
    }
  },
  {
    attemptId: "a2",
    score: 5,
    maxScore: 5,
    percentage: 100,
    submittedAt: "2025-06-16T14:20:00Z",
    timeSpent: 12,
    answers: {
      q1: 0, // correct
      q2: "true", // correct
      q3: "useState" // correct
    }
  }
];

export default function QuizResults() {
  const [quiz] = useState<Quiz>(mockQuiz);
  const [attempts] = useState<QuizAttempt[]>(mockAttempts);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt>(attempts[attempts.length - 1]); // Show latest attempt by default
  const [showAllAttempts, setShowAllAttempts] = useState(false);

  const bestScore = Math.max(...attempts.map(a => a.score));
  const bestPercentage = Math.max(...attempts.map(a => a.percentage));
  const latestAttempt = attempts[attempts.length - 1];
  const canRetake = quiz.multipleAttempts && attempts.length < quiz.maxAttempts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-info';
    if (percentage >= 70) return 'text-warning';
    return 'text-danger';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const isQuestionCorrect = (question: Question, answer: any) => {
    if (question.type === 'multiple-choice') {
      return answer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      return answer === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      const userAnswerLower = answer?.toLowerCase().trim();
      return question.possibleAnswers?.some(
        correct => correct.toLowerCase().trim() === userAnswerLower
      );
    }
    return false;
  };

  const renderQuestionReview = (question: Question, index: number) => {
    const userAnswer = selectedAttempt.answers[question._id];
    const isCorrect = isQuestionCorrect(question, userAnswer);

    return (
      <div key={question._id} className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-2">Question {index + 1}</span>
              <h6 className="mb-0">{question.title}</h6>
              <span className="ms-2">
                {isCorrect ? (
                  <FaCheckCircle className="text-success" />
                ) : (
                  <FaTimesCircle className="text-danger" />
                )}
              </span>
            </div>
            <div className="text-end">
              <span className={`fw-bold ${isCorrect ? 'text-success' : 'text-danger'}`}>
                {isCorrect ? question.points : 0} / {question.points}
              </span>
              <div className="small text-muted">points</div>
            </div>
          </div>

          <p className="mb-3">{question.question}</p>

          {question.type === 'multiple-choice' && (
            <div>
              {question.choices?.map((choice, choiceIndex) => (
                <div key={choiceIndex} className={`p-2 mb-2 rounded ${
                  question.correctAnswer === choiceIndex 
                    ? 'bg-success bg-opacity-10 border border-success'
                    : userAnswer === choiceIndex && !isCorrect
                    ? 'bg-danger bg-opacity-10 border border-danger'
                    : 'bg-light'
                }`}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {userAnswer === choiceIndex && (
                        question.correctAnswer === choiceIndex ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimesCircle className="text-danger" />
                        )
                      )}
                      {userAnswer !== choiceIndex && question.correctAnswer === choiceIndex && (
                        <FaCheckCircle className="text-success" />
                      )}
                    </span>
                    <span className={
                      question.correctAnswer === choiceIndex 
                        ? 'fw-bold text-success'
                        : userAnswer === choiceIndex && !isCorrect
                        ? 'text-danger'
                        : ''
                    }>
                      {choice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div>
              <div className={`p-2 mb-2 rounded ${
                question.correctAnswer === 'true'
                  ? 'bg-success bg-opacity-10 border border-success'
                  : userAnswer === 'true' && !isCorrect
                  ? 'bg-danger bg-opacity-10 border border-danger'
                  : 'bg-light'
              }`}>
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    {userAnswer === 'true' && (
                      question.correctAnswer === 'true' ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimesCircle className="text-danger" />
                      )
                    )}
                    {userAnswer !== 'true' && question.correctAnswer === 'true' && (
                      <FaCheckCircle className="text-success" />
                    )}
                  </span>
                  <span className={
                    question.correctAnswer === 'true'
                      ? 'fw-bold text-success'
                      : userAnswer === 'true' && !isCorrect
                      ? 'text-danger'
                      : ''
                  }>
                    True
                  </span>
                </div>
              </div>
              
              <div className={`p-2 mb-2 rounded ${
                question.correctAnswer === 'false'
                  ? 'bg-success bg-opacity-10 border border-success'
                  : userAnswer === 'false' && !isCorrect
                  ? 'bg-danger bg-opacity-10 border border-danger'
                  : 'bg-light'
              }`}>
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    {userAnswer === 'false' && (
                      question.correctAnswer === 'false' ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimesCircle className="text-danger" />
                      )
                    )}
                    {userAnswer !== 'false' && question.correctAnswer === 'false' && (
                      <FaCheckCircle className="text-success" />
                    )}
                  </span>
                  <span className={
                    question.correctAnswer === 'false'
                      ? 'fw-bold text-success'
                      : userAnswer === 'false' && !isCorrect
                      ? 'text-danger'
                      : ''
                  }>
                    False
                  </span>
                </div>
              </div>
            </div>
          )}

          {question.type === 'fill-blank' && (
            <div>
              <div className="mb-2">
                <strong>Your Answer:</strong>
                <span className={`ms-2 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                  "{userAnswer || 'No answer provided'}"
                </span>
              </div>
              <div className="text-success">
                <strong>Correct Answers:</strong>
                <span className="ms-2">{question.possibleAnswers?.join(', ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">{quiz.title} - Results</h3>
          <p className="text-muted mb-0">Quiz attempt results and review</p>
        </div>
        {canRetake && (
          <button className="btn btn-primary">
            <FaRedo className="me-1" />
            Retake Quiz
          </button>
        )}
      </div>

      <div className="row mb-4">
        {/* Score Summary */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaTrophy className="text-warning mb-2" size={32} />
              <h4 className={`fw-bold ${getGradeColor(selectedAttempt.percentage)}`}>
                {selectedAttempt.score} / {selectedAttempt.maxScore}
              </h4>
              <p className="text-muted mb-2">
                {selectedAttempt.percentage}% ({getGradeLetter(selectedAttempt.percentage)})
              </p>
              <small className="text-muted">Latest Attempt</small>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaCheckCircle className="text-success mb-2" size={32} />
              <h4 className="fw-bold text-success">
                {bestScore} / {selectedAttempt.maxScore}
              </h4>
              <p className="text-muted mb-2">
                {bestPercentage}% ({getGradeLetter(bestPercentage)})
              </p>
              <small className="text-muted">Best Score</small>
            </div>
          </div>
        </div>

        {/* Attempt Info */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="mb-3">
                <FaCalendarAlt className="me-2 text-muted" />
                <small className="text-muted">Submitted:</small>
                <br />
                <span className="small">{formatDate(selectedAttempt.submittedAt)}</span>
              </div>
              <div className="mb-3">
                <FaClock className="me-2 text-muted" />
                <small className="text-muted">Time Spent:</small>
                <br />
                <span className="small">{selectedAttempt.timeSpent} minutes</span>
              </div>
              <div>
                <small className="text-muted">Attempts: {attempts.length} / {quiz.maxAttempts}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attempt History Toggle */}
      {attempts.length > 1 && (
        <div className="mb-4">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowAllAttempts(!showAllAttempts)}
          >
            {showAllAttempts ? 'Hide' : 'Show'} All Attempts ({attempts.length})
          </button>
        </div>
      )}

      {/* All Attempts Table */}
      {showAllAttempts && attempts.length > 1 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header">
            <h6 className="mb-0">All Attempts</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Attempt</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Time Spent</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr key={attempt.attemptId}>
                      <td>#{index + 1}</td>
                      <td>{attempt.score} / {attempt.maxScore}</td>
                      <td>
                        <span className={getGradeColor(attempt.percentage)}>
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          attempt.percentage >= 90 ? 'bg-success' :
                          attempt.percentage >= 80 ? 'bg-info' :
                          attempt.percentage >= 70 ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {getGradeLetter(attempt.percentage)}
                        </span>
                      </td>
                      <td>{attempt.timeSpent} min</td>
                      <td className="small">{formatDate(attempt.submittedAt)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedAttempt(attempt)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Question Review */}
      <div className="mb-4">
        <h5>Question Review - Attempt #{attempts.findIndex(a => a.attemptId === selectedAttempt.attemptId) + 1}</h5>
        <p className="text-muted small">
          Review your answers and see the correct solutions
        </p>
      </div>

      {quiz.questions.map((question, index) => renderQuestionReview(question, index))}

      {/* Navigation */}
      <div className="text-center mt-4">
        <button 
          className="btn btn-outline-secondary me-2"
          onClick={() => window.history.back()}
        >
          Back to Quiz List
        </button>
        {canRetake && (
          <button className="btn btn-primary">
            <FaRedo className="me-1" />
            Take Quiz Again
          </button>
        )}
      </div>
    </div>
  );
}
