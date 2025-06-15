import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; 
import Labs from "./Labs";
import Kambaz from "./Kambaz";

export default function App() {
  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <HashRouter>
        <div>
          <Routes>
            {/* Redirect any unmatched routes to Kambaz */}
            <Route path="*" element={<Navigate to="/Kambaz" />} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
