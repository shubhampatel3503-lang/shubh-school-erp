/**
 * Typed API wrapper around the backend actor.
 * The backend.d.ts is currently empty (bindgen will be re-run after backend is complete).
 * All functions are defined here and will be wired to real actor calls once available.
 */

import type {
  SchoolInfo, AppSettings, AcademicSession, Section, Subject, SyllabusChapter,
  Student, FeeHeading, FeePlan, FeePayment,
  AttendanceRecord, AttendanceSummary,
  ExamTimetable, ExamResult, OnlineExam, ExamSubmission,
  Staff, SubjectAssignment, PayrollRecord,
  TransportRoute, PickupPoint,
  Notification,
  Book, BookIssue,
  InventoryItem, InventoryTransaction,
  UserAccount, AuditLog,
  ExpenseHead, ExpenseEntry,
  HomeworkEntry, HomeworkSubmission,
  AlumniRecord,
  ChatRoom, ChatMessage,
  VirtualClass,
  CertificateTemplate,
  ClassLevel,
} from "@/types";

// ─── Actor accessor ───────────────────────────────────────────────────────────
// useActor is provided by the core infrastructure
// These functions expect the actor to be passed from the hook layer

// ─── School Info ──────────────────────────────────────────────────────────────
export const defaultSchoolInfo: SchoolInfo = {
  name: "SHUBH SCHOOL ERP",
  tagline: "Empowering Education, Enriching Lives",
  about: "A premier educational institution committed to excellence in academics, character building, and holistic development of students.",
  photoUrl: "/assets/generated/school-hero.dim_1200x600.jpg",
  address: "123 Education Lane, Knowledge City, India - 110001",
  phone: "+91 98765 43210",
  email: "info@shubhschool.edu.in",
};

export const defaultSettings: AppSettings = {
  whatsappApiKey: "",
  whatsappApiUrl: "",
  whatsappPhoneNumberId: "",
  razorpayEnabled: false,
  razorpayKeyId: "",
  payuEnabled: false,
  gpayEnabled: true,
  gpayUpiId: "school@upi",
  theme: "navy-gold",
  dashboardBgUrl: "",
  activeSessionId: "2025-26",
};

// ─── Fallback sample data (used when backend has no data yet) ─────────────────
export const sampleStudents: Student[] = [
  {
    id: "s1", admNo: "2025001", fullName: "Aarav Sharma", fatherName: "Rajesh Sharma",
    motherName: "Sunita Sharma", fatherMobile: "9876543210", motherMobile: "9876543211",
    mobile: "9876500001",
    currentAddress: "12 MG Road, Shahdara, Delhi - 110032", permanentAddress: "Shahdara",
    category: "General", aadhaarNo: "1234 5678 9012", srNo: "SR-2025-001",
    penNo: "PEN12345001", apaarNo: "APAAR2025001", prevSchool: "Delhi Public School",
    admissionDate: "2025-04-01", busNo: "DL-01-AB-1234",
    classLevel: "Class5", sectionId: "sec1", sessionId: "2025-26",
    dateOfBirth: "2015-04-12", gender: "Male", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: "r1", pickupPointId: "pp1", createdAt: "2025-04-01",
  },
  {
    id: "s2", admNo: "2025002", fullName: "Priya Verma", fatherName: "Suresh Verma",
    motherName: "Anita Verma", fatherMobile: "9876543220", motherMobile: "9876543221",
    mobile: "",
    currentAddress: "45 Lajpat Nagar, South Delhi - 110024", permanentAddress: "Lajpat Nagar",
    category: "OBC", aadhaarNo: "2345 6789 0123", srNo: "SR-2025-002",
    penNo: "PEN12345002", apaarNo: "APAAR2025002", prevSchool: "Ryan International School",
    admissionDate: "2025-04-01", busNo: "",
    classLevel: "Class5", sectionId: "sec1", sessionId: "2025-26",
    dateOfBirth: "2015-07-20", gender: "Female", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: null, pickupPointId: null, createdAt: "2025-04-01",
  },
  {
    id: "s3", admNo: "2025003", fullName: "Rohit Kumar", fatherName: "Vikram Kumar",
    motherName: "Meera Kumar", fatherMobile: "9876543230", motherMobile: "9876543231",
    mobile: "9876500003",
    currentAddress: "78 Saket, South Delhi - 110017", permanentAddress: "Saket",
    category: "SC", aadhaarNo: "3456 7890 1234", srNo: "SR-2025-003",
    penNo: "PEN12345003", apaarNo: "APAAR2025003", prevSchool: "Kendriya Vidyalaya",
    admissionDate: "2025-04-01", busNo: "DL-01-AB-1234",
    classLevel: "Class8", sectionId: "sec2", sessionId: "2025-26",
    dateOfBirth: "2012-11-05", gender: "Male", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: "r1", pickupPointId: "pp2", createdAt: "2025-04-01",
  },
  {
    id: "s4", admNo: "2025004", fullName: "Sneha Patel", fatherName: "Dinesh Patel",
    motherName: "Rekha Patel", fatherMobile: "9876543240", motherMobile: "9876543241",
    mobile: "",
    currentAddress: "23 Dwarka Sector 12, West Delhi - 110078", permanentAddress: "Dwarka",
    category: "General", aadhaarNo: "4567 8901 2345", srNo: "SR-2025-004",
    penNo: "PEN12345004", apaarNo: "APAAR2025004", prevSchool: "Modern School",
    admissionDate: "2025-04-01", busNo: "DL-01-CD-5678",
    classLevel: "Class10", sectionId: "sec3", sessionId: "2025-26",
    dateOfBirth: "2010-01-15", gender: "Female", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: "r2", pickupPointId: "pp3", createdAt: "2025-04-01",
  },
  {
    id: "s5", admNo: "2025005", fullName: "Arjun Singh", fatherName: "Balvinder Singh",
    motherName: "Harpreet Singh", fatherMobile: "9876543250", motherMobile: "9876543251",
    mobile: "",
    currentAddress: "90 Rohini Sector 5, North Delhi - 110085", permanentAddress: "Rohini",
    category: "OBC", aadhaarNo: "5678 9012 3456", srNo: "SR-2025-005",
    penNo: "PEN12345005", apaarNo: "APAAR2025005", prevSchool: "",
    admissionDate: "2025-04-01", busNo: "",
    classLevel: "LKG", sectionId: "sec4", sessionId: "2025-26",
    dateOfBirth: "2021-04-27", gender: "Male", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: null, pickupPointId: null, createdAt: "2025-04-01",
  },
  {
    id: "s6", admNo: "2025006", fullName: "Kavya Singh", fatherName: "Balvinder Singh",
    motherName: "Harpreet Singh", fatherMobile: "9876543250", motherMobile: "9876543251",
    mobile: "",
    currentAddress: "90 Rohini Sector 5, North Delhi - 110085", permanentAddress: "Rohini",
    category: "OBC", aadhaarNo: "5678 9012 3457", srNo: "SR-2025-006",
    penNo: "PEN12345006", apaarNo: "APAAR2025006", prevSchool: "",
    admissionDate: "2025-04-01", busNo: "",
    classLevel: "Class5", sectionId: "sec1", sessionId: "2025-26",
    dateOfBirth: "2018-09-10", gender: "Female", photoUrl: "", isDiscontinued: false,
    discontinuedAt: null, transportRouteId: null, pickupPointId: null, createdAt: "2025-04-01",
  },
];

export const sampleStaff: Staff[] = [
  {
    id: "st1", staffCode: "TCH001", fullName: "Kavita Mishra", designation: "Senior Teacher",
    department: "Science", mobile: "9911223344", email: "kavita@shubh.edu.in",
    address: "34 Teachers Colony, Delhi", dateOfJoining: "2018-04-01", dateOfBirth: "1985-06-15",
    gender: "Female", photoUrl: "", basicSalary: 45000, isActive: true,
  },
  {
    id: "st2", staffCode: "TCH002", fullName: "Ramesh Gupta", designation: "TGT Mathematics",
    department: "Mathematics", mobile: "9922334455", email: "ramesh@shubh.edu.in",
    address: "56 Civil Lines, Delhi", dateOfJoining: "2019-07-01", dateOfBirth: "1979-03-22",
    gender: "Male", photoUrl: "", basicSalary: 40000, isActive: true,
  },
  {
    id: "st3", staffCode: "ADM001", fullName: "Sunita Agarwal", designation: "Accountant",
    department: "Administration", mobile: "9933445566", email: "sunita@shubh.edu.in",
    address: "12 Connaught Place, Delhi", dateOfJoining: "2020-04-01", dateOfBirth: "1990-08-10",
    gender: "Female", photoUrl: "", basicSalary: 35000, isActive: true,
  },
];

export const sampleFeeHeadings: FeeHeading[] = [
  { id: "fh1", name: "Tuition Fee", description: "Monthly tuition charges", isActive: true },
  { id: "fh2", name: "Exam Fee", description: "Examination charges", isActive: true },
  { id: "fh3", name: "Development Fee", description: "School development fund", isActive: true },
  { id: "fh4", name: "Computer Fee", description: "Computer lab charges", isActive: true },
  { id: "fh5", name: "Transport Fee", description: "Bus transport charges", isActive: true },
];

export const sampleSections: Section[] = [
  { id: "sec1", classLevel: "Class5", name: "A", sessionId: "2025-26", capacity: 40 },
  { id: "sec2", classLevel: "Class8", name: "A", sessionId: "2025-26", capacity: 40 },
  { id: "sec3", classLevel: "Class10", name: "A", sessionId: "2025-26", capacity: 40 },
  { id: "sec4", classLevel: "LKG", name: "A", sessionId: "2025-26", capacity: 30 },
];

export const sampleRoutes: TransportRoute[] = [
  { id: "r1", name: "Route A - North Delhi", busNumber: "DL01AB1234", driverName: "Mohinder Singh", driverMobile: "9988776655", isActive: true },
  { id: "r2", name: "Route B - South Delhi", busNumber: "DL01CD5678", driverName: "Sukhbir Yadav", driverMobile: "9977665544", isActive: true },
];

// ─── Type exports for re-use across the app ──────────────────────────────────
export type {
  SchoolInfo, AppSettings, AcademicSession, Section, Subject, SyllabusChapter,
  Student, FeeHeading, FeePlan, FeePayment,
  AttendanceRecord, AttendanceSummary,
  ExamTimetable, ExamResult, OnlineExam, ExamSubmission,
  Staff, SubjectAssignment, PayrollRecord,
  TransportRoute, PickupPoint,
  Notification,
  Book, BookIssue,
  InventoryItem, InventoryTransaction,
  UserAccount, AuditLog,
  ExpenseHead, ExpenseEntry,
  HomeworkEntry, HomeworkSubmission,
  AlumniRecord,
  ChatRoom, ChatMessage,
  VirtualClass,
  CertificateTemplate,
  ClassLevel,
};
