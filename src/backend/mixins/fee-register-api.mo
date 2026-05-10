import Map    "mo:core/Map";
import List   "mo:core/List";
import FeeExtrasTypes "../types/fee-extras";

/// Public endpoints for the user-wise fee register.
/// Uses main.mo's feePayments map projected via feeRegister.
mixin (
  feeRegister : Map.Map<Text, {
    id          : Text;
    studentId   : Text;
    receiptNo   : Text;
    paymentDate : Text;
    totalAmount : Nat;
    collectedBy : Text;
    isDeleted   : Bool;
  }>,
  studentOldBalancesRef : Map.Map<Text, FeeExtrasTypes.StudentOldBalance>,
) {

  public type FeePaymentEntry = {
    id          : Text;
    studentId   : Text;
    receiptNo   : Text;
    paymentDate : Text;
    totalAmount : Nat;
    collectedBy : Text;
    isDeleted   : Bool;
  };

  /// Entry type for the fee register with running balance.
  public type FeeRegisterBalanceEntry = {
    id              : Text;
    studentId       : Text;
    receiptNo       : Text;
    paymentDate     : Text;
    totalAmount     : Nat;
    collectedBy     : Text;
    previousBalance : Float;  // old balance + previousYearDue for this student/session
  };

  /// Return all non-deleted payments collected by a specific user (username).
  public query func getFeePaymentsByCollector(collectorId : Text) : async [FeePaymentEntry] {
    feeRegister.values()
      |> List.fromIter<FeePaymentEntry>(_)
      |> _.filter(func(p : FeePaymentEntry) : Bool {
          p.collectedBy == collectorId and not p.isDeleted
        })
      |> _.toArray()
  };

  /// Return all non-deleted payments grouped by collector.
  /// Result: [(collectorUsername, [FeePaymentEntry])]
  public query func getFeeRegisterByUser() : async [(Text, [FeePaymentEntry])] {
    let allPayments = feeRegister.values()
      |> List.fromIter<FeePaymentEntry>(_)
      |> _.filter(func(p : FeePaymentEntry) : Bool { not p.isDeleted });

    let grouped = Map.empty<Text, List.List<FeePaymentEntry>>();
    allPayments.forEach(func(p : FeePaymentEntry) {
      let existing = switch (grouped.get(p.collectedBy)) {
        case (?lst) lst;
        case null {
          let newList = List.empty<FeePaymentEntry>();
          grouped.add(p.collectedBy, newList);
          newList
        };
      };
      existing.add(p)
    });

    grouped.entries()
      |> List.fromIter<(Text, List.List<FeePaymentEntry>)>(_)
      |> _.map<(Text, List.List<FeePaymentEntry>), (Text, [FeePaymentEntry])>(
           func((collector, lst)) { (collector, lst.toArray()) }
         )
      |> _.toArray()
  };

  /// Return fee register entries enriched with each student's previous balance
  /// (old balance + previous year due) for the given session.
  public query func getFeeRegisterWithBalance(sessionId : Text) : async [FeeRegisterBalanceEntry] {
    let all = feeRegister.values()
      |> List.fromIter<FeePaymentEntry>(_)
      |> _.filter(func(p : FeePaymentEntry) : Bool { not p.isDeleted });

    all.map<FeePaymentEntry, FeeRegisterBalanceEntry>(func(p) {
      let previousBalance : Float = switch (
        studentOldBalancesRef.values()
          |> List.fromIter<FeeExtrasTypes.StudentOldBalance>(_)
          |> _.find(func(b : FeeExtrasTypes.StudentOldBalance) : Bool {
              b.studentId == p.studentId and b.sessionId == sessionId
            })
      ) {
        case (?b) {
          let pyd = switch (b.previousYearDue) { case (?v) v; case null 0.0 };
          b.amount + pyd
        };
        case null 0.0;
      };
      {
        id              = p.id;
        studentId       = p.studentId;
        receiptNo       = p.receiptNo;
        paymentDate     = p.paymentDate;
        totalAmount     = p.totalAmount;
        collectedBy     = p.collectedBy;
        previousBalance;
      }
    }).toArray()
  };
};

