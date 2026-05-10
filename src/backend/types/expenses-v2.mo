import Debug "mo:core/Debug";

/// Typed records for the Expenses & Income module (v2 with Float amounts and color field).
module {

  /// An expense/income category head.
  /// type_ is "income" or "expense" (plain Text for Candid interop).
  public type ExpenseHead = {
    id        : Text;
    name      : Text;
    type_     : Text;    // "income" | "expense"
    color     : Text;    // CSS color string, e.g. "#4CAF50"
    createdAt : Text;
  };

  /// A single expense or income entry.
  public type ExpenseEntry = {
    id          : Text;
    headId      : Text;
    amount      : Float;
    date        : Text;
    description : Text;
    createdAt   : Text;
    createdBy   : Text;
  };

  /// Aggregated income vs expense statistics.
  public type ExpenseStats = {
    totalIncome  : Float;
    totalExpense : Float;
    balance      : Float;
  };

}
