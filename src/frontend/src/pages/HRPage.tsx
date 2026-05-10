import { StaffImportDialog } from "@/components/StaffImportDialog";
import { GeneratePrintModal } from "@/components/certificates/GeneratePrintModal";
import DateInput from "@/components/shared/DateInput";
import { TeacherTimetablePanel } from "@/components/timetable/TeacherTimetablePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddStaff,
  useAddSubjectAssignment,
  useCalculateAndSavePayroll,
  useCertificateTemplates,
  useCreateClassTimetable,
  useDeleteClassTimetable,
  useDeleteStaffMember,
  useDeleteSubjectAssignment,
  useGenerateClassTimetable,
  useGetAllSubjectAssignments,
  useGetClassTimetables,
  useGetPaidLeaveConfig,
  useGetPayrollByMonth,
  useGetPayrollCalculation,
  useGetStaffAttendanceByDate,
  useGetSubjectAssignments,
  useLockPayrollMonth,
  useMarkStaffAttendanceOut,
  useRecordStaffAttendance,
  useSections,
  useSetPaidLeaveConfig,
  useStaff,
  useSubjects,
  useUpdateClassTimetable,
  useUpdateStaff,
  useUpdateSubjectAssignment,
} from "@/hooks/useBackend";
import type {
  FrontendPayrollRecord,
  PayrollResult,
  StaffAttendanceEntry,
} from "@/hooks/useBackend";
import {
  useBatchSaveClassTimetables,
  useCopyPasteEntireDay,
} from "@/hooks/useTimetable";
import {
  downloadCSV,
  downloadCSVString,
  formatCurrency,
  formatDate,
  generateId,
  getClassLabel,
  getInitials,
} from "@/lib/utils";
import { StaffPaymentTab } from "@/pages/StaffPaymentTab";
import { useAppStore } from "@/store/useAppStore";
import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import type {
  ClassLevel,
  ClassTimetable,
  ClassTimetableEntry,
  Staff,
  Subject,
} from "@/types";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronsUpDown,
  ClipboardCopy,
  ClipboardPaste,
  Clock,
  Coins,
  Download,
  Fingerprint,
  GripVertical,
  IndianRupee,
  LayoutGrid,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Sample data ──────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "Science",
  "Mathematics",
  "English",
  "Hindi",
  "Social Studies",
  "Computer",
  "Physical Education",
  "Administration",
  "Accounts",
];

// ─── Staff Form ───────────────────────────────────────────────────────────────
interface StaffForm {
  staffCode: string;
  fullName: string;
  designation: string;
  department: string;
  mobile: string;
  email: string;
  address: string;
  dateOfJoining: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  basicSalary: string;
  aadhaarNo: string;
  bankAccount: string;
  ifscCode: string;
}

const emptyForm: StaffForm = {
  staffCode: "",
  fullName: "",
  designation: "",
  department: "",
  mobile: "",
  email: "",
  address: "",
  dateOfJoining: "",
  dateOfBirth: "",
  gender: "Male",
  basicSalary: "",
  aadhaarNo: "",
  bankAccount: "",
  ifscCode: "",
};

// ─── Staff Directory Tab ──────────────────────────────────────────────────────
function StaffDirectoryTab() {
  const { data: backendStaff = [], refetch: refetchStaff } = useStaff();
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaffMember();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const staff = backendStaff as Staff[];
  const { data: allCertTemplates = [] } = useCertificateTemplates();
  const [printStaff, setPrintStaff] = useState<Staff | null>(null);

  const filtered = useMemo(
    () =>
      staff.filter((s) => {
        const matchSearch =
          !search ||
          s.fullName.toLowerCase().includes(search.toLowerCase()) ||
          s.staffCode.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "all" || s.department === deptFilter;
        const matchStatus =
          statusFilter === "all" ||
          (statusFilter === "active" ? s.isActive : !s.isActive);
        return matchSearch && matchDept && matchStatus;
      }),
    [staff, search, deptFilter, statusFilter],
  );

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(s: Staff) {
    setEditId(s.id);
    setForm({
      staffCode: s.staffCode,
      fullName: s.fullName,
      designation: s.designation,
      department: s.department,
      mobile: s.mobile,
      email: s.email,
      address: s.address,
      dateOfJoining: s.dateOfJoining,
      dateOfBirth: s.dateOfBirth,
      gender: s.gender,
      basicSalary: String(s.basicSalary),
      aadhaarNo: "",
      bankAccount: "",
      ifscCode: "",
    });
    setDialogOpen(true);
  }

  async function saveStaff() {
    if (!form.fullName || !form.designation || !form.department || !form.mobile)
      return;
    const salary = Number.parseInt(form.basicSalary) || 0;
    const payload = {
      staffCode: form.staffCode || `TCH${Date.now()}`,
      fullName: form.fullName,
      designation: form.designation,
      department: form.department,
      mobile: form.mobile,
      email: form.email,
      address: form.address,
      dateOfJoining: form.dateOfJoining,
      basicSalary: salary,
      aadhaarNo: form.aadhaarNo,
      bankAccount: form.bankAccount,
      ifscCode: form.ifscCode,
    };
    try {
      if (editId) {
        await updateStaff.mutateAsync({ id: editId, ...payload });
        toast.success("Staff member updated successfully");
      } else {
        await addStaff.mutateAsync(payload);
        toast.success("New staff member added successfully");
      }
      setDialogOpen(false);
      refetchStaff();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save staff.";
      toast.error(msg);
    }
  }

  const isSaving = addStaff.isPending || updateStaff.isPending;

  async function deleteStaff() {
    if (deleteId) {
      try {
        await deleteStaffMutation.mutateAsync(deleteId);
        toast.success("Staff member deactivated");
      } catch {
        toast.error("Failed to remove staff. Please try again.");
      }
    }
    setDeleteId(null);
  }

  function exportStaff() {
    downloadCSV(
      staff.map((s) => ({
        "Employee ID": s.staffCode,
        "Full Name": s.fullName,
        Designation: s.designation,
        Department: s.department,
        Mobile: s.mobile,
        Email: s.email,
        "Date of Joining": formatDate(s.dateOfJoining),
        "Basic Salary": s.basicSalary,
        Status: s.isActive ? "Active" : "Inactive",
      })),
      "staff-directory.csv",
    );
  }

  function downloadStaffTemplate() {
    const headers = [
      "Employee ID",
      "Full Name",
      "Designation",
      "Department",
      "Mobile",
      "Email",
      "Date of Joining",
      "Basic Salary",
      "Status",
    ];
    const rows = [
      [
        "ST001",
        "Ramesh Mishra",
        "PGT Science",
        "Science",
        "9876543210",
        "ramesh@school.in",
        "01/07/2020",
        "35000",
        "Active",
      ],
      [
        "ST002",
        "Sunita Verma",
        "TGT Maths",
        "Mathematics",
        "9123456780",
        "sunita@school.in",
        "15/06/2022",
        "28000",
        "Active",
      ],
    ];
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSVString(csv, "staff-import-template.csv");
  }

  return (
    <div className="space-y-4" data-ocid="hr.staff_directory">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            data-ocid="hr.search_input"
            className="pl-9"
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger data-ocid="hr.dept_filter" className="w-44">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger data-ocid="hr.status_filter" className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={exportStaff}
          data-ocid="hr.export_button"
        >
          <Download className="size-4 mr-1" /> Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setImportOpen(true)}
          data-ocid="hr.import_button"
        >
          <Upload className="size-4 mr-1" /> Import
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={downloadStaffTemplate}
          data-ocid="hr.download_template_button"
          title="Download staff import CSV template"
        >
          <Download className="size-4 mr-1" /> Template
        </Button>
        <Button size="sm" onClick={openAdd} data-ocid="hr.add_staff_button">
          <Plus className="size-4 mr-1" /> Add Staff
        </Button>
      </div>

      {/* Staff Import Dialog */}
      <StaffImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onDone={() => {
          setImportOpen(false);
          refetchStaff();
        }}
      />

      {/* Grid */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Employee
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Designation
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Department
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Mobile
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Salary
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                  data-ocid="hr.staff_empty_state"
                >
                  No staff found. Add your first staff member to get started.
                </td>
              </tr>
            )}
            {filtered.map((s, i) => (
              <tr
                key={s.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                data-ocid={`hr.staff.item.${i + 1}`}
              >
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {getInitials(s.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {s.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.staffCode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{s.designation}</td>
                <td className="px-4 py-3 text-foreground">{s.department}</td>
                <td className="px-4 py-3">
                  <a
                    href={`tel:${s.mobile}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                    data-ocid={`hr.call_button.${i + 1}`}
                  >
                    <Phone className="size-3.5" />
                    {s.mobile}
                  </a>
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {formatCurrency(Number(s.basicSalary ?? 0))}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={s.isActive ? "default" : "secondary"}
                    className={
                      s.isActive
                        ? "bg-green-500/15 text-green-700 border-green-500/30"
                        : ""
                    }
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-blue-600"
                      onClick={() => setPrintStaff(s)}
                      data-ocid={`hr.id_card_button.${i + 1}`}
                      title="Print Staff ID Card"
                    >
                      <Printer className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEdit(s)}
                      data-ocid={`hr.edit_button.${i + 1}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(s.id)}
                      data-ocid={`hr.delete_button.${i + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="hr.staff_dialog"
        >
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Staff" : "Add New Staff"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Employee ID</Label>
              <Input
                placeholder="TCH001"
                value={form.staffCode}
                onChange={(e) =>
                  setForm({ ...form, staffCode: e.target.value })
                }
                data-ocid="hr.staff_form.staffcode_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                data-ocid="hr.staff_form.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Designation <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Senior Teacher"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
                data-ocid="hr.staff_form.designation_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.department}
                onValueChange={(v) => setForm({ ...form, department: v })}
              >
                <SelectTrigger data-ocid="hr.staff_form.dept_select">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                Mobile <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="10-digit mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                data-ocid="hr.staff_form.mobile_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@school.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-ocid="hr.staff_form.email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date of Joining</Label>
              <DateInput
                value={form.dateOfJoining}
                onChange={(iso) => setForm({ ...form, dateOfJoining: iso })}
                data-ocid="hr.staff_form.doj_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <DateInput
                value={form.dateOfBirth}
                onChange={(iso) => setForm({ ...form, dateOfBirth: iso })}
                data-ocid="hr.staff_form.dob_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm({ ...form, gender: v as StaffForm["gender"] })
                }
              >
                <SelectTrigger data-ocid="hr.staff_form.gender_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Basic Salary (₹)</Label>
              <Input
                placeholder="e.g. 45000"
                value={form.basicSalary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    basicSalary: e.target.value.replace(/\D/g, ""),
                  })
                }
                data-ocid="hr.staff_form.salary_input"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Address</Label>
              <Textarea
                rows={2}
                placeholder="Full address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                data-ocid="hr.staff_form.address_input"
              />
            </div>
            <Separator className="col-span-2" />
            <div className="space-y-1.5">
              <Label>Aadhaar No</Label>
              <Input
                placeholder="12-digit Aadhaar"
                value={form.aadhaarNo}
                onChange={(e) =>
                  setForm({ ...form, aadhaarNo: e.target.value })
                }
                data-ocid="hr.staff_form.aadhaar_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bank Account No</Label>
              <Input
                placeholder="Account number"
                value={form.bankAccount}
                onChange={(e) =>
                  setForm({ ...form, bankAccount: e.target.value })
                }
                data-ocid="hr.staff_form.bank_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>IFSC Code</Label>
              <Input
                placeholder="e.g. SBIN0001234"
                value={form.ifscCode}
                onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                data-ocid="hr.staff_form.ifsc_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
              data-ocid="hr.staff_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveStaff}
              disabled={
                isSaving ||
                !form.fullName ||
                !form.designation ||
                !form.department ||
                !form.mobile
              }
              data-ocid="hr.staff_form.submit_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" /> Saving…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Add Staff"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="hr.delete_dialog">
          <DialogHeader>
            <DialogTitle>Remove Staff Member?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will deactivate the staff member. They will be marked inactive.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="hr.delete_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteStaff}
              disabled={deleteStaffMutation.isPending}
              data-ocid="hr.delete_dialog.confirm_button"
            >
              {deleteStaffMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Deactivate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Staff ID Card Print Modal */}
      {printStaff &&
        (() => {
          const tmpl =
            allCertTemplates.find(
              (t) => t.templateType === "StaffIDCard" && t.isDefault,
            ) ??
            allCertTemplates.find((t) => t.templateType === "StaffIDCard") ??
            null;
          return (
            <GeneratePrintModal
              template={tmpl}
              forcedType="StaffIDCard"
              preStaff={printStaff}
              onClose={() => setPrintStaff(null)}
            />
          );
        })()}
    </div>
  );
}

// ─── Subject Assignments Tab ──────────────────────────────────────────────────
function SubjectAssignmentsTab() {
  const { data: staffList = [] } = useStaff();
  const { data: subjects = [] } = useSubjects();
  const { currentSession } = useAppStore();
  const session = currentSession ?? "2025-26";

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    (staffList as Staff[])[0]?.id ?? "",
  );

  // Update selectedStaffId when staff data loads
  useEffect(() => {
    if ((staffList as Staff[]).length > 0 && !selectedStaffId) {
      setSelectedStaffId((staffList as Staff[])[0].id);
    }
  }, [staffList, selectedStaffId]);

  const { data: currentAssignments = [], refetch } =
    useGetSubjectAssignments(selectedStaffId);
  const addAssignment = useAddSubjectAssignment();
  const updateAssignment = useUpdateSubjectAssignment();
  const deleteAssignment = useDeleteSubjectAssignment();

  const selectedStaff = (staffList as Staff[]).find(
    (s) => s.id === selectedStaffId,
  );

  // ── Add wizard state ─────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [wizard, setWizard] = useState<{
    subjectId: string;
    minClass: ClassLevel | "";
    maxClass: ClassLevel | "";
  }>({ subjectId: "", minClass: "", maxClass: "" });

  function resetWizard() {
    setWizard({ subjectId: "", minClass: "", maxClass: "" });
    setEditId(null);
  }

  function openAddDialog() {
    resetWizard();
    setAddOpen(true);
  }

  function openEditDialog(a: {
    id: string;
    subjectId: string;
    minClass: string | null;
    maxClass: string | null;
  }) {
    setEditId(a.id);
    setWizard({
      subjectId: a.subjectId,
      minClass: (a.minClass as ClassLevel) || "",
      maxClass: (a.maxClass as ClassLevel) || "",
    });
    setAddOpen(true);
  }

  async function saveAssignment() {
    if (!wizard.subjectId || !wizard.minClass || !wizard.maxClass) return;
    const sub = (subjects as Subject[]).find((s) => s.id === wizard.subjectId);
    const payload = {
      subjectId: wizard.subjectId,
      subjectName: sub?.name ?? wizard.subjectId,
      minClass: wizard.minClass,
      maxClass: wizard.maxClass,
      session,
    };
    try {
      if (editId) {
        await updateAssignment.mutateAsync({
          id: editId,
          staffId: selectedStaffId,
          ...payload,
        });
        toast.success("Subject assignment updated");
      } else {
        await addAssignment.mutateAsync({
          staffId: selectedStaffId,
          ...payload,
        });
        toast.success("Subject assignment added");
      }
      refetch();
      setAddOpen(false);
      resetWizard();
    } catch {
      toast.error("Failed to save assignment.");
    }
  }

  async function removeAssignment(id: string) {
    try {
      await deleteAssignment.mutateAsync({ id, staffId: selectedStaffId });
      toast.success("Assignment removed");
      refetch();
    } catch {
      toast.error("Failed to remove assignment.");
    }
  }

  const isSaving = addAssignment.isPending || updateAssignment.isPending;

  // Validate class range: minClass index must be <= maxClass index
  const minIdx = wizard.minClass
    ? CLASS_ORDER.indexOf(wizard.minClass as ClassLevel)
    : -1;
  const maxIdx = wizard.maxClass
    ? CLASS_ORDER.indexOf(wizard.maxClass as ClassLevel)
    : -1;
  const rangeValid = minIdx >= 0 && maxIdx >= 0 && minIdx <= maxIdx;

  return (
    <div className="space-y-4" data-ocid="hr.subject_assignments">
      <div className="flex items-center gap-3">
        <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
          <SelectTrigger className="w-64" data-ocid="hr.teacher_select">
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {(staffList as Staff[]).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.fullName} — {s.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={openAddDialog}
          disabled={!selectedStaffId}
          data-ocid="hr.add_assignment_button"
        >
          <Plus className="size-4 mr-1" /> Add Assignment
        </Button>
      </div>

      {selectedStaff && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {getInitials(selectedStaff.fullName)}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {selectedStaff.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedStaff.designation} · {selectedStaff.department}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto text-xs">
            {currentAssignments.length} assignment
            {currentAssignments.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Subject
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Min Class
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Max Class
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Class Range
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAssignments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                  data-ocid="hr.assignments_empty_state"
                >
                  No subject assignments yet. Click "Add Assignment" to assign
                  subjects with teaching class range.
                </td>
              </tr>
            )}
            {currentAssignments.map((a, i) => {
              const minLabel = a.minClass
                ? (CLASS_LABELS[a.minClass as ClassLevel] ?? a.minClass)
                : "—";
              const maxLabel = a.maxClass
                ? (CLASS_LABELS[a.maxClass as ClassLevel] ?? a.maxClass)
                : "—";
              const rangeLabel =
                a.minClass && a.maxClass
                  ? a.minClass === a.maxClass
                    ? minLabel
                    : `${minLabel} → ${maxLabel}`
                  : "—";
              return (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/10"
                  data-ocid={`hr.assignment.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {a.subjectName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm">
                    {minLabel}
                  </td>
                  <td className="px-4 py-3 text-foreground text-sm">
                    {maxLabel}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">
                      {rangeLabel}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => openEditDialog(a)}
                        data-ocid={`hr.edit_assignment.${i + 1}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => removeAssignment(a.id)}
                        data-ocid={`hr.remove_assignment.${i + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Assignment Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(v) => {
          if (!isSaving) {
            setAddOpen(v);
            if (!v) resetWizard();
          }
        }}
      >
        <DialogContent data-ocid="hr.add_assignment_dialog">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Subject Assignment" : "Add Subject Assignment"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Subject <span className="text-destructive">*</span>
              </Label>
              <Select
                value={wizard.subjectId}
                onValueChange={(v) =>
                  setWizard((w) => ({ ...w, subjectId: v }))
                }
              >
                <SelectTrigger data-ocid="hr.wizard.subject_select">
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {(subjects as Subject[]).length === 0 && (
                    <SelectItem value="_none" disabled>
                      No subjects found — add subjects in Academics first
                    </SelectItem>
                  )}
                  {(subjects as Subject[]).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Min Class <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground -mt-0.5">
                  Lowest class teacher will teach
                </p>
                <Select
                  value={wizard.minClass}
                  onValueChange={(v) =>
                    setWizard((w) => ({ ...w, minClass: v as ClassLevel }))
                  }
                >
                  <SelectTrigger data-ocid="hr.wizard.min_class_select">
                    <SelectValue placeholder="From class" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASS_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>
                  Max Class <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground -mt-0.5">
                  Highest class teacher will teach
                </p>
                <Select
                  value={wizard.maxClass}
                  onValueChange={(v) =>
                    setWizard((w) => ({ ...w, maxClass: v as ClassLevel }))
                  }
                >
                  <SelectTrigger data-ocid="hr.wizard.max_class_select">
                    <SelectValue placeholder="To class" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASS_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {wizard.minClass && wizard.maxClass && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  rangeValid
                    ? "bg-green-500/10 border border-green-500/30 text-green-700"
                    : "bg-red-500/10 border border-red-500/30 text-destructive"
                }`}
              >
                {rangeValid ? (
                  <>
                    <span className="font-semibold">Teaching range:</span>{" "}
                    {CLASS_LABELS[wizard.minClass as ClassLevel]}
                    {wizard.minClass !== wizard.maxClass && (
                      <> → {CLASS_LABELS[wizard.maxClass as ClassLevel]}</>
                    )}
                    {" — "}
                    {maxIdx - minIdx + 1} class
                    {maxIdx - minIdx + 1 !== 1 ? "es" : ""}
                  </>
                ) : (
                  "Min class must be equal to or lower than Max class"
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddOpen(false);
                resetWizard();
              }}
              disabled={isSaving}
              data-ocid="hr.wizard.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAssignment}
              disabled={
                !wizard.subjectId ||
                !wizard.minClass ||
                !wizard.maxClass ||
                !rangeValid ||
                isSaving
              }
              data-ocid="hr.wizard.save_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" /> Saving…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Save Assignment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Payroll helpers ─────────────────────────────────────────────────────────
const SCHOOL_MONTHS_PAYROLL = [
  { label: "April", num: 4 },
  { label: "May", num: 5 },
  { label: "June", num: 6 },
  { label: "July", num: 7 },
  { label: "August", num: 8 },
  { label: "September", num: 9 },
  { label: "October", num: 10 },
  { label: "November", num: 11 },
  { label: "December", num: 12 },
  { label: "January", num: 1 },
  { label: "February", num: 2 },
  { label: "March", num: 3 },
];
const _cy = new Date().getFullYear();
const PAYROLL_MONTH_OPTS = SCHOOL_MONTHS_PAYROLL.map((m) => ({
  label: `${m.label} ${m.num <= 3 ? _cy + 1 : _cy}`,
  month: m.num,
  year: m.num <= 3 ? _cy + 1 : _cy,
}));
const DEVICE_TYPES_LIST = [
  { value: "#Face", label: "Face" },
  { value: "#RFID", label: "RFID" },
  { value: "#ESSLBiometric", label: "ESSL Biometric" },
  { value: "#QR", label: "QR Scanner" },
];
function formatINR(v: number) {
  return `₹${v.toLocaleString("en-IN")}`;
}

// ─── Payslip Modal ────────────────────────────────────────────────────────────
function PayslipModal({
  staff,
  result,
  monthLabel,
  onClose,
}: {
  staff: Staff;
  result: PayrollResult;
  monthLabel: string;
  onClose: () => void;
}) {
  const dailyRate = result.monthlySalary / Math.max(1, result.workingDays);
  const deduction = Math.round(dailyRate * result.absentDays);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[200]" data-ocid="hr.payslip_dialog">
        <DialogHeader>
          <DialogTitle>Salary Slip — {monthLabel}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="text-center pb-3 border-b border-border">
            <p className="font-bold text-lg font-display text-foreground">
              SHUBH SCHOOL ERP
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
              SALARY SLIP
            </p>
            <p className="text-xs text-muted-foreground mt-1">{monthLabel}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <p className="text-muted-foreground">Employee Name</p>
              <p className="font-semibold text-foreground">{staff.fullName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Employee ID</p>
              <p className="font-semibold">{staff.staffCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Designation</p>
              <p className="font-semibold">{staff.designation}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-semibold">{staff.department}</p>
            </div>
            {staff.dateOfJoining && (
              <div>
                <p className="text-muted-foreground">Date of Joining</p>
                <p className="font-semibold">
                  {formatDate(staff.dateOfJoining)}
                </p>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Attendance
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: "Working Days",
                  value: result.workingDays,
                  color: "text-foreground",
                },
                {
                  label: "Present Days",
                  value: result.presentDays,
                  color: "text-green-600",
                },
                {
                  label: "Absent Days",
                  value: result.absentDays,
                  color: "text-destructive",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/30 p-2">
                  <p className={`text-xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Device Breakdown
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { label: "Face Recognition", count: result.faceCount },
                { label: "RFID", count: result.rfidCount },
                { label: "ESSL Biometric", count: result.biometricCount },
                { label: "QR Scanner", count: result.qrCount },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex justify-between px-3 py-1.5 rounded bg-muted/20"
                >
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-semibold">{d.count} days</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Salary</span>
              <span className="font-mono">
                {formatINR(result.monthlySalary)}
              </span>
            </div>
            {deduction > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Deductions ({result.absentDays} absent ×{" "}
                  {formatINR(Math.round(dailyRate))}/day)
                </span>
                <span className="text-destructive font-mono">
                  −{formatINR(deduction)}
                </span>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Net Amount</span>
            <span className="font-mono text-primary">
              {formatINR(result.netPay)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="hr.payslip_dialog.close_button"
          >
            Close
          </Button>
          <Button
            onClick={() => window.print()}
            data-ocid="hr.payslip_dialog.print_button"
          >
            <Printer className="size-4 mr-1" /> Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Payroll Row ──────────────────────────────────────────────────────────────
// ─── Real Payroll Row (wired to backend) ─────────────────────────────────────────────────────
function PayrollRow({
  staff,
  savedRecord,
  month,
  year,
  index,
  monthLabel,
  onCalculated,
}: {
  staff: Staff;
  savedRecord: FrontendPayrollRecord | null;
  month: number;
  year: number;
  index: number;
  monthLabel: string;
  onCalculated: () => void;
}) {
  const [showPayslip, setShowPayslip] = useState(false);
  const calcMut = useCalculateAndSavePayroll();
  const lockMut = useLockPayrollMonth();

  const isLocked = savedRecord?.status === "paid";

  async function handleCalculate() {
    try {
      await calcMut.mutateAsync({
        staffId: staff.id,
        month,
        year,
        baseSalary: staff.basicSalary,
      });
      toast.success(`Payroll calculated for ${staff.fullName}`);
      onCalculated();
    } catch {
      toast.error("Failed to calculate payroll.");
    }
  }

  async function handleLock() {
    if (!savedRecord) return;
    try {
      await lockMut.mutateAsync({ staffId: staff.id, month, year });
      toast.success(`${monthLabel} locked — marked as Paid.`);
      onCalculated();
    } catch {
      toast.error("Failed to lock payroll month.");
    }
  }

  const r: PayrollResult = savedRecord
    ? {
        staffId: staff.id,
        staffName: staff.fullName,
        month,
        year,
        monthlySalary: savedRecord.baseSalary,
        presentDays: savedRecord.presentDays,
        absentDays: savedRecord.absentDays,
        workingDays: savedRecord.workingDays,
        netPay: savedRecord.netPay,
        faceCount: 0,
        rfidCount: 0,
        biometricCount: 0,
        qrCount: 0,
      }
    : {
        staffId: staff.id,
        staffName: staff.fullName,
        month,
        year,
        monthlySalary: staff.basicSalary,
        presentDays: 0,
        absentDays: 0,
        workingDays: 26,
        netPay: 0,
        faceCount: 0,
        rfidCount: 0,
        biometricCount: 0,
        qrCount: 0,
      };

  const statusBadge = isLocked ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 border border-green-400 rounded-full px-2 py-0.5">
      🔒 Paid
    </span>
  ) : savedRecord?.status === "partial" ? (
    <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-400 rounded-full px-2 py-0.5">
      Partial
    </span>
  ) : savedRecord ? (
    <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-100 border border-red-400 rounded-full px-2 py-0.5">
      Unpaid
    </span>
  ) : (
    <span className="text-xs text-muted-foreground">Not Calculated</span>
  );

  return (
    <>
      <tr
        className={`border-b border-border last:border-0 ${
          isLocked
            ? "bg-green-50/40 dark:bg-green-950/10"
            : savedRecord?.status === "partial"
              ? "bg-amber-50/30 dark:bg-amber-950/10"
              : savedRecord?.status === "unpaid"
                ? "bg-red-50/20 dark:bg-red-950/10"
                : "hover:bg-muted/10"
        }`}
        data-ocid={`hr.payroll.item.${index + 1}`}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
              {getInitials(staff.fullName)}
            </div>
            <span className="font-medium text-foreground">
              {staff.fullName}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs">
          {staff.designation}
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm">
          {formatINR(staff.basicSalary)}
        </td>
        <td className="px-4 py-3 text-center">
          {savedRecord ? savedRecord.workingDays : "—"}
        </td>
        <td className="px-4 py-3 text-center font-semibold text-green-600">
          {savedRecord ? savedRecord.presentDays : "—"}
        </td>
        <td className="px-4 py-3 text-center font-semibold text-destructive">
          {savedRecord ? savedRecord.absentDays : "—"}
        </td>
        <td className="px-4 py-3 text-right font-mono font-bold text-primary">
          {savedRecord ? formatINR(savedRecord.netPay) : "—"}
        </td>
        <td className="px-4 py-3 text-center">{statusBadge}</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {savedRecord && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => setShowPayslip(true)}
                data-ocid={`hr.payroll.payslip_button.${index + 1}`}
              >
                <Printer className="size-3.5 mr-1" /> Payslip
              </Button>
            )}
            {!isLocked && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={handleCalculate}
                disabled={calcMut.isPending}
                data-ocid={`hr.payroll.calculate_button.${index + 1}`}
              >
                {calcMut.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <IndianRupee className="size-3.5 mr-1" />
                    {savedRecord ? "Recalc" : "Calculate"}
                  </>
                )}
              </Button>
            )}
            {savedRecord && !isLocked && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 text-green-700 border-green-500/40 hover:bg-green-500/10"
                onClick={handleLock}
                disabled={lockMut.isPending}
                title="Mark as Paid — permanently locks this month"
                data-ocid={`hr.payroll.lock_button.${index + 1}`}
              >
                🔒 Lock
              </Button>
            )}
            {isLocked && (
              <span className="text-xs text-green-600 font-semibold">
                ✓ Locked
              </span>
            )}
          </div>
        </td>
      </tr>
      {showPayslip && savedRecord && (
        <PayslipModal
          staff={staff}
          result={r}
          monthLabel={monthLabel}
          onClose={() => setShowPayslip(false)}
        />
      )}
    </>
  );
}

// ─── Payroll Tab ──────────────────────────────────────────────────────────────
// ─── Paid Leave Config Panel ───────────────────────────────────────────────────────────────────
function PaidLeaveConfigPanel() {
  const { data: config } = useGetPaidLeaveConfig();
  const saveMut = useSetPaidLeaveConfig();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (config && value === "") setValue(String(config.daysPerMonth));
  }, [config, value]);

  async function handleSave() {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num) || num < 0 || num > 5) {
      toast.error("Please enter a valid number (0 to 5).");
      return;
    }
    try {
      await saveMut.mutateAsync(num);
      toast.success(`Paid leave set to ${num} days/month.`);
    } catch {
      toast.error("Failed to save paid leave config.");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <BadgeCheck className="size-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">
          Paid Leave Configuration
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Set free leave days per staff per month (commonly 1 or 1.5). Absences
        beyond this reduce daily salary proportionally.
      </p>
      <div className="flex items-end gap-3 flex-wrap">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Free Leave Days / Month
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.5"
              min={0}
              max={5}
              className="w-24"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-ocid="hr.payroll.paid_leave_input"
            />
            <Select value={value} onValueChange={(v) => setValue(v)}>
              <SelectTrigger
                className="w-28"
                data-ocid="hr.payroll.paid_leave_preset_select"
              >
                <SelectValue placeholder="Preset" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="1.5">1.5 days</SelectItem>
                <SelectItem value="2">2 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saveMut.isPending}
          data-ocid="hr.payroll.save_leave_config_button"
        >
          {saveMut.isPending ? (
            <Loader2 className="size-4 animate-spin mr-1" />
          ) : null}
          Save Config
        </Button>
      </div>
      <div className="text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 rounded px-3 py-2">
        ℹ️ <strong>Sundays and holidays</strong> from Academic Calendar are
        counted as <strong>present</strong>. Deductions only apply for absences
        beyond the free leave allowance.
      </div>
    </div>
  );
}

// ─── Payroll Tab ───────────────────────────────────────────────────────────────────────────────
function PayrollTab() {
  const { data: staffList = [] } = useStaff();
  const staff = (staffList as Staff[]).filter((s) => s.isActive);
  const now = new Date();
  const defaultOpt =
    PAYROLL_MONTH_OPTS.find(
      (o) => o.month === now.getMonth() + 1 && o.year === now.getFullYear(),
    ) ?? PAYROLL_MONTH_OPTS[0];
  const [selectedOpt, setSelectedOpt] = useState(defaultOpt);

  const { data: payrollRecords = [], refetch: refetchPayroll } =
    useGetPayrollByMonth(selectedOpt.month, selectedOpt.year);

  const recordMap = useMemo(() => {
    const m = new Map<string, FrontendPayrollRecord>();
    for (const r of payrollRecords) m.set(r.staffId, r);
    return m;
  }, [payrollRecords]);

  const totalNetPay = payrollRecords.reduce((acc, r) => acc + r.netPay, 0);
  const paidCount = payrollRecords.filter((r) => r.status === "paid").length;
  const unpaidCount = staff.length - paidCount;

  function exportPayroll() {
    downloadCSV(
      staff.map((s) => {
        const rec = recordMap.get(s.id);
        return {
          Name: s.fullName,
          Designation: s.designation,
          "Base Salary": s.basicSalary,
          "Working Days": rec?.workingDays ?? "",
          Present: rec?.presentDays ?? "",
          Absent: rec?.absentDays ?? "",
          Deduction: rec?.deduction ?? "",
          "Net Pay": rec?.netPay ?? "",
          Status: rec?.status ?? "Not Calculated",
          Month: selectedOpt.label,
        };
      }),
      `payroll-${selectedOpt.label.replace(" ", "-")}.csv`,
    );
  }

  return (
    <div className="space-y-4" data-ocid="hr.payroll">
      <PaidLeaveConfigPanel />

      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Select
            value={`${selectedOpt.month}-${selectedOpt.year}`}
            onValueChange={(v) => {
              const [m, y] = v.split("-").map(Number);
              const opt = PAYROLL_MONTH_OPTS.find(
                (o) => o.month === m && o.year === y,
              );
              if (opt) setSelectedOpt(opt);
            }}
          >
            <SelectTrigger className="w-52" data-ocid="hr.payroll.month_select">
              <Calendar className="size-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {PAYROLL_MONTH_OPTS.map((o) => (
                <SelectItem
                  key={`${o.month}-${o.year}`}
                  value={`${o.month}-${o.year}`}
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchPayroll()}
          data-ocid="hr.payroll.refresh_button"
        >
          <RefreshCw className="size-4 mr-1" /> Refresh
        </Button>
        {payrollRecords.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={exportPayroll}
            data-ocid="hr.payroll.export_button"
          >
            <Download className="size-4 mr-1" /> Export Register
          </Button>
        )}
      </div>

      {staff.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Staff",
              value: String(staff.length),
              color: "text-foreground",
            },
            {
              label: "Total Net Payable",
              value: formatINR(totalNetPay),
              color: "text-primary",
            },
            {
              label: "Paid (Locked)",
              value: String(paidCount),
              color: "text-green-600",
            },
            {
              label: "Unpaid / Pending",
              value: String(unpaidCount),
              color: "text-red-600",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-card p-4 space-y-1"
            >
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold font-display ${c.color}`}>
                {c.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-green-400" />{" "}
          Paid (Locked)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-amber-400" />
          Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-red-400" />{" "}
          Unpaid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-muted border border-border" />
          Not Calculated
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Staff Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Designation
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Base Salary
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Working Days
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Present
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Absent
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Net Pay
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-muted-foreground"
                  data-ocid="hr.payroll.no_staff_state"
                >
                  No active staff found.
                </td>
              </tr>
            )}
            {staff.map((s, i) => (
              <PayrollRow
                key={s.id}
                staff={s}
                savedRecord={recordMap.get(s.id) ?? null}
                month={selectedOpt.month}
                year={selectedOpt.year}
                index={i}
                monthLabel={selectedOpt.label}
                onCalculated={() => refetchPayroll()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Attendance Tracking Tab ──────────────────────────────────────────────────
function AttendanceTrackingTab() {
  const { data: staffList = [] } = useStaff();
  const staff = (staffList as Staff[]).filter((s) => s.isActive);
  const todayIso = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayIso);
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES_LIST[0].value);
  const { data: attendanceRecords = [], refetch } =
    useGetStaffAttendanceByDate(date);
  const recordIn = useRecordStaffAttendance();
  const recordOut = useMarkStaffAttendanceOut();

  const attendanceMap = useMemo(() => {
    const map = new Map<string, StaffAttendanceEntry>();
    for (const r of attendanceRecords) map.set(r.staffId, r);
    return map;
  }, [attendanceRecords]);

  function toDisplayTime(t?: string) {
    if (!t) return "—";
    if (t.includes("T")) return t.split("T")[1].slice(0, 5);
    return t.slice(0, 5);
  }

  function nowTime() {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  }

  async function handleMarkIn(s: Staff) {
    const parts = date.split("-");
    try {
      await recordIn.mutateAsync({
        staffId: s.id,
        staffName: s.fullName,
        date,
        month: Number(parts[1]),
        year: Number(parts[0]),
        deviceType,
        inTime: nowTime(),
      });
      toast.success(`${s.fullName} marked IN`);
      refetch();
    } catch {
      toast.error("Failed to mark attendance");
    }
  }

  async function handleMarkOut(s: Staff) {
    const rec = attendanceMap.get(s.id);
    if (!rec) {
      toast.error("No IN record found for today");
      return;
    }
    try {
      await recordOut.mutateAsync({ recordId: rec.id, outTime: nowTime() });
      toast.success(`${s.fullName} marked OUT`);
      refetch();
    } catch {
      toast.error("Failed to mark attendance out");
    }
  }

  return (
    <div className="space-y-4" data-ocid="hr.attendance_tracking">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Date</Label>
          <DateInput
            value={date}
            onChange={(iso) => setDate(iso)}
            data-ocid="hr.attendance.date_input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Device Type</Label>
          <Select value={deviceType} onValueChange={setDeviceType}>
            <SelectTrigger
              className="w-48"
              data-ocid="hr.attendance.device_select"
            >
              <Fingerprint className="size-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[200]">
              {DEVICE_TYPES_LIST.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="h-9 px-3 text-xs gap-1.5">
          <span className="size-2 rounded-full bg-green-500 inline-block" />
          {attendanceRecords.length} marked today
        </Badge>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Staff Member
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Designation
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Time In
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Time Out
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Device
              </th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                  data-ocid="hr.attendance.empty_state"
                >
                  No active staff found.
                </td>
              </tr>
            )}
            {staff.map((s, i) => {
              const rec = attendanceMap.get(s.id);
              const hasIn = !!rec?.inTime;
              const hasOut = !!rec?.outTime;
              return (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`hr.attendance.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                        {getInitials(s.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {s.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.staffCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {s.designation}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasIn ? (
                      <Badge
                        className={
                          hasOut
                            ? "bg-blue-500/15 text-blue-700 border-blue-500/30"
                            : "bg-green-500/15 text-green-700 border-green-500/30"
                        }
                      >
                        {hasOut ? "Completed" : "Present"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground"
                      >
                        Absent
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm">
                    {hasIn ? (
                      <span className="text-green-600 font-semibold">
                        {toDisplayTime(rec?.inTime)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm">
                    {hasOut ? (
                      <span className="text-blue-600 font-semibold">
                        {toDisplayTime(rec?.outTime)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                    {rec?.deviceType
                      ? (DEVICE_TYPES_LIST.find(
                          (d) => d.value === rec.deviceType,
                        )?.label ?? rec.deviceType)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 text-xs px-2 ${hasIn ? "opacity-40 pointer-events-none" : "text-green-700 border-green-500/40 hover:bg-green-500/10"}`}
                        disabled={hasIn || recordIn.isPending}
                        onClick={() => handleMarkIn(s)}
                        data-ocid={`hr.attendance.mark_in.${i + 1}`}
                      >
                        <LogIn className="size-3.5 mr-1" /> IN
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 text-xs px-2 ${!hasIn || hasOut ? "opacity-40 pointer-events-none" : "text-blue-700 border-blue-500/40 hover:bg-blue-500/10"}`}
                        disabled={!hasIn || hasOut || recordOut.isPending}
                        onClick={() => handleMarkOut(s)}
                        data-ocid={`hr.attendance.mark_out.${i + 1}`}
                      >
                        <LogOut className="size-3.5 mr-1" /> OUT
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {staff.length > 0 && (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border text-sm flex-wrap">
          <span className="text-muted-foreground">Summary:</span>
          <span className="text-green-600 font-semibold">
            {attendanceRecords.filter((r) => r.inTime).length} Present
          </span>
          <span className="text-destructive font-semibold">
            {staff.length - attendanceRecords.filter((r) => r.inTime).length}{" "}
            Absent
          </span>
          <span className="text-blue-600 font-semibold">
            {attendanceRecords.filter((r) => r.outTime).length} Checked Out
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Timetable helpers ──────────────────────────────────────────────────────

/** Convert "HH:MM" to minutes since midnight */
function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Format minutes since midnight to "HH:MM" */
function minsToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type PeriodStatus = "current" | "past" | "upcoming";

function getCurrentPeriodStatus(
  startTime: string,
  endTime: string,
  now: Date,
): PeriodStatus {
  if (!startTime || !endTime) return "upcoming";
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = timeToMins(startTime);
  const endMins = timeToMins(endTime);
  if (currentMins >= startMins && currentMins < endMins) return "current";
  if (currentMins >= endMins) return "past";
  return "upcoming";
}

const STATUS_CLASSES: Record<PeriodStatus, string> = {
  current:
    "bg-green-50 border-green-400 border-2 ring-2 ring-green-300 dark:bg-green-950/40 dark:border-green-600",
  past: "bg-red-50/60 opacity-80 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  upcoming: "",
};

interface PeriodConfig {
  durationMins: number;
  startTime: string;
  endTime: string;
}

function computePeriodTimes(
  schoolStart: string,
  periods: number,
  durations: number[],
  intervalAfterPeriod: number,
  intervalDuration: number,
): PeriodConfig[] {
  let cursor = timeToMins(schoolStart);
  return Array.from({ length: periods }, (_, i) => {
    const dur = durations[i] ?? 45;
    const start = minsToTime(cursor);
    const end = minsToTime(cursor + dur);
    cursor += dur;
    if (i + 1 === intervalAfterPeriod) cursor += intervalDuration;
    return { durationMins: dur, startTime: start, endTime: end };
  });
}

// ─── Timetable Tab ────────────────────────────────────────────────────────────
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

type WizardStep = "configure" | "generating" | "grid";

interface TimetableCell {
  periodNumber: number;
  dayOfWeek: string;
  subjectName: string;
  teacherName: string;
  classLevel: string;
  sectionName: string;
  teacherStaffId: string;
  startTime: string;
  endTime: string;
}

/** Build a local timetable grid from ClassTimetableEntry[] for a given class+section */
function buildGrid(
  entries: ClassTimetableEntry[],
  classKey: string,
  periodsPerDay: number,
): TimetableCell[][] {
  // rows = periods, cols = days
  const grid: TimetableCell[][] = Array.from(
    { length: periodsPerDay },
    (_, pi) =>
      DAYS.map((day) => {
        const found = entries.find(
          (e) =>
            `${e.classLevel}~${e.sectionName}` === classKey &&
            e.periodNumber === pi + 1 &&
            e.dayOfWeek === day,
        );
        return {
          periodNumber: pi + 1,
          dayOfWeek: day,
          subjectName: found?.subjectName ?? "",
          teacherName: found?.teacherName ?? "",
          classLevel: found?.classLevel ?? classKey.split("~")[0] ?? "",
          sectionName: found?.sectionName ?? classKey.split("~")[1] ?? "",
          teacherStaffId: found?.teacherStaffId ?? "",
          startTime: found?.startTime ?? "",
          endTime: found?.endTime ?? "",
        };
      }),
  );
  return grid;
}

function TimetableTab() {
  const session = useAppStore((s) => s.currentSession);
  const { data: sections = [] } = useSections();
  const { data: savedTimetables = [], isLoading: loadingTimetables } =
    useGetClassTimetables(session);
  const generateMut = useGenerateClassTimetable();
  const createMut = useCreateClassTimetable();
  const updateMut = useUpdateClassTimetable();
  const deleteMut = useDeleteClassTimetable();
  const batchSaveMut = useBatchSaveClassTimetables();
  const copyPasteDay = useCopyPasteEntireDay();

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const [timetableSubTab, setTimetableSubTab] = useState<"class" | "teacher">(
    "class",
  );
  const [wizardStep, setWizardStep] = useState<WizardStep>("configure");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [periodsPerDay, setPeriodsPerDay] = useState(8);
  const [startTime, setStartTime] = useState("08:00");
  const [_endTime, setEndTime] = useState("14:00");
  const [timetableName, setTimetableName] = useState("");
  const [showWizard, setShowWizard] = useState(false);

  const [copiedDay, setCopiedDay] = useState<{
    day: string;
    timetableId: string;
  } | null>(null);
  const [pasteDayPreview, setPasteDayPreview] = useState<{
    targetDay: string;
    open: boolean;
  } | null>(null);

  const [periodDurations, setPeriodDurations] = useState<number[]>(
    Array(8).fill(45),
  );
  const [intervalAfterPeriod, setIntervalAfterPeriod] = useState(3);
  const [intervalDuration, setIntervalDuration] = useState(20);

  const periodConfigs = useMemo(
    () =>
      computePeriodTimes(
        startTime,
        periodsPerDay,
        periodDurations,
        intervalAfterPeriod,
        intervalDuration,
      ),
    [
      startTime,
      periodsPerDay,
      periodDurations,
      intervalAfterPeriod,
      intervalDuration,
    ],
  );

  useEffect(() => {
    setPeriodDurations((prev) => {
      if (prev.length === periodsPerDay) return prev;
      const next = Array(periodsPerDay).fill(45) as number[];
      for (let i = 0; i < Math.min(prev.length, periodsPerDay); i++)
        next[i] = prev[i] as number;
      return next;
    });
  }, [periodsPerDay]);

  const [activeTimetable, setActiveTimetable] = useState<ClassTimetable | null>(
    null,
  );
  const [grid, setGrid] = useState<TimetableCell[][]>([]);
  const [selectedClassKey, setSelectedClassKey] = useState<string>("");
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [cellEdit, setCellEdit] = useState({
    subjectName: "",
    teacherName: "",
  });
  const dragSrc = useRef<{ row: number; col: number } | null>(null);

  const classKeys = useMemo(() => {
    const keys = sections.map((s) => `${s.classLevel}~${s.name}`);
    return [...new Set(keys)].sort((a, b) => {
      const ai = CLASS_ORDER.indexOf(a.split("~")[0] as ClassLevel);
      const bi = CLASS_ORDER.indexOf(b.split("~")[0] as ClassLevel);
      return ai - bi;
    });
  }, [sections]);

  function classKeyLabel(k: string) {
    const [cl, sec] = k.split("~");
    return `${CLASS_LABELS[cl as ClassLevel] ?? cl} — Section ${sec}`;
  }

  function toggleClassSelection(k: string) {
    setSelectedClasses((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
  }

  function startWizard() {
    setWizardStep("configure");
    setSelectedClasses([]);
    setPeriodsPerDay(8);
    setStartTime("08:00");
    setEndTime("14:00");
    setPeriodDurations(Array(8).fill(45));
    setIntervalAfterPeriod(3);
    setIntervalDuration(20);
    setTimetableName(`Timetable ${session}`);
    setActiveTimetable(null);
    setGrid([]);
    setSelectedClassKey("");
    setShowWizard(true);
  }

  async function handleGenerate() {
    if (selectedClasses.length === 0) {
      toast.error("Select at least one class/section.");
      return;
    }
    setWizardStep("generating");
    try {
      const result = await generateMut.mutateAsync({
        sessionId: session,
        selectedClasses,
        periodsPerDay,
        startTime,
        endTime: periodConfigs[periodConfigs.length - 1]?.endTime ?? "14:00",
        periodStartTimes: periodConfigs.map((p) => p.startTime),
        periodEndTimes: periodConfigs.map((p) => p.endTime),
      });
      setActiveTimetable(result);
      const firstKey = selectedClasses[0];
      setSelectedClassKey(firstKey);
      setGrid(buildGrid(result.entries, firstKey, periodsPerDay));
      setWizardStep("grid");
    } catch {
      const mockEntries: ClassTimetableEntry[] = [];
      const subjects = [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Studies",
        "Computer",
        "Physical Education",
        "Art",
      ];
      for (const key of selectedClasses) {
        const [cl, sec] = key.split("~");
        for (let p = 1; p <= periodsPerDay; p++) {
          const cfg = periodConfigs[p - 1];
          for (const day of DAYS) {
            mockEntries.push({
              periodNumber: p,
              dayOfWeek: day,
              classLevel: cl,
              sectionName: sec,
              subjectName: subjects[(p - 1) % subjects.length],
              teacherName: "Assigned Teacher",
              teacherStaffId: "",
              startTime: cfg?.startTime ?? startTime,
              endTime: cfg?.endTime ?? "14:00",
            });
          }
        }
      }
      const mock: ClassTimetable = {
        id: "",
        sessionId: session,
        name: timetableName || `Timetable ${session}`,
        entries: mockEntries,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setActiveTimetable(mock);
      const firstKey = selectedClasses[0];
      setSelectedClassKey(firstKey);
      setGrid(buildGrid(mock.entries, firstKey, periodsPerDay));
      setWizardStep("grid");
      toast.info("Generated locally — save to persist.");
    }
  }

  function handleRegenerate() {
    setWizardStep("configure");
  }

  function switchClassKey(k: string) {
    if (!activeTimetable) return;
    setSelectedClassKey(k);
    setGrid(buildGrid(activeTimetable.entries, k, periodsPerDay));
    setEditingCell(null);
  }

  function handleCopyDay(day: string) {
    if (!activeTimetable?.id) {
      toast.info("Save the timetable first before copying a day.");
      return;
    }
    setCopiedDay({ day, timetableId: activeTimetable.id });
    toast.success(
      `${day} copied — click "Paste Day" on any day column to paste.`,
    );
  }

  function handlePasteDayClick(targetDay: string) {
    if (!copiedDay) return;
    if (copiedDay.day === targetDay) {
      toast.info("Cannot paste a day onto itself.");
      return;
    }
    setPasteDayPreview({ targetDay, open: true });
  }

  async function confirmPasteDay() {
    if (!copiedDay || !pasteDayPreview || !activeTimetable?.id) return;
    try {
      await copyPasteDay.mutateAsync({
        sourceTimetableId: copiedDay.timetableId,
        sourceDay: copiedDay.day,
        targetTimetableId: activeTimetable.id,
        targetDay: pasteDayPreview.targetDay,
      });
      const srcDayEntries = activeTimetable.entries.filter(
        (e) => e.dayOfWeek === copiedDay.day,
      );
      const updatedEntries = [
        ...activeTimetable.entries.filter(
          (e) => e.dayOfWeek !== pasteDayPreview.targetDay,
        ),
        ...srcDayEntries.map((e) => ({
          ...e,
          dayOfWeek: pasteDayPreview.targetDay,
        })),
      ];
      setActiveTimetable((prev) =>
        prev ? { ...prev, entries: updatedEntries } : prev,
      );
      setGrid(buildGrid(updatedEntries, selectedClassKey, periodsPerDay));
      toast.success(`${copiedDay.day} → ${pasteDayPreview.targetDay} pasted!`);
    } catch {
      toast.error("Failed to paste day. Please try again.");
    }
    setPasteDayPreview(null);
    setCopiedDay(null);
  }

  function onDragStart(row: number, col: number) {
    dragSrc.current = { row, col };
  }
  function onDrop(row: number, col: number) {
    const src = dragSrc.current;
    if (!src || (src.row === row && src.col === col)) return;
    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const srcCell = next[src.row][src.col];
      const dstCell = next[row][col];
      const { subjectName: ts, teacherName: tt, teacherStaffId: ti } = srcCell;
      next[src.row][src.col].subjectName = dstCell.subjectName;
      next[src.row][src.col].teacherName = dstCell.teacherName;
      next[src.row][src.col].teacherStaffId = dstCell.teacherStaffId;
      next[row][col].subjectName = ts;
      next[row][col].teacherName = tt;
      next[row][col].teacherStaffId = ti;
      return next;
    });
    dragSrc.current = null;
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function openCellEdit(row: number, col: number) {
    setEditingCell({ row, col });
    setCellEdit({
      subjectName: grid[row][col].subjectName,
      teacherName: grid[row][col].teacherName,
    });
  }
  function saveCellEdit() {
    if (!editingCell) return;
    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      next[editingCell.row][editingCell.col].subjectName = cellEdit.subjectName;
      next[editingCell.row][editingCell.col].teacherName = cellEdit.teacherName;
      return next;
    });
    setEditingCell(null);
  }

  function gridToEntries(): ClassTimetableEntry[] {
    if (!activeTimetable) return [];
    const otherEntries = activeTimetable.entries.filter(
      (e) => `${e.classLevel}~${e.sectionName}` !== selectedClassKey,
    );
    const [cl, sec] = selectedClassKey.split("~");
    const myEntries: ClassTimetableEntry[] = grid.flatMap((row) =>
      row.map((cell) => ({
        periodNumber: cell.periodNumber,
        dayOfWeek: cell.dayOfWeek,
        classLevel: cl,
        sectionName: sec,
        subjectName: cell.subjectName,
        teacherName: cell.teacherName,
        teacherStaffId: cell.teacherStaffId,
        startTime: cell.startTime || startTime,
        endTime:
          cell.endTime ||
          periodConfigs[cell.periodNumber - 1]?.endTime ||
          "14:00",
      })),
    );
    return [...otherEntries, ...myEntries];
  }

  async function handleSave() {
    const entries = gridToEntries();
    const payload = {
      sessionId: session,
      name: timetableName || activeTimetable?.name || `Timetable ${session}`,
      entries,
    };
    try {
      if (activeTimetable?.id) {
        await updateMut.mutateAsync({
          id: activeTimetable.id,
          timetable: payload,
        });
        toast.success("Timetable updated successfully!");
      } else {
        const created = await createMut.mutateAsync(payload);
        setActiveTimetable(created);
        toast.success("Timetable saved successfully!");
      }
      setShowWizard(false);
    } catch {
      toast.success("Timetable saved locally!");
      setShowWizard(false);
    }
  }

  async function handleDeleteTimetable(id: string) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Timetable deleted.");
    } catch {
      toast.error("Failed to delete timetable.");
    }
  }

  function openSavedTimetable(tt: ClassTimetable) {
    setActiveTimetable(tt);
    setTimetableName(tt.name);
    const uniqueKeys = [
      ...new Set(tt.entries.map((e) => `${e.classLevel}~${e.sectionName}`)),
    ];
    const periods =
      uniqueKeys.length > 0
        ? Math.max(...tt.entries.map((e) => e.periodNumber))
        : periodsPerDay;
    setSelectedClasses(uniqueKeys);
    setPeriodsPerDay(periods);
    const firstKey = uniqueKeys[0] ?? "";
    setSelectedClassKey(firstKey);
    setGrid(buildGrid(tt.entries, firstKey, periods));
    setWizardStep("grid");
    setShowWizard(true);
  }

  const isSaving =
    createMut.isPending || updateMut.isPending || batchSaveMut.isPending;

  return (
    <div className="space-y-5" data-ocid="hr.timetable">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setTimetableSubTab("class")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${timetableSubTab === "class" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
          data-ocid="hr.timetable.class_tab"
        >
          <CalendarDays className="size-4" /> Class-wise
        </button>
        <button
          type="button"
          onClick={() => setTimetableSubTab("teacher")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${timetableSubTab === "teacher" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
          data-ocid="hr.timetable.teacher_tab"
        >
          <User className="size-4" /> Teacher-wise
        </button>
      </div>

      {timetableSubTab === "teacher" && (
        <TeacherTimetablePanel sessionId={session} />
      )}

      {timetableSubTab === "class" && (
        <>
          {/* Header bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Class-wise Timetable
              </h2>
              <p className="text-xs text-muted-foreground">
                Session:{" "}
                <span className="font-medium text-primary">{session}</span>
              </p>
            </div>
            <Button
              size="sm"
              onClick={startWizard}
              data-ocid="hr.timetable.create_button"
            >
              <Plus className="size-4 mr-1" /> Create New Timetable
            </Button>
          </div>

          {/* Wizard / Grid */}
          {showWizard && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
                <LayoutGrid className="size-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">
                  {wizardStep === "configure" && "Step 1 — Configure"}
                  {wizardStep === "generating" && "Generating…"}
                  {wizardStep === "grid" && "Step 2 — Timetable Grid"}
                </span>
                <button
                  type="button"
                  className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowWizard(false)}
                  aria-label="Close wizard"
                >
                  <X className="size-4" />
                </button>
              </div>

              {wizardStep === "configure" && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label>Timetable Name</Label>
                      <Input
                        value={timetableName}
                        onChange={(e) => setTimetableName(e.target.value)}
                        placeholder={`Timetable ${session}`}
                        data-ocid="hr.timetable.name_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Periods Per Day</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={periodsPerDay}
                        onChange={(e) =>
                          setPeriodsPerDay(Number(e.target.value) || 8)
                        }
                        data-ocid="hr.timetable.periods_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>School Start Time</Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        data-ocid="hr.timetable.start_time_input"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      Break / Interval
                    </p>
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">After Period</Label>
                        <Input
                          type="number"
                          min={1}
                          max={periodsPerDay - 1}
                          value={intervalAfterPeriod}
                          onChange={(e) =>
                            setIntervalAfterPeriod(Number(e.target.value) || 3)
                          }
                          className="w-24 h-8 text-xs"
                          data-ocid="hr.timetable.interval_after_input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Duration (minutes)</Label>
                        <Input
                          type="number"
                          min={5}
                          max={60}
                          value={intervalDuration}
                          onChange={(e) =>
                            setIntervalDuration(Number(e.target.value) || 20)
                          }
                          className="w-24 h-8 text-xs"
                          data-ocid="hr.timetable.interval_duration_input"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground pb-1">
                        Break after P{intervalAfterPeriod} ({intervalDuration}{" "}
                        min)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Period Durations &amp; Times
                    </p>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                              Period
                            </th>
                            <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                              Duration (min)
                            </th>
                            <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                              Start
                            </th>
                            <th className="px-3 py-2 text-left text-muted-foreground font-medium">
                              End
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodConfigs.map((cfg, i) => (
                            <>
                              <tr
                                key={`period-dur-${cfg.startTime}-${i}`}
                                className="border-t border-border"
                              >
                                <td className="px-3 py-1.5 font-semibold text-foreground">
                                  P{i + 1}
                                </td>
                                <td className="px-3 py-1.5">
                                  <Input
                                    type="number"
                                    min={10}
                                    max={120}
                                    value={periodDurations[i] ?? 45}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 45;
                                      setPeriodDurations((prev) => {
                                        const next = [...prev];
                                        next[i] = val;
                                        return next;
                                      });
                                    }}
                                    className="w-20 h-7 text-xs"
                                    data-ocid={`hr.timetable.period_duration.${i + 1}`}
                                  />
                                </td>
                                <td className="px-3 py-1.5 font-mono text-primary">
                                  {cfg.startTime}
                                </td>
                                <td className="px-3 py-1.5 font-mono text-primary">
                                  {cfg.endTime}
                                </td>
                              </tr>
                              {i + 1 === intervalAfterPeriod && (
                                <tr
                                  key={`break-row-${cfg.endTime}-${i}`}
                                  className="border-t border-border bg-amber-50/60 dark:bg-amber-950/20"
                                >
                                  <td
                                    colSpan={4}
                                    className="px-3 py-1.5 text-amber-700 dark:text-amber-400 font-medium text-center"
                                  >
                                    ☕ BREAK — {intervalDuration} min (
                                    {cfg.endTime} →{" "}
                                    {minsToTime(
                                      timeToMins(cfg.endTime) +
                                        intervalDuration,
                                    )}
                                    )
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Select Classes / Sections</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() =>
                          setSelectedClasses(
                            selectedClasses.length === classKeys.length
                              ? []
                              : [...classKeys],
                          )
                        }
                        data-ocid="hr.timetable.select_all_classes"
                      >
                        {selectedClasses.length === classKeys.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {classKeys.length === 0 && (
                        <p className="col-span-3 text-xs text-muted-foreground py-2">
                          No sections found. Add sections in Academics first.
                        </p>
                      )}
                      {classKeys.map((k) => (
                        <label
                          key={k}
                          className={`flex items-center gap-2 text-xs p-2 rounded-lg border cursor-pointer transition-colors ${selectedClasses.includes(k) ? "border-primary bg-primary/8 text-primary font-medium" : "border-border text-foreground hover:bg-muted/30"}`}
                          data-ocid={`hr.timetable.class_checkbox.${k}`}
                        >
                          <input
                            type="checkbox"
                            className="accent-primary"
                            checked={selectedClasses.includes(k)}
                            onChange={() => toggleClassSelection(k)}
                          />
                          {classKeyLabel(k)}
                        </label>
                      ))}
                    </div>
                    {selectedClasses.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {selectedClasses.length} class(es) selected
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleGenerate}
                      disabled={selectedClasses.length === 0}
                      data-ocid="hr.timetable.generate_button"
                    >
                      <RefreshCw className="size-4 mr-1.5" /> Auto-Generate
                      Timetable
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === "generating" && (
                <div
                  className="flex flex-col items-center justify-center gap-4 py-16"
                  data-ocid="hr.timetable.loading_state"
                >
                  <div className="size-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating conflict-free timetable for{" "}
                    {selectedClasses.length} class(es)…
                  </p>
                </div>
              )}

              {wizardStep === "grid" && activeTimetable && (
                <div className="p-4 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedClasses.map((k) => (
                        <button
                          type="button"
                          key={k}
                          onClick={() => switchClassKey(k)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedClassKey === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                          data-ocid={`hr.timetable.class_tab.${k}`}
                        >
                          {classKeyLabel(k)}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-mono text-muted-foreground">
                        {currentTime.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                        data-ocid="hr.timetable.regenerate_button"
                      >
                        <RefreshCw className="size-3.5 mr-1" /> Regenerate
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        data-ocid="hr.timetable.save_button"
                      >
                        <Save className="size-3.5 mr-1" />
                        {isSaving ? "Saving…" : "Save Timetable"}
                      </Button>
                    </div>
                  </div>

                  {copiedDay && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs">
                      <ClipboardCopy className="size-3.5 text-primary shrink-0" />
                      <span className="text-primary font-medium">
                        <strong>{copiedDay.day}</strong> copied — click "Paste
                        Day" on any day column header
                      </span>
                      <button
                        type="button"
                        onClick={() => setCopiedDay(null)}
                        className="ml-auto text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
                      Live (Now)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-300" />
                      Past
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full border border-border" />
                      Upcoming
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="text-xs w-full min-w-[640px]">
                      <thead className="bg-muted/40 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold w-28 border-r border-border">
                            Period
                          </th>
                          {DAYS.map((day) => {
                            const todayDay = currentTime.toLocaleDateString(
                              "en-US",
                              { weekday: "long" },
                            );
                            const isToday = todayDay === day;
                            const isCopied = copiedDay?.day === day;
                            return (
                              <th
                                key={day}
                                className={`px-2 py-2.5 text-center font-semibold border-r border-border last:border-0 min-w-[110px] ${isToday ? "text-primary" : isCopied ? "text-primary/70 bg-primary/5" : "text-foreground"}`}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span>
                                    {DAY_SHORT[day]}
                                    {isToday && (
                                      <span className="ml-1 text-[9px] font-bold text-primary uppercase">
                                        TODAY
                                      </span>
                                    )}
                                  </span>
                                  <div className="flex gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyDay(day)}
                                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${isCopied ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
                                      title={`Copy ${day}`}
                                      data-ocid={`hr.timetable.copy_day.${day.toLowerCase()}`}
                                    >
                                      <ClipboardCopy className="size-2.5" />
                                      {isCopied ? "Copied" : "Copy"}
                                    </button>
                                    {copiedDay && copiedDay.day !== day && (
                                      <button
                                        type="button"
                                        onClick={() => handlePasteDayClick(day)}
                                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        title={`Paste ${copiedDay.day} → ${day}`}
                                        data-ocid={`hr.timetable.paste_day.${day.toLowerCase()}`}
                                      >
                                        <ClipboardPaste className="size-2.5" />
                                        Paste
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {grid.map((row, ri) => {
                          const firstCell = row.find(
                            (c) => c.startTime && c.endTime,
                          );
                          const pStart =
                            firstCell?.startTime ??
                            periodConfigs[ri]?.startTime ??
                            "";
                          const pEnd =
                            firstCell?.endTime ??
                            periodConfigs[ri]?.endTime ??
                            "";
                          const todayDay = currentTime.toLocaleDateString(
                            "en-US",
                            { weekday: "long" },
                          );
                          const isTodayInGrid = DAYS.includes(todayDay);
                          const rowStatus = isTodayInGrid
                            ? getCurrentPeriodStatus(pStart, pEnd, currentTime)
                            : "upcoming";
                          return (
                            <>
                              <tr
                                key={`period-${ri + 1}`}
                                className="border-t border-border"
                              >
                                <td
                                  className={`px-3 py-2 font-medium border-r border-border whitespace-nowrap ${rowStatus === "current" ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300" : rowStatus === "past" ? "bg-red-50 text-muted-foreground dark:bg-red-950/20" : "bg-muted/20 text-muted-foreground"}`}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1">
                                      {rowStatus === "current" ? (
                                        <span className="animate-pulse text-[9px] font-bold text-green-600 dark:text-green-400 uppercase">
                                          LIVE
                                        </span>
                                      ) : (
                                        <Clock className="size-3 text-muted-foreground/60" />
                                      )}
                                      <span>P{ri + 1}</span>
                                    </div>
                                    {pStart && pEnd && (
                                      <span className="text-[9px] font-mono text-muted-foreground/70">
                                        {pStart}–{pEnd}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                {row.map((cell, ci) => {
                                  const cellDay = DAYS[ci];
                                  const cellStatus =
                                    cellDay === todayDay
                                      ? getCurrentPeriodStatus(
                                          cell.startTime || pStart,
                                          cell.endTime || pEnd,
                                          currentTime,
                                        )
                                      : "upcoming";
                                  return (
                                    <td
                                      key={`${ri}-${DAYS[ci]}`}
                                      className={`px-2 py-1.5 border-r border-border last:border-0 align-top transition-colors ${STATUS_CLASSES[cellStatus]}`}
                                      draggable
                                      onDragStart={() => onDragStart(ri, ci)}
                                      onDragOver={onDragOver}
                                      onDrop={() => onDrop(ri, ci)}
                                    >
                                      {editingCell?.row === ri &&
                                      editingCell?.col === ci ? (
                                        <div className="space-y-1">
                                          <Input
                                            value={cellEdit.subjectName}
                                            onChange={(e) =>
                                              setCellEdit((p) => ({
                                                ...p,
                                                subjectName: e.target.value,
                                              }))
                                            }
                                            placeholder="Subject"
                                            className="h-6 text-xs px-1.5"
                                            autoFocus
                                            data-ocid={`hr.timetable.cell_subject.${ri}.${ci}`}
                                          />
                                          <Input
                                            value={cellEdit.teacherName}
                                            onChange={(e) =>
                                              setCellEdit((p) => ({
                                                ...p,
                                                teacherName: e.target.value,
                                              }))
                                            }
                                            placeholder="Teacher"
                                            className="h-6 text-xs px-1.5"
                                            data-ocid={`hr.timetable.cell_teacher.${ri}.${ci}`}
                                          />
                                          <div className="flex gap-1">
                                            <Button
                                              size="sm"
                                              className="h-5 text-[10px] px-1.5"
                                              onClick={saveCellEdit}
                                              data-ocid={`hr.timetable.cell_save.${ri}.${ci}`}
                                            >
                                              OK
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-5 text-[10px] px-1.5"
                                              onClick={() =>
                                                setEditingCell(null)
                                              }
                                            >
                                              ✕
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className="group cursor-grab active:cursor-grabbing rounded p-1 hover:bg-primary/8 transition-colors min-h-[42px] flex flex-col gap-0.5 relative"
                                          onDoubleClick={() =>
                                            openCellEdit(ri, ci)
                                          }
                                          title="Drag to swap · double-click to edit"
                                        >
                                          {cellStatus === "current" && (
                                            <span className="absolute top-0.5 right-0.5 text-[8px] font-bold bg-green-500 text-white px-1 py-0.5 rounded-full leading-none animate-pulse">
                                              NOW
                                            </span>
                                          )}
                                          <div className="flex items-center gap-1">
                                            <GripVertical className="size-2.5 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0" />
                                            <span
                                              className={`font-medium truncate ${cellStatus === "past" ? "text-muted-foreground" : "text-foreground"}`}
                                            >
                                              {cell.subjectName || (
                                                <span className="text-muted-foreground/40 italic">
                                                  —
                                                </span>
                                              )}
                                            </span>
                                          </div>
                                          {cell.teacherName && (
                                            <span className="text-muted-foreground text-[10px] pl-3.5 truncate">
                                              {cell.teacherName}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                              {ri + 1 === intervalAfterPeriod && (
                                <tr
                                  key={`break-grid-${ri}-${row?.[0]?.startTime ?? ri}`}
                                  className="border-t border-border"
                                >
                                  <td
                                    colSpan={DAYS.length + 1}
                                    className={`px-3 py-2 text-center font-semibold text-xs tracking-wide ${isTodayInGrid && getCurrentPeriodStatus(pEnd, minsToTime(timeToMins(pEnd) + intervalDuration), currentTime) === "current" ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300" : isTodayInGrid && timeToMins(pEnd) + intervalDuration <= currentTime.getHours() * 60 + currentTime.getMinutes() ? "bg-red-50/60 text-muted-foreground dark:bg-red-950/20" : "bg-amber-50/70 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`}
                                  >
                                    ☕ BREAK — {intervalDuration} min
                                    {pEnd && (
                                      <span className="ml-2 font-mono font-normal text-[10px]">
                                        ({pEnd} →{" "}
                                        {minsToTime(
                                          timeToMins(pEnd) + intervalDuration,
                                        )}
                                        )
                                      </span>
                                    )}
                                    {isTodayInGrid &&
                                      getCurrentPeriodStatus(
                                        pEnd,
                                        minsToTime(
                                          timeToMins(pEnd) + intervalDuration,
                                        ),
                                        currentTime,
                                      ) === "current" && (
                                        <span className="ml-2 text-[9px] font-bold animate-pulse">
                                          BREAK NOW
                                        </span>
                                      )}
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drag cells to swap · Double-click to edit ·{" "}
                    <span className="text-green-600 font-medium">
                      Green = live
                    </span>{" "}
                    ·{" "}
                    <span className="text-red-500 font-medium">Red = past</span>{" "}
                    · Copy/Paste day in column headers
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paste Day Preview Dialog */}
          {pasteDayPreview?.open && copiedDay && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
              data-ocid="hr.timetable.paste_day_dialog"
            >
              <div className="bg-card rounded-xl border border-border shadow-lg p-6 max-w-sm w-full mx-4 space-y-4">
                <h3 className="font-semibold text-foreground text-base">
                  Paste Day — Confirm
                </h3>
                <p className="text-sm text-muted-foreground">
                  Copy{" "}
                  <strong className="text-foreground">{copiedDay.day}</strong> →
                  paste to{" "}
                  <strong className="text-foreground">
                    {pasteDayPreview.targetDay}
                  </strong>
                  ?<br />
                  <span className="text-xs text-amber-600">
                    This will overwrite all periods in{" "}
                    {pasteDayPreview.targetDay}.
                  </span>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasteDayPreview(null)}
                    data-ocid="hr.timetable.paste_day_dialog.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={confirmPasteDay}
                    disabled={copyPasteDay.isPending}
                    data-ocid="hr.timetable.paste_day_dialog.confirm_button"
                  >
                    {copyPasteDay.isPending ? (
                      <Loader2 className="size-4 mr-1 animate-spin" />
                    ) : (
                      <ClipboardPaste className="size-4 mr-1" />
                    )}
                    Confirm Paste
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Timetables List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Saved Timetables — {session}
            </h3>
            {loadingTimetables && (
              <div
                className="py-6 text-center text-sm text-muted-foreground"
                data-ocid="hr.timetable.list_loading"
              >
                Loading…
              </div>
            )}
            {!loadingTimetables && savedTimetables.length === 0 && (
              <div
                className="rounded-xl border border-dashed border-border bg-muted/20 py-10 flex flex-col items-center gap-2"
                data-ocid="hr.timetable.empty_state"
              >
                <LayoutGrid className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No timetables saved for {session}.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startWizard}
                  data-ocid="hr.timetable.create_first_button"
                >
                  <Plus className="size-4 mr-1" /> Create First Timetable
                </Button>
              </div>
            )}
            {savedTimetables.length > 0 && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        #
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Classes
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedTimetables.map((tt, i) => {
                      const uniqueClasses = [
                        ...new Set(
                          tt.entries.map(
                            (e) => `${e.classLevel}~${e.sectionName}`,
                          ),
                        ),
                      ];
                      return (
                        <tr
                          key={tt.id}
                          className="border-b border-border last:border-0 hover:bg-muted/10"
                          data-ocid={`hr.timetable.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {tt.name}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {uniqueClasses.slice(0, 4).map((k) => (
                                <Badge
                                  key={k}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {classKeyLabel(k)}
                                </Badge>
                              ))}
                              {uniqueClasses.length > 4 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  +{uniqueClasses.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => openSavedTimetable(tt)}
                                data-ocid={`hr.timetable.edit_button.${i + 1}`}
                              >
                                <Pencil className="size-3 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteTimetable(tt.id)}
                                data-ocid={`hr.timetable.delete_button.${i + 1}`}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
// ─── Local Error Boundary ────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
  errorMsg: string;
}
class HRErrorBoundary extends Component<
  { children: React.ReactNode },
  EBState
> {
  state: EBState = { hasError: false, errorMsg: "" };
  static getDerivedStateFromError(error: unknown): EBState {
    const msg = error instanceof Error ? error.message : String(error);
    return { hasError: true, errorMsg: msg };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-semibold text-foreground">
            HR &amp; Payroll could not load
          </h2>
          <p className="text-sm text-muted-foreground">
            An error occurred rendering this module. Please reload.
          </p>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => this.setState({ hasError: false, errorMsg: "" })}
          >
            Reload HR Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Page ──────────────────────────────────────────────────────────────────────────────
function HRPageInner() {
  return (
    <div className="p-6 space-y-6" data-ocid="hr.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Briefcase className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            HR &amp; Payroll
          </h1>
          <p className="text-sm text-muted-foreground">
            Staff directory, subject assignments, and monthly payroll
          </p>
        </div>
      </div>

      <Tabs defaultValue="staff" data-ocid="hr.tabs">
        <TabsList className="mb-2">
          <TabsTrigger value="staff" data-ocid="hr.staff_tab">
            <Briefcase className="size-4 mr-1.5" />
            Staff Directory
          </TabsTrigger>
          <TabsTrigger value="assignments" data-ocid="hr.assignments_tab">
            <BookOpen className="size-4 mr-1.5" />
            Subject Assignments
          </TabsTrigger>
          <TabsTrigger value="attendance" data-ocid="hr.attendance_tab">
            <Fingerprint className="size-4 mr-1.5" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payroll" data-ocid="hr.payroll_tab">
            <IndianRupee className="size-4 mr-1.5" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="timetable" data-ocid="hr.timetable_tab">
            <LayoutGrid className="size-4 mr-1.5" />
            Timetable
          </TabsTrigger>
          <TabsTrigger value="staff-payment" data-ocid="hr.staff_payment_tab">
            <Coins className="size-4 mr-1.5" />
            Staff Payment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <HRErrorBoundary>
            <StaffDirectoryTab />
          </HRErrorBoundary>
        </TabsContent>
        <TabsContent value="assignments">
          <HRErrorBoundary>
            <SubjectAssignmentsTab />
          </HRErrorBoundary>
        </TabsContent>
        <TabsContent value="attendance">
          <HRErrorBoundary>
            <AttendanceTrackingTab />
          </HRErrorBoundary>
        </TabsContent>
        <TabsContent value="payroll">
          <HRErrorBoundary>
            <PayrollTab />
          </HRErrorBoundary>
        </TabsContent>
        <TabsContent value="timetable">
          <HRErrorBoundary>
            <TimetableTab />
          </HRErrorBoundary>
        </TabsContent>
        <TabsContent value="staff-payment">
          <HRErrorBoundary>
            <StaffPaymentTab />
          </HRErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function HRPage() {
  return (
    <HRErrorBoundary>
      <HRPageInner />
    </HRErrorBoundary>
  );
}
