import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

interface PeopleTableProps {
  users: any[];
}

export default function PeopleTable({ users = [] }: PeopleTableProps) {
  
  if (users.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '12px',
          padding: '40px'
        }}>
          <FaUserCircle className="fs-1 text-muted mb-3" />
          <h5 className="text-muted">No participants found</h5>
          <p className="text-muted mb-0">
            No users are currently enrolled in this course.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'STUDENT': return '#17a2b8';
      case 'FACULTY': return '#28a745';
      case 'ADMIN': return '#dc3545';
      case 'TA': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div id="wd-people-table">
      <Table 
        striped 
        bordered 
        hover 
        responsive
        style={{ border: '1px solid #dee2e6' }}
      >
        <thead style={{ backgroundColor: '#212529', color: 'white' }}>
          <tr>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Name</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Login ID</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Email</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Role</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Section</th>
            <th style={{ border: '1px solid #dee2e6', padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <tr 
              key={user._id || index} 
              style={{ 
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' 
              }}
            >
              {/* Name Column */}
              <td className="wd-full-name text-nowrap" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName || 'Unknown'}</span>{" "}
                <span className="wd-last-name">{user.lastName || 'User'}</span>
              </td>
              
              {/* Login ID Column */}
              <td className="wd-login-id" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                {user.loginId || user.username || 'N/A'}
              </td>
              
              {/* Email Column */}
              <td className="wd-email" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                {user.email || 'No email provided'}
              </td>
              
              {/* Role Column with Badge */}
              <td className="wd-role" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                <span 
                  style={{
                    backgroundColor: getRoleBadgeColor(user.role),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  {user.role || 'USER'}
                </span>
              </td>
              
              {/* Section Column */}
              <td className="wd-section" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                {user.section || 'N/A'}
              </td>
              
              {/* Status Column */}
              <td className="wd-status" style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                <span 
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  ENROLLED
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Summary Footer */}
      <div className="mt-3 p-3" style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div className="row text-center">
          <div className="col">
            <strong>Total Participants</strong><br />
            <span className="fs-4 text-primary">{users.length}</span>
          </div>
          <div className="col">
            <strong>Students</strong><br />
            <span className="fs-4 text-info">
              {users.filter(u => u.role === 'STUDENT').length}
            </span>
          </div>
          <div className="col">
            <strong>Faculty</strong><br />
            <span className="fs-4 text-success">
              {users.filter(u => u.role === 'FACULTY').length}
            </span>
          </div>
          <div className="col">
            <strong>TAs</strong><br />
            <span className="fs-4 text-warning">
              {users.filter(u => u.role === 'TA').length}
            </span>
          </div>
        </div>
        
        <div className="text-center mt-2">
          <small className="text-muted">
            Data loaded from MongoDB enrollment system
          </small>
        </div>
      </div>
    </div>
  );
}
