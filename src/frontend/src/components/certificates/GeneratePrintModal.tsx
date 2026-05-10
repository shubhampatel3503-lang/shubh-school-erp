import { AdmitCardTemplate } from "@/components/certificates/AdmitCardTemplate";
import { BonafideTemplate } from "@/components/certificates/BonafideTemplate";
import { FeeReceiptTemplate } from "@/components/certificates/FeeReceiptTemplate";
import { IDCardTemplate } from "@/components/certificates/IDCardTemplate";
import { StaffIDCardTemplate } from "@/components/certificates/StaffIDCardTemplate";
import { TCTemplate } from "@/components/certificates/TCTemplate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CertificateTemplateBackend,
  FrontendExamTimetable,
} from "@/hooks/useBackend";
import {
  useExamTimetables,
  usePaymentsByStudent,
  useStaff,
  useStudents,
} from "@/hooks/useBackend";
import { getClassLabel } from "@/lib/utils";
import type { ExamTimetable, FeePayment, Staff, Student } from "@/types";
import { Printer, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface GeneratePrintModalProps {
  template: CertificateTemplateBackend | null;
  onClose: () => void;
  /** Pre-selected student (skip student picker) */
  preStudent?: Student | null;
  /** Pre-selected staff (skip staff picker, for StaffIDCard) */
  preStaff?: Staff | null;
  /** Override template type — used when template is null but we know the doc type */
  forcedType?: string;
}

// Map backend Student (from @/backend.d) to frontend Student shape (from @/types)
function toFrontendStudent(s: Record<string, unknown>): Student {
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  const strOrNull = (v: unknown): string | null =>
    typeof v === "string" ? v : null;
  return {
    id: str(s.id),
    admNo: str(s.admNo),
    fullName: str(s.fullName),
    fatherName: str(s.fatherName),
    motherName: str(s.motherName),
    fatherMobile: str(s.fatherMobile),
    motherMobile: str(s.motherMobile),
    mobile: str(s.mobile),
    currentAddress: str(s.currentAddress),
    permanentAddress: str(s.permanentAddress),
    category: str(s.category) || "General",
    aadhaarNo: str(s.aadhaarNo),
    srNo: str(s.srNo),
    penNo: str(s.penNo),
    apaarNo: str(s.apaarNo),
    prevSchool: str(s.prevSchool),
    admissionDate:
      str(s.admissionDate) || new Date().toISOString().split("T")[0],
    busNo: str(s.busNo),
    classLevel: (str(s.classLevel) || "Class1") as Student["classLevel"],
    sectionId: str(s.sectionId),
    sessionId: str(s.session) || str(s.sessionId),
    dateOfBirth: str(s.dateOfBirth),
    gender: (str(s.gender) || "Male") as Student["gender"],
    photoUrl: str(s.photoUrl),
    isDiscontinued: s.isDiscontinued === true,
    discontinuedAt: strOrNull(s.discontinuedAt),
    transportRouteId: strOrNull(s.transportRouteId),
    pickupPointId:
      strOrNull(s.transportPickupPointId) ?? strOrNull(s.pickupPointId),
    createdAt:
      typeof s.createdAt === "bigint"
        ? new Date(Number(s.createdAt)).toISOString()
        : str(s.createdAt),
  };
}

function useReactToPrint(contentRef: React.RefObject<HTMLDivElement | null>) {
  return useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Print</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; padding: 20px; background: #f5f5f5; }
        @media print { body { padding: 0; background: white; } }
      </style></head>
      <body>${el.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 400);
  }, [contentRef]);
}

export function GeneratePrintModal({
  template,
  onClose,
  preStudent = null,
  preStaff = null,
  forcedType,
}: GeneratePrintModalProps) {
  const { data: rawStudents = [] } = useStudents();
  const { data: backendStaff = [] } = useStaff();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preStudent?.id ?? "",
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    preStaff?.id ?? "",
  );
  const [purpose, setPurpose] = useState("general purposes");
  const [reasonForLeaving, setReasonForLeaving] = useState("Parents' request");
  const [examName, setExamName] = useState("Annual Examination 2025-26");
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint(printRef);

  const isStaffType = (template?.templateType ?? forcedType) === "StaffIDCard";

  // Convert all backend students to frontend shape
  const students: Student[] = (
    rawStudents as unknown as Record<string, unknown>[]
  ).map(toFrontendStudent);

  const staffList = backendStaff as Staff[];

  const selectedStudent =
    preStudent ?? students.find((s) => s.id === selectedStudentId) ?? null;
  const selectedStaff =
    preStaff ?? staffList.find((s) => s.id === selectedStaffId) ?? null;

  const { data: rawPayments = [] } = usePaymentsByStudent(
    isStaffType ? "" : selectedStudentId,
  );
  const { data: timetables = [] } = useExamTimetables();

  const latestPayment: FeePayment | null =
    rawPayments.length > 0 ? rawPayments[rawPayments.length - 1] : null;

  const rawStudentTimetable: FrontendExamTimetable | null =
    timetables.find((t) => t.classLevel === selectedStudent?.classLevel) ??
    null;

  const studentTimetable: ExamTimetable | null = rawStudentTimetable
    ? {
        id: rawStudentTimetable.id,
        name: rawStudentTimetable.examName,
        sessionId: rawStudentTimetable.sessionId,
        classLevel:
          rawStudentTimetable.classLevel as ExamTimetable["classLevel"],
        entries: rawStudentTimetable.entries,
        isPublished: true,
      }
    : null;

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.admNo.toLowerCase().includes(q) ||
      getClassLabel(s.classLevel).toLowerCase().includes(q)
    );
  });

  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.staffCode.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q)
    );
  });

  function renderDocumentPreview() {
    const type = template?.templateType ?? forcedType;
    const nameLower = (template?.name ?? "").toLowerCase();
    const isV2 =
      nameLower.includes("modern") ||
      nameLower.includes("simplified") ||
      nameLower.includes("horizontal") ||
      nameLower.includes("themed") ||
      nameLower.includes("compact");

    if (type === "StaffIDCard" && selectedStaff) {
      const variant = nameLower.includes("vertical")
        ? "vertical"
        : nameLower.includes("themed")
          ? "themed"
          : "horizontal";
      return <StaffIDCardTemplate staff={selectedStaff} variant={variant} />;
    }

    if (!selectedStudent) return null;

    if (type === "FeeReceipt" && latestPayment) {
      return (
        <FeeReceiptTemplate
          student={selectedStudent}
          payment={latestPayment}
          schoolInfo={{
            name: "SHUBH PUBLIC SCHOOL",
            tagline: "",
            about: "",
            photoUrl: "",
            address: "",
            phone: "",
            email: "",
          }}
        />
      );
    }
    if (type === "Bonafide") {
      return (
        <BonafideTemplate
          student={selectedStudent}
          purpose={purpose}
          variant={isV2 ? "modern" : "formal"}
        />
      );
    }
    if (type === "Transfer") {
      return (
        <TCTemplate
          student={selectedStudent}
          reasonForLeaving={reasonForLeaving}
          variant={isV2 ? "simplified" : "formal"}
        />
      );
    }
    if (type === "IDCard") {
      const variant = nameLower.includes("horizontal")
        ? "horizontal"
        : nameLower.includes("themed")
          ? "themed"
          : "vertical";
      return <IDCardTemplate student={selectedStudent} variant={variant} />;
    }
    if (type === "AdmitCard") {
      return (
        <AdmitCardTemplate
          student={selectedStudent}
          timetable={studentTimetable}
          examName={examName}
          variant={isV2 ? "compact" : "formal"}
        />
      );
    }
    return (
      <div className="p-8 bg-white border border-border rounded-lg text-center text-muted-foreground">
        <p>
          Preview for <strong>{template?.templateType}</strong> will appear
          here.
        </p>
      </div>
    );
  }

  const canPrint = isStaffType
    ? !!selectedStaff
    : !!selectedStudent &&
      !(template?.templateType === "FeeReceipt" && !latestPayment);

  return (
    <Dialog open={!!(template ?? forcedType)} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0"
        data-ocid="generate_print.dialog"
      >
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-display">
              Generate &amp; Print — {template?.name ?? forcedType}
            </DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-ocid="generate_print.close_button"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left: Controls */}
          <div className="w-72 flex-shrink-0 border-r border-border overflow-y-auto p-4 space-y-4 bg-muted/20">
            {/* Staff picker (StaffIDCard) */}
            {isStaffType && !preStaff && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                  Select Staff Member
                </Label>
                <Input
                  placeholder="Search staff…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-sm mb-2"
                  data-ocid="generate_print.search_input"
                />
                <Select
                  value={selectedStaffId}
                  onValueChange={setSelectedStaffId}
                >
                  <SelectTrigger
                    className="h-8 text-sm"
                    data-ocid="generate_print.staff.select"
                  >
                    <SelectValue placeholder="Choose staff…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {filteredStaff.slice(0, 50).map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-sm">
                        {s.fullName} ({s.staffCode}) — {s.designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Student picker (non-StaffIDCard) */}
            {!isStaffType && !preStudent && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                  Select Student
                </Label>
                <Input
                  placeholder="Search student…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-sm mb-2"
                  data-ocid="generate_print.search_input"
                />
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                >
                  <SelectTrigger
                    className="h-8 text-sm"
                    data-ocid="generate_print.student.select"
                  >
                    <SelectValue placeholder="Choose student…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {filteredStudents.slice(0, 50).map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-sm">
                        {s.fullName} ({s.admNo}) — {getClassLabel(s.classLevel)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pre-selected student info badge */}
            {!isStaffType && preStudent && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs">
                <p className="font-semibold text-primary">Student</p>
                <p>{preStudent.fullName}</p>
                <p className="text-muted-foreground">
                  {preStudent.admNo} · {getClassLabel(preStudent.classLevel)}
                </p>
              </div>
            )}

            {/* Pre-selected staff info badge */}
            {isStaffType && preStaff && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs">
                <p className="font-semibold text-primary">Staff</p>
                <p>{preStaff.fullName}</p>
                <p className="text-muted-foreground">
                  {preStaff.staffCode} · {preStaff.designation}
                </p>
              </div>
            )}

            {template?.templateType === "Bonafide" && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Purpose
                </Label>
                <Input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Purpose of certificate"
                  data-ocid="generate_print.purpose.input"
                />
              </div>
            )}

            {template?.templateType === "Transfer" && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Reason for Leaving
                </Label>
                <Input
                  value={reasonForLeaving}
                  onChange={(e) => setReasonForLeaving(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="generate_print.reason.input"
                />
              </div>
            )}

            {template?.templateType === "AdmitCard" && (
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Exam Name
                </Label>
                <Input
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="generate_print.exam_name.input"
                />
                {selectedStudent && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Timetable:{" "}
                    {studentTimetable
                      ? studentTimetable.name
                      : "No timetable found for this class"}
                  </p>
                )}
              </div>
            )}

            {template?.templateType === "FeeReceipt" && selectedStudent && (
              <div className="rounded-lg bg-card border border-border p-3 space-y-1 text-xs">
                <p className="font-semibold text-muted-foreground">
                  Latest Payment
                </p>
                {latestPayment ? (
                  <>
                    <p>Receipt: {latestPayment.receiptNo}</p>
                    <p>Date: {latestPayment.paymentDate}</p>
                    <p>
                      Amount: ₹
                      {latestPayment.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p>Method: {latestPayment.paymentMethod}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">
                    No payment record found
                  </p>
                )}
              </div>
            )}

            <Button
              className="w-full"
              disabled={!canPrint}
              onClick={handlePrint}
              data-ocid="generate_print.print_button"
            >
              <Printer className="size-4 mr-2" />
              Print Document
            </Button>

            {!canPrint && (
              <p
                className="text-xs text-muted-foreground text-center"
                data-ocid="generate_print.no_student_state"
              >
                {isStaffType
                  ? "Select a staff member to preview and print"
                  : "Select a student to preview and print"}
              </p>
            )}
            {template?.templateType === "FeeReceipt" &&
              selectedStudent &&
              !latestPayment && (
                <p className="text-xs text-destructive text-center">
                  No fee payment found for this student
                </p>
              )}
          </div>

          {/* Right: Preview */}
          <div
            className="flex-1 overflow-auto p-6 bg-muted/10"
            data-ocid="generate_print.preview.panel"
          >
            {canPrint ? (
              <div ref={printRef}>{renderDocumentPreview()}</div>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
                data-ocid="generate_print.empty_state"
              >
                <Printer className="size-14 mb-4 opacity-10" />
                <p className="font-medium">
                  {isStaffType
                    ? "Select a staff member to preview"
                    : "Select a student to preview the document"}
                </p>
                <p className="text-sm mt-1">
                  The template will auto-fill with real data
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
