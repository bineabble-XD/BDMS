import React from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import mlogo from "../assets/mlogo.jpg"; // Ensure this path is correct
import heroImg from "../assets/2.png";  // Ensure this path is correct

// Chart.js registration
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HosReport = () => {
  // Blood stock data for the chart
  const data = {
    labels: ["A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "O+", "O+"],
    datasets: [
      {
        label: "Blood Stock Report",
        data: [30, 50, 70, 100, 90, 80, 60, 40, 50],
        fill: false,
        borderColor: "#D70000",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#D70000",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Blood Stock Report",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 140,
      },
    },
  };

  return (
    <div className="report-page">
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
            <Link to="/appointments" className="nav-link">
              Appointments
            </Link>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <span className="nav-link">BDMS ADMIN</span>
          </nav>
        </div>
      </header>

      <main className="report-main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="report-search-wrapper">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
              />
            </div>
            <div className="d-flex gap-3">
              <button className="btn btn-danger">Download</button>
              <button className="btn btn-danger">Print</button>
            </div>
          </div>

          <div className="chart-container mb-4">
            <div className="chart-header">
              <span>Nov 22, 2025</span>
              <span className="mx-3">City Hospital</span>
            </div>
            <div className="chart">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </main>

      <div className="report-bottom-bar" />
    </div>
  );
};

export default HosReport;
