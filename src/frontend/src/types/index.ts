// ─── Class Levels ─────────────────────────────────────────────────────────────
export type ClassLevel =
  | "PlayWay"
  | "LKG"
  | "UKG"
  | "Class1"
  | "Class2"
  | "Class3"
  | "Class4"
  | "Class5"
  | "Class6"
  | "Class7"
  | "Class8"
  | "Class9"
  | "Class10"
  | "Class11"
  | "Class12";

export const CLASS_ORDER: ClassLevel[] = [
  "PlayWay",
  "LKG",
  "UKG",
  "Class1",
  "Class2",
  "Class3",
  "Class4",
  "Class5",
  "Class6",
  "Class7",
  "Class8",
  "Class9",
  "Class10",
  "Class11",
  "Class12",
];

export const CLASS_LABELS: Record<ClassLevel, string> = {
  PlayWay: "Play Way",
  LKG: "LKG",
  UKG: "UKG",
  Class1: "Class 1",
  Class2: "Class 2",
  Class3: "Class 3",
  Class4: "Class 4",
  Class5: "Class 5",
  Class6: "Class 6",
  Class7: "Class 7",
  Class8: "Class 8",
  Class9: "Class 9",
  Class10: "Class 10",
  Class11: "Class 11",
  Class12: "Class 12",
};

// ─── Student Promotion ──────────────────────────────────────────────────────
export interface PromotionPreviewItem {
  studentId: string;
  fullName: string;
  admNo: string;
  oldBalance: number;
  discountCount: number;
  hasTransport: boolean;
}

export interface PromotionResult {
  promoted: number;
  failed: number;
  errors: string[];
}

export interface PromotionAllBreakdown {
  className: string;
  promoted: number;
  failed: number;
  errors: string[];
}

export interface PromotionAllResult {
  totalPromoted: number;
  totalFailed: number;
  breakdown: PromotionAllBreakdown[];
}

// ─── Dashboard Stats V2 ─────────────────────────────────────────────────────
export interface DashboardStatsV2 {
  totalStudents: number;
  totalStaff: number;
  feesCollectedToday: number;
  feesCollectedThisMonth: number;
  feesCollectedThisYear: number;
  pendingFeesTotal: number;
  attendanceTodayPercent: number | null;
  attendanceTodayPresent: number | null;
  attendanceTodayTotal: number | null;
  staffAttendanceTodayPresent: number | null;
  staffAttendanceTodayTotal: number | null;
  totalClasses: number;
  totalSections: number;
  recentActivity: {
    timestamp: bigint;
    actionType: string;
    description: string;
    userName: string;
  }[];
}

// ─── School Info ──────────────────────────────────────────────────────────────
export interface SchoolInfo {
  name: string;
  tagline: string;
  about: string;
  photoUrl: string;
  address: string;
  phone: string;
  email: string;
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
export interface AcademicSession {
  id: string;
  name: string; // "2025-26"
  startYear: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
}

// ─── Sections ─────────────────────────────────────────────────────────────────
export interface Section {
  id: string;
  classLevel: ClassLevel;
  name: string; // "A", "B", etc.
  sessionId: string;
  capacity: number;
  roomNo?: string;
  teacherId?: string;
}

// ─── Subjects ─────────────────────────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  code: string;
  classLevel: ClassLevel;
  isOptional: boolean;
}

export interface SyllabusChapter {
  id: string;
  subjectId: string;
  title: string;
  chapterNo: number;
  topics: string[];
  completionPercent: number;
}

// ─── Syllabus Content (local, not stored in backend) ──────────────────────────
export type SyllabusApprovalStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected";

export interface SyllabusQAPair {
  id: string;
  question: string;
  answer: string;
}

export interface SyllabusContent {
  chapterId: string;
  contentText: string;
  /** Questions provided from the book — one per line (deprecated, use userProvidedQuestions) */
  bookQuestions?: string;
  /** Questions from the textbook entered by the teacher */
  userProvidedQuestions: string[];
  qaPairs: SyllabusQAPair[];
  status: SyllabusApprovalStatus;
  rejectionReason: string;
  submittedAt: string | null;
  approvedAt: string | null;
}

// ─── Students ─────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  admNo: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  mobile: string; // student's own mobile
  currentAddress: string;
  permanentAddress: string;
  category: string; // General / OBC / SC / ST
  aadhaarNo: string;
  srNo: string; // School Register Number
  penNo: string; // Permanent Education Number
  apaarNo: string; // Academic Bank of Credits ID
  prevSchool: string;
  admissionDate: string;
  busNo: string;
  classLevel: ClassLevel;
  sectionId: string;
  sessionId: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  photoUrl: string;
  isDiscontinued: boolean;
  discontinuedAt: string | null;
  transportRouteId: string | null;
  pickupPointId: string | null;
  createdAt: string;
}

// ─── Student Discount ─────────────────────────────────────────────────────────
export interface StudentDiscount {
  id: string;
  studentId: string;
  feeHeadingId: string;
  feeHeadingName: string;
  monthlyDiscountAmount: number;
  remarks: string;
  createdAt: string;
}

// ─── Fees ──────────────────────────────────────────────────────────────────────
export interface FeeHeading {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  applicableMonths?: string[]; // Indian academic year months this fee applies to
}

export interface FeePlan {
  id: string;
  classLevel: ClassLevel;
  sectionId: string | null;
  sessionId: string;
  feeHeadingId: string;
  monthlyAmount: number;
  applicableMonths: string[]; // ["April","May",...]
}

export type PaymentMethod = "Cash" | "UPI" | "Cheque" | "Online" | "NEFT";

export interface FeePaymentItem {
  feeHeadingId: string;
  feeHeadingName: string;
  month: string;
  amount: number;
  isOther?: boolean;
  otherDescription?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  sessionId: string;
  paymentDate: string;
  items: FeePaymentItem[];
  totalAmount: number;
  /** Total fees due at time of collection (used for balance calculation) */
  totalDue?: number;
  /** Balance remaining after payment (totalDue - totalAmount). Positive = still owed. */
  balance?: number;
  paymentMethod: PaymentMethod;
  remarks: string;
  collectedBy: string;
  createdAt: string;
}

// ─── Student Old Balance ──────────────────────────────────────────────────────
export interface StudentOldBalance {
  id: string;
  studentId: string;
  sessionId: string; // the session with outstanding balance
  amount: number;
  remarks: string;
  createdAt: string;
}

// ─── Device Attendance ────────────────────────────────────────────────────────
export type AttendanceDevice = "Face" | "RFID" | "ESSLBiometric";

export interface DeviceAttendanceRecord {
  id: number;
  studentId: string;
  studentName: string;
  classLevel: ClassLevel;
  section: string;
  admNo: string;
  deviceType: AttendanceDevice;
  inTime: string | null;
  outTime: string | null;
  date: string;
  status: "Present" | "Absent" | "Half Day";
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "HalfDay";
  sessionId: string;
}

export interface AttendanceSummary {
  classLevel: ClassLevel;
  sectionId: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

// ─── Examinations ─────────────────────────────────────────────────────────────
export interface ExamTimetable {
  id: string;
  name: string;
  sessionId: string;
  classLevel: ClassLevel;
  entries: ExamTimetableEntry[];
  isPublished: boolean;
}

export interface ExamTimetableEntry {
  date: string;
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  venue: string;
}

// ─── Smart Exam Timetable ─────────────────────────────────────────────────────
export interface SmartTimetableEntry {
  date: string;
  day: string;
  classLevel: ClassLevel;
  subjectName: string;
  teacherName?: string;
  position: number;
  isLocked: boolean;
}

export interface SmartExamTimetable {
  id: string;
  examName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  participatingClasses: ClassLevel[];
  entries: SmartTimetableEntry[];
  status: string;
}

export interface GenerateScheduleParams {
  examName: string;
  examStartDate: string;
  examEndDate: string;
  startTime: string;
  endTime: string;
  participatingClasses: string[];
  subjectsPerClass: Record<string, string[]>;
  sessionId: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examTimetableId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

// ─── Online Exams ─────────────────────────────────────────────────────────────
export interface MCQQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOption: number;
  marks: number;
}

export interface OnlineExam {
  id: string;
  title: string;
  subjectId: string;
  classLevel: ClassLevel;
  durationMinutes: number;
  questions: MCQQuestion[];
  scheduledAt: string;
  isActive: boolean;
  createdBy: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: number[];
  score: number;
  maxScore: number;
  submittedAt: string;
  timeTaken: number;
}

// ─── Staff / HR ───────────────────────────────────────────────────────────────
export interface Staff {
  id: string;
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
  photoUrl: string;
  basicSalary: number;
  isActive: boolean;
}

export interface SubjectAssignment {
  id: string;
  staffId: string;
  subjectId: string;
  /** Display name of the subject */
  subjectName: string;
  classLevel: ClassLevel;
  sectionId: string;
  sessionId: string;
  /** Minimum class in the teaching range */
  minClass: ClassLevel;
  /** Maximum class in the teaching range */
  maxClass: ClassLevel;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string; // "April 2025"
  basicSalary: number;
  deductions: number;
  additions: number;
  netSalary: number;
  presentDays: number;
  totalDays: number;
  status: "Pending" | "Paid" | "Cancelled";
  paidAt: string | null;
}

// ─── Transport ───────────────────────────────────────────────────────────────
export interface TransportRoute {
  id: string;
  name: string;
  busNumber: string;
  driverName: string;
  driverMobile: string;
  isActive: boolean;
}

export interface PickupPoint {
  id: string;
  routeId: string;
  name: string;
  timing: string;
  monthlyFare: number;
  order: number;
  /** @deprecated use order */
  sequence?: number;
}

export interface StudentWithPickupPoint {
  student: Student;
  pickupPoint?: PickupPoint;
}

// ─── Bus Live Tracking ───────────────────────────────────────────────────────
export interface BusLocation {
  busId: string;
  routeId: string;
  routeName: string;
  driverName: string;
  latitude: number;
  longitude: number;
  updatedAt: bigint;
  isActive: boolean;
}

// ─── Communication ────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Info" | "Warning" | "Alert" | "Fee" | "Attendance" | "Exam" | "Result";
  targetRole: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Virtual Classes ──────────────────────────────────────────────────────────
export interface VirtualClass {
  id: string;
  title: string;
  platform: "Zoom" | "GoogleMeet";
  meetingLink: string;
  meetingId: string;
  classLevel: ClassLevel;
  subjectId: string;
  teacherId: string;
  scheduledAt: string;
  durationMinutes: number;
  isCompleted: boolean;
}

// ─── Library ─────────────────────────────────────────────────────────────────
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  publisher: string;
  publishYear: number;
  shelfLocation: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string | null;
  staffId: string | null;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  isOverdue: boolean;
  fine: number;
}

// ─── Inventory ───────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  unit: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: "Purchase" | "Sale" | "Adjustment";
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  remarks: string;
  // Sale-specific
  buyerAdmNo?: string;
  buyerName?: string;
  // Purchase/general
  sellerName?: string;
  receivedAmount?: number;
  balanceAmount?: number;
  createdBy?: string;
}

// ─── Certificate Templates ────────────────────────────────────────────────────
export type CertificateType =
  | "IDCard"
  | "StaffIDCard"
  | "FeeReceipt"
  | "AdmissionForm"
  | "Result"
  | "AdmitCard"
  | "Bonafide"
  | "Transfer"
  | "Experience"
  | "DemandSlip";

export interface CertificateTemplate {
  id: string;
  name: string;
  type: CertificateType;
  isDefault: boolean;
  paperSize: "A4" | "A5" | "Letter";
  orientation: "Portrait" | "Landscape";
  backgroundImageUrl: string | null;
  designData: string; // JSON string of design
  createdAt: string;
}

// ─── Class Timetable ──────────────────────────────────────────────────────────
export interface ClassTimetableEntry {
  periodNumber: number;
  dayOfWeek: string;
  classLevel: string;
  sectionName: string;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  startTime: string;
  endTime: string;
}

export interface ClassTimetable {
  id: string;
  sessionId: string;
  name: string;
  entries: ClassTimetableEntry[];
  createdAt: number;
  updatedAt: number;
}

export interface GenerateTimetableParams {
  sessionId: string;
  selectedClasses: string[];
  periodsPerDay: number;
  startTime: string;
  endTime: string;
  breakTimes?: string[];
  periodStartTimes?: string[];
  periodEndTimes?: string[];
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
export interface ExpenseHead {
  id: string;
  name: string;
  type: "Income" | "Expense";
  description: string;
}

export interface ExpenseEntry {
  id: string;
  headId: string;
  amount: number;
  description: string;
  date: string;
  sessionId: string;
  createdBy: string;
}

// ─── Homework ────────────────────────────────────────────────────────────────
export interface HomeworkEntry {
  id: string;
  title: string;
  description: string;
  classLevel: ClassLevel;
  sectionId: string;
  subjectId: string;
  assignedDate: string;
  dueDate: string;
  isActive: boolean;
  createdBy: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submittedAt: string;
  fileUrl: string | null;
  remarks: string;
  grade: string | null;
}

// ─── Alumni ───────────────────────────────────────────────────────────────────
export interface AlumniRecord {
  id: string;
  fullName: string;
  admNo: string;
  passOutYear: string; // stored as string to match backend graduationYear
  classLevel: ClassLevel;
  mobile: string;
  email: string;
  careerField: string;
  currentOccupation: string; // maps to currentOccupation / current role
  company: string;
  city: string;
  photoUrl: string;
  notes: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatRoom {
  id: string;
  name: string;
  type: "Direct" | "Group" | "Class" | "Route";
  members: string[];
  createdAt: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  fileUrl: string | null;
  sentAt: string;
  isRead: boolean;
}

// ─── User Management ──────────────────────────────────────────────────────────
export type UserRole =
  | "Admin"
  | "Teacher"
  | "Student"
  | "Parent"
  | "Accountant"
  | "Librarian"
  | "SuperAdmin";

export interface UserAccount {
  id: string;
  principal: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  staffId: string | null;
  studentId: string | null;
  permissions: Record<string, boolean>;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  moduleName: string;
  details: string;
  timestamp: string;
}

// ─── App Settings ─────────────────────────────────────────────────────────────
export interface AppSettings {
  whatsappApiKey: string;
  whatsappApiUrl: string;
  whatsappPhoneNumberId: string;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  payuEnabled: boolean;
  gpayEnabled: boolean;
  gpayUpiId: string;
  theme: string;
  dashboardBgUrl: string;
  activeSessionId: string;
}

// ─── Index Page Config ────────────────────────────────────────────────────────
export interface IndexPageSection {
  id: string;
  sectionType: string;
  title: string;
  description: string;
  imageFileId: string;
  bgColor: string;
  textColor: string;
  isVisible: boolean;
  order: number;
}

export interface CustomLink {
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
}

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface IndexPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImageFileId: string;
  heroImages: string[]; // multiple slider images (array of file/blob URLs)
  heroBgColor: string;
  heroTextColor: string;
  ctaButtonText: string;
  ctaButtonColor: string;
  sections: IndexPageSection[];
  customLinks: CustomLink[];
  featureCards: FeatureCard[];
  isPublished: boolean;
}
