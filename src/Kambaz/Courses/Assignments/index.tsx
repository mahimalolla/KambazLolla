import { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import * as db from "../../Database";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  availableFrom: string;
  availableUntil: string;
  dueDate: string;
  points: number;
  description?: string;
}

export default function Assignments() {
  const { cid } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>(db.assignments || []);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentForm, setAssignmentForm] = useState<Assignment>({
    _id: "",
    title: "",
    course: cid || "",
    availableFrom: new Date().toISOString().split('T')[0],
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    points: 100,
    description: ""
  });

  // Filter assignments for current course
  const courseAssignments = assignments.filter((assignment: Assignment) => assignment.course === cid);

  // Add new assignment
  const addAssignment = () => {
    if (assignmentForm.title.trim()) {
      const newAssignment: Assignment = {
        ...assignmentForm,
        _id: new Date().getTime().toString(),
        course: cid || ""
      };
      setAssignments([...assignments, newAssignment]);
      resetForm();
      setShowModal(false);
    }
  };

  // Update assignment
  const updateAssignment = () => {
    if (editingAssignment && assignmentForm.title.trim()) {
      setAssignments(assignments.map(a => 
        a._id === editingAssignment._id ? { ...assignmentForm, _id: editingAssignment._id } : a
      ));
      resetForm();
      setShowModal(false);
    }
  };

  // Delete assignment
  const deleteAssignment = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a._id !== assignmentId));
    }
  };

  // Edit assignment
  const editAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({ ...assignment });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingAssignment(null);
    setAssignmentForm({
      _id: "",
      title: "",
      course: cid || "",
      availableFrom: new Date().toISOString().split('T')[0],
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      points: 100,
      description: ""
    });
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#212529', marginBottom: 0 }}>📚 Assignments</h1>
        <Button
          variant="danger"
          onClick={openAddModal}
          style={{
            padding: '12px 24px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaPlus /> Assignment
        </Button>
      </div>

      {/* Assignment Controls */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <Button variant="outline-secondary">
          📊 40% of Total
        </Button>
        <Button variant="outline-secondary">
          🔍 Search for Assignment
        </Button>
        <Button variant="outline-secondary">
          ➕ Group
        </Button>
      </div>

      {/* Assignments Table */}
      {courseAssignments.length > 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Table hover style={{ margin: 0 }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '20px', fontWeight: '600' }}>Assignment Name</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>Due Date</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>Points</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>Available</th>
                <th style={{ padding: '20px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseAssignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td style={{ padding: '20px' }}>
                    <div>
                      <strong style={{ color: '#212529', fontSize: '16px' }}>
                        {assignment.title}
                      </strong>
                      {assignment.description && (
                        <div style={{ 
                          color: '#6c757d', 
                          fontSize: '14px', 
                          marginTop: '4px',
                          maxWidth: '300px'
                        }}>
                          {assignment.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: '#6c757d' }}>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', fontWeight: '500' }}>
                    {assignment.points} pts
                  </td>
                  <td style={{ padding: '20px', color: '#6c757d', fontSize: '14px' }}>
                    {new Date(assignment.availableFrom).toLocaleDateString()} - {new Date(assignment.availableUntil).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => editAssignment(assignment)}
                        title="Edit Assignment"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteAssignment(assignment._id)}
                        title="Delete Assignment"
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        title="View Assignment"
                      >
                        <FaEye />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
          <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>No assignments found</h4>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            This course doesn't have any assignments yet. Click the "+ Assignment" button to create your first assignment.
          </p>
          <Button variant="primary" onClick={openAddModal}>
            <FaPlus className="me-2" />
            Create First Assignment
          </Button>
        </div>
      )}

      {/* Assignment Editor Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Assignment Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter assignment name..."
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    autoFocus
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Points</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="100"
                    value={assignmentForm.points}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, points: parseInt(e.target.value) || 0 })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter assignment description..."
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Available From</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignmentForm.availableFrom}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, availableFrom: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Available Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignmentForm.availableUntil}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, availableUntil: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={editingAssignment ? updateAssignment : addAssignment}
          >
            {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
