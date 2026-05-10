module {
  /// Result returned by promoteBulkStudents.
  public type PromotionResult = {
    promoted : Nat;
    failed   : Nat;
    errors   : [Text];
  };

  /// Preview row returned by getPromotionPreview.
  public type PromotionPreviewItem = {
    studentId    : Text;
    fullName     : Text;
    admNo        : Text;
    oldBalance   : Float;
    discountCount : Nat;
    hasTransport : Bool;
  };

  /// Per-class breakdown used in PromotionAllResult.
  public type PromotionClassBreakdown = {
    className  : Text;   // e.g. "Play Way", "LKG", "Class 1"
    promoted   : Nat;
    failed     : Nat;
    graduated  : Nat;    // Class12 students marked Graduated
  };

  /// Result returned by promoteAllClasses.
  public type PromotionAllResult = {
    totalPromoted  : Nat;
    totalFailed    : Nat;
    totalGraduated : Nat;
    breakdown      : [PromotionClassBreakdown];
  };
};
