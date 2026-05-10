import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllFeePaymentsBySession,
  useGetFeeRegisterBySession,
  useInventoryItems,
  useInventoryTransactions,
  useRoutes,
  useSections,
  useStaff,
  useStudents,
  useSubjects,
} from "@/hooks/useBackend";
import {
  CLASS_ORDER,
  downloadCSV,
  formatCurrency,
  formatDate,
  getClassLabel,
  sessionYears,
} from "@/lib/utils";
import {
  BarChart2,
  BarChart3,
  BookOpen,
  Bus,
  ClipboardList,
  DollarSign,
  Download,
  GraduationCap,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

type ReportType =
  | "students"
  | "finance"
  | "attendance"
  | "academics"
  | "hr"
  | "transport"
  | "inventory"
  | "fees-due";

interface ReportConfig {
  id: ReportType;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const REPORT_TYPES: ReportConfig[] = [
  {
    id: "students",
    label: "Students",
    icon: Users,
    description:
      "Enrollment, class-wise counts, gender & category distribution",
    color: "text-blue-600",
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    description: "Fee collection, payment modes, collector-wise summary",
    color: "text-green-600",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardList,
    description: "Class-wise attendance percentages and daily counts",
    color: "text-orange-600",
  },
  {
    id: "academics",
    label: "Academics",
    icon: BookOpen,
    description: "Classes, sections, subjects and student distribution",
    color: "text-purple-600",
  },
  {
    id: "hr",
    label: "HR / Staff",
    icon: GraduationCap,
    description: "Staff directory, departments, designations and salary",
    color: "text-pink-600",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    description: "Routes, bus numbers, drivers and student ridership",
    color: "text-yellow-600",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: BarChart2,
    description: "Stock levels, categories, purchase and sales transactions",
    color: "text-teal-600",
  },
  {
    id: "fees-due",
    label: "Fees Due",
    icon: Wallet,
    description: "Students with outstanding fee balances this session",
    color: "text-red-600",
  },
];

type Cell = string | React.ReactNode;

function ReportTable({
  headers,
  rows,
  emptyMessage = "No data available for this session",
}: {
  headers: string[];
  rows: Cell[][];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-muted-foreground"
        data-ocid="reports.empty_state"
      >
        <BarChart3 className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static report rows
            <tr key={i} className="border-t border-border hover:bg-muted/20">
              {row.map((cell, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static report rows
                <td key={j} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SkeletonReport() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-lg" />
      </CardContent>
    </Card>
  );
}

// ── Student Report ─────────────────────────────────────────────────────────────
function StudentReport({
  session,
  classFilter,
}: {
  session: string;
  classFilter: string;
}) {
  const { data: students = [], isLoading } = useStudents();
  const sessionStudents = useMemo(
    () => students.filter((s) => s.sessionId === session),
    [students, session],
  );
  const filtered = useMemo(
    () =>
      classFilter === "all"
        ? sessionStudents
        : sessionStudents.filter((s) => s.classLevel === classFilter),
    [sessionStudents, classFilter],
  );
  const active = filtered.filter((s) => !s.isDiscontinued);
  const discontinued = filtered.filter((s) => s.isDiscontinued);
  const genderCounts = useMemo(() => {
    const m = active.filter((s) => s.gender === "Male").length;
    const f = active.filter((s) => s.gender === "Female").length;
    return { m, f, other: active.length - m - f };
  }, [active]);
  const classRows = useMemo(
    () =>
      CLASS_ORDER.map((cl) => {
        const inClass = filtered.filter((s) => s.classLevel === cl);
        const a = inClass.filter((s) => !s.isDiscontinued).length;
        const d = inClass.filter((s) => s.isDiscontinued).length;
        return {
          class: getClassLabel(cl),
          active: a,
          discontinued: d,
          total: a + d,
        };
      }).filter((r) => r.total > 0),
    [filtered],
  );

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Enrollment — {session}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Active Students" value={active.length} />
          <StatCard
            label="Discontinued"
            value={discontinued.length}
            color="text-destructive"
          />
          <StatCard
            label="Male / Female"
            value={`${genderCounts.m} / ${genderCounts.f}`}
            color="text-accent-foreground"
          />
          <StatCard
            label="Total"
            value={filtered.length}
            color="text-primary"
          />
        </div>
        <ReportTable
          headers={["Class", "Active", "Discontinued", "Total"]}
          rows={classRows.map((r) => [
            r.class,
            String(r.active),
            String(r.discontinued),
            String(r.total),
          ])}
        />
      </CardContent>
    </Card>
  );
}

// ── Finance Report ─────────────────────────────────────────────────────────────
function FinanceReport({ session }: { session: string }) {
  const { data: register = [], isLoading } =
    useGetFeeRegisterBySession(session);
  const active = register.filter((e) => !e.isDeleted);
  const totalCollected = active.reduce((s, e) => s + e.totalAmount, 0);
  const totalBalance = active.reduce((s, e) => s + (e.balance ?? 0), 0);

  const byMode = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of active) {
      const mode = e.paymentMode || "Cash";
      map[mode] = (map[mode] ?? 0) + e.totalAmount;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);

  const byCollector = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of active) {
      const c = e.collectedBy || "—";
      map[c] = (map[c] ?? 0) + e.totalAmount;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Summary — {session}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Collected"
            value={formatCurrency(totalCollected)}
            color="text-green-600"
          />
          <StatCard
            label="Balance Carried"
            value={formatCurrency(totalBalance)}
            color="text-destructive"
          />
          <StatCard label="Total Receipts" value={active.length} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Payment Mode Breakdown
            </p>
            <ReportTable
              headers={["Mode", "Amount"]}
              rows={byMode.map(([mode, amt]) => [mode, formatCurrency(amt)])}
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Collector-wise Summary
            </p>
            <ReportTable
              headers={["Collector", "Amount"]}
              rows={byCollector.map(([col, amt]) => [col, formatCurrency(amt)])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Attendance Report ───────────────────────────────────────────────────────────
function AttendanceReport({
  session,
  classFilter,
}: {
  session: string;
  classFilter: string;
}) {
  const { data: students = [], isLoading } = useStudents();
  const sessionStudents = useMemo(
    () => students.filter((s) => s.sessionId === session && !s.isDiscontinued),
    [students, session],
  );
  const classRows = useMemo(
    () =>
      CLASS_ORDER.filter((cl) => classFilter === "all" || cl === classFilter)
        .map((cl) => {
          const count = sessionStudents.filter(
            (s) => s.classLevel === cl,
          ).length;
          return { class: getClassLabel(cl), count };
        })
        .filter((r) => r.count > 0),
    [sessionStudents, classFilter],
  );

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary — {session}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Active Students"
            value={sessionStudents.length}
          />
          <StatCard label="Classes with Data" value={classRows.length} />
          <StatCard
            label="Session"
            value={session}
            color="text-accent-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Attendance percentage data is recorded per-student in the Attendance
          module. This shows enrolled student counts by class for {session}.
        </p>
        <ReportTable
          headers={["Class", "Enrolled Students"]}
          rows={classRows.map((r) => [r.class, String(r.count)])}
        />
      </CardContent>
    </Card>
  );
}

// ── Academics Report ────────────────────────────────────────────────────────────
function AcademicsReport({ session }: { session: string }) {
  const { data: sections = [], isLoading: sectionsLoading } = useSections();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const sessionStudents = useMemo(
    () => students.filter((s) => s.sessionId === session),
    [students, session],
  );

  const classCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of sessionStudents) {
      map[s.classLevel] = (map[s.classLevel] ?? 0) + 1;
    }
    return map;
  }, [sessionStudents]);

  const uniqueClasses = useMemo(() => {
    const cl = new Set(sections.map((s) => s.classLevel));
    return CLASS_ORDER.filter((c) => cl.has(c));
  }, [sections]);

  const isLoading = sectionsLoading || subjectsLoading || studentsLoading;
  if (isLoading) return <SkeletonReport />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academics Overview — {session}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Classes" value={uniqueClasses.length} />
          <StatCard label="Total Sections" value={sections.length} />
          <StatCard label="Total Subjects" value={subjects.length} />
          <StatCard label="Enrolled Students" value={sessionStudents.length} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Students per Class
            </p>
            <ReportTable
              headers={["Class", "Students"]}
              rows={CLASS_ORDER.filter((cl) => classCounts[cl] > 0).map(
                (cl) => [getClassLabel(cl), String(classCounts[cl] ?? 0)],
              )}
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Sections
            </p>
            <ReportTable
              headers={["Class", "Section", "Room"]}
              rows={sections.map((s) => [
                getClassLabel(s.classLevel),
                s.name,
                s.roomNo || "—",
              ])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── HR / Staff Report ───────────────────────────────────────────────────────────
function HRReport() {
  const { data: staff = [], isLoading } = useStaff();
  const active = staff.filter((s) => s.isActive);
  const inactive = staff.filter((s) => !s.isActive);

  const deptMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of active) {
      const d = s.department || "General";
      map[d] = (map[d] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);

  const totalSalary = active.reduce((s, m) => s + m.basicSalary, 0);

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Staff" value={staff.length} />
          <StatCard
            label="Active"
            value={active.length}
            color="text-green-600"
          />
          <StatCard
            label="Inactive"
            value={inactive.length}
            color="text-destructive"
          />
          <StatCard
            label="Monthly Salary"
            value={formatCurrency(totalSalary)}
            color="text-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Department-wise Count
            </p>
            <ReportTable
              headers={["Department", "Staff"]}
              rows={deptMap.map(([dept, cnt]) => [dept, String(cnt)])}
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Staff Directory
            </p>
            <ReportTable
              headers={["Code", "Name", "Designation", "Joining", "Status"]}
              rows={staff.map((s) => [
                s.staffCode,
                s.fullName,
                s.designation,
                formatDate(s.dateOfJoining),
                <Badge
                  key={s.staffCode}
                  variant={s.isActive ? "default" : "secondary"}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </Badge>,
              ])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Transport Report ────────────────────────────────────────────────────────────
function TransportReport() {
  const { data: routes = [], isLoading } = useRoutes();
  const { data: students = [] } = useStudents();

  const routeStudentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of students) {
      if (s.transportRouteId) {
        map[s.transportRouteId] = (map[s.transportRouteId] ?? 0) + 1;
      }
    }
    return map;
  }, [students]);

  const totalRiders = Object.values(routeStudentCounts).reduce(
    (sum, c) => sum + c,
    0,
  );

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transport Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Routes" value={routes.length} />
          <StatCard label="Total Riders" value={totalRiders} />
          <StatCard
            label="Avg per Route"
            value={
              routes.length > 0 ? Math.round(totalRiders / routes.length) : 0
            }
          />
        </div>
        <ReportTable
          headers={["Route", "Bus No.", "Driver", "Driver Mobile", "Students"]}
          rows={routes.map((r) => [
            r.name,
            r.busNumber || "—",
            r.driverName || "—",
            r.driverMobile || "—",
            String(routeStudentCounts[r.id] ?? 0),
          ])}
        />
      </CardContent>
    </Card>
  );
}

// ── Inventory Report ────────────────────────────────────────────────────────────
function InventoryReport() {
  const { data: items = [], isLoading: itemsLoading } = useInventoryItems();
  const { data: transactions = [], isLoading: txLoading } =
    useInventoryTransactions();

  const totalPurchaseValue = items.reduce(
    (s, it) => s + it.currentStock * it.purchasePrice,
    0,
  );
  const totalSaleValue = items.reduce(
    (s, it) => s + it.currentStock * it.salePrice,
    0,
  );
  const salesTx = transactions.filter((t) => t.type === "Sale");
  const totalSalesAmount = salesTx.reduce((s, t) => s + t.totalAmount, 0);

  const categoryMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) {
      const cat = it.category || "General";
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const isLoading = itemsLoading || txLoading;
  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Items" value={items.length} />
          <StatCard
            label="Purchase Value"
            value={formatCurrency(totalPurchaseValue)}
          />
          <StatCard
            label="Sale Value"
            value={formatCurrency(totalSaleValue)}
            color="text-green-600"
          />
          <StatCard
            label="Sales Recorded"
            value={formatCurrency(totalSalesAmount)}
            color="text-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Category-wise Items
            </p>
            <ReportTable
              headers={["Category", "Items"]}
              rows={categoryMap.map(([cat, cnt]) => [cat, String(cnt)])}
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Stock Levels
            </p>
            <ReportTable
              headers={["Item", "Stock", "Min Stock", "Sale Price"]}
              rows={items.map((it) => [
                it.name,
                `${it.currentStock} ${it.unit}`,
                String(it.minStock),
                formatCurrency(it.salePrice),
              ])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Fees Due Report ─────────────────────────────────────────────────────────────
function FeesDueReport({ session }: { session: string }) {
  const { data: register = [], isLoading } =
    useGetFeeRegisterBySession(session);
  const { data: students = [] } = useStudents();
  const [search, setSearch] = useState("");

  // Build student map for name/class lookup
  const studentMap = useMemo(() => {
    const map = new Map<string, (typeof students)[0]>();
    for (const s of students) map.set(s.id, s);
    return map;
  }, [students]);

  // Compute balance per student: totalDue - totalPaid across all receipts
  const dueMap = useMemo(() => {
    const paid: Record<string, number> = {};
    for (const e of register) {
      if (e.isDeleted) continue;
      paid[e.studentId] = (paid[e.studentId] ?? 0) + e.totalAmount;
    }
    // Students with carry-forward balance from receipt records
    const withBalance: Record<string, number> = {};
    for (const e of register) {
      if (e.isDeleted || !e.balance || e.balance <= 0) continue;
      // Use latest balance per student
      if (!withBalance[e.studentId] || withBalance[e.studentId] < e.balance) {
        withBalance[e.studentId] = e.balance;
      }
    }
    return withBalance;
  }, [register]);

  const dueRows = useMemo(() => {
    return Object.entries(dueMap)
      .map(([sid, balance]) => {
        const st = studentMap.get(sid);
        return {
          admNo: st?.admNo ?? "—",
          name: st?.fullName ?? "Unknown",
          class: st ? getClassLabel(st.classLevel) : "—",
          balance,
          mobile: st?.fatherMobile ?? "—",
        };
      })
      .filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.admNo.toLowerCase().includes(q) ||
          r.class.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.balance - a.balance);
  }, [dueMap, studentMap, search]);

  if (isLoading) return <SkeletonReport />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outstanding Fees — {session}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Students with Balance"
            value={Object.keys(dueMap).length}
            color="text-destructive"
          />
          <StatCard
            label="Total Outstanding"
            value={formatCurrency(
              Object.values(dueMap).reduce((s, v) => s + v, 0),
            )}
            color="text-destructive"
          />
          <StatCard label="Showing" value={dueRows.length} />
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name, adm. no. or class…"
            className="max-w-xs h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="reports.fees_due.search_input"
          />
          {dueRows.length > 0 && (
            <Badge variant="destructive">
              {dueRows.length} students with dues
            </Badge>
          )}
        </div>
        <ReportTable
          headers={["Adm No.", "Name", "Class", "Balance", "Mobile"]}
          rows={dueRows.map((r) => [
            r.admNo,
            r.name,
            r.class,
            <span key={r.admNo} className="font-medium text-destructive">
              {formatCurrency(r.balance)}
            </span>,
            r.mobile,
          ])}
        />
      </CardContent>
    </Card>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [session, setSession] = useState("2025-26");
  const [classFilter, setClassFilter] = useState("all");

  const sessions = useMemo(() => sessionYears(2019).reverse(), []);

  // ── Export helpers ──
  const { data: students = [] } = useStudents();
  const { data: staff = [] } = useStaff();
  const { data: feeRegister = [] } = useGetFeeRegisterBySession(session);
  const { data: routes = [] } = useRoutes();
  const { data: inventory = [] } = useInventoryItems();

  function handleExport(type: ReportType) {
    if (type === "students") {
      const sessionStudents = students.filter((s) => s.sessionId === session);
      downloadCSV(
        sessionStudents.map((s) => ({
          "Adm No": s.admNo,
          Name: s.fullName,
          Class: getClassLabel(s.classLevel),
          Gender: s.gender,
          Category: s.category,
          "Father Name": s.fatherName,
          Mobile: s.fatherMobile,
          Status: s.isDiscontinued ? "Discontinued" : "Active",
        })),
        `student-report-${session}`,
      );
    } else if (type === "finance" || type === "fees-due") {
      downloadCSV(
        feeRegister
          .filter((e) => !e.isDeleted)
          .map((e) => ({
            "Receipt No": e.receiptNo,
            "Student ID": e.studentId,
            Name: e.studentName,
            Class: e.className,
            Date: formatDate(e.paymentDate),
            Months: e.months.join(", "),
            "Total Due": e.totalDue,
            "Amount Paid": e.totalAmount,
            Balance: e.balance,
            Mode: e.paymentMode,
            "Collected By": e.collectedBy,
          })),
        `fees-report-${session}`,
      );
    } else if (type === "hr") {
      downloadCSV(
        staff.map((s) => ({
          Code: s.staffCode,
          Name: s.fullName,
          Designation: s.designation,
          Department: s.department,
          Mobile: s.mobile,
          "Joining Date": formatDate(s.dateOfJoining),
          Salary: s.basicSalary,
          Status: s.isActive ? "Active" : "Inactive",
        })),
        "staff-report",
      );
    } else if (type === "transport") {
      downloadCSV(
        routes.map((r) => ({
          Route: r.name,
          "Bus No": r.busNumber,
          Driver: r.driverName,
          "Driver Mobile": r.driverMobile,
        })),
        "transport-report",
      );
    } else if (type === "inventory") {
      downloadCSV(
        inventory.map((it) => ({
          Name: it.name,
          Category: it.category,
          Store: it.store,
          Unit: it.unit,
          Stock: it.currentStock,
          "Min Stock": it.minStock,
          "Purchase Price": it.purchasePrice,
          "Sale Price": it.salePrice,
        })),
        "inventory-report",
      );
    } else {
      downloadCSV([{ note: "No data" }], `${type}-report`);
    }
  }

  const showClassFilter = selected === "students" || selected === "attendance";

  return (
    <div className="p-6 space-y-6" data-ocid="reports.page">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive reports and analytics — all data is live from the
            system
          </p>
        </div>
      </div>

      {!selected && (
        <div
          className="grid grid-cols-4 gap-4"
          data-ocid="reports.selector.section"
        >
          {REPORT_TYPES.map((rt, i) => (
            <button
              key={rt.id}
              type="button"
              onClick={() => setSelected(rt.id)}
              className="group flex flex-col items-start gap-3 p-5 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left"
              data-ocid={`reports.item.${i + 1}`}
            >
              <div
                className={`p-2 rounded-lg bg-muted/40 group-hover:scale-110 transition-transform ${rt.color}`}
              >
                <rt.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{rt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {rt.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="space-y-4" data-ocid="reports.view.section">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(null)}
                data-ocid="reports.back.button"
              >
                ← Back
              </Button>
              <h2 className="text-lg font-semibold text-foreground">
                {REPORT_TYPES.find((r) => r.id === selected)?.label} Report
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Session</Label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger
                  className="w-28 h-8"
                  data-ocid="reports.session.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showClassFilter && (
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger
                    className="w-32 h-8"
                    data-ocid="reports.class.select"
                  >
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {getClassLabel(c)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                size="sm"
                onClick={() => handleExport(selected)}
                data-ocid="reports.export.button"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {selected === "students" && (
            <StudentReport session={session} classFilter={classFilter} />
          )}
          {selected === "finance" && <FinanceReport session={session} />}
          {selected === "attendance" && (
            <AttendanceReport session={session} classFilter={classFilter} />
          )}
          {selected === "academics" && <AcademicsReport session={session} />}
          {selected === "hr" && <HRReport />}
          {selected === "transport" && <TransportReport />}
          {selected === "inventory" && <InventoryReport />}
          {selected === "fees-due" && <FeesDueReport session={session} />}
        </div>
      )}
    </div>
  );
}
