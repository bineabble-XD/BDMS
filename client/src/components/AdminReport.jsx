import React, { useState } from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";
import heroImg from "../assets/2.png";

const AdminReport = () => {
  const [date, setDate] = useState("Nov 22, 2025");
  const [hospital, setHospital] = useState("City Hospital");

  const bloodData = [
    { type: "A-", value: 70 },
    { type: "A+", value: 45 },
    { type: "B-", value: 40 },
    { type: "B+", value: 65 },
    { type: "AB-", value: 50 },
    { type: "AB+", value: 95 },
    { type: "O-", value: 55 },
    { type: "O+", value: 70 },
  ];

  const handleDownload = () => {
    alert(`Downloading report for ${hospital} - ${date}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-report-page">
      {/* NAVBAR */}
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <span className="nav-link active-link">Reports</span>
            <Link to="/admin-appointments" className="nav-link">
              Appointments
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <span className="nav-link">BDMS ADMIN</span>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="admin-report-main">
        <div className="container">
          {/* filters */}
          <div className="admin-report-filters mb-4">
            <select
              className="form-select"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option>Nov 22, 2025</option>
              <option>Nov 21, 2025</option>
              <option>Nov 20, 2025</option>
            </select>

            <select
              className="form-select"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            >
              <option>City Hospital</option>
              <option>Star Hospital</option>
              <option>Royal Hospital</option>
            </select>
          </div>

          <div className="row g-4">
            {/* LEFT – REPORT */}
            <div className="col-lg-8">
              <div className="admin-report-card">
                <div className="admin-report-card-inner">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Blood Stock Report</h4>
                    <div className="d-flex flex-column gap-2">
                      <button
                        type="button"
                        className="btn admin-report-btn"
                        onClick={handleDownload}
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="btn admin-report-btn"
                        onClick={handlePrint}
                      >
                        Print
                      </button>
                    </div>
                  </div>

                  {/* chart (أعمدة بسيطة مثل الصورة) */}
                  <div className="report-chart">
                    {bloodData.map((item) => (
                      <div className="report-column" key={item.type}>
                        <div
                          className="report-bar"
                          style={{ height: `${item.value}px` }}
                        />
                        <span className="report-label">{item.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT – صورة الشخص على اللابتوب */}
            <div className="col-lg-4">
              <div className="admin-report-illustration text-center">
                <img
                  src={heroImg}
                  alt="Report illustration"
                  className="img-fluid admin-report-img"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* الشريط الأحمر تحت الصفحة */}
      <div className="admin-bottom-bar" />
    </div>
  );
};

export default AdminReport;
