import React from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import mlogo from "../assets/bdmslogo.png";
import heroImg from "../assets/2.png";

// register Chart.js parts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// get logged-in hospital
const hospital = JSON.parse(localStorage.getItem("bdmsUser"));

const HosReport = () => {
  const data = {
    labels: ["A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "O+"],
    datasets: [
      {
        label: "Blood Stock Report",
        data: [30, 50, 70, 100, 90, 80, 60, 40],
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
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 140,
      },
    },
  };

  const handleDownload = () => {
    alert(`Downloading report for ${hospital} - ${date}`);
  };

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="report-page">
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
                <span className="text-danger">BLOOD</span> DONATION
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <span className="nav-link active-link">Reports</span>
            <Link to="/hospital-appointments" className="nav-link">
              Appointments
            </Link>
            <Link to="/hospital-dash" className="nav-link">
              Dashboard
            </Link>

            

            
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="report-main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="report-search-wrapper">
              
            </div>
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

          <div className="chart-container mb-4 admin-report-card-inner">
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Nov 22, 2025</span>
              <span>{hospital?.fName || "City Hospital"}</span>
            </div>

            <Line data={data} options={options} />
          </div>
        </div>
      </main>

    </div>
  );
};

export default HosReport;
