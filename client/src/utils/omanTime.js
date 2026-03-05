export const TZ = "Asia/Muscat";

export const getTodayInOman = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
};

export const getNowInOman = () => {
  const timeStr = new Date().toLocaleTimeString("en-GB", { timeZone: TZ, hour12: false });
  const [h, min] = timeStr.split(":").map(Number);
  return { hours: h ?? 0, minutes: min ?? 0 };
};

export const getCurrentMinutesInOman = () => {
  const { hours, minutes } = getNowInOman();
  return hours * 60 + minutes;
};

export const getMaxDateInOman = (daysFromNow = 14) => {
  const today = getTodayInOman();
  const d = new Date(today + "T12:00:00+04:00");
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().split("T")[0];
};

/** Date N days from today (negative = past). For blood bank: getMinDateInOman(-14) = 2 weeks ago */
export const getMinDateInOman = (daysFromNow = -14) => {
  const today = getTodayInOman();
  const d = new Date(today + "T00:00:00+04:00");
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().split("T")[0];
};

/** Format as datetime-local value (YYYY-MM-DDTHH:mm) for max = now in Oman */
export const getNowDatetimeLocalOman = () => {
  const now = new Date();
  const omanStr = now.toLocaleString("sv-SE", { timeZone: TZ });
  const [datePart, timePart] = omanStr.replace(" ", "T").split("T");
  const [y, m, d] = datePart.split("-");
  const [h, min] = (timePart || "00:00").split(":");
  return `${y}-${m}-${d}T${h.padStart(2, "0")}:${(min || "00").padStart(2, "0")}`;
};
