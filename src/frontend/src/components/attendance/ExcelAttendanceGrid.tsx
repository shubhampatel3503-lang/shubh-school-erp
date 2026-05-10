// Excel-style monthly attendance grid component
// Rows = students (sorted by class → section → name)
// Columns = day 01..31 + TOTAL P + TOTAL A
// Color: P=green, A=red, L=yellow, weekend/holiday=dark red vertical text

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Users } from "lucide-react";
import { useMemo } from "react";

export interface AttendanceCell {
  /** 'P' | 'A' | 'L' | '' */
  status: string;
}

export interface ExcelStudentRow {
  admNo: string;
  studentName: string;
  classLevel: string;
  classLabel: string;
  sectionName: string;
  /** key = 'YYYY-MM-DD', value = 'P'|'A'|'L'|'' */
  attendance: Record<string, string>;
}

export interface DayMeta {
  date: string; // 'YYYY-MM-DD'
  dayNum: number; // 1..31
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

interface ExcelAttendanceGridProps {
  year: number;
  month: number; // 1-based
  rows: ExcelStudentRow[];
  days: DayMeta[];
  isLoading: boolean;
  onExport: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  P: "background-color:#16a34a;color:#fff;",
  A: "background-color:#dc2626;color:#fff;",
  L: "background-color:#ca8a04;color:#fff;",
  "": "background-color:transparent;color:transparent;",
};

export function ExcelAttendanceGrid({
  year,
  month,
  rows,
  days,
  isLoading,
  onExport,
}: ExcelAttendanceGridProps) {
  const monthName = useMemo(
    () =>
      new Date(year, month - 1, 1).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    [year, month],
  );

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="size-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">
            Excel Register — {monthName}
          </span>
          <Badge variant="outline" className="text-xs">
            {rows.length} students
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          data-ocid="excel_attendance.export_button"
        >
          <FileSpreadsheet className="size-4 mr-1" />
          Export Excel
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs">
        {[
          { label: "P = Present", bg: "#16a34a" },
          { label: "A = Absent", bg: "#dc2626" },
          { label: "L = Leave", bg: "#ca8a04" },
          { label: "Weekend/Holiday", bg: "#8B0000" },
        ].map(({ label, bg }) => (
          <span key={label} className="flex items-center gap-1">
            <span
              className="inline-block size-3 rounded-sm"
              style={{ backgroundColor: bg }}
            />
            <span className="text-muted-foreground">{label}</span>
          </span>
        ))}
      </div>

      {/* Scrollable table */}
      <div
        className="overflow-auto rounded-md border border-border"
        style={{ maxHeight: "60vh" }}
        data-ocid="excel_attendance.grid"
      >
        <table
          className="text-xs border-collapse"
          style={{ minWidth: "max-content" }}
        >
          <thead>
            <tr className="sticky top-0 z-10">
              {/* Frozen header cells */}
              <th
                className="sticky left-0 z-20 border border-border bg-muted/80 px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap"
                style={{ minWidth: 60 }}
              >
                Adm No.
              </th>
              <th
                className="sticky z-20 border border-border bg-muted/80 px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap"
                style={{ minWidth: 140, left: 60 }}
              >
                Student Name
              </th>
              <th
                className="sticky z-20 border border-border bg-muted/80 px-2 py-1 text-center font-semibold text-muted-foreground"
                style={{ minWidth: 56, left: 200 }}
              >
                Class
              </th>
              <th
                className="sticky z-20 border border-border bg-muted/80 px-2 py-1 text-center font-semibold text-muted-foreground"
                style={{ minWidth: 48, left: 256 }}
              >
                Sec
              </th>
              {/* Day columns */}
              {days.map((d) => (
                <th
                  key={d.date}
                  className="border border-border text-center font-semibold"
                  style={{
                    minWidth: 32,
                    backgroundColor:
                      d.isWeekend || d.isHoliday ? "#8B0000" : undefined,
                    color: d.isWeekend || d.isHoliday ? "#fff" : undefined,
                    padding: "2px 1px",
                  }}
                  title={
                    d.isHoliday
                      ? d.holidayName
                      : d.isWeekend
                        ? "Weekend"
                        : undefined
                  }
                >
                  {d.isWeekend || d.isHoliday ? (
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        display: "block",
                        fontSize: 9,
                        lineHeight: 1,
                        padding: "4px 0",
                      }}
                    >
                      {d.isHoliday ? "HOLIDAY" : "WEEKEND"}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10 }}>
                      {String(d.dayNum).padStart(2, "0")}
                    </span>
                  )}
                </th>
              ))}
              {/* Total columns */}
              <th
                className="border border-border text-center font-semibold whitespace-nowrap"
                style={{
                  minWidth: 36,
                  backgroundColor: "#166534",
                  color: "#fff",
                  padding: "4px 4px",
                  fontSize: 10,
                }}
              >
                Total P
              </th>
              <th
                className="border border-border text-center font-semibold whitespace-nowrap"
                style={{
                  minWidth: 36,
                  backgroundColor: "#991b1b",
                  color: "#fff",
                  padding: "4px 4px",
                  fontSize: 10,
                }}
              >
                Total A
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder rows
                <tr key={`skel-${i}`}>
                  {[0, 1, 2, 3].map((j) => (
                    <td key={j} className="border border-border px-2 py-1">
                      <Skeleton className="h-3 w-full" />
                    </td>
                  ))}
                  {days.map((d) => (
                    <td key={d.date} className="border border-border p-0">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                  <td className="border border-border p-0">
                    <Skeleton className="h-5 w-full" />
                  </td>
                  <td className="border border-border p-0">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4 + days.length + 2}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="excel_attendance.empty_state"
                >
                  <Users className="size-8 mx-auto mb-2 opacity-30" />
                  No student attendance data for this month/class.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const totalP = days.filter(
                  (d) => row.attendance[d.date] === "P",
                ).length;
                const totalA = days.filter(
                  (d) =>
                    !d.isWeekend &&
                    !d.isHoliday &&
                    row.attendance[d.date] === "A",
                ).length;
                return (
                  <tr
                    key={`${row.admNo}-${idx}`}
                    className="hover:brightness-95"
                    data-ocid={`excel_attendance.row.${idx + 1}`}
                  >
                    {/* Frozen cells */}
                    <td
                      className="sticky left-0 z-10 border border-border bg-background px-2 py-0.5 font-mono text-muted-foreground"
                      style={{ minWidth: 60 }}
                    >
                      {row.admNo}
                    </td>
                    <td
                      className="sticky z-10 border border-border bg-background px-2 py-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ minWidth: 140, maxWidth: 180, left: 60 }}
                      title={row.studentName}
                    >
                      {row.studentName}
                    </td>
                    <td
                      className="sticky z-10 border border-border bg-background px-1 py-0.5 text-center"
                      style={{ minWidth: 56, left: 200 }}
                    >
                      {row.classLabel}
                    </td>
                    <td
                      className="sticky z-10 border border-border bg-background px-1 py-0.5 text-center"
                      style={{ minWidth: 48, left: 256 }}
                    >
                      {row.sectionName}
                    </td>
                    {/* Day cells */}
                    {days.map((d) => {
                      const status = row.attendance[d.date] ?? "";
                      const isSpecial = d.isWeekend || d.isHoliday;
                      return (
                        <td
                          key={d.date}
                          className="border border-border text-center font-bold p-0"
                          style={{
                            minWidth: 32,
                            height: 24,
                            ...(isSpecial
                              ? {
                                  backgroundColor: "#8B0000",
                                  color: "transparent",
                                }
                              : status
                                ? {
                                    backgroundColor:
                                      status === "P"
                                        ? "#16a34a"
                                        : status === "A"
                                          ? "#dc2626"
                                          : "#ca8a04",
                                    color: "#fff",
                                  }
                                : {}),
                          }}
                          title={
                            isSpecial
                              ? d.isHoliday
                                ? d.holidayName
                                : "Weekend"
                              : undefined
                          }
                        >
                          {!isSpecial && status ? (
                            <span style={{ fontSize: 10 }}>{status}</span>
                          ) : null}
                        </td>
                      );
                    })}
                    {/* Totals */}
                    <td
                      className="border border-border text-center font-bold"
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        fontSize: 11,
                      }}
                    >
                      {totalP}
                    </td>
                    <td
                      className="border border-border text-center font-bold"
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        fontSize: 11,
                      }}
                    >
                      {totalA}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Generates downloadable CSV data from the Excel grid */
export function buildExcelCsvBlob(
  rows: ExcelStudentRow[],
  days: DayMeta[],
  monthName: string,
): Blob {
  const statusStyle = STATUS_STYLE; // ensure no lint warning
  void statusStyle;
  const headers = [
    "Adm No.",
    "Student Name",
    "Class",
    "Section",
    ...days.map((d) =>
      d.isWeekend || d.isHoliday
        ? `${String(d.dayNum).padStart(2, "0")}(${d.isHoliday ? "H" : "W"})`
        : String(d.dayNum).padStart(2, "0"),
    ),
    "Total P",
    "Total A",
    "%",
  ];

  const dataLines = rows.map((row) => {
    const totalP = days.filter((d) => row.attendance[d.date] === "P").length;
    const totalA = days.filter(
      (d) => !d.isWeekend && !d.isHoliday && row.attendance[d.date] === "A",
    ).length;
    const workingDays = days.filter((d) => !d.isWeekend && !d.isHoliday).length;
    const pct =
      workingDays > 0 ? ((totalP / workingDays) * 100).toFixed(1) : "0.0";
    const cells = [
      `"${row.admNo}"`,
      `"${row.studentName.replace(/"/g, '""')}"`,
      `"${row.classLabel}"`,
      `"${row.sectionName}"`,
      ...days.map((d) => {
        if (d.isWeekend) return '"W"';
        if (d.isHoliday) return '"H"';
        return `"${row.attendance[d.date] ?? ""}"`;
      }),
      String(totalP),
      String(totalA),
      `"${pct}%"`,
    ];
    return cells.join(",");
  });

  const csv = [
    `"Attendance Register — ${monthName}"`,
    headers.map((h) => `"${h}"`).join(","),
    ...dataLines,
  ].join("\n");

  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}
