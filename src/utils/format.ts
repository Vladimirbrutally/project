export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${formatNumber(bytes / 1024, 1)} KB`;
  }

  return `${formatNumber(bytes / (1024 * 1024), 1)} MB`;
}

export function formatHours(hours: number): string {
  const safeHours = Math.max(0, hours);
  const wholeHours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${wholeHours} h`;
  }

  return `${wholeHours} h ${minutes} min`;
}
