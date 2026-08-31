export function generateOrderNumber(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `3DP-${year}${month}${day}-${random}`;
}

export function sanitizeFileName(fileName: string): string {
  const normalized = fileName.trim().replace(/\\/g, "/").split("/").pop() ?? "model.stl";
  const safeName = normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").toLowerCase();

  return safeName.toLowerCase().endsWith(".stl") ? safeName : `${safeName}.stl`;
}
