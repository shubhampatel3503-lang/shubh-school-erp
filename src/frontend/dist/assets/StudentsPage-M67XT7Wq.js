import { ae as createLucideIcon, d as useAppStore, a6 as useRoutes, d5 as useAttendanceByStudent, d6 as usePaymentsByStudent, d7 as useDiscontinueStudent, d8 as useDeleteStudent, r as reactExports, ar as useCertificateTemplates, j as jsxRuntimeExports, D as Dialog, f as DialogContent, d9 as Avatar, da as AvatarImage, db as AvatarFallback, Z as getInitials, i as CLASS_LABELS, t as Badge, ap as Bus, e as Button, B as BookOpen, a4 as CreditCard, a0 as formatDate, bk as formatCurrency, F as ue, $ as Phone, S as Skeleton, X, dc as reactDomExports, dd as useDeleteAllStudents, a5 as useStudents, a8 as useSections, ao as useQueryClient, U as Users, C as CLASS_ORDER, I as Input, Y as UsersRound, aM as cn, aR as IndianRupee, d0 as Eye, g as DialogHeader, h as DialogTitle, de as DialogDescription, k as DialogFooter, ab as downloadCSV, df as useAddStudent, dg as usePickupPointsByRoute, L as Label, bl as SCHOOL_MONTHS, dh as useUpdateStudent, a$ as useSessions, di as useUpdateStudentSilent, bm as useFeeHeadings, dj as useStudentDiscounts, dk as useSaveStudentDiscount, dl as useRemoveStudentDiscount, dm as usePromoteAllClasses, a1 as generateId, bD as downloadCSVString } from "./index-pMBTUEbj.js";
import { G as GeneratePrintModal } from "./GeneratePrintModal-DKNLACr9.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { I as ImageUploadField } from "./ImageUploadField-BvVIDeMZ.js";
import { S as Separator } from "./separator-jz692S3i.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-DUIdHMSc.js";
import { U as User } from "./user-C6bo2V5_.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import { C as Checkbox } from "./checkbox-B6f3RDRz.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { U as Upload } from "./upload-BicUPgyg.js";
import { C as CircleArrowUp } from "./circle-arrow-up-BFj8jnyJ.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { F as Funnel } from "./funnel-Qd2zbjyV.js";
import "./FeeReceiptTemplate-BjT7XvY6.js";
import "./image-DqsyHurY.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 13v8l-4-4", key: "1f5nwf" }],
  ["path", { d: "m12 21 4-4", key: "1lfcce" }],
  ["path", { d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284", key: "ui1hmy" }]
];
const CloudDownload = createLucideIcon("cloud-download", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function FieldRow({
  label,
  value,
  phone = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-muted-foreground uppercase tracking-widest leading-none", children: label }),
    phone && value !== "—" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: `tel:${value}`,
        className: "text-sm font-medium text-primary hover:underline flex items-center gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
          value
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground break-words", children: value || "—" })
  ] });
}
function InfoCard({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold font-display", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3", children })
  ] });
}
function AttendanceBar({
  label,
  value,
  total,
  color
}) {
  const pct = total > 0 ? Math.round(value / total * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
        value,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
          "(",
          pct,
          "%)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all ${color}`,
        style: { width: `${pct}%` }
      }
    ) })
  ] });
}
function CircularProgress({ percent }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent / 100 * circumference;
  const strokeClass = percent >= 75 ? "stroke-emerald-500" : percent >= 60 ? "stroke-amber-500" : "stroke-destructive";
  const textClass = percent >= 75 ? "text-emerald-600" : percent >= 60 ? "text-amber-600" : "text-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        className: "h-20 w-20 -rotate-90",
        viewBox: "0 0 80 80",
        role: "img",
        "aria-labelledby": "att-circle-title",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "att-circle-title", children: `Attendance ${percent}%` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "40",
              cy: "40",
              r: radius,
              fill: "none",
              strokeWidth: "6",
              className: "stroke-muted"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "40",
              cy: "40",
              r: radius,
              fill: "none",
              strokeWidth: "6",
              strokeLinecap: "round",
              className: `${strokeClass} transition-all duration-700`,
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xl font-bold font-display ${textClass}`, children: [
        percent,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Attendance" })
    ] })
  ] });
}
function TabSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", "data-ocid": "student_profile.loading_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" })
  ] });
}
function IdCardPrintDialog({
  student,
  section,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm",
      "data-ocid": "student_profile.idcard.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base", children: "Student ID Card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7",
              onClick: onClose,
              "data-ocid": "student_profile.idcard.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            id: "student-id-card-print",
            className: "border-2 border-primary rounded-xl overflow-hidden bg-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary px-4 py-2 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground font-bold text-sm", children: "SHUBH SCHOOL ERP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-xs", children: "Student Identity Card" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16 border-2 border-primary/20 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: student.photoUrl, alt: student.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-bold text-xl", children: getInitials(student.fullName) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground truncate", children: student.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Adm No:" }),
                    " ",
                    student.admNo
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Class:" }),
                    " ",
                    CLASS_LABELS[student.classLevel],
                    section ? ` – ${section.name}` : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Father:" }),
                    " ",
                    student.fatherName
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Mobile:" }),
                    " ",
                    student.fatherMobile
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-2 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-center", children: [
                "Session: ",
                student.sessionId
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full mt-2",
            onClick: () => window.print(),
            "data-ocid": "student_profile.idcard.print_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-2" }),
              " Print ID Card"
            ]
          }
        )
      ]
    }
  ) });
}
function AdmissionFormDialog({
  student,
  section,
  onClose
}) {
  const rows = [
    ["Admission No.", student.admNo],
    ["Full Name", student.fullName],
    ["Date of Birth", formatDate(student.dateOfBirth) || "—"],
    ["Gender", student.gender],
    [
      "Class",
      CLASS_LABELS[student.classLevel] + (section ? ` – ${section.name}` : "")
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
    ["Admission Date", formatDate(student.admissionDate) || "—"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "student_profile.form.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base", children: "Admission Form" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7",
              onClick: onClose,
              "data-ocid": "student_profile.form.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "student-admission-form-print", className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center border-b border-border pb-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg font-display", children: "SHUBH SCHOOL ERP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Student Admission Form" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20 border border-border shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: student.photoUrl, alt: student.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-bold text-2xl", children: getInitials(student.fullName) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: student.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Adm. No: ",
                student.admNo
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                CLASS_LABELS[student.classLevel],
                " · ",
                student.sessionId
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm border border-border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-muted-foreground bg-muted/20 w-40", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground", children: value })
              ]
            },
            label
          )) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full mt-4",
            onClick: () => window.print(),
            "data-ocid": "student_profile.form.print_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-2" }),
              " Print Form"
            ]
          }
        )
      ]
    }
  ) });
}
function PhotoLightbox({
  src,
  name,
  onClose
}) {
  const content = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: lightbox overlay close
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 flex items-center justify-center bg-black/85",
        style: { zIndex: 99999 },
        onClick: onClose,
        "data-ocid": "student_profile.photo_lightbox",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-4 right-4 text-white/80 hover:text-white transition-colors",
              onClick: onClose,
              "aria-label": "Close photo",
              "data-ocid": "student_profile.photo_lightbox.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-7 w-7" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3",
              onClick: (e) => e.stopPropagation(),
              children: [
                src ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src,
                    alt: name,
                    className: "max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl object-contain border-2 border-white/20"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 w-48 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-6xl font-bold font-display", children: getInitials(name) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium text-lg", children: name })
              ]
            }
          )
        ]
      }
    )
  );
  return reactDomExports.createPortal(content, document.body);
}
function StudentProfileModal({
  student,
  sections,
  onClose,
  onEdit
}) {
  const ext = student;
  const { currentRole } = useAppStore();
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const { data: routes = [] } = useRoutes();
  const { data: attendance = [], isLoading: loadingAttendance } = useAttendanceByStudent(student.id);
  const { data: payments = [], isLoading: loadingPayments } = usePaymentsByStudent(student.id);
  const discontinueMutation = useDiscontinueStudent();
  const deleteMutation = useDeleteStudent();
  const section = sections.find((s) => s.id === student.sectionId);
  const route = routes.find(
    (r) => r.id === student.transportRouteId
  );
  const [photoLightboxOpen, setPhotoLightboxOpen] = reactExports.useState(false);
  const [idCardOpen, setIdCardOpen] = reactExports.useState(false);
  const [admFormOpen, setAdmFormOpen] = reactExports.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = reactExports.useState(false);
  const [certPrintType, setCertPrintType] = reactExports.useState(null);
  const { data: allCertTemplates = [] } = useCertificateTemplates();
  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const absentDays = attendance.filter((a) => a.status === "Absent").length;
  const lateDays = attendance.filter((a) => a.status === "Late").length;
  const halfDays = attendance.filter((a) => a.status === "HalfDay").length;
  const attendancePct = totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0;
  const totalPaid = payments.reduce((sum, p) => sum + p.totalAmount, 0);
  const sortedPayments = [...payments].sort(
    (a, b) => b.paymentDate.localeCompare(a.paymentDate)
  );
  const lastPayment = sortedPayments[0] ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-2xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0",
        "data-ocid": "student_profile.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card px-6 pt-6 pb-4 border-b border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                onClick: () => setPhotoLightboxOpen(true),
                title: "Click to view full size",
                "data-ocid": "student_profile.photo_button",
                "aria-label": "View student photo full size",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20 border-2 border-primary/20 shadow-md hover:border-primary/60 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: student.photoUrl, alt: student.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-bold text-2xl font-display", children: getInitials(student.fullName) })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground leading-tight", children: student.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                  CLASS_LABELS[student.classLevel],
                  section ? ` – Section ${section.name}` : "",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-border", children: "·" }),
                  "Adm No:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium", children: student.admNo })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
                  student.isDiscontinued ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "destructive",
                      className: "text-xs",
                      "data-ocid": "student_profile.status.badge",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
                        " Discontinued"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      className: "text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100",
                      "data-ocid": "student_profile.status.badge",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1" }),
                        " Active"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: student.gender }),
                  student.transportRouteId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "h-3 w-3 mr-1" }),
                    " Transport"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "student_profile.edit_button",
                    onClick: () => {
                      onClose();
                      onEdit == null ? void 0 : onEdit(student);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5 mr-1" }),
                      " Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "student_profile.print_button",
                    onClick: () => setIdCardOpen(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5 mr-1" }),
                      " ID Card"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "student_profile.bonafide_button",
                    onClick: () => setCertPrintType("Bonafide"),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5 mr-1" }),
                      " Bonafide"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "student_profile.tc_button",
                    onClick: () => setCertPrintType("Transfer"),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5 mr-1" }),
                      " TC"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "student_profile.form_button",
                    onClick: () => setAdmFormOpen(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-3.5 w-3.5 mr-1" }),
                      " Form"
                    ]
                  }
                )
              ] })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Tabs,
            {
              defaultValue: "overview",
              className: "flex flex-col flex-1 min-h-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 rounded-none border-b border-border h-10 px-6 bg-muted/30 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "overview",
                      className: "text-xs",
                      "data-ocid": "student_profile.tab.overview",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 mr-1.5" }),
                        " Overview"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "academic",
                      className: "text-xs",
                      "data-ocid": "student_profile.tab.academic",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5 mr-1.5" }),
                        " Academic"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "attendance",
                      className: "text-xs",
                      "data-ocid": "student_profile.tab.attendance",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 mr-1.5" }),
                        " Attendance"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "fees",
                      className: "text-xs",
                      "data-ocid": "student_profile.tab.fees",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-3.5 w-3.5 mr-1.5" }),
                        " Fees"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-4 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "overview", className: "mt-0 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { title: "Personal Details", icon: User, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Date of Birth",
                          value: formatDate(student.dateOfBirth)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Gender", value: student.gender }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Blood Group", value: ext.bloodGroup ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Religion", value: ext.religion ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Category", value: ext.category ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Mother Tongue",
                          value: ext.motherTongue ?? "—"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Current Address",
                          value: student.currentAddress || "—"
                        }
                      ) }),
                      ext.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Email", value: ext.email }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { title: "Family Details", icon: User, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Father's Name", value: student.fatherName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Father's Mobile",
                          value: student.fatherMobile,
                          phone: true
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Mother's Name",
                          value: student.motherName || "—"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Mother's Mobile",
                          value: student.motherMobile || "—",
                          phone: true
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Siblings",
                          value: ext.siblings != null ? String(ext.siblings) : "—"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "academic", className: "mt-0 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { title: "Academic Details", icon: BookOpen, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Class",
                          value: CLASS_LABELS[student.classLevel]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Section", value: (section == null ? void 0 : section.name) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Admission No", value: student.admNo }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Session", value: student.sessionId }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Roll Number", value: ext.rollNumber ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Admission Date",
                          value: formatDate(student.createdAt)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Status",
                          value: student.isDiscontinued ? "Discontinued" : "Active"
                        }
                      ),
                      ext.previousSchool && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Previous School",
                          value: ext.previousSchool
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { title: "Transport Details", icon: Bus, children: student.transportRouteId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "Route Name", value: (route == null ? void 0 : route.name) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Bus Number",
                          value: (route == null ? void 0 : route.busNumber) ?? "—"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Driver Name",
                          value: (route == null ? void 0 : route.driverName) ?? "—"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Driver Mobile",
                          value: (route == null ? void 0 : route.driverMobile) ?? "—",
                          phone: true
                        }
                      ),
                      student.pickupPointId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldRow,
                        {
                          label: "Pickup Point",
                          value: student.pickupPointId
                        }
                      )
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-sm text-muted-foreground italic", children: "No transport assigned for this student." }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "attendance", className: "mt-0", children: loadingAttendance ? /* @__PURE__ */ jsxRuntimeExports.jsx(TabSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 rounded-xl border border-border p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { percent: attendancePct }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border p-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: totalDays }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Days" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-emerald-200 p-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-emerald-600", children: presentDays }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Present" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-red-200 p-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-destructive", children: absentDays }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Absent" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-amber-200 p-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-amber-600", children: lateDays + halfDays }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Late / Half Day" })
                        ] })
                      ] }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border p-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold", children: "Breakdown" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AttendanceBar,
                        {
                          label: "Present",
                          value: presentDays,
                          total: totalDays,
                          color: "bg-emerald-500"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AttendanceBar,
                        {
                          label: "Absent",
                          value: absentDays,
                          total: totalDays,
                          color: "bg-destructive"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AttendanceBar,
                        {
                          label: "Late",
                          value: lateDays,
                          total: totalDays,
                          color: "bg-amber-500"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AttendanceBar,
                        {
                          label: "Half Day",
                          value: halfDays,
                          total: totalDays,
                          color: "bg-blue-400"
                        }
                      )
                    ] }),
                    totalDays === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-center py-6 text-sm text-muted-foreground",
                        "data-ocid": "student_profile.attendance.empty_state",
                        children: "No attendance records found for this student."
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "fees", className: "mt-0", children: loadingPayments ? /* @__PURE__ */ jsxRuntimeExports.jsx(TabSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border p-4 text-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Total Paid" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-display text-foreground", children: formatCurrency(totalPaid) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Receipts" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-display text-emerald-700", children: payments.length })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border p-4 text-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Last Payment" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold font-display text-foreground", children: lastPayment ? formatCurrency(lastPayment.totalAmount) : "—" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border p-4 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Amount Paid" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-600", children: formatCurrency(totalPaid) })
                      ] }),
                      lastPayment && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "Last payment:",
                        " ",
                        formatCurrency(lastPayment.totalAmount),
                        " on",
                        " ",
                        formatDate(lastPayment.paymentDate),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground/60", children: [
                          "via ",
                          lastPayment.paymentMethod
                        ] })
                      ] })
                    ] }),
                    payments.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl border border-border overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 border-b border-border bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Payment History" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: sortedPayments.slice(0, 8).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "px-4 py-3 flex items-center justify-between",
                          "data-ocid": `student_profile.payment.item.${i + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                                "Receipt #",
                                p.receiptNo
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                                formatDate(p.paymentDate),
                                " ·",
                                " ",
                                p.paymentMethod
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-700", children: formatCurrency(p.totalAmount) })
                          ]
                        },
                        p.id
                      )) })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-center py-6 text-sm text-muted-foreground",
                        "data-ocid": "student_profile.fees.empty_state",
                        children: "No payment records found for this student."
                      }
                    )
                  ] }) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Enrolled: ",
              formatDate(student.createdAt),
              student.isDiscontinued && student.discontinuedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3 text-destructive", children: [
                "Discontinued: ",
                formatDate(student.discontinuedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              student.isDiscontinued ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "text-xs",
                  disabled: discontinueMutation.isPending,
                  onClick: async () => {
                    ue.info(
                      "To reactivate, edit the student and change their status."
                    );
                  },
                  "data-ocid": "student_profile.reactivate_button",
                  children: "Reactivate"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "destructive",
                  size: "sm",
                  className: "text-xs",
                  disabled: discontinueMutation.isPending,
                  onClick: async () => {
                    try {
                      await discontinueMutation.mutateAsync(student.id);
                      ue.success(
                        `${student.fullName} has been discontinued.`
                      );
                      onClose();
                    } catch (err) {
                      ue.error(
                        err instanceof Error ? err.message : "Failed to discontinue."
                      );
                    }
                  },
                  "data-ocid": "student_profile.discontinue_button",
                  children: discontinueMutation.isPending ? "Working…" : "Discontinue"
                }
              ),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs text-destructive hover:text-destructive",
                  onClick: () => setDeleteConfirmOpen(true),
                  "data-ocid": "student_profile.delete_button",
                  children: "Delete"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "text-xs",
                  onClick: onClose,
                  "data-ocid": "student_profile.close_button",
                  children: "Close"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    photoLightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PhotoLightbox,
      {
        src: student.photoUrl,
        name: student.fullName,
        onClose: () => setPhotoLightboxOpen(false)
      }
    ),
    idCardOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      IdCardPrintDialog,
      {
        student,
        section,
        onClose: () => setIdCardOpen(false)
      }
    ),
    admFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdmissionFormDialog,
      {
        student,
        section,
        onClose: () => setAdmFormOpen(false)
      }
    ),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: deleteConfirmOpen,
        onOpenChange: (open) => {
          if (!open) setDeleteConfirmOpen(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogContent,
          {
            className: "max-w-sm",
            "data-ocid": "student_profile.delete.dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-destructive text-base", children: "Delete Student?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Are you sure you want to permanently delete",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: student.fullName }),
                "? This action cannot be undone."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/30 transition-colors",
                    onClick: () => setDeleteConfirmOpen(false),
                    "data-ocid": "student_profile.delete.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "flex-1 rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-60",
                    disabled: deleteMutation.isPending,
                    onClick: async () => {
                      try {
                        await deleteMutation.mutateAsync(student.id);
                        ue.success(`"${student.fullName}" deleted.`);
                        setDeleteConfirmOpen(false);
                        onClose();
                      } catch (err) {
                        ue.error(
                          err instanceof Error ? err.message : "Delete failed."
                        );
                      }
                    },
                    "data-ocid": "student_profile.delete.confirm_button",
                    children: deleteMutation.isPending ? "Deleting…" : "Delete"
                  }
                )
              ] })
            ] })
          }
        )
      }
    ),
    certPrintType && (() => {
      const tmpl = allCertTemplates.find(
        (t) => t.templateType === certPrintType && t.isDefault
      ) ?? allCertTemplates.find((t) => t.templateType === certPrintType) ?? null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        GeneratePrintModal,
        {
          template: tmpl,
          forcedType: certPrintType,
          preStudent: student,
          onClose: () => setCertPrintType(null)
        }
      );
    })()
  ] });
}
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
  { key: "status", label: "Status", sticky: false }
];
const DEFAULT_VISIBLE = [
  "admNo",
  "fullName",
  "classLevel",
  "section",
  "gender",
  "fatherName",
  "fatherMobile",
  "mobile",
  "status"
];
const INITIAL_FORM = {
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
  classLevel: "Class1",
  sectionId: "",
  sessionId: "",
  dateOfBirth: "",
  gender: "Male",
  photoUrl: "",
  transportRouteId: null,
  transportMonths: []
};
function StatusBadge({ student }) {
  if (student.isDiscontinued) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Discontinued" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100", children: "Active" });
}
function DiscountDialog({ student, open, onClose }) {
  const { data: feeHeadings = [] } = useFeeHeadings();
  const { data: studentDiscounts = [] } = useStudentDiscounts(student.id);
  const saveDiscount = useSaveStudentDiscount();
  const removeDiscountMutation = useRemoveStudentDiscount();
  const [feeHeadingId, setFeeHeadingId] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [remarks, setRemarks] = reactExports.useState("");
  async function handleAdd() {
    if (!feeHeadingId || !amount || Number(amount) <= 0) return;
    try {
      await saveDiscount.mutateAsync({
        studentId: student.id,
        headingId: feeHeadingId,
        amount: BigInt(Math.round(Number(amount))),
        remark: remarks || null
      });
      setFeeHeadingId("");
      setAmount("");
      setRemarks("");
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "discount.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
        "Manage Discounts — ",
        student.fullName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Set monthly discount per fee head. It will auto-apply when collecting fees." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Add Discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Fee Head" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: feeHeadingId, onValueChange: setFeeHeadingId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs",
                  "data-ocid": "discount.fee_head.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select fee head" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: feeHeadings.filter((h) => h.isActive).map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: h.id, children: h.name }, h.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Monthly Discount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                className: "h-8 text-xs",
                placeholder: "0",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                "data-ocid": "discount.amount.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Remarks (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "h-8 text-xs",
              placeholder: "Reason for discount",
              value: remarks,
              onChange: (e) => setRemarks(e.target.value),
              "data-ocid": "discount.remarks.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: handleAdd,
            disabled: !feeHeadingId || !amount || Number(amount) <= 0,
            "data-ocid": "discount.add_button",
            children: "Add Discount"
          }
        )
      ] }),
      studentDiscounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-6 text-sm text-muted-foreground",
          "data-ocid": "discount.empty_state",
          children: "No discounts configured for this student."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Active Discounts" }),
        studentDiscounts.map((d, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2",
            "data-ocid": `discount.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: d.feeHeadingName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "₹",
                  d.monthlyDiscountAmount,
                  "/month",
                  d.remarks && ` · ${d.remarks}`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-destructive hover:text-destructive",
                  onClick: () => removeDiscountMutation.mutate({
                    id: d.id,
                    studentId: student.id
                  }),
                  disabled: removeDiscountMutation.isPending,
                  "data-ocid": `discount.delete_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          d.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        onClick: onClose,
        "data-ocid": "discount.close_button",
        children: "Close"
      }
    ) })
  ] }) });
}
function FamilyModal({
  mobile,
  allStudents,
  sections,
  onClose
}) {
  const familyStudents = allStudents.filter(
    (s) => s.fatherMobile === mobile || s.motherMobile === mobile || s.mobile === mobile
  );
  const discounts = useAppStore((s) => s.discounts);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", "data-ocid": "family.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-5 w-5 text-primary" }),
        "Family Group — ",
        mobile
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        familyStudents.length,
        " student(s) share this mobile number."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[60vh] overflow-y-auto pr-1", children: familyStudents.map((s, idx) => {
      const sec = sections.find((sc) => sc.id === s.sectionId);
      const studentDiscounts = discounts.filter(
        (d) => d.studentId === s.id
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg border border-border bg-muted/20 p-3 flex items-start gap-3",
          "data-ocid": `family.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: s.photoUrl, alt: s.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-primary/10 text-primary font-semibold", children: getInitials(s.fullName) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: s.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: s.admNo }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                  CLASS_LABELS[s.classLevel],
                  sec ? ` - ${sec.name}` : ""
                ] }),
                s.isDiscontinued && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Discontinued" }),
                studentDiscounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100", children: [
                  studentDiscounts.length,
                  " discount(s)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Father: ",
                s.fatherName,
                " · ",
                s.fatherMobile,
                s.motherMobile && ` · Mother: ${s.motherMobile}`
              ] })
            ] })
          ]
        },
        s.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        onClick: onClose,
        "data-ocid": "family.close_button",
        children: "Close"
      }
    ) })
  ] }) });
}
function AddStudentDialog({
  open,
  onClose,
  sections,
  currentSession
}) {
  const { data: routeOptions = [] } = useRoutes();
  const [form, setForm] = reactExports.useState({
    ...INITIAL_FORM,
    sessionId: currentSession,
    transportPickupPointId: null
  });
  const [tab, setTab] = reactExports.useState("personal");
  const addStudent = useAddStudent();
  const filteredSections = sections.filter(
    (s) => s.classLevel === form.classLevel
  );
  const { data: pickupPoints = [] } = usePickupPointsByRoute(
    form.transportRouteId ?? ""
  );
  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function toggleTransportMonth(month) {
    setForm((prev) => ({
      ...prev,
      transportMonths: prev.transportMonths.includes(month) ? prev.transportMonths.filter((m) => m !== month) : [...prev.transportMonths, month]
    }));
  }
  const [autoCreateAccounts, setAutoCreateAccounts] = reactExports.useState(true);
  const [createdCredentials, setCreatedCredentials] = reactExports.useState(null);
  function generatePass() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }
  const { data: allStudentsForCheck = [] } = useStudents();
  function handleSubmit() {
    if (!form.fullName || !form.fatherName || !form.fatherMobile) return;
    const resolvedAdmNo = form.admNo || generateId().slice(0, 8);
    if (form.admNo && allStudentsForCheck.some(
      (s) => s.admNo.trim().toLowerCase() === form.admNo.trim().toLowerCase()
    )) {
      ue.error(
        `Admission number ${form.admNo} already exists. Each admission number must be unique. Use a different admission number or edit the existing student.`,
        { duration: 8e3 }
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
        pickupPointId: form.transportPickupPointId || null
      },
      {
        onSuccess: () => {
          if (autoCreateAccounts) {
            setCreatedCredentials({
              studentUser: `STU${resolvedAdmNo}`,
              studentPass: generatePass(),
              parentUser: `PAR${form.fatherMobile}`,
              parentPass: generatePass()
            });
          } else {
            ue.success(`Student "${form.fullName}" added successfully`);
            setForm({
              ...INITIAL_FORM,
              sessionId: currentSession,
              transportPickupPointId: null
            });
            setTab("personal");
            onClose();
          }
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Failed to add student. Please try again.";
          if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("duplicate")) {
            ue.error(
              `Admission number ${resolvedAdmNo} already exists. Each admission number must be unique. Use a different admission number or edit the existing student.`,
              { duration: 8e3 }
            );
          } else {
            ue.error(msg);
          }
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] overflow-y-auto",
      "data-ocid": "add_student.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Add New Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Fill student details across the tabs." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "personal", "data-ocid": "add_student.tab.personal", children: "Personal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "academic", "data-ocid": "add_student.tab.academic", children: "Academic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "documents",
                "data-ocid": "add_student.tab.documents",
                children: "Documents"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "transport",
                "data-ocid": "add_student.tab.transport",
                children: "Transport"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "personal", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageUploadField,
              {
                label: "Student Photo",
                value: form.photoUrl,
                onChange: (url) => handleChange("photoUrl", url),
                onRemove: () => handleChange("photoUrl", ""),
                shape: "avatar",
                ocid: "add_student.photo.upload_button"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admNo", children: "Adm. No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "admNo",
                  placeholder: "e.g. 2025001",
                  value: form.admNo,
                  onChange: (e) => handleChange("admNo", e.target.value),
                  "data-ocid": "add_student.admNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullName", children: "Full Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fullName",
                  value: form.fullName,
                  onChange: (e) => handleChange("fullName", e.target.value),
                  "data-ocid": "add_student.fullName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fatherName", children: "Father Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fatherName",
                  value: form.fatherName,
                  onChange: (e) => handleChange("fatherName", e.target.value),
                  "data-ocid": "add_student.fatherName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "motherName", children: "Mother Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "motherName",
                  value: form.motherName,
                  onChange: (e) => handleChange("motherName", e.target.value),
                  "data-ocid": "add_student.motherName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fatherMobile", children: "Father Mobile *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fatherMobile",
                  type: "tel",
                  value: form.fatherMobile,
                  onChange: (e) => handleChange("fatherMobile", e.target.value),
                  "data-ocid": "add_student.fatherMobile.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "motherMobile", children: "Mother Mobile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "motherMobile",
                  type: "tel",
                  value: form.motherMobile,
                  onChange: (e) => handleChange("motherMobile", e.target.value),
                  "data-ocid": "add_student.motherMobile.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "studentMobile", children: "Student Mobile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "studentMobile",
                  type: "tel",
                  value: form.mobile,
                  onChange: (e) => handleChange("mobile", e.target.value),
                  "data-ocid": "add_student.mobile.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dob", children: "Date of Birth" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  id: "dob",
                  value: form.dateOfBirth,
                  onChange: (iso) => handleChange("dateOfBirth", iso),
                  "data-ocid": "add_student.dob.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.gender,
                  onValueChange: (v) => handleChange("gender", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.gender.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Male", children: "Male" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Female", children: "Female" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.category,
                  onValueChange: (v) => handleChange("category", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "General", children: "General" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "OBC", children: "OBC" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "SC", children: "SC" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ST", children: "ST" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EWS", children: "EWS" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admDate", children: "Admission Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  id: "admDate",
                  value: form.admissionDate,
                  onChange: (iso) => handleChange("admissionDate", iso),
                  "data-ocid": "add_student.admDate.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "academic", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.classLevel,
                  onValueChange: (v) => {
                    handleChange("classLevel", v);
                    handleChange("sectionId", "");
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Class" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.sectionId,
                  onValueChange: (v) => handleChange("sectionId", v),
                  disabled: !form.classLevel,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.section.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Section" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: filteredSections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sessionInput", children: "Session" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "sessionInput",
                  value: form.sessionId,
                  onChange: (e) => handleChange("sessionId", e.target.value),
                  placeholder: "2025-26",
                  "data-ocid": "add_student.session.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prevSchool", children: "Previous School" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "prevSchool",
                  value: form.prevSchool,
                  onChange: (e) => handleChange("prevSchool", e.target.value),
                  "data-ocid": "add_student.prevSchool.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "documents", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "aadhaar", children: "Aadhaar No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "aadhaar",
                  placeholder: "1234 5678 9012",
                  value: form.aadhaarNo,
                  onChange: (e) => handleChange("aadhaarNo", e.target.value),
                  "data-ocid": "add_student.aadhaar.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "srNo", children: "S.R. No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "srNo",
                  placeholder: "SR-2025-001",
                  value: form.srNo,
                  onChange: (e) => handleChange("srNo", e.target.value),
                  "data-ocid": "add_student.srNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "penNo", children: "Pen No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "penNo",
                  placeholder: "PEN...",
                  value: form.penNo,
                  onChange: (e) => handleChange("penNo", e.target.value),
                  "data-ocid": "add_student.penNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "apaarNo", children: "APAAR No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "apaarNo",
                  placeholder: "APAAR...",
                  value: form.apaarNo,
                  onChange: (e) => handleChange("apaarNo", e.target.value),
                  "data-ocid": "add_student.apaarNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Current Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "address",
                  className: "min-h-[80px] resize-none text-sm",
                  value: form.currentAddress,
                  onChange: (e) => handleChange("currentAddress", e.target.value),
                  placeholder: "House No, Street, Area, City, PIN",
                  "data-ocid": "add_student.address.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "village", children: "Permanent Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "village",
                  value: form.permanentAddress ?? "",
                  onChange: (e) => handleChange("permanentAddress", e.target.value),
                  "data-ocid": "add_student.village.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "transport", className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Transport Route" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.transportRouteId ?? "",
                    onValueChange: (v) => {
                      const routeId = v === "none" ? null : v;
                      if (routeId) {
                        setForm((prev) => ({
                          ...prev,
                          transportRouteId: routeId,
                          transportPickupPointId: null,
                          transportMonths: SCHOOL_MONTHS.filter(
                            (m) => m !== "June"
                          )
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          transportRouteId: null,
                          transportPickupPointId: null,
                          transportMonths: []
                        }));
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.route.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "None" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
                        routeOptions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id))
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "busNo", children: "Bus No." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "busNo",
                    value: form.busNo,
                    onChange: (e) => handleChange("busNo", e.target.value),
                    "data-ocid": "add_student.busNo.input"
                  }
                )
              ] }),
              form.transportRouteId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pickup Point" }),
                pickupPoints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No pickup points configured for this route." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.transportPickupPointId ?? "none",
                    onValueChange: (v) => handleChange(
                      "transportPickupPointId",
                      v === "none" ? null : v
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add_student.pickup_point.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select pickup point" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
                        pickupPoints.map((pp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: pp.id, children: [
                          pp.name,
                          pp.timing ? ` (${pp.timing})` : "",
                          " — ₹",
                          pp.monthlyFare,
                          "/month"
                        ] }, pp.id))
                      ] })
                    ]
                  }
                ),
                form.transportPickupPointId && pickupPoints.length > 0 && (() => {
                  const selectedPP = pickupPoints.find(
                    (pp) => pp.id === form.transportPickupPointId
                  );
                  return selectedPP ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary mt-1 font-medium", children: [
                    "Transport fee: ₹",
                    selectedPP.monthlyFare,
                    "/month (auto-applied for 11 months)"
                  ] }) : null;
                })()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Transport Fee Months" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: SCHOOL_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1.5 text-sm cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: `transport-month-${m}`,
                        checked: form.transportMonths.includes(m),
                        onCheckedChange: () => toggleTransportMonth(m),
                        "data-ocid": `add_student.transport_month.${m.toLowerCase()}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `transport-month-${m}`,
                        className: "cursor-pointer",
                        children: m
                      }
                    )
                  ]
                },
                m
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mr-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "autoCreateAccts",
                checked: autoCreateAccounts,
                onCheckedChange: (v) => setAutoCreateAccounts(v === true),
                "data-ocid": "add_student.auto_create_accounts.checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "autoCreateAccts",
                className: "text-xs text-muted-foreground cursor-pointer",
                children: "Auto-create login accounts (student & parent)"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "add_student.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: addStudent.isPending,
              "data-ocid": "add_student.submit_button",
              children: addStudent.isPending ? "Saving…" : "Add Student"
            }
          )
        ] }),
        createdCredentials && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: true,
            onOpenChange: () => {
              setCreatedCredentials(null);
              setForm({
                ...INITIAL_FORM,
                sessionId: currentSession,
                transportPickupPointId: null
              });
              setTab("personal");
              onClose();
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "max-w-sm",
                "data-ocid": "add_student.credentials_dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-green-700", children: "✅ Accounts Created" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Share these credentials with the student and parent. Passwords can be changed in User Management." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wide", children: "Student Account" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Username:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono font-bold text-foreground", children: createdCredentials.studentUser })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Password:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono font-bold text-foreground", children: createdCredentials.studentPass })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Permissions: View fees, attendance, results" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wide", children: "Parent Account" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Username:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono font-bold text-foreground", children: createdCredentials.parentUser })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Password:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono font-bold text-foreground", children: createdCredentials.parentPass })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Permissions: View child fees, attendance" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => {
                          const text = `Student: ${createdCredentials.studentUser} / ${createdCredentials.studentPass}
Parent: ${createdCredentials.parentUser} / ${createdCredentials.parentPass}`;
                          navigator.clipboard.writeText(text).then(() => ue.success("Credentials copied!"));
                        },
                        "data-ocid": "add_student.credentials_copy_button",
                        children: "Copy All"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: () => {
                          setCreatedCredentials(null);
                          setForm({
                            ...INITIAL_FORM,
                            sessionId: currentSession,
                            transportPickupPointId: null
                          });
                          setTab("personal");
                          onClose();
                        },
                        "data-ocid": "add_student.credentials_close_button",
                        children: "Done"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  ) });
}
function EditStudentDialog({
  student,
  open,
  onClose,
  sections
}) {
  const { data: routeOptions = [] } = useRoutes();
  const updateStudent = useUpdateStudent();
  const [form, setForm] = reactExports.useState({
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
    transportMonths: student.transportRouteId ? SCHOOL_MONTHS.filter((m) => m !== "June") : []
  });
  const [tab, setTab] = reactExports.useState("personal");
  const filteredSections = sections.filter(
    (s) => s.classLevel === form.classLevel
  );
  const { data: pickupPoints = [] } = usePickupPointsByRoute(
    form.transportRouteId ?? ""
  );
  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function toggleTransportMonthEdit(month) {
    setForm((prev) => ({
      ...prev,
      transportMonths: prev.transportMonths.includes(month) ? prev.transportMonths.filter((m) => m !== month) : [...prev.transportMonths, month]
    }));
  }
  function handleSubmit() {
    if (!form.fullName || !form.fatherName || !form.fatherMobile) return;
    updateStudent.mutate(
      {
        ...student,
        ...form,
        transportRouteId: form.transportRouteId || null,
        pickupPointId: form.transportPickupPointId || null
      },
      {
        onSuccess: () => {
          ue.success(`"${form.fullName}" updated successfully`);
          onClose();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Failed to update student. Please try again.";
          ue.error(msg);
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] overflow-y-auto",
      "data-ocid": "edit_student.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Edit Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update student details." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "personal", "data-ocid": "edit_student.tab.personal", children: "Personal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "academic", "data-ocid": "edit_student.tab.academic", children: "Academic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "documents",
                "data-ocid": "edit_student.tab.documents",
                children: "Documents"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "transport",
                "data-ocid": "edit_student.tab.transport",
                children: "Transport"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "personal", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageUploadField,
              {
                label: "Student Photo",
                value: form.photoUrl,
                onChange: (url) => handleChange("photoUrl", url),
                onRemove: () => handleChange("photoUrl", ""),
                shape: "avatar",
                ocid: "edit_student.photo.upload_button"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-admNo", children: "Adm. No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-admNo",
                  value: form.admNo,
                  onChange: (e) => handleChange("admNo", e.target.value),
                  "data-ocid": "edit_student.admNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-fullName", children: "Full Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-fullName",
                  value: form.fullName,
                  onChange: (e) => handleChange("fullName", e.target.value),
                  "data-ocid": "edit_student.fullName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-fatherName", children: "Father Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-fatherName",
                  value: form.fatherName,
                  onChange: (e) => handleChange("fatherName", e.target.value),
                  "data-ocid": "edit_student.fatherName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-motherName", children: "Mother Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-motherName",
                  value: form.motherName,
                  onChange: (e) => handleChange("motherName", e.target.value),
                  "data-ocid": "edit_student.motherName.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-fatherMobile", children: "Father Mobile *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-fatherMobile",
                  type: "tel",
                  value: form.fatherMobile,
                  onChange: (e) => handleChange("fatherMobile", e.target.value),
                  "data-ocid": "edit_student.fatherMobile.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-motherMobile", children: "Mother Mobile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-motherMobile",
                  type: "tel",
                  value: form.motherMobile,
                  onChange: (e) => handleChange("motherMobile", e.target.value),
                  "data-ocid": "edit_student.motherMobile.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-dob", children: "Date of Birth" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  id: "edit-dob",
                  value: form.dateOfBirth,
                  onChange: (iso) => handleChange("dateOfBirth", iso),
                  "data-ocid": "edit_student.dob.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.gender,
                  onValueChange: (v) => handleChange("gender", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.gender.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Male", children: "Male" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Female", children: "Female" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.category,
                  onValueChange: (v) => handleChange("category", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "General", children: "General" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "OBC", children: "OBC" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "SC", children: "SC" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ST", children: "ST" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EWS", children: "EWS" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-admDate", children: "Admission Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DateInput,
                {
                  id: "edit-admDate",
                  value: form.admissionDate,
                  onChange: (iso) => handleChange("admissionDate", iso),
                  "data-ocid": "edit_student.admDate.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "academic", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.classLevel,
                  onValueChange: (v) => {
                    handleChange("classLevel", v);
                    handleChange("sectionId", "");
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.sectionId,
                  onValueChange: (v) => handleChange("sectionId", v),
                  disabled: !form.classLevel,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.section.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Section" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: filteredSections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-sessionInput", children: "Session" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-sessionInput",
                  value: form.sessionId,
                  onChange: (e) => handleChange("sessionId", e.target.value),
                  "data-ocid": "edit_student.session.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-prevSchool", children: "Previous School" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-prevSchool",
                  value: form.prevSchool,
                  onChange: (e) => handleChange("prevSchool", e.target.value),
                  "data-ocid": "edit_student.prevSchool.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "documents", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-aadhaar", children: "Aadhaar No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-aadhaar",
                  value: form.aadhaarNo,
                  onChange: (e) => handleChange("aadhaarNo", e.target.value),
                  "data-ocid": "edit_student.aadhaar.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-srNo", children: "S.R. No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-srNo",
                  value: form.srNo,
                  onChange: (e) => handleChange("srNo", e.target.value),
                  "data-ocid": "edit_student.srNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-penNo", children: "Pen No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-penNo",
                  value: form.penNo,
                  onChange: (e) => handleChange("penNo", e.target.value),
                  "data-ocid": "edit_student.penNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-apaarNo", children: "APAAR No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-apaarNo",
                  value: form.apaarNo,
                  onChange: (e) => handleChange("apaarNo", e.target.value),
                  "data-ocid": "edit_student.apaarNo.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-address", children: "Current Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "edit-address",
                  className: "min-h-[80px] resize-none text-sm",
                  value: form.currentAddress,
                  onChange: (e) => handleChange("currentAddress", e.target.value),
                  "data-ocid": "edit_student.address.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-village", children: "Permanent Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-village",
                  value: form.permanentAddress,
                  onChange: (e) => handleChange("permanentAddress", e.target.value),
                  "data-ocid": "edit_student.village.input"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "transport", className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Transport Route" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.transportRouteId ?? "none",
                    onValueChange: (v) => {
                      const routeId = v === "none" ? null : v;
                      setForm((prev) => ({
                        ...prev,
                        transportRouteId: routeId,
                        transportPickupPointId: null
                      }));
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.route.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "None" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
                        routeOptions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id))
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-busNo", children: "Bus No." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-busNo",
                    value: form.busNo,
                    onChange: (e) => handleChange("busNo", e.target.value),
                    "data-ocid": "edit_student.busNo.input"
                  }
                )
              ] }),
              form.transportRouteId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pickup Point" }),
                pickupPoints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No pickup points configured for this route." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.transportPickupPointId ?? "none",
                    onValueChange: (v) => handleChange(
                      "transportPickupPointId",
                      v === "none" ? null : v
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "edit_student.pickup_point.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select pickup point" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
                        pickupPoints.map((pp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: pp.id, children: [
                          pp.name,
                          pp.timing ? ` (${pp.timing})` : "",
                          " — ₹",
                          pp.monthlyFare,
                          "/month"
                        ] }, pp.id))
                      ] })
                    ]
                  }
                ),
                form.transportPickupPointId && pickupPoints.length > 0 && (() => {
                  const selectedPP = pickupPoints.find(
                    (pp) => pp.id === form.transportPickupPointId
                  );
                  return selectedPP ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary mt-1 font-medium", children: [
                    "Transport fee: ₹",
                    selectedPP.monthlyFare,
                    "/month (auto-applied for 11 months)"
                  ] }) : null;
                })()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Transport Fee Months" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Transport fees are automatically applied for 11 months (April to March, excluding June). Adjust if needed." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: SCHOOL_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1.5 text-sm cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: `edit-transport-month-${m}`,
                        checked: form.transportMonths.includes(m),
                        onCheckedChange: () => toggleTransportMonthEdit(m),
                        "data-ocid": `edit_student.transport_month.${m.toLowerCase()}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `edit-transport-month-${m}`,
                        className: cn(
                          "cursor-pointer",
                          m === "June" && "text-muted-foreground line-through"
                        ),
                        children: m
                      }
                    )
                  ]
                },
                m
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              disabled: updateStudent.isPending,
              "data-ocid": "edit_student.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: updateStudent.isPending || !form.fullName || !form.fatherName || !form.fatherMobile,
              "data-ocid": "edit_student.submit_button",
              children: updateStudent.isPending ? "Saving…" : "Save Changes"
            }
          )
        ] })
      ]
    }
  ) });
}
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
  "Session"
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
    "2025-26"
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
    "2025-26"
  ]
];
function downloadStudentTemplate() {
  const csvRows = [
    IMPORT_TEMPLATE_HEADERS.join(","),
    ...IMPORT_TEMPLATE_ROWS.map(
      (row) => row.map(
        (cell) => /[,\n"]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(",")
    )
  ].join("\n");
  downloadCSVString(csvRows, "students-import-template.csv");
}
function BulkPhotoUploadDialog({
  open,
  onClose,
  students
}) {
  const [items, setItems] = reactExports.useState([]);
  const [stage, setStage] = reactExports.useState("select");
  const [successCount, setSuccessCount] = reactExports.useState(0);
  const fileInputRef = reactExports.useRef(null);
  const updateStudentSilent = useUpdateStudentSilent();
  const queryClient = useQueryClient();
  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const accepted = Array.from(files).filter(
      (f) => /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (accepted.length === 0) {
      ue.error("No supported image files (JPG, PNG, WEBP).");
      return;
    }
    const matched = accepted.map((file) => {
      const admNo = file.name.replace(/\.[^.]+$/, "").trim();
      const student = students.find(
        (s) => s.admNo.trim().toLowerCase() === admNo.toLowerCase()
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
    const snapshot = queryClient.getQueryData(["students"]) ?? [];
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      if (!item.student) continue;
      updated[i] = { ...item, status: "uploading" };
      setItems([...updated]);
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(item.file);
        });
        const updatedStudent = { ...item.student, photoUrl: dataUrl };
        await updateStudentSilent.mutateAsync(updatedStudent);
        queryClient.setQueryData(["students"], (old) => {
          const base = old && old.length > 0 ? old : snapshot;
          return base.map(
            (s) => s.id === updatedStudent.id ? { ...s, photoUrl: dataUrl } : s
          );
        });
        updated[i] = { ...updated[i], status: "done" };
        ok++;
      } catch (e) {
        updated[i] = {
          ...updated[i],
          status: "error",
          error: e instanceof Error ? e.message : "Failed"
        };
      }
      setItems([...updated]);
    }
    setSuccessCount(ok);
    if (ok > 0) {
      const current = queryClient.getQueryData(["students"]);
      const base = current && current.length > 0 ? current : snapshot;
      queryClient.setQueryData(["students"], base);
      queryClient.invalidateQueries({
        queryKey: ["students"],
        refetchType: "none"
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          reset();
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-2xl max-h-[90vh] overflow-y-auto",
          "data-ocid": "bulk_photo.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Bulk Student Photo Upload" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
                "Upload photos named by student admission number (e.g.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "ADM001.jpg" }),
                "). They are auto-matched and saved."
              ] })
            ] }),
            stage === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border-2 border-dashed border-border rounded-xl p-10 text-center space-y-3 cursor-pointer hover:bg-muted/20 transition-colors",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                },
                "data-ocid": "bulk_photo.dropzone",
                onKeyDown: (e) => {
                  var _a;
                  return e.key === "Enter" && ((_a = fileInputRef.current) == null ? void 0 : _a.click());
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-10 mx-auto text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Drop photos here or click to select" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "File names must match student Adm. No. (e.g.",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "2025001.jpg" }),
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Supports JPG, JPEG, PNG, WEBP" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/jpeg,image/png,image/webp",
                      multiple: true,
                      className: "hidden",
                      onChange: (e) => handleFiles(e.target.files),
                      "data-ocid": "bulk_photo.file_input"
                    }
                  )
                ]
              }
            ),
            (stage === "preview" || stage === "uploading" || stage === "done") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-green-700 border-green-500/40",
                    children: [
                      matchedCount,
                      " matched"
                    ]
                  }
                ),
                unmatchedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-destructive border-destructive/40",
                    children: [
                      unmatchedCount,
                      " unmatched"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                  items.length,
                  " total files"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "File" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Student" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border last:border-0",
                    "data-ocid": `bulk_photo.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-muted-foreground", children: item.file.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-sm", children: item.student ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                        item.student.fullName,
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                          "#",
                          item.admNo
                        ] })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive text-xs", children: [
                        '✖ No student found for "',
                        item.admNo,
                        '"'
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-xs", children: [
                        item.status === "pending" && item.student && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "✓ Ready" }),
                        item.status === "pending" && !item.student && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Skip" }),
                        item.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary animate-pulse", children: "Uploading…" }),
                        item.status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "✓ Done" }),
                        item.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", title: item.error, children: "✖ Error" })
                      ] })
                    ]
                  },
                  item.file.name
                )) })
              ] }) }),
              stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center",
                  "data-ocid": "bulk_photo.success_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
                      "✅ ",
                      successCount,
                      " photo",
                      successCount !== 1 ? "s" : "",
                      " updated successfully."
                    ] }),
                    unmatchedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      unmatchedCount,
                      " file",
                      unmatchedCount !== 1 ? "s" : "",
                      " could not be matched to any student."
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border", children: [
              stage === "select" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: onClose,
                  "data-ocid": "bulk_photo.cancel_button",
                  children: "Cancel"
                }
              ),
              stage === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: reset,
                    "data-ocid": "bulk_photo.back_button",
                    children: "Back"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: uploadAll,
                    disabled: matchedCount === 0,
                    "data-ocid": "bulk_photo.upload_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 mr-1.5" }),
                      "Upload ",
                      matchedCount,
                      " Photo",
                      matchedCount !== 1 ? "s" : ""
                    ]
                  }
                )
              ] }),
              stage === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: true, "data-ocid": "bulk_photo.loading_state", children: "Uploading…" }),
              stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => {
                    reset();
                    onClose();
                  },
                  "data-ocid": "bulk_photo.close_button",
                  children: "Done"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function BulkImportDialog({
  open,
  onClose,
  sections
}) {
  const [stage, setStage] = reactExports.useState("upload");
  const [parsedRows, setParsedRows] = reactExports.useState([]);
  const [progressDone, setProgressDone] = reactExports.useState(0);
  const [progressRetrying, setProgressRetrying] = reactExports.useState(0);
  const [progressFailed, setProgressFailed] = reactExports.useState(0);
  const [importStats, setImportStats] = reactExports.useState({ success: 0, failed: 0 });
  const [rowErrors, setRowErrors] = reactExports.useState([]);
  const [backendWarning, setBackendWarning] = reactExports.useState("");
  const [failedRowIndices, setFailedRowIndices] = reactExports.useState([]);
  const fileRef = reactExports.useRef(null);
  const addStudent = useAddStudent();
  const updateStudentMutation = useUpdateStudent();
  const { data: sessions = [] } = useSessions();
  const { data: allStudentsForImport = [] } = useStudents();
  const { currentSession } = useAppStore();
  const RETRY_DELAYS = [1e3, 2e3, 4e3];
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    return lines.map((line) => {
      const cells = [];
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
  function buildHeaderMap(headers) {
    const map = {};
    headers.forEach((h, i) => {
      map[h.toLowerCase().replace(/[^a-z0-9]/g, "")] = i;
    });
    return map;
  }
  function get(row, map, ...keys) {
    for (const k of keys) {
      const idx = map[k];
      if (idx !== void 0 && row[idx]) return row[idx].trim();
    }
    return "";
  }
  function mapClassLevel(label) {
    const lower = label.toLowerCase().trim();
    if (lower === "play way" || lower === "playway") return "PlayWay";
    if (lower === "lkg") return "LKG";
    if (lower === "ukg") return "UKG";
    const match = lower.match(/(\d+)/);
    if (match) return `Class${match[1]}`;
    return "Class1";
  }
  async function checkBackendHealth() {
    if (sessions.length > 0) return true;
    try {
      return true;
    } catch {
      return false;
    }
  }
  async function importRow(row, hmap, rowNum, onRetry) {
    const fullName = get(row, hmap, "fullname", "name", "studentname");
    if (!fullName)
      return { ok: false, error: `Row ${rowNum}: Missing Full Name` };
    const fatherMobile = get(
      row,
      hmap,
      "fathermobile",
      "fathersmobile",
      "mobile",
      "phone"
    );
    if (!fatherMobile)
      return { ok: false, error: `Row ${rowNum}: Missing Father Mobile` };
    const classLevelResolved = mapClassLevel(
      get(row, hmap, "class", "classlevel")
    );
    const sectionNameRaw = get(row, hmap, "section", "sectionid") || "";
    const resolvedSection = sections.find(
      (s) => s.classLevel === classLevelResolved && s.name.toLowerCase().trim() === sectionNameRaw.toLowerCase().trim()
    );
    const sectionId = (resolvedSection == null ? void 0 : resolvedSection.id) ?? sectionNameRaw;
    const payload = {
      // Column A — Adm No
      admNo: get(row, hmap, "admno", "admissionno", "adm") || `IMP${Date.now()}`,
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
        "altmobile"
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
        "permaddress"
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
        "dateofadmission"
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
      gender: get(row, hmap, "gender") || "Male",
      photoUrl: "",
      isDiscontinued: false,
      discontinuedAt: null,
      transportRouteId: null,
      pickupPointId: null
    };
    const existingStudent = allStudentsForImport.find(
      (s) => s.admNo.trim().toLowerCase() === payload.admNo.trim().toLowerCase()
    );
    let lastError = "Unknown error";
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      if (attempt > 0) {
        onRetry(true);
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt - 1]));
      }
      try {
        if (existingStudent) {
          await updateStudentMutation.mutateAsync({
            ...existingStudent,
            ...payload,
            id: existingStudent.id
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
  function handleFileChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      var _a2;
      const text = (_a2 = evt.target) == null ? void 0 : _a2.result;
      const rows = parseCSV(text);
      if (rows.length <= 1) {
        ue.error("File appears empty or has no data rows");
        return;
      }
      setParsedRows(rows);
      setStage("preview");
    };
    reader.readAsText(file);
  }
  async function startImport(rowsToImport) {
    if (parsedRows.length < 2) return;
    setStage("importing");
    setProgressDone(0);
    setProgressRetrying(0);
    setProgressFailed(0);
    const healthy = await checkBackendHealth();
    if (!healthy) {
      setBackendWarning(
        "Backend connection issue detected. Import may fail. Try again or contact support."
      );
    } else {
      setBackendWarning("");
    }
    const [headerRow2, ...dataRows] = parsedRows;
    const hmap = buildHeaderMap(headerRow2);
    const targetIndices = rowsToImport ?? dataRows.map((_, i) => i);
    let done = 0;
    let failed = 0;
    let retrying = 0;
    const errors = [];
    const failedIdx = [];
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
        const name = get(row, hmap, "fullname", "name", "studentname") || "Unknown";
        errors.push({ row: i + 2, name, error: result.error });
        failedIdx.push(i);
      }
    }
    setImportStats({ success: done, failed });
    setRowErrors(errors);
    setFailedRowIndices(failedIdx);
    if (done > 0) ue.success(`${done} student(s) imported successfully`);
    else if (failed > 0)
      ue.error(`Import failed — ${failed} row(s) could not be saved`);
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
  const previewCols = Array.from(
    { length: Math.min(8, headerRow.length) },
    (_, i) => i
  ).filter((i) => i < headerRow.length);
  const expectedColCount = IMPORT_TEMPLATE_HEADERS.length;
  const uploadedColCount = headerRow.length;
  const hasColumnCountWarning = uploadedColCount > 0 && uploadedColCount < expectedColCount;
  const total = Math.max(parsedRows.length - 1, 1);
  const progressPct = Math.round(
    (progressDone + progressFailed) / total * 100
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "bulk_import.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Bulk Import Students" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload a CSV file to import multiple students at once." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Need a template?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Download a pre-filled CSV with all required columns." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: downloadStudentTemplate,
          className: "shrink-0 ml-3",
          "data-ocid": "bulk_import.download_template_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CloudDownload, { className: "h-3.5 w-3.5 mr-1.5" }),
            "Download Template"
          ]
        }
      )
    ] }),
    backendWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300", children: [
      "⚠️ ",
      backendWarning
    ] }),
    stage === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors",
        onClick: () => {
          var _a;
          return (_a = fileRef.current) == null ? void 0 : _a.click();
        },
        "data-ocid": "bulk_import.dropzone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-muted-foreground mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Click to upload CSV" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Columns: Adm. No., Full Name, Class, Section, Gender, DOB, Father Name, Father Mobile…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: ".csv,.txt",
              className: "hidden",
              onChange: handleFileChange
            }
          )
        ]
      }
    ) }),
    stage === "preview" && parsedRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
          "Preview — ",
          parsedRows.length - 1,
          " row(s) detected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          uploadedColCount,
          " column",
          uploadedColCount !== 1 ? "s" : "",
          " ",
          "detected"
        ] }),
        hasColumnCountWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full", children: [
          "⚠ Only ",
          uploadedColCount,
          " of ",
          expectedColCount,
          " expected columns found."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border overflow-x-auto max-h-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs min-w-max w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          previewCols.map((ci) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "th",
            {
              className: "px-2 py-1.5 text-left font-medium whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground mr-1", children: [
                  String.fromCharCode(65 + ci),
                  ":"
                ] }),
                headerRow[ci] ?? `Col ${ci + 1}`
              ]
            },
            ci
          )),
          headerRow.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap", children: [
            "+",
            headerRow.length - 8,
            " more"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: previewRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-border even:bg-muted/20",
            children: [
              previewCols.map((ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: "px-2 py-1.5 truncate max-w-[120px]",
                  children: row[ci] ?? ""
                },
                ci
              )),
              headerRow.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-muted-foreground text-[10px]", children: "…" })
            ]
          },
          row[0] ?? Math.random().toString()
        )) })
      ] }) }),
      parsedRows.length - 1 > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "… and ",
        parsedRows.length - 4,
        " more rows"
      ] })
    ] }),
    stage === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-center", children: [
        "Importing… ",
        progressDone + progressFailed,
        "/",
        parsedRows.length - 1,
        " ",
        "done",
        progressRetrying > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-600 ml-2", children: [
          "— ",
          progressRetrying,
          " retrying"
        ] }),
        progressFailed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive ml-2", children: [
          "— ",
          progressFailed,
          " failed"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-2.5 bg-muted rounded-full overflow-hidden",
          "data-ocid": "bulk_import.progress",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary rounded-full transition-all duration-300",
              style: { width: `${progressPct}%` }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Please do not close this window" })
    ] }),
    stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", "data-ocid": "bulk_import.success_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg bg-green-50 border border-green-200 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-700", children: importStats.success }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-0.5", children: "Imported successfully" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-destructive", children: importStats.failed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 mt-0.5", children: "Failed / skipped" })
        ] })
      ] }),
      rowErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-2 max-h-40 overflow-y-auto space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-destructive mb-1", children: "Failed rows:" }),
        rowErrors.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-xs text-destructive",
            children: [
              "Row ",
              e.row,
              " — ",
              e.name,
              ": ",
              e.error
            ]
          },
          `${e.row}-${e.name}`
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border pt-2 flex-wrap gap-2", children: [
      stage === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => startImport(),
          disabled: parsedRows.length < 2,
          "data-ocid": "bulk_import.submit_button",
          children: [
            "Import ",
            parsedRows.length - 1,
            " Students"
          ]
        }
      ),
      stage === "done" && failedRowIndices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => startImport(failedRowIndices),
          "data-ocid": "bulk_import.retry_button",
          children: [
            "Retry Failed Rows (",
            failedRowIndices.length,
            ")"
          ]
        }
      ),
      stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleClose, "data-ocid": "bulk_import.close_button", children: "Done" }),
      stage !== "importing" && stage !== "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: handleClose,
          "data-ocid": "bulk_import.cancel_button",
          children: "Cancel"
        }
      )
    ] })
  ] }) });
}
function ExportColumnsDialog({
  open,
  onClose,
  visibleCols,
  onExport
}) {
  const [checked, setChecked] = reactExports.useState(new Set(visibleCols));
  function handleOpenChange(isOpen) {
    if (isOpen) setChecked(new Set(visibleCols));
    else onClose();
  }
  function toggle(key) {
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }
  function toggleAll() {
    if (checked.size === ALL_COLUMNS.length) {
      setChecked(/* @__PURE__ */ new Set());
    } else {
      setChecked(new Set(ALL_COLUMNS.map((c) => c.key)));
    }
  }
  const orderedChecked = ALL_COLUMNS.filter((c) => checked.has(c.key)).map(
    (c) => c.key
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "export_cols.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Export Columns" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Choose which columns to include in the CSV export. Column order follows the table display order." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-h-72 overflow-y-auto pr-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-sm font-medium cursor-pointer py-1.5 border-b border-border mb-2",
          onClick: toggleAll,
          onKeyDown: (e) => e.key === "Enter" && toggleAll(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "export-all",
                checked: checked.size === ALL_COLUMNS.length,
                onCheckedChange: toggleAll,
                "data-ocid": "export_cols.select_all"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "export-all", className: "cursor-pointer", children: checked.size === ALL_COLUMNS.length ? "Deselect All" : "Select All" })
          ]
        }
      ),
      ALL_COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-sm cursor-pointer py-0.5 hover:bg-muted/30 rounded px-1",
          onClick: () => toggle(col.key),
          onKeyDown: (e) => e.key === "Enter" && toggle(col.key),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: `export-col-${col.key}`,
                checked: checked.has(col.key),
                onCheckedChange: () => toggle(col.key),
                "data-ocid": `export_cols.col.${col.key}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: `export-col-${col.key}`,
                className: "cursor-pointer",
                children: col.label
              }
            )
          ]
        },
        col.key
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "export_cols.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          disabled: orderedChecked.length === 0,
          onClick: () => onExport(orderedChecked),
          "data-ocid": "export_cols.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CloudDownload, { className: "h-3.5 w-3.5 mr-1.5" }),
            "Export ",
            orderedChecked.length,
            " column",
            orderedChecked.length !== 1 ? "s" : ""
          ]
        }
      )
    ] })
  ] }) });
}
const COLUMN_GROUPS = [
  {
    label: "Basic Info",
    keys: ["admNo", "fullName", "classLevel", "section", "status"]
  },
  {
    label: "Contact",
    keys: ["mobile", "fatherMobile", "motherMobile"]
  },
  {
    label: "Family",
    keys: ["fatherName", "motherName"]
  },
  {
    label: "Address",
    keys: ["currentAddress", "permanentAddress"]
  },
  {
    label: "Academic",
    keys: [
      "srNo",
      "penNo",
      "apaarNo",
      "admissionDate",
      "prevSchool",
      "category"
    ]
  },
  {
    label: "Personal",
    keys: ["gender", "dateOfBirth", "aadhaarNo"]
  },
  {
    label: "Transport",
    keys: ["transportRouteId", "busNo"]
  }
];
function ColumnToggle({
  visibleCols,
  onToggle,
  onReset
}) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);
  function toggleGroup(keys) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        type: "button",
        onClick: () => setOpen((v) => !v),
        "data-ocid": "students.column_toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 mr-1.5" }),
          "Columns",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 bg-primary/10 text-primary text-[10px] font-semibold px-1 rounded", children: [
            totalVisible,
            "/",
            totalCols
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute right-0 top-9 z-[9999] bg-card border border-border rounded-xl shadow-xl p-0 w-64 max-h-[500px] flex flex-col",
        "data-ocid": "students.column_popover",
        onClick: (e) => e.stopPropagation(),
        onKeyDown: (e) => e.stopPropagation(),
        onMouseDown: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Toggle Columns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onReset,
                className: "text-[10px] text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "students.column_reset_button",
                children: "Reset defaults"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto flex-1 p-2 space-y-3", children: COLUMN_GROUPS.map((group) => {
            const allOn = group.keys.every((k) => visibleCols.has(k));
            const someOn = group.keys.some((k) => visibleCols.has(k));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 mb-1 cursor-pointer select-none",
                  onClick: () => toggleGroup(group.keys),
                  onKeyDown: (e) => e.key === "Enter" && toggleGroup(group.keys),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        checked: allOn,
                        "data-state": someOn && !allOn ? "indeterminate" : void 0,
                        onCheckedChange: () => toggleGroup(group.keys),
                        className: "h-3.5 w-3.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: group.label })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-5 space-y-0.5", children: group.keys.map((key) => {
                const col = ALL_COLUMNS.find((c) => c.key === key);
                if (!col) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 py-0.5 text-sm cursor-pointer hover:bg-muted/30 rounded px-1 transition-colors",
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggle(key);
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle(key);
                      }
                    },
                    onMouseDown: (e) => e.preventDefault(),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          id: `col-toggle-${key}`,
                          checked: visibleCols.has(key),
                          onCheckedChange: () => onToggle(key),
                          className: "h-3.5 w-3.5"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: `col-toggle-${key}`,
                          className: "cursor-pointer text-xs select-none",
                          children: col.label
                        }
                      )
                    ]
                  },
                  key
                );
              }) })
            ] }, group.label);
          }) })
        ]
      }
    )
  ] });
}
function PromoteAllClassesDialog({
  open,
  onClose,
  sessions
}) {
  const [step, setStep] = reactExports.useState("select");
  const [fromSession, setFromSession] = reactExports.useState("");
  const [toSession, setToSession] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
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
      const res = await promoteAll.mutateAsync({
        fromSession,
        toSession
      });
      setResult(res);
      setStep("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Promotion failed.";
      ue.error(msg);
      setStep("preview");
    }
  }
  const canPreview = !!fromSession && !!toSession && fromSession !== toSession;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-xl max-h-[90vh] overflow-y-auto",
      "data-ocid": "promote_all.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-5 w-5 text-primary" }),
            "Promote All Students"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Promote every student up one class across all classes in a single operation." })
        ] }),
        (step === "select" || step === "preview") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From Session" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fromSession, onValueChange: setFromSession, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "promote_all.from_session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select session" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To Session (New)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: toSession, onValueChange: setToSession, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "promote_all.to_session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select session" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ] })
            ] })
          ] }),
          step === "preview" && canPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: "Promotion Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
                "This will promote all students from",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fromSession }),
                " to",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: toSession }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Each student moves up one class in Indian school order:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 text-xs", children: [
                CLASS_ORDER.map((cls, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card border border-border rounded px-1.5 py-0.5 font-medium", children: CLASS_LABELS[cls] }),
                  i < CLASS_ORDER.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" })
                ] }, cls)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-100 text-amber-800 border border-amber-200 rounded px-1.5 py-0.5 font-medium", children: "Alumni" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Class 12 students will be marked as Graduated/Alumni." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "⚠️ Non-destructive:" }),
              " All original data in",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fromSession }),
              " will be preserved. Nothing is deleted."
            ] })
          ] })
        ] }),
        step === "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "py-8 flex flex-col items-center gap-3",
            "data-ocid": "promote_all.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Promoting students across all classes…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Please do not close this window." })
            ]
          }
        ),
        step === "result" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "promote_all.success_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-green-50 border border-green-200 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-700", children: result.totalPromoted }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-1 font-medium", children: "Students Promoted" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-destructive", children: result.totalFailed }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 mt-1 font-medium", children: "Failed / Skipped" })
            ] })
          ] }),
          result.breakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Class-wise Breakdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-52 overflow-y-auto", children: result.breakdown.map((b, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 flex items-center gap-3 text-sm",
                "data-ocid": `promote_all.breakdown.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium min-w-0 truncate", children: b.className }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-700 font-semibold min-w-[40px] text-right", children: [
                    "✓ ",
                    b.promoted
                  ] }),
                  b.failed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-semibold min-w-[40px] text-right", children: [
                    "✗ ",
                    b.failed
                  ] })
                ]
              },
              b.className
            )) })
          ] }),
          result.breakdown.some((b) => b.errors.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-36 overflow-y-auto space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-destructive", children: "Errors:" }),
            result.breakdown.flatMap((b) => b.errors).map((err) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err }, err))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border pt-3 gap-2", children: [
          step === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: handleClose,
                "data-ocid": "promote_all.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                disabled: !canPreview,
                onClick: () => setStep("preview"),
                "data-ocid": "promote_all.next_button",
                children: "Next: Preview"
              }
            )
          ] }),
          step === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setStep("select"),
                "data-ocid": "promote_all.back_button",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleConfirm,
                disabled: !canPreview,
                "data-ocid": "promote_all.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4 mr-1.5" }),
                  "Promote All Students"
                ]
              }
            )
          ] }),
          step === "result" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleClose, "data-ocid": "promote_all.close_button", children: "Done" })
        ] })
      ]
    }
  ) });
}
const PAGE_SIZE = 20;
function StudentsPage() {
  const { currentSession, setSession, discounts, currentRole } = useAppStore();
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const deleteStudent = useDeleteStudent();
  const deleteAllStudents = useDeleteAllStudents();
  const discontinueStudent = useDiscontinueStudent();
  const { data: students = [], isLoading } = useStudents();
  const { data: sections = [] } = useSections();
  const { data: routes = [] } = useRoutes();
  const queryClient = useQueryClient();
  const [filters, setFilters] = reactExports.useState({
    session: currentSession,
    classLevel: "",
    sectionId: "",
    status: "",
    search: "",
    familyMobile: ""
  });
  const [sortKey, setSortKey] = reactExports.useState("admNo");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [page, setPage] = reactExports.useState(1);
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [importOpen, setImportOpen] = reactExports.useState(false);
  const [bulkPhotoOpen, setBulkPhotoOpen] = reactExports.useState(false);
  const [exportOpen, setExportOpen] = reactExports.useState(false);
  const [promoteAllOpen, setPromoteAllOpen] = reactExports.useState(false);
  const [exportTargetIds, setExportTargetIds] = reactExports.useState(
    null
  );
  const [detailStudent, setDetailStudent] = reactExports.useState(null);
  const [editStudentTarget, setEditStudentTarget] = reactExports.useState(
    null
  );
  const [discountStudent, setDiscountStudent] = reactExports.useState(null);
  const [familyMobile, setFamilyMobile] = reactExports.useState(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = reactExports.useState(null);
  const [bulkAction, setBulkAction] = reactExports.useState(
    null
  );
  const [deleteAllStep, setDeleteAllStep] = reactExports.useState(0);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = reactExports.useState("");
  const [parentSearch, setParentSearch] = reactExports.useState("");
  const [printStudent, setPrintStudent] = reactExports.useState(null);
  const { data: allTemplates = [] } = useCertificateTemplates();
  const [visibleCols, setVisibleCols] = reactExports.useState(() => {
    try {
      const saved = localStorage.getItem("shubh_student_visible_cols");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed);
      }
    } catch {
    }
    return new Set(DEFAULT_VISIBLE);
  });
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(
        "shubh_student_visible_cols",
        JSON.stringify(Array.from(visibleCols))
      );
    } catch {
    }
  }, [visibleCols]);
  function toggleCol(key) {
    setVisibleCols((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }
  const familyMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of students) {
      for (const mob of [s.fatherMobile, s.motherMobile, s.mobile]) {
        if (!mob) continue;
        if (!map.has(mob)) map.set(mob, /* @__PURE__ */ new Set());
        map.get(mob).add(s.id);
      }
    }
    for (const [mob, ids] of map) {
      if (ids.size <= 1) map.delete(mob);
    }
    return map;
  }, [students]);
  function getStudentFamilyMobile(s) {
    for (const mob of [s.fatherMobile, s.motherMobile, s.mobile]) {
      if (mob && familyMap.has(mob)) return mob;
    }
    return null;
  }
  const filtered = reactExports.useMemo(() => {
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
        const primaryMatch = s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q) || s.fatherMobile.includes(q) || s.motherMobile.includes(q) || s.mobile.includes(q) || s.fatherName.toLowerCase().includes(q) || s.motherName.toLowerCase().includes(q) || s.permanentAddress.toLowerCase().includes(q);
        if (!primaryMatch) return false;
      }
      if (parentSearch) {
        const pq = parentSearch.toLowerCase();
        const parentMatch = s.fatherName.toLowerCase().includes(pq) || s.motherName.toLowerCase().includes(pq);
        if (!parentMatch) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = String(
        a[sortKey] ?? ""
      );
      const bv = String(
        b[sortKey] ?? ""
      );
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [students, filters, parentSearch, sortKey, sortDir, familyMap]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sectionOptions = sections.filter(
    (s) => !filters.classLevel || s.classLevel === filters.classLevel
  );
  const allPageSelected = paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id));
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
  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }
  function openExport(ids) {
    setExportTargetIds(ids ?? null);
    setExportOpen(true);
  }
  function doExport(selectedColKeys) {
    const source = exportTargetIds ? filtered.filter((s) => exportTargetIds.has(s.id)) : filtered;
    const colLabelMap = Object.fromEntries(
      ALL_COLUMNS.map((c) => [c.key, c.label])
    );
    const rows = source.map((s) => {
      var _a, _b;
      const record = {};
      for (const key of selectedColKeys) {
        const label = colLabelMap[key] ?? key;
        if (key === "classLevel") record[label] = CLASS_LABELS[s.classLevel];
        else if (key === "section")
          record[label] = ((_a = sections.find((sec) => sec.id === s.sectionId)) == null ? void 0 : _a.name) ?? "";
        else if (key === "transportRouteId")
          record[label] = ((_b = routes.find((r) => r.id === s.transportRouteId)) == null ? void 0 : _b.name) ?? "";
        else if (key === "status")
          record[label] = s.isDiscontinued ? "Discontinued" : "Active";
        else
          record[label] = s[key] ?? "";
      }
      return record;
    });
    const orderedKeys = selectedColKeys.map(
      (k) => colLabelMap[k] ?? k
    );
    downloadCSV(rows, `students_${filters.session}.csv`, orderedKeys);
    setExportOpen(false);
  }
  function sortArrow(key) {
    if (sortKey !== key) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5", children: sortDir === "asc" ? "↑" : "↓" });
  }
  const STICKY = {
    checkbox: "sticky left-0 z-20 bg-inherit",
    photo: "sticky left-10 z-20 bg-inherit",
    admNo: "sticky left-[88px] z-20 bg-inherit",
    fullName: "sticky left-[168px] z-20 bg-inherit shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 h-full", "data-ocid": "students.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card rounded-xl border border-border p-3 flex flex-wrap items-center gap-2 shadow-sm",
        "data-ocid": "students.toolbar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm", children: "Students" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs ml-1", children: filtered.length }),
            filters.familyMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs ml-1 bg-accent/20 text-accent-foreground", children: [
              "Family: ",
              filters.familyMobile,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFilters((f) => ({ ...f, familyMobile: "" })),
                  className: "ml-1",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-px bg-border mx-1 hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filters.session,
              onValueChange: (v) => {
                setFilters((f) => ({ ...f, session: v }));
                setSession(v);
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs w-[100px]",
                    "data-ocid": "students.session.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                  "2019-20",
                  "2020-21",
                  "2021-22",
                  "2022-23",
                  "2023-24",
                  "2024-25",
                  "2025-26"
                ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filters.classLevel || "all",
              onValueChange: (v) => {
                setFilters((f) => ({
                  ...f,
                  classLevel: v === "all" ? "" : v,
                  sectionId: ""
                }));
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs w-[110px]",
                    "data-ocid": "students.class.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                  CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filters.sectionId || "all",
              onValueChange: (v) => {
                setFilters((f) => ({ ...f, sectionId: v === "all" ? "" : v }));
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs w-[90px]",
                    "data-ocid": "students.section.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Sec" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Sections" }),
                  sectionOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
                    "Sec ",
                    s.name
                  ] }, s.id))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filters.status || "all",
              onValueChange: (v) => {
                setFilters((f) => ({ ...f, status: v === "all" ? "" : v }));
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs w-[110px]",
                    "data-ocid": "students.status.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "discontinued", children: "Discontinued" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-8 text-xs pl-8",
                placeholder: "Search name, mobile, village…",
                value: filters.search,
                onChange: (e) => {
                  setFilters((f) => ({ ...f, search: e.target.value }));
                  setPage(1);
                },
                "data-ocid": "students.search_input"
              }
            ),
            filters.search && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "absolute right-2 top-1/2 -translate-y-1/2",
                onClick: () => setFilters((f) => ({ ...f, search: "" })),
                "data-ocid": "students.search_clear",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 text-muted-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[150px] max-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-7 text-xs pl-7 pr-6",
                placeholder: "Father / Mother Name",
                value: parentSearch,
                onChange: (e) => {
                  setParentSearch(e.target.value);
                  setPage(1);
                },
                "data-ocid": "students.parent_search_input"
              }
            ),
            parentSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "absolute right-2 top-1/2 -translate-y-1/2",
                onClick: () => {
                  setParentSearch("");
                  setPage(1);
                },
                "data-ocid": "students.parent_search_clear",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 text-muted-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ColumnToggle,
              {
                visibleCols,
                onToggle: toggleCol,
                onReset: () => {
                  try {
                    localStorage.removeItem("shubh_student_visible_cols");
                  } catch {
                  }
                  setVisibleCols(new Set(DEFAULT_VISIBLE));
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setImportOpen(true),
                "data-ocid": "students.import_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Import"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setBulkPhotoOpen(true),
                "data-ocid": "students.bulk_photo_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Bulk Photos"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => openExport(),
                "data-ocid": "students.export_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CloudDownload, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Export"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => setAddOpen(true),
                "data-ocid": "students.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Add Student"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPromoteAllOpen(true),
                "data-ocid": "students.promote_all_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Promote All"
                ]
              }
            ),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                size: "sm",
                onClick: () => setDeleteAllStep(1),
                "data-ocid": "students.delete_all_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Delete All"
                ]
              }
            )
          ] })
        ]
      }
    ),
    selectedIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 flex items-center gap-3",
        "data-ocid": "students.bulk_action_bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-primary", children: [
            selectedIds.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => openExport(selectedIds),
                "data-ocid": "students.bulk_export_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CloudDownload, { className: "h-3.5 w-3.5 mr-1" }),
                  " Export"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                size: "sm",
                onClick: () => setBulkAction("discontinue"),
                "data-ocid": "students.bulk_discontinue_button",
                children: "Discontinue"
              }
            ),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                size: "sm",
                onClick: () => setBulkAction("delete"),
                "data-ocid": "students.bulk_delete_button",
                children: "Delete"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setSelectedIds(/* @__PURE__ */ new Set()),
                "data-ocid": "students.bulk_clear",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col",
        "data-ocid": "students.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              className: "w-full text-xs border-collapse",
              style: {
                minWidth: visibleCols.size <= DEFAULT_VISIBLE.length ? void 0 : "2400px",
                tableLayout: visibleCols.size <= DEFAULT_VISIBLE.length ? "auto" : "auto"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 sticky top-0 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: cn(
                        "w-10 px-3 py-2.5 text-left bg-muted/50",
                        STICKY.checkbox
                      ),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          checked: allPageSelected,
                          onCheckedChange: toggleSelectAll,
                          "data-ocid": "students.select_all"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: cn(
                        "w-10 px-2 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50",
                        STICKY.photo
                      ),
                      children: "Photo"
                    }
                  ),
                  visibleCols.has("admNo") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "th",
                    {
                      className: cn(
                        "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground select-none whitespace-nowrap bg-muted/50",
                        STICKY.admNo
                      ),
                      onClick: () => handleSort("admNo"),
                      onKeyDown: (e) => e.key === "Enter" && handleSort("admNo"),
                      "data-ocid": "students.sort.admNo",
                      children: [
                        "Adm. No. ",
                        sortArrow("admNo")
                      ]
                    }
                  ),
                  visibleCols.has("fullName") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "th",
                    {
                      className: cn(
                        "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground select-none whitespace-nowrap bg-muted/50",
                        STICKY.fullName
                      ),
                      onClick: () => handleSort("fullName"),
                      onKeyDown: (e) => e.key === "Enter" && handleSort("fullName"),
                      "data-ocid": "students.sort.fullName",
                      children: [
                        "Full Name ",
                        sortArrow("fullName")
                      ]
                    }
                  ),
                  ALL_COLUMNS.filter(
                    (c) => !c.sticky && visibleCols.has(c.key)
                  ).map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted/50",
                      children: col.label
                    },
                    col.key
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50 whitespace-nowrap", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 30,
                    className: "text-center py-12 text-muted-foreground",
                    "data-ocid": "students.loading_state",
                    children: "Loading students…"
                  }
                ) }) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    colSpan: 30,
                    className: "py-16 text-center",
                    "data-ocid": "students.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "No students found" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Try adjusting the filters or add a new student." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          className: "mt-4",
                          onClick: () => setAddOpen(true),
                          "data-ocid": "students.empty_add_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5 mr-1.5" }),
                            " Add Student"
                          ]
                        }
                      )
                    ]
                  }
                ) }) : paginated.map((student, idx) => {
                  const sec = sections.find((s) => s.id === student.sectionId);
                  const route = routes.find(
                    (r) => r.id === student.transportRouteId
                  );
                  const familyMob = getStudentFamilyMobile(student);
                  const isFamily = !!familyMob;
                  const isSelected = selectedIds.has(student.id);
                  const rowNum = (page - 1) * PAGE_SIZE + idx + 1;
                  const studentDiscountsCount = discounts.filter(
                    (d) => d.studentId === student.id
                  ).length;
                  const rowBg = isSelected ? "bg-primary/5" : idx % 2 === 0 ? "bg-background" : "bg-muted/20";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: cn(
                        "border-t border-border transition-colors cursor-pointer hover:bg-primary/10",
                        rowBg
                      ),
                      onClick: () => setDetailStudent(student),
                      onKeyDown: (e) => e.key === "Enter" && setDetailStudent(student),
                      "data-ocid": `students.item.${rowNum}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: cn("px-3 py-2", STICKY.checkbox, rowBg),
                            onClick: (e) => e.stopPropagation(),
                            onKeyDown: (e) => e.stopPropagation(),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Checkbox,
                              {
                                checked: isSelected,
                                onCheckedChange: () => setSelectedIds((prev) => {
                                  const n = new Set(prev);
                                  if (n.has(student.id)) n.delete(student.id);
                                  else n.add(student.id);
                                  return n;
                                }),
                                "data-ocid": `students.checkbox.${rowNum}`
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-2 py-2", STICKY.photo, rowBg), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AvatarImage,
                            {
                              src: student.photoUrl,
                              alt: student.fullName
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] bg-primary/10 text-primary font-semibold", children: getInitials(student.fullName) })
                        ] }) }),
                        visibleCols.has("admNo") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: cn(
                              "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap",
                              STICKY.admNo,
                              rowBg
                            ),
                            children: student.admNo
                          }
                        ),
                        visibleCols.has("fullName") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: cn(
                              "px-3 py-2 whitespace-nowrap",
                              STICKY.fullName,
                              rowBg
                            ),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-[140px]", children: student.fullName }),
                              isFamily && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  title: "View Family",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    setFamilyMobile(familyMob);
                                  },
                                  className: "text-[10px] bg-blue-100 text-blue-700 px-1 rounded hover:bg-blue-200 transition-colors",
                                  "data-ocid": `students.family_badge.${rowNum}`,
                                  children: "👨‍👩‍👧"
                                }
                              ),
                              studentDiscountsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  title: "Has discounts",
                                  className: "text-[10px] bg-amber-100 text-amber-700 px-1 rounded",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-2.5 w-2.5 inline" })
                                }
                              )
                            ] })
                          }
                        ),
                        visibleCols.has("classLevel") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap font-medium", children: CLASS_LABELS[student.classLevel] }),
                        visibleCols.has("section") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: (sec == null ? void 0 : sec.name) ?? "—" }),
                        visibleCols.has("gender") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: student.gender }),
                        visibleCols.has("dateOfBirth") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap font-mono", children: formatDate(student.dateOfBirth) || "—" }),
                        visibleCols.has("fatherName") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate", children: student.fatherName }),
                        visibleCols.has("fatherMobile") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: `tel:${student.fatherMobile}`,
                            className: "text-primary hover:underline font-mono",
                            onClick: (e) => e.stopPropagation(),
                            children: student.fatherMobile
                          }
                        ) }),
                        visibleCols.has("motherName") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate", children: student.motherName || "—" }),
                        visibleCols.has("motherMobile") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: student.motherMobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: `tel:${student.motherMobile}`,
                            className: "text-primary hover:underline font-mono",
                            onClick: (e) => e.stopPropagation(),
                            children: student.motherMobile
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                        visibleCols.has("mobile") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: student.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: `tel:${student.mobile}`,
                            className: "text-primary hover:underline font-mono",
                            onClick: (e) => e.stopPropagation(),
                            children: student.mobile
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                        visibleCols.has("permanentAddress") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap", children: student.permanentAddress || "—" }),
                        visibleCols.has("category") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: student.category ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: student.category }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                        visibleCols.has("currentAddress") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[160px] truncate", children: student.currentAddress || "—" }),
                        visibleCols.has("aadhaarNo") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: student.aadhaarNo || "—" }),
                        visibleCols.has("srNo") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: student.srNo || "—" }),
                        visibleCols.has("penNo") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: student.penNo || "—" }),
                        visibleCols.has("apaarNo") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: student.apaarNo || "—" }),
                        visibleCols.has("prevSchool") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[140px] truncate", children: student.prevSchool || "—" }),
                        visibleCols.has("admissionDate") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: formatDate(student.admissionDate) || "—" }),
                        visibleCols.has("transportRouteId") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap max-w-[120px] truncate", children: (route == null ? void 0 : route.name) ?? (student.transportRouteId ? student.transportRouteId : "—") }),
                        visibleCols.has("busNo") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground whitespace-nowrap", children: student.busNo || "—" }),
                        visibleCols.has("status") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { student }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex items-center justify-end gap-1",
                            onClick: (e) => e.stopPropagation(),
                            onKeyDown: (e) => e.stopPropagation(),
                            children: [
                              isFamily && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 text-blue-600",
                                  onClick: () => setFamilyMobile(familyMob),
                                  "data-ocid": `students.view_family_button.${rowNum}`,
                                  title: "View Family",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-3.5 w-3.5" })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 text-amber-600",
                                  onClick: () => setDiscountStudent(student),
                                  "data-ocid": `students.discount_button.${rowNum}`,
                                  title: "Manage Discounts",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-3.5 w-3.5" })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7",
                                  onClick: () => setDetailStudent(student),
                                  "data-ocid": `students.view_button.${rowNum}`,
                                  title: "View Details",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 text-blue-600",
                                  onClick: () => setPrintStudent({ student, type: "IDCard" }),
                                  "data-ocid": `students.id_card_button.${rowNum}`,
                                  title: "Print ID Card",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5" })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7",
                                  onClick: () => setEditStudentTarget(student),
                                  "data-ocid": `students.edit_button.${rowNum}`,
                                  title: "Edit",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" })
                                }
                              ),
                              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 text-destructive hover:text-destructive",
                                  onClick: () => setDeleteConfirmStudent(student),
                                  "data-ocid": `students.delete_button.${rowNum}`,
                                  title: "Delete Student (Admin)",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                                }
                              )
                            ]
                          }
                        ) })
                      ]
                    },
                    student.id
                  );
                }) })
              ]
            }
          ) }),
          totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Showing ",
              (page - 1) * PAGE_SIZE + 1,
              "–",
              Math.min(page * PAGE_SIZE, filtered.length),
              " of ",
              filtered.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs",
                  disabled: page === 1,
                  onClick: () => setPage((p) => p - 1),
                  "data-ocid": "students.pagination_prev",
                  children: "← Prev"
                }
              ),
              Array.from(
                { length: Math.min(totalPages, 7) },
                (_, i) => i + 1
              ).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: p === page ? "default" : "outline",
                  size: "sm",
                  className: "h-7 w-7 text-xs p-0",
                  onClick: () => setPage(p),
                  "data-ocid": `students.page.${p}`,
                  children: p
                },
                p
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs",
                  disabled: page === totalPages,
                  onClick: () => setPage((p) => p + 1),
                  "data-ocid": "students.pagination_next",
                  children: "Next →"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddStudentDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        sections,
        currentSession
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkImportDialog,
      {
        open: importOpen,
        onClose: () => setImportOpen(false),
        sections
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkPhotoUploadDialog,
      {
        open: bulkPhotoOpen,
        onClose: async () => {
          setBulkPhotoOpen(false);
          await queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        students
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportColumnsDialog,
      {
        open: exportOpen,
        onClose: () => setExportOpen(false),
        visibleCols,
        onExport: doExport
      }
    ),
    detailStudent && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentProfileModal,
      {
        student: detailStudent,
        sections,
        onClose: () => setDetailStudent(null),
        onEdit: (s) => {
          setDetailStudent(null);
          setEditStudentTarget(s);
        }
      }
    ),
    editStudentTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditStudentDialog,
      {
        student: editStudentTarget,
        open: true,
        onClose: () => setEditStudentTarget(null),
        sections
      }
    ),
    discountStudent && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DiscountDialog,
      {
        student: discountStudent,
        open: true,
        onClose: () => setDiscountStudent(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PromoteAllClassesDialog,
      {
        open: promoteAllOpen,
        onClose: () => setPromoteAllOpen(false),
        sessions: [
          "2019-20",
          "2020-21",
          "2021-22",
          "2022-23",
          "2023-24",
          "2024-25",
          "2025-26",
          "2026-27"
        ]
      }
    ),
    familyMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FamilyModal,
      {
        mobile: familyMobile,
        allStudents: students,
        sections,
        onClose: () => setFamilyMobile(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: bulkAction !== null,
        onOpenChange: (open) => {
          if (!open) setBulkAction(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm",
            "data-ocid": "students.bulk_confirm.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: bulkAction === "delete" ? "Delete Students?" : "Discontinue Students?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: bulkAction === "delete" ? `Permanently delete ${selectedIds.size} student(s). Cannot be undone.` : `Mark ${selectedIds.size} student(s) as discontinued. They will be blocked from fees and attendance.` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setBulkAction(null),
                    "data-ocid": "students.bulk_confirm.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    onClick: async () => {
                      const ids = Array.from(selectedIds);
                      if (bulkAction === "discontinue") {
                        for (const id of ids) {
                          await discontinueStudent.mutateAsync(id).catch(() => {
                          });
                        }
                        ue.success(`${ids.length} student(s) discontinued.`);
                      } else if (bulkAction === "delete" && isAdmin) {
                        for (const id of ids) {
                          await deleteStudent.mutateAsync(id).catch(() => {
                          });
                        }
                        ue.success(`${ids.length} student(s) deleted.`);
                      }
                      setSelectedIds(/* @__PURE__ */ new Set());
                      setBulkAction(null);
                    },
                    "data-ocid": "students.bulk_confirm.confirm_button",
                    children: bulkAction === "delete" ? "Delete" : "Discontinue"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dialog,
        {
          open: deleteAllStep === 1,
          onOpenChange: (open) => {
            if (!open) {
              setDeleteAllStep(0);
            }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogContent,
            {
              className: "max-w-sm",
              "data-ocid": "students.delete_all.dialog",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-destructive", children: "Delete ALL Students?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
                    "Are you sure you want to delete all student records? This cannot be undone. All ",
                    students.length,
                    " students and their fee payment records will be permanently removed."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: () => setDeleteAllStep(0),
                      "data-ocid": "students.delete_all.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "destructive",
                      onClick: () => {
                        setDeleteAllStep(2);
                        setDeleteAllConfirmText("");
                      },
                      "data-ocid": "students.delete_all.next_button",
                      children: "Continue"
                    }
                  )
                ] })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dialog,
        {
          open: deleteAllStep === 2,
          onOpenChange: (open) => {
            if (!open) {
              setDeleteAllStep(0);
              setDeleteAllConfirmText("");
            }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogContent,
            {
              className: "max-w-sm",
              "data-ocid": "students.delete_all_final.dialog",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-destructive", children: "⚠️ FINAL WARNING" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
                    "This will permanently delete all ",
                    students.length,
                    " students and their related records. Type ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "DELETE" }),
                    " to confirm."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Type DELETE to confirm",
                    value: deleteAllConfirmText,
                    onChange: (e) => setDeleteAllConfirmText(e.target.value),
                    "data-ocid": "students.delete_all_final.input",
                    className: "font-mono"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: () => {
                        setDeleteAllStep(0);
                        setDeleteAllConfirmText("");
                      },
                      "data-ocid": "students.delete_all_final.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "destructive",
                      disabled: deleteAllConfirmText !== "DELETE" || deleteAllStudents.isPending,
                      onClick: async () => {
                        try {
                          await deleteAllStudents.mutateAsync();
                          ue.success("All student records have been deleted.");
                          setDeleteAllStep(0);
                          setDeleteAllConfirmText("");
                        } catch (err) {
                          ue.error(
                            err instanceof Error ? err.message : "Delete all failed."
                          );
                        }
                      },
                      "data-ocid": "students.delete_all_final.confirm_button",
                      children: deleteAllStudents.isPending ? "Deleting…" : "Delete All Students"
                    }
                  )
                ] })
              ]
            }
          )
        }
      )
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: deleteConfirmStudent !== null,
        onOpenChange: (open) => {
          if (!open) setDeleteConfirmStudent(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm",
            "data-ocid": "students.delete.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Student?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
                  "Are you sure you want to permanently delete",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: deleteConfirmStudent == null ? void 0 : deleteConfirmStudent.fullName }),
                  "? This action cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setDeleteConfirmStudent(null),
                    "data-ocid": "students.delete.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    disabled: deleteStudent.isPending,
                    onClick: async () => {
                      if (!deleteConfirmStudent) return;
                      try {
                        await deleteStudent.mutateAsync(deleteConfirmStudent.id);
                        ue.success(
                          `"${deleteConfirmStudent.fullName}" deleted successfully.`
                        );
                        setDeleteConfirmStudent(null);
                      } catch (err) {
                        ue.error(
                          err instanceof Error ? err.message : "Delete failed."
                        );
                      }
                    },
                    "data-ocid": "students.delete.confirm_button",
                    children: deleteStudent.isPending ? "Deleting…" : "Delete"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    printStudent && (() => {
      const tmpl = allTemplates.find(
        (t) => t.templateType === printStudent.type && t.isDefault
      ) ?? allTemplates.find((t) => t.templateType === printStudent.type) ?? null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        GeneratePrintModal,
        {
          template: tmpl,
          forcedType: printStudent.type,
          preStudent: printStudent.student,
          onClose: () => setPrintStudent(null)
        }
      );
    })()
  ] });
}
export {
  StudentsPage as default
};
