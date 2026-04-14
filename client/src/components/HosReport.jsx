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
import { downloadBloodStockWorkbook } from "../utils/bloodStockExcelExport";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HosReport = () => {
  const { t } = useLanguage();
  const reportRef = useRef(null);
  const [, forceUpdate] = useState(0);
  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");

  useEffect(() => {
    const onSettingsChange = () => forceUpdate((n) => n + 1);
    window.addEventListener("bdms-settings-changed", onSettingsChange);
    return () => window.removeEventListener("bdms-settings-changed", onSettingsChange);
  }, []);

  const userId = user?._id || user?.id;

  const [bloodData, setBloodData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/blood-stock-report?hospitalId=${encodeURIComponent(userId)}`)
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
  }, [userId]);

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

  const addPdfFooter = (pdf) => {
    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text("© BDMS SYSTEM. All rights reserved.", 105, 287, { align: "center" });
    }
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

      addPdfFooter(pdf);

      const filename = `blood-stock-report-${user?.fName || "hospital"}-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF");
    }
  };

  const handleExportExcel = async () => {
    if (!userId) {
      alert("Please log in to export.");
      return;
    }
    try {
      setExportingExcel(true);
      const url = `${API_BASE}/api/blood-stock-report?hospitalId=${encodeURIComponent(userId)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load report");
      const { data, records: recs } = await res.json();
      const metaRows = [
        { Field: "Report", Value: "BDMS blood stock" },
        { Field: "Hospital account", Value: user?.fName || "Hospital" },
        {
          Field: "Generated (Asia/Muscat)",
          Value: new Date().toLocaleString("en-GB", { timeZone: "Asia/Muscat" }),
        },
      ];
      const filename = `blood-stock-report-${user?.fName || "hospital"}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      downloadBloodStockWorkbook({
        filename,
        bloodData: data || [],
        records: recs || [],
        metaRows,
      });
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Failed to export Excel. Try again after the report finishes loading.");
    } finally {
      setExportingExcel(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-report-page">
      <main className="admin-report-main">
        <div className="container">
          <div className="d-flex justify-content-end gap-2 mb-2 no-print">
            <button
              type="button"
              className="btn admin-report-btn"
              onClick={handleExportExcel}
              disabled={loading || exportingExcel}
            >
              {exportingExcel ? "Exporting…" : "Export Excel"}
            </button>

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
              <div className="mb-3">
                <h4 className="mb-0">{t("bloodStockReportTitle")}</h4>
              </div>

              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>{new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Muscat" })}</span>
                <span>{user?.fName || "Hospital"}</span>
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
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Donor</th>
                            <th>Blood type</th>
                            <th className="text-end">Units</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Expiry</th>
                            <th>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.map((r, i) => (
                            <tr key={i}>
                              <td>{r.donorName || "—"}</td>
                              <td>{r.bloodType}</td>
                              <td className="text-end">{r.units}</td>
                              <td>
                                {r.donationDateDisplay ||
                                  (r.date
                                    ? new Date(r.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "Asia/Muscat",
                                      })
                                    : "—")}
                              </td>
                              <td>
                                {r.donationTimeDisplay ||
                                  (r.date
                                    ? new Date(r.date).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Asia/Muscat",
                                      })
                                    : "—")}
                              </td>
                              <td>{r.expiryDateDisplay || "—"}</td>
                              <td className="small">{r.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No donation records found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HosReport;