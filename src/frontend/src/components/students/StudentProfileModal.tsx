import { GeneratePrintModal } from "@/components/certificates/GeneratePrintModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAttendanceByStudent,
  useCertificateTemplates,
  useDeleteStudent,
  useDiscontinueStudent,
  usePaymentsByStudent,
  useRoutes,
} from "@/hooks/useBackend";
import {
  CLASS_LABELS,
  formatCurrency,
  formatDate,
  getInitials,
} from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { FeePayment, Section, Student, TransportRoute } from "@/types";
import {
  BookOpen,
  Bus,
  Calendar,
  CheckCircle2,
  CreditCard,
  Edit,
  FileSpreadsheet,
  Phone,
  Printer,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

// ─── Extended student fields (optional extra fields not in base type) ─────────
type ExtStudent = Student & {
  bloodGroup?: string;
  religion?: string;
  category?: string;
  motherTongue?: string;
  email?: string;
  siblings?: number;
  rollNumber?: string;
  previousSchool?: string;
};

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  value,
  phone = false,
}: {
  label: string;
  value: string;
  phone?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
        {label}
      </p>
      {phone && value !== "—" ? (
        <a
          href={`tel:${value}`}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          <Phone className="h-3 w-3" />
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground break-words">
          {value || "—"}
        </p>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold font-display">{title}</h3>
      </div>
      <Separator className="opacity-50" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

// ─── Attendance Progress Bar ──────────────────────────────────────────────────
function AttendanceBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {value}{" "}
          <span className="text-muted-foreground font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ percent }: { percent: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const strokeClass =
    percent >= 75
      ? "stroke-emerald-500"
      : percent >= 60
        ? "stroke-amber-500"
        : "stroke-destructive";
  const textClass =
    percent >= 75
      ? "text-emerald-600"
      : percent >= 60
        ? "text-amber-600"
        : "text-destructive";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="h-20 w-20 -rotate-90"
        viewBox="0 0 80 80"
        role="img"
        aria-labelledby="att-circle-title"
      >
        <title id="att-circle-title">{`Attendance ${percent}%`}</title>
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          className="stroke-muted"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={`${strokeClass} transition-all duration-700`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-xl font-bold font-display ${textClass}`}>
          {percent}%
        </span>
        <span className="text-[10px] text-muted-foreground">Attendance</span>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function TabSkeleton() {
  return (
    <div className="space-y-3 pt-2" data-ocid="student_profile.loading_state">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

// ─── ID Card Print View ───────────────────────────────────────────────────────
function IdCardPrintDialog({
  student,
  section,
  onClose,
}: {
  student: Student;
  section: Section | undefined;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm"
        data-ocid="student_profile.idcard.dialog"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base">
            Student ID Card
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            data-ocid="student_profile.idcard.close_button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* ID Card Preview */}
        <div
          id="student-id-card-print"
          className="border-2 border-primary rounded-xl overflow-hidden bg-card"
        >
          {/* Header */}
          <div className="bg-primary px-4 py-2 text-center">
            <p className="text-primary-foreground font-bold text-sm">
              SHUBH SCHOOL ERP
            </p>
            <p className="text-primary-foreground/80 text-xs">
              Student Identity Card
            </p>
          </div>
          {/* Body */}
          <div className="p-4 flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shrink-0">
              <AvatarImage src={student.photoUrl} alt={student.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {getInitials(student.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-bold text-foreground truncate">
                {student.fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Adm No:</span> {student.admNo}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Class:</span>{" "}
                {CLASS_LABELS[student.classLevel]}
                {section ? ` – ${section.name}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Father:</span>{" "}
                {student.fatherName}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Mobile:</span>{" "}
                {student.fatherMobile}
              </p>
            </div>
          </div>
          <div className="border-t border-border px-4 py-2 bg-muted/20">
            <p className="text-[10px] text-muted-foreground text-center">
              Session: {student.sessionId}
            </p>
          </div>
        </div>
        <Button
          className="w-full mt-2"
          onClick={() => window.print()}
          data-ocid="student_profile.idcard.print_button"
        >
          <Printer className="h-4 w-4 mr-2" /> Print ID Card
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admission Form Print View ────────────────────────────────────────────────
function AdmissionFormDialog({
  student,
  section,
  onClose,
}: {
  student: Student;
  section: Section | undefined;
  onClose: () => void;
}) {
  const rows: Array<[string, string]> = [
    ["Admission No.", student.admNo],
    ["Full Name", student.fullName],
    ["Date of Birth", formatDate(student.dateOfBirth) || "—"],
    ["Gender", student.gender],
    [
      "Class",
      CLASS_LABELS[student.classLevel] + (section ? ` – ${section.name}` : ""),
    ],
    ["Session", student.sessionId],
    ["Father's Name", student.fatherName],
    ["Father's Mobile", student.fatherMobile],
    ["Mother's Name", student.motherName || "—"],
    ["Mother's Mobile", student.motherMobile || "—"],
    ["Permanent Address", student.permanentAddress || "—"],
    ["Current Address", student.currentAddress || "—"],
    ["Aadhaar No.", student.aadhaarNo || "—"],
    ["S.R. No.", student.srNo || "—"],
    ["Pen No.", student.penNo || "—"],
    ["APAAR No.", student.apaarNo || "—"],
    ["Previous School", student.prevSchool || "—"],
    ["Admission Date", formatDate(student.admissionDate) || "—"],
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="student_profile.form.dialog"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base">
            Admission Form
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            data-ocid="student_profile.form.close_button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div id="student-admission-form-print" className="space-y-1">
          {/* School Header */}
          <div className="text-center border-b border-border pb-3 mb-3">
            <p className="font-bold text-lg font-display">SHUBH SCHOOL ERP</p>
            <p className="text-sm text-muted-foreground">
              Student Admission Form
            </p>
          </div>
          {/* Photo + basic */}
          <div className="flex gap-4 mb-3">
            <Avatar className="h-20 w-20 border border-border shrink-0">
              <AvatarImage src={student.photoUrl} alt={student.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                {getInitials(student.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-lg">{student.fullName}</p>
              <p className="text-sm text-muted-foreground">
                Adm. No: {student.admNo}
              </p>
              <p className="text-sm text-muted-foreground">
                {CLASS_LABELS[student.classLevel]} · {student.sessionId}
              </p>
            </div>
          </div>
          {/* Fields table */}
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <tbody>
              {rows.map(([label, value]) => (
                <tr
                  key={label}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2 font-medium text-muted-foreground bg-muted/20 w-40">
                    {label}
                  </td>
                  <td className="px-3 py-2 text-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => window.print()}
          data-ocid="student_profile.form.print_button"
        >
          <Printer className="h-4 w-4 mr-2" /> Print Form
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Photo Lightbox via portal (above all modals) ───────────────────────────
function PhotoLightbox({
  src,
  name,
  onClose,
}: {
  src: string;
  name: string;
  onClose: () => void;
}) {
  const content = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: lightbox overlay close
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/85"
      style={{ zIndex: 99999 }}
      onClick={onClose}
      data-ocid="student_profile.photo_lightbox"
    >
      <button
        type="button"
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close photo"
        data-ocid="student_profile.photo_lightbox.close_button"
      >
        <X className="h-7 w-7" />
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: inner click stops propagation */}
      <div
        className="flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl object-contain border-2 border-white/20"
          />
        ) : (
          <div className="h-48 w-48 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-6xl font-bold font-display">
            {getInitials(name)}
          </div>
        )}
        <p className="text-white font-medium text-lg">{name}</p>
      </div>
    </div>
  );
  return createPortal(content, document.body);
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface StudentProfileModalProps {
  student: Student;
  sections: Section[];
  onClose: () => void;
  onEdit?: (student: Student) => void;
}

export function StudentProfileModal({
  student,
  sections,
  onClose,
  onEdit,
}: StudentProfileModalProps) {
  const ext = student as ExtStudent;
  const { currentRole } = useAppStore();
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const { data: routes = [] } = useRoutes();
  const { data: attendance = [], isLoading: loadingAttendance } =
    useAttendanceByStudent(student.id);
  const { data: payments = [], isLoading: loadingPayments } =
    usePaymentsByStudent(student.id);
  const discontinueMutation = useDiscontinueStudent();
  const deleteMutation = useDeleteStudent();
  const section = sections.find((s) => s.id === student.sectionId);
  const route = routes.find(
    (r: TransportRoute) => r.id === student.transportRouteId,
  );

  const [photoLightboxOpen, setPhotoLightboxOpen] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [admFormOpen, setAdmFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certPrintType, setCertPrintType] = useState<
    "Bonafide" | "Transfer" | null
  >(null);
  const { data: allCertTemplates = [] } = useCertificateTemplates();

  // ── Attendance stats ───────────────────────────────────────────────────────
  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const absentDays = attendance.filter((a) => a.status === "Absent").length;
  const lateDays = attendance.filter((a) => a.status === "Late").length;
  const halfDays = attendance.filter((a) => a.status === "HalfDay").length;
  const attendancePct =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // ── Fee stats ──────────────────────────────────────────────────────────────
  const totalPaid = payments.reduce((sum, p) => sum + p.totalAmount, 0);
  const sortedPayments = [...payments].sort((a: FeePayment, b: FeePayment) =>
    b.paymentDate.localeCompare(a.paymentDate),
  );
  const lastPayment = sortedPayments[0] ?? null;

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          className="max-w-2xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0"
          data-ocid="student_profile.dialog"
        >
          {/* ── Header ────────────────────────────────────────────────────────── */}
          <div className="bg-card px-6 pt-6 pb-4 border-b border-border shrink-0">
            <div className="flex items-start gap-4">
              {/* Clickable photo */}
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setPhotoLightboxOpen(true)}
                title="Click to view full size"
                data-ocid="student_profile.photo_button"
                aria-label="View student photo full size"
              >
                <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md hover:border-primary/60 transition-colors">
                  <AvatarImage src={student.photoUrl} alt={student.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl font-display">
                    {getInitials(student.fullName)}
                  </AvatarFallback>
                </Avatar>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                      {student.fullName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {CLASS_LABELS[student.classLevel]}
                      {section ? ` – Section ${section.name}` : ""}
                      <span className="mx-2 text-border">·</span>
                      Adm No:{" "}
                      <span className="font-mono font-medium">
                        {student.admNo}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {student.isDiscontinued ? (
                        <Badge
                          variant="destructive"
                          className="text-xs"
                          data-ocid="student_profile.status.badge"
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Discontinued
                        </Badge>
                      ) : (
                        <Badge
                          className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          data-ocid="student_profile.status.badge"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {student.gender}
                      </Badge>
                      {student.transportRouteId && (
                        <Badge variant="outline" className="text-xs">
                          <Bus className="h-3 w-3 mr-1" /> Transport
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="student_profile.edit_button"
                      onClick={() => {
                        onClose();
                        onEdit?.(student);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="student_profile.print_button"
                      onClick={() => setIdCardOpen(true)}
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" /> ID Card
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="student_profile.bonafide_button"
                      onClick={() => setCertPrintType("Bonafide")}
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" /> Bonafide
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="student_profile.tc_button"
                      onClick={() => setCertPrintType("Transfer")}
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" /> TC
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="student_profile.form_button"
                      onClick={() => setAdmFormOpen(true)}
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1" /> Form
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────────────── */}
          <Tabs
            defaultValue="overview"
            className="flex flex-col flex-1 min-h-0"
          >
            <TabsList className="grid grid-cols-4 rounded-none border-b border-border h-10 px-6 bg-muted/30 shrink-0">
              <TabsTrigger
                value="overview"
                className="text-xs"
                data-ocid="student_profile.tab.overview"
              >
                <User className="h-3.5 w-3.5 mr-1.5" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="academic"
                className="text-xs"
                data-ocid="student_profile.tab.academic"
              >
                <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Academic
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="text-xs"
                data-ocid="student_profile.tab.attendance"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" /> Attendance
              </TabsTrigger>
              <TabsTrigger
                value="fees"
                className="text-xs"
                data-ocid="student_profile.tab.fees"
              >
                <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Fees
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* ── Overview Tab ────────────────────────────────────────────── */}
              <TabsContent value="overview" className="mt-0 space-y-4">
                <InfoCard title="Personal Details" icon={User}>
                  <FieldRow
                    label="Date of Birth"
                    value={formatDate(student.dateOfBirth)}
                  />
                  <FieldRow label="Gender" value={student.gender} />
                  <FieldRow label="Blood Group" value={ext.bloodGroup ?? "—"} />
                  <FieldRow label="Religion" value={ext.religion ?? "—"} />
                  <FieldRow label="Category" value={ext.category ?? "—"} />
                  <FieldRow
                    label="Mother Tongue"
                    value={ext.motherTongue ?? "—"}
                  />
                  <div className="col-span-2">
                    <FieldRow
                      label="Current Address"
                      value={student.currentAddress || "—"}
                    />
                  </div>
                  {ext.email && (
                    <div className="col-span-2">
                      <FieldRow label="Email" value={ext.email} />
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Family Details" icon={User}>
                  <FieldRow label="Father's Name" value={student.fatherName} />
                  <FieldRow
                    label="Father's Mobile"
                    value={student.fatherMobile}
                    phone
                  />
                  <FieldRow
                    label="Mother's Name"
                    value={student.motherName || "—"}
                  />
                  <FieldRow
                    label="Mother's Mobile"
                    value={student.motherMobile || "—"}
                    phone
                  />
                  <FieldRow
                    label="Siblings"
                    value={ext.siblings != null ? String(ext.siblings) : "—"}
                  />
                </InfoCard>
              </TabsContent>

              {/* ── Academic Tab ────────────────────────────────────────────── */}
              <TabsContent value="academic" className="mt-0 space-y-4">
                <InfoCard title="Academic Details" icon={BookOpen}>
                  <FieldRow
                    label="Class"
                    value={CLASS_LABELS[student.classLevel]}
                  />
                  <FieldRow label="Section" value={section?.name ?? "—"} />
                  <FieldRow label="Admission No" value={student.admNo} />
                  <FieldRow label="Session" value={student.sessionId} />
                  <FieldRow label="Roll Number" value={ext.rollNumber ?? "—"} />
                  <FieldRow
                    label="Admission Date"
                    value={formatDate(student.createdAt)}
                  />
                  <FieldRow
                    label="Status"
                    value={student.isDiscontinued ? "Discontinued" : "Active"}
                  />
                  {ext.previousSchool && (
                    <div className="col-span-2">
                      <FieldRow
                        label="Previous School"
                        value={ext.previousSchool}
                      />
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Transport Details" icon={Bus}>
                  {student.transportRouteId ? (
                    <>
                      <FieldRow label="Route Name" value={route?.name ?? "—"} />
                      <FieldRow
                        label="Bus Number"
                        value={route?.busNumber ?? "—"}
                      />
                      <FieldRow
                        label="Driver Name"
                        value={route?.driverName ?? "—"}
                      />
                      <FieldRow
                        label="Driver Mobile"
                        value={route?.driverMobile ?? "—"}
                        phone
                      />
                      {student.pickupPointId && (
                        <FieldRow
                          label="Pickup Point"
                          value={student.pickupPointId}
                        />
                      )}
                    </>
                  ) : (
                    <div className="col-span-2 text-sm text-muted-foreground italic">
                      No transport assigned for this student.
                    </div>
                  )}
                </InfoCard>
              </TabsContent>

              {/* ── Attendance Tab ─────────────────────────────────────────── */}
              <TabsContent value="attendance" className="mt-0">
                {loadingAttendance ? (
                  <TabSkeleton />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-xl border border-border p-5">
                      <div className="flex items-center gap-6">
                        <CircularProgress percent={attendancePct} />
                        <div className="flex-1">
                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="bg-card rounded-lg border border-border p-3">
                              <p className="text-2xl font-bold font-display text-foreground">
                                {totalDays}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Total Days
                              </p>
                            </div>
                            <div className="bg-card rounded-lg border border-emerald-200 p-3">
                              <p className="text-2xl font-bold font-display text-emerald-600">
                                {presentDays}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Present
                              </p>
                            </div>
                            <div className="bg-card rounded-lg border border-red-200 p-3">
                              <p className="text-2xl font-bold font-display text-destructive">
                                {absentDays}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Absent
                              </p>
                            </div>
                            <div className="bg-card rounded-lg border border-amber-200 p-3">
                              <p className="text-2xl font-bold font-display text-amber-600">
                                {lateDays + halfDays}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Late / Half Day
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
                      <h4 className="text-sm font-semibold">Breakdown</h4>
                      <AttendanceBar
                        label="Present"
                        value={presentDays}
                        total={totalDays}
                        color="bg-emerald-500"
                      />
                      <AttendanceBar
                        label="Absent"
                        value={absentDays}
                        total={totalDays}
                        color="bg-destructive"
                      />
                      <AttendanceBar
                        label="Late"
                        value={lateDays}
                        total={totalDays}
                        color="bg-amber-500"
                      />
                      <AttendanceBar
                        label="Half Day"
                        value={halfDays}
                        total={totalDays}
                        color="bg-blue-400"
                      />
                    </div>

                    {totalDays === 0 && (
                      <div
                        className="text-center py-6 text-sm text-muted-foreground"
                        data-ocid="student_profile.attendance.empty_state"
                      >
                        No attendance records found for this student.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ── Fees Tab ────────────────────────────────────────────────── */}
              <TabsContent value="fees" className="mt-0">
                {loadingPayments ? (
                  <TabSkeleton />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-muted/30 rounded-xl border border-border p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Total Paid
                        </p>
                        <p className="text-lg font-bold font-display text-foreground">
                          {formatCurrency(totalPaid)}
                        </p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Receipts
                        </p>
                        <p className="text-lg font-bold font-display text-emerald-700">
                          {payments.length}
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-xl border border-border p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Last Payment
                        </p>
                        <p className="text-sm font-bold font-display text-foreground">
                          {lastPayment
                            ? formatCurrency(lastPayment.totalAmount)
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Total Amount Paid
                        </span>
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(totalPaid)}
                        </span>
                      </div>
                      {lastPayment && (
                        <p className="text-xs text-muted-foreground">
                          Last payment:{" "}
                          {formatCurrency(lastPayment.totalAmount)} on{" "}
                          {formatDate(lastPayment.paymentDate)}
                          <span className="ml-1.5 text-muted-foreground/60">
                            via {lastPayment.paymentMethod}
                          </span>
                        </p>
                      )}
                    </div>

                    {payments.length > 0 ? (
                      <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-border bg-muted/50">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Payment History
                          </h4>
                        </div>
                        <div className="divide-y divide-border">
                          {sortedPayments.slice(0, 8).map((p, i) => (
                            <div
                              key={p.id}
                              className="px-4 py-3 flex items-center justify-between"
                              data-ocid={`student_profile.payment.item.${i + 1}`}
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  Receipt #{p.receiptNo}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(p.paymentDate)} ·{" "}
                                  {p.paymentMethod}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-emerald-700">
                                {formatCurrency(p.totalAmount)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-center py-6 text-sm text-muted-foreground"
                        data-ocid="student_profile.fees.empty_state"
                      >
                        No payment records found for this student.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* ── Footer ────────────────────────────────────────────────────────── */}
          <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
            <p className="text-xs text-muted-foreground">
              Enrolled: {formatDate(student.createdAt)}
              {student.isDiscontinued && student.discontinuedAt && (
                <span className="ml-3 text-destructive">
                  Discontinued: {formatDate(student.discontinuedAt)}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {student.isDiscontinued ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={discontinueMutation.isPending}
                  onClick={async () => {
                    // Re-enable: show in future releases. For now, admin can edit status.
                    toast.info(
                      "To reactivate, edit the student and change their status.",
                    );
                  }}
                  data-ocid="student_profile.reactivate_button"
                >
                  Reactivate
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  disabled={discontinueMutation.isPending}
                  onClick={async () => {
                    try {
                      await discontinueMutation.mutateAsync(student.id);
                      toast.success(
                        `${student.fullName} has been discontinued.`,
                      );
                      onClose();
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Failed to discontinue.",
                      );
                    }
                  }}
                  data-ocid="student_profile.discontinue_button"
                >
                  {discontinueMutation.isPending ? "Working…" : "Discontinue"}
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirmOpen(true)}
                  data-ocid="student_profile.delete_button"
                >
                  Delete
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onClose}
                data-ocid="student_profile.close_button"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Photo Lightbox ─────────────────────────────────────────────────── */}
      {photoLightboxOpen && (
        <PhotoLightbox
          src={student.photoUrl}
          name={student.fullName}
          onClose={() => setPhotoLightboxOpen(false)}
        />
      )}

      {/* ── ID Card Dialog ─────────────────────────────────────────────────── */}
      {idCardOpen && (
        <IdCardPrintDialog
          student={student}
          section={section}
          onClose={() => setIdCardOpen(false)}
        />
      )}

      {/* ── Admission Form Dialog ───────────────────────────────────────────── */}
      {admFormOpen && (
        <AdmissionFormDialog
          student={student}
          section={section}
          onClose={() => setAdmFormOpen(false)}
        />
      )}

      {/* ── Admin Delete Confirm ─────────────────────────────────────────────────── */}
      {isAdmin && (
        <Dialog
          open={deleteConfirmOpen}
          onOpenChange={(open) => {
            if (!open) setDeleteConfirmOpen(false);
          }}
        >
          <DialogContent
            className="max-w-sm"
            data-ocid="student_profile.delete.dialog"
          >
            <div className="space-y-3 py-2">
              <h3 className="font-display font-semibold text-destructive text-base">
                Delete Student?
              </h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {student.fullName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/30 transition-colors"
                  onClick={() => setDeleteConfirmOpen(false)}
                  data-ocid="student_profile.delete.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-60"
                  disabled={deleteMutation.isPending}
                  onClick={async () => {
                    try {
                      await deleteMutation.mutateAsync(student.id);
                      toast.success(`"${student.fullName}" deleted.`);
                      setDeleteConfirmOpen(false);
                      onClose();
                    } catch (err) {
                      toast.error(
                        err instanceof Error ? err.message : "Delete failed.",
                      );
                    }
                  }}
                  data-ocid="student_profile.delete.confirm_button"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bonafide / TC Print Modal */}
      {certPrintType &&
        (() => {
          const tmpl =
            allCertTemplates.find(
              (t) => t.templateType === certPrintType && t.isDefault,
            ) ??
            allCertTemplates.find((t) => t.templateType === certPrintType) ??
            null;
          return (
            <GeneratePrintModal
              template={tmpl}
              forcedType={certPrintType}
              preStudent={student}
              onClose={() => setCertPrintType(null)}
            />
          );
        })()}
    </>
  );
}
