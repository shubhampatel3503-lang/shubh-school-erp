import Debug "mo:core/Debug";

/// Types for inventory daily-sales analytics.
module {

  /// Aggregated sales data for a single date.
  public type DailySalesSummary = {
    date        : Text;    // dd/mm/yyyy
    totalSales  : Nat;     // number of sale transactions on that date
    totalAmount : Float;   // sum of totalAmount for all sale transactions
    itemsSold   : Nat;     // sum of quantities sold (abs)
  };

}
