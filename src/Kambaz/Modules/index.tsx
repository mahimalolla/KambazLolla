import { Button, Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaPlus, FaCheckCircle, FaGripVertical } from "react-icons/fa";

export default function Modules() {
  const modules = [
    {
      _id: "1",
      name: "Week 1",
      lessons: [
        "LEARNING OBJECTIVES",
        "Introduction to the course", 
        "Learn what is Web Development",
        "LESSON 1",
        "LESSON 2"
      ],
    },
    {
      _id: "2", 
      name: "Week 2",
      lessons: [
        "LEARNING OBJECTIVES",
        "LESSON 1",
        "LESSON 2"
      ],
    },
  ];

  return (
    <div className="container-fluid" style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row">
        {/* Main Content Area */}
        <div className="col-lg-8 col-md-7">
          {/* Course Header */}
          <div className="d-flex align-items-center mb-4">
            <div className="me-3">
              <Button variant="outline-dark" size="sm" style={{ padding: '8px 12px' }}>
                ☰
              </Button>
            </div>
            <h2 className="mb-0 fw-bold text-dark">Course 1234</h2>
          </div>

          {/* Controls */}
          <div className="d-flex justify-content-start gap-3 mb-5">
            <Button 
              variant="outline-secondary" 
              style={{ 
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Collapse All
            </Button>
            
            <Button 
              variant="outline-secondary"
              style={{ 
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              View Progress
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-success" 
                style={{ 
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
                className="d-flex align-items-center"
              >
                <FaCheckCircle className="me-2" />
                Publish All
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <Dropdown.Item className="py-2">
                  <FaCheckCircle className="me-2 text-success" />
                  Publish All
                </Dropdown.Item>
                <Dropdown.Item className="py-2">
                  <FaCheckCircle className="me-2 text-success" />
                  Publish all modules and items
                </Dropdown.Item>
                <Dropdown.Item className="py-2">
                  <FaCheckCircle className="me-2 text-success" />
                  Publish modules only
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="py-2">
                  Unpublish all modules and items
                </Dropdown.Item>
                <Dropdown.Item className="py-2">
                  Unpublish modules only
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button 
              variant="danger" 
              className="ms-auto"
              style={{ 
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                background: 'linear-gradient(45deg, #dc3545, #c82333)',
                border: 'none'
              }}
            >
              <FaPlus className="me-2" />
              Module
            </Button>
          </div>

          {/* Modules */}
          {modules.map((module, index) => (
            <div 
              key={index} 
              className="mb-4" 
              style={{ 
                border: '1px solid #e9ecef', 
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              {/* Module Header */}
              <div 
                className="d-flex justify-content-between align-items-center"
                style={{ 
                  backgroundColor: '#e9ecef',
                  padding: '18px 24px',
                  borderBottom: '1px solid #dee2e6'
                }}
              >
                <div className="d-flex align-items-center">
                  <FaGripVertical className="me-3 text-muted" size={16} />
                  <span className="fw-bold fs-5 text-dark">{module.name}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaCheckCircle className="text-success" size={18} />
                  <FaPlus className="text-muted" size={16} style={{ cursor: 'pointer' }} />
                  <FaEllipsisV className="text-muted" size={16} style={{ cursor: 'pointer' }} />
                </div>
              </div>

              {/* Module Items */}
              <div>
                {module.lessons.map((lesson, idx) => (
                  <div 
                    key={idx} 
                    className="d-flex justify-content-between align-items-center"
                    style={{ 
                      padding: '16px 24px',
                      borderBottom: idx < module.lessons.length - 1 ? '1px solid #f8f9fa' : 'none',
                      borderLeft: '4px solid #28a745',
                      backgroundColor: 'white',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <FaGripVertical className="me-3 text-muted" size={14} />
                      <span className="text-dark" style={{ fontSize: '15px' }}>{lesson}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <FaCheckCircle className="text-success" size={16} />
                      <FaEllipsisV className="text-muted" size={14} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Course Status Sidebar */}
        <div className="col-lg-4 col-md-5">
          <div className="sticky-top">
            {/* Course Status Card */}
            <div 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                marginBottom: '20px'
              }}
            >
              <h4 className="mb-4 fw-bold text-dark">Course Status</h4>
              
              <div className="d-flex gap-2 mb-4">
                <Button 
                  variant="outline-secondary" 
                  className="flex-fill"
                  style={{ 
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    backgroundColor: '#f8f9fa',
                    border: '2px solid #dee2e6'
                  }}
                >
                  Unpublish
                </Button>
                <Button 
                  className="flex-fill"
                  style={{ 
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  <FaCheckCircle className="me-2" />
                  Published
                </Button>
              </div>

              <div className="d-grid gap-2">
                {[
                  { icon: "📥", text: "Import Existing Content" },
                  { icon: "📚", text: "Import from Commons" },
                  { icon: "🏠", text: "Choose Home Page" },
                  { icon: "📊", text: "View Course Stream" },
                  { icon: "🔔", text: "Course Notifications" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '12px 0',
                      fontSize: '15px',
                      color: '#495057',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#495057';
                    }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* To Do Card */}
            <div 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                marginBottom: '20px'
              }}
            >
              <h5 className="mb-3 fw-bold text-muted">To Do</h5>
              
              <div className="d-grid gap-3">
                {[
                  "Finish Lab 1 by Friday",
                  "Submit Assignment 2"
                ].map((task, index) => (
                  <div 
                    key={index}
                    style={{ 
                      fontSize: '15px',
                      color: '#495057',
                      padding: '8px 0'
                    }}
                  >
                    {task}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Resources Card */}
            <div 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
              }}
            >
              <h5 className="mb-3 fw-bold text-muted">Course Resources</h5>
              
              <div className="d-grid gap-2">
                {[
                  { text: "Zoom Meetings", color: "#6c5ce7" },
                  { text: "Piazza Discussions", color: "#a29bfe" },
                  { text: "View Grades", color: "#74b9ff" }
                ].map((resource, index) => (
                  <div 
                    key={index}
                    style={{ 
                      fontSize: '15px',
                      color: resource.color,
                      padding: '8px 0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {resource.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}