module {
  /// Per-student discount applied to a specific fee heading every month.
  public type StudentDiscount = {
    id        : Text;
    studentId : Text;
    headingId : Text;   // FeeHeading id
    amount    : Nat;    // discount amount in INR
    remark    : ?Text;
    createdAt : Int;
  };

  /// Old-balance carry-forward from a previous session.
  public type StudentOldBalance = {
    id              : Text;
    studentId       : Text;
    sessionId       : Text;   // session the balance originated from
    amount          : Float;  // INR; current-session unpaid balance (carries forward)
    previousYearDue : ?Float; // INR; dues originating from prior academic sessions (optional for upgrade compat)
    addedAt         : Int;    // nanoseconds since epoch
  };
};
