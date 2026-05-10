module {

  /// Status of a monthly payroll record.
  /// Once #paid is set, the record is permanently locked.
  public type PayrollMonthStatus = {
    #unpaid;   // not yet calculated / no payment made
    #partial;  // some payment recorded, amount < netPay
    #paid;     // fully paid and locked — no recalculation allowed
  };

  /// Stable, persisted payroll record keyed by "staffId#YYYY-MM".
  public type StaffPayrollRecord = {
    id          : Text;    // "staffId#YYYY-MM"
    staffId     : Text;
    month       : Nat;     // 1–12
    year        : Nat;     // e.g. 2025
    baseSalary  : Nat;     // gross monthly salary at time of calculation
    workingDays : Nat;     // total working days in the month (calendar API)
    presentDays : Nat;     // days the staff actually clocked in (holidays+Sundays already included)
    absentDays  : Nat;     // workingDays - presentDays (never negative)
    freeLeave   : Nat;     // paid-leave allowance rounded down for the month
    deductibleDays : Nat;  // max(0, absentDays - freeLeave)
    deduction   : Nat;     // baseSalary * deductibleDays / workingDays
    netPay      : Nat;     // baseSalary - deduction
    amountPaid  : Nat;     // cumulative payouts recorded against this month
    status      : PayrollMonthStatus;
    lockedAt    : ?Int;    // Time.now() when status became #paid; null otherwise
    notes       : Text;
    generatedAt : Int;     // Time.now() when first generated
  };

  /// Admin-configurable paid-leave allowance (global).
  public type PaidLeaveConfig = {
    daysPerMonth : Float;   // e.g. 1.0 or 1.5
    updatedAt    : Int;
  };

  /// Exam date entry shown on the academic calendar.
  public type ExamCalendarEntry = {
    id        : Text;
    examName  : Text;
    date      : Text;   // dd/mm/yyyy
    className : Text;   // display label e.g. "Class 5" or "All"
    createdAt : Int;
  };

  /// Stats returned by getCalendarStats.
  public type CalendarStats = {
    totalDaysFromApril1 : Int;    // count of days from 1-Apr of current academic year to today (inclusive)
    workingDays         : Int;    // totalDays minus Sundays and holidays
    sundayCount         : Int;
    holidayCount        : Int;
  };

};
