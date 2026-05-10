import Map   "mo:core/Map";
import List  "mo:core/List";

module {
  /// Minimal projection of FeePayment needed by the register.
  public type FeePaymentRef = {
    id           : Text;
    studentId    : Text;
    receiptNo    : Text;
    paymentDate  : Text;
    totalAmount  : Nat;
    collectedBy  : Text;   // username of the collecting staff member
    isDeleted    : Bool;
  };

  public type PaymentStore = Map.Map<Text, FeePaymentRef>;

  /// Return all non-deleted payments recorded by a specific collector.
  public func getByCollector(
    store       : PaymentStore,
    collectorId : Text,
  ) : [FeePaymentRef] {
    store.values()
      |> List.fromIter<FeePaymentRef>(_)
      |> _.filter(func(p : FeePaymentRef) : Bool {
          p.collectedBy == collectorId and not p.isDeleted
        })
      |> _.toArray()
  };

  /// Return all non-deleted payments grouped by collector.
  /// Result: [(collectorId, [FeePaymentRef])]
  public func groupByCollector(store : PaymentStore) : [(Text, [FeePaymentRef])] {
    // First, collect all non-deleted payments
    let allPayments = store.values()
      |> List.fromIter<FeePaymentRef>(_)
      |> _.filter(func(p : FeePaymentRef) : Bool { not p.isDeleted });

    // Build a map from collectorId -> list of payments
    let grouped = Map.empty<Text, List.List<FeePaymentRef>>();
    allPayments.forEach(func(p : FeePaymentRef) {
      let existing = switch (grouped.get(p.collectedBy)) {
        case (?lst) lst;
        case null {
          let newList = List.empty<FeePaymentRef>();
          grouped.add(p.collectedBy, newList);
          newList
        };
      };
      existing.add(p)
    });

    // Convert to array of tuples
    grouped.entries()
      |> List.fromIter<(Text, List.List<FeePaymentRef>)>(_)
      |> _.map<(Text, List.List<FeePaymentRef>), (Text, [FeePaymentRef])>(
           func((collectorId, lst)) { (collectorId, lst.toArray()) }
         )
      |> _.toArray()
  };
};
