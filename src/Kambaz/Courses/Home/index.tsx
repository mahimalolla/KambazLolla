
import { useParams } from "react-router";

export default function Home() {
  useParams();
  
  return (
    <div id="wd-home" style={{ maxWidth: '1200px' }}>
      {/* Welcome Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#212529', marginBottom: '15px' }}>
          Welcome to the Course!
        </h3>
        <p style={{ color: '#6c757d', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          This is your course homepage where you can find important announcements, 
          upcoming assignments, and quick access to course materials.
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#28a745', marginBottom: '10px' }}>📚</div>
          <h5 style={{ margin: '0 0 5px 0', color: '#212529' }}>Modules</h5>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>8 Available</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#dc3545', marginBottom: '10px' }}>📝</div>
          <h5 style={{ margin: '0 0 5px 0', color: '#212529' }}>Assignments</h5>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>3 Due Soon</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '10px' }}>❓</div>
          <h5 style={{ margin: '0 0 5px 0', color: '#212529' }}>Quizzes</h5>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>2 Available</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: '#17a2b8', marginBottom: '10px' }}>📊</div>
          <h5 style={{ margin: '0 0 5px 0', color: '#212529' }}>Grade</h5>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>85.5%</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h4 style={{ color: '#212529', marginBottom: '20px' }}>Recent Activity</h4>
        <div style={{ space: '15px' }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#212529', fontWeight: '500' }}>New assignment posted: Assignment 3</span>
              <span style={{ color: '#6c757d', fontSize: '12px' }}>2 hours ago</span>
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#212529', fontWeight: '500' }}>Quiz 2 grades released</span>
              <span style={{ color: '#6c757d', fontSize: '12px' }}>1 day ago</span>
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#212529', fontWeight: '500' }}>New discussion in Piazza</span>
              <span style={{ color: '#6c757d', fontSize: '12px' }}>2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '25px'
      }}>
        <h4 style={{ color: '#212529', marginBottom: '20px' }}>Upcoming Deadlines</h4>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f1f1f1'
          }}>
            <span style={{ color: '#212529' }}>Assignment 2: React Components</span>
            <span style={{ 
              color: '#dc3545', 
              fontSize: '14px', 
              fontWeight: '500',
              backgroundColor: '#f8d7da',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Due Tomorrow
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f1f1f1'
          }}>
            <span style={{ color: '#212529' }}>Quiz 3: JavaScript Advanced</span>
            <span style={{ 
              color: '#ffc107', 
              fontSize: '14px', 
              fontWeight: '500',
              backgroundColor: '#fff3cd',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Due in 3 days
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0'
          }}>
            <span style={{ color: '#212529' }}>Project Proposal</span>
            <span style={{ 
              color: '#28a745', 
              fontSize: '14px', 
              fontWeight: '500',
              backgroundColor: '#d4edda',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Due in 1 week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}