import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No useEffect! Manual fetch function instead
  const handleFetchQuizzes = async () => {
    if (!cid) return;
    
    setLoading(true);
    setError(null);
    
    try {
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
    } finally {
      setLoading(false);
    }
  };

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

  // Simple guards - no complex logic
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

  const isFaculty = state.user.role === 'FACULTY' || state.user.role === 'ADMIN';

  return (
    <div className="container-fluid px-4 py-3">
      <div className="mb-3">
        <h4>Quizzes {isFaculty ? '(Faculty View)' : '(Student View)'}</h4>
        <p>Course ID: {cid}</p>
        <p>User: {state.user.firstName} {state.user.lastName} ({state.user.role})</p>
      </div>

      <div className="mb-3">
        <button 
          className="btn btn-secondary me-2" 
          onClick={handleFetchQuizzes}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Quizzes'}
        </button>
        
        {isFaculty && (
          <button 
            className="btn btn-primary"
            onClick={handleCreateQuiz}
          >
            + Create Quiz
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="bg-light rounded p-3">
        <h6>Assignment Quizzes</h6>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-4">
            <p>
              {loading ? 'Loading...' : 'Click "Load Quizzes" to fetch quizzes from the API'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-success">Found {quizzes.length} quiz(es):</p>
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
