export function formatNumberWithCommas(number: number | string): string {
  const num = typeof number === "string" ? parseFloat(number) : number;
  if (isNaN(num) || !isFinite(num)) return "-";
  return num.toLocaleString("en-US") ?? "-";
}
