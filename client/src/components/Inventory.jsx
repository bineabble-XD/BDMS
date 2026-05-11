import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Muscat",
  }).replace(",", "");
};

const Inventory = () => {
  const { t, language } = useLanguage();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");

  const fetchInventory = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/blood-bank/all`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((records) => {
        const recordsList = Array.isArray(records) ? records : [];
        const key = (r) => {
          const hospital = r.hospitalId?.hospitalName || "Unknown Hospital";
          return `${hospital}|${r.bloodType}`;
        };
        const grouped = {};
        recordsList.forEach((r) => {
          const k = key(r);
          if (!grouped[k]) {
            grouped[k] = {
              hospital: r.hospitalId?.hospitalName || "Unknown Hospital",
              bloodType: r.bloodType,
              unitsAvailable: 0,
              lastUpdated: r.donationDate || r.updatedAt || r.createdAt,
            };
          }
          grouped[k].unitsAvailable += Number(r.availability) || 0;
          const recDate = r.donationDate || r.updatedAt || r.createdAt;
          if (recDate && (!grouped[k].lastUpdated || new Date(recDate) > new Date(grouped[k].lastUpdated))) {
            grouped[k].lastUpdated = recDate;
          }
        });
        setInventory(Object.values(grouped).sort((a, b) => {
          const cmp = a.hospital.localeCompare(b.hospital);
          return cmp !== 0 ? cmp : a.bloodType.localeCompare(b.bloodType);
        }));
      })
      .catch((err) => {
        setError(err.message || "Failed to load inventory");
        setInventory([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    const q = filterSearch.trim().toLowerCase();
    return inventory.filter((row) => {
      if (filterBloodType && row.bloodType !== filterBloodType) return false;
      if (q && !String(row.hospital).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inventory, filterSearch, filterBloodType]);

  const hasActiveFilters = Boolean(filterSearch.trim() || filterBloodType);

  const clearFilters = () => {
    setFilterSearch("");
    setFilterBloodType("");
  };

  const dir = language === "AR" ? "rtl" : "ltr";

  return (
    <div className="bdms-page inventory-page" dir={dir} lang={language === "AR" ? "ar" : "en"}>
      <div className="container py-5">
        <div className="mb-3">
          <h3 className="fw-semibold mb-1 text-danger">
            {t("inventoryTitle")}
          </h3>
        </div>

        <div
          className="shadow-sm"
          style={{
            borderRadius: "14px",
            border: "1px solid #e0e0e0",
            padding: "16px",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3">
            <h5 className="mb-0">{t("inventoryStockByHospital")}</h5>
          </div>

          {!loading && !error && inventory.length > 0 && (
            <div className="row g-2 align-items-end mb-3">
              <div className="col-12 col-md-6 col-lg-5">
                <label htmlFor="inventory-filter-search" className="form-label small text-muted mb-1">
                  {t("inventoryFilterSearchLabel")}
                </label>
                <input
                  id="inventory-filter-search"
                  type="search"
                  className="form-control"
                  placeholder={t("inventoryFilterSearchPlaceholder")}
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="col-12 col-md-4 col-lg-3">
                <label htmlFor="inventory-filter-blood" className="form-label small text-muted mb-1">
                  {t("inventoryFilterBloodType")}
                </label>
                <select
                  id="inventory-filter-blood"
                  className="form-select"
                  value={filterBloodType}
                  onChange={(e) => setFilterBloodType(e.target.value)}
                >
                  <option value="">{t("inventoryBloodTypeAll")}</option>
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2 col-lg-auto">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 text-nowrap"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  {t("inventoryClearFilters")}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status" />
              <p className="mt-2 text-muted">{t("inventoryLoading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <p>{error}</p>
              <button className="btn btn-outline-danger" onClick={fetchInventory}>
                {t("inventoryRetry")}
              </button>
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>{t("inventoryEmptyTitle")}</p>
              <p className="small mb-0">{t("inventoryEmptyHint")}</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-2">{t("inventoryNoFilterMatches")}</p>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={clearFilters}>
                {t("inventoryClearFilters")}
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "60px" }}>{t("inventoryColIndex")}</th>
                    <th>{t("inventoryColHospital")}</th>
                    <th>{t("inventoryColBloodType")}</th>
                    <th>{t("inventoryColUnits")}</th>
                    <th>{t("inventoryColUpdated")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((row, index) => (
                    <tr key={`${row.hospital}-${row.bloodType}`}>
                      <td>{index + 1}</td>
                      <td>{row.hospital}</td>
                      <td>
                        <span className="fw-semibold">{row.bloodType}</span>
                      </td>
                      <td>{row.unitsAvailable}</td>
                      <td className="text-muted small">{formatDate(row.lastUpdated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
