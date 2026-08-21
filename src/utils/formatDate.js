// This file formats timestamps for display, always in East Africa Time
// (EAT, UTC+3) regardless of the viewer's own browser/device timezone.

const EAT_OFFSET_MINUTES = 180;

export const formatTime24 = (timestamp) => {
  if (!timestamp) return "--:--";

  const utcDate = new Date(timestamp);
  const eatDate = new Date(utcDate.getTime() + EAT_OFFSET_MINUTES * 60000);
  const hours = String(eatDate.getUTCHours()).padStart(2, "0");
  const minutes = String(eatDate.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// NEW: formats a full date AND time together, e.g. "20/08/2026 09:30" -
// used for displaying permission request start/end times, since those
// carry a specific hour and minute the employee chose, not just a date.
export const formatDateTime24 = (timestamp) => {
  if (!timestamp) return "-";

  const utcDate = new Date(timestamp);
  const eatDate = new Date(utcDate.getTime() + EAT_OFFSET_MINUTES * 60000);
  const day = String(eatDate.getUTCDate()).padStart(2, "0");
  const month = String(eatDate.getUTCMonth() + 1).padStart(2, "0");
  const year = eatDate.getUTCFullYear();
  const hours = String(eatDate.getUTCHours()).padStart(2, "0");
  const minutes = String(eatDate.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
