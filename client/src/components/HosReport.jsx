import React from "react";
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
import heroImg from "../assets/2.png";
import HospitalNavbar from "./HospitalNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
      <HospitalNavbar />

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
