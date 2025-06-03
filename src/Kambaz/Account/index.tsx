import { Routes, Route, Navigate, Link } from "react-router-dom";
import Signin from "./Signin";
import Profile from "./Profile";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <h2>Account</h2>
      
      {/* Add navigation links */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/Kambaz/Account/Signin" style={{ marginRight: '15px' }}>
          Sign In
        </Link>
        <Link to="/Kambaz/Account/Profile">
          Profile
        </Link>
      </div>
      
      <Routes>
        <Route path="/" element={<Navigate to="/Kambaz/Account/Signin" />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
