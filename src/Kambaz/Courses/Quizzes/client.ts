import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple API test without import
  const fetchQuizzes = async () => {
    if (!cid) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Direct API call without client import for testing
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched quizzes:", data);
      setQuizzes(data);
      
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("QuizList useEffect triggered, courseId:", cid);
    console.log("User:", state.user);
    
    if (state.isAuthenticated && state.user && cid) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [cid, state.isAuthenticated, state.user]);

  if (state.isLoading) {
    return <div className="p-4">Loading auth...</div>;
  }

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="p-4">
        <h5>Access Denied</h5>
        <p>You must be logged in to view quizzes.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/Kambaz/Account/Signin')}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const isFaculty = state.user.role === 'FACULTY' || state.user.role === 'ADMIN';

  // Simple create quiz function
  const handleCreateQuiz = async () => {
    if (!cid) return;
    
    try {
      const response = await fetch(`https://kambaz-node.onrender.com/api/courses/${cid}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setQuizzes([...quizzes, newQuiz]);
      
      // Navigate to editor
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
      
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz: ' + error);
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="mb-3">
        <h4>Quizzes {isFaculty ? '(Faculty View)' : '(Student View)'}</h4>
        <p>Course ID: {cid}</p>
        <p>User: {state.user.firstName} {state.user.lastName} ({state.user.role})</p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={fetchQuizzes}>
            Retry
          </button>
        </div>
      )}

      <div className="bg-light rounded p-3">
        <h6>Assignment Quizzes</h6>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-4">
            <p>
              {error ? 'Error loading quizzes' : 
               isFaculty ? 'No quizzes created yet' : 'No quizzes available yet'}
            </p>
            {isFaculty && !error && (
              <button 
                className="btn btn-primary"
                onClick={handleCreateQuiz}
              >
                + Create Quiz
              </button>
            )}
          </div>
        ) : (
          <div>
            {quizzes.map(quiz => (
              <div key={quiz._id} className="border-bottom py-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6>{quiz.title}</h6>
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
    </div>
  );
}
