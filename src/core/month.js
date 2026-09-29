const monthIndex = (m) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames.map(name => name.toLowerCase()).indexOf(`${m}`.toLowerCase());
};

const monthName = (m) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[m];
};

export { monthIndex, monthName }
