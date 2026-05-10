import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import Queue         "mo:core/Queue";
import Text          "mo:core/Text";
import Int           "mo:core/Int";
import DashTypes     "../types/dashboard-stats";
import FeeExtrasTypes "../types/fee-extras";

/// Provides getDashboardStatsV2 and a shared activity-log push helper.
/// All map parameter types must exactly match the concrete types in main.mo.
mixin (
  deviceAttendance : Map.Map<Nat, {
    id : Nat; studentId : Nat; studentName : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    section : Text;
    deviceType : { #Face; #RFID; #ESSLBiometric; #QR };
    inTime : ?Text; outTime : ?Text;
    date : Text; status : Text;
  }>,
  students : Map.Map<Text, {
    id : Text; admNo : Text; fullName : Text; fatherName : Text; motherName : Text;
    fatherMobile : Text; motherMobile : ?Text; dateOfBirth : Text; gender : Text;
    currentAddress : Text;
    permanentAddress : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionId : Text; session : Text; photoUrl : ?Text;
    status : { #Active; #Discontinued; #Graduated };
    bloodGroup : ?Text; religion : ?Text; category : ?Text;
    aadhaarNo : ?Text; transportRouteId : ?Text; transportPickupPointId : ?Text;
    busNo : ?Text; createdAt : Int;
    mobile : ?Text; srNo : ?Text; penNo : ?Text; apaarNo : ?Text;
    prevSchool : ?Text; admissionDate : ?Text;
  }>,
  staff : Map.Map<Text, {
    id : Text; employeeId : Text; fullName : Text; designation : Text;
    department : Text; mobile : Text; email : ?Text; address : Text;
    dateOfJoining : Text; salary : Nat;
    status : { #Active; #Inactive };
    photoUrl : ?Text; aadhaarNo : ?Text; bankAccount : ?Text;
    ifscCode : ?Text; createdAt : Int;
  }>,
  feePayments : Map.Map<Text, {
    id : Text; studentId : Text; sessionId : Text; receiptNo : Text;
    paymentDate : Text;
    items : [{ headingId : Text; month : Text; amount : Nat }];
    otherFee : ?{ description : Text; amount : Nat };
    totalDue : Nat; totalAmount : Nat; balance : Nat;
    paymentMode : Text; upiRef : ?Text; remarks : ?Text;
    createdBy : Text; isDeleted : Bool; createdAt : Int;
    lateFees : Nat; discountTotal : Nat; balanceCarriedForward : Float;
  }>,
  feePlans : Map.Map<Text, {
    id : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionId : ?Text; session : Text;
    monthlyAmounts : [(Text, Nat)];
  }>,
  attendance : Map.Map<Text, {
    id : Text; studentId : Text; date : Text;
    status : { #Present; #Absent; #Late; #Leave };
    remarks : ?Text; markedBy : Text;
  }>,
  sections : Map.Map<Text, {
    id : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionName : Text; roomNo : ?Text; teacherId : ?Text;
  }>,
  studentOldBalances : Map.Map<Text, FeeExtrasTypes.StudentOldBalance>,
  activityLog : Queue.Queue<DashTypes.ActivityEntry>,
) {

  let MAX_ACTIVITY = 200;

  // ── Internal helpers ──────────────────────────────────────────────────

  func pushActivity(actionType : Text, description : Text, userName : Text) {
    activityLog.pushBack({
      timestamp   = Time.now();
      actionType;
      description;
      userName;
    });
    if (activityLog.size() > MAX_ACTIVITY) {
      ignore activityLog.popFront();
    };
  };

  func lastNActivity(n : Nat) : [DashTypes.ActivityEntry] {
    let all = activityLog.toArray();
    let sz  = all.size();
    if (sz <= n) { return all };
    let start : Nat = if (sz > n) sz - n else 0;
    all.sliceToArray(start, sz)
  };

  func todayDdMmYyyy() : Text {
    let nowSec : Int = Time.now() / 1_000_000_000;
    var d : Int = nowSec / 86400;
    d += 719468;
    let era : Int = (if (d >= 0) d else d - 146096) / 146097;
    let doe : Int = d - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y   : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp  : Int = (5 * doy + 2) / 153;
    let day   : Int = doy - (153 * mp + 2) / 5 + 1;
    let month : Int = mp + (if (mp < 10) 3 else -9);
    let year  : Int = y + (if (month <= 2) 1 else 0);
    let dd = if (day   < 10) "0" # day.toText()   else day.toText();
    let mm = if (month < 10) "0" # month.toText() else month.toText();
    dd # "/" # mm # "/" # year.toText()
  };

  func monthYearOf(dateStr : Text) : Text {
    if (dateStr.size() < 10) { return "" };
    let chars = dateStr.toArray();
    let mm   = Text.fromChar(chars[3]) # Text.fromChar(chars[4]);
    let yyyy = Text.fromChar(chars[6]) # Text.fromChar(chars[7]) # Text.fromChar(chars[8]) # Text.fromChar(chars[9]);
    mm # "/" # yyyy
  };

  func yearOf(dateStr : Text) : Text {
    if (dateStr.size() < 10) { return "" };
    let chars = dateStr.toArray();
    Text.fromChar(chars[6]) # Text.fromChar(chars[7]) # Text.fromChar(chars[8]) # Text.fromChar(chars[9])
  };

  // ── Pending fees: 15th-of-month rule helpers ─────────────────────────────
  //
  // Indian academic year: April(4) → March(3).
  // Month order index: April=0, May=1, ..., March=11.
  // If today > 15th  → include current month in the due calculation.
  // If today ≤ 15th  → include only up to previous month.
  //
  // monthLabel converts a (month:1–12, year) pair to the label used in
  // feePlan.monthlyAmounts keys: "April", "May", ..., "March".

  func monthLabel(m : Int) : Text {
    switch (m) {
      case (1)  "January";  case (2)  "February"; case (3)  "March";
      case (4)  "April";    case (5)  "May";       case (6)  "June";
      case (7)  "July";     case (8)  "August";    case (9)  "September";
      case (10) "October"; case (11) "November";  case (12) "December";
      case _    "";
    }
  };

  /// Returns the list of month labels (in Indian academic-year order:
  /// April … March) that are "due" based on today's date and the
  /// 15th-of-month rule.  academicStartYear is the April year (e.g. 2025
  /// for session 2025-26).
  func dueMonthLabels(todayDay : Int, todayMonth : Int, todayYear : Int) : [Text] {
    // Indian academic year starts in April.  Work out which months have
    // passed (or are current, when today > 15th).
    //
    // We represent months as (month:Int, year:Int) pairs.
    // Sequence: Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar
    //           of the same calendar year, then Jan–Mar of the next year.

    // Determine how many months to include.
    // "cutoff" month = if day > 15 then todayMonth else previous month.
    let cutoffMonth : Int = if (todayDay > 15) { todayMonth } else {
      if (todayMonth == 1) { 12 } else { todayMonth - 1 }
    };
    let cutoffYear : Int = if (todayDay <= 15 and todayMonth == 1) {
      todayYear - 1
    } else { todayYear };

    // Academic year sequence: April(academicYear) through March(academicYear+1).
    // We figure out the academic year from the current date.
    let academicStartYear : Int = if (todayMonth >= 4) { todayYear } else { todayYear - 1 };

    let monthSeq : [(Int, Int)] = [
      (4, academicStartYear), (5, academicStartYear), (6, academicStartYear),
      (7, academicStartYear), (8, academicStartYear), (9, academicStartYear),
      (10, academicStartYear),(11, academicStartYear),(12, academicStartYear),
      (1, academicStartYear + 1),(2, academicStartYear + 1),(3, academicStartYear + 1),
    ];

    let result = List.empty<Text>();
    for ((m, y) in monthSeq.values()) {
      // Include months up to cutoff (year+month comparison)
      if (y < cutoffYear or (y == cutoffYear and m <= cutoffMonth)) {
        let lbl = monthLabel(m);
        if (lbl != "") { result.add(lbl) };
      };
    };
    result.toArray()
  };

  /// Calculate total pending fees for a session using the 15th-of-month rule.
  /// For each active student in the session:
  ///   totalDue   = sum of fee plan monthly amounts for all "due" months
  ///   totalPaid  = sum of all non-deleted payments for that student/session
  ///   pending    = max(0, totalDue - totalPaid)
  func calcPendingFees(sessionId : Text, todayDay : Int, todayMonth : Int, todayYear : Int) : Nat {
    let dueMonths = dueMonthLabels(todayDay, todayMonth, todayYear);
    if (dueMonths.size() == 0) { return 0 };

    // Build studentId → totalPaid map for this session
    let paidByStudent = Map.empty<Text, Nat>();
    for (p in feePayments.values()) {
      if (not p.isDeleted and p.sessionId == sessionId) {
        let prev = switch (paidByStudent.get(p.studentId)) { case (?n) n; case null 0 };
        paidByStudent.add(p.studentId, prev + p.totalAmount);
      };
    };

    var totalPending : Nat = 0;

    for (s in students.values()) {
      if (s.session == sessionId and s.status == #Active) {
        // Find fee plan for this student's class/section/session
        let planOpt = feePlans.values()
          |> List.fromIter<{ id : Text; classLevel : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 }; sectionId : ?Text; session : Text; monthlyAmounts : [(Text, Nat)] }>(_)
          |> _.find(func(p : { id : Text; classLevel : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 }; sectionId : ?Text; session : Text; monthlyAmounts : [(Text, Nat)] }) : Bool {
              p.session == sessionId and p.classLevel == s.classLevel
            });
        switch (planOpt) {
          case null {};
          case (?plan) {
            // Sum monthly amounts for due months
            var totalDue : Nat = 0;
            for ((month, amt) in plan.monthlyAmounts.values()) {
              let isDue = List.fromIter<Text>(dueMonths.values())
                .find(func(lbl : Text) : Bool { lbl == month }) != null;
              if (isDue) { totalDue += amt };
            };
            // Also add old balance for this student (convert Float to Nat via truncation)
            let oldBal : Nat = switch (studentOldBalances.get(s.id)) {
              case (?ob) {
                let prevDue : Float = switch (ob.previousYearDue) { case (?v) v; case null 0.0 };
                let total = ob.amount + prevDue;
                if (total > 0.0) { Int.abs(total.toInt()) } else { 0 }
              };
              case null 0;
            };
            totalDue += oldBal;

            let paid = switch (paidByStudent.get(s.id)) { case (?n) n; case null 0 };
            if (totalDue > paid) { totalPending += totalDue - paid };
          };
        };
      };
    };
    totalPending
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  public shared func pushActivityEntry(
    actionType  : Text,
    description : Text,
    userName    : Text,
  ) : async () {
    pushActivity(actionType, description, userName)
  };

  public query func getDashboardStatsV2(sessionId : Text) : async DashTypes.DashboardStatsV2 {
    // ── Students ────────────────────────────────────────────────────────────
    var totalStudents : Nat = 0;
    let sessionStudentsList = List.empty<{
      id : Text; session : Text; status : { #Active; #Discontinued; #Graduated };
      classLevel : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
      sectionId : Text;
    }>();
    for (s in students.values()) {
      if (s.session == sessionId and s.status == #Active) {
        totalStudents += 1;
        sessionStudentsList.add({ id = s.id; session = s.session; status = s.status; classLevel = s.classLevel; sectionId = s.sectionId });
      }
    };
    let sessionStudents = sessionStudentsList.toArray();

    // ── Staff ──────────────────────────────────────────────────────────────
    var totalStaff : Nat = 0;
    for (s in staff.values()) {
      if (s.status == #Active) { totalStaff += 1 };
    };

    // ── Fees ──────────────────────────────────────────────────────────────
    let today     = todayDdMmYyyy();
    let thisMonth = monthYearOf(today);
    let thisYear  = yearOf(today);

    var feesCollectedToday     : Nat = 0;
    var feesCollectedThisMonth : Nat = 0;
    var feesCollectedThisYear  : Nat = 0;
    let todayBreakdownList = List.empty<DashTypes.FeePaymentSummary>();

    for (p in feePayments.values()) {
      if (not p.isDeleted and p.sessionId == sessionId) {
        if (p.paymentDate == today) {
          feesCollectedToday += p.totalAmount;
          let (sName, clText, admNoText) : (Text, Text, Text) = switch (students.get(p.studentId)) {
            case (?stu) {
              let cl = switch (stu.classLevel) {
                case (#PlayWay) "Play Way"; case (#LKG) "LKG"; case (#UKG) "UKG";
                case (#Class1)  "Class 1";  case (#Class2)  "Class 2";  case (#Class3)  "Class 3";
                case (#Class4)  "Class 4";  case (#Class5)  "Class 5";  case (#Class6)  "Class 6";
                case (#Class7)  "Class 7";  case (#Class8)  "Class 8";  case (#Class9)  "Class 9";
                case (#Class10) "Class 10"; case (#Class11) "Class 11"; case (#Class12) "Class 12";
              };
              (stu.fullName, cl, stu.admNo)
            };
            case null ("", "", "");
          };
          todayBreakdownList.add({
            studentName  = sName;
            admNo        = admNoText;
            className    = clText;
            amount       = p.totalAmount;
            receiverName = p.createdBy;
            paymentMode  = p.paymentMode;
            receiptNo    = p.receiptNo;
          });
        };
        if (monthYearOf(p.paymentDate) == thisMonth) {
          feesCollectedThisMonth += p.totalAmount
        };
        if (yearOf(p.paymentDate) == thisYear) {
          feesCollectedThisYear += p.totalAmount
        };
      }
    };

    // Parse today's day/month/year from dd/mm/yyyy for the 15th-of-month rule
    let todayChars = today.toArray();
    let todayDayInt : Int = switch (Int.fromText(Text.fromChar(todayChars[0]) # Text.fromChar(todayChars[1]))) { case (?n) n; case null 1 };
    let todayMonthInt : Int = switch (Int.fromText(Text.fromChar(todayChars[3]) # Text.fromChar(todayChars[4]))) { case (?n) n; case null 1 };
    let todayYearInt : Int = switch (Int.fromText(Text.fromChar(todayChars[6]) # Text.fromChar(todayChars[7]) # Text.fromChar(todayChars[8]) # Text.fromChar(todayChars[9]))) { case (?n) n; case null 2025 };
    let pendingFeesTotal : Nat = calcPendingFees(sessionId, todayDayInt, todayMonthInt, todayYearInt);

    // ── Attendance today — merge manual + device attendance ─────────────────
    // Build set of present studentIds from manual attendance map
    let presentStudentIds = Map.empty<Text, Bool>();
    for (r in attendance.values()) {
      if (r.date == today) {
        switch (r.status) {
          case (#Present or #Late) { presentStudentIds.add(r.studentId, true) };
          case _ {};
        };
      };
    };
    // Merge device attendance (studentId is Nat → toText)
    for ((_, dr) in deviceAttendance.entries()) {
      if (dr.date == today) {
        presentStudentIds.add(dr.studentId.toText(), true);
      };
    };
    let presentCount : Nat = presentStudentIds.size();
    let attendanceTodayPercent : ?Float =
      if (totalStudents == 0 and presentCount == 0) { null }
      else if (totalStudents == 0) { ?(100.0) }
      else { ?(presentCount.toFloat() / totalStudents.toFloat() * 100.0) };

    // ── Classes and Sections ──────────────────────────────────────────────
    let classSet = List.empty<Text>();
    for (s in sessionStudents.values()) {
      let cl = switch (s.classLevel) {
        case (#PlayWay) "PlayWay"; case (#LKG) "LKG"; case (#UKG) "UKG";
        case (#Class1)  "C1";  case (#Class2)  "C2";  case (#Class3)  "C3";
        case (#Class4)  "C4";  case (#Class5)  "C5";  case (#Class6)  "C6";
        case (#Class7)  "C7";  case (#Class8)  "C8";  case (#Class9)  "C9";
        case (#Class10) "C10"; case (#Class11) "C11"; case (#Class12) "C12";
      };
      if (classSet.find(func(x : Text) : Bool { x == cl }) == null) {
        classSet.add(cl)
      };
    };
    let totalClasses  = classSet.size();
    let totalSections = sections.size();

    // ── Recent activity (last 10) ───────────────────────────────────────
    let recentActivity = lastNActivity(10);

    {
      totalStudents;
      totalStaff;
      feesCollectedToday;
      feesCollectedThisMonth;
      feesCollectedThisYear;
      pendingFeesTotal;
      attendanceTodayPercent;
      totalClasses;
      totalSections;
      recentActivity;
      feesCollectedTodayBreakdown = todayBreakdownList.toArray();
    }
  };
  /// Returns individual fee payments for a specific date (dd/MM/yyyy).
  /// Powers the "Fees Collected Today" drill-down modal on the dashboard.
  public query func getDailyFeeBreakdown(date : Text, sessionId : Text) : async [DashTypes.FeePaymentSummary] {
    let result = List.empty<DashTypes.FeePaymentSummary>();
    for (p in feePayments.values()) {
      if (not p.isDeleted and p.sessionId == sessionId and p.paymentDate == date) {
        let (sName, clText, admNoText) : (Text, Text, Text) = switch (students.get(p.studentId)) {
          case (?stu) {
            let cl = switch (stu.classLevel) {
              case (#PlayWay) "Play Way"; case (#LKG) "LKG"; case (#UKG) "UKG";
              case (#Class1)  "Class 1";  case (#Class2)  "Class 2";  case (#Class3)  "Class 3";
              case (#Class4)  "Class 4";  case (#Class5)  "Class 5";  case (#Class6)  "Class 6";
              case (#Class7)  "Class 7";  case (#Class8)  "Class 8";  case (#Class9)  "Class 9";
              case (#Class10) "Class 10"; case (#Class11) "Class 11"; case (#Class12) "Class 12";
            };
            (stu.fullName, cl, stu.admNo)
          };
          case null ("", "", "");
        };
        result.add({
          studentName  = sName;
          admNo        = admNoText;
          className    = clText;
          amount       = p.totalAmount;
          receiverName = p.createdBy;
          paymentMode  = p.paymentMode;
          receiptNo    = p.receiptNo;
        });
      }
    };
    result.toArray()
  };
};
