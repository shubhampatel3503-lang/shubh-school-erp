import { GeneratePrintModal } from "@/components/certificates/GeneratePrintModal";
import DateInput from "@/components/shared/DateInput";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { StudentProfileModal } from "@/components/students/StudentProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddStudent,
  useCertificateTemplates,
  useDeleteAllStudents,
  useDeleteStudent,
  useDiscontinueStudent,
  useFeeHeadings,
  useGetCustomStudentColumns,
  usePickupPointsByRoute,
  usePromoteAllClasses,
  useRemoveStudentDiscount,
  useRoutes,
  useSaveCustomStudentColumns,
  useSaveStudentDiscount,
  useSections,
  useSessions,
  useStudentDiscounts,
  useStudents,
  useUpdateStudent,
  useUpdateStudentSilent,
} from "@/hooks/useBackend";
import {
  CLASS_LABELS,
  CLASS_ORDER,
  SCHOOL_MONTHS,
  cn,
  downloadCSV,
  downloadCSVString,
  formatDate,
  generateId,
  getInitials,
} from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { PickupPoint } from "@/types";
import type {
  ClassLevel,
  PromotionAllResult,
  Section,
  Student,
  StudentDiscount,
  TransportRoute,
} from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpCircle,
  DownloadCloud,
  Edit,
  Eye,
  Filter,
  IndianRupee,
  Printer,
  Search,
  Tag,
  Trash2,
  Upload,
  UserPlus,
  Users,
  Users2,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortKey = keyof Student;
type SortDir = "asc" | "desc";

interface StudentFilters {
  session: string;
  classLevel: string;
  sectionId: string;
  status: string;
  search: string;
  familyMobile: string; // filter by family group
}

// ─── Column Config ─────────────────────────────────────────────────────────
const ALL_COLUMNS = [
  { key: "admNo", label: "Adm. No.", sticky: true },
  { key: "fullName", label: "Full Name", sticky: true },
  { key: "classLevel", label: "Class", sticky: false },
  { key: "section", label: "Section", sticky: false },
  { key: "gender", label: "Gender", sticky: false },
  { key: "dateOfBirth", label: "DOB", sticky: false },
  { key: "fatherName", label: "Father Name", sticky: false },
  { key: "fatherMobile", label: "Father Mobile", sticky: false },
  { key: "motherName", label: "Mother Name", sticky: false },
  { key: "motherMobile", label: "Mother Mobile", sticky: false },
  { key: "mobile", label: "Mobile", sticky: false },
  { key: "permanentAddress", label: "Permanent Address", sticky: false },
  { key: "category", label: "Category", sticky: false },
  { key: "currentAddress", label: "Current Address", sticky: false },
  { key: "aadhaarNo", label: "Aadhaar No.", sticky: false },
  { key: "srNo", label: "S.R. No.", sticky: false },
  { key: "penNo", label: "Pen No.", sticky: false },
  { key: "apaarNo", label: "APAAR No.", sticky: false },
  { key: "prevSchool", label: "Prev. School", sticky: false },
  { key: "admissionDate", label: "Adm. Date", sticky: false },
  { key: "transportRouteId", label: "Route", sticky: false },
  { key: "busNo", label: "Bus No.", sticky: false },
  { key: "status", label: "Status", sticky: false },
] as const;

type ColKey = (typeof ALL_COLUMNS)[number]["key"];

// Default: show only the most-used columns. User can toggle more via the Columns button.
const DEFAULT_VISIBLE: ColKey[] = [
  "admNo",
  "fullName",
  "classLevel",
  "section",
  "gender",
  "fatherName",
  "fatherMobile",
  "mobile",
  "status",
];

// ─── Add Student Form ─────────────────────────────────────────────────────────
const INITIAL_FORM: Omit<
  Student,
  "id" | "createdAt" | "isDiscontinued" | "discontinuedAt" | "pickupPointId"
> & { transportMonths: string[] } = {
  admNo: "",
  fullName: "",
  fatherName: "",
  motherName: "",
  fatherMobile: "",
  motherMobile: "",
  mobile: "",
  currentAddress: "",
  permanentAddress: "",
  category: "",
  aadhaarNo: "",
  srNo: "",
  penNo: "",
  apaarNo: "",
  prevSchool: "",
  admissionDate: "",
  busNo: "",
  classLevel: "Class1" as ClassLevel,
  sectionId: "",
  sessionId: "",
  dateOfBirth: "",
  gender: "Male" as Student["gender"],
  photoUrl: "",
  transportRouteId: null,
  transportMonths: [],
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ student }: { student: Student }) {
  if (student.isDiscontinued) {
    return (
      <Badge variant="destructive" className="text-xs">
        Discontinued
      </Badge>
    );
  }
  return (
    <Badge className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100">
      Active
    </Badge>
  );
}

// ─── Discount Dialog ──────────────────────────────────────────────────────────
interface DiscountDialogProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

function DiscountDialog({ student, open, onClose }: DiscountDialogProps) {
  const { data: feeHeadings = [] } = useFeeHeadings();
  const { data: studentDiscounts = [] } = useStudentDiscounts(student.id);
  const saveDiscount = useSaveStudentDiscount();
  const removeDiscountMutation = useRemoveStudentDiscount();

  const [feeHeadingId, setFeeHeadingId] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  async function handleAdd() {
    if (!feeHeadingId || !amount || Number(amount) <= 0) return;
    try {
      await saveDiscount.mutateAsync({
        studentId: student.id,
        headingId: feeHeadingId,
        amount: BigInt(Math.round(Number(amount))),
        remark: remarks || null,
      });
      setFeeHeadingId("");
      setAmount("");
      setRemarks("");
    } catch {
      // error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-ocid="discount.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            Manage Discounts — {student.fullName}
          </DialogTitle>
          <DialogDescription>
            Set monthly discount per fee head. It will auto-apply when
            collecting fees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new discount */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-3">
            <p className="text-sm font-medium">Add Discount</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Fee Head</Label>
                <Select value={feeHeadingId} onValueChange={setFeeHeadingId}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    data-ocid="discount.fee_head.select"
                  >
                    <SelectValue placeholder="Select fee head" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeHeadings
                      .filter((h) => h.isActive)
                      .map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Monthly Discount (₹)</Label>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-ocid="discount.amount.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Remarks (optional)</Label>
              <Input
                className="h-8 text-xs"
                placeholder="Reason for discount"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                data-ocid="discount.remarks.input"
              />
            </div>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!feeHeadingId || !amount || Number(amount) <= 0}
              data-ocid="discount.add_button"
            >
              Add Discount
            </Button>
          </div>

          {/* Existing discounts */}
          {studentDiscounts.length === 0 ? (
            <div
              className="text-center py-6 text-sm text-muted-foreground"
              data-ocid="discount.empty_state"
            >
              No discounts configured for this student.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Discounts</p>
              {studentDiscounts.map((d, idx) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                  data-ocid={`discount.item.${idx + 1}`}
                >
                  <div>
                    <p className="text-sm font-medium">{d.feeHeadingName}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{d.monthlyDiscountAmount}/month
                      {d.remarks && ` · ${d.remarks}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() =>
                      removeDiscountMutation.mutate({
                        id: d.id,
                        studentId: student.id,
                      })
                    }
                    disabled={removeDiscountMutation.isPending}
                    data-ocid={`discount.delete_button.${idx + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="discount.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Family Modal ─────────────────────────────────────────────────────────────
interface FamilyModalProps {
  mobile: string;
  allStudents: Student[];
  sections: Section[];
  onClose: () => void;
}

function FamilyModal({
  mobile,
  allStudents,
  sections,
  onClose,
}: FamilyModalProps) {
  const familyStudents = allStudents.filter(
    (s) =>
      s.fatherMobile === mobile ||
      s.motherMobile === mobile ||
      s.mobile === mobile,
  );
  const discounts = useAppStore((s) => s.discounts);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-ocid="family.dialog">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Users2 className="h-5 w-5 text-primary" />
            Family Group — {mobile}
          </DialogTitle>
          <DialogDescription>
            {familyStudents.length} student(s) share this mobile number.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {familyStudents.map((s, idx) => {
            const sec = sections.find((sc) => sc.id === s.sectionId);
            const studentDiscounts = discounts.filter(
              (d) => d.studentId === s.id,
            );
            return (
              <div
                key={s.id}
                className="rounded-lg border border-border bg-muted/20 p-3 flex items-start gap-3"
                data-ocid={`family.item.${idx + 1}`}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={s.photoUrl} alt={s.fullName} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {getInitials(s.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{s.fullName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {s.admNo}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {CLASS_LABELS[s.classLevel]}
                      {sec ? ` - ${sec.name}` : ""}
                    </Badge>
                    {s.isDiscontinued && (
                      <Badge variant="destructive" className="text-xs">
                        Discontinued
                      </Badge>
                    )}
                    {studentDiscounts.length > 0 && (
                      <Badge className="text-xs bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100">
                        {studentDiscounts.length} discount(s)
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Father: {s.fatherName} · {s.fatherMobile}
                    {s.motherMobile && ` · Mother: ${s.motherMobile}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="family.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Student Dialog ───────────────────────────────────────────────────────
function AddStudentDialog({
  open,
  onClose,
  sections,
  currentSession,
}: {
  open: boolean;
  onClose: () => void;
  sections: Section[];
  currentSession: string;
}) {
  const { data: routeOptions = [] } = useRoutes();
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    sessionId: currentSession,
    transportPickupPointId: null as string | null,
  });
  const [tab, setTab] = useState("personal");
  const addStudent = useAddStudent();
  const filteredSections = sections.filter(
    (s) => s.classLevel === form.classLevel,
  );
  const { data: pickupPoints = [] } = usePickupPointsByRoute(
    form.transportRouteId ?? "",
  );

  function handleChange(key: keyof typeof form, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTransportMonth(month: string) {
    setForm((prev) => ({
      ...prev,
      transportMonths: prev.transportMonths.includes(month)
        ? prev.transportMonths.filter((m) => m !== month)
        : [...prev.transportMonths, month],
    }));
  }

  const [autoCreateAccounts, setAutoCreateAccounts] = useState(true);
  const [createdCredentials, setCreatedCredentials] = useState<{
    studentUser: string;
    studentPass: string;
    parentUser: string;
    parentPass: string;
  } | null>(null);

  function generatePass() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  const { data: allStudentsForCheck = [] } = useStudents();

  function handleSubmit() {
    if (!form.fullName || !form.fatherName || !form.fatherMobile) return;
    const resolvedAdmNo = form.admNo || generateId().slice(0, 8);

    // Check for duplicate admission number
    if (
      form.admNo &&
      allStudentsForCheck.some(
        (s) => s.admNo.trim().toLowerCase() === form.admNo.trim().toLowerCase(),
      )
    ) {
      toast.error(
        `Admission number ${form.admNo} already exists. Each admission number must be unique. Use a different admission number or edit the existing student.`,
        { duration: 8000 },
      );
      return;
    }

    addStudent.mutate(
      {
        admNo: resolvedAdmNo,
        fullName: form.fullName,
        fatherName: form.fatherName,
        motherName: form.motherName,
        fatherMobile: form.fatherMobile,
        motherMobile: form.motherMobile,
        mobile: form.mobile,
        currentAddress: form.currentAddress,
        permanentAddress: form.permanentAddress,
        category: form.category,
        aadhaarNo: form.aadhaarNo,
        srNo: form.srNo,
        penNo: form.penNo,
        apaarNo: form.apaarNo,
        prevSchool: form.prevSchool,
        admissionDate: form.admissionDate,
        busNo: form.busNo,
        classLevel: form.classLevel,
        sectionId: form.sectionId,
        sessionId: form.sessionId || currentSession,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        photoUrl: form.photoUrl,
        isDiscontinued: false,
        discontinuedAt: null,
        transportRouteId: form.transportRouteId || null,
        pickupPointId: form.transportPickupPointId || null,
      },
      {
        onSuccess: () => {
          if (autoCreateAccounts) {
            setCreatedCredentials({
              studentUser: `STU${resolvedAdmNo}`,
              studentPass: generatePass(),
              parentUser: `PAR${form.fatherMobile}`,
              parentPass: generatePass(),
            });
          } else {
            toast.success(`Student "${form.fullName}" added successfully`);
            setForm({
              ...INITIAL_FORM,
              sessionId: currentSession,
              transportPickupPointId: null,
            });
            setTab("personal");
            onClose();
          }
        },
        onError: (err) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to add student. Please try again.";
          // Show specific error for duplicate admission number from backend
          if (
            msg.toLowerCase().includes("already exists") ||
            msg.toLowerCase().includes("duplicate")
          ) {
            toast.error(
              `Admission number ${resolvedAdmNo} already exists. Each admission number must be unique. Use a different admission number or edit the existing student.`,
              { duration: 8000 },
            );
          } else {
            toast.error(msg);
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="add_student.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Add New Student
          </DialogTitle>
          <DialogDescription>
            Fill student details across the tabs.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personal" data-ocid="add_student.tab.personal">
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" data-ocid="add_student.tab.academic">
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              data-ocid="add_student.tab.documents"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="transport"
              data-ocid="add_student.tab.transport"
            >
              Transport
            </TabsTrigger>
          </TabsList>

          {/* Tab 1 — Personal */}
          <TabsContent value="personal" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <ImageUploadField
                  label="Student Photo"
                  value={form.photoUrl}
                  onChange={(url) => handleChange("photoUrl", url)}
                  onRemove={() => handleChange("photoUrl", "")}
                  shape="avatar"
                  ocid="add_student.photo.upload_button"
                />
              </div>
              <div>
                <Label htmlFor="admNo">Adm. No.</Label>
                <Input
                  id="admNo"
                  placeholder="e.g. 2025001"
                  value={form.admNo}
                  onChange={(e) => handleChange("admNo", e.target.value)}
                  data-ocid="add_student.admNo.input"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  data-ocid="add_student.fullName.input"
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Father Name *</Label>
                <Input
                  id="fatherName"
                  value={form.fatherName}
                  onChange={(e) => handleChange("fatherName", e.target.value)}
                  data-ocid="add_student.fatherName.input"
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother Name</Label>
                <Input
                  id="motherName"
                  value={form.motherName}
                  onChange={(e) => handleChange("motherName", e.target.value)}
                  data-ocid="add_student.motherName.input"
                />
              </div>
              <div>
                <Label htmlFor="fatherMobile">Father Mobile *</Label>
                <Input
                  id="fatherMobile"
                  type="tel"
                  value={form.fatherMobile}
                  onChange={(e) => handleChange("fatherMobile", e.target.value)}
                  data-ocid="add_student.fatherMobile.input"
                />
              </div>
              <div>
                <Label htmlFor="motherMobile">Mother Mobile</Label>
                <Input
                  id="motherMobile"
                  type="tel"
                  value={form.motherMobile}
                  onChange={(e) => handleChange("motherMobile", e.target.value)}
                  data-ocid="add_student.motherMobile.input"
                />
              </div>
              <div>
                <Label htmlFor="studentMobile">Student Mobile</Label>
                <Input
                  id="studentMobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  data-ocid="add_student.mobile.input"
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <DateInput
                  id="dob"
                  value={form.dateOfBirth}
                  onChange={(iso) => handleChange("dateOfBirth", iso)}
                  data-ocid="add_student.dob.input"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                >
                  <SelectTrigger data-ocid="add_student.gender.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger data-ocid="add_student.category.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="admDate">Admission Date</Label>
                <DateInput
                  id="admDate"
                  value={form.admissionDate}
                  onChange={(iso) => handleChange("admissionDate", iso)}
                  data-ocid="add_student.admDate.input"
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 2 — Academic */}
          <TabsContent value="academic" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Class *</Label>
                <Select
                  value={form.classLevel}
                  onValueChange={(v) => {
                    handleChange("classLevel", v);
                    handleChange("sectionId", "");
                  }}
                >
                  <SelectTrigger data-ocid="add_student.class.select">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASS_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Select
                  value={form.sectionId}
                  onValueChange={(v) => handleChange("sectionId", v)}
                  disabled={!form.classLevel}
                >
                  <SelectTrigger data-ocid="add_student.section.select">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sessionInput">Session</Label>
                <Input
                  id="sessionInput"
                  value={form.sessionId}
                  onChange={(e) => handleChange("sessionId", e.target.value)}
                  placeholder="2025-26"
                  data-ocid="add_student.session.input"
                />
              </div>
              <div>
                <Label htmlFor="prevSchool">Previous School</Label>
                <Input
                  id="prevSchool"
                  value={form.prevSchool}
                  onChange={(e) => handleChange("prevSchool", e.target.value)}
                  data-ocid="add_student.prevSchool.input"
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3 — Documents */}
          <TabsContent value="documents" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="aadhaar">Aadhaar No.</Label>
                <Input
                  id="aadhaar"
                  placeholder="1234 5678 9012"
                  value={form.aadhaarNo}
                  onChange={(e) => handleChange("aadhaarNo", e.target.value)}
                  data-ocid="add_student.aadhaar.input"
                />
              </div>
              <div>
                <Label htmlFor="srNo">S.R. No.</Label>
                <Input
                  id="srNo"
                  placeholder="SR-2025-001"
                  value={form.srNo}
                  onChange={(e) => handleChange("srNo", e.target.value)}
                  data-ocid="add_student.srNo.input"
                />
              </div>
              <div>
                <Label htmlFor="penNo">Pen No.</Label>
                <Input
                  id="penNo"
                  placeholder="PEN..."
                  value={form.penNo}
                  onChange={(e) => handleChange("penNo", e.target.value)}
                  data-ocid="add_student.penNo.input"
                />
              </div>
              <div>
                <Label htmlFor="apaarNo">APAAR No.</Label>
                <Input
                  id="apaarNo"
                  placeholder="APAAR..."
                  value={form.apaarNo}
                  onChange={(e) => handleChange("apaarNo", e.target.value)}
                  data-ocid="add_student.apaarNo.input"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Current Address</Label>
                <Textarea
                  id="address"
                  className="min-h-[80px] resize-none text-sm"
                  value={form.currentAddress}
                  onChange={(e) =>
                    handleChange("currentAddress", e.target.value)
                  }
                  placeholder="House No, Street, Area, City, PIN"
                  data-ocid="add_student.address.textarea"
                />
              </div>
              <div>
                <Label htmlFor="village">Permanent Address</Label>
                <Input
                  id="village"
                  value={form.permanentAddress ?? ""}
                  onChange={(e) =>
                    handleChange("permanentAddress", e.target.value)
                  }
                  data-ocid="add_student.village.input"
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 4 — Transport */}
          <TabsContent value="transport" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Transport Route</Label>
                <Select
                  value={form.transportRouteId ?? ""}
                  onValueChange={(v) => {
                    const routeId = v === "none" ? null : v;
                    if (routeId) {
                      setForm((prev) => ({
                        ...prev,
                        transportRouteId: routeId,
                        transportPickupPointId: null,
                        transportMonths: SCHOOL_MONTHS.filter(
                          (m) => m !== "June",
                        ),
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        transportRouteId: null,
                        transportPickupPointId: null,
                        transportMonths: [],
                      }));
                    }
                  }}
                >
                  <SelectTrigger data-ocid="add_student.route.select">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {routeOptions.map((r: TransportRoute) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="busNo">Bus No.</Label>
                <Input
                  id="busNo"
                  value={form.busNo}
                  onChange={(e) => handleChange("busNo", e.target.value)}
                  data-ocid="add_student.busNo.input"
                />
              </div>
              {form.transportRouteId && (
                <div className="col-span-2">
                  <Label>Pickup Point</Label>
                  {pickupPoints.length === 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      No pickup points configured for this route.
                    </p>
                  ) : (
                    <Select
                      value={form.transportPickupPointId ?? "none"}
                      onValueChange={(v) =>
                        handleChange(
                          "transportPickupPointId",
                          v === "none" ? null : v,
                        )
                      }
                    >
                      <SelectTrigger data-ocid="add_student.pickup_point.select">
                        <SelectValue placeholder="Select pickup point" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {pickupPoints.map((pp: PickupPoint) => (
                          <SelectItem key={pp.id} value={pp.id}>
                            {pp.name}
                            {pp.timing ? ` (${pp.timing})` : ""} — ₹
                            {pp.monthlyFare}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {form.transportPickupPointId &&
                    pickupPoints.length > 0 &&
                    (() => {
                      const selectedPP = pickupPoints.find(
                        (pp: PickupPoint) =>
                          pp.id === form.transportPickupPointId,
                      );
                      return selectedPP ? (
                        <p className="text-xs text-primary mt-1 font-medium">
                          Transport fee: ₹{selectedPP.monthlyFare}/month
                          (auto-applied for 11 months)
                        </p>
                      ) : null;
                    })()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Transport Fee Months</p>
              <div className="grid grid-cols-4 gap-2">
                {SCHOOL_MONTHS.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                  >
                    <Checkbox
                      id={`transport-month-${m}`}
                      checked={form.transportMonths.includes(m)}
                      onCheckedChange={() => toggleTransportMonth(m)}
                      data-ocid={`add_student.transport_month.${m.toLowerCase()}`}
                    />
                    <label
                      htmlFor={`transport-month-${m}`}
                      className="cursor-pointer"
                    >
                      {m}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-2 border-t border-border">
          {/* Auto-create accounts checkbox */}
          <div className="flex items-center gap-2 mr-auto">
            <Checkbox
              id="autoCreateAccts"
              checked={autoCreateAccounts}
              onCheckedChange={(v) => setAutoCreateAccounts(v === true)}
              data-ocid="add_student.auto_create_accounts.checkbox"
            />
            <label
              htmlFor="autoCreateAccts"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Auto-create login accounts (student &amp; parent)
            </label>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="add_student.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addStudent.isPending}
            data-ocid="add_student.submit_button"
          >
            {addStudent.isPending ? "Saving…" : "Add Student"}
          </Button>
        </DialogFooter>

        {/* Credentials Modal — shown after successful creation when autoCreate is on */}
        {createdCredentials && (
          <Dialog
            open
            onOpenChange={() => {
              setCreatedCredentials(null);
              setForm({
                ...INITIAL_FORM,
                sessionId: currentSession,
                transportPickupPointId: null,
              });
              setTab("personal");
              onClose();
            }}
          >
            <DialogContent
              className="max-w-sm"
              data-ocid="add_student.credentials_dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display text-green-700">
                  ✅ Accounts Created
                </DialogTitle>
                <DialogDescription>
                  Share these credentials with the student and parent. Passwords
                  can be changed in User Management.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Student Account
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Username:
                    </span>
                    <code className="text-sm font-mono font-bold text-foreground">
                      {createdCredentials.studentUser}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Password:
                    </span>
                    <code className="text-sm font-mono font-bold text-foreground">
                      {createdCredentials.studentPass}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Permissions: View fees, attendance, results
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Parent Account
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Username:
                    </span>
                    <code className="text-sm font-mono font-bold text-foreground">
                      {createdCredentials.parentUser}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Password:
                    </span>
                    <code className="text-sm font-mono font-bold text-foreground">
                      {createdCredentials.parentPass}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Permissions: View child fees, attendance
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const text = `Student: ${createdCredentials.studentUser} / ${createdCredentials.studentPass}\nParent: ${createdCredentials.parentUser} / ${createdCredentials.parentPass}`;
                    navigator.clipboard
                      .writeText(text)
                      .then(() => toast.success("Credentials copied!"));
                  }}
                  data-ocid="add_student.credentials_copy_button"
                >
                  Copy All
                </Button>
                <Button
                  onClick={() => {
                    setCreatedCredentials(null);
                    setForm({
                      ...INITIAL_FORM,
                      sessionId: currentSession,
                      transportPickupPointId: null,
                    });
                    setTab("personal");
                    onClose();
                  }}
                  data-ocid="add_student.credentials_close_button"
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Student Dialog ──────────────────────────────────────────────────────
function EditStudentDialog({
  student,
  open,
  onClose,
  sections,
}: {
  student: Student;
  open: boolean;
  onClose: () => void;
  sections: Section[];
}) {
  const { data: routeOptions = [] } = useRoutes();
  const updateStudent = useUpdateStudent();
  const [form, setForm] = useState({
    admNo: student.admNo,
    fullName: student.fullName,
    fatherName: student.fatherName,
    motherName: student.motherName,
    fatherMobile: student.fatherMobile,
    motherMobile: student.motherMobile,
    mobile: student.mobile,
    currentAddress: student.currentAddress,
    permanentAddress: student.permanentAddress,
    category: student.category,
    aadhaarNo: student.aadhaarNo,
    srNo: student.srNo,
    penNo: student.penNo,
    apaarNo: student.apaarNo,
    prevSchool: student.prevSchool,
    admissionDate: student.admissionDate,
    busNo: student.busNo,
    classLevel: student.classLevel,
    sectionId: student.sectionId,
    sessionId: student.sessionId,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    photoUrl: student.photoUrl,
    transportRouteId: student.transportRouteId,
    transportPickupPointId: student.pickupPointId,
    transportMonths: student.transportRouteId
      ? SCHOOL_MONTHS.filter((m) => m !== "June")
      : ([] as string[]),
  });
  const [tab, setTab] = useState("personal");
  const filteredSections = sections.filter(
    (s) => s.classLevel === form.classLevel,
  );
  const { data: pickupPoints = [] } = usePickupPointsByRoute(
    form.transportRouteId ?? "",
  );

  function handleChange(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTransportMonthEdit(month: string) {
    setForm((prev) => ({
      ...prev,
      transportMonths: prev.transportMonths.includes(month)
        ? prev.transportMonths.filter((m) => m !== month)
        : [...prev.transportMonths, month],
    }));
  }

  function handleSubmit() {
    if (!form.fullName || !form.fatherName || !form.fatherMobile) return;
    updateStudent.mutate(
      {
        ...student,
        ...form,
        transportRouteId: form.transportRouteId || null,
        pickupPointId: form.transportPickupPointId || null,
      },
      {
        onSuccess: () => {
          toast.success(`"${form.fullName}" updated successfully`);
          onClose();
        },
        onError: (err) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to update student. Please try again.";
          toast.error(msg);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="edit_student.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Edit Student
          </DialogTitle>
          <DialogDescription>Update student details.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personal" data-ocid="edit_student.tab.personal">
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" data-ocid="edit_student.tab.academic">
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              data-ocid="edit_student.tab.documents"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="transport"
              data-ocid="edit_student.tab.transport"
            >
              Transport
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <ImageUploadField
                  label="Student Photo"
                  value={form.photoUrl}
                  onChange={(url) => handleChange("photoUrl", url)}
                  onRemove={() => handleChange("photoUrl", "")}
                  shape="avatar"
                  ocid="edit_student.photo.upload_button"
                />
              </div>
              <div>
                <Label htmlFor="edit-admNo">Adm. No.</Label>
                <Input
                  id="edit-admNo"
                  value={form.admNo}
                  onChange={(e) => handleChange("admNo", e.target.value)}
                  data-ocid="edit_student.admNo.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-fullName">Full Name *</Label>
                <Input
                  id="edit-fullName"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  data-ocid="edit_student.fullName.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-fatherName">Father Name *</Label>
                <Input
                  id="edit-fatherName"
                  value={form.fatherName}
                  onChange={(e) => handleChange("fatherName", e.target.value)}
                  data-ocid="edit_student.fatherName.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-motherName">Mother Name</Label>
                <Input
                  id="edit-motherName"
                  value={form.motherName}
                  onChange={(e) => handleChange("motherName", e.target.value)}
                  data-ocid="edit_student.motherName.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-fatherMobile">Father Mobile *</Label>
                <Input
                  id="edit-fatherMobile"
                  type="tel"
                  value={form.fatherMobile}
                  onChange={(e) => handleChange("fatherMobile", e.target.value)}
                  data-ocid="edit_student.fatherMobile.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-motherMobile">Mother Mobile</Label>
                <Input
                  id="edit-motherMobile"
                  type="tel"
                  value={form.motherMobile}
                  onChange={(e) => handleChange("motherMobile", e.target.value)}
                  data-ocid="edit_student.motherMobile.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <DateInput
                  id="edit-dob"
                  value={form.dateOfBirth}
                  onChange={(iso) => handleChange("dateOfBirth", iso)}
                  data-ocid="edit_student.dob.input"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                >
                  <SelectTrigger data-ocid="edit_student.gender.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger data-ocid="edit_student.category.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-admDate">Admission Date</Label>
                <DateInput
                  id="edit-admDate"
                  value={form.admissionDate}
                  onChange={(iso) => handleChange("admissionDate", iso)}
                  data-ocid="edit_student.admDate.input"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Class *</Label>
                <Select
                  value={form.classLevel}
                  onValueChange={(v) => {
                    handleChange("classLevel", v);
                    handleChange("sectionId", "");
                  }}
                >
                  <SelectTrigger data-ocid="edit_student.class.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASS_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Select
                  value={form.sectionId}
                  onValueChange={(v) => handleChange("sectionId", v)}
                  disabled={!form.classLevel}
                >
                  <SelectTrigger data-ocid="edit_student.section.select">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-sessionInput">Session</Label>
                <Input
                  id="edit-sessionInput"
                  value={form.sessionId}
                  onChange={(e) => handleChange("sessionId", e.target.value)}
                  data-ocid="edit_student.session.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-prevSchool">Previous School</Label>
                <Input
                  id="edit-prevSchool"
                  value={form.prevSchool}
                  onChange={(e) => handleChange("prevSchool", e.target.value)}
                  data-ocid="edit_student.prevSchool.input"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-aadhaar">Aadhaar No.</Label>
                <Input
                  id="edit-aadhaar"
                  value={form.aadhaarNo}
                  onChange={(e) => handleChange("aadhaarNo", e.target.value)}
                  data-ocid="edit_student.aadhaar.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-srNo">S.R. No.</Label>
                <Input
                  id="edit-srNo"
                  value={form.srNo}
                  onChange={(e) => handleChange("srNo", e.target.value)}
                  data-ocid="edit_student.srNo.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-penNo">Pen No.</Label>
                <Input
                  id="edit-penNo"
                  value={form.penNo}
                  onChange={(e) => handleChange("penNo", e.target.value)}
                  data-ocid="edit_student.penNo.input"
                />
              </div>
              <div>
                <Label htmlFor="edit-apaarNo">APAAR No.</Label>
                <Input
                  id="edit-apaarNo"
                  value={form.apaarNo}
                  onChange={(e) => handleChange("apaarNo", e.target.value)}
                  data-ocid="edit_student.apaarNo.input"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Current Address</Label>
                <Textarea
                  id="edit-address"
                  className="min-h-[80px] resize-none text-sm"
                  value={form.currentAddress}
                  onChange={(e) =>
                    handleChange("currentAddress", e.target.value)
                  }
                  data-ocid="edit_student.address.textarea"
                />
              </div>
              <div>
                <Label htmlFor="edit-village">Permanent Address</Label>
                <Input
                  id="edit-village"
                  value={form.permanentAddress}
                  onChange={(e) =>
                    handleChange("permanentAddress", e.target.value)
                  }
                  data-ocid="edit_student.village.input"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Transport Route</Label>
                <Select
                  value={form.transportRouteId ?? "none"}
                  onValueChange={(v) => {
                    const routeId = v === "none" ? null : v;
                    setForm((prev) => ({
                      ...prev,
                      transportRouteId: routeId,
                      transportPickupPointId: null,
                    }));
                  }}
                >
                  <SelectTrigger data-ocid="edit_student.route.select">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {routeOptions.map((r: TransportRoute) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-busNo">Bus No.</Label>
                <Input
                  id="edit-busNo"
                  value={form.busNo}
                  onChange={(e) => handleChange("busNo", e.target.value)}
                  data-ocid="edit_student.busNo.input"
                />
              </div>
              {form.transportRouteId && (
                <div className="col-span-2">
                  <Label>Pickup Point</Label>
                  {pickupPoints.length === 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      No pickup points configured for this route.
                    </p>
                  ) : (
                    <Select
                      value={form.transportPickupPointId ?? "none"}
                      onValueChange={(v) =>
                        handleChange(
                          "transportPickupPointId",
                          v === "none" ? null : v,
                        )
                      }
                    >
                      <SelectTrigger data-ocid="edit_student.pickup_point.select">
                        <SelectValue placeholder="Select pickup point" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {pickupPoints.map((pp: PickupPoint) => (
                          <SelectItem key={pp.id} value={pp.id}>
                            {pp.name}
                            {pp.timing ? ` (${pp.timing})` : ""} — ₹
                            {pp.monthlyFare}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {form.transportPickupPointId &&
                    pickupPoints.length > 0 &&
                    (() => {
                      const selectedPP = pickupPoints.find(
                        (pp: PickupPoint) =>
                          pp.id === form.transportPickupPointId,
                      );
                      return selectedPP ? (
                        <p className="text-xs text-primary mt-1 font-medium">
                          Transport fee: ₹{selectedPP.monthlyFare}/month
                          (auto-applied for 11 months)
                        </p>
                      ) : null;
                    })()}
                </div>
              )}
            </div>
            {/* Transport Months */}
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Transport Fee Months</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transport fees are automatically applied for 11 months (April
                  to March, excluding June). Adjust if needed.
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SCHOOL_MONTHS.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                  >
                    <Checkbox
                      id={`edit-transport-month-${m}`}
                      checked={form.transportMonths.includes(m)}
                      onCheckedChange={() => toggleTransportMonthEdit(m)}
                      data-ocid={`edit_student.transport_month.${m.toLowerCase()}`}
                    />
                    <label
                      htmlFor={`edit-transport-month-${m}`}
                      className={cn(
                        "cursor-pointer",
                        m === "June" && "text-muted-foreground line-through",
                      )}
                    >
                      {m}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateStudent.isPending}
            data-ocid="edit_student.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              updateStudent.isPending ||
              !form.fullName ||
              !form.fatherName ||
              !form.fatherMobile
            }
            data-ocid="edit_student.submit_button"
          >
            {updateStudent.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Student Import Template ──────────────────────────────────────────────────
const IMPORT_TEMPLATE_HEADERS = [
  "Adm. No.",
  "Full Name",
  "Class",
  "Section",
  "Gender",
  "DOB",
  "Father Name",
  "Father Mobile",
  "Mother Name",
  "Mother Mobile",
  "Mobile (Alt)",
  "Current Address",
  "Permanent Address",
  "Category",
  "Aadhaar No.",
  "S.R. No.",
  "Pen No.",
  "APAAR No.",
  "Previous School",
  "Admission Date",
  "Route",
  "Session",
];

const IMPORT_TEMPLATE_ROWS = [
  [
    "2025001",
    "Ravi Kumar",
    "Class 5",
    "A",
    "Male",
    "15/04/2015",
    "Suresh Kumar",
    "9876543210",
    "Sunita Devi",
    "9876543211",
    "",
    "House 12, Rampur, UP - 284001",
    "Rampur",
    "OBC",
    "1234 5678 9012",
    "SR-2025-001",
    "PEN2025001",
    "APAAR001",
    "Govt. Primary School Rampur",
    "01/04/2025",
    "Route A",
    "2025-26",
  ],
  [
    "2025002",
    "Priya Sharma",
    "LKG",
    "A",
    "Female",
    "22/07/2020",
    "Manoj Sharma",
    "9123456780",
    "Kavita Sharma",
    "9123456781",
    "",
    "Plot 5, Civil Lines, Jhansi - 284001",
    "Jhansi",
    "General",
    "9876 5432 1098",
    "SR-2025-002",
    "PEN2025002",
    "APAAR002",
    "",
    "01/04/2025",
    "",
    "2025-26",
  ],
];

function downloadStudentTemplate() {
  const csvRows = [
    IMPORT_TEMPLATE_HEADERS.join(","),
    ...IMPORT_TEMPLATE_ROWS.map((row) =>
      row
        .map((cell) =>
          /[,\n"]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell,
        )
        .join(","),
    ),
  ].join("\n");
  downloadCSVString(csvRows, "students-import-template.csv");
}

// ─── Bulk Photo Upload Dialog ──────────────────────────────────────────────────────────
function BulkPhotoUploadDialog({
  open,
  onClose,
  students,
}: { open: boolean; onClose: () => void; students: Student[] }) {
  type MatchItem = {
    file: File;
    admNo: string;
    student: Student | null;
    status: "pending" | "uploading" | "done" | "error";
    error?: string;
  };
  const [items, setItems] = useState<MatchItem[]>([]);
  const [stage, setStage] = useState<
    "select" | "preview" | "uploading" | "done"
  >("select");
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Use the silent variant to avoid per-update cache invalidations racing mid-loop
  const updateStudentSilent = useUpdateStudentSilent();
  const queryClient = useQueryClient();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const accepted = Array.from(files).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f.name),
    );
    if (accepted.length === 0) {
      toast.error("No supported image files (JPG, PNG, WEBP).");
      return;
    }
    const matched: MatchItem[] = accepted.map((file) => {
      const admNo = file.name.replace(/\.[^.]+$/, "").trim();
      const student =
        students.find(
          (s) => s.admNo.trim().toLowerCase() === admNo.toLowerCase(),
        ) ?? null;
      return { file, admNo, student, status: "pending" };
    });
    setItems(matched);
    setStage("preview");
  }

  async function uploadAll() {
    const updated = [...items];
    setStage("uploading");
    let ok = 0;

    // Snapshot the current student list so we can restore it if the cache
    // gets cleared during the upload loop (e.g. by an intervening invalidation).
    const snapshot = queryClient.getQueryData<Student[]>(["students"]) ?? [];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      if (!item.student) continue;
      updated[i] = { ...item, status: "uploading" };
      setItems([...updated]);
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(item.file);
        });
        const updatedStudent = { ...item.student, photoUrl: dataUrl };
        // Silent mutation: no onSuccess invalidation, so cache stays stable mid-loop
        await updateStudentSilent.mutateAsync(updatedStudent);
        // Patch the cache entry optimistically so photos appear immediately
        queryClient.setQueryData<Student[]>(["students"], (old) => {
          const base = old && old.length > 0 ? old : snapshot;
          return base.map((s) =>
            s.id === updatedStudent.id ? { ...s, photoUrl: dataUrl } : s,
          );
        });
        updated[i] = { ...updated[i], status: "done" };
        ok++;
      } catch (e) {
        updated[i] = {
          ...updated[i],
          status: "error",
          error: e instanceof Error ? e.message : "Failed",
        };
      }
      setItems([...updated]);
    }
    setSuccessCount(ok);
    // After all uploads, ensure the list shows real data.
    // If backend refetch returns data, use it. Otherwise preserve optimistic cache.
    if (ok > 0) {
      const current = queryClient.getQueryData<Student[]>(["students"]);
      const base = current && current.length > 0 ? current : snapshot;
      queryClient.setQueryData<Student[]>(["students"], base);
      // Mark stale for next visit but don't trigger an immediate refetch
      // (the optimistic cache already has the correct data with updated photos)
      queryClient.invalidateQueries({
        queryKey: ["students"],
        refetchType: "none",
      });
    }
    setStage("done");
  }

  function reset() {
    setItems([]);
    setStage("select");
    setSuccessCount(0);
  }
  const matchedCount = items.filter((it) => it.student !== null).length;
  const unmatchedCount = items.filter((it) => it.student === null).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="bulk_photo.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Bulk Student Photo Upload
          </DialogTitle>
          <DialogDescription>
            Upload photos named by student admission number (e.g.{" "}
            <code>ADM001.jpg</code>). They are auto-matched and saved.
          </DialogDescription>
        </DialogHeader>
        {stage === "select" && (
          <div
            className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-3 cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            data-ocid="bulk_photo.dropzone"
            onKeyDown={(e) =>
              e.key === "Enter" && fileInputRef.current?.click()
            }
          >
            <Upload className="size-10 mx-auto text-muted-foreground" />
            <p className="font-semibold text-foreground">
              Drop photos here or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              File names must match student Adm. No. (e.g.{" "}
              <strong>2025001.jpg</strong>)
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, JPEG, PNG, WEBP
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              data-ocid="bulk_photo.file_input"
            />
          </div>
        )}
        {(stage === "preview" || stage === "uploading" || stage === "done") && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Badge
                variant="outline"
                className="text-green-700 border-green-500/40"
              >
                {matchedCount} matched
              </Badge>
              {unmatchedCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-destructive border-destructive/40"
                >
                  {unmatchedCount} unmatched
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {items.length} total files
              </span>
            </div>
            <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-foreground">
                      File
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-foreground">
                      Student
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={item.file.name}
                      className="border-b border-border last:border-0"
                      data-ocid={`bulk_photo.item.${i + 1}`}
                    >
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {item.file.name}
                      </td>
                      <td className="px-3 py-2 text-sm">
                        {item.student ? (
                          <span className="font-medium text-foreground">
                            {item.student.fullName}{" "}
                            <span className="text-muted-foreground text-xs">
                              #{item.admNo}
                            </span>
                          </span>
                        ) : (
                          <span className="text-destructive text-xs">
                            ✖ No student found for "{item.admNo}"
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {item.status === "pending" && item.student && (
                          <span className="text-green-600">✓ Ready</span>
                        )}
                        {item.status === "pending" && !item.student && (
                          <span className="text-muted-foreground">Skip</span>
                        )}
                        {item.status === "uploading" && (
                          <span className="text-primary animate-pulse">
                            Uploading…
                          </span>
                        )}
                        {item.status === "done" && (
                          <span className="text-green-600">✓ Done</span>
                        )}
                        {item.status === "error" && (
                          <span className="text-destructive" title={item.error}>
                            ✖ Error
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stage === "done" && (
              <div
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center"
                data-ocid="bulk_photo.success_state"
              >
                <p className="font-semibold text-foreground">
                  ✅ {successCount} photo{successCount !== 1 ? "s" : ""} updated
                  successfully.
                </p>
                {unmatchedCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {unmatchedCount} file{unmatchedCount !== 1 ? "s" : ""} could
                    not be matched to any student.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <DialogFooter className="pt-2 border-t border-border">
          {stage === "select" && (
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="bulk_photo.cancel_button"
            >
              Cancel
            </Button>
          )}
          {stage === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={reset}
                data-ocid="bulk_photo.back_button"
              >
                Back
              </Button>
              <Button
                onClick={uploadAll}
                disabled={matchedCount === 0}
                data-ocid="bulk_photo.upload_button"
              >
                <Upload className="size-4 mr-1.5" />
                Upload {matchedCount} Photo{matchedCount !== 1 ? "s" : ""}
              </Button>
            </>
          )}
          {stage === "uploading" && (
            <Button disabled data-ocid="bulk_photo.loading_state">
              Uploading…
            </Button>
          )}
          {stage === "done" && (
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              data-ocid="bulk_photo.close_button"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Bulk Import Dialog ───────────────────────────────────────────────────────
function BulkImportDialog({
  open,
  onClose,
  sections,
}: { open: boolean; onClose: () => void; sections: Section[] }) {
  type Stage = "upload" | "preview" | "importing" | "done";
  type RowError = { row: number; name: string; error: string };

  const [stage, setStage] = useState<Stage>("upload");
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [progressDone, setProgressDone] = useState(0);
  const [progressRetrying, setProgressRetrying] = useState(0);
  const [progressFailed, setProgressFailed] = useState(0);
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 });
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [backendWarning, setBackendWarning] = useState("");
  const [failedRowIndices, setFailedRowIndices] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const addStudent = useAddStudent();
  const updateStudentMutation = useUpdateStudent();
  const { data: sessions = [] } = useSessions();
  const { data: allStudentsForImport = [] } = useStudents();
  const { currentSession } = useAppStore();

  const RETRY_DELAYS = [1000, 2000, 4000];

  // ── CSV parser ──────────────────────────────────────────────────────────────────
  function parseCSV(text: string): string[][] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    return lines.map((line) => {
      const cells: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          cells.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      return cells;
    });
  }

  function buildHeaderMap(headers: string[]) {
    const map: Record<string, number> = {};
    headers.forEach((h, i) => {
      map[h.toLowerCase().replace(/[^a-z0-9]/g, "")] = i;
    });
    return map;
  }

  function get(
    row: string[],
    map: Record<string, number>,
    ...keys: string[]
  ): string {
    for (const k of keys) {
      const idx = map[k];
      if (idx !== undefined && row[idx]) return row[idx].trim();
    }
    return "";
  }

  function mapClassLevel(label: string): ClassLevel {
    const lower = label.toLowerCase().trim();
    if (lower === "play way" || lower === "playway") return "PlayWay";
    if (lower === "lkg") return "LKG";
    if (lower === "ukg") return "UKG";
    const match = lower.match(/(\d+)/);
    if (match) return `Class${match[1]}` as ClassLevel;
    return "Class1";
  }

  // ── Backend health check ───────────────────────────────────────────────────────
  async function checkBackendHealth(): Promise<boolean> {
    // Try a lightweight call; sessions may already be in cache
    if (sessions.length > 0) return true;
    try {
      // If sessions hook returned data, backend is fine
      return true;
    } catch {
      return false;
    }
  }

  // ── Single row import with retries ──────────────────────────────────────────────
  async function importRow(
    row: string[],
    hmap: Record<string, number>,
    rowNum: number,
    onRetry: (retrying: boolean) => void,
  ): Promise<{ ok: boolean; error: string }> {
    const fullName = get(row, hmap, "fullname", "name", "studentname");
    if (!fullName)
      return { ok: false, error: `Row ${rowNum}: Missing Full Name` };
    const fatherMobile = get(
      row,
      hmap,
      "fathermobile",
      "fathersmobile",
      "mobile",
      "phone",
    );
    if (!fatherMobile)
      return { ok: false, error: `Row ${rowNum}: Missing Father Mobile` };

    const classLevelResolved = mapClassLevel(
      get(row, hmap, "class", "classlevel"),
    );
    const sectionNameRaw = get(row, hmap, "section", "sectionid") || "";
    const resolvedSection = sections.find(
      (s) =>
        s.classLevel === classLevelResolved &&
        s.name.toLowerCase().trim() === sectionNameRaw.toLowerCase().trim(),
    );
    const sectionId = resolvedSection?.id ?? sectionNameRaw;
    const payload = {
      // Column A — Adm No
      admNo:
        get(row, hmap, "admno", "admissionno", "adm") || `IMP${Date.now()}`,
      // Column B — Full Name (already resolved above)
      fullName,
      // Column G — Father Name
      fatherName: get(row, hmap, "fathername", "fathersname", "father"),
      // Column I — Mother Name
      motherName: get(row, hmap, "mothername", "mothersname", "mother"),
      // Column H — Father Mobile (already resolved above)
      fatherMobile,
      // Column J — Mother Mobile
      motherMobile: get(row, hmap, "mothermobile", "mothersmobile"),
      // Column K — Mobile (Alt)
      mobile: get(
        row,
        hmap,
        "mobilealt",
        "mobile",
        "studentmobile",
        "altmobile",
      ),
      // Column L — Current Address
      currentAddress: get(row, hmap, "currentaddress", "address", "currentadd"),
      // Column M — Permanent Address
      permanentAddress: get(
        row,
        hmap,
        "permanentaddress",
        "village",
        "permanentadd",
        "permaddress",
      ),
      // Column N — Category
      category: get(row, hmap, "category") || "General",
      // Column O — Aadhaar No
      aadhaarNo: get(row, hmap, "aadhaarono", "aadhaarno", "aadhaar"),
      // Column P — S.R. No.
      srNo: get(row, hmap, "srno", "srnumber", "sr"),
      // Column Q — Pen No.
      penNo: get(row, hmap, "penno", "pennumber", "pen"),
      // Column R — APAAR No.
      apaarNo: get(row, hmap, "apaarno", "apaarnumber", "apaar"),
      // Column S — Previous School
      prevSchool: get(row, hmap, "previousschool", "prevschool", "lastschool"),
      // Column T — Admission Date
      admissionDate: get(
        row,
        hmap,
        "admissiondate",
        "admdate",
        "dateofadmission",
      ),
      // Column U — Route/Bus No
      busNo: get(row, hmap, "busno", "bus"),
      classLevel: classLevelResolved,
      sectionId,
      // Column V — Session
      sessionId: get(row, hmap, "session") || currentSession,
      // Column F — DOB
      dateOfBirth: get(row, hmap, "dob", "dateofbirth", "birthdate") || "",
      // Column E — Gender
      gender: (get(row, hmap, "gender") || "Male") as
        | "Male"
        | "Female"
        | "Other",
      photoUrl: "",
      isDiscontinued: false,
      discontinuedAt: null,
      transportRouteId: null,
      pickupPointId: null,
    };

    // UPSERT: if a student with this admNo already exists, update instead of add
    const existingStudent = allStudentsForImport.find(
      (s) =>
        s.admNo.trim().toLowerCase() === payload.admNo.trim().toLowerCase(),
    );

    let lastError = "Unknown error";
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      if (attempt > 0) {
        onRetry(true);
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt - 1]));
      }
      try {
        if (existingStudent) {
          // Update existing student — preserve id, merge new data
          await updateStudentMutation.mutateAsync({
            ...existingStudent,
            ...payload,
            id: existingStudent.id,
          });
        } else {
          await addStudent.mutateAsync(payload);
        }
        onRetry(false);
        return { ok: true, error: "" };
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown error";
      }
    }
    onRetry(false);
    return { ok: false, error: `Row ${rowNum} (${fullName}): ${lastError}` };
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length <= 1) {
        toast.error("File appears empty or has no data rows");
        return;
      }
      setParsedRows(rows);
      setStage("preview");
    };
    reader.readAsText(file);
  }

  async function startImport(rowsToImport?: number[]) {
    if (parsedRows.length < 2) return;
    setStage("importing");
    setProgressDone(0);
    setProgressRetrying(0);
    setProgressFailed(0);

    // Health check before starting
    const healthy = await checkBackendHealth();
    if (!healthy) {
      setBackendWarning(
        "Backend connection issue detected. Import may fail. Try again or contact support.",
      );
    } else {
      setBackendWarning("");
    }

    const [headerRow, ...dataRows] = parsedRows;
    const hmap = buildHeaderMap(headerRow);

    const targetIndices = rowsToImport ?? dataRows.map((_, i) => i);
    let done = 0;
    let failed = 0;
    let retrying = 0;
    const errors: RowError[] = [];
    const failedIdx: number[] = [];

    for (const i of targetIndices) {
      const row = dataRows[i];
      const result = await importRow(row, hmap, i + 2, (isRetrying) => {
        retrying = isRetrying ? retrying + 1 : Math.max(0, retrying - 1);
        setProgressRetrying(retrying);
      });
      if (result.ok) {
        done++;
        setProgressDone(done);
      } else {
        failed++;
        setProgressFailed(failed);
        const name =
          get(row, hmap, "fullname", "name", "studentname") || "Unknown";
        errors.push({ row: i + 2, name, error: result.error });
        failedIdx.push(i);
      }
    }

    setImportStats({ success: done, failed });
    setRowErrors(errors);
    setFailedRowIndices(failedIdx);
    if (done > 0) toast.success(`${done} student(s) imported successfully`);
    else if (failed > 0)
      toast.error(`Import failed — ${failed} row(s) could not be saved`);
    setStage("done");
  }

  function handleClose() {
    setStage("upload");
    setProgressDone(0);
    setProgressRetrying(0);
    setProgressFailed(0);
    setParsedRows([]);
    setImportStats({ success: 0, failed: 0 });
    setRowErrors([]);
    setFailedRowIndices([]);
    setBackendWarning("");
    if (fileRef.current) fileRef.current.value = "";
    onClose();
  }

  const previewRows = parsedRows.slice(1, 4);
  const headerRow = parsedRows[0] ?? [];
  // Show first 8 columns (or all if fewer), with horizontal scroll — avoids truncating columns K+
  const previewCols = Array.from(
    { length: Math.min(8, headerRow.length) },
    (_, i) => i,
  ).filter((i) => i < headerRow.length);
  // Warn if uploaded file has fewer columns than the template expects
  const expectedColCount = IMPORT_TEMPLATE_HEADERS.length;
  const uploadedColCount = headerRow.length;
  const hasColumnCountWarning =
    uploadedColCount > 0 && uploadedColCount < expectedColCount;
  const total = Math.max(parsedRows.length - 1, 1);
  const progressPct = Math.round(
    ((progressDone + progressFailed) / total) * 100,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" data-ocid="bulk_import.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            Bulk Import Students
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple students at once.
          </DialogDescription>
        </DialogHeader>

        {/* Download Template */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
          <div>
            <p className="text-sm font-medium">Need a template?</p>
            <p className="text-xs text-muted-foreground">
              Download a pre-filled CSV with all required columns.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadStudentTemplate}
            className="shrink-0 ml-3"
            data-ocid="bulk_import.download_template_button"
          >
            <DownloadCloud className="h-3.5 w-3.5 mr-1.5" />
            Download Template
          </Button>
        </div>

        {/* Backend warning banner */}
        {backendWarning && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            ⚠️ {backendWarning}
          </div>
        )}

        {stage === "upload" && (
          <div className="space-y-4">
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
              data-ocid="bulk_import.dropzone"
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Click to upload CSV</p>
              <p className="text-xs text-muted-foreground mt-1">
                Columns: Adm. No., Full Name, Class, Section, Gender, DOB,
                Father Name, Father Mobile…
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </button>
          </div>
        )}

        {stage === "preview" && parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm font-medium">
                Preview — {parsedRows.length - 1} row(s) detected
              </p>
              <span className="text-xs text-muted-foreground">
                {uploadedColCount} column{uploadedColCount !== 1 ? "s" : ""}{" "}
                detected
              </span>
              {hasColumnCountWarning && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  ⚠ Only {uploadedColCount} of {expectedColCount} expected
                  columns found.
                </span>
              )}
            </div>
            <div className="rounded-md border border-border overflow-x-auto max-h-48">
              <table className="text-xs min-w-max w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    {previewCols.map((ci) => (
                      <th
                        key={ci}
                        className="px-2 py-1.5 text-left font-medium whitespace-nowrap"
                      >
                        <span className="text-muted-foreground mr-1">
                          {String.fromCharCode(65 + ci)}:
                        </span>
                        {headerRow[ci] ?? `Col ${ci + 1}`}
                      </th>
                    ))}
                    {headerRow.length > 8 && (
                      <th className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                        +{headerRow.length - 8} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr
                      key={row[0] ?? Math.random().toString()}
                      className="border-t border-border even:bg-muted/20"
                    >
                      {previewCols.map((ci) => (
                        <td
                          key={ci}
                          className="px-2 py-1.5 truncate max-w-[120px]"
                        >
                          {row[ci] ?? ""}
                        </td>
                      ))}
                      {headerRow.length > 8 && (
                        <td className="px-2 py-1.5 text-muted-foreground text-[10px]">
                          …
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length - 1 > 3 && (
              <p className="text-xs text-muted-foreground">
                … and {parsedRows.length - 4} more rows
              </p>
            )}
          </div>
        )}

        {stage === "importing" && (
          <div className="space-y-4 py-4">
            <p className="text-sm font-semibold text-center">
              Importing… {progressDone + progressFailed}/{parsedRows.length - 1}{" "}
              done
              {progressRetrying > 0 && (
                <span className="text-amber-600 ml-2">
                  — {progressRetrying} retrying
                </span>
              )}
              {progressFailed > 0 && (
                <span className="text-destructive ml-2">
                  — {progressFailed} failed
                </span>
              )}
            </p>
            <div
              className="h-2.5 bg-muted rounded-full overflow-hidden"
              data-ocid="bulk_import.progress"
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Please do not close this window
            </p>
          </div>
        )}

        {stage === "done" && (
          <div className="space-y-3 py-2" data-ocid="bulk_import.success_state">
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {importStats.success}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Imported successfully
                </p>
              </div>
              <div className="flex-1 rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-center">
                <p className="text-2xl font-bold text-destructive">
                  {importStats.failed}
                </p>
                <p className="text-xs text-destructive/80 mt-0.5">
                  Failed / skipped
                </p>
              </div>
            </div>
            {rowErrors.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 max-h-40 overflow-y-auto space-y-1">
                <p className="text-xs font-semibold text-destructive mb-1">
                  Failed rows:
                </p>
                {rowErrors.map((e) => (
                  <p
                    key={`${e.row}-${e.name}`}
                    className="text-xs text-destructive"
                  >
                    Row {e.row} — {e.name}: {e.error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-border pt-2 flex-wrap gap-2">
          {stage === "preview" && (
            <Button
              onClick={() => startImport()}
              disabled={parsedRows.length < 2}
              data-ocid="bulk_import.submit_button"
            >
              Import {parsedRows.length - 1} Students
            </Button>
          )}
          {stage === "done" && failedRowIndices.length > 0 && (
            <Button
              variant="outline"
              onClick={() => startImport(failedRowIndices)}
              data-ocid="bulk_import.retry_button"
            >
              Retry Failed Rows ({failedRowIndices.length})
            </Button>
          )}
          {stage === "done" && (
            <Button onClick={handleClose} data-ocid="bulk_import.close_button">
              Done
            </Button>
          )}
          {stage !== "importing" && stage !== "done" && (
            <Button
              variant="ghost"
              onClick={handleClose}
              data-ocid="bulk_import.cancel_button"
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Export Columns Dialog ────────────────────────────────────────────────────
interface ExportColsDialogProps {
  open: boolean;
  onClose: () => void;
  visibleCols: Set<string>;
  onExport: (cols: string[]) => void;
}

function ExportColumnsDialog({
  open,
  onClose,
  visibleCols,
  onExport,
}: ExportColsDialogProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set(visibleCols));

  // Sync when dialog opens with current visible cols
  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setChecked(new Set(visibleCols));
    else onClose();
  }

  function toggle(key: string) {
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }

  function toggleAll() {
    if (checked.size === ALL_COLUMNS.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(ALL_COLUMNS.map((c) => c.key)));
    }
  }

  // Preserve display order
  const orderedChecked = ALL_COLUMNS.filter((c) => checked.has(c.key)).map(
    (c) => c.key,
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm" data-ocid="export_cols.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Export Columns</DialogTitle>
          <DialogDescription>
            Choose which columns to include in the CSV export. Column order
            follows the table display order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {/* Select All */}
          <div
            className="flex items-center gap-2 text-sm font-medium cursor-pointer py-1.5 border-b border-border mb-2"
            onClick={toggleAll}
            onKeyDown={(e) => e.key === "Enter" && toggleAll()}
          >
            <Checkbox
              id="export-all"
              checked={checked.size === ALL_COLUMNS.length}
              onCheckedChange={toggleAll}
              data-ocid="export_cols.select_all"
            />
            <label htmlFor="export-all" className="cursor-pointer">
              {checked.size === ALL_COLUMNS.length
                ? "Deselect All"
                : "Select All"}
            </label>
          </div>

          {ALL_COLUMNS.map((col) => (
            <div
              key={col.key}
              className="flex items-center gap-2 text-sm cursor-pointer py-0.5 hover:bg-muted/30 rounded px-1"
              onClick={() => toggle(col.key)}
              onKeyDown={(e) => e.key === "Enter" && toggle(col.key)}
            >
              <Checkbox
                id={`export-col-${col.key}`}
                checked={checked.has(col.key)}
                onCheckedChange={() => toggle(col.key)}
                data-ocid={`export_cols.col.${col.key}`}
              />
              <label
                htmlFor={`export-col-${col.key}`}
                className="cursor-pointer"
              >
                {col.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter className="border-t border-border pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="export_cols.cancel_button"
          >
            Cancel
          </Button>
          <Button
            disabled={orderedChecked.length === 0}
            onClick={() => onExport(orderedChecked)}
            data-ocid="export_cols.export_button"
          >
            <DownloadCloud className="h-3.5 w-3.5 mr-1.5" />
            Export {orderedChecked.length} column
            {orderedChecked.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Column Toggle ────────────────────────────────────────────────────────────
// ─── Column Groups for Toggle ────────────────────────────────────────────────
const COLUMN_GROUPS = [
  {
    label: "Basic Info",
    keys: ["admNo", "fullName", "classLevel", "section", "status"],
  },
  {
    label: "Contact",
    keys: ["mobile", "fatherMobile", "motherMobile"],
  },
  {
    label: "Family",
    keys: ["fatherName", "motherName"],
  },
  {
    label: "Address",
    keys: ["currentAddress", "permanentAddress"],
  },
  {
    label: "Academic",
    keys: [
      "srNo",
      "penNo",
      "apaarNo",
      "admissionDate",
      "prevSchool",
      "category",
    ],
  },
  {
    label: "Personal",
    keys: ["gender", "dateOfBirth", "aadhaarNo"],
  },
  {
    label: "Transport",
    keys: ["transportRouteId", "busNo"],
  },
] as const;

function ColumnToggle({
  visibleCols,
  onToggle,
  onReset,
}: {
  visibleCols: Set<string>;
  onToggle: (key: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function toggleGroup(keys: readonly string[]) {
    const allOn = keys.every((k) => visibleCols.has(k));
    for (const k of keys) {
      if (allOn) {
        if (visibleCols.has(k)) onToggle(k);
      } else {
        if (!visibleCols.has(k)) onToggle(k);
      }
    }
  }

  const totalVisible = visibleCols.size;
  const totalCols = ALL_COLUMNS.length;

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid="students.column_toggle"
      >
        <Filter className="h-3.5 w-3.5 mr-1.5" />
        Columns
        <span className="ml-1.5 bg-primary/10 text-primary text-[10px] font-semibold px-1 rounded">
          {totalVisible}/{totalCols}
        </span>
      </Button>
      {open && (
        <div
          className="absolute right-0 top-9 z-[9999] bg-card border border-border rounded-xl shadow-xl p-0 w-64 max-h-[500px] flex flex-col"
          data-ocid="students.column_popover"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Toggle Columns
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="students.column_reset_button"
            >
              Reset defaults
            </button>
          </div>
          {/* Scrollable group list */}
          <div className="overflow-y-auto flex-1 p-2 space-y-3">
            {COLUMN_GROUPS.map((group) => {
              const allOn = group.keys.every((k) => visibleCols.has(k));
              const someOn = group.keys.some((k) => visibleCols.has(k));
              return (
                <div key={group.label}>
                  {/* Group header with Select All */}
                  <div
                    className="flex items-center gap-2 mb-1 cursor-pointer select-none"
                    onClick={() => toggleGroup(group.keys)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && toggleGroup(group.keys)
                    }
                  >
                    <Checkbox
                      checked={allOn}
                      data-state={
                        someOn && !allOn ? "indeterminate" : undefined
                      }
                      onCheckedChange={() => toggleGroup(group.keys)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </span>
                  </div>
                  {/* Column items */}
                  <div className="pl-5 space-y-0.5">
                    {group.keys.map((key) => {
                      const col = ALL_COLUMNS.find((c) => c.key === key);
                      if (!col) return null;
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 py-0.5 text-sm cursor-pointer hover:bg-muted/30 rounded px-1 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggle(key);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onToggle(key);
                            }
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Checkbox
                            id={`col-toggle-${key}`}
                            checked={visibleCols.has(key)}
                            onCheckedChange={() => onToggle(key)}
                            className="h-3.5 w-3.5"
                          />
                          <label
                            htmlFor={`col-toggle-${key}`}
                            className="cursor-pointer text-xs select-none"
                          >
                            {col.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Promote All Classes Dialog ──────────────────────────────────────────────
type PromoteAllStep = "select" | "preview" | "running" | "result";

function PromoteAllClassesDialog({
  open,
  onClose,
  sessions,
}: {
  open: boolean;
  onClose: () => void;
  sessions: string[];
}) {
  const [step, setStep] = useState<PromoteAllStep>("select");
  const [fromSession, setFromSession] = useState("");
  const [toSession, setToSession] = useState("");
  const [result, setResult] = useState<PromotionAllResult | null>(null);
  const promoteAll = usePromoteAllClasses();

  function handleClose() {
    setStep("select");
    setFromSession("");
    setToSession("");
    setResult(null);
    onClose();
  }

  async function handleConfirm() {
    setStep("running");
    try {
      const res = (await promoteAll.mutateAsync({
        fromSession,
        toSession,
      })) as PromotionAllResult;
      setResult(res);
      setStep("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Promotion failed.";
      toast.error(msg);
      setStep("preview");
    }
  }

  const canPreview = !!fromSession && !!toSession && fromSession !== toSession;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        data-ocid="promote_all.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-primary" />
            Promote All Students
          </DialogTitle>
          <DialogDescription>
            Promote every student up one class across all classes in a single
            operation.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Sessions */}
        {(step === "select" || step === "preview") && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From Session</Label>
                <Select value={fromSession} onValueChange={setFromSession}>
                  <SelectTrigger data-ocid="promote_all.from_session.select">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Session (New)</Label>
                <Select value={toSession} onValueChange={setToSession}>
                  <SelectTrigger data-ocid="promote_all.to_session.select">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {step === "preview" && canPreview && (
              <div className="space-y-3">
                {/* Promotion chain preview */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <p className="text-sm font-semibold text-primary">
                    Promotion Summary
                  </p>
                  <p className="text-sm text-foreground">
                    This will promote all students from{" "}
                    <span className="font-semibold">{fromSession}</span> to{" "}
                    <span className="font-semibold">{toSession}</span>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Each student moves up one class in Indian school order:
                  </p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {CLASS_ORDER.map((cls, i) => (
                      <span key={cls} className="flex items-center gap-0.5">
                        <span className="bg-card border border-border rounded px-1.5 py-0.5 font-medium">
                          {CLASS_LABELS[cls]}
                        </span>
                        {i < CLASS_ORDER.length - 1 && (
                          <span className="text-muted-foreground">→</span>
                        )}
                      </span>
                    ))}
                    <span className="flex items-center gap-0.5">
                      <span className="text-muted-foreground">→</span>
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded px-1.5 py-0.5 font-medium">
                        Alumni
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Class 12 students will be marked as Graduated/Alumni.
                  </p>
                </div>

                {/* Non-destructive warning */}
                <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
                  <span className="font-semibold">⚠️ Non-destructive:</span> All
                  original data in{" "}
                  <span className="font-semibold">{fromSession}</span> will be
                  preserved. Nothing is deleted.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Running */}
        {step === "running" && (
          <div
            className="py-8 flex flex-col items-center gap-3"
            data-ocid="promote_all.loading_state"
          >
            <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">
              Promoting students across all classes…
            </p>
            <p className="text-xs text-muted-foreground">
              Please do not close this window.
            </p>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && result && (
          <div className="space-y-4" data-ocid="promote_all.success_state">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-3xl font-bold text-green-700">
                  {result.totalPromoted}
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Students Promoted
                </p>
              </div>
              <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-center">
                <p className="text-3xl font-bold text-destructive">
                  {result.totalFailed}
                </p>
                <p className="text-xs text-destructive/80 mt-1 font-medium">
                  Failed / Skipped
                </p>
              </div>
            </div>

            {result.breakdown.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Class-wise Breakdown
                </div>
                <div className="divide-y divide-border max-h-52 overflow-y-auto">
                  {result.breakdown.map((b, idx) => (
                    <div
                      key={b.className}
                      className="px-3 py-2 flex items-center gap-3 text-sm"
                      data-ocid={`promote_all.breakdown.item.${idx + 1}`}
                    >
                      <span className="flex-1 font-medium min-w-0 truncate">
                        {b.className}
                      </span>
                      <span className="text-green-700 font-semibold min-w-[40px] text-right">
                        ✓ {b.promoted}
                      </span>
                      {b.failed > 0 && (
                        <span className="text-destructive font-semibold min-w-[40px] text-right">
                          ✗ {b.failed}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.breakdown.some((b) => b.errors.length > 0) && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-36 overflow-y-auto space-y-1">
                <p className="text-xs font-semibold text-destructive">
                  Errors:
                </p>
                {result.breakdown
                  .flatMap((b) => b.errors)
                  .map((err) => (
                    <p key={err} className="text-xs text-destructive">
                      {err}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-border pt-3 gap-2">
          {step === "select" && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                data-ocid="promote_all.cancel_button"
              >
                Cancel
              </Button>
              <Button
                disabled={!canPreview}
                onClick={() => setStep("preview")}
                data-ocid="promote_all.next_button"
              >
                Next: Preview
              </Button>
            </>
          )}
          {step === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                data-ocid="promote_all.back_button"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canPreview}
                data-ocid="promote_all.confirm_button"
              >
                <ArrowUpCircle className="h-4 w-4 mr-1.5" />
                Promote All Students
              </Button>
            </>
          )}
          {step === "result" && (
            <Button onClick={handleClose} data-ocid="promote_all.close_button">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

export default function StudentsPage() {
  const { currentSession, setSession, discounts, currentRole } = useAppStore();
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const deleteStudent = useDeleteStudent();
  const deleteAllStudents = useDeleteAllStudents();
  const discontinueStudent = useDiscontinueStudent();
  const { data: students = [], isLoading } = useStudents();
  const { data: sections = [] } = useSections();
  const { data: routes = [] } = useRoutes();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<StudentFilters>({
    session: currentSession,
    classLevel: "",
    sectionId: "",
    status: "",
    search: "",
    familyMobile: "",
  });
  const [sortKey, setSortKey] = useState<SortKey>("admNo");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkPhotoOpen, setBulkPhotoOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [promoteAllOpen, setPromoteAllOpen] = useState(false);
  const [exportTargetIds, setExportTargetIds] = useState<Set<string> | null>(
    null,
  );
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [editStudentTarget, setEditStudentTarget] = useState<Student | null>(
    null,
  );
  const [discountStudent, setDiscountStudent] = useState<Student | null>(null);
  const [familyMobile, setFamilyMobile] = useState<string | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] =
    useState<Student | null>(null);
  const [bulkAction, setBulkAction] = useState<"discontinue" | "delete" | null>(
    null,
  );
  const [deleteAllStep, setDeleteAllStep] = useState<0 | 1 | 2>(0);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [printStudent, setPrintStudent] = useState<{
    student: Student;
    type: "IDCard" | "Bonafide" | "Transfer" | "AdmitCard";
  } | null>(null);

  const { data: allTemplates = [] } = useCertificateTemplates();

  const [visibleCols, setVisibleCols] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("shubh_student_visible_cols");
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed);
      }
    } catch {
      /* ignore */
    }
    return new Set(DEFAULT_VISIBLE);
  });

  // Persist column visibility to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "shubh_student_visible_cols",
        JSON.stringify(Array.from(visibleCols)),
      );
    } catch {
      /* ignore storage errors */
    }
  }, [visibleCols]);

  function toggleCol(key: string) {
    setVisibleCols((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }

  // ── Family map: mobile → Set of student IDs ───────────────────────────────
  const familyMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const s of students) {
      for (const mob of [s.fatherMobile, s.motherMobile, s.mobile]) {
        if (!mob) continue;
        if (!map.has(mob)) map.set(mob, new Set());
        map.get(mob)!.add(s.id);
      }
    }
    // Only keep mobiles where count > 1
    for (const [mob, ids] of map) {
      if (ids.size <= 1) map.delete(mob);
    }
    return map;
  }, [students]);

  function getStudentFamilyMobile(s: Student): string | null {
    for (const mob of [s.fatherMobile, s.motherMobile, s.mobile]) {
      if (mob && familyMap.has(mob)) return mob;
    }
    return null;
  }

  // ── Filtered + sorted list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      if (filters.session && s.sessionId !== filters.session) return false;
      if (filters.classLevel && s.classLevel !== filters.classLevel)
        return false;
      if (filters.sectionId && s.sectionId !== filters.sectionId) return false;
      if (filters.status === "active" && s.isDiscontinued) return false;
      if (filters.status === "discontinued" && !s.isDiscontinued) return false;
      if (filters.familyMobile) {
        const ids = familyMap.get(filters.familyMobile);
        if (!ids || !ids.has(s.id)) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const primaryMatch =
          s.fullName.toLowerCase().includes(q) ||
          s.admNo.toLowerCase().includes(q) ||
          s.fatherMobile.includes(q) ||
          s.motherMobile.includes(q) ||
          s.mobile.includes(q) ||
          s.fatherName.toLowerCase().includes(q) ||
          s.motherName.toLowerCase().includes(q) ||
          s.permanentAddress.toLowerCase().includes(q);
        if (!primaryMatch) return false;
      }
      if (parentSearch) {
        const pq = parentSearch.toLowerCase();
        const parentMatch =
          s.fatherName.toLowerCase().includes(pq) ||
          s.motherName.toLowerCase().includes(pq);
        if (!parentMatch) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const av = String(
        (a as unknown as Record<string, unknown>)[sortKey] ?? "",
      );
      const bv = String(
        (b as unknown as Record<string, unknown>)[sortKey] ?? "",
      );
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [students, filters, parentSearch, sortKey, sortDir, familyMap]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sectionOptions = sections.filter(
    (s) =>
      !filters.classLevel ||
      s.classLevel === (filters.classLevel as ClassLevel),
  );
  const allPageSelected =
    paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        for (const s of paginated) n.delete(s.id);
        return n;
      });
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        for (const s of paginated) n.add(s.id);
        return n;
      });
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function openExport(ids?: Set<string>) {
    setExportTargetIds(ids ?? null);
    setExportOpen(true);
  }

  function doExport(selectedColKeys: string[]) {
    const source = exportTargetIds
      ? filtered.filter((s) => exportTargetIds.has(s.id))
      : filtered;

    // Build a label→key map for display-friendly headers
    const colLabelMap = Object.fromEntries(
      ALL_COLUMNS.map((c) => [c.key, c.label]),
    );

    // Map students to flat records with labeled keys
    const rows = source.map((s) => {
      const record: Record<string, unknown> = {};
      for (const key of selectedColKeys) {
        const label = colLabelMap[key as ColKey] ?? key;
        if (key === "classLevel") record[label] = CLASS_LABELS[s.classLevel];
        else if (key === "section")
          record[label] =
            sections.find((sec) => sec.id === s.sectionId)?.name ?? "";
        else if (key === "transportRouteId")
          record[label] =
            routes.find((r) => r.id === s.transportRouteId)?.name ?? "";
        else if (key === "status")
          record[label] = s.isDiscontinued ? "Discontinued" : "Active";
        else
          record[label] = (s as unknown as Record<string, unknown>)[key] ?? "";
      }
      return record;
    });

    const orderedKeys = selectedColKeys.map(
      (k) => colLabelMap[k as ColKey] ?? k,
    );
    downloadCSV(rows, `students_${filters.session}.csv`, orderedKeys);
    setExportOpen(false);
  }

  function sortArrow(key: SortKey) {
    if (sortKey !== key) return null;
    return <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  // Sticky column offsets (checkbox=0, photo=40px, admNo=96px, fullName=184px)
  const STICKY = {
    checkbox: "sticky left-0 z-20 bg-inherit",
    photo: "sticky left-10 z-20 bg-inherit",
    admNo: "sticky left-[88px] z-20 bg-inherit",
    fullName:
      "sticky left-[168px] z-20 bg-inherit shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]",
  };

  return (
    <div className="flex flex-col gap-4 h-full" data-ocid="students.page">
      {/* ── Toolbar ── */}
      <div
        className="bg-card rounded-xl border border-border p-3 flex flex-wrap items-center gap-2 shadow-sm"
        data-ocid="students.toolbar"
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-display font-semibold text-sm">Students</span>
          <Badge variant="secondary" className="text-xs ml-1">
            {filtered.length}
          </Badge>
          {filters.familyMobile && (
            <Badge className="text-xs ml-1 bg-accent/20 text-accent-foreground">
              Family: {filters.familyMobile}
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, familyMobile: "" }))}
                className="ml-1"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
        </div>

        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

        <Select
          value={filters.session}
          onValueChange={(v) => {
            setFilters((f) => ({ ...f, session: v }));
            setSession(v);
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[100px]"
            data-ocid="students.session.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "2019-20",
              "2020-21",
              "2021-22",
              "2022-23",
              "2023-24",
              "2024-25",
              "2025-26",
            ].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.classLevel || "all"}
          onValueChange={(v) => {
            setFilters((f) => ({
              ...f,
              classLevel: v === "all" ? "" : v,
              sectionId: "",
            }));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[110px]"
            data-ocid="students.class.select"
          >
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASS_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CLASS_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sectionId || "all"}
          onValueChange={(v) => {
            setFilters((f) => ({ ...f, sectionId: v === "all" ? "" : v }));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[90px]"
            data-ocid="students.section.select"
          >
            <SelectValue placeholder="All Sec" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sectionOptions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                Sec {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(v) => {
            setFilters((f) => ({ ...f, status: v === "all" ? "" : v }));
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs w-[110px]"
            data-ocid="students.status.select"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 text-xs pl-8"
            placeholder="Search name, mobile, village…"
            value={filters.search}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
              setPage(1);
            }}
            data-ocid="students.search_input"
          />
          {filters.search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              data-ocid="students.search_clear"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="relative min-w-[150px] max-w-[200px]">
          <Users2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            className="h-7 text-xs pl-7 pr-6"
            placeholder="Father / Mother Name"
            value={parentSearch}
            onChange={(e) => {
              setParentSearch(e.target.value);
              setPage(1);
            }}
            data-ocid="students.parent_search_input"
          />
          {parentSearch && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                setParentSearch("");
                setPage(1);
              }}
              data-ocid="students.parent_search_clear"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <ColumnToggle
            visibleCols={visibleCols}
            onToggle={toggleCol}
            onReset={() => {
              try {
                localStorage.removeItem("shubh_student_visible_cols");
              } catch {
                /* ignore */
              }
              setVisibleCols(new Set(DEFAULT_VISIBLE));
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
            data-ocid="students.import_button"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkPhotoOpen(true)}
            data-ocid="students.bulk_photo_button"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Bulk Photos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExport()}
            data-ocid="students.export_button"
          >
            <DownloadCloud className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="students.add_button"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add Student
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPromoteAllOpen(true)}
            data-ocid="students.promote_all_button"
          >
            <ArrowUpCircle className="h-3.5 w-3.5 mr-1.5" /> Promote All
          </Button>
          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteAllStep(1)}
              data-ocid="students.delete_all_button"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete All
            </Button>
          )}
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selectedIds.size > 0 && (
        <div
          className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 flex items-center gap-3"
          data-ocid="students.bulk_action_bar"
        >
          <span className="text-sm font-medium text-primary">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openExport(selectedIds)}
              data-ocid="students.bulk_export_button"
            >
              <DownloadCloud className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkAction("discontinue")}
              data-ocid="students.bulk_discontinue_button"
            >
              Discontinue
            </Button>
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkAction("delete")}
                data-ocid="students.bulk_delete_button"
              >
                Delete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              data-ocid="students.bulk_clear"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div
        className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col"
        data-ocid="students.table"
      >
        <div className="overflow-auto flex-1">
          <table
            className="w-full text-xs border-collapse"
            style={{
              minWidth:
                visibleCols.size <= DEFAULT_VISIBLE.length
                  ? undefined
                  : "2400px",
              tableLayout:
                visibleCols.size <= DEFAULT_VISIBLE.length ? "auto" : "auto",
            }}
          >
            <thead className="bg-muted/50 sticky top-0 z-30">
              <tr>
                {/* Checkbox */}
                <th
                  className={cn(
                    "w-10 px-3 py-2.5 text-left bg-muted/50",
                    STICKY.checkbox,
                  )}
                >
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleSelectAll}
                    data-ocid="students.select_all"
                  />
                </th>
                {/* Photo */}
                <th
                  className={cn(
                    "w-10 px-2 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50",
                    STICKY.photo,
                  )}
                >
                  Photo
                </th>
                {/* Adm No */}
                {visibleCols.has("admNo") && (
                  <th
                    className={cn(
                      "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground select-none whitespace-nowrap bg-muted/50",
                      STICKY.admNo,
                    )}
                    onClick={() => handleSort("admNo")}
                    onKeyDown={(e) => e.key === "Enter" && handleSort("admNo")}
                    data-ocid="students.sort.admNo"
                  >
                    Adm. No. {sortArrow("admNo")}
                  </th>
                )}
                {/* Full Name */}
                {visibleCols.has("fullName") && (
                  <th
                    className={cn(
                      "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground select-none whitespace-nowrap bg-muted/50",
                      STICKY.fullName,
                    )}
                    onClick={() => handleSort("fullName")}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSort("fullName")
                    }
                    data-ocid="students.sort.fullName"
                  >
                    Full Name {sortArrow("fullName")}
                  </th>
                )}
                {/* Dynamic columns */}
                {ALL_COLUMNS.filter(
                  (c) => !c.sticky && visibleCols.has(c.key),
                ).map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted/50"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={30}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="students.loading_state"
                  >
                    Loading students…
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={30}
                    className="py-16 text-center"
                    data-ocid="students.empty_state"
                  >
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-muted-foreground">
                      No students found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adjusting the filters or add a new student.
                    </p>
                    <Button
                      size="sm"
                      className="mt-4"
                      onClick={() => setAddOpen(true)}
                      data-ocid="students.empty_add_button"
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add Student
                    </Button>
                  </td>
                </tr>
              ) : (
                paginated.map((student, idx) => {
                  const sec = sections.find((s) => s.id === student.sectionId);
                  const route = routes.find(
                    (r) => r.id === student.transportRouteId,
                  );
                  const familyMob = getStudentFamilyMobile(student);
                  const isFamily = !!familyMob;
                  const isSelected = selectedIds.has(student.id);
                  const rowNum = (page - 1) * PAGE_SIZE + idx + 1;
                  const studentDiscountsCount = discounts.filter(
                    (d) => d.studentId === student.id,
                  ).length;
                  const rowBg = isSelected
                    ? "bg-primary/5"
                    : idx % 2 === 0
                      ? "bg-background"
                      : "bg-muted/20";

                  return (
                    <tr
                      key={student.id}
                      className={cn(
                        "border-t border-border transition-colors cursor-pointer hover:bg-primary/10",
                        rowBg,
                      )}
                      onClick={() => setDetailStudent(student)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setDetailStudent(student)
                      }
                      data-ocid={`students.item.${rowNum}`}
                    >
                      {/* Checkbox — sticky */}
                      <td
                        className={cn("px-3 py-2", STICKY.checkbox, rowBg)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            setSelectedIds((prev) => {
                              const n = new Set(prev);
                              if (n.has(student.id)) n.delete(student.id);
                              else n.add(student.id);
                              return n;
                            })
                          }
                          data-ocid={`students.checkbox.${rowNum}`}
                        />
                      </td>
                      {/* Photo — sticky */}
                      <td className={cn("px-2 py-2", STICKY.photo, rowBg)}>
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={student.photoUrl}
                            alt={student.fullName}
                          />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                            {getInitials(student.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      {/* Adm No — sticky */}
                      {visibleCols.has("admNo") && (
                        <td
                          className={cn(
                            "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap",
                            STICKY.admNo,
                            rowBg,
                          )}
                        >
                          {student.admNo}
                        </td>
                      )}
                      {/* Full Name — sticky */}
                      {visibleCols.has("fullName") && (
                        <td
                          className={cn(
                            "px-3 py-2 whitespace-nowrap",
                            STICKY.fullName,
                            rowBg,
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium truncate max-w-[140px]">
                              {student.fullName}
                            </span>
                            {isFamily && (
                              <button
                                type="button"
                                title="View Family"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFamilyMobile(familyMob);
                                }}
                                className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded hover:bg-blue-200 transition-colors"
                                data-ocid={`students.family_badge.${rowNum}`}
                              >
                                👨‍👩‍👧
                              </button>
                            )}
                            {studentDiscountsCount > 0 && (
                              <span
                                title="Has discounts"
                                className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded"
                              >
                                <Tag className="h-2.5 w-2.5 inline" />
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                      {/* Dynamic columns */}
                      {visibleCols.has("classLevel") && (
                        <td className="px-3 py-2 whitespace-nowrap font-medium">
                          {CLASS_LABELS[student.classLevel]}
                        </td>
                      )}
                      {visibleCols.has("section") && (
                        <td className="px-3 py-2 text-muted-foreground">
                          {sec?.name ?? "—"}
                        </td>
                      )}
                      {visibleCols.has("gender") && (
                        <td className="px-3 py-2 text-muted-foreground">
                          {student.gender}
                        </td>
                      )}
                      {visibleCols.has("dateOfBirth") && (
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap font-mono">
                          {formatDate(student.dateOfBirth) || "—"}
                        </td>
                      )}
                      {visibleCols.has("fatherName") && (
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate">
                          {student.fatherName}
                        </td>
                      )}
                      {visibleCols.has("fatherMobile") && (
                        <td className="px-3 py-2 whitespace-nowrap">
                          <a
                            href={`tel:${student.fatherMobile}`}
                            className="text-primary hover:underline font-mono"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {student.fatherMobile}
                          </a>
                        </td>
                      )}
                      {visibleCols.has("motherName") && (
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate">
                          {student.motherName || "—"}
                        </td>
                      )}
                      {visibleCols.has("motherMobile") && (
                        <td className="px-3 py-2 whitespace-nowrap">
                          {student.motherMobile ? (
                            <a
                              href={`tel:${student.motherMobile}`}
                              className="text-primary hover:underline font-mono"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {student.motherMobile}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      )}
                      {visibleCols.has("mobile") && (
                        <td className="px-3 py-2 whitespace-nowrap">
                          {student.mobile ? (
                            <a
                              href={`tel:${student.mobile}`}
                              className="text-primary hover:underline font-mono"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {student.mobile}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      )}
                      {visibleCols.has("permanentAddress") && (
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                          {student.permanentAddress || "—"}
                        </td>
                      )}
                      {visibleCols.has("category") && (
                        <td className="px-3 py-2">
                          {student.category ? (
                            <Badge variant="outline" className="text-[10px]">
                              {student.category}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      )}
                      {visibleCols.has("currentAddress") && (
                        <td className="px-3 py-2 text-muted-foreground max-w-[160px] truncate">
                          {student.currentAddress || "—"}
                        </td>
                      )}
                      {visibleCols.has("aadhaarNo") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {student.aadhaarNo || "—"}
                        </td>
                      )}
                      {visibleCols.has("srNo") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {student.srNo || "—"}
                        </td>
                      )}
                      {visibleCols.has("penNo") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {student.penNo || "—"}
                        </td>
                      )}
                      {visibleCols.has("apaarNo") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {student.apaarNo || "—"}
                        </td>
                      )}
                      {visibleCols.has("prevSchool") && (
                        <td className="px-3 py-2 text-muted-foreground max-w-[140px] truncate">
                          {student.prevSchool || "—"}
                        </td>
                      )}
                      {visibleCols.has("admissionDate") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {formatDate(student.admissionDate) || "—"}
                        </td>
                      )}
                      {visibleCols.has("transportRouteId") && (
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate">
                          {route?.name ??
                            (student.transportRouteId
                              ? student.transportRouteId
                              : "—")}
                        </td>
                      )}
                      {visibleCols.has("busNo") && (
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                          {student.busNo || "—"}
                        </td>
                      )}
                      {visibleCols.has("status") && (
                        <td className="px-3 py-2 whitespace-nowrap">
                          <StatusBadge student={student} />
                        </td>
                      )}
                      {/* Actions */}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {isFamily && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-600"
                              onClick={() => setFamilyMobile(familyMob)}
                              data-ocid={`students.view_family_button.${rowNum}`}
                              title="View Family"
                            >
                              <Users2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-amber-600"
                            onClick={() => setDiscountStudent(student)}
                            data-ocid={`students.discount_button.${rowNum}`}
                            title="Manage Discounts"
                          >
                            <IndianRupee className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setDetailStudent(student)}
                            data-ocid={`students.view_button.${rowNum}`}
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600"
                            onClick={() =>
                              setPrintStudent({ student, type: "IDCard" })
                            }
                            data-ocid={`students.id_card_button.${rowNum}`}
                            title="Print ID Card"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditStudentTarget(student)}
                            data-ocid={`students.edit_button.${rowNum}`}
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirmStudent(student)}
                              data-ocid={`students.delete_button.${rowNum}`}
                              title="Delete Student (Admin)"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20 shrink-0">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                data-ocid="students.pagination_prev"
              >
                ← Prev
              </Button>
              {Array.from(
                { length: Math.min(totalPages, 7) },
                (_, i) => i + 1,
              ).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 text-xs p-0"
                  onClick={() => setPage(p)}
                  data-ocid={`students.page.${p}`}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-ocid="students.pagination_next"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <AddStudentDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        sections={sections}
        currentSession={currentSession}
      />
      <BulkImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        sections={sections}
      />
      <BulkPhotoUploadDialog
        open={bulkPhotoOpen}
        onClose={async () => {
          setBulkPhotoOpen(false);
          // Safety net: always refetch after dialog closes to ensure list is visible
          await queryClient.invalidateQueries({ queryKey: ["students"] });
        }}
        students={students}
      />
      <ExportColumnsDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        visibleCols={visibleCols}
        onExport={doExport}
      />
      {detailStudent && (
        <StudentProfileModal
          student={detailStudent}
          sections={sections}
          onClose={() => setDetailStudent(null)}
          onEdit={(s) => {
            setDetailStudent(null);
            setEditStudentTarget(s);
          }}
        />
      )}
      {editStudentTarget && (
        <EditStudentDialog
          student={editStudentTarget}
          open
          onClose={() => setEditStudentTarget(null)}
          sections={sections}
        />
      )}
      {discountStudent && (
        <DiscountDialog
          student={discountStudent}
          open
          onClose={() => setDiscountStudent(null)}
        />
      )}
      <PromoteAllClassesDialog
        open={promoteAllOpen}
        onClose={() => setPromoteAllOpen(false)}
        sessions={[
          "2019-20",
          "2020-21",
          "2021-22",
          "2022-23",
          "2023-24",
          "2024-25",
          "2025-26",
          "2026-27",
        ]}
      />
      {familyMobile && (
        <FamilyModal
          mobile={familyMobile}
          allStudents={students}
          sections={sections}
          onClose={() => setFamilyMobile(null)}
        />
      )}

      {/* Bulk Confirm */}
      <Dialog
        open={bulkAction !== null}
        onOpenChange={(open) => {
          if (!open) setBulkAction(null);
        }}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="students.bulk_confirm.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {bulkAction === "delete"
                ? "Delete Students?"
                : "Discontinue Students?"}
            </DialogTitle>
            <DialogDescription>
              {bulkAction === "delete"
                ? `Permanently delete ${selectedIds.size} student(s). Cannot be undone.`
                : `Mark ${selectedIds.size} student(s) as discontinued. They will be blocked from fees and attendance.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkAction(null)}
              data-ocid="students.bulk_confirm.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                const ids = Array.from(selectedIds);
                if (bulkAction === "discontinue") {
                  for (const id of ids) {
                    await discontinueStudent.mutateAsync(id).catch(() => {});
                  }
                  toast.success(`${ids.length} student(s) discontinued.`);
                } else if (bulkAction === "delete" && isAdmin) {
                  for (const id of ids) {
                    await deleteStudent.mutateAsync(id).catch(() => {});
                  }
                  toast.success(`${ids.length} student(s) deleted.`);
                }
                setSelectedIds(new Set());
                setBulkAction(null);
              }}
              data-ocid="students.bulk_confirm.confirm_button"
            >
              {bulkAction === "delete" ? "Delete" : "Discontinue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin-only Delete ALL — Two-step confirm */}
      {isAdmin && (
        <>
          {/* Step 1 — First warning */}
          <Dialog
            open={deleteAllStep === 1}
            onOpenChange={(open) => {
              if (!open) {
                setDeleteAllStep(0);
              }
            }}
          >
            <DialogContent
              className="max-w-sm"
              data-ocid="students.delete_all.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display text-destructive">
                  Delete ALL Students?
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete all student records? This
                  cannot be undone. All {students.length} students and their fee
                  payment records will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteAllStep(0)}
                  data-ocid="students.delete_all.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteAllStep(2);
                    setDeleteAllConfirmText("");
                  }}
                  data-ocid="students.delete_all.next_button"
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Step 2 — Final warning with typed confirmation */}
          <Dialog
            open={deleteAllStep === 2}
            onOpenChange={(open) => {
              if (!open) {
                setDeleteAllStep(0);
                setDeleteAllConfirmText("");
              }
            }}
          >
            <DialogContent
              className="max-w-sm"
              data-ocid="students.delete_all_final.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display text-destructive">
                  ⚠️ FINAL WARNING
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete all {students.length} students
                  and their related records. Type <strong>DELETE</strong> to
                  confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <Input
                  placeholder="Type DELETE to confirm"
                  value={deleteAllConfirmText}
                  onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                  data-ocid="students.delete_all_final.input"
                  className="font-mono"
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteAllStep(0);
                    setDeleteAllConfirmText("");
                  }}
                  data-ocid="students.delete_all_final.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={
                    deleteAllConfirmText !== "DELETE" ||
                    deleteAllStudents.isPending
                  }
                  onClick={async () => {
                    try {
                      await deleteAllStudents.mutateAsync();
                      toast.success("All student records have been deleted.");
                      setDeleteAllStep(0);
                      setDeleteAllConfirmText("");
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Delete all failed.",
                      );
                    }
                  }}
                  data-ocid="students.delete_all_final.confirm_button"
                >
                  {deleteAllStudents.isPending
                    ? "Deleting…"
                    : "Delete All Students"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Admin-only Single Delete Confirm */}
      {isAdmin && (
        <Dialog
          open={deleteConfirmStudent !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteConfirmStudent(null);
          }}
        >
          <DialogContent
            className="max-w-sm"
            data-ocid="students.delete.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Delete Student?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold">
                  {deleteConfirmStudent?.fullName}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmStudent(null)}
                data-ocid="students.delete.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteStudent.isPending}
                onClick={async () => {
                  if (!deleteConfirmStudent) return;
                  try {
                    await deleteStudent.mutateAsync(deleteConfirmStudent.id);
                    toast.success(
                      `"${deleteConfirmStudent.fullName}" deleted successfully.`,
                    );
                    setDeleteConfirmStudent(null);
                  } catch (err) {
                    toast.error(
                      err instanceof Error ? err.message : "Delete failed.",
                    );
                  }
                }}
                data-ocid="students.delete.confirm_button"
              >
                {deleteStudent.isPending ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Certificate Print Modal */}
      {printStudent &&
        (() => {
          const tmpl =
            allTemplates.find(
              (t) => t.templateType === printStudent.type && t.isDefault,
            ) ??
            allTemplates.find((t) => t.templateType === printStudent.type) ??
            null;
          return (
            <GeneratePrintModal
              template={tmpl}
              forcedType={printStudent.type}
              preStudent={printStudent.student}
              onClose={() => setPrintStudent(null)}
            />
          );
        })()}
    </div>
  );
}
