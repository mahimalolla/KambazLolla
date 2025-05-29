import { Link } from "react-router-dom";
import { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";
import { FaRocket, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const quizzes = [
  { 
    _id: "Q1", 
    title: "Q1", 
    due: "May 19 at 11:59pm", 
    points: 29,
    questions: 11,
    status: "Closed"
  },
  { 
    _id: "Q2", 
    title: "Q2", 
    due: "May 21 at 11:59pm", 
    points: 23,
    questions: 6,
    status: "Closed"
  },
  { 
    _id: "Q3", 
    title: "Q3", 
    due: "May 26 at 11:59pm", 
    points: 32,
    questions: 7,
    status: "Closed"
  },
  { 
    _id: "Q4", 
    title: "Q4", 
    due: "May 28 at 11:59pm", 
    points: 17,
    questions: 3,
    status: "Closed"
  },
  { 
    _id: "Q5", 
    title: "Q5", 
    availableUntil: "Jun 2 at 11:59pm",
    due: "Jun 2 at 11:59pm", 
    points: 31,
    questions: 8,
    status: "Available"
  },
  { 
    _id: "X1", 
    title: "X1", 
    availableUntil: "Jun 4 at 11:59pm",
    due: "Jun 4 at 11:59pm", 
    points: 100,
    questions: 15,
    status: "Available"
  },
  { 
    _id: "Q6", 
    title: "Q6", 
    availableUntil: "Jun 3 at 12am",
    due: "Jun 9 at 11:59pm", 
    points: 18,
    questions: 3,
    status: "Not available"
  }
];

export default function QuizList() {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3">
      <Breadcrumbs />
      
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
                    <Link 
                      to={`/Kambaz/Quizzes/${quiz._id}`}
                      className="text-decoration-none text-primary fw-semibold"
                      style={{ fontSize: '15px' }}
                    >
                      {quiz.title}
                    </Link>
                    <BsThreeDotsVertical className="text-muted" style={{ cursor: 'pointer' }} size={14} />
                  </div>
                  
                  <div className="text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <span className="fw-medium">{getStatusText(quiz)}</span>
                    {quiz.status !== "Closed" && getStatusText(quiz) && " | "}
                    <span>Due {quiz.due} | </span>
                    <span>{quiz.points} pts | </span>
                    <span>{quiz.questions} Questions</span>
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