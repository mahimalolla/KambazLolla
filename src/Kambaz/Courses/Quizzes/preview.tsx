import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaEye } from 'react-icons/fa';

export default function QuizPreview() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

              {/* Quiz Questions Preview */}
              {quiz.questions && quiz.questions.length > 0 && (
                <div className="text-start">
                  <h6 className="mb-3">Questions Preview:</h6>
                  {quiz.questions.map((question: any, index: number) => (
                    <div key={question._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">Question {index + 1}: {question.title}</h6>
                        <span className="badge bg-primary">{question.points} pts</span>
                      </div>
                      <p className="text-muted small">{question.question}</p>
                      <small className="text-info">
                        Type: {question.type.replace('-', ' ')}
                        {question.type === 'multiple-choice' && question.choices && 
                          ` (${question.choices.length} choices)`
                        }
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {(!quiz.questions || quiz.questions.length === 0) && (
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
