import {
  type DayMeta,
  ExcelAttendanceGrid,
  type ExcelStudentRow,
  buildExcelCsvBlob,
} from "@/components/attendance/ExcelAttendanceGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAttendanceBreakdown,
  useGetStaffAttendanceBreakdown,
  useHolidays,
  useMonthlyStudentAttendance,
} from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import type { ClassLevel } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function fmtDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function currentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function exportCSV(rows: Record<string, string>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold font-display mt-1 ${color}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

// Month picker — returns an ISO 'YYYY-MM' string
function MonthPicker({
  year,
  month,
  onChange,
}: {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}) {
  const value = `${year}-${String(month).padStart(2, "0")}`;
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-");
        if (y && m) onChange(Number(y), Number(m));
      }}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      data-ocid="excel_attendance.month_input"
    />
  );
}

// ─── Build DayMeta list for a month ───────────────────────────────────────

function buildDayMetas(
  year: number,
  month: number,
  holidayDates: Set<string>,
  holidayNames: Map<string, string>,
): DayMeta[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayMeta[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(date).getDay(); // 0=Sun
    const isWeekend = dow === 0;
    const isHoliday = holidayDates.has(date);
    days.push({
      date,
      dayNum: d,
      isWeekend,
      isHoliday,
      holidayName: holidayNames.get(date),
    });
  }
  return days;
}

// ─── Student Attendance Daily Report ────────────────────────────────────────

export function StudentAttendanceReport() {
  const { currentSession, sessions } = useAppStore();
  const [date, setDate] = useState(todayStr());
  const [session, setSession] = useState(currentSession);
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [excelYear, setExcelYear] = useState(currentYearMonth().year);
  const [excelMonth, setExcelMonth] = useState(currentYearMonth().month);
  const [excelClass, setExcelClass] = useState("all");
  const navigate = useNavigate();

  const { data: breakdown, isLoading: breakdownLoading } =
    useGetAttendanceBreakdown(date, session);

  // Monthly data for Excel grid
  const { data: monthlyRaw = [], isLoading: monthlyLoading } =
    useMonthlyStudentAttendance(excelYear, excelMonth, session);

  const { data: holidays = [] } = useHolidays(session);

  const holidayDates = useMemo(
    () => new Set(holidays.map((h) => h.date)),
    [holidays],
  );
  const holidayNames = useMemo(
    () => new Map(holidays.map((h) => [h.date, h.name])),
    [holidays],
  );

  // Day metadata for selected month
  const days = useMemo(
    () => buildDayMetas(excelYear, excelMonth, holidayDates, holidayNames),
    [excelYear, excelMonth, holidayDates, holidayNames],
  );

  // Class labels map
  const CL_DISPLAY: Record<string, string> = useMemo(() => {
    const m: Record<string, string> = {};
    for (const cl of CLASS_ORDER) m[cl] = CLASS_LABELS[cl as ClassLevel] ?? cl;
    return m;
  }, []);

  // Build Excel rows from monthly data
  const excelRows: ExcelStudentRow[] = useMemo(() => {
    return monthlyRaw
      .filter((r) => excelClass === "all" || r.classLevel === excelClass)
      .map((r) => ({
        admNo: r.admNo,
        studentName: r.studentName,
        classLevel: r.classLevel,
        classLabel: CL_DISPLAY[r.classLevel] ?? r.classLevel,
        sectionName: r.sectionName,
        attendance: r.days,
      }))
      .sort((a, b) => {
        const ai = CLASS_ORDER.indexOf(a.classLevel as ClassLevel);
        const bi = CLASS_ORDER.indexOf(b.classLevel as ClassLevel);
        if (ai !== bi) return ai - bi;
        if (a.sectionName < b.sectionName) return -1;
        if (a.sectionName > b.sectionName) return 1;
        return a.studentName.localeCompare(b.studentName);
      });
  }, [monthlyRaw, excelClass, CL_DISPLAY]);

  // Available classes in monthly data
  const excelClasses = useMemo(
    () =>
      [...new Set(monthlyRaw.map((r) => r.classLevel))].sort(
        (a, b) =>
          CLASS_ORDER.indexOf(a as ClassLevel) -
          CLASS_ORDER.indexOf(b as ClassLevel),
      ),
    [monthlyRaw],
  );

  // Daily breakdown filters
  const classes = useMemo(
    () => [...new Set((breakdown?.rows ?? []).map((r) => r.classLevel))].sort(),
    [breakdown],
  );
  const sections = useMemo(
    () =>
      [
        ...new Set(
          (breakdown?.rows ?? [])
            .filter(
              (r) => classFilter === "all" || r.classLevel === classFilter,
            )
            .map((r) => r.sectionName),
        ),
      ].sort(),
    [breakdown, classFilter],
  );

  const filteredRows = useMemo(
    () =>
      (breakdown?.rows ?? []).filter(
        (r) =>
          (classFilter === "all" || r.classLevel === classFilter) &&
          (sectionFilter === "all" || r.sectionName === sectionFilter),
      ),
    [breakdown, classFilter, sectionFilter],
  );

  const totalStudents = filteredRows.reduce((s, r) => s + r.total, 0);
  const totalPresent = filteredRows.reduce((s, r) => s + r.present, 0);
  const totalAbsent = filteredRows.reduce((s, r) => s + r.absent, 0);
  const overallPct =
    totalStudents > 0
      ? ((totalPresent / totalStudents) * 100).toFixed(1)
      : "0.0";

  function handleDailyExport() {
    exportCSV(
      filteredRows.map((r) => ({
        Class: r.classLabel,
        Section: r.sectionName,
        Present: String(r.present),
        Absent: String(r.absent),
        Total: String(r.total),
        "%": `${r.percent.toFixed(1)}%`,
        Date: fmtDate(date),
        Session: session,
      })),
      `attendance-report-${date}.csv`,
    );
  }

  function handleExcelExport() {
    const monthName = new Date(excelYear, excelMonth - 1, 1).toLocaleString(
      "en-IN",
      { month: "long", year: "numeric" },
    );
    const blob = buildExcelCsvBlob(excelRows, days, monthName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-register-${excelYear}-${String(excelMonth).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="p-4 sm:p-6 space-y-4 animate-fade-in"
      data-ocid="attendance_report.page"
    >
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/dashboard" })}
          data-ocid="attendance_report.back_button"
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold font-display text-foreground">
            Attendance Report
          </h1>
          <p className="text-xs text-muted-foreground">Session: {session}</p>
        </div>
      </div>

      {/* Session selector — shared across both tabs */}
      <Card className="border border-border">
        <CardContent className="p-3 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-muted-foreground font-medium">
            Session
          </span>
          <Select
            value={session}
            onValueChange={(v) => {
              setSession(v);
              setSectionFilter("all");
              setClassFilter("all");
            }}
          >
            <SelectTrigger
              className="w-32 h-8 text-sm"
              data-ocid="attendance_report.session_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4" data-ocid="attendance_report.tabs">
          <TabsTrigger value="daily" data-ocid="attendance_report.daily_tab">
            Daily Breakdown
          </TabsTrigger>
          <TabsTrigger value="excel" data-ocid="attendance_report.excel_tab">
            ✶ Excel Register
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Daily Breakdown (existing) ── */}
        <TabsContent value="daily" className="space-y-4">
          {/* Filters */}
          <Card
            className="border border-border"
            data-ocid="attendance_report.filters"
          >
            <CardContent className="p-4 flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="att-date"
                  className="text-xs text-muted-foreground font-medium"
                >
                  Date
                </label>
                <input
                  id="att-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSectionFilter("all");
                    setClassFilter("all");
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="attendance_report.date_input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="att-class"
                  className="text-xs text-muted-foreground font-medium"
                >
                  Class
                </label>
                <Select
                  value={classFilter}
                  onValueChange={(v) => {
                    setClassFilter(v);
                    setSectionFilter("all");
                  }}
                >
                  <SelectTrigger
                    id="att-class"
                    className="w-32 h-9 text-sm"
                    data-ocid="attendance_report.class_select"
                  >
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CL_DISPLAY[c] ?? c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="att-section"
                  className="text-xs text-muted-foreground font-medium"
                >
                  Section
                </label>
                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger
                    id="att-section"
                    className="w-28 h-9 text-sm"
                    data-ocid="attendance_report.section_select"
                  >
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="all">All</SelectItem>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDailyExport}
                className="ml-auto"
                data-ocid="attendance_report.export_button"
              >
                <Download className="size-4 mr-1" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              label="Total Students"
              value={totalStudents}
              color="text-foreground"
            />
            <SummaryCard
              label="Present"
              value={totalPresent}
              color="text-emerald-600"
            />
            <SummaryCard
              label="Absent"
              value={totalAbsent}
              color="text-red-500"
            />
            <SummaryCard
              label="Attendance %"
              value={`${overallPct}%`}
              color={
                Number(overallPct) >= 75
                  ? "text-emerald-600"
                  : Number(overallPct) >= 50
                    ? "text-amber-600"
                    : "text-red-500"
              }
            />
          </div>

          {/* Daily breakdown table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Section
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Present
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Absent
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {breakdownLoading ? (
                    [0, 1, 2, 3, 4].map((i) => (
                      <tr key={`row${i}`}>
                        {[0, 1, 2, 3, 4, 5].map((j) => (
                          <td key={`cell${i * 10 + j}`} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                        data-ocid="attendance_report.empty_state"
                      >
                        <Users className="size-8 mx-auto mb-2 opacity-30" />
                        No attendance data for this date/session.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, i) => {
                      const pct = row.percent;
                      const pctColor =
                        pct >= 75
                          ? "text-emerald-600 font-semibold"
                          : pct >= 50
                            ? "text-amber-600 font-semibold"
                            : "text-red-500 font-semibold";
                      return (
                        <tr
                          key={`${row.classLevel}-${row.sectionName}`}
                          className="hover:bg-muted/30 transition-colors"
                          data-ocid={`attendance_report.row.${i + 1}`}
                        >
                          <td className="px-4 py-3 font-medium">
                            {row.classLabel}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {row.sectionName}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                            {row.present}
                          </td>
                          <td className="px-4 py-3 text-right text-red-500 font-medium">
                            {row.absent}
                          </td>
                          <td className="px-4 py-3 text-right">{row.total}</td>
                          <td className={`px-4 py-3 text-right ${pctColor}`}>
                            {pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {filteredRows.length > 0 && (
                  <tfoot className="border-t-2 border-border bg-muted/40">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3 font-semibold text-sm"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">
                        {totalPresent}
                      </td>
                      <td className="px-4 py-3 text-right text-red-500 font-bold">
                        {totalAbsent}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {totalStudents}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          Number(overallPct) >= 75
                            ? "text-emerald-600"
                            : Number(overallPct) >= 50
                              ? "text-amber-600"
                              : "text-red-500"
                        }`}
                      >
                        {overallPct}%
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── TAB 2: Excel-style Monthly Register ── */}
        <TabsContent value="excel" className="space-y-4">
          {/* Excel filters */}
          <Card className="border border-border">
            <CardContent className="p-4 flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium">
                  Month
                </span>
                <MonthPicker
                  year={excelYear}
                  month={excelMonth}
                  onChange={(y, m) => {
                    setExcelYear(y);
                    setExcelMonth(m);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium">
                  Class
                </span>
                <Select value={excelClass} onValueChange={setExcelClass}>
                  <SelectTrigger
                    className="w-36 h-9 text-sm"
                    data-ocid="excel_attendance.class_select"
                  >
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="all">All Classes</SelectItem>
                    {excelClasses.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CL_DISPLAY[c] ?? c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Excel grid */}
          <ExcelAttendanceGrid
            year={excelYear}
            month={excelMonth}
            rows={excelRows}
            days={days}
            isLoading={monthlyLoading}
            onExport={handleExcelExport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Staff Attendance Report (unchanged) ─────────────────────────────────

export function StaffAttendanceReport() {
  const [date, setDate] = useState(todayStr());
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Present" | "Absent" | "Late"
  >("all");
  const navigate = useNavigate();

  const { data: breakdown, isLoading } = useGetStaffAttendanceBreakdown(date);

  const filteredRows = (breakdown?.rows ?? []).filter(
    (r) => statusFilter === "all" || r.status === statusFilter,
  );

  const totalStaff = breakdown?.rows.length ?? 0;
  const present = (breakdown?.rows ?? []).filter(
    (r) => r.status === "Present",
  ).length;
  const absent = totalStaff - present;

  function handleExport() {
    exportCSV(
      filteredRows.map((r) => ({
        Name: r.staffName,
        Status: r.status,
        "In Time": r.inTime ?? "",
        "Out Time": r.outTime ?? "",
        Device: r.deviceType,
        Date: fmtDate(date),
      })),
      `staff-attendance-${date}.csv`,
    );
  }

  return (
    <div
      className="p-4 sm:p-6 space-y-6 animate-fade-in"
      data-ocid="staff_attendance_report.page"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/dashboard" })}
          data-ocid="staff_attendance_report.back_button"
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold font-display text-foreground">
            Staff Attendance Report
          </h1>
          <p className="text-xs text-muted-foreground">Date: {fmtDate(date)}</p>
        </div>
      </div>

      <Card
        className="border border-border"
        data-ocid="staff_attendance_report.filters"
      >
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="staff-att-date"
              className="text-xs text-muted-foreground font-medium"
            >
              Date
            </label>
            <input
              id="staff-att-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              data-ocid="staff_attendance_report.date_input"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="staff-status"
              className="text-xs text-muted-foreground font-medium"
            >
              Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger
                id="staff-status"
                className="w-32 h-9 text-sm"
                data-ocid="staff_attendance_report.status_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="ml-auto"
            data-ocid="staff_attendance_report.export_button"
          >
            <Download className="size-4 mr-1" />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Total Staff"
          value={totalStaff}
          color="text-foreground"
        />
        <SummaryCard label="Present" value={present} color="text-emerald-600" />
        <SummaryCard label="Absent" value={absent} color="text-red-500" />
      </div>

      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  In Time
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Out Time
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Device
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={`sr${i}`}>
                    {[0, 1, 2, 3, 4].map((j) => (
                      <td key={`sc${i * 10 + j}`} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="staff_attendance_report.empty_state"
                  >
                    <Users className="size-8 mx-auto mb-2 opacity-30" />
                    No staff attendance data for this date.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr
                    key={row.staffId}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`staff_attendance_report.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium">{row.staffName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          row.status === "Present"
                            ? "bg-emerald-100 text-emerald-700"
                            : row.status === "Late"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.status === "Present" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <XCircle className="size-3" />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.inTime ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.outTime ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {row.deviceType || "Manual"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function AttendanceReportPage() {
  return <StudentAttendanceReport />;
}
