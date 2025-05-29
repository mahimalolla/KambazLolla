import { Link } from "react-router-dom";
import { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";
import { FaPlus, FaRocket, FaClipboardList, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const assignments = [
  { 
    _id: "Q5", 
    title: "Q5", 
    type: "quiz",
    availableUntil: "Jun 2 at 11:59pm",
    due: "Jun 2 at 11:59pm", 
    points: -31,
    status: "available"
  },
  { 
    _id: "A4", 
    title: "A4", 
    type: "assignment",
    due: "Jun 3 at 11:59pm", 
    points: -100,
    status: "available"
  },
  { 
    _id: "X1", 
    title: "X1", 
    type: "quiz",
    availableUntil: "Jun 4 at 11:59pm",
    due: "Jun 4 at 11:59pm", 
    points: -100,
    status: "available"
  },
  { 
    _id: "Q6", 
    title: "Q6", 
    type: "quiz",
    availableUntil: "Jun 3 at 12am",
    due: "Jun 9 at 11:59pm", 
    points: -18,
    status: "not_available"
  },
  { 
    _id: "A5", 
    title: "A5", 
    type: "assignment",
    due: "Jun 10 at 11:59pm", 
    points: -100,
    status: "available"
  },
  { 
    _id: "Q7", 
    title: "Q7", 
    type: "quiz",
    availableUntil: "Jun 5 at 12am",
    due: "Jun 11 at 11:59pm", 
    points: "0/20",
    status: "not_available"
  },
  { 
    _id: "Q8", 
    title: "Q8", 
    type: "quiz",
    availableUntil: "Jun 10 at 12am",
    due: "Jun 16 at 11:59pm", 
    points: -25,
    status: "not_available"
  },
  { 
    _id: "A6", 
    title: "A6", 
    type: "assignment",
    due: "Jun 17 at 11:59pm", 
    points: -100,
    status: "not_available"
  }
];

export default function AssignmentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewBy, setViewBy] = useState("date");

  const getIcon = (type: string) => {
    if (type === "quiz") {
      return <FaRocket className="text-secondary" size={16} />;
    }
    return <FaClipboardList className="text-secondary" size={16} />;
  };

  const getStatusText = (assignment: any) => {
    if (assignment.status === "not_available") {
      return `Not available until ${assignment.availableUntil}`;
    }
    if (assignment.availableUntil) {
      return `Available until ${assignment.availableUntil}`;
    }
    return "";
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3">
      <Breadcrumbs />
      
      {/* Header with Search and Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="position-relative" style={{ minWidth: '300px', maxWidth: '400px' }}>
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={14} />
          <input 
            type="text" 
            className="form-control ps-5 border-0 bg-light rounded-pill"
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '14px' }}
          />
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className={`btn ${viewBy === 'date' ? 'btn-success' : 'btn-outline-secondary'} btn-sm px-3`}
            onClick={() => setViewBy('date')}
            style={{ fontSize: '13px', fontWeight: '500' }}
          >
            SHOW BY DATE
          </button>
          <button 
            className={`btn ${viewBy === 'type' ? 'btn-success' : 'btn-outline-secondary'} btn-sm px-3`}
            onClick={() => setViewBy('type')}
            style={{ fontSize: '13px', fontWeight: '500' }}
          >
            SHOW BY TYPE
          </button>
        </div>
      </div>

      {/* Upcoming Assignments Section */}
      <div className="bg-light rounded p-3 mb-4">
        <div className="d-flex align-items-center mb-3">
          <span 
            className="me-2 text-dark cursor-pointer" 
            style={{ fontSize: '12px', cursor: 'pointer' }}
          >
            ▼
          </span>
          <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '15px' }}>
            Upcoming Assignments
          </h6>
        </div>

        {/* Assignment List */}
        <div className="list-group list-group-flush">
          {filteredAssignments.map((assignment, index) => (
            <div 
              key={assignment._id} 
              className={`list-group-item border-0 px-0 py-3 ${index !== filteredAssignments.length - 1 ? 'border-bottom' : ''}`}
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="d-flex align-items-start">
                <div className="me-3 mt-1">
                  {getIcon(assignment.type)}
                </div>
                
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <Link 
                      to={`/Kambaz/Assignments/${assignment._id}`}
                      className="text-decoration-none text-primary fw-semibold"
                      style={{ fontSize: '15px' }}
                    >
                      {assignment.title}
                    </Link>
                    <BsThreeDotsVertical className="text-muted" style={{ cursor: 'pointer' }} size={14} />
                  </div>
                  
                  <div className="text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    {getStatusText(assignment) && (
                      <span>{getStatusText(assignment)} | </span>
                    )}
                    <span>Due {assignment.due} | </span>
                    <span>
                      {typeof assignment.points === 'string' 
                        ? assignment.points + ' pts'
                        : Math.abs(assignment.points) + ' pts'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Controls (if needed) */}
      <div className="d-flex gap-2 mt-4">
        <button className="btn btn-primary btn-sm">
          <FaPlus className="me-1" size={12} />
          Assignment
        </button>
        <button className="btn btn-outline-secondary btn-sm">
          <FaPlus className="me-1" size={12} />
          Group
        </button>
      </div>
    </div>
  );
}