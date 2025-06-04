import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Labs from "./Labs";
import Kambaz from "./Kambaz";

export default function App() {
  return (
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
  );
}
