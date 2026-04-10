import * as XLSX from "xlsx";

const MUSCAT = { timeZone: "Asia/Muscat" };

function legacyDonationDisplays(r) {
  const raw = r.date;
  if (!raw) return { date: "—", time: "—" };
  const dm = new Date(raw);
  if (Number.isNaN(dm.getTime())) return { date: "—", time: "—" };
  return {
    date: dm.toLocaleDateString("en-GB", {
      ...MUSCAT,
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: dm.toLocaleTimeString("en-GB", {
      ...MUSCAT,
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * Builds dataset-oriented rows for the detailed blood stock sheet (API /api/blood-stock-report).
 */
export function bloodStockDetailRows(records) {
  return (records || []).map((r) => {
    const leg = legacyDonationDisplays(r);
    return {
      "Record ID": r.recordId ?? "—",
      "Donor name": r.donorName ?? "—",
      "Donor email": r.donorEmail ?? "—",
      "Donor phone": r.donorPhone ?? "—",
      "Donor age": r.donorAge ?? "—",
      "Donor gender": r.donorGender ?? "—",
      "Donor profile blood type": r.donorRegisteredBloodType ?? "—",
      "Unit blood type": r.bloodType ?? "—",
      Units: r.units ?? "—",
      "Donation date": r.donationDateDisplay ?? leg.date,
      "Donation time": r.donationTimeDisplay ?? leg.time,
      "Expiry date": r.expiryDateDisplay ?? "—",
      Hospital: r.hospitalName ?? "—",
      City: r.hospitalCity ?? "—",
      Location: r.location ?? "—",
      "Record entered": r.recordCreatedDisplay ?? "—",
    };
  });
}

export function bloodStockSummaryRows(bloodData) {
  return (bloodData || []).map((item) => ({
    "Blood type": item.type,
    "Units available": item.total,
  }));
}

function sheetFromRows(rows) {
  const safe =
    rows && rows.length > 0
      ? rows
      : [{ Note: "No rows to export — load the report or add blood bank records, then export again." }];
  return XLSX.utils.json_to_sheet(safe);
}

/**
 * @param {object} opts
 * @param {string} opts.filename
 * @param {Array} opts.bloodData - summary by type from API `data`
 * @param {Array} opts.records - detailed rows from API `records`
 * @param {Array<{ Field: string, Value: string }>} [opts.metaRows]
 */
export function downloadBloodStockWorkbook({ filename, bloodData, records, metaRows }) {
  const workbook = XLSX.utils.book_new();

  const summaryRows = bloodStockSummaryRows(bloodData);
  const detailRows = bloodStockDetailRows(records);

  // Data sheets first: many users only open the first tab in Excel.
  XLSX.utils.book_append_sheet(workbook, sheetFromRows(summaryRows), "Summary by type");
  XLSX.utils.book_append_sheet(workbook, sheetFromRows(detailRows), "Donation records");

  const meta =
    metaRows && metaRows.length
      ? metaRows
      : [{ Field: "Report", Value: "BDMS blood stock" }];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(meta), "Report info");

  XLSX.writeFile(workbook, filename);
}
