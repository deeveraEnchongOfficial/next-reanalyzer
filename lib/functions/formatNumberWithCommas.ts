export function formatNumberWithCommas(number: number): string {
  if (!number) return "TBA";
  return number.toLocaleString("en-US");
}
