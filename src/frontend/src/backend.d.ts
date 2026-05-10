import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StaffLoanRow {
    id: string;
    remainingAmount: number;
    startMonth: string;
    staffId: string;
    createdAt: bigint;
    monthlyDeduction: number;
    notes: string;
    principalAmount: number;
}
export interface PromotionClassBreakdown {
    graduated: bigint;
    className: string;
    failed: bigint;
    promoted: bigint;
}
export interface SmartExamTimetable {
    id: bigint;
    startTime: string;
    status: string;
    endDate: string;
    endTime: string;
    entries: Array<SmartTimetableEntry>;
    sessionId: string;
    examName: string;
    participatingClasses: Array<ClassLevel>;
    startDate: string;
}
export interface SmartTimetableEntry {
    day: string;
    subjectName: string;
    date: string;
    isLocked: boolean;
    classLevel: ClassLevel;
    position: bigint;
}
export interface RestoreStats {
    alumniRecords: bigint;
    staffLoans: bigint;
    expenseHeads: bigint;
    total: bigint;
    libraryIssues: bigint;
    userAccounts: bigint;
    examTimetables: bigint;
    staffIncentives: bigint;
    students: bigint;
    subjects: bigint;
    notifications: bigint;
    inventory: bigint;
    feeCollections: bigint;
    expenseEntries: bigint;
    staffPayouts: bigint;
    subjectClassMaps: bigint;
    syllabusContents: bigint;
    chatRooms: bigint;
    classTimetables: bigint;
    studentOldBalances: bigint;
    staff: bigint;
    payrollRecords: bigint;
    feeHeadings: bigint;
    sessions: bigint;
    attendance: bigint;
    studentDiscounts: bigint;
    staffAttendance: bigint;
    pickupPoints: bigint;
    subjectAssignments: bigint;
    enhancedPayroll: bigint;
    inventoryTx: bigint;
    deviceAttendance: bigint;
    sections: bigint;
    syllabusChapters: bigint;
    routes: bigint;
    faceEnrollments: bigint;
    feePlans: bigint;
    libraryBooks: bigint;
}
export interface ExamScheduleEntry {
    startTime: string;
    endTime: string;
    date: string;
    room?: string;
    subjectId: string;
    invigilatorId?: string;
}
export interface SyllabusChapter {
    id: string;
    title: string;
    chapterNo: bigint;
    completionPercent: bigint;
    topics: Array<string>;
    subjectId: string;
    classLevel: string;
}
export interface EnhancedPayrollRecord {
    id: string;
    month: string;
    incentives: number;
    paymentStatus: string;
    staffId: string;
    generatedAt: bigint;
    loanDeduction: number;
    deductions: number;
    netSalary: number;
    payslipNotes: string;
    attendanceDays: number;
    grossSalary: number;
    workingDays: number;
    advancePaid: number;
    absentDays: number;
    payouts: Array<StaffPayout>;
    deductibleDays: number;
}
export interface FaceEnrollmentRecord {
    studentId: string;
    admNo: string;
    descriptorJson: string;
    faceEnrollmentDate?: string;
    photoUrl?: string;
    updatedAt: bigint;
    enrolledBy: string;
    faceEnrolled: boolean;
}
export interface ClassLinks {
    sectionName: string;
    broadcastUrl: string;
    classLevel: string;
    cctvUrl: string;
}
export interface InventoryItem {
    id: string;
    purchasePrice: bigint;
    name: string;
    unit: string;
    minStock: bigint;
    store: string;
    category: string;
    salePrice: bigint;
    currentStock: bigint;
}
export interface QAPairRow {
    question: string;
    answer: string;
}
export interface VirtualClass {
    id: string;
    title: string;
    isCompleted: boolean;
    createdBy: string;
    platform: VirtualPlatform;
    meetingLink: string;
    durationMinutes: bigint;
    subjectId?: string;
    classLevel: ClassLevel;
    scheduledAt: string;
}
export interface StaffIncentive {
    id: string;
    month: string;
    staffId: string;
    approvedBy: string;
    createdAt: bigint;
    year: string;
    amount: number;
    reason: string;
}
export interface BookIssueRow {
    id: string;
    issueDate: string;
    status: BookIssueStatus;
    studentId: string;
    fine: bigint;
    dueDate: string;
    bookId: string;
    returnDate?: string;
}
export interface ExpenseEntry {
    id: string;
    date: string;
    createdAt: string;
    createdBy: string;
    description: string;
    amount: number;
    headId: string;
}
export interface AcademicPerformanceReport {
    examSummaries: Array<ExamSummary>;
    studentId: string;
    combinedGrade: string;
    combinedPercentage: number;
    sessionId: string;
    overallPassed: boolean;
}
export interface PayrollRow {
    id: string;
    status: PayrollStatus;
    month: string;
    staffId: string;
    generatedBy: string;
    presentDays: bigint;
    year: string;
    deductions: bigint;
    netSalary: bigint;
    totalDays: bigint;
    additions: bigint;
    paymentDate?: string;
    basicSalary: bigint;
}
export interface Student {
    id: string;
    status: StudentStatus;
    transportPickupPointId?: string;
    admNo: string;
    dateOfBirth: string;
    prevSchool?: string;
    admissionDate?: string;
    createdAt: bigint;
    srNo?: string;
    fullName: string;
    motherName: string;
    photoUrl?: string;
    permanentAddress: string;
    aadhaarNo?: string;
    sectionId: string;
    session: string;
    fatherName: string;
    bloodGroup?: string;
    gender: string;
    apaarNo?: string;
    currentAddress: string;
    category?: string;
    classLevel: ClassLevel;
    busNo?: string;
    motherMobile?: string;
    mobile?: string;
    penNo?: string;
    religion?: string;
    transportRouteId?: string;
    fatherMobile: string;
}
export interface FeePaymentEntry {
    id: string;
    isDeleted: boolean;
    studentId: string;
    collectedBy: string;
    totalAmount: bigint;
    paymentDate: string;
    receiptNo: string;
}
export interface StaffIncentiveRow {
    id: string;
    month: string;
    staffId: string;
    approvedBy: string;
    createdAt: bigint;
    year: string;
    amount: number;
    reason: string;
}
export interface DashboardStatsV2 {
    totalClasses: bigint;
    feesCollectedToday: bigint;
    totalStudents: bigint;
    recentActivity: Array<ActivityEntry>;
    totalStaff: bigint;
    feesCollectedThisMonth: bigint;
    feesCollectedThisYear: bigint;
    pendingFeesTotal: bigint;
    attendanceTodayPercent?: number;
    feesCollectedTodayBreakdown: Array<FeePaymentSummary>;
    totalSections: bigint;
}
export interface FeePaymentSummary {
    admNo: string;
    studentName: string;
    receiverName: string;
    paymentMode: string;
    receiptNo: string;
    amount: bigint;
    className: string;
}
export interface TransportRoute {
    id: string;
    driverMobile: string;
    routeName: string;
    routeNo: string;
    busNo: string;
    capacity: bigint;
    driverName: string;
}
export interface FeeRegisterEntry {
    id: string;
    studentId: string;
    balance: bigint;
    studentName: string;
    sectionName: string;
    collectedBy: string;
    totalDue: bigint;
    lateFees: bigint;
    totalAmount: bigint;
    paymentDate: string;
    paymentMode: string;
    receiptNo: string;
    sessionId: string;
    months: Array<string>;
    className: string;
    previousBalance: number;
    discountTotal: bigint;
}
export interface IndexPageConfig {
    customLinks: Array<CustomLink>;
    isPublished: boolean;
    ctaButtonText: string;
    ctaButtonColor: string;
    heroSubtitle: string;
    heroTextColor: string;
    heroImageFileId: string;
    heroBgColor: string;
    sections: Array<IndexPageSection>;
    heroTitle: string;
}
export interface ChapterWithQA {
    qas: Array<QAPair>;
    title: string;
    chapterId: string;
    chapterNo: bigint;
    userProvidedQuestions: Array<string>;
    approvalStatus: string;
    completionPercent: bigint;
    topics: Array<string>;
    subjectId: string;
    classLevel: string;
}
export interface StaffYearEndSummary {
    totalDeductions: number;
    totalEarned: number;
    totalPaid: number;
    monthsUnpaid: bigint;
    monthsPartiallyPaid: bigint;
    monthsFullyPaid: bigint;
    totalIncentives: number;
}
export interface StaffAttendanceRecord {
    id: bigint;
    month: bigint;
    staffName: string;
    staffId: string;
    date: string;
    year: bigint;
    inTime?: string;
    deviceType: AttendanceDevice;
    outTime?: string;
}
export interface Notification {
    id: string;
    title: string;
    notifType: string;
    createdAt: bigint;
    createdBy: string;
    isRead: boolean;
    targetClassLevel?: ClassLevel;
    targetStudentId?: string;
    message: string;
    targetRole?: string;
}
export interface AlumniRow {
    id: string;
    fullName: string;
    graduationYear: string;
    photoUrl?: string;
    email?: string;
    currentCity?: string;
    mobile?: string;
    currentOccupation?: string;
    className: string;
}
export interface StudentOldBalanceRow {
    id: string;
    studentId: string;
    addedAt: bigint;
    sessionId: string;
    amount: number;
}
export interface StudentRow {
    id: string;
    status: StudentStatus;
    transportPickupPointId?: string;
    admNo: string;
    dateOfBirth: string;
    prevSchool?: string;
    admissionDate?: string;
    createdAt: bigint;
    srNo?: string;
    fullName: string;
    motherName: string;
    photoUrl?: string;
    permanentAddress: string;
    aadhaarNo?: string;
    sectionId: string;
    session: string;
    fatherName: string;
    bloodGroup?: string;
    gender: string;
    apaarNo?: string;
    currentAddress: string;
    category?: string;
    classLevel: ClassLevel;
    busNo?: string;
    motherMobile?: string;
    mobile?: string;
    penNo?: string;
    religion?: string;
    transportRouteId?: string;
    fatherMobile: string;
}
export interface StaffLoan {
    id: string;
    remainingAmount: number;
    startMonth: string;
    staffId: string;
    createdAt: bigint;
    monthlyDeduction: number;
    notes: string;
    principalAmount: number;
}
export interface PromotionAllResult {
    totalPromoted: bigint;
    breakdown: Array<PromotionClassBreakdown>;
    totalGraduated: bigint;
    totalFailed: bigint;
}
export interface DeviceConfig {
    port?: bigint;
    updatedAt: bigint;
    usbPort?: string;
    deviceId?: string;
    deviceType: string;
    ipAddress?: string;
}
export interface BookRow {
    id: string;
    title: string;
    availableCopies: bigint;
    isbn: string;
    publisher?: string;
    photoUrl?: string;
    author: string;
    totalCopies: bigint;
    category: string;
    shelfLocation?: string;
}
export interface AppSettingsRow {
    gpayEnabled: boolean;
    payuEnabled: boolean;
    whatsappApiKey?: string;
    whatsappApiUrl?: string;
    activeTheme: string;
    razorpayEnabled: boolean;
    upiId?: string;
    messageTemplates: Array<[string, string]>;
    dashboardBgUrl?: string;
}
export interface ExamSubjectConfig {
    subjectName: string;
    subjectId: string;
    maxMarks: number;
    passingMarks: number;
}
export interface MCQQuestion {
    id: string;
    marks: bigint;
    correctOption: bigint;
    question: string;
    options: Array<string>;
}
export interface ExpenseHead {
    id: string;
    name: string;
    createdAt: string;
    color: string;
    type: string;
}
export interface ExamTimetableRow {
    id: string;
    session: string;
    classLevel: ClassLevel;
    schedule: Array<ExamScheduleEntryRow>;
    examName: string;
}
export interface StudentOldBalance {
    id: string;
    previousYearDue?: number;
    studentId: string;
    addedAt: bigint;
    sessionId: string;
    amount: number;
}
export interface ExamSummary {
    subjectMarks: Array<SubjectMarkEntry>;
    examConfigId: string;
    overallGrade: string;
    overallPassed: boolean;
    examName: string;
    percentage: number;
}
export interface StudentFeeCollectionData {
    previousYearDue: number;
    transportPickupPointId?: string;
    studentId: string;
    admNo: string;
    studentName: string;
    payments: Array<FeePayment>;
    sectionName: string;
    feePlan?: FeePlan;
    discounts: Array<StudentDiscount>;
    photoUrl?: string;
    totalPaid: bigint;
    transportMonthlyFare: number;
    fatherName: string;
    oldBalanceAmount: number;
    transportRouteId?: string;
    className: string;
    fatherMobile: string;
    inventoryDue: bigint;
}
export interface ChatRoomRow {
    id: string;
    members: Array<string>;
    name: string;
    createdAt: bigint;
    createdBy: string;
    roomType: ChatRoomType;
}
export interface InventoryTransaction {
    id: string;
    itemId: string;
    balanceAmount: bigint;
    transactionType: InvTxType;
    date: string;
    createdBy: string;
    receivedAmount: bigint;
    sellerName: string;
    totalAmount: bigint;
    quantity: bigint;
    buyerAdmNo: string;
    buyerName: string;
    unitPrice: bigint;
    remarks?: string;
}
export interface CertificateTemplate {
    id: string;
    name: string;
    createdBy: string;
    templateType: string;
    updatedAt: bigint;
    isDefault: boolean;
    layoutJson: string;
}
export interface SubjectClassMap {
    classLevels: Array<ClassLevel>;
    subjectId: string;
}
export interface TeacherTimetableEntry {
    startTime: string;
    endTime: string;
    subjectName: string;
    sectionName: string;
    dayOfWeek: string;
    periodNumber: bigint;
    className: string;
}
export interface SubjectMarkEntry {
    subjectName: string;
    marksObtained: number;
    isPassed: boolean;
    grade: string;
    subjectId: string;
    maxMarks: number;
    passingMarks: number;
}
export interface Staff {
    id: string;
    status: StaffStatus;
    salary: bigint;
    bankAccount?: string;
    ifscCode?: string;
    designation: string;
    createdAt: bigint;
    fullName: string;
    photoUrl?: string;
    email?: string;
    dateOfJoining: string;
    aadhaarNo?: string;
    employeeId: string;
    address: string;
    mobile: string;
    department: string;
}
export interface BusLocation {
    latitude: number;
    isActive: boolean;
    routeName: string;
    updatedAt: bigint;
    routeId: string;
    longitude: number;
    busId: string;
    driverName: string;
}
export interface OtherFee {
    description: string;
    amount: bigint;
}
export interface ExpenseHead__1 {
    id: string;
    headType: ExpHeadType;
    name: string;
    description?: string;
}
export interface DirectMessage {
    id: string;
    toClassLevel?: string;
    deliveryStatus: string;
    sentAt: string;
    templateKey?: string;
    toStudentId?: string;
    toSection?: string;
    message: string;
    fromUsername: string;
    channel: string;
}
export interface ClassTimetableEntry {
    startTime: string;
    endTime: string;
    subjectName: string;
    sectionName: string;
    dayOfWeek: string;
    teacherStaffId: string;
    teacherName: string;
    periodNumber: bigint;
    classLevel: ClassLevel;
}
export interface FeeCollectionRow {
    id: string;
    isDeleted: boolean;
    studentId: string;
    balance: bigint;
    balanceCarriedForward: number;
    createdAt: bigint;
    createdBy: string;
    totalDue: bigint;
    upiRef?: string;
    lateFees: bigint;
    totalAmount: bigint;
    paymentDate: string;
    otherFee?: OtherFeeRow;
    paymentMode: string;
    receiptNo: string;
    sessionId: string;
    items: Array<FeePaymentItemRow>;
    remarks?: string;
    discountTotal: bigint;
}
export interface OnlineExam {
    id: string;
    startTime?: string;
    title: string;
    endTime?: string;
    createdBy: string;
    isActive: boolean;
    durationMinutes: bigint;
    subjectId?: string;
    questions: Array<MCQQuestion>;
    classLevel: ClassLevel;
}
export interface PayrollCalculation {
    month: bigint;
    faceCount: bigint;
    staffName: string;
    staffId: string;
    presentDays: bigint;
    year: bigint;
    netPay: bigint;
    monthlySalary: bigint;
    rfidCount: bigint;
    workingDays: bigint;
    absentDays: bigint;
    qrCount: bigint;
    biometricCount: bigint;
}
export interface StaffRow {
    id: string;
    status: StaffStatus;
    salary: bigint;
    bankAccount?: string;
    ifscCode?: string;
    designation: string;
    createdAt: bigint;
    fullName: string;
    photoUrl?: string;
    email?: string;
    dateOfJoining: string;
    aadhaarNo?: string;
    employeeId: string;
    address: string;
    mobile: string;
    department: string;
}
export interface FeePaymentUpdate {
    totalAmount?: number;
    paymentDate?: string;
    paymentMode?: string;
}
export interface ModulePermission {
    moduleId: string;
    canExport: boolean;
    canEdit: boolean;
    canView: boolean;
    canDelete: boolean;
    canCreate: boolean;
}
export interface InventoryItemRow {
    id: string;
    purchasePrice: bigint;
    name: string;
    unit: string;
    minStock: bigint;
    store: string;
    category: string;
    salePrice: bigint;
    currentStock: bigint;
}
export interface Book {
    id: string;
    title: string;
    availableCopies: bigint;
    isbn: string;
    publisher?: string;
    photoUrl?: string;
    author: string;
    totalCopies: bigint;
    category: string;
    shelfLocation?: string;
}
export interface BackupError {
    recordId: string;
    entityType: string;
    reason: string;
}
export interface OtherFeeRow {
    description: string;
    amount: bigint;
}
export interface AppUser {
    id: bigint;
    username: string;
    role: UserRole;
    isActive: boolean;
    passwordHash: string;
}
export interface GenerateTimetableParams {
    periodStartTimes: Array<string>;
    classSections: Array<[ClassLevel, string]>;
    name: string;
    periodConfigs?: Array<PeriodConfig>;
    periodEndTimes: Array<string>;
    periodsPerDay: bigint;
    sessionId: string;
    workDays: Array<string>;
}
export interface GenerateScheduleParams {
    startTime: string;
    endDate: string;
    endTime: string;
    classSubjects: Array<[ClassLevel, Array<string>]>;
    sessionId: string;
    examName: string;
    participatingClasses: Array<ClassLevel>;
    startDate: string;
}
export interface Section {
    id: string;
    sectionName: string;
    teacherId?: string;
    classLevel: ClassLevel;
    roomNo?: string;
}
export interface ActivityEntry {
    userName: string;
    actionType: string;
    description: string;
    timestamp: bigint;
}
export interface ClassTimetable {
    id: string;
    name: string;
    createdAt: bigint;
    periodConfigs?: Array<PeriodConfig>;
    entries: Array<ClassTimetableEntry>;
    updatedAt: bigint;
    sessionId: string;
}
export interface SubjectAssignment {
    id: string;
    staffId: string;
    subjectName: string;
    minClass?: string;
    createdAt: bigint;
    session: string;
    subjectId: string;
    maxClass?: string;
}
export interface EnhancedPayrollRow {
    id: string;
    month: string;
    incentives: number;
    paymentStatus: string;
    staffId: string;
    generatedAt: bigint;
    loanDeduction: number;
    deductions: number;
    netSalary: number;
    payslipNotes: string;
    attendanceDays: number;
    grossSalary: number;
    workingDays: number;
    advancePaid: number;
    absentDays: number;
    payouts: Array<StaffPayoutRow>;
    deductibleDays: number;
}
export interface BackupPayload {
    alumniRecords: Array<AlumniRow>;
    staffLoans: Array<StaffLoanRow>;
    expenseHeads: Array<ExpenseHead>;
    libraryIssues: Array<BookIssueRow>;
    userAccounts: Array<UserAccountRow>;
    examTimetables: Array<ExamTimetableRow>;
    staffIncentives: Array<StaffIncentiveRow>;
    students: Array<StudentRow>;
    subjects: Array<SubjectRow>;
    notifications: Array<NotificationRow>;
    inventoryItems: Array<InventoryItemRow>;
    feeCollections: Array<FeeCollectionRow>;
    expenseEntries: Array<ExpenseEntry>;
    staffPayouts: Array<StaffPayoutRow>;
    subjectClassMaps: Array<SubjectClassMapRow>;
    syllabusContents: Array<SyllabusContentRow>;
    attendanceRecords: Array<AttendanceRow>;
    chatRooms: Array<ChatRoomRow>;
    classTimetables: Array<ClassTimetable>;
    studentOldBalances: Array<StudentOldBalanceRow>;
    staff: Array<StaffRow>;
    backupVersion: string;
    payrollRecords: Array<PayrollRow>;
    backupTimestamp: bigint;
    feeHeadings: Array<FeeHeadingRow>;
    sessions: Array<SessionRow>;
    studentDiscounts: Array<StudentDiscountRow>;
    appSettings: AppSettingsRow;
    staffAttendance: Array<StaffAttendanceRecord>;
    pickupPoints: Array<PickupPointRow>;
    subjectAssignments: Array<SubjectAssignment>;
    enhancedPayroll: Array<EnhancedPayrollRow>;
    inventoryTx: Array<InventoryTxRow>;
    deviceAttendance: Array<DeviceAttendanceRecord>;
    sections: Array<SectionRow>;
    syllabusChapters: Array<SyllabusChapterRow>;
    routes: Array<RouteRow>;
    faceEnrollments: Array<FaceEnrollmentRecord>;
    feePlans: Array<FeePlanRow>;
    schoolInfo: SchoolInfoRow;
    libraryBooks: Array<BookRow>;
}
export interface SyllabusChapterRow {
    id: string;
    title: string;
    chapterNo: bigint;
    completionPercent: bigint;
    topics: Array<string>;
    subjectId: string;
    classLevel: string;
}
export interface SessionRow {
    id: string;
    endDate: string;
    sessionName: string;
    createdAt: bigint;
    isArchived: boolean;
    isActive: boolean;
    startDate: string;
}
export interface DeviceAttendanceRecord {
    id: bigint;
    status: string;
    studentId: bigint;
    studentName: string;
    date: string;
    section: string;
    inTime?: string;
    classLevel: ClassLevel;
    deviceType: AttendanceDevice;
    outTime?: string;
}
export interface UserAccount {
    id: string;
    permissions: Array<string>;
    studentId?: string;
    username: string;
    staffId?: string;
    createdAt: bigint;
    role: string;
    fullName: string;
    isActive: boolean;
    sectionId?: string;
    classLevel?: ClassLevel;
    position?: string;
    principalId: string;
}
export interface InventoryTxRow {
    id: string;
    itemId: string;
    balanceAmount: bigint;
    transactionType: InvTxType;
    date: string;
    createdBy: string;
    receivedAmount: bigint;
    sellerName: string;
    totalAmount: bigint;
    quantity: bigint;
    buyerAdmNo: string;
    buyerName: string;
    unitPrice: bigint;
    remarks?: string;
}
export interface FeePayment {
    id: string;
    isDeleted: boolean;
    studentId: string;
    balance: bigint;
    balanceCarriedForward: number;
    createdAt: bigint;
    createdBy: string;
    totalDue: bigint;
    upiRef?: string;
    lateFees: bigint;
    totalAmount: bigint;
    paymentDate: string;
    otherFee?: OtherFee;
    paymentMode: string;
    receiptNo: string;
    sessionId: string;
    items: Array<FeePaymentItem>;
    remarks?: string;
    discountTotal: bigint;
}
export interface AttendanceBreakdownRow {
    classLevelText: string;
    sectionName: string;
    totalCount: bigint;
    presentCount: bigint;
    sectionId: string;
    absentCount: bigint;
}
export interface SubjectClassMapRow {
    classLevels: Array<ClassLevel>;
    subjectId: string;
}
export interface QAPair {
    question: string;
    answer: string;
}
export interface BackupSettings {
    backupSchedule: BackupSchedule;
    lastBackupTimestamp: bigint;
    backupGmail?: string;
}
export interface PeriodConfig {
    startTime: string;
    durationMinutes: bigint;
    periodNumber: bigint;
    isInterval: boolean;
}
export interface DemandRegisterFilter {
    sectionFilter?: string;
    sessionId: string;
    months: Array<string>;
    headingIds: Array<string>;
    classFilter?: string;
}
export interface StaffPayrollRecord {
    id: string;
    status: PayrollMonthStatus;
    month: bigint;
    staffId: string;
    generatedAt: bigint;
    presentDays: bigint;
    deduction: bigint;
    year: bigint;
    freeLeave: bigint;
    netPay: bigint;
    amountPaid: bigint;
    lockedAt?: bigint;
    notes: string;
    workingDays: bigint;
    absentDays: bigint;
    baseSalary: bigint;
    deductibleDays: bigint;
}
export interface FeePaymentItemRow {
    month: string;
    headingId: string;
    amount: bigint;
}
export interface ChatMessage {
    id: string;
    attachmentUrl?: string;
    isDeleted: boolean;
    content: string;
    sentAt: bigint;
    roomId: string;
    senderId: string;
}
export interface AttendanceRow {
    id: string;
    status: AttendanceStatus;
    studentId: string;
    date: string;
    markedBy: string;
    remarks?: string;
}
export interface Subject {
    id: string;
    code: string;
    name: string;
    maxMarks: bigint;
    classLevel: ClassLevel;
    passingMarks: bigint;
}
export interface RolePermissions {
    role: UserRole;
    modulePermissions: Array<ModulePermission>;
}
export interface ExamTimetable {
    id: string;
    session: string;
    classLevel: ClassLevel;
    schedule: Array<ExamScheduleEntry>;
    examName: string;
}
export interface AttendanceSummaryToday {
    totalStudents: bigint;
    totalStaff: bigint;
    presentStaff: bigint;
    presentStudents: bigint;
}
export interface AttendanceRecord {
    id: string;
    status: AttendanceStatus;
    studentId: string;
    date: string;
    markedBy: string;
    remarks?: string;
}
export interface HomeworkSubmission {
    id: string;
    attachmentUrl?: string;
    content?: string;
    studentId: string;
    homeworkId: string;
    submittedAt: bigint;
    feedback?: string;
    grade?: string;
}
export interface SyllabusContent {
    contentText: string;
    generatedQA: Array<QAPair>;
    approvedAt?: bigint;
    rejectionReason?: string;
    submittedAt?: bigint;
    chapterId: string;
    userProvidedQuestions: Array<string>;
    approvalStatus: string;
    savedQA: Array<QAPair>;
}
export interface FeeHeading {
    id: string;
    applicableMonths: Array<string>;
    name: string;
    description?: string;
    isActive: boolean;
}
export interface FeeAuditLog {
    id: string;
    action: string;
    oldValue: string;
    studentId: string;
    newValue: string;
    adminName: string;
    paymentId: string;
    timestamp: bigint;
    adminId: string;
    fieldChanged: string;
}
export interface StudentDiscount {
    id: string;
    remark?: string;
    studentId: string;
    createdAt: bigint;
    headingId: string;
    amount: bigint;
}
export interface ExamConfig {
    id: string;
    weightage: number;
    subjectConfigs: Array<ExamSubjectConfig>;
    includeInCombined: boolean;
    createdAt: bigint;
    classId: string;
    sessionId: string;
    examName: string;
}
export interface AlumniRecord {
    id: string;
    fullName: string;
    graduationYear: string;
    photoUrl?: string;
    email?: string;
    currentCity?: string;
    mobile?: string;
    currentOccupation?: string;
    className: string;
}
export interface OnlineExamSubmission {
    id: string;
    totalMarks: bigint;
    studentId: string;
    answers: Array<[string, bigint]>;
    submittedAt: bigint;
    score: bigint;
    timeTakenSecs: bigint;
    examId: string;
}
export interface DailySalesSummary {
    date: string;
    totalSales: bigint;
    totalAmount: number;
    itemsSold: bigint;
}
export interface AcademicSession {
    id: string;
    endDate: string;
    sessionName: string;
    createdAt: bigint;
    isArchived: boolean;
    isActive: boolean;
    startDate: string;
}
export interface RestoreResult {
    errors: Array<BackupError>;
    successCount: bigint;
    message: string;
    recordCounts: RestoreStats;
    success: boolean;
    failCount: bigint;
    skippedCount: bigint;
}
export interface FullPayrollRecord {
    id: string;
    status: string;
    month: string;
    incentives: number;
    staffName: string;
    staffId: string;
    dailyRate: number;
    createdAt: bigint;
    year: string;
    freeLeaves: bigint;
    netSalary: number;
    daysAbsent: bigint;
    deductionAmount: number;
    updatedAt: bigint;
    daysPresent: bigint;
    workingDays: bigint;
    basicSalary: number;
    deductibleDays: bigint;
}
export interface FeePaymentItem {
    month: string;
    headingId: string;
    amount: bigint;
}
export interface AppSettings {
    gpayEnabled: boolean;
    payuEnabled: boolean;
    whatsappApiKey?: string;
    whatsappApiUrl?: string;
    activeTheme: string;
    razorpayEnabled: boolean;
    upiId?: string;
    messageTemplates: Array<[string, string]>;
    dashboardBgUrl?: string;
}
export interface NotificationRow {
    id: string;
    title: string;
    notifType: string;
    createdAt: bigint;
    createdBy: string;
    isRead: boolean;
    targetClassLevel?: ClassLevel;
    targetStudentId?: string;
    message: string;
    targetRole?: string;
}
export interface FeeRegisterBalanceEntry {
    id: string;
    studentId: string;
    collectedBy: string;
    totalAmount: bigint;
    paymentDate: string;
    receiptNo: string;
    previousBalance: number;
}
export interface SchoolInfoRow {
    about: string;
    name: string;
    photoUrl?: string;
    email: string;
    website?: string;
    address: string;
    phone: string;
}
export interface ExamScheduleEntryRow {
    startTime: string;
    endTime: string;
    date: string;
    room?: string;
    subjectId: string;
    invigilatorId?: string;
}
export interface SyllabusContentRow {
    contentText: string;
    generatedQA: Array<QAPairRow>;
    approvedAt?: bigint;
    rejectionReason?: string;
    submittedAt?: bigint;
    chapterId: string;
    userProvidedQuestions: Array<string>;
    approvalStatus: string;
    savedQA: Array<QAPairRow>;
}
export interface SubjectRow {
    id: string;
    code: string;
    name: string;
    maxMarks: bigint;
    classLevel: ClassLevel;
    passingMarks: bigint;
}
export interface FeeHeadingRow {
    id: string;
    applicableMonths: Array<string>;
    name: string;
    description?: string;
    isActive: boolean;
}
export interface PickupPoint {
    id: string;
    timing: string;
    order: bigint;
    name: string;
    routeId: string;
    monthlyFare: number;
}
export interface UpiPaymentSubmission {
    status: string;
    studentId: string;
    submittedAt: string;
    utrNumber: string;
    amount: bigint;
    verifiedAt?: string;
    verifiedBy?: string;
}
export interface PromotionPreviewItem {
    studentId: string;
    admNo: string;
    discountCount: bigint;
    fullName: string;
    oldBalance: number;
    hasTransport: boolean;
}
export interface ExpenseEntry__1 {
    id: string;
    receipt?: string;
    date: string;
    createdAt: bigint;
    createdBy: string;
    description: string;
    amount: bigint;
    headId: string;
}
export interface CellCopyOp {
    source: TimetableCellRef;
    target: TimetableCellRef;
}
export interface CalendarStats {
    holidayCount: bigint;
    workingDays: bigint;
    sundayCount: bigint;
    totalDaysFromApril1: bigint;
}
export interface AuditLog {
    id: string;
    action: string;
    moduleName: string;
    userId: string;
    timestamp: bigint;
    details: string;
}
export interface ExpenseStats {
    balance: number;
    totalIncome: number;
    totalExpense: number;
}
export interface AttendanceSystemSettings {
    qr: boolean;
    essl: boolean;
    face: boolean;
    rfid: boolean;
}
export interface ExamCalendarEntry {
    id: string;
    date: string;
    createdAt: bigint;
    examName: string;
    className: string;
}
export interface HomeworkEntry {
    id: string;
    attachmentUrl?: string;
    title: string;
    createdAt: bigint;
    createdBy: string;
    dueDate: string;
    description: string;
    sectionId?: string;
    subjectId: string;
    classLevel: ClassLevel;
}
export interface CustomLink {
    url: string;
    linkLabel: string;
    order: bigint;
    isExternal: boolean;
}
export interface StaffPaymentSummaryEntry {
    status: string;
    month: string;
    netSalary?: number;
    amountPaid: number;
}
export interface PickupPointRow {
    id: string;
    timing: string;
    order: bigint;
    name: string;
    routeId: string;
    monthlyFare: number;
}
export interface StudentDiscountRow {
    id: string;
    remark?: string;
    studentId: string;
    createdAt: bigint;
    headingId: string;
    amount: bigint;
}
export interface SchoolInfo {
    about: string;
    name: string;
    photoUrl?: string;
    email: string;
    website?: string;
    address: string;
    phone: string;
}
export interface StaffAttBreakdown {
    staffList: Array<{
        status: string;
        staffId: string;
        name: string;
        inTime?: string;
        outTime?: string;
    }>;
    totalCount: bigint;
    presentCount: bigint;
}
export interface PromotionResult {
    errors: Array<string>;
    failed: bigint;
    promoted: bigint;
}
export interface ExamResult {
    id: string;
    totalMarks: bigint;
    studentId: string;
    scores: Array<[string, bigint]>;
    rank?: bigint;
    examTimetableId: string;
    grade: string;
    remarks?: string;
    percentage: number;
}
export interface RoomRec {
    id: string;
    members: Array<string>;
    name: string;
    createdAt: bigint;
    createdBy: string;
    roomType: ChatRoomType;
}
export interface PaidLeaveConfig {
    updatedAt: bigint;
    daysPerMonth: number;
}
export interface StaffPayoutRow {
    id: string;
    staffId: string;
    date: string;
    mode: string;
    createdAt: bigint;
    recordedBy: string;
    notes: string;
    amount: number;
}
export interface FeePlanRow {
    id: string;
    monthlyAmounts: Array<[string, bigint]>;
    sectionId?: string;
    session: string;
    classLevel: ClassLevel;
}
export interface StudentWithPickupPoint {
    student: Student;
    pickupPoint?: PickupPoint;
}
export interface SectionRow {
    id: string;
    sectionName: string;
    teacherId?: string;
    classLevel: ClassLevel;
    roomNo?: string;
}
export interface TeacherTimetable {
    id: string;
    teacherStaffId: string;
    generatedAt: bigint;
    teacherName: string;
    entries: Array<TeacherTimetableEntry>;
    sessionId: string;
}
export interface StaffPayout {
    id: string;
    staffId: string;
    date: string;
    mode: string;
    createdAt: bigint;
    recordedBy: string;
    notes: string;
    amount: number;
}
export interface PayrollRecord {
    id: string;
    status: PayrollStatus;
    month: string;
    staffId: string;
    generatedBy: string;
    presentDays: bigint;
    year: string;
    deductions: bigint;
    netSalary: bigint;
    totalDays: bigint;
    additions: bigint;
    paymentDate?: string;
    basicSalary: bigint;
}
export interface UserAccountRow {
    id: string;
    permissions: Array<string>;
    studentId?: string;
    username: string;
    staffId?: string;
    createdAt: bigint;
    role: string;
    fullName: string;
    isActive: boolean;
    sectionId?: string;
    classLevel?: ClassLevel;
    position?: string;
    principalId: string;
}
export interface DemandRegisterEntry {
    studentId: string;
    admNo: string;
    studentName: string;
    section: string;
    totalDue: bigint;
    fatherName: string;
    oldBalance: bigint;
    duesPerHeading: Array<[string, string, bigint]>;
    phone: string;
    months: Array<string>;
    className: string;
}
export interface ChatRoom {
    id: string;
    members: Array<string>;
    name: string;
    createdAt: bigint;
    createdBy: string;
    roomType: ChatRoomType;
}
export interface TeacherSubjectAssignment {
    id: string;
    sectionId?: string;
    session: string;
    subjectId: string;
    teacherId: string;
    classLevel: ClassLevel;
}
export interface CertificateTemplate__1 {
    id: string;
    thumbnail: string;
    elementsJson: string;
    name: string;
    createdBy: string;
    templateType: string;
    updatedAt: bigint;
    isDefault: boolean;
}
export interface RouteRow {
    id: string;
    driverMobile: string;
    routeName: string;
    routeNo: string;
    busNo: string;
    capacity: bigint;
    driverName: string;
}
export interface ExamResultV2 {
    id: string;
    subjectMarks: Array<SubjectMarkEntry>;
    examConfigId: string;
    studentId: string;
    overallGrade: string;
    rank?: bigint;
    classId: string;
    totalObtained: number;
    totalMax: number;
    savedAt: bigint;
    sessionId: string;
    overallPassed: boolean;
    examName: string;
    remarks?: string;
    percentage: number;
}
export interface IndexPageSection {
    id: string;
    title: string;
    order: bigint;
    sectionType: string;
    description: string;
    isVisible: boolean;
    imageFileId: string;
    textColor: string;
    bgColor: string;
}
export interface Holiday {
    id: string;
    isRecurring: boolean;
    date: string;
    name: string;
    createdAt: bigint;
    description: string;
}
export interface FeePlan {
    id: string;
    monthlyAmounts: Array<[string, bigint]>;
    sectionId?: string;
    session: string;
    classLevel: ClassLevel;
}
export interface BookIssue {
    id: string;
    issueDate: string;
    status: BookIssueStatus;
    studentId: string;
    fine: bigint;
    dueDate: string;
    bookId: string;
    returnDate?: string;
}
export interface TimetableCellRef {
    dayOfWeek: string;
    classId: string;
    periodNumber: bigint;
}
export enum AttendanceDevice {
    QR = "QR",
    Face = "Face",
    RFID = "RFID",
    ESSLBiometric = "ESSLBiometric"
}
export enum AttendanceStatus {
    Leave = "Leave",
    Present = "Present",
    Late = "Late",
    Absent = "Absent"
}
export enum BackupSchedule {
    never_ = "never",
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum BookIssueStatus {
    Overdue = "Overdue",
    Issued = "Issued",
    Returned = "Returned"
}
export enum ChatRoomType {
    General = "General",
    RouteGroup = "RouteGroup",
    ClassGroup = "ClassGroup",
    Direct = "Direct"
}
export enum ExpHeadType {
    Income = "Income",
    Expense = "Expense"
}
export enum InvTxType {
    Sale = "Sale",
    Purchase = "Purchase",
    Adjustment = "Adjustment"
}
export enum PayrollMonthStatus {
    paid = "paid",
    unpaid = "unpaid",
    partial = "partial"
}
export enum PayrollStatus {
    Paid = "Paid",
    Pending = "Pending"
}
export enum PromClassLevel {
    LKG = "LKG",
    UKG = "UKG",
    Class10 = "Class10",
    Class11 = "Class11",
    Class12 = "Class12",
    Class1 = "Class1",
    Class2 = "Class2",
    Class3 = "Class3",
    Class4 = "Class4",
    Class5 = "Class5",
    Class6 = "Class6",
    Class7 = "Class7",
    Class8 = "Class8",
    Class9 = "Class9",
    PlayWay = "PlayWay"
}
export enum StaffStatus {
    Inactive = "Inactive",
    Active = "Active"
}
export enum StudentStatus {
    Discontinued = "Discontinued",
    Active = "Active",
    Graduated = "Graduated"
}
export enum UserRole {
    Driver = "Driver",
    Parent = "Parent",
    Teacher = "Teacher",
    Student = "Student",
    Admin = "Admin",
    Principal = "Principal",
    Librarian = "Librarian",
    Accountant = "Accountant"
}
export enum VirtualPlatform {
    Zoom = "Zoom",
    Other = "Other",
    GoogleMeet = "GoogleMeet"
}
export interface backendInterface {
    addAlumni(fullName: string, graduationYear: string, className: string, currentOccupation: string | null, currentCity: string | null, mobile: string | null, email: string | null, photoUrl: string | null): Promise<AlumniRecord>;
    addAuditLog(userId: string, action: string, moduleName: string, details: string): Promise<AuditLog>;
    addBook(isbn: string, title: string, author: string, publisher: string | null, category: string, totalCopies: bigint, shelfLocation: string | null, photoUrl: string | null): Promise<Book>;
    addChapterContent(chapterId: string, contentText: string): Promise<void>;
    addExamDateToCalendar(examName: string, date: string, className: string): Promise<ExamCalendarEntry>;
    addExpenseEntry(headId: string, amount: bigint, description: string, date: string, receipt: string | null, createdBy: string): Promise<ExpenseEntry__1>;
    addExpenseEntryV2(headId: string, amount: number, date: string, description: string, createdBy: string): Promise<ExpenseEntry>;
    addExpenseHead(name: string, headType: ExpHeadType, description: string | null): Promise<ExpenseHead__1>;
    addExpenseHeadV2(name: string, type: string, color: string): Promise<ExpenseHead>;
    addFeeHeading(name: string, description: string | null, applicableMonths: Array<string>): Promise<FeeHeading>;
    addHoliday(name: string, date: string, description: string, isRecurring: boolean): Promise<Holiday>;
    addHomework(classLevel: ClassLevel, sectionId: string | null, subjectId: string, title: string, description: string, dueDate: string, createdBy: string, attachmentUrl: string | null): Promise<HomeworkEntry>;
    addItem(name: string, category: string, store: string, unit: string, currentStock: bigint, minStock: bigint, purchasePrice: bigint, salePrice: bigint): Promise<InventoryItem>;
    /**
     * / Add or update an incentive for payroll purposes (alias wiring payroll incentive).
     */
    addPayrollIncentive(staffId: string, month: string, year: string, amount: number, reason: string): Promise<boolean>;
    addPickupPoint(routeId: string, name: string, timing: string, monthlyFare: number, order: bigint): Promise<PickupPoint>;
    addResult(studentId: string, examTimetableId: string, scores: Array<[string, bigint]>, totalMarks: bigint, percentage: number, grade: string, rank: bigint | null, remarks: string | null): Promise<ExamResult>;
    addRoute(routeName: string, routeNo: string, busNo: string, driverName: string, driverMobile: string, capacity: bigint): Promise<TransportRoute>;
    addStaff(employeeId: string, fullName: string, designation: string, department: string, mobile: string, email: string | null, address: string, dateOfJoining: string, salary: bigint, photoUrl: string | null, aadhaarNo: string | null, bankAccount: string | null, ifscCode: string | null): Promise<{
        __kind__: "ok";
        ok: Staff;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addStaffIncentive(staffId: string, amount: number, reason: string, month: string, approvedBy: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addStaffLoan(staffId: string, principalAmount: number, monthlyDeduction: number, startMonth: string, notes: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addStaffPayout(staffId: string, amount: number, mode: string, date: string, notes: string, recordedBy: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addStudent(admNo: string, fullName: string, fatherName: string, motherName: string, fatherMobile: string, motherMobile: string | null, dateOfBirth: string, gender: string, currentAddress: string, permanentAddress: string, classLevel: ClassLevel, sectionId: string, session: string, photoUrl: string | null, bloodGroup: string | null, religion: string | null, category: string | null, aadhaarNo: string | null, transportRouteId: string | null, transportPickupPointId: string | null, busNo: string | null, mobile: string | null, srNo: string | null, penNo: string | null, apaarNo: string | null, prevSchool: string | null, admissionDate: string | null): Promise<{
        __kind__: "ok";
        ok: Student;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addSubjectAssignment(staffId: string, subjectId: string, subjectName: string, minClass: string | null, maxClass: string | null, session: string): Promise<{
        __kind__: "ok";
        ok: SubjectAssignment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTransaction(itemId: string, transactionType: InvTxType, quantity: bigint, unitPrice: bigint, totalAmount: bigint, date: string, remarks: string | null, createdBy: string, buyerAdmNo: string | null, buyerName: string | null, sellerName: string | null, receivedAmount: bigint | null, balanceAmount: bigint | null): Promise<InventoryTransaction>;
    approveChapter(chapterId: string): Promise<void>;
    approveChapterV2(chapterId: string): Promise<void>;
    archiveSession(id: string): Promise<void>;
    assignSubject(teacherId: string, classLevel: ClassLevel, sectionId: string | null, subjectId: string, session: string): Promise<TeacherSubjectAssignment>;
    batchSaveClassTimetables(timetables: Array<ClassTimetable>): Promise<bigint>;
    calculateAndSavePayroll(staffId: string, month: bigint, year: bigint, baseSalary: bigint): Promise<StaffPayrollRecord>;
    /**
     * / Calculates the enhanced payroll for a staff member for a specific month.
     * / workingDays: total working days in that month (provided by caller / admin).
     */
    calculateEnhancedPayroll(staffId: string, month: string, workingDays: number): Promise<{
        __kind__: "ok";
        ok: EnhancedPayrollRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    calculateGrade(marksObtained: number, maxMarks: number): Promise<string>;
    /**
     * / Calculate payroll for a staff member from attendance records.
     * / workingDays is derived from calculateWorkingDays (session start–end excluding Sundays and holidays).
     */
    calculateStaffPayroll(staffId: string, month: string, year: string, sessionId: string): Promise<{
        __kind__: "ok";
        ok: FullPayrollRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Count working days between two dates (inclusive), excluding Sundays and all stored holidays.
     */
    calculateWorkingDays(_sessionId: string, fromDate: string, toDate: string): Promise<bigint>;
    changePassword(username: string, oldPassword: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    checkPermission(userId: string, moduleId: string, action: string): Promise<boolean>;
    /**
     * / Admin confirms a payment by UTR number (for manual GPay / UPI bank transfers).
     */
    confirmPaymentByUtr(studentId: string, utrNumber: string, amount: number, collectedBy: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    copyPasteEntireDay(sourceTimetableId: string, sourceDay: string, targetTimetableId: string, targetDay: string): Promise<boolean>;
    copyPasteTimetableCells(ops: Array<CellCopyOp>): Promise<bigint>;
    createChapter(subjectId: string, chapterNo: bigint, title: string, topics: Array<string>, classLevel: string): Promise<SyllabusChapter>;
    createChatRoom(name: string, roomType: ChatRoomType, members: Array<string>, createdBy: string): Promise<ChatRoom>;
    createClassTimetable(timetable: ClassTimetable): Promise<ClassTimetable>;
    createExamTimetable(examName: string, session: string, classLevel: ClassLevel, schedule: Array<ExamScheduleEntry>): Promise<ExamTimetable>;
    /**
     * / Returns a full snapshot of all stable storage as a BackupPayload.
     * / The frontend downloads this as a JSON file for safekeeping.
     */
    createFullBackup(): Promise<BackupPayload>;
    createNotification(title: string, message: string, targetRole: string | null, targetStudentId: string | null, targetClassLevel: ClassLevel | null, createdBy: string, notifType: string): Promise<Notification>;
    createOnlineExam(title: string, classLevel: ClassLevel, subjectId: string | null, durationMinutes: bigint, questions: Array<MCQQuestion>, startTime: string | null, endTime: string | null, createdBy: string): Promise<OnlineExam>;
    createSection(classLevel: ClassLevel, sectionName: string, roomNo: string | null, teacherId: string | null): Promise<{
        __kind__: "ok";
        ok: Section;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createSession(sessionName: string, startDate: string, endDate: string): Promise<AcademicSession>;
    createSmartExamTimetable(timetable: SmartExamTimetable): Promise<bigint>;
    createSubject(name: string, code: string, classLevel: ClassLevel, maxMarks: bigint, passingMarks: bigint): Promise<Subject>;
    createUser(principalId: string, username: string, fullName: string, role: string, position: string | null, classLevel: ClassLevel | null, sectionId: string | null, staffId: string | null, studentId: string | null, permissions: Array<string>): Promise<{
        __kind__: "ok";
        ok: UserAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deactivateStaff(id: string): Promise<void>;
    /**
     * / Permanently delete ALL student records — admin-only destructive operation.
     * / Clears the students map and all associated fee payments and attendance records.
     */
    deleteAllStudents(): Promise<void>;
    deleteAlumni(id: string): Promise<void>;
    deleteBook(id: string): Promise<void>;
    deleteCertificateTemplate(id: string): Promise<void>;
    deleteChapter(id: string): Promise<void>;
    deleteClassTimetable(id: string): Promise<boolean>;
    deleteExamCalendarEntry(id: string): Promise<void>;
    deleteExamConfig(id: string): Promise<void>;
    deleteExamResult(id: string): Promise<void>;
    deleteExamTimetable(id: string): Promise<void>;
    deleteExpenseEntryV2(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteExpenseHeadV2(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteFeeHeading(id: string): Promise<void>;
    deleteHoliday(id: string): Promise<boolean>;
    deleteHomework(id: string): Promise<void>;
    deleteItem(id: string): Promise<void>;
    deletePayment(id: string): Promise<void>;
    deletePickupPoint(id: string): Promise<void>;
    deleteRoute(id: string): Promise<void>;
    deleteSection(id: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSmartExamTimetable(id: bigint): Promise<boolean>;
    deleteStaffIncentive(incentiveId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteStaffPayout(payoutId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Permanently delete a student record. Intended for admin use only.
     * / Also removes associated fee payments and attendance records.
     */
    deleteStudent(id: string): Promise<void>;
    deleteSubject(id: string): Promise<void>;
    deleteSubjectAssignment(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    discontinueStudent(id: string): Promise<void>;
    enrollStudentFace(studentId: string, admNo: string, enrolledBy: string, photoUrl: string | null, descriptorJson: string, date: string): Promise<{
        __kind__: "ok";
        ok: FaceEnrollmentRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    ensureClassGroupsExist(classLevels: Array<ClassLevelV>, sectionNames: Array<string>): Promise<Array<RoomRec>>;
    ensureRouteGroupsExist(routeList: Array<{
        id: string;
        name: string;
    }>): Promise<Array<RoomRec>>;
    /**
     * / Factory reset — clears ALL data collections and re-seeds defaults.
     * / School settings (name, address, logo) are preserved.
     * / Admin-only: callers must pass the admin password as a guard.
     */
    factoryReset(adminPassword: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateChapterQA(chapterId: string, contentText: string, userQuestions: Array<string>): Promise<Array<QAPair>>;
    generateClassTimetable(params: GenerateTimetableParams, assignments: Array<[string, string, string | null, string]>, staffData: Array<[string, string]>, subjectData: Array<[string, string]>): Promise<ClassTimetable>;
    generatePayroll(staffId: string, month: string, year: string, basicSalary: bigint, presentDays: bigint, totalDays: bigint, deductions: bigint, additions: bigint, generatedBy: string): Promise<PayrollRecord>;
    generateQAFromContent(contentText: string, userQuestions: Array<string>): Promise<Array<QAPair>>;
    generateSmartExamSchedule(params: GenerateScheduleParams): Promise<Array<SmartTimetableEntry>>;
    generateTeacherTimetable(sessionId: string): Promise<Array<TeacherTimetable>>;
    /**
     * / Academic calendar stats for a session: total days, sundays, holidays, working days.
     */
    getAcademicCalendarStats(sessionId: string): Promise<{
        sundays: bigint;
        holidays: bigint;
        totalDays: bigint;
        workingDays: bigint;
    }>;
    /**
     * / Migration type: old Student shape without the new optional fields.
     */
    getAcademicPerformanceReport(studentId: string, sessionId: string): Promise<AcademicPerformanceReport>;
    getActiveSession(): Promise<AcademicSession | null>;
    getAllDeviceConfigs(): Promise<Array<DeviceConfig>>;
    getAllExamConfigs(sessionId: string): Promise<Array<ExamConfig>>;
    getAllFaceEnrollments(): Promise<Array<FaceEnrollmentRecord>>;
    /**
     * / Return ALL fee payments for a session, sorted by paymentDate descending.
     * / Powers the detailed fee register view (all collectors, all classes).
     */
    getAllFeePaymentsBySession(sessionId: string): Promise<Array<FeePayment>>;
    getAllPayroll(): Promise<Array<PayrollRecord>>;
    getAllSubjectAssignments(): Promise<Array<SubjectAssignment>>;
    /**
     * / Returns all multi-class assignment maps (for bulk loading in the UI).
     */
    getAllSubjectClassMaps(): Promise<Array<SubjectClassMap>>;
    /**
     * / Returns all UPI payment submissions (any status) — for admin full view.
     */
    getAllUpiPayments(): Promise<Array<UpiPaymentSubmission>>;
    getAllUsers(): Promise<Array<UserAccount>>;
    getAlumni(): Promise<Array<AlumniRecord>>;
    getAppUsers(): Promise<Array<AppUser>>;
    getAssignmentsByClass(classLevel: ClassLevel): Promise<Array<TeacherSubjectAssignment>>;
    getAssignmentsByTeacher(teacherId: string): Promise<Array<TeacherSubjectAssignment>>;
    getAttendanceBreakdown(date: string, session: string): Promise<Array<AttendanceBreakdownRow>>;
    getAttendanceByDate(date: string, _sectionId: string): Promise<Array<AttendanceRecord>>;
    getAttendanceByStudent(studentId: string): Promise<Array<AttendanceRecord>>;
    getAttendanceSettings(): Promise<AttendanceSystemSettings>;
    getAttendanceSummary(_classLevel: ClassLevel, _sectionId: string, date: string): Promise<{
        present: bigint;
        late: bigint;
        leave: bigint;
        absent: bigint;
    }>;
    getAttendanceSummaryToday(date: string, session: string): Promise<AttendanceSummaryToday>;
    getAuditLogs(moduleName: string | null, limit: bigint): Promise<Array<AuditLog>>;
    /**
     * / Returns the auto-created credentials for a student or staff by entityId.
     * / Pass "par_<studentId>" to get the parent credentials for a student.
     */
    getAutoCreatedCredentials(entityId: string): Promise<{
        username: string;
        password: string;
        role: string;
    } | null>;
    getBackupSettings(): Promise<BackupSettings>;
    getBooks(): Promise<Array<Book>>;
    getBusLocations(): Promise<Array<BusLocation>>;
    getCalendarStats(): Promise<CalendarStats>;
    getCertificateTemplateById(id: string): Promise<CertificateTemplate__1 | null>;
    getCertificateTemplates(): Promise<Array<CertificateTemplate__1>>;
    getChapterApprovalStatus(chapterId: string): Promise<{
        status: string;
        reason?: string;
    }>;
    getChapterContent(chapterId: string): Promise<SyllabusContent | null>;
    getChapters(subjectId: string): Promise<Array<SyllabusChapter>>;
    getChatRooms(memberId: string | null): Promise<Array<ChatRoom>>;
    getClassLinks(classLevelTag: string | null): Promise<Array<ClassLinks>>;
    getClassTimetableById(id: string): Promise<ClassTimetable | null>;
    getClassTimetables(sessionId: string | null): Promise<Array<ClassTimetable>>;
    getCustomStudentColumns(): Promise<Array<{
        key: string;
        columnLabel: string;
        fieldType: string;
    }>>;
    getDailyFeeBreakdown(date: string, sessionId: string): Promise<Array<FeePaymentSummary>>;
    getDailySalesSummary(): Promise<Array<DailySalesSummary>>;
    getDashboardStats(): Promise<{
        feesCollectedMonth: bigint;
        feesCollectedToday: bigint;
        activeStudents: bigint;
        totalStudents: bigint;
        totalStaff: bigint;
    }>;
    getDashboardStatsV2(sessionId: string): Promise<DashboardStatsV2>;
    getDemandRegister(filter: DemandRegisterFilter): Promise<Array<DemandRegisterEntry>>;
    getDeviceAttendanceByDate(date: string): Promise<Array<DeviceAttendanceRecord>>;
    getDeviceAttendanceByDateAndType(date: string, deviceType: string): Promise<Array<DeviceAttendanceRecord>>;
    getDeviceAttendanceByStudent(studentId: bigint): Promise<Array<DeviceAttendanceRecord>>;
    getDeviceConfig(deviceType: string): Promise<DeviceConfig | null>;
    getDirectMessages(limit: bigint): Promise<Array<DirectMessage>>;
    getDirectMessagesByRecipient(toStudentId: string): Promise<Array<DirectMessage>>;
    /**
     * / Returns all discontinued students (across all sessions).
     */
    getDiscontinuedStudents(): Promise<Array<Student>>;
    getEnhancedPayroll(staffId: string, month: string): Promise<EnhancedPayrollRecord | null>;
    getEnhancedPayrollByMonth(month: string): Promise<Array<EnhancedPayrollRecord>>;
    /**
     * / Returns the count of enrolled (active) students in a class for a session.
     */
    getEnrolledCountByClass(cl: ClassLevel, sessionId: string): Promise<bigint>;
    /**
     * / Returns the count of enrolled (active) students in a section for a session.
     */
    getEnrolledCountBySection(sectionId: string, sessionId: string): Promise<bigint>;
    getEnrolledStudentIds(): Promise<Array<string>>;
    getExamConfigs(sessionId: string, classId: string): Promise<Array<ExamConfig>>;
    getExamDatesForCalendar(): Promise<Array<ExamCalendarEntry>>;
    getExamResultsByClass(classId: string, sessionId: string, examConfigId: string): Promise<Array<ExamResultV2>>;
    getExamResultsByExam(examConfigId: string): Promise<Array<ExamResultV2>>;
    getExamResultsByStudent(studentId: string, sessionId: string): Promise<Array<ExamResultV2>>;
    getExamSubmissions(examId: string): Promise<Array<OnlineExamSubmission>>;
    getExamTimetables(): Promise<Array<ExamTimetable>>;
    getExpenseEntries(headId: string | null): Promise<Array<ExpenseEntry__1>>;
    getExpenseEntriesV2(headId: string | null): Promise<Array<ExpenseEntry>>;
    getExpenseHeads(): Promise<Array<ExpenseHead__1>>;
    getExpenseHeadsV2(): Promise<Array<ExpenseHead>>;
    getExpenseStats(): Promise<ExpenseStats>;
    getFaceAttendanceByDate(date: string): Promise<Array<FaceEnrollmentRecord>>;
    getFaceEnrolledStudents(): Promise<Array<FaceEnrollmentRecord>>;
    /**
     * / Return fee audit logs. Filter by studentId or paymentId (both optional).
     */
    getFeeAuditLogs(studentIdFilter: string | null, paymentIdFilter: string | null): Promise<Array<FeeAuditLog>>;
    getFeeHeadings(): Promise<Array<FeeHeading>>;
    getFeePaymentsByCollector(collectorId: string): Promise<Array<FeePaymentEntry>>;
    /**
     * / Return all payments for a student across all sessions (for receipt history).
     */
    getFeePaymentsByStudent(studentId: string): Promise<Array<FeePayment>>;
    getFeePlan(classLevel: ClassLevel, sectionId: string | null, session: string): Promise<FeePlan | null>;
    getFeePlans(): Promise<Array<FeePlan>>;
    /**
     * / Return all fee payments for a session enriched with student class/section data.
     * / Used by the Fee Register detailed view.
     */
    getFeeRegisterBySession(sessionId: string): Promise<Array<FeeRegisterEntry>>;
    getFeeRegisterByUser(): Promise<Array<[string, Array<FeePaymentEntry>]>>;
    getFeeRegisterWithBalance(sessionId: string): Promise<Array<FeeRegisterBalanceEntry>>;
    /**
     * / Returns all holidays. sessionId parameter is accepted for API consistency but
     * / holidays are not session-scoped in this implementation.
     */
    getHolidays(_sessionId: string | null): Promise<Array<Holiday>>;
    getHomework(classLevel: ClassLevel | null): Promise<Array<HomeworkEntry>>;
    getIndexPageConfig(): Promise<IndexPageConfig | null>;
    getIssuedBooks(): Promise<Array<BookIssue>>;
    getItems(): Promise<Array<InventoryItem>>;
    getLastReceiptNo(): Promise<bigint>;
    /**
     * / Returns legacy payroll records for a staff member.
     */
    getLegacyPayrollByStaff(staffId: string): Promise<Array<PayrollRecord>>;
    getMessageTemplates(): Promise<Array<[string, string]>>;
    getMessages(roomId: string): Promise<Array<ChatMessage>>;
    getNotifications(targetRole: string | null, targetStudentId: string | null): Promise<Array<Notification>>;
    getOnlineExam(id: string): Promise<OnlineExam | null>;
    getOnlineExams(): Promise<Array<OnlineExam>>;
    getOverdueBooks(): Promise<Array<BookIssue>>;
    getPaidLeaveConfig(): Promise<PaidLeaveConfig>;
    getPaymentsByDate(date: string): Promise<Array<FeePayment>>;
    getPaymentsByMonth(month: string): Promise<Array<FeePayment>>;
    getPaymentsByStudent(studentId: string): Promise<Array<FeePayment>>;
    getPaymentsByStudentAndSession(studentId: string, sessionId: string): Promise<Array<FeePayment>>;
    getPayrollByMonth(month: bigint, year: bigint): Promise<Array<StaffPayrollRecord>>;
    getPayrollByStaff(staffId: string): Promise<Array<PayrollRecord>>;
    getPayrollCalculation(staffId: string, staffName: string, staffSalary: bigint, month: bigint, year: bigint, workingDays: bigint): Promise<PayrollCalculation>;
    getPayrollHistory(staffId: string): Promise<Array<StaffPayrollRecord>>;
    /**
     * / Returns all pending UPI payment submissions (for admin verification panel).
     */
    getPendingUpiPayments(): Promise<Array<UpiPaymentSubmission>>;
    /**
     * / Returns all pickup points for a route, sorted by order.
     */
    getPickupPoints(routeId: string): Promise<Array<PickupPoint>>;
    /**
     * / Alias — same as getPickupPoints; provided for frontend clarity.
     */
    getPickupPointsByRoute(routeId: string): Promise<Array<PickupPoint>>;
    /**
     * / Return the student's old-balance from the session immediately prior to currentSession.
     * / Looks up studentOldBalances for any entry whose sessionId != currentSession belonging
     * / to this student; returns the most recently added one, or null if none.
     * / Collect Fees uses this to auto-populate the previous-session-due field.
     */
    getPreviousSessionBalance(studentId: string, currentSession: string): Promise<{
        previousYearDue: number;
        sessionId: string;
        amount: number;
    } | null>;
    getPromotionPreview(fromClass: PromClassLevel, fromSession: string): Promise<Array<PromotionPreviewItem>>;
    getPublishedChapters(subjectId: string, classLevel: string | null): Promise<Array<ChapterWithQA>>;
    getPublishedChaptersForStudent(classId: string, subjectId: string): Promise<Array<ChapterWithQA>>;
    getResultsByExam(examTimetableId: string): Promise<Array<ExamResult>>;
    getResultsByStudent(studentId: string): Promise<Array<ExamResult>>;
    getRolePermissions(): Promise<Array<RolePermissions>>;
    getRoutes(): Promise<Array<TransportRoute>>;
    getSchoolInfo(): Promise<SchoolInfo>;
    /**
     * / Returns the school's UPI ID (stored in appSettings.upiId).
     */
    getSchoolUpiId(): Promise<string | null>;
    getSchoolWideTimetable(sessionId: string | null): Promise<Array<[string, ClassTimetable]>>;
    getSections(): Promise<Array<Section>>;
    getSectionsByClass(cl: ClassLevel): Promise<Array<Section>>;
    getSessions(): Promise<Array<AcademicSession>>;
    getSettings(): Promise<AppSettings>;
    getSmartExamTimetableById(id: bigint): Promise<SmartExamTimetable | null>;
    getSmartExamTimetables(sessionId: string | null): Promise<Array<SmartExamTimetable>>;
    getStaff(): Promise<Array<Staff>>;
    getStaffAttendanceBreakdown(date: string): Promise<StaffAttBreakdown>;
    getStaffAttendanceByDate(date: string): Promise<Array<StaffAttendanceRecord>>;
    getStaffAttendanceByDateAndType(date: string, deviceType: string): Promise<Array<StaffAttendanceRecord>>;
    getStaffAttendanceByMonth(staffId: string, month: bigint, year: bigint): Promise<Array<StaffAttendanceRecord>>;
    getStaffAttendanceByStaff(staffId: string): Promise<Array<StaffAttendanceRecord>>;
    getStaffById(id: string): Promise<Staff | null>;
    getStaffIncentives(staffId: string): Promise<Array<StaffIncentive>>;
    getStaffIncentivesByMonth(staffId: string, month: string): Promise<Array<StaffIncentive>>;
    getStaffLoans(staffId: string): Promise<Array<StaffLoan>>;
    /**
     * / Returns month-by-month payment summary for a staff member.
     * / netSalary is wrapped in ?Float — frontend hides amount for non-admin roles.
     */
    getStaffPaymentSummary(staffId: string): Promise<Array<StaffPaymentSummaryEntry>>;
    getStaffPayouts(staffId: string): Promise<Array<StaffPayout>>;
    getStaffPayoutsByMonth(staffId: string, month: string): Promise<Array<StaffPayout>>;
    getStaffSalary(staffId: string): Promise<number | null>;
    getStaffYearEndSummary(staffId: string, yearArg: string): Promise<StaffYearEndSummary>;
    /**
     * / Look up a student by admission number. Used by frontend to check duplicates before bulk import.
     */
    getStudentByAdmNo(admNo: string): Promise<Student | null>;
    getStudentById(id: string): Promise<Student | null>;
    getStudentCount(): Promise<bigint>;
    getStudentCustomData(studentId: string): Promise<Array<[string, string]>>;
    getStudentDiscounts(studentId: string): Promise<Array<StudentDiscount>>;
    getStudentFaceEnrollment(studentId: string): Promise<FaceEnrollmentRecord | null>;
    getStudentFeeBalance(studentId: string, sessionId: string): Promise<{
        previousYearDue: number;
        oldBalance: number;
    }>;
    getStudentFeeCollectionData(studentId: string, sessionId: string): Promise<StudentFeeCollectionData>;
    /**
     * / Returns 0 until inventory per-student due tracking is wired.
     */
    getStudentInventoryDue(_studentId: string): Promise<bigint>;
    getStudentOldBalance(studentId: string, sessionId: string): Promise<StudentOldBalance | null>;
    getStudentOldBalances(studentId: string): Promise<Array<StudentOldBalance>>;
    /**
     * / Return the monthly transport fare for a student based on their assigned pickup point.
     * / Returns 0 if no pickup point is assigned or the pickup point is not found.
     */
    getStudentTransportFare(studentId: string): Promise<number>;
    getStudents(): Promise<Array<Student>>;
    getStudentsByClass(cl: ClassLevel): Promise<Array<Student>>;
    /**
     * / Returns all active students in a class for a given session.
     */
    getStudentsByClassAndSession(cl: ClassLevel, sessionId: string): Promise<Array<Student>>;
    getStudentsByFamily(mobile: string): Promise<Array<Student>>;
    /**
     * / Returns all active students assigned to a transport route for a session.
     */
    getStudentsByRoute(routeId: string, sessionId: string): Promise<Array<Student>>;
    /**
     * / Returns all active students on a route with their pickup point details joined.
     * / Used for the route double-click page and fee collection (pickup point → monthly fare).
     */
    getStudentsWithPickupPointsByRoute(routeId: string, sessionId: string): Promise<Array<StudentWithPickupPoint>>;
    getSubjectAssignments(staffId: string): Promise<Array<SubjectAssignment>>;
    /**
     * / Returns the multi-class assignment for a subject.
     */
    getSubjectClassMap(subjectId: string): Promise<SubjectClassMap | null>;
    /**
     * / Returns the assigned class levels for a single subject (by subject ID).
     */
    getSubjectClassMapById(subjectId: string): Promise<Array<ClassLevel> | null>;
    /**
     * / Returns all multi-class assignment maps — alias used by frontend bulk loader.
     */
    getSubjectClassMapRecord(): Promise<Array<SubjectClassMap>>;
    getSubjects(): Promise<Array<Subject>>;
    getSubjectsByClass(cl: ClassLevel): Promise<Array<Subject>>;
    getSubmissions(homeworkId: string): Promise<Array<HomeworkSubmission>>;
    getSyllabusContent(chapterId: string): Promise<SyllabusContent | null>;
    getTeacherTimetables(sessionId: string): Promise<Array<TeacherTimetable>>;
    getTemplates(): Promise<Array<CertificateTemplate>>;
    getTemplatesByType(templateType: string): Promise<Array<CertificateTemplate>>;
    getTotalDueByStudentAndSession(studentId: string, sessionId: string): Promise<{
        totalFees: bigint;
        totalPaid: bigint;
        totalDue: bigint;
    }>;
    getTransactions(itemId: string | null): Promise<Array<InventoryTransaction>>;
    getTransactionsByDate(date: string): Promise<Array<{
        id: string;
        itemId: string;
        balanceAmount: bigint;
        transactionType: InvTxType;
        date: string;
        createdBy: string;
        receivedAmount: bigint;
        sellerName: string;
        totalAmount: bigint;
        quantity: bigint;
        buyerAdmNo: string;
        buyerName: string;
        unitPrice: bigint;
        remarks?: string;
    }>>;
    getUnreadCount(targetRole: string | null): Promise<bigint>;
    /**
     * / Returns all UPI payment submissions for a specific student.
     */
    getUpiPaymentsByStudent(studentId: string): Promise<Array<UpiPaymentSubmission>>;
    getUser(userId: string): Promise<UserAccount | null>;
    getUserByPrincipal(principalId: string): Promise<UserAccount | null>;
    getUserPermissions(userId: string): Promise<Array<ModulePermission>>;
    getUsers(): Promise<Array<UserAccount>>;
    getVirtualClasses(classLevel: ClassLevel | null): Promise<Array<VirtualClass>>;
    /**
     * / Records a GPay payment confirmation (called after frontend polls for status
     * / or receives a callback). Marks the submission as confirmed.
     */
    handleGPayCallback(transactionId: string, studentId: string, status: string, utrNo: string, amount: number): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Generates a UPI deep-link for GPay / any UPI app.
     * / Returns: upi://pay?pa=UPIID&pn=SCHOOLNAME&am=AMOUNT&cu=INR&tn=FeePayment
     */
    initiateGPayPayment(studentId: string, amount: number, _mobileNo: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    isFaceEnrolled(studentId: string): Promise<boolean>;
    issueBook(bookId: string, studentId: string, issueDate: string, dueDate: string): Promise<BookIssue>;
    lockPayrollMonth(staffId: string, month: bigint, year: bigint): Promise<StaffPayrollRecord | null>;
    loginUser(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: {
            username: string;
            userId: bigint;
            role: string;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    markAttendance(classLevel: ClassLevel, sectionId: string, date: string, markedBy: string, records: Array<{
        status: AttendanceStatus;
        studentId: string;
        remarks?: string;
    }>): Promise<void>;
    markDeviceOut(recordId: bigint, outTime: string): Promise<boolean>;
    markFaceAttendance(studentId: string, studentName: string, classLevel: string, section: string, date: string, time: string, confidence: number): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markNotificationRead(id: string): Promise<void>;
    markStaffAttendanceOut(recordId: bigint, outTime: string): Promise<boolean>;
    promoteAllClasses(fromSession: string, toSession: string): Promise<PromotionAllResult>;
    promoteBulkStudents(fromClass: PromClassLevel, fromSession: string, newSession: string, targetSection: string | null): Promise<PromotionResult>;
    pushActivityEntry(actionType: string, description: string, userName: string): Promise<void>;
    /**
     * / Update only the lastBackupTimestamp (called after a successful backup export).
     */
    recordBackupTimestamp(timestampMs: bigint): Promise<void>;
    recordDeviceAttendance(rec: DeviceAttendanceRecord): Promise<bigint>;
    /**
     * / Alias kept for backward compat — recordPayment is the canonical name.
     * / Accepts `collectedBy` field name (same as createdBy internally).
     */
    recordFeePayment(studentId: string, sessionId: string, paymentDate: string, items: Array<FeePaymentItem>, otherFee: OtherFee | null, totalDue: bigint, totalAmount: bigint, balance: bigint, collectedBy: string, paymentMode: string, upiRef: string | null, remarks: string | null, lateFees: bigint, discountTotal: bigint, balanceCarriedForward: number): Promise<FeePayment>;
    recordPayment(studentId: string, sessionId: string, paymentDate: string, items: Array<FeePaymentItem>, otherFee: OtherFee | null, totalDue: bigint, totalAmount: bigint, paymentMode: string, upiRef: string | null, remarks: string | null, createdBy: string, lateFees: bigint | null, discountTotal: bigint | null, balanceCarriedForward: number | null): Promise<FeePayment>;
    recordPayrollPayout(staffId: string, month: bigint, year: bigint, amount: bigint, baseSalary: bigint): Promise<StaffPayrollRecord | null>;
    recordStaffAttendance(staffId: string, staffName: string, date: string, month: bigint, year: bigint, deviceType: string, inTime: string): Promise<bigint>;
    rejectChapter(chapterId: string, reason: string): Promise<void>;
    rejectChapterV2(chapterId: string, reason: string): Promise<void>;
    removeAssignment(id: string): Promise<void>;
    removeStudentDiscount(id: string): Promise<void>;
    resetUserPassword(username: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetUserPasswordAdmin(adminUsername: string, targetUsername: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Merge-restores all entities from a backup payload.
     * / Strategy: if ID exists → overwrite, if not → insert.  No data is deleted.
     * / Validates required fields before each write; skips invalid records and
     * / collects per-entity errors.  Continues even when one entity type fails.
     */
    restoreFromBackup(payload: BackupPayload): Promise<RestoreResult>;
    returnBook(issueId: string, returnDate: string, fine: bigint): Promise<void>;
    revokeFaceEnrollment(studentId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    revokeStudentFaceEnrollment(studentId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveAttendanceSettings(settings: AttendanceSystemSettings): Promise<void>;
    saveBackupSettings(settings: BackupSettings): Promise<void>;
    saveCertificateTemplate(id: string, name: string, templateType: string, elementsJson: string, thumbnail: string, isDefault: boolean, createdBy: string): Promise<CertificateTemplate__1>;
    saveChapterQA(chapterId: string, qas: Array<QAPair>, userQuestions: Array<string>): Promise<void>;
    saveClassLinks(links: Array<ClassLinks>): Promise<bigint>;
    saveCustomStudentColumns(columns: Array<{
        key: string;
        columnLabel: string;
        fieldType: string;
    }>): Promise<void>;
    saveDeviceConfig(deviceType: string, config: {
        port?: bigint;
        usbPort?: string;
        deviceId?: string;
        ipAddress?: string;
    }): Promise<void>;
    saveExamConfig(examName: string, sessionId: string, classId: string, subjectConfigs: Array<ExamSubjectConfig>, includeInCombined: boolean, weightage: number): Promise<ExamConfig>;
    saveExamMarks(examConfigId: string, sessionId: string, classId: string, studentId: string, rawMarks: Array<{
        subjectName: string;
        marksObtained: number;
        subjectId: string;
        maxMarks: number;
        passingMarks: number;
    }>, rank: bigint | null, remarks: string | null): Promise<{
        __kind__: "ok";
        ok: ExamResultV2;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveIndexPageConfig(config: IndexPageConfig): Promise<void>;
    /**
     * / Save (persist) a full payroll record to stable storage.
     */
    savePayrollRecord(staffId: string, staffName: string, month: string, year: string, basicSalary: number, workingDays: bigint, daysPresent: bigint, incentives: number, status: string): Promise<boolean>;
    saveTeacherTimetables(timetables: Array<TeacherTimetable>): Promise<bigint>;
    saveTemplate(templateType: string, name: string, layoutJson: string, createdBy: string): Promise<CertificateTemplate>;
    scheduleVirtualClass(title: string, classLevel: ClassLevel, subjectId: string | null, platform: VirtualPlatform, meetingLink: string, scheduledAt: string, durationMinutes: bigint, createdBy: string): Promise<VirtualClass>;
    sendDirectMessage(msg: DirectMessage): Promise<DirectMessage>;
    sendMessage(roomId: string, senderId: string, content: string, attachmentUrl: string | null): Promise<ChatMessage>;
    setActiveSession(id: string): Promise<void>;
    setAppUserActive(username: string, isActive: boolean): Promise<boolean>;
    setBusActive(busId: string, isActive: boolean): Promise<void>;
    setChapterClassLevel(chapterId: string, classLevel: string): Promise<void>;
    setDefaultCertificateTemplate(id: string): Promise<void>;
    setDefaultTemplate(id: string): Promise<void>;
    setFeePlan(classLevel: ClassLevel, sectionId: string | null, session: string, monthlyAmounts: Array<[string, bigint]>): Promise<FeePlan>;
    setPaidLeaveConfig(daysPerMonth: number): Promise<PaidLeaveConfig>;
    /**
     * / Sets the school's UPI ID (convenience wrapper around updateSettings).
     */
    setSchoolUpiId(upiId: string): Promise<void>;
    setStudentDiscount(studentId: string, headingId: string, amount: bigint, remark: string | null): Promise<StudentDiscount>;
    setStudentOldBalance(studentId: string, sessionId: string, amount: number, previousYearDue: number | null): Promise<StudentOldBalance>;
    submitChapterForApproval(chapterId: string): Promise<void>;
    submitChapterForApprovalV2(chapterId: string): Promise<void>;
    submitExam(examId: string, studentId: string, answers: Array<[string, bigint]>, timeTakenSecs: bigint): Promise<OnlineExamSubmission>;
    submitHomework(homeworkId: string, studentId: string, content: string | null, attachmentUrl: string | null): Promise<HomeworkSubmission>;
    /**
     * / Student or parent submits a UPI payment with UTR for admin verification.
     */
    submitUpiPayment(studentId: string, amount: bigint, utrNumber: string, submittedAt: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAlumni(id: string, fullName: string, graduationYear: string, className: string, currentOccupation: string | null, currentCity: string | null, mobile: string | null, email: string | null, photoUrl: string | null): Promise<void>;
    updateBook(id: string, isbn: string, title: string, author: string, publisher: string | null, category: string, totalCopies: bigint, shelfLocation: string | null, photoUrl: string | null): Promise<void>;
    updateBusLocation(busId: string, routeId: string, latitude: number, longitude: number): Promise<void>;
    updateChapterProgress(id: string, completionPercent: bigint): Promise<void>;
    updateClassTimetable(id: string, timetable: ClassTimetable): Promise<boolean>;
    updateExamTimetable(id: string, examName: string, session: string, classLevel: ClassLevel, schedule: Array<ExamScheduleEntry>): Promise<void>;
    updateExpenseEntryV2(id: string, headId: string, amount: number, date: string, description: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateExpenseHead(id: string, name: string, headType: ExpHeadType, description: string | null): Promise<void>;
    updateExpenseHeadV2(id: string, name: string, type: string, color: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateFeeHeading(id: string, name: string, description: string | null, isActive: boolean, applicableMonths: Array<string>): Promise<void>;
    /**
     * / Update editable fields on a fee payment and create an audit log entry for each changed field.
     */
    updateFeePayment(id: string, update: FeePaymentUpdate, adminId: string, adminName: string): Promise<boolean>;
    updateHoliday(id: string, name: string, date: string, description: string, isRecurring: boolean): Promise<boolean>;
    updateHomework(id: string, title: string, description: string, dueDate: string, attachmentUrl: string | null): Promise<void>;
    updateItem(id: string, name: string, category: string, store: string, unit: string, currentStock: bigint, minStock: bigint, purchasePrice: bigint, salePrice: bigint): Promise<void>;
    updateLoanRepayment(loanId: string, amountPaid: number): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMessageDeliveryStatus(id: string, status: string): Promise<boolean>;
    updateMessageTemplate(key: string, template: string): Promise<void>;
    updateOnlineExam(id: string, title: string, classLevel: ClassLevel, subjectId: string | null, durationMinutes: bigint, questions: Array<MCQQuestion>, startTime: string | null, endTime: string | null, isActive: boolean): Promise<void>;
    updatePayment(id: string, paymentDate: string, items: Array<FeePaymentItem>, otherFee: OtherFee | null, totalAmount: bigint, paymentMode: string, upiRef: string | null, remarks: string | null): Promise<void>;
    updatePayrollStatus(id: string, status: PayrollStatus, paymentDate: string | null): Promise<void>;
    updatePermissions(id: string, permissions: Array<string>): Promise<void>;
    updatePickupPoint(id: string, name: string, timing: string, monthlyFare: number, order: bigint): Promise<void>;
    updateResult(id: string, scores: Array<[string, bigint]>, totalMarks: bigint, percentage: number, grade: string, rank: bigint | null, remarks: string | null): Promise<void>;
    updateRolePermissions(role: UserRole, permissions: Array<ModulePermission>): Promise<void>;
    updateRoute(id: string, routeName: string, routeNo: string, busNo: string, driverName: string, driverMobile: string, capacity: bigint): Promise<void>;
    updateSchoolInfo(info: SchoolInfo): Promise<void>;
    updateSection(id: string, classLevel: ClassLevel, sectionName: string, roomNo: string | null, teacherId: string | null): Promise<void>;
    updateSettings(s: AppSettings): Promise<void>;
    updateSmartExamTimetable(id: bigint, timetable: SmartExamTimetable): Promise<boolean>;
    updateStaff(id: string, employeeId: string, fullName: string, designation: string, department: string, mobile: string, email: string | null, address: string, dateOfJoining: string, salary: bigint, photoUrl: string | null, aadhaarNo: string | null, bankAccount: string | null, ifscCode: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStaffSalary(staffId: string, basicSalary: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStudent(id: string, admNo: string, fullName: string, fatherName: string, motherName: string, fatherMobile: string, motherMobile: string | null, dateOfBirth: string, gender: string, currentAddress: string, permanentAddress: string, classLevel: ClassLevel, sectionId: string, session: string, photoUrl: string | null, bloodGroup: string | null, religion: string | null, category: string | null, aadhaarNo: string | null, transportRouteId: string | null, transportPickupPointId: string | null, busNo: string | null, mobile: string | null, srNo: string | null, penNo: string | null, apaarNo: string | null, prevSchool: string | null, admissionDate: string | null): Promise<void>;
    updateStudentCustomData(studentId: string, customData: Array<[string, string]>): Promise<void>;
    updateSubject(id: string, name: string, code: string, classLevel: ClassLevel, maxMarks: bigint, passingMarks: bigint): Promise<void>;
    updateSubjectAssignment(id: string, subjectId: string, subjectName: string, minClass: string | null, maxClass: string | null, session: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Update the list of classes this subject is assigned to (multi-class assignment).
     */
    updateSubjectClasses(id: string, classLevels: Array<ClassLevel>): Promise<SubjectClassMap | null>;
    updateUser(id: string, username: string, fullName: string, role: string, position: string | null, classLevel: ClassLevel | null, sectionId: string | null, staffId: string | null, studentId: string | null, isActive: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateVirtualClass(id: string, title: string, scheduledAt: string, meetingLink: string, durationMinutes: bigint, isCompleted: boolean): Promise<void>;
    upsertAppUser(username: string, password: string, role: string, isActive: boolean): Promise<bigint>;
    /**
     * / Admin verifies a UPI payment and records it as a fee payment.
     */
    verifyUpiPayment(utrNumber: string, verifiedBy: string, verifiedAt: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
