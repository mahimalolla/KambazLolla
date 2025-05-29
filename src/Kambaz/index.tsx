import { Navigate, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import KambazNavigation from "./Navigation";
import Calendar from "./Calendar";
import Inbox from "./Inbox";

export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <Routes>
        <Route path="/" element={<Navigate to="Account" />} />
        <Route path="/Account/*" element={<div style={{marginLeft: '240px'}}><Account /></div>} />
        <Route path="/Dashboard" element={<div style={{marginLeft: '240px'}}><Dashboard /></div>} />
        <Route path="/Courses/:cid/*" element={<Courses />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Inbox" element={<Inbox />} />

      </Routes>
    </div>
  );
}