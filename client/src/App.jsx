import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // make sure this line exists

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
import Profile from "./components/Profile.jsx";
import AdminProfile from "./components/AdminProfile.jsx";
import HospitalRegister from "./components/HospitalRegister.jsx";
import HosDash from "./components/HosDash.jsx";
import Footer from "./components/Footer.jsx";
import Community from "./components/Community.jsx";
import Settings from "./components/Settings";
import UrgentRequests from "./components/UrgentRequests";



function App() {
  return (
    <BrowserRouter>
      {/* this whole div is a flex column */}
      <div className="app-shell">
        <div className="page-content">
          <div>
            {/*NavBar in the future*/}
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/reports" element={<AdminReport />} />
            <Route path="/admin-appointments" element={<AdminAppoint />} />
            <Route path="/dashboard" element={<AdminDash />} />
            <Route path="/hospital-dash" element={<HosDash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verified" element={<EmailVerified />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/register-hospital" element={<HospitalRegister />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/urgent-requests" element={<UrgentRequests />} />

          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
