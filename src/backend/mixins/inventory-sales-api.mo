import Debug "mo:core/Debug";
import Map "mo:core/Map";
import ISTypes "../types/inventory-sales";

/// Public API mixin for inventory daily-sales queries.
mixin (
  invTransactions : Map.Map<Text, {
    id              : Text;
    itemId          : Text;
    transactionType : { #Purchase; #Sale; #Adjustment };
    quantity        : Int;
    unitPrice       : Nat;
    totalAmount     : Nat;
    date            : Text;
    remarks         : ?Text;
    createdBy       : Text;
    buyerAdmNo      : Text;
    buyerName       : Text;
    sellerName      : Text;
    receivedAmount  : Nat;
    balanceAmount   : Nat;
  }>,
) {

  /// Return all inventory transactions for a specific date.
  public query func getTransactionsByDate(
    date : Text,
  ) : async [{
    id              : Text;
    itemId          : Text;
    transactionType : { #Purchase; #Sale; #Adjustment };
    quantity        : Int;
    unitPrice       : Nat;
    totalAmount     : Nat;
    date            : Text;
    remarks         : ?Text;
    createdBy       : Text;
    buyerAdmNo      : Text;
    buyerName       : Text;
    sellerName      : Text;
    receivedAmount  : Nat;
    balanceAmount   : Nat;
  }] {
    Debug.todo()
  };

  /// Return a daily sales summary — one entry per date, aggregated across all sale transactions.
  public query func getDailySalesSummary() : async [ISTypes.DailySalesSummary] {
    Debug.todo()
  };

}
