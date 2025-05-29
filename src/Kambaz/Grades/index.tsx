import { useState } from "react";
import { FaSearch, FaDownload, FaCog, FaFilter, FaChartBar, FaUser, FaEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const students = [
  {
    id: "001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    grades: { 
      "A1 - HTML": { score: 95, points: 100, submitted: true, late: false },
      "A2 - CSS": { score: 88, points: 100, submitted: true, late: false },
      "Quiz 1": { score: 10, points: 10, submitted: true, late: false }
    },
    totalScore: 193,
    totalPoints: 210,
    percentage: 91.9
  },
  {
    id: "002", 
    name: "Bob Smith",
    email: "bob.smith@email.com",
    grades: {
      "A1 - HTML": { score: 85, points: 100, submitted: true, late: true },
      "A2 - CSS": { score: 92, points: 100, submitted: true, late: false },
      "Quiz 1": { score: 9, points: 10, submitted: true, late: false }
    },
    totalScore: 186,
    totalPoints: 210,
    percentage: 88.6
  },
  {
    id: "003",
    name: "Carol Wilson", 
    email: "carol.wilson@email.com",
    grades: {
      "A1 - HTML": { score: null, points: 100, submitted: false, late: false },
      "A2 - CSS": { score: 78, points: 100, submitted: true, late: false },
      "Quiz 1": { score: 8, points: 10, submitted: true, late: false }
    },
    totalScore: 86,
    totalPoints: 210,
    percentage: 41.0
  }
];

const assignments = ["A1 - HTML", "A2 - CSS", "Quiz 1"];

export default function Grades() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("individual");


  const getTotalGradeDisplay = (student: any) => {
    const percentage = student.percentage;
    let colorClass = "text-success";
    let letterGrade = "A";
    
    if (percentage < 60) {
      colorClass = "text-danger";
      letterGrade = "F";
    } else if (percentage < 70) {
      colorClass = "text-warning"; 
      letterGrade = "D";
    } else if (percentage < 80) {
      colorClass = "text-info";
      letterGrade = "C";
    } else if (percentage < 90) {
      colorClass = "text-primary";
      letterGrade = "B";
    }
    
    return (
      <div className="text-center">
        <div className={`fw-bold ${colorClass}`} style={{ fontSize: '16px' }}>
          {percentage.toFixed(1)}%
        </div>
        <small className={`${colorClass}`} style={{ fontSize: '12px' }}>
          {letterGrade}
        </small>
      </div>
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Gradebook</h4>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
            {students.length} students enrolled
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">
            <FaDownload className="me-1" size={12} />
            Export
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <FaCog className="me-1" size={12} />
            Settings
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-3 align-items-center">
          <div className="position-relative">
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={14} />
            <input 
              type="text" 
              className="form-control ps-5"
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '14px', minWidth: '250px' }}
            />
          </div>
          <button className="btn btn-outline-secondary btn-sm">
            <FaFilter className="me-1" size={12} />
            Filter
          </button>
        </div>
        
        <div className="btn-group" role="group">
          <button 
            className={`btn ${selectedView === 'individual' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
            onClick={() => setSelectedView('individual')}
          >
            <FaUser className="me-1" size={12} />
            Individual View
          </button>
          <button 
            className={`btn ${selectedView === 'learning' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
            onClick={() => setSelectedView('learning')}
          >
            <FaChartBar className="me-1" size={12} />
            Learning Mastery
          </button>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light border-bottom">
              <tr>
                <th className="border-end px-4 py-3" style={{ minWidth: '200px', position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                  <div className="d-flex align-items-center">
                    <FaUser className="me-2 text-muted" size={14} />
                    <span className="fw-semibold">Student</span>
                  </div>
                </th>
                {assignments.map((assignment) => (
                  <th key={assignment} className="text-center border-end px-3 py-3" style={{ minWidth: '120px' }}>
                    <div className="d-flex flex-column align-items-center">
                      <span className="fw-semibold" style={{ fontSize: '13px' }}>
                        {assignment}
                      </span>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {assignment.includes('Quiz') ? '10 pts' : '100 pts'}
                      </small>
                    </div>
                  </th>
                ))}
                <th className="text-center px-3 py-3" style={{ minWidth: '100px' }}>
                  <div className="d-flex flex-column align-items-center">
                    <span className="fw-semibold" style={{ fontSize: '13px' }}>
                      Total
                    </span>
                    <small className="text-muted" style={{ fontSize: '11px' }}>
                      210 pts
                    </small>
                  </div>
                </th>
                <th className="px-2 py-3" style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-bottom">
                  <td className="border-end px-4 py-3" style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 5 }}>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                        <span className="text-white fw-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>
                          {student.name}
                        </div>
                        <small className="text-muted" style={{ fontSize: '12px' }}>
                          {student.email}
                        </small>
                      </div>
                    </div>
                  </td>
                  {assignments.map((assignment) => (
                    <td key={assignment} className="text-center border-end px-3 py-3">
                      <button className="btn btn-link p-0 text-decoration-none">
                      </button>
                    </td>
                  ))}
                  <td className="text-center px-3 py-3">
                    {getTotalGradeDisplay(student)}
                  </td>
                  <td className="px-2 py-3">
                    <div className="dropdown">
                      <button className="btn btn-link p-1 text-muted" data-bs-toggle="dropdown">
                        <BsThreeDotsVertical size={14} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="#"><FaEdit className="me-2" size={12} />Message Student</a></li>
                        <li><a className="dropdown-item" href="#"><FaChartBar className="me-2" size={12} />View Analytics</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <div className="fw-bold text-success" style={{ fontSize: '18px' }}>
                {(students.reduce((sum, s) => sum + s.percentage, 0) / students.length).toFixed(1)}%
              </div>
              <small className="text-muted">Class Average</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <div className="fw-bold text-primary" style={{ fontSize: '18px' }}>
                {Math.max(...students.map(s => s.percentage)).toFixed(1)}%
              </div>
              <small className="text-muted">Highest Grade</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <div className="fw-bold text-warning" style={{ fontSize: '18px' }}>
                {Math.min(...students.map(s => s.percentage)).toFixed(1)}%
              </div>
              <small className="text-muted">Lowest Grade</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <div className="fw-bold text-info" style={{ fontSize: '18px' }}>
                {students.filter(s => s.percentage >= 70).length}/{students.length}
              </div>
              <small className="text-muted">Passing</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}