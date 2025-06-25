import { Button, Dropdown, Modal, Form } from "react-bootstrap";
import { FaEllipsisV, FaPlus, FaCheckCircle, FaGripVertical, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import courseClient from "../client"; 

export default function Modules() {
  const { cid } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const [moduleName, setModuleName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);

  // 6.4.2.2 - Load modules from database when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!cid) return;
      
      try {
        setLoading(true);
        
        // Load course details
        const courseData = await courseClient.findCourseById(cid);
        setCourse(courseData);
        
        // Load modules for this course from MongoDB
        const modulesData = await courseClient.findModulesForCourse(cid);
        console.log('Loaded modules from database:', modulesData);
        setModules(modulesData);
        
      } catch (error) {
        console.error("Error loading course data:", error);
        setModules([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cid]);

  // 6.4.2.3 - Create module using MongoDB API
  const addModule = async () => {
    if (!moduleName.trim() || !cid) return;
    
    try {
      setLoading(true);
      
      // Call API to create module in database
      const newModule = await courseClient.createModuleForCourse(cid, {
        name: moduleName,
        description: `Module: ${moduleName}`,
        lessons: []
      });
      
      console.log('Created module:', newModule);
      
      // Add to local state
      setModules([...modules, newModule]);
      setModuleName("");
      setShowModal(false);
      
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 6.4.2.4 - Delete module using MongoDB API
  const deleteModule = async (moduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Call API to delete module from database
      await moduleClient.deleteModule(moduleId);
      
      console.log('Deleted module:', moduleId);
      
      // Remove from local state
      setModules(modules.filter((m) => m._id !== moduleId));
      
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit module (toggle editing mode)
  const editModule = (moduleId: string) => {
    setModules(modules.map((m) => 
      m._id === moduleId ? { ...m, editing: true } : m
    ));
  };

  // 6.4.2.5 - Update module using MongoDB API
  const updateModule = async (module: any) => {
    try {
      setLoading(true);
      
      // Call API to update module in database
      await moduleClient.updateModule(module._id, {
        name: module.name,
        description: module.description
      });
      
      console.log('Updated module:', module);
      
      // Update local state
      setModules(modules.map((m) => 
        m._id === module._id ? { ...module, editing: false } : m
      ));
      
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle module name change during editing
  const handleModuleNameChange = (moduleId: string, newName: string) => {
    setModules(modules.map((m) => 
      m._id === moduleId ? { ...m, name: newName } : m
    ));
  };

  if (loading && modules.length === 0) {
    return (
      <div className="container-fluid" style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading modules...</p>
        </div>
      </div>
    );
  }

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
            <h2 className="mb-0 fw-bold text-dark">
              {course ? course.number : "Course"} - Modules
            </h2>
            {loading && (
              <div className="ms-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
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
              onClick={() => setShowModal(true)}
              disabled={loading}
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

          {/* Dynamic Modules from MongoDB */}
          {modules.length > 0 ? (
            modules.map((module: any) => (
              <div 
                key={module._id} 
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
                  <div className="d-flex align-items-center flex-grow-1">
                    <FaGripVertical className="me-3 text-muted" size={16} />
                    {!module.editing ? (
                      <span 
                        className="fw-bold fs-5 text-dark" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => editModule(module._id)}
                      >
                        {module.name}
                      </span>
                    ) : (
                      <Form.Control
                        type="text"
                        value={module.name}
                        className="w-50"
                        autoFocus
                        onChange={(e) => handleModuleNameChange(module._id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateModule(module);
                          }
                          if (e.key === "Escape") {
                            setModules(modules.map((m) => 
                              m._id === module._id ? { ...m, editing: false } : m
                            ));
                          }
                        }}
                        onBlur={() => updateModule(module)}
                        style={{ display: 'inline-block' }}
                        disabled={loading}
                      />
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <FaPencil 
                      className="text-primary" 
                      size={16} 
                      style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                      onClick={() => !loading && editModule(module._id)}
                      title="Edit module"
                    />
                    <FaTrash 
                      className="text-danger" 
                      size={16} 
                      style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                      onClick={() => !loading && deleteModule(module._id)}
                      title="Delete module"
                    />
                    <FaCheckCircle className="text-success" size={18} />
                    <FaPlus className="text-muted" size={16} style={{ cursor: 'pointer' }} />
                    <FaEllipsisV className="text-muted" size={16} style={{ cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Module Items/Lessons */}
                <div>
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons.map((lesson: any, idx: number) => (
                      <div 
                        key={lesson._id || idx} 
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
                          <span className="text-dark" style={{ fontSize: '15px' }}>
                            {typeof lesson === 'string' ? lesson : lesson.name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <FaCheckCircle className="text-success" size={16} />
                          <FaEllipsisV className="text-muted" size={14} style={{ cursor: 'pointer' }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div 
                      style={{ 
                        padding: '20px 24px',
                        color: '#6c757d',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        borderLeft: '4px solid #dee2e6'
                      }}
                    >
                      No lessons in this module yet
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Fallback message when no modules found for this course
            <div 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
              }}
            >
              <h4 style={{ color: '#6c757d', marginBottom: '10px' }}>No modules found</h4>
              <p style={{ color: '#6c757d' }}>
                This course doesn't have any modules yet. Click the "+ Module" button to create your first module.
              </p>
              <small style={{ color: '#adb5bd' }}>
                Data loaded from MongoDB • Course ID: {cid}
              </small>
            </div>
          )}
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

            {/* Module Stats Card */}
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
              <h5 className="mb-3 fw-bold text-muted">Module Statistics</h5>
              
              <div className="d-grid gap-3">
                <div style={{ fontSize: '15px', color: '#495057' }}>
                  Total Modules: <strong>{modules.length}</strong>
                </div>
                <div style={{ fontSize: '15px', color: '#495057' }}>
                  Course: <strong>{course?.name || 'Loading...'}</strong>
                </div>
                <div style={{ fontSize: '15px', color: '#495057' }}>
                  Data Source: <strong>MongoDB</strong>
                </div>
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
          </div>
        </div>
      </div>

      {/* Add Module Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter module name..."
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addModule();
                  }
                }}
                autoFocus
                disabled={loading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addModule} disabled={loading || !moduleName.trim()}>
            {loading ? 'Adding...' : 'Add Module'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
