// This file contains helper functions for formatting dates/times consistently
// across the app.

// Converts a timestamp into 24-hour "HH:MM" format.
// Example: "2026-08-02T02:54:08.034Z" -> "02:54"
// Returns "--:--" if there's no timestamp (e.g. employee hasn't checked in yet).
export const formatTime24 = (timestamp) => {
  if (!timestamp) return "--:--";

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};