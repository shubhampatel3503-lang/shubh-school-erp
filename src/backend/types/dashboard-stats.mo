module {
  /// One entry in the recent-activity log.
  public type ActivityEntry = {
    timestamp   : Int;    // nanoseconds
    actionType  : Text;   // e.g. "payment", "addStudent", "addStaff", "promotion"
    description : Text;
    userName    : Text;
  };

  /// Individual payment summary for the "Fees Collected Today" drill-down.
  public type FeePaymentSummary = {
    studentName  : Text;
    admNo        : Text;
    className    : Text;
    amount       : Nat;
    receiverName : Text;
    paymentMode  : Text;
    receiptNo    : Text;
  };

  /// Rich dashboard statistics for a specific session.
  public type DashboardStatsV2 = {
    totalStudents               : Nat;
    totalStaff                  : Nat;
    feesCollectedToday          : Nat;
    feesCollectedThisMonth      : Nat;
    feesCollectedThisYear       : Nat;
    pendingFeesTotal            : Nat;
    attendanceTodayPercent      : ?Float;   // null when no attendance recorded today
    totalClasses                : Nat;
    totalSections               : Nat;
    recentActivity              : [ActivityEntry];
    feesCollectedTodayBreakdown : [FeePaymentSummary];  // for drill-down modal
  };
};
