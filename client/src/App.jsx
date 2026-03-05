import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { applySettings } from "./utils/settingsUtils";
import { LanguageProvider } from "./context/LanguageContext";

import WidgetMenu from "./components/WidgetMenu.jsx";
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
import AppNavbar from "./components/AppNavbar";
import MainLayout from "./components/MainLayout";
import HospitalManageRequest from "./components/HospitalManageRequest"
import AdminManageRequest from "./components/AdminManageRequest"
import Inventory from "./components/Inventory.jsx";
import HosAppoint from "./components/HosAppoint.jsx";
import HosReport from "./components/HosReport.jsx";
import HospitalProfile from "./components/HospitalProfile.jsx";
import NLPAssistant from "./components/NLPAssistant.jsx"
import AdminBloodBankView from "./components/AdminBloodBankView.jsx";
import BloodBankManagement from "./components/BloodBankManagement.jsx";
import MyAppointments from "./components/MyAppointments.jsx";
import Widgets from "./components/Widgets.jsx";

function AppContent() {
  const location = useLocation();
  return (
    <>
      <AppNavbar />
      <div className="page-content" key={location.pathname}>
          <Routes>
            <Route path="/reports" element={<AdminReport />} />
            <Route path="/admin-appointments" element={<AdminAppoint />} />
            <Route path="/dashboard" element={<AdminDash />} />
            <Route path="/NLPAssistant" element={<NLPAssistant />} />
            <Route path="/hospital-dash" element={<HosDash />} />
            <Route path="/hospital-appointments" element={<HosAppoint />} />
            <Route path="/hospital-reports" element={<HosReport />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/register-hospital" element={<HospitalRegister />} />
            <Route path="/urgent" element={<UrgentRequests />} />
            <Route path="/HosManRequest" element={<HospitalManageRequest />} />
            <Route path="/AdminManRequest" element={<AdminManageRequest />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/HospitalProfile" element={<HospitalProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blood-bank/:hospitalId" element={<BloodBankManagement />} />
            <Route path="/admin-blood-bank" element={<AdminBloodBankView />} />

            <Route element={<MainLayout />}>
            <Route path="/widgets" element={<Widgets />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/appointments" element={<Appointment />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verified" element={<EmailVerified />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/register-hospital" element={<HospitalRegister />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/urgent-requests" element={<UrgentRequests />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
            </Route>
          </Routes>
        </div>
      <WidgetMenu />
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    applySettings();
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="app-shell">
          <AppContent />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
