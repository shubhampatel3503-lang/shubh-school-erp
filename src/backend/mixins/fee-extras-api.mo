import Map    "mo:core/Map";
import List   "mo:core/List";
import Time   "mo:core/Time";
import Types  "../types/fee-extras";
import FeeExtrasLib "../lib/fee-extras";

/// Public endpoints for per-student discounts and old-balance carry-forward.
mixin (
  discounts   : Map.Map<Text, Types.StudentDiscount>,
  oldBalances : Map.Map<Text, Types.StudentOldBalance>,
  nextIdRef   : { var value : Nat },
) {

  // ── Discounts ──────────────────────────────────────────────────────────────

  /// Set or update a discount for a student on a specific fee heading.
  public shared func setStudentDiscount(
    studentId : Text,
    headingId : Text,
    amount    : Nat,
    remark    : ?Text,
  ) : async Types.StudentDiscount {
    // Look for an existing discount for this student+heading to upsert
    let existing = discounts.values()
      |> List.fromIter<Types.StudentDiscount>(_)
      |> _.find(func(d : Types.StudentDiscount) : Bool {
          d.studentId == studentId and d.headingId == headingId
        });
    let id = switch (existing) {
      case (?d) d.id;
      case null {
        let newId = nextIdRef.value;
        nextIdRef.value += 1;
        newId.toText()
      };
    };
    let discount : Types.StudentDiscount = {
      id;
      studentId;
      headingId;
      amount;
      remark;
      createdAt = Time.now();
    };
    FeeExtrasLib.setDiscount(discounts, discount)
  };

  /// Return all discounts for a student.
  public query func getStudentDiscounts(studentId : Text) : async [Types.StudentDiscount] {
    FeeExtrasLib.getDiscountsByStudent(discounts, studentId)
  };

  /// Remove a student discount by id.
  public shared func removeStudentDiscount(id : Text) : async () {
    FeeExtrasLib.removeDiscount(discounts, id)
  };

  // ── Old Balances ───────────────────────────────────────────────────────────

  /// Set or update the old-session balance for a student.
  /// previousYearDue tracks dues carried in from prior academic sessions (null = 0.0).
  public shared func setStudentOldBalance(
    studentId       : Text,
    sessionId       : Text,
    amount          : Float,
    previousYearDue : ?Float,
  ) : async Types.StudentOldBalance {
    // Look for existing record to upsert
    let existing = FeeExtrasLib.getOldBalance(oldBalances, studentId, sessionId);
    let id = switch (existing) {
      case (?b) b.id;
      case null {
        let newId = nextIdRef.value;
        nextIdRef.value += 1;
        newId.toText()
      };
    };
    let balance : Types.StudentOldBalance = {
      id;
      studentId;
      sessionId;
      amount;
      previousYearDue;
      addedAt = Time.now();
    };
    FeeExtrasLib.setOldBalance(oldBalances, balance)
  };

  /// Return the old balance for a student in a given session.
  public query func getStudentOldBalance(
    studentId : Text,
    sessionId : Text,
  ) : async ?Types.StudentOldBalance {
    FeeExtrasLib.getOldBalance(oldBalances, studentId, sessionId)
  };

  /// Return all old-balance records for a student.
  public query func getStudentOldBalances(studentId : Text) : async [Types.StudentOldBalance] {
    FeeExtrasLib.getOldBalancesByStudent(oldBalances, studentId)
  };
  /// Single source of truth for Collect Fees pre-population.
  /// Returns the student's balance summary for a given session.
  public query func getStudentFeeBalance(
    studentId : Text,
    sessionId : Text,
  ) : async {
    oldBalance      : Float;   // unpaid balance carried forward in this session
    previousYearDue : Float;   // dues from prior academic sessions
  } {
    switch (FeeExtrasLib.getOldBalance(oldBalances, studentId, sessionId)) {
      case (?b) {
        let pyd = switch (b.previousYearDue) { case (?v) v; case null 0.0 };
        { oldBalance = b.amount; previousYearDue = pyd }
      };
      case null { { oldBalance = 0.0; previousYearDue = 0.0 } };
    }
  };
};
