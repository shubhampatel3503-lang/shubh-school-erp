import { j as jsxRuntimeExports, i as CLASS_LABELS, a0 as formatDate } from "./index-pMBTUEbj.js";
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen"
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety"
];
function numToWords(n) {
  if (n === 0) return "Zero";
  if (n < 0) return `Minus ${numToWords(-n)}`;
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? ` ${ones[n % 10]}` : "");
  if (n < 1e3)
    return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${numToWords(n % 100)}` : ""}`;
  if (n < 1e5)
    return `${numToWords(Math.floor(n / 1e3))} Thousand${n % 1e3 ? ` ${numToWords(n % 1e3)}` : ""}`;
  if (n < 1e7)
    return `${numToWords(Math.floor(n / 1e5))} Lakh${n % 1e5 ? ` ${numToWords(n % 1e5)}` : ""}`;
  return `${numToWords(Math.floor(n / 1e7))} Crore${n % 1e7 ? ` ${numToWords(n % 1e7)}` : ""}`;
}
function amountInWords(amount) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = `Rupees ${numToWords(rupees)}`;
  if (paise > 0) result += ` and ${numToWords(paise)} Paise`;
  result += " Only";
  return result;
}
function inr(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
function getCoveredMonths(items) {
  if (!items || !Array.isArray(items)) return "—";
  const months = [
    ...new Set(items.map((it) => (it == null ? void 0 : it.month) ?? "").filter(Boolean))
  ];
  if (months.length === 0) return "—";
  if (months.length === 1) return months[0];
  return `${months[0]}–${months[months.length - 1]}`;
}
function groupByHeading(items, feeHeadings) {
  if (!items || !Array.isArray(items)) return [];
  const headingMap = /* @__PURE__ */ new Map();
  if (feeHeadings) {
    for (const h of feeHeadings) {
      if ((h == null ? void 0 : h.id) && (h == null ? void 0 : h.name)) headingMap.set(h.id, h.name);
    }
  }
  const map = /* @__PURE__ */ new Map();
  for (const it of items) {
    if (!it) continue;
    const key = it.feeHeadingId ?? "";
    if (!map.has(key)) {
      const resolvedFromList = headingMap.get(key);
      const storedName = it.feeHeadingName;
      const nameIsId = storedName === key;
      const headingName = resolvedFromList ?? (storedName && !nameIsId ? storedName : null) ?? key;
      if (headingName === key && key !== "transport" && key !== "old-balance") {
        console.warn(
          "[FeeReceipt] Could not resolve heading name for id:",
          key
        );
      }
      map.set(key, {
        headingId: key,
        headingName,
        months: [],
        amount: 0,
        isOld: key === "old-balance",
        isOther: it.isOther,
        otherDescription: it.otherDescription
      });
    }
    const group = map.get(key);
    if (it.month) group.months.push(it.month);
    group.amount += safeNum(it.amount);
  }
  return [...map.values()].filter((g) => g.amount > 0);
}
function safeNum(v) {
  if (v == null) return 0;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}
const BLUE = "#1a3a6b";
const LIGHT_BLUE = "#e8f0fe";
const BORDER = "#c0c8d8";
const HEADER_BG = "#1a3a6b";
const HEADER_TEXT = "#ffffff";
function InfoRow({
  label,
  value,
  labelWidth = 90,
  fontSize = 12
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", marginBottom: 3, fontSize }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          width: labelWidth,
          color: "#555",
          flexShrink: 0,
          fontWeight: 600
        },
        children: [
          label,
          ":"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#222" }, children: value })
  ] });
}
function AmtRow({
  label,
  value,
  bold,
  color,
  negative,
  fontSize = 12
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 3,
        fontSize,
        fontWeight: bold ? 700 : 400,
        color: color ?? "#222"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          negative ? "−" : "",
          `₹${value.toLocaleString("en-IN")}`
        ] })
      ]
    }
  );
}
function thStyle(align, width, fontSize = 12) {
  return {
    padding: "7px 10px",
    textAlign: align,
    borderRight: "1px solid rgba(255,255,255,0.2)",
    fontWeight: 700,
    fontSize,
    ...width ? { width } : {}
  };
}
function tdStyle(align, fontSize = 12) {
  return {
    padding: "5px 10px",
    textAlign: align,
    verticalAlign: "middle",
    minHeight: 24,
    fontSize
  };
}
function QRPatternSVG({ size = 70 }) {
  const dataDots = [
    { x: 30, y: 30 },
    { x: 35, y: 30 },
    { x: 40, y: 30 },
    { x: 30, y: 35 },
    { x: 40, y: 35 },
    { x: 50, y: 30 },
    { x: 55, y: 30 },
    { x: 60, y: 30 },
    { x: 50, y: 35 },
    { x: 60, y: 35 },
    { x: 55, y: 40 },
    { x: 35, y: 40 },
    { x: 40, y: 45 },
    { x: 45, y: 50 },
    { x: 50, y: 50 },
    { x: 55, y: 50 },
    { x: 60, y: 50 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 70 70",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      role: "img",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "QR Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "4",
            y: "4",
            width: "22",
            height: "22",
            fill: "none",
            stroke: "#1a3a6b",
            strokeWidth: "2.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "12", height: "12", fill: "#1a3a6b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "44",
            y: "4",
            width: "22",
            height: "22",
            fill: "none",
            stroke: "#1a3a6b",
            strokeWidth: "2.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "49", y: "9", width: "12", height: "12", fill: "#1a3a6b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "4",
            y: "44",
            width: "22",
            height: "22",
            fill: "none",
            stroke: "#1a3a6b",
            strokeWidth: "2.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "49", width: "12", height: "12", fill: "#1a3a6b" }),
        dataDots.map((dot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: dot.x,
            y: dot.y,
            width: "4",
            height: "4",
            fill: "#1a3a6b"
          },
          `dot-${dot.x}-${dot.y}`
        ))
      ]
    }
  );
}
function A4FullReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  oldBalance,
  feeHeadings
}) {
  const classLabel = CLASS_LABELS[student.classLevel] ?? student.classLevel;
  const safeItems = Array.isArray(payment == null ? void 0 : payment.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => (it == null ? void 0 : it.feeHeadingId) !== "old-balance"
  );
  const oldBalItem = safeItems.find((it) => (it == null ? void 0 : it.feeHeadingId) === "old-balance");
  const headingGroups = groupByHeading(regularItems, feeHeadings);
  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem == null ? void 0 : oldBalItem.amount);
  const concessionAmt = (discount == null ? void 0 : discount.monthlyDiscountAmount) ?? 0;
  const netFee = feeTotal;
  const amountReceived = safeNum(payment == null ? void 0 : payment.totalAmount);
  const coveredMonths = getCoveredMonths(regularItems);
  const fillerCount = Math.max(
    0,
    6 - headingGroups.length - (oldBalItem ? 1 : 0) - (concessionAmt > 0 ? 1 : 0)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "fee-receipt-print",
      style: {
        width: 794,
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box"
      },
      "data-ocid": "fee_receipt.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              borderBottom: `2px solid ${BLUE}`,
              gap: 16,
              background: LIGHT_BLUE
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#fff",
                    border: `2px solid ${BLUE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 10,
                    color: BLUE,
                    fontWeight: 700,
                    textAlign: "center",
                    lineHeight: 1.2,
                    overflow: "hidden"
                  },
                  children: schoolInfo.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: schoolInfo.photoUrl,
                      alt: "logo",
                      style: {
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { padding: 4 }, children: "LOGO" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 20,
                      fontWeight: 700,
                      color: BLUE,
                      letterSpacing: 1
                    },
                    children: schoolInfo.name.toUpperCase()
                  }
                ),
                schoolInfo.tagline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#444", marginTop: 2 }, children: schoolInfo.tagline }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#555", marginTop: 3 }, children: schoolInfo.address }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#555" }, children: [
                  schoolInfo.phone && `Mob: ${schoolInfo.phone}`,
                  schoolInfo.phone && schoolInfo.email ? "  |  " : "",
                  schoolInfo.email && `Email: ${schoolInfo.email}`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    background: HEADER_BG,
                    color: HEADER_TEXT,
                    padding: "6px 14px",
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 1,
                    flexShrink: 0
                  },
                  children: "FEE RECEIPT"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              borderBottom: `1px solid ${BORDER}`,
              background: "#f7f9fd"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    flex: 1,
                    padding: "10px 16px",
                    borderRight: `1px solid ${BORDER}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "R.No", value: payment.receiptNo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Date", value: formatDate(payment.paymentDate) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Class", value: classLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Section", value: student.sectionId || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "SID", value: student.admNo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "Mobile",
                        value: student.fatherMobile || student.mobile || "—"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Session", value: payment.sessionId })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: { flex: 1, padding: "10px 16px", display: "flex", gap: 12 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        InfoRow,
                        {
                          label: "Student Name",
                          value: student.fullName,
                          labelWidth: 100
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        InfoRow,
                        {
                          label: "Father Name",
                          value: student.fatherName || "—",
                          labelWidth: 100
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        InfoRow,
                        {
                          label: "Mother Name",
                          value: student.motherName || "—",
                          labelWidth: 100
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Months", value: coveredMonths, labelWidth: 100 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: 72,
                          height: 90,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 4,
                          overflow: "hidden",
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        },
                        children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: student.photoUrl,
                            alt: student.fullName,
                            style: { width: "100%", height: "100%", objectFit: "cover" }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              fontSize: 9,
                              color: "#888",
                              textAlign: "center",
                              padding: 4
                            },
                            children: "PHOTO"
                          }
                        )
                      }
                    ) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: `1px solid ${BORDER}` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              style: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: HEADER_BG, color: HEADER_TEXT }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("center", 40), children: "Sr." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("left"), children: "PARTICULARS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("right", 110), children: "AMOUNT" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                  headingGroups.map((group, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center"), children: i + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: tdStyle("left"), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: group.headingName }),
                          group.months.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                color: "#555",
                                marginLeft: 6,
                                fontWeight: 400
                              },
                              children: [
                                "\\u2014 ",
                                group.months.join(", ")
                              ]
                            }
                          ),
                          group.isOther && group.otherDescription ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#666", marginLeft: 4 }, children: [
                            "\\u2014 ",
                            group.otherDescription
                          ] }) : null
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("right"), children: inr(group.amount) })
                      ]
                    },
                    `${group.headingId}-${i}`
                  )),
                  oldBalItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: "#fff8ec",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center"), children: headingGroups.length + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { ...tdStyle("left"), color: "#b45309" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "Previous Session Balance" }),
                          (oldBalance == null ? void 0 : oldBalance.sessionId) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                marginLeft: 6,
                                fontSize: 11,
                                color: "#b45309"
                              },
                              children: [
                                "(",
                                oldBalance.sessionId,
                                ")"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...tdStyle("right"), color: "#b45309" }, children: inr(safeNum(oldBalItem.amount)) })
                      ]
                    }
                  ),
                  concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: "#f0fdf4",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center"), children: "\\u2014" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { ...tdStyle("left"), color: "#166534" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "Concession / Discount" }),
                          (discount == null ? void 0 : discount.remarks) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: { marginLeft: 6, fontSize: 11, color: "#888" },
                              children: [
                                "(",
                                discount.remarks,
                                ")"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { ...tdStyle("right"), color: "#166534" }, children: [
                          "\\u2212 ",
                          inr(concessionAmt)
                        ] })
                      ]
                    }
                  ),
                  Array.from({ length: fillerCount }, (_, i) => `a4f-${i}`).map(
                    (k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: `1px solid ${BORDER}` }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("left") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("right") })
                    ] }, k)
                  )
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 130,
                borderLeft: `1px solid ${BORDER}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 12,
                gap: 8,
                background: "#f7f9fd"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 90,
                      height: 90,
                      background: "#fff",
                      border: `2px solid ${BLUE}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRPatternSVG, { size: 70 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#555", textAlign: "center" }, children: "Scan to verify" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      fontWeight: 700,
                      color: BLUE,
                      textAlign: "center"
                    },
                    children: payment.receiptNo
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: `1px solid ${BORDER}` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                flex: 1,
                padding: "10px 16px",
                borderRight: `1px solid ${BORDER}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 6 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 12 }, children: "Received In: " }),
                  ["Cash", "Cheque", "NEFT", "UPI", "Online"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        marginRight: 8,
                        marginBottom: 4,
                        padding: "1px 8px",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 3,
                        background: payment.paymentMethod === mode ? LIGHT_BLUE : "#fff",
                        fontWeight: payment.paymentMethod === mode ? 700 : 400,
                        fontSize: 11
                      },
                      children: [
                        payment.paymentMethod === mode ? "☑" : "☐",
                        " ",
                        mode
                      ]
                    },
                    mode
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "#333",
                      marginBottom: 4
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Paid Amount:" }),
                      " ",
                      amountInWords(amountReceived)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: BLUE }, children: inr(amountReceived) }),
                payment.remarks ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#666", marginTop: 4 }, children: [
                  "Remarks: ",
                  payment.remarks
                ] }) : null
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 260, padding: "10px 16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmtRow, { label: "Total Fee", value: feeTotal }),
            oldBalAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AmtRow, { label: "+ Old Balance", value: oldBalAmt, color: "#b45309" }),
            concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "\\u2212 Concession",
                value: concessionAmt,
                color: "#166534",
                negative: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  borderTop: `1px solid ${BORDER}`,
                  marginTop: 4,
                  paddingTop: 4
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Net Fee",
                value: netFee + (oldBalAmt > 0 ? oldBalAmt : 0),
                bold: true,
                color: BLUE
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Amount Received",
                value: amountReceived,
                bold: true,
                color: "#166534"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Balance Due",
                value: safeNum(payment.balance ?? 0),
                bold: true,
                color: "#dc2626"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "10px 20px 14px",
              background: "#f7f9fd"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#555" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Collected By: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.collectedBy })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, fontSize: 10, color: "#888" }, children: "This is a computer-generated receipt. Please retain for your records." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      width: 200,
                      borderTop: "1px solid #333",
                      paddingTop: 6,
                      fontSize: 12,
                      textAlign: "center"
                    },
                    children: [
                      "Received By:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.collectedBy || "............" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#555", marginTop: 2 }, children: "Principal / Accountant" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function A4HalfReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  feeHeadings
}) {
  const classLabel = CLASS_LABELS[student.classLevel] ?? student.classLevel;
  const safeItems = Array.isArray(payment == null ? void 0 : payment.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => (it == null ? void 0 : it.feeHeadingId) !== "old-balance"
  );
  const oldBalItem = safeItems.find((it) => (it == null ? void 0 : it.feeHeadingId) === "old-balance");
  const headingGroups = groupByHeading(regularItems, feeHeadings);
  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem == null ? void 0 : oldBalItem.amount);
  const concessionAmt = (discount == null ? void 0 : discount.monthlyDiscountAmount) ?? 0;
  const netFee = feeTotal;
  const amountReceived = safeNum(payment == null ? void 0 : payment.totalAmount);
  const coveredMonths = getCoveredMonths(regularItems);
  const fillerCount = Math.max(
    0,
    4 - headingGroups.length - (oldBalItem ? 1 : 0) - (concessionAmt > 0 ? 1 : 0)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "fee-receipt-print",
      style: {
        width: 794,
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box"
      },
      "data-ocid": "fee_receipt.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderBottom: `2px solid ${BLUE}`,
              gap: 12,
              background: LIGHT_BLUE
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fff",
                    border: `2px solid ${BLUE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 9,
                    color: BLUE,
                    fontWeight: 700,
                    overflow: "hidden"
                  },
                  children: schoolInfo.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: schoolInfo.photoUrl,
                      alt: "logo",
                      style: {
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LOGO" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 16,
                      fontWeight: 700,
                      color: BLUE,
                      letterSpacing: 0.5
                    },
                    children: schoolInfo.name.toUpperCase()
                  }
                ),
                schoolInfo.tagline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#444" }, children: schoolInfo.tagline }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#555" }, children: [
                  schoolInfo.address,
                  schoolInfo.phone ? ` | Mob: ${schoolInfo.phone}` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    background: HEADER_BG,
                    color: HEADER_TEXT,
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: 1,
                    flexShrink: 0
                  },
                  children: "FEE RECEIPT"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              borderBottom: `1px solid ${BORDER}`,
              background: "#f7f9fd"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    flex: 1,
                    padding: "7px 12px",
                    borderRight: `1px solid ${BORDER}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "R.No",
                        value: payment.receiptNo,
                        fontSize: 11,
                        labelWidth: 70
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "Date",
                        value: formatDate(payment.paymentDate),
                        fontSize: 11,
                        labelWidth: 70
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "Class",
                        value: `${classLabel} | ${student.sectionId || "—"}`,
                        fontSize: 11,
                        labelWidth: 70
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "SID",
                        value: student.admNo,
                        fontSize: 11,
                        labelWidth: 70
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      InfoRow,
                      {
                        label: "Session",
                        value: payment.sessionId,
                        fontSize: 11,
                        labelWidth: 70
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "7px 12px", display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Student",
                      value: student.fullName,
                      fontSize: 11,
                      labelWidth: 64
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Father",
                      value: student.fatherName || "—",
                      fontSize: 11,
                      labelWidth: 64
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Mobile",
                      value: student.fatherMobile || student.mobile || "—",
                      fontSize: 11,
                      labelWidth: 64
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Months",
                      value: coveredMonths,
                      fontSize: 11,
                      labelWidth: 64
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 56,
                      height: 70,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: student.photoUrl,
                        alt: student.fullName,
                        style: { width: "100%", height: "100%", objectFit: "cover" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: 8,
                          color: "#888",
                          textAlign: "center",
                          padding: 3
                        },
                        children: "PHOTO"
                      }
                    )
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: `1px solid ${BORDER}` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              style: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: HEADER_BG, color: HEADER_TEXT }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("center", 34, 11), children: "Sr." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("left", void 0, 11), children: "PARTICULARS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle("right", 90, 11), children: "AMOUNT" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                  headingGroups.map((group, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center", 11), children: i + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: tdStyle("left", 11), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: group.headingName }),
                          group.months.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                color: "#555",
                                marginLeft: 5,
                                fontWeight: 400
                              },
                              children: [
                                "— ",
                                group.months.join(", ")
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("right", 11), children: inr(group.amount) })
                      ]
                    },
                    `${group.headingId}-${i}`
                  )),
                  oldBalItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: "#fff8ec",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center", 11), children: headingGroups.length + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...tdStyle("left", 11), color: "#b45309" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "Previous Balance" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...tdStyle("right", 11), color: "#b45309" }, children: inr(safeNum(oldBalItem.amount)) })
                      ]
                    }
                  ),
                  concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        background: "#f0fdf4",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center", 11), children: "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...tdStyle("left", 11), color: "#166534" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "Concession" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { ...tdStyle("right", 11), color: "#166534" }, children: [
                          "− ",
                          inr(concessionAmt)
                        ] })
                      ]
                    }
                  ),
                  Array.from({ length: fillerCount }, (_, i) => `hf-${i}`).map(
                    (k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: `1px solid ${BORDER}` }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("center", 11) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("left", 11) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle("right", 11) })
                    ] }, k)
                  )
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 100,
                borderLeft: `1px solid ${BORDER}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                gap: 6,
                background: "#f7f9fd"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 70,
                      height: 70,
                      background: "#fff",
                      border: `2px solid ${BLUE}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRPatternSVG, { size: 54 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#555", textAlign: "center" }, children: "Scan to verify" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 9,
                      fontWeight: 700,
                      color: BLUE,
                      textAlign: "center"
                    },
                    children: payment.receiptNo
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: `1px solid ${BORDER}` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                flex: 1,
                padding: "7px 12px",
                borderRight: `1px solid ${BORDER}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 4 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 11 }, children: "Mode: " }),
                  ["Cash", "Cheque", "NEFT", "UPI", "Online"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        marginRight: 6,
                        padding: "1px 6px",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 3,
                        background: payment.paymentMethod === mode ? LIGHT_BLUE : "#fff",
                        fontWeight: payment.paymentMethod === mode ? 700 : 400,
                        fontSize: 10
                      },
                      children: [
                        payment.paymentMethod === mode ? "☑" : "☐",
                        " ",
                        mode
                      ]
                    },
                    mode
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, fontStyle: "italic", color: "#333" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Amount:" }),
                  " ",
                  amountInWords(amountReceived)
                ] }),
                payment.remarks ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#666", marginTop: 3 }, children: [
                  "Remarks: ",
                  payment.remarks
                ] }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#555", marginTop: 6 }, children: [
                  "Collected By: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.collectedBy })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 220, padding: "7px 12px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmtRow, { label: "Total Fee", value: feeTotal, fontSize: 11 }),
            oldBalAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "+ Old Balance",
                value: oldBalAmt,
                color: "#b45309",
                fontSize: 11
              }
            ),
            concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "− Concession",
                value: concessionAmt,
                color: "#166534",
                negative: true,
                fontSize: 11
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  borderTop: `1px solid ${BORDER}`,
                  marginTop: 3,
                  paddingTop: 3
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Net Fee",
                value: netFee + (oldBalAmt > 0 ? oldBalAmt : 0),
                bold: true,
                color: BLUE,
                fontSize: 11
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Amount Received",
                value: amountReceived,
                bold: true,
                color: "#166534",
                fontSize: 11
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AmtRow,
              {
                label: "Balance Due",
                value: safeNum(payment.balance ?? 0),
                bold: true,
                color: "#dc2626",
                fontSize: 11
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  borderTop: "1px solid #333",
                  marginTop: 18,
                  paddingTop: 5,
                  fontSize: 10,
                  textAlign: "center",
                  color: "#555"
                },
                children: [
                  "Received By:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.collectedBy || "............" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "(Principal/Accountant)"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function QuarterReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  feeHeadings
}) {
  const classLabel = CLASS_LABELS[student.classLevel] ?? student.classLevel;
  const safeItems = Array.isArray(payment == null ? void 0 : payment.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => (it == null ? void 0 : it.feeHeadingId) !== "old-balance"
  );
  const oldBalItem = safeItems.find((it) => (it == null ? void 0 : it.feeHeadingId) === "old-balance");
  const headingGroups = groupByHeading(regularItems, feeHeadings);
  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem == null ? void 0 : oldBalItem.amount);
  const concessionAmt = (discount == null ? void 0 : discount.monthlyDiscountAmount) ?? 0;
  const amountReceived = safeNum(payment == null ? void 0 : payment.totalAmount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "fee-receipt-print",
      style: {
        width: 397,
        fontFamily: "Arial, sans-serif",
        fontSize: 10,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box"
      },
      "data-ocid": "fee_receipt.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: HEADER_BG,
              color: HEADER_TEXT,
              padding: "6px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 12 }, children: schoolInfo.name.toUpperCase() }),
                schoolInfo.tagline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#ccc" }, children: schoolInfo.tagline })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontWeight: 700,
                      fontSize: 10,
                      background: "#fff",
                      color: BLUE,
                      padding: "2px 6px",
                      borderRadius: 2
                    },
                    children: "FEE RECEIPT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, marginTop: 3, color: "#ddd" }, children: payment.receiptNo })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "6px 10px",
              borderBottom: `1px solid ${BORDER}`,
              background: LIGHT_BLUE
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 11, color: BLUE }, children: student.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#444", marginTop: 1 }, children: [
                classLabel,
                " | Adm: ",
                student.admNo,
                " | Date:",
                " ",
                formatDate(payment.paymentDate)
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            style: { width: "100%", borderCollapse: "collapse", fontSize: 10 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: "#eef3fc" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    style: {
                      padding: "4px 8px",
                      textAlign: "left",
                      fontWeight: 700,
                      borderBottom: `1px solid ${BORDER}`,
                      color: BLUE
                    },
                    children: "Particulars"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    style: {
                      padding: "4px 8px",
                      textAlign: "right",
                      fontWeight: 700,
                      borderBottom: `1px solid ${BORDER}`,
                      color: BLUE,
                      width: 70
                    },
                    children: "Amount"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                headingGroups.map((group, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: {
                      background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                      borderBottom: `1px solid ${BORDER}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "3px 8px" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: group.headingName }),
                        group.months.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#888", marginLeft: 4 }, children: [
                          "(",
                          group.months.join(", "),
                          ")"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px", textAlign: "right" }, children: inr(group.amount) })
                    ]
                  },
                  `${group.headingId}-${i}`
                )),
                oldBalItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: {
                      background: "#fff8ec",
                      borderBottom: `1px solid ${BORDER}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            padding: "3px 8px",
                            color: "#b45309",
                            fontWeight: 600
                          },
                          children: "Previous Balance"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            padding: "3px 8px",
                            textAlign: "right",
                            color: "#b45309"
                          },
                          children: inr(safeNum(oldBalItem.amount))
                        }
                      )
                    ]
                  }
                ),
                concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: {
                      background: "#f0fdf4",
                      borderBottom: `1px solid ${BORDER}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            padding: "3px 8px",
                            color: "#166534",
                            fontWeight: 600
                          },
                          children: "Concession"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "td",
                        {
                          style: {
                            padding: "3px 8px",
                            textAlign: "right",
                            color: "#166534"
                          },
                          children: [
                            "− ",
                            inr(concessionAmt)
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "6px 10px",
              background: "#f7f9fd",
              borderTop: `1px solid ${BORDER}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                    fontSize: 10
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#555" }, children: "Total Fee" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(feeTotal + oldBalAmt) })
                  ]
                }
              ),
              concessionAmt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                    fontSize: 10,
                    color: "#166534"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Concession" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "− ",
                      inr(concessionAmt)
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#166534",
                    borderTop: `1px solid ${BORDER}`,
                    paddingTop: 4
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount Paid" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(amountReceived) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "#dc2626",
                    marginTop: 2
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(safeNum(payment.balance ?? 0)) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
              borderTop: `1px solid ${BORDER}`,
              background: "#eef3fc"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: "#555" }, children: [
                "Mode: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.paymentMethod }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "By: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.collectedBy })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(QRPatternSVG, { size: 44 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "#555", marginTop: 2 }, children: "Scan to verify" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    borderTop: "1px solid #999",
                    paddingTop: 4,
                    fontSize: 9,
                    textAlign: "center",
                    color: "#555",
                    width: 90
                  },
                  children: "Authorised Sign."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              textAlign: "center",
              fontSize: 8,
              color: "#888",
              padding: "3px 10px",
              borderTop: `1px solid ${BORDER}`,
              background: "#fff"
            },
            children: "Computer-generated receipt · No signature required · Retain for your records"
          }
        )
      ]
    }
  );
}
function FeeReceiptTemplate(props) {
  const size = props.size ?? "a4";
  if (size === "half") return /* @__PURE__ */ jsxRuntimeExports.jsx(A4HalfReceipt, { ...props });
  if (size === "quarter") return /* @__PURE__ */ jsxRuntimeExports.jsx(QuarterReceipt, { ...props });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(A4FullReceipt, { ...props });
}
export {
  FeeReceiptTemplate as F
};
