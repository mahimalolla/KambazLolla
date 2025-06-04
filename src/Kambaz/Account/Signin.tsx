import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import * as db from "../Database";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const signin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      // Find user in database
      const user = db.users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Store user in localStorage (simple approach)
      localStorage.setItem('kambaz_user', JSON.stringify(user));
      
      // Navigate to dashboard
      navigate("/Kambaz/Dashboard");
      
    } catch (err) {
      setError("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  // Rest of your beautiful styling stays the same...
  return (
    <div style={{
      marginLeft: '240px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      {/* Your existing JSX with the form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header stays the same */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Your existing header */}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Test Accounts */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0369a1' }}>
            Test Accounts:
          </p>
          <p style={{ margin: '4px 0', color: '#0c4a6e' }}>
            <strong>Faculty:</strong> alice_johnson / password123
          </p>
          <p style={{ margin: '4px 0', color: '#0c4a6e' }}>
            <strong>Student:</strong> bob_smith / password123
          </p>
        </div>

        {/* Form with your existing styling */}
        <form onSubmit={signin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username and Password fields - keep your existing styling */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Option 3: Create a simple hook to get current user from localStorage
// You can add this to any component file that needs it
const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('kambaz_user');
    return stored ? JSON.parse(stored) : null;
  });

  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  const logout = () => {
    localStorage.removeItem('kambaz_user');
    setCurrentUser(null);
  };

  return { currentUser, isFaculty, isStudent, logout };
};

// Option 4: Use this in your Dashboard component
// src/Kambaz/Dashboard.tsx
import { useState, useEffect } from "react";
import * as db from "./Database";

export default function Dashboard(props: any) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const stored = localStorage.getItem('kambaz_user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const isFaculty = currentUser?.role === "FACULTY";

  // Filter courses by enrollment
  const enrolledCourses = currentUser ? props.courses.filter((course: any) =>
    db.enrollments.some((enrollment: any) => 
      enrollment.user === currentUser._id && 
      enrollment.course === course._id
    )
  ) : [];

  if (!currentUser) {
    return <div>Please sign in to view dashboard</div>;
  }

  return (
    <div id="wd-dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {currentUser.firstName} {currentUser.lastName}!</p>
      
      {/* Only show course creation form to FACULTY */}
      {isFaculty && (
        <div>
          <h5>New Course
            <button className="btn btn-primary float-end" onClick={props.addNewCourse}>
              Add
            </button>
          </h5>
          {/* Your course form */}
        </div>
      )}
      
      <h2>Published Courses ({enrolledCourses.length})</h2>
      
      <div className="row">
        {enrolledCourses.map((course: any) => (
          <div key={course._id} className="col">
            <div className="card">
              <div className="card-body">
                <h5>{course.name}</h5>
                <Link to={`/Kambaz/Courses/${course._id}`} className="btn btn-primary">
                  Go
                </Link>
                
                {/* Only FACULTY can edit/delete */}
                {isFaculty && (
                  <>
                    <button onClick={() => props.setCourse(course)} className="btn btn-warning">
                      Edit
                    </button>
                    <button onClick={() => props.deleteCourse(course._id)} className="btn btn-danger">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
