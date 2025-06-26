import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { FaPlus, FaRocket, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as quizClient from './client'; // 🔧 FIXED: Use client instead of fetch

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  
  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';
  const isStudent = state.user?.role === 'STUDENT';

  // 🔧 FIXED: Use client instead of fetch with better error handling
  const fetchQuizzes = async () => {
    if (!cid) {
      setError('Missing course ID');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching quizzes for course:", cid);
      const data = await quizClient.findQuizzesByCourse(cid);
      console.log("✅ Fetched quizzes successfully:", data);
      
      // Ensure we always have an array
      const safeQuizzes = Array.isArray(data) ? data : [];
      setQuizzes(safeQuizzes);
      
    } catch (err: any) {
      console.error('💥 Error fetching quizzes:', err);
      setError('Failed to load quizzes: ' + (err.message || 'Unknown error'));
      setQuizzes([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  // 🔧 FIXED: Use client instead of fetch with better error handling
  const createQuiz = async () => {
    if (!cid) {
      alert('Missing course ID');
      return;
    }
    
    try {
      console.log("➕ Creating new quiz...");
      const newQuiz = await quizClient.createQuiz(cid, {
        title: 'New Quiz',
        description: '',
        published: false
      });
      console.log("✅ Created quiz successfully:", newQuiz);
      
      // Add to the beginning of the list (most recent first)
      setQuizzes([newQuiz, ...quizzes]);
      
      // Navigate to editor
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
      
    } catch (err: any) {
      console.error('💥 Error creating quiz:', err);
      alert('Failed to create quiz: ' + (err.message || 'Unknown error'));
    }
  };

  // 🔧 FIXED: Use client instead of fetch with improved error handling
  const togglePublish = async (quizId: string) => {
    const quiz = quizzes.find(q => q._id === quizId);
    if (!quiz || !cid) {
      alert('Quiz or course not found');
      return;
    }
    
    try {
      console.log("🚀 Toggling publish for quiz:", quizId, "Current published:", quiz.published);
      
      // Use the client's publishQuiz method
      const updatedQuiz = await quizClient.publishQuiz(cid, quizId, !quiz.published);
      console.log("✅ Published quiz successfully:", updatedQuiz);
      
      // Update the quiz in the list
      setQuizzes(quizzes.map(q => q._id === quizId ? updatedQuiz : q));
      
      // Show success message
      const action = updatedQuiz.published ? 'published' : 'unpublished';
      console.log(`✅ Quiz ${action} successfully`);
      
    } catch (err: any) {
      console.error('💥 Error toggling publish:', err);
      alert('Failed to update quiz: ' + (err.message || 'Unknown error'));
    }
    
    setShowContextMenu(null);
  };

  // 🔧 FIXED: Use client instead of fetch
  const deleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    
    if (!cid) {
      alert('Missing course ID');
      return;
    }
    
    try {
      console.log("🗑️ Deleting quiz:", quizId);
      await quizClient.deleteQuiz(cid, quizId);
      console.log("✅ Deleted quiz successfully");
      
      // Remove from list
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      
    } catch (err: any) {
      console.error('💥 Error deleting quiz:', err);
      alert('Failed to delete quiz: ' + (err.message || 'Unknown error'));
    }
    
    setShowContextMenu(null);
  };

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

    if (!quiz.published && isStudent) {
      return 'Not Published';
    }

    if (availableDate && now < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }

    if (availableUntil && now > availableUntil) {
      return 'Closed';
    }

    if (dueDate && now > dueDate) {
      return 'Past Due';
    }

    return 'Available';
  };

  // Auto-load quizzes when component mounts
  useEffect(() => {
    if (state.isAuthenticated && state.user && cid && !state.isLoading) {
      fetchQuizzes();
    }
  }, [cid, state.isAuthenticated, state.isLoading]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  if (state.isLoading) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="text-center py-5">
          <h5 className="text-danger">Access Denied</h5>
          <p className="text-muted">You must be logged in to view quizzes.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/Kambaz/Account/Signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Filter and sort quizzes
  const filteredQuizzes = quizzes
    .filter(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(quiz => {
      // Students only see published quizzes
      if (isStudent) return quiz.published;
      return true; // Faculty see all
    })
    .sort((a, b) => {
      // Sort by available date (earliest first) - RUBRIC REQUIREMENT
      const dateA = new Date(a.availableDate || a.createdAt || '1970-01-01');
      const dateB = new Date(b.availableDate || b.createdAt || '1970-01-01');
      return dateA.getTime() - dateB.getTime();
    });

  // Context menu component
  const ContextMenu = ({ quizId, quiz }: { quizId: string, quiz: any }) => (
    <div 
      className="dropdown-menu show position-absolute" 
      style={{ 
        zIndex: 1000, 
        right: 0, 
        top: '100%',
        minWidth: '150px',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        className="dropdown-item" 
        onClick={() => {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
          setShowContextMenu(null);
        }}
      >
        <FaEdit className="me-2" size={12} />
        Edit
      </button>
      <button 
        className="dropdown-item" 
        onClick={() => togglePublish(quizId)}
      >
        {quiz.published ? '🚫' : '✅'} {quiz.published ? 'Unpublish' : 'Publish'}
      </button>
      <button 
        className="dropdown-item" 
        onClick={() => {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/preview`);
          setShowContextMenu(null);
        }}
      >
        <FaEye className="me-2" size={12} />
        Preview
      </button>
      <div className="dropdown-divider"></div>
      <button 
        className="dropdown-item text-danger" 
        onClick={() => deleteQuiz(quizId)}
      >
        <FaTrash className="me-2" size={12} />
        Delete
      </button>
    </div>
  );
  
  return (
    <div className="container-fluid px-4 py-3">
      {/* User Context Header */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">
                Logged in as: <strong>{state.user.firstName} {state.user.lastName}</strong> 
                <span className={`ms-2 badge ${
                  isFaculty ? 'bg-primary' : 'bg-success'
                }`}>
                  {state.user.role}
                </span>
              </small>
            </div>
            <div>
              <small className="text-muted">Course: {cid}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">
          Quizzes
          {isFaculty && <small className="text-muted ms-2">(Faculty View)</small>}
          {isStudent && <small className="text-muted ms-2">(Student View)</small>}
        </h4>
        {isFaculty && (
          <button className="btn btn-primary" onClick={createQuiz}>
            <FaPlus className="me-1" size={12} />
            Quiz
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="position-relative" style={{ maxWidth: '350px' }}>
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={14} />
          <input 
            type="text" 
            className="form-control ps-5 border rounded"
            placeholder="Search for Quiz" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>
            <strong>Error:</strong> {error}
          </div>
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
      
      {/* Assignment Quizzes Section */}
      <div className="bg-light rounded p-3">
        <div className="d-flex align-items-center mb-3">
          <span className="me-2 text-dark cursor-pointer" style={{ fontSize: '12px', cursor: 'pointer' }}>
            ▼
          </span>
          <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '15px' }}>
            Assignment Quizzes
          </h6>
        </div>
        
        {/* Empty State */}
        {filteredQuizzes.length === 0 && !loading && (
          <div className="text-center py-4 text-muted">
            <FaRocket size={32} className="mb-2 opacity-50" />
            {searchTerm ? (
              <>
                <p className="mb-2">No quizzes found matching "{searchTerm}"</p>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="mb-2">
                  {isFaculty 
                    ? "No quizzes created yet" 
                    : "No quizzes available yet"
                  }
                </p>
                {isFaculty && (
                  <button className="btn btn-primary btn-sm" onClick={createQuiz}>
                    <FaPlus className="me-1" size={12} />
                    Create Your First Quiz
                  </button>
                )}
                {isStudent && (
                  <small className="text-muted">
                    Check back later or contact your instructor
                  </small>
                )}
              </>
            )}
          </div>
        )}

        {/* Quiz List */}
        {!loading && filteredQuizzes.length > 0 && (
          <div className="list-group list-group-flush">
            {filteredQuizzes.map((quiz, index) => (
              <div 
                key={quiz._id} 
                className={`list-group-item border-0 px-0 py-3 ${index !== filteredQuizzes.length - 1 ? 'border-bottom' : ''}`}
                style={{ backgroundColor: 'transparent' }}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <FaRocket className="text-secondary" size={16} />
                  </div>
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="d-flex align-items-center">
                        {/* Publish Status Icon - Faculty Only */}
                        {isFaculty && (
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => togglePublish(quiz._id)}
                            title={quiz.published ? 'Published - Click to unpublish' : 'Unpublished - Click to publish'}
                          >
                            {quiz.published ? '✅' : '🚫'}
                          </button>
                        )}
                        
                        {/* Quiz Title - Different actions for Faculty vs Student */}
                        {isFaculty ? (
                          <button
                            className="btn btn-link p-0 text-primary fw-semibold text-decoration-none"
                            style={{ fontSize: '15px' }}
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}
                          >
                            {quiz.title}
                          </button>
                        ) : (
                          <button
                            className="btn btn-link p-0 text-primary fw-semibold text-decoration-none"
                            style={{ fontSize: '15px' }}
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`)}
                            disabled={!quiz.published || getAvailabilityStatus(quiz) === 'Closed'}
                          >
                            {quiz.title}
                          </button>
                        )}
                      </div>
                      
                      {/* Context Menu - Faculty Only */}
                      {isFaculty && (
                        <div className="position-relative">
                          <button
                            className="btn btn-link p-0 text-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowContextMenu(showContextMenu === quiz._id ? null : quiz._id);
                            }}
                          >
                            <BsThreeDotsVertical size={14} />
                          </button>
                          {showContextMenu === quiz._id && (
                            <ContextMenu quizId={quiz._id} quiz={quiz} />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {/* Availability Status */}
                      <span className="fw-medium">{getAvailabilityStatus(quiz)}</span>
                      
                      {/* Due Date */}
                      {quiz.dueDate && (
                        <span> | Due {new Date(quiz.dueDate).toLocaleDateString()}</span>
                      )}
                      
                      {/* Points and Questions */}
                      <span> | {quiz.points || 0} pts | </span>
                      <span>{quiz.questions?.length || 0} Questions</span>
                      
                      {/* Show student's score if they're a student */}
                      {isStudent && quiz.userScore !== undefined && (
                        <span> | <strong>Score: {quiz.userScore}/{quiz.points}</strong></span>
                      )}
                      
                      {/* Show publish status for faculty */}
                      {isFaculty && !quiz.published && (
                        <span> | <span className="text-warning">⚠️ Unpublished</span></span>
                      )}
                      
                      {/* Show attempt info for students */}
                      {isStudent && quiz.attempts && (
                        <span> | Attempts: {quiz.attempts.used || 0}/{quiz.attempts.allowed || 1}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Information for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Debug Info (Development Only):</h6>
          <p><strong>Course ID:</strong> {cid}</p>
          <p><strong>User Role:</strong> {state.user?.role}</p>
          <p><strong>Total Quizzes:</strong> {quizzes.length}</p>
          <p><strong>Filtered Quizzes:</strong> {filteredQuizzes.length}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>
      )}
    </div>
  );
}
