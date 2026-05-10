import ClassTimetableTypes "../types/class-timetable";
import DeviceAttTypes "../types/device-attendance";
import FETypes "../types/face-enrollment";
import SATypes "../types/subject-assignment";
import ETypes "../types/expenses-v2";
import SyllabusTypes "../types/syllabus";
import FeeExtrasTypes "../types/fee-extras";

/// Shared backup/restore types module.
/// main.mo imports this as BackupRestoreTypes to access all payload types.
module {

  // ── Inline shared-type aliases (must match main.mo exactly) ───────────────

  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12;
  };

  public type StudentStatus    = { #Active; #Discontinued; #Graduated };
  public type StaffStatus      = { #Active; #Inactive };
  public type AttendanceStatus = { #Present; #Absent; #Late; #Leave };
  public type InvTxType        = { #Purchase; #Sale; #Adjustment };
  public type PayrollStatus    = { #Pending; #Paid };
  public type BookIssueStatus  = { #Issued; #Returned; #Overdue };
  public type ExpHeadType      = { #Income; #Expense };
  public type ChatRoomType     = { #Direct; #ClassGroup; #RouteGroup; #General };

  // ── Row types (all fields shared-type) ──────────────────────────────────

  public type StudentRow = {
    id : Text; admNo : Text; fullName : Text; fatherName : Text; motherName : Text;
    fatherMobile : Text; motherMobile : ?Text; dateOfBirth : Text; gender : Text;
    currentAddress : Text; permanentAddress : Text; classLevel : ClassLevel;
    sectionId : Text; session : Text; photoUrl : ?Text; status : StudentStatus;
    bloodGroup : ?Text; religion : ?Text; category : ?Text; aadhaarNo : ?Text;
    transportRouteId : ?Text; transportPickupPointId : ?Text; busNo : ?Text;
    createdAt : Int; mobile : ?Text; srNo : ?Text; penNo : ?Text; apaarNo : ?Text;
    prevSchool : ?Text; admissionDate : ?Text;
  };

  public type StaffRow = {
    id : Text; employeeId : Text; fullName : Text; designation : Text;
    department : Text; mobile : Text; email : ?Text; address : Text;
    dateOfJoining : Text; salary : Nat; status : StaffStatus; photoUrl : ?Text;
    aadhaarNo : ?Text; bankAccount : ?Text; ifscCode : ?Text; createdAt : Int;
  };

  public type SectionRow = {
    id : Text; classLevel : ClassLevel; sectionName : Text;
    roomNo : ?Text; teacherId : ?Text;
  };

  public type SessionRow = {
    id : Text; sessionName : Text; startDate : Text; endDate : Text;
    isActive : Bool; isArchived : Bool; createdAt : Int;
  };

  public type SubjectRow = {
    id : Text; name : Text; code : Text; classLevel : ClassLevel;
    maxMarks : Nat; passingMarks : Nat;
  };

  public type SubjectClassMapRow = {
    subjectId : Text; classLevels : [ClassLevel];
  };

  public type FeeHeadingRow = {
    id : Text; name : Text; description : ?Text; isActive : Bool; applicableMonths : [Text];
  };

  public type FeePlanRow = {
    id : Text; classLevel : ClassLevel; sectionId : ?Text;
    session : Text; monthlyAmounts : [(Text, Nat)];
  };

  public type FeePaymentItemRow = { headingId : Text; month : Text; amount : Nat };
  public type OtherFeeRow        = { description : Text; amount : Nat };

  public type FeeCollectionRow = {
    id : Text; studentId : Text; sessionId : Text; receiptNo : Text;
    paymentDate : Text; items : [FeePaymentItemRow]; otherFee : ?OtherFeeRow;
    totalDue : Nat; totalAmount : Nat; balance : Nat; paymentMode : Text;
    upiRef : ?Text; remarks : ?Text; createdBy : Text; isDeleted : Bool;
    createdAt : Int; lateFees : Nat; discountTotal : Nat; balanceCarriedForward : Float;
  };

  public type StudentDiscountRow = {
    id : Text; studentId : Text; headingId : Text; amount : Nat;
    remark : ?Text; createdAt : Int;
  };

  public type StudentOldBalanceRow = {
    id : Text; studentId : Text; sessionId : Text; amount : Float; addedAt : Int;
  };

  public type ExamScheduleEntryRow = {
    subjectId : Text; date : Text; startTime : Text; endTime : Text;
    room : ?Text; invigilatorId : ?Text;
  };

  public type ExamTimetableRow = {
    id : Text; examName : Text; session : Text; classLevel : ClassLevel;
    schedule : [ExamScheduleEntryRow];
  };

  public type AttendanceRow = {
    id : Text; studentId : Text; date : Text; status : AttendanceStatus;
    remarks : ?Text; markedBy : Text;
  };

  public type RouteRow = {
    id : Text; routeName : Text; routeNo : Text; busNo : Text;
    driverName : Text; driverMobile : Text; capacity : Nat;
  };

  public type PickupPointRow = {
    id : Text; routeId : Text; name : Text; timing : Text;
    monthlyFare : Float; order : Nat;
  };

  public type InventoryItemRow = {
    id : Text; name : Text; category : Text; store : Text; unit : Text;
    currentStock : Nat; minStock : Nat; purchasePrice : Nat; salePrice : Nat;
  };

  public type InventoryTxRow = {
    id : Text; itemId : Text; transactionType : InvTxType; quantity : Int;
    unitPrice : Nat; totalAmount : Nat; date : Text; remarks : ?Text;
    createdBy : Text; buyerAdmNo : Text; buyerName : Text; sellerName : Text;
    receivedAmount : Nat; balanceAmount : Nat;
  };

  public type PayrollRow = {
    id : Text; staffId : Text; month : Text; year : Text; basicSalary : Nat;
    presentDays : Nat; totalDays : Nat; deductions : Nat; additions : Nat;
    netSalary : Nat; paymentDate : ?Text; status : PayrollStatus; generatedBy : Text;
  };

  public type StaffPayoutRow = {
    id : Text; staffId : Text; amount : Float; mode : Text;
    date : Text; notes : Text; recordedBy : Text; createdAt : Int;
  };

  public type StaffIncentiveRow = {
    id : Text; staffId : Text; amount : Float; reason : Text;
    month : Text; year : Text; approvedBy : Text; createdAt : Int;
  };

  public type StaffLoanRow = {
    id : Text; staffId : Text; principalAmount : Float; remainingAmount : Float;
    monthlyDeduction : Float; startMonth : Text; notes : Text; createdAt : Int;
  };

  public type EnhancedPayrollRow = {
    id : Text; staffId : Text; month : Text;
    grossSalary : Float; deductions : Float; incentives : Float;
    loanDeduction : Float; advancePaid : Float; netSalary : Float;
    attendanceDays : Float; workingDays : Float; absentDays : Float;
    deductibleDays : Float; payouts : [StaffPayoutRow];
    paymentStatus : Text; payslipNotes : Text; generatedAt : Int;
  };

  public type BookRow = {
    id : Text; isbn : Text; title : Text; author : Text; publisher : ?Text;
    category : Text; totalCopies : Nat; availableCopies : Nat;
    shelfLocation : ?Text; photoUrl : ?Text;
  };

  public type BookIssueRow = {
    id : Text; bookId : Text; studentId : Text; issueDate : Text;
    dueDate : Text; returnDate : ?Text; status : BookIssueStatus; fine : Nat;
  };

  public type AlumniRow = {
    id : Text; fullName : Text; graduationYear : Text; className : Text;
    currentOccupation : ?Text; currentCity : ?Text; mobile : ?Text;
    email : ?Text; photoUrl : ?Text;
  };

  public type NotificationRow = {
    id : Text; title : Text; message : Text; targetRole : ?Text;
    targetStudentId : ?Text; targetClassLevel : ?ClassLevel;
    createdBy : Text; createdAt : Int; isRead : Bool; notifType : Text;
  };

  public type ChatRoomRow = {
    id : Text; name : Text; roomType : ChatRoomType; members : [Text];
    createdBy : Text; createdAt : Int;
  };

  public type QAPairRow = { question : Text; answer : Text };

  public type SyllabusChapterRow = {
    id : Text; subjectId : Text; chapterNo : Nat; title : Text;
    topics : [Text]; completionPercent : Nat; classLevel : Text;
  };

  public type SyllabusContentRow = {
    chapterId : Text; contentText : Text;
    generatedQA : [QAPairRow]; savedQA : [QAPairRow];
    approvalStatus : Text; rejectionReason : ?Text;
    submittedAt : ?Int; approvedAt : ?Int;
    userProvidedQuestions : [Text];
  };

  public type UserAccountRow = {
    id : Text; principalId : Text; username : Text; fullName : Text;
    role : Text; position : ?Text; classLevel : ?ClassLevel; sectionId : ?Text;
    staffId : ?Text; studentId : ?Text; isActive : Bool; permissions : [Text];
    createdAt : Int;
  };

  public type AppSettingsRow = {
    whatsappApiKey : ?Text; whatsappApiUrl : ?Text;
    razorpayEnabled : Bool; payuEnabled : Bool; gpayEnabled : Bool;
    upiId : ?Text; activeTheme : Text; dashboardBgUrl : ?Text;
    messageTemplates : [(Text, Text)];
  };

  public type SchoolInfoRow = {
    name : Text; about : Text; photoUrl : ?Text; address : Text;
    phone : Text; email : Text; website : ?Text;
  };

  /// Per-record error collected during restore.
  public type BackupError = {
    entityType : Text;
    recordId   : Text;
    reason     : Text;
  };

  public type RestoreStats = {
    students           : Nat;
    staff              : Nat;
    sections           : Nat;
    sessions           : Nat;
    subjects           : Nat;
    subjectClassMaps   : Nat;
    feeHeadings        : Nat;
    feePlans           : Nat;
    feeCollections     : Nat;
    studentDiscounts   : Nat;
    studentOldBalances : Nat;
    classTimetables    : Nat;
    examTimetables     : Nat;
    attendance         : Nat;
    deviceAttendance   : Nat;
    staffAttendance    : Nat;
    faceEnrollments    : Nat;
    routes             : Nat;
    pickupPoints       : Nat;
    inventory          : Nat;
    inventoryTx        : Nat;
    payrollRecords     : Nat;
    staffPayouts       : Nat;
    staffIncentives    : Nat;
    staffLoans         : Nat;
    enhancedPayroll    : Nat;
    subjectAssignments : Nat;
    expenseHeads       : Nat;
    expenseEntries     : Nat;
    libraryBooks       : Nat;
    libraryIssues      : Nat;
    alumniRecords      : Nat;
    notifications      : Nat;
    chatRooms          : Nat;
    syllabusChapters   : Nat;
    syllabusContents   : Nat;
    userAccounts       : Nat;
    total              : Nat;
  };

  public type RestoreResult = {
    success      : Bool;
    message      : Text;
    successCount : Nat;
    failCount    : Nat;
    skippedCount : Nat;
    errors       : [BackupError];
    recordCounts : RestoreStats;
  };

  /// Full backup payload — every collection is an array for JSON serialisation.
  public type BackupPayload = {
    students           : [StudentRow];
    staff              : [StaffRow];
    sections           : [SectionRow];
    sessions           : [SessionRow];
    subjects           : [SubjectRow];
    subjectClassMaps   : [SubjectClassMapRow];
    feeHeadings        : [FeeHeadingRow];
    feePlans           : [FeePlanRow];
    feeCollections     : [FeeCollectionRow];
    studentDiscounts   : [StudentDiscountRow];
    studentOldBalances : [StudentOldBalanceRow];
    classTimetables    : [ClassTimetableTypes.ClassTimetable];
    examTimetables     : [ExamTimetableRow];
    attendanceRecords  : [AttendanceRow];
    deviceAttendance   : [DeviceAttTypes.DeviceAttendanceRecord];
    staffAttendance    : [DeviceAttTypes.StaffAttendanceRecord];
    faceEnrollments    : [FETypes.FaceEnrollmentRecord];
    routes             : [RouteRow];
    pickupPoints       : [PickupPointRow];
    inventoryItems     : [InventoryItemRow];
    inventoryTx        : [InventoryTxRow];
    payrollRecords     : [PayrollRow];
    staffPayouts       : [StaffPayoutRow];
    staffIncentives    : [StaffIncentiveRow];
    staffLoans         : [StaffLoanRow];
    enhancedPayroll    : [EnhancedPayrollRow];
    subjectAssignments : [SATypes.SubjectAssignment];
    expenseHeads       : [ETypes.ExpenseHead];
    expenseEntries     : [ETypes.ExpenseEntry];
    libraryBooks       : [BookRow];
    libraryIssues      : [BookIssueRow];
    alumniRecords      : [AlumniRow];
    notifications      : [NotificationRow];
    chatRooms          : [ChatRoomRow];
    syllabusChapters   : [SyllabusChapterRow];
    syllabusContents   : [SyllabusContentRow];
    userAccounts       : [UserAccountRow];
    appSettings        : AppSettingsRow;
    schoolInfo         : SchoolInfoRow;
    backupVersion      : Text;
    backupTimestamp    : Int;
  };

}
