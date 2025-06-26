import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaQuestionCircle, FaCog, FaCalendarAlt, FaEye, FaClock, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
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

export default function QuizEditor() {
  const { cid, quizId } = useParams(); // Get course ID and quiz ID from URL
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz details state
  const [quiz, setQuiz] = useState({
    _id: '',
    title: 'New Quiz',
    description: '',
    quizType: 'Graded Quiz',
    points: 0,
    assignmentGroup: 'Quizzes',
    shuffleAnswers: true,
    timeLimit: 20,
    hasTimeLimit: true, // NEW: Checkbox for time limit
    multipleAttempts: false,
    attemptLimit: 1,
    showCorrectAnswers: 'Immediately',
    accessCode: '',
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: '',
    availableDate: '',
    availableUntil: '',
    published: false,
    questions: []
  });

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  // 🔍 ADD DEBUGGING: Log URL params when component loads
  useEffect(() => {
    console.log('🔍 QuizEditor mounted with params:', { cid, quizId });
    console.log('🌐 Current URL:', window.location.href);
  }, [cid, quizId]);

  // Fetch quiz data when component loads
  useEffect(() => {
    if (quizId && cid) {
      console.log('🔄 Fetching quiz with params:', { cid, quizId });
      fetchQuiz();
    } else {
      console.error('❌ Missing required params:', { cid, quizId });
      setError('Missing course ID or quiz ID');
      setLoading(false);
    }
  }, [quizId, cid]);

  // 🔧 UPDATED: fetchQuiz function using client
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching quiz using client:', { cid, quizId });
      
      const data = await quizClient.findQuizById(cid!, quizId!);
      console.log('✅ Fetched quiz successfully:', {
        id: data._id,
        title: data.title,
        questionCount: data.questions?.length || 0
      });
      
      // Convert dates for datetime-local inputs
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 16) : '',
        availableDate: data.availableDate ? new Date(data.availableDate).toISOString().slice(0, 16) : '',
        availableUntil: data.availableUntil ? new Date(data.availableUntil).toISOString().slice(0, 16) : '',
        hasTimeLimit: data.timeLimit > 0
      };
      
      setQuiz(formattedData);
      setQuestions(data.questions || []);
      
    } catch (err: any) {
      console.error('💥 Error fetching quiz:', err);
      setError('Failed to load quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 UPDATED: saveQuiz function using client
  const saveQuiz = async (publish = false) => {
    try {
      setSaving(true);
      setError(null);
      
      console.log('💾 Starting saveQuiz using client:', { cid, quizId, publish });
      
      if (!cid || !quizId) {
        throw new Error(`Missing required parameters: cid=${cid}, quizId=${quizId}`);
      }
      
      // 🔧 Create clean quiz data
      const quizData = {
        title: quiz.title,
        description: quiz.description,
        quizType: quiz.quizType,
        assignmentGroup: quiz.assignmentGroup,
        shuffleAnswers: quiz.shuffleAnswers,
        timeLimit: quiz.hasTimeLimit ? quiz.timeLimit : 0,
        multipleAttempts: quiz.multipleAttempts,
        attemptLimit: quiz.attemptLimit,
        showCorrectAnswers: quiz.showCorrectAnswers,
        accessCode: quiz.accessCode,
        oneQuestionAtATime: quiz.oneQuestionAtATime,
        webcamRequired: quiz.webcamRequired,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering,
        published: publish || quiz.published,
        points: questions.reduce((sum, q) => sum + q.points, 0),
        
        // Convert datetime-local back to ISO strings - with null checks
        dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : null,
        availableDate: quiz.availableDate ? new Date(quiz.availableDate).toISOString() : null,
        availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString() : null,
        
        // Include questions array
        questions: questions
      };
      
      console.log('📝 Quiz data to save:', {
        title: quizData.title,
        published: quizData.published,
        questionCount: quizData.questions.length,
        points: quizData.points
      });
      
      const updatedQuiz = await quizClient.updateQuiz(cid, quizId, quizData);
      console.log('✅ Quiz saved successfully:', {
        id: updatedQuiz._id,
        title: updatedQuiz.title,
        published: updatedQuiz.published
      });
      
      // Update local state
      setQuiz(prev => ({
        ...prev,
        ...updatedQuiz,
        hasTimeLimit: updatedQuiz.timeLimit > 0
      }));
      
      // Success feedback
      const message = publish ? 'Quiz saved and published successfully!' : 'Quiz saved successfully!';
      alert(message);
      
      // Navigation - don't navigate immediately, let user see success
      setTimeout(() => {
        if (publish) {
          navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } else {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
        }
      }, 1000);
      
    } catch (err: any) {
      console.error('💥 Error saving quiz:', err);
      setError('Failed to save quiz: ' + err.message);
      alert('Failed to save quiz: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 🔧 UPDATED: saveQuestion function using client
  const saveQuestion = async () => {
    if (!editingQuestion) {
      console.log('❌ No question to save');
      return;
    }
    
    try {
      console.log('💾 Starting saveQuestion using client:', {
        questionId: editingQuestion._id,
        isNew: editingQuestion._id.startsWith('q_'),
        type: editingQuestion.type,
        title: editingQuestion.title
      });
      
      if (!cid || !quizId) {
        throw new Error(`Missing required parameters: cid=${cid}, quizId=${quizId}`);
      }
      
      const isNewQuestion = editingQuestion._id.startsWith('q_');
      
      // 🔧 Clean question data
      const questionData = {
        type: editingQuestion.type,
        title: editingQuestion.title,
        points: editingQuestion.points,
        question: editingQuestion.question,
        ...(editingQuestion.type === 'multiple-choice' && {
          choices: editingQuestion.choices,
          correctAnswer: editingQuestion.correctAnswer
        }),
        ...(editingQuestion.type === 'true-false' && {
          correctAnswer: editingQuestion.correctAnswer
        }),
        ...(editingQuestion.type === 'fill-blank' && {
          possibleAnswers: editingQuestion.possibleAnswers
        })
      };
      
      console.log('📝 Question data to save:', questionData);
      
      if (isNewQuestion) {
        // Create new question using client
        const newQuestion = await quizClient.addQuestion(cid, quizId, questionData);
        console.log('✅ Question created successfully:', newQuestion._id);
        
        setQuestions([...questions, newQuestion]);
        
      } else {
        // Update existing question using client
        const updatedQuestion = await quizClient.updateQuestion(cid, quizId, editingQuestion._id, questionData);
        console.log('✅ Question updated successfully:', updatedQuestion._id);
        
        setQuestions(questions.map(q => 
          q._id === editingQuestion._id ? updatedQuestion : q
        ));
      }
      
      setEditingQuestion(null);
      setIsEditingQuestion(false);
      
      alert(isNewQuestion ? 'Question added successfully!' : 'Question updated successfully!');
      
    } catch (err: any) {
      console.error('💥 Error saving question:', err);
      alert('Failed to save question: ' + err.message);
    }
  };

  // 🔧 UPDATED: deleteQuestion function using client
  const deleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting question using client:', questionId);
      
      if (!cid || !quizId) {
        throw new Error(`Missing required parameters: cid=${cid}, quizId=${quizId}`);
      }
      
      await quizClient.deleteQuestion(cid, quizId, questionId);
      console.log('✅ Question deleted successfully');
      
      setQuestions(questions.filter(q => q._id !== questionId));
      alert('Question deleted successfully!');
      
    } catch (err: any) {
      console.error('💥 Error deleting question:', err);
      alert('Failed to delete question: ' + err.message);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    console.log('📝 Input change:', { field, value });
    setQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addNewQuestion = () => {
    console.log('➕ Adding new question');
    const newQuestion: Question = {
      _id: `q_${Date.now()}`,
      type: 'multiple-choice',
      title: `Question ${questions.length + 1}`,
      points: 1,
      question: '',
      choices: ['', '', '', ''],
      correctAnswer: 0
    };
    setEditingQuestion(newQuestion);
    setIsEditingQuestion(true);
  };

  const editQuestion = (question: Question) => {
    console.log('✏️ Editing question:', question._id);
    setEditingQuestion({ ...question });
    setIsEditingQuestion(true);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

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

  if (error) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="alert alert-danger">
          <h5>Error Loading Quiz</h5>
          <p>{error}</p>
          <div className="mt-3">
            <button className="btn btn-outline-danger me-2" onClick={fetchQuiz}>
              Retry
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
              Back to Quizzes
            </button>
          </div>
        </div>
        
        {/* 🔍 Debug Info */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Debug Information:</h6>
          <p><strong>Course ID:</strong> {cid || 'MISSING'}</p>
          <p><strong>Quiz ID:</strong> {quizId || 'MISSING'}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Error:</strong> {error}</p>
        </div>
      </div>
    );
  }

  const renderQuestionEditor = () => {
    if (!editingQuestion) return null;

    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            {editingQuestion._id.startsWith('q_') ? 'New Question' : 'Edit Question'}
          </h6>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Question Title</label>
              <input
                type="text"
                className="form-control"
                value={editingQuestion.title}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  title: e.target.value
                })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Points</label>
              <input
                type="number"
                className="form-control"
                value={editingQuestion.points}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  points: parseInt(e.target.value) || 0
                })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Question Type</label>
            <select
              className="form-select"
              value={editingQuestion.type}
              onChange={(e) => setEditingQuestion({
                ...editingQuestion,
                type: e.target.value as Question['type']
              })}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="fill-blank">Fill in the Blank</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Question Text</label>
            <textarea
              className="form-control"
              rows={3}
              value={editingQuestion.question}
              onChange={(e) => setEditingQuestion({
                ...editingQuestion,
                question: e.target.value
              })}
              placeholder="Enter your question..."
            />
          </div>

          {editingQuestion.type === 'multiple-choice' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Answer Choices</label>
              {editingQuestion.choices?.map((choice, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div className="form-check me-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="correctAnswer"
                      checked={editingQuestion.correctAnswer === index}
                      onChange={() => setEditingQuestion({
                        ...editingQuestion,
                        correctAnswer: index
                      })}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...(editingQuestion.choices || [])];
                      newChoices[index] = e.target.value;
                      setEditingQuestion({
                        ...editingQuestion,
                        choices: newChoices
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {editingQuestion.type === 'true-false' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Correct Answer</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tfAnswer"
                  checked={editingQuestion.correctAnswer === 'true'}
                  onChange={() => setEditingQuestion({
                    ...editingQuestion,
                    correctAnswer: 'true'
                  })}
                />
                <label className="form-check-label">True</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tfAnswer"
                  checked={editingQuestion.correctAnswer === 'false'}
                  onChange={() => setEditingQuestion({
                    ...editingQuestion,
                    correctAnswer: 'false'
                  })}
                />
                <label className="form-check-label">False</label>
              </div>
            </div>
          )}

          {editingQuestion.type === 'fill-blank' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Possible Correct Answers</label>
              <small className="text-muted d-block mb-2">
                Enter multiple possible answers (case-insensitive)
              </small>
              {(editingQuestion.possibleAnswers || ['']).map((answer, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Answer ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...(editingQuestion.possibleAnswers || [''])];
                      newAnswers[index] = e.target.value;
                      setEditingQuestion({
                        ...editingQuestion,
                        possibleAnswers: newAnswers
                      });
                    }}
                  />
                  {(editingQuestion.possibleAnswers || ['']).length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => {
                        const newAnswers = editingQuestion.possibleAnswers?.filter((_, i) => i !== index);
                        setEditingQuestion({
                          ...editingQuestion,
                          possibleAnswers: newAnswers
                        });
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditingQuestion({
                  ...editingQuestion,
                  possibleAnswers: [...(editingQuestion.possibleAnswers || ['']), '']
                })}
              >
                <FaPlus className="me-1" size={12} />
                Add Answer
              </button>
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditingQuestion(null);
                setIsEditingQuestion(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={saveQuestion}
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Edit Quiz</h4>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
            {quiz.title} (ID: {quizId})
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/preview`)}
          >
            <FaEye className="me-1" size={12} />
            Preview
          </button>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            <FaTimes className="me-1" size={12} />
            Cancel
          </button>
          <button 
            className="btn btn-success btn-sm" 
            onClick={() => saveQuiz(false)}
            disabled={saving}
          >
            <FaSave className="me-1" size={12} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({questions.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Details Tab Content */}
      {activeTab === 'details' && (
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Details */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0 fw-semibold">Details</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={quiz.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Instructions</label>
                  <div className="border rounded" style={{ minHeight: '150px' }}>
                    <div className="bg-light border-bottom p-2">
                      <small className="text-muted">Rich Content Editor</small>
                    </div>
                    <textarea 
                      className="form-control border-0"
                      rows={5}
                      value={quiz.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter quiz instructions..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Quiz Type</label>
                    <select 
                      className="form-select"
                      value={quiz.quizType}
                      onChange={(e) => handleInputChange('quizType', e.target.value)}
                    >
                      <option value="Graded Quiz">Graded Quiz</option>
                      <option value="Practice Quiz">Practice Quiz</option>
                      <option value="Graded Survey">Graded Survey</option>
                      <option value="Ungraded Survey">Ungraded Survey</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Assignment Group</label>
                    <select 
                      className="form-select"
                      value={quiz.assignmentGroup}
                      onChange={(e) => handleInputChange('assignmentGroup', e.target.value)}
                    >
                      <option value="Quizzes">Quizzes</option>
                      <option value="Assignments">Assignments</option>
                      <option value="Exams">Exams</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex align-items-center">
                  <FaCog className="me-2 text-muted" size={14} />
                  <h6 className="mb-0 fw-semibold">Options</h6>
                </div>
              </div>
              <div className="card-body">
                {/* NEW: Time Limit with Checkbox */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={quiz.hasTimeLimit}
                        onChange={(e) => handleInputChange('hasTimeLimit', e.target.checked)}
                        id="hasTimeLimit"
                      />
                      <label className="form-check-label fw-semibold" htmlFor="hasTimeLimit">
                        <FaClock className="me-1 text-muted" size={12} />
                        Time Limit
                      </label>
                    </div>
                    {quiz.hasTimeLimit && (
                      <div className="input-group">
                        <input 
                          type="number"
                          className="form-control"
                          value={quiz.timeLimit}
                          onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                        />
                        <span className="input-group-text">Minutes</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Multiple Attempts</label>
                    <select 
                      className="form-select"
                      value={quiz.multipleAttempts.toString()}
                      onChange={(e) => handleInputChange('multipleAttempts', e.target.value === 'true')}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>

                {/* NEW: Attempt Limit Field */}
                {quiz.multipleAttempts && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Number of Attempts Allowed</label>
                      <input 
                        type="number"
                        className="form-control"
                        value={quiz.attemptLimit}
                        onChange={(e) => handleInputChange('attemptLimit', parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                      />
                      <small className="text-muted">Students can take this quiz up to this many times</small>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Show Correct Answers</label>
                  <select 
                    className="form-select"
                    value={quiz.showCorrectAnswers}
                    onChange={(e) => handleInputChange('showCorrectAnswers', e.target.value)}
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="After Last Attempt">After Last Attempt</option>
                    <option value="After Due Date">After Due Date</option>
                    <option value="Never">Never</option>
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check mb-3">
                      <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={quiz.shuffleAnswers}
                        onChange={(e) => handleInputChange('shuffleAnswers', e.target.checked)}
                        id="shuffleAnswers"
                      />
                      <label className="form-check-label" htmlFor="shuffleAnswers">
                        Shuffle Answers
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mb-3">
                      <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={quiz.oneQuestionAtATime}
                        onChange={(e) => handleInputChange('oneQuestionAtATime', e.target.checked)}
                        id="oneQuestionAtATime"
                      />
                      <label className="form-check-label" htmlFor="oneQuestionAtATime">
                        One Question at a Time
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Dates Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex align-items-center">
                  <FaCalendarAlt className="me-2 text-muted" size={14} />
                  <h6 className="mb-0 fw-semibold">Dates</h6>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Due Date</label>
                    <input 
                      type="datetime-local"
                      className="form-control"
                      value={quiz.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Available From</label>
                    <input 
                      type="datetime-local"
                      className="form-control"
                      value={quiz.availableDate}
                      onChange={(e) => handleInputChange('availableDate', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Available Until</label>
                    <input 
                      type="datetime-local"
                      className="form-control"
                      value={quiz.availableUntil}
                      onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0 fw-semibold">Quiz Summary</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Points</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={totalPoints}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <small className="text-muted">Auto-calculated from questions</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Questions</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={questions.length}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <div className="d-flex align-items-center">
                    <span className={`badge ${quiz.published ? 'bg-success' : 'bg-warning'}`}>
                      {quiz.published ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab Content */}
      {activeTab === 'questions' && (
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">Quiz Questions</h5>
                <small className="text-muted">Total Points: {totalPoints}</small>
              </div>
              <button
                className="btn btn-primary"
                onClick={addNewQuestion}
                disabled={isEditingQuestion}
              >
                <FaPlus className="me-1" size={12} />
                New Question
              </button>
            </div>

            {isEditingQuestion && renderQuestionEditor()}

            {questions.length === 0 && !isEditingQuestion ? (
              <div className="text-center py-5 text-muted">
                <FaQuestionCircle size={48} className="mb-3 opacity-50" />
                <p className="mb-0">No questions added yet</p>
                <small>Click "New Question" to get started</small>
              </div>
            ) : (
              <div className="row">
                {questions.map((question, index) => (
                  <div key={question._id} className="col-12 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-secondary me-2">
                                {question.type.replace('-', ' ').toUpperCase()}
                              </span>
                              <h6 className="mb-0">{question.title}</h6>
                              <span className="ms-auto text-muted">
                                {question.points} {question.points === 1 ? 'pt' : 'pts'}
                              </span>
                            </div>
                            <p className="text-muted mb-2 small">
                              {question.question || 'No question text provided'}
                            </p>
                          </div>
                          <div className="ms-3">
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() => editQuestion(question)}
                              disabled={isEditingQuestion}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteQuestion(question._id)}
                              disabled={isEditingQuestion}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          Cancel
        </button>
        <button 
          className="btn btn-outline-primary"
          onClick={() => saveQuiz(true)}
          disabled={saving}
        >
          Save & Publish
        </button>
        <button 
          className="btn btn-success"
          onClick={() => saveQuiz(false)}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
