import Map    "mo:core/Map";
import List   "mo:core/List";
import Int    "mo:core/Int";
import Float  "mo:core/Float";
import Text   "mo:core/Text";
import Types  "../types/payroll-calendar";
import DevAttTypes "../types/device-attendance";

module {

  public type StaffPayrollRecord  = Types.StaffPayrollRecord;
  public type PayrollMonthStatus  = Types.PayrollMonthStatus;
  public type PaidLeaveConfig     = Types.PaidLeaveConfig;
  public type ExamCalendarEntry   = Types.ExamCalendarEntry;
  public type CalendarStats       = Types.CalendarStats;
  public type StaffAttendanceRecord = DevAttTypes.StaffAttendanceRecord;

  // ─── Calendar helpers ────────────────────────────────────────────────────

  /// Convert a Time.now() nanosecond timestamp to (day, month, year) ints.
  public func timestampToDMY(nanos : Int) : (Int, Int, Int) {
    let nowSec : Int = nanos / 1_000_000_000;
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
    (day, month, year)
  };

  /// Convert (day, month, year) to a Unix day number (days since 0000-03-01).
  public func dmyToDay(day : Int, month : Int, year : Int) : Int {
    let y = if (month <= 2) year - 1 else year;
    let m = if (month <= 2) month + 9 else month - 3;
    let era : Int = (if (y >= 0) y else y - 399) / 400;
    let yoe : Int = y - era * 400;
    let doy : Int = (153 * m + 2) / 5 + day - 1;
    let doe : Int = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146097 + doe - 719468
  };

  /// Returns 0=Mon … 6=Sun for a given Unix day number.
  /// Returns 0=Mon … 6=Sun for a given Unix day number (works for any Int).
  public func dayOfWeek(unixDay : Int) : Int {
    let r = Int.rem(unixDay + 3, 7);
    if (r < 0) r + 7 else r
  };

  /// Parse "dd/mm/yyyy" → (day, month, year).  Returns (0,0,0) on bad input.
  public func parseDDMMYYYY(s : Text) : (Int, Int, Int) {
    if (s.size() != 10) { return (0, 0, 0) };
    let chars = s.toArray();
    let dayTxt  = Text.fromChar(chars[0]) # Text.fromChar(chars[1]);
    let monTxt  = Text.fromChar(chars[3]) # Text.fromChar(chars[4]);
    let yearTxt = Text.fromChar(chars[6]) # Text.fromChar(chars[7]) # Text.fromChar(chars[8]) # Text.fromChar(chars[9]);
    let dd = switch (Nat.fromText(dayTxt))  { case (?v) v.toInt(); case null 0 };
    let mm = switch (Nat.fromText(monTxt))  { case (?v) v.toInt(); case null 0 };
    let yy = switch (Nat.fromText(yearTxt)) { case (?v) v.toInt(); case null 0 };
    (dd, mm, yy)
  };

  /// Convert (day,month,year) to "dd/mm/yyyy" string.
  public func dmyToText(day : Int, month : Int, year : Int) : Text {
    let dd = if (day   < 10) "0" # day.toText()   else day.toText();
    let mm = if (month < 10) "0" # month.toText() else month.toText();
    dd # "/" # mm # "/" # year.toText()
  };

  /// Current academic year start = 1 Apr of this year if current month >= April,
  /// else 1 Apr of last year.
  public func academicYearStart(nowNanos : Int) : (Int, Int, Int) {
    let (_, month, year) = timestampToDMY(nowNanos);
    let startYear = if (month >= 4) year else year - 1;
    (1, 4, startYear)
  };

  // ─── Calendar stats ──────────────────────────────────────────────────────

  /// Compute CalendarStats for the current academic year up to today.
  /// holidays — Map<id, Holiday> with date field "dd/mm/yyyy".
  public func getCalendarStats(
    nowNanos : Int,
    holidays : Map.Map<Text, { date : Text; id : Text; name : Text; description : Text; isRecurring : Bool; createdAt : Int }>
  ) : CalendarStats {
    let (startDay, startMonth, startYear) = academicYearStart(nowNanos);
    let startUnix = dmyToDay(startDay, startMonth, startYear);
    let (todayDay, todayMonth, todayYear) = timestampToDMY(nowNanos);
    let todayUnix = dmyToDay(todayDay, todayMonth, todayYear);

    // Build a Set of holiday unix days for O(log n) lookup
    let holidayDays = Map.empty<Int, Bool>();
    for (h in holidays.values()) {
      let (hd, hm, hy) = parseDDMMYYYY(h.date);
      if (hd != 0) {
        let hUnix = dmyToDay(hd, hm, hy);
        // only count holidays within the academic year range
        if (hUnix >= startUnix and hUnix <= todayUnix) {
          holidayDays.add(hUnix, true);
        }
      }
    };

    var totalDays : Int = 0;
    var sundayCount : Int = 0;
    var holidayCount : Int = 0;
    var workingDays : Int = 0;

    var cur = startUnix;
    while (cur <= todayUnix) {
      totalDays += 1;
      let dow = dayOfWeek(cur);
      let isSunday  = (dow == 6);
      let isHoliday = holidayDays.containsKey(cur);
      if (isSunday) { sundayCount += 1 };
      if (isHoliday and not isSunday) { holidayCount += 1 };
      if (not isSunday and not isHoliday) { workingDays += 1 };
      cur += 1;
    };

    { totalDaysFromApril1 = totalDays; workingDays; sundayCount; holidayCount }
  };

  // ─── Working days in a specific month (for payroll) ──────────────────────

  /// Count working days in a given month/year, excluding Sundays and holidays.
  /// Sundays and holidays both count as PRESENT in payroll (not deducted).
  public func workingDaysInMonth(
    month : Nat,
    year  : Nat,
    holidays : Map.Map<Text, { date : Text; id : Text; name : Text; description : Text; isRecurring : Bool; createdAt : Int }>
  ) : Nat {
    // Build holiday set for quick lookup
    let holidayDays = Map.empty<Int, Bool>();
    for (h in holidays.values()) {
      let (hd, hm, hy) = parseDDMMYYYY(h.date);
      if (hm == month.toInt() and hy == year.toInt() and hd != 0) {
        holidayDays.add(dmyToDay(hd, hm, hy), true);
      }
    };

    // Days in month
    let daysInMonth = daysInMonthCount(month, year);
    var working : Nat = 0;
    var d : Nat = 1;
    while (d <= daysInMonth) {
      let unixDay = dmyToDay(d.toInt(), month.toInt(), year.toInt());
      let dow = dayOfWeek(unixDay);
      let isSunday  = (dow == 6);
      let isHoliday = holidayDays.containsKey(unixDay);
      if (not isSunday and not isHoliday) { working += 1 };
      d += 1;
    };
    working
  };

  public func daysInMonthCount(month : Nat, year : Nat) : Nat {
    switch (month) {
      case 1  31;
      case 2  { if (isLeapYear(year)) 29 else 28 };
      case 3  31;
      case 4  30;
      case 5  31;
      case 6  30;
      case 7  31;
      case 8  31;
      case 9  30;
      case 10 31;
      case 11 30;
      case 12 31;
      case _  30;
    }
  };

  public func isLeapYear(year : Nat) : Bool {
    (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
  };

  // ─── Payroll calculation ─────────────────────────────────────────────────

  /// Payroll key: "staffId#YYYY-MM" (zero-padded month).
  /// Payroll key: "staffId#YYYY-MM" (zero-padded month).
  public func payrollKey(staffId : Text, month : Nat, year : Nat) : Text {
    let mm = if (month < 10) "0" # month.toText() else month.toText();
    staffId # "#" # year.toText() # "-" # mm
  };

  /// Count unique present days for a staff member in a month.
  /// Sundays and holidays in the calendar are treated as present (they are not absent).
  /// Each unique calendar date that has at least one clock-in entry counts as 1 present day.
  public func countPresentDays(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    staffId : Text,
    month   : Nat,
    year    : Nat,
    workingDays : Nat,
    holidays : Map.Map<Text, { date : Text; id : Text; name : Text; description : Text; isRecurring : Bool; createdAt : Int }>
  ) : Nat {
    // Collect unique attended dates on working days
    let attendedDates = Map.empty<Text, Bool>();
    for (r in staffAttendance.values()) {
      if (r.staffId == staffId and r.month == month and r.year == year) {
        attendedDates.add(r.date, true);
      }
    };
    let clockedInDays = attendedDates.size();

    // Sundays + holidays count as present, so we need to add them
    // to the clocked-in count (since they are not in attendance records).
    let holidayDays = Map.empty<Int, Bool>();
    for (h in holidays.values()) {
      let (hd, hm, hy) = parseDDMMYYYY(h.date);
      if (hm == month.toInt() and hy == year.toInt() and hd != 0) {
        holidayDays.add(dmyToDay(hd, hm, hy), true);
      }
    };

    // Count Sundays and holidays in the month
    let daysInMon = daysInMonthCount(month, year);
    var nonWorkingDays : Nat = 0;
    var d : Nat = 1;
    while (d <= daysInMon) {
      let unixDay = dmyToDay(d.toInt(), month.toInt(), year.toInt());
      let dow = dayOfWeek(unixDay);
      let isSunday  = (dow == 6);
      let isHoliday = holidayDays.containsKey(unixDay);
      if (isSunday or isHoliday) { nonWorkingDays += 1 };
      d += 1;
    };

    // presentDays = clockedInDays + nonWorkingDays  (capped at total days in month)
    let total = clockedInDays + nonWorkingDays;
    let daysInMon2 = daysInMonthCount(month, year);
    if (total > daysInMon2) daysInMon2 else total
  };

  /// Calculate and return a new StaffPayrollRecord.
  /// Does NOT save — caller must save to the map.
  /// If a locked (#paid) record exists, it is returned unchanged.
  public func calculatePayrollRecord(
    existing : ?StaffPayrollRecord,
    staffId  : Text,
    month    : Nat,
    year     : Nat,
    baseSalary : Nat,
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    holidays : Map.Map<Text, { date : Text; id : Text; name : Text; description : Text; isRecurring : Bool; createdAt : Int }>,
    paidLeaveConfig : PaidLeaveConfig,
    nowNanos : Int
  ) : StaffPayrollRecord {
    // If already paid, return locked record unchanged
    switch (existing) {
      case (?rec) {
        if (rec.status == #paid) { return rec }
      };
      case null {};
    };

    let workingDays = workingDaysInMonth(month, year, holidays);
    let presentDays = countPresentDays(staffAttendance, staffId, month, year, workingDays, holidays);
    let absentDays  = if (workingDays >= presentDays) { workingDays - presentDays } else { 0 };

    // freeLeave = floor(paidLeaveDaysPerMonth)
    let freeLeaveFloat = paidLeaveConfig.daysPerMonth;
    let freeLeave : Nat = freeLeaveFloat.toInt().toNat();

    let deductibleDays : Nat = if (absentDays > freeLeave) { absentDays - freeLeave } else { 0 };
    let deduction : Nat =
      if (workingDays == 0) { 0 }
      else { baseSalary * deductibleDays / workingDays };
    let netPay : Nat = if (baseSalary >= deduction) { baseSalary - deduction } else { 0 };

    let id = payrollKey(staffId, month, year);
    let amountPaid = switch (existing) {
      case (?rec) rec.amountPaid;
      case null 0;
    };
    let status : PayrollMonthStatus =
      if (amountPaid == 0) #unpaid
      else if (amountPaid >= netPay) #paid
      else #partial;
    let lockedAt : ?Int = switch (existing) {
      case (?rec) rec.lockedAt;
      case null null;
    };
    {
      id; staffId; month; year; baseSalary; workingDays; presentDays; absentDays;
      freeLeave; deductibleDays; deduction; netPay; amountPaid; status; lockedAt;
      notes = "";
      generatedAt = switch (existing) {
        case (?rec) rec.generatedAt;
        case null nowNanos;
      };
    }
  };

  // ─── Lock a payroll month ────────────────────────────────────────────────

  /// Set status to #paid and record lockedAt. Returns updated record.
  /// No-op if already locked.
  public func lockPayrollMonth(
    rec : StaffPayrollRecord,
    nowNanos : Int
  ) : StaffPayrollRecord {
    if (rec.status == #paid) { return rec };
    { rec with status = #paid; lockedAt = ?nowNanos }
  };

  // ─── Record a payout against a payroll month ─────────────────────────────

  /// Add a payout amount to an existing payroll record and update the status.
  /// If the record is locked (#paid) the call is a no-op (return unchanged).
  public func addPayout(
    rec    : StaffPayrollRecord,
    amount : Nat
  ) : StaffPayrollRecord {
    if (rec.status == #paid) { return rec };
    let newAmountPaid = rec.amountPaid + amount;
    let newStatus : PayrollMonthStatus =
      if (newAmountPaid >= rec.netPay) #paid else #partial;
    { rec with amountPaid = newAmountPaid; status = newStatus }
  };

  // ─── Exam calendar entries ───────────────────────────────────────────────

  public func addExamEntry(
    store   : Map.Map<Text, ExamCalendarEntry>,
    nextId  : { var value : Nat },
    examName : Text,
    date     : Text,
    className : Text,
    nowNanos  : Int
  ) : ExamCalendarEntry {
    let id = nextId.value.toText();
    nextId.value += 1;
    let entry : ExamCalendarEntry = { id; examName; date; className; createdAt = nowNanos };
    store.add(id, entry);
    entry
  };

  public func getExamEntries(
    store : Map.Map<Text, ExamCalendarEntry>
  ) : [ExamCalendarEntry] {
    store.values() |> List.fromIter<ExamCalendarEntry>(_) |> _.toArray()
  };

  public func deleteExamEntry(
    store : Map.Map<Text, ExamCalendarEntry>,
    id    : Text
  ) {
    store.remove(id)
  };

};
