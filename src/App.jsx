import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// NOTE: these imports assume each file's default export is named to match.
// If your actual `export default function ...` names differ, update the
// import names below to match — the file paths are correct, but React
// needs the exported function name, not just the filename.
import Homepage from "./pages/Homepage.jsx";
import ApplicationForm from "./pages/Application_Form.jsx";
import Instructors from "./pages/Instructors.jsx";
import LevelTest from "./pages/Level_Test.jsx";
import Sessions from "./pages/Sessions.jsx";
import BookingPage from "./pages/Booking_Page.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/level-test" element={<LevelTest />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}
