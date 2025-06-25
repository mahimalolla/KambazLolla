import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

export default function QuizList() {
  const { state } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();
  
  return (
    <div>
      <h4>QUIZ LIST WORKS!</h4>
      <p>Course ID: {cid}</p>
      <p>User: {state.user ? `${state.user.firstName} ${state.user.lastName}` : 'No user'}</p>
      <p>Role: {state.user ? state.user.role : 'No role'}</p>
      <p>Authenticated: {state.isAuthenticated ? 'Yes' : 'No'}</p>
    </div>
  );
}
