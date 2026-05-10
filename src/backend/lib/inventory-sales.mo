import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Types "./inventory-sales";

/// Domain logic for inventory daily-sales analytics.
module {

  /// Return all transactions for a specific date string.
  public func getByDate<T <: { date : Text }>(
    transactions : Map.Map<Text, T>,
    date         : Text,
  ) : [T] {
    Debug.todo()
  };

  /// Build a daily-sales summary list from all inventory transactions.
  public func buildDailySummary<T <: {
    date            : Text;
    transactionType : { #Purchase; #Sale; #Adjustment };
    quantity        : Int;
    totalAmount     : Nat;
  }>(
    transactions : Map.Map<Text, T>,
  ) : [Types.DailySalesSummary] {
    Debug.todo()
  };

}
