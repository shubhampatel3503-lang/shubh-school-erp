import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import type { ClassLevel } from "@/types";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Date ─────────────────────────────────────────────────────────────────────
/**
 * Format an ISO date string (YYYY-MM-DD) or a date-like string to dd/mm/yyyy.
 * Returns "—" for empty/null input.
 */
export function formatDate(date: string): string {
  if (!date) return "—";
  // If already in dd/mm/yyyy format, return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Parse a dd/mm/yyyy string to a Date object.
 * Returns null if the input is invalid or empty.
 */
export function parseDateInput(ddmmyyyy: string): Date | null {
  if (!ddmmyyyy) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddmmyyyy);
  if (!match) return null;
  const [, dd, mm, yyyy] = match.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
}

/**
 * Format an ISO date-time string to dd/mm/yyyy HH:MM.
 * Returns "—" for empty/null input.
 */
export function formatDateTime(date: string): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

// ─── Class helpers ────────────────────────────────────────────────────────────
export function getClassLabel(classLevel: ClassLevel): string {
  return CLASS_LABELS[classLevel] ?? classLevel;
}

export { CLASS_ORDER, CLASS_LABELS };

// ─── Session ──────────────────────────────────────────────────────────────────
export function getCurrentSession(): string {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const next = (year + 1).toString().slice(2);
  return `${year}-${next}`;
}

export function sessionYears(from = 2019): string[] {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (let y = from; y <= current; y++) {
    const next = (y + 1).toString().slice(2);
    years.push(`${y}-${next}`);
  }
  return years;
}

// ─── School months (April → March) ───────────────────────────────────────────
export const SCHOOL_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

// ─── ID generation ────────────────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Excel/CSV export ─────────────────────────────────────────────────────────
/**
 * Download records as a CSV file.
 * @param data     Array of plain objects to export.
 * @param filename Target filename (`.csv` appended if missing).
 * @param columns  Optional ordered list of keys to include. If omitted, all
 *                 keys from the first record are used in their natural order.
 */
export function downloadCSV(
  data: Record<string, unknown>[],
  filename: string,
  columns?: string[],
): void {
  if (!data.length) return;
  const headers = columns ?? Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val == null ? "" : String(val);
        // Quote if contains comma, newline or double-quote
        return /[,\n"]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      })
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Trigger a client-side CSV download from a pre-built CSV string.
 */
export function downloadCSVString(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export function truncate(str: string, max = 40): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
