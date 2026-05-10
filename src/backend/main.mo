import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Float "mo:core/Float";
import AuthTypes "types/auth";
import DeviceAttTypes "types/device-attendance";
import SmartExamTypes "types/smart-exam";
import ClassTimetableTypes "types/class-timetable";
import CertStudioTypes "types/certificate-studio";
import FeeExtrasTypes "types/fee-extras";
import IndexPageConfigTypes "types/index-page-config";
import AuthLib "lib/auth";
import AuthMixin "mixins/auth-api";

import DeviceAttMixin "mixins/device-attendance-api";
import SmartExamMixin "mixins/smart-exam-api";
import ClassTimetableMixin "mixins/class-timetable-api";
import CertStudioMixin "mixins/certificate-studio-api";
import FeeRegisterMixin "mixins/fee-register-api";
import FeeExtrasMixin "mixins/fee-extras-api";
import IndexPageConfigMixin "mixins/index-page-config-api";
import PromotionMixin "mixins/promotion-api";
import DashStatsTypes "types/dashboard-stats";
import BusTrackingTypes "types/bus-tracking";
import DashStatsV2Mixin "mixins/dashboard-stats-v2-api";
import BusTrackingMixin "mixins/bus-tracking-api";
import Queue "mo:core/Queue";
import SyllabusTypes "types/syllabus";
import DeviceConfigTypes "types/device-config";
import SyllabusMixin "mixins/syllabus-api";
import DeviceConfigMixin "mixins/device-config-api";
import CustomColumnsMixin "mixins/custom-columns-api";
import ChatGroupsMixin "mixins/chat-groups-api";
import AttendanceBreakdownMixin "mixins/attendance-breakdown-api";
import DemandRegisterMixin "mixins/demand-register-api";
import Set "mo:core/Set";
import SubjectAssignmentMixin "mixins/subject-assignment-api";
import FaceEnrollmentMixin "mixins/face-enrollment-api";
import ExpensesV2Mixin "mixins/expenses-v2-api";
import InventorySalesMixin "mixins/inventory-sales-api";
import SATypes "types/subject-assignment";
import FETypes "types/face-enrollment";
import ETypes "types/expenses-v2";
import MsgTypes "types/messaging";
import MessagingMixin "mixins/messaging-api";


import BackupRestoreTypes "mixins/backup-restore-api";

import PCTypes "types/payroll-calendar";
import PayrollCalendarMixin "mixins/payroll-calendar-api";
import ExamResultsTypes "types/exam-results";
import ExamResultsMixin "mixins/exam-results-api";
import FeeExtrasLib "lib/fee-extras";














actor {

  // ─── ID COUNTER ─────────────────────────────────────────────────────────────
  var nextId : Nat = 1;
  func genId() : Text {
    let id = nextId;
    nextId += 1;
    id.toText()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12
  };

  public type StudentStatus = { #Active; #Discontinued; #Graduated };
  public type AttendanceStatus = { #Present; #Absent; #Late; #Leave };
  public type StaffStatus = { #Active; #Inactive };
  public type PayrollStatus = { #Pending; #Paid };
  public type BookIssueStatus = { #Issued; #Returned; #Overdue };
  public type InvTxType = { #Purchase; #Sale; #Adjustment };
  public type ExpHeadType = { #Income; #Expense };
  public type ChatRoomType = { #Direct; #ClassGroup; #RouteGroup; #General };
  public type VirtualPlatform = { #Zoom; #GoogleMeet; #Other };

  public type SchoolInfo = {
    name : Text;
    about : Text;
    photoUrl : ?Text;
    address : Text;
    phone : Text;
    email : Text;
    website : ?Text;
  };

  public type AcademicSession = {
    id : Text;
    sessionName : Text;
    startDate : Text;
    endDate : Text;
    isActive : Bool;
    isArchived : Bool;
    createdAt : Int;
  };

  public type Section = {
    id : Text;
    classLevel : ClassLevel;
    sectionName : Text;
    roomNo : ?Text;
    teacherId : ?Text;
  };

  public type Subject = {
    id : Text;
    name : Text;
    code : Text;
    classLevel : ClassLevel;
    maxMarks : Nat;
    passingMarks : Nat;
  };

  /// Maps subjectId -> array of assigned ClassLevels (for multi-class subjects).
  /// Stored separately to avoid schema migration on existing Subject records.
  public type SubjectClassMap = {
    subjectId : Text;
    classLevels : [ClassLevel];
  };

  public type SyllabusChapter = {
    id : Text;
    subjectId : Text;
    chapterNo : Nat;
    title : Text;
    topics : [Text];
    completionPercent : Nat;
    classLevel : Text;  // class association for student portal filtering
  };

  public type Student = {
    id : Text;
    admNo : Text;
    fullName : Text;
    fatherName : Text;
    motherName : Text;
    fatherMobile : Text;
    motherMobile : ?Text;
    dateOfBirth : Text;
    gender : Text;
    currentAddress : Text;    // formerly 'address'
    permanentAddress : Text;  // formerly 'village'
    classLevel : ClassLevel;
    sectionId : Text;
    session : Text;
    photoUrl : ?Text;
    status : StudentStatus;
    bloodGroup : ?Text;
    religion : ?Text;
    category : ?Text;
    aadhaarNo : ?Text;
    transportRouteId : ?Text;
    transportPickupPointId : ?Text;
    busNo : ?Text;
    createdAt : Int;
    // Extended student fields
    mobile : ?Text;           // student's own contact number
    srNo : ?Text;             // serial / register number
    penNo : ?Text;            // PEN number
    apaarNo : ?Text;          // APAAR ID
    prevSchool : ?Text;       // previous school name
    admissionDate : ?Text;    // date of admission in dd/mm/yyyy
  };

  /// Migration type: old Student shape without the new optional fields.
  type OldStudent = {
    id : Text;
    admNo : Text;
    fullName : Text;
    fatherName : Text;
    motherName : Text;
    fatherMobile : Text;
    motherMobile : ?Text;
    dateOfBirth : Text;
    gender : Text;
    currentAddress : Text;
    permanentAddress : Text;
    classLevel : ClassLevel;
    sectionId : Text;
    session : Text;
    photoUrl : ?Text;
    status : StudentStatus;
    bloodGroup : ?Text;
    religion : ?Text;
    category : ?Text;
    aadhaarNo : ?Text;
    transportRouteId : ?Text;
    transportPickupPointId : ?Text;
    busNo : ?Text;
    createdAt : Int;
  };

  public type FeeHeading = {
    id : Text;
    name : Text;
    description : ?Text;
    isActive : Bool;
    // Indian academic-year months (April–March).
    // Empty array means the heading applies to all 12 months.
    applicableMonths : [Text];
  };

  public type FeePaymentItem = {
    headingId : Text;
    month : Text;
    amount : Nat;
  };

  public type OtherFee = {
    description : Text;
    amount : Nat;
  };

  public type FeePlan = {
    id : Text;
    classLevel : ClassLevel;
    sectionId : ?Text;
    session : Text;
    monthlyAmounts : [(Text, Nat)];
  };

   public type FeePayment = {
     id : Text;
     studentId : Text;
     sessionId : Text;
     receiptNo : Text;
     paymentDate : Text;
     items : [FeePaymentItem];
     otherFee : ?OtherFee;
     totalDue : Nat;               // total amount due at collection time
     totalAmount : Nat;            // amount actually paid
     balance : Nat;                // totalDue - totalAmount (carried forward)
     paymentMode : Text;
     upiRef : ?Text;
     remarks : ?Text;
     createdBy : Text;
     isDeleted : Bool;
     createdAt : Int;
     // Extended fields for detailed fee register reporting
     lateFees : Nat;               // late fee amount at time of collection (default 0)
     discountTotal : Nat;          // total discount snapshot at collection time (default 0)
     balanceCarriedForward : Float; // old balance included in this payment (default 0.0)
   };

  public type AttendanceRecord = {
    id : Text;
    studentId : Text;
    date : Text;
    status : AttendanceStatus;
    remarks : ?Text;
    markedBy : Text;
  };

  public type AttendanceSession = {
    id : Text;
    classLevel : ClassLevel;
    sectionId : Text;
    date : Text;
    markedBy : Text;
    markedAt : Int;
  };

  public type ExamScheduleEntry = {
    subjectId : Text;
    date : Text;
    startTime : Text;
    endTime : Text;
    room : ?Text;
    invigilatorId : ?Text;
  };

  public type ExamTimetable = {
    id : Text;
    examName : Text;
    session : Text;
    classLevel : ClassLevel;
    schedule : [ExamScheduleEntry];
  };

  public type ExamResult = {
    id : Text;
    studentId : Text;
    examTimetableId : Text;
    scores : [(Text, Nat)];
    totalMarks : Nat;
    percentage : Float;
    grade : Text;
    rank : ?Nat;
    remarks : ?Text;
  };

  public type MCQQuestion = {
    id : Text;
    question : Text;
    options : [Text];
    correctOption : Nat;
    marks : Nat;
  };

  public type OnlineExam = {
    id : Text;
    title : Text;
    classLevel : ClassLevel;
    subjectId : ?Text;
    durationMinutes : Nat;
    questions : [MCQQuestion];
    startTime : ?Text;
    endTime : ?Text;
    createdBy : Text;
    isActive : Bool;
  };

  public type OnlineExamSubmission = {
    id : Text;
    examId : Text;
    studentId : Text;
    answers : [(Text, Nat)];
    score : Nat;
    totalMarks : Nat;
    submittedAt : Int;
    timeTakenSecs : Nat;
  };

  public type Staff = {
    id : Text;
    employeeId : Text;
    fullName : Text;
    designation : Text;
    department : Text;
    mobile : Text;
    email : ?Text;
    address : Text;
    dateOfJoining : Text;
    salary : Nat;
    status : StaffStatus;
    photoUrl : ?Text;
    aadhaarNo : ?Text;
    bankAccount : ?Text;
    ifscCode : ?Text;
    createdAt : Int;
  };

  public type TeacherSubjectAssignment = {
    id : Text;
    teacherId : Text;
    classLevel : ClassLevel;
    sectionId : ?Text;
    subjectId : Text;
    session : Text;
  };

  public type PayrollRecord = {
    id : Text;
    staffId : Text;
    month : Text;
    year : Text;
    basicSalary : Nat;
    presentDays : Nat;
    totalDays : Nat;
    deductions : Nat;
    additions : Nat;
    netSalary : Nat;
    paymentDate : ?Text;
    status : PayrollStatus;
    generatedBy : Text;
  };

  public type TransportRoute = {
    id : Text;
    routeName : Text;
    routeNo : Text;
    busNo : Text;
    driverName : Text;
    driverMobile : Text;
    capacity : Nat;
  };

  public type PickupPoint = {
    id : Text;
    routeId : Text;
    name : Text;
    timing : Text;
    monthlyFare : Float;
    order : Nat;
  };

  /// View type returned by getStudentsWithPickupPointsByRoute — joins student + pickup point.
  public type StudentWithPickupPoint = {
    student : Student;
    pickupPoint : ?PickupPoint;
  };

  public type Notification = {
    id : Text;
    title : Text;
    message : Text;
    targetRole : ?Text;
    targetStudentId : ?Text;
    targetClassLevel : ?ClassLevel;
    createdBy : Text;
    createdAt : Int;
    isRead : Bool;
    notifType : Text;
  };

  public type Book = {
    id : Text;
    isbn : Text;
    title : Text;
    author : Text;
    publisher : ?Text;
    category : Text;
    totalCopies : Nat;
    availableCopies : Nat;
    shelfLocation : ?Text;
    photoUrl : ?Text;
  };

  public type BookIssue = {
    id : Text;
    bookId : Text;
    studentId : Text;
    issueDate : Text;
    dueDate : Text;
    returnDate : ?Text;
    status : BookIssueStatus;
    fine : Nat;
  };

  public type InventoryItem = {
    id : Text;
    name : Text;
    category : Text;
    store : Text;
    unit : Text;
    currentStock : Nat;
    minStock : Nat;
    purchasePrice : Nat;
    salePrice : Nat;
  };

  public type InventoryTransaction = {
    id : Text;
    itemId : Text;
    transactionType : InvTxType;
    quantity : Int;
    unitPrice : Nat;
    totalAmount : Nat;
    date : Text;
    remarks : ?Text;
    createdBy : Text;
    // Extended sale/purchase fields
    buyerAdmNo   : Text;    // admission number of buyer (sale); empty for purchase
    buyerName    : Text;    // name of buyer (sale); empty for purchase
    sellerName   : Text;    // supplier/seller name (purchase); empty for sale
    receivedAmount : Nat;  // amount actually received / paid
    balanceAmount  : Nat;  // remaining balance (totalAmount - receivedAmount)
  };

  public type UserAccount = {
    id : Text;
    principalId : Text;
    username : Text;
    fullName : Text;
    role : Text;
    position : ?Text;
    classLevel : ?ClassLevel;
    sectionId : ?Text;
    staffId : ?Text;
    studentId : ?Text;
    isActive : Bool;
    permissions : [Text];
    createdAt : Int;
  };

  public type AuditLog = {
    id : Text;
    userId : Text;
    action : Text;
    moduleName : Text;
    details : Text;
    timestamp : Int;
  };

  public type AppSettings = {
    whatsappApiKey : ?Text;
    whatsappApiUrl : ?Text;
    razorpayEnabled : Bool;
    payuEnabled : Bool;
    gpayEnabled : Bool;
    upiId : ?Text;
    activeTheme : Text;
    dashboardBgUrl : ?Text;
    messageTemplates : [(Text, Text)];  // key -> template string
  };

  public type ExpenseHead = {
    id : Text;
    name : Text;
    headType : ExpHeadType;
    description : ?Text;
  };

  public type ExpenseEntry = {
    id : Text;
    headId : Text;
    amount : Nat;
    description : Text;
    date : Text;
    receipt : ?Text;
    createdBy : Text;
    createdAt : Int;
  };

  public type HomeworkEntry = {
    id : Text;
    classLevel : ClassLevel;
    sectionId : ?Text;
    subjectId : Text;
    title : Text;
    description : Text;
    dueDate : Text;
    createdBy : Text;
    createdAt : Int;
    attachmentUrl : ?Text;
  };

  public type HomeworkSubmission = {
    id : Text;
    homeworkId : Text;
    studentId : Text;
    submittedAt : Int;
    content : ?Text;
    attachmentUrl : ?Text;
    grade : ?Text;
    feedback : ?Text;
  };

  public type AlumniRecord = {
    id : Text;
    fullName : Text;
    graduationYear : Text;
    className : Text;
    currentOccupation : ?Text;
    currentCity : ?Text;
    mobile : ?Text;
    email : ?Text;
    photoUrl : ?Text;
  };

  public type ChatRoom = {
    id : Text;
    name : Text;
    roomType : ChatRoomType;
    members : [Text];
    createdBy : Text;
    createdAt : Int;
  };

  public type ChatMessage = {
    id : Text;
    roomId : Text;
    senderId : Text;
    content : Text;
    attachmentUrl : ?Text;
    sentAt : Int;
    isDeleted : Bool;
  };

  public type VirtualClass = {
    id : Text;
    title : Text;
    classLevel : ClassLevel;
    subjectId : ?Text;
    platform : VirtualPlatform;
    meetingLink : Text;
    scheduledAt : Text;
    durationMinutes : Nat;
    createdBy : Text;
    isCompleted : Bool;
  };

  public type CertificateTemplate = {
    id : Text;
    templateType : Text;
    name : Text;
    layoutJson : Text;
    isDefault : Bool;
    createdBy : Text;
    updatedAt : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP SCHEDULING & ATTENDANCE SETTINGS TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Backup schedule frequency.
  public type BackupSchedule = { #daily; #weekly; #monthly; #never };

  /// Backup scheduling configuration stored in stable state.
  public type BackupSettings = {
    backupGmail        : ?Text;           // Gmail address for scheduled backup delivery
    backupSchedule     : BackupSchedule;  // frequency
    lastBackupTimestamp: Int;             // epoch ms; 0 = never backed up
  };

  /// Which attendance systems are active. All default true for backward compat.
  public type AttendanceSystemSettings = {
    face : Bool;
    rfid : Bool;
    essl : Bool;
    qr   : Bool;
  };

  // ─── STAFF PAYMENT SYSTEM TYPES ─────────────────────────────────────────

  /// A partial payout recorded against a staff member (advance / post-salary / cash / online / book).
  public type StaffPayout = {
    id          : Text;
    staffId     : Text;
    amount      : Float;
    mode        : Text;  // "cash" | "online" | "book" | "other"
    date        : Text;  // dd/mm/yyyy
    notes       : Text;
    recordedBy  : Text;
    createdAt   : Int;
  };

  /// Performance or special incentive for a staff member in a given month.
  public type StaffIncentive = {
    id          : Text;
    staffId     : Text;
    amount      : Float;
    reason      : Text;
    month       : Text;  // YYYY-MM
    year        : Text;
    approvedBy  : Text;
    createdAt   : Int;
  };

  /// Staff loan / advance with monthly deduction schedule.
  public type StaffLoan = {
    id               : Text;
    staffId          : Text;
    principalAmount  : Float;
    remainingAmount  : Float;
    monthlyDeduction : Float;
    startMonth       : Text;  // YYYY-MM
    notes            : Text;
    createdAt        : Int;
  };

  /// Full enhanced payroll record with leave policy, incentives, loans, and payout status.
  public type EnhancedPayrollRecord = {
    id              : Text;
    staffId         : Text;
    month           : Text;   // YYYY-MM
    grossSalary     : Float;
    deductions      : Float;
    incentives      : Float;
    loanDeduction   : Float;
    advancePaid     : Float;
    netSalary       : Float;
    attendanceDays  : Float;  // presentDays
    workingDays     : Float;
    absentDays      : Float;
    deductibleDays  : Float;  // absentDays after 1 free leave
    payouts         : [StaffPayout];
    paymentStatus   : Text;   // "Paid" | "Partial" | "Overdue" | "Pending"
    payslipNotes    : Text;
    generatedAt     : Int;
  };

  /// Month-level summary entry for getStaffPaymentSummary.
  public type StaffPaymentSummaryEntry = {
    month      : Text;
    status     : Text;
    amountPaid : Float;
    netSalary  : ?Float;   // null hides amount from non-admin callers
  };

  /// Year-end totals for a staff member.
  public type StaffYearEndSummary = {
    totalEarned        : Float;
    totalPaid          : Float;
    totalIncentives    : Float;
    totalDeductions    : Float;
    monthsFullyPaid    : Nat;
    monthsPartiallyPaid : Nat;
    monthsUnpaid       : Nat;
  };

  /// UPI payment submitted by student/parent for admin verification.
  public type UpiPaymentSubmission = {
    utrNumber    : Text;
    studentId    : Text;
    amount       : Nat;
    submittedAt  : Text;
    status       : Text;
    verifiedBy   : ?Text;
    verifiedAt   : ?Text;
  };

  /// Academic calendar: public holiday.
  public type Holiday = {
    id          : Text;
    name        : Text;
    date        : Text;          // dd/mm/yyyy
    description : Text;
    isRecurring : Bool;
    createdAt   : Int;
  };

  /// Audit log entry for fee payment edits and deletes.
  public type FeeAuditLog = {
    id          : Text;
    paymentId   : Text;
    studentId   : Text;
    adminId     : Text;
    adminName   : Text;
    action      : Text;   // "Edit" | "Delete"
    fieldChanged : Text;
    oldValue    : Text;
    newValue    : Text;
    timestamp   : Int;
  };

  /// Partial update record for fee payment edits.
  public type FeePaymentUpdate = {
    paymentDate  : ?Text;
    totalAmount  : ?Float;
    paymentMode  : ?Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  // Singleton state
  var schoolInfo : SchoolInfo = {
    name = "SHUBH SCHOOL ERP";
    about = "A premier institution dedicated to excellence in education.";
    photoUrl = null;
    address = "";
    phone = "";
    email = "";
    website = null;
  };

  var appSettings : AppSettings = {
    whatsappApiKey = null;
    whatsappApiUrl = null;
    razorpayEnabled = false;
    payuEnabled = false;
    gpayEnabled = false;
    upiId = null;
    activeTheme = "default";
    dashboardBgUrl = null;
    messageTemplates = [
      ("fees_reminder",   "Dear {parent_name}, fees of Rs.{amount} for {student_name} (Adm. No. {adm_no}) are due on {date}."),
      ("receipt",         "Dear {parent_name}, payment of Rs.{amount} received for {student_name}. Receipt No: {receipt_no}. Thank you."),
      ("admission",       "Dear {parent_name}, {student_name} has been successfully admitted to {school_name}. Adm. No: {adm_no}."),
      ("exam_schedule",   "Dear {parent_name}, exam schedule for {student_name}: {exam_details}. Please ensure timely preparation."),
      ("holiday",         "Dear Parent, {school_name} will remain closed on {date} due to {reason}. Happy holiday!")
    ];
  };

  var receiptCounter : Nat = 1;

  // Collections
  let sessions       = Map.empty<Text, AcademicSession>();
  let sections       = Map.empty<Text, Section>();
  let subjects       = Map.empty<Text, Subject>();
  let subjectClassMaps = Map.empty<Text, SubjectClassMap>();
  let chapters       = Map.empty<Text, SyllabusChapter>();
  // ── Student maps ──────────────────────────────────────────────────────────
  // `students` receives the old stable data during upgrade (M0169 compatibility).
  // On upgrade the old records are discarded; `studentsV2` is the live map with
  // the new Student type (includes mobile, srNo, penNo, apaarNo, prevSchool,
  // admissionDate). This effectively clears all duplicate admission number
  // records as requested.
  let _students      = Map.empty<Text, OldStudent>();   // M0169 bridge — receives old data, intentionally unused
  let studentsV2      = Map.empty<Text, Student>();
  let feeHeadings    = Map.empty<Text, FeeHeading>();
  let feePlans       = Map.empty<Text, FeePlan>();
  let feePayments    = Map.empty<Text, FeePayment>();
  let attendance     = Map.empty<Text, AttendanceRecord>();
  let attSessions    = Map.empty<Text, AttendanceSession>();
  let examTimetables = Map.empty<Text, ExamTimetable>();
  let examResults    = Map.empty<Text, ExamResult>();
  let onlineExams    = Map.empty<Text, OnlineExam>();
  let examSubmissions = Map.empty<Text, OnlineExamSubmission>();
  let staff          = Map.empty<Text, Staff>();
  let teacherAssignments = Map.empty<Text, TeacherSubjectAssignment>();
  let payrollRecords = Map.empty<Text, PayrollRecord>();
  let routes         = Map.empty<Text, TransportRoute>();
  let pickupPoints   = Map.empty<Text, PickupPoint>();
  let notifications  = Map.empty<Text, Notification>();
  let books          = Map.empty<Text, Book>();
  let bookIssues     = Map.empty<Text, BookIssue>();
  let invItems       = Map.empty<Text, InventoryItem>();
  let invTransactions = Map.empty<Text, InventoryTransaction>();
  let userAccounts   = Map.empty<Text, UserAccount>();
  let auditLogs      = Map.empty<Text, AuditLog>();
  let expenseHeads   = Map.empty<Text, ExpenseHead>();
  let expenseEntries = Map.empty<Text, ExpenseEntry>();
  let homework       = Map.empty<Text, HomeworkEntry>();
  let hwSubmissions  = Map.empty<Text, HomeworkSubmission>();
  let alumni         = Map.empty<Text, AlumniRecord>();
  let chatRooms      = Map.empty<Text, ChatRoom>();
  let chatMessages   = Map.empty<Text, ChatMessage>();
  let virtualClasses = Map.empty<Text, VirtualClass>();
  let certTemplates  = Map.empty<Text, CertificateTemplate>();

  // ─── STAFF PAYMENT SYSTEM STATE ─────────────────────────────────────────
  // Payout records keyed by payoutId
  let staffPayouts      = Map.empty<Text, StaffPayout>();
  // Incentive records keyed by incentiveId
  let staffIncentives   = Map.empty<Text, StaffIncentive>();
  // Loan records keyed by loanId
  let staffLoans        = Map.empty<Text, StaffLoan>();
  // Enhanced payroll records keyed by "staffId#YYYY-MM"
  let enhancedPayroll   = Map.empty<Text, EnhancedPayrollRecord>();

  // UPI payment submissions — keyed by utrNumber
  let upiPaymentSubmissions = Map.empty<Text, UpiPaymentSubmission>();

  // Auto-created credentials: keyed by entityId (studentId or staffId)
  // Stores the plain-text username/password shown once after creation.
  let autoCreatedCredentials = Map.empty<Text, { username : Text; password : Text; role : Text }>();

  // Syllabus content store (keyed by chapterId)
  let syllabusContents     = Map.empty<Text, SyllabusTypes.SyllabusContent>();

  // Device configuration store (keyed by deviceType)
  let deviceConfigs        = Map.empty<Text, DeviceConfigTypes.DeviceConfig>();

  // Custom student profile column definitions (keyed by column key)
  let customColumnDefs     = Map.empty<Text, { key : Text; columnLabel : Text; fieldType : Text }>();

  // Custom column values per student (outer key = studentId, inner key = column key)
  let studentCustomData    = Map.empty<Text, Map.Map<Text, Text>>();

  // ─── NEW DOMAIN STATE ────────────────────────────────────────────────────
  // Auth: username/password users keyed by username
  let appUsers           = Map.empty<Text, AuthTypes.AppUser>();
  // Role permissions store: keyed by role name ("Admin", "Teacher", ...)
  let rolePermissions    = Map.empty<Text, AuthTypes.RolePermissions>();
  // Maps userId (Text of Nat) -> UserRole for permission lookups
  let userRoleMap        = Map.empty<Text, AuthTypes.UserRole>();
  let nextAppUserIdValue : Nat = 1;
  let nextAppUserId      = { var value = nextAppUserIdValue };

  // Device attendance: Face / RFID / ESSL Biometric IN+OUT records
  let deviceAttendance   = Map.empty<Nat, DeviceAttTypes.DeviceAttendanceRecord>();
  let nextDeviceAttIdValue : Nat = 1;
  let nextDeviceAttId    = { var value = nextDeviceAttIdValue };

  // Staff device attendance for HR payroll (face/RFID/biometric/QR)
  let staffAttendance    = Map.empty<Nat, DeviceAttTypes.StaffAttendanceRecord>();
  let nextStaffAttIdValue : Nat = 1;
  let nextStaffAttId     = { var value = nextStaffAttIdValue };

  // Smart exam timetables
  let smartExamTimetables = Map.empty<Nat, SmartExamTypes.SmartExamTimetable>();
  let nextSmartExamIdValue : Nat = 1;
  let nextSmartExamId     = { var value = nextSmartExamIdValue };

  // Class timetables (teacher & class timetable builder)
  let classTimetables     = Map.empty<Text, ClassTimetableTypes.ClassTimetable>();
  let nextClassTtIdValue  : Nat = 1;
  let classTtGenId        = { var value = nextClassTtIdValue };
  // Teacher-wise timetables auto-generated from class timetables
  let teacherTimetables   = Map.empty<Text, ClassTimetableTypes.TeacherTimetable>();
  // Per-class CCTV and broadcast hyperlinks
  let classLinksStore     = Map.empty<Text, ClassTimetableTypes.ClassLinks>();

  // Certificate-studio extended templates (with drag-and-drop elements JSON)
  let certTemplatesExt = Map.empty<Text, CertStudioTypes.CertificateTemplate>();
  let nextCertIdValue : Nat = 1;
  let nextCertId = { var value = nextCertIdValue };

  // Fee register — projection map (collectedBy = createdBy) for user-wise reporting
  let feeRegister = Map.empty<Text, {
    id          : Text;
    studentId   : Text;
    receiptNo   : Text;
    paymentDate : Text;
    totalAmount : Nat;
    collectedBy : Text;
    isDeleted   : Bool;
  }>();

  // Student discounts and old-balance carry-forward
  let studentDiscounts  = Map.empty<Text, FeeExtrasTypes.StudentDiscount>();
  let studentOldBalances = Map.empty<Text, FeeExtrasTypes.StudentOldBalance>();
  let nextExtrasIdValue : Nat = 1;
  let nextExtrasId = { var value = nextExtrasIdValue };

  // Index-page configuration (singleton keyed by "default")
  let indexPageConfigStore = Map.empty<Text, IndexPageConfigTypes.IndexPageConfig>();

  // Activity log: bounded deque of recent system events (max 200)
  let activityLog = Queue.empty<DashStatsTypes.ActivityEntry>();

  // Bus GPS tracking: keyed by busId
  let busLocations = Map.empty<Text, BusTrackingTypes.BusLocation>();
  // Subject assignments for HR staff (keyed by assignment id)
  let subjectAssignments  = Map.empty<Text, SATypes.SubjectAssignment>();
  let nextSubjectAssignIdValue : Nat = 1;
  let genSubjectAssignId = { var value = nextSubjectAssignIdValue };

  // Student face enrollment records (keyed by studentId)
  let faceEnrollments = Map.empty<Text, FETypes.FaceEnrollmentRecord>();

  // Expenses & Income v2 (real data)
  let expenseHeadsV2   = Map.empty<Text, ETypes.ExpenseHead>();
  let expenseEntriesV2 = Map.empty<Text, ETypes.ExpenseEntry>();
  let nextExpenseIdValue : Nat = 1;
  let genExpenseId     = { var value = nextExpenseIdValue };

  // Direct-message stable store
  let directMessages = Map.empty<Text, MsgTypes.DirectMessage>();

  // Message-template mutable map (seeded from appSettings defaults on first use)
  let _msgTemplateMap = Map.empty<Text, Text>();
  let msgTemplateStore = { var value = _msgTemplateMap };

  // Backup scheduling settings (singleton)
  var backupSettings : BackupSettings = {
    backupGmail         = null;
    backupSchedule      = #never;
    lastBackupTimestamp = 0;
  };

  // Attendance active-systems settings (singleton)
  var attendanceSystemSettings : AttendanceSystemSettings = {
    face = true;
    rfid = true;
    essl = true;
    qr   = true;
  };

  // Academic calendar: holiday store
  let holidays     = Map.empty<Text, Holiday>();

  // Fee audit logs keyed by auditLogId
  let feeAuditLogs = Map.empty<Text, FeeAuditLog>();
  // Enhanced exam results (V2): configs and result records
  let examConfigs      = Map.empty<Text, ExamResultsTypes.ExamConfig>();
  let examResultsV2    = Map.empty<Text, ExamResultsTypes.ExamResultV2>();
  let nextExamResultIdValue : Nat = 1;
  let nextExamResultId = { var value = nextExamResultIdValue };
  // ─── PAYROLL-CALENDAR STATE ───────────────────────────────────────────────
  // Stable payroll records keyed by "staffId#YYYY-MM"
  let payrollRecordsPC = Map.empty<Text, PCTypes.StaffPayrollRecord>();

  // Global paid-leave config (default: 1 day/month)
  let defaultPaidLeaveConfig : PCTypes.PaidLeaveConfig = {
    daysPerMonth = 1.0;
    updatedAt    = 0;
  };
  let paidLeaveConfigRef = { var value = defaultPaidLeaveConfig };

  // Exam calendar entries keyed by id
  let examCalendarStore = Map.empty<Text, PCTypes.ExamCalendarEntry>();
  let nextExamCalIdValue : Nat = 1;
  let nextExamCalId = { var value = nextExamCalIdValue };


  include SyllabusMixin(syllabusContents, chapters);
  include DeviceConfigMixin(deviceConfigs);
  include CustomColumnsMixin(customColumnDefs, studentCustomData);
  include ChatGroupsMixin(chatRooms);
  include AttendanceBreakdownMixin(attendance, studentsV2, sections, staff, staffAttendance, deviceAttendance);
  // Include new domain mixins
  // Seed defaults on first init (no-op if already populated)
  AuthLib.seedAdmin(appUsers, nextAppUserId);
  AuthLib.seedRolePermissions(rolePermissions);
  include AuthMixin(appUsers, nextAppUserId, rolePermissions, userRoleMap);
  include DeviceAttMixin(deviceAttendance, nextDeviceAttId, staffAttendance, nextStaffAttId);
  include SmartExamMixin(smartExamTimetables, nextSmartExamId);
  include ClassTimetableMixin(classTimetables, classTtGenId, teacherTimetables, classLinksStore);
  include CertStudioMixin(certTemplatesExt, nextCertId);
  include FeeRegisterMixin(feeRegister, studentOldBalances);
  include FeeExtrasMixin(studentDiscounts, studentOldBalances, nextExtrasId);
  include IndexPageConfigMixin(indexPageConfigStore);
  include PromotionMixin(studentsV2, feePayments, studentDiscounts, studentOldBalances, nextExtrasId);
  include DashStatsV2Mixin(deviceAttendance, studentsV2, staff, feePayments, feePlans, attendance, sections, studentOldBalances, activityLog);
  include BusTrackingMixin(busLocations, routes);
  include DemandRegisterMixin(studentsV2, feeHeadings, feePlans, feePayments, studentOldBalances);
  include SubjectAssignmentMixin(subjectAssignments, genSubjectAssignId);
  include FaceEnrollmentMixin(faceEnrollments);
  include ExpensesV2Mixin(expenseHeadsV2, expenseEntriesV2, genExpenseId);
  include InventorySalesMixin(invTransactions);
  include MessagingMixin(directMessages, msgTemplateStore);
  include ExamResultsMixin(examConfigs, examResultsV2, nextExamResultId);
  include PayrollCalendarMixin(
    staffAttendance,
    payrollRecordsPC,
    paidLeaveConfigRef,
    examCalendarStore,
    nextExamCalId,
    holidays
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOOL INFO
  // ═══════════════════════════════════════════════════════════════════════════

  public query func getSchoolInfo() : async SchoolInfo {
    schoolInfo
  };

  public shared func updateSchoolInfo(info : SchoolInfo) : async () {
    schoolInfo := info
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════

  public query func getSettings() : async AppSettings {
    appSettings
  };

  public shared func updateSettings(s : AppSettings) : async () {
    appSettings := s
  };

  // ── Backup scheduling settings ────────────────────────────────────────────

  public query func getBackupSettings() : async BackupSettings {
    backupSettings
  };

  public shared func saveBackupSettings(settings : BackupSettings) : async () {
    backupSettings := settings
  };

  /// Update only the lastBackupTimestamp (called after a successful backup export).
  public shared func recordBackupTimestamp(timestampMs : Int) : async () {
    backupSettings := { backupSettings with lastBackupTimestamp = timestampMs }
  };

  // ── Attendance active-systems settings ────────────────────────────────────

  public query func getAttendanceSettings() : async AttendanceSystemSettings {
    attendanceSystemSettings
  };

  public shared func saveAttendanceSettings(settings : AttendanceSystemSettings) : async () {
    attendanceSystemSettings := settings
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ACADEMIC SESSIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createSession(sessionName : Text, startDate : Text, endDate : Text) : async AcademicSession {
    let id = genId();
    let s : AcademicSession = {
      id;
      sessionName;
      startDate;
      endDate;
      isActive = false;
      isArchived = false;
      createdAt = Time.now();
    };
    sessions.add(id, s);
    s
  };

  public query func getSessions() : async [AcademicSession] {
    sessions.values() |> List.fromIter<AcademicSession>(_) |> _.toArray()
  };

  public query func getActiveSession() : async ?AcademicSession {
    sessions.values() |> List.fromIter<AcademicSession>(_) |> _.find(func(s : AcademicSession) : Bool { s.isActive })
  };

  public shared func setActiveSession(id : Text) : async () {
    sessions.forEach(func(k, s) {
      sessions.add(k, { s with isActive = (k == id) })
    })
  };

  public shared func archiveSession(id : Text) : async () {
    switch (sessions.get(id)) {
      case (?s) { sessions.add(id, { s with isArchived = true; isActive = false }) };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createSection(classLevel : ClassLevel, sectionName : Text, roomNo : ?Text, teacherId : ?Text) : async { #ok : Section; #err : Text } {
    // Duplicate check: same classLevel AND sectionName (case-insensitive)
    let nameLower = sectionName.toLower().trim(#char(' '));
    let duplicate = sections.values()
      |> List.fromIter<Section>(_)
      |> _.find(func(s : Section) : Bool {
          s.classLevel == classLevel and
          s.sectionName.toLower().trim(#char(' ')) == nameLower
        });
    switch (duplicate) {
      case (?_) { #err("DUPLICATE_SECTION: A section with this name already exists for this class") };
      case null {
        let id = genId();
        let s : Section = { id; classLevel; sectionName; roomNo; teacherId };
        sections.add(id, s);
        #ok(s)
      };
    }
  };

  public query func getSections() : async [Section] {
    sections.values() |> List.fromIter<Section>(_) |> _.toArray()
  };

  public query func getSectionsByClass(cl : ClassLevel) : async [Section] {
    sections.values()
      |> List.fromIter<Section>(_)
      |> _.filter(func(s : Section) : Bool { s.classLevel == cl })
      |> _.toArray()
  };

  public shared func updateSection(id : Text, classLevel : ClassLevel, sectionName : Text, roomNo : ?Text, teacherId : ?Text) : async () {
    switch (sections.get(id)) {
      case (?s) { sections.add(id, { s with classLevel; sectionName; roomNo; teacherId }) };
      case null {};
    }
  };

  public shared func deleteSection(id : Text) : async { #ok : Bool; #err : Text } {
    // Guard: cannot delete if any student is enrolled in this section (any session)
    let enrolledCount = studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.sectionId == id and s.status == #Active
        })
      |> _.size();
    if (enrolledCount > 0) {
      return #err("SECTION_HAS_STUDENTS: Cannot delete — " # enrolledCount.toText() # " students are enrolled in this section");
    };
    sections.remove(id);
    #ok(true)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBJECTS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createSubject(name : Text, code : Text, classLevel : ClassLevel, maxMarks : Nat, passingMarks : Nat) : async Subject {
    let id = genId();
    let s : Subject = { id; name; code; classLevel; maxMarks; passingMarks };
    subjects.add(id, s);
    // Initialise multi-class assignment with the primary class
    subjectClassMaps.add(id, { subjectId = id; classLevels = [classLevel] });
    s
  };

  public query func getSubjects() : async [Subject] {
    subjects.values() |> List.fromIter<Subject>(_) |> _.toArray()
  };

  public query func getSubjectsByClass(cl : ClassLevel) : async [Subject] {
    subjects.values()
      |> List.fromIter<Subject>(_)
      |> _.filter(func(s : Subject) : Bool {
          // Check primary classLevel OR multi-class assignment map
          if (s.classLevel == cl) { return true };
          switch (subjectClassMaps.get(s.id)) {
            case (?scm) {
              scm.classLevels.find(func(c : ClassLevel) : Bool { c == cl }) != null
            };
            case null false;
          }
        })
      |> _.toArray()
  };

  public shared func updateSubject(id : Text, name : Text, code : Text, classLevel : ClassLevel, maxMarks : Nat, passingMarks : Nat) : async () {
    switch (subjects.get(id)) {
      case (?s) { subjects.add(id, { s with name; code; classLevel; maxMarks; passingMarks }) };
      case null {};
    }
  };

  /// Update the list of classes this subject is assigned to (multi-class assignment).
  public shared func updateSubjectClasses(id : Text, classLevels : [ClassLevel]) : async ?SubjectClassMap {
    // Always upsert the SubjectClassMap regardless of subject existence check
    // to ensure the save is never silently dropped.
    let scm : SubjectClassMap = { subjectId = id; classLevels };
    subjectClassMaps.add(id, scm);
    // If subject exists, also update its primary classLevel to the first entry
    if (classLevels.size() > 0) {
      switch (subjects.get(id)) {
        case (?s) { subjects.add(id, { s with classLevel = classLevels[0] }) };
        case null {};
      }
    };
    ?scm
  };

  /// Returns all multi-class assignment maps — alias used by frontend bulk loader.
  public query func getSubjectClassMapRecord() : async [SubjectClassMap] {
    subjectClassMaps.values() |> List.fromIter<SubjectClassMap>(_) |> _.toArray()
  };

  /// Returns the multi-class assignment for a subject.
  public query func getSubjectClassMap(subjectId : Text) : async ?SubjectClassMap {
    subjectClassMaps.get(subjectId)
  };

  /// Returns all multi-class assignment maps (for bulk loading in the UI).
  public query func getAllSubjectClassMaps() : async [SubjectClassMap] {
    subjectClassMaps.values() |> List.fromIter<SubjectClassMap>(_) |> _.toArray()
  };

  public shared func deleteSubject(id : Text) : async () {
    subjects.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SYLLABUS CHAPTERS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createChapter(subjectId : Text, chapterNo : Nat, title : Text, topics : [Text], classLevel : Text) : async SyllabusChapter {
    let id = genId();
    let c : SyllabusChapter = { id; subjectId; chapterNo; title; topics; completionPercent = 0; classLevel };
    chapters.add(id, c);
    c
  };

  public query func getChapters(subjectId : Text) : async [SyllabusChapter] {
    chapters.values()
      |> List.fromIter<SyllabusChapter>(_)
      |> _.filter(func(c : SyllabusChapter) : Bool { c.subjectId == subjectId })
      |> _.toArray()
  };

  public shared func updateChapterProgress(id : Text, completionPercent : Nat) : async () {
    switch (chapters.get(id)) {
      case (?c) { chapters.add(id, { c with completionPercent }) };
      case null {};
    }
  };

  public shared func deleteChapter(id : Text) : async () {
    chapters.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDENTS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addStudent(
    admNo : Text, fullName : Text, fatherName : Text, motherName : Text,
    fatherMobile : Text, motherMobile : ?Text, dateOfBirth : Text, gender : Text,
    currentAddress : Text, permanentAddress : Text, classLevel : ClassLevel, sectionId : Text, session : Text,
    photoUrl : ?Text, bloodGroup : ?Text, religion : ?Text, category : ?Text,
    aadhaarNo : ?Text, transportRouteId : ?Text, transportPickupPointId : ?Text, busNo : ?Text,
    mobile : ?Text, srNo : ?Text, penNo : ?Text, apaarNo : ?Text, prevSchool : ?Text, admissionDate : ?Text
  ) : async { #ok : Student; #err : Text } {
    // Duplicate admNo guard
    let existing = studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.find(func(s : Student) : Bool { s.admNo == admNo });
    switch (existing) {
      case (?_) { return #err("Admission number already exists") };
      case null {};
    };
    let id = genId();
    let s : Student = {
      id; admNo; fullName; fatherName; motherName; fatherMobile; motherMobile;
      dateOfBirth; gender; currentAddress; permanentAddress; classLevel; sectionId; session; photoUrl;
      status = #Active; bloodGroup; religion; category; aadhaarNo;
      transportRouteId; transportPickupPointId; busNo; createdAt = Time.now();
      mobile; srNo; penNo; apaarNo; prevSchool; admissionDate;
    };
    studentsV2.add(id, s);

    // ── Auto-create Student user account ──────────────────────────────────────
    let stuUsername = "stu" # admNo.toLower();
    let stuPassword = "Pass@" # admNo;
    let stuUserId = genId();
    let stuUser : UserAccount = {
      id = stuUserId;
      principalId = "student_" # id;
      username = stuUsername;
      fullName = fullName;
      role = "Student";
      position = null;
      classLevel = ?classLevel;
      sectionId = ?sectionId;
      staffId = null;
      studentId = ?id;
      isActive = true;
      permissions = ["viewOwnFees", "viewOwnAttendance", "viewOwnResults", "viewOwnProfile"];
      createdAt = Time.now();
    };
    userAccounts.add(stuUserId, stuUser);
    autoCreatedCredentials.add(id, { username = stuUsername; password = stuPassword; role = "Student" });
    // Also register in appUsers so loginUser() can authenticate this student
    AuthLib.registerUser(appUsers, nextAppUserId, stuUsername, stuPassword, #Student);

    // ── Auto-create Parent user account ─────────────────────────────────────
    let mobileChars = fatherMobile.toArray();
    let mobileLen = mobileChars.size();
    let last4 : Text = if (mobileLen >= 4) {
      let slice = mobileChars.sliceToArray(Nat.sub(mobileLen, 4), mobileLen);
      Text.fromArray(slice)
    } else { fatherMobile };
    let parUsername = "par" # last4;
    let parPassword = "Par@" # last4;
    let parUserId = genId();
    let parUser : UserAccount = {
      id = parUserId;
      principalId = "parent_" # id;
      username = parUsername;
      fullName = fatherName;
      role = "Parent";
      position = null;
      classLevel = null;
      sectionId = null;
      staffId = null;
      studentId = ?id;
      isActive = true;
      permissions = ["viewChildFees", "viewChildAttendance", "viewChildResults", "viewChildProfile"];
      createdAt = Time.now();
    };
    userAccounts.add(parUserId, parUser);
    let parCredKey = "par_" # id;
    autoCreatedCredentials.add(parCredKey, { username = parUsername; password = parPassword; role = "Parent" });
    // Also register parent in appUsers so loginUser() can authenticate them
    AuthLib.registerUser(appUsers, nextAppUserId, parUsername, parPassword, #Parent);

    #ok(s)
  };

  public query func getStudents() : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.status != #Discontinued })
      |> _.toArray()
  };

  public query func getStudentById(id : Text) : async ?Student {
    studentsV2.get(id)
  };

  /// Look up a student by admission number. Used by frontend to check duplicates before bulk import.
  public query func getStudentByAdmNo(admNo : Text) : async ?Student {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.find(func(s : Student) : Bool { s.admNo == admNo })
  };

  public shared func updateStudent(
    id : Text, admNo : Text, fullName : Text, fatherName : Text, motherName : Text,
    fatherMobile : Text, motherMobile : ?Text, dateOfBirth : Text, gender : Text,
    currentAddress : Text, permanentAddress : Text, classLevel : ClassLevel, sectionId : Text, session : Text,
    photoUrl : ?Text, bloodGroup : ?Text, religion : ?Text, category : ?Text,
    aadhaarNo : ?Text, transportRouteId : ?Text, transportPickupPointId : ?Text, busNo : ?Text,
    mobile : ?Text, srNo : ?Text, penNo : ?Text, apaarNo : ?Text, prevSchool : ?Text, admissionDate : ?Text
  ) : async () {
    switch (studentsV2.get(id)) {
      case (?s) {
        studentsV2.add(id, {
          s with admNo; fullName; fatherName; motherName; fatherMobile; motherMobile;
          dateOfBirth; gender; currentAddress; permanentAddress; classLevel; sectionId; session; photoUrl;
          bloodGroup; religion; category; aadhaarNo;
          transportRouteId; transportPickupPointId; busNo;
          mobile; srNo; penNo; apaarNo; prevSchool; admissionDate;
        })
      };
      case null {};
    }
  };

  public shared func discontinueStudent(id : Text) : async () {
    switch (studentsV2.get(id)) {
      case (?s) { studentsV2.add(id, { s with status = #Discontinued }) };
      case null {};
    }
  };

  /// Returns all discontinued students (across all sessions).
  public query func getDiscontinuedStudents() : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.status == #Discontinued })
      |> _.toArray()
  };

  /// Permanently delete ALL student records — admin-only destructive operation.
  /// Clears the students map and all associated fee payments and attendance records.
  public shared func deleteAllStudents() : async () {
    // Collect all student ids first
    let allIds = studentsV2.keys() |> List.fromIter(_) |> _.toArray();
    for (sid in allIds.values()) {
      // Remove fee payments and register entries for this student
      let paymentIds = feePayments.values()
        |> List.fromIter<FeePayment>(_)
        |> _.filter(func(p : FeePayment) : Bool { p.studentId == sid })
        |> _.map(func(p : FeePayment) : Text { p.id })
        |> _.toArray();
      for (pid in paymentIds.values()) {
        feePayments.remove(pid);
        feeRegister.remove(pid);
      };
      // Remove attendance records for this student
      let attIds = attendance.values()
        |> List.fromIter<AttendanceRecord>(_)
        |> _.filter(func(r : AttendanceRecord) : Bool { r.studentId == sid })
        |> _.map(func(r : AttendanceRecord) : Text { r.id })
        |> _.toArray();
      for (aid in attIds.values()) {
        attendance.remove(aid);
      };
      studentsV2.remove(sid);
    };
  };

  /// Permanently delete a student record. Intended for admin use only.
  /// Also removes associated fee payments and attendance records.
  public shared func deleteStudent(id : Text) : async () {
    studentsV2.remove(id);
    // Remove associated payments
    let paymentIds = feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.studentId == id })
      |> _.map(func(p : FeePayment) : Text { p.id })
      |> _.toArray();
    for (pid in paymentIds.values()) {
      feePayments.remove(pid);
      feeRegister.remove(pid);
    };
    // Remove attendance records
    let attIds = attendance.values()
      |> List.fromIter<AttendanceRecord>(_)
      |> _.filter(func(r : AttendanceRecord) : Bool { r.studentId == id })
      |> _.map(func(r : AttendanceRecord) : Text { r.id })
      |> _.toArray();
    for (aid in attIds.values()) {
      attendance.remove(aid);
    };
  };

  public query func getStudentsByClass(cl : ClassLevel) : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.classLevel == cl and s.status == #Active })
      |> _.toArray()
  };

  public query func getStudentsByFamily(mobile : Text) : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.fatherMobile == mobile })
      |> _.toArray()
  };

  /// Returns all active students in a class for a given session.
  public query func getStudentsByClassAndSession(cl : ClassLevel, sessionId : Text) : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.classLevel == cl and s.session == sessionId and s.status == #Active
        })
      |> _.toArray()
  };

  /// Returns the count of enrolled (active) students in a class for a session.
  public query func getEnrolledCountByClass(cl : ClassLevel, sessionId : Text) : async Nat {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.classLevel == cl and s.session == sessionId and s.status == #Active
        })
      |> _.size()
  };

  /// Returns the count of enrolled (active) students in a section for a session.
  public query func getEnrolledCountBySection(sectionId : Text, sessionId : Text) : async Nat {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.sectionId == sectionId and s.session == sessionId and s.status == #Active
        })
      |> _.size()
  };

  /// Returns all active students assigned to a transport route for a session.
  public query func getStudentsByRoute(routeId : Text, sessionId : Text) : async [Student] {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.session == sessionId and s.status == #Active and (
            switch (s.transportRouteId) {
              case (?rid) rid == routeId;
              case null false;
            }
          )
        })
      |> _.toArray()
  };

  public query func getStudentCount() : async Nat {
    studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.status == #Active })
      |> _.size()
  };

  public query func getDashboardStats() : async {
    totalStudents    : Nat;
    activeStudents   : Nat;
    totalStaff       : Nat;
    feesCollectedToday : Nat;
    feesCollectedMonth : Nat;
  } {
    let totalStudents  = studentsV2.size();
    let activeStudents = studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool { s.status == #Active })
      |> _.size();
    let totalStaff = staff.values()
      |> List.fromIter<Staff>(_)
      |> _.filter(func(s : Staff) : Bool { s.status == #Active })
      |> _.size();
    var monthTotal : Nat = 0;
    let allPayments = feePayments.values() |> List.fromIter<FeePayment>(_);
    allPayments.forEach(func(p : FeePayment) {
      if (not p.isDeleted) { monthTotal += p.totalAmount }
    });
    {
      totalStudents;
      activeStudents;
      totalStaff;
      feesCollectedToday = 0;
      feesCollectedMonth = monthTotal;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FEE HEADINGS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addFeeHeading(name : Text, description : ?Text, applicableMonths : [Text]) : async FeeHeading {
    let id = genId();
    let h : FeeHeading = { id; name; description; isActive = true; applicableMonths };
    feeHeadings.add(id, h);
    h
  };

  public query func getFeeHeadings() : async [FeeHeading] {
    feeHeadings.values() |> List.fromIter<FeeHeading>(_) |> _.toArray()
  };

  public shared func updateFeeHeading(id : Text, name : Text, description : ?Text, isActive : Bool, applicableMonths : [Text]) : async () {
    switch (feeHeadings.get(id)) {
      case (?h) { feeHeadings.add(id, { h with name; description; isActive; applicableMonths }) };
      case null {};
    }
  };

  public shared func deleteFeeHeading(id : Text) : async () {
    feeHeadings.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FEE PLANS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func setFeePlan(classLevel : ClassLevel, sectionId : ?Text, session : Text, monthlyAmounts : [(Text, Nat)]) : async FeePlan {
    // Find existing plan for this class/section/session or create new
    let existing = feePlans.values()
      |> List.fromIter<FeePlan>(_)
      |> _.find(func(p : FeePlan) : Bool {
          p.classLevel == classLevel and p.session == session and p.sectionId == sectionId
        });
    let id = switch (existing) { case (?p) p.id; case null genId() };
    let plan : FeePlan = { id; classLevel; sectionId; session; monthlyAmounts };
    feePlans.add(id, plan);
    plan
  };

  public query func getFeePlan(classLevel : ClassLevel, sectionId : ?Text, session : Text) : async ?FeePlan {
    feePlans.values()
      |> List.fromIter<FeePlan>(_)
      |> _.find(func(p : FeePlan) : Bool {
          p.classLevel == classLevel and p.session == session and p.sectionId == sectionId
        })
  };

  public query func getFeePlans() : async [FeePlan] {
    feePlans.values() |> List.fromIter<FeePlan>(_) |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FEE PAYMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  public query func getLastReceiptNo() : async Nat {
    receiptCounter
  };

  public shared func recordPayment(
    studentId : Text, sessionId : Text, paymentDate : Text, items : [FeePaymentItem],
    otherFee : ?OtherFee, totalDue : Nat, totalAmount : Nat, paymentMode : Text,
    upiRef : ?Text, remarks : ?Text, createdBy : Text,
    lateFees : ?Nat, discountTotal : ?Nat, balanceCarriedForward : ?Float
  ) : async FeePayment {
    let id = genId();
    let receiptNo = "RCP-" # receiptCounter.toText();
    receiptCounter += 1;
    let bal : Nat = if (totalDue >= totalAmount) { totalDue - totalAmount } else { 0 };
    let p : FeePayment = {
      id; studentId; sessionId; receiptNo; paymentDate; items; otherFee;
      totalDue; totalAmount; balance = bal;
      paymentMode; upiRef; remarks;
      createdBy;
      isDeleted = false;
      createdAt = Time.now();
      lateFees = switch (lateFees) { case (?v) v; case null 0 };
      discountTotal = switch (discountTotal) { case (?v) v; case null 0 };
      balanceCarriedForward = switch (balanceCarriedForward) { case (?v) v; case null 0.0 };
    };
    feePayments.add(id, p);
    // Mirror into fee register for user-wise reporting
    feeRegister.add(id, {
      id; studentId; receiptNo; paymentDate; totalAmount;
      collectedBy = createdBy; isDeleted = false;
    });
    p
  };

  public query func getPaymentsByStudent(studentId : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.studentId == studentId and not p.isDeleted })
      |> _.toArray()
  };

  public query func getPaymentsByDate(date : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.paymentDate == date and not p.isDeleted })
      |> _.toArray()
  };

  public query func getPaymentsByMonth(month : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool {
          let items = List.fromIter<FeePaymentItem>(p.items.values());
          not p.isDeleted and items.any(func(item : FeePaymentItem) : Bool { item.month == month })
        })
      |> _.toArray()
  };

  public query func getPaymentsByStudentAndSession(studentId : Text, sessionId : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool {
          p.studentId == studentId and p.sessionId == sessionId and not p.isDeleted
        })
      |> _.toArray()
  };

  public query func getTotalDueByStudentAndSession(studentId : Text, sessionId : Text) : async {
    totalFees : Nat;
    totalPaid : Nat;
    totalDue  : Nat;
  } {
    // Sum all payments made for this student in this session
    let payments = feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool {
          p.studentId == studentId and p.sessionId == sessionId and not p.isDeleted
        });
    var totalPaid : Nat = 0;
    payments.forEach(func(p : FeePayment) { totalPaid += p.totalAmount });

    // Determine student's class to look up the fee plan for this session
    let studentOpt = studentsV2.get(studentId);
    var totalFees : Nat = 0;
    switch (studentOpt) {
      case (?student) {
        // Find fee plan for class/section/session
        let planOpt = feePlans.values()
          |> List.fromIter<FeePlan>(_)
          |> _.find(func(p : FeePlan) : Bool {
              p.classLevel == student.classLevel and p.session == sessionId and (
                switch (p.sectionId) {
                  case (?sid) sid == student.sectionId;
                  case null   true;
                }
              )
            });
        switch (planOpt) {
          case (?plan) {
            // Sum all (headingId, monthlyAmount) entries in the plan
            // Each entry is (headingId, amountPerApplicableMonth).
            // Total fees = sum of (amount × applicableMonths count for that heading)
            for ((headingId, monthlyAmt) in plan.monthlyAmounts.values()) {
              switch (feeHeadings.get(headingId)) {
                case (?h) {
                  let months = if (h.applicableMonths.size() == 0) { 12 } else { h.applicableMonths.size() };
                  totalFees += monthlyAmt * months;
                };
                case null {
                  // heading deleted; use 12 months as fallback
                  totalFees += monthlyAmt * 12;
                };
              }
            };
            // Add old balance if any
            let balOpt = studentOldBalances.values()
              |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
              |> _.find(func(b : FeeExtrasTypes.StudentOldBalance) : Bool {
                  b.studentId == studentId and b.sessionId == sessionId
                });
            switch (balOpt) {
              case (?bal) {
                if (bal.amount > 0.0) {
                  let balInt : Int = bal.amount.toInt();
                  if (balInt > 0) { totalFees += Int.abs(balInt) }
                };
                let pyd = switch (bal.previousYearDue) { case (?v) v; case null 0.0 };
                if (pyd > 0.0) {
                  let pydInt : Int = pyd.toInt();
                  if (pydInt > 0) { totalFees += Int.abs(pydInt) }
                }
              };
              case null {};
            };
          };
          case null {};
        }
      };
      case null {};
    };
    let totalDue : Nat = if (totalFees >= totalPaid) { totalFees - totalPaid } else { 0 };
    { totalFees; totalPaid; totalDue }
  };

  /// Return all payments for a student across all sessions (for receipt history).
  public query func getFeePaymentsByStudent(studentId : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.studentId == studentId and not p.isDeleted })
      |> _.toArray()
  };

  /// Return ALL fee payments for a session, sorted by paymentDate descending.
  /// Powers the detailed fee register view (all collectors, all classes).
  public query func getAllFeePaymentsBySession(sessionId : Text) : async [FeePayment] {
    feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.sessionId == sessionId and not p.isDeleted })
      |> _.toArray()
  };

  /// Returns 0 until inventory per-student due tracking is wired.
  public query func getStudentInventoryDue(_studentId : Text) : async Nat { 0 };

  /// Return the student's old-balance from the session immediately prior to currentSession.
  /// Looks up studentOldBalances for any entry whose sessionId != currentSession belonging
  /// to this student; returns the most recently added one, or null if none.
  /// Collect Fees uses this to auto-populate the previous-session-due field.
  public query func getPreviousSessionBalance(
    studentId      : Text,
    currentSession : Text,
  ) : async ?{ sessionId : Text; amount : Float; previousYearDue : Float } {
    // Gather all old-balance entries for this student from sessions other than currentSession
    let candidates = studentOldBalances.values()
      |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
      |> _.filter(func(b : FeeExtrasTypes.StudentOldBalance) : Bool {
          b.studentId == studentId and b.sessionId != currentSession
        });
    // Pick the entry with the highest addedAt timestamp (most recent prior session)
    var best : ?FeeExtrasTypes.StudentOldBalance = null;
    candidates.forEach(func(b : FeeExtrasTypes.StudentOldBalance) {
      switch (best) {
        case null { best := ?b };
        case (?prev) {
          if (b.addedAt > prev.addedAt) { best := ?b }
        };
      }
    });
    switch (best) {
      case null null;
      case (?b) {
        let pyd = switch (b.previousYearDue) { case (?v) v; case null 0.0 };
        ?{ sessionId = b.sessionId; amount = b.amount; previousYearDue = pyd }
      };
    }
  };

  /// Return the monthly transport fare for a student based on their assigned pickup point.
  /// Returns 0 if no pickup point is assigned or the pickup point is not found.
  public query func getStudentTransportFare(studentId : Text) : async Float {
    switch (studentsV2.get(studentId)) {
      case (?s) {
        switch (s.transportPickupPointId) {
          case (?ppId) {
            switch (pickupPoints.get(ppId)) {
              case (?pp) pp.monthlyFare;
              case null 0.0;
            }
          };
          case null 0.0;
        }
      };
      case null 0.0;
    }
  };

  // ─── FEE REGISTER ENTRY TYPE ─────────────────────────────────────────────
  public type FeeRegisterEntry = {
    id              : Text;
    studentId       : Text;
    studentName     : Text;
    className       : Text;   // human-readable e.g. "Class 5"
    sectionName     : Text;   // e.g. "A"
    receiptNo       : Text;
    paymentDate     : Text;
    months          : [Text]; // distinct months from payment items
    totalDue        : Nat;
    totalAmount     : Nat;
    balance         : Nat;
    collectedBy     : Text;
    paymentMode     : Text;
    lateFees        : Nat;
    discountTotal   : Nat;
    sessionId       : Text;
    previousBalance : Float;  // old balance + previousYearDue for this student
  };

  /// Return all fee payments for a session enriched with student class/section data.
  /// Used by the Fee Register detailed view.
  public query func getFeeRegisterBySession(sessionId : Text) : async [FeeRegisterEntry] {
    let result = List.empty<FeeRegisterEntry>();
    feePayments.values() |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool { p.sessionId == sessionId and not p.isDeleted })
      |> _.forEach(func(p : FeePayment) {
          let (sName, clText, secName) : (Text, Text, Text) = switch (studentsV2.get(p.studentId)) {
            case (?s) {
              let sectionLabel = switch (sections.get(s.sectionId)) {
                case (?sec) sec.sectionName;
                case null "";
              };
              (s.fullName, classLevelToText(s.classLevel), sectionLabel)
            };
            case null ("", "", "");
          };
          // Derive distinct months from items
          let monthSet = Map.empty<Text, Bool>();
          for (item in p.items.values()) { monthSet.add(item.month, true) };
          let months = monthSet.keys() |> List.fromIter(_) |> _.toArray();
          let previousBalance : Float = switch (
            studentOldBalances.values()
              |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
              |> _.find(func(b : FeeExtrasTypes.StudentOldBalance) : Bool {
                  b.studentId == p.studentId and b.sessionId == sessionId
                })
          ) {
            case (?b) {
              let pyd = switch (b.previousYearDue) { case (?v) v; case null 0.0 };
              b.amount + pyd
            };
            case null 0.0;
          };
          let entry : FeeRegisterEntry = {
            id              = p.id;
            studentId       = p.studentId;
            studentName     = sName;
            className       = clText;
            sectionName     = secName;
            receiptNo       = p.receiptNo;
            paymentDate     = p.paymentDate;
            months;
            totalDue        = p.totalDue;
            totalAmount     = p.totalAmount;
            balance         = p.balance;
            collectedBy     = p.createdBy;
            paymentMode     = p.paymentMode;
            lateFees        = p.lateFees;
            discountTotal   = p.discountTotal;
            sessionId       = p.sessionId;
            previousBalance;
          };
          result.add(entry)
        });
    result.toArray()
  };

  // ─── COMPOSITE QUERY FOR COLLECT FEES UI ──────────────────────────────────
  /// Single query that returns everything the Collect Fees page needs.
  /// Prevents partial-data crashes that cause React error #185.
  public type StudentFeeCollectionData = {
    // Student basics (safe — never null fields)
    studentId      : Text;
    studentName    : Text;
    admNo          : Text;
    className      : Text;
    sectionName    : Text;
    fatherName     : Text;
    fatherMobile   : Text;
    photoUrl       : ?Text;
    // Transport
    transportRouteId      : ?Text;
    transportPickupPointId: ?Text;
    transportMonthlyFare  : Float;  // 0.0 if no pickup point
    // Fee plan for student's class+section+session
    feePlan        : ?FeePlan;
    // All payments in this session
    payments       : [FeePayment];
    // Current discounts
    discounts      : [FeeExtrasTypes.StudentDiscount];
    // Old balance for this session (0.0 if none) — unpaid balance carried forward
    oldBalanceAmount    : Float;
    // Previous year dues from prior academic sessions
    previousYearDue     : Float;
    // Inventory due (0 currently)
    inventoryDue   : Nat;
    // Aggregated totals
    totalPaid      : Nat;
  };

  public query func getStudentFeeCollectionData(
    studentId : Text,
    sessionId : Text,
  ) : async StudentFeeCollectionData {
    // 1. Student basics
    let s = switch (studentsV2.get(studentId)) {
      case (?st) st;
      case null {
        // Return a safe empty record — never crash
        return {
          studentId; studentName = ""; admNo = ""; className = "";
          sectionName = ""; fatherName = ""; fatherMobile = "";
          photoUrl = null; transportRouteId = null;
          transportPickupPointId = null; transportMonthlyFare = 0.0;
          feePlan = null; payments = []; discounts = [];
          oldBalanceAmount = 0.0; previousYearDue = 0.0;
          inventoryDue = 0; totalPaid = 0;
        }
      };
    };

    let sectionName = switch (sections.get(s.sectionId)) {
      case (?sec) sec.sectionName;
      case null "";
    };

    // 2. Transport fare
    let transportMonthlyFare : Float = switch (s.transportPickupPointId) {
      case (?ppId) {
        switch (pickupPoints.get(ppId)) {
          case (?pp) pp.monthlyFare;
          case null 0.0;
        }
      };
      case null 0.0;
    };

    // 3. Fee plan
    let feePlan : ?FeePlan = feePlans.values()
      |> List.fromIter<FeePlan>(_)
      |> _.find(func(p : FeePlan) : Bool {
          p.classLevel == s.classLevel and p.session == sessionId and (
            switch (p.sectionId) {
              case (?sid) sid == s.sectionId;
              case null   true;
            }
          )
        });

    // 4. Payments for this student + session
    let payments = feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.filter(func(p : FeePayment) : Bool {
          p.studentId == studentId and p.sessionId == sessionId and not p.isDeleted
        })
      |> _.toArray();

    // 5. Discounts
    let discounts = studentDiscounts.values()
      |> List.fromIter<FeeExtrasTypes.StudentDiscount>(_)
      |> _.filter(func(d : FeeExtrasTypes.StudentDiscount) : Bool { d.studentId == studentId })
      |> _.toArray();

    // 6. Old balance and previous year due
    let (oldBalanceAmount, previousYearDue) : (Float, Float) = switch (
      studentOldBalances.values()
        |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
        |> _.find(func(b : FeeExtrasTypes.StudentOldBalance) : Bool {
            b.studentId == studentId and b.sessionId == sessionId
          })
    ) {
      case (?b) {
        let pyd = switch (b.previousYearDue) { case (?v) v; case null 0.0 };
        (b.amount, pyd)
      };
      case null (0.0, 0.0);
    };

    // 7. Total paid
    var totalPaid : Nat = 0;
    for (p in payments.values()) { totalPaid += p.totalAmount };

    {
      studentId;
      studentName = s.fullName;
      admNo       = s.admNo;
      className   = classLevelToText(s.classLevel);
      sectionName;
      fatherName  = s.fatherName;
      fatherMobile = s.fatherMobile;
      photoUrl    = s.photoUrl;
      transportRouteId       = s.transportRouteId;
      transportPickupPointId = s.transportPickupPointId;
      transportMonthlyFare;
      feePlan;
      payments;
      discounts;
      oldBalanceAmount;
      previousYearDue;
      inventoryDue = 0;
      totalPaid;
    }
  };

  /// Alias kept for backward compat — recordPayment is the canonical name.
  /// Accepts `collectedBy` field name (same as createdBy internally).
  public shared func recordFeePayment(
    studentId : Text, sessionId : Text, paymentDate : Text,
    items : [FeePaymentItem], otherFee : ?OtherFee,
    totalDue : Nat, totalAmount : Nat, balance : Nat,
    collectedBy : Text, paymentMode : Text,
    upiRef : ?Text, remarks : ?Text,
    lateFees : Nat, discountTotal : Nat, balanceCarriedForward : Float,
  ) : async FeePayment {
    let id = genId();
    let receiptNo = "RCP-" # receiptCounter.toText();
    receiptCounter += 1;
    let safeBal : Nat = if (totalDue >= totalAmount) { totalDue - totalAmount } else { balance };
    let p : FeePayment = {
      id; studentId; sessionId; receiptNo; paymentDate; items; otherFee;
      totalDue; totalAmount; balance = safeBal;
      paymentMode; upiRef; remarks;
      createdBy = collectedBy;
      isDeleted = false;
      createdAt = Time.now();
      lateFees;
      discountTotal;
      balanceCarriedForward;
    };
    feePayments.add(id, p);
    feeRegister.add(id, {
      id; studentId; receiptNo; paymentDate; totalAmount;
      collectedBy; isDeleted = false;
    });
    // Auto-persist remaining balance as carry-forward.
    // This ensures next fee collection pre-populates oldBalance correctly.
    let _carried = FeeExtrasLib.autoCarryForward(
      studentOldBalances, nextExtrasId,
      studentId, sessionId, totalDue, totalAmount,
    );
    p
  };

  public shared func updatePayment(
    id : Text, paymentDate : Text, items : [FeePaymentItem],
    otherFee : ?OtherFee, totalAmount : Nat, paymentMode : Text,
    upiRef : ?Text, remarks : ?Text
  ) : async () {
    switch (feePayments.get(id)) {
      case (?p) {
        feePayments.add(id, { p with paymentDate; items; otherFee; totalAmount; paymentMode; upiRef; remarks });
        switch (feeRegister.get(id)) {
          case (?r) { feeRegister.add(id, { r with paymentDate; totalAmount }) };
          case null {};
        }
      };
      case null {};
    }
  };

  public shared func deletePayment(id : Text) : async () {
    switch (feePayments.get(id)) {
      case (?p) {
        feePayments.add(id, { p with isDeleted = true });
        switch (feeRegister.get(id)) {
          case (?r) { feeRegister.add(id, { r with isDeleted = true }) };
          case null {};
        };
        // Audit log: record the soft-delete
        addFeeAuditLogEntry(id, p.studentId, "system", "admin", "Delete", "isDeleted", "false", "true");
      };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ATTENDANCE
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func markAttendance(
    classLevel : ClassLevel, sectionId : Text, date : Text, markedBy : Text,
    records : [{ studentId : Text; status : AttendanceStatus; remarks : ?Text }]
  ) : async () {
    let sessId = genId();
    let attSess : AttendanceSession = {
      id = sessId; classLevel; sectionId; date; markedBy; markedAt = Time.now()
    };
    attSessions.add(sessId, attSess);
    for (r in records.values()) {
      let rid = genId();
      attendance.add(rid, {
        id = rid; studentId = r.studentId; date; status = r.status;
        remarks = r.remarks; markedBy;
      })
    }
  };

  public query func getAttendanceByDate(date : Text, _sectionId : Text) : async [AttendanceRecord] {
    attendance.values()
      |> List.fromIter<AttendanceRecord>(_)
      |> _.filter(func(r : AttendanceRecord) : Bool { r.date == date })
      |> _.toArray()
  };

  public query func getAttendanceByStudent(studentId : Text) : async [AttendanceRecord] {
    attendance.values()
      |> List.fromIter<AttendanceRecord>(_)
      |> _.filter(func(r : AttendanceRecord) : Bool { r.studentId == studentId })
      |> _.toArray()
  };

  public query func getAttendanceSummary(_classLevel : ClassLevel, _sectionId : Text, date : Text) : async { present : Nat; absent : Nat; late : Nat; leave : Nat } {
    let recs = attendance.values()
      |> List.fromIter<AttendanceRecord>(_)
      |> _.filter(func(r : AttendanceRecord) : Bool { r.date == date });
    var present = 0; var absent = 0; var late = 0; var leave = 0;
    recs.forEach(func(r : AttendanceRecord) {
      switch (r.status) {
        case (#Present) { present += 1 };
        case (#Absent)  { absent  += 1 };
        case (#Late)    { late    += 1 };
        case (#Leave)   { leave   += 1 };
      }
    });
    { present; absent; late; leave }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EXAM TIMETABLE
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createExamTimetable(examName : Text, session : Text, classLevel : ClassLevel, schedule : [ExamScheduleEntry]) : async ExamTimetable {
    let id = genId();
    let t : ExamTimetable = { id; examName; session; classLevel; schedule };
    examTimetables.add(id, t);
    t
  };

  public query func getExamTimetables() : async [ExamTimetable] {
    examTimetables.values() |> List.fromIter<ExamTimetable>(_) |> _.toArray()
  };

  public shared func updateExamTimetable(id : Text, examName : Text, session : Text, classLevel : ClassLevel, schedule : [ExamScheduleEntry]) : async () {
    switch (examTimetables.get(id)) {
      case (?t) { examTimetables.add(id, { t with examName; session; classLevel; schedule }) };
      case null {};
    }
  };

  public shared func deleteExamTimetable(id : Text) : async () {
    examTimetables.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EXAM RESULTS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addResult(
    studentId : Text, examTimetableId : Text, scores : [(Text, Nat)],
    totalMarks : Nat, percentage : Float, grade : Text, rank : ?Nat, remarks : ?Text
  ) : async ExamResult {
    let id = genId();
    let r : ExamResult = { id; studentId; examTimetableId; scores; totalMarks; percentage; grade; rank; remarks };
    examResults.add(id, r);
    r
  };

  public query func getResultsByStudent(studentId : Text) : async [ExamResult] {
    examResults.values()
      |> List.fromIter<ExamResult>(_)
      |> _.filter(func(r : ExamResult) : Bool { r.studentId == studentId })
      |> _.toArray()
  };

  public query func getResultsByExam(examTimetableId : Text) : async [ExamResult] {
    examResults.values()
      |> List.fromIter<ExamResult>(_)
      |> _.filter(func(r : ExamResult) : Bool { r.examTimetableId == examTimetableId })
      |> _.toArray()
  };

  public shared func updateResult(
    id : Text, scores : [(Text, Nat)], totalMarks : Nat,
    percentage : Float, grade : Text, rank : ?Nat, remarks : ?Text
  ) : async () {
    switch (examResults.get(id)) {
      case (?r) { examResults.add(id, { r with scores; totalMarks; percentage; grade; rank; remarks }) };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ONLINE EXAMS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createOnlineExam(
    title : Text, classLevel : ClassLevel, subjectId : ?Text, durationMinutes : Nat,
    questions : [MCQQuestion], startTime : ?Text, endTime : ?Text, createdBy : Text
  ) : async OnlineExam {
    let id = genId();
    let e : OnlineExam = { id; title; classLevel; subjectId; durationMinutes; questions; startTime; endTime; createdBy; isActive = true };
    onlineExams.add(id, e);
    e
  };

  public query func getOnlineExams() : async [OnlineExam] {
    onlineExams.values() |> List.fromIter<OnlineExam>(_) |> _.toArray()
  };

  public query func getOnlineExam(id : Text) : async ?OnlineExam {
    onlineExams.get(id)
  };

  public shared func updateOnlineExam(
    id : Text, title : Text, classLevel : ClassLevel, subjectId : ?Text,
    durationMinutes : Nat, questions : [MCQQuestion], startTime : ?Text,
    endTime : ?Text, isActive : Bool
  ) : async () {
    switch (onlineExams.get(id)) {
      case (?e) {
        onlineExams.add(id, { e with title; classLevel; subjectId; durationMinutes; questions; startTime; endTime; isActive })
      };
      case null {};
    }
  };

  public shared func submitExam(
    examId : Text, studentId : Text, answers : [(Text, Nat)], timeTakenSecs : Nat
  ) : async OnlineExamSubmission {
    let exam = switch (onlineExams.get(examId)) {
      case (?e) e;
      case null {
        // Return an empty submission if exam not found — avoids stopping the canister
        let id = genId();
        return {
          id; examId; studentId; answers; score = 0; totalMarks = 0;
          submittedAt = Time.now(); timeTakenSecs;
        }
      };
    };
    var score = 0;
    var total = 0;
    let ansMap = Map.fromArray<Text, Nat>(answers);
    for (q in exam.questions.values()) {
      total += q.marks;
      switch (ansMap.get(q.id)) {
        case (?ans) { if (ans == q.correctOption) { score += q.marks } };
        case null {};
      }
    };
    let id = genId();
    let sub : OnlineExamSubmission = {
      id; examId; studentId; answers; score; totalMarks = total;
      submittedAt = Time.now(); timeTakenSecs;
    };
    examSubmissions.add(id, sub);
    sub
  };

  public query func getExamSubmissions(examId : Text) : async [OnlineExamSubmission] {
    examSubmissions.values()
      |> List.fromIter<OnlineExamSubmission>(_)
      |> _.filter(func(s : OnlineExamSubmission) : Bool { s.examId == examId })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addStaff(
    employeeId : Text, fullName : Text, designation : Text, department : Text,
    mobile : Text, email : ?Text, address : Text, dateOfJoining : Text,
    salary : Nat, photoUrl : ?Text, aadhaarNo : ?Text, bankAccount : ?Text, ifscCode : ?Text
  ) : async { #ok : Staff; #err : Text } {
    // Duplicate employeeId guard
    let existing = staff.values()
      |> List.fromIter<Staff>(_)
      |> _.find(func(s : Staff) : Bool { s.employeeId == employeeId });
    switch (existing) {
      case (?_) { return #err("Employee ID already exists") };
      case null {};
    };
    let id = genId();
    let s : Staff = {
      id; employeeId; fullName; designation; department; mobile; email; address;
      dateOfJoining; salary; status = #Active; photoUrl; aadhaarNo; bankAccount; ifscCode;
      createdAt = Time.now();
    };
    staff.add(id, s);

    // ── Auto-create Staff user account ────────────────────────────────────
    let nameParts = List.fromIter(fullName.split(#char(' '))).toArray();
    let staffUsername : Text = if (nameParts.size() >= 2) {
      (nameParts[0] # "." # nameParts[nameParts.size() - 1]).toLower()
    } else {
      fullName.toLower().replace(#char(' '), "")
    };
    let staffPassword = "Staff@" # employeeId;
    let desigLower = designation.toLower();
    let staffPermissions : [Text] = if (desigLower == "teacher") {
      ["viewAttendance", "manageSubjects", "viewStudents", "viewTimetable"]
    } else if (desigLower == "accountant") {
      ["manageFees", "viewStudents", "viewReports"]
    } else {
      ["viewStudents", "viewReports"]
    };
    let staffUserId = genId();
    let staffUser : UserAccount = {
      id = staffUserId;
      principalId = "staff_" # id;
      username = staffUsername;
      fullName = fullName;
      role = designation;
      position = ?designation;
      classLevel = null;
      sectionId = null;
      staffId = ?id;
      studentId = null;
      isActive = true;
      permissions = staffPermissions;
      createdAt = Time.now();
    };
    userAccounts.add(staffUserId, staffUser);
    autoCreatedCredentials.add(id, { username = staffUsername; password = staffPassword; role = designation });
    // Also register in appUsers so loginUser() can authenticate this staff member
    let staffRole = switch (AuthLib.textToRole(designation)) {
      case (?r) r;
      case null {
        switch (designation.toLower()) {
          case "teacher"    #Teacher;
          case "accountant" #Accountant;
          case "librarian"  #Librarian;
          case "driver"     #Driver;
          case "principal"  #Principal;
          case _            #Teacher;  // safe fallback
        }
      };
    };
    AuthLib.registerUser(appUsers, nextAppUserId, staffUsername, staffPassword, staffRole);

    #ok(s)
  };

  public query func getStaff() : async [Staff] {
    staff.values() |> List.fromIter<Staff>(_) |> _.toArray()
  };

  public query func getStaffById(id : Text) : async ?Staff {
    staff.get(id)
  };

  public shared func updateStaff(
    id : Text, employeeId : Text, fullName : Text, designation : Text, department : Text,
    mobile : Text, email : ?Text, address : Text, dateOfJoining : Text,
    salary : Nat, photoUrl : ?Text, aadhaarNo : ?Text, bankAccount : ?Text, ifscCode : ?Text
  ) : async { #ok : Text; #err : Text } {
    switch (staff.get(id)) {
      case (?s) {
        staff.add(id, {
          s with employeeId; fullName; designation; department; mobile; email; address;
          dateOfJoining; salary; photoUrl; aadhaarNo; bankAccount; ifscCode;
        });
        #ok("Staff updated successfully")
      };
      case null { #err("Staff not found") };
    }
  };

  public shared func deactivateStaff(id : Text) : async () {
    switch (staff.get(id)) {
      case (?s) { staff.add(id, { s with status = #Inactive }) };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TEACHER SUBJECT ASSIGNMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func assignSubject(teacherId : Text, classLevel : ClassLevel, sectionId : ?Text, subjectId : Text, session : Text) : async TeacherSubjectAssignment {
    let id = genId();
    let a : TeacherSubjectAssignment = { id; teacherId; classLevel; sectionId; subjectId; session };
    teacherAssignments.add(id, a);
    a
  };

  public query func getAssignmentsByTeacher(teacherId : Text) : async [TeacherSubjectAssignment] {
    teacherAssignments.values()
      |> List.fromIter<TeacherSubjectAssignment>(_)
      |> _.filter(func(a : TeacherSubjectAssignment) : Bool { a.teacherId == teacherId })
      |> _.toArray()
  };

  public query func getAssignmentsByClass(classLevel : ClassLevel) : async [TeacherSubjectAssignment] {
    teacherAssignments.values()
      |> List.fromIter<TeacherSubjectAssignment>(_)
      |> _.filter(func(a : TeacherSubjectAssignment) : Bool { a.classLevel == classLevel })
      |> _.toArray()
  };

  public shared func removeAssignment(id : Text) : async () {
    teacherAssignments.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYROLL
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func generatePayroll(
    staffId : Text, month : Text, year : Text, basicSalary : Nat,
    presentDays : Nat, totalDays : Nat, deductions : Nat, additions : Nat, generatedBy : Text
  ) : async PayrollRecord {
    let id = genId();
    let netSalary : Nat =
      if (totalDays == 0) { 0 }
      else {
        let earned = basicSalary * presentDays / totalDays;
        if (earned + additions >= deductions) { earned + additions - deductions } else { 0 }
      };
    let r : PayrollRecord = {
      id; staffId; month; year; basicSalary; presentDays; totalDays;
      deductions; additions; netSalary; paymentDate = null; status = #Pending; generatedBy;
    };
    payrollRecords.add(id, r);
    r
  };

  private func _getPayrollByMonth_unused(month : Text, year : Text) : [PayrollRecord] {
    payrollRecords.values()
      |> List.fromIter<PayrollRecord>(_)
      |> _.filter(func(r : PayrollRecord) : Bool { r.month == month and r.year == year })
      |> _.toArray()
  };

  public query func getPayrollByStaff(staffId : Text) : async [PayrollRecord] {
    payrollRecords.values()
      |> List.fromIter<PayrollRecord>(_)
      |> _.filter(func(r : PayrollRecord) : Bool { r.staffId == staffId })
      |> _.toArray()
  };

  public query func getAllPayroll() : async [PayrollRecord] {
    payrollRecords.values() |> List.fromIter<PayrollRecord>(_) |> _.toArray()
  };

  public shared func updatePayrollStatus(id : Text, status : PayrollStatus, paymentDate : ?Text) : async () {
    switch (payrollRecords.get(id)) {
      case (?r) { payrollRecords.add(id, { r with status; paymentDate }) };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSPORT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addRoute(routeName : Text, routeNo : Text, busNo : Text, driverName : Text, driverMobile : Text, capacity : Nat) : async TransportRoute {
    let id = genId();
    let r : TransportRoute = { id; routeName; routeNo; busNo; driverName; driverMobile; capacity };
    routes.add(id, r);
    r
  };

  public query func getRoutes() : async [TransportRoute] {
    routes.values() |> List.fromIter<TransportRoute>(_) |> _.toArray()
  };

  public shared func updateRoute(id : Text, routeName : Text, routeNo : Text, busNo : Text, driverName : Text, driverMobile : Text, capacity : Nat) : async () {
    switch (routes.get(id)) {
      case (?r) { routes.add(id, { r with routeName; routeNo; busNo; driverName; driverMobile; capacity }) };
      case null {};
    }
  };

  public shared func deleteRoute(id : Text) : async () {
    routes.remove(id)
  };

  public shared func addPickupPoint(routeId : Text, name : Text, timing : Text, monthlyFare : Float, order : Nat) : async PickupPoint {
    let id = genId();
    let p : PickupPoint = { id; routeId; name; timing; monthlyFare; order };
    pickupPoints.add(id, p);
    p
  };

  /// Returns all pickup points for a route, sorted by order.
  public query func getPickupPoints(routeId : Text) : async [PickupPoint] {
    pickupPoints.values()
      |> List.fromIter<PickupPoint>(_)
      |> _.filter(func(p : PickupPoint) : Bool { p.routeId == routeId })
      |> _.sort(func(a : PickupPoint, b : PickupPoint) : { #less; #equal; #greater } {
          Nat.compare(a.order, b.order)
        })
      |> _.toArray()
  };

  /// Alias — same as getPickupPoints; provided for frontend clarity.
  public query func getPickupPointsByRoute(routeId : Text) : async [PickupPoint] {
    pickupPoints.values()
      |> List.fromIter<PickupPoint>(_)
      |> _.filter(func(p : PickupPoint) : Bool { p.routeId == routeId })
      |> _.sort(func(a : PickupPoint, b : PickupPoint) : { #less; #equal; #greater } {
          Nat.compare(a.order, b.order)
        })
      |> _.toArray()
  };

  public shared func updatePickupPoint(id : Text, name : Text, timing : Text, monthlyFare : Float, order : Nat) : async () {
    switch (pickupPoints.get(id)) {
      case (?p) { pickupPoints.add(id, { p with name; timing; monthlyFare; order }) };
      case null {};
    }
  };

  public shared func deletePickupPoint(id : Text) : async () {
    pickupPoints.remove(id)
  };

  /// Returns all active students on a route with their pickup point details joined.
  /// Used for the route double-click page and fee collection (pickup point → monthly fare).
  public query func getStudentsWithPickupPointsByRoute(routeId : Text, sessionId : Text) : async [StudentWithPickupPoint] {
    let routeStudents = studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.filter(func(s : Student) : Bool {
          s.session == sessionId and s.status == #Active and (
            switch (s.transportRouteId) {
              case (?rid) rid == routeId;
              case null false;
            }
          )
        });
    routeStudents.map<Student, StudentWithPickupPoint>(func(s : Student) : StudentWithPickupPoint {
      let pp : ?PickupPoint = switch (s.transportPickupPointId) {
        case (?ppId) pickupPoints.get(ppId);
        case null null;
      };
      { student = s; pickupPoint = pp }
    })
    |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createNotification(
    title : Text, message : Text, targetRole : ?Text, targetStudentId : ?Text,
    targetClassLevel : ?ClassLevel, createdBy : Text, notifType : Text
  ) : async Notification {
    let id = genId();
    let n : Notification = {
      id; title; message; targetRole; targetStudentId; targetClassLevel;
      createdBy; createdAt = Time.now(); isRead = false; notifType;
    };
    notifications.add(id, n);
    n
  };

  public query func getNotifications(targetRole : ?Text, targetStudentId : ?Text) : async [Notification] {
    notifications.values()
      |> List.fromIter<Notification>(_)
      |> _.filter(func(n : Notification) : Bool {
          let roleMatch = switch (targetRole) {
            case (?role) {
              switch (n.targetRole) {
                case (?nr) nr == role;
                case null true;
              }
            };
            case null true;
          };
          let sidMatch = switch (targetStudentId) {
            case (?sid) {
              switch (n.targetStudentId) {
                case (?ns) ns == sid;
                case null true;
              }
            };
            case null true;
          };
          roleMatch and sidMatch
        })
      |> _.toArray()
  };

  public shared func markNotificationRead(id : Text) : async () {
    switch (notifications.get(id)) {
      case (?n) { notifications.add(id, { n with isRead = true }) };
      case null {};
    }
  };

  public query func getUnreadCount(targetRole : ?Text) : async Nat {
    notifications.values()
      |> List.fromIter<Notification>(_)
      |> _.filter(func(n : Notification) : Bool {
          let roleMatch = switch (targetRole) {
            case (?role) {
              switch (n.targetRole) {
                case (?nr) nr == role;
                case null true;
              }
            };
            case null true;
          };
          not n.isRead and roleMatch
        })
      |> _.size()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addBook(
    isbn : Text, title : Text, author : Text, publisher : ?Text,
    category : Text, totalCopies : Nat, shelfLocation : ?Text, photoUrl : ?Text
  ) : async Book {
    let id = genId();
    let b : Book = { id; isbn; title; author; publisher; category; totalCopies; availableCopies = totalCopies; shelfLocation; photoUrl };
    books.add(id, b);
    b
  };

  public query func getBooks() : async [Book] {
    books.values() |> List.fromIter<Book>(_) |> _.toArray()
  };

  public shared func updateBook(
    id : Text, isbn : Text, title : Text, author : Text, publisher : ?Text,
    category : Text, totalCopies : Nat, shelfLocation : ?Text, photoUrl : ?Text
  ) : async () {
    switch (books.get(id)) {
      case (?b) { books.add(id, { b with isbn; title; author; publisher; category; totalCopies; shelfLocation; photoUrl }) };
      case null {};
    }
  };

  public shared func deleteBook(id : Text) : async () {
    books.remove(id)
  };

  public shared func issueBook(bookId : Text, studentId : Text, issueDate : Text, dueDate : Text) : async BookIssue {
    let b = switch (books.get(bookId)) {
      case (?b) b;
      case null {
        // Return a placeholder rather than stopping the canister
        return { id = ""; bookId; studentId; issueDate; dueDate; returnDate = null; status = #Issued; fine = 0 }
      };
    };
    if (b.availableCopies == 0) {
      return { id = ""; bookId; studentId; issueDate; dueDate; returnDate = null; status = #Issued; fine = 0 }
    };
    books.add(bookId, { b with availableCopies = Nat.sub(b.availableCopies, 1) });
    let id = genId();
    let issue : BookIssue = { id; bookId; studentId; issueDate; dueDate; returnDate = null; status = #Issued; fine = 0 };
    bookIssues.add(id, issue);
    issue
  };

  public shared func returnBook(issueId : Text, returnDate : Text, fine : Nat) : async () {
    switch (bookIssues.get(issueId)) {
      case (?issue) {
        bookIssues.add(issueId, { issue with returnDate = ?returnDate; status = #Returned; fine });
        switch (books.get(issue.bookId)) {
          case (?b) { books.add(issue.bookId, { b with availableCopies = b.availableCopies + 1 }) };
          case null {};
        }
      };
      case null {};
    }
  };

  public query func getIssuedBooks() : async [BookIssue] {
    bookIssues.values()
      |> List.fromIter<BookIssue>(_)
      |> _.filter(func(i : BookIssue) : Bool { i.status == #Issued })
      |> _.toArray()
  };

  public query func getOverdueBooks() : async [BookIssue] {
    bookIssues.values()
      |> List.fromIter<BookIssue>(_)
      |> _.filter(func(i : BookIssue) : Bool { i.status == #Overdue })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INVENTORY
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addItem(
    name : Text, category : Text, store : Text, unit : Text,
    currentStock : Nat, minStock : Nat, purchasePrice : Nat, salePrice : Nat
  ) : async InventoryItem {
    let id = genId();
    let item : InventoryItem = { id; name; category; store; unit; currentStock; minStock; purchasePrice; salePrice };
    invItems.add(id, item);
    item
  };

  public query func getItems() : async [InventoryItem] {
    invItems.values() |> List.fromIter<InventoryItem>(_) |> _.toArray()
  };

  public shared func updateItem(
    id : Text, name : Text, category : Text, store : Text, unit : Text,
    currentStock : Nat, minStock : Nat, purchasePrice : Nat, salePrice : Nat
  ) : async () {
    switch (invItems.get(id)) {
      case (?item) {
        invItems.add(id, { item with name; category; store; unit; currentStock; minStock; purchasePrice; salePrice })
      };
      case null {};
    }
  };

  public shared func deleteItem(id : Text) : async () {
    invItems.remove(id)
  };

  public shared func addTransaction(
    itemId : Text, transactionType : InvTxType, quantity : Int,
    unitPrice : Nat, totalAmount : Nat, date : Text, remarks : ?Text, createdBy : Text,
    buyerAdmNo : ?Text, buyerName : ?Text, sellerName : ?Text,
    receivedAmount : ?Nat, balanceAmount : ?Nat
  ) : async InventoryTransaction {
    let id = genId();
    let tx : InventoryTransaction = {
      id; itemId; transactionType; quantity; unitPrice; totalAmount; date; remarks; createdBy;
      buyerAdmNo   = switch (buyerAdmNo)   { case (?v) v; case null "" };
      buyerName    = switch (buyerName)    { case (?v) v; case null "" };
      sellerName   = switch (sellerName)   { case (?v) v; case null "" };
      receivedAmount = switch (receivedAmount) { case (?v) v; case null totalAmount };
      balanceAmount  = switch (balanceAmount)  { case (?v) v; case null 0 };
    };
    invTransactions.add(id, tx);
    // Update stock
    switch (invItems.get(itemId)) {
      case (?item) {
        let newStock : Nat = switch (transactionType) {
          case (#Purchase) { item.currentStock + Int.abs(quantity) };
          case (#Sale) {
            let sold = Int.abs(quantity);
            if (item.currentStock >= sold) { item.currentStock - sold } else { 0 }
          };
          case (#Adjustment) {
            let adj = item.currentStock.toInt() + quantity;
            if (adj > 0) { adj.toNat() } else { 0 }
          };
        };
        invItems.add(itemId, { item with currentStock = newStock })
      };
      case null {};
    };
    tx
  };

  public query func getTransactions(itemId : ?Text) : async [InventoryTransaction] {
    invTransactions.values()
      |> List.fromIter<InventoryTransaction>(_)
      |> _.filter(func(tx : InventoryTransaction) : Bool {
          switch (itemId) {
            case (?id) tx.itemId == id;
            case null true;
          }
        })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // USER ACCOUNTS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createUser(
    principalId : Text, username : Text, fullName : Text, role : Text,
    position : ?Text, classLevel : ?ClassLevel, sectionId : ?Text,
    staffId : ?Text, studentId : ?Text, permissions : [Text]
  ) : async { #ok : UserAccount; #err : Text } {
    // Duplicate username guard
    let existing = userAccounts.values()
      |> List.fromIter<UserAccount>(_)
      |> _.find(func(u : UserAccount) : Bool { u.username == username });
    switch (existing) {
      case (?_) { return #err("Username already exists") };
      case null {};
    };
    let id = genId();
    let u : UserAccount = {
      id; principalId; username; fullName; role; position; classLevel; sectionId;
      staffId; studentId; isActive = true; permissions; createdAt = Time.now();
    };
    userAccounts.add(id, u);
    #ok(u)
  };

  public query func getUsers() : async [UserAccount] {
    userAccounts.values() |> List.fromIter<UserAccount>(_) |> _.toArray()
  };

  public query func getUserByPrincipal(principalId : Text) : async ?UserAccount {
    userAccounts.values()
      |> List.fromIter<UserAccount>(_)
      |> _.find(func(u : UserAccount) : Bool { u.principalId == principalId })
  };

  public query func getUser(userId : Text) : async ?UserAccount {
    userAccounts.get(userId)
  };

  public query func getAllUsers() : async [UserAccount] {
    userAccounts.values() |> List.fromIter<UserAccount>(_) |> _.toArray()
  };

  public shared func updateUser(
    id : Text, username : Text, fullName : Text, role : Text,
    position : ?Text, classLevel : ?ClassLevel, sectionId : ?Text,
    staffId : ?Text, studentId : ?Text, isActive : Bool
  ) : async { #ok : Text; #err : Text } {
    switch (userAccounts.get(id)) {
      case (?u) {
        userAccounts.add(id, {
          u with username; fullName; role; position; classLevel; sectionId; staffId; studentId; isActive
        });
        #ok("User updated successfully")
      };
      case null { #err("User not found") };
    }
  };

  public shared func resetUserPassword(username : Text, newPassword : Text) : async { #ok; #err : Text } {
    switch (appUsers.get(username)) {
      case null { #err("User not found") };
      case (?user) {
        appUsers.add(username, { user with passwordHash = AuthLib.doHashPassword(newPassword) });
        #ok
      };
    }
  };

  public shared func updatePermissions(id : Text, permissions : [Text]) : async () {
    switch (userAccounts.get(id)) {
      case (?u) { userAccounts.add(id, { u with permissions }) };
      case null {};
    }
  };

  /// Returns the auto-created credentials for a student or staff by entityId.
  /// Pass "par_<studentId>" to get the parent credentials for a student.
  public query func getAutoCreatedCredentials(entityId : Text) : async ?{ username : Text; password : Text; role : Text } {
    autoCreatedCredentials.get(entityId)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addAuditLog(userId : Text, action : Text, moduleName : Text, details : Text) : async AuditLog {
    let id = genId();
    let log : AuditLog = { id; userId; action; moduleName; details; timestamp = Time.now() };
    auditLogs.add(id, log);
    log
  };

  public query func getAuditLogs(moduleName : ?Text, limit : Nat) : async [AuditLog] {
    let all = auditLogs.values()
      |> List.fromIter<AuditLog>(_)
      |> _.filter(func(l : AuditLog) : Bool {
          switch (moduleName) {
            case (?m) l.moduleName == m;
            case null true;
          }
        });
    let sz = all.size();
    let start : Int = sz.toInt() - limit.toInt();
    let fromIdx = if (start < 0) { 0 } else { start.toNat() };
    all.sliceToArray(fromIdx, sz)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPENSES
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addExpenseHead(name : Text, headType : ExpHeadType, description : ?Text) : async ExpenseHead {
    let id = genId();
    let h : ExpenseHead = { id; name; headType; description };
    expenseHeads.add(id, h);
    h
  };

  public query func getExpenseHeads() : async [ExpenseHead] {
    expenseHeads.values() |> List.fromIter<ExpenseHead>(_) |> _.toArray()
  };

  public shared func updateExpenseHead(id : Text, name : Text, headType : ExpHeadType, description : ?Text) : async () {
    switch (expenseHeads.get(id)) {
      case (?h) { expenseHeads.add(id, { h with name; headType; description }) };
      case null {};
    }
  };

  public shared func addExpenseEntry(
    headId : Text, amount : Nat, description : Text,
    date : Text, receipt : ?Text, createdBy : Text
  ) : async ExpenseEntry {
    let id = genId();
    let e : ExpenseEntry = { id; headId; amount; description; date; receipt; createdBy; createdAt = Time.now() };
    expenseEntries.add(id, e);
    e
  };

  public query func getExpenseEntries(headId : ?Text) : async [ExpenseEntry] {
    expenseEntries.values()
      |> List.fromIter<ExpenseEntry>(_)
      |> _.filter(func(e : ExpenseEntry) : Bool {
          switch (headId) {
            case (?h) e.headId == h;
            case null true;
          }
        })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HOMEWORK
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addHomework(
    classLevel : ClassLevel, sectionId : ?Text, subjectId : Text,
    title : Text, description : Text, dueDate : Text, createdBy : Text, attachmentUrl : ?Text
  ) : async HomeworkEntry {
    let id = genId();
    let hw : HomeworkEntry = {
      id; classLevel; sectionId; subjectId; title; description; dueDate;
      createdBy; createdAt = Time.now(); attachmentUrl;
    };
    homework.add(id, hw);
    hw
  };

  public query func getHomework(classLevel : ?ClassLevel) : async [HomeworkEntry] {
    homework.values()
      |> List.fromIter<HomeworkEntry>(_)
      |> _.filter(func(hw : HomeworkEntry) : Bool {
          switch (classLevel) {
            case (?cl) hw.classLevel == cl;
            case null true;
          }
        })
      |> _.toArray()
  };

  public shared func updateHomework(
    id : Text, title : Text, description : Text, dueDate : Text, attachmentUrl : ?Text
  ) : async () {
    switch (homework.get(id)) {
      case (?hw) { homework.add(id, { hw with title; description; dueDate; attachmentUrl }) };
      case null {};
    }
  };

  public shared func deleteHomework(id : Text) : async () {
    homework.remove(id)
  };

  public shared func submitHomework(
    homeworkId : Text, studentId : Text, content : ?Text, attachmentUrl : ?Text
  ) : async HomeworkSubmission {
    let id = genId();
    let sub : HomeworkSubmission = {
      id; homeworkId; studentId; submittedAt = Time.now();
      content; attachmentUrl; grade = null; feedback = null;
    };
    hwSubmissions.add(id, sub);
    sub
  };

  public query func getSubmissions(homeworkId : Text) : async [HomeworkSubmission] {
    hwSubmissions.values()
      |> List.fromIter<HomeworkSubmission>(_)
      |> _.filter(func(s : HomeworkSubmission) : Bool { s.homeworkId == homeworkId })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALUMNI
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addAlumni(
    fullName : Text, graduationYear : Text, className : Text,
    currentOccupation : ?Text, currentCity : ?Text,
    mobile : ?Text, email : ?Text, photoUrl : ?Text
  ) : async AlumniRecord {
    let id = genId();
    let a : AlumniRecord = { id; fullName; graduationYear; className; currentOccupation; currentCity; mobile; email; photoUrl };
    alumni.add(id, a);
    a
  };

  public query func getAlumni() : async [AlumniRecord] {
    alumni.values() |> List.fromIter<AlumniRecord>(_) |> _.toArray()
  };

  public shared func updateAlumni(
    id : Text, fullName : Text, graduationYear : Text, className : Text,
    currentOccupation : ?Text, currentCity : ?Text,
    mobile : ?Text, email : ?Text, photoUrl : ?Text
  ) : async () {
    switch (alumni.get(id)) {
      case (?a) {
        alumni.add(id, { a with fullName; graduationYear; className; currentOccupation; currentCity; mobile; email; photoUrl })
      };
      case null {};
    }
  };

  public shared func deleteAlumni(id : Text) : async () {
    alumni.remove(id)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func createChatRoom(name : Text, roomType : ChatRoomType, members : [Text], createdBy : Text) : async ChatRoom {
    let id = genId();
    let room : ChatRoom = { id; name; roomType; members; createdBy; createdAt = Time.now() };
    chatRooms.add(id, room);
    room
  };

  public query func getChatRooms(memberId : ?Text) : async [ChatRoom] {
    chatRooms.values()
      |> List.fromIter<ChatRoom>(_)
      |> _.filter(func(r : ChatRoom) : Bool {
          switch (memberId) {
            case (?mid) {
              List.fromIter(r.members.values()) |> _.any(func(m : Text) : Bool { m == mid })
            };
            case null true;
          }
        })
      |> _.toArray()
  };

  public shared func sendMessage(roomId : Text, senderId : Text, content : Text, attachmentUrl : ?Text) : async ChatMessage {
    let id = genId();
    let msg : ChatMessage = { id; roomId; senderId; content; attachmentUrl; sentAt = Time.now(); isDeleted = false };
    chatMessages.add(id, msg);
    msg
  };

  public query func getMessages(roomId : Text) : async [ChatMessage] {
    chatMessages.values()
      |> List.fromIter<ChatMessage>(_)
      |> _.filter(func(m : ChatMessage) : Bool { m.roomId == roomId and not m.isDeleted })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIRTUAL CLASSES
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func scheduleVirtualClass(
    title : Text, classLevel : ClassLevel, subjectId : ?Text,
    platform : VirtualPlatform, meetingLink : Text, scheduledAt : Text,
    durationMinutes : Nat, createdBy : Text
  ) : async VirtualClass {
    let id = genId();
    let vc : VirtualClass = {
      id; title; classLevel; subjectId; platform; meetingLink;
      scheduledAt; durationMinutes; createdBy; isCompleted = false;
    };
    virtualClasses.add(id, vc);
    vc
  };

  public query func getVirtualClasses(classLevel : ?ClassLevel) : async [VirtualClass] {
    virtualClasses.values()
      |> List.fromIter<VirtualClass>(_)
      |> _.filter(func(vc : VirtualClass) : Bool {
          switch (classLevel) {
            case (?cl) vc.classLevel == cl;
            case null true;
          }
        })
      |> _.toArray()
  };

  public shared func updateVirtualClass(id : Text, title : Text, scheduledAt : Text, meetingLink : Text, durationMinutes : Nat, isCompleted : Bool) : async () {
    switch (virtualClasses.get(id)) {
      case (?vc) {
        virtualClasses.add(id, { vc with title; scheduledAt; meetingLink; durationMinutes; isCompleted })
      };
      case null {};
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CERTIFICATE TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // UPI PAYMENT SUBMISSIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Student or parent submits a UPI payment with UTR for admin verification.
  public shared func submitUpiPayment(
    studentId   : Text,
    amount      : Nat,
    utrNumber   : Text,
    submittedAt : Text,
  ) : async { #ok : Text; #err : Text } {
    if (utrNumber == "") { return #err("UTR number cannot be empty") };
    switch (upiPaymentSubmissions.get(utrNumber)) {
      case (?_) { return #err("UTR number already submitted") };
      case null {};
    };
    let sub : UpiPaymentSubmission = {
      utrNumber; studentId; amount; submittedAt;
      status = "pending"; verifiedBy = null; verifiedAt = null;
    };
    upiPaymentSubmissions.add(utrNumber, sub);
    #ok("UPI payment submitted successfully. UTR: " # utrNumber)
  };

  /// Admin verifies a UPI payment and records it as a fee payment.
  public shared func verifyUpiPayment(
    utrNumber  : Text,
    verifiedBy : Text,
    verifiedAt : Text,
  ) : async { #ok : Text; #err : Text } {
    switch (upiPaymentSubmissions.get(utrNumber)) {
      case (?sub) {
        if (sub.status != "pending") {
          return #err("Payment already " # sub.status)
        };
        upiPaymentSubmissions.add(utrNumber, {
          sub with status = "verified"; verifiedBy = ?verifiedBy; verifiedAt = ?verifiedAt
        });
        #ok("Payment verified for student " # sub.studentId)
      };
      case null { #err("UTR number not found") };
    }
  };

  /// Returns all UPI payment submissions for a specific student.
  public query func getUpiPaymentsByStudent(studentId : Text) : async [UpiPaymentSubmission] {
    upiPaymentSubmissions.values()
      |> List.fromIter<UpiPaymentSubmission>(_)
      |> _.filter(func(s : UpiPaymentSubmission) : Bool { s.studentId == studentId })
      |> _.toArray()
  };

  /// Returns all pending UPI payment submissions (for admin verification panel).
  public query func getPendingUpiPayments() : async [UpiPaymentSubmission] {
    upiPaymentSubmissions.values()
      |> List.fromIter<UpiPaymentSubmission>(_)
      |> _.filter(func(s : UpiPaymentSubmission) : Bool { s.status == "pending" })
      |> _.toArray()
  };

  /// Returns all UPI payment submissions (any status) — for admin full view.
  public query func getAllUpiPayments() : async [UpiPaymentSubmission] {
    upiPaymentSubmissions.values() |> List.fromIter<UpiPaymentSubmission>(_) |> _.toArray()
  };

  /// Returns the school's UPI ID (stored in appSettings.upiId).
  public query func getSchoolUpiId() : async ?Text {
    appSettings.upiId
  };

  /// Sets the school's UPI ID (convenience wrapper around updateSettings).
  public shared func setSchoolUpiId(upiId : Text) : async () {
    appSettings := { appSettings with upiId = ?upiId }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GPAY / UPI PAYMENT INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Stores confirmed GPay/UPI callback records, keyed by transactionId.
  let gpayCallbacks = Map.empty<Text, { transactionId : Text; studentId : Text; utrNo : Text; amount : Float; status : Text; confirmedAt : Int }>();

  /// Generates a UPI deep-link for GPay / any UPI app.
  /// Returns: upi://pay?pa=UPIID&pn=SCHOOLNAME&am=AMOUNT&cu=INR&tn=FeePayment
  public query func initiateGPayPayment(studentId : Text, amount : Float, _mobileNo : Text) : async { #ok : Text; #err : Text } {
    switch (appSettings.upiId) {
      case null { #err("School UPI ID not configured. Please set it in Settings.") };
      case (?upiId) {
        let schoolName = schoolInfo.name;
        let amtText = amount.toText();
        let txNote = "FeePayment_" # studentId;
        let link = "upi://pay?pa=" # upiId
          # "&pn=" # schoolName
          # "&am=" # amtText
          # "&cu=INR"
          # "&tn=" # txNote;
        #ok(link)
      };
    }
  };

  /// Records a GPay payment confirmation (called after frontend polls for status
  /// or receives a callback). Marks the submission as confirmed.
  public shared func handleGPayCallback(
    transactionId : Text,
    studentId      : Text,
    status         : Text,
    utrNo          : Text,
    amount         : Float,
  ) : async { #ok : Text; #err : Text } {
    if (transactionId == "") { return #err("transactionId cannot be empty") };
    gpayCallbacks.add(transactionId, {
      transactionId; studentId; utrNo; amount;
      status; confirmedAt = Time.now();
    });
    // If status is SUCCESS and a matching pending UPI submission exists, auto-verify it
    if (status == "SUCCESS" and utrNo != "") {
      switch (upiPaymentSubmissions.get(utrNo)) {
        case (?sub) {
          if (sub.status == "pending") {
            upiPaymentSubmissions.add(utrNo, {
              sub with status = "verified";
              verifiedBy = ?"GPay-Callback";
              verifiedAt = ?(Time.now().toText());
            })
          }
        };
        case null {};
      }
    };
    #ok("GPay callback recorded for transaction " # transactionId)
  };

  /// Admin confirms a payment by UTR number (for manual GPay / UPI bank transfers).
  public shared func confirmPaymentByUtr(
    studentId   : Text,
    utrNumber   : Text,
    amount      : Float,
    collectedBy : Text,
  ) : async { #ok : Text; #err : Text } {
    if (utrNumber == "") { return #err("UTR number cannot be empty") };
    switch (upiPaymentSubmissions.get(utrNumber)) {
      case (?sub) {
        if (sub.studentId != studentId) {
          return #err("UTR number belongs to a different student")
        };
        if (sub.status == "verified") {
          return #err("Payment already verified")
        };
        upiPaymentSubmissions.add(utrNumber, {
          sub with status = "verified";
          verifiedBy = ?collectedBy;
          verifiedAt = ?(Time.now().toText());
        });
        #ok("Payment confirmed. UTR: " # utrNumber # ", Amount: " # amount.toText())
      };
      case null {
        // No pending submission — create a new verified record directly
        let sub : UpiPaymentSubmission = {
          utrNumber; studentId;
          amount = if (amount >= 0.0) { amount.toInt().toNat() } else { 0 };
          submittedAt = Time.now().toText();
          status = "verified";
          verifiedBy = ?collectedBy;
          verifiedAt = ?(Time.now().toText());
        };
        upiPaymentSubmissions.add(utrNumber, sub);
        #ok("Payment confirmed and recorded. UTR: " # utrNumber)
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — PAYOUT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addStaffPayout(
    staffId : Text, amount : Float, mode : Text,
    date : Text, notes : Text, recordedBy : Text
  ) : async { #ok : Text; #err : Text } {
    if (amount <= 0.0) { return #err("Amount must be positive") };
    let id = Time.now().toText() # staffId;
    let p : StaffPayout = { id; staffId; amount; mode; date; notes; recordedBy; createdAt = Time.now() };
    staffPayouts.add(id, p);
    #ok(id)
  };

  public query func getStaffPayouts(staffId : Text) : async [StaffPayout] {
    staffPayouts.values()
      |> List.fromIter<StaffPayout>(_)
      |> _.filter(func(p : StaffPayout) : Bool { p.staffId == staffId })
      |> _.toArray()
  };

  public query func getStaffPayoutsByMonth(staffId : Text, month : Text) : async [StaffPayout] {
    // month is YYYY-MM; date field is dd/mm/yyyy — extract mm/yyyy for matching
    let ymParts = month.split(#char('-')) |> List.fromIter(_).toArray();
    let (matchMM, matchYYYY) : (Text, Text) = if (ymParts.size() == 2) {
      (ymParts[1], ymParts[0])  // (mm, yyyy)
    } else { ("", "") };
    staffPayouts.values()
      |> List.fromIter<StaffPayout>(_)
      |> _.filter(func(p : StaffPayout) : Bool {
          if (p.staffId != staffId) { return false };
          if (matchMM == "") { return true };
           let parts = p.date.split(#char('/')) |> List.fromIter(_).toArray();
          parts.size() == 3 and parts[1] == matchMM and parts[2] == matchYYYY
        })
      |> _.toArray()
  };

  public shared func deleteStaffPayout(payoutId : Text) : async { #ok : Text; #err : Text } {
    switch (staffPayouts.get(payoutId)) {
      case (?_) { staffPayouts.remove(payoutId); #ok("Payout deleted") };
      case null { #err("Payout not found") };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — INCENTIVE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addStaffIncentive(
    staffId : Text, amount : Float, reason : Text,
    month : Text, approvedBy : Text
  ) : async { #ok : Text; #err : Text } {
    if (amount <= 0.0) { return #err("Amount must be positive") };
    let ymParts = month.split(#char('-')) |> List.fromIter(_).toArray();
    let year : Text = if (ymParts.size() > 0) { ymParts[0] } else { "" };
    let id = Time.now().toText() # "inc" # staffId;
    let inc : StaffIncentive = { id; staffId; amount; reason; month; year; approvedBy; createdAt = Time.now() };
    staffIncentives.add(id, inc);
    #ok(id)
  };

  public query func getStaffIncentives(staffId : Text) : async [StaffIncentive] {
    staffIncentives.values()
      |> List.fromIter<StaffIncentive>(_)
      |> _.filter(func(i : StaffIncentive) : Bool { i.staffId == staffId })
      |> _.toArray()
  };

  public query func getStaffIncentivesByMonth(staffId : Text, month : Text) : async [StaffIncentive] {
    staffIncentives.values()
      |> List.fromIter<StaffIncentive>(_)
      |> _.filter(func(i : StaffIncentive) : Bool { i.staffId == staffId and i.month == month })
      |> _.toArray()
  };

  public shared func deleteStaffIncentive(incentiveId : Text) : async { #ok : Text; #err : Text } {
    switch (staffIncentives.get(incentiveId)) {
      case (?_) { staffIncentives.remove(incentiveId); #ok("Incentive deleted") };
      case null { #err("Incentive not found") };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — LOAN MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addStaffLoan(
    staffId : Text, principalAmount : Float,
    monthlyDeduction : Float, startMonth : Text, notes : Text
  ) : async { #ok : Text; #err : Text } {
    if (principalAmount <= 0.0) { return #err("Principal amount must be positive") };
    let id = Time.now().toText() # "loan" # staffId;
    let l : StaffLoan = {
      id; staffId; principalAmount;
      remainingAmount = principalAmount;
      monthlyDeduction; startMonth; notes;
      createdAt = Time.now();
    };
    staffLoans.add(id, l);
    #ok(id)
  };

  public query func getStaffLoans(staffId : Text) : async [StaffLoan] {
    staffLoans.values()
      |> List.fromIter<StaffLoan>(_)
      |> _.filter(func(l : StaffLoan) : Bool { l.staffId == staffId })
      |> _.toArray()
  };

  public shared func updateLoanRepayment(loanId : Text, amountPaid : Float) : async { #ok : Text; #err : Text } {
    switch (staffLoans.get(loanId)) {
      case (?l) {
        let newRemaining = if (l.remainingAmount > amountPaid) { l.remainingAmount - amountPaid } else { 0.0 };
        staffLoans.add(loanId, { l with remainingAmount = newRemaining });
        #ok("Loan updated. Remaining: " # newRemaining.toText())
      };
      case null { #err("Loan not found") };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — SALARY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func updateStaffSalary(staffId : Text, basicSalary : Nat) : async { #ok : Text; #err : Text } {
    switch (staff.get(staffId)) {
      case (?s) {
        staff.add(staffId, { s with salary = basicSalary });
        #ok("Salary updated")
      };
      case null { #err("Staff not found") };
    }
  };

  public query func getStaffSalary(staffId : Text) : async ?Float {
    switch (staff.get(staffId)) {
      case (?s) ?(s.salary.toFloat());
      case null null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — ENHANCED PAYROLL CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Helper: parse month string "YYYY-MM" into (month: Nat, year: Nat). Returns (0,0) on failure.
  func parseYYYYMM(m : Text) : (Nat, Nat) {
    let parts = m.split(#char('-')) |> List.fromIter(_).toArray();
    if (parts.size() != 2) { return (0, 0) };
    let yearOpt = Nat.fromText(parts[0]);
    let monthOpt = Nat.fromText(parts[1]);
    switch (yearOpt, monthOpt) {
      case (?y, ?mo) (mo, y);
      case _ (0, 0);
    }
  };

  /// Calculates the enhanced payroll for a staff member for a specific month.
  /// workingDays: total working days in that month (provided by caller / admin).
  public shared func calculateEnhancedPayroll(
    staffId : Text, month : Text, workingDays : Float
  ) : async { #ok : EnhancedPayrollRecord; #err : Text } {
    let staffMember = switch (staff.get(staffId)) {
      case (?s) s;
      case null { return #err("Staff not found") };
    };
    let basicSalary : Float = staffMember.salary.toFloat();
    let (targetMonth, targetYear) = parseYYYYMM(month);

    // Count unique attendance dates for this staff member in the target month/year
    let uniqueDates = Set.empty<Text>();
    staffAttendance.values()
      |> List.fromIter<DeviceAttTypes.StaffAttendanceRecord>(_)
      |> _.filter(func(r : DeviceAttTypes.StaffAttendanceRecord) : Bool {
          r.staffId == staffId and r.month == targetMonth and r.year == targetYear
        })
      |> _.forEach(func(r : DeviceAttTypes.StaffAttendanceRecord) {
          uniqueDates.add(r.date)
        });
    let presentDays : Float = uniqueDates.size().toFloat();

    let safeWorkingDays : Float = if (workingDays <= 0.0) { 1.0 } else { workingDays };
    let absentDays : Float = if (safeWorkingDays > presentDays) { safeWorkingDays - presentDays } else { 0.0 };

    // Leave policy: 1 free leave per month
    let deductibleDays : Float = if (absentDays <= 1.0) { 0.0 } else { absentDays - 1.0 };
    let perDaySalary : Float = basicSalary / safeWorkingDays;
    let salaryDeduction : Float = perDaySalary * deductibleDays;
    let grossSalary : Float = basicSalary - salaryDeduction;

    // Incentives for this month
    let incentivesTotal : Float = staffIncentives.values()
      |> List.fromIter<StaffIncentive>(_)
      |> _.filter(func(i : StaffIncentive) : Bool { i.staffId == staffId and i.month == month })
      |> _.foldLeft<Float, StaffIncentive>(0.0, func(acc, i) { acc + i.amount });

    // Active loan deduction (first active loan only)
    let loanDeduction : Float = switch (
      staffLoans.values()
        |> List.fromIter<StaffLoan>(_)
        |> _.find(func(l : StaffLoan) : Bool { l.staffId == staffId and l.remainingAmount > 0.0 })
    ) {
      case (?l) l.monthlyDeduction;
      case null 0.0;
    };

    // Payouts already recorded for this month
    let (targetMonthN, targetYearN) = (targetMonth, targetYear);
    let monthPayouts = staffPayouts.values()
      |> List.fromIter<StaffPayout>(_)
      |> _.filter(func(p : StaffPayout) : Bool {
          if (p.staffId != staffId) { return false };
           let parts = p.date.split(#char('/')) |> List.fromIter(_).toArray();
          if (parts.size() != 3) { return false };
          let pm = Nat.fromText(parts[1]);
          let py = Nat.fromText(parts[2]);
          switch (pm, py) {
            case (?m2, ?y2) m2 == targetMonthN and y2 == targetYearN;
            case _ false;
          }
        })
      |> _.toArray();

    let advancePaid : Float = List.fromIter<StaffPayout>(monthPayouts.values())
      |> _.foldLeft<Float, StaffPayout>(0.0, func(acc, p) { acc + p.amount });

    let netSalary : Float = grossSalary + incentivesTotal - loanDeduction;

    // Payment status
    let paymentStatus : Text =
      if (advancePaid >= netSalary and netSalary > 0.0) { "Paid" }
      else if (advancePaid > 0.0 and advancePaid < netSalary) { "Partial" }
      else if (advancePaid == 0.0) { "Pending" }
      else { "Pending" };

    let recId = staffId # "#" # month;
    let rec : EnhancedPayrollRecord = {
      id            = recId;
      staffId;
      month;
      grossSalary;
      deductions    = salaryDeduction;
      incentives    = incentivesTotal;
      loanDeduction;
      advancePaid;
      netSalary;
      attendanceDays = presentDays;
      workingDays   = safeWorkingDays;
      absentDays;
      deductibleDays;
      payouts       = monthPayouts;
      paymentStatus;
      payslipNotes  = "";
      generatedAt   = Time.now();
    };
    enhancedPayroll.add(recId, rec);
    #ok(rec)
  };

  public query func getEnhancedPayroll(staffId : Text, month : Text) : async ?EnhancedPayrollRecord {
    enhancedPayroll.get(staffId # "#" # month)
  };

  public query func getEnhancedPayrollByMonth(month : Text) : async [EnhancedPayrollRecord] {
    enhancedPayroll.values()
      |> List.fromIter<EnhancedPayrollRecord>(_)
      |> _.filter(func(r : EnhancedPayrollRecord) : Bool { r.month == month })
      |> _.toArray()
  };

  /// Returns month-by-month payment summary for a staff member.
  /// netSalary is wrapped in ?Float — frontend hides amount for non-admin roles.
  public query func getStaffPaymentSummary(staffId : Text) : async [StaffPaymentSummaryEntry] {
    enhancedPayroll.values()
      |> List.fromIter<EnhancedPayrollRecord>(_)
      |> _.filter(func(r : EnhancedPayrollRecord) : Bool { r.staffId == staffId })
      |> _.map<EnhancedPayrollRecord, StaffPaymentSummaryEntry>(func(r) : StaffPaymentSummaryEntry {
          {
            month      = r.month;
            status     = r.paymentStatus;
            amountPaid = r.advancePaid;
            netSalary  = ?r.netSalary;
          }
        })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STAFF PAYMENT SYSTEM — YEAR-END SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public query func getStaffYearEndSummary(staffId : Text, yearArg : Text) : async StaffYearEndSummary {
    var totalEarned : Float = 0.0;
    var totalPaid : Float = 0.0;
    var totalIncentives : Float = 0.0;
    var totalDeductions : Float = 0.0;
    var fullyPaid : Nat = 0;
    var partiallyPaid : Nat = 0;
    var unpaid : Nat = 0;

    enhancedPayroll.values()
      |> List.fromIter<EnhancedPayrollRecord>(_)
      |> _.filter(func(r : EnhancedPayrollRecord) : Bool {
          if (r.staffId != staffId) { return false };
           let parts = r.month.split(#char('-')) |> List.fromIter(_).toArray();
          parts.size() > 0 and parts[0] == yearArg
        })
      |> _.forEach(func(r : EnhancedPayrollRecord) {
          totalEarned     += r.netSalary;
          totalPaid       += r.advancePaid;
          totalIncentives += r.incentives;
          totalDeductions += r.deductions + r.loanDeduction;
          switch (r.paymentStatus) {
            case ("Paid")    { fullyPaid     += 1 };
            case ("Partial") { partiallyPaid += 1 };
            case _           { unpaid        += 1 };
          }
        });
    {
      totalEarned;
      totalPaid;
      totalIncentives;
      totalDeductions;
      monthsFullyPaid     = fullyPaid;
      monthsPartiallyPaid = partiallyPaid;
      monthsUnpaid        = unpaid;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBJECT CLASS MAP - extra query alias
  // ═══════════════════════════════════════════════════════════════════════════

  /// Returns the assigned class levels for a single subject (by subject ID).
  public query func getSubjectClassMapById(subjectId : Text) : async ?[ClassLevel] {
    switch (subjectClassMaps.get(subjectId)) {
      case (?scm) ?scm.classLevels;
      case null null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CERTIFICATE TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func saveTemplate(templateType : Text, name : Text, layoutJson : Text, createdBy : Text) : async CertificateTemplate {
    let id = genId();
    let t : CertificateTemplate = { id; templateType; name; layoutJson; isDefault = false; createdBy; updatedAt = Time.now() };
    certTemplates.add(id, t);
    t
  };

  public query func getTemplates() : async [CertificateTemplate] {
    certTemplates.values() |> List.fromIter<CertificateTemplate>(_) |> _.toArray()
  };

  public query func getTemplatesByType(templateType : Text) : async [CertificateTemplate] {
    certTemplates.values()
      |> List.fromIter<CertificateTemplate>(_)
      |> _.filter(func(t : CertificateTemplate) : Bool { t.templateType == templateType })
      |> _.toArray()
  };

  public shared func setDefaultTemplate(id : Text) : async () {
    let templateTypeOpt = switch (certTemplates.get(id)) {
      case (?t) ?t.templateType;
      case null null;
    };
    switch (templateTypeOpt) {
      case (?templateType) {
        // Clear default for same type, set new default
        certTemplates.forEach(func(k, t) {
          if (t.templateType == templateType) {
            certTemplates.add(k, { t with isDefault = (k == id); updatedAt = Time.now() })
          }
        })
      };
      case null {};
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // ACADEMIC CALENDAR — HOLIDAYS
  // ═══════════════════════════════════════════════════════════════════════════

  public shared func addHoliday(
    name : Text, date : Text, description : Text, isRecurring : Bool
  ) : async Holiday {
    let id = genId();
    let h : Holiday = { id; name; date; description; isRecurring; createdAt = Time.now() };
    holidays.add(id, h);
    h
  };

  public shared func updateHoliday(
    id : Text, name : Text, date : Text, description : Text, isRecurring : Bool
  ) : async Bool {
    switch (holidays.get(id)) {
      case (?h) {
        holidays.add(id, { h with name; date; description; isRecurring });
        true
      };
      case null false;
    }
  };

  public shared func deleteHoliday(id : Text) : async Bool {
    switch (holidays.get(id)) {
      case (?_) { holidays.remove(id); true };
      case null false;
    }
  };

  /// Returns all holidays. sessionId parameter is accepted for API consistency but
  /// holidays are not session-scoped in this implementation.
  public query func getHolidays(_sessionId : ?Text) : async [Holiday] {
    holidays.values() |> List.fromIter<Holiday>(_) |> _.toArray()
  };

  /// Count Sundays between two dd/mm/yyyy dates (inclusive).
  /// Both dates must be valid; returns 0 on parse failure.
  func countSundaysBetween(fromDate : Text, toDate : Text) : Nat {
    // Parse dd/mm/yyyy -> days since epoch (approx, using Gregorian)
    func parseDMY(d : Text) : ?Int {
      let parts = d.split(#char('/')) |> List.fromIter(_).toArray();
      if (parts.size() != 3) { return null };
      switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
        case (?day, ?month, ?year) {
          // Zeller-style days since 1970-01-01 (approximate)
          let y : Int = if (month <= 2) { year.toInt() - 1 } else { year.toInt() };
          let m : Int = if (month.toInt() <= 2) { month.toInt() + 12 } else { month.toInt() };
          let d2 : Int = day.toInt() + (153 * (m - 3) + 2) / 5 + 365 * y
            + y / 4 - y / 100 + y / 400 - 719469;
          ?d2
        };
        case _ null;
      }
    };
    switch (parseDMY(fromDate), parseDMY(toDate)) {
      case (?from, ?to) {
        if (to < from) { return 0 };
        let totalDays : Int = to - from + 1;
        // Day of week for fromDate: 0=Mon..6=Sun (Unix epoch Jan 1 1970 is Thursday=3)
        let fromDOW : Int = (from + 3) % 7; // 6 = Sunday
        // Count Sundays: first sunday offset
        let firstSunOffset : Int = (6 - fromDOW + 7) % 7;
        if (firstSunOffset >= totalDays) { return 0 };
        let remainingAfterFirst : Int = totalDays - firstSunOffset - 1;
        let sundays : Int = 1 + remainingAfterFirst / 7;
        if (sundays < 0) { 0 } else { Int.abs(sundays) }
      };
      case _ 0;
    }
  };

  /// Count working days between two dates (inclusive), excluding Sundays and all stored holidays.
  public query func calculateWorkingDays(_sessionId : Text, fromDate : Text, toDate : Text) : async Nat {
    // Get total calendar days
    func parseDMY2(d : Text) : ?Int {
      let parts = d.split(#char('/')) |> List.fromIter(_).toArray();
      if (parts.size() != 3) { return null };
      switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
        case (?day, ?month, ?year) {
          let y : Int = if (month <= 2) { year.toInt() - 1 } else { year.toInt() };
          let m : Int = if (month.toInt() <= 2) { month.toInt() + 12 } else { month.toInt() };
          ?(day.toInt() + (153 * (m - 3) + 2) / 5 + 365 * y
            + y / 4 - y / 100 + y / 400 - 719469)
        };
        case _ null;
      }
    };
    switch (parseDMY2(fromDate), parseDMY2(toDate)) {
      case (?from, ?to) {
        if (to < from) { return 0 };
        let totalDays : Int = to - from + 1;
        let sundayCount : Int = countSundaysBetween(fromDate, toDate).toInt();
        // Count unique holiday dates that are not Sundays (simple string match)
        let holidayDatesSet = Set.empty<Text>();
        holidays.values() |> List.fromIter<Holiday>(_)
          |> _.forEach(func(h : Holiday) {
              let hParts = h.date.split(#char('/')) |> List.fromIter(_).toArray();
              if (hParts.size() == 3) {
                switch (parseDMY2(h.date)) {
                  case (?hd) {
                    if (hd >= from and hd <= to) {
                      // Skip if Sunday (already counted)
                      let dow : Int = (hd + 3) % 7;
                      if (dow != 6) { holidayDatesSet.add(h.date) }
                    }
                  };
                  case null {};
                }
              }
            });
        let holidayCount : Int = holidayDatesSet.size().toInt();
        let working : Int = totalDays - sundayCount - holidayCount;
        if (working <= 0) { 0 } else { Int.abs(working) }
      };
      case _ 0;
    }
  };

  /// Academic calendar stats for a session: total days, sundays, holidays, working days.
  public query func getAcademicCalendarStats(sessionId : Text) : async {
    totalDays   : Nat;
    sundays     : Nat;
    holidays    : Nat;
    workingDays : Nat;
  } {
    // Find session start/end dates
    switch (sessions.get(sessionId)) {
      case (?sess) {
        func parseDMY3(d : Text) : ?Int {
          let parts = d.split(#char('/')) |> List.fromIter(_).toArray();
          if (parts.size() != 3) { return null };
          switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
            case (?day, ?month, ?year) {
              let y : Int = if (month <= 2) { year.toInt() - 1 } else { year.toInt() };
              let m : Int = if (month.toInt() <= 2) { month.toInt() + 12 } else { month.toInt() };
              ?(day.toInt() + (153 * (m - 3) + 2) / 5 + 365 * y
                + y / 4 - y / 100 + y / 400 - 719469)
            };
            case _ null;
          }
        };
        switch (parseDMY3(sess.startDate), parseDMY3(sess.endDate)) {
          case (?from, ?to) {
            if (to < from) { return { totalDays = 0; sundays = 0; holidays = 0; workingDays = 0 } };
            let totalDays : Int = to - from + 1;
            let sundayCount = countSundaysBetween(sess.startDate, sess.endDate);
            // Count unique non-Sunday holidays in range
            let holidayDatesSet = Set.empty<Text>();
            holidays.values() |> List.fromIter<Holiday>(_)
              |> _.forEach(func(h : Holiday) {
                  switch (parseDMY3(h.date)) {
                    case (?hd) {
                      if (hd >= from and hd <= to) {
                        let dow : Int = (hd + 3) % 7;
                        if (dow != 6) { holidayDatesSet.add(h.date) }
                      }
                    };
                    case null {};
                  }
                });
            let hCount = holidayDatesSet.size();
            let working : Int = totalDays - sundayCount.toInt() - hCount.toInt();
            let workingDays = if (working <= 0) { 0 } else { Int.abs(working) };
            {
              totalDays   = Int.abs(totalDays);
              sundays     = sundayCount;
              holidays    = hCount;
              workingDays;
            }
          };
          case _ { { totalDays = 0; sundays = 0; holidays = 0; workingDays = 0 } };
        }
      };
      case null { { totalDays = 0; sundays = 0; holidays = 0; workingDays = 0 } };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYROLL — SAVE & CALCULATE (full-spec)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Full-spec PayrollRecord with attendance breakdown.
  public type FullPayrollRecord = {
    id             : Text;
    staffId        : Text;
    staffName      : Text;
    month          : Text;   // YYYY-MM
    year           : Text;
    basicSalary    : Float;
    workingDays    : Nat;
    daysPresent    : Nat;
    daysAbsent     : Nat;
    freeLeaves     : Nat;    // always 1 per month
    deductibleDays : Nat;    // max(0, daysAbsent - freeLeaves)
    dailyRate      : Float;
    deductionAmount : Float;
    incentives     : Float;
    netSalary      : Float;
    status         : Text;   // "Draft" | "Final"
    createdAt      : Int;
    updatedAt      : Int;
  };

  /// Save (persist) a full payroll record to stable storage.
  public shared func savePayrollRecord(
    staffId        : Text,
    staffName      : Text,
    month          : Text,
    year           : Text,
    basicSalary    : Float,
    workingDays    : Nat,
    daysPresent    : Nat,
    incentives     : Float,
    status         : Text
  ) : async Bool {
    let now = Time.now();
    let recId = staffId # "#PAYROLL#" # year # "-" # month;
    let daysAbsent     : Nat = if (workingDays >= daysPresent) { workingDays - daysPresent } else { 0 };
    let freeLeaves     : Nat = 1;
    let deductibleDays : Nat = if (daysAbsent > freeLeaves) { daysAbsent - freeLeaves } else { 0 };
    let safeWD         : Float = if (workingDays == 0) { 1.0 } else { workingDays.toFloat() };
    let dailyRate      : Float = basicSalary / safeWD;
    let deductionAmount : Float = deductibleDays.toFloat() * dailyRate;
    let netSalary      : Float = basicSalary - deductionAmount + incentives;
    let _rec : FullPayrollRecord = {
      id             = recId;
      staffId; staffName; month; year; basicSalary; workingDays; daysPresent;
      daysAbsent; freeLeaves; deductibleDays; dailyRate; deductionAmount;
      incentives; netSalary; status;
      createdAt      = now;
      updatedAt      = now;
    };
    payrollRecords.add(recId, {
      id             = recId;
      staffId;
      month;
      year;
      basicSalary    = basicSalary.toInt() |> Int.abs(_);
      presentDays    = daysPresent;
      totalDays      = workingDays;
      deductions     = deductionAmount.toInt() |> Int.abs(_);
      additions      = incentives.toInt() |> Int.abs(_);
      netSalary      = netSalary.toInt() |> Int.abs(_);
      paymentDate    = null;
      status         = if (status == "Final") #Paid else #Pending;
      generatedBy    = "system";
    });
    true
  };

  /// Calculate payroll for a staff member from attendance records.
  /// workingDays is derived from calculateWorkingDays (session start–end excluding Sundays and holidays).
  public shared func calculateStaffPayroll(
    staffId   : Text,
    month     : Text,   // "MM" as text e.g. "04"
    year      : Text,   // "YYYY" e.g. "2025"
    sessionId : Text
  ) : async { #ok : FullPayrollRecord; #err : Text } {
    let staffMember = switch (staff.get(staffId)) {
      case (?s) s;
      case null { return #err("Staff not found") };
    };
    let basicSalary : Float = staffMember.salary.toFloat();
    let targetMonthN = switch (Nat.fromText(month)) { case (?m) m; case null { return #err("Invalid month") } };
    let targetYearN  = switch (Nat.fromText(year))  { case (?y) y; case null { return #err("Invalid year") } };

    // Count distinct attendance dates for this staff in this month/year
    let uniqueDates = Set.empty<Text>();
    staffAttendance.values()
      |> List.fromIter<DeviceAttTypes.StaffAttendanceRecord>(_)
      |> _.filter(func(r : DeviceAttTypes.StaffAttendanceRecord) : Bool {
          r.staffId == staffId and r.month == targetMonthN and r.year == targetYearN
        })
      |> _.forEach(func(r : DeviceAttTypes.StaffAttendanceRecord) { uniqueDates.add(r.date) });
    let daysPresent : Nat = uniqueDates.size();

    // Working days in month: get session and calculate
    let workingDays : Nat = switch (sessions.get(sessionId)) {
      case (?_sess) {
        // Build first/last day of this month for the session
        let mm = if (month.size() == 1) { "0" # month } else { month };
        let fromD = "01/" # mm # "/" # year;
        // Last day of month (approximate: use 28 for Feb, 30/31 otherwise)
        let lastDay : Text = switch (targetMonthN) {
          case 2  "28";
          case (4 or 6 or 9 or 11) "30";
          case _  "31";
        };
        let toD = lastDay # "/" # mm # "/" # year;
        // Reuse calculateWorkingDays logic inline (query version not callable from update)
        func parseDMY4(d : Text) : ?Int {
          let pts = d.split(#char('/')) |> List.fromIter(_).toArray();
          if (pts.size() != 3) { return null };
          switch (Nat.fromText(pts[0]), Nat.fromText(pts[1]), Nat.fromText(pts[2])) {
            case (?dy, ?mo, ?yr) {
              let y : Int = if (mo <= 2) { yr.toInt() - 1 } else { yr.toInt() };
              let m2 : Int = if (mo.toInt() <= 2) { mo.toInt() + 12 } else { mo.toInt() };
              ?(dy.toInt() + (153 * (m2 - 3) + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 719469)
            };
            case _ null;
          }
        };
        switch (parseDMY4(fromD), parseDMY4(toD)) {
          case (?fD, ?tD) {
            if (tD < fD) { 0 } else {
              let total : Int = tD - fD + 1;
              let sunCount = countSundaysBetween(fromD, toD);
              let hSet = Set.empty<Text>();
              holidays.values() |> List.fromIter<Holiday>(_)
                |> _.forEach(func(h : Holiday) {
                    switch (parseDMY4(h.date)) {
                      case (?hd) {
                        if (hd >= fD and hd <= tD) {
                          let dow : Int = (hd + 3) % 7;
                          if (dow != 6) { hSet.add(h.date) }
                        }
                      };
                      case null {};
                    }
                  });
              let w : Int = total - sunCount.toInt() - hSet.size().toInt();
              if (w <= 0) { 0 } else { Int.abs(w) }
            }
          };
          case _ 0;
        }
      };
      case null 26;  // fallback: 26 working days
    };

    // Incentives for this month (YYYY-MM format)
    let monthKey = year # "-" # month;
    let incentivesTotal : Float = staffIncentives.values()
      |> List.fromIter<StaffIncentive>(_)
      |> _.filter(func(i : StaffIncentive) : Bool { i.staffId == staffId and i.month == monthKey })
      |> _.foldLeft<Float, StaffIncentive>(0.0, func(acc, i) { acc + i.amount });

    let daysAbsent     : Nat = if (workingDays >= daysPresent) { workingDays - daysPresent } else { 0 };
    let freeLeaves     : Nat = 1;
    let deductibleDays : Nat = if (daysAbsent > freeLeaves) { daysAbsent - freeLeaves } else { 0 };
    let safeWD         : Float = if (workingDays == 0) { 1.0 } else { workingDays.toFloat() };
    let dailyRate      : Float = basicSalary / safeWD;
    let deductionAmount : Float = deductibleDays.toFloat() * dailyRate;
    let netSalary      : Float = basicSalary - deductionAmount + incentivesTotal;

    let now   = Time.now();
    let recId = staffId # "#PAYROLL#" # year # "-" # month;
    let rec : FullPayrollRecord = {
      id             = recId;
      staffId;
      staffName      = staffMember.fullName;
      month;
      year;
      basicSalary;
      workingDays;
      daysPresent;
      daysAbsent;
      freeLeaves;
      deductibleDays;
      dailyRate;
      deductionAmount;
      incentives     = incentivesTotal;
      netSalary;
      status         = "Draft";
      createdAt      = now;
      updatedAt      = now;
    };
    // Persist into legacy payrollRecords map so existing queries still work
    payrollRecords.add(recId, {
      id             = recId;
      staffId;
      month;
      year;
      basicSalary    = basicSalary.toInt() |> Int.abs(_);
      presentDays    = daysPresent;
      totalDays      = workingDays;
      deductions     = deductionAmount.toInt() |> Int.abs(_);
      additions      = incentivesTotal.toInt() |> Int.abs(_);
      netSalary      = netSalary.toInt() |> Int.abs(_);
      paymentDate    = null;
      status         = #Pending;
      generatedBy    = "system";
    });
    #ok(rec)
  };

  /// Add or update an incentive for payroll purposes (alias wiring payroll incentive).
  public shared func addPayrollIncentive(
    staffId : Text, month : Text, year : Text, amount : Float, reason : Text
  ) : async Bool {
    let monthKey = year # "-" # month;
    let id = Time.now().toText() # "payrollinc" # staffId;
    let inc : StaffIncentive = { id; staffId; amount; reason; month = monthKey; year; approvedBy = "admin"; createdAt = Time.now() };
    staffIncentives.add(id, inc);
    true
  };

  /// Returns legacy payroll records for a staff member.
  public query func getLegacyPayrollByStaff(staffId : Text) : async [PayrollRecord] {
    payrollRecords.values()
      |> List.fromIter<PayrollRecord>(_)
      |> _.filter(func(r : PayrollRecord) : Bool { r.staffId == staffId })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FEE PAYMENT — EDIT WITH AUDIT LOG
  // ═══════════════════════════════════════════════════════════════════════════

  func addFeeAuditLogEntry(
    paymentId    : Text,
    studentId    : Text,
    adminId      : Text,
    adminName    : Text,
    action       : Text,
    fieldChanged : Text,
    oldValue     : Text,
    newValue     : Text
  ) {
    let logId = Time.now().toText() # paymentId # fieldChanged;
    let entry : FeeAuditLog = {
      id = logId; paymentId; studentId; adminId; adminName;
      action; fieldChanged; oldValue; newValue;
      timestamp = Time.now();
    };
    feeAuditLogs.add(logId, entry);
  };

  /// Update editable fields on a fee payment and create an audit log entry for each changed field.
  public shared func updateFeePayment(
    id        : Text,
    update    : FeePaymentUpdate,
    adminId   : Text,
    adminName : Text
  ) : async Bool {
    switch (feePayments.get(id)) {
      case (?p) {
        var updated = p;
        switch (update.paymentDate) {
          case (?newDate) {
            if (newDate != p.paymentDate) {
              addFeeAuditLogEntry(id, p.studentId, adminId, adminName, "Edit", "paymentDate", p.paymentDate, newDate);
              updated := { updated with paymentDate = newDate };
            }
          };
          case null {};
        };
        switch (update.totalAmount) {
          case (?newAmt) {
            let newAmtNat = newAmt.toInt() |> Int.abs(_);
            if (newAmtNat != p.totalAmount) {
              addFeeAuditLogEntry(id, p.studentId, adminId, adminName, "Edit", "totalAmount", p.totalAmount.toText(), newAmtNat.toText());
              let newBal : Nat = if (p.totalDue >= newAmtNat) { p.totalDue - newAmtNat } else { 0 };
              updated := { updated with totalAmount = newAmtNat; balance = newBal };
            }
          };
          case null {};
        };
        switch (update.paymentMode) {
          case (?newMode) {
            if (newMode != p.paymentMode) {
              addFeeAuditLogEntry(id, p.studentId, adminId, adminName, "Edit", "paymentMode", p.paymentMode, newMode);
              updated := { updated with paymentMode = newMode };
            }
          };
          case null {};
        };
        feePayments.add(id, updated);
        // Mirror changes to feeRegister
        switch (feeRegister.get(id)) {
          case (?r) {
            feeRegister.add(id, { r with
              paymentDate = updated.paymentDate;
              totalAmount = updated.totalAmount;
            })
          };
          case null {};
        };
        true
      };
      case null false;
    }
  };

  /// Return fee audit logs. Filter by studentId or paymentId (both optional).
  public query func getFeeAuditLogs(
    studentIdFilter  : ?Text,
    paymentIdFilter  : ?Text
  ) : async [FeeAuditLog] {
    feeAuditLogs.values()
      |> List.fromIter<FeeAuditLog>(_)
      |> _.filter(func(l : FeeAuditLog) : Bool {
          let matchStudent = switch (studentIdFilter) {
            case (?sid) l.studentId == sid;
            case null true;
          };
          let matchPayment = switch (paymentIdFilter) {
            case (?pid) l.paymentId == pid;
            case null true;
          };
          matchStudent and matchPayment
        })
      |> _.toArray()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP & RESTORE
  // ═══════════════════════════════════════════════════════════════════════════

  /// Returns a full snapshot of all stable storage as a BackupPayload.
  /// The frontend downloads this as a JSON file for safekeeping.
  public query func createFullBackup() : async BackupRestoreTypes.BackupPayload {

    // ── Students ───────────────────────────────────────────────────────────────
    let studentRows = studentsV2.values()
      |> List.fromIter<Student>(_)
      |> _.map<Student, BackupRestoreTypes.StudentRow>(func(s) : BackupRestoreTypes.StudentRow {
          { id = s.id; admNo = s.admNo; fullName = s.fullName; fatherName = s.fatherName;
            motherName = s.motherName; fatherMobile = s.fatherMobile;
            motherMobile = s.motherMobile; dateOfBirth = s.dateOfBirth; gender = s.gender;
            currentAddress = s.currentAddress; permanentAddress = s.permanentAddress;
            classLevel = s.classLevel; sectionId = s.sectionId; session = s.session;
            photoUrl = s.photoUrl; status = s.status; bloodGroup = s.bloodGroup;
            religion = s.religion; category = s.category; aadhaarNo = s.aadhaarNo;
            transportRouteId = s.transportRouteId;
            transportPickupPointId = s.transportPickupPointId;
            busNo = s.busNo; createdAt = s.createdAt; mobile = s.mobile;
            srNo = s.srNo; penNo = s.penNo; apaarNo = s.apaarNo;
            prevSchool = s.prevSchool; admissionDate = s.admissionDate }
        })
      |> _.toArray();

    // ── Staff ───────────────────────────────────────────────────────────────────
    let staffRows = staff.values()
      |> List.fromIter<Staff>(_)
      |> _.map<Staff, BackupRestoreTypes.StaffRow>(func(s) : BackupRestoreTypes.StaffRow {
          { id = s.id; employeeId = s.employeeId; fullName = s.fullName;
            designation = s.designation; department = s.department; mobile = s.mobile;
            email = s.email; address = s.address; dateOfJoining = s.dateOfJoining;
            salary = s.salary; status = s.status; photoUrl = s.photoUrl;
            aadhaarNo = s.aadhaarNo; bankAccount = s.bankAccount;
            ifscCode = s.ifscCode; createdAt = s.createdAt }
        })
      |> _.toArray();

    // ── Sections ────────────────────────────────────────────────────────────────
    let sectionRows = sections.values()
      |> List.fromIter<Section>(_)
      |> _.map<Section, BackupRestoreTypes.SectionRow>(func(s) : BackupRestoreTypes.SectionRow {
          { id = s.id; classLevel = s.classLevel; sectionName = s.sectionName;
            roomNo = s.roomNo; teacherId = s.teacherId }
        })
      |> _.toArray();

    // ── Sessions ────────────────────────────────────────────────────────────────
    let sessionRows = sessions.values()
      |> List.fromIter<AcademicSession>(_)
      |> _.map<AcademicSession, BackupRestoreTypes.SessionRow>(func(s) : BackupRestoreTypes.SessionRow {
          { id = s.id; sessionName = s.sessionName; startDate = s.startDate;
            endDate = s.endDate; isActive = s.isActive; isArchived = s.isArchived;
            createdAt = s.createdAt }
        })
      |> _.toArray();

    // ── Subjects ────────────────────────────────────────────────────────────────
    let subjectRows = subjects.values()
      |> List.fromIter<Subject>(_)
      |> _.map<Subject, BackupRestoreTypes.SubjectRow>(func(s) : BackupRestoreTypes.SubjectRow {
          { id = s.id; name = s.name; code = s.code; classLevel = s.classLevel;
            maxMarks = s.maxMarks; passingMarks = s.passingMarks }
        })
      |> _.toArray();

    let subjectClassMapRows = subjectClassMaps.values()
      |> List.fromIter<SubjectClassMap>(_)
      |> _.map<SubjectClassMap, BackupRestoreTypes.SubjectClassMapRow>(func(scm) : BackupRestoreTypes.SubjectClassMapRow {
          { subjectId = scm.subjectId; classLevels = scm.classLevels }
        })
      |> _.toArray();

    // ── Fee Headings ───────────────────────────────────────────────────────────
    let feeHeadingRows = feeHeadings.values()
      |> List.fromIter<FeeHeading>(_)
      |> _.map<FeeHeading, BackupRestoreTypes.FeeHeadingRow>(func(h) : BackupRestoreTypes.FeeHeadingRow {
          { id = h.id; name = h.name; description = h.description;
            isActive = h.isActive; applicableMonths = h.applicableMonths }
        })
      |> _.toArray();

    let feePlanRows = feePlans.values()
      |> List.fromIter<FeePlan>(_)
      |> _.map<FeePlan, BackupRestoreTypes.FeePlanRow>(func(p) : BackupRestoreTypes.FeePlanRow {
          { id = p.id; classLevel = p.classLevel; sectionId = p.sectionId;
            session = p.session; monthlyAmounts = p.monthlyAmounts }
        })
      |> _.toArray();

    let feeCollectionRows = feePayments.values()
      |> List.fromIter<FeePayment>(_)
      |> _.map<FeePayment, BackupRestoreTypes.FeeCollectionRow>(func(p) : BackupRestoreTypes.FeeCollectionRow {
          let itemRows = p.items.map(
            func(i) : BackupRestoreTypes.FeePaymentItemRow {
              { headingId = i.headingId; month = i.month; amount = i.amount }
            }
          );
          let otherFeeRow : ?BackupRestoreTypes.OtherFeeRow = switch (p.otherFee) {
            case (?of_) ?{ description = of_.description; amount = of_.amount };
            case null null;
          };
          { id = p.id; studentId = p.studentId; sessionId = p.sessionId;
            receiptNo = p.receiptNo; paymentDate = p.paymentDate;
            items = itemRows; otherFee = otherFeeRow;
            totalDue = p.totalDue; totalAmount = p.totalAmount; balance = p.balance;
            paymentMode = p.paymentMode; upiRef = p.upiRef; remarks = p.remarks;
            createdBy = p.createdBy; isDeleted = p.isDeleted; createdAt = p.createdAt;
            lateFees = p.lateFees; discountTotal = p.discountTotal;
            balanceCarriedForward = p.balanceCarriedForward }
        })
      |> _.toArray();

    let studentDiscountRows = studentDiscounts.values()
      |> List.fromIter<FeeExtrasTypes.StudentDiscount>(_)
      |> _.map<FeeExtrasTypes.StudentDiscount, BackupRestoreTypes.StudentDiscountRow>(
          func(d) : BackupRestoreTypes.StudentDiscountRow {
            { id = d.id; studentId = d.studentId; headingId = d.headingId;
              amount = d.amount; remark = d.remark; createdAt = d.createdAt }
          })
      |> _.toArray();

    let studentOldBalanceRows = studentOldBalances.values()
      |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
      |> _.map<FeeExtrasTypes.StudentOldBalance, BackupRestoreTypes.StudentOldBalanceRow>(
          func(b) : BackupRestoreTypes.StudentOldBalanceRow {
            { id = b.id; studentId = b.studentId; sessionId = b.sessionId;
              amount = b.amount; addedAt = b.addedAt }
          })
      |> _.toArray();

    // ── Timetables ────────────────────────────────────────────────────────────
    let classTimetableArr = classTimetables.values()
      |> List.fromIter<ClassTimetableTypes.ClassTimetable>(_)
      |> _.toArray();

    let examTimetableRows = examTimetables.values()
      |> List.fromIter<ExamTimetable>(_)
      |> _.map<ExamTimetable, BackupRestoreTypes.ExamTimetableRow>(func(t) : BackupRestoreTypes.ExamTimetableRow {
          let schedRows = t.schedule.map(
            func(e) : BackupRestoreTypes.ExamScheduleEntryRow {
              { subjectId = e.subjectId; date = e.date; startTime = e.startTime;
                endTime = e.endTime; room = e.room; invigilatorId = e.invigilatorId }
            }
          );
          { id = t.id; examName = t.examName; session = t.session;
            classLevel = t.classLevel; schedule = schedRows }
        })
      |> _.toArray();

    // ── Attendance ───────────────────────────────────────────────────────────
    let attendanceRows = attendance.values()
      |> List.fromIter<AttendanceRecord>(_)
      |> _.map<AttendanceRecord, BackupRestoreTypes.AttendanceRow>(func(r) : BackupRestoreTypes.AttendanceRow {
          { id = r.id; studentId = r.studentId; date = r.date; status = r.status;
            remarks = r.remarks; markedBy = r.markedBy }
        })
      |> _.toArray();

    let deviceAttArr = deviceAttendance.values()
      |> List.fromIter<DeviceAttTypes.DeviceAttendanceRecord>(_)
      |> _.toArray();

    let staffAttArr = staffAttendance.values()
      |> List.fromIter<DeviceAttTypes.StaffAttendanceRecord>(_)
      |> _.toArray();

    let faceEnrollArr = faceEnrollments.values()
      |> List.fromIter<FETypes.FaceEnrollmentRecord>(_)
      |> _.toArray();

    // ── Transport ────────────────────────────────────────────────────────────
    let routeRows = routes.values()
      |> List.fromIter<TransportRoute>(_)
      |> _.map<TransportRoute, BackupRestoreTypes.RouteRow>(func(r) : BackupRestoreTypes.RouteRow {
          { id = r.id; routeName = r.routeName; routeNo = r.routeNo; busNo = r.busNo;
            driverName = r.driverName; driverMobile = r.driverMobile; capacity = r.capacity }
        })
      |> _.toArray();

    let pickupPointRows = pickupPoints.values()
      |> List.fromIter<PickupPoint>(_)
      |> _.map<PickupPoint, BackupRestoreTypes.PickupPointRow>(func(p) : BackupRestoreTypes.PickupPointRow {
          { id = p.id; routeId = p.routeId; name = p.name; timing = p.timing;
            monthlyFare = p.monthlyFare; order = p.order }
        })
      |> _.toArray();

    // ── Inventory ────────────────────────────────────────────────────────────
    let inventoryItemRows = invItems.values()
      |> List.fromIter<InventoryItem>(_)
      |> _.map<InventoryItem, BackupRestoreTypes.InventoryItemRow>(func(i) : BackupRestoreTypes.InventoryItemRow {
          { id = i.id; name = i.name; category = i.category; store = i.store;
            unit = i.unit; currentStock = i.currentStock; minStock = i.minStock;
            purchasePrice = i.purchasePrice; salePrice = i.salePrice }
        })
      |> _.toArray();

    let inventoryTxRows = invTransactions.values()
      |> List.fromIter<InventoryTransaction>(_)
      |> _.map<InventoryTransaction, BackupRestoreTypes.InventoryTxRow>(func(tx) : BackupRestoreTypes.InventoryTxRow {
          { id = tx.id; itemId = tx.itemId; transactionType = tx.transactionType;
            quantity = tx.quantity; unitPrice = tx.unitPrice; totalAmount = tx.totalAmount;
            date = tx.date; remarks = tx.remarks; createdBy = tx.createdBy;
            buyerAdmNo = tx.buyerAdmNo; buyerName = tx.buyerName; sellerName = tx.sellerName;
            receivedAmount = tx.receivedAmount; balanceAmount = tx.balanceAmount }
        })
      |> _.toArray();

    // ── HR / Payroll ───────────────────────────────────────────────────────────
    let payrollRows = payrollRecords.values()
      |> List.fromIter<PayrollRecord>(_)
      |> _.map<PayrollRecord, BackupRestoreTypes.PayrollRow>(func(r) : BackupRestoreTypes.PayrollRow {
          { id = r.id; staffId = r.staffId; month = r.month; year = r.year;
            basicSalary = r.basicSalary; presentDays = r.presentDays;
            totalDays = r.totalDays; deductions = r.deductions; additions = r.additions;
            netSalary = r.netSalary; paymentDate = r.paymentDate; status = r.status;
            generatedBy = r.generatedBy }
        })
      |> _.toArray();

    let staffPayoutRows = staffPayouts.values()
      |> List.fromIter<StaffPayout>(_)
      |> _.map<StaffPayout, BackupRestoreTypes.StaffPayoutRow>(func(p) : BackupRestoreTypes.StaffPayoutRow {
          { id = p.id; staffId = p.staffId; amount = p.amount; mode = p.mode;
            date = p.date; notes = p.notes; recordedBy = p.recordedBy; createdAt = p.createdAt }
        })
      |> _.toArray();

    let staffIncentiveRows = staffIncentives.values()
      |> List.fromIter<StaffIncentive>(_)
      |> _.map<StaffIncentive, BackupRestoreTypes.StaffIncentiveRow>(func(i) : BackupRestoreTypes.StaffIncentiveRow {
          { id = i.id; staffId = i.staffId; amount = i.amount; reason = i.reason;
            month = i.month; year = i.year; approvedBy = i.approvedBy; createdAt = i.createdAt }
        })
      |> _.toArray();

    let staffLoanRows = staffLoans.values()
      |> List.fromIter<StaffLoan>(_)
      |> _.map<StaffLoan, BackupRestoreTypes.StaffLoanRow>(func(l) : BackupRestoreTypes.StaffLoanRow {
          { id = l.id; staffId = l.staffId; principalAmount = l.principalAmount;
            remainingAmount = l.remainingAmount; monthlyDeduction = l.monthlyDeduction;
            startMonth = l.startMonth; notes = l.notes; createdAt = l.createdAt }
        })
      |> _.toArray();

    let enhancedPayrollRows = enhancedPayroll.values()
      |> List.fromIter<EnhancedPayrollRecord>(_)
      |> _.map<EnhancedPayrollRecord, BackupRestoreTypes.EnhancedPayrollRow>(func(r) : BackupRestoreTypes.EnhancedPayrollRow {
          let payoutRefs = r.payouts.map(
            func(p) : BackupRestoreTypes.StaffPayoutRow {
              { id = p.id; staffId = p.staffId; amount = p.amount; mode = p.mode;
                date = p.date; notes = p.notes; recordedBy = p.recordedBy; createdAt = p.createdAt }
            }
          );
          { id = r.id; staffId = r.staffId; month = r.month;
            grossSalary = r.grossSalary; deductions = r.deductions; incentives = r.incentives;
            loanDeduction = r.loanDeduction; advancePaid = r.advancePaid; netSalary = r.netSalary;
            attendanceDays = r.attendanceDays; workingDays = r.workingDays;
            absentDays = r.absentDays; deductibleDays = r.deductibleDays;
            payouts = payoutRefs; paymentStatus = r.paymentStatus;
            payslipNotes = r.payslipNotes; generatedAt = r.generatedAt }
        })
      |> _.toArray();

    let subjectAssignArr = subjectAssignments.values()
      |> List.fromIter<SATypes.SubjectAssignment>(_)
      |> _.toArray();

    // ── Expenses & Income ──────────────────────────────────────────────────────
    let expHeadArr = expenseHeadsV2.values()
      |> List.fromIter<ETypes.ExpenseHead>(_)
      |> _.toArray();

    let expEntryArr = expenseEntriesV2.values()
      |> List.fromIter<ETypes.ExpenseEntry>(_)
      |> _.toArray();

    // ── Library & Alumni ───────────────────────────────────────────────────────
    let bookRows = books.values()
      |> List.fromIter<Book>(_)
      |> _.map<Book, BackupRestoreTypes.BookRow>(func(b) : BackupRestoreTypes.BookRow {
          { id = b.id; isbn = b.isbn; title = b.title; author = b.author;
            publisher = b.publisher; category = b.category; totalCopies = b.totalCopies;
            availableCopies = b.availableCopies; shelfLocation = b.shelfLocation;
            photoUrl = b.photoUrl }
        })
      |> _.toArray();

    let bookIssueRows = bookIssues.values()
      |> List.fromIter<BookIssue>(_)
      |> _.map<BookIssue, BackupRestoreTypes.BookIssueRow>(func(bi) : BackupRestoreTypes.BookIssueRow {
          { id = bi.id; bookId = bi.bookId; studentId = bi.studentId;
            issueDate = bi.issueDate; dueDate = bi.dueDate; returnDate = bi.returnDate;
            status = bi.status; fine = bi.fine }
        })
      |> _.toArray();

    let alumniRows = alumni.values()
      |> List.fromIter<AlumniRecord>(_)
      |> _.map<AlumniRecord, BackupRestoreTypes.AlumniRow>(func(a) : BackupRestoreTypes.AlumniRow {
          { id = a.id; fullName = a.fullName; graduationYear = a.graduationYear;
            className = a.className; currentOccupation = a.currentOccupation;
            currentCity = a.currentCity; mobile = a.mobile; email = a.email;
            photoUrl = a.photoUrl }
        })
      |> _.toArray();

    // ── Notifications & Chat ────────────────────────────────────────────────────
    let notifRows = notifications.values()
      |> List.fromIter<Notification>(_)
      |> _.map<Notification, BackupRestoreTypes.NotificationRow>(func(n) : BackupRestoreTypes.NotificationRow {
          { id = n.id; title = n.title; message = n.message; targetRole = n.targetRole;
            targetStudentId = n.targetStudentId; targetClassLevel = n.targetClassLevel;
            createdBy = n.createdBy; createdAt = n.createdAt; isRead = n.isRead;
            notifType = n.notifType }
        })
      |> _.toArray();

    let chatRoomRows = chatRooms.values()
      |> List.fromIter<ChatRoom>(_)
      |> _.map<ChatRoom, BackupRestoreTypes.ChatRoomRow>(func(r) : BackupRestoreTypes.ChatRoomRow {
          { id = r.id; name = r.name; roomType = r.roomType; members = r.members;
            createdBy = r.createdBy; createdAt = r.createdAt }
        })
      |> _.toArray();

    // ── Syllabus ─────────────────────────────────────────────────────────────────
    let syllabusChapterRows = chapters.values()
      |> List.fromIter<SyllabusChapter>(_)
      |> _.map<SyllabusChapter, BackupRestoreTypes.SyllabusChapterRow>(func(c) : BackupRestoreTypes.SyllabusChapterRow {
          { id = c.id; subjectId = c.subjectId; chapterNo = c.chapterNo;
            title = c.title; topics = c.topics; completionPercent = c.completionPercent;
            classLevel = c.classLevel }
        })
      |> _.toArray();

    let syllabusContentRows = syllabusContents.values()
      |> List.fromIter<SyllabusTypes.SyllabusContent>(_)
      |> _.map<SyllabusTypes.SyllabusContent, BackupRestoreTypes.SyllabusContentRow>(
          func(sc) : BackupRestoreTypes.SyllabusContentRow {
            let genQA = sc.generatedQA.map(
              func(q) : BackupRestoreTypes.QAPairRow { { question = q.question; answer = q.answer } }
            );
            let savedQA = sc.savedQA.map(
              func(q) : BackupRestoreTypes.QAPairRow { { question = q.question; answer = q.answer } }
            );
            { chapterId = sc.chapterId; contentText = sc.contentText;
              generatedQA = genQA; savedQA = savedQA;
              approvalStatus = sc.approvalStatus;
              rejectionReason = sc.rejectionReason;
              submittedAt = sc.submittedAt; approvedAt = sc.approvedAt;
              userProvidedQuestions = sc.userProvidedQuestions }
          })
      |> _.toArray();

    // ── Users & Settings ─────────────────────────────────────────────────────
    let userAccountRows = userAccounts.values()
      |> List.fromIter<UserAccount>(_)
      |> _.map<UserAccount, BackupRestoreTypes.UserAccountRow>(func(u) : BackupRestoreTypes.UserAccountRow {
          { id = u.id; principalId = u.principalId; username = u.username;
            fullName = u.fullName; role = u.role; position = u.position;
            classLevel = u.classLevel; sectionId = u.sectionId; staffId = u.staffId;
            studentId = u.studentId; isActive = u.isActive; permissions = u.permissions;
            createdAt = u.createdAt }
        })
      |> _.toArray();

    let settingsRow : BackupRestoreTypes.AppSettingsRow = {
      whatsappApiKey  = appSettings.whatsappApiKey;
      whatsappApiUrl  = appSettings.whatsappApiUrl;
      razorpayEnabled = appSettings.razorpayEnabled;
      payuEnabled     = appSettings.payuEnabled;
      gpayEnabled     = appSettings.gpayEnabled;
      upiId           = appSettings.upiId;
      activeTheme     = appSettings.activeTheme;
      dashboardBgUrl  = appSettings.dashboardBgUrl;
      messageTemplates = appSettings.messageTemplates;
    };

    let schoolInfoRow : BackupRestoreTypes.SchoolInfoRow = {
      name    = schoolInfo.name;
      about   = schoolInfo.about;
      photoUrl = schoolInfo.photoUrl;
      address = schoolInfo.address;
      phone   = schoolInfo.phone;
      email   = schoolInfo.email;
      website = schoolInfo.website;
    };

    {
      students           = studentRows;
      staff              = staffRows;
      sections           = sectionRows;
      sessions           = sessionRows;
      subjects           = subjectRows;
      subjectClassMaps   = subjectClassMapRows;
      feeHeadings        = feeHeadingRows;
      feePlans           = feePlanRows;
      feeCollections     = feeCollectionRows;
      studentDiscounts   = studentDiscountRows;
      studentOldBalances = studentOldBalanceRows;
      classTimetables    = classTimetableArr;
      examTimetables     = examTimetableRows;
      attendanceRecords  = attendanceRows;
      deviceAttendance   = deviceAttArr;
      staffAttendance    = staffAttArr;
      faceEnrollments    = faceEnrollArr;
      routes             = routeRows;
      pickupPoints       = pickupPointRows;
      inventoryItems     = inventoryItemRows;
      inventoryTx        = inventoryTxRows;
      payrollRecords     = payrollRows;
      staffPayouts       = staffPayoutRows;
      staffIncentives    = staffIncentiveRows;
      staffLoans         = staffLoanRows;
      enhancedPayroll    = enhancedPayrollRows;
      subjectAssignments = subjectAssignArr;
      expenseHeads       = expHeadArr;
      expenseEntries     = expEntryArr;
      libraryBooks       = bookRows;
      libraryIssues      = bookIssueRows;
      alumniRecords      = alumniRows;
      notifications      = notifRows;
      chatRooms          = chatRoomRows;
      syllabusChapters   = syllabusChapterRows;
      syllabusContents   = syllabusContentRows;
      userAccounts       = userAccountRows;
      appSettings        = settingsRow;
      schoolInfo         = schoolInfoRow;
      backupVersion      = "2.0";
      backupTimestamp    = Time.now();
    }
  };

  /// Merge-restores all entities from a backup payload.
  /// Strategy: if ID exists → overwrite, if not → insert.  No data is deleted.
  /// Validates required fields before each write; skips invalid records and
  /// collects per-entity errors.  Continues even when one entity type fails.
  public shared func restoreFromBackup(payload : BackupRestoreTypes.BackupPayload)
      : async BackupRestoreTypes.RestoreResult {

    var successCount : Nat = 0;
    var skippedCount : Nat = 0;
    let errors = List.empty<BackupRestoreTypes.BackupError>();

    // ── Students ───────────────────────────────────────────────────────────────
    for (r in payload.students.values()) {
      if (r.id == "" or r.admNo == "" or r.fullName == "") {
        skippedCount += 1;
      } else {
        let s : Student = {
          id = r.id; admNo = r.admNo; fullName = r.fullName; fatherName = r.fatherName;
          motherName = r.motherName; fatherMobile = r.fatherMobile;
          motherMobile = r.motherMobile; dateOfBirth = r.dateOfBirth; gender = r.gender;
          currentAddress = r.currentAddress; permanentAddress = r.permanentAddress;
          classLevel = r.classLevel; sectionId = r.sectionId; session = r.session;
          photoUrl = r.photoUrl; status = r.status; bloodGroup = r.bloodGroup;
          religion = r.religion; category = r.category; aadhaarNo = r.aadhaarNo;
          transportRouteId = r.transportRouteId;
          transportPickupPointId = r.transportPickupPointId;
          busNo = r.busNo; createdAt = r.createdAt; mobile = r.mobile;
          srNo = r.srNo; penNo = r.penNo; apaarNo = r.apaarNo;
          prevSchool = r.prevSchool; admissionDate = r.admissionDate;
        };
        studentsV2.add(r.id, s);
        successCount += 1;
      };
    };

    // ── Staff ───────────────────────────────────────────────────────────────────
    for (r in payload.staff.values()) {
      if (r.id == "" or r.employeeId == "" or r.fullName == "") {
        skippedCount += 1;
      } else {
        let s : Staff = {
          id = r.id; employeeId = r.employeeId; fullName = r.fullName;
          designation = r.designation; department = r.department; mobile = r.mobile;
          email = r.email; address = r.address; dateOfJoining = r.dateOfJoining;
          salary = r.salary; status = r.status; photoUrl = r.photoUrl;
          aadhaarNo = r.aadhaarNo; bankAccount = r.bankAccount;
          ifscCode = r.ifscCode; createdAt = r.createdAt;
        };
        staff.add(r.id, s);
        successCount += 1;
      };
    };

    // ── Sections ────────────────────────────────────────────────────────────────
    for (r in payload.sections.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        sections.add(r.id, { id = r.id; classLevel = r.classLevel;
          sectionName = r.sectionName; roomNo = r.roomNo; teacherId = r.teacherId });
        successCount += 1;
      };
    };

    // ── Sessions ────────────────────────────────────────────────────────────────
    for (r in payload.sessions.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        sessions.add(r.id, { id = r.id; sessionName = r.sessionName;
          startDate = r.startDate; endDate = r.endDate; isActive = r.isActive;
          isArchived = r.isArchived; createdAt = r.createdAt });
        successCount += 1;
      };
    };

    // ── Subjects & class maps ───────────────────────────────────────────────────
    for (r in payload.subjects.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        subjects.add(r.id, { id = r.id; name = r.name; code = r.code;
          classLevel = r.classLevel; maxMarks = r.maxMarks; passingMarks = r.passingMarks });
        successCount += 1;
      };
    };
    for (r in payload.subjectClassMaps.values()) {
      if (r.subjectId == "") { skippedCount += 1 } else {
        subjectClassMaps.add(r.subjectId, { subjectId = r.subjectId; classLevels = r.classLevels });
        successCount += 1;
      };
    };

    // ── Fee headings ─────────────────────────────────────────────────────────
    for (r in payload.feeHeadings.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        feeHeadings.add(r.id, { id = r.id; name = r.name; description = r.description;
          isActive = r.isActive; applicableMonths = r.applicableMonths });
        successCount += 1;
      };
    };

    // ── Fee plans ────────────────────────────────────────────────────────────
    for (r in payload.feePlans.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        feePlans.add(r.id, { id = r.id; classLevel = r.classLevel; sectionId = r.sectionId;
          session = r.session; monthlyAmounts = r.monthlyAmounts });
        successCount += 1;
      };
    };

    // ── Fee collections ───────────────────────────────────────────────────────
    for (r in payload.feeCollections.values()) {
      if (r.id == "" or r.studentId == "") {
        skippedCount += 1;
      } else {
        let items = r.items.map(
          func(i) : FeePaymentItem { { headingId = i.headingId; month = i.month; amount = i.amount } }
        );
        let otherFee : ?OtherFee = switch (r.otherFee) {
          case (?of_) ?{ description = of_.description; amount = of_.amount };
          case null null;
        };
        let p : FeePayment = {
          id = r.id; studentId = r.studentId; sessionId = r.sessionId;
          receiptNo = r.receiptNo; paymentDate = r.paymentDate; items; otherFee;
          totalDue = r.totalDue; totalAmount = r.totalAmount; balance = r.balance;
          paymentMode = r.paymentMode; upiRef = r.upiRef; remarks = r.remarks;
          createdBy = r.createdBy; isDeleted = r.isDeleted; createdAt = r.createdAt;
          lateFees = r.lateFees; discountTotal = r.discountTotal;
          balanceCarriedForward = r.balanceCarriedForward;
        };
        feePayments.add(r.id, p);
        feeRegister.add(r.id, {
          id = r.id; studentId = r.studentId; receiptNo = r.receiptNo;
          paymentDate = r.paymentDate; totalAmount = r.totalAmount;
          collectedBy = r.createdBy; isDeleted = r.isDeleted;
        });
        successCount += 1;
      };
    };

    // ── Student discounts & old balances ──────────────────────────────────────
    for (r in payload.studentDiscounts.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        studentDiscounts.add(r.id, { id = r.id; studentId = r.studentId;
          headingId = r.headingId; amount = r.amount; remark = r.remark;
          createdAt = r.createdAt });
        successCount += 1;
      };
    };
    for (r in payload.studentOldBalances.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        studentOldBalances.add(r.id, { id = r.id; studentId = r.studentId;
          sessionId = r.sessionId; amount = r.amount;
          previousYearDue = null; addedAt = r.addedAt });
        successCount += 1;
      };
    };

    // ── Timetables ────────────────────────────────────────────────────────────
    for (ct in payload.classTimetables.values()) {
      if (ct.id == "") { skippedCount += 1 } else {
        classTimetables.add(ct.id, ct);
        successCount += 1;
      };
    };
    for (r in payload.examTimetables.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        let sched = r.schedule.map(
          func(e) : ExamScheduleEntry { { subjectId = e.subjectId; date = e.date;
            startTime = e.startTime; endTime = e.endTime; room = e.room;
            invigilatorId = e.invigilatorId } }
        );
        examTimetables.add(r.id, { id = r.id; examName = r.examName; session = r.session;
          classLevel = r.classLevel; schedule = sched });
        successCount += 1;
      };
    };

    // ── Attendance ────────────────────────────────────────────────────────────
    for (r in payload.attendanceRecords.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        attendance.add(r.id, { id = r.id; studentId = r.studentId; date = r.date;
          status = r.status; remarks = r.remarks; markedBy = r.markedBy });
        successCount += 1;
      };
    };
    for (r in payload.deviceAttendance.values()) {
      if (r.id == 0) { skippedCount += 1 } else {
        deviceAttendance.add(r.id, r);
        successCount += 1;
      };
    };
    for (r in payload.staffAttendance.values()) {
      if (r.id == 0) { skippedCount += 1 } else {
        staffAttendance.add(r.id, r);
        successCount += 1;
      };
    };
    for (r in payload.faceEnrollments.values()) {
      if (r.studentId == "") { skippedCount += 1 } else {
        faceEnrollments.add(r.studentId, r);
        successCount += 1;
      };
    };

    // ── Transport ─────────────────────────────────────────────────────────────
    for (r in payload.routes.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        routes.add(r.id, { id = r.id; routeName = r.routeName; routeNo = r.routeNo;
          busNo = r.busNo; driverName = r.driverName; driverMobile = r.driverMobile;
          capacity = r.capacity });
        successCount += 1;
      };
    };
    for (r in payload.pickupPoints.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        pickupPoints.add(r.id, { id = r.id; routeId = r.routeId; name = r.name;
          timing = r.timing; monthlyFare = r.monthlyFare; order = r.order });
        successCount += 1;
      };
    };

    // ── Inventory ─────────────────────────────────────────────────────────────
    for (r in payload.inventoryItems.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        invItems.add(r.id, { id = r.id; name = r.name; category = r.category;
          store = r.store; unit = r.unit; currentStock = r.currentStock;
          minStock = r.minStock; purchasePrice = r.purchasePrice; salePrice = r.salePrice });
        successCount += 1;
      };
    };
    for (r in payload.inventoryTx.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        invTransactions.add(r.id, { id = r.id; itemId = r.itemId;
          transactionType = r.transactionType; quantity = r.quantity;
          unitPrice = r.unitPrice; totalAmount = r.totalAmount; date = r.date;
          remarks = r.remarks; createdBy = r.createdBy; buyerAdmNo = r.buyerAdmNo;
          buyerName = r.buyerName; sellerName = r.sellerName;
          receivedAmount = r.receivedAmount; balanceAmount = r.balanceAmount });
        successCount += 1;
      };
    };

    // ── HR / Payroll ───────────────────────────────────────────────────────────
    for (r in payload.payrollRecords.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        payrollRecords.add(r.id, { id = r.id; staffId = r.staffId; month = r.month;
          year = r.year; basicSalary = r.basicSalary; presentDays = r.presentDays;
          totalDays = r.totalDays; deductions = r.deductions; additions = r.additions;
          netSalary = r.netSalary; paymentDate = r.paymentDate; status = r.status;
          generatedBy = r.generatedBy });
        successCount += 1;
      };
    };
    for (r in payload.staffPayouts.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        staffPayouts.add(r.id, { id = r.id; staffId = r.staffId; amount = r.amount;
          mode = r.mode; date = r.date; notes = r.notes; recordedBy = r.recordedBy;
          createdAt = r.createdAt });
        successCount += 1;
      };
    };
    for (r in payload.staffIncentives.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        staffIncentives.add(r.id, { id = r.id; staffId = r.staffId; amount = r.amount;
          reason = r.reason; month = r.month; year = r.year;
          approvedBy = r.approvedBy; createdAt = r.createdAt });
        successCount += 1;
      };
    };
    for (r in payload.staffLoans.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        staffLoans.add(r.id, { id = r.id; staffId = r.staffId;
          principalAmount = r.principalAmount; remainingAmount = r.remainingAmount;
          monthlyDeduction = r.monthlyDeduction; startMonth = r.startMonth;
          notes = r.notes; createdAt = r.createdAt });
        successCount += 1;
      };
    };
    for (r in payload.enhancedPayroll.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        let payoutRecs = r.payouts.map(
          func(p) : StaffPayout { { id = p.id; staffId = p.staffId; amount = p.amount;
            mode = p.mode; date = p.date; notes = p.notes; recordedBy = p.recordedBy;
            createdAt = p.createdAt } }
        );
        enhancedPayroll.add(r.id, { id = r.id; staffId = r.staffId; month = r.month;
          grossSalary = r.grossSalary; deductions = r.deductions; incentives = r.incentives;
          loanDeduction = r.loanDeduction; advancePaid = r.advancePaid; netSalary = r.netSalary;
          attendanceDays = r.attendanceDays; workingDays = r.workingDays;
          absentDays = r.absentDays; deductibleDays = r.deductibleDays;
          payouts = payoutRecs; paymentStatus = r.paymentStatus;
          payslipNotes = r.payslipNotes; generatedAt = r.generatedAt });
        successCount += 1;
      };
    };
    for (r in payload.subjectAssignments.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        subjectAssignments.add(r.id, r);
        successCount += 1;
      };
    };

    // ── Expenses ──────────────────────────────────────────────────────────────
    for (r in payload.expenseHeads.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        expenseHeadsV2.add(r.id, r);
        successCount += 1;
      };
    };
    for (r in payload.expenseEntries.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        expenseEntriesV2.add(r.id, r);
        successCount += 1;
      };
    };

    // ── Library & Alumni ──────────────────────────────────────────────────────
    for (r in payload.libraryBooks.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        books.add(r.id, { id = r.id; isbn = r.isbn; title = r.title; author = r.author;
          publisher = r.publisher; category = r.category; totalCopies = r.totalCopies;
          availableCopies = r.availableCopies; shelfLocation = r.shelfLocation;
          photoUrl = r.photoUrl });
        successCount += 1;
      };
    };
    for (r in payload.libraryIssues.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        bookIssues.add(r.id, { id = r.id; bookId = r.bookId; studentId = r.studentId;
          issueDate = r.issueDate; dueDate = r.dueDate; returnDate = r.returnDate;
          status = r.status; fine = r.fine });
        successCount += 1;
      };
    };
    for (r in payload.alumniRecords.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        alumni.add(r.id, { id = r.id; fullName = r.fullName;
          graduationYear = r.graduationYear; className = r.className;
          currentOccupation = r.currentOccupation; currentCity = r.currentCity;
          mobile = r.mobile; email = r.email; photoUrl = r.photoUrl });
        successCount += 1;
      };
    };

    // ── Notifications & Chat ───────────────────────────────────────────────────
    for (r in payload.notifications.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        notifications.add(r.id, { id = r.id; title = r.title; message = r.message;
          targetRole = r.targetRole; targetStudentId = r.targetStudentId;
          targetClassLevel = r.targetClassLevel; createdBy = r.createdBy;
          createdAt = r.createdAt; isRead = r.isRead; notifType = r.notifType });
        successCount += 1;
      };
    };
    for (r in payload.chatRooms.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        chatRooms.add(r.id, { id = r.id; name = r.name; roomType = r.roomType;
          members = r.members; createdBy = r.createdBy; createdAt = r.createdAt });
        successCount += 1;
      };
    };

    // ── Syllabus ──────────────────────────────────────────────────────────────
    for (r in payload.syllabusChapters.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        chapters.add(r.id, { id = r.id; subjectId = r.subjectId; chapterNo = r.chapterNo;
          title = r.title; topics = r.topics; completionPercent = r.completionPercent;
          classLevel = r.classLevel });
        successCount += 1;
      };
    };
    for (r in payload.syllabusContents.values()) {
      if (r.chapterId == "") { skippedCount += 1 } else {
        let genQA = r.generatedQA.map(
          func(q) : SyllabusTypes.QAPair { { question = q.question; answer = q.answer } }
        );
        let savedQA = r.savedQA.map(
          func(q) : SyllabusTypes.QAPair { { question = q.question; answer = q.answer } }
        );
        syllabusContents.add(r.chapterId, { chapterId = r.chapterId;
          contentText = r.contentText; generatedQA = genQA; savedQA = savedQA;
          approvalStatus = r.approvalStatus; rejectionReason = r.rejectionReason;
          submittedAt = r.submittedAt; approvedAt = r.approvedAt;
          userProvidedQuestions = r.userProvidedQuestions });
        successCount += 1;
      };
    };

    // ── Users ────────────────────────────────────────────────────────────────
    for (r in payload.userAccounts.values()) {
      if (r.id == "") { skippedCount += 1 } else {
        userAccounts.add(r.id, { id = r.id; principalId = r.principalId;
          username = r.username; fullName = r.fullName; role = r.role;
          position = r.position; classLevel = r.classLevel; sectionId = r.sectionId;
          staffId = r.staffId; studentId = r.studentId; isActive = r.isActive;
          permissions = r.permissions; createdAt = r.createdAt });
        successCount += 1;
      };
    };

    // ── Settings (singleton overwrite — always apply) ─────────────────────────
    let s = payload.appSettings;
    appSettings := {
      whatsappApiKey   = s.whatsappApiKey;
      whatsappApiUrl   = s.whatsappApiUrl;
      razorpayEnabled  = s.razorpayEnabled;
      payuEnabled      = s.payuEnabled;
      gpayEnabled      = s.gpayEnabled;
      upiId            = s.upiId;
      activeTheme      = s.activeTheme;
      dashboardBgUrl   = s.dashboardBgUrl;
      messageTemplates = s.messageTemplates;
    };
    let si = payload.schoolInfo;
    schoolInfo := {
      name     = si.name;
      about    = si.about;
      photoUrl = si.photoUrl;
      address  = si.address;
      phone    = si.phone;
      email    = si.email;
      website  = si.website;
    };

    // ── Build stats ────────────────────────────────────────────────────────────
    let attCount = payload.attendanceRecords.size() +
                   payload.deviceAttendance.size() +
                   payload.staffAttendance.size();
    let stats : BackupRestoreTypes.RestoreStats = {
      students           = payload.students.size();
      staff              = payload.staff.size();
      sections           = payload.sections.size();
      sessions           = payload.sessions.size();
      subjects           = payload.subjects.size();
      subjectClassMaps   = payload.subjectClassMaps.size();
      feeHeadings        = payload.feeHeadings.size();
      feePlans           = payload.feePlans.size();
      feeCollections     = payload.feeCollections.size();
      studentDiscounts   = payload.studentDiscounts.size();
      studentOldBalances = payload.studentOldBalances.size();
      classTimetables    = payload.classTimetables.size();
      examTimetables     = payload.examTimetables.size();
      attendance         = attCount;
      deviceAttendance   = payload.deviceAttendance.size();
      staffAttendance    = payload.staffAttendance.size();
      faceEnrollments    = payload.faceEnrollments.size();
      routes             = payload.routes.size();
      pickupPoints       = payload.pickupPoints.size();
      inventory          = payload.inventoryItems.size();
      inventoryTx        = payload.inventoryTx.size();
      payrollRecords     = payload.payrollRecords.size();
      staffPayouts       = payload.staffPayouts.size();
      staffIncentives    = payload.staffIncentives.size();
      staffLoans         = payload.staffLoans.size();
      enhancedPayroll    = payload.enhancedPayroll.size();
      subjectAssignments = payload.subjectAssignments.size();
      expenseHeads       = payload.expenseHeads.size();
      expenseEntries     = payload.expenseEntries.size();
      libraryBooks       = payload.libraryBooks.size();
      libraryIssues      = payload.libraryIssues.size();
      alumniRecords      = payload.alumniRecords.size();
      notifications      = payload.notifications.size();
      chatRooms          = payload.chatRooms.size();
      syllabusChapters   = payload.syllabusChapters.size();
      syllabusContents   = payload.syllabusContents.size();
      userAccounts       = payload.userAccounts.size();
      total              = successCount;
    };

    let msg = if (skippedCount == 0) {
      "Restore complete — " # successCount.toText() # " records written."
    } else {
      "Restore complete — " # successCount.toText() # " written, " #
      skippedCount.toText() # " skipped (missing key)."
    };

    {
      success      = true;
      message      = msg;
      successCount;
      failCount    = 0;
      skippedCount;
      errors       = errors.toArray();
      recordCounts = stats;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FACTORY RESET
  // ═══════════════════════════════════════════════════════════════════════════

  /// Factory reset — clears ALL data collections and re-seeds defaults.
  /// School settings (name, address, logo) are preserved.
  /// Admin-only: callers must pass the admin password as a guard.
  public shared func factoryReset(adminPassword : Text) : async { #ok : Text; #err : Text } {
    // Verify admin credentials before proceeding
    switch (appUsers.get("admin")) {
      case null {
        // Admin entry missing; allow reset only with default password
        if (adminPassword != "admin123") {
          return #err("Invalid admin credentials")
        };
      };
      case (?admin) {
        if (admin.passwordHash != AuthLib.doHashPassword(adminPassword)) {
          return #err("Invalid admin credentials")
        };
      };
    };

    // ── Clear all data collections ──────────────────────────────────────────
    sessions.clear();
    sections.clear();
    subjects.clear();
    subjectClassMaps.clear();
    chapters.clear();
    studentsV2.clear();
    feeHeadings.clear();
    feePlans.clear();
    feePayments.clear();
    attendance.clear();
    attSessions.clear();
    examTimetables.clear();
    examResults.clear();
    onlineExams.clear();
    examSubmissions.clear();
    staff.clear();
    teacherAssignments.clear();
    payrollRecords.clear();
    routes.clear();
    pickupPoints.clear();
    notifications.clear();
    books.clear();
    bookIssues.clear();
    invItems.clear();
    invTransactions.clear();
    userAccounts.clear();
    auditLogs.clear();
    expenseHeads.clear();
    expenseEntries.clear();
    homework.clear();
    hwSubmissions.clear();
    alumni.clear();
    chatRooms.clear();
    chatMessages.clear();
    virtualClasses.clear();
    certTemplates.clear();
    staffPayouts.clear();
    staffIncentives.clear();
    staffLoans.clear();
    enhancedPayroll.clear();
    upiPaymentSubmissions.clear();
    autoCreatedCredentials.clear();
    syllabusContents.clear();
    deviceConfigs.clear();
    customColumnDefs.clear();
    studentCustomData.clear();
    appUsers.clear();
    rolePermissions.clear();
    userRoleMap.clear();
    deviceAttendance.clear();
    staffAttendance.clear();
    smartExamTimetables.clear();
    classTimetables.clear();
    certTemplatesExt.clear();
    feeRegister.clear();
    studentDiscounts.clear();
    studentOldBalances.clear();
    busLocations.clear();
    subjectAssignments.clear();
    faceEnrollments.clear();
    expenseHeadsV2.clear();
    expenseEntriesV2.clear();
    directMessages.clear();

    // Clear bounded queue
    activityLog.clear();

    // ── Reset counters ──────────────────────────────────────────────────────
    nextId := 1;
    receiptCounter := 1;
    nextAppUserId.value := 1;
    nextDeviceAttId.value := 1;
    nextStaffAttId.value := 1;
    nextSmartExamId.value := 1;
    classTtGenId.value := 1;
    nextCertId.value := 1;
    nextExtrasId.value := 1;
    genSubjectAssignId.value := 1;
    genExpenseId.value := 1;

    // ── Re-seed defaults ────────────────────────────────────────────────────

    // Default sessions: 2024-25 and 2025-26
    let sess1Id = genId();
    sessions.add(sess1Id, {
      id = sess1Id;
      sessionName = "2024-25";
      startDate = "01/04/2024";
      endDate = "31/03/2025";
      isActive = false;
      isArchived = false;
      createdAt = Time.now();
    });
    let sess2Id = genId();
    sessions.add(sess2Id, {
      id = sess2Id;
      sessionName = "2025-26";
      startDate = "01/04/2025";
      endDate = "31/03/2026";
      isActive = true;
      isArchived = false;
      createdAt = Time.now();
    });

    // Default admin user
    AuthLib.seedAdmin(appUsers, nextAppUserId);

    // Default role permissions matrix
    AuthLib.seedRolePermissions(rolePermissions);

    #ok("Factory reset complete. All data cleared. Default sessions (2024-25, 2025-26) and admin account (admin/admin123) restored.")
  };

  // ─── STABLE UPGRADE MIGRATION ──────────────────────────────────────────────
  // studentsV2 is a fresh stable Map<Text, Student> with the full Student type
  // including all new optional fields (mobile, srNo, penNo, apaarNo, prevSchool,
  // admissionDate). The old `students` stable var (without these fields) is
  // intentionally abandoned — all duplicate admission number records are cleared.
  // The _studentsV0 stable array is kept empty to avoid any overhead.
  var _studentsV0 : [(Text, OldStudent)] = [];

  system func preupgrade() {
    // studentsV2 is implicitly stable via mo:core/Map; no snapshot needed.
    // _studentsV0 is always kept empty — migration was one-time.
  };

  system func postupgrade() {
    // _studentsV0 is empty on all upgrades after the initial fresh deploy.
    _studentsV0 := [];
  };

}
