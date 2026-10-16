export type Ymd = { year: number; month: number; day: number };

const MIN = Date.UTC(1900, 0, 1);
const MAX = Date.UTC(2099, 11, 31);

function toAsciiDigits(value: string): string {
  return value.trim().replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - "０".charCodeAt(0)));
}

export function parseYmd(year: string, month: string, day: string): Ymd | "empty" | "invalid" {
  const fields = [year, month, day].map(toAsciiDigits);
  if (fields.some((field) => field === "")) return "empty";
  if (!fields.every((field) => /^\d+$/.test(field))) return "invalid";
  const ymd = { year: Number(fields[0]), month: Number(fields[1]), day: Number(fields[2]) };
  const utc = Date.UTC(ymd.year, ymd.month - 1, ymd.day);
  const check = new Date(utc);
  const real =
    check.getUTCFullYear() === ymd.year &&
    check.getUTCMonth() === ymd.month - 1 &&
    check.getUTCDate() === ymd.day;
  if (!real || utc < MIN || utc > MAX) return "invalid";
  return ymd;
}
