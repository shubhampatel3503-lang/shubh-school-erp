import Map     "mo:core/Map";
import List    "mo:core/List";
import Time    "mo:core/Time";
import PayLib  "../lib/payroll-calendar";
import PCTypes "../types/payroll-calendar";
import DevAttTypes "../types/device-attendance";

/// Payroll-calendar mixin.
/// Provides:
///   - calculateAndSavePayroll, getPayrollHistory, getPayrollByMonth, lockPayrollMonth
///   - recordPayrollPayout
///   - setPaidLeaveConfig, getPaidLeaveConfig
///   - getCalendarStats
///   - addExamDateToCalendar, getExamDatesForCalendar, deleteExamCalendarEntry
mixin (
  staffAttendance    : Map.Map<Nat, DevAttTypes.StaffAttendanceRecord>,
  payrollRecordsPC   : Map.Map<Text, PCTypes.StaffPayrollRecord>,
  paidLeaveConfigRef : { var value : PCTypes.PaidLeaveConfig },
  examCalendarStore  : Map.Map<Text, PCTypes.ExamCalendarEntry>,
  nextExamCalId      : { var value : Nat },
  holidays : Map.Map<Text, {
    id : Text; name : Text; date : Text; description : Text;
    isRecurring : Bool; createdAt : Int;
  }>
) {

  // ── Paid-leave config ────────────────────────────────────────────────────

  /// Admin sets paid-leave days per month (1.0 or 1.5 are typical).
  public shared func setPaidLeaveConfig(daysPerMonth : Float) : async PCTypes.PaidLeaveConfig {
    let cfg : PCTypes.PaidLeaveConfig = {
      daysPerMonth;
      updatedAt = Time.now();
    };
    paidLeaveConfigRef.value := cfg;
    cfg
  };

  public query func getPaidLeaveConfig() : async PCTypes.PaidLeaveConfig {
    paidLeaveConfigRef.value
  };

  // ── Payroll calculation ──────────────────────────────────────────────────

  /// Calculate (or re-calculate if not locked) and SAVE the payroll record
  /// for a staff member for a specific month/year.
  /// Returns the record. If the month is already locked (#paid), returns
  /// the existing record unchanged.
  public shared func calculateAndSavePayroll(
    staffId    : Text,
    month      : Nat,
    year       : Nat,
    baseSalary : Nat
  ) : async PCTypes.StaffPayrollRecord {
    let key     = PayLib.payrollKey(staffId, month, year);
    let existing = payrollRecordsPC.get(key);
    let rec = PayLib.calculatePayrollRecord(
      existing, staffId, month, year, baseSalary,
      staffAttendance, holidays, paidLeaveConfigRef.value, Time.now()
    );
    payrollRecordsPC.add(key, rec);
    rec
  };

  /// Return all saved payroll records for a staff member, newest first.
  public query func getPayrollHistory(
    staffId : Text
  ) : async [PCTypes.StaffPayrollRecord] {
    payrollRecordsPC.values()
      |> List.fromIter<PCTypes.StaffPayrollRecord>(_)
      |> _.filter(func(r : PCTypes.StaffPayrollRecord) : Bool { r.staffId == staffId })
      |> _.sort(func(a : PCTypes.StaffPayrollRecord, b : PCTypes.StaffPayrollRecord) : {
           #less; #equal; #greater
         } {
           if (a.year > b.year) #less
           else if (a.year < b.year) #greater
           else if (a.month > b.month) #less
           else if (a.month < b.month) #greater
           else #equal
         })
      |> _.toArray()
  };

  /// Return all saved payroll records for a given month/year (all staff).
  public query func getPayrollByMonth(
    month : Nat,
    year  : Nat
  ) : async [PCTypes.StaffPayrollRecord] {
    payrollRecordsPC.values()
      |> List.fromIter<PCTypes.StaffPayrollRecord>(_)
      |> _.filter(func(r : PCTypes.StaffPayrollRecord) : Bool {
           r.month == month and r.year == year
         })
      |> _.toArray()
  };

  /// Permanently lock a payroll month for a staff member (mark as #paid).
  /// No-op if already locked. Returns the (possibly unchanged) record.
  public shared func lockPayrollMonth(
    staffId : Text,
    month   : Nat,
    year    : Nat
  ) : async ?PCTypes.StaffPayrollRecord {
    let key = PayLib.payrollKey(staffId, month, year);
    switch (payrollRecordsPC.get(key)) {
      case (?rec) {
        let locked = PayLib.lockPayrollMonth(rec, Time.now());
        payrollRecordsPC.add(key, locked);
        ?locked
      };
      case null null;
    }
  };

  /// Record a partial or full payout against a payroll month.
  /// If the record does not exist yet it is created (calculated first).
  /// Returns the updated record, or null if baseSalary is 0 and record doesn't exist.
  public shared func recordPayrollPayout(
    staffId    : Text,
    month      : Nat,
    year       : Nat,
    amount     : Nat,
    baseSalary : Nat
  ) : async ?PCTypes.StaffPayrollRecord {
    let key = PayLib.payrollKey(staffId, month, year);
    let existing = payrollRecordsPC.get(key);
    // Ensure a record exists before adding payout
    let base : PCTypes.StaffPayrollRecord = switch (existing) {
      case (?r) r;
      case null {
        // Auto-generate if not present and baseSalary provided
        if (baseSalary == 0) { return null };
        let newRec = PayLib.calculatePayrollRecord(
          null, staffId, month, year, baseSalary,
          staffAttendance, holidays, paidLeaveConfigRef.value, Time.now()
        );
        newRec
      };
    };
    // If already locked (paid), return as-is
    if (base.status == #paid) {
      payrollRecordsPC.add(key, base);
      return ?base;
    };
    let updated = PayLib.addPayout(base, amount);
    payrollRecordsPC.add(key, updated);
    ?updated
  };

  // ── Academic calendar stats ──────────────────────────────────────────────

  /// Returns calendar day counts from 1 April of the current academic year to today.
  /// totalDaysFromApril1, workingDays (excl. Sundays + holidays), sundayCount, holidayCount.
  public query func getCalendarStats() : async PCTypes.CalendarStats {
    PayLib.getCalendarStats(Time.now(), holidays)
  };

  // ── Exam calendar ────────────────────────────────────────────────────────

  /// Add an exam date to the academic calendar.
  public shared func addExamDateToCalendar(
    examName  : Text,
    date      : Text,
    className : Text
  ) : async PCTypes.ExamCalendarEntry {
    PayLib.addExamEntry(examCalendarStore, nextExamCalId, examName, date, className, Time.now())
  };

  /// Return all exam calendar entries.
  public query func getExamDatesForCalendar() : async [PCTypes.ExamCalendarEntry] {
    PayLib.getExamEntries(examCalendarStore)
  };

  /// Delete an exam calendar entry by id.
  public shared func deleteExamCalendarEntry(id : Text) : async () {
    PayLib.deleteExamEntry(examCalendarStore, id)
  };

};
