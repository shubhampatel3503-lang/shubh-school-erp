import Map   "mo:core/Map";
import List  "mo:core/List";
import Time  "mo:core/Time";
import Types "../types/fee-extras";

module {
  public type StudentDiscount    = Types.StudentDiscount;
  public type StudentOldBalance  = Types.StudentOldBalance;
  public type DiscountStore      = Map.Map<Text, StudentDiscount>;
  public type OldBalanceStore    = Map.Map<Text, StudentOldBalance>;

  // ── Discounts ──────────────────────────────────────────────────────────────

  /// Upsert a per-student fee-heading discount.
  public func setDiscount(
    store     : DiscountStore,
    discount  : StudentDiscount,
  ) : StudentDiscount {
    store.add(discount.id, discount);
    discount
  };

  /// Return all discounts for a student.
  public func getDiscountsByStudent(store : DiscountStore, studentId : Text) : [StudentDiscount] {
    store.values()
      |> List.fromIter<StudentDiscount>(_)
      |> _.filter(func(d : StudentDiscount) : Bool { d.studentId == studentId })
      |> _.toArray()
  };

  /// Delete a discount entry.
  public func removeDiscount(store : DiscountStore, id : Text) : () {
    store.remove(id)
  };

  // ── Old Balances ───────────────────────────────────────────────────────────

  /// Upsert the old-balance record for a student in a given session.
  public func setOldBalance(
    store      : OldBalanceStore,
    balance    : StudentOldBalance,
  ) : StudentOldBalance {
    store.add(balance.id, balance);
    balance
  };

  /// Auto-persist remaining balance after a fee payment.
  /// If totalDue > amountPaid, creates or updates the carry-forward record for this session.
  /// Preserves any existing previousYearDue on the record.
  /// Returns the updated balance record, or null if balance is zero and no record existed.
  public func autoCarryForward(
    store       : OldBalanceStore,
    nextIdRef   : { var value : Nat },
    studentId   : Text,
    sessionId   : Text,
    totalDue    : Nat,
    amountPaid  : Nat,
  ) : ?StudentOldBalance {
    let remainingFloat : Float = if (totalDue > amountPaid) {
      let diff : Nat = totalDue - amountPaid;
      diff.toFloat()
    } else { 0.0 };

    // Find existing record to upsert
    let existing = store.values()
      |> List.fromIter<StudentOldBalance>(_)
      |> _.find(func(b : StudentOldBalance) : Bool {
          b.studentId == studentId and b.sessionId == sessionId
        });

    if (remainingFloat > 0.0 or existing != null) {
      let (recId, prevYearDue) : (Text, ?Float) = switch (existing) {
        case (?b) (b.id, b.previousYearDue);
        case null {
          let newId = nextIdRef.value;
          nextIdRef.value += 1;
          (newId.toText(), null)
        };
      };
      let updated : StudentOldBalance = {
        id              = recId;
        studentId;
        sessionId;
        amount          = remainingFloat;
        previousYearDue = prevYearDue;
        addedAt         = Time.now();
      };
      store.add(recId, updated);
      ?updated
    } else {
      null
    }
  };

  /// Return the old balance for a specific student + session, or null.
  public func getOldBalance(
    store     : OldBalanceStore,
    studentId : Text,
    sessionId : Text,
  ) : ?StudentOldBalance {
    store.values()
      |> List.fromIter<StudentOldBalance>(_)
      |> _.find(func(b : StudentOldBalance) : Bool {
          b.studentId == studentId and b.sessionId == sessionId
        })
  };

  /// Return all old-balance records for a student across sessions.
  public func getOldBalancesByStudent(
    store     : OldBalanceStore,
    studentId : Text,
  ) : [StudentOldBalance] {
    store.values()
      |> List.fromIter<StudentOldBalance>(_)
      |> _.filter(func(b : StudentOldBalance) : Bool { b.studentId == studentId })
      |> _.toArray()
  };
};
