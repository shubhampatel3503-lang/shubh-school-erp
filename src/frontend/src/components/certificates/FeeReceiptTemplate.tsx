import { formatDate } from "@/lib/utils";
import type {
  FeeHeading,
  FeePayment,
  SchoolInfo,
  Student,
  StudentDiscount,
  StudentOldBalance,
} from "@/types";
import { CLASS_LABELS } from "@/types";

// ─── INR Amount → Words ──────────────────────────────────────────────────────
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
  "Nineteen",
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
  "Ninety",
];

function numToWords(n: number): string {
  if (n === 0) return "Zero";
  if (n < 0) return `Minus ${numToWords(-n)}`;
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? ` ${ones[n % 10]}` : "");
  if (n < 1000)
    return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${numToWords(n % 100)}` : ""}`;
  if (n < 100000)
    return `${numToWords(Math.floor(n / 1000))} Thousand${n % 1000 ? ` ${numToWords(n % 1000)}` : ""}`;
  if (n < 10000000)
    return `${numToWords(Math.floor(n / 100000))} Lakh${n % 100000 ? ` ${numToWords(n % 100000)}` : ""}`;
  return `${numToWords(Math.floor(n / 10000000))} Crore${n % 10000000 ? ` ${numToWords(n % 10000000)}` : ""}`;
}

export function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = `Rupees ${numToWords(rupees)}`;
  if (paise > 0) result += ` and ${numToWords(paise)} Paise`;
  result += " Only";
  return result;
}

function inr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getCoveredMonths(
  items: FeePayment["items"] | null | undefined,
): string {
  if (!items || !Array.isArray(items)) return "—";
  const months = [
    ...new Set(items.map((it) => it?.month ?? "").filter(Boolean)),
  ];
  if (months.length === 0) return "—";
  if (months.length === 1) return months[0];
  return `${months[0]}–${months[months.length - 1]}`;
}

// ─── Per-heading grouped rows ─────────────────────────────────────────────────
interface HeadingGroup {
  headingId: string;
  headingName: string;
  months: string[];
  amount: number; // total amount for all months in this group
  isOld?: boolean;
  isOther?: boolean;
  otherDescription?: string;
}

function groupByHeading(
  items: FeePayment["items"] | null | undefined,
  feeHeadings?: FeeHeading[],
): HeadingGroup[] {
  if (!items || !Array.isArray(items)) return [];
  const headingMap = new Map<string, string>();
  if (feeHeadings) {
    for (const h of feeHeadings) {
      if (h?.id && h?.name) headingMap.set(h.id, h.name);
    }
  }
  const map = new Map<string, HeadingGroup>();
  for (const it of items) {
    if (!it) continue;
    const key = it.feeHeadingId ?? "";
    if (!map.has(key)) {
      // Resolve name: feeHeadings list > feeHeadingName if it's not an ID > key
      const resolvedFromList = headingMap.get(key);
      const storedName = it.feeHeadingName;
      // storedName is trustworthy only if it differs from the headingId (i.e. it's an actual name)
      const nameIsId = storedName === key;
      const headingName =
        resolvedFromList ??
        (storedName && !nameIsId ? storedName : null) ??
        key;
      if (headingName === key && key !== "transport" && key !== "old-balance") {
        console.warn(
          "[FeeReceipt] Could not resolve heading name for id:",
          key,
        );
      }
      map.set(key, {
        headingId: key,
        headingName,
        months: [],
        amount: 0,
        isOld: key === "old-balance",
        isOther: it.isOther,
        otherDescription: it.otherDescription,
      });
    }
    const group = map.get(key)!;
    if (it.month) group.months.push(it.month);
    group.amount += safeNum(it.amount);
  }
  // Filter out zero-amount groups — only show headings where fees were actually collected
  return [...map.values()].filter((g) => g.amount > 0);
}

/** Safely coerce a value that may be bigint or number to a plain number. */
function safeNum(v: number | bigint | undefined | null): number {
  if (v == null) return 0;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}

// ─── Template Size Type ───────────────────────────────────────────────────────
export type ReceiptSize = "a4" | "half" | "quarter";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface FeeReceiptTemplateProps {
  payment: FeePayment;
  student: Student;
  schoolInfo: SchoolInfo;
  feeHeadings?: FeeHeading[];
  discount?: StudentDiscount | null;
  oldBalance?: StudentOldBalance | null;
  size?: ReceiptSize;
}

// ─── Color Palette ────────────────────────────────────────────────────────────
const BLUE = "#1a3a6b";
const LIGHT_BLUE = "#e8f0fe";
const BORDER = "#c0c8d8";
const HEADER_BG = "#1a3a6b";
const HEADER_TEXT = "#ffffff";

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  labelWidth = 90,
  fontSize = 12,
}: {
  label: string;
  value: string;
  labelWidth?: number;
  fontSize?: number;
}) {
  return (
    <div style={{ display: "flex", marginBottom: 3, fontSize }}>
      <span
        style={{
          width: labelWidth,
          color: "#555",
          flexShrink: 0,
          fontWeight: 600,
        }}
      >
        {label}:
      </span>
      <span style={{ color: "#222" }}>{value}</span>
    </div>
  );
}

function AmtRow({
  label,
  value,
  bold,
  color,
  negative,
  fontSize = 12,
}: {
  label: string;
  value: number;
  bold?: boolean;
  color?: string;
  negative?: boolean;
  fontSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 3,
        fontSize,
        fontWeight: bold ? 700 : 400,
        color: color ?? "#222",
      }}
    >
      <span>{label}</span>
      <span>
        {negative ? "−" : ""}
        {`₹${value.toLocaleString("en-IN")}`}
      </span>
    </div>
  );
}

function thStyle(
  align: "left" | "center" | "right",
  width?: number,
  fontSize = 12,
): React.CSSProperties {
  return {
    padding: "7px 10px",
    textAlign: align,
    borderRight: "1px solid rgba(255,255,255,0.2)",
    fontWeight: 700,
    fontSize,
    ...(width ? { width } : {}),
  };
}

function tdStyle(
  align: "left" | "center" | "right",
  fontSize = 12,
): React.CSSProperties {
  return {
    padding: "5px 10px",
    textAlign: align,
    verticalAlign: "middle",
    minHeight: 24,
    fontSize,
  };
}

function QRPatternSVG({ size = 70 }: { size?: number }) {
  const dataDots: Array<{ x: number; y: number }> = [
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
    { x: 60, y: 50 },
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <title>QR Code</title>
      <rect
        x="4"
        y="4"
        width="22"
        height="22"
        fill="none"
        stroke="#1a3a6b"
        strokeWidth="2.5"
      />
      <rect x="9" y="9" width="12" height="12" fill="#1a3a6b" />
      <rect
        x="44"
        y="4"
        width="22"
        height="22"
        fill="none"
        stroke="#1a3a6b"
        strokeWidth="2.5"
      />
      <rect x="49" y="9" width="12" height="12" fill="#1a3a6b" />
      <rect
        x="4"
        y="44"
        width="22"
        height="22"
        fill="none"
        stroke="#1a3a6b"
        strokeWidth="2.5"
      />
      <rect x="9" y="49" width="12" height="12" fill="#1a3a6b" />
      {dataDots.map((dot) => (
        <rect
          key={`dot-${dot.x}-${dot.y}`}
          x={dot.x}
          y={dot.y}
          width="4"
          height="4"
          fill="#1a3a6b"
        />
      ))}
    </svg>
  );
}

// ─── A4 FULL PAGE Receipt ─────────────────────────────────────────────────────
function A4FullReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  oldBalance,
  feeHeadings,
}: Omit<FeeReceiptTemplateProps, "size">) {
  const classLabel =
    CLASS_LABELS[student.classLevel as keyof typeof CLASS_LABELS] ??
    student.classLevel;
  const safeItems = Array.isArray(payment?.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => it?.feeHeadingId !== "old-balance",
  );
  const oldBalItem = safeItems.find((it) => it?.feeHeadingId === "old-balance");

  // Group regular items by heading — each group = one row in Particulars
  const headingGroups = groupByHeading(regularItems, feeHeadings);

  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem?.amount);
  const concessionAmt = discount?.monthlyDiscountAmount ?? 0;
  const netFee = feeTotal;
  const amountReceived = safeNum(payment?.totalAmount);
  const coveredMonths = getCoveredMonths(regularItems);

  const fillerCount = Math.max(
    0,
    6 -
      headingGroups.length -
      (oldBalItem ? 1 : 0) -
      (concessionAmt > 0 ? 1 : 0),
  );

  return (
    <div
      id="fee-receipt-print"
      style={{
        width: 794,
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box",
      }}
      data-ocid="fee_receipt.panel"
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: `2px solid ${BLUE}`,
          gap: 16,
          background: LIGHT_BLUE,
        }}
      >
        <div
          style={{
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
            overflow: "hidden",
          }}
        >
          {schoolInfo.photoUrl ? (
            <img
              src={schoolInfo.photoUrl}
              alt="logo"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span style={{ padding: 4 }}>LOGO</span>
          )}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: BLUE,
              letterSpacing: 1,
            }}
          >
            {schoolInfo.name.toUpperCase()}
          </div>
          {schoolInfo.tagline && (
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
              {schoolInfo.tagline}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>
            {schoolInfo.address}
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            {schoolInfo.phone && `Mob: ${schoolInfo.phone}`}
            {schoolInfo.phone && schoolInfo.email ? "  |  " : ""}
            {schoolInfo.email && `Email: ${schoolInfo.email}`}
          </div>
        </div>
        <div
          style={{
            background: HEADER_BG,
            color: HEADER_TEXT,
            padding: "6px 14px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          FEE RECEIPT
        </div>
      </div>

      {/* INFO ROW */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${BORDER}`,
          background: "#f7f9fd",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <InfoRow label="R.No" value={payment.receiptNo} />
          <InfoRow label="Date" value={formatDate(payment.paymentDate)} />
          <InfoRow label="Class" value={classLabel} />
          <InfoRow label="Section" value={student.sectionId || "\u2014"} />
          <InfoRow label="SID" value={student.admNo} />
          <InfoRow
            label="Mobile"
            value={student.fatherMobile || student.mobile || "\u2014"}
          />
          <InfoRow label="Session" value={payment.sessionId} />
        </div>
        <div
          style={{ flex: 1, padding: "10px 16px", display: "flex", gap: 12 }}
        >
          <div style={{ flex: 1 }}>
            <InfoRow
              label="Student Name"
              value={student.fullName}
              labelWidth={100}
            />
            <InfoRow
              label="Father Name"
              value={student.fatherName || "\u2014"}
              labelWidth={100}
            />
            <InfoRow
              label="Mother Name"
              value={student.motherName || "\u2014"}
              labelWidth={100}
            />
            <InfoRow label="Months" value={coveredMonths} labelWidth={100} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 72,
                height: 90,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                overflow: "hidden",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 9,
                    color: "#888",
                    textAlign: "center",
                    padding: 4,
                  }}
                >
                  PHOTO
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEE TABLE — per heading with months listed */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ flex: 1 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr style={{ background: HEADER_BG, color: HEADER_TEXT }}>
                <th style={thStyle("center", 40)}>Sr.</th>
                <th style={thStyle("left")}>PARTICULARS</th>
                <th style={thStyle("right", 110)}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {headingGroups.map((group, i) => (
                <tr
                  key={`${group.headingId}-${i}`}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center")}>{i + 1}</td>
                  <td style={tdStyle("left")}>
                    <span style={{ fontWeight: 600 }}>{group.headingName}</span>
                    {group.months.length > 0 && (
                      <span
                        style={{
                          color: "#555",
                          marginLeft: 6,
                          fontWeight: 400,
                        }}
                      >
                        \u2014 {group.months.join(", ")}
                      </span>
                    )}
                    {group.isOther && group.otherDescription ? (
                      <span style={{ color: "#666", marginLeft: 4 }}>
                        \u2014 {group.otherDescription}
                      </span>
                    ) : null}
                  </td>
                  <td style={tdStyle("right")}>{inr(group.amount)}</td>
                </tr>
              ))}
              {oldBalItem && (
                <tr
                  style={{
                    background: "#fff8ec",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center")}>{headingGroups.length + 1}</td>
                  <td style={{ ...tdStyle("left"), color: "#b45309" }}>
                    <span style={{ fontWeight: 600 }}>
                      Previous Session Balance
                    </span>
                    {oldBalance?.sessionId && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          color: "#b45309",
                        }}
                      >
                        ({oldBalance.sessionId})
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle("right"), color: "#b45309" }}>
                    {inr(safeNum(oldBalItem.amount))}
                  </td>
                </tr>
              )}
              {concessionAmt > 0 && (
                <tr
                  style={{
                    background: "#f0fdf4",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center")}>\u2014</td>
                  <td style={{ ...tdStyle("left"), color: "#166534" }}>
                    <span style={{ fontWeight: 600 }}>
                      Concession / Discount
                    </span>
                    {discount?.remarks && (
                      <span
                        style={{ marginLeft: 6, fontSize: 11, color: "#888" }}
                      >
                        ({discount.remarks})
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle("right"), color: "#166534" }}>
                    \u2212 {inr(concessionAmt)}
                  </td>
                </tr>
              )}
              {Array.from({ length: fillerCount }, (_, i) => `a4f-${i}`).map(
                (k) => (
                  <tr key={k} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={tdStyle("center")} />
                    <td style={tdStyle("left")} />
                    <td style={tdStyle("right")} />
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            width: 130,
            borderLeft: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
            gap: 8,
            background: "#f7f9fd",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              background: "#fff",
              border: `2px solid ${BLUE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <QRPatternSVG size={70} />
          </div>
          <div style={{ fontSize: 10, color: "#555", textAlign: "center" }}>
            Scan to verify
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: BLUE,
              textAlign: "center",
            }}
          >
            {payment.receiptNo}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
        <div
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 12 }}>Received In: </span>
            {["Cash", "Cheque", "NEFT", "UPI", "Online"].map((mode) => (
              <span
                key={mode}
                style={{
                  display: "inline-block",
                  marginRight: 8,
                  marginBottom: 4,
                  padding: "1px 8px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  background:
                    payment.paymentMethod === mode ? LIGHT_BLUE : "#fff",
                  fontWeight: payment.paymentMethod === mode ? 700 : 400,
                  fontSize: 11,
                }}
              >
                {payment.paymentMethod === mode ? "\u2611" : "\u2610"} {mode}
              </span>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              fontStyle: "italic",
              color: "#333",
              marginBottom: 4,
            }}
          >
            <strong>Paid Amount:</strong> {amountInWords(amountReceived)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>
            {inr(amountReceived)}
          </div>
          {payment.remarks ? (
            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
              Remarks: {payment.remarks}
            </div>
          ) : null}
        </div>
        <div style={{ width: 260, padding: "10px 16px" }}>
          <AmtRow label="Total Fee" value={feeTotal} />
          {oldBalAmt > 0 && (
            <AmtRow label="+ Old Balance" value={oldBalAmt} color="#b45309" />
          )}
          {concessionAmt > 0 && (
            <AmtRow
              label="\u2212 Concession"
              value={concessionAmt}
              color="#166534"
              negative
            />
          )}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              marginTop: 4,
              paddingTop: 4,
            }}
          />
          <AmtRow
            label="Net Fee"
            value={netFee + (oldBalAmt > 0 ? oldBalAmt : 0)}
            bold
            color={BLUE}
          />
          <AmtRow
            label="Amount Received"
            value={amountReceived}
            bold
            color="#166534"
          />
          <AmtRow
            label="Balance Due"
            value={safeNum(payment.balance ?? 0)}
            bold
            color="#dc2626"
          />
        </div>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "10px 20px 14px",
          background: "#f7f9fd",
        }}
      >
        <div style={{ fontSize: 11, color: "#555" }}>
          <div>
            Collected By: <strong>{payment.collectedBy}</strong>
          </div>
          <div style={{ marginTop: 4, fontSize: 10, color: "#888" }}>
            This is a computer-generated receipt. Please retain for your
            records.
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 200,
              borderTop: "1px solid #333",
              paddingTop: 6,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Received By:{" "}
            <strong>{payment.collectedBy || "............"}</strong>
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
            Principal / Accountant
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── A4 HALF PAGE Receipt ─────────────────────────────────────────────────────
function A4HalfReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  feeHeadings,
}: Omit<FeeReceiptTemplateProps, "size">) {
  const classLabel =
    CLASS_LABELS[student.classLevel as keyof typeof CLASS_LABELS] ??
    student.classLevel;
  const safeItems = Array.isArray(payment?.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => it?.feeHeadingId !== "old-balance",
  );
  const oldBalItem = safeItems.find((it) => it?.feeHeadingId === "old-balance");

  const headingGroups = groupByHeading(regularItems, feeHeadings);

  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem?.amount);
  const concessionAmt = discount?.monthlyDiscountAmount ?? 0;
  const netFee = feeTotal;
  const amountReceived = safeNum(payment?.totalAmount);
  const coveredMonths = getCoveredMonths(regularItems);

  const fillerCount = Math.max(
    0,
    4 -
      headingGroups.length -
      (oldBalItem ? 1 : 0) -
      (concessionAmt > 0 ? 1 : 0),
  );

  return (
    <div
      id="fee-receipt-print"
      style={{
        width: 794,
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box",
      }}
      data-ocid="fee_receipt.panel"
    >
      {/* HEADER — compact */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          borderBottom: `2px solid ${BLUE}`,
          gap: 12,
          background: LIGHT_BLUE,
        }}
      >
        <div
          style={{
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
            overflow: "hidden",
          }}
        >
          {schoolInfo.photoUrl ? (
            <img
              src={schoolInfo.photoUrl}
              alt="logo"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span>LOGO</span>
          )}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: BLUE,
              letterSpacing: 0.5,
            }}
          >
            {schoolInfo.name.toUpperCase()}
          </div>
          {schoolInfo.tagline && (
            <div style={{ fontSize: 10, color: "#444" }}>
              {schoolInfo.tagline}
            </div>
          )}
          <div style={{ fontSize: 10, color: "#555" }}>
            {schoolInfo.address}
            {schoolInfo.phone ? ` | Mob: ${schoolInfo.phone}` : ""}
          </div>
        </div>
        <div
          style={{
            background: HEADER_BG,
            color: HEADER_TEXT,
            padding: "4px 10px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          FEE RECEIPT
        </div>
      </div>

      {/* INFO ROW */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${BORDER}`,
          background: "#f7f9fd",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "7px 12px",
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <InfoRow
            label="R.No"
            value={payment.receiptNo}
            fontSize={11}
            labelWidth={70}
          />
          <InfoRow
            label="Date"
            value={formatDate(payment.paymentDate)}
            fontSize={11}
            labelWidth={70}
          />
          <InfoRow
            label="Class"
            value={`${classLabel} | ${student.sectionId || "—"}`}
            fontSize={11}
            labelWidth={70}
          />
          <InfoRow
            label="SID"
            value={student.admNo}
            fontSize={11}
            labelWidth={70}
          />
          <InfoRow
            label="Session"
            value={payment.sessionId}
            fontSize={11}
            labelWidth={70}
          />
        </div>
        <div style={{ flex: 1, padding: "7px 12px", display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <InfoRow
              label="Student"
              value={student.fullName}
              fontSize={11}
              labelWidth={64}
            />
            <InfoRow
              label="Father"
              value={student.fatherName || "—"}
              fontSize={11}
              labelWidth={64}
            />
            <InfoRow
              label="Mobile"
              value={student.fatherMobile || student.mobile || "—"}
              fontSize={11}
              labelWidth={64}
            />
            <InfoRow
              label="Months"
              value={coveredMonths}
              fontSize={11}
              labelWidth={64}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 56,
                height: 70,
                border: `1px solid ${BORDER}`,
                borderRadius: 3,
                overflow: "hidden",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 8,
                    color: "#888",
                    textAlign: "center",
                    padding: 3,
                  }}
                >
                  PHOTO
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEE TABLE — per heading with months */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ flex: 1 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr style={{ background: HEADER_BG, color: HEADER_TEXT }}>
                <th style={thStyle("center", 34, 11)}>Sr.</th>
                <th style={thStyle("left", undefined, 11)}>PARTICULARS</th>
                <th style={thStyle("right", 90, 11)}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {headingGroups.map((group, i) => (
                <tr
                  key={`${group.headingId}-${i}`}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center", 11)}>{i + 1}</td>
                  <td style={tdStyle("left", 11)}>
                    <span style={{ fontWeight: 600 }}>{group.headingName}</span>
                    {group.months.length > 0 && (
                      <span
                        style={{
                          color: "#555",
                          marginLeft: 5,
                          fontWeight: 400,
                        }}
                      >
                        — {group.months.join(", ")}
                      </span>
                    )}
                  </td>
                  <td style={tdStyle("right", 11)}>{inr(group.amount)}</td>
                </tr>
              ))}
              {oldBalItem && (
                <tr
                  style={{
                    background: "#fff8ec",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center", 11)}>
                    {headingGroups.length + 1}
                  </td>
                  <td style={{ ...tdStyle("left", 11), color: "#b45309" }}>
                    <span style={{ fontWeight: 600 }}>Previous Balance</span>
                  </td>
                  <td style={{ ...tdStyle("right", 11), color: "#b45309" }}>
                    {inr(safeNum(oldBalItem.amount))}
                  </td>
                </tr>
              )}
              {concessionAmt > 0 && (
                <tr
                  style={{
                    background: "#f0fdf4",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <td style={tdStyle("center", 11)}>—</td>
                  <td style={{ ...tdStyle("left", 11), color: "#166534" }}>
                    <span style={{ fontWeight: 600 }}>Concession</span>
                  </td>
                  <td style={{ ...tdStyle("right", 11), color: "#166534" }}>
                    − {inr(concessionAmt)}
                  </td>
                </tr>
              )}
              {Array.from({ length: fillerCount }, (_, i) => `hf-${i}`).map(
                (k) => (
                  <tr key={k} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={tdStyle("center", 11)} />
                    <td style={tdStyle("left", 11)} />
                    <td style={tdStyle("right", 11)} />
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            width: 100,
            borderLeft: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            gap: 6,
            background: "#f7f9fd",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              background: "#fff",
              border: `2px solid ${BLUE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
            }}
          >
            <QRPatternSVG size={54} />
          </div>
          <div style={{ fontSize: 9, color: "#555", textAlign: "center" }}>
            Scan to verify
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: BLUE,
              textAlign: "center",
            }}
          >
            {payment.receiptNo}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
        <div
          style={{
            flex: 1,
            padding: "7px 12px",
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 11 }}>Mode: </span>
            {["Cash", "Cheque", "NEFT", "UPI", "Online"].map((mode) => (
              <span
                key={mode}
                style={{
                  display: "inline-block",
                  marginRight: 6,
                  padding: "1px 6px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  background:
                    payment.paymentMethod === mode ? LIGHT_BLUE : "#fff",
                  fontWeight: payment.paymentMethod === mode ? 700 : 400,
                  fontSize: 10,
                }}
              >
                {payment.paymentMethod === mode ? "☑" : "☐"} {mode}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontStyle: "italic", color: "#333" }}>
            <strong>Amount:</strong> {amountInWords(amountReceived)}
          </div>
          {payment.remarks ? (
            <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>
              Remarks: {payment.remarks}
            </div>
          ) : null}
          <div style={{ fontSize: 10, color: "#555", marginTop: 6 }}>
            Collected By: <strong>{payment.collectedBy}</strong>
          </div>
        </div>
        <div style={{ width: 220, padding: "7px 12px" }}>
          <AmtRow label="Total Fee" value={feeTotal} fontSize={11} />
          {oldBalAmt > 0 && (
            <AmtRow
              label="+ Old Balance"
              value={oldBalAmt}
              color="#b45309"
              fontSize={11}
            />
          )}
          {concessionAmt > 0 && (
            <AmtRow
              label="− Concession"
              value={concessionAmt}
              color="#166534"
              negative
              fontSize={11}
            />
          )}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              marginTop: 3,
              paddingTop: 3,
            }}
          />
          <AmtRow
            label="Net Fee"
            value={netFee + (oldBalAmt > 0 ? oldBalAmt : 0)}
            bold
            color={BLUE}
            fontSize={11}
          />
          <AmtRow
            label="Amount Received"
            value={amountReceived}
            bold
            color="#166534"
            fontSize={11}
          />
          <AmtRow
            label="Balance Due"
            value={safeNum(payment.balance ?? 0)}
            bold
            color="#dc2626"
            fontSize={11}
          />
          <div
            style={{
              borderTop: "1px solid #333",
              marginTop: 18,
              paddingTop: 5,
              fontSize: 10,
              textAlign: "center",
              color: "#555",
            }}
          >
            Received By:{" "}
            <strong>{payment.collectedBy || "............"}</strong>
            <br />
            (Principal/Accountant)
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUARTER PAGE Receipt ─────────────────────────────────────────────────────
function QuarterReceipt({
  payment,
  student,
  schoolInfo,
  discount,
  feeHeadings,
}: Omit<FeeReceiptTemplateProps, "size">) {
  const classLabel =
    CLASS_LABELS[student.classLevel as keyof typeof CLASS_LABELS] ??
    student.classLevel;
  const safeItems = Array.isArray(payment?.items) ? payment.items : [];
  const regularItems = safeItems.filter(
    (it) => it?.feeHeadingId !== "old-balance",
  );
  const oldBalItem = safeItems.find((it) => it?.feeHeadingId === "old-balance");

  const headingGroups = groupByHeading(regularItems, feeHeadings);

  const feeTotal = headingGroups.reduce((s, g) => s + g.amount, 0);
  const oldBalAmt = safeNum(oldBalItem?.amount);
  const concessionAmt = discount?.monthlyDiscountAmount ?? 0;
  const amountReceived = safeNum(payment?.totalAmount);

  return (
    <div
      id="fee-receipt-print"
      style={{
        width: 397,
        fontFamily: "Arial, sans-serif",
        fontSize: 10,
        color: "#222",
        background: "#fff",
        border: `2px solid ${BLUE}`,
        boxSizing: "border-box",
      }}
      data-ocid="fee_receipt.panel"
    >
      {/* MINI HEADER */}
      <div
        style={{
          background: HEADER_BG,
          color: HEADER_TEXT,
          padding: "6px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 12 }}>
            {schoolInfo.name.toUpperCase()}
          </div>
          {schoolInfo.tagline && (
            <div style={{ fontSize: 9, color: "#ccc" }}>
              {schoolInfo.tagline}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 10,
              background: "#fff",
              color: BLUE,
              padding: "2px 6px",
              borderRadius: 2,
            }}
          >
            FEE RECEIPT
          </div>
          <div style={{ fontSize: 9, marginTop: 3, color: "#ddd" }}>
            {payment.receiptNo}
          </div>
        </div>
      </div>

      {/* STUDENT LINE */}
      <div
        style={{
          padding: "6px 10px",
          borderBottom: `1px solid ${BORDER}`,
          background: LIGHT_BLUE,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 11, color: BLUE }}>
          {student.fullName}
        </div>
        <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>
          {classLabel} | Adm: {student.admNo} | Date:{" "}
          {formatDate(payment.paymentDate)}
        </div>
      </div>

      {/* FEE ITEMS — per heading with months */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}
      >
        <thead>
          <tr style={{ background: "#eef3fc" }}>
            <th
              style={{
                padding: "4px 8px",
                textAlign: "left",
                fontWeight: 700,
                borderBottom: `1px solid ${BORDER}`,
                color: BLUE,
              }}
            >
              Particulars
            </th>
            <th
              style={{
                padding: "4px 8px",
                textAlign: "right",
                fontWeight: 700,
                borderBottom: `1px solid ${BORDER}`,
                color: BLUE,
                width: 70,
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {headingGroups.map((group, i) => (
            <tr
              key={`${group.headingId}-${i}`}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f7f9fd",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <td style={{ padding: "3px 8px" }}>
                <span style={{ fontWeight: 600 }}>{group.headingName}</span>
                {group.months.length > 0 && (
                  <span style={{ color: "#888", marginLeft: 4 }}>
                    ({group.months.join(", ")})
                  </span>
                )}
              </td>
              <td style={{ padding: "3px 8px", textAlign: "right" }}>
                {inr(group.amount)}
              </td>
            </tr>
          ))}
          {oldBalItem && (
            <tr
              style={{
                background: "#fff8ec",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <td
                style={{
                  padding: "3px 8px",
                  color: "#b45309",
                  fontWeight: 600,
                }}
              >
                Previous Balance
              </td>
              <td
                style={{
                  padding: "3px 8px",
                  textAlign: "right",
                  color: "#b45309",
                }}
              >
                {inr(safeNum(oldBalItem.amount))}
              </td>
            </tr>
          )}
          {concessionAmt > 0 && (
            <tr
              style={{
                background: "#f0fdf4",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <td
                style={{
                  padding: "3px 8px",
                  color: "#166534",
                  fontWeight: 600,
                }}
              >
                Concession
              </td>
              <td
                style={{
                  padding: "3px 8px",
                  textAlign: "right",
                  color: "#166534",
                }}
              >
                − {inr(concessionAmt)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* TOTALS */}
      <div
        style={{
          padding: "6px 10px",
          background: "#f7f9fd",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
            fontSize: 10,
          }}
        >
          <span style={{ color: "#555" }}>Total Fee</span>
          <span>{inr(feeTotal + oldBalAmt)}</span>
        </div>
        {concessionAmt > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 3,
              fontSize: 10,
              color: "#166534",
            }}
          >
            <span>Concession</span>
            <span>− {inr(concessionAmt)}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 11,
            color: "#166534",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 4,
          }}
        >
          <span>Amount Paid</span>
          <span>{inr(amountReceived)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#dc2626",
            marginTop: 2,
          }}
        >
          <span>Balance Due</span>
          <span>{inr(safeNum(payment.balance ?? 0))}</span>
        </div>
      </div>

      {/* MINI FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
          borderTop: `1px solid ${BORDER}`,
          background: "#eef3fc",
        }}
      >
        <div style={{ fontSize: 9, color: "#555" }}>
          Mode: <strong>{payment.paymentMethod}</strong>
          <br />
          By: <strong>{payment.collectedBy}</strong>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <QRPatternSVG size={44} />
          <div style={{ fontSize: 8, color: "#555", marginTop: 2 }}>
            Scan to verify
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #999",
            paddingTop: 4,
            fontSize: 9,
            textAlign: "center",
            color: "#555",
            width: 90,
          }}
        >
          Authorised Sign.
        </div>
      </div>

      {/* Computer generated note */}
      <div
        style={{
          textAlign: "center",
          fontSize: 8,
          color: "#888",
          padding: "3px 10px",
          borderTop: `1px solid ${BORDER}`,
          background: "#fff",
        }}
      >
        Computer-generated receipt · No signature required · Retain for your
        records
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function FeeReceiptTemplate(props: FeeReceiptTemplateProps) {
  const size = props.size ?? "a4";

  if (size === "half") return <A4HalfReceipt {...props} />;
  if (size === "quarter") return <QuarterReceipt {...props} />;
  return <A4FullReceipt {...props} />;
}
