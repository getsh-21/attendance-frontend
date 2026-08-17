// This file formats timestamps for display, always in East Africa Time
// (EAT, UTC+3) regardless of the viewer's own browser/device timezone -
// keeps displayed times consistent for every admin, everywhere,
// matching how the backend enforces the check-in/checkout windows.

const EAT_OFFSET_MINUTES = 180;

export const formatTime24 = (timestamp) => {
  if (!timestamp) return "--:--";

  const utcDate = new Date(timestamp);
  const eatDate = new Date(utcDate.getTime() + EAT_OFFSET_MINUTES * 60000);
  const hours = String(eatDate.getUTCHours()).padStart(2, "0");
  const minutes = String(eatDate.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
