import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isFaculty = state.user?.role === 'FACULTY' || state.user?.role === 'ADMIN';
  
  return (
    <div>
      <h4>QUIZ LIST WORKS!</h4>
      <p>Course ID: {cid}</p>
      <p>User: {state.user ? `${state.user.firstName} ${state.user.lastName}` : 'No user'}</p>
      <p>Role: {state.user ? state.user.role : 'No role'} (Faculty: {isFaculty ? 'Yes' : 'No'})</p>
      <p>Authenticated: {state.isAuthenticated ? 'Yes' : 'No'}</p>
      <p>Quizzes: {quizzes.length}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Error: {error || 'None'}</p>
      
      <button 
        onClick={() => {
          console.log("Button clicked!");
          setLoading(!loading);
        }}
      >
        Toggle Loading
      </button>
    </div>
  );
}
