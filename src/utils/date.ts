const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatShortDate(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS_SHORT[month - 1]} ${String(day).padStart(2, "0")}`;
}

export function formatFullDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${weekday}, ${MONTHS_FULL[month - 1]} ${day}, ${year}`;
}
