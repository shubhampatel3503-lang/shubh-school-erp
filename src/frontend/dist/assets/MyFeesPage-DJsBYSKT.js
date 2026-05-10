import { d as useAppStore, bp as useSchoolInfo, aB as useSettings, a5 as useStudents, r as reactExports, j as jsxRuntimeExports, aR as IndianRupee, t as Badge, S as Skeleton, $ as Phone, cx as usePaymentsByStudentAndSession, cy as useTotalDueByStudentAndSession, i as CLASS_LABELS, bk as formatCurrency, bl as SCHOOL_MONTHS, a4 as CreditCard, cz as useSubmitUpiPayment, L as Label, I as Input, e as Button, F as ue } from "./index-pMBTUEbj.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-r-j30wiQ.js";
import { U as User } from "./user-C6bo2V5_.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { S as Smartphone } from "./smartphone-DHS3LfhR.js";
function buildUpiString(upiId, schoolName, amount, ref) {
  const am = Math.round(amount).toString();
  const tn = encodeURIComponent(`Fees ${ref}`);
  const pn = encodeURIComponent(schoolName);
  return `upi://pay?pa=${upiId}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}
function buildQrImageUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&color=1a237e&bgcolor=ffffff&qzone=1&format=png`;
}
const SCHOOL_MONTHS_SHORT = {
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
function UpiPaymentSection({
  student,
  balanceDue,
  upiId,
  schoolName,
  schoolPhone,
  session
}) {
  const [utrNumber, setUtrNumber] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const submitUpiPayment = useSubmitUpiPayment();
  const ref = `${student.admNo}-${session}`;
  const hasUpi = upiId && upiId !== "school@upi" && upiId !== "";
  const upiString = hasUpi ? buildUpiString(upiId, schoolName, balanceDue, ref) : "";
  const qrUrl = upiString ? buildQrImageUrl(upiString) : "";
  async function handleSubmitUtr() {
    if (utrNumber.trim().length < 6) {
      ue.error("Please enter a valid UTR number (at least 6 digits)");
      return;
    }
    try {
      await submitUpiPayment.mutateAsync({
        studentId: student.id,
        admNo: student.admNo,
        sessionId: session,
        utrNumber: utrNumber.trim(),
        amount: balanceDue
      });
      setSubmitted(true);
      ue.success("Payment submitted for verification!");
    } catch {
      ue.error("Failed to submit. Please try again.");
    }
  }
  if (!hasUpi) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4",
        "data-ocid": "my-fees.upi.not_configured",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "text-amber-600 mt-0.5 shrink-0", size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-amber-900 text-sm", children: "UPI Payment Not Configured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-700 mt-1", children: "Please contact school to pay online. UPI/QR payment will be available once the school configures their UPI ID." }),
            schoolPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `tel:${schoolPhone}`,
                className: "inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-800 underline",
                "data-ocid": "my-fees.school_phone.link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
                  " Call School: ",
                  schoolPhone
                ]
              }
            )
          ] })
        ]
      }
    );
  }
  if (balanceDue <= 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4",
        "data-ocid": "my-fees.upi.all_paid",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "text-emerald-600 shrink-0", size: 28 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-emerald-800", children: "All fees paid!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-emerald-700", children: "No outstanding balance for this session." })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-5 space-y-5",
      "data-ocid": "my-fees.upi.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "text-primary", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground text-base", children: "Pay Fees Online" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Scan with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "GPay, PhonePe, Paytm, or any UPI app" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col items-center gap-2", children: [
            qrUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: qrUrl,
                alt: "UPI QR Code",
                className: "w-48 h-48 rounded-xl border-2 border-primary/20 shadow-sm",
                "data-ocid": "my-fees.upi.qr_code",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 h-48 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center px-3", children: "QR unavailable" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
              "Scan to pay ₹",
              balanceDue.toLocaleString("en-IN")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-3 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "UPI ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground select-all", children: upiId })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Amount Due" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-destructive text-base", children: [
                  "₹",
                  balanceDue.toLocaleString("en-IN")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: ref })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: upiString,
                className: "flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors",
                "data-ocid": "my-fees.upi.pay_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 16 }),
                  "Pay ₹",
                  balanceDue.toLocaleString("en-IN"),
                  " via UPI App"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center", children: "(Opens GPay / PhonePe / Paytm on mobile)" })
          ] })
        ] }),
        !submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-t border-border pt-5 space-y-3",
            "data-ocid": "my-fees.utr.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: "Already paid? Submit transaction reference" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "UTR / Transaction ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: utrNumber,
                    onChange: (e) => setUtrNumber(e.target.value),
                    placeholder: "Enter 12-digit UTR number",
                    maxLength: 24,
                    className: "font-mono",
                    "data-ocid": "my-fees.utr.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleSubmitUtr,
                  disabled: submitUpiPayment.isPending || utrNumber.trim().length < 6,
                  className: "w-full",
                  "data-ocid": "my-fees.utr.submit_button",
                  children: submitUpiPayment.isPending ? "Submitting..." : "Submit Payment for Verification"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Admin will verify within 24 hours after submission." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-t border-border pt-5 flex items-center gap-3 bg-emerald-50 rounded-lg p-4",
            "data-ocid": "my-fees.utr.success_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "text-emerald-600 shrink-0", size: 22 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-emerald-800 text-sm", children: "Payment submitted!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-700", children: "Admin will verify within 24 hours." })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function StudentFeeCard({
  student,
  session,
  upiId,
  schoolName,
  schoolPhone,
  isExpanded,
  onToggle,
  index
}) {
  const { data: payments = [], isLoading: loadingPayments } = usePaymentsByStudentAndSession(student.id, session);
  const { data: totals, isLoading: loadingTotals } = useTotalDueByStudentAndSession(student.id, session);
  const totalFees = (totals == null ? void 0 : totals.totalFees) ?? 0;
  const totalPaid = (totals == null ? void 0 : totals.totalPaid) ?? payments.reduce((s, p) => s + ((p == null ? void 0 : p.totalAmount) ?? 0), 0);
  const balanceDue = Math.max(
    0,
    ((totals == null ? void 0 : totals.totalDue) ?? 0) > 0 ? (totals == null ? void 0 : totals.totalDue) ?? 0 : totalFees - totalPaid
  );
  const paidMonths = /* @__PURE__ */ new Set();
  for (const p of payments) {
    for (const it of (p == null ? void 0 : p.items) ?? []) {
      if (it == null ? void 0 : it.month) paidMonths.add(it.month);
    }
  }
  const classLabel = CLASS_LABELS[student.classLevel] ?? student.classLevel;
  const isLoading = loadingPayments || loadingTotals;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "overflow-hidden border-border",
      "data-ocid": `my-fees.student.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onToggle,
            className: "w-full text-left",
            "data-ocid": `my-fees.student.toggle.${index}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-card py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: student.photoUrl,
                  alt: student.fullName,
                  className: "w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 22, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold truncate", children: student.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  classLabel,
                  " · Adm: ",
                  student.admNo,
                  " · ",
                  student.fatherName
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right shrink-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `text-lg font-extrabold ${balanceDue > 0 ? "text-destructive" : "text-emerald-600"}`,
                    children: [
                      "₹",
                      balanceDue.toLocaleString("en-IN")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: balanceDue > 0 ? "Balance Due" : "Paid ✓" })
              ] }) })
            ] }) })
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5 space-y-5 bg-background", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Total Fees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm", children: formatCurrency(totalFees) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 rounded-lg p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-emerald-700 text-sm", children: formatCurrency(totalPaid) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-lg p-3 text-center ${balanceDue > 0 ? "bg-red-50" : "bg-emerald-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Balance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-bold text-sm ${balanceDue > 0 ? "text-destructive" : "text-emerald-700"}`,
                      children: balanceDue > 0 ? formatCurrency(balanceDue) : "Nil ✓"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: [
              "Month-wise Fee Status (",
              session,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SCHOOL_MONTHS.map((m) => {
              const isPaid = paidMonths.has(m);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isPaid ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-muted/50 text-muted-foreground border border-border"}`,
                  "data-ocid": `my-fees.month.${m.toLowerCase()}.${index}`,
                  children: [
                    isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                    SCHOOL_MONTHS_SHORT[m] ?? m
                  ]
                },
                m
              );
            }) })
          ] }),
          payments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `my-fees.history.section.${index}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Payment History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: payments.map((p, pi) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5 text-sm",
                  "data-ocid": `my-fees.history.item.${index}.${pi + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CreditCard,
                        {
                          size: 14,
                          className: "text-muted-foreground shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: p.receiptNo || `Receipt ${pi + 1}` }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          (_a = p.paymentDate) == null ? void 0 : _a.split("-").reverse().join("/"),
                          " ·",
                          " ",
                          p.paymentMethod ?? "Cash"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground", children: [
                        "₹",
                        (p.totalAmount ?? 0).toLocaleString("en-IN")
                      ] }),
                      (p.balance ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "destructive",
                          className: "text-[10px]",
                          children: [
                            "Bal: ₹",
                            (p.balance ?? 0).toLocaleString("en-IN")
                          ]
                        }
                      )
                    ] })
                  ]
                },
                p.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UpiPaymentSection,
            {
              student,
              balanceDue,
              upiId,
              schoolName,
              schoolPhone,
              session
            }
          )
        ] }) })
      ]
    }
  );
}
function MyFeesPage() {
  const { currentUser, currentSession } = useAppStore();
  const { data: schoolInfo } = useSchoolInfo();
  const { data: settings } = useSettings();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const upiId = (settings == null ? void 0 : settings.gpayUpiId) ?? "";
  const schoolName = (schoolInfo == null ? void 0 : schoolInfo.name) ?? "SHUBH SCHOOL ERP";
  const schoolPhone = (schoolInfo == null ? void 0 : schoolInfo.phone) ?? "";
  const role = ((currentUser == null ? void 0 : currentUser.role) ?? "").toLowerCase();
  const isStudentOrParent = role === "student" || role === "parent";
  const myStudents = (() => {
    if (!currentUser || !allStudents.length) return [];
    const username = (currentUser.fullName ?? "").toLowerCase().trim();
    if (role === "student") {
      const found = allStudents.filter(
        (s) => s.admNo.toLowerCase() === username || s.fullName.toLowerCase().replace(/\s+/g, "") === username
      );
      return found.length > 0 ? found : allStudents.slice(0, 1);
    }
    if (role === "parent") {
      const found = allStudents.filter(
        (s) => s.fatherMobile === username || s.motherMobile === username || s.fatherName.toLowerCase().replace(/\s+/g, "") === username
      );
      return found.length > 0 ? found : [];
    }
    return [];
  })();
  const [expandedIndex, setExpandedIndex] = reactExports.useState(0);
  function toggleCard(i) {
    setExpandedIndex((prev) => prev === i ? -1 : i);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "my-fees.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 18, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground truncate", children: "My Fees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Session: ",
          currentSession,
          " · ",
          schoolName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-semibold shrink-0", children: currentSession })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6 space-y-5", children: [
      loadingStudents ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "my-fees.loading_state", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20" })
      ] }) }) }, i)) }) : myStudents.length === 0 ? (
        /* Empty state */
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-dashed border-border rounded-xl py-20 text-center",
            "data-ocid": "my-fees.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28, className: "text-muted-foreground/50" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-2", children: "No student record found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm mx-auto", children: "Your student record could not be found in the system. Please contact the school office." }),
              schoolPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `tel:${schoolPhone}`,
                  className: "inline-flex items-center gap-2 text-sm font-medium text-primary",
                  "data-ocid": "my-fees.contact.link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 15 }),
                    " ",
                    schoolPhone
                  ]
                }
              )
            ]
          }
        )
      ) : (
        /* Student cards */
        myStudents.map((student, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          StudentFeeCard,
          {
            student,
            session: currentSession,
            upiId,
            schoolName,
            schoolPhone,
            isExpanded: expandedIndex === i,
            onToggle: () => toggleCard(i),
            index: i + 1
          },
          student.id
        ))
      ),
      !isStudentOrParent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-border rounded-xl p-5 text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This page is designed for student/parent logins. As an admin you are viewing a preview." }),
        allStudents.length > 0 && myStudents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          StudentFeeCard,
          {
            student: allStudents[0],
            session: currentSession,
            upiId,
            schoolName,
            schoolPhone,
            isExpanded: expandedIndex === 0,
            onToggle: () => toggleCard(0),
            index: 1
          }
        )
      ] })
    ] })
  ] });
}
export {
  MyFeesPage as default
};
