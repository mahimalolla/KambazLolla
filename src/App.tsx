import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Labs from "./Labs";
import Kambaz from "./Kambaz";
import LandingPage from "./LandingPage";

export default function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          {/* Landing page with portfolio features */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Your existing routes */}
          <Route path="/Labs/*" element={<Labs />} />
          <Route path="/Kambaz/*" element={<Kambaz />} />
          
          {/* Portfolio features as separate routes (optional) */}
          <Route path="/portfolio" element={<Navigate to="/#portfolio" />} />
          <Route path="/blog" element={<Navigate to="/#blog" />} />
          <Route path="/testimonials" element={<Navigate to="/#testimonials" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
