export function getShortOrderId(orderId: string): string {
  const compact = String(orderId || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  const suffix = compact.slice(-4).padStart(4, "0");
  return `#PV-${suffix}`;
}
