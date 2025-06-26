import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { FaPlus, FaRocket } from "react-icons/fa";

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';
  
  const fetchQuizzes = async () => {
    if (!cid) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched quizzes:", data);
      setQuizzes(data);
      
    } catch (err: any) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };
  
  const createQuiz = async () => {
    if (!cid) return;
    
    try {
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Quiz',
          description: '',
          published: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newQuiz = await response.json();
      console.log("Created quiz:", newQuiz);
      
      // Add to list and navigate to editor
      setQuizzes([...quizzes, newQuiz]);
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
      
    } catch (err: any) {
      console.error('Error creating quiz:', err);
      alert('Failed to create quiz: ' + err.message);
    }
  };
  
  // Auto-load quizzes when component mounts
  useEffect(() => {
    if (state.isAuthenticated && state.user && cid && !state.isLoading) {
      fetchQuizzes();
    }
  }, [cid, state.isAuthenticated, state.isLoading]);
  
  if (state.isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="p-4">
        <h5>Access Denied</h5>
        <p>You must be logged in to view quizzes.</p>
        <button onClick={() => navigate('/Kambaz/Account/Signin')}>
          Sign In
        </button>
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">
          Quizzes {isFaculty ? '(Faculty View)' : '(Student View)'}
        </h4>
        {isFaculty && (
          <button className="btn btn-primary" onClick={createQuiz}>
            <FaPlus className="me-1" size={12} />
            Quiz
          </button>
        )}
      </div>
      
      {/* Error State */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={fetchQuizzes}>
            Retry
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading quizzes...</p>
        </div>
      )}
      
      {/* Quiz List */}
      {!loading && (
        <div className="bg-light rounded p-3">
          <h6 className="mb-3">Assignment Quizzes</h6>
          
          {quizzes.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <FaRocket size={32} className="mb-2 opacity-50" />
              <p className="mb-2">
                {isFaculty ? "No quizzes created yet" : "No quizzes available yet"}
              </p>
              {isFaculty && (
                <button className="btn btn-primary btn-sm" onClick={createQuiz}>
                  <FaPlus className="me-1" size={12} />
                  Create Your First Quiz
                </button>
              )}
            </div>
          ) : (
            <div>
              {quizzes.map(quiz => (
                <div key={quiz._id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        {quiz.published ? '✅' : '🚫'}
                        <button
                          className="btn btn-link p-0 ms-2 text-primary fw-semibold text-decoration-none"
                          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}
                        >
                          {quiz.title}
                        </button>
                      </div>
                      <small className="text-muted">
                        {quiz.points || 0} pts | {quiz.questions?.length || 0} questions
                        {quiz.published ? ' | Published' : ' | Unpublished'}
                      </small>
                    </div>
                    {isFaculty && (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
