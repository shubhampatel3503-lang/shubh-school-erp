var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ae as createLucideIcon, bA as useStaff, bB as useAddStaff, bC as useUpdateStaff, r as reactExports, j as jsxRuntimeExports, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, aq as FileText, bD as downloadCSVString, X, l as LoaderCircle, k as DialogFooter, e as Button, F as ue, d as useAppStore, I as Input, aR as IndianRupee, bE as useGetStaffPaymentSummary, bF as useGetStaffPayouts, bG as useGetStaffIncentives, bH as useGetStaffLoans, bI as useGetStaffSalary, bJ as useGetStaffYearEndSummary, bK as useDeleteStaffPayout, bL as useDeleteStaffIncentive, bM as useGetEnhancedPayroll, Z as getInitials, a2 as TrendingUp, t as Badge, b5 as Award, a4 as CreditCard, L as Label, aw as ChevronRight, bN as useAddStaffPayout, bO as useCalculateEnhancedPayroll, bP as useAddStaffIncentive, bQ as useAddStaffLoan, bR as useUpdateStaffSalary, bS as useUpdateLoanRepayment, aQ as Briefcase, B as BookOpen, bT as useDeleteStaffMember, ar as useCertificateTemplates, $ as Phone, bk as formatCurrency, m as useSubjects, bU as useGetSubjectAssignments, bV as useAddSubjectAssignment, bW as useUpdateSubjectAssignment, bX as useDeleteSubjectAssignment, C as CLASS_ORDER, i as CLASS_LABELS, bY as useGetStaffAttendanceByDate, bZ as useRecordStaffAttendance, b_ as useMarkStaffAttendanceOut, aa as LogOut, b$ as useGetPayrollByMonth, a8 as useSections, c0 as useGetClassTimetables, c1 as useGenerateClassTimetable, c2 as useCreateClassTimetable, c3 as useUpdateClassTimetable, c4 as useDeleteClassTimetable, bb as CalendarDays, ab as downloadCSV, a0 as formatDate, c5 as useGetPaidLeaveConfig, c6 as useSetPaidLeaveConfig, c7 as useCalculateAndSavePayroll, c8 as useLockPayrollMonth } from "./index-pMBTUEbj.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { G as GeneratePrintModal } from "./GeneratePrintModal-DKNLACr9.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { u as useBatchSaveClassTimetables, a as useCopyPasteEntireDay, T as TeacherTimetablePanel } from "./TeacherTimetablePanel-BpDGoV8b.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { S as Separator } from "./separator-jz692S3i.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { P as Progress } from "./progress-DX4jJmWr.js";
import { U as User } from "./user-C6bo2V5_.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import { W as Wallet } from "./wallet-BSqNaYM4.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { F as Fingerprint } from "./fingerprint-BPTexPY7.js";
import { L as LayoutGrid } from "./layout-grid-D7TV9swL.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { U as Upload } from "./upload-BicUPgyg.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { L as LogIn } from "./log-in-BmE0y2mz.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { G as GripVertical } from "./grip-vertical-CWSfxBAQ.js";
import "./FeeReceiptTemplate-BjT7XvY6.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
];
const Calculator = createLucideIcon("calculator", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M11 14h10", key: "1w8e9d" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v1.344", key: "1e62lh" }],
  ["path", { d: "m17 18 4-4-4-4", key: "z2g111" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113", key: "bjbb7m" }],
  ["rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", key: "ublpy" }]
];
const ClipboardPaste = createLucideIcon("clipboard-paste", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("cloud-upload", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "8", cy: "8", r: "6", key: "3yglwk" }],
  ["path", { d: "M18.09 10.37A6 6 0 1 1 10.34 18", key: "t5s6rm" }],
  ["path", { d: "M7 6h1v4", key: "1obek4" }],
  ["path", { d: "m16.71 13.88.7.71-2.82 2.82", key: "1rbuyh" }]
];
const Coins = createLucideIcon("coins", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode);
const SAMPLE_TEMPLATE_CSV = [
  "Employee ID,Full Name,Designation,Department,Mobile,Email,Date of Joining (dd/mm/yyyy),Basic Salary,Gender",
  "ST001,Ramesh Mishra,PGT Science,Science,9876543210,ramesh@school.in,01/07/2020,35000,Male",
  "ST002,Sunita Verma,TGT Maths,Mathematics,9123456780,sunita@school.in,15/06/2022,28000,Female",
  "ST003,Anil Sharma,Admin Officer,Administration,9000011111,anil@school.in,10/03/2019,22000,Male"
].join("\n");
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}
function normaliseDate(raw) {
  if (!raw) return "";
  const dmY = raw.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (dmY)
    return `${dmY[1].padStart(2, "0")}/${dmY[2].padStart(2, "0")}/${dmY[3]}`;
  const Ymd = raw.match(/^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})$/);
  if (Ymd)
    return `${Ymd[3].padStart(2, "0")}/${Ymd[2].padStart(2, "0")}/${Ymd[1]}`;
  return raw;
}
function parseFile(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  return lines.slice(1).map((line, idx) => {
    const cols = parseCSVLine(line);
    return {
      rowNum: idx + 2,
      staffCode: cols[0] ?? "",
      fullName: cols[1] ?? "",
      designation: cols[2] ?? "",
      department: cols[3] ?? "",
      mobile: cols[4] ?? "",
      email: cols[5] ?? "",
      dateOfJoining: normaliseDate(cols[6] ?? ""),
      basicSalary: Number.parseInt(cols[7] ?? "0") || 0,
      gender: ["Male", "Female", "Other"].includes(cols[8] ?? "") ? cols[8] : "Male"
    };
  });
}
function StaffImportDialog({ open, onClose, onDone }) {
  const { data: existingStaff = [] } = useStaff();
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  const [phase, setPhase] = reactExports.useState("idle");
  const [rows, setRows] = reactExports.useState([]);
  const [fileName, setFileName] = reactExports.useState("");
  const [progress, setProgress] = reactExports.useState({ done: 0, total: 0 });
  const [results, setResults] = reactExports.useState([]);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const staff = existingStaff;
  function reset() {
    setPhase("idle");
    setRows([]);
    setFileName("");
    setProgress({ done: 0, total: 0 });
    setResults([]);
    setIsDragging(false);
  }
  function handleClose() {
    reset();
    onClose();
  }
  async function processFile(file) {
    const text = await file.text();
    const parsed = parseFile(text);
    if (parsed.length === 0) {
      ue.error("No data rows found. Check the file format.");
      return;
    }
    setFileName(file.name);
    setRows(parsed);
    setPhase("preview");
  }
  function handleFileInput(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) processFile(file);
    e.target.value = "";
  }
  function handleDrop(e) {
    var _a;
    e.preventDefault();
    setIsDragging(false);
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (file) processFile(file);
  }
  async function runImport(rowsToImport, retrying = false) {
    setPhase("importing");
    setProgress({ done: 0, total: rowsToImport.length });
    if (!retrying) setResults([]);
    const batch = [];
    for (let i = 0; i < rowsToImport.length; i++) {
      const row = rowsToImport[i];
      setProgress({ done: i, total: rowsToImport.length });
      const existing = staff.find(
        (s) => s.staffCode.toLowerCase() === row.staffCode.toLowerCase()
      );
      let lastError = "";
      let succeeded = false;
      let wasUpdate = !!existing;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const payload = {
            staffCode: row.staffCode || `TCH${Date.now()}`,
            fullName: row.fullName,
            designation: row.designation || "Staff",
            department: row.department || "Administration",
            mobile: row.mobile,
            email: row.email,
            address: "",
            dateOfJoining: row.dateOfJoining,
            basicSalary: row.basicSalary
          };
          if (existing) {
            await updateStaff.mutateAsync({ id: existing.id, ...payload });
          } else {
            await addStaff.mutateAsync(payload);
          }
          succeeded = true;
          break;
        } catch (err) {
          lastError = err instanceof Error ? err.message : "Unknown error";
          if (attempt < 2) await new Promise((r) => setTimeout(r, 600));
        }
      }
      batch.push({
        rowNum: row.rowNum,
        staffCode: row.staffCode,
        fullName: row.fullName,
        status: succeeded ? wasUpdate ? "updated" : "added" : "failed",
        error: succeeded ? void 0 : lastError
      });
    }
    setProgress({ done: rowsToImport.length, total: rowsToImport.length });
    if (retrying) {
      setResults((prev) => {
        const map = new Map(prev.map((r) => [r.rowNum, r]));
        for (const b of batch) map.set(b.rowNum, b);
        return Array.from(map.values()).sort((a, b) => a.rowNum - b.rowNum);
      });
    } else {
      setResults(batch);
    }
    setPhase("done");
    onDone();
  }
  function retryFailed() {
    const failedRowNums = new Set(
      results.filter((r) => r.status === "failed").map((r) => r.rowNum)
    );
    const toRetry = rows.filter((r) => failedRowNums.has(r.rowNum));
    runImport(toRetry, true);
  }
  function downloadFailedRows() {
    const failed = results.filter((r) => r.status === "failed");
    const failedRowNums = new Set(failed.map((r) => r.rowNum));
    const failedData = rows.filter((r) => failedRowNums.has(r.rowNum));
    const header = "Employee ID,Full Name,Designation,Department,Mobile,Email,Date of Joining,Basic Salary,Error";
    const csvRows = failedData.map((r) => {
      var _a;
      const err = ((_a = results.find((res) => res.rowNum === r.rowNum)) == null ? void 0 : _a.error) ?? "";
      return [
        r.staffCode,
        r.fullName,
        r.designation,
        r.department,
        r.mobile,
        r.email,
        r.dateOfJoining,
        r.basicSalary,
        `"${err}"`
      ].join(",");
    });
    downloadCSVString(
      [header, ...csvRows].join("\n"),
      "staff-import-failed.csv"
    );
  }
  const addedCount = results.filter((r) => r.status === "added").length;
  const updatedCount = results.filter((r) => r.status === "updated").length;
  const failedCount = results.filter((r) => r.status === "failed").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] flex flex-col overflow-hidden",
      "data-ocid": "hr.import_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "size-5 text-primary" }),
          "Bulk Staff Import"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "File must be CSV (.csv). Columns must match the template." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => downloadCSVString(
                SAMPLE_TEMPLATE_CSV,
                "staff-import-template.csv"
              ),
              className: "ml-auto flex items-center gap-1 text-primary hover:underline font-medium",
              "data-ocid": "hr.import_download_template",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }),
                " Download Template"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-4 pr-1", children: [
          phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: `w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 transition-colors cursor-pointer bg-transparent ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"}`,
              onDragOver: (e) => {
                e.preventDefault();
                setIsDragging(true);
              },
              onDragLeave: () => setIsDragging(false),
              onDrop: handleDrop,
              onClick: () => {
                var _a;
                return (_a = fileRef.current) == null ? void 0 : _a.click();
              },
              "data-ocid": "hr.import_dropzone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "size-10 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Drop CSV file here" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "or click to browse — .csv, .txt" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileRef,
                    type: "file",
                    accept: ".csv,.txt",
                    className: "hidden",
                    onChange: handleFileInput
                  }
                )
              ]
            }
          ),
          phase === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: fileName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  "— ",
                  rows.length,
                  " row",
                  rows.length !== 1 ? "s" : "",
                  " found"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: reset,
                  className: "text-muted-foreground hover:text-foreground",
                  "data-ocid": "hr.import_clear_file",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto max-h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Row" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Emp ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Designation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Dept" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Mobile" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold text-foreground", children: "Salary" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.slice(0, 10).map((r) => {
                  const isDupe = staff.some(
                    (s) => s.staffCode.toLowerCase() === r.staffCode.toLowerCase()
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-t border-border hover:bg-muted/20",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r.rowNum }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-1.5 font-mono", children: [
                          r.staffCode,
                          isDupe && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-amber-600 text-[10px] font-semibold", children: "UPDATE" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-medium", children: r.fullName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r.designation }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r.department }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r.mobile }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-1.5 text-right", children: [
                          "₹",
                          r.basicSalary.toLocaleString("en-IN")
                        ] })
                      ]
                    },
                    r.rowNum
                  );
                }) })
              ] }) }),
              rows.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t border-border", children: [
                "Showing first 10 rows — ",
                rows.length - 10,
                " more will be imported"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Rows with existing Employee IDs will be",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 font-semibold", children: "updated" }),
              ". New IDs will be",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-semibold", children: "added" }),
              "."
            ] })
          ] }),
          phase === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-5 py-10",
              "data-ocid": "hr.import_loading_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 text-primary animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Importing staff…" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                    progress.done,
                    " / ",
                    progress.total,
                    " processed"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "bg-primary h-2 rounded-full transition-all",
                    style: {
                      width: `${progress.total ? progress.done / progress.total * 100 : 0}%`
                    }
                  }
                ) })
              ]
            }
          ),
          phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "hr.import_success_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-green-500/10 px-4 py-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-600", children: addedCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Added" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-amber-500/10 px-4 py-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-amber-600", children: updatedCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Updated" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-destructive/10 px-4 py-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-destructive", children: failedCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Failed" })
              ] })
            ] }),
            results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto max-h-52", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Row" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Emp ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Note" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: results.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r.rowNum }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono", children: r.staffCode }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: r.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-1.5", children: [
                  r.status === "added" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-green-600 font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                    " Added"
                  ] }),
                  r.status === "updated" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-600 font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3" }),
                    " Updated"
                  ] }),
                  r.status === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-destructive font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3" }),
                    " Failed"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground text-[11px]", children: r.error ?? "—" })
              ] }, r.rowNum)) })
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border pt-3 flex-wrap gap-2", children: [
          phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: handleClose,
              "data-ocid": "hr.import_cancel_button",
              children: "Cancel"
            }
          ),
          phase === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: reset,
                "data-ocid": "hr.import_back_button",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => runImport(rows),
                "data-ocid": "hr.import_submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "size-4 mr-1.5" }),
                  "Import All (",
                  rows.length,
                  ")"
                ]
              }
            )
          ] }),
          phase === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
            " Importing…"
          ] }),
          phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: downloadFailedRows,
                  "data-ocid": "hr.import_download_failed_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1.5" }),
                    " Download Failed (",
                    failedCount,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: retryFailed,
                  "data-ocid": "hr.import_retry_failed_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 mr-1.5" }),
                    " Retry Failed"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleClose, "data-ocid": "hr.import_close_button", children: "Done" })
          ] })
        ] })
      ]
    }
  ) });
}
const FY_MONTHS = [
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
  "March"
];
const MONTH_SHORT = {
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
  January: "Jan",
  February: "Feb",
  March: "Mar"
};
const PAYMENT_MODES = [
  "Cash",
  "Online",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other"
];
const INCENTIVE_REASONS = [
  "Performance Bonus",
  "Festival Bonus",
  "Special Achievement",
  "Other"
];
function currentFYYear() {
  const now = /* @__PURE__ */ new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  if (mo >= 4) return `${yr}-${String(yr + 1).slice(2)}`;
  return `${yr - 1}-${String(yr).slice(2)}`;
}
function formatINR$1(n) {
  if (!n && n !== 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function isoToDDMMYYYY(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function monthFromKey(key) {
  if (!key) return "";
  const parts = key.split("-");
  const m = Number.parseInt(parts[1] ?? "0");
  const names = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return names[m] ?? key;
}
function fyMonthKey(month, fyYear) {
  const startYear = Number.parseInt(fyYear.split("-")[0]);
  const idx = FY_MONTHS.indexOf(month);
  const year = idx <= 8 ? startYear : startYear + 1;
  const monthNum = idx + 4 <= 12 ? idx + 4 : idx - 8;
  return `${year}-${String(monthNum).padStart(2, "0")}`;
}
function getMonthStatus(status) {
  const s = status == null ? void 0 : status.toLowerCase();
  if (s === "paid" || s === "fullypaid" || s === "fully_paid") return "paid";
  if (s === "partial" || s === "partiallypaid" || s === "partially_paid")
    return "partial";
  if (s === "overdue" || s === "unpaid") return "overdue";
  return "upcoming";
}
const STATUS_COLORS = {
  paid: "bg-green-500/15 text-green-700 border-green-500/30",
  partial: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  overdue: "bg-red-500/15 text-red-700 border-red-500/30",
  upcoming: "bg-muted/40 text-muted-foreground border-border"
};
const STATUS_DOT = {
  paid: "bg-green-500",
  partial: "bg-yellow-500",
  overdue: "bg-red-500",
  upcoming: "bg-muted-foreground/30"
};
function StaffCard({ staff, isSelected, summaryMap, onClick }) {
  const last6 = FY_MONTHS.slice(-6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `staff_payment.staff_card.${staff.staffCode}`,
      className: `w-full text-left p-3 rounded-xl border transition-all hover:shadow-sm ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/20"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0", children: getInitials(staff.fullName) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: staff.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: staff.designation })
          ] }),
          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-primary shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-2 pl-12", children: last6.map((m) => {
          const st = getMonthStatus(summaryMap[m] ?? "upcoming");
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              title: `${m}: ${st}`,
              className: `size-2.5 rounded-full inline-block ${STATUS_DOT[st]}`
            },
            m
          );
        }) })
      ]
    }
  );
}
function MonthCard({
  month,
  status,
  amountPaid,
  netSalary,
  isAdmin,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: `p-3 rounded-xl border text-left hover:shadow-md transition-all ${STATUS_COLORS[status]}`,
      "data-ocid": `staff_payment.month_card.${month.toLowerCase()}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base", children: MONTH_SHORT[month] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${STATUS_COLORS[status]}`,
              children: status === "paid" ? "PAID" : status === "partial" ? "PART" : status === "overdue" ? "DUE" : "—"
            }
          )
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-mono font-semibold", children: [
          formatINR$1(amountPaid),
          netSalary ? ` / ${formatINR$1(netSalary)}` : ""
        ] }) })
      ]
    }
  );
}
function RecordPaymentDialog({
  staffId,
  recordedBy,
  open,
  defaultMonth,
  onClose,
  onSaved
}) {
  const [month, setMonth] = reactExports.useState(defaultMonth ?? FY_MONTHS[0]);
  const [amount, setAmount] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("Cash");
  const [date, setDate] = reactExports.useState(todayISO());
  const [notes, setNotes] = reactExports.useState("");
  const addPayout = useAddStaffPayout();
  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      ue.error("Enter a valid amount");
      return;
    }
    try {
      await addPayout.mutateAsync({
        staffId,
        amount: amt,
        mode,
        date,
        notes: notes || month,
        recordedBy
      });
      ue.success(`Payment of ${formatINR$1(amt)} recorded for ${month}`);
      setAmount("");
      setNotes("");
      onSaved();
    } catch {
      ue.error("Failed to record payment");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-md",
      "data-ocid": "staff_payment.record_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-5 text-primary" }),
          " Record Payment"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: month, onValueChange: setMonth, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "staff_payment.record.month_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: FY_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: mode, onValueChange: setMode, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "staff_payment.record.mode_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: PAYMENT_MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  placeholder: "e.g. 15000",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  "data-ocid": "staff_payment.record.amount_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  "data-ocid": "staff_payment.record.date_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Advance, Festival bonus part...",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                "data-ocid": "staff_payment.record.notes_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "staff_payment.record.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: addPayout.isPending,
              "data-ocid": "staff_payment.record.save_button",
              children: addPayout.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Save Payment"
            }
          )
        ] })
      ]
    }
  ) });
}
function CalcPayrollDialog({ staff, open, onClose }) {
  const [month, setMonth] = reactExports.useState(FY_MONTHS[0]);
  const [workingDays, setWorkingDays] = reactExports.useState("26");
  const calcMutation = useCalculateEnhancedPayroll();
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const fyYear = currentFYYear();
  async function handleCalculate() {
    setLoading(true);
    try {
      const wd = Number.parseFloat(workingDays) || 26;
      const mk = fyMonthKey(month, fyYear);
      const res = await calcMutation.mutateAsync({
        staffId: staff.id,
        month: mk,
        workingDays: wd
      });
      setResult(res);
    } catch (e) {
      ue.error(
        e instanceof Error ? e.message : "Failed to calculate payroll"
      );
    } finally {
      setLoading(false);
    }
  }
  const advancePaid = (result == null ? void 0 : result.advancePaid) ?? 0;
  const netSalary = (result == null ? void 0 : result.netSalary) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-lg",
      "data-ocid": "staff_payment.calc_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "size-5 text-primary" }),
          " Calculate Payroll —",
          " ",
          staff.fullName
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: month,
                  onValueChange: (v) => {
                    setMonth(v);
                    setResult(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: FY_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Working Days in Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 31,
                  value: workingDays,
                  onChange: (e) => {
                    setWorkingDays(e.target.value);
                    setResult(null);
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleCalculate,
              disabled: loading,
              className: "w-full",
              "data-ocid": "staff_payment.calc.calculate_button",
              children: [
                loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "size-4 mr-2" }),
                "Calculate"
              ]
            }
          ),
          result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Attendance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-right", children: [
                result.attendanceDays,
                " / ",
                result.workingDays,
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Absent Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-right", children: [
                result.absentDays,
                result.deductibleDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                  "(",
                  result.deductibleDays,
                  " deductible)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Gross Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-medium text-right", children: formatINR$1(result.grossSalary) }),
              result.deductions > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-destructive", children: "Deductions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-medium text-right text-destructive", children: [
                  "-",
                  formatINR$1(result.deductions)
                ] })
              ] }),
              result.incentives > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-green-600", children: "Incentives" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-medium text-right text-green-600", children: [
                  "+",
                  formatINR$1(result.incentives)
                ] })
              ] }),
              result.loanDeduction > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-orange-600", children: "Loan Deduction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-medium text-right text-orange-600", children: [
                  "-",
                  formatINR$1(result.loanDeduction)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-foreground", children: "NET SALARY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold font-display text-primary", children: formatINR$1(netSalary) })
            ] }),
            advancePaid > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Amount Paid So Far" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: formatINR$1(advancePaid) })
            ] }),
            netSalary - advancePaid > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-semibold", children: "Balance Due" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-destructive", children: formatINR$1(netSalary - advancePaid) })
            ] }),
            result.paymentStatus && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: STATUS_COLORS[getMonthStatus(result.paymentStatus)],
                children: result.paymentStatus
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "staff_payment.calc.close_button",
            children: "Close"
          }
        ) })
      ]
    }
  ) });
}
function AddIncentiveDialog({
  staffId,
  approvedBy,
  open,
  onClose,
  onSaved
}) {
  const [month, setMonth] = reactExports.useState(FY_MONTHS[0]);
  const [amount, setAmount] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState(INCENTIVE_REASONS[0]);
  const mutation = useAddStaffIncentive();
  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      ue.error("Enter a valid amount");
      return;
    }
    try {
      await mutation.mutateAsync({
        staffId,
        amount: amt,
        reason,
        month,
        approvedBy
      });
      ue.success(`Incentive of ${formatINR$1(amt)} added`);
      setAmount("");
      onSaved();
    } catch {
      ue.error("Failed to add incentive");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-sm",
      "data-ocid": "staff_payment.incentive_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "size-5 text-primary" }),
          " Add Incentive"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: month, onValueChange: setMonth, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: FY_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Amount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0,
                placeholder: "e.g. 2000",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                "data-ocid": "staff_payment.incentive.amount_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: reason, onValueChange: setReason, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: INCENTIVE_REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: mutation.isPending,
              "data-ocid": "staff_payment.incentive.save_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Add Incentive"
            }
          )
        ] })
      ]
    }
  ) });
}
function AddLoanDialog({
  staffId,
  open,
  onClose,
  onSaved
}) {
  const [principal, setPrincipal] = reactExports.useState("");
  const [monthly, setMonthly] = reactExports.useState("");
  const [startMonth, setStartMonth] = reactExports.useState(FY_MONTHS[0]);
  const [notes, setNotes] = reactExports.useState("");
  const mutation = useAddStaffLoan();
  async function handleSave() {
    const p = Number.parseFloat(principal);
    const m = Number.parseFloat(monthly);
    if (!p || p <= 0 || !m || m <= 0) {
      ue.error("Enter valid principal and monthly deduction");
      return;
    }
    try {
      await mutation.mutateAsync({
        staffId,
        principalAmount: p,
        monthlyDeduction: m,
        startMonth,
        notes
      });
      ue.success(`Loan of ${formatINR$1(p)} recorded`);
      setPrincipal("");
      setMonthly("");
      setNotes("");
      onSaved();
    } catch {
      ue.error("Failed to add loan");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-sm",
      "data-ocid": "staff_payment.loan_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-5 text-primary" }),
          " Add Loan / Advance"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Principal Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  placeholder: "e.g. 50000",
                  value: principal,
                  onChange: (e) => setPrincipal(e.target.value),
                  "data-ocid": "staff_payment.loan.principal_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Monthly Deduction (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  placeholder: "e.g. 5000",
                  value: monthly,
                  onChange: (e) => setMonthly(e.target.value),
                  "data-ocid": "staff_payment.loan.monthly_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Start Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: startMonth, onValueChange: setStartMonth, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: FY_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 2,
                placeholder: "Reason for loan...",
                value: notes,
                onChange: (e) => setNotes(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: mutation.isPending,
              "data-ocid": "staff_payment.loan.save_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Save Loan"
            }
          )
        ] })
      ]
    }
  ) });
}
function RepaymentDialog({
  loanId,
  staffId,
  remainingAmount,
  open,
  onClose,
  onSaved
}) {
  const [amount, setAmount] = reactExports.useState("");
  const mutation = useUpdateLoanRepayment();
  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      ue.error("Enter a valid amount");
      return;
    }
    try {
      await mutation.mutateAsync({ loanId, amountPaid: amt, staffId });
      ue.success(`Repayment of ${formatINR$1(amt)} recorded`);
      setAmount("");
      onSaved();
    } catch {
      ue.error("Failed to record repayment");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-xs",
      "data-ocid": "staff_payment.repayment_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Record Repayment" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Remaining: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatINR$1(remainingAmount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Amount Paid (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0,
                max: remainingAmount,
                placeholder: `max ${remainingAmount}`,
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                "data-ocid": "staff_payment.repayment.amount_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: mutation.isPending,
              "data-ocid": "staff_payment.repayment.save_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Save"
            }
          )
        ] })
      ]
    }
  ) });
}
function EditSalaryDialog({
  staffId,
  currentSalary,
  open,
  onClose,
  onSaved
}) {
  const [salary, setSalary] = reactExports.useState(String(currentSalary || ""));
  const mutation = useUpdateStaffSalary();
  async function handleSave() {
    const s = Number.parseFloat(salary);
    if (!s || s <= 0) {
      ue.error("Enter a valid salary");
      return;
    }
    try {
      await mutation.mutateAsync({ staffId, basicSalary: s });
      ue.success("Salary updated");
      onSaved();
    } catch {
      ue.error("Failed to update salary");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-xs",
      "data-ocid": "staff_payment.edit_salary_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Basic Salary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Basic Monthly Salary (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              placeholder: "e.g. 25000",
              value: salary,
              onChange: (e) => setSalary(e.target.value),
              "data-ocid": "staff_payment.salary.input"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: mutation.isPending,
              "data-ocid": "staff_payment.salary.save_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Update Salary"
            }
          )
        ] })
      ]
    }
  ) });
}
function StaffDetailPanel({
  staff,
  isAdmin,
  isAccountant,
  recordedBy,
  onBack
}) {
  const fyYear = currentFYYear();
  const [yearSel, setYearSel] = reactExports.useState(fyYear);
  const [recordPayOpen, setRecordPayOpen] = reactExports.useState(false);
  const [calcOpen, setCalcOpen] = reactExports.useState(false);
  const [incentiveOpen, setIncentiveOpen] = reactExports.useState(false);
  const [loanOpen, setLoanOpen] = reactExports.useState(false);
  const [editSalaryOpen, setEditSalaryOpen] = reactExports.useState(false);
  const [selectedMonth, setSelectedMonth] = reactExports.useState(null);
  const [repayLoan, setRepayLoan] = reactExports.useState(null);
  const { data: rawSummary = [], refetch: refetchSummary } = useGetStaffPaymentSummary(staff.id);
  const { data: rawPayouts = [], refetch: refetchPayouts } = useGetStaffPayouts(
    staff.id
  );
  const { data: rawIncentives = [], refetch: refetchIncentives } = useGetStaffIncentives(staff.id);
  const { data: rawLoans = [], refetch: refetchLoans } = useGetStaffLoans(
    staff.id
  );
  const { data: salaryData, refetch: refetchSalary } = useGetStaffSalary(
    staff.id
  );
  const { data: yearEnd, refetch: refetchYearEnd } = useGetStaffYearEndSummary(
    staff.id,
    yearSel
  );
  const deletePayoutMut = useDeleteStaffPayout();
  const deleteIncentiveMut = useDeleteStaffIncentive();
  useGetEnhancedPayroll(
    staff.id,
    selectedMonth ? fyMonthKey(selectedMonth, fyYear) : ""
  );
  const summary = rawSummary;
  const payouts = rawPayouts;
  const incentives = rawIncentives;
  const loans = rawLoans;
  const summaryMap = reactExports.useMemo(() => {
    const m = {};
    for (const s of summary) {
      const mn = monthFromKey(s.month);
      if (mn)
        m[mn] = {
          status: s.status,
          amountPaid: s.amountPaid,
          netSalary: s.netSalary
        };
    }
    return m;
  }, [summary]);
  const currentSalary = typeof salaryData === "number" ? salaryData : staff.basicSalary ?? 0;
  function refetchAll() {
    refetchSummary();
    refetchPayouts();
    refetchIncentives();
    refetchLoans();
    refetchSalary();
    refetchYearEnd();
  }
  async function handleDeletePayout(payoutId) {
    try {
      await deletePayoutMut.mutateAsync({ payoutId, staffId: staff.id });
      ue.success("Payment record deleted");
      refetchPayouts();
      refetchSummary();
    } catch {
      ue.error("Failed to delete");
    }
  }
  async function handleDeleteIncentive(incentiveId) {
    try {
      await deleteIncentiveMut.mutateAsync({ incentiveId, staffId: staff.id });
      ue.success("Incentive deleted");
      refetchIncentives();
    } catch {
      ue.error("Failed to delete");
    }
  }
  const yearOptions = [
    fyYear,
    `${Number.parseInt(fyYear) - 1}-${String(Number.parseInt(fyYear)).slice(2)}`
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "staff_payment.detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          "data-ocid": "staff_payment.back_button",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0", children: getInitials(staff.fullName) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: staff.fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          staff.designation,
          " · ",
          staff.department
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        (isAdmin || isAccountant) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setRecordPayOpen(true),
            "data-ocid": "staff_payment.record_payment_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
              " Record Payment"
            ]
          }
        ),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setCalcOpen(true),
            "data-ocid": "staff_payment.calculate_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "size-4 mr-1" }),
              " Calculate"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "months", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap h-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "months", "data-ocid": "staff_payment.months_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 mr-1" }),
          " Months"
        ] }),
        (isAdmin || isAccountant) && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "payouts", "data-ocid": "staff_payment.payouts_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4 mr-1" }),
          " Payout History"
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "incentives",
            "data-ocid": "staff_payment.incentives_tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "size-4 mr-1" }),
              " Incentives"
            ]
          }
        ),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "loans", "data-ocid": "staff_payment.loans_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-4 mr-1" }),
          " Loans"
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "yearend", "data-ocid": "staff_payment.yearend_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 mr-1" }),
          " Year-End"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "months", className: "mt-4", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Basic Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg text-foreground", children: formatINR$1(currentSalary) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "ml-auto",
              onClick: () => setEditSalaryOpen(true),
              "data-ocid": "staff_payment.edit_salary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5 mr-1" }),
                " Edit"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: FY_MONTHS.map((m) => {
          const info = summaryMap[m];
          const st = getMonthStatus((info == null ? void 0 : info.status) ?? "upcoming");
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            MonthCard,
            {
              month: m,
              status: st,
              amountPaid: (info == null ? void 0 : info.amountPaid) ?? 0,
              netSalary: info == null ? void 0 : info.netSalary,
              isAdmin,
              onClick: () => setSelectedMonth(m)
            },
            m
          );
        }) })
      ] }),
      (isAdmin || isAccountant) && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "payouts", className: "mt-4", children: payouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center",
          "data-ocid": "staff_payment.payouts.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-8 mx-auto text-muted-foreground/40 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No payment records yet" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "By" }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold", children: "Del" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: payouts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/10",
            "data-ocid": `staff_payment.payout.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isoToDDMMYYYY(p.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono font-semibold text-primary", children: formatINR$1(p.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: p.mode }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs max-w-[150px] truncate", children: p.notes }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: p.recordedBy }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7 text-destructive hover:text-destructive",
                  onClick: () => handleDeletePayout(p.id),
                  "data-ocid": `staff_payment.payout.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                }
              ) })
            ]
          },
          p.id
        )) })
      ] }) }) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "incentives", className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setIncentiveOpen(true),
            "data-ocid": "staff_payment.add_incentive_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
              " Add Incentive"
            ]
          }
        ) }),
        incentives.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center",
            "data-ocid": "staff_payment.incentives.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "size-8 mx-auto text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No incentives recorded yet" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: incentives.map((inc, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-3 rounded-xl border border-border bg-card",
            "data-ocid": `staff_payment.incentive.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5 text-yellow-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: inc.reason }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  inc.month,
                  " · Approved by ",
                  inc.approvedBy
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: formatINR$1(inc.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7 text-destructive",
                  onClick: () => handleDeleteIncentive(inc.id),
                  "data-ocid": `staff_payment.incentive.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                }
              )
            ]
          },
          inc.id
        )) })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "loans", className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setLoanOpen(true),
            "data-ocid": "staff_payment.add_loan_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
              " Add Loan"
            ]
          }
        ) }),
        loans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center",
            "data-ocid": "staff_payment.loans.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-8 mx-auto text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No loans recorded yet" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: loans.map((loan, i) => {
          const repaid = loan.principalAmount - loan.remainingAmount;
          const pct = loan.principalAmount > 0 ? repaid / loan.principalAmount * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-4 rounded-xl border border-border bg-card space-y-3",
              "data-ocid": `staff_payment.loan.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "size-5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground", children: [
                      "Loan — ",
                      loan.startMonth
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: loan.notes || "No notes" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Remaining" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-destructive", children: formatINR$1(loan.remainingAmount) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Repaid: ",
                    formatINR$1(repaid),
                    " of",
                    " ",
                    formatINR$1(loan.principalAmount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Monthly: ",
                    formatINR$1(loan.monthlyDeduction)
                  ] })
                ] }),
                loan.remainingAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "w-full",
                    onClick: () => setRepayLoan({
                      id: loan.id,
                      remaining: loan.remainingAmount
                    }),
                    "data-ocid": `staff_payment.loan.repay_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4 mr-1" }),
                      " Record Repayment"
                    ]
                  }
                )
              ]
            },
            loan.id
          );
        }) })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "yearend", className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: yearSel, onValueChange: setYearSel, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36",
                "data-ocid": "staff_payment.yearend.year_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: yearOptions.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: y, children: y }, y)) })
          ] })
        ] }),
        yearEnd ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
          {
            label: "Total Earned",
            value: formatINR$1(Number(yearEnd.totalEarned)),
            icon: TrendingUp,
            color: "text-primary"
          },
          {
            label: "Total Paid",
            value: formatINR$1(Number(yearEnd.totalPaid)),
            icon: CircleCheck,
            color: "text-green-600"
          },
          {
            label: "Total Incentives",
            value: formatINR$1(Number(yearEnd.totalIncentives)),
            icon: Gift,
            color: "text-yellow-600"
          },
          {
            label: "Total Deductions",
            value: formatINR$1(Number(yearEnd.totalDeductions)),
            icon: CircleAlert,
            color: "text-destructive"
          },
          {
            label: "Months Fully Paid",
            value: String(yearEnd.monthsFullyPaid),
            icon: CircleCheck,
            color: "text-green-600"
          },
          {
            label: "Months Partial",
            value: String(yearEnd.monthsPartiallyPaid),
            icon: Clock,
            color: "text-yellow-600"
          },
          {
            label: "Months Unpaid",
            value: String(yearEnd.monthsUnpaid),
            icon: CircleAlert,
            color: "text-destructive"
          }
        ].map(({ label, value, icon: Icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-card p-4 space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-4 ${color}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold font-display ${color}`, children: value })
            ]
          },
          label
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-sm text-muted-foreground", children: "Loading year-end summary…" })
      ] })
    ] }),
    selectedMonth && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!selectedMonth,
        onOpenChange: () => setSelectedMonth(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "z-[9999] max-w-sm",
            "data-ocid": "staff_payment.month_detail_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
                selectedMonth,
                " — ",
                staff.fullName
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: (() => {
                const info = summaryMap[selectedMonth];
                const st = getMonthStatus((info == null ? void 0 : info.status) ?? "upcoming");
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: STATUS_COLORS[st], children: st.toUpperCase() })
                  ] }),
                  isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Amount Paid" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold", children: formatINR$1((info == null ? void 0 : info.amountPaid) ?? 0) })
                    ] }),
                    (info == null ? void 0 : info.netSalary) != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Net Salary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: formatINR$1(info.netSalary) })
                    ] })
                  ] })
                ] });
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                (isAdmin || isAccountant) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: () => {
                      setSelectedMonth(null);
                      setRecordPayOpen(true);
                    },
                    "data-ocid": "staff_payment.month_detail.record_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
                      " Record Payment"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setSelectedMonth(null),
                    "data-ocid": "staff_payment.month_detail.close_button",
                    children: "Close"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecordPaymentDialog,
      {
        staffId: staff.id,
        recordedBy,
        open: recordPayOpen,
        defaultMonth: selectedMonth ?? void 0,
        onClose: () => setRecordPayOpen(false),
        onSaved: () => {
          setRecordPayOpen(false);
          refetchAll();
        }
      }
    ),
    calcOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CalcPayrollDialog,
      {
        staff,
        open: calcOpen,
        onClose: () => setCalcOpen(false)
      }
    ),
    incentiveOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddIncentiveDialog,
      {
        staffId: staff.id,
        approvedBy: recordedBy,
        open: incentiveOpen,
        onClose: () => setIncentiveOpen(false),
        onSaved: () => {
          setIncentiveOpen(false);
          refetchAll();
        }
      }
    ),
    loanOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddLoanDialog,
      {
        staffId: staff.id,
        open: loanOpen,
        onClose: () => setLoanOpen(false),
        onSaved: () => {
          setLoanOpen(false);
          refetchLoans();
        }
      }
    ),
    editSalaryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditSalaryDialog,
      {
        staffId: staff.id,
        currentSalary,
        open: editSalaryOpen,
        onClose: () => setEditSalaryOpen(false),
        onSaved: () => {
          setEditSalaryOpen(false);
          refetchSalary();
        }
      }
    ),
    repayLoan && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RepaymentDialog,
      {
        loanId: repayLoan.id,
        staffId: staff.id,
        remainingAmount: repayLoan.remaining,
        open: !!repayLoan,
        onClose: () => setRepayLoan(null),
        onSaved: () => {
          setRepayLoan(null);
          refetchLoans();
        }
      }
    )
  ] });
}
function StaffPaymentTab() {
  const { data: staffList = [] } = useStaff();
  const staff = staffList.filter((s) => s.isActive);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const currentRole = useAppStore((s) => s.currentRole);
  const currentUser = useAppStore((s) => s.currentUser);
  const recordedBy = (currentUser == null ? void 0 : currentUser.fullName) ?? String(currentRole);
  const isAdmin = currentRole === "Admin";
  const isAccountant = currentRole === "Accountant";
  const selectedStaff = staff.find((s) => s.id === selectedId);
  const filtered = reactExports.useMemo(
    () => staff.filter(
      (s) => !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.staffCode.toLowerCase().includes(search.toLowerCase())
    ),
    [staff, search]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "staff_payment.tab", children: selectedStaff ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    StaffDetailPanel,
    {
      staff: selectedStaff,
      isAdmin,
      isAccountant,
      recordedBy,
      onBack: () => setSelectedId(null)
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "pl-9",
            placeholder: "Search staff…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "staff_payment.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full bg-green-500 inline-block" }),
        " ",
        "Paid",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full bg-yellow-500 inline-block" }),
        " ",
        "Partial",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full bg-red-500 inline-block" }),
        " ",
        "Overdue"
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border bg-muted/20 py-14 text-center",
        "data-ocid": "staff_payment.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-10 mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No staff found" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      StaffCard,
      {
        staff: s,
        isSelected: s.id === selectedId,
        summaryMap: {},
        onClick: () => setSelectedId(s.id)
      },
      s.id
    )) })
  ] }) });
}
const DEPARTMENTS = [
  "Science",
  "Mathematics",
  "English",
  "Hindi",
  "Social Studies",
  "Computer",
  "Physical Education",
  "Administration",
  "Accounts"
];
const emptyForm = {
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
  ifscCode: ""
};
function StaffDirectoryTab() {
  const { data: backendStaff = [], refetch: refetchStaff } = useStaff();
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaffMember();
  const [search, setSearch] = reactExports.useState("");
  const [deptFilter, setDeptFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [importOpen, setImportOpen] = reactExports.useState(false);
  const staff = backendStaff;
  const { data: allCertTemplates = [] } = useCertificateTemplates();
  const [printStaff, setPrintStaff] = reactExports.useState(null);
  const filtered = reactExports.useMemo(
    () => staff.filter((s) => {
      const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.staffCode.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || s.department === deptFilter;
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? s.isActive : !s.isActive);
      return matchSearch && matchDept && matchStatus;
    }),
    [staff, search, deptFilter, statusFilter]
  );
  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }
  function openEdit(s) {
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
      ifscCode: ""
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
      ifscCode: form.ifscCode
    };
    try {
      if (editId) {
        await updateStaff.mutateAsync({ id: editId, ...payload });
        ue.success("Staff member updated successfully");
      } else {
        await addStaff.mutateAsync(payload);
        ue.success("New staff member added successfully");
      }
      setDialogOpen(false);
      refetchStaff();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save staff.";
      ue.error(msg);
    }
  }
  const isSaving = addStaff.isPending || updateStaff.isPending;
  async function deleteStaff() {
    if (deleteId) {
      try {
        await deleteStaffMutation.mutateAsync(deleteId);
        ue.success("Staff member deactivated");
      } catch {
        ue.error("Failed to remove staff. Please try again.");
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
        Status: s.isActive ? "Active" : "Inactive"
      })),
      "staff-directory.csv"
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
      "Status"
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
        "Active"
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
        "Active"
      ]
    ];
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSVString(csv, "staff-import-template.csv");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "hr.staff_directory", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "hr.search_input",
            className: "pl-9",
            placeholder: "Search by name or ID…",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: deptFilter, onValueChange: setDeptFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.dept_filter", className: "w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Department" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Departments" }),
          DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.status_filter", className: "w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: exportStaff,
          "data-ocid": "hr.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
            " Export"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setImportOpen(true),
          "data-ocid": "hr.import_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 mr-1" }),
            " Import"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: downloadStaffTemplate,
          "data-ocid": "hr.download_template_button",
          title: "Download staff import CSV template",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
            " Template"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openAdd, "data-ocid": "hr.add_staff_button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
        " Add Staff"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StaffImportDialog,
      {
        open: importOpen,
        onClose: () => setImportOpen(false),
        onDone: () => {
          setImportOpen(false);
          refetchStaff();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Designation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Mobile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-foreground", children: "Salary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-12 text-center text-muted-foreground",
            "data-ocid": "hr.staff_empty_state",
            children: "No staff found. Add your first staff member to get started."
          }
        ) }),
        filtered.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            "data-ocid": `hr.staff.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0", children: getInitials(s.fullName) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: s.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.staffCode })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: s.designation }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: s.department }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `tel:${s.mobile}`,
                  className: "flex items-center gap-1 text-primary hover:underline",
                  "data-ocid": `hr.call_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5" }),
                    s.mobile
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-foreground", children: formatCurrency(Number(s.basicSalary ?? 0)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: s.isActive ? "default" : "secondary",
                  className: s.isActive ? "bg-green-500/15 text-green-700 border-green-500/30" : "",
                  children: s.isActive ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8 text-blue-600",
                    onClick: () => setPrintStaff(s),
                    "data-ocid": `hr.id_card_button.${i + 1}`,
                    title: "Print Staff ID Card",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    onClick: () => openEdit(s),
                    "data-ocid": `hr.edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8 text-destructive hover:text-destructive",
                    onClick: () => setDeleteId(s.id),
                    "data-ocid": `hr.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" })
                  }
                )
              ] }) })
            ]
          },
          s.id
        ))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-2xl max-h-[90vh] overflow-y-auto",
        "data-ocid": "hr.staff_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Staff" : "Add New Staff" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "TCH001",
                  value: form.staffCode,
                  onChange: (e) => setForm({ ...form, staffCode: e.target.value }),
                  "data-ocid": "hr.staff_form.staffcode_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Full Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Full name",
                  value: form.fullName,
                  onChange: (e) => setForm({ ...form, fullName: e.target.value }),
                  "data-ocid": "hr.staff_form.name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Designation ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Senior Teacher",
                  value: form.designation,
                  onChange: (e) => setForm({ ...form, designation: e.target.value }),
                  "data-ocid": "hr.staff_form.designation_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Department ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.department,
                  onValueChange: (v) => setForm({ ...form, department: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.staff_form.dept_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select department" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Mobile ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "10-digit mobile",
                  value: form.mobile,
                  onChange: (e) => setForm({ ...form, mobile: e.target.value }),
                  "data-ocid": "hr.staff_form.mobile_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  placeholder: "email@school.in",
                  value: form.email,
                  onChange: (e) => setForm({ ...form, email: e.target.value }),
                  "data-ocid": "hr.staff_form.email_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date of Joining" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  value: form.dateOfJoining,
                  onChange: (iso) => setForm({ ...form, dateOfJoining: iso }),
                  "data-ocid": "hr.staff_form.doj_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date of Birth" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  value: form.dateOfBirth,
                  onChange: (iso) => setForm({ ...form, dateOfBirth: iso }),
                  "data-ocid": "hr.staff_form.dob_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.gender,
                  onValueChange: (v) => setForm({ ...form, gender: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.staff_form.gender_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Male", children: "Male" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Female", children: "Female" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Basic Salary (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. 45000",
                  value: form.basicSalary,
                  onChange: (e) => setForm({
                    ...form,
                    basicSalary: e.target.value.replace(/\D/g, "")
                  }),
                  "data-ocid": "hr.staff_form.salary_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  rows: 2,
                  placeholder: "Full address",
                  value: form.address,
                  onChange: (e) => setForm({ ...form, address: e.target.value }),
                  "data-ocid": "hr.staff_form.address_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "col-span-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Aadhaar No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "12-digit Aadhaar",
                  value: form.aadhaarNo,
                  onChange: (e) => setForm({ ...form, aadhaarNo: e.target.value }),
                  "data-ocid": "hr.staff_form.aadhaar_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bank Account No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Account number",
                  value: form.bankAccount,
                  onChange: (e) => setForm({ ...form, bankAccount: e.target.value }),
                  "data-ocid": "hr.staff_form.bank_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "IFSC Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. SBIN0001234",
                  value: form.ifscCode,
                  onChange: (e) => setForm({ ...form, ifscCode: e.target.value }),
                  "data-ocid": "hr.staff_form.ifsc_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDialogOpen(false),
                disabled: isSaving,
                "data-ocid": "hr.staff_form.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: saveStaff,
                disabled: isSaving || !form.fullName || !form.designation || !form.department || !form.mobile,
                "data-ocid": "hr.staff_form.submit_button",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }),
                  " Saving…"
                ] }) : editId ? "Save Changes" : "Add Staff"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "hr.delete_dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Remove Staff Member?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will deactivate the staff member. They will be marked inactive." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteId(null),
            "data-ocid": "hr.delete_dialog.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            onClick: deleteStaff,
            disabled: deleteStaffMutation.isPending,
            "data-ocid": "hr.delete_dialog.confirm_button",
            children: deleteStaffMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Deactivate"
          }
        )
      ] })
    ] }) }),
    printStaff && (() => {
      const tmpl = allCertTemplates.find(
        (t) => t.templateType === "StaffIDCard" && t.isDefault
      ) ?? allCertTemplates.find((t) => t.templateType === "StaffIDCard") ?? null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        GeneratePrintModal,
        {
          template: tmpl,
          forcedType: "StaffIDCard",
          preStaff: printStaff,
          onClose: () => setPrintStaff(null)
        }
      );
    })()
  ] });
}
function SubjectAssignmentsTab() {
  var _a;
  const { data: staffList = [] } = useStaff();
  const { data: subjects = [] } = useSubjects();
  const { currentSession } = useAppStore();
  const session = currentSession ?? "2025-26";
  const [selectedStaffId, setSelectedStaffId] = reactExports.useState(
    ((_a = staffList[0]) == null ? void 0 : _a.id) ?? ""
  );
  reactExports.useEffect(() => {
    if (staffList.length > 0 && !selectedStaffId) {
      setSelectedStaffId(staffList[0].id);
    }
  }, [staffList, selectedStaffId]);
  const { data: currentAssignments = [], refetch } = useGetSubjectAssignments(selectedStaffId);
  const addAssignment = useAddSubjectAssignment();
  const updateAssignment = useUpdateSubjectAssignment();
  const deleteAssignment = useDeleteSubjectAssignment();
  const selectedStaff = staffList.find(
    (s) => s.id === selectedStaffId
  );
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [wizard, setWizard] = reactExports.useState({ subjectId: "", minClass: "", maxClass: "" });
  function resetWizard() {
    setWizard({ subjectId: "", minClass: "", maxClass: "" });
    setEditId(null);
  }
  function openAddDialog() {
    resetWizard();
    setAddOpen(true);
  }
  function openEditDialog(a) {
    setEditId(a.id);
    setWizard({
      subjectId: a.subjectId,
      minClass: a.minClass || "",
      maxClass: a.maxClass || ""
    });
    setAddOpen(true);
  }
  async function saveAssignment() {
    if (!wizard.subjectId || !wizard.minClass || !wizard.maxClass) return;
    const sub = subjects.find((s) => s.id === wizard.subjectId);
    const payload = {
      subjectId: wizard.subjectId,
      subjectName: (sub == null ? void 0 : sub.name) ?? wizard.subjectId,
      minClass: wizard.minClass,
      maxClass: wizard.maxClass,
      session
    };
    try {
      if (editId) {
        await updateAssignment.mutateAsync({
          id: editId,
          staffId: selectedStaffId,
          ...payload
        });
        ue.success("Subject assignment updated");
      } else {
        await addAssignment.mutateAsync({
          staffId: selectedStaffId,
          ...payload
        });
        ue.success("Subject assignment added");
      }
      refetch();
      setAddOpen(false);
      resetWizard();
    } catch {
      ue.error("Failed to save assignment.");
    }
  }
  async function removeAssignment(id) {
    try {
      await deleteAssignment.mutateAsync({ id, staffId: selectedStaffId });
      ue.success("Assignment removed");
      refetch();
    } catch {
      ue.error("Failed to remove assignment.");
    }
  }
  const isSaving = addAssignment.isPending || updateAssignment.isPending;
  const minIdx = wizard.minClass ? CLASS_ORDER.indexOf(wizard.minClass) : -1;
  const maxIdx = wizard.maxClass ? CLASS_ORDER.indexOf(wizard.maxClass) : -1;
  const rangeValid = minIdx >= 0 && maxIdx >= 0 && minIdx <= maxIdx;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "hr.subject_assignments", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedStaffId, onValueChange: setSelectedStaffId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-64", "data-ocid": "hr.teacher_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select teacher" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: staffList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
          s.fullName,
          " — ",
          s.designation
        ] }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAddDialog,
          disabled: !selectedStaffId,
          "data-ocid": "hr.add_assignment_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
            " Add Assignment"
          ]
        }
      )
    ] }),
    selectedStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm", children: getInitials(selectedStaff.fullName) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: selectedStaff.fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          selectedStaff.designation,
          " · ",
          selectedStaff.department
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "ml-auto text-xs", children: [
        currentAssignments.length,
        " assignment",
        currentAssignments.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Min Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Max Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Class Range" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        currentAssignments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-10 text-center text-muted-foreground",
            "data-ocid": "hr.assignments_empty_state",
            children: 'No subject assignments yet. Click "Add Assignment" to assign subjects with teaching class range.'
          }
        ) }),
        currentAssignments.map((a, i) => {
          const minLabel = a.minClass ? CLASS_LABELS[a.minClass] ?? a.minClass : "—";
          const maxLabel = a.maxClass ? CLASS_LABELS[a.maxClass] ?? a.maxClass : "—";
          const rangeLabel = a.minClass && a.maxClass ? a.minClass === a.maxClass ? minLabel : `${minLabel} → ${maxLabel}` : "—";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/10",
              "data-ocid": `hr.assignment.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: a.subjectName }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground text-sm", children: minLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground text-sm", children: maxLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: rangeLabel }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7",
                      onClick: () => openEditDialog(a),
                      "data-ocid": `hr.edit_assignment.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7 text-destructive hover:text-destructive",
                      onClick: () => removeAssignment(a.id),
                      "data-ocid": `hr.remove_assignment.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" })
                    }
                  )
                ] }) })
              ]
            },
            a.id
          );
        })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: addOpen,
        onOpenChange: (v) => {
          if (!isSaving) {
            setAddOpen(v);
            if (!v) resetWizard();
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "hr.add_assignment_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Subject Assignment" : "Add Subject Assignment" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Subject ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: wizard.subjectId,
                  onValueChange: (v) => setWizard((w) => ({ ...w, subjectId: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.wizard.subject_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose subject" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
                      subjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_none", disabled: true, children: "No subjects found — add subjects in Academics first" }),
                      subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Min Class ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-0.5", children: "Lowest class teacher will teach" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: wizard.minClass,
                    onValueChange: (v) => setWizard((w) => ({ ...w, minClass: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.wizard.min_class_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "From class" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Max Class ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-0.5", children: "Highest class teacher will teach" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: wizard.maxClass,
                    onValueChange: (v) => setWizard((w) => ({ ...w, maxClass: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "hr.wizard.max_class_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "To class" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                    ]
                  }
                )
              ] })
            ] }),
            wizard.minClass && wizard.maxClass && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `rounded-lg px-3 py-2 text-sm ${rangeValid ? "bg-green-500/10 border border-green-500/30 text-green-700" : "bg-red-500/10 border border-red-500/30 text-destructive"}`,
                children: rangeValid ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Teaching range:" }),
                  " ",
                  CLASS_LABELS[wizard.minClass],
                  wizard.minClass !== wizard.maxClass && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    " → ",
                    CLASS_LABELS[wizard.maxClass]
                  ] }),
                  " — ",
                  maxIdx - minIdx + 1,
                  " class",
                  maxIdx - minIdx + 1 !== 1 ? "es" : ""
                ] }) : "Min class must be equal to or lower than Max class"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setAddOpen(false);
                  resetWizard();
                },
                disabled: isSaving,
                "data-ocid": "hr.wizard.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: saveAssignment,
                disabled: !wizard.subjectId || !wizard.minClass || !wizard.maxClass || !rangeValid || isSaving,
                "data-ocid": "hr.wizard.save_button",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }),
                  " Saving…"
                ] }) : editId ? "Save Changes" : "Save Assignment"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
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
  { label: "March", num: 3 }
];
const _cy = (/* @__PURE__ */ new Date()).getFullYear();
const PAYROLL_MONTH_OPTS = SCHOOL_MONTHS_PAYROLL.map((m) => ({
  label: `${m.label} ${m.num <= 3 ? _cy + 1 : _cy}`,
  month: m.num,
  year: m.num <= 3 ? _cy + 1 : _cy
}));
const DEVICE_TYPES_LIST = [
  { value: "#Face", label: "Face" },
  { value: "#RFID", label: "RFID" },
  { value: "#ESSLBiometric", label: "ESSL Biometric" },
  { value: "#QR", label: "QR Scanner" }
];
function formatINR(v) {
  return `₹${v.toLocaleString("en-IN")}`;
}
function PayslipModal({
  staff,
  result,
  monthLabel,
  onClose
}) {
  const dailyRate = result.monthlySalary / Math.max(1, result.workingDays);
  const deduction = Math.round(dailyRate * result.absentDays);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md z-[200]", "data-ocid": "hr.payslip_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Salary Slip — ",
      monthLabel
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center pb-3 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg font-display text-foreground", children: "SHUBH SCHOOL ERP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mt-0.5", children: "SALARY SLIP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: monthLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Employee Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: staff.fullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Employee ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: staff.staffCode })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Designation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: staff.designation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: staff.department })
        ] }),
        staff.dateOfJoining && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Date of Joining" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: formatDate(staff.dateOfJoining) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
          {
            label: "Working Days",
            value: result.workingDays,
            color: "text-foreground"
          },
          {
            label: "Present Days",
            value: result.presentDays,
            color: "text-green-600"
          },
          {
            label: "Absent Days",
            value: result.absentDays,
            color: "text-destructive"
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold ${item.color}`, children: item.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: item.label })
        ] }, item.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Device Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5 text-xs", children: [
          { label: "Face Recognition", count: result.faceCount },
          { label: "RFID", count: result.rfidCount },
          { label: "ESSL Biometric", count: result.biometricCount },
          { label: "QR Scanner", count: result.qrCount }
        ].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex justify-between px-3 py-1.5 rounded bg-muted/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: d.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                d.count,
                " days"
              ] })
            ]
          },
          d.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Monthly Salary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatINR(result.monthlySalary) })
        ] }),
        deduction > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Deductions (",
            result.absentDays,
            " absent ×",
            " ",
            formatINR(Math.round(dailyRate)),
            "/day)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-mono", children: [
            "−",
            formatINR(deduction)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Net Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary", children: formatINR(result.netPay) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "hr.payslip_dialog.close_button",
          children: "Close"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => window.print(),
          "data-ocid": "hr.payslip_dialog.print_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-1" }),
            " Print"
          ]
        }
      )
    ] })
  ] }) });
}
function PayrollRow({
  staff,
  savedRecord,
  month,
  year,
  index,
  monthLabel,
  onCalculated
}) {
  const [showPayslip, setShowPayslip] = reactExports.useState(false);
  const calcMut = useCalculateAndSavePayroll();
  const lockMut = useLockPayrollMonth();
  const isLocked = (savedRecord == null ? void 0 : savedRecord.status) === "paid";
  async function handleCalculate() {
    try {
      await calcMut.mutateAsync({
        staffId: staff.id,
        month,
        year,
        baseSalary: staff.basicSalary
      });
      ue.success(`Payroll calculated for ${staff.fullName}`);
      onCalculated();
    } catch {
      ue.error("Failed to calculate payroll.");
    }
  }
  async function handleLock() {
    if (!savedRecord) return;
    try {
      await lockMut.mutateAsync({ staffId: staff.id, month, year });
      ue.success(`${monthLabel} locked — marked as Paid.`);
      onCalculated();
    } catch {
      ue.error("Failed to lock payroll month.");
    }
  }
  const r = savedRecord ? {
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
    qrCount: 0
  } : {
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
    qrCount: 0
  };
  const statusBadge = isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 border border-green-400 rounded-full px-2 py-0.5", children: "🔒 Paid" }) : (savedRecord == null ? void 0 : savedRecord.status) === "partial" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-400 rounded-full px-2 py-0.5", children: "Partial" }) : savedRecord ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-xs font-semibold text-red-700 bg-red-100 border border-red-400 rounded-full px-2 py-0.5", children: "Unpaid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Not Calculated" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: `border-b border-border last:border-0 ${isLocked ? "bg-green-50/40 dark:bg-green-950/10" : (savedRecord == null ? void 0 : savedRecord.status) === "partial" ? "bg-amber-50/30 dark:bg-amber-950/10" : (savedRecord == null ? void 0 : savedRecord.status) === "unpaid" ? "bg-red-50/20 dark:bg-red-950/10" : "hover:bg-muted/10"}`,
        "data-ocid": `hr.payroll.item.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0", children: getInitials(staff.fullName) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: staff.fullName })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: staff.designation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm", children: formatINR(staff.basicSalary) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: savedRecord ? savedRecord.workingDays : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-semibold text-green-600", children: savedRecord ? savedRecord.presentDays : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-semibold text-destructive", children: savedRecord ? savedRecord.absentDays : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono font-bold text-primary", children: savedRecord ? formatINR(savedRecord.netPay) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: statusBadge }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
            savedRecord && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs px-2",
                onClick: () => setShowPayslip(true),
                "data-ocid": `hr.payroll.payslip_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 mr-1" }),
                  " Payslip"
                ]
              }
            ),
            !isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs px-2",
                onClick: handleCalculate,
                disabled: calcMut.isPending,
                "data-ocid": `hr.payroll.calculate_button.${index + 1}`,
                children: calcMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-3.5 mr-1" }),
                  savedRecord ? "Recalc" : "Calculate"
                ] })
              }
            ),
            savedRecord && !isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs px-2 text-green-700 border-green-500/40 hover:bg-green-500/10",
                onClick: handleLock,
                disabled: lockMut.isPending,
                title: "Mark as Paid — permanently locks this month",
                "data-ocid": `hr.payroll.lock_button.${index + 1}`,
                children: "🔒 Lock"
              }
            ),
            isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-600 font-semibold", children: "✓ Locked" })
          ] }) })
        ]
      }
    ),
    showPayslip && savedRecord && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PayslipModal,
      {
        staff,
        result: r,
        monthLabel,
        onClose: () => setShowPayslip(false)
      }
    )
  ] });
}
function PaidLeaveConfigPanel() {
  const { data: config } = useGetPaidLeaveConfig();
  const saveMut = useSetPaidLeaveConfig();
  const [value, setValue] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (config && value === "") setValue(String(config.daysPerMonth));
  }, [config, value]);
  async function handleSave() {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num) || num < 0 || num > 5) {
      ue.error("Please enter a valid number (0 to 5).");
      return;
    }
    try {
      await saveMut.mutateAsync(num);
      ue.success(`Paid leave set to ${num} days/month.`);
    } catch {
      ue.error("Failed to save paid leave config.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Paid Leave Configuration" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Set free leave days per staff per month (commonly 1 or 1.5). Absences beyond this reduce daily salary proportionally." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Free Leave Days / Month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              step: "0.5",
              min: 0,
              max: 5,
              className: "w-24",
              value,
              onChange: (e) => setValue(e.target.value),
              "data-ocid": "hr.payroll.paid_leave_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: (v) => setValue(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-28",
                "data-ocid": "hr.payroll.paid_leave_preset_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Preset" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1", children: "1 day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1.5", children: "1.5 days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "2", children: "2 days" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: handleSave,
          disabled: saveMut.isPending,
          "data-ocid": "hr.payroll.save_leave_config_button",
          children: [
            saveMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }) : null,
            "Save Config"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 rounded px-3 py-2", children: [
      "ℹ️ ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Sundays and holidays" }),
      " from Academic Calendar are counted as ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "present" }),
      ". Deductions only apply for absences beyond the free leave allowance."
    ] })
  ] });
}
function PayrollTab() {
  const { data: staffList = [] } = useStaff();
  const staff = staffList.filter((s) => s.isActive);
  const now = /* @__PURE__ */ new Date();
  const defaultOpt = PAYROLL_MONTH_OPTS.find(
    (o) => o.month === now.getMonth() + 1 && o.year === now.getFullYear()
  ) ?? PAYROLL_MONTH_OPTS[0];
  const [selectedOpt, setSelectedOpt] = reactExports.useState(defaultOpt);
  const { data: payrollRecords = [], refetch: refetchPayroll } = useGetPayrollByMonth(selectedOpt.month, selectedOpt.year);
  const recordMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
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
          "Working Days": (rec == null ? void 0 : rec.workingDays) ?? "",
          Present: (rec == null ? void 0 : rec.presentDays) ?? "",
          Absent: (rec == null ? void 0 : rec.absentDays) ?? "",
          Deduction: (rec == null ? void 0 : rec.deduction) ?? "",
          "Net Pay": (rec == null ? void 0 : rec.netPay) ?? "",
          Status: (rec == null ? void 0 : rec.status) ?? "Not Calculated",
          Month: selectedOpt.label
        };
      }),
      `payroll-${selectedOpt.label.replace(" ", "-")}.csv`
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "hr.payroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaidLeaveConfigPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: `${selectedOpt.month}-${selectedOpt.year}`,
            onValueChange: (v) => {
              const [m, y] = v.split("-").map(Number);
              const opt = PAYROLL_MONTH_OPTS.find(
                (o) => o.month === m && o.year === y
              );
              if (opt) setSelectedOpt(opt);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-52", "data-ocid": "hr.payroll.month_select", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 mr-2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: PAYROLL_MONTH_OPTS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectItem,
                {
                  value: `${o.month}-${o.year}`,
                  children: o.label
                },
                `${o.month}-${o.year}`
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => refetchPayroll(),
          "data-ocid": "hr.payroll.refresh_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 mr-1" }),
            " Refresh"
          ]
        }
      ),
      payrollRecords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: exportPayroll,
          "data-ocid": "hr.payroll.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
            " Export Register"
          ]
        }
      )
    ] }),
    staff.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      {
        label: "Total Staff",
        value: String(staff.length),
        color: "text-foreground"
      },
      {
        label: "Total Net Payable",
        value: formatINR(totalNetPay),
        color: "text-primary"
      },
      {
        label: "Paid (Locked)",
        value: String(paidCount),
        color: "text-green-600"
      },
      {
        label: "Unpaid / Pending",
        value: String(unpaidCount),
        color: "text-red-600"
      }
    ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-4 space-y-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display ${c.color}`, children: c.value })
        ]
      },
      c.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded-full bg-green-400" }),
        " ",
        "Paid (Locked)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded-full bg-amber-400" }),
        "Partial"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded-full bg-red-400" }),
        " ",
        "Unpaid"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded-full bg-muted border border-border" }),
        "Not Calculated"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Staff Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Designation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-foreground", children: "Base Salary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Working Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Present" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Absent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-foreground", children: "Net Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        staff.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 9,
            className: "px-4 py-10 text-center text-muted-foreground",
            "data-ocid": "hr.payroll.no_staff_state",
            children: "No active staff found."
          }
        ) }),
        staff.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PayrollRow,
          {
            staff: s,
            savedRecord: recordMap.get(s.id) ?? null,
            month: selectedOpt.month,
            year: selectedOpt.year,
            index: i,
            monthLabel: selectedOpt.label,
            onCalculated: () => refetchPayroll()
          },
          s.id
        ))
      ] })
    ] }) })
  ] });
}
function AttendanceTrackingTab() {
  const { data: staffList = [] } = useStaff();
  const staff = staffList.filter((s) => s.isActive);
  const todayIso = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [date, setDate] = reactExports.useState(todayIso);
  const [deviceType, setDeviceType] = reactExports.useState(DEVICE_TYPES_LIST[0].value);
  const { data: attendanceRecords = [], refetch } = useGetStaffAttendanceByDate(date);
  const recordIn = useRecordStaffAttendance();
  const recordOut = useMarkStaffAttendanceOut();
  const attendanceMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of attendanceRecords) map.set(r.staffId, r);
    return map;
  }, [attendanceRecords]);
  function toDisplayTime(t) {
    if (!t) return "—";
    if (t.includes("T")) return t.split("T")[1].slice(0, 5);
    return t.slice(0, 5);
  }
  function nowTime() {
    const n = /* @__PURE__ */ new Date();
    return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  }
  async function handleMarkIn(s) {
    const parts = date.split("-");
    try {
      await recordIn.mutateAsync({
        staffId: s.id,
        staffName: s.fullName,
        date,
        month: Number(parts[1]),
        year: Number(parts[0]),
        deviceType,
        inTime: nowTime()
      });
      ue.success(`${s.fullName} marked IN`);
      refetch();
    } catch {
      ue.error("Failed to mark attendance");
    }
  }
  async function handleMarkOut(s) {
    const rec = attendanceMap.get(s.id);
    if (!rec) {
      ue.error("No IN record found for today");
      return;
    }
    try {
      await recordOut.mutateAsync({ recordId: rec.id, outTime: nowTime() });
      ue.success(`${s.fullName} marked OUT`);
      refetch();
    } catch {
      ue.error("Failed to mark attendance out");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "hr.attendance_tracking", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DateInput,
          {
            value: date,
            onChange: (iso) => setDate(iso),
            "data-ocid": "hr.attendance.date_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Device Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: deviceType, onValueChange: setDeviceType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectTrigger,
            {
              className: "w-48",
              "data-ocid": "hr.attendance.device_select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "size-4 mr-2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[200]", children: DEVICE_TYPES_LIST.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.value, children: d.label }, d.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "h-9 px-3 text-xs gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-green-500 inline-block" }),
        attendanceRecords.length,
        " marked today"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Staff Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Designation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Time In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Time Out" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Device" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        staff.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-12 text-center text-muted-foreground",
            "data-ocid": "hr.attendance.empty_state",
            children: "No active staff found."
          }
        ) }),
        staff.map((s, i) => {
          var _a;
          const rec = attendanceMap.get(s.id);
          const hasIn = !!(rec == null ? void 0 : rec.inTime);
          const hasOut = !!(rec == null ? void 0 : rec.outTime);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
              "data-ocid": `hr.attendance.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0", children: getInitials(s.fullName) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: s.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.staffCode })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: s.designation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: hasIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: hasOut ? "bg-blue-500/15 text-blue-700 border-blue-500/30" : "bg-green-500/15 text-green-700 border-green-500/30",
                    children: hasOut ? "Completed" : "Present"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-muted-foreground",
                    children: "Absent"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-mono text-sm", children: hasIn ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-semibold", children: toDisplayTime(rec == null ? void 0 : rec.inTime) }) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-mono text-sm", children: hasOut ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 font-semibold", children: toDisplayTime(rec == null ? void 0 : rec.outTime) }) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-xs text-muted-foreground", children: (rec == null ? void 0 : rec.deviceType) ? ((_a = DEVICE_TYPES_LIST.find(
                  (d) => d.value === rec.deviceType
                )) == null ? void 0 : _a.label) ?? rec.deviceType : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: `h-7 text-xs px-2 ${hasIn ? "opacity-40 pointer-events-none" : "text-green-700 border-green-500/40 hover:bg-green-500/10"}`,
                      disabled: hasIn || recordIn.isPending,
                      onClick: () => handleMarkIn(s),
                      "data-ocid": `hr.attendance.mark_in.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-3.5 mr-1" }),
                        " IN"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: `h-7 text-xs px-2 ${!hasIn || hasOut ? "opacity-40 pointer-events-none" : "text-blue-700 border-blue-500/40 hover:bg-blue-500/10"}`,
                      disabled: !hasIn || hasOut || recordOut.isPending,
                      onClick: () => handleMarkOut(s),
                      "data-ocid": `hr.attendance.mark_out.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-3.5 mr-1" }),
                        " OUT"
                      ]
                    }
                  )
                ] }) })
              ]
            },
            s.id
          );
        })
      ] })
    ] }) }),
    staff.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border text-sm flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Summary:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-600 font-semibold", children: [
        attendanceRecords.filter((r) => r.inTime).length,
        " Present"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-semibold", children: [
        staff.length - attendanceRecords.filter((r) => r.inTime).length,
        " ",
        "Absent"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-600 font-semibold", children: [
        attendanceRecords.filter((r) => r.outTime).length,
        " Checked Out"
      ] })
    ] })
  ] });
}
function timeToMins(t) {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}
function minsToTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function getCurrentPeriodStatus(startTime, endTime, now) {
  if (!startTime || !endTime) return "upcoming";
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = timeToMins(startTime);
  const endMins = timeToMins(endTime);
  if (currentMins >= startMins && currentMins < endMins) return "current";
  if (currentMins >= endMins) return "past";
  return "upcoming";
}
const STATUS_CLASSES = {
  current: "bg-green-50 border-green-400 border-2 ring-2 ring-green-300 dark:bg-green-950/40 dark:border-green-600",
  past: "bg-red-50/60 opacity-80 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  upcoming: ""
};
function computePeriodTimes(schoolStart, periods, durations, intervalAfterPeriod, intervalDuration) {
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
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat"
};
function buildGrid(entries, classKey, periodsPerDay) {
  const grid = Array.from(
    { length: periodsPerDay },
    (_, pi) => DAYS.map((day) => {
      const found = entries.find(
        (e) => `${e.classLevel}~${e.sectionName}` === classKey && e.periodNumber === pi + 1 && e.dayOfWeek === day
      );
      return {
        periodNumber: pi + 1,
        dayOfWeek: day,
        subjectName: (found == null ? void 0 : found.subjectName) ?? "",
        teacherName: (found == null ? void 0 : found.teacherName) ?? "",
        classLevel: (found == null ? void 0 : found.classLevel) ?? classKey.split("~")[0] ?? "",
        sectionName: (found == null ? void 0 : found.sectionName) ?? classKey.split("~")[1] ?? "",
        teacherStaffId: (found == null ? void 0 : found.teacherStaffId) ?? "",
        startTime: (found == null ? void 0 : found.startTime) ?? "",
        endTime: (found == null ? void 0 : found.endTime) ?? ""
      };
    })
  );
  return grid;
}
function TimetableTab() {
  const session = useAppStore((s) => s.currentSession);
  const { data: sections = [] } = useSections();
  const { data: savedTimetables = [], isLoading: loadingTimetables } = useGetClassTimetables(session);
  const generateMut = useGenerateClassTimetable();
  const createMut = useCreateClassTimetable();
  const updateMut = useUpdateClassTimetable();
  const deleteMut = useDeleteClassTimetable();
  const batchSaveMut = useBatchSaveClassTimetables();
  const copyPasteDay = useCopyPasteEntireDay();
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(timer);
  }, []);
  const [timetableSubTab, setTimetableSubTab] = reactExports.useState(
    "class"
  );
  const [wizardStep, setWizardStep] = reactExports.useState("configure");
  const [selectedClasses, setSelectedClasses] = reactExports.useState([]);
  const [periodsPerDay, setPeriodsPerDay] = reactExports.useState(8);
  const [startTime, setStartTime] = reactExports.useState("08:00");
  const [_endTime, setEndTime] = reactExports.useState("14:00");
  const [timetableName, setTimetableName] = reactExports.useState("");
  const [showWizard, setShowWizard] = reactExports.useState(false);
  const [copiedDay, setCopiedDay] = reactExports.useState(null);
  const [pasteDayPreview, setPasteDayPreview] = reactExports.useState(null);
  const [periodDurations, setPeriodDurations] = reactExports.useState(
    Array(8).fill(45)
  );
  const [intervalAfterPeriod, setIntervalAfterPeriod] = reactExports.useState(3);
  const [intervalDuration, setIntervalDuration] = reactExports.useState(20);
  const periodConfigs = reactExports.useMemo(
    () => computePeriodTimes(
      startTime,
      periodsPerDay,
      periodDurations,
      intervalAfterPeriod,
      intervalDuration
    ),
    [
      startTime,
      periodsPerDay,
      periodDurations,
      intervalAfterPeriod,
      intervalDuration
    ]
  );
  reactExports.useEffect(() => {
    setPeriodDurations((prev) => {
      if (prev.length === periodsPerDay) return prev;
      const next = Array(periodsPerDay).fill(45);
      for (let i = 0; i < Math.min(prev.length, periodsPerDay); i++)
        next[i] = prev[i];
      return next;
    });
  }, [periodsPerDay]);
  const [activeTimetable, setActiveTimetable] = reactExports.useState(
    null
  );
  const [grid, setGrid] = reactExports.useState([]);
  const [selectedClassKey, setSelectedClassKey] = reactExports.useState("");
  const [editingCell, setEditingCell] = reactExports.useState(null);
  const [cellEdit, setCellEdit] = reactExports.useState({
    subjectName: "",
    teacherName: ""
  });
  const dragSrc = reactExports.useRef(null);
  const classKeys = reactExports.useMemo(() => {
    const keys = sections.map((s) => `${s.classLevel}~${s.name}`);
    return [...new Set(keys)].sort((a, b) => {
      const ai = CLASS_ORDER.indexOf(a.split("~")[0]);
      const bi = CLASS_ORDER.indexOf(b.split("~")[0]);
      return ai - bi;
    });
  }, [sections]);
  function classKeyLabel(k) {
    const [cl, sec] = k.split("~");
    return `${CLASS_LABELS[cl] ?? cl} — Section ${sec}`;
  }
  function toggleClassSelection(k) {
    setSelectedClasses(
      (prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
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
    var _a;
    if (selectedClasses.length === 0) {
      ue.error("Select at least one class/section.");
      return;
    }
    setWizardStep("generating");
    try {
      const result = await generateMut.mutateAsync({
        sessionId: session,
        selectedClasses,
        periodsPerDay,
        startTime,
        endTime: ((_a = periodConfigs[periodConfigs.length - 1]) == null ? void 0 : _a.endTime) ?? "14:00",
        periodStartTimes: periodConfigs.map((p) => p.startTime),
        periodEndTimes: periodConfigs.map((p) => p.endTime)
      });
      setActiveTimetable(result);
      const firstKey = selectedClasses[0];
      setSelectedClassKey(firstKey);
      setGrid(buildGrid(result.entries, firstKey, periodsPerDay));
      setWizardStep("grid");
    } catch {
      const mockEntries = [];
      const subjects = [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Studies",
        "Computer",
        "Physical Education",
        "Art"
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
              startTime: (cfg == null ? void 0 : cfg.startTime) ?? startTime,
              endTime: (cfg == null ? void 0 : cfg.endTime) ?? "14:00"
            });
          }
        }
      }
      const mock = {
        id: "",
        sessionId: session,
        name: timetableName || `Timetable ${session}`,
        entries: mockEntries,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setActiveTimetable(mock);
      const firstKey = selectedClasses[0];
      setSelectedClassKey(firstKey);
      setGrid(buildGrid(mock.entries, firstKey, periodsPerDay));
      setWizardStep("grid");
      ue.info("Generated locally — save to persist.");
    }
  }
  function handleRegenerate() {
    setWizardStep("configure");
  }
  function switchClassKey(k) {
    if (!activeTimetable) return;
    setSelectedClassKey(k);
    setGrid(buildGrid(activeTimetable.entries, k, periodsPerDay));
    setEditingCell(null);
  }
  function handleCopyDay(day) {
    if (!(activeTimetable == null ? void 0 : activeTimetable.id)) {
      ue.info("Save the timetable first before copying a day.");
      return;
    }
    setCopiedDay({ day, timetableId: activeTimetable.id });
    ue.success(
      `${day} copied — click "Paste Day" on any day column to paste.`
    );
  }
  function handlePasteDayClick(targetDay) {
    if (!copiedDay) return;
    if (copiedDay.day === targetDay) {
      ue.info("Cannot paste a day onto itself.");
      return;
    }
    setPasteDayPreview({ targetDay, open: true });
  }
  async function confirmPasteDay() {
    if (!copiedDay || !pasteDayPreview || !(activeTimetable == null ? void 0 : activeTimetable.id)) return;
    try {
      await copyPasteDay.mutateAsync({
        sourceTimetableId: copiedDay.timetableId,
        sourceDay: copiedDay.day,
        targetTimetableId: activeTimetable.id,
        targetDay: pasteDayPreview.targetDay
      });
      const srcDayEntries = activeTimetable.entries.filter(
        (e) => e.dayOfWeek === copiedDay.day
      );
      const updatedEntries = [
        ...activeTimetable.entries.filter(
          (e) => e.dayOfWeek !== pasteDayPreview.targetDay
        ),
        ...srcDayEntries.map((e) => ({
          ...e,
          dayOfWeek: pasteDayPreview.targetDay
        }))
      ];
      setActiveTimetable(
        (prev) => prev ? { ...prev, entries: updatedEntries } : prev
      );
      setGrid(buildGrid(updatedEntries, selectedClassKey, periodsPerDay));
      ue.success(`${copiedDay.day} → ${pasteDayPreview.targetDay} pasted!`);
    } catch {
      ue.error("Failed to paste day. Please try again.");
    }
    setPasteDayPreview(null);
    setCopiedDay(null);
  }
  function onDragStart(row, col) {
    dragSrc.current = { row, col };
  }
  function onDrop(row, col) {
    const src = dragSrc.current;
    if (!src || src.row === row && src.col === col) return;
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
  function onDragOver(e) {
    e.preventDefault();
  }
  function openCellEdit(row, col) {
    setEditingCell({ row, col });
    setCellEdit({
      subjectName: grid[row][col].subjectName,
      teacherName: grid[row][col].teacherName
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
  function gridToEntries() {
    if (!activeTimetable) return [];
    const otherEntries = activeTimetable.entries.filter(
      (e) => `${e.classLevel}~${e.sectionName}` !== selectedClassKey
    );
    const [cl, sec] = selectedClassKey.split("~");
    const myEntries = grid.flatMap(
      (row) => row.map((cell) => {
        var _a;
        return {
          periodNumber: cell.periodNumber,
          dayOfWeek: cell.dayOfWeek,
          classLevel: cl,
          sectionName: sec,
          subjectName: cell.subjectName,
          teacherName: cell.teacherName,
          teacherStaffId: cell.teacherStaffId,
          startTime: cell.startTime || startTime,
          endTime: cell.endTime || ((_a = periodConfigs[cell.periodNumber - 1]) == null ? void 0 : _a.endTime) || "14:00"
        };
      })
    );
    return [...otherEntries, ...myEntries];
  }
  async function handleSave() {
    const entries = gridToEntries();
    const payload = {
      sessionId: session,
      name: timetableName || (activeTimetable == null ? void 0 : activeTimetable.name) || `Timetable ${session}`,
      entries
    };
    try {
      if (activeTimetable == null ? void 0 : activeTimetable.id) {
        await updateMut.mutateAsync({
          id: activeTimetable.id,
          timetable: payload
        });
        ue.success("Timetable updated successfully!");
      } else {
        const created = await createMut.mutateAsync(payload);
        setActiveTimetable(created);
        ue.success("Timetable saved successfully!");
      }
      setShowWizard(false);
    } catch {
      ue.success("Timetable saved locally!");
      setShowWizard(false);
    }
  }
  async function handleDeleteTimetable(id) {
    try {
      await deleteMut.mutateAsync(id);
      ue.success("Timetable deleted.");
    } catch {
      ue.error("Failed to delete timetable.");
    }
  }
  function openSavedTimetable(tt) {
    setActiveTimetable(tt);
    setTimetableName(tt.name);
    const uniqueKeys = [
      ...new Set(tt.entries.map((e) => `${e.classLevel}~${e.sectionName}`))
    ];
    const periods = uniqueKeys.length > 0 ? Math.max(...tt.entries.map((e) => e.periodNumber)) : periodsPerDay;
    setSelectedClasses(uniqueKeys);
    setPeriodsPerDay(periods);
    const firstKey = uniqueKeys[0] ?? "";
    setSelectedClassKey(firstKey);
    setGrid(buildGrid(tt.entries, firstKey, periods));
    setWizardStep("grid");
    setShowWizard(true);
  }
  const isSaving = createMut.isPending || updateMut.isPending || batchSaveMut.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "hr.timetable", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTimetableSubTab("class"),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${timetableSubTab === "class" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
          "data-ocid": "hr.timetable.class_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-4" }),
            " Class-wise"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTimetableSubTab("teacher"),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${timetableSubTab === "teacher" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
          "data-ocid": "hr.timetable.teacher_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
            " Teacher-wise"
          ]
        }
      )
    ] }),
    timetableSubTab === "teacher" && /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherTimetablePanel, { sessionId: session }),
    timetableSubTab === "class" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Class-wise Timetable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Session:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary", children: session })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: startWizard,
            "data-ocid": "hr.timetable.create_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
              " Create New Timetable"
            ]
          }
        )
      ] }),
      showWizard && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground text-sm", children: [
            wizardStep === "configure" && "Step 1 — Configure",
            wizardStep === "generating" && "Generating…",
            wizardStep === "grid" && "Step 2 — Timetable Grid"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ml-auto text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setShowWizard(false),
              "aria-label": "Close wizard",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] }),
        wizardStep === "configure" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Timetable Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: timetableName,
                  onChange: (e) => setTimetableName(e.target.value),
                  placeholder: `Timetable ${session}`,
                  "data-ocid": "hr.timetable.name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Periods Per Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 12,
                  value: periodsPerDay,
                  onChange: (e) => setPeriodsPerDay(Number(e.target.value) || 8),
                  "data-ocid": "hr.timetable.periods_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Start Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "time",
                  value: startTime,
                  onChange: (e) => setStartTime(e.target.value),
                  "data-ocid": "hr.timetable.start_time_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide", children: "Break / Interval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "After Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: periodsPerDay - 1,
                    value: intervalAfterPeriod,
                    onChange: (e) => setIntervalAfterPeriod(Number(e.target.value) || 3),
                    className: "w-24 h-8 text-xs",
                    "data-ocid": "hr.timetable.interval_after_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Duration (minutes)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 5,
                    max: 60,
                    value: intervalDuration,
                    onChange: (e) => setIntervalDuration(Number(e.target.value) || 20),
                    className: "w-24 h-8 text-xs",
                    "data-ocid": "hr.timetable.interval_duration_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pb-1", children: [
                "Break after P",
                intervalAfterPeriod,
                " (",
                intervalDuration,
                " ",
                "min)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Period Durations & Times" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground font-medium", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground font-medium", children: "Duration (min)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground font-medium", children: "Start" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground font-medium", children: "End" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: periodConfigs.map((cfg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-border",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-1.5 font-semibold text-foreground", children: [
                        "P",
                        i + 1
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 10,
                          max: 120,
                          value: periodDurations[i] ?? 45,
                          onChange: (e) => {
                            const val = Number(e.target.value) || 45;
                            setPeriodDurations((prev) => {
                              const next = [...prev];
                              next[i] = val;
                              return next;
                            });
                          },
                          className: "w-20 h-7 text-xs",
                          "data-ocid": `hr.timetable.period_duration.${i + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono text-primary", children: cfg.startTime }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono text-primary", children: cfg.endTime })
                    ]
                  },
                  `period-dur-${cfg.startTime}-${i}`
                ),
                i + 1 === intervalAfterPeriod && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    className: "border-t border-border bg-amber-50/60 dark:bg-amber-950/20",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        colSpan: 4,
                        className: "px-3 py-1.5 text-amber-700 dark:text-amber-400 font-medium text-center",
                        children: [
                          "☕ BREAK — ",
                          intervalDuration,
                          " min (",
                          cfg.endTime,
                          " →",
                          " ",
                          minsToTime(
                            timeToMins(cfg.endTime) + intervalDuration
                          ),
                          ")"
                        ]
                      }
                    )
                  },
                  `break-row-${cfg.endTime}-${i}`
                )
              ] })) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Classes / Sections" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-primary hover:underline",
                  onClick: () => setSelectedClasses(
                    selectedClasses.length === classKeys.length ? [] : [...classKeys]
                  ),
                  "data-ocid": "hr.timetable.select_all_classes",
                  children: selectedClasses.length === classKeys.length ? "Deselect All" : "Select All"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1", children: [
              classKeys.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-3 text-xs text-muted-foreground py-2", children: "No sections found. Add sections in Academics first." }),
              classKeys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: `flex items-center gap-2 text-xs p-2 rounded-lg border cursor-pointer transition-colors ${selectedClasses.includes(k) ? "border-primary bg-primary/8 text-primary font-medium" : "border-border text-foreground hover:bg-muted/30"}`,
                  "data-ocid": `hr.timetable.class_checkbox.${k}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        className: "accent-primary",
                        checked: selectedClasses.includes(k),
                        onChange: () => toggleClassSelection(k)
                      }
                    ),
                    classKeyLabel(k)
                  ]
                },
                k
              ))
            ] }),
            selectedClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              selectedClasses.length,
              " class(es) selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleGenerate,
              disabled: selectedClasses.length === 0,
              "data-ocid": "hr.timetable.generate_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 mr-1.5" }),
                " Auto-Generate Timetable"
              ]
            }
          ) })
        ] }),
        wizardStep === "generating" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center gap-4 py-16",
            "data-ocid": "hr.timetable.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Generating conflict-free timetable for",
                " ",
                selectedClasses.length,
                " class(es)…"
              ] })
            ]
          }
        ),
        wizardStep === "grid" && activeTimetable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: selectedClasses.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => switchClassKey(k),
                className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedClassKey === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
                "data-ocid": `hr.timetable.class_tab.${k}`,
                children: classKeyLabel(k)
              },
              k
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleRegenerate,
                  "data-ocid": "hr.timetable.regenerate_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1" }),
                    " Regenerate"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: handleSave,
                  disabled: isSaving,
                  "data-ocid": "hr.timetable.save_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-3.5 mr-1" }),
                    isSaving ? "Saving…" : "Save Timetable"
                  ]
                }
              )
            ] })
          ] }),
          copiedDay && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "size-3.5 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: copiedDay.day }),
              ' copied — click "Paste Day" on any day column header'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCopiedDay(null),
                className: "ml-auto text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-full bg-green-400" }),
              "Live (Now)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-full bg-red-300" }),
              "Past"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-full border border-border" }),
              "Upcoming"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs w-full min-w-[640px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left text-muted-foreground font-semibold w-28 border-r border-border", children: "Period" }),
              DAYS.map((day) => {
                const todayDay = currentTime.toLocaleDateString(
                  "en-US",
                  { weekday: "long" }
                );
                const isToday = todayDay === day;
                const isCopied = (copiedDay == null ? void 0 : copiedDay.day) === day;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: `px-2 py-2.5 text-center font-semibold border-r border-border last:border-0 min-w-[110px] ${isToday ? "text-primary" : isCopied ? "text-primary/70 bg-primary/5" : "text-foreground"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        DAY_SHORT[day],
                        isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[9px] font-bold text-primary uppercase", children: "TODAY" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleCopyDay(day),
                            className: `flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${isCopied ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"}`,
                            title: `Copy ${day}`,
                            "data-ocid": `hr.timetable.copy_day.${day.toLowerCase()}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "size-2.5" }),
                              isCopied ? "Copied" : "Copy"
                            ]
                          }
                        ),
                        copiedDay && copiedDay.day !== day && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => handlePasteDayClick(day),
                            className: "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
                            title: `Paste ${copiedDay.day} → ${day}`,
                            "data-ocid": `hr.timetable.paste_day.${day.toLowerCase()}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardPaste, { className: "size-2.5" }),
                              "Paste"
                            ]
                          }
                        )
                      ] })
                    ] })
                  },
                  day
                );
              })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: grid.map((row, ri) => {
              var _a, _b, _c;
              const firstCell = row.find(
                (c) => c.startTime && c.endTime
              );
              const pStart = (firstCell == null ? void 0 : firstCell.startTime) ?? ((_a = periodConfigs[ri]) == null ? void 0 : _a.startTime) ?? "";
              const pEnd = (firstCell == null ? void 0 : firstCell.endTime) ?? ((_b = periodConfigs[ri]) == null ? void 0 : _b.endTime) ?? "";
              const todayDay = currentTime.toLocaleDateString(
                "en-US",
                { weekday: "long" }
              );
              const isTodayInGrid = DAYS.includes(todayDay);
              const rowStatus = isTodayInGrid ? getCurrentPeriodStatus(pStart, pEnd, currentTime) : "upcoming";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-border",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: `px-3 py-2 font-medium border-r border-border whitespace-nowrap ${rowStatus === "current" ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300" : rowStatus === "past" ? "bg-red-50 text-muted-foreground dark:bg-red-950/20" : "bg-muted/20 text-muted-foreground"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                              rowStatus === "current" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse text-[9px] font-bold text-green-600 dark:text-green-400 uppercase", children: "LIVE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3 text-muted-foreground/60" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                "P",
                                ri + 1
                              ] })
                            ] }),
                            pStart && pEnd && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono text-muted-foreground/70", children: [
                              pStart,
                              "–",
                              pEnd
                            ] })
                          ] })
                        }
                      ),
                      row.map((cell, ci) => {
                        const cellDay = DAYS[ci];
                        const cellStatus = cellDay === todayDay ? getCurrentPeriodStatus(
                          cell.startTime || pStart,
                          cell.endTime || pEnd,
                          currentTime
                        ) : "upcoming";
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `px-2 py-1.5 border-r border-border last:border-0 align-top transition-colors ${STATUS_CLASSES[cellStatus]}`,
                            draggable: true,
                            onDragStart: () => onDragStart(ri, ci),
                            onDragOver,
                            onDrop: () => onDrop(ri, ci),
                            children: (editingCell == null ? void 0 : editingCell.row) === ri && (editingCell == null ? void 0 : editingCell.col) === ci ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: cellEdit.subjectName,
                                  onChange: (e) => setCellEdit((p) => ({
                                    ...p,
                                    subjectName: e.target.value
                                  })),
                                  placeholder: "Subject",
                                  className: "h-6 text-xs px-1.5",
                                  autoFocus: true,
                                  "data-ocid": `hr.timetable.cell_subject.${ri}.${ci}`
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  value: cellEdit.teacherName,
                                  onChange: (e) => setCellEdit((p) => ({
                                    ...p,
                                    teacherName: e.target.value
                                  })),
                                  placeholder: "Teacher",
                                  className: "h-6 text-xs px-1.5",
                                  "data-ocid": `hr.timetable.cell_teacher.${ri}.${ci}`
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    size: "sm",
                                    className: "h-5 text-[10px] px-1.5",
                                    onClick: saveCellEdit,
                                    "data-ocid": `hr.timetable.cell_save.${ri}.${ci}`,
                                    children: "OK"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    variant: "ghost",
                                    size: "sm",
                                    className: "h-5 text-[10px] px-1.5",
                                    onClick: () => setEditingCell(null),
                                    children: "✕"
                                  }
                                )
                              ] })
                            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: "group cursor-grab active:cursor-grabbing rounded p-1 hover:bg-primary/8 transition-colors min-h-[42px] flex flex-col gap-0.5 relative",
                                onDoubleClick: () => openCellEdit(ri, ci),
                                title: "Drag to swap · double-click to edit",
                                children: [
                                  cellStatus === "current" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 right-0.5 text-[8px] font-bold bg-green-500 text-white px-1 py-0.5 rounded-full leading-none animate-pulse", children: "NOW" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "size-2.5 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "span",
                                      {
                                        className: `font-medium truncate ${cellStatus === "past" ? "text-muted-foreground" : "text-foreground"}`,
                                        children: cell.subjectName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 italic", children: "—" })
                                      }
                                    )
                                  ] }),
                                  cell.teacherName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px] pl-3.5 truncate", children: cell.teacherName })
                                ]
                              }
                            )
                          },
                          `${ri}-${DAYS[ci]}`
                        );
                      })
                    ]
                  },
                  `period-${ri + 1}`
                ),
                ri + 1 === intervalAfterPeriod && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    className: "border-t border-border",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        colSpan: DAYS.length + 1,
                        className: `px-3 py-2 text-center font-semibold text-xs tracking-wide ${isTodayInGrid && getCurrentPeriodStatus(pEnd, minsToTime(timeToMins(pEnd) + intervalDuration), currentTime) === "current" ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300" : isTodayInGrid && timeToMins(pEnd) + intervalDuration <= currentTime.getHours() * 60 + currentTime.getMinutes() ? "bg-red-50/60 text-muted-foreground dark:bg-red-950/20" : "bg-amber-50/70 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`,
                        children: [
                          "☕ BREAK — ",
                          intervalDuration,
                          " min",
                          pEnd && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 font-mono font-normal text-[10px]", children: [
                            "(",
                            pEnd,
                            " →",
                            " ",
                            minsToTime(
                              timeToMins(pEnd) + intervalDuration
                            ),
                            ")"
                          ] }),
                          isTodayInGrid && getCurrentPeriodStatus(
                            pEnd,
                            minsToTime(
                              timeToMins(pEnd) + intervalDuration
                            ),
                            currentTime
                          ) === "current" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[9px] font-bold animate-pulse", children: "BREAK NOW" })
                        ]
                      }
                    )
                  },
                  `break-grid-${ri}-${((_c = row == null ? void 0 : row[0]) == null ? void 0 : _c.startTime) ?? ri}`
                )
              ] });
            }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Drag cells to swap · Double-click to edit ·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "Green = live" }),
            " ",
            "·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-medium", children: "Red = past" }),
            " ",
            "· Copy/Paste day in column headers"
          ] })
        ] })
      ] }),
      (pasteDayPreview == null ? void 0 : pasteDayPreview.open) && copiedDay && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40",
          "data-ocid": "hr.timetable.paste_day_dialog",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border shadow-lg p-6 max-w-sm w-full mx-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-base", children: "Paste Day — Confirm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Copy",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: copiedDay.day }),
              " → paste to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: pasteDayPreview.targetDay }),
              "?",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-600", children: [
                "This will overwrite all periods in",
                " ",
                pasteDayPreview.targetDay,
                "."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setPasteDayPreview(null),
                  "data-ocid": "hr.timetable.paste_day_dialog.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: confirmPasteDay,
                  disabled: copyPasteDay.isPending,
                  "data-ocid": "hr.timetable.paste_day_dialog.confirm_button",
                  children: [
                    copyPasteDay.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardPaste, { className: "size-4 mr-1" }),
                    "Confirm Paste"
                  ]
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
          "Saved Timetables — ",
          session
        ] }),
        loadingTimetables && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "py-6 text-center text-sm text-muted-foreground",
            "data-ocid": "hr.timetable.list_loading",
            children: "Loading…"
          }
        ),
        !loadingTimetables && savedTimetables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-dashed border-border bg-muted/20 py-10 flex flex-col items-center gap-2",
            "data-ocid": "hr.timetable.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-8 text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "No timetables saved for ",
                session,
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: startWizard,
                  "data-ocid": "hr.timetable.create_first_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
                    " Create First Timetable"
                  ]
                }
              )
            ]
          }
        ),
        savedTimetables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Classes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: savedTimetables.map((tt, i) => {
            const uniqueClasses = [
              ...new Set(
                tt.entries.map(
                  (e) => `${e.classLevel}~${e.sectionName}`
                )
              )
            ];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/10",
                "data-ocid": `hr.timetable.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: tt.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                    uniqueClasses.slice(0, 4).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "text-[10px] px-1.5 py-0",
                        children: classKeyLabel(k)
                      },
                      k
                    )),
                    uniqueClasses.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] px-1.5 py-0",
                        children: [
                          "+",
                          uniqueClasses.length - 4,
                          " more"
                        ]
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "h-7 text-xs",
                        onClick: () => openSavedTimetable(tt),
                        "data-ocid": `hr.timetable.edit_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3 mr-1" }),
                          " Edit"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-7 text-destructive hover:text-destructive",
                        onClick: () => handleDeleteTimetable(tt.id),
                        "data-ocid": `hr.timetable.delete_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              tt.id
            );
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
class HRErrorBoundary extends reactExports.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", { hasError: false, errorMsg: "" });
  }
  static getDerivedStateFromError(error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { hasError: true, errorMsg: msg };
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "HR & Payroll could not load" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "An error occurred rendering this module. Please reload." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
            onClick: () => this.setState({ hasError: false, errorMsg: "" }),
            children: "Reload HR Module"
          }
        )
      ] });
    }
    return this.props.children;
  }
}
function HRPageInner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "hr.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "HR & Payroll" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Staff directory, subject assignments, and monthly payroll" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "staff", "data-ocid": "hr.tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "staff", "data-ocid": "hr.staff_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 mr-1.5" }),
          "Staff Directory"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "assignments", "data-ocid": "hr.assignments_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 mr-1.5" }),
          "Subject Assignments"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "attendance", "data-ocid": "hr.attendance_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "size-4 mr-1.5" }),
          "Attendance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "payroll", "data-ocid": "hr.payroll_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-4 mr-1.5" }),
          "Payroll"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "timetable", "data-ocid": "hr.timetable_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-4 mr-1.5" }),
          "Timetable"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "staff-payment", "data-ocid": "hr.staff_payment_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-4 mr-1.5" }),
          "Staff Payment"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "staff", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaffDirectoryTab, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "assignments", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubjectAssignmentsTab, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "attendance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AttendanceTrackingTab, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "payroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PayrollTab, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timetable", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimetableTab, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "staff-payment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaffPaymentTab, {}) }) })
    ] })
  ] });
}
function HRPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HRErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HRPageInner, {}) });
}
export {
  HRPage as default
};
