import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home.jsx";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import About from "./components/About.jsx";
import Feedback from "./components/Feedback.jsx";
import Appointment from "./components/Appointment.jsx";
import AdminDash from "./components/AdminDash.jsx";
import AdminAppoint from "./components/AdminAppoint.jsx";
import AdminReport from "./components/AdminReport.jsx";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/reports" element={<AdminReport />} />
        <Route path="/admin-appointments" element={<AdminAppoint />} />
        <Route path="/dashboard" element={<AdminDash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
