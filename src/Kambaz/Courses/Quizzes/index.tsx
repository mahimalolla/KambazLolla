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
  
  const testAPI = async () => {
    console.log("Testing API...");
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://kambaz-node.onrender.com/api/courses/${cid}/quizzes`;
      console.log("Fetching from:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      setQuizzes(data);
      setError("SUCCESS: Got " + data.length + " quizzes");
      
    } catch (err: any) {
      console.error('API Error:', err);
      setError("ERROR: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h4>QUIZ LIST WORKS!</h4>
      <p>Course ID: {cid}</p>
      <p>User: {state.user?.firstName} {state.user?.lastName} ({state.user?.role})</p>
      <p>Faculty: {isFaculty ? 'Yes' : 'No'}</p>
      
      <hr />
      
      <p>Quizzes: {quizzes.length}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Status: {error || 'Ready'}</p>
      
      <button 
        onClick={testAPI}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test API Call'}
      </button>
    </div>
  );
}
