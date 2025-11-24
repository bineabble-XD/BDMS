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
import EmailVerified from "./components/EmailVerified.jsx";
import LandingPage from "./components/LandingPage.jsx";
import ForgetPassword from "./components/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/reports" element={<AdminReport />} />
        <Route path="/admin-appointments" element={<AdminAppoint />} />
        <Route path="/dashboard" element={<AdminDash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verified" element={<EmailVerified />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
