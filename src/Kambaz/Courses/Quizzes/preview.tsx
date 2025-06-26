import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function QuizPreview() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // NEW: Current question tracking

  useEffect(() => {
    fetchQuiz();
  }, [quizId, cid]);

  const fetchQuiz = async () => {
    if (!cid || !quizId) {
      setError('Missing course ID or quiz ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching quiz preview for:', { cid, quizId });
      
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes/${quizId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched quiz for preview:', data);
      setQuiz(data);
      
    } catch (err: any) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Navigation functions
  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextQuestion = () => {
    if (quiz && quiz.questions) {
      setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1));
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
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
          <h5>Error Loading Quiz Preview</h5>
          <p>{error || 'Quiz not found'}</p>
          <div className="mt-3">
            <button className="btn btn-outline-danger me-2" onClick={fetchQuiz}>
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
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Debug Information:</h6>
          <p><strong>Course ID:</strong> {cid}</p>
          <p><strong>Quiz ID:</strong> {quizId}</p>
          <p><strong>Full URL:</strong> {window.location.href}</p>
          <p><strong>API URL:</strong> https://kambaz-node.onrender.com/api/courses/{cid}/quizzes/{quizId}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions && quiz.questions[currentQuestionIndex];

  return (
    <div className="container-fluid px-4 py-3">
      {/* Preview Mode Banner */}
      <div className="alert alert-info mb-4">
        <div className="d-flex align-items-center">
          <FaEye className="me-2" />
          <strong>PREVIEW MODE</strong>
          <span className="ms-2">- This is how students will see the quiz</span>
        </div>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Preview: {quiz.title}</h3>
          <p className="text-muted mb-0">{quiz.description}</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}
          >
            <FaArrowLeft className="me-1" />
            Back to Details
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`)}
          >
            <FaEdit className="me-1" />
            Edit Quiz
          </button>
        </div>
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
                    <h5 className="text-primary mb-1">{quiz.questions?.length || 0}</h5>
                    <small className="text-muted">Questions</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h5 className="text-success mb-1">{quiz.timeLimit || 20}</h5>
                    <small className="text-muted">Minutes</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h5 className="text-warning mb-1">{quiz.points || 0}</h5>
                    <small className="text-muted">Points</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <h5 className="text-info mb-1">{quiz.oneQuestionAtATime ? 'One' : 'All'}</h5>
                  <small className="text-muted">at a Time</small>
                </div>
              </div>

              {/* Quiz Status Indicators */}
              <div className="alert alert-light mb-4">
                <h6 className="mb-2">Quiz Settings:</h6>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <span className={`badge ${quiz.published ? 'bg-success' : 'bg-danger'}`}>
                    {quiz.published ? 'Published' : 'Unpublished'}
                  </span>
                  <span className="badge bg-secondary">{quiz.quizType}</span>
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

              {/* NEW: Question Preview with Navigation */}
              {quiz.questions && quiz.questions.length > 0 ? (
                <div className="text-start">
                  {/* Question Navigation Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Questions Preview:</h6>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                      </span>
                      
                      {/* Question Number Pills */}
                      <div className="d-flex gap-1">
                        {quiz.questions.map((_: any, index: number) => (
                          <button
                            key={index}
                            className={`btn btn-sm ${
                              index === currentQuestionIndex 
                                ? 'btn-primary' 
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => jumpToQuestion(index)}
                            style={{ width: '35px', height: '35px' }}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Question Display */}
                  {currentQuestion && (
                    <div className="border rounded p-4 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0">Question {currentQuestionIndex + 1}: {currentQuestion.title}</h6>
                        <span className="badge bg-primary">{currentQuestion.points} pts</span>
                      </div>
                      <p className="mb-3">{currentQuestion.question}</p>
                      
                      {/* Question Type Specific Preview */}
                      {currentQuestion.type === 'multiple-choice' && currentQuestion.choices && (
                        <div>
                          <h6 className="small text-muted mb-2">Answer Choices:</h6>
                          {currentQuestion.choices.map((choice: string, index: number) => (
                            <div key={index} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                disabled
                                name={`preview_${currentQuestion._id}`}
                              />
                              <label className="form-check-label">
                                {choice || `Choice ${index + 1}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'true-false' && (
                        <div>
                          <h6 className="small text-muted mb-2">Answer Options:</h6>
                          <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" disabled />
                            <label className="form-check-label">True</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" disabled />
                            <label className="form-check-label">False</label>
                          </div>
                        </div>
                      )}

                      {currentQuestion.type === 'fill-blank' && (
                        <div>
                          <h6 className="small text-muted mb-2">Fill in the Blank:</h6>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Student answer goes here..." 
                            disabled 
                          />
                          {currentQuestion.possibleAnswers && (
                            <small className="text-muted mt-1 d-block">
                              Accepted answers: {currentQuestion.possibleAnswers.join(', ')}
                            </small>
                          )}
                        </div>
                      )}

                      <small className="text-info d-block mt-3">
                        Type: {currentQuestion.type.replace('-', ' ')} | Points: {currentQuestion.points}
                      </small>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <FaChevronLeft className="me-1" />
                      Previous Question
                    </button>

                    <div className="text-center">
                      <small className="text-muted">
                        Navigate between questions to preview the student experience
                      </small>
                    </div>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={goToNextQuestion}
                      disabled={!quiz.questions || currentQuestionIndex === quiz.questions.length - 1}
                    >
                      Next Question
                      <FaChevronRight className="ms-1" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <h6>No Questions Yet</h6>
                  <p className="mb-0">This quiz doesn't have any questions. Add questions in the editor to see the preview.</p>
                </div>
              )}

              <div className="mt-4">
                <button 
                  className="btn btn-success btn-lg me-3"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/take`)}
                >
                  Take Quiz (Student View)
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`)}
                >
                  Edit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
