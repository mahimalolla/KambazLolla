import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 👈 ADD THESE IMPORTS
import { FaRocket, FaSearch, FaPlus, FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAuth } from "../../../AuthContext";
import * as quizClient from "./client"; // 👈 ADD THIS IMPORT

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams(); // 👈 GET REAL COURSE ID FROM URL
  const navigate = useNavigate(); // 👈 REAL NAVIGATION
  
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState<any[]>([]); // 👈 START WITH EMPTY ARRAY
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 👈 ADD LOADING STATE
  const [error, setError] = useState<string | null>(null); // 👈 ADD ERROR STATE

  // 👈 ADD API FETCH FUNCTION
  const fetchQuizzes = async () => {
    if (!cid) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await quizClient.findQuizzesByCourse(cid);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes');
      setQuizzes([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // 👈 FETCH QUIZZES ON COMPONENT MOUNT
  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  // Handle authentication loading state
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

  // Handle unauthenticated state
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

  // Show loading state for quizzes
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
  const isStudent = state.user.role === 'STUDENT';

  // Filter quizzes based on search and role
  const filteredQuizzes = quizzes
    .filter(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(quiz => {
      // Students only see published quizzes
      if (isStudent) return quiz.published;
      return true; // Faculty see all
    });

  const getStatusText = (quiz: any) => {
    if (quiz.status === "Closed") {
      return "Closed";
    }
    if (quiz.status === "Not available") {
      return `Not available until ${quiz.availableUntil}`;
    }
    if (quiz.availableUntil) {
      return `Available until ${quiz.availableUntil}`;
    }
    return "";
  };

  // 👈 UPDATE HANDLER FUNCTIONS TO USE API
  const handleAddQuiz = async () => {
    if (!cid) return;
    
    try {
      const newQuizData = {
        title: `New Quiz`,
        description: '',
        published: false
      };
      
      const newQuiz = await quizClient.createQuiz(cid, newQuizData);
      setQuizzes([...quizzes, newQuiz]);
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  const handlePublishToggle = async (quizId: string) => {
    if (!cid) return;
    
    const quiz = quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    
    try {
      const updatedQuiz = await quizClient.publishQuiz(cid, quizId, !quiz.published);
      setQuizzes(quizzes.map(q => q._id === quizId ? updatedQuiz : q));
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz');
    }
    setShowContextMenu(null);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!cid) return;
    
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizClient.deleteQuiz(cid, quizId);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
    setShowContextMenu(null);
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
    setShowContextMenu(null);
  };

  const handleTakeQuiz = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/take`);
  };

  const handlePreviewQuiz = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/preview`);
    setShowContextMenu(null);
  };

  const handleQuizDetails = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const ContextMenu = ({ quizId, quiz }: { quizId: string, quiz: any }) => (
    <div className="dropdown-menu show position-absolute" style={{ zIndex: 1000 }}>
      {isFaculty && (
        <>
          <button 
            className="dropdown-item" 
            onClick={() => handleEditQuiz(quizId)}
          >
            <FaEdit className="me-2" size={12} />
            Edit
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => handlePublishToggle(quizId)}
          >
            {quiz.published ? '🚫' : '✅'} {quiz.published ? 'Unpublish' : 'Publish'}
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => handlePreviewQuiz(quizId)}
          >
            👁️ Preview
          </button>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item text-danger" 
            onClick={() => handleDeleteQuiz(quizId)}
          >
            <FaTrash className="me-2" size={12} />
            Delete
          </button>
        </>
      )}
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
          <button 
            className="btn btn-primary"
            onClick={handleAddQuiz}
          >
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
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={fetchQuizzes}>
            Retry
          </button>
        </div>
      )}

      {/* Assignment Quizzes Section */}
      <div className="bg-light rounded p-3">
        <div className="d-flex align-items-center mb-3">
          <span 
            className="me-2 text-dark cursor-pointer" 
            style={{ fontSize: '12px', cursor: 'pointer' }}
          >
            ▼
          </span>
          <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '15px' }}>
            Assignment Quizzes
          </h6>
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && !error && (
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
                  <button className="btn btn-primary btn-sm" onClick={handleAddQuiz}>
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
                          onClick={() => handlePublishToggle(quiz._id)}
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
                          onClick={() => handleQuizDetails(quiz._id)}
                        >
                          {quiz.title}
                        </button>
                      ) : (
                        <button
                          className="btn btn-link p-0 text-primary fw-semibold text-decoration-none"
                          style={{ fontSize: '15px' }}
                          onClick={() => handleTakeQuiz(quiz._id)}
                          disabled={!quiz.published || quiz.status === 'Closed'}
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
                    <span className="fw-medium">{getStatusText(quiz)}</span>
                    {quiz.status !== "Closed" && getStatusText(quiz) && " | "}
                    {quiz.dueDate && <span>Due {new Date(quiz.dueDate).toLocaleDateString()} | </span>}
                    <span>{quiz.points || 0} pts | </span>
                    <span>{quiz.questions ? quiz.questions.length : 0} Questions</span>
                    
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
      </div>
    </div>
  );
}
