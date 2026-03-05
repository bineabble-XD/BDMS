import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminReport = () => {
  const reportRef = useRef(null);
  const [, forceUpdate] = useState(0);
  const [bloodData, setBloodData] = useState([]);

  useEffect(() => {
    const onSettingsChange = () => forceUpdate((n) => n + 1);
    window.addEventListener("bdms-settings-changed", onSettingsChange);
    return () => window.removeEventListener("bdms-settings-changed", onSettingsChange);
  }, []);
  const [records, setRecords] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHospitals = () => {
    fetch(`${API_BASE}/hospitals/approved`)
      .then((res) => res.json())
      .then((data) => setHospitals(Array.isArray(data) ? data : []))
      .catch(() => setHospitals([]));
  };

  const fetchReport = () => {
    setLoading(true);
    setError(null);
    const url = selectedHospitalId
      ? `${API_BASE}/api/blood-stock-report?hospitalId=${encodeURIComponent(selectedHospitalId)}`
      : `${API_BASE}/api/blood-stock-report`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then(({ data, records: recs }) => {
        setBloodData(data || []);
        setRecords(recs || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load report");
        setBloodData([]);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedHospitalId]);

  const selectedHospital = hospitals.find((h) => h._id === selectedHospitalId);
  const chartData = {
    labels: bloodData.map((d) => d.type),
    datasets: [
      {
        label: "Units Available",
        data: bloodData.map((d) => d.total),
        backgroundColor: "rgba(220, 53, 69, 0.7)",
        borderColor: "rgb(220, 53, 69)",
        borderWidth: 1,
      },
    ],
  };

  const isDark = document.body.classList.contains("bdms-dark");
  const textColor = isDark ? "#ffffff" : "#333";
  const gridColor = isDark ? "#444" : "#eee";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Blood Stock by Type",
        color: textColor,
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
      },
    },
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `blood-stock-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-report-page">
      <main className="admin-report-main">
        <div className="container">
          <div className="admin-report-filters mb-4 d-flex flex-wrap gap-2 align-items-center">
            <select
              className="form-select"
              style={{ maxWidth: "280px" }}
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.hospitalName} {h.city ? `(${h.city})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="d-flex justify-content-end gap-2 mb-2 no-print">
                <button
                  type="button"
                  className="btn admin-report-btn"
                  onClick={handleExportPDF}
                  disabled={loading}
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  className="btn admin-report-btn"
                  onClick={handlePrint}
                  disabled={loading}
                >
                  Print
                </button>
              </div>
              <div className="admin-report-card" ref={reportRef}>
                <div className="admin-report-card-inner">
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h4 className="mb-0">Blood Stock Report</h4>
                  </div>

                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>{new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Muscat" })}</span>
                    <span>{selectedHospital ? selectedHospital.hospitalName : "All Hospitals"}</span>
                  </div>

                  {loading ? (
                    <p className="text-muted">Loading report...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <div style={{ height: "320px" }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  )}

                  {!loading && !error && bloodData.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="mb-2">Summary by Blood Type</h6>
                      <table className="table table-sm table-bordered mb-4">
                        <thead>
                          <tr>
                            <th>Blood Type</th>
                            <th className="text-end">Units</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bloodData.map((d) => (
                            <tr key={d.type}>
                              <td>{d.type}</td>
                              <td className="text-end">{d.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="fw-bold">
                            <td>Total</td>
                            <td className="text-end">
                              {bloodData.reduce((s, d) => s + d.total, 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>

                      <h6 className="mb-2">Donation Details by Blood Group</h6>
                      {records.length > 0 ? (
                        <table className="table table-sm table-bordered">
                          <thead>
                            <tr>
                              <th>Blood Type</th>
                              <th className="text-end">Units</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.map((r, i) => (
                              <tr key={i}>
                                <td>{r.bloodType}</td>
                                <td className="text-end">{r.units}</td>
                                <td>
                                  {r.date
                                    ? new Date(r.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "Asia/Muscat",
                                      })
                                    : "—"}
                                </td>
                                <td>
                                  {r.date
                                    ? new Date(r.date).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Asia/Muscat",
                                      })
                                    : "—"}
                                </td>
                                <td>{r.location}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted small mb-0">No donation records found.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="admin-report-illustration text-center">
                <div className="card p-3">
                  <h6 className="mb-2">Report Summary</h6>
                  <p className="small text-muted mb-0">
                    This report shows blood stock levels aggregated by blood type from the blood bank
                    records. Select a hospital to filter or view all hospitals combined.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReport;
