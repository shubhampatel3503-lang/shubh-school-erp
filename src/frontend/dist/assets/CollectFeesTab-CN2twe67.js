import { ae as createLucideIcon, d as useAppStore, a5 as useStudents, bm as useFeeHeadings, bn as useFeePlans, bp as useSchoolInfo, e7 as useRecordPayment, r as reactExports, e8 as useStudentFeeCollectionData, e9 as useGetPreviousSessionBalance, bl as SCHOOL_MONTHS, j as jsxRuntimeExports, t as Badge, L as Label, I as Input, X, i as CLASS_LABELS, bk as formatCurrency, e as Button, aR as IndianRupee, U as Users, B as BookOpen, a0 as formatDate, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, k as DialogFooter, F as ue, cf as Settings } from "./index-pMBTUEbj.js";
import { F as FeeReceiptTemplate } from "./FeeReceiptTemplate-BjT7XvY6.js";
import { C as Checkbox } from "./checkbox-B6f3RDRz.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { U as User } from "./user-C6bo2V5_.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const MONTHS = SCHOOL_MONTHS;
const TRANSPORT_MONTHS = MONTHS.filter((m) => m !== "June");
function todayIso() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function safeNum(v) {
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function getAutoSelectedMonths() {
  const currentCalMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
  const academicOrder = [
    { name: "April", cal: 4 },
    { name: "May", cal: 5 },
    { name: "June", cal: 6 },
    { name: "July", cal: 7 },
    { name: "August", cal: 8 },
    { name: "September", cal: 9 },
    { name: "October", cal: 10 },
    { name: "November", cal: 11 },
    { name: "December", cal: 12 },
    { name: "January", cal: 1 },
    { name: "February", cal: 2 },
    { name: "March", cal: 3 }
  ];
  const selected = /* @__PURE__ */ new Set();
  for (const m of academicOrder) {
    selected.add(m.name);
    if (m.cal === currentCalMonth) break;
  }
  return selected;
}
function numDisplay(override, fallback) {
  if (override !== "") return override;
  if (fallback === 0 || !Number.isFinite(fallback)) return "";
  return String(fallback);
}
function ReceiptModal({
  open,
  onClose,
  payment,
  student,
  schoolInfo,
  feeHeadings
}) {
  const [size, setSize] = reactExports.useState("quarter");
  if (!open || !payment || !student) return null;
  const mobile = student.fatherMobile || student.mobile || "";
  const whatsappText = encodeURIComponent(
    `*Fee Receipt*
Student: ${student.fullName}
Adm No: ${student.admNo}
Class: ${CLASS_LABELS[student.classLevel] ?? student.classLevel}
Receipt No: ${payment.receiptNo}
Date: ${formatDate(payment.paymentDate)}
Amount Paid: ₹${payment.totalAmount.toLocaleString("en-IN")}
Balance: ₹${(payment.balance ?? 0).toLocaleString("en-IN")}

Thank you for your payment!`
  );
  const whatsappUrl = mobile ? `https://wa.me/91${mobile.replace(/\D/g, "")}?text=${whatsappText}` : "";
  function handlePrint() {
    const el = document.getElementById("fee-receipt-print");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const pageSize = size === "quarter" ? "105mm 148mm" : size === "half" ? "210mm 148mm" : "210mm 297mm";
    win.document.write(
      `<html><head><title>Fee Receipt</title><style>@page{size:${pageSize};margin:0}body{margin:0;padding:0}@media print{body{margin:0;padding:0}}</style></head><body style="margin:0;padding:0">${el.outerHTML}</body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }
  function handleEditTemplate() {
    onClose();
    window.location.href = "/certificate-studio?type=FeeReceipt&returnTo=%2Ffees";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-5xl max-h-[90vh] overflow-auto z-[60]",
      "data-ocid": "fees.receipt.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Fee Receipt" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Size:" }),
          ["half", "a4", "quarter"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSize(s),
              className: `px-3 py-1 text-xs rounded border transition-colors ${size === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`,
              children: s === "a4" ? "A4 Full" : s === "half" ? "Half Page" : "Quarter"
            },
            s
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto border border-border rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FeeReceiptTemplate,
          {
            payment,
            student,
            schoolInfo,
            feeHeadings,
            size
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 flex-wrap", children: [
          whatsappUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "gap-2 border-green-500 text-green-700 hover:bg-green-50",
              onClick: () => window.open(whatsappUrl, "_blank"),
              "data-ocid": "fees.receipt.whatsapp_button",
              children: "📱 Send WhatsApp"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2",
              onClick: handleEditTemplate,
              "data-ocid": "fees.receipt.edit_template_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14 }),
                " Edit Template"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2",
              onClick: handlePrint,
              "data-ocid": "fees.receipt.print_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 }),
                " Print Receipt"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "fees.receipt.close_button",
              children: "Close"
            }
          )
        ] })
      ]
    }
  ) });
}
function CollectFeesTab() {
  var _a, _b;
  const { currentUser, currentSession } = useAppStore();
  const collectedBy = (currentUser == null ? void 0 : currentUser.fullName) ?? "Admin";
  const isAdmin = (((_a = currentUser == null ? void 0 : currentUser.role) == null ? void 0 : _a.toLowerCase()) ?? "") === "admin" || (((_b = currentUser == null ? void 0 : currentUser.role) == null ? void 0 : _b.toLowerCase()) ?? "") === "accountant";
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: feeHeadings = [], isLoading: loadingHeadings } = useFeeHeadings();
  const { data: feePlans = [], isLoading: loadingPlans } = useFeePlans();
  const { data: schoolInfoData } = useSchoolInfo();
  const recordPaymentMutation = useRecordPayment();
  const schoolInfo = schoolInfoData ?? {
    name: "SHUBH SCHOOL ERP",
    tagline: "",
    about: "",
    photoUrl: "",
    address: "",
    phone: "",
    email: ""
  };
  const [search, setSearch] = reactExports.useState("");
  const [showDropdown, setShowDropdown] = reactExports.useState(false);
  const [selectedStudentId, setSelectedStudentId] = reactExports.useState("");
  const [rows, setRows] = reactExports.useState([]);
  const [payMode, setPayMode] = reactExports.useState("Cash");
  const [remarks, setRemarks] = reactExports.useState("");
  const [receiptAmt, setReceiptAmt] = reactExports.useState("");
  const [paymentDate, setPaymentDate] = reactExports.useState(todayIso());
  const [receiptPayment, setReceiptPayment] = reactExports.useState(null);
  const [showReceipt, setShowReceipt] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [isDeletingPayment, setIsDeletingPayment] = reactExports.useState(false);
  const [discountOverride, setDiscountOverride] = reactExports.useState("");
  const [lateFees, setLateFees] = reactExports.useState("");
  const [oldBalOverride, setOldBalOverride] = reactExports.useState("");
  const [includePrevBalance, setIncludePrevBalance] = reactExports.useState(false);
  const [includePrevSessionDue, setIncludePrevSessionDue] = reactExports.useState(false);
  const searchRef = reactExports.useRef(null);
  const {
    data: feeData,
    isLoading: loadingFeeData,
    refetch: refetchFeeData
  } = useStudentFeeCollectionData(selectedStudentId, currentSession);
  const { data: prevSessionData } = useGetPreviousSessionBalance(
    selectedStudentId,
    currentSession
  );
  const prevSessionDueAmount = (prevSessionData == null ? void 0 : prevSessionData.previousYearDue) ?? (prevSessionData == null ? void 0 : prevSessionData.amount) ?? 0;
  reactExports.useEffect(() => {
    if (!feeData) return;
    const oldBal = safeNum(feeData.oldBalanceAmount ?? 0);
    if (oldBal > 0) {
      setIncludePrevBalance(true);
    }
    setOldBalOverride("");
    setIncludePrevSessionDue(false);
  }, [feeData]);
  reactExports.useEffect(() => {
    setSelectedStudentId("");
    setSearch("");
    setRows([]);
    setReceiptAmt("");
    setDiscountOverride("");
    setLateFees("");
    setOldBalOverride("");
    setIncludePrevSessionDue(false);
  }, [currentSession]);
  reactExports.useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const student = reactExports.useMemo(() => {
    if (!selectedStudentId) return null;
    return allStudents.find((s) => s.id === selectedStudentId) ?? null;
  }, [allStudents, selectedStudentId]);
  const filteredStudents = reactExports.useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return allStudents.filter(
      (s) => {
        var _a2, _b2, _c;
        return ((_a2 = s == null ? void 0 : s.fullName) == null ? void 0 : _a2.toLowerCase().includes(q)) || ((_b2 = s == null ? void 0 : s.admNo) == null ? void 0 : _b2.toLowerCase().includes(q)) || ((_c = s == null ? void 0 : s.fatherMobile) == null ? void 0 : _c.includes(q));
      }
    ).slice(0, 8);
  }, [allStudents, search]);
  const familyMembers = reactExports.useMemo(() => {
    if (!(student == null ? void 0 : student.fatherMobile)) return [];
    return allStudents.filter(
      (s) => s.id !== student.id && s.fatherMobile === student.fatherMobile && (s.sessionId === currentSession || !s.sessionId)
    );
  }, [allStudents, student, currentSession]);
  const paidKeys = reactExports.useMemo(() => {
    const keys = /* @__PURE__ */ new Set();
    for (const p of (feeData == null ? void 0 : feeData.payments) ?? []) {
      for (const it of (p == null ? void 0 : p.items) ?? []) {
        if ((it == null ? void 0 : it.feeHeadingId) && (it == null ? void 0 : it.month)) {
          keys.add(`${it.feeHeadingId}::${it.month}`);
        }
      }
    }
    return keys;
  }, [feeData == null ? void 0 : feeData.payments]);
  const transportPaidMonths = reactExports.useMemo(() => {
    const months = /* @__PURE__ */ new Set();
    for (const p of (feeData == null ? void 0 : feeData.payments) ?? []) {
      for (const it of (p == null ? void 0 : p.items) ?? []) {
        if ((it == null ? void 0 : it.feeHeadingId) === "transport" && (it == null ? void 0 : it.month)) {
          months.add(it.month);
        }
      }
    }
    return months;
  }, [feeData == null ? void 0 : feeData.payments]);
  const planAmounts = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    if (!student) return map;
    for (const p of feePlans) {
      if ((p == null ? void 0 : p.classLevel) === student.classLevel && (p.sessionId === currentSession || !p.sessionId)) {
        if (p.feeHeadingId && p.monthlyAmount > 0) {
          map.set(p.feeHeadingId, p.monthlyAmount);
        }
      }
    }
    return map;
  }, [feePlans, student, currentSession]);
  reactExports.useEffect(() => {
    if (!student || loadingFeeData) {
      setRows([]);
      return;
    }
    const autoMonths = getAutoSelectedMonths();
    const discounts = (feeData == null ? void 0 : feeData.discounts) ?? [];
    const activeHeadings = feeHeadings.filter((h) => h == null ? void 0 : h.isActive);
    const newRows = [];
    for (const heading of activeHeadings) {
      if (!(heading == null ? void 0 : heading.id)) continue;
      const months = heading.applicableMonths && heading.applicableMonths.length > 0 ? heading.applicableMonths : MONTHS;
      for (const month of months) {
        const key = `${heading.id}::${month}`;
        const isPaid = paidKeys.has(key);
        const disc = discounts.find((d) => (d == null ? void 0 : d.feeHeadingId) === heading.id);
        const discAmt = safeNum((disc == null ? void 0 : disc.monthlyDiscountAmount) ?? 0);
        const baseAmt = planAmounts.get(heading.id) ?? 0;
        const netAmt = Math.max(0, baseAmt - discAmt);
        const autoCheck = !isPaid && netAmt > 0 && autoMonths.has(month);
        newRows.push({
          headingId: heading.id,
          headingName: heading.name ?? "",
          month,
          amount: baseAmt,
          discount: discAmt,
          net: netAmt,
          paid: isPaid,
          checked: autoCheck,
          isTransport: false
        });
      }
    }
    const transportFare = (feeData == null ? void 0 : feeData.transportMonthlyFare) ?? 0;
    if (student.transportRouteId && (student.pickupPointId || transportFare > 0) && transportFare > 0) {
      const pickupName = (feeData == null ? void 0 : feeData.transportPickupPointName) ?? "";
      for (const month of TRANSPORT_MONTHS) {
        const isPaid = transportPaidMonths.has(month);
        const autoCheck = !isPaid && autoMonths.has(month);
        newRows.push({
          headingId: "transport",
          headingName: pickupName ? `Transport Fee (Pickup: ${pickupName})` : "Transport Fee",
          month,
          amount: transportFare,
          discount: 0,
          net: transportFare,
          paid: isPaid,
          checked: autoCheck,
          isTransport: true
        });
      }
    }
    setRows(newRows);
  }, [
    student,
    loadingFeeData,
    feeData,
    feeHeadings,
    paidKeys,
    transportPaidMonths,
    planAmounts
  ]);
  const selectStudent = reactExports.useCallback((s) => {
    setSelectedStudentId(s.id);
    setSearch(s.fullName ?? "");
    setShowDropdown(false);
    setReceiptAmt("");
    setRemarks("");
    setDiscountOverride("");
    setLateFees("");
    setOldBalOverride("");
    setIncludePrevBalance(false);
    setIncludePrevSessionDue(false);
  }, []);
  const clearStudent = reactExports.useCallback(() => {
    setSelectedStudentId("");
    setSearch("");
    setRows([]);
    setShowDropdown(false);
    setReceiptAmt("");
    setIncludePrevBalance(false);
  }, []);
  function toggleRow(headingId, month) {
    setRows(
      (prev) => prev.map(
        (r) => r.headingId === headingId && r.month === month && !r.paid ? { ...r, checked: !r.checked } : r
      )
    );
  }
  function toggleHeading(headingId, checked) {
    setRows(
      (prev) => prev.map(
        (r) => r.headingId === headingId && !r.paid ? { ...r, checked } : r
      )
    );
  }
  function toggleMonthColumn(month) {
    const hasUnpaid = rows.some(
      (r) => r.month === month && !r.paid && r.net > 0
    );
    if (!hasUnpaid) return;
    const allChecked = rows.filter((r) => r.month === month && !r.paid && r.net > 0).every((r) => r.checked);
    setRows(
      (prev) => prev.map(
        (r) => r.month === month && !r.paid && r.net > 0 ? { ...r, checked: !allChecked } : r
      )
    );
  }
  function selectAllUnpaid() {
    setRows(
      (prev) => prev.map((r) => !r.paid && r.net > 0 ? { ...r, checked: true } : r)
    );
  }
  const checkedRows = reactExports.useMemo(
    () => rows.filter((r) => r.checked && !r.paid && r.net > 0),
    [rows]
  );
  const subtotal = reactExports.useMemo(
    () => checkedRows.reduce((s, r) => s + r.net, 0),
    [checkedRows]
  );
  const prevYearBalance = reactExports.useMemo(
    () => safeNum((feeData == null ? void 0 : feeData.oldBalanceAmount) ?? 0),
    [feeData == null ? void 0 : feeData.oldBalanceAmount]
  );
  const oldBalAmt = reactExports.useMemo(() => {
    if (oldBalOverride !== "") return safeNum(oldBalOverride);
    const currentSessionBal = includePrevBalance ? prevYearBalance : 0;
    const prevSessBal = includePrevSessionDue ? prevSessionDueAmount : 0;
    return currentSessionBal + prevSessBal;
  }, [
    oldBalOverride,
    includePrevBalance,
    prevYearBalance,
    includePrevSessionDue,
    prevSessionDueAmount
  ]);
  const discountAmt = reactExports.useMemo(() => {
    if (discountOverride !== "") return safeNum(discountOverride);
    const headingIds = new Set(checkedRows.map((r) => r.headingId));
    return ((feeData == null ? void 0 : feeData.discounts) ?? []).filter((d) => headingIds.has(d.feeHeadingId)).reduce((s, d) => s + safeNum(d.monthlyDiscountAmount), 0);
  }, [feeData == null ? void 0 : feeData.discounts, checkedRows, discountOverride]);
  const lateFeesAmt = lateFees === "" ? 0 : safeNum(lateFees);
  const computedTotal = Math.max(
    0,
    subtotal + oldBalAmt + lateFeesAmt - discountAmt
  );
  const receiptAmtNum = receiptAmt === "" ? computedTotal : safeNum(receiptAmt);
  const balanceAmt = computedTotal - receiptAmtNum;
  const activeHeadingIds = reactExports.useMemo(
    () => [...new Set(rows.map((r) => r.headingId))],
    [rows]
  );
  const visibleMonths = reactExports.useMemo(() => {
    const ms = /* @__PURE__ */ new Set();
    for (const r of rows) ms.add(r.month);
    return MONTHS.filter((m) => ms.has(m));
  }, [rows]);
  async function handleCollect() {
    if (!student) return;
    if (checkedRows.length === 0) {
      ue.error("Select fee items to collect");
      return;
    }
    if (receiptAmtNum <= 0) {
      ue.error("Enter amount to collect");
      return;
    }
    const headingNameById = /* @__PURE__ */ new Map();
    for (const h of feeHeadings) {
      if ((h == null ? void 0 : h.id) && (h == null ? void 0 : h.name)) headingNameById.set(h.id, h.name);
    }
    const items = checkedRows.map((r) => ({
      headingId: r.headingId,
      month: r.month,
      amount: BigInt(Math.round(r.net))
    }));
    try {
      const result = await recordPaymentMutation.mutateAsync({
        studentId: student.id,
        sessionId: currentSession,
        paymentDate,
        items,
        otherFee: null,
        totalAmount: BigInt(Math.round(receiptAmtNum)),
        totalDue: BigInt(Math.round(computedTotal)),
        paymentMode: payMode,
        upiRef: null,
        remarks: remarks || null,
        createdBy: collectedBy
      });
      ue.success("Payment recorded!");
      setReceiptAmt("");
      setRemarks("");
      setDiscountOverride("");
      setLateFees("");
      setOldBalOverride("");
      setIncludePrevBalance(false);
      refetchFeeData();
      const enrichedResult = {
        ...result,
        items: result.items.map((it) => {
          var _a2;
          return {
            ...it,
            feeHeadingName: headingNameById.get(it.feeHeadingId) ?? ((_a2 = checkedRows.find(
              (r) => r.headingId === it.feeHeadingId && r.month === it.month
            )) == null ? void 0 : _a2.headingName) ?? it.feeHeadingName
          };
        })
      };
      setReceiptPayment(enrichedResult);
      setShowReceipt(true);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to record payment"
      );
    }
  }
  if (loadingStudents || loadingHeadings || loadingPlans) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", "data-ocid": "fees.collect.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-28 rounded-full bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-32 rounded bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-8 min-w-[220px] rounded bg-muted animate-pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading fee data..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", "data-ocid": "fees.collect.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "border-primary/40 text-primary font-bold px-3 py-1 text-sm",
          "data-ocid": "fees.collect.session.badge",
          children: [
            "Session: ",
            currentSession
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Date:" }),
        isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: paymentDate,
            onChange: (e) => setPaymentDate(e.target.value),
            className: "h-8 w-40 text-xs",
            "data-ocid": "fees.collect.date.input"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-medium text-foreground bg-muted/40 px-2 py-1 rounded border border-border select-none",
            "data-ocid": "fees.collect.date.readonly",
            children: paymentDate.split("-").reverse().join("/")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: searchRef, className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: search,
              onChange: (e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              },
              onFocus: () => search.length >= 2 && setShowDropdown(true),
              placeholder: "Search student by name or admission no...",
              className: "pl-8 pr-8 h-8 text-sm",
              "data-ocid": "fees.collect.search_input"
            }
          ),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearStudent,
              className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              "aria-label": "Clear",
              "data-ocid": "fees.collect.clear_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
            }
          )
        ] }),
        showDropdown && filteredStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-full mt-1 left-0 right-0 z-[9999] bg-popover border border-border rounded-lg shadow-xl overflow-hidden",
            "data-ocid": "fees.collect.search.popover",
            children: filteredStudents.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => selectStudent(s),
                className: "w-full text-left px-4 py-2.5 hover:bg-muted/50 border-b border-border last:border-0 transition-colors",
                "data-ocid": `fees.collect.search.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground text-sm", children: s.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    s.admNo,
                    " ·",
                    " ",
                    CLASS_LABELS[s.classLevel] ?? s.classLevel,
                    " ",
                    "· ",
                    s.fatherMobile
                  ] })
                ]
              },
              s.id
            ))
          }
        ),
        showDropdown && search.length >= 2 && filteredStudents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full mt-1 left-0 right-0 z-[9999] bg-popover border border-border rounded-lg shadow-xl px-4 py-3 text-sm text-muted-foreground", children: "No students found" })
      ] })
    ] }),
    !student ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-dashed border-border rounded-xl py-20 text-center",
        "data-ocid": "fees.collect.no_student.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-12 mx-auto text-muted-foreground/30 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Search for a Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Enter name or admission number above to begin fee collection" })
        ]
      }
    ) : loadingFeeData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3",
        "data-ocid": "fees.collect.student_loading.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Loading fee data for ",
            student.fullName,
            "..."
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg px-4 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: student.fullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Adm No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: student.admNo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: CLASS_LABELS[student.classLevel] ?? student.classLevel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Father" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: student.fatherName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: student.fatherMobile })
        ] }),
        ((feeData == null ? void 0 : feeData.oldBalanceAmount) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50 rounded px-2 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Old Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-orange-700", children: formatCurrency((feeData == null ? void 0 : feeData.oldBalanceAmount) ?? 0) })
        ] }),
        (feeData == null ? void 0 : feeData.transportMonthlyFare) && feeData.transportMonthlyFare > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-blue-50 rounded px-2 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12, className: "text-blue-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Transport" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-blue-700", children: [
              formatCurrency(feeData.transportMonthlyFare),
              "/mo"
            ] }),
            feeData.transportPickupPointName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-blue-500", children: feeData.transportPickupPointName })
          ] })
        ] }) : null
      ] }),
      prevYearBalance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-2 border-orange-400 bg-orange-50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4",
          "data-ocid": "fees.collect.prev_balance.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "⚠️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-orange-800 text-sm", children: "Old Balance (Current Session)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-red-600", children: formatCurrency(prevYearBalance) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-600 mt-0.5", children: "Unpaid balance from earlier in this session" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-3 cursor-pointer select-none shrink-0 bg-white border border-orange-300 rounded-lg px-4 py-3 hover:bg-orange-50 transition-colors",
                "data-ocid": "fees.collect.prev_balance.include_checkbox",
                htmlFor: "include-prev-balance",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: includePrevBalance,
                      onCheckedChange: (c) => setIncludePrevBalance(!!c),
                      id: "include-prev-balance",
                      className: "size-5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Include in this payment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Adds ",
                      formatCurrency(prevYearBalance),
                      " to total"
                    ] })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      prevSessionDueAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-2 border-red-400 bg-red-50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4",
          "data-ocid": "fees.collect.prev_session_due.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💸" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-red-800 text-sm", children: [
                  "Previous Session Due",
                  (prevSessionData == null ? void 0 : prevSessionData.sessionId) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs font-normal", children: [
                    "(",
                    prevSessionData.sessionId,
                    ")"
                  ] }) : null
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-red-600", children: formatCurrency(prevSessionDueAmount) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-600 mt-0.5", children: "Outstanding from previous academic year" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-3 cursor-pointer select-none shrink-0 bg-white border border-red-300 rounded-lg px-4 py-3 hover:bg-red-50 transition-colors",
                "data-ocid": "fees.collect.prev_session_due.include_checkbox",
                htmlFor: "include-prev-session-due",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: includePrevSessionDue,
                      onCheckedChange: (c) => setIncludePrevSessionDue(!!c),
                      id: "include-prev-session-due",
                      className: "size-5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Include in this payment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Adds ",
                      formatCurrency(prevSessionDueAmount),
                      " to total"
                    ] })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      ((feeData == null ? void 0 : feeData.inventoryDue) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "📦" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-amber-800", children: [
            "Inventory Due: ",
            formatCurrency((feeData == null ? void 0 : feeData.inventoryDue) ?? 0)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-amber-600", children: "(Collect separately from Inventory module)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 bg-muted/30 border-b border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Fee Grid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-primary underline hover:no-underline",
              onClick: selectAllUnpaid,
              "data-ocid": "fees.collect.select_all_button",
              children: "√ Select All Unpaid"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            className: "w-full text-xs",
            "data-ocid": "fees.collect.fee_table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/20 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 w-8", children: "✓" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-foreground min-w-[140px]", children: "Fee Head" }),
                visibleMonths.map((m) => {
                  const colRows = rows.filter((r) => r.month === m);
                  const colFullyPaid = colRows.length > 0 && colRows.every((r) => r.paid || r.net === 0);
                  const colAllChecked = !colFullyPaid && colRows.filter((r) => !r.paid && r.net > 0).every((r) => r.checked);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: `text-right px-2 py-2 font-semibold min-w-[72px] transition-colors select-none ${colFullyPaid ? "text-muted-foreground/40 cursor-default" : "text-foreground cursor-pointer hover:bg-primary/10"} ${colAllChecked && !colFullyPaid ? "bg-primary/10 text-primary" : ""}`,
                      "data-ocid": `fees.collect.month_header.${m.toLowerCase()}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => toggleMonthColumn(m),
                          className: "w-full h-full text-inherit font-inherit text-right",
                          tabIndex: 0,
                          "aria-label": `Toggle ${m} column`,
                          children: m.slice(0, 3)
                        }
                      )
                    },
                    m
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-semibold text-foreground w-20", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                activeHeadingIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: visibleMonths.length + 3,
                    className: "px-3 py-8 text-center text-muted-foreground",
                    "data-ocid": "fees.collect.grid.empty_state",
                    children: "No fee plan configured for this class. Please set up fee headings and fee plan first."
                  }
                ) }) : activeHeadingIds.map((hid, hi) => {
                  var _a2, _b2;
                  const hRows = rows.filter((r) => r.headingId === hid);
                  const hName = ((_a2 = hRows[0]) == null ? void 0 : _a2.headingName) ?? hid;
                  const isTransportRow = ((_b2 = hRows[0]) == null ? void 0 : _b2.isTransport) ?? false;
                  const allChecked = hRows.filter((r) => !r.paid).length > 0 && hRows.filter((r) => !r.paid).every((r) => r.checked);
                  const rowTotal = hRows.filter((r) => r.checked && !r.paid).reduce((s, r) => s + r.net, 0);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: `border-b border-border hover:bg-muted/10 transition-colors ${isTransportRow ? "bg-blue-50/30" : ""}`,
                      "data-ocid": `fees.collect.row.${hi + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox,
                          {
                            checked: allChecked,
                            onCheckedChange: (c) => toggleHeading(hid, !!c),
                            "data-ocid": `fees.collect.heading_checkbox.${hi + 1}`
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                          isTransportRow && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Truck,
                            {
                              size: 11,
                              className: "text-blue-500 shrink-0"
                            }
                          ),
                          hName
                        ] }) }),
                        visibleMonths.map((m) => {
                          const row = hRows.find((r) => r.month === m);
                          if (!row) {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "td",
                              {
                                className: "px-2 py-2 text-right text-muted-foreground/30",
                                children: "—"
                              },
                              m
                            );
                          }
                          if (row.paid) {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 rounded px-1.5 py-0.5", children: "Paid" }) }, m);
                          }
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: `px-2 py-2 text-right transition-colors ${row.checked ? "bg-primary/5" : ""}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => toggleRow(hid, m),
                                  className: `text-xs px-1.5 py-0.5 rounded border transition-colors ${row.checked ? "bg-primary/10 border-primary/40 text-primary font-semibold" : "bg-muted/20 border-border text-muted-foreground"}`,
                                  "data-ocid": `fees.collect.cell.${hi + 1}.${m.toLowerCase()}`,
                                  children: [
                                    "₹",
                                    row.net.toLocaleString("en-IN")
                                  ]
                                }
                              )
                            },
                            m
                          );
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold text-foreground", children: rowTotal > 0 ? `₹${rowTotal.toLocaleString("en-IN")}` : "—" })
                      ]
                    },
                    hid
                  );
                }),
                activeHeadingIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-primary/5 font-bold border-t-2 border-primary/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      colSpan: 2,
                      className: "px-3 py-3 text-left text-foreground text-sm",
                      children: "TOTAL"
                    }
                  ),
                  visibleMonths.map((m) => {
                    const colTotal = rows.filter((r) => r.month === m && r.checked && !r.paid).reduce((s, r) => s + r.net, 0);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-2 py-3 text-right text-foreground",
                        children: colTotal > 0 ? `₹${colTotal.toLocaleString("en-IN")}` : "—"
                      },
                      m
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-primary text-sm", children: formatCurrency(subtotal) })
                ] })
              ] })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Payment Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Payment Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: payMode, onValueChange: setPayMode, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs",
                  "data-ocid": "fees.collect.payment_mode.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cash", children: "Cash" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cheque", children: "Cheque" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "NEFT", children: "NEFT / RTGS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "UPI", children: "UPI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Online", children: "Online" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Remarks (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: remarks,
                onChange: (e) => setRemarks(e.target.value),
                placeholder: "Optional remarks...",
                rows: 2,
                className: "text-xs",
                "data-ocid": "fees.collect.remarks.textarea"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Fee Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatCurrency(subtotal) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Additional Old Balance (₹)" }),
                includePrevBalance && prevYearBalance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-orange-600 font-medium", children: [
                  "+ Prev Bal: ",
                  formatCurrency(prevYearBalance)
                ] }),
                includePrevSessionDue && prevSessionDueAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-red-600 font-medium", children: [
                  "+ Prev Sess: ",
                  formatCurrency(prevSessionDueAmount)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: oldBalOverride,
                  onChange: (e) => {
                    if (/^\d*$/.test(e.target.value))
                      setOldBalOverride(e.target.value);
                  },
                  onBlur: (e) => {
                    if (e.target.value === "") setOldBalOverride("");
                  },
                  placeholder: "",
                  className: "h-8 text-xs",
                  "data-ocid": "fees.collect.old_balance.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Discount Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: numDisplay(discountOverride, discountAmt),
                  onChange: (e) => {
                    if (/^\d*$/.test(e.target.value))
                      setDiscountOverride(e.target.value);
                  },
                  onBlur: (e) => {
                    if (e.target.value === "") setDiscountOverride("");
                  },
                  placeholder: "",
                  className: "h-8 text-xs text-green-700",
                  "data-ocid": "fees.collect.discount.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Late Fees (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: lateFees,
                  onChange: (e) => {
                    if (/^\d*$/.test(e.target.value))
                      setLateFees(e.target.value);
                  },
                  onBlur: (e) => {
                    if (e.target.value === "") setLateFees("");
                  },
                  placeholder: "",
                  className: "h-8 text-xs",
                  "data-ocid": "fees.collect.late_fees.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Receipt Amount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: receiptAmt === "" ? computedTotal > 0 ? String(computedTotal) : "" : receiptAmt,
                onChange: (e) => {
                  if (/^\d*$/.test(e.target.value))
                    setReceiptAmt(e.target.value);
                },
                className: "h-9 text-base font-bold",
                placeholder: "Amount to collect",
                "data-ocid": "fees.collect.receipt_amt.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex justify-between text-sm font-semibold pt-1 ${balanceAmt > 0 ? "text-destructive" : balanceAmt < 0 ? "text-orange-600" : "text-green-600"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: balanceAmt === 0 ? "✓ Paid in Full" : balanceAmt < 0 ? `Overpaid: ${formatCurrency(Math.abs(balanceAmt))}` : formatCurrency(balanceAmt) })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3",
          "data-ocid": "fees.collect.bottom_bar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: checkedRows.length }),
              " ",
              "item",
              checkedRows.length !== 1 ? "s" : "",
              " ·",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: formatCurrency(subtotal) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: clearStudent,
                "data-ocid": "fees.collect.new_button",
                children: "New Student"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-2 font-semibold min-w-[140px]",
                onClick: handleCollect,
                disabled: checkedRows.length === 0 || receiptAmtNum <= 0 || recordPaymentMutation.isPending,
                "data-ocid": "fees.collect.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 14 }),
                  recordPaymentMutation.isPending ? "Saving..." : `Collect ${receiptAmtNum > 0 ? formatCurrency(receiptAmtNum) : ""}`
                ]
              }
            )
          ]
        }
      ),
      familyMembers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-lg overflow-hidden",
          "data-ocid": "fees.collect.family.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 bg-muted/30 border-b border-border flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground text-sm", children: [
                "Family Members (Same Mobile: ",
                student.fatherMobile,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: familyMembers.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: familyMembers.map((sib, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between py-2 border-b border-border last:border-0",
                "data-ocid": `fees.collect.family.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: sib.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-muted-foreground text-xs", children: [
                      CLASS_LABELS[sib.classLevel] ?? sib.classLevel,
                      " ",
                      "· ",
                      sib.admNo
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: () => selectStudent(sib),
                      "data-ocid": `fees.collect.family.select_button.${idx + 1}`,
                      children: "Collect Fees"
                    }
                  )
                ]
              },
              sib.id
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-lg overflow-hidden",
          "data-ocid": "fees.collect.history.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14, className: "text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground text-sm", children: [
                  "Payment History — ",
                  currentSession
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
                ((feeData == null ? void 0 : feeData.payments) ?? []).length,
                " receipt",
                ((feeData == null ? void 0 : feeData.payments) ?? []).length !== 1 ? "s" : ""
              ] })
            ] }),
            ((feeData == null ? void 0 : feeData.payments) ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "py-8 text-center text-muted-foreground text-sm",
                "data-ocid": "fees.collect.history.empty_state",
                children: "No payments recorded yet for this session"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/20 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-semibold text-foreground", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-semibold text-foreground", children: "Receipt No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-semibold text-foreground", children: "Months" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 font-semibold text-foreground", children: "Amount (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 font-semibold text-destructive", children: "Balance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-semibold text-foreground", children: "Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-semibold text-foreground", children: "By" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-2.5 font-semibold text-foreground", children: "Print" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ((feeData == null ? void 0 : feeData.payments) ?? []).map((p, pi) => {
                const totalAmt = safeNum((p == null ? void 0 : p.totalAmount) ?? 0);
                const items = Array.isArray(p == null ? void 0 : p.items) ? p.items : [];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border last:border-0 hover:bg-muted/10",
                    "data-ocid": `fees.collect.history.item.${pi + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: formatDate((p == null ? void 0 : p.paymentDate) ?? "") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-primary font-medium", children: (p == null ? void 0 : p.receiptNo) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                        items.slice(0, 3).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-xs",
                            children: (it == null ? void 0 : it.month) || (it == null ? void 0 : it.feeHeadingName) || "—"
                          },
                          `${(it == null ? void 0 : it.feeHeadingId) ?? ""}-${(it == null ? void 0 : it.month) ?? ""}`
                        )),
                        items.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                          "+",
                          items.length - 3
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-foreground", children: formatCurrency(totalAmt) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold", children: (p == null ? void 0 : p.balance) != null && p.balance > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: formatCurrency(p.balance) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 text-xs", children: "Paid" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: (p == null ? void 0 : p.paymentMethod) ?? "Cash" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: (p == null ? void 0 : p.collectedBy) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "size-7",
                          title: "Print Receipt",
                          onClick: () => {
                            const headingNameById = /* @__PURE__ */ new Map();
                            for (const h of feeHeadings) {
                              if ((h == null ? void 0 : h.id) && (h == null ? void 0 : h.name))
                                headingNameById.set(h.id, h.name);
                            }
                            const enriched = {
                              ...p,
                              items: (Array.isArray(p == null ? void 0 : p.items) ? p.items : []).map((it) => ({
                                ...it,
                                feeHeadingName: headingNameById.get(
                                  (it == null ? void 0 : it.feeHeadingId) ?? ""
                                ) ?? (it == null ? void 0 : it.feeHeadingName) ?? (it == null ? void 0 : it.feeHeadingId) ?? ""
                              }))
                            };
                            setReceiptPayment(enriched);
                            setShowReceipt(true);
                          },
                          "data-ocid": `fees.collect.reprint_button.${pi + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 12 })
                        }
                      ) })
                    ]
                  },
                  (p == null ? void 0 : p.id) ?? pi
                );
              }) })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceiptModal,
      {
        open: showReceipt,
        onClose: () => {
          setShowReceipt(false);
          setReceiptPayment(null);
        },
        payment: receiptPayment,
        student,
        schoolInfo,
        feeHeadings
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "sm:max-w-sm z-[60]",
        "data-ocid": "fees.collect.delete.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Payment?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete this payment record." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteId(null),
                "data-ocid": "fees.collect.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                disabled: isDeletingPayment,
                onClick: () => {
                  setIsDeletingPayment(false);
                  setDeleteId(null);
                },
                "data-ocid": "fees.collect.delete.confirm_button",
                children: "Delete"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  CollectFeesTab as default
};
