import { GeneratePrintModal } from "@/components/certificates/GeneratePrintModal";
import { TemplateLibrary } from "@/components/certificates/TemplateLibrary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CertificateTemplateBackend,
  useCertificateTemplates,
  useDeleteCertificateTemplate,
  useSaveCertificateTemplate,
  useSetDefaultCertificateTemplate,
} from "@/hooks/useBackend";
import { generateId } from "@/lib/utils";
import type { CertificateType } from "@/types";
import {
  AlignCenter,
  AlignLeft,
  ArrowLeft,
  Bold,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  GalleryVerticalEnd,
  GridIcon,
  Image,
  Italic,
  Layers,
  Maximize2,
  Plus,
  Printer,
  QrCode,
  Save,
  Star,
  Table,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DesignElement {
  id: string;
  type: "text" | "image" | "qr" | "table" | "field";
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center";
}

type PaperSize =
  | "A4"
  | "A5"
  | "Half-Page"
  | "Quarter-Page"
  | "Letter"
  | "Custom";

interface CanvasState {
  elements: DesignElement[];
  paperSize: PaperSize;
  customW?: number;
  customH?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CERT_TYPES: { type: CertificateType; label: string }[] = [
  { type: "IDCard", label: "Student ID Card" },
  { type: "StaffIDCard", label: "Staff ID Card" },
  { type: "FeeReceipt", label: "Fee Receipt" },
  { type: "AdmissionForm", label: "Admission Form" },
  { type: "Result", label: "Result Sheet" },
  { type: "AdmitCard", label: "Admit Card" },
  { type: "Bonafide", label: "Bonafide Certificate" },
  { type: "Transfer", label: "Transfer Certificate" },
  { type: "Experience", label: "Experience Letter" },
  { type: "DemandSlip", label: "Demand Slip" },
];

const PAPER_SIZES: { value: PaperSize; label: string; w: number; h: number }[] =
  [
    { value: "A4", label: "A4 (210×297mm)", w: 595, h: 842 },
    { value: "A5", label: "A5 (148×210mm)", w: 420, h: 595 },
    { value: "Half-Page", label: "Half-Page (210×148mm)", w: 595, h: 420 },
    {
      value: "Quarter-Page",
      label: "Quarter-Page (105×148mm)",
      w: 397,
      h: 559,
    },
    { value: "Letter", label: "Letter (216×279mm)", w: 612, h: 792 },
    { value: "Custom", label: "Custom (enter size)", w: 595, h: 420 },
  ];

const FONTS = [
  "Times New Roman",
  "Arial",
  "Georgia",
  "Calibri",
  "Helvetica",
  "Roboto",
];

// ─── Field token categories ───────────────────────────────────────────────────
interface FieldCategory {
  label: string;
  fields: { token: string; desc: string }[];
}

const FIELD_CATEGORIES: FieldCategory[] = [
  {
    label: "Student",
    fields: [
      { token: "{{studentName}}", desc: "Student full name" },
      { token: "{{admNo}}", desc: "Admission number" },
      { token: "{{srNo}}", desc: "SR number" },
      { token: "{{className}}", desc: "Class" },
      { token: "{{section}}", desc: "Section" },
      { token: "{{rollNo}}", desc: "Roll number" },
      { token: "{{fatherName}}", desc: "Father's name" },
      { token: "{{motherName}}", desc: "Mother's name" },
      { token: "{{dob}}", desc: "Date of birth (dd/mm/yyyy)" },
      { token: "{{currentAddress}}", desc: "Current/full address" },
      { token: "{{permanentAddress}}", desc: "Permanent/village address" },
      { token: "{{phone}}", desc: "Phone number" },
      { token: "{{gender}}", desc: "Gender" },
      { token: "{{category}}", desc: "Category (General/OBC/SC/ST)" },
      { token: "{{religion}}", desc: "Religion" },
      { token: "{{bloodGroup}}", desc: "Blood group" },
      { token: "{{aadhaarNo}}", desc: "Aadhaar number" },
      { token: "{{penNo}}", desc: "PEN number" },
      { token: "{{apaarNo}}", desc: "APAAR number" },
      { token: "{{session}}", desc: "Academic session (e.g. 2025-26)" },
      { token: "{{feeBalance}}", desc: "Current fee balance" },
      { token: "{{transportRoute}}", desc: "Transport route name" },
      { token: "{{pickupPoint}}", desc: "Pickup point name" },
      { token: "{{studentPhoto}}", desc: "Student photo" },
    ],
  },
  {
    label: "School",
    fields: [
      { token: "{{schoolName}}", desc: "School name" },
      { token: "{{schoolAddress}}", desc: "School address" },
      { token: "{{schoolPhone}}", desc: "School phone" },
      { token: "{{schoolEmail}}", desc: "School email" },
      { token: "{{schoolLogo}}", desc: "School logo" },
      { token: "{{principalName}}", desc: "Principal name" },
      { token: "{{schoolStamp}}", desc: "Stamp/seal placeholder" },
    ],
  },
  {
    label: "Fees",
    fields: [
      { token: "{{feeHeading}}", desc: "Fee heading name" },
      { token: "{{feeAmount}}", desc: "Fee amount" },
      { token: "{{paidAmount}}", desc: "Amount paid" },
      { token: "{{feeBalance}}", desc: "Balance/outstanding" },
      { token: "{{receiptNo}}", desc: "Receipt number" },
      { token: "{{paymentDate}}", desc: "Payment date (dd/mm/yyyy)" },
      { token: "{{paymentMode}}", desc: "Payment mode (Cash/Online/Cheque)" },
      { token: "{{receiverName}}", desc: "Fee receiver name" },
      { token: "{{totalFees}}", desc: "Total fees for session" },
      { token: "{{totalPaid}}", desc: "Total paid for session" },
      { token: "{{totalDue}}", desc: "Total due" },
      { token: "{{oldBalance}}", desc: "Old/previous year balance" },
      { token: "{{discount}}", desc: "Discount amount" },
      { token: "{{lateFees}}", desc: "Late fees amount" },
      { token: "{{monthsPaid}}", desc: "Months fees paid" },
      { token: "{{monthsDue}}", desc: "Months fees due" },
    ],
  },
  {
    label: "Exam",
    fields: [
      { token: "{{examName}}", desc: "Exam name" },
      { token: "{{subjectName}}", desc: "Subject name" },
      { token: "{{marksObtained}}", desc: "Marks obtained" },
      { token: "{{maxMarks}}", desc: "Maximum marks" },
      { token: "{{grade}}", desc: "Grade" },
      { token: "{{totalMarks}}", desc: "Total marks" },
      { token: "{{percentage}}", desc: "Percentage" },
      { token: "{{rank}}", desc: "Rank in class" },
      { token: "{{result}}", desc: "Result (Pass/Fail)" },
      { token: "{{seatNo}}", desc: "Seat number (admit card)" },
      { token: "{{examDate}}", desc: "Exam date" },
      { token: "{{examTime}}", desc: "Exam time" },
      { token: "{{examVenue}}", desc: "Exam venue" },
    ],
  },
  {
    label: "Attendance",
    fields: [
      { token: "{{totalWorkingDays}}", desc: "Total working days" },
      { token: "{{daysPresent}}", desc: "Days present" },
      { token: "{{daysAbsent}}", desc: "Days absent" },
      { token: "{{attendancePercent}}", desc: "Attendance percentage" },
    ],
  },
  {
    label: "Date & Session",
    fields: [
      { token: "{{todayDate}}", desc: "Today's date (dd/mm/yyyy)" },
      { token: "{{academicSession}}", desc: "Academic session" },
      { token: "{{currentMonth}}", desc: "Current month name" },
      { token: "{{issueDate}}", desc: "Issue date" },
      { token: "{{academicYear}}", desc: "Academic year" },
      { token: "{{classTeacher}}", desc: "Class teacher name" },
    ],
  },
];

// Legacy flat list kept for reference only (unused in UI)

// ─── Built-in pre-designed templates ─────────────────────────────────────────
const FEE_RECEIPT_ELEMENTS: DesignElement[] = [
  {
    id: "fr-school",
    type: "field",
    label: "{{school_name}}",
    x: 60,
    y: 10,
    w: 300,
    h: 28,
    fontSize: 18,
    bold: true,
    align: "center",
  },
  {
    id: "fr-title",
    type: "text",
    label: "FEE RECEIPT",
    x: 60,
    y: 44,
    w: 200,
    h: 24,
    fontSize: 14,
    bold: true,
    align: "center",
  },
  {
    id: "fr-student",
    type: "field",
    label: "{{student_name}}",
    x: 60,
    y: 90,
    w: 220,
    h: 24,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-class",
    type: "field",
    label: "{{class}}",
    x: 60,
    y: 120,
    w: 140,
    h: 24,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-admno",
    type: "field",
    label: "{{admission_no}}",
    x: 220,
    y: 120,
    w: 140,
    h: 24,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-session",
    type: "field",
    label: "{{session}}",
    x: 60,
    y: 150,
    w: 140,
    h: 24,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-father",
    type: "field",
    label: "{{father_name}}",
    x: 220,
    y: 150,
    w: 200,
    h: 24,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-table",
    type: "table",
    label: "Fee Particulars Table",
    x: 60,
    y: 190,
    w: 460,
    h: 160,
    fontSize: 12,
    bold: false,
    align: "left",
  },
  {
    id: "fr-qr",
    type: "qr",
    label: "QR",
    x: 490,
    y: 190,
    w: 80,
    h: 80,
    fontSize: 10,
    bold: false,
    align: "center",
  },
  {
    id: "fr-sign",
    type: "text",
    label: "Authorised Signatory",
    x: 380,
    y: 380,
    w: 180,
    h: 24,
    fontSize: 11,
    bold: false,
    align: "center",
  },
];
const BUILT_IN_TEMPLATES: CertificateTemplateBackend[] = [
  // Fee Receipt
  {
    id: "bi-fr-1",
    name: "Classic Receipt (A4)",
    templateType: "FeeReceipt",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: FEE_RECEIPT_ELEMENTS,
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-fr-2",
    name: "Half-Page Receipt",
    templateType: "FeeReceipt",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "frh-school",
          type: "field",
          label: "{{school_name}}",
          x: 40,
          y: 8,
          w: 280,
          h: 24,
          fontSize: 15,
          bold: true,
          align: "center",
        },
        {
          id: "frh-title",
          type: "text",
          label: "FEE RECEIPT",
          x: 40,
          y: 36,
          w: 160,
          h: 22,
          fontSize: 12,
          bold: true,
          align: "center",
        },
        {
          id: "frh-student",
          type: "field",
          label: "{{student_name}}",
          x: 40,
          y: 70,
          w: 200,
          h: 22,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "frh-class",
          type: "field",
          label: "{{class}}",
          x: 40,
          y: 96,
          w: 120,
          h: 22,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "frh-session",
          type: "field",
          label: "{{session}}",
          x: 180,
          y: 96,
          w: 120,
          h: 22,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "frh-table",
          type: "table",
          label: "Fee Particulars Table",
          x: 40,
          y: 128,
          w: 380,
          h: 120,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "frh-qr",
          type: "qr",
          label: "QR",
          x: 440,
          y: 128,
          w: 70,
          h: 70,
          fontSize: 10,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "Half-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-fr-3",
    name: "Quarter-Page Receipt",
    templateType: "FeeReceipt",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "frq-school",
          type: "field",
          label: "{{school_name}}",
          x: 20,
          y: 8,
          w: 200,
          h: 20,
          fontSize: 11,
          bold: true,
          align: "center",
        },
        {
          id: "frq-title",
          type: "text",
          label: "FEE RECEIPT",
          x: 20,
          y: 32,
          w: 120,
          h: 18,
          fontSize: 10,
          bold: true,
          align: "center",
        },
        {
          id: "frq-student",
          type: "field",
          label: "{{student_name}}",
          x: 20,
          y: 58,
          w: 180,
          h: 18,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "frq-class",
          type: "field",
          label: "{{class}}",
          x: 20,
          y: 80,
          w: 80,
          h: 18,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "frq-table",
          type: "table",
          label: "Fee Table",
          x: 20,
          y: 104,
          w: 240,
          h: 90,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "frq-sign",
          type: "text",
          label: "Authorised Signature",
          x: 80,
          y: 230,
          w: 140,
          h: 18,
          fontSize: 9,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "Quarter-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // Bonafide
  {
    id: "bi-bon-1",
    name: "Formal Bonafide",
    templateType: "Bonafide",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "bon-school",
          type: "field",
          label: "{{school_name}}",
          x: 100,
          y: 30,
          w: 380,
          h: 32,
          fontSize: 22,
          bold: true,
          align: "center",
        },
        {
          id: "bon-addr",
          type: "text",
          label: "123 Education Lane, Knowledge City, India",
          x: 100,
          y: 68,
          w: 380,
          h: 20,
          fontSize: 11,
          bold: false,
          align: "center",
        },
        {
          id: "bon-title",
          type: "text",
          label: "BONAFIDE CERTIFICATE",
          x: 150,
          y: 110,
          w: 280,
          h: 28,
          fontSize: 18,
          bold: true,
          align: "center",
        },
        {
          id: "bon-refdate",
          type: "text",
          label: "Ref. No.: ____  Date: ____",
          x: 60,
          y: 150,
          w: 450,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "bon-body1",
          type: "text",
          label: "This is to certify that",
          x: 60,
          y: 196,
          w: 200,
          h: 20,
          fontSize: 13,
          bold: false,
          align: "left",
        },
        {
          id: "bon-student",
          type: "field",
          label: "{{student_name}}",
          x: 270,
          y: 196,
          w: 240,
          h: 20,
          fontSize: 14,
          bold: true,
          align: "left",
        },
        {
          id: "bon-class",
          type: "field",
          label: "{{class}}",
          x: 60,
          y: 226,
          w: 140,
          h: 20,
          fontSize: 13,
          bold: false,
          align: "left",
        },
        {
          id: "bon-session",
          type: "field",
          label: "{{session}}",
          x: 220,
          y: 226,
          w: 140,
          h: 20,
          fontSize: 13,
          bold: false,
          align: "left",
        },
        {
          id: "bon-dob",
          type: "field",
          label: "{{date_of_birth}}",
          x: 60,
          y: 256,
          w: 160,
          h: 20,
          fontSize: 13,
          bold: false,
          align: "left",
        },
        {
          id: "bon-sign",
          type: "text",
          label: "Principal",
          x: 340,
          y: 440,
          w: 180,
          h: 24,
          fontSize: 13,
          bold: true,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-bon-2",
    name: "Modern Bonafide",
    templateType: "Bonafide",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "bonm-school",
          type: "field",
          label: "{{school_name}}",
          x: 80,
          y: 20,
          w: 420,
          h: 32,
          fontSize: 24,
          bold: true,
          align: "center",
        },
        {
          id: "bonm-title",
          type: "text",
          label: "BONAFIDE CERTIFICATE",
          x: 150,
          y: 90,
          w: 280,
          h: 28,
          fontSize: 18,
          bold: true,
          align: "center",
        },
        {
          id: "bonm-student",
          type: "field",
          label: "{{student_name}}",
          x: 60,
          y: 150,
          w: 240,
          h: 24,
          fontSize: 15,
          bold: true,
          align: "left",
        },
        {
          id: "bonm-father",
          type: "field",
          label: "{{father_name}}",
          x: 60,
          y: 182,
          w: 240,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "bonm-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 60,
          y: 210,
          w: 160,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "bonm-class",
          type: "field",
          label: "{{class}}",
          x: 240,
          y: 210,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "bonm-session",
          type: "field",
          label: "{{session}}",
          x: 400,
          y: 210,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "bonm-sign",
          type: "text",
          label: "Authorised Signatory",
          x: 340,
          y: 420,
          w: 180,
          h: 24,
          fontSize: 13,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // Transfer Certificate
  {
    id: "bi-tc-1",
    name: "Formal TC (Government Style)",
    templateType: "Transfer",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "tc-school",
          type: "field",
          label: "{{school_name}}",
          x: 100,
          y: 20,
          w: 380,
          h: 30,
          fontSize: 20,
          bold: true,
          align: "center",
        },
        {
          id: "tc-title",
          type: "text",
          label: "TRANSFER CERTIFICATE",
          x: 140,
          y: 66,
          w: 300,
          h: 28,
          fontSize: 17,
          bold: true,
          align: "center",
        },
        {
          id: "tc-tcno",
          type: "text",
          label: "T.C. No.: ______",
          x: 60,
          y: 110,
          w: 220,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tc-date",
          type: "text",
          label: "Date: ______",
          x: 400,
          y: 110,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tc-table",
          type: "table",
          label: "TC Details Table",
          x: 60,
          y: 144,
          w: 460,
          h: 380,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tc-sign",
          type: "text",
          label: "Principal",
          x: 360,
          y: 560,
          w: 160,
          h: 24,
          fontSize: 13,
          bold: true,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-tc-2",
    name: "Simplified TC",
    templateType: "Transfer",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "tcs-school",
          type: "field",
          label: "{{school_name}}",
          x: 60,
          y: 16,
          w: 460,
          h: 28,
          fontSize: 20,
          bold: true,
          align: "left",
        },
        {
          id: "tcs-student",
          type: "field",
          label: "{{student_name}}",
          x: 60,
          y: 80,
          w: 280,
          h: 24,
          fontSize: 14,
          bold: true,
          align: "left",
        },
        {
          id: "tcs-father",
          type: "field",
          label: "{{father_name}}",
          x: 60,
          y: 110,
          w: 240,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tcs-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 60,
          y: 136,
          w: 160,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tcs-class",
          type: "field",
          label: "{{class}}",
          x: 240,
          y: 136,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tcs-dob",
          type: "field",
          label: "{{date_of_birth}}",
          x: 60,
          y: 162,
          w: 160,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "tcs-sign",
          type: "text",
          label: "Principal / Authorised Signatory",
          x: 300,
          y: 440,
          w: 220,
          h: 24,
          fontSize: 12,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // ID Card
  {
    id: "bi-id-1",
    name: "Vertical ID Card",
    templateType: "IDCard",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "idv-school",
          type: "field",
          label: "{{school_name}}",
          x: 10,
          y: 8,
          w: 140,
          h: 18,
          fontSize: 8,
          bold: true,
          align: "center",
        },
        {
          id: "idv-photo",
          type: "image",
          label: "{{photo}}",
          x: 40,
          y: 36,
          w: 60,
          h: 70,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "idv-student",
          type: "field",
          label: "{{student_name}}",
          x: 10,
          y: 114,
          w: 140,
          h: 18,
          fontSize: 11,
          bold: true,
          align: "center",
        },
        {
          id: "idv-class",
          type: "field",
          label: "{{class}}",
          x: 10,
          y: 136,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "center",
        },
        {
          id: "idv-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 10,
          y: 156,
          w: 140,
          h: 16,
          fontSize: 8,
          bold: false,
          align: "left",
        },
        {
          id: "idv-dob",
          type: "field",
          label: "{{date_of_birth}}",
          x: 10,
          y: 174,
          w: 140,
          h: 16,
          fontSize: 8,
          bold: false,
          align: "left",
        },
        {
          id: "idv-roll",
          type: "field",
          label: "{{roll_no}}",
          x: 10,
          y: 192,
          w: 140,
          h: 16,
          fontSize: 8,
          bold: false,
          align: "left",
        },
      ],
      paperSize: "Quarter-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-id-2",
    name: "Horizontal ID Card",
    templateType: "IDCard",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "idh-school",
          type: "field",
          label: "{{school_name}}",
          x: 80,
          y: 8,
          w: 200,
          h: 18,
          fontSize: 9,
          bold: true,
          align: "left",
        },
        {
          id: "idh-photo",
          type: "image",
          label: "{{photo}}",
          x: 10,
          y: 14,
          w: 60,
          h: 70,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "idh-student",
          type: "field",
          label: "{{student_name}}",
          x: 80,
          y: 32,
          w: 200,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "idh-class",
          type: "field",
          label: "{{class}}",
          x: 80,
          y: 56,
          w: 140,
          h: 16,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "idh-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 80,
          y: 76,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "idh-dob",
          type: "field",
          label: "{{date_of_birth}}",
          x: 80,
          y: 96,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "idh-father",
          type: "field",
          label: "{{father_name}}",
          x: 80,
          y: 116,
          w: 200,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
      ],
      paperSize: "Half-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-id-3",
    name: "Themed ID Card",
    templateType: "IDCard",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "idt-school",
          type: "field",
          label: "{{school_name}}",
          x: 10,
          y: 8,
          w: 240,
          h: 18,
          fontSize: 9,
          bold: true,
          align: "left",
        },
        {
          id: "idt-photo",
          type: "image",
          label: "{{photo}}",
          x: 10,
          y: 30,
          w: 64,
          h: 74,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "idt-student",
          type: "field",
          label: "{{student_name}}",
          x: 80,
          y: 30,
          w: 180,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "idt-class",
          type: "field",
          label: "{{class}}",
          x: 80,
          y: 54,
          w: 140,
          h: 16,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "idt-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 80,
          y: 74,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "idt-roll",
          type: "field",
          label: "{{roll_no}}",
          x: 80,
          y: 94,
          w: 100,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "idt-session",
          type: "field",
          label: "{{session}}",
          x: 190,
          y: 94,
          w: 70,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
      ],
      paperSize: "Quarter-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // Staff ID Card
  {
    id: "bi-sid-1",
    name: "Horizontal Staff ID Card",
    templateType: "StaffIDCard",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "sid-school",
          type: "field",
          label: "{{schoolName}}",
          x: 95,
          y: 8,
          w: 200,
          h: 18,
          fontSize: 9,
          bold: true,
          align: "left",
        },
        {
          id: "sid-photo",
          type: "image",
          label: "{{staffPhoto}}",
          x: 10,
          y: 14,
          w: 60,
          h: 70,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "sid-name",
          type: "field",
          label: "{{staffName}}",
          x: 95,
          y: 30,
          w: 200,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "sid-desg",
          type: "field",
          label: "{{designation}}",
          x: 95,
          y: 54,
          w: 180,
          h: 16,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "sid-id",
          type: "field",
          label: "{{staffCode}}",
          x: 95,
          y: 74,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "sid-dept",
          type: "field",
          label: "{{department}}",
          x: 95,
          y: 94,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "sid-mobile",
          type: "field",
          label: "{{phone}}",
          x: 95,
          y: 114,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
      ],
      paperSize: "Half-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-sid-2",
    name: "Themed Staff ID Card",
    templateType: "StaffIDCard",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "sidt-school",
          type: "field",
          label: "{{schoolName}}",
          x: 10,
          y: 8,
          w: 240,
          h: 18,
          fontSize: 9,
          bold: true,
          align: "left",
        },
        {
          id: "sidt-photo",
          type: "image",
          label: "{{staffPhoto}}",
          x: 10,
          y: 30,
          w: 64,
          h: 74,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "sidt-name",
          type: "field",
          label: "{{staffName}}",
          x: 80,
          y: 30,
          w: 180,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "sidt-desg",
          type: "field",
          label: "{{designation}}",
          x: 80,
          y: 54,
          w: 160,
          h: 16,
          fontSize: 10,
          bold: false,
          align: "left",
        },
        {
          id: "sidt-id",
          type: "field",
          label: "{{staffCode}}",
          x: 80,
          y: 74,
          w: 120,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
        {
          id: "sidt-dept",
          type: "field",
          label: "{{department}}",
          x: 80,
          y: 94,
          w: 140,
          h: 16,
          fontSize: 9,
          bold: false,
          align: "left",
        },
      ],
      paperSize: "Quarter-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // Admit Card
  {
    id: "bi-ac-1",
    name: "Formal Admit Card",
    templateType: "AdmitCard",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "ac-school",
          type: "field",
          label: "{{school_name}}",
          x: 100,
          y: 16,
          w: 380,
          h: 28,
          fontSize: 20,
          bold: true,
          align: "center",
        },
        {
          id: "ac-title",
          type: "text",
          label: "ADMIT CARD",
          x: 180,
          y: 56,
          w: 220,
          h: 26,
          fontSize: 16,
          bold: true,
          align: "center",
        },
        {
          id: "ac-examname",
          type: "text",
          label: "Annual Examination 2025-26",
          x: 140,
          y: 88,
          w: 300,
          h: 20,
          fontSize: 13,
          bold: false,
          align: "center",
        },
        {
          id: "ac-photo",
          type: "image",
          label: "{{photo}}",
          x: 480,
          y: 40,
          w: 80,
          h: 96,
          fontSize: 10,
          bold: false,
          align: "center",
        },
        {
          id: "ac-student",
          type: "field",
          label: "{{student_name}}",
          x: 60,
          y: 130,
          w: 280,
          h: 24,
          fontSize: 14,
          bold: true,
          align: "left",
        },
        {
          id: "ac-class",
          type: "field",
          label: "{{class}}",
          x: 60,
          y: 158,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ac-roll",
          type: "field",
          label: "{{roll_no}}",
          x: 220,
          y: 158,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ac-admno",
          type: "field",
          label: "{{admission_no}}",
          x: 380,
          y: 158,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ac-session",
          type: "field",
          label: "{{session}}",
          x: 60,
          y: 184,
          w: 140,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ac-table",
          type: "table",
          label: "Exam Schedule Table",
          x: 60,
          y: 220,
          w: 460,
          h: 200,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ac-sign",
          type: "text",
          label: "Principal's Signature",
          x: 360,
          y: 460,
          w: 180,
          h: 24,
          fontSize: 12,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  {
    id: "bi-ac-2",
    name: "Compact Admit Card",
    templateType: "AdmitCard",
    isDefault: false,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "acc-school",
          type: "field",
          label: "{{school_name}}",
          x: 60,
          y: 10,
          w: 320,
          h: 22,
          fontSize: 14,
          bold: true,
          align: "center",
        },
        {
          id: "acc-title",
          type: "text",
          label: "ADMIT CARD",
          x: 140,
          y: 38,
          w: 160,
          h: 20,
          fontSize: 12,
          bold: true,
          align: "center",
        },
        {
          id: "acc-student",
          type: "field",
          label: "{{student_name}}",
          x: 60,
          y: 74,
          w: 240,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "acc-class",
          type: "field",
          label: "{{class}}",
          x: 60,
          y: 98,
          w: 120,
          h: 18,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "acc-roll",
          type: "field",
          label: "{{roll_no}}",
          x: 200,
          y: 98,
          w: 120,
          h: 18,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "acc-table",
          type: "table",
          label: "Exam Schedule",
          x: 60,
          y: 128,
          w: 360,
          h: 140,
          fontSize: 11,
          bold: false,
          align: "left",
        },
        {
          id: "acc-sign",
          type: "text",
          label: "Principal",
          x: 280,
          y: 310,
          w: 140,
          h: 20,
          fontSize: 11,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "Half-Page",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
  // Demand Slip
  {
    id: "bi-ds-1",
    name: "Demand Notice / Fees Due Slip",
    templateType: "DemandSlip",
    isDefault: true,
    elementsJson: JSON.stringify({
      elements: [
        {
          id: "ds-school",
          type: "field",
          label: "{{schoolName}}",
          x: 60,
          y: 16,
          w: 460,
          h: 30,
          fontSize: 20,
          bold: true,
          align: "center",
        },
        {
          id: "ds-addr",
          type: "field",
          label: "{{schoolAddress}}",
          x: 60,
          y: 50,
          w: 460,
          h: 20,
          fontSize: 11,
          bold: false,
          align: "center",
        },
        {
          id: "ds-title",
          type: "text",
          label: "DEMAND NOTICE / FEES DUE SLIP",
          x: 100,
          y: 90,
          w: 380,
          h: 28,
          fontSize: 16,
          bold: true,
          align: "center",
        },
        {
          id: "ds-date",
          type: "field",
          label: "Date: {{todayDate}}",
          x: 380,
          y: 130,
          w: 160,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "right",
        },
        {
          id: "ds-student",
          type: "field",
          label: "Student: {{studentName}}",
          x: 60,
          y: 160,
          w: 300,
          h: 22,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "ds-admno",
          type: "field",
          label: "Adm. No.: {{admNo}}",
          x: 60,
          y: 186,
          w: 200,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-class",
          type: "field",
          label: "Class: {{className}}-{{section}}",
          x: 280,
          y: 186,
          w: 200,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-father",
          type: "field",
          label: "Father: {{fatherName}}",
          x: 60,
          y: 210,
          w: 260,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-phone",
          type: "field",
          label: "Phone: {{phone}}",
          x: 340,
          y: 210,
          w: 180,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-table",
          type: "table",
          label: "Fee Heading | Months Due | Amount",
          x: 60,
          y: 244,
          w: 460,
          h: 160,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-oldbal",
          type: "field",
          label: "Previous Balance: {{oldBalance}}",
          x: 60,
          y: 418,
          w: 260,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-totaldue",
          type: "field",
          label: "Total Due: {{totalDue}}",
          x: 340,
          y: 418,
          w: 180,
          h: 20,
          fontSize: 13,
          bold: true,
          align: "left",
        },
        {
          id: "ds-monthsdue",
          type: "field",
          label: "Months Due: {{monthsDue}}",
          x: 60,
          y: 444,
          w: 300,
          h: 20,
          fontSize: 12,
          bold: false,
          align: "left",
        },
        {
          id: "ds-note",
          type: "text",
          label: "Please pay the above dues immediately to avoid late fees.",
          x: 60,
          y: 480,
          w: 460,
          h: 20,
          fontSize: 11,
          bold: false,
          align: "center",
        },
        {
          id: "ds-principal",
          type: "field",
          label: "Principal: {{principalName}}",
          x: 340,
          y: 530,
          w: 180,
          h: 20,
          fontSize: 12,
          bold: true,
          align: "center",
        },
        {
          id: "ds-signline",
          type: "text",
          label: "____________________________",
          x: 340,
          y: 555,
          w: 180,
          h: 16,
          fontSize: 12,
          bold: false,
          align: "center",
        },
        {
          id: "ds-signtitle",
          type: "text",
          label: "Signature & Stamp",
          x: 340,
          y: 574,
          w: 180,
          h: 16,
          fontSize: 10,
          bold: false,
          align: "center",
        },
      ],
      paperSize: "A4",
    }),
    thumbnail: "",
    createdBy: "system",
    updatedAt: 0,
  },
];

function parseCanvas(elementsJson: string): CanvasState {
  try {
    const parsed = JSON.parse(elementsJson) as {
      elements?: DesignElement[];
      paperSize?: string;
      customW?: number;
      customH?: number;
    };
    return {
      elements: parsed.elements ?? [],
      paperSize: (parsed.paperSize ?? "A4") as PaperSize,
      customW: parsed.customW,
      customH: parsed.customH,
    };
  } catch {
    return { elements: [], paperSize: "A4" };
  }
}

function getPaperDims(
  paperSize: PaperSize,
  customW?: number,
  customH?: number,
): { w: number; h: number } {
  const preset = PAPER_SIZES.find((p) => p.value === paperSize);
  if (paperSize === "Custom") return { w: customW ?? 595, h: customH ?? 420 };
  return preset ? { w: preset.w, h: preset.h } : { w: 595, h: 842 };
}

// ─── Draggable Canvas Element ─────────────────────────────────────────────────
function DraggableElement({
  el,
  isSelected,
  onSelect,
  onMove,
}: {
  el: DesignElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, nx: number, ny: number) => void;
}) {
  const dragStart = useRef<{
    mx: number;
    my: number;
    ox: number;
    oy: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStart.current = { mx: e.clientX, my: e.clientY, ox: el.x, oy: el.y };
      onSelect(el.id);
    },
    [el.id, el.x, el.y, onSelect],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      onMove(el.id, dragStart.current.ox + dx, dragStart.current.oy + dy);
    },
    [el.id, onMove],
  );

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
  }, []);

  return (
    <button
      type="button"
      aria-label={`Element: ${el.label}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute rounded border-2 cursor-grab active:cursor-grabbing transition-colors select-none touch-none ${
        isSelected
          ? "border-primary shadow-md shadow-primary/20"
          : "border-dashed border-border hover:border-primary/50"
      }`}
      style={{
        left: el.x,
        top: el.y,
        width: el.w,
        height: el.h,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <span
        className={`text-xs p-1 block text-foreground truncate
          ${el.align === "center" ? "text-center" : "text-left"}
          ${el.bold ? "font-bold" : ""}
          ${el.italic ? "italic" : ""}`}
        style={{ fontSize: `${el.fontSize ?? 12}px` }}
      >
        {el.label}
      </span>
      {isSelected && (
        <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-primary block" />
      )}
    </button>
  );
}

// ─── Design Canvas ────────────────────────────────────────────────────────────
function DesignCanvas({
  elements,
  selected,
  onSelect,
  onMove,
  paperSize,
  customW,
  customH,
}: {
  elements: DesignElement[];
  selected: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, nx: number, ny: number) => void;
  paperSize: PaperSize;
  customW?: number;
  customH?: number;
}) {
  const dims = getPaperDims(paperSize, customW, customH);

  return (
    <div
      className="relative bg-white border border-border rounded-lg shadow-md overflow-hidden"
      style={{ width: dims.w, height: dims.h, minWidth: dims.w }}
      data-ocid="cert_studio.canvas_target"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <p className="text-6xl font-bold text-foreground rotate-45">
          SHUBH SCHOOL
        </p>
      </div>
      <div className="bg-primary/10 border-b border-primary/20 px-8 py-4 flex items-center gap-4">
        <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center">
          <GalleryVerticalEnd className="size-7 text-primary" />
        </div>
        <div>
          <p className="font-display font-bold text-foreground text-lg">
            SHUBH PUBLIC SCHOOL
          </p>
          <p className="text-xs text-muted-foreground">
            Excellence in Education | Estd. 2001
          </p>
        </div>
      </div>
      <div className="absolute inset-0 top-[88px]">
        {elements.map((el) => (
          <DraggableElement
            key={el.id}
            el={el}
            isSelected={selected === el.id}
            onSelect={onSelect}
            onMove={(id, nx, ny) => onMove(id, nx, ny)}
          />
        ))}
        {elements.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-20 text-center pointer-events-none">
            <Layers className="size-12 text-muted-foreground/20 mb-3" />
            <p className="text-muted-foreground text-sm">
              Click element types on the left to add them
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Then drag to reposition
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CertificateStudioPage() {
  const { data: backendTemplates = [] } = useCertificateTemplates();
  const saveTemplate = useSaveCertificateTemplate();
  const deleteTemplate = useDeleteCertificateTemplate();
  const setDefaultMutation = useSetDefaultCertificateTemplate();

  // URL param context (from modules linking here to edit a specific template type)
  const urlParams = new URLSearchParams(window.location.search);
  const urlType = urlParams.get("type") as CertificateType | null;
  const returnTo = urlParams.get("returnTo") ?? null;

  const [view, setView] = useState<"library" | "editor">("library");
  const [selectedType, setSelectedType] = useState<CertificateType>(
    urlType ?? "IDCard",
  );
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [customW, setCustomW] = useState(595);
  const [customH, setCustomH] = useState(420);
  const [selectedEl, setSelectedEl] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState("12");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [savedJson, setSavedJson] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [generateTemplate, setGenerateTemplate] =
    useState<CertificateTemplateBackend | null>(null);
  const [importConfirmElements, setImportConfirmElements] = useState<
    DesignElement[] | null
  >(null);
  const [expandedFieldCategories, setExpandedFieldCategories] = useState<
    Record<string, boolean>
  >({ Student: true });
  const importInputRef = useRef<HTMLInputElement>(null);

  // Merge: saved backend templates first, then built-in for any missing types
  const allTemplates: CertificateTemplateBackend[] = (() => {
    const savedIds = new Set(backendTemplates.map((t) => t.id));
    const builtInToShow = BUILT_IN_TEMPLATES.filter(
      (bi) => !savedIds.has(bi.id),
    );
    return [...backendTemplates, ...builtInToShow];
  })();

  const typeTemplates = allTemplates.filter(
    (t) => t.templateType === selectedType,
  );
  const activeTemplate = allTemplates.find((t) => t.id === activeTemplateId);

  useEffect(() => {
    if (!activeTemplate) return;
    const ejson = activeTemplate.elementsJson;
    const state = parseCanvas(ejson);
    setElements(state.elements);
    setPaperSize(state.paperSize);
    if (state.customW) setCustomW(state.customW);
    if (state.customH) setCustomH(state.customH);
    setTemplateName(activeTemplate.name);
    setSavedJson(ejson);
    setSelectedEl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplate]);

  const currentJson = JSON.stringify({ elements, paperSize, customW, customH });
  const hasUnsaved = currentJson !== savedJson;

  // Auto-open editor for the correct type when launched from a module
  // biome-ignore lint/correctness/useExhaustiveDependencies: one-time init on urlType
  useEffect(() => {
    if (!urlType) return;
    const all = [
      ...backendTemplates,
      ...BUILT_IN_TEMPLATES.filter(
        (bi) => !backendTemplates.some((b) => b.id === bi.id),
      ),
    ];
    const first = all.find((t) => t.templateType === urlType);
    if (first) {
      setActiveTemplateId(first.id);
      setView("editor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlType, backendTemplates.length]);

  function openEditor(template: CertificateTemplateBackend) {
    setSelectedType(template.templateType as CertificateType);
    setActiveTemplateId(template.id);
    setView("editor");
  }

  function addElement(type: DesignElement["type"], label: string) {
    const el: DesignElement = {
      id: generateId(),
      type,
      label,
      x: 60 + Math.random() * 40,
      y: 20 + elements.length * 40,
      w: type === "qr" ? 80 : type === "table" ? 300 : 200,
      h: type === "qr" ? 80 : type === "table" ? 120 : 32,
      fontSize: Number(fontSize),
      bold: isBold,
      italic: isItalic,
      align: "left",
    };
    setElements((p) => [...p, el]);
    setSelectedEl(el.id);
  }

  function moveElement(id: string, nx: number, ny: number) {
    setElements((p) =>
      p.map((el) =>
        el.id === id ? { ...el, x: Math.max(0, nx), y: Math.max(0, ny) } : el,
      ),
    );
  }

  function deleteElement(id: string) {
    setElements((p) => p.filter((e) => e.id !== id));
    setSelectedEl(null);
  }

  async function handleSave() {
    if (!activeTemplate) return;
    const ejson = JSON.stringify({ elements, paperSize, customW, customH });
    const payload: CertificateTemplateBackend = {
      ...activeTemplate,
      name: templateName || activeTemplate.name,
      elementsJson: ejson,
      updatedAt: Date.now(),
    };
    try {
      await saveTemplate.mutateAsync(payload);
      setSavedJson(ejson);
      toast.success("Template saved successfully");
    } catch {
      toast.error("Failed to save template");
    }
  }

  async function handleSaveAndApply() {
    if (!activeTemplate) return;
    const ejson = JSON.stringify({ elements, paperSize, customW, customH });
    const payload: CertificateTemplateBackend = {
      ...activeTemplate,
      isDefault: true,
      name: templateName || activeTemplate.name,
      elementsJson: ejson,
      updatedAt: Date.now(),
    };
    try {
      await saveTemplate.mutateAsync(payload);
      setSavedJson(ejson);
      const typeLabel =
        CERT_TYPES.find((c) => c.type === selectedType)?.label ?? "template";
      toast.success(
        `Template saved — ${typeLabel} now uses your custom design`,
      );
      if (returnTo) {
        setTimeout(() => {
          window.location.href = returnTo;
        }, 900);
      }
    } catch {
      toast.error("Failed to save template");
    }
  }

  async function handleSetDefault(id: string, templateType: string) {
    try {
      await setDefaultMutation.mutateAsync({ id, templateType });
      toast.success("Set as default template");
    } catch {
      toast.error("Failed to set default");
    }
  }

  async function handleDelete(id: string) {
    // Don't delete built-in templates
    if (id.startsWith("bi-")) {
      toast.error("Built-in templates cannot be deleted");
      return;
    }
    try {
      await deleteTemplate.mutateAsync(id);
      if (activeTemplateId === id) {
        const remaining = typeTemplates.filter((t) => t.id !== id);
        setActiveTemplateId(remaining[0]?.id ?? null);
      }
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  }

  function addNewTemplate() {
    const typeLabel =
      CERT_TYPES.find((c) => c.type === selectedType)?.label ?? "";
    // Default paper size per template type
    const defaultPaperSize: PaperSize =
      selectedType === "FeeReceipt" || selectedType === "DemandSlip"
        ? "Quarter-Page"
        : selectedType === "IDCard"
          ? "Quarter-Page"
          : "A4";
    const t: CertificateTemplateBackend = {
      id: generateId(),
      name: `New ${typeLabel} Template`,
      templateType: selectedType,
      isDefault: false,
      elementsJson: JSON.stringify({
        elements: [],
        paperSize: defaultPaperSize,
        customW: 595,
        customH: 420,
      }),
      thumbnail: "",
      createdBy: "admin",
      updatedAt: Date.now(),
    };
    saveTemplate.mutate(t);
    setActiveTemplateId(t.id);
    setElements([]);
    setPaperSize(defaultPaperSize);
    setTemplateName(t.name);
    setSavedJson(t.elementsJson);
    setView("editor");
  }

  function exportTemplate() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const safeName = (activeTemplate?.name ?? "export")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase();
    const data = JSON.stringify(
      {
        ...activeTemplate,
        elementsJson: JSON.stringify({ elements, paperSize, customW, customH }),
      },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template-${safeName}-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = evt.target?.result as string;
        const parsed = JSON.parse(raw) as {
          elementsJson?: string;
          elements?: DesignElement[];
        };
        let importedElements: DesignElement[] = [];
        if (parsed.elementsJson) {
          const inner = JSON.parse(parsed.elementsJson) as {
            elements?: DesignElement[];
          };
          importedElements = inner.elements ?? [];
        } else if (Array.isArray(parsed.elements)) {
          importedElements = parsed.elements;
        }
        if (importedElements.length === 0) {
          toast.error("No elements found in the imported JSON file");
          return;
        }
        setImportConfirmElements(importedElements);
      } catch {
        toast.error("Invalid JSON file — could not parse template");
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = "";
  }

  function confirmImport() {
    if (!importConfirmElements) return;
    setElements(importConfirmElements);
    setSelectedEl(null);
    setImportConfirmElements(null);
    toast.success(`Imported ${importConfirmElements.length} elements`);
  }

  function toggleFieldCategory(label: string) {
    setExpandedFieldCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }

  const ELEMENT_BUTTONS: {
    type: DesignElement["type"];
    icon: typeof Type;
    label: string;
  }[] = [
    { type: "text", icon: Type, label: "Text Block" },
    { type: "field", icon: AlignLeft, label: "Data Field" },
    { type: "image", icon: Image, label: "Image" },
    { type: "qr", icon: QrCode, label: "QR Code" },
    { type: "table", icon: Table, label: "Table" },
  ];

  const selectedElem = elements.find((e) => e.id === selectedEl);

  return (
    <div className="p-6 space-y-5" data-ocid="cert_studio.page">
      {/* Return-to context banner */}
      {returnTo && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <CheckCircle className="size-4 text-emerald-600 shrink-0" />
          <span className="text-sm text-emerald-800">
            Editing template for{" "}
            <strong>
              {CERT_TYPES.find((c) => c.type === selectedType)?.label ??
                urlType}
            </strong>{" "}
            — Use <strong>Save &amp; Apply</strong> to save and return.
          </span>
          <button
            type="button"
            onClick={() => {
              window.location.href = returnTo;
            }}
            className="ml-auto text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline underline-offset-2"
            data-ocid="cert_studio.return_without_save.button"
          >
            <ArrowLeft className="size-3" /> Back without saving
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GalleryVerticalEnd className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-foreground">
                Certificate Studio
              </h1>
              {view === "editor" && hasUnsaved && (
                <Badge
                  variant="outline"
                  className="text-xs border-amber-400 text-amber-600"
                  data-ocid="cert_studio.unsaved_badge"
                >
                  Unsaved changes
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {view === "library"
                ? "Pre-designed templates & saved designs"
                : "Drag-and-drop certificate designer"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={view === "library" ? "default" : "outline"}
            onClick={() => setView("library")}
            data-ocid="cert_studio.view_library.button"
          >
            <GridIcon className="size-4 mr-2" />
            Template Library
          </Button>
          <Button
            variant={view === "editor" ? "default" : "outline"}
            onClick={() => {
              setView("editor");
              if (!activeTemplateId) addNewTemplate();
            }}
            data-ocid="cert_studio.view_editor.button"
          >
            <Layers className="size-4 mr-2" />
            Design Editor
          </Button>
          {view === "editor" && (
            <>
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
                aria-label="Import template JSON"
              />
              <Button
                variant="outline"
                onClick={() => importInputRef.current?.click()}
                data-ocid="cert_studio.import.button"
              >
                <Upload className="size-4 mr-2" />
                Import JSON
              </Button>
              <Button
                variant="outline"
                onClick={exportTemplate}
                data-ocid="cert_studio.export.button"
              >
                <Download className="size-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                data-ocid="cert_studio.print.button"
              >
                <Printer className="size-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveTemplate.isPending}
                data-ocid="cert_studio.save.button"
                className={hasUnsaved ? "ring-2 ring-amber-400/40" : ""}
              >
                <Save className="size-4 mr-2" />
                {saveTemplate.isPending ? "Saving…" : "Save Template"}
              </Button>
              {returnTo && (
                <Button
                  onClick={handleSaveAndApply}
                  disabled={saveTemplate.isPending}
                  data-ocid="cert_studio.save_apply.button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <CheckCircle className="size-4" />
                  Save &amp; Apply
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {CERT_TYPES.map((ct) => {
          const ctTemplates = allTemplates.filter(
            (t) => t.templateType === ct.type,
          );
          const hasDefault = ctTemplates.some((t) => t.isDefault);
          return (
            <button
              type="button"
              key={ct.type}
              onClick={() => {
                setSelectedType(ct.type);
                if (view === "editor") {
                  const first = allTemplates.find(
                    (t) => t.templateType === ct.type,
                  );
                  setActiveTemplateId(first?.id ?? null);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedType === ct.type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-ocid={`cert_studio.type.${ct.type.toLowerCase()}`}
            >
              {ct.label}
              {hasDefault && (
                <Star
                  className={`size-3 flex-shrink-0 ${
                    selectedType === ct.type
                      ? "text-yellow-300"
                      : "text-amber-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── LIBRARY VIEW ───────────────────────────────────────────────────── */}
      {view === "library" && (
        <div data-ocid="cert_studio.library.section">
          {/* 8-type category grid with Edit Design + Set as Default */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
            {CERT_TYPES.map((ct) => {
              const ctTemplates = allTemplates.filter(
                (t) => t.templateType === ct.type,
              );
              const defaultTpl =
                ctTemplates.find((t) => t.isDefault) ?? ctTemplates[0] ?? null;
              const isActive = selectedType === ct.type;
              return (
                <button
                  type="button"
                  key={ct.type}
                  className={`w-full text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                  data-ocid={`cert_studio.category.${ct.type.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      {ct.label}
                      {defaultTpl?.isDefault && (
                        <Star className="size-3 fill-amber-500 text-amber-500 shrink-0" />
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {ctTemplates.length}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      className="h-6 text-[10px] px-2 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(ct.type);
                        if (defaultTpl) openEditor(defaultTpl);
                        else {
                          setSelectedType(ct.type);
                          setTimeout(addNewTemplate, 0);
                        }
                      }}
                      data-ocid={`cert_studio.edit_design.${ct.type.toLowerCase()}`}
                    >
                      Edit Design
                    </Button>
                    {defaultTpl && !defaultTpl.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] px-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(
                            defaultTpl.id,
                            defaultTpl.templateType,
                          );
                        }}
                        data-ocid={`cert_studio.set_default.${ct.type.toLowerCase()}`}
                      >
                        <Star className="size-2.5" />
                      </Button>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {CERT_TYPES.find((c) => c.type === selectedType)?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {
                  allTemplates.filter((t) => t.templateType === selectedType)
                    .length
                }{" "}
                templates · Click <strong>Edit</strong> to customize or{" "}
                <strong>Print</strong> to generate
              </p>
              {allTemplates.some(
                (t) => t.templateType === selectedType && t.isDefault,
              ) && (
                <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  Default for{" "}
                  <strong>
                    {CERT_TYPES.find((c) => c.type === selectedType)?.label}
                  </strong>{" "}
                  printing is set
                </p>
              )}
            </div>
            <Button
              size="sm"
              onClick={addNewTemplate}
              data-ocid="cert_studio.add_template.button"
            >
              <Plus className="size-4 mr-1" />
              New Template
            </Button>
          </div>
          <TemplateLibrary
            templates={allTemplates}
            activeType={selectedType}
            onEdit={openEditor}
            onGenerate={(t) => setGenerateTemplate(t)}
            onDelete={handleDelete}
            onSetDefault={(id, type) => handleSetDefault(id, type)}
          />
        </div>
      )}

      {/* ── EDITOR VIEW ──────────────────────────────────────────────────── */}
      {view === "editor" && (
        <div className="flex gap-4">
          {/* Template List Sidebar */}
          <div className="w-52 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground text-sm">
                Templates
              </h3>
              <Button
                size="icon"
                variant="ghost"
                className="size-6"
                onClick={addNewTemplate}
                data-ocid="cert_studio.add_template_editor.button"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            <div className="space-y-1">
              {typeTemplates.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setActiveTemplateId(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTemplateId === t.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                  data-ocid={`cert_studio.template.${t.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{t.name}</span>
                    {t.isDefault && (
                      <Star className="size-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {parseCanvas(t.elementsJson).paperSize}
                  </p>
                </button>
              ))}
              {typeTemplates.length === 0 && (
                <p
                  className="text-xs text-muted-foreground text-center py-4"
                  data-ocid="cert_studio.templates.empty_state"
                >
                  No templates yet
                </p>
              )}
            </div>
            {activeTemplateId && (
              <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Template Name
                </p>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Template name"
                  data-ocid="cert_studio.template_name.input"
                />
                <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">
                  Actions
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7"
                  onClick={() =>
                    handleSetDefault(activeTemplateId, selectedType)
                  }
                  disabled={setDefaultMutation.isPending}
                  data-ocid="cert_studio.set_default.button"
                >
                  <Star className="size-3 mr-1" />
                  Set as Default
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(activeTemplateId)}
                  disabled={deleteTemplate.isPending}
                  data-ocid="cert_studio.delete_template.button"
                >
                  <Trash2 className="size-3 mr-1" />
                  Delete Template
                </Button>
              </div>
            )}
          </div>

          {/* Canvas + Tools */}
          <div className="flex gap-4 flex-1 min-w-0 overflow-x-auto">
            {/* Left Tools */}
            <div className="w-48 flex-shrink-0 space-y-4">
              <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Add Elements
                </p>
                {ELEMENT_BUTTONS.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => addElement(type, label)}
                    data-ocid={`cert_studio.add_${type}.button`}
                  >
                    <Icon className="size-3.5 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Typography
                </p>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger
                    className="h-7 text-xs"
                    data-ocid="cert_studio.font.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((f) => (
                      <SelectItem key={f} value={f} className="text-xs">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1 items-center">
                  <Input
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="h-7 text-xs w-14"
                    placeholder="12"
                  />
                  <Button
                    size="icon"
                    variant={isBold ? "default" : "outline"}
                    className="size-7"
                    onClick={() => setIsBold((v) => !v)}
                    aria-label="Bold"
                  >
                    <Bold className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant={isItalic ? "default" : "outline"}
                    className="size-7"
                    onClick={() => setIsItalic((v) => !v)}
                    aria-label="Italic"
                  >
                    <Italic className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    aria-label="Center align"
                    onClick={() => {
                      if (selectedEl) {
                        setElements((p) =>
                          p.map((el) =>
                            el.id === selectedEl
                              ? {
                                  ...el,
                                  align:
                                    el.align === "center" ? "left" : "center",
                                }
                              : el,
                          ),
                        );
                      }
                    }}
                  >
                    <AlignCenter className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Page Size
                </p>
                <Select
                  value={paperSize}
                  onValueChange={(v) => setPaperSize(v as PaperSize)}
                >
                  <SelectTrigger
                    className="h-7 text-xs"
                    data-ocid="cert_studio.paper_size.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAPER_SIZES.map((s) => (
                      <SelectItem
                        key={s.value}
                        value={s.value}
                        className="text-xs"
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {paperSize === "Custom" && (
                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      value={customW}
                      onChange={(e) => setCustomW(Number(e.target.value))}
                      className="h-7 text-xs w-16"
                      placeholder="Width px"
                    />
                    <span className="text-xs text-muted-foreground">×</span>
                    <Input
                      type="number"
                      value={customH}
                      onChange={(e) => setCustomH(Number(e.target.value))}
                      className="h-7 text-xs w-16"
                      placeholder="Height px"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                  data-ocid="cert_studio.bg_image.upload_button"
                >
                  <Image className="size-3.5 mr-2" />
                  Background Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                  data-ocid="cert_studio.fullscreen.button"
                >
                  <Maximize2 className="size-3.5 mr-2" />
                  Fullscreen
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Data Fields
                </p>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {FIELD_CATEGORIES.map((cat) => (
                    <div key={cat.label}>
                      <button
                        type="button"
                        onClick={() => toggleFieldCategory(cat.label)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-foreground px-1 py-1 rounded hover:bg-muted/40 transition-colors"
                        data-ocid={`cert_studio.field_category.${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <span>{cat.label}</span>
                        {expandedFieldCategories[cat.label] ? (
                          <ChevronDown className="size-3" />
                        ) : (
                          <ChevronRight className="size-3" />
                        )}
                      </button>
                      {expandedFieldCategories[cat.label] && (
                        <div className="ml-1 space-y-0.5">
                          {cat.fields.map((f) => (
                            <button
                              type="button"
                              key={f.token}
                              onClick={() => addElement("field", f.token)}
                              title={f.desc}
                              className="w-full text-left text-xs px-2 py-0.5 rounded hover:bg-muted/50 text-muted-foreground font-mono transition-colors"
                              data-ocid={`cert_studio.field.${f.token.replace(/[{}]/g, "").replace(/_/g, "-")}`}
                            >
                              {f.token}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {activeTemplate?.name ?? "No template selected"}
                  </p>
                  {activeTemplate?.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="size-3 mr-1 text-amber-500" />
                      Default for{" "}
                      {CERT_TYPES.find((c) => c.type === selectedType)?.label}
                    </Badge>
                  )}
                  {activeTemplate && !activeTemplate.isDefault && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                      onClick={() =>
                        handleSetDefault(activeTemplate.id, selectedType)
                      }
                      data-ocid="cert_studio.set_default_inline.button"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <p>
                    {elements.length} element{elements.length !== 1 ? "s" : ""}
                  </p>
                  <span>·</span>
                  <p>
                    {paperSize}
                    {paperSize === "Custom" ? ` ${customW}×${customH}px` : ""}
                  </p>
                </div>
              </div>
              <div
                className="overflow-auto bg-muted/20 rounded-xl p-4 border border-border"
                style={{ maxHeight: "880px" }}
              >
                <DesignCanvas
                  elements={elements}
                  selected={selectedEl}
                  onSelect={setSelectedEl}
                  onMove={moveElement}
                  paperSize={paperSize}
                  customW={customW}
                  customH={customH}
                />
              </div>

              {selectedElem && (
                <div
                  className="mt-3 rounded-xl border border-border bg-card p-3 flex items-center gap-3 flex-wrap"
                  data-ocid="cert_studio.element_controls.panel"
                >
                  <div className="flex-1 min-w-32">
                    <Label className="text-xs">Label / Content</Label>
                    <Input
                      value={selectedElem.label}
                      onChange={(e) =>
                        setElements((p) =>
                          p.map((el) =>
                            el.id === selectedElem.id
                              ? { ...el, label: e.target.value }
                              : el,
                          ),
                        )
                      }
                      className="h-7 mt-0.5 text-xs"
                      data-ocid="cert_studio.element_label.input"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElem.x)}
                      onChange={(e) =>
                        setElements((p) =>
                          p.map((el) =>
                            el.id === selectedElem.id
                              ? { ...el, x: Number(e.target.value) }
                              : el,
                          ),
                        )
                      }
                      className="h-7 w-16 text-xs"
                    />
                    <Label className="text-xs">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedElem.y)}
                      onChange={(e) =>
                        setElements((p) =>
                          p.map((el) =>
                            el.id === selectedElem.id
                              ? { ...el, y: Number(e.target.value) }
                              : el,
                          ),
                        )
                      }
                      className="h-7 w-16 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Size</Label>
                    <Input
                      type="number"
                      value={selectedElem.fontSize ?? 12}
                      onChange={(e) =>
                        setElements((p) =>
                          p.map((el) =>
                            el.id === selectedElem.id
                              ? { ...el, fontSize: Number(e.target.value) }
                              : el,
                          ),
                        )
                      }
                      className="h-7 w-16 text-xs"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs"
                    onClick={() => deleteElement(selectedElem.id)}
                    data-ocid="cert_studio.delete_element.button"
                  >
                    <Trash2 className="size-3 mr-1" />
                    Remove
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Drag elements on the canvas to reposition · Save to persist
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate & Print Modal */}
      <GeneratePrintModal
        template={generateTemplate}
        onClose={() => setGenerateTemplate(null)}
      />

      {/* Import Confirmation Modal */}
      {importConfirmElements && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          data-ocid="cert_studio.import_confirm.dialog"
        >
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 w-[400px] max-w-full mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Upload className="size-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Import Template Design
                </h3>
                <p className="text-sm text-muted-foreground">
                  {importConfirmElements.length} elements found
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground">
              This will <strong>replace the current template design</strong>{" "}
              with the imported elements. This action cannot be undone until you
              save.
            </p>
            <p className="text-xs text-muted-foreground">
              Tip: Save your current template first if you want to keep it.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setImportConfirmElements(null)}
                data-ocid="cert_studio.import_confirm.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmImport}
                data-ocid="cert_studio.import_confirm.confirm_button"
              >
                <Upload className="size-4 mr-2" />
                Import & Replace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
